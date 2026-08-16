// Global Application State

function getInitialPath() {
    if (window.location.hash && window.location.hash.length > 1) {
        try {
            const hashPath = decodeURIComponent(window.location.hash.substring(1));
            if (hashPath.startsWith('/')) return hashPath;
        } catch (e) {
            console.warn('Invalid hash path:', e);
        }
    }
    const savedPath = localStorage.getItem('mininxd_current_path');
    if (savedPath && savedPath.startsWith('/')) return savedPath;
    return '/';
}

export function getDownloadMode() {
    return localStorage.getItem('mininxd_download_mode') || 'zip';
}

export const state = {
    currentPath: getInitialPath(),
    filesList: [],
    selectedFileNames: new Set(),
    sortColumn: 'name',
    sortDirection: 'asc',
    hideBottomStatusTimeout: null,
    activeEditorPath: null,
    jarInstance: null,
    currentDeviceFingerprint: localStorage.getItem('mininxd_device_fingerprint') || null,
    currentMasterKey: localStorage.getItem('mininxd_master_key') || null,
    isUserAdmin: localStorage.getItem('mininxd_is_admin') === 'true',
    adminUserList: [],
    publicModeConfig: null,
    isPublicMode: false,
    currentPublicUser: null,
    publicCurrentSubpath: '/'
};
