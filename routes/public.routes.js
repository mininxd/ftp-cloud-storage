import express from 'express';
import path from 'path';
import fs from 'fs';
import { PassThrough } from 'stream';
import { getPublicModeConfig, getPublicModeClientConfig, findPublicUser, setPublicUserPassword, isFormatAllowed } from '../lib/config.js';
import { getConnectedClient, navigateToDir, getMimeType, invalidateStorageCache } from '../lib/ftp.js';
import { safeCompare, verifyPassword, sanitizeFtpPath } from '../lib/security.js';
import { upload, uploadCache } from '../lib/uploadCache.js';
import { checkAdminAuth, getPinnedItems } from '../lib/db.js';
import { copySingleFtpFile, copyFtpDirectoryRecursive, resetToRoot, handleUploadStatus } from './mutations.routes.js';

const router = express.Router();

// Helper: Authenticate public request with key/password if user has_key configured
export function authenticatePublicRequest(user, req) {
    if (!user || !user.has_key) return true;
    if (checkAdminAuth(req)) return true; // Server admin has direct access to all public spaces
    const incomingKey = req.headers['x-public-key'] || 
                        req.headers['x-pub-key'] || 
                        req.headers['x-password'] ||
                        req.headers['x-public-password'] ||
                        req.headers['x-master-key'] ||
                        req.body?.key || 
                        req.body?.password ||
                        req.body?.publicKey ||
                        req.query?.key ||
                        req.query?.password ||
                        req.query?.publicKey ||
                        req.query?.pub_key;
    if (!incomingKey) return false;
    return verifyPassword(String(incomingKey).trim(), user.key);
}

// Helper: Resolve target path on FTP strictly inside user's dir_name
export function resolvePublicFtpPath(user, subpath) {
    const cleanSub = sanitizeFtpPath(subpath || '/');
    const relSub = cleanSub.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!relSub) {
        return user.dir_name;
    }
    return path.posix.join(user.dir_name, relSub);
}

// Helper: Recursively calculate total size of files inside a directory
export async function calculateDirSizeRecursive(client, dirPath) {
    let total = 0;
    try {
        const cleanPath = sanitizeFtpPath(dirPath).replace(/^\/+/, '');
        const list = await client.list(cleanPath || undefined);
        for (const item of list) {
            if (item.name === '.' || item.name === '..') continue;
            if (item.type === 2 || item.isDirectory) {
                const subDirPath = cleanPath ? path.posix.join(cleanPath, item.name) : item.name;
                total += await calculateDirSizeRecursive(client, subDirPath);
            } else {
                total += (item.size || 0);
            }
        }
    } catch (e) {
        // Directory does not exist yet or is empty
    }
    return total;
}

export async function calculatePublicUserUsedBytes(client, user) {
    if (!user || !user.dir_name) return 0;
    try {
        await resetToRoot(client);
        const rootPublicDir = resolvePublicFtpPath(user, '/').replace(/^\/+/, '');
        const total = await calculateDirSizeRecursive(client, rootPublicDir);
        await resetToRoot(client);
        return total;
    } catch (e) {
        return 0;
    }
}

// 1. Get Public Mode Configuration (Sanitized for client)
router.get('/api/public/config', (req, res) => {
    res.json({
        success: true,
        ...getPublicModeClientConfig()
    });
});

// 1b. Get All Public Spaces / User Folders (Admin Only)
router.get('/api/public/users', async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ success: false, error: 'Unauthorized: Admin access required to list all public folders' });
    }

    const pm = getPublicModeConfig();
    if (!pm.enabled) {
        return res.status(403).json({ success: false, error: 'Public mode is disabled' });
    }

    const configuredUsers = pm.user_list.map(u => ({
        user_id: u.user_id,
        clean_id: u.clean_id,
        dir_name: u.dir_name,
        has_key: u.has_key
    }));

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, 'public');
        const list = await client.list();
        const ftpDirNames = list.filter(item => item.type === 2 || item.isDirectory).map(i => i.name.toLowerCase());

        const mergedMap = new Map();
        for (const u of configuredUsers) {
            mergedMap.set(u.clean_id, u);
        }

        for (const dir of ftpDirNames) {
            const cleanDir = dir.replace(/^0x/, '');
            if (!mergedMap.has(cleanDir)) {
                mergedMap.set(cleanDir, {
                    user_id: dir.startsWith('0x') ? dir : '0x' + cleanDir,
                    clean_id: cleanDir,
                    dir_name: path.posix.join('public', cleanDir),
                    has_key: false,
                    isDynamic: true
                });
            }
        }

        res.json({
            success: true,
            enabled: true,
            max_size: pm.max_size,
            users: Array.from(mergedMap.values())
        });
    } catch (err) {
        console.error('[API-PUBLIC-USERS-ERROR]:', err);
        res.json({
            success: true,
            enabled: true,
            max_size: pm.max_size,
            users: configuredUsers
        });
    } finally {
        if (client) client.close();
    }
});

