import express from 'express';
import { db, getAdminMasterKey } from '../lib/db.js';
import { getAdminCountsLimit } from '../lib/config.js';
import { safeCompare, authRateLimiter } from '../lib/security.js';

const router = express.Router();

// ----------------------------------------------------
// /verify - SQLite Device Authentication & Authorization
// Function 1: Save user fingerprint into SQLite {fingerprint, isAdmin}
// Function 2: Check if user is verified / retrieve verification status
// ----------------------------------------------------
export const handleVerify = (req, res) => {
    const fingerprint = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'];

    if (!fingerprint || typeof fingerprint !== 'string') {
        return res.status(400).json({ success: false, error: 'Fingerprint is required' });
    }

    const cleanFp = fingerprint.trim();

    try {
        const queryStmt = db.prepare('SELECT fingerprint, isAdmin, masterkey, createdAt FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        let row = queryStmt.get(cleanFp);

        const adminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const adminCount = adminCountRow ? adminCountRow.count : 0;
        const hasAdmins = adminCount > 0;

        if (row) {
            const isAdmin = Boolean(row.isAdmin);

            // Normal / view-only user:
            if (!isAdmin) {
                console.log(`[AUTH-VERIFY] Device "${cleanFp}" verified as View-Only user (hasAdmins: ${hasAdmins})`);
                const resData = {
                    success: true,
                    fingerprint: row.fingerprint
                };
                if (!hasAdmins) {
                    resData.hasAdmins = false;
                    resData.adminCount = 0;
                }
                return res.json(resData);
            }

            // Admin user: include isAdmin: true and whether master key is required
            const requiresMasterKey = Boolean(row.masterkey && String(row.masterkey).trim());
            console.log(`[AUTH-VERIFY] Device "${cleanFp}" verified as Administrator (RequiresMK: ${requiresMasterKey})`);

            return res.json({
                success: true,
                fingerprint: row.fingerprint,
                isAdmin: true,
                requiresMasterKey: requiresMasterKey
            });
        }

        // New device registration (default: isAdmin = 0, masterkey = NULL)
        const insertStmt = db.prepare('INSERT INTO devices (fingerprint, isAdmin, masterkey, createdAt) VALUES (?, 0, NULL, ?)');
        insertStmt.run(cleanFp, new Date().toISOString());

        row = queryStmt.get(cleanFp);
        console.log(`[AUTH-VERIFY] Registered new device "${cleanFp}" as View-Only user`);

        const newResData = {
            success: true,
            fingerprint: row.fingerprint
        };
        if (!hasAdmins) {
            newResData.hasAdmins = false;
            newResData.adminCount = 0;
        }

        return res.json(newResData);
    } catch (err) {
        console.error('[AUTH-VERIFY-ERROR]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.post('/verify', handleVerify);
router.get('/verify', handleVerify);
router.post('/api/verify', handleVerify);
router.get('/api/verify', handleVerify);

// ----------------------------------------------------
// Master Key Verification Route (Per Admin)
// ----------------------------------------------------
export const handleVerifyMasterKey = (req, res) => {
    const fingerprint = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'];
    const incomingKey = req.body?.masterkey || req.body?.masterKey || req.query?.masterkey || req.headers['x-master-key'] || req.headers['x-masterkey'];

    if (!fingerprint || typeof fingerprint !== 'string') {
        return res.status(400).json({ success: false, valid: false, error: 'Device fingerprint is required' });
    }

    const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const rateLimitKey = `mk_${clientIp}_${fingerprint.trim()}`;

    // 1. Check Rate Limiter (Max 5 failed attempts per 60 seconds)
    if (authRateLimiter.isBlocked(rateLimitKey, 5, 60 * 1000)) {
        const cooldown = authRateLimiter.getRemainingCooldownSecs(rateLimitKey);
        return res.status(429).json({
            success: false,
            valid: false,
            error: `Too many failed attempts. Rate limited for ${cooldown} seconds.`
        });
    }

    try {
        const checkStmt = db.prepare('SELECT fingerprint, isAdmin, masterkey FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const row = checkStmt.get(fingerprint.trim());

        if (!row || row.isAdmin !== 1) {
            authRateLimiter.recordFailure(rateLimitKey);
            console.warn(`[AUTH-VERIFY-MK] Device "${fingerprint}" is not an admin`);
            return res.status(403).json({ success: false, valid: false, error: 'Device is not registered as an administrator' });
        }

        const requiredKey = row.masterkey ? String(row.masterkey).trim() : '';

        // If this admin has no masterkey configured in DB, pass
        if (!requiredKey) {
            authRateLimiter.reset(rateLimitKey);
            console.log(`[AUTH-VERIFY-MK] Admin "${fingerprint}" has no master key configured (pass)`);
            return res.json({ success: true, valid: true, message: 'No master key required for this admin' });
        }

        const cleanIncomingKey = typeof incomingKey === 'string' ? incomingKey.trim() : '';
        const isValid = safeCompare(cleanIncomingKey, requiredKey);

        if (!isValid) {
            authRateLimiter.recordFailure(rateLimitKey);
            console.warn(`[AUTH-VERIFY-MK] Invalid master key attempt for admin "${fingerprint}"`);
            return res.status(401).json({ success: false, valid: false, error: 'Invalid master key for this admin' });
        }

        // Verification successful: reset rate limiter
        authRateLimiter.reset(rateLimitKey);
        console.log(`[AUTH-VERIFY-MK] Master key verified successfully for admin "${fingerprint}"`);
        return res.json({ success: true, valid: true });
    } catch (err) {
        console.error('[AUTH-VERIFY-MK-ERROR]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.post('/verify_masterkey', handleVerifyMasterKey);
router.post('/api/verify_masterkey', handleVerifyMasterKey);

// ----------------------------------------------------
// User & Role Management Routes (Backend only)
// ----------------------------------------------------

// 1. List all users with [{ userid, roles }, ...] (Admin Only)
export const handleListUser = (req, res) => {
    try {
        const fingerprint = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'];

        // If admins exist in the database, verify that requester is an admin
        const adminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const hasAdmins = adminCountRow && adminCountRow.count > 0;

        if (hasAdmins) {
            if (!fingerprint || typeof fingerprint !== 'string') {
                return res.status(403).json({ success: false, error: 'Unauthorized: Admin authentication required' });
            }
            const checkStmt = db.prepare('SELECT isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
            const row = checkStmt.get(fingerprint.trim());
            if (!row || row.isAdmin !== 1) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required' });
            }
        }

        const stmt = db.prepare('SELECT fingerprint, isAdmin, createdAt FROM devices ORDER BY createdAt ASC');
        const rows = stmt.all();

        // Never expose masterkey in user list
        const userList = rows.map(row => ({
            userid: row.fingerprint,
            roles: row.isAdmin === 1 ? 'admin' : 'user',
            isAdmin: row.isAdmin === 1,
            createdAt: row.createdAt
        }));

        return res.json(userList);
    } catch (err) {
        console.error('[List User Error]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.get('/list_user', handleListUser);
router.post('/list_user', handleListUser);
router.get('/api/list_user', handleListUser);
router.post('/api/list_user', handleListUser);
router.get('/user_list', handleListUser);
router.post('/user_list', handleListUser);
router.get('/api/user_list', handleListUser);
router.post('/api/user_list', handleListUser);

// 2. Add / Promote Admin (isAdmin: 1, masterkey: ...)
export const handleAddAdmin = (req, res) => {
    const targetUserId = req.body?.userid || req.body?.userId || req.body?.targetUserId ||
                         req.query?.userid || req.query?.userId || req.query?.targetUserId ||
                         req.body?.targetFingerprint || req.query?.targetFingerprint ||
                         req.body?.fingerprint || req.query?.fingerprint ||
                         req.headers['x-device-fingerprint'];

    const masterKey = req.body?.masterkey || req.body?.masterKey || req.body?.master_key ||
                      req.query?.masterkey || req.query?.masterKey || req.headers['x-master-key'] || null;

    if (!targetUserId || typeof targetUserId !== 'string') {
        return res.status(400).json({ success: false, error: 'Target User ID (fingerprint) is required' });
    }

    const cleanTargetId = targetUserId.trim();
    const cleanMasterKey = masterKey && typeof masterKey === 'string' && masterKey.trim() ? masterKey.trim() : null;

    if (!cleanMasterKey) {
        return res.status(400).json({
            success: false,
            error: 'Master Key is required when configuring or promoting an administrator'
        });
    }

    try {
        const callerFp = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'];
        const initialAdminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const currentAdminCount = initialAdminCountRow ? initialAdminCountRow.count : 0;
        const hasAdmins = currentAdminCount > 0;

        // If admins exist, caller must be an authorized admin
        if (hasAdmins) {
            if (!callerFp) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Action not allowed' });
            }
            const caller = db.prepare('SELECT isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)').get(callerFp.trim());
            if (!caller || caller.isAdmin !== 1) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Action not allowed' });
            }
        }

        const checkStmt = db.prepare('SELECT fingerprint, isAdmin, masterkey FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const existing = checkStmt.get(cleanTargetId);

        // If target user is already an admin:
        if (existing && existing.isAdmin === 1) {
            // Update masterkey if provided
            if (cleanMasterKey) {
                db.prepare('UPDATE devices SET masterkey = ? WHERE fingerprint = ?').run(cleanMasterKey, existing.fingerprint);
            }
            const totalCountRow = db.prepare('SELECT COUNT(*) as count FROM devices').get();
            return res.json({
                success: true,
                message: `User ${cleanTargetId} is already an admin`,
                userid: cleanTargetId,
                roles: 'admin',
                isAdmin: true,
                adminCount: currentAdminCount,
                totalDevices: totalCountRow ? totalCountRow.count : 1
            });
        }

        // Target user is not yet an admin. Enforce configured admin_counts limit:
        const maxAdminCounts = getAdminCountsLimit();

        if (currentAdminCount >= maxAdminCounts) {
            return res.status(400).json({
                success: false,
                error: `Admin limit reached (${maxAdminCounts}). Cannot add more admins.`
            });
        }

        if (existing) {
            const updateStmt = db.prepare('UPDATE devices SET isAdmin = 1, masterkey = ? WHERE fingerprint = ?');
            updateStmt.run(cleanMasterKey, existing.fingerprint);
        } else {
            const insertStmt = db.prepare('INSERT INTO devices (fingerprint, isAdmin, masterkey, createdAt) VALUES (?, 1, ?, ?)');
            insertStmt.run(cleanTargetId, cleanMasterKey, new Date().toISOString());
        }

        const finalAdminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const totalCountRow = db.prepare('SELECT COUNT(*) as count FROM devices').get();
        const adminCount = finalAdminCountRow ? finalAdminCountRow.count : 0;
        const totalCount = totalCountRow ? totalCountRow.count : 0;

        return res.json({
            success: true,
            message: `User ${cleanTargetId} promoted to admin`,
            userid: cleanTargetId,
            roles: 'admin',
            isAdmin: true,
            adminCount,
            totalDevices: totalCount
        });
    } catch (err) {
        console.error('[Add Admin Error]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.post('/add_admin', handleAddAdmin);
router.get('/add_admin', handleAddAdmin);
router.post('/api/add_admin', handleAddAdmin);
router.get('/api/add_admin', handleAddAdmin);

// 3. Remove Admin Privileges (isAdmin: 0, masterkey: NULL)
export const handleRemoveAdmin = (req, res) => {
    const targetUserId = req.body?.userid || req.body?.userId || req.body?.targetUserId ||
                         req.query?.userid || req.query?.userId || req.query?.targetUserId ||
                         req.body?.targetFingerprint || req.query?.targetFingerprint ||
                         req.body?.fingerprint || req.query?.fingerprint ||
                         req.headers['x-device-fingerprint'];

    if (!targetUserId || typeof targetUserId !== 'string') {
        return res.status(400).json({ success: false, error: 'Target User ID (fingerprint) is required' });
    }

    const cleanTargetId = targetUserId.trim();

    try {
        const callerFp = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'];
        const initialAdminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const hasAdmins = initialAdminCountRow && initialAdminCountRow.count > 0;

        if (hasAdmins) {
            if (!callerFp) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Action not allowed' });
            }
            const caller = db.prepare('SELECT isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)').get(callerFp.trim());
            if (!caller || caller.isAdmin !== 1) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Action not allowed' });
            }
        }

        const checkStmt = db.prepare('SELECT fingerprint, isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const existing = checkStmt.get(cleanTargetId);

        if (existing) {
            // Demoting from admin: empty masterkey to NULL
            const updateStmt = db.prepare('UPDATE devices SET isAdmin = 0, masterkey = NULL WHERE fingerprint = ?');
            updateStmt.run(existing.fingerprint);
        } else {
            const insertStmt = db.prepare('INSERT INTO devices (fingerprint, isAdmin, masterkey, createdAt) VALUES (?, 0, NULL, ?)');
            insertStmt.run(cleanTargetId, new Date().toISOString());
        }

        const finalAdminCountRow = db.prepare('SELECT COUNT(*) as count FROM devices WHERE isAdmin = 1').get();
        const totalCountRow = db.prepare('SELECT COUNT(*) as count FROM devices').get();
        const adminCount = finalAdminCountRow ? finalAdminCountRow.count : 0;
        const totalCount = totalCountRow ? totalCountRow.count : 0;

        return res.json({
            success: true,
            message: `Admin privileges removed for user ${cleanTargetId}`,
            userid: cleanTargetId,
            roles: 'user',
            isAdmin: false,
            adminCount,
            totalDevices: totalCount
        });
    } catch (err) {
        console.error('[Remove Admin Error]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.post('/remove_admin', handleRemoveAdmin);
router.get('/remove_admin', handleRemoveAdmin);
router.post('/api/remove_admin', handleRemoveAdmin);
router.get('/api/remove_admin', handleRemoveAdmin);

// 4. Change / Update Master Key for an Admin
export const handleChangeMasterKey = (req, res) => {
    const callerFingerprint = req.body?.fingerprint || req.query?.fingerprint || req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'];
    const targetUserId = req.body?.userid || req.body?.userId || req.body?.targetUserId || callerFingerprint;
    const newMasterKey = req.body?.newMasterKey || req.body?.masterkey || req.body?.new_masterkey || req.query?.newMasterKey || req.query?.masterkey;

    if (!callerFingerprint || typeof callerFingerprint !== 'string') {
        return res.status(401).json({ success: false, error: 'Caller device authentication required' });
    }

    // Verify caller is an active admin
    const callerStmt = db.prepare('SELECT isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
    const caller = callerStmt.get(callerFingerprint.trim());
    if (!caller || caller.isAdmin !== 1) {
        return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required to update master key' });
    }

    if (!targetUserId || typeof targetUserId !== 'string') {
        return res.status(400).json({ success: false, error: 'Target admin user ID is required' });
    }

    const cleanTargetId = targetUserId.trim();
    const cleanNewKey = newMasterKey && typeof newMasterKey === 'string' ? newMasterKey.trim() : '';

    if (!cleanNewKey) {
        return res.status(400).json({ success: false, error: 'New Master Key cannot be empty' });
    }

    try {
        const checkStmt = db.prepare('SELECT fingerprint, isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const target = checkStmt.get(cleanTargetId);

        if (!target || target.isAdmin !== 1) {
            return res.status(404).json({ success: false, error: 'Target user is not registered as an admin' });
        }

        const updateStmt = db.prepare('UPDATE devices SET masterkey = ? WHERE fingerprint = ?');
        updateStmt.run(cleanNewKey, target.fingerprint);

        return res.json({
            success: true,
            message: `Master key updated successfully for admin ${cleanTargetId}`,
            userid: cleanTargetId
        });
    } catch (err) {
        console.error('[Change Master Key Error]:', err);
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
};

router.post('/change_masterkey', handleChangeMasterKey);
router.post('/api/change_masterkey', handleChangeMasterKey);
router.post('/update_masterkey', handleChangeMasterKey);
router.post('/api/update_masterkey', handleChangeMasterKey);

export default router;
