import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { ZipArchive } from 'archiver';
import { getConnectedClient } from '../lib/ftp.js';
import { zipJobs, scanFtpDirectory, acquireZipSlot, getZipQueuePosition, getZipQueueStats, cancelZipJob } from '../lib/zip.js';
import { findPublicUser } from '../lib/config.js';
import { authenticatePublicRequest, resolvePublicFtpPath } from './public.routes.js';

const router = express.Router();

// 1. Start Asynchronous ZIP Creation Job (Download to temp folder on server, zip, then cleanup)
export const handleCreateZipJob = async (req, res) => {
    let files = req.body?.files || req.query?.files;
    let targetDir = req.body?.path || req.query?.path || '/';

    if (typeof files === 'string') {
        try { files = JSON.parse(files); } catch(e) { files = [files]; }
    }

    if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ success: false, error: 'Files list is required' });
    }

    const userId = req.body?.user_id || req.query?.user_id || req.body?.userId || req.query?.userId;
    let relBaseDir = '';

    if (userId) {
        const user = findPublicUser(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Public space not found' });
        }
        if (!authenticatePublicRequest(user, req)) {
            return res.status(401).json({ success: false, error: 'Access Key or Password required' });
        }
        const fullPublicPath = resolvePublicFtpPath(user, targetDir);
        relBaseDir = fullPublicPath.replace(/^\/+/, '').replace(/\/+$/, '');
    } else {
        const normalizedDir = path.posix.normalize(targetDir);
        relBaseDir = normalizedDir.replace(/^\/+/, '').replace(/\/+$/, '');
    }

    const jobId = 'zip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const zipName = `mininxd_archive_${Date.now()}.zip`;

    const stats = getZipQueueStats();
    const isQueued = stats.active >= stats.limit;

    const job = {
        id: jobId,
        status: isQueued ? 'queued' : 'processing',
        total: files.length,
        current: 0,
        percentage: 0,
        currentFile: isQueued ? 'Waiting in line for zipping slot...' : 'Scanning folders...',
        createdAt: Date.now(),
        lastPolledAt: Date.now(),
        zipFilePath: null,
        zipName: zipName,
        downloadUrl: `/api/ftp/zip-job-download?jobId=${jobId}`,
        cancelled: false,
        error: null
    };

    zipJobs.set(jobId, job);
    res.json({ success: true, jobId, status: job.status, message: isQueued ? 'ZIP job queued (waiting for slot)' : 'ZIP generation started' });

    // Background asynchronous packing using temp directory
    (async () => {
        let client = null;
        let slot = null;
        const tempDir = path.join(os.tmpdir(), `mininxd_tmp_${jobId}`);
        const zipFilePath = path.join(os.tmpdir(), `mininxd_archive_${jobId}.zip`);

        try {
            slot = await acquireZipSlot(jobId);
            job.status = 'processing';
            job.currentFile = 'Scanning folders...';

            await fs.promises.mkdir(tempDir, { recursive: true });

            client = await getConnectedClient();
            const currentList = await client.list(relBaseDir || undefined);

            const allItemsToDownload = [];

            for (const itemInput of files) {
                const cleanName = path.posix.basename(itemInput);
                const matchedItem = currentList.find(i => i.name === cleanName);
                const isDir = matchedItem ? (matchedItem.type === 2 || matchedItem.isDirectory) : false;

                if (isDir) {
                    const folderRemoteDir = relBaseDir ? path.posix.join(relBaseDir, cleanName) : cleanName;
                    const folderItems = await scanFtpDirectory(client, folderRemoteDir, cleanName);
                    if (folderItems.length === 0) {
                        allItemsToDownload.push({ isEmptyFolder: true, archivePath: cleanName + '/' });
                    } else {
                        allItemsToDownload.push(...folderItems);
                    }
                } else {
                    const fileRemotePath = relBaseDir ? path.posix.join(relBaseDir, cleanName) : cleanName;
                    allItemsToDownload.push({
                        remotePath: fileRemotePath,
                        archivePath: cleanName
                    });
                }
            }

            job.total = allItemsToDownload.length || 1;
            let completedCount = 0;

            for (const item of allItemsToDownload) {
                if (job.cancelled || (Date.now() - (job.lastPolledAt || job.createdAt) > 5000)) {
                    job.cancelled = true;
                    throw new Error('Cancelled: Client disconnected or stopped polling');
                }

                const localFilePath = path.join(tempDir, item.archivePath);
                if (item.isEmptyFolder) {
                    await fs.promises.mkdir(localFilePath, { recursive: true });
                } else {
                    await fs.promises.mkdir(path.dirname(localFilePath), { recursive: true });
                    try {
                        await client.downloadTo(localFilePath, item.remotePath);
                    } catch (err) {
                        console.error(`[Download Temp File Error ${item.remotePath}]:`, err.message || err);
                    }
                }
                completedCount++;
                job.current = completedCount;
                job.currentFile = item.archivePath;
                job.percentage = Math.round((completedCount / (job.total * 1.25)) * 100);
            }

            if (job.cancelled || (Date.now() - (job.lastPolledAt || job.createdAt) > 5000)) {
                job.cancelled = true;
                throw new Error('Cancelled: Client disconnected or stopped polling');
            }

            // High-speed compression (level 1 fast deflate)
            job.currentFile = 'Packing zip archive...';
            job.percentage = 85;

            const outputStream = fs.createWriteStream(zipFilePath);
            const archive = new ZipArchive({ zlib: { level: 1, chunkSize: 128 * 1024 } });
            archive.pipe(outputStream);
            archive.directory(tempDir, false);

            await archive.finalize();
            await new Promise((resolve, reject) => {
                outputStream.on('finish', resolve);
                outputStream.on('error', reject);
            });

            // Clean up uncompressed temp files
            await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});

            job.zipFilePath = zipFilePath;
            job.status = 'done';
            job.percentage = 100;

            // Auto-cleanup from disk after 5 minutes if client never downloads
            setTimeout(async () => {
                if (job.zipFilePath && fs.existsSync(job.zipFilePath)) {
                    await fs.promises.rm(job.zipFilePath, { force: true }).catch(() => {});
                }
                zipJobs.delete(jobId);
            }, 5 * 60 * 1000);
        } catch (err) {
            console.error("[FTP Async ZIP Error]:", err);
            job.status = 'error';
            job.error = err.message || String(err);
            await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        } finally {
            if (client) client.close();
            if (slot && typeof slot.release === 'function') slot.release();
        }
    })();
};

