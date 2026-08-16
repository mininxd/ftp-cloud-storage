import express from 'express';
import path from 'path';
import fs from 'fs';
import { Readable, PassThrough } from 'stream';
import { getConnectedClient, navigateToDir, invalidateStorageCache } from '../lib/ftp.js';
import { checkAdminAuth } from '../lib/db.js';
import { upload, uploadCache } from '../lib/uploadCache.js';
import { sanitizeFtpPath } from '../lib/security.js';

const router = express.Router();

// Helper: Always reset client to FTP root
export async function resetToRoot(client) {
    try {
        await client.cd('/');
    } catch (e) {
        // Fallback
    }
}

// Helper to stream copy a single file from FTP source to FTP dest
export async function copySingleFtpFile(client1, client2, sourceRel, destRel) {
    await resetToRoot(client1);
    await resetToRoot(client2);

    const destDir = path.posix.dirname(destRel);
    const destName = path.posix.basename(destRel);

    if (destDir && destDir !== '.') {
        await client2.ensureDir(destDir);
    }

    const pt = new PassThrough();
    const downloadPromise = client1.downloadTo(pt, sourceRel);
    const uploadPromise = client2.uploadFrom(pt, destName);
    await Promise.all([downloadPromise, uploadPromise]);

    await resetToRoot(client1);
    await resetToRoot(client2);
}

// Helper to recursively copy a folder on FTP
export async function copyFtpDirectoryRecursive(client1, client2, sourceDirRel, destDirRel) {
    await resetToRoot(client1);
    await resetToRoot(client2);

    const list = await client1.list(sourceDirRel || undefined);
    await client2.ensureDir(destDirRel);

    for (const item of list) {
        if (item.name === '.' || item.name === '..') continue;
        const srcItemPath = sourceDirRel ? path.posix.join(sourceDirRel, item.name) : item.name;
        const destItemPath = path.posix.join(destDirRel, item.name);

        if (item.type === 2 || item.isDirectory) {
            await copyFtpDirectoryRecursive(client1, client2, srcItemPath, destItemPath);
        } else {
            await copySingleFtpFile(client1, client2, srcItemPath, destItemPath);
        }
    }

    await resetToRoot(client1);
    await resetToRoot(client2);
}

