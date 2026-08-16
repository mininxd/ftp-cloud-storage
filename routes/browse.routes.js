import express from 'express';
import path from 'path';
import { PassThrough } from 'stream';
import { getConnectedClient, navigateToDir, getMimeType } from '../lib/ftp.js';
import { getPinnedItems, setPinnedItem, removePinnedItem, checkAdminAuth } from '../lib/db.js';
import { findPublicUser, getPublicModeConfig } from '../lib/config.js';
import { authenticatePublicRequest } from './public.routes.js';

const router = express.Router();

// Helper: Verify password access if target path resides inside a protected public space
export function checkPublicPathProtection(targetPath, req) {
    if (checkAdminAuth(req)) return true;
    const norm = path.posix.normalize(targetPath || '/').replace(/^\/+/, '');
    const pm = getPublicModeConfig();
    const publicFolderName = (pm.public_folder_name || 'public').trim().toLowerCase();
    const parts = norm.split('/');
    if (parts.length >= 2 && (parts[0].toLowerCase() === 'public' || parts[0].toLowerCase() === publicFolderName)) {
        const userId = parts[1];
        const user = findPublicUser(userId);
        if (user && user.has_key) {
            return authenticatePublicRequest(user, req);
        }
    }
    return true;
}

// 1. List Directory (High-performance single-pass FTP listing with Pinned items enrichment)
export const handleList = async (req, res) => {
    let targetPath = req.query?.path || req.body?.path || '/';
    const normalized = path.posix.normalize(targetPath);
    const relPath = normalized.replace(/^\/+/, '').replace(/\/+$/, '');

    if (!checkPublicPathProtection(targetPath, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required', requiresKey: true });
    }

    let client = null;
    try {
        console.log(`[FTP-LIST] Listing directory: "${targetPath}" (rel: "${relPath || '.'}")`);
        client = await getConnectedClient();
        const list = await client.list(relPath || undefined);
        console.log(`[FTP-LIST-DONE] Found ${list.length} item(s) in "${targetPath}"`);

        // Get pinned items for this directory
        const parentDir = normalized === '.' ? '/' : normalized;
        const pinnedRows = getPinnedItems(parentDir);
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
            path: targetPath,
            data: enrichedList,
            pinned: pinnedRows
        });
    } catch (err) {
        console.error(`[FTP-LIST-ERROR] Failed to list "${targetPath}":`, err.message || err);
        res.status(500).json({
            success: false,
            error: err.message || String(err),
            path: targetPath
        });
    } finally {
        if (client) client.close();
    }
};

router.get('/ftp/list', handleList);
router.get('/api/ftp/list', handleList);
router.post('/api/ftp/list', handleList);

// Pin Management APIs
router.get('/api/pins', (req, res) => {
    const parentDir = req.query?.dir !== undefined ? req.query.dir : null;
    const pins = getPinnedItems(parentDir);
    res.json({ success: true, pins });
});

router.post('/api/pins/set', (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ success: false, error: 'Admin permissions required to pin items' });
    }
    const { path: itemPath, badge_text } = req.body || {};
    if (!itemPath) {
        return res.status(400).json({ success: false, error: 'Item path is required' });
    }
    const adminFp = req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'] || req.body?.fingerprint || 'admin';
    const result = setPinnedItem(itemPath, badge_text, adminFp);
    res.json(result);
});

router.post('/api/pins/remove', (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ success: false, error: 'Admin permissions required to unpin items' });
    }
    const { path: itemPath } = req.body || {};
    if (!itemPath) {
        return res.status(400).json({ success: false, error: 'Item path is required' });
    }
    const result = removePinnedItem(itemPath);
    res.json(result);
});

// 2. Read Text File Content for Code Editor
export const handleReadFile = async (req, res) => {
    let targetPath = req.query?.path;
    if (!targetPath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    if (!checkPublicPathProtection(targetPath, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required', requiresKey: true });
    }

    const normalizedPath = path.posix.normalize(targetPath);
    const dir = path.posix.dirname(normalizedPath);
    const fileName = path.posix.basename(normalizedPath);

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
            path: targetPath,
            content: content
        });
    } catch (err) {
        console.error("[FTP Read File Error]:", err);
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

router.get('/api/ftp/read-file', handleReadFile);
router.get('/ftp/read-file', handleReadFile);

// 3. Download Single File (Attachment)
export const handleDownload = async (req, res) => {
    let targetPath = req.query?.path;
    if (!targetPath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    if (!checkPublicPathProtection(targetPath, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required', requiresKey: true });
    }

    const normalizedPath = path.posix.normalize(targetPath);
    const dir = path.posix.dirname(normalizedPath);
    const fileName = path.posix.basename(normalizedPath) || 'download';

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', getMimeType(fileName));

        const passThrough = new PassThrough();
        passThrough.pipe(res);
        await client.downloadTo(passThrough, fileName);
    } catch (err) {
        console.error("[FTP Download Error]:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message || String(err) });
        }
    } finally {
        if (client) client.close();
    }
};

router.get('/api/ftp/download', handleDownload);
router.get('/ftp/download', handleDownload);

// 4. View / Stream File Inline (For Images, PDFs, and Media Lightbox)
export const handleViewFile = async (req, res) => {
    let targetPath = req.query?.path;
    if (!targetPath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
    }

    if (!checkPublicPathProtection(targetPath, req)) {
        return res.status(401).json({ success: false, error: 'Access Key or Password required', requiresKey: true });
    }

    const normalizedPath = path.posix.normalize(targetPath);
    const dir = path.posix.dirname(normalizedPath);
    const fileName = path.posix.basename(normalizedPath) || 'file';
    const mimeType = getMimeType(fileName);

    let client = null;
    try {
        client = await getConnectedClient();
        await navigateToDir(client, dir);

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const passThrough = new PassThrough();
        passThrough.pipe(res);
        await client.downloadTo(passThrough, fileName);
    } catch (err) {
        console.error("[FTP View File Error]:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message || String(err) });
        }
    } finally {
        if (client) client.close();
    }
};

router.get('/api/ftp/view-file', handleViewFile);
router.get('/ftp/view-file', handleViewFile);

export default router;
