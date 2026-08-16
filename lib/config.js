import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load Config from config.json
export function loadConfig() {
    const configPath = path.join(rootDir, 'config.json');
    const defaults = {
        ftp_server: "127.0.0.1",
        ftp_port: 21,
        ftp_name: "FTP Server",
        ftp_user: "username",
        ftp_password: "password",
        storage_in_GB: 32,
        advanced_options: {
            simulatenous_zip_process: 0,
            admin_counts: 1,
            system_info: "auto"
        },
        public_mode: {
            enabled: false,
            max_size: 100,
            public_folder_name: "public",
            allowed_format: []
        }
    };
    try {
        if (fs.existsSync(configPath)) {
            const fileData = fs.readFileSync(configPath, 'utf8');
            const parsed = JSON.parse(fileData);
            return {
                ...defaults,
                ...parsed,
                advanced_options: {
                    ...defaults.advanced_options,
                    ...(parsed.advanced_options || {})
                },
                public_mode: {
                    ...defaults.public_mode,
                    ...(parsed.public_mode || {})
                }
            };
        }
    } catch (err) {
        console.error('[Config Load Error]:', err.message);
    }
    return defaults;
}

export const serverConfig = loadConfig();

import { getDbPublicUsers, getDbPublicUser, setDbPublicUserPassword } from './db.js';
import { getMimeType } from './ftp.js';

export function getPublicModeConfig() {
    const cfg = loadConfig();
    const pm = cfg.public_mode || {};
    const enabled = Boolean(pm.enabled);
    const maxSize = typeof pm.max_size === 'number' ? pm.max_size : (parseFloat(pm.max_size) || 100);
    const publicFolderName = (typeof pm.public_folder_name === 'string' && pm.public_folder_name.trim()) ? pm.public_folder_name.trim() : 'public';
    const allowedFormat = Array.isArray(pm.allowed_format) ? pm.allowed_format.map(f => String(f).trim()).filter(Boolean) : [];
    const user_list = getDbPublicUsers();

    return {
        enabled,
        max_size: maxSize,
        public_folder_name: publicFolderName,
        allowed_format: allowedFormat,
        user_list
    };
}

export function getPublicModeClientConfig() {
    const pm = getPublicModeConfig();
    return {
        enabled: pm.enabled,
        max_size: pm.max_size,
        public_folder_name: pm.public_folder_name || 'public',
        allowed_format: pm.allowed_format,
        user_list: pm.user_list.map(u => ({
            user_id: u.user_id,
            clean_id: u.clean_id,
            dir_name: u.dir_name,
            has_key: u.has_key
        }))
    };
}

export function isFormatAllowed(filename, mimetype, allowedFormats) {
    if (!Array.isArray(allowedFormats) || allowedFormats.length === 0) {
        return true; // No whitelist configured, all formats allowed
    }

    const cleanFilename = String(filename || '').trim();
    const rawExt = path.extname(cleanFilename).toLowerCase().replace(/^\./, '');
    const detectedMime = (mimetype || getMimeType(cleanFilename) || '').toLowerCase().trim();

    for (const rule of allowedFormats) {
        if (!rule || typeof rule !== 'string') continue;
        const cleanRule = rule.trim().toLowerCase();
        if (!cleanRule) continue;

        // 1. Wildcard MIME type match (e.g. "image/*", "video/*", "audio/*", "text/*")
        if (cleanRule.endsWith('/*')) {
            const prefix = cleanRule.slice(0, -1);
            if (detectedMime.startsWith(prefix)) {
                return true;
            }
            continue;
        }

        // 2. Exact MIME type match (e.g. "application/zip", "image/png")
        if (cleanRule.includes('/')) {
            if (detectedMime === cleanRule) {
                return true;
            }
            continue;
        }

        // 3. File extension match (e.g. "zip", ".zip", "png", "jpg", "jpeg")
        const extRule = cleanRule.replace(/^\./, '');
        if (rawExt && rawExt === extRule) {
            return true;
        }
        // Alias jpg <-> jpeg
        if (rawExt && ((extRule === 'jpg' && rawExt === 'jpeg') || (extRule === 'jpeg' && rawExt === 'jpg'))) {
            return true;
        }
    }

    return false;
}

export function findPublicUser(userIdOrCleanId) {
    if (!userIdOrCleanId) return null;
    const raw = String(userIdOrCleanId).trim();
    const clean = raw.toLowerCase().replace(/^0x/, '');
    if (!clean) return null;
    const pm = getPublicModeConfig();
    if (!pm.enabled) return null;

    const existing = getDbPublicUser(clean);
    if (existing) return existing;

    // Dynamic user folder created/mapped by user_id fingerprint
    const fullId = raw.startsWith('0x') ? raw : '0x' + clean;
    return {
        user_id: fullId,
        clean_id: clean,
        dir_name: path.posix.join('public', clean),
        key: '',
        has_key: false,
        isDynamic: true
    };
}

