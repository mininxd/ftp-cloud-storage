import path from 'path';
import fs from 'fs';
import os from 'os';
import { ZipArchive } from 'archiver';
import { getConnectedClient } from './ftp.js';
import { getZipConcurrencyLimit } from './config.js';

// In-memory store for background ZIP jobs
export const zipJobs = new Map();

// Concurrency Queue for ZIP Processes (Rate Limiter)
let activeZipProcesses = 0;
const zipWaitQueue = [];

export function getZipQueueStats() {
    return {
        active: activeZipProcesses,
        waiting: zipWaitQueue.length,
        limit: getZipConcurrencyLimit()
    };
}

export function getZipQueuePosition(jobId) {
    const idx = zipWaitQueue.findIndex(q => q.jobId === jobId);
    return idx >= 0 ? idx + 1 : 0;
}

/**
 * Acquire a zip process slot based on configured rate limit.
 * If slots are full, caller waits in queue until a slot is released.
 */
export function acquireZipSlot(jobId = null) {
    const limit = getZipConcurrencyLimit();

    if (activeZipProcesses < limit) {
        activeZipProcesses++;
        let released = false;
        return Promise.resolve({
            release: () => {
                if (released) return;
                released = true;
                releaseZipSlot();
            }
        });
    }

    return new Promise((resolve) => {
        let released = false;
        zipWaitQueue.push({
            jobId,
            resolve: () => {
                activeZipProcesses++;
                resolve({
                    release: () => {
                        if (released) return;
                        released = true;
                        releaseZipSlot();
                    }
                });
            }
        });
    });
}

export function releaseZipSlot() {
    activeZipProcesses = Math.max(0, activeZipProcesses - 1);
    const limit = getZipConcurrencyLimit();
    while (activeZipProcesses < limit && zipWaitQueue.length > 0) {
        const next = zipWaitQueue.shift();
        if (next && typeof next.resolve === 'function') {
            next.resolve();
        }
    }
}

export function cancelZipJob(jobId) {
    if (!jobId) return false;

    // Remove from waiting queue if not yet started
    const waitIdx = zipWaitQueue.findIndex(q => q.jobId === jobId);
    if (waitIdx >= 0) {
        zipWaitQueue.splice(waitIdx, 1);
    }

    if (zipJobs.has(jobId)) {
        const job = zipJobs.get(jobId);
        job.cancelled = true;
        job.status = 'cancelled';
        job.error = 'Cancelled by user';

        if (job.zipFilePath && fs.existsSync(job.zipFilePath)) {
            try { fs.unlinkSync(job.zipFilePath); } catch (e) {}
        }
        return true;
    }

    return false;
}

// Helper to clean old zip jobs (older than 15 mins)
const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, job] of zipJobs.entries()) {
        if (now - job.createdAt > 15 * 60 * 1000) {
            try {
                if (job.zipFilePath && fs.existsSync(job.zipFilePath)) {
                    fs.unlinkSync(job.zipFilePath);
                }
            } catch (e) {}
            zipJobs.delete(id);
        }
    }
}, 60 * 1000);

if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
}

// Heartbeat Watchdog: Auto-cancel abandoned zip jobs that haven't been polled in > 5 seconds
const watchdogTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, job] of zipJobs.entries()) {
        if ((job.status === 'processing' || job.status === 'queued') && (now - (job.lastPolledAt || job.createdAt) > 5000)) {
            cancelZipJob(id);
        }
    }
}, 1000);

if (watchdogTimer && typeof watchdogTimer.unref === 'function') {
    watchdogTimer.unref();
}

// Helper to recursively scan an FTP directory and collect all files with relative paths
export async function scanFtpDirectory(client, remoteDir, archivePrefix = '') {
    const files = [];
    const cleanRemoteDir = remoteDir ? remoteDir.replace(/^\/+/, '').replace(/\/+$/, '') : '';
    let list = [];
    try {
        list = await client.list(cleanRemoteDir || undefined);
    } catch (e) {
        console.error(`[Scan Error on ${cleanRemoteDir}]:`, e);
        return files;
    }

    for (const item of list) {
        if (item.name === '.' || item.name === '..') continue;
        const subArchivePath = archivePrefix ? path.posix.join(archivePrefix, item.name) : item.name;
        const subRemotePath = cleanRemoteDir ? path.posix.join(cleanRemoteDir, item.name) : item.name;

        if (item.type === 2 || item.isDirectory) {
            const nested = await scanFtpDirectory(client, subRemotePath, subArchivePath);
            if (nested.length === 0) {
                files.push({
                    isEmptyFolder: true,
                    archivePath: subArchivePath.endsWith('/') ? subArchivePath : subArchivePath + '/'
                });
            } else {
                files.push(...nested);
            }
        } else {
            files.push({
                remotePath: subRemotePath,
                archivePath: subArchivePath
            });
        }
    }
    return files;
}
