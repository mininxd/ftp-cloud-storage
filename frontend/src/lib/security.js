/**
 * Silent Security & Integrity Verifier
 * Detects presence of injected userscripts (Tampermonkey, Violentmonkey, Greasemonkey, script hookers).
 * If detected, silently forces View-Only mode without alerting or notifying the client.
 */

export function isUserscriptEnvironment() {
    try {
        // 1. Check for UserScript Engine specific globals & APIs
        if (typeof window.GM !== 'undefined' || typeof window.GM_info !== 'undefined') return true;
        if (typeof window.GM_setValue === 'function' || typeof window.GM_getValue === 'function') return true;
        if (typeof window.GM_xmlhttpRequest === 'function' || typeof window.GM_registerMenuCommand === 'function') return true;
        if (typeof window.GM_addStyle === 'function' || typeof window.GM_log === 'function') return true;

        // 2. Check for Tampermonkey / Violentmonkey runtime flags
        if (window.__tampermonkey_injected || window.__tampermonkey_api || window.__VIOLENTMONKEY_EXTENSION__ || window.violentmonkey) return true;
        if (document.__tampermonkey || document.__violentmonkey) return true;

        // 3. Check for unsafeWindow bridging
        if (typeof window.unsafeWindow !== 'undefined' && window.unsafeWindow !== window) return true;

        // 4. Injected Userscript DOM Tag & Metadata Checks
        const injectedScripts = document.querySelectorAll('script[src*="tampermonkey"], script[src*="violentmonkey"], script[data-userscript]');
        if (injectedScripts && injectedScripts.length > 0) return true;

        return false;
    } catch (e) {
        return false;
    }
}
