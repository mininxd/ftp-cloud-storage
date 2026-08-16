import express from 'express';
import path from 'path';
import fs from 'fs';
import { ROOT_DIR, ftpConfig } from '../lib/config.js';
import { getConnectedClient } from '../lib/ftp.js';
import { getSystemInfo } from '../lib/systemInfo.js';

const router = express.Router();

// Heartbeat & Connection Health Check Endpoint
export const handleHeartbeat = async (req, res) => {
    const t0 = Date.now();
    let client = null;
    try {
        client = await getConnectedClient(4000);
        const latencyMs = Date.now() - t0;
        res.json({
            success: true,
            status: 'connected',
            host: ftpConfig.host,
            port: ftpConfig.port,
            user: ftpConfig.user,
            latencyMs,
            timestamp: Date.now()
        });
    } catch (err) {
        console.error("[FTP Heartbeat Error]:", err.message || err);
        res.status(503).json({
            success: false,
            status: 'disconnected',
            host: ftpConfig.host,
            port: ftpConfig.port,
            error: err.message || String(err),
            timestamp: Date.now()
        });
    } finally {
        if (client) client.close();
    }
};

// Versions & Changelog Endpoint (Serves version.md)
export const handleGetVersions = (req, res) => {
    try {
        const versionPath = path.join(ROOT_DIR, 'version.md');
        if (!fs.existsSync(versionPath)) {
            return res.status(404).json({ success: false, error: 'version.md not found' });
        }
        const content = fs.readFileSync(versionPath, 'utf-8');

        // Check if raw text/markdown is requested
        if (req.query?.raw === 'true' || req.query?.format === 'text' || req.query?.format === 'markdown' || req.headers.accept?.includes('text/markdown')) {
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            return res.send(content);
        }

        return res.json({
            success: true,
            version: '1.8.0',
            content: content
        });
    } catch (err) {
        console.error("[FTP Versions Error]:", err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

// System Diagnostics & Health Endpoint
export const handleGetSystemInfo = (req, res) => {
    try {
        const info = getSystemInfo();
        return res.json(info);
    } catch (err) {
        console.error("[FTP System Info Error]:", err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.get('/api/ftp/heartbeat', handleHeartbeat);
router.get('/ftp/heartbeat', handleHeartbeat);
router.get('/api/health', handleHeartbeat);

router.get('/api/versions', handleGetVersions);
router.get('/versions', handleGetVersions);
router.get('/api/version', handleGetVersions);
router.get('/version', handleGetVersions);

router.get('/api/system_info', handleGetSystemInfo);
router.get('/system_info', handleGetSystemInfo);
router.get('/api/system-info', handleGetSystemInfo);
router.get('/system-info', handleGetSystemInfo);

export default router;
