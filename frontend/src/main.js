// Application Entry Point
import './style.css';
import { getFingerprint } from './lib/fingerprint.js';
import { state } from './lib/state.js';
import { showToast, setBottomStatus } from './lib/utils.js';
import { apiFetch } from './lib/api.js';
import { isUserscriptEnvironment } from './lib/security.js';

import { renderAppLayout } from './components/Layout.js';
import { 
    initFileManager, 
    loadDirectory, 
    renderTable, 
    navigateTo, 
    navigateToPublic,
    exitPublicMode,
    goUpDirectory, 
    cancelSelectionMode, 
    copySelectedItems, 
    cutSelectedItems, 
    pasteClipboardItems,
    invalidateDirectoryCache
} from './components/FileManager.js';
import { initUploadHandlers, checkPendingUploads, retryCachedUpload } from './components/UploadHandler.js';
import { initMediaPreview, closeMediaPlayer } from './components/MediaPreview.js';
import { initCodeEditor } from './components/CodeEditor.js';
import { 
    initAdminConsole, 
    showAdminDashboard, 
    showFileManagerView,
    updateDeviceAuthBadge, 
    applyAdminPermissionsUI 
} from './components/AdminConsole.js';
import { initStorageWidget, updateStorageInfo } from './components/StorageWidget.js';
import { initModals, promptAdminMasterKeyModal, promptPublicKeyModal } from './components/Modals.js';

// 1. Render App Layout HTML Shell
renderAppLayout();

// 2. Load Config from /api/config
async function loadAppConfig() {
    const navAppTitle = document.getElementById('navAppTitle');
    try {
        const res = await apiFetch('/api/config');
        const cfg = await res.json();
        if (cfg.success) {
            if (cfg.ftp_name) {
                if (navAppTitle) navAppTitle.textContent = cfg.ftp_name;
                const modalFooterAppName = document.getElementById('modalFooterAppName');
                if (modalFooterAppName) modalFooterAppName.textContent = cfg.ftp_name;
                document.title = cfg.ftp_name;
            }
            if (cfg.public_mode) {
                state.publicModeConfig = cfg.public_mode;
            }
        }
    } catch (e) {}
}

// 3. Heartbeat & Connection Health Monitor
let isConnectedState = null;
let isCheckingHeartbeat = false;

export async function checkHeartbeat(silent = true) {
    if (isCheckingHeartbeat) return;
    isCheckingHeartbeat = true;

    if (!silent) {
        setBottomStatus('connecting', 'Connecting to Storage...');
    }

    try {
        const res = await apiFetch('/api/ftp/heartbeat');
        const data = await res.json();

        if (data.success && data.status === 'connected') {
            const wasDisconnected = isConnectedState === false;
            isConnectedState = true;

            if (wasDisconnected) {
                setBottomStatus('connected', 'Connected to Storage');
            }
        } else {
            isConnectedState = false;
            setBottomStatus('error', 'Not Connected to Storage', data.error || '530 Login incorrect', { showRetry: true });
        }
    } catch (err) {
        isConnectedState = false;
        setBottomStatus('error', 'Not Connected to Storage', err.message || 'Connection Failed', { showRetry: true });
    } finally {
        isCheckingHeartbeat = false;
    }
}

// 4. Device Verification & Admin URL Routing Check (Runs once per session)
let isDeviceVerificationInProgress = false;