export function setPublicUserPassword(userIdOrCleanId, newKey) {
    return setDbPublicUserPassword(userIdOrCleanId, newKey);
}

export function getMasterKey() {
    const cfg = loadConfig();
    const adv = cfg.advanced_options || cfg.advanced || {};
    return (process.env.MASTER_KEY || process.env.MASTERKEY || adv.masterkey || adv.master_key || cfg.masterkey || cfg.master_key || '').trim();
}

export function getAdminCountsLimit() {
    const cfg = loadConfig();
    const adv = cfg.advanced_options || cfg.advanced || {};
    const rawVal = process.env.ADMIN_COUNTS !== undefined
        ? process.env.ADMIN_COUNTS
        : (adv.admin_counts !== undefined
            ? adv.admin_counts
            : (adv.admin_count !== undefined
                ? adv.admin_count
                : (cfg.admin_counts !== undefined
                    ? cfg.admin_counts
                    : 1)));

    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) return 1;
    return parsed;
}

export function getZipConcurrencyLimit() {
    const cfg = loadConfig();
    const adv = cfg.advanced_options || {};
    const rawVal = process.env.SIMULTANEOUS_ZIP_PROCESS !== undefined
        ? process.env.SIMULTANEOUS_ZIP_PROCESS
        : (adv.simulatenous_zip_process !== undefined 
            ? adv.simulatenous_zip_process 
            : (adv.simultaneous_zip_process !== undefined 
                ? adv.simultaneous_zip_process 
                : (cfg.simulatenous_zip_process !== undefined 
                    ? cfg.simulatenous_zip_process 
                    : (cfg.simultaneous_zip_process !== undefined ? cfg.simultaneous_zip_process : 0))));
    
    const parsed = parseInt(rawVal, 10);
    // 0 = Rate-limited (1 concurrent zip process at a time)
    if (isNaN(parsed) || parsed === 0) return 1;
    // < 0 = Unlimited
    if (parsed < 0) return Infinity;
    // > 0 = Exactly N concurrent processes
    return parsed;
}

export function detectSystemEnvironment() {
    // 1. Check for Android Termux Environment
    if (
        process.env.TERMUX_VERSION ||
        process.env.TERMUX_MAIN_PACKAGE_FORMAT ||
        (process.env.PREFIX && process.env.PREFIX.includes('com.termux')) ||
        fs.existsSync('/data/data/com.termux') ||
        (process.platform === 'android')
    ) {
        return 'termux';
    }

    // 2. Check Linux OS Distribution from /etc/os-release
    try {
        if (fs.existsSync('/etc/os-release')) {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
            const idMatch = osRelease.match(/^ID=(.+)$/m);
            const idLikeMatch = osRelease.match(/^ID_LIKE=(.+)$/m);
            const id = (idMatch ? idMatch[1].replace(/["']/g, '') : '').toLowerCase();
            const idLike = (idLikeMatch ? idLikeMatch[1].replace(/["']/g, '') : '').toLowerCase();

            if (id.includes('ubuntu') || idLike.includes('ubuntu')) return 'ubuntu';
            if (id.includes('debian') || idLike.includes('debian')) return 'debian';
            if (id.includes('alpine')) return 'alpine';
            if (id.includes('arch')) return 'arch';
            if (id.includes('raspbian') || id.includes('rpi')) return 'raspbian';
            if (id.includes('fedora') || id.includes('rhel') || id.includes('centos')) return 'fedora';
            if (id) return id;
        }
    } catch (e) {}

    // 3. Fallbacks based on Node process.platform
    if (process.platform === 'darwin') return 'macos';
    if (process.platform === 'win32') return 'windows';
    if (process.platform === 'linux') return 'ubuntu';

    return 'linux';
}

export function getRawSystemInfoConfig() {
    const cfg = loadConfig();
    const adv = cfg.advanced_options || cfg.advanced || {};
    return String(process.env.SYSTEM_INFO || adv.system_info || cfg.system_info || 'auto').toLowerCase().trim();
}

export function getSystemInfoMode() {
    const rawMode = getRawSystemInfoConfig();
    if (rawMode === 'auto' || !rawMode) {
        return detectSystemEnvironment();
    }
    return rawMode;
}

export const ftpConfig = {
    host: process.env.FTP_HOST || serverConfig.ftp_server || "192.168.100.1",
    user: process.env.FTP_USER || serverConfig.ftp_user || "minin",
    password: process.env.FTP_PASSWORD || serverConfig.ftp_password || "Minin123",
    port: parseInt(process.env.FTP_PORT || serverConfig.ftp_port, 10) || 21,
};

export const MAX_CAPACITY = process.env.MAX_CAPACITY 
    ? parseFloat(process.env.MAX_CAPACITY) 
    : (parseFloat(serverConfig.storage_in_GB) || 32);

export const APP_NAME = serverConfig.ftp_name || "Mininxd Storage";
export const PORT = process.env.PORT || 3690;
export const ROOT_DIR = rootDir;