// 2. Check ZIP Job Status (Polling endpoint)
export const handleZipJobStatus = (req, res) => {
    const jobId = req.query?.jobId || req.body?.jobId;
    if (!jobId || !zipJobs.has(jobId)) {
        return res.status(404).json({ success: false, error: 'ZIP job not found' });
    }

    const job = zipJobs.get(jobId);
    job.lastPolledAt = Date.now();
    const queuePosition = job.status === 'queued' ? getZipQueuePosition(jobId) : 0;

    res.json({
        success: true,
        jobId: job.id,
        status: job.status,
        queuePosition,
        current: job.current,
        total: job.total,
        percentage: job.percentage,
        currentFile: job.status === 'queued' && queuePosition > 0 
            ? `Waiting in queue (${queuePosition} in line)...` 
            : job.currentFile,
        downloadUrl: job.status === 'done' ? job.downloadUrl : null,
        zipName: job.zipName,
        error: job.error
    });
};

// 3. Download Generated ZIP File & auto-cleanup immediately upon transfer
export const handleZipJobDownload = (req, res) => {
    const jobId = req.query?.jobId || req.body?.jobId;
    if (!jobId || !zipJobs.has(jobId)) {
        return res.status(404).send('ZIP job not found or expired');
    }

    const job = zipJobs.get(jobId);
    if (job.status !== 'done' || !job.zipFilePath || !fs.existsSync(job.zipFilePath)) {
        return res.status(400).send('ZIP file is still generating or errored');
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${job.zipName}"`);

    const readStream = fs.createReadStream(job.zipFilePath);
    readStream.pipe(res);

    let cleaned = false;
    const cleanupTempZip = async () => {
        if (cleaned) return;
        cleaned = true;
        try {
            if (job.zipFilePath && fs.existsSync(job.zipFilePath)) {
                await fs.promises.rm(job.zipFilePath, { force: true });
            }
        } catch (e) {
            console.error(`[Cleanup Error for ${job.zipFilePath}]:`, e);
        }
        zipJobs.delete(jobId);
    };

    // Delete as soon as the response finishes or the connection closes
    res.on('finish', cleanupTempZip);
    res.on('close', cleanupTempZip);
    readStream.on('close', cleanupTempZip);
    readStream.on('error', (err) => {
        console.error('[Zip Stream Error]:', err);
        cleanupTempZip();
    });
};

// 4. Direct Synchronous ZIP Archive Download using temp folder
export const handleDownloadZip = async (req, res) => {
    let files = req.body?.files || req.query?.files;
    let targetDir = req.body?.path || req.query?.path || '/';

    if (typeof files === 'string') {
        try { files = JSON.parse(files); } catch(e) { files = [files]; }
    }

    if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ success: false, error: 'Files list is required' });
    }

    const jobId = 'direct_' + Date.now();
    const normalizedDir = path.posix.normalize(targetDir);
    const relBaseDir = normalizedDir.replace(/^\/+/, '').replace(/\/+$/, '');
    const zipName = `mininxd_archive_${Date.now()}.zip`;
    const tempDir = path.join(os.tmpdir(), `mininxd_tmp_${jobId}`);

    let client = null;
    let slot = null;
    try {
        slot = await acquireZipSlot(jobId);
        await fs.promises.mkdir(tempDir, { recursive: true });
        client = await getConnectedClient();

        const currentList = await client.list(relBaseDir || undefined);
        const allItemsToDownload = [];

        for (const itemInput of files) {
            const cleanName = path.posix.basename(itemInput);
            const matchedItem = currentList.find(i => i.name === cleanName);
            const isDir = matchedItem ? (matchedItem.type === 2 || matchedItem.isDirectory) : false;

            if (isDir) {
                const folderRemoteDir = relBaseDir ? path.posix.join(relBaseDir, cleanName) : cleanName;
                const folderItems = await scanFtpDirectory(client, folderRemoteDir, cleanName);
                if (folderItems.length === 0) {
                    allItemsToDownload.push({ isEmptyFolder: true, archivePath: cleanName + '/' });
                } else {
                    allItemsToDownload.push(...folderItems);
                }
            } else {
                const fileRemotePath = relBaseDir ? path.posix.join(relBaseDir, cleanName) : cleanName;
                allItemsToDownload.push({
                    remotePath: fileRemotePath,
                    archivePath: cleanName
                });
            }
        }

        for (const item of allItemsToDownload) {
            const localFilePath = path.join(tempDir, item.archivePath);
            if (item.isEmptyFolder) {
                await fs.promises.mkdir(localFilePath, { recursive: true });
            } else {
                await fs.promises.mkdir(path.dirname(localFilePath), { recursive: true });
                try {
                    await client.downloadTo(localFilePath, item.remotePath);
                } catch (e) {
                    console.error(`[Download Direct Temp File Error ${item.remotePath}]:`, e);
                }
            }
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

        const archive = new ZipArchive({ zlib: { level: 6 } });
        archive.pipe(res);
        archive.directory(tempDir, false);
        await archive.finalize();
    } catch (err) {
        console.error("[FTP Direct ZIP Error]:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message || String(err) });
        }
    } finally {
        if (client) client.close();
        if (slot && typeof slot.release === 'function') slot.release();
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
};

// 5. Cancel ZIP Job
export const handleCancelZipJob = (req, res) => {
    const jobId = req.query?.jobId || req.body?.jobId;
    if (!jobId) {
        return res.status(400).json({ success: false, error: 'Job ID required' });
    }

    const cancelled = cancelZipJob(jobId);
    return res.json({ success: true, cancelled, message: 'ZIP job cancelled' });
};

router.post('/api/ftp/create-zip-job', handleCreateZipJob);
router.get('/api/ftp/create-zip-job', handleCreateZipJob);
router.get('/api/ftp/zip-job-status', handleZipJobStatus);
router.get('/api/ftp/zip-job-download', handleZipJobDownload);
router.post('/api/ftp/download-zip', handleDownloadZip);
router.get('/api/ftp/download-zip', handleDownloadZip);
router.post('/api/ftp/cancel-zip-job', handleCancelZipJob);
router.get('/api/ftp/cancel-zip-job', handleCancelZipJob);

export default router;