// 2. Verify Key for Public User
router.post('/api/public/verify-key', (req, res) => {
    const { user_id, key } = req.body || {};
    const pm = getPublicModeConfig();
    if (!pm.enabled) {
        return res.status(403).json({ success: false, valid: false, error: 'Public mode is currently disabled' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, valid: false, error: 'Public user directory not found' });
    }

    if (!user.has_key) {
        return res.json({ success: true, valid: true, requiresKey: false });
    }

    const incomingKey = String(key || '').trim();
    if (!incomingKey) {
        return res.status(400).json({ success: false, valid: false, error: 'Key is required' });
    }

    const isValid = verifyPassword(incomingKey, user.key);
    if (isValid) {
        console.log(`[PUBLIC-AUTH] Key verified for public user: "${user.clean_id}"`);
        return res.json({ success: true, valid: true, requiresKey: true });
    } else {
        console.warn(`[PUBLIC-AUTH] Invalid key attempt for public user: "${user.clean_id}"`);
        return res.status(401).json({ success: false, valid: false, error: 'Incorrect key or password' });
    }
});

// 2b. Set / Update / Remove Password for Public Space
router.post('/api/public/set-password', (req, res) => {
    const { user_id, current_key, new_key } = req.body || {};
    const pm = getPublicModeConfig();
    if (!pm.enabled) {
        return res.status(403).json({ success: false, error: 'Public mode is disabled' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    // If already protected by a password, require current password or masterkey
    if (user.has_key) {
        const callerKey = current_key || req.headers['x-public-key'] || req.headers['x-master-key'];
        if (!callerKey || !verifyPassword(String(callerKey).trim(), user.key)) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }
    }

    const cleanNewKey = String(new_key || '').trim();
    const saved = setPublicUserPassword(user.user_id, cleanNewKey);
    if (saved) {
        console.log(`[PUBLIC-PASSWORD] Password updated for public user: "${user.clean_id}" (Protected: ${Boolean(cleanNewKey)})`);
        return res.json({
            success: true,
            message: cleanNewKey ? 'Password set successfully' : 'Password removed successfully',
            has_key: Boolean(cleanNewKey)
        });
    } else {
        return res.status(500).json({ success: false, error: 'Failed to update configuration' });
    }
});

// 3. List Public Directory Content
router.get(['/api/public/list', '/api/pub/list'], async (req, res) => {
    const userId = req.query?.user_id || req.query?.userId || req.query?.clean_id;
    const subpath = req.query?.path || req.query?.subpath || '/';

    const pm = getPublicModeConfig();
    if (!pm.enabled) {
        return res.status(403).json({ success: false, error: 'Public mode is disabled' });
    }

    const user = findPublicUser(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: `Public space for "${userId}" not found` });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, requiresKey: true, error: 'Access Key or Password required' });
    }

    const targetDir = resolvePublicFtpPath(user, subpath);
    let client = null;
    try {
        console.log(`[PUBLIC-LIST] Listing public dir "${targetDir}" for user "${user.clean_id}"`);
        client = await getConnectedClient();
        const usedBytes = await calculatePublicUserUsedBytes(client, user);
        await navigateToDir(client, targetDir);
        const list = await client.list();
        const maxSizeBytes = (pm.max_size || 100) * 1024 * 1024;
        const availableBytes = Math.max(0, maxSizeBytes - usedBytes);

        // Get pinned items for this public directory
        const normalizedTarget = path.posix.normalize('/' + targetDir.replace(/^\/+/, '').replace(/\/+$/, ''));
        const pinnedRows = getPinnedItems(normalizedTarget);
        const pinnedMap = new Map();
        for (const p of pinnedRows) {
            pinnedMap.set(p.name, p.badge_text || '');
        }

        const enrichedList = list.map(item => {
            const isPinned = pinnedMap.has(item.name);
            return {
                ...item,
                isPinned,
                badgeText: isPinned ? pinnedMap.get(item.name) : undefined
            };
        });

        res.json({
            success: true,
            user_id: user.user_id,
            clean_id: user.clean_id,
            dir_name: user.dir_name,
            subpath: subpath,
            max_size: pm.max_size,
            used_bytes: usedBytes,
            available_bytes: availableBytes,
            data: enrichedList,
            pinned: pinnedRows
        });
    } catch (err) {
        console.error(`[PUBLIC-LIST-ERROR] Failed for "${targetDir}":`, err.message || err);
        res.status(500).json({
            success: false,
            error: err.message || String(err)
        });
    } finally {
        if (client) client.close();
    }
});