async function verifyUserDevice() {
    if (isDeviceVerificationInProgress) return;
    isDeviceVerificationInProgress = true;

    const navWelcomeSetupBtn = document.getElementById('navWelcomeSetupBtn');
    const welcomeSetupModal = document.getElementById('welcomeSetupModal');
    const welcomeUserIdDisplay = document.getElementById('welcomeUserIdDisplay');
    const welcomeAdminUrlSample = document.getElementById('welcomeAdminUrlSample');
    const searchInput = document.getElementById('searchInput');

    if (navWelcomeSetupBtn && !navWelcomeSetupBtn._bound) {
        navWelcomeSetupBtn._bound = true;
        navWelcomeSetupBtn.addEventListener('click', () => {
            if (welcomeUserIdDisplay) welcomeUserIdDisplay.textContent = state.currentDeviceFingerprint;
            if (welcomeAdminUrlSample) welcomeAdminUrlSample.textContent = `${window.location.origin}/${state.currentDeviceFingerprint}`;
            if (welcomeSetupModal) {
                try {
                    welcomeSetupModal.showModal();
                } catch (e) {}
            }
        });
    }

    try {
        // 1. Compute this physical device's actual hardware fingerprint
        const physicalDeviceFingerprint = await getFingerprint();
        state.currentDeviceFingerprint = physicalDeviceFingerprint;

        // 0. Silent Anti-Tampering & Userscript Integrity Check
        const isUntrusted = isUserscriptEnvironment();
        if (isUntrusted) {
            // Silently downgrade to view-only mode without any message or warning
            state.isUserAdmin = false;
            try { localStorage.setItem('mininxd_is_admin', 'false'); } catch (e) {}
            applyAdminPermissionsUI();
            updateDeviceAuthBadge(false, physicalDeviceFingerprint);
            if (navWelcomeSetupBtn) navWelcomeSetupBtn.classList.add('hidden');
            if (state.filesList && state.filesList.length > 0) {
                renderTable(searchInput ? searchInput.value.trim() : '');
            }
            return;
        }

        // Detect explicit admin entry via URL route /<user_id> (e.g. /0xc3d0a304ec71cfdfa4f59373f334b236 or /admin)
        // Strictly exclude public routes like /pub/*, /public, etc.
        const pathLower = window.location.pathname.toLowerCase();
        let urlPathId = '';
        if (!pathLower.startsWith('/pub') && !pathLower.startsWith('/public')) {
            urlPathId = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim();
        }
        if (!urlPathId && window.location.hash && (window.location.hash.startsWith('#0x') || window.location.hash.startsWith('#admin') || window.location.hash === '#admin')) {
            urlPathId = window.location.hash.substring(1).trim();
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlPathId && urlParams.get('userid')) {
            urlPathId = urlParams.get('userid').trim();
        }

        const cleanTargetId = urlPathId.toLowerCase().replace(/^0x/, '');
        const cleanActualId = (physicalDeviceFingerprint || '').toLowerCase().replace(/^0x/, '');
        const isExplicitUserEntry = Boolean(cleanTargetId && !urlPathId.includes('/') && 
            (urlPathId.startsWith('0x') || /^[0-9a-f]{32,64}$/i.test(cleanTargetId) || cleanTargetId === 'admin'));

        // 2. Verify physical device against SQLite database
        let data = null;
        try {
            const res = await apiFetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint: physicalDeviceFingerprint })
            });
            if (res && res.ok) {
                data = await res.json();
            }
        } catch (fetchErr) {
            console.warn('Verify fetch failed:', fetchErr);
        }

        // If verify fetch failed or server returned unsuccessful, DO NOT display setup or welcome modal
        if (!data || !data.success) {
            console.warn('Device verification failed or offline, skipping welcome setup modal');
            updateDeviceAuthBadge(state.isUserAdmin, state.currentDeviceFingerprint);
            applyAdminPermissionsUI();
            if (state.filesList && state.filesList.length > 0) {
                renderTable(searchInput ? searchInput.value.trim() : '');
            }
            return;
        }

        // Handle DB state and session persistence
        if (data.hasAdmins === false || data.adminCount === 0) {
            sessionStorage.removeItem('mininxd_has_admins');
            sessionStorage.removeItem('mininxd_session_verified_fp');
            localStorage.removeItem('mininxd_is_admin');
            state.isUserAdmin = false;
        } else {
            sessionStorage.setItem('mininxd_session_verified_fp', physicalDeviceFingerprint);
            sessionStorage.setItem('mininxd_has_admins', 'true');
        }

        // Physical device authorization state
        const isPhysicalDeviceAdmin = Boolean(data.isAdmin);
        state.currentDeviceFingerprint = physicalDeviceFingerprint;

        try {
            localStorage.setItem('mininxd_device_fingerprint', physicalDeviceFingerprint);
        } catch (e) {}

        // 3. Explicit Admin URL Entry Verification (Requires both Hardware Fingerprint AND Master Key)
        if (isExplicitUserEntry) {
            // Check hardware device mismatch
            if (cleanTargetId !== 'admin' && cleanTargetId !== cleanActualId) {
                showToast('Unauthorized: Hardware verification failed. Device ID does not match this device.', 'error');
                setTimeout(() => {
                    window.location.replace('/');
                }, 1000);
                return;
            }

            // Case A: This device is NOT yet an admin
            if (!isPhysicalDeviceAdmin) {
                if (data.hasAdmins === false || data.adminCount === 0) {
                    if (welcomeUserIdDisplay) welcomeUserIdDisplay.textContent = state.currentDeviceFingerprint;
                    if (welcomeAdminUrlSample) welcomeAdminUrlSample.textContent = `${window.location.origin}/${state.currentDeviceFingerprint}`;
                    if (welcomeSetupModal) {
                        try { welcomeSetupModal.showModal(); } catch (e) {}
                    }
                    showToast('Please configure your Administrator account & Master Key', 'info');
                    return;
                } else {
                    showToast('This device is not registered as an administrator.', 'warning');
                    setTimeout(() => {
                        window.location.replace('/');
                    }, 1200);
                    return;
                }
            }

            // Case B: This device IS an admin
            if (data.requiresMasterKey) {
                let isMasterKeyValid = false;
                const storedKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key');
                if (storedKey) {
                    try {
                        const checkRes = await apiFetch('/api/verify_masterkey', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ masterkey: storedKey, fingerprint: physicalDeviceFingerprint })
                        });
                        const checkData = await checkRes.json();
                        if (checkData && checkData.success) {
                            isMasterKeyValid = true;
                            state.currentMasterKey = storedKey;
                        }
                    } catch (e) {}
                }

                if (!isMasterKeyValid) {
                    state.isUserAdmin = false;
                    applyAdminPermissionsUI();
                    updateDeviceAuthBadge(false, state.currentDeviceFingerprint);

                    promptAdminMasterKeyModal({
                        onSuccess: () => {
                            state.isUserAdmin = true;
                            try { localStorage.setItem('mininxd_is_admin', 'true'); } catch (e) {}
                            applyAdminPermissionsUI();
                            updateDeviceAuthBadge(true, state.currentDeviceFingerprint);
                            showToast('Master Key verified! Welcome to Admin Console', 'success');
                            showAdminDashboard();
                        },
                        onCancel: () => {
                            state.isUserAdmin = false;
                            try { localStorage.setItem('mininxd_is_admin', 'false'); } catch (e) {}
                            applyAdminPermissionsUI();
                            updateDeviceAuthBadge(false, state.currentDeviceFingerprint);
                            showToast('Master Key verification required. Access denied.', 'warning');
                            setTimeout(() => {
                                window.location.replace('/');
                            }, 1000);
                        }
                    });
                    return;
                }
            }

            // Both hardware and master key verified!
            state.isUserAdmin = true;
            try { localStorage.setItem('mininxd_is_admin', 'true'); } catch (e) {}
            applyAdminPermissionsUI();
            updateDeviceAuthBadge(true, state.currentDeviceFingerprint);
            showToast('Admin verified. Welcome to Admin Console!', 'success');
            showAdminDashboard();
            return;
        }

        // Master Key Guarding for normal navigation:
        let adminMasterKeyApproved = false;

        if (isPhysicalDeviceAdmin) {
            if (data.requiresMasterKey) {
                const storedKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key');
                if (storedKey) {
                    try {
                        const checkRes = await apiFetch('/api/verify_masterkey', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ masterkey: storedKey })
                        });
                        const checkData = await checkRes.json();
                        if (checkData && checkData.success) {
                            adminMasterKeyApproved = true;
                            state.currentMasterKey = storedKey;
                        }
                    } catch (e) {}
                }

                if (!adminMasterKeyApproved) {
                    state.isUserAdmin = false;
                    applyAdminPermissionsUI();
                    updateDeviceAuthBadge(false, state.currentDeviceFingerprint);

                    promptAdminMasterKeyModal({
                        onSuccess: () => {
                            state.isUserAdmin = true;
                            try { localStorage.setItem('mininxd_is_admin', 'true'); } catch (e) {}
                            applyAdminPermissionsUI();
                            updateDeviceAuthBadge(true, state.currentDeviceFingerprint);
                        },
                        onCancel: () => {
                            state.isUserAdmin = false;
                            try { localStorage.setItem('mininxd_is_admin', 'false'); } catch (e) {}
                            applyAdminPermissionsUI();
                            updateDeviceAuthBadge(false, state.currentDeviceFingerprint);
                        }
                    });
                    return;
                }
            } else {
                adminMasterKeyApproved = true;
            }
        }

        state.isUserAdmin = isPhysicalDeviceAdmin && (data.requiresMasterKey ? adminMasterKeyApproved : true);
        try {
            localStorage.setItem('mininxd_is_admin', state.isUserAdmin ? 'true' : 'false');
        } catch (e) {}

        // Standard page load / registration (First time verify for normal user when admins already exist):
        if (data.isNew && data.hasAdmins !== false) {
            window.location.reload();
            return;
        }

        updateDeviceAuthBadge(state.isUserAdmin, state.currentDeviceFingerprint);
        applyAdminPermissionsUI();

        // 4. Setup Modal & Navbar Button Logic:
        // While admin is NOT setup, ALWAYS show welcome modal and display Setup Admin button on every reload or revisit!
        const isNoAdminSetup = data.success === true && (data.hasAdmins === false || data.adminCount === 0) && !isPhysicalDeviceAdmin && !state.isUserAdmin;

        if (navWelcomeSetupBtn) {
            if (isNoAdminSetup) {
                navWelcomeSetupBtn.classList.remove('hidden');
            } else {
                navWelcomeSetupBtn.classList.add('hidden');
            }
        }

        if (isNoAdminSetup && welcomeSetupModal) {
            if (welcomeUserIdDisplay) welcomeUserIdDisplay.textContent = state.currentDeviceFingerprint;
            if (welcomeAdminUrlSample) {
                welcomeAdminUrlSample.textContent = `${window.location.origin}/${state.currentDeviceFingerprint}`;
            }
            try {
                if (!welcomeSetupModal.open) {
                    welcomeSetupModal.showModal();
                }
            } catch (e) {}
        }

        if (state.filesList && state.filesList.length > 0) {
            renderTable(searchInput ? searchInput.value.trim() : '');
        }
    } catch (err) {
        console.error('Device verification error:', err);
    }
}

