// Centralized API Client
import { state } from './state.js';
import { isUserscriptEnvironment } from './security.js';

export async function apiFetch(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
    const isUntrusted = isUserscriptEnvironment();
    
    if (fp) {
        headers['x-device-fingerprint'] = fp;
        headers['x-fingerprint'] = fp;
    }
    if (!isUntrusted) {
        const mk = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || sessionStorage.getItem('mininxd_master_key');
        if (mk) {
            headers['x-master-key'] = mk;
            headers['x-masterkey'] = mk;
        }
    }

    if (state.currentPublicUser && state.currentPublicUser.clean_id) {
        const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id);
        if (pubKey) {
            headers['x-public-key'] = pubKey;
            headers['x-pub-key'] = pubKey;
        }
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}