// 4. Read Text File in Public Directory
router.get('/api/public/read-file', async (req, res) => {
    const userId = req.query?.user_id || req.query?.userId;
    const filePath = req.query?.path;

    if (!filePath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    const user = findPublicUser(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const fullPath = resolvePublicFtpPath(user, filePath);
    const dir = path.posix.dirname(fullPath);
    const fileName = path.posix.basename(fullPath);

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        const chunks = [];
        const passThrough = new PassThrough();
        passThrough.on('data', chunk => chunks.push(chunk));
        
        await client.downloadTo(passThrough, fileName);
        const buffer = Buffer.concat(chunks);
        const content = buffer.toString('utf-8');

        res.json({
            success: true,
            path: filePath,
            content: content
        });
    } catch (err) {
        console.error('[PUBLIC-READ-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
});

// 5. Download / Stream File in Public Directory (Supports Media & Raw streaming)
router.get(['/api/public/download', '/api/public/raw'], async (req, res) => {
    const userId = req.query?.user_id || req.query?.userId;
    const filePath = req.query?.path;
    const isDownload = req.path.includes('download') || req.query?.download === 'true';

    if (!filePath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    const user = findPublicUser(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const fullPath = resolvePublicFtpPath(user, filePath);
    const dir = path.posix.dirname(fullPath);
    const fileName = path.posix.basename(fullPath) || 'file';

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        if (isDownload) {
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        } else {
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
        }
        res.setHeader('Content-Type', getMimeType(fileName));

        const passThrough = new PassThrough();
        passThrough.pipe(res);
        await client.downloadTo(passThrough, fileName);
    } catch (err) {
        console.error('[PUBLIC-DOWNLOAD-ERROR]:', err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message || String(err) });
        }
    } finally {
        if (client) client.close();
    }
});

// 6. Upload File into Public Directory (Enforces max_size in MB)
router.post('/api/public/upload', upload.single('file'), async (req, res) => {
    const pm = getPublicModeConfig();
    if (!pm.enabled) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(403).json({ success: false, error: 'Public mode is disabled' });
    }

    const userId = req.body?.user_id || req.body?.userId;
    const subpath = req.body?.path || req.body?.subpath || '/';

    const user = findPublicUser(userId);
    if (!user) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Enforce max_size in MB
    const maxSizeBytes = (pm.max_size || 100) * 1024 * 1024;
    if (req.file.size > maxSizeBytes) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(400).json({
            success: false,
            error: `File size (${(req.file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed public limit of ${pm.max_size} MB`
        });
    }

    // Enforce allowed_format whitelist mode if configured
    if (!isFormatAllowed(req.file.originalname, req.file.mimetype, pm.allowed_format)) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        const ext = path.extname(req.file.originalname) || req.file.mimetype;
        return res.status(400).json({
            success: false,
            error: `File format "${ext}" is not allowed in public mode. Allowed formats: ${pm.allowed_format.join(', ')}`
        });
    }

    const targetDir = resolvePublicFtpPath(user, subpath);
    const fileName = path.posix.basename(req.file.originalname);
    const localFilePath = req.file.path;
    const uploadId = req.uploadId || req.body?.upload_id || `up_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    let client = null;
    try {
        console.log(`[PUBLIC-UPLOAD] Uploading "${fileName}" (${req.file.size} bytes) -> "${targetDir}" (uploadId: ${uploadId})`);
        client = await getConnectedClient();

        // Calculate existing size of the file being overwritten if present
        await navigateToDir(client, targetDir);
        let existingFileSize = 0;
        try {
            const currentDirList = await client.list();
            const existingFile = currentDirList.find(f => f.name.toLowerCase() === fileName.toLowerCase());
            if (existingFile && !(existingFile.type === 2 || existingFile.isDirectory)) {
                existingFileSize = existingFile.size || 0;
            }
        } catch (e) {}

        // Enforce cumulative total storage limit quota
        const currentTotalUsed = await calculatePublicUserUsedBytes(client, user);
        const netUsed = Math.max(0, currentTotalUsed - existingFileSize);
        const projectedUsage = netUsed + req.file.size;

        if (projectedUsage > maxSizeBytes) {
            uploadCache.delete(uploadId);
            if (fs.existsSync(localFilePath)) {
                try { fs.unlinkSync(localFilePath); } catch (e) {}
            }
            const usedMB = (netUsed / (1024 * 1024)).toFixed(2);
            const fileMB = (req.file.size / (1024 * 1024)).toFixed(2);
            const availMB = Math.max(0, (maxSizeBytes - netUsed) / (1024 * 1024)).toFixed(2);
            return res.status(400).json({
                success: false,
                retryable: false,
                error: `Storage limit exceeded: Public space has ${usedMB} MB used (${availMB} MB available). Uploading ${fileMB} MB exceeds the ${pm.max_size} MB quota.`
            });
        }

        uploadCache.set(uploadId, {
            uploadId,
            fileName,
            targetDir,
            localFilePath,
            size: req.file.size,
            ftpWrittenBytes: 0,
            createdAt: Date.now(),
            status: 'writing_to_ftp'
        });

        await navigateToDir(client, targetDir);

        try { await client.remove(fileName); } catch (e) {}

        client.trackProgress(info => {
            const r = uploadCache.get(uploadId);
            if (r) {
                r.ftpWrittenBytes = info.bytes;
            }
        });

        await client.uploadFrom(localFilePath, fileName);
        try { client.trackProgress(); } catch (e) {}
        try { await client.cd('/'); } catch (e) {}
        invalidateStorageCache();
        uploadCache.delete(uploadId);

        res.json({
            success: true,
            fileName: fileName,
            size: req.file.size,
            path: subpath,
            uploadId
        });
    } catch (err) {
        console.error('[PUBLIC-UPLOAD-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
        if (fs.existsSync(localFilePath)) {
            try { fs.unlinkSync(localFilePath); } catch (e) {}
        }
    }
});

// 7. Create Folder in Public Directory
router.post('/api/public/mkdir', async (req, res) => {
    const { user_id, path: subpath, folderName } = req.body || {};
    if (!folderName) {
        return res.status(400).json({ success: false, error: 'Folder name is required' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const cleanFolder = path.posix.basename(sanitizeFtpPath(folderName));
    const targetDir = resolvePublicFtpPath(user, subpath);
    const fullDirPath = path.posix.join(targetDir, cleanFolder);

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, fullDirPath);
        try { await client.cd('/'); } catch (e) {}
        invalidateStorageCache();
        res.json({ success: true, folderName: cleanFolder });
    } catch (err) {
        console.error('[PUBLIC-MKDIR-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
});

// 8. Delete File or Folder in Public Directory
router.post('/api/public/delete', async (req, res) => {
    const { user_id, path: subpath, itemName, isDir } = req.body || {};
    if (!itemName) {
        return res.status(400).json({ success: false, error: 'Item name is required' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const cleanName = path.posix.basename(sanitizeFtpPath(itemName));
    const targetDir = resolvePublicFtpPath(user, subpath);

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, targetDir);

        if (isDir) {
            await client.removeDir(cleanName);
        } else {
            await client.remove(cleanName);
        }
        invalidateStorageCache();
        res.json({ success: true, itemName: cleanName });
    } catch (err) {
        console.error('[PUBLIC-DELETE-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
});

// 9. Rename File or Folder in Public Directory
router.post('/api/public/rename', async (req, res) => {
    const { user_id, path: subpath, oldName, newName } = req.body || {};
    if (!oldName || !newName) {
        return res.status(400).json({ success: false, error: 'Old name and new name are required' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const cleanOld = path.posix.basename(sanitizeFtpPath(oldName));
    const cleanNew = path.posix.basename(sanitizeFtpPath(newName));
    const targetDir = resolvePublicFtpPath(user, subpath);

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, targetDir);

        await client.rename(cleanOld, cleanNew);
        invalidateStorageCache();
        res.json({ success: true, oldName: cleanOld, newName: cleanNew });
    } catch (err) {
        console.error('[PUBLIC-RENAME-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
});

// 10. Copy Files or Folders in Public Directory
router.post('/api/public/copy', async (req, res) => {
    const { user_id, path: targetSubpath, items } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const pm = getPublicModeConfig();
    const maxSizeBytes = (pm.max_size || 100) * 1024 * 1024;
    const normTargetDir = resolvePublicFtpPath(user, targetSubpath || '/');

    let client1 = null;
    let client2 = null;
    let copiedCount = 0;
    try {
        client1 = await getConnectedClient();
        client2 = await getConnectedClient();

        await resetToRoot(client1);
        await resetToRoot(client2);

        // Check storage quota before copying
        const currentTotalUsed = await calculatePublicUserUsedBytes(client1, user);
        let itemsTotalSize = 0;
        for (const item of items) {
            const srcItemPath = resolvePublicFtpPath(user, item.path || item.name);
            if (item.isDir) {
                itemsTotalSize += await calculateDirSizeRecursive(client1, srcItemPath);
            } else {
                itemsTotalSize += (item.size || 0);
            }
        }

        if (currentTotalUsed + itemsTotalSize > maxSizeBytes) {
            return res.status(400).json({
                success: false,
                error: `Storage limit exceeded: Copying would exceed maximum allowed public space limit of ${pm.max_size} MB`
            });
        }

        if (normTargetDir) {
            await client2.ensureDir(normTargetDir);
            await resetToRoot(client2);
        }

        for (const item of items) {
            const itemPath = resolvePublicFtpPath(user, item.path || item.name);
            const itemName = item.name || path.posix.basename(itemPath);
            const destRel = normTargetDir ? path.posix.join(normTargetDir, itemName) : itemName;

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
        res.json({ success: true, message: `Copied ${copiedCount} item(s)`, count: copiedCount });
    } catch (err) {
        console.error('[PUBLIC-COPY-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err), count: copiedCount });
    } finally {
        if (client1) client1.close();
        if (client2) client2.close();
    }
});

// 11. Move / Cut Files or Folders in Public Directory
router.post('/api/public/move', async (req, res) => {
    const { user_id, path: targetSubpath, items } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const user = findPublicUser(user_id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Public space not found' });
    }

    if (!authenticatePublicRequest(user, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required' });
    }

    const normTargetDir = resolvePublicFtpPath(user, targetSubpath || '/');

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
            const itemPath = resolvePublicFtpPath(user, item.path || item.name);
            const itemName = item.name || path.posix.basename(itemPath);
            const destRel = normTargetDir ? path.posix.join(normTargetDir, itemName) : itemName;

            if (itemPath !== destRel) {
                await resetToRoot(client);
                await client.rename(itemPath, destRel);
            }
            movedCount++;
        }

        invalidateStorageCache();
        res.json({ success: true, message: `Moved ${movedCount} item(s)`, count: movedCount });
    } catch (err) {
        console.error('[PUBLIC-MOVE-ERROR]:', err);
        res.status(500).json({ success: false, error: err.message || String(err), count: movedCount });
    } finally {
        if (client) client.close();
    }
});

router.get('/api/public/upload-status', handleUploadStatus);
router.get('/pub/upload-status', handleUploadStatus);

export default router;
