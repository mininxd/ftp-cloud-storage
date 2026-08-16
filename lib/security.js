import crypto from 'crypto';
import path from 'path';

/**
 * Constant-Time String Comparison
 * Prevents microsecond timing side-channel attacks when comparing credentials/keys.
 */
export function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) {
        // Run dummy comparison to maintain uniform execution time
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Hash Password using scrypt with random 16-byte salt
 * Format: scrypt$<salt>$<hash>
 */
export function hashPassword(plainText) {
    if (!plainText || typeof plainText !== 'string') return '';
    const clean = plainText.trim();
    if (!clean) return '';
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(clean, salt, 64).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

/**
 * Verify Plain Password against Stored Hash (or legacy plain text)
 */
export function verifyPassword(plainText, storedHashOrKey) {
    if (!storedHashOrKey) return false;
    const cleanInput = (plainText || '').trim();
    const cleanStored = String(storedHashOrKey).trim();
    if (!cleanInput) return false;

    if (cleanStored.startsWith('scrypt$')) {
        const parts = cleanStored.split('$');
        if (parts.length !== 3) return false;
        const salt = parts[1];
        const originalHash = parts[2];
        const computedHash = crypto.scryptSync(cleanInput, salt, 64).toString('hex');
        return safeCompare(computedHash, originalHash);
    }

    // Fallback for legacy plain text passwords
    return safeCompare(cleanInput, cleanStored);
}

/**
 * Strict Path Sanitization & Traversal Prevention
 * - Strips null bytes (\0) and control characters
 * - Normalizes posix path
 * - Ensures path cannot escape root / directory boundaries
 */
export function sanitizeFtpPath(inputPath, defaultPath = '/') {
    if (!inputPath || typeof inputPath !== 'string') return defaultPath;
    
    // 1. Strip null bytes and non-printable control characters
    const cleanStr = inputPath.replace(/[\x00-\x1F\x7F]/g, '').trim();
    if (!cleanStr) return defaultPath;

    // 2. Normalize posix path
    const normalized = path.posix.normalize(cleanStr);

    // 3. Prevent path traversal escapes
    if (normalized.startsWith('../') || normalized === '..' || normalized.includes('/../')) {
        return defaultPath;
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

/**
 * Sliding Window In-Memory Rate Limiter
 * Blocks automated credential stuffing & brute-force attempts.
 */
class RateLimiter {
    constructor() {
        this.attempts = new Map(); // key -> { count, resetTime }
        // Periodically cleanup expired records every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
    }

    isBlocked(key, maxAttempts = 5, windowMs = 60 * 1000) {
        const now = Date.now();
        const record = this.attempts.get(key);
        if (!record) return false;

        if (now > record.resetTime) {
            this.attempts.delete(key);
            return false;
        }

        return record.count >= maxAttempts;
    }

    recordFailure(key, windowMs = 60 * 1000) {
        const now = Date.now();
        const record = this.attempts.get(key);
        if (!record || now > record.resetTime) {
            this.attempts.set(key, { count: 1, resetTime: now + windowMs });
        } else {
            record.count += 1;
        }
    }

    reset(key) {
        this.attempts.delete(key);
    }

    getRemainingCooldownSecs(key) {
        const record = this.attempts.get(key);
        if (!record) return 0;
        const diff = Math.ceil((record.resetTime - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    }

    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.attempts.entries()) {
            if (now > record.resetTime) {
                this.attempts.delete(key);
            }
        }
    }
}

export const authRateLimiter = new RateLimiter();