// 5. Global Browser Popstate & Hash Navigation
window.addEventListener('popstate', (e) => {
    // 1. If any modal is open, close it and consume the back action
    const renameModal = document.getElementById('renameModal');
    if (renameModal && renameModal.open) {
        renameModal.close();
        return;
    }

    const openModals = [
        document.getElementById('draculaEditorModal'),
        document.getElementById('imagePreviewModal'),
        document.getElementById('mediaPreviewModal'),
        document.getElementById('newFileModal'),
        document.getElementById('newFolderModal'),
        document.getElementById('settingsModal'),
        document.getElementById('publicKeyModal'),
        document.getElementById('publicSetPasswordModal')
    ];
    let modalWasOpen = false;
    for (const modal of openModals) {
        if (modal && modal.open) {
            if (modal.id === 'mediaPreviewModal') closeMediaPlayer();
            else modal.close();
            modalWasOpen = true;
        }
    }
    if (modalWasOpen) return;

    // 2. Selection Mode: Cancel selection mode without popping history again
    if (state.selectedFileNames && state.selectedFileNames.size > 0) {
        cancelSelectionMode(true);
        return;
    }

    // 3. Admin Console View: Switch back to File Manager view if active
    const adminDashboardView = document.getElementById('adminDashboardView');
    if (adminDashboardView && !adminDashboardView.classList.contains('hidden')) {
        showFileManagerView();
        return;
    }

    // 4. Public mode routing on popstate
    if (e.state && e.state.public && e.state.user) {
        navigateToPublic(e.state.user, e.state.path || '/', false);
        return;
    }

    const currentPathname = window.location.pathname.replace(/^\/+/, '');
    if (currentPathname.startsWith('pub/')) {
        const segs = currentPathname.split('/');
        const cleanId = (segs[1] || '').toLowerCase().replace(/^0x/, '');
        const subpath = segs.slice(2).length > 0 ? '/' + segs.slice(2).join('/') : '/';
        if (cleanId) {
            navigateToPublic(cleanId, subpath, false);
            return;
        }
    }

    if (state.isPublicMode && !currentPathname.startsWith('pub')) {
        exitPublicMode();
        return;
    }

    // 5. Directory Navigation: Extract target path from history state or hash
    let targetPath = null;
    if (e.state && typeof e.state.path === 'string') {
        targetPath = e.state.path;
    } else if (window.location.hash) {
        try {
            const rawHash = window.location.hash.replace(/^#/, '');
            targetPath = decodeURIComponent(rawHash);
        } catch (err) {}
    }

    if (!targetPath || !targetPath.startsWith('/')) {
        targetPath = '/';
    }

    // Only navigate if the destination path is different from current path
    if (targetPath !== state.currentPath) {
        navigateTo(targetPath, false);
    }
});

// 6. Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable) || (e.target && e.target.classList && e.target.classList.contains('dracula-editor'));
    const renameModal = document.getElementById('renameModal');
    const searchInput = document.getElementById('searchInput');

    if (isInput) return;
    if (renameModal && renameModal.open) return;

    // Copy shortcut (Ctrl+C / Cmd+C)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && state.selectedFileNames.size > 0) {
        e.preventDefault();
        copySelectedItems();
        return;
    }

    // Cut shortcut (Ctrl+X / Cmd+X)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x' && state.selectedFileNames.size > 0) {
        e.preventDefault();
        cutSelectedItems();
        return;
    }

    // Paste shortcut (Ctrl+V / Cmd+V)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteClipboardItems();
        return;
    }

    // Escape clears selection
    if (e.key === 'Escape') {
        if (state.selectedFileNames.size > 0) {
            state.selectedFileNames.clear();
            cancelSelectionMode();
            return;
        }
    }

    // Backspace or Alt+Left Arrow navigates Up
    if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowLeft') || e.key === 'BrowserBack') {
        e.preventDefault();
        goUpDirectory();
    }
});

