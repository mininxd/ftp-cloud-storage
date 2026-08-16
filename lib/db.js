import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import { safeCompare, hashPassword } from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DB_PATH = path.join(ROOT_DIR, 'devices.db');
export const db = new DatabaseSync(DB_PATH);

// Initialize tables schema: devices { fingerprint, isAdmin, masterkey, createdAt }
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    fingerprint TEXT PRIMARY KEY,
    isAdmin INTEGER DEFAULT 0,
    masterkey TEXT DEFAULT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS public_users (
    fingerprint TEXT PRIMARY KEY,
    dir_name TEXT DEFAULT NULL,
    key TEXT DEFAULT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pinned_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_dir TEXT NOT NULL,
    badge_text TEXT DEFAULT '',
    pinned_by TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration safeguard for existing tables
try {
  db.exec('ALTER TABLE devices ADD COLUMN masterkey TEXT DEFAULT NULL;');
} catch (e) {}

// Public User Database Helpers
export function getDbPublicUsers() {
    try {
        const rows = db.prepare('SELECT fingerprint, dir_name, key, createdAt FROM public_users ORDER BY createdAt ASC').all();
        return rows.map(r => {
            const rawId = String(r.fingerprint || '').trim();
            const cleanId = rawId.toLowerCase().replace(/^0x/, '');
            return {
                user_id: rawId,
                clean_id: cleanId,
                dir_name: r.dir_name || path.posix.join('public', cleanId),
                key: r.key || '',
                has_key: Boolean(r.key)
            };
        });
    } catch (err) {
        console.error('[DB] getDbPublicUsers error:', err);
        return [];
    }
}

export function getDbPublicUser(userIdOrCleanId) {
    if (!userIdOrCleanId) return null;
    const raw = String(userIdOrCleanId).trim();
    const clean = raw.toLowerCase().replace(/^0x/, '');
    if (!clean) return null;
    try {
        const row = db.prepare('SELECT fingerprint, dir_name, key, createdAt FROM public_users WHERE LOWER(fingerprint) = ? OR LOWER(fingerprint) = ?').get(clean, '0x' + clean);
        if (row) {
            return {
                user_id: row.fingerprint,
                clean_id: clean,
                dir_name: row.dir_name || path.posix.join('public', clean),
                key: row.key || '',
                has_key: Boolean(row.key)
            };
        }
        return null;
    } catch (err) {
        console.error('[DB] getDbPublicUser error:', err);
        return null;
    }
}

export function setDbPublicUserPassword(userIdOrCleanId, newKey) {
    if (!userIdOrCleanId) return false;
    const raw = String(userIdOrCleanId).trim();
    const clean = raw.toLowerCase().replace(/^0x/, '');
    const cleanKey = String(newKey || '').trim();
    const storedHash = cleanKey ? hashPassword(cleanKey) : '';
    const fullId = raw.startsWith('0x') ? raw : '0x' + clean;
    const defaultDir = path.posix.join('public', clean);

    try {
        const stmt = db.prepare(`
            INSERT INTO public_users (fingerprint, dir_name, key)
            VALUES (?, ?, ?)
            ON CONFLICT(fingerprint) DO UPDATE SET key = excluded.key
        `);
        stmt.run(fullId, defaultDir, storedHash);
        return true;
    } catch (err) {
        console.error('[DB] setDbPublicUserPassword error:', err);
        return false;
    }
}

// Master Key Helper (checks device-specific masterkey in database)
export function getAdminMasterKey(fingerprint) {
    if (!fingerprint || typeof fingerprint !== 'string') return null;
    try {
        const stmt = db.prepare('SELECT masterkey, isAdmin FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const row = stmt.get(fingerprint.trim());
        if (row && row.isAdmin === 1 && row.masterkey) {
            return String(row.masterkey).trim();
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Helper: Check if request originates from an authorized admin device (with masterkey validation)
export function checkAdminAuth(req) {
    const rawFp = req.headers['x-device-fingerprint'] || 
                  req.headers['x-fingerprint'] || 
                  req.body?.fingerprint || 
                  req.query?.fingerprint || 
                  req.body?.userid || 
                  req.query?.userid;

    if (!rawFp || typeof rawFp !== 'string') {
        console.warn(`[AUTH] checkAdminAuth failed: No fingerprint provided on ${req.method} ${req.originalUrl || req.url}`);
        return false;
    }
    const cleanFp = rawFp.trim();

    try {
        const stmt = db.prepare('SELECT isAdmin, masterkey FROM devices WHERE LOWER(fingerprint) = LOWER(?)');
        const row = stmt.get(cleanFp);
        if (!row || row.isAdmin !== 1) {
            console.warn(`[AUTH] checkAdminAuth failed: Device "${cleanFp}" is NOT an admin (row: ${JSON.stringify(row || null)})`);
            return false;
        }

        // If this admin has a masterkey configured in DB, require incoming key to match in constant time
        const requiredKey = row.masterkey ? String(row.masterkey).trim() : '';
        if (requiredKey) {
            const rawIncomingKey = req.headers['x-master-key'] || 
                                 req.headers['x-masterkey'] ||
                                 req.body?.masterkey || 
                                 req.body?.masterKey || 
                                 req.query?.masterkey || 
                                 req.query?.masterKey || '';
            const cleanIncomingKey = typeof rawIncomingKey === 'string' ? rawIncomingKey.trim() : '';
            const matched = safeCompare(cleanIncomingKey, requiredKey);
            if (!matched) {
                console.warn(`[AUTH] checkAdminAuth failed: Master key mismatch for admin "${cleanFp}" (Key provided: ${Boolean(cleanIncomingKey)})`);
                return false;
            }
        }

        console.log(`[AUTH] checkAdminAuth success: Admin "${cleanFp}" authorized for ${req.method} ${req.originalUrl || req.url}`);
        return true;
    } catch (e) {
        console.error('[AUTH] checkAdminAuth error:', e);
        return false;
    }
}

// Pinned Items Database Helpers
export function getPinnedItems(parentDir = null) {
    try {
        if (parentDir !== null && parentDir !== undefined) {
            const normalizedParent = path.posix.normalize('/' + String(parentDir).replace(/^\/+/, '').replace(/\/+$/, ''));
            const stmt = db.prepare('SELECT path, name, parent_dir, badge_text, pinned_by, createdAt FROM pinned_items WHERE parent_dir = ? ORDER BY createdAt ASC');
            return stmt.all(normalizedParent);
        } else {
            const stmt = db.prepare('SELECT path, name, parent_dir, badge_text, pinned_by, createdAt FROM pinned_items ORDER BY createdAt ASC');
            return stmt.all();
        }
    } catch (e) {
        console.error('[DB] getPinnedItems error:', e);
        return [];
    }
}

export function setPinnedItem(itemPath, badgeText = '', pinnedBy = '') {
    try {
        const raw = String(itemPath || '').trim();
        if (!raw) return { success: false, error: 'Path is required' };
        const normalizedPath = path.posix.normalize('/' + raw.replace(/^\/+/, '').replace(/\/+$/, ''));
        const name = path.posix.basename(normalizedPath);
        const parentDir = path.posix.dirname(normalizedPath) || '/';
        const cleanBadge = String(badgeText || '').trim();

        const stmt = db.prepare(`
            INSERT INTO pinned_items (path, name, parent_dir, badge_text, pinned_by)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(path) DO UPDATE SET
                name = excluded.name,
                parent_dir = excluded.parent_dir,
                badge_text = excluded.badge_text,
                pinned_by = excluded.pinned_by
        `);
        stmt.run(normalizedPath, name, parentDir, cleanBadge, pinnedBy);
        return { success: true, path: normalizedPath, name, parentDir, badge_text: cleanBadge };
    } catch (e) {
        console.error('[DB] setPinnedItem error:', e);
        return { success: false, error: e.message };
    }
}

export function removePinnedItem(itemPath) {
    try {
        const raw = String(itemPath || '').trim();
        if (!raw) return { success: false, error: 'Path is required' };
        const normalizedPath = path.posix.normalize('/' + raw.replace(/^\/+/, '').replace(/\/+$/, ''));
        const stmt = db.prepare('DELETE FROM pinned_items WHERE path = ?');
        stmt.run(normalizedPath);
        return { success: true, path: normalizedPath };
    } catch (e) {
        console.error('[DB] removePinnedItem error:', e);
        return { success: false, error: e.message };
    }
}

