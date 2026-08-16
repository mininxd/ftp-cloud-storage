import express from 'express';
import { APP_NAME, ftpConfig, MAX_CAPACITY, getAdminCountsLimit, getPublicModeClientConfig } from '../lib/config.js';

const router = express.Router();

const handleGetConfig = (req, res) => {
    res.json({
        success: true,
        ftp_name: APP_NAME,
        ftp_server: ftpConfig.host,
        ftp_port: ftpConfig.port,
        storage_in_GB: MAX_CAPACITY,
        admin_counts: getAdminCountsLimit(),
        public_mode: getPublicModeClientConfig()
    });
};

router.get('/api/config', handleGetConfig);
router.get('/config', handleGetConfig);

export default router;
