import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Upload Cache Directory on Backend
export const UPLOAD_CACHE_DIR = path.join(os.tmpdir(), 'mininxd_upload_cache');
try {
    fs.mkdirSync(UPLOAD_CACHE_DIR, { recursive: true });
} catch (e) {}

const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_CACHE_DIR);
    },
    filename: (req, file, cb) => {
        const clientUploadId = req.headers['x-upload-id'] || req.query?.upload_id || req.query?.uploadId;
        const uniqueId = (typeof clientUploadId === 'string' && clientUploadId.trim()) ? clientUploadId.trim() : `up_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        req.uploadId = uniqueId;
        uploadCache.set(uniqueId, {
            uploadId: uniqueId,
            fileName: file.originalname,
            status: 'receiving',
            ftpWrittenBytes: 0,
            size: 0,
            createdAt: Date.now()
        });
        cb(null, `${uniqueId}_${path.posix.basename(file.originalname)}`);
    }
});

export const upload = multer({ storage: uploadStorage });

// In-memory registry of cached uploads for connection-loss retries
export const uploadCache = new Map(); // uploadId -> { uploadId, fileName, targetDir, localFilePath, size, createdAt, status }

// Clean up old cached uploads (older than 2 hours)
setInterval(() => {
    const now = Date.now();
    for (const [id, record] of uploadCache.entries()) {
        if (now - record.createdAt > 2 * 60 * 60 * 1000) {
            try {
                if (fs.existsSync(record.localFilePath)) fs.unlinkSync(record.localFilePath);
            } catch (e) {}
            uploadCache.delete(id);
        }
    }
}, 30 * 60 * 1000);