// 7. Initialize Sub-modules
initFileManager();
initUploadHandlers();
initMediaPreview();
initCodeEditor(() => {
    invalidateDirectoryCache();
    loadDirectory(true);
    updateStorageInfo(true);
});
initAdminConsole(() => {
    invalidateDirectoryCache();
    loadDirectory(true);
});
initStorageWidget();
initModals();

// Bottom Status Bar Retry Listener
const bottomStatusRetryBtn = document.getElementById('bottomStatusRetryBtn');
if (bottomStatusRetryBtn) {
    bottomStatusRetryBtn.addEventListener('click', async () => {
        await checkHeartbeat(false);
        invalidateDirectoryCache();
        loadDirectory(true);
        updateStorageInfo(true);
    });
}

// 8. Bootstrap Initial Data
async function bootstrapApp() {
    await loadAppConfig();

    // Check if initial URL is a public mode route (e.g. /pub/abcdef or /public)
    const currentPathname = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    const pathSegments = currentPathname.split('/').filter(Boolean);

    if (pathSegments.length > 0 && (pathSegments[0] === 'pub' || pathSegments[0] === 'public')) {
        await verifyUserDevice();

        if (pathSegments[0] === 'public' && pathSegments.length === 1 && state.isUserAdmin) {
            state.currentPath = '/public';
            await loadDirectory();
            updateStorageInfo(false);
            checkHeartbeat(true);
            checkPendingUploads();
            return;
        }

        let cleanId = '';
        if (pathSegments.length > 1) {
            cleanId = pathSegments[1].toLowerCase().replace(/^0x/, '');
        } else {
            const myFp = (state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '').toLowerCase().replace(/^0x/, '');
            if (myFp) {
                cleanId = myFp;
            } else if (state.publicModeConfig && state.publicModeConfig.user_list && state.publicModeConfig.user_list.length > 0) {
                cleanId = state.publicModeConfig.user_list[0].clean_id;
            }
        }

        if (cleanId) {
            const subpath = pathSegments.slice(2).length > 0 ? '/' + pathSegments.slice(2).join('/') : '/';
            navigateToPublic(cleanId, subpath, false);
            updateStorageInfo(false);
            checkHeartbeat(true);
            checkPendingUploads();
            return;
        }
    }

    const initialRawPath = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim();
    const initialSegments = initialRawPath.split('/').filter(Boolean);
    const firstInitialSegment = initialSegments.length > 0 ? initialSegments[0].toLowerCase() : '';
    const cleanFirstSegment = firstInitialSegment.replace(/^0x/, '');
    const isExplicitAdminUrl = Boolean(cleanFirstSegment && !initialRawPath.includes('/') && 
        (firstInitialSegment.startsWith('0x') || /^[0-9a-f]{32,64}$/i.test(cleanFirstSegment) || cleanFirstSegment === 'admin'));
    const isPublicUrl = firstInitialSegment === 'pub' || firstInitialSegment === 'public';

    if (!isExplicitAdminUrl && !isPublicUrl) {
        // Restore initial path from URL hash if available
        if (window.location.hash) {
            try {
                const rawHash = window.location.hash.replace(/^#/, '');
                const decoded = decodeURIComponent(rawHash);
                if (decoded && decoded.startsWith('/')) {
                    state.currentPath = decoded;
                }
            } catch (e) {}
        }
        try {
            const targetUrl = state.currentPath === '/' ? '/' : '/#' + encodeURIComponent(state.currentPath);
            history.replaceState({ path: state.currentPath }, '', targetUrl);
        } catch (e) {}
    }

    await verifyUserDevice();
    if (!isExplicitAdminUrl) {
        await loadDirectory();
    }
    updateStorageInfo(false);
    checkHeartbeat(true);
    checkPendingUploads();
}
bootstrapApp();

// Background heartbeat every 25s
setInterval(() => checkHeartbeat(true), 25000);