// 1. Create / Upload File (Cached locally on backend to survive connection drops)
export const handleUpload = async (req, res) => {
    if (!checkAdminAuth(req)) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    let targetDir = req.body?.path || '/';
    const normalizedDir = sanitizeFtpPath(targetDir);

    if (req.file) {
        const uploadId = req.uploadId || `up_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const localFilePath = req.file.path;
        const fileName = path.posix.basename(req.file.originalname);
        console.log(`[MUTATION-UPLOAD] Staged file "${fileName}" (${req.file.size} bytes) -> Target dir: "${normalizedDir}" (uploadId: ${uploadId})`);

        uploadCache.set(uploadId, {
            uploadId,
            fileName,
            targetDir: normalizedDir,
            localFilePath,
            size: req.file.size,
            ftpWrittenBytes: 0,
            createdAt: Date.now(),
            status: 'writing_to_ftp'
        });

        const onClose = () => {
            if (!res.writableEnded) {
                const record = uploadCache.get(uploadId);
                if (record && (record.status === 'uploading' || record.status === 'writing_to_ftp')) {
                    record.status = 'failed';
                    console.warn(`[MUTATION-UPLOAD] Connection dropped during upload for "${fileName}" (uploadId: ${uploadId})`);
                }
            }
        };
        req.on('close', onClose);

        let client = null;
        try {
            client = await getConnectedClient();
            await resetToRoot(client);

            if (normalizedDir && normalizedDir !== '/') {
                await client.ensureDir(normalizedDir.replace(/^\/+/, ''));
            }

            try { await client.remove(fileName); } catch (e) {}

            client.trackProgress(info => {
                const r = uploadCache.get(uploadId);
                if (r) {
                    r.ftpWrittenBytes = info.bytes;
                }
            });

            await client.uploadFrom(localFilePath, fileName);
            try { client.trackProgress(); } catch (e) {}
            await resetToRoot(client);

            // Successfully uploaded to FTP! Remove local cache file
            uploadCache.delete(uploadId);
            try {
                if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
            } catch (e) {}

            invalidateStorageCache();
            console.log(`[MUTATION-UPLOAD-SUCCESS] Uploaded "${fileName}" to FTP at "${path.posix.join(normalizedDir, fileName)}"`);
            return res.json({
                success: true,
                message: `Uploaded ${fileName}`,
                path: path.posix.join(normalizedDir, fileName),
                uploadId
            });
        } catch (err) {
            console.error("[FTP Upload Error]:", err.message || err);
            const record = uploadCache.get(uploadId);
            if (record) record.status = 'failed';
            return res.status(500).json({
                success: false,
                error: err.message || String(err),
                uploadId,
                retryable: true,
                fileName,
                targetDir: normalizedDir
            });
        } finally {
            req.removeListener('close', onClose);
            if (client) client.close();
        }
    } else if (req.body?.filename) {
        const fileName = path.posix.basename(req.body.filename);
        const content = req.body.content || '';
        let client = null;
        try {
            client = await getConnectedClient();
            await resetToRoot(client);
            if (normalizedDir && normalizedDir !== '/') {
                await client.ensureDir(normalizedDir.replace(/^\/+/, ''));
            }
            const bufferStream = Readable.from(Buffer.from(content, 'utf-8'));
            try { await client.remove(fileName); } catch (e) {}
            await client.uploadFrom(bufferStream, fileName);
            await resetToRoot(client);
            invalidateStorageCache();
            return res.json({ success: true, message: `Created ${fileName}`, path: path.posix.join(normalizedDir, fileName) });
        } catch (err) {
            console.error("[FTP Create File Error]:", err);
            return res.status(500).json({ success: false, error: err.message || String(err) });
        } finally {
            if (client) client.close();
        }
    } else {
        return res.status(400).json({ success: false, error: 'No file or filename provided' });
    }
};

// 2. Retry Cached Upload from Backend
export const handleRetryUpload = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    const uploadId = req.body?.uploadId;
    if (!uploadId) {
        return res.status(400).json({ success: false, error: 'uploadId is required' });
    }

    const record = uploadCache.get(uploadId);
    if (!record || !record.localFilePath || !fs.existsSync(record.localFilePath)) {
        return res.status(404).json({ success: false, error: 'Cached upload file not found or expired' });
    }

        record.status = 'writing_to_ftp';
        record.ftpWrittenBytes = 0;
        let client = null;
        try {
            client = await getConnectedClient();
            await resetToRoot(client);

            const normalizedDir = record.targetDir;
            if (normalizedDir && normalizedDir !== '/') {
                await client.ensureDir(normalizedDir.replace(/^\/+/, ''));
            }

            try { await client.remove(record.fileName); } catch (e) {}

            client.trackProgress(info => {
                const r = uploadCache.get(uploadId);
                if (r) {
                    r.ftpWrittenBytes = info.bytes;
                }
            });

            await client.uploadFrom(record.localFilePath, record.fileName);
            try { client.trackProgress(); } catch (e) {}
            await resetToRoot(client);

            // Upload succeeded! Remove local cache file
            uploadCache.delete(uploadId);
        try {
            if (fs.existsSync(record.localFilePath)) fs.unlinkSync(record.localFilePath);
        } catch (e) {}

        invalidateStorageCache();
        return res.json({
            success: true,
            message: `Retried and uploaded ${record.fileName}`,
            path: path.posix.join(record.targetDir, record.fileName),
            uploadId
        });
    } catch (err) {
        console.error("[FTP Retry Upload Error]:", err.message || err);
        record.status = 'failed';
        return res.status(500).json({
            success: false,
            error: err.message || String(err),
            uploadId,
            retryable: true,
            fileName: record.fileName,
            targetDir: record.targetDir
        });
    } finally {
        if (client) client.close();
    }
};

// 3. Get All Pending Failed Uploads
export const handleGetPendingUploads = (req, res) => {
    const now = Date.now();
    for (const record of uploadCache.values()) {
        if (record.status === 'uploading' && (now - record.createdAt > 10000)) {
            record.status = 'failed';
        }
    }

    const list = Array.from(uploadCache.values()).filter(u => (u.status === 'failed' || u.status === 'uploading') && fs.existsSync(u.localFilePath));
    res.json({
        success: true,
        pending: list.map(item => ({
            uploadId: item.uploadId,
            fileName: item.fileName,
            targetDir: item.targetDir,
            size: item.size,
            createdAt: item.createdAt,
            status: item.status
        }))
    });
};

// 4. Direct Save File Handler (Used by Dracula Code Editor)
export const handleSaveFile = async (req, res) => {
    let filePath = req.body?.path;
    let content = req.body?.content ?? '';

    if (!filePath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    const normalizedPath = sanitizeFtpPath(filePath);
    const dir = path.posix.dirname(normalizedPath);
    const fileName = path.posix.basename(normalizedPath);

    let client = null;
    try {
        console.log(`[MUTATION-SAVE] Saving file "${normalizedPath}" (${content.length} chars)`);
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        try {
            await client.remove(fileName);
        } catch (e) {}

        const bufferStream = Readable.from(Buffer.from(content, 'utf-8'));
        await client.uploadFrom(bufferStream, fileName);
        invalidateStorageCache();
        console.log(`[MUTATION-SAVE-DONE] Saved "${normalizedPath}" successfully`);

        res.json({
            success: true,
            message: `Saved ${fileName}`,
            path: normalizedPath
        });
    } catch (err) {
        console.error(`[MUTATION-SAVE-ERROR] Failed to save "${normalizedPath}":`, err.message || err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

// 5. Create Directory (MKDIR)
export const handleMkdir = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    let targetDir = req.body?.path || '/';
    const dirname = req.body?.dirname || req.body?.name;

    if (!dirname) {
        return res.status(400).json({ success: false, error: 'Directory name is required' });
    }

    const normalizedDir = sanitizeFtpPath(targetDir);
    const cleanDirname = path.posix.basename(dirname).replace(/[\x00-\x1F\x7F]/g, '').trim();
    if (!cleanDirname || cleanDirname === '.' || cleanDirname === '..') {
        return res.status(400).json({ success: false, error: 'Invalid directory name' });
    }

    let client = null;
    try {
        console.log(`[MUTATION-MKDIR] Creating directory "${cleanDirname}" in "${normalizedDir}"`);
        client = await getConnectedClient();
        await navigateToDir(client, normalizedDir);
        
        try {
            await client.send(`MKD ${cleanDirname}`);
        } catch (e) {
            await client.ensureDir(cleanDirname);
        }
        invalidateStorageCache();
        console.log(`[MUTATION-MKDIR-DONE] Directory "${cleanDirname}" created`);
        res.json({ success: true, message: `Directory ${cleanDirname} created`, path: path.posix.join(normalizedDir, cleanDirname) });
    } catch (err) {
        console.error(`[MUTATION-MKDIR-ERROR] Failed to create "${cleanDirname}":`, err.message || err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

// 6. Rename File or Directory (Supports case-only changes like MiNiN -> minin)
export const handleRename = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    const oldPath = req.body?.oldPath;
    const newPath = req.body?.newPath;

    if (!oldPath || !newPath) {
        return res.status(400).json({ success: false, error: 'Both oldPath and newPath are required' });
    }

    const normOld = sanitizeFtpPath(oldPath).replace(/^\/+/, '');
    const normNew = sanitizeFtpPath(newPath).replace(/^\/+/, '');

    if (normOld === normNew) {
        return res.json({ success: true, message: `No change in filename`, oldPath, newPath });
    }

    let client = null;
    try {
        console.log(`[MUTATION-RENAME] Renaming "${normOld}" -> "${normNew}"`);
        client = await getConnectedClient();
        await resetToRoot(client);

        const isCaseOnlyChange = normOld.toLowerCase() === normNew.toLowerCase();
        if (isCaseOnlyChange) {
            // Case-only rename: use intermediate temporary name to avoid collision on case-insensitive filesystems / FTP
            const dir = path.posix.dirname(normOld);
            const tempName = `__tmp_ren_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const tempPath = dir === '.' ? tempName : path.posix.join(dir, tempName);

            try {
                await client.rename(normOld, tempPath);
                await client.rename(tempPath, normNew);
            } catch (tempErr) {
                // If two-step failed, try rollback
                try { await client.rename(tempPath, normOld); } catch (e) {}
                // Fallback attempt with direct rename
                try {
                    await client.rename(normOld, normNew);
                } catch (directErr) {
                    throw tempErr;
                }
            }
        } else {
            // Standard rename with fallback
            try {
                await client.rename(normOld, normNew);
            } catch (err) {
                // Fallback attempt via temporary name if server locks destination
                const dir = path.posix.dirname(normOld);
                const tempName = `__tmp_ren_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                const tempPath = dir === '.' ? tempName : path.posix.join(dir, tempName);
                try {
                    await client.rename(normOld, tempPath);
                    await client.rename(tempPath, normNew);
                } catch (fallbackErr) {
                    try { await client.rename(tempPath, normOld); } catch (e) {}
                    throw err;
                }
            }
        }

        invalidateStorageCache();
        console.log(`[MUTATION-RENAME-DONE] Renamed "${normOld}" to "${normNew}"`);
        res.json({ success: true, message: `Renamed to ${newPath}`, oldPath, newPath });
    } catch (err) {
        console.error(`[MUTATION-RENAME-ERROR] Failed to rename "${normOld}":`, err.message || err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

// 7. Copy Files or Directories
export const handleCopy = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    let items = req.body?.items;
    const targetDir = req.body?.targetDir || '/';

    if (!items && req.body?.sourcePath) {
        items = [{
            path: req.body.sourcePath,
            isDir: req.body.isDir === true,
            name: path.posix.basename(req.body.sourcePath)
        }];
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Items array and targetDir are required' });
    }

    const normTargetDir = path.posix.normalize(targetDir).replace(/^\/+/, '').replace(/\/+$/, '');

    let client1 = null;
    let client2 = null;
    let copiedCount = 0;
    try {
        client1 = await getConnectedClient();
        client2 = await getConnectedClient();

        await resetToRoot(client1);
        await resetToRoot(client2);

        if (normTargetDir) {
            await client2.ensureDir(normTargetDir);
            await resetToRoot(client2);
        }

        for (const item of items) {
            const itemPath = path.posix.normalize(item.path).replace(/^\/+/, '');
            const itemName = item.name || path.posix.basename(itemPath);
            const destRel = normTargetDir ? path.posix.join(normTargetDir, itemName) : itemName;

            // Suffix with _copy if copying into same location
            let finalDestRel = destRel;
            if (itemPath === destRel) {
                const ext = path.extname(itemName);
                const nameWithoutExt = path.basename(itemName, ext);
                const newName = item.isDir ? `${itemName}_copy` : `${nameWithoutExt}_copy${ext}`;
                finalDestRel = normTargetDir ? path.posix.join(normTargetDir, newName) : newName;
            }

            if (item.isDir) {
                await copyFtpDirectoryRecursive(client1, client2, itemPath, finalDestRel);
            } else {
                await copySingleFtpFile(client1, client2, itemPath, finalDestRel);
            }
            copiedCount++;
        }

        invalidateStorageCache();
        res.json({ success: true, message: `Copied ${copiedCount} item(s)`, count: copiedCount, targetDir });
    } catch (err) {
        console.error("[FTP Copy Error]:", err);
        res.status(500).json({ success: false, error: err.message || String(err), count: copiedCount });
    } finally {
        if (client1) client1.close();
        if (client2) client2.close();
    }
};

// 8. Move / Cut Files or Directories
export const handleMove = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    let items = req.body?.items;
    const targetDir = req.body?.targetDir || '/';

    if (!items && req.body?.sourcePath) {
        items = [{
            path: req.body.sourcePath,
            isDir: req.body.isDir === true,
            name: path.posix.basename(req.body.sourcePath)
        }];
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Items array and targetDir are required' });
    }

    const normTargetDir = path.posix.normalize(targetDir).replace(/^\/+/, '').replace(/\/+$/, '');

    let client = null;
    let movedCount = 0;
    try {
        client = await getConnectedClient();
        await resetToRoot(client);

        if (normTargetDir) {
            await client.ensureDir(normTargetDir);
            await resetToRoot(client);
        }

        for (const item of items) {
            const itemPath = path.posix.normalize(item.path).replace(/^\/+/, '');
            const itemName = item.name || path.posix.basename(itemPath);
            const destRel = normTargetDir ? path.posix.join(normTargetDir, itemName) : itemName;

            if (itemPath !== destRel) {
                await resetToRoot(client);
                await client.rename(itemPath, destRel);
            }
            movedCount++;
        }

        invalidateStorageCache();
        res.json({ success: true, message: `Moved ${movedCount} item(s)`, count: movedCount, targetDir });
    } catch (err) {
        console.error("[FTP Move Error]:", err);
        res.status(500).json({ success: false, error: err.message || String(err), count: movedCount });
    } finally {
        if (client) client.close();
    }
};

// 9. Delete File or Directory
export const handleDelete = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized: Action not allowed'
        });
    }

    const targetPath = req.query?.path || req.body?.path;
    const isDir = req.query?.isDir === 'true' || req.body?.isDir === true;

    if (!targetPath) {
        return res.status(400).json({ success: false, error: 'Path is required' });
    }

    const normalizedPath = sanitizeFtpPath(targetPath);
    if (normalizedPath === '/' || normalizedPath === '.') {
        return res.status(400).json({ success: false, error: 'Cannot delete root directory' });
    }
    const dir = path.posix.dirname(normalizedPath);
    const fileName = path.posix.basename(normalizedPath);

    let client = null;
    try {
        console.log(`[MUTATION-DELETE] Deleting ${isDir ? 'directory' : 'file'}: "${normalizedPath}"`);
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        if (isDir) {
            try {
                await client.send(`RMD ${fileName}`);
            } catch (e) {
                await client.removeDir(fileName);
            }
        } else {
            await client.remove(fileName);
        }
        invalidateStorageCache();
        console.log(`[MUTATION-DELETE-DONE] Deleted "${normalizedPath}"`);
        res.json({ success: true, message: `Deleted ${targetPath}`, path: targetPath });
    } catch (err) {
        console.error(`[MUTATION-DELETE-ERROR] Failed to delete "${normalizedPath}":`, err.message || err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

router.post('/api/ftp/upload', upload.single('file'), handleUpload);
router.post('/ftp/upload', upload.single('file'), handleUpload);
router.post('/api/ftp/create-file', handleUpload);
router.post('/api/ftp/save-file', handleSaveFile);
router.post('/ftp/save-file', handleSaveFile);
router.post('/api/ftp/mkdir', handleMkdir);
router.post('/ftp/mkdir', handleMkdir);
router.post('/api/ftp/rename', handleRename);
router.post('/ftp/rename', handleRename);
router.post('/api/ftp/copy', handleCopy);
router.post('/ftp/copy', handleCopy);
router.post('/api/ftp/move', handleMove);
router.post('/ftp/move', handleMove);
router.post('/api/ftp/cut', handleMove);
router.delete('/api/ftp/delete', handleDelete);
router.post('/api/ftp/delete', handleDelete);
router.delete('/ftp/delete', handleDelete);
router.post('/ftp/delete', handleDelete);
// Status / Progress for FTP Upload Stage
export const handleUploadStatus = (req, res) => {
    const uploadId = req.query?.uploadId || req.query?.upload_id;
    if (!uploadId) {
        return res.status(400).json({ success: false, error: 'uploadId is required' });
    }
    const record = uploadCache.get(uploadId);
    if (!record) {
        return res.json({
            success: true,
            status: 'writing_to_ftp',
            percentage: 0,
            ftpWrittenBytes: 0,
            totalBytes: 0
        });
    }
    const total = record.size || 0;
    const written = record.ftpWrittenBytes || 0;
    const percentage = total > 0 ? Math.min(99, Math.round((written / total) * 100)) : 0;
    return res.json({
        success: true,
        status: record.status || 'writing_to_ftp',
        ftpWrittenBytes: written,
        totalBytes: total,
        percentage
    });
};

router.post('/api/ftp/retry-upload', handleRetryUpload);
router.post('/ftp/retry-upload', handleRetryUpload);
router.get('/api/ftp/upload-status', handleUploadStatus);
router.get('/ftp/upload-status', handleUploadStatus);
router.get('/api/ftp/pending-uploads', handleGetPendingUploads);
router.get('/ftp/pending-uploads', handleGetPendingUploads);

export default router;
