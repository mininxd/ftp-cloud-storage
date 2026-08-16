import express from 'express';
import { ftpConfig } from '../lib/config.js';
import { 
    getConnectedClient, 
    calculateFtpStorage, 
    formatStorageUnits, 
    detectStorageCapacity,
    getCachedStorageStats,
    setCachedStorageStats,
    STORAGE_CACHE_TTL_MS
} from '../lib/ftp.js';

const router = express.Router();

// Get Storage Information (Detects exact storage & formats as X/YGB)
export const handleStorageInfo = async (req, res) => {
    const forceRefresh = req.query?.refresh === 'true';
    const now = Date.now();

    const customCapacityGb = req.query?.capacityGb ? parseFloat(req.query.capacityGb) : null;
    const detectedTotalBytes = customCapacityGb ? (customCapacityGb * 1024 * 1024 * 1024) : detectStorageCapacity();

    const { cachedStorageStats, lastStorageCalculationTime } = getCachedStorageStats();

    if (!forceRefresh && cachedStorageStats && (now - lastStorageCalculationTime < STORAGE_CACHE_TTL_MS)) {
        const usedBytes = cachedStorageStats.usedBytes;
        const totalBytes = cachedStorageStats.totalBytes || detectedTotalBytes;
        const freeBytes = Math.max(0, totalBytes - usedBytes);
        const percentage = totalBytes > 0 ? Math.min(100, parseFloat(((usedBytes / totalBytes) * 100).toFixed(2))) : 0;
        const freePercentage = Math.max(0, parseFloat((100 - percentage).toFixed(2)));
        
        const usedCompact = formatStorageUnits(usedBytes, 1).replace(/\s+/g, '');
        const totalCompact = formatStorageUnits(totalBytes, 0).replace(/\s+/g, '');
        const compactDisplay = `${usedCompact}/${totalCompact}`;

        return res.json({
            success: true,
            cached: true,
            usedBytes,
            totalBytes,
            freeBytes,
            usedFormatted: formatStorageUnits(usedBytes, 1),
            totalFormatted: formatStorageUnits(totalBytes, 0),
            freeFormatted: formatStorageUnits(freeBytes, 1),
            compactDisplay,
            percentage,
            freePercentage,
            fileCount: cachedStorageStats.fileCount,
            folderCount: cachedStorageStats.folderCount,
            gateway: `${ftpConfig.host}:${ftpConfig.port}`,
            timestamp: lastStorageCalculationTime
        });
    }

    let client = null;
    try {
        client = await getConnectedClient();
        const stats = await calculateFtpStorage(client, '');

        // Attempt to detect available storage capacity from FTP server (AVBL / SITE DSK)
        let ftpAvailableBytes = null;
        try {
            const avblRes = await client.send('AVBL');
            if (avblRes && (avblRes.code === 213 || avblRes.code === 200)) {
                const parsed = parseInt(avblRes.message.replace(/\D+/g, ''), 10);
                if (!isNaN(parsed) && parsed > 0) ftpAvailableBytes = parsed;
            }
        } catch (e) {}

        if (!ftpAvailableBytes) {
            try {
                const avblRes2 = await client.send('AVBL /');
                if (avblRes2 && (avblRes2.code === 213 || avblRes2.code === 200)) {
                    const parsed = parseInt(avblRes2.message.replace(/\D+/g, ''), 10);
                    if (!isNaN(parsed) && parsed > 0) ftpAvailableBytes = parsed;
                }
            } catch (e) {}
        }

        const usedBytes = stats.usedBytes;
        let totalBytes = detectedTotalBytes;

        if (ftpAvailableBytes !== null) {
            totalBytes = usedBytes + ftpAvailableBytes;
        }

        const freeBytes = Math.max(0, totalBytes - usedBytes);
        const percentage = totalBytes > 0 ? Math.min(100, parseFloat(((usedBytes / totalBytes) * 100).toFixed(2))) : 0;
        const freePercentage = Math.max(0, parseFloat((100 - percentage).toFixed(2)));
        
        const usedCompact = formatStorageUnits(usedBytes, 1).replace(/\s+/g, '');
        const totalCompact = formatStorageUnits(totalBytes, 0).replace(/\s+/g, '');
        const compactDisplay = `${usedCompact}/${totalCompact}`;

        setCachedStorageStats({
            ...stats,
            totalBytes
        });

        res.json({
            success: true,
            cached: false,
            usedBytes,
            totalBytes,
            freeBytes,
            usedFormatted: formatStorageUnits(usedBytes, 1),
            totalFormatted: formatStorageUnits(totalBytes, 0),
            freeFormatted: formatStorageUnits(freeBytes, 1),
            compactDisplay,
            percentage,
            freePercentage,
            fileCount: stats.fileCount,
            folderCount: stats.folderCount,
            gateway: `${ftpConfig.host}:${ftpConfig.port}`,
            timestamp: Date.now()
        });
    } catch (err) {
        console.error("[FTP Storage Info Error]:", err);
        if (cachedStorageStats) {
            const usedBytes = cachedStorageStats.usedBytes;
            const totalBytes = cachedStorageStats.totalBytes || detectedTotalBytes;
            const freeBytes = Math.max(0, totalBytes - usedBytes);
            const percentage = totalBytes > 0 ? Math.min(100, parseFloat(((usedBytes / totalBytes) * 100).toFixed(2))) : 0;
            
            const usedCompact = formatStorageUnits(usedBytes, 1).replace(/\s+/g, '');
            const totalCompact = formatStorageUnits(totalBytes, 0).replace(/\s+/g, '');
            const compactDisplay = `${usedCompact}/${totalCompact}`;

            return res.json({
                success: true,
                cached: true,
                stale: true,
                usedBytes,
                totalBytes,
                freeBytes,
                usedFormatted: formatStorageUnits(usedBytes, 1),
                totalFormatted: formatStorageUnits(totalBytes, 0),
                freeFormatted: formatStorageUnits(freeBytes, 1),
                compactDisplay,
                percentage,
                fileCount: cachedStorageStats.fileCount,
                folderCount: cachedStorageStats.folderCount
            });
        }
        res.status(500).json({ success: false, error: err.message || String(err) });
    } finally {
        if (client) client.close();
    }
};

router.get('/api/ftp/storage-info', handleStorageInfo);
router.get('/ftp/storage-info', handleStorageInfo);

export default router;
