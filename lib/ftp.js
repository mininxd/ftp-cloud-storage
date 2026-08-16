import * as ftp from 'basic-ftp';
import path from 'path';
import { ftpConfig, MAX_CAPACITY } from './config.js';

// Cache for FTP storage calculation
let cachedStorageStats = null;
let lastStorageCalculationTime = 0;
export const STORAGE_CACHE_TTL_MS = 20 * 1000; // 20 seconds cache

export function invalidateStorageCache() {
    cachedStorageStats = null;
    lastStorageCalculationTime = 0;
}

export function getCachedStorageStats() {
    return { cachedStorageStats, lastStorageCalculationTime };
}

export function setCachedStorageStats(stats) {
    cachedStorageStats = stats;
    lastStorageCalculationTime = Date.now();
}

// Helper: Get an authenticated FTP client
export async function getConnectedClient() {
    const client = new ftp.Client();
    client.ftp.timeout = 15000;
    client.ftp.verbose = false;

    await client.connect(ftpConfig.host, ftpConfig.port);
    await client.login(ftpConfig.user, ftpConfig.password);
    
    try {
        await client.send("TYPE I");
    } catch (e) {
        // Ignore TYPE I if not supported
    }
    
    return client;
}

// Helper to navigate to relative directory from FTP root share
export async function navigateToDir(client, targetDir) {
    try {
        await client.cd('/');
    } catch (e) {}
    if (!targetDir || targetDir === '/' || targetDir === '.') return;
    const relDir = targetDir.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!relDir) return;

    try {
        await client.ensureDir(relDir);
    } catch (e1) {
        try {
            await client.cd('/' + relDir);
        } catch (e2) {
            try {
                await client.cd(relDir);
            } catch (e3) {
                // Step-by-step creation fallback
                const parts = relDir.split('/').filter(Boolean);
                try { await client.cd('/'); } catch (_) {}
                for (const p of parts) {
                    try {
                        await client.cd(p);
                    } catch (cdErr) {
                        try {
                            await client.send(`MKD ${p}`);
                        } catch (_) {}
                        await client.cd(p);
                    }
                }
            }
        }
    }
}

// Helper for MIME types
export function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.7z': 'application/x-7z-compressed',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.bmp': 'image/bmp',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.flac': 'audio/flac',
        '.m4a': 'audio/mp4',
        '.aac': 'audio/aac',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogv': 'video/ogg',
        '.mov': 'video/quicktime',
        '.mkv': 'video/x-matroska',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// Recursive helper to calculate total storage used on FTP
export async function calculateFtpStorage(client, remoteDir = '') {
    const cleanRemoteDir = remoteDir ? remoteDir.replace(/^\/+/, '').replace(/\/+$/, '') : '';
    let list = [];
    try {
        list = await client.list(cleanRemoteDir || undefined);
    } catch (e) {
        console.error(`[Storage Calc Error on ${cleanRemoteDir}]:`, e);
        return { usedBytes: 0, fileCount: 0, folderCount: 0 };
    }

    let usedBytes = 0;
    let fileCount = 0;
    let folderCount = 0;

    for (const item of list) {
        if (item.name === '.' || item.name === '..') continue;
        const subRemotePath = cleanRemoteDir ? path.posix.join(cleanRemoteDir, item.name) : item.name;

        if (item.type === 2 || item.isDirectory) {
            folderCount++;
            const subStats = await calculateFtpStorage(client, subRemotePath);
            usedBytes += subStats.usedBytes;
            fileCount += subStats.fileCount;
            folderCount += subStats.folderCount;
        } else {
            fileCount++;
            usedBytes += (item.size || 0);
        }
    }

    return { usedBytes, fileCount, folderCount };
}

export function formatStorageUnits(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${val} ${sizes[i]}`;
}

export function detectStorageCapacity() {
    return MAX_CAPACITY * 1024 * 1024 * 1024;
}
