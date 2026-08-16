// File Manager Explorer Component
import { state, getDownloadMode } from '../lib/state.js';
import { formatBytes, formatDate, getFileIcon, showToast, setBottomStatus, copyTextToClipboard } from '../lib/utils.js';
import { apiFetch } from '../lib/api.js';
import { updateStorageInfo } from './StorageWidget.js';
import { isTextEditable, isImageFile, isAudioFile, isVideoFile } from './MediaPreview.js';
import { promptPublicKeyModal } from './Modals.js';

let clipboardState = null; // { mode: 'copy' | 'cut', items: [{ path, isDir, name }], sourceDir: string }
let hasPushedSelectionHistory = false;
let isNavigating = false;
export const pendingCachedUploads = new Map();
export let activeUploadCount = 0;

// High-speed In-Memory Directory Cache (Instant Navigation & Back/Up)
const directoryCache = new Map();
const DIR_CACHE_TTL_MS = 20000; // 20 seconds cache
let currentDirectorySeq = 0;
let activeNavAbortController = null;

export function invalidateDirectoryCache() {
    directoryCache.clear();
}

export function updateClipboardUI() {
    const clipboardBar = document.getElementById('clipboardBar');
    const clipboardIcon = document.getElementById('clipboardIcon');
    const clipboardText = document.getElementById('clipboardText');
    if (!clipboardBar) return;
    if (!clipboardState || !clipboardState.items || clipboardState.items.length === 0) {
        clipboardBar.classList.add('hidden');
        return;
    }

    clipboardBar.classList.remove('hidden');
    const count = clipboardState.items.length;
    const isCut = clipboardState.mode === 'cut';

    if (clipboardIcon) {
        clipboardIcon.className = isCut ? 'ri-scissors-2-line text-primary text-base' : 'ri-file-copy-line text-primary text-base';
    }
    if (clipboardText) {
        clipboardText.textContent = `${count} ${count === 1 ? 'item' : 'items'} ${isCut ? 'cut' : 'copied'} from ${clipboardState.sourceDir}`;
    }
}

export function copySelectedItems() {
    const isPublic = state.isPublicMode && Boolean(state.currentPublicUser);
    if (!state.isUserAdmin && !isPublic) {
        showToast('View only mode: Copy is only allowed inside public space', 'warning');
        return;
    }

    const currentLoc = isPublic ? (state.publicCurrentSubpath || '/') : state.currentPath;

    const items = Array.from(state.selectedFileNames).map(name => {
        const item = state.filesList.find(f => f.name === name);
        const isDir = item ? (item.type === 2 || item.isDirectory) : false;
        const filePath = (currentLoc.endsWith('/') ? currentLoc : currentLoc + '/') + name;
        return { 
            path: filePath, 
            isDir, 
            name, 
            isPublic,
            publicUserId: isPublic ? state.currentPublicUser.clean_id : null
        };
    });

    if (items.length === 0) return;
    clipboardState = { 
        mode: 'copy', 
        items, 
        sourceDir: isPublic ? `public${currentLoc === '/' ? '' : currentLoc}` : currentLoc,
        isPublic,
        publicUserId: isPublic ? state.currentPublicUser.clean_id : null
    };
    cancelSelectionMode();
    updateClipboardUI();
    showToast(`Copied ${items.length} item(s) to clipboard`, 'info');
}

export function cutSelectedItems() {
    const isPublic = state.isPublicMode && Boolean(state.currentPublicUser);
    if (!state.isUserAdmin && !isPublic) {
        showToast('View only mode: Cut is only allowed inside public space', 'warning');
        return;
    }

    const currentLoc = isPublic ? (state.publicCurrentSubpath || '/') : state.currentPath;

    const items = Array.from(state.selectedFileNames).map(name => {
        const item = state.filesList.find(f => f.name === name);
        const isDir = item ? (item.type === 2 || item.isDirectory) : false;
        const filePath = (currentLoc.endsWith('/') ? currentLoc : currentLoc + '/') + name;
        return { 
            path: filePath, 
            isDir, 
            name, 
            isPublic,
            publicUserId: isPublic ? state.currentPublicUser.clean_id : null
        };
    });

    if (items.length === 0) return;
    clipboardState = { 
        mode: 'cut', 
        items, 
        sourceDir: isPublic ? `public${currentLoc === '/' ? '' : currentLoc}` : currentLoc,
        isPublic,
        publicUserId: isPublic ? state.currentPublicUser.clean_id : null
    };
    cancelSelectionMode();
    updateClipboardUI();
    showToast(`Cut ${items.length} item(s) to clipboard`, 'info');
}

export async function pasteClipboardItems() {
    const pasteBtn = document.getElementById('pasteBtn');
    if (!clipboardState || !clipboardState.items || clipboardState.items.length === 0) return;

    const isPublic = state.isPublicMode && Boolean(state.currentPublicUser);
    if (!state.isUserAdmin && !isPublic) {
        showToast('View only mode: Pasting is only allowed inside public space', 'warning');
        return;
    }

    const { mode, items, isPublic: itemIsPublic, publicUserId } = clipboardState;
    const actionLabel = mode === 'cut' ? 'Moving' : 'Copying';

    if (state.isPublicMode && state.currentPublicUser) {
        const destSubpath = state.publicCurrentSubpath || '/';
        const targetUserId = state.currentPublicUser.clean_id;

        if (isPublic && publicUserId && publicUserId !== targetUserId) {
            showToast('Cannot paste between different public spaces', 'warning');
            return;
        }

        const endpoint = mode === 'cut' ? '/api/public/move' : '/api/public/copy';
        const pubKey = sessionStorage.getItem('mininxd_pub_key_' + targetUserId) || '';

        showToast(`${actionLabel} ${items.length} item(s) to public${destSubpath}...`, 'info');
        if (pasteBtn) pasteBtn.disabled = true;

        try {
            const res = await apiFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: targetUserId,
                    path: destSubpath,
                    items,
                    key: pubKey
                })
            });
            const data = await res.json();

            if (data.success) {
                showToast(`${mode === 'cut' ? 'Moved' : 'Copied'} ${data.count || items.length} item(s) successfully!`, 'success');
                clipboardState = null;
                updateClipboardUI();
                invalidateDirectoryCache();
                loadDirectory(true);
            } else {
                showToast(`Paste failed: ${data.error || 'Unknown error'}`, 'error');
            }
        } catch (err) {
            showToast(`Paste error: ${err.message}`, 'error');
        } finally {
            if (pasteBtn) pasteBtn.disabled = false;
        }
        return;
    }

    if (!state.isUserAdmin) {
        showToast('View only mode: pasting is disabled', 'warning');
        return;
    }

    const endpoint = mode === 'cut' ? '/api/ftp/move' : '/api/ftp/copy';
    showToast(`${actionLabel} ${items.length} item(s) to ${state.currentPath}...`, 'info');
    if (pasteBtn) pasteBtn.disabled = true;

    try {
        const res = await apiFetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items,
                targetDir: state.currentPath,
                fingerprint: state.currentDeviceFingerprint
            })
        });
        const data = await res.json();

        if (data.success) {
            showToast(`${mode === 'cut' ? 'Moved' : 'Copied'} ${data.count || items.length} item(s) successfully!`, 'success');
            clipboardState = null;
            updateClipboardUI();
            invalidateDirectoryCache();
            loadDirectory(true);
            updateStorageInfo(true);
        } else {
            showToast(`Paste failed: ${data.error || 'Unknown error'}`, 'error');
        }
    } catch (err) {
        showToast(`Paste error: ${err.message}`, 'error');
    } finally {
        if (pasteBtn) pasteBtn.disabled = false;
    }
}

export function enterSelectionMode() {
    hasPushedSelectionHistory = true;
}

export function cancelSelectionMode(fromPopState = false) {
    const searchInput = document.getElementById('searchInput');
    if (state.selectedFileNames && state.selectedFileNames.size > 0) {
        state.selectedFileNames.clear();
        hasPushedSelectionHistory = false;
        updateBatchToolbar();
        renderTable(searchInput ? searchInput.value.trim() : '');
        return true;
    }
    hasPushedSelectionHistory = false;
    return false;
}

export function updateBatchToolbar() {
    const batchActionToolbar = document.getElementById('batchActionToolbar');
    const selectedCountBadge = document.getElementById('selectedCountBadge');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    const fabMenu = document.getElementById('fabMenu');
    const batchCopyBtn = document.getElementById('batchCopyBtn');
    const batchCutBtn = document.getElementById('batchCutBtn');
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const isAdminDashboardActive = adminDashboardView && !adminDashboardView.classList.contains('hidden');

    const count = state.selectedFileNames.size;
    if (count > 0) {
        if (batchActionToolbar) batchActionToolbar.classList.remove('hidden');
        if (selectedCountBadge) selectedCountBadge.textContent = `${count}`;
        if (fabTriggerBtn) fabTriggerBtn.classList.add('hidden');
        if (fabMenu) fabMenu.classList.add('hidden');

        const canMutate = state.isUserAdmin || (state.isPublicMode && Boolean(state.currentPublicUser));

        // In public space (or admin mode): Download, Copy, Cut, Delete are all active!
        // Outside public space (non-admin view-only): ONLY Download is available.
        if (canMutate) {
            if (batchCopyBtn) batchCopyBtn.classList.remove('hidden');
            if (batchCutBtn) batchCutBtn.classList.remove('hidden');
            if (batchDeleteBtn) batchDeleteBtn.classList.remove('hidden');
        } else {
            if (batchCopyBtn) batchCopyBtn.classList.add('hidden');
            if (batchCutBtn) batchCutBtn.classList.add('hidden');
            if (batchDeleteBtn) batchDeleteBtn.classList.add('hidden');
        }

        // Dynamically update Download button label based on settings, selected count, and folder presence
        const batchDownloadBtn = document.getElementById('batchDownloadBtn');
        const batchDownloadBtnText = document.getElementById('batchDownloadBtnText') || (batchDownloadBtn ? batchDownloadBtn.querySelector('span') : null);
        const downloadMode = getDownloadMode();
        const hasFolderSelected = Array.from(state.selectedFileNames).some(name => {
            const item = state.filesList.find(f => f.name === name);
            return item ? (item.type === 2 || item.isDirectory) : false;
        });

        if (batchDownloadBtn && batchDownloadBtnText) {
            if (hasFolderSelected) {
                // If any folder is selected, force ZIP download
                batchDownloadBtnText.textContent = 'Download ZIP';
                batchDownloadBtn.title = 'Download Selected as ZIP Archive (Folder included)';
            } else if (count === 1) {
                batchDownloadBtnText.textContent = 'Download File';
                batchDownloadBtn.title = 'Download Selected File';
            } else if (downloadMode === 'individual') {
                batchDownloadBtnText.textContent = 'Download Files';
                batchDownloadBtn.title = 'Download Selected Files Individually';
            } else {
                batchDownloadBtnText.textContent = 'Download ZIP';
                batchDownloadBtn.title = 'Download Selected as ZIP Archive';
            }
        }
    } else {
        if (batchActionToolbar) batchActionToolbar.classList.add('hidden');
        if (fabTriggerBtn) {
            if ((state.isUserAdmin || state.isPublicMode) && !isAdminDashboardActive) {
                fabTriggerBtn.classList.remove('hidden');
            } else {
                fabTriggerBtn.classList.add('hidden');
            }
        }
    }
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = state.filesList.length > 0 && state.selectedFileNames.size === state.filesList.length;
    }
}

export function updateBreadcrumbs() {
    const currentPathDisplay = document.getElementById('currentPathDisplay');
    const dropTargetLabel = document.getElementById('dropTargetLabel');
    const breadcrumbBar = document.getElementById('breadcrumbBar');

    if (state.isPublicMode && state.currentPublicUser) {
        const publicSub = state.publicCurrentSubpath || '/';
        const displayPath = publicSub === '/' ? 'public' : `public${publicSub}`;
        if (currentPathDisplay) currentPathDisplay.textContent = displayPath;
        if (dropTargetLabel) dropTargetLabel.textContent = `Uploading to public storage`;

        if (!breadcrumbBar) return;
        const subparts = (state.publicCurrentSubpath || '/').split('/').filter(Boolean);
        let html = `
          <button class="btn btn-ghost btn-xs text-primary font-bold px-1.5 gap-1" onclick="window.exitPublicMode()" title="Return to root">root</button>
          <span class="text-base-content/40">/</span>
          <button class="btn btn-ghost btn-xs text-secondary font-mono font-bold px-1.5" onclick="window.navigateToPublic('${state.currentPublicUser.clean_id}', '/')">${state.currentPublicUser.clean_id}</button>
        `;
        let accum = '';
        subparts.forEach((p) => {
            accum += '/' + p;
            const pathStr = accum;
            html += `
              <span class="text-base-content/40">/</span>
              <button class="btn btn-ghost btn-xs font-mono font-medium px-1.5" onclick="window.navigateToPublic('${state.currentPublicUser.clean_id}', '${pathStr}')">${p}</button>
            `;
        });
        breadcrumbBar.innerHTML = html;
        return;
    }

    if (currentPathDisplay) currentPathDisplay.textContent = state.currentPath;
    if (dropTargetLabel) dropTargetLabel.textContent = `Uploading to: ${state.currentPath}`;
    localStorage.setItem('mininxd_current_path', state.currentPath);

    if (!breadcrumbBar) return;
    const parts = state.currentPath.split('/').filter(Boolean);
    let html = `<button class="btn btn-ghost btn-xs text-primary font-bold px-1.5 gap-1" onclick="window.navigateTo('/')">root</button>`;
    let accum = '';
    
    parts.forEach((p) => {
        accum += '/' + p;
        const pathStr = accum;
        html += `
          <span class="text-base-content/40">/</span>
          <button class="btn btn-ghost btn-xs font-mono font-medium px-1.5" onclick="window.navigateTo('${pathStr}')">${p}</button>
        `;
    });
    
    breadcrumbBar.innerHTML = html;
}

export function renderTable(filterText = '') {
    const filesTableBody = document.getElementById('filesTableBody');
    const footerItemCount = document.getElementById('footerItemCount');
    if (!filesTableBody) return;

    const hasSelection = state.selectedFileNames.size > 0;
    let filtered = state.filesList.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.sort((a, b) => {
        // Dynamic Pinned Items: Pinned items always go first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        const aIsDir = a.type === 2 || a.isDirectory;
        const bIsDir = b.type === 2 || b.isDirectory;

        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

        let compare = 0;
        if (state.sortColumn === 'name') {
            compare = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        } else if (state.sortColumn === 'size') {
            compare = (a.size || 0) - (b.size || 0);
        } else if (state.sortColumn === 'date') {
            const aDate = new Date(a.rawModifiedAt || a.modifiedAt || 0).getTime();
            const bDate = new Date(b.rawModifiedAt || b.modifiedAt || 0).getTime();
            compare = aDate - bDate;
        }

        return state.sortDirection === 'asc' ? compare : -compare;
    });

    if (footerItemCount) footerItemCount.textContent = `${filtered.length} item(s)`;

    if (filtered.length === 0) {
        filesTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="py-10 text-center text-xs text-base-content/50">
              No files or folders found in this directory.
            </td>
          </tr>
        `;
        return;
    }

    filesTableBody.innerHTML = filtered.map(item => {
        const isDir = item.type === 2 || item.isDirectory;
        const isText = !isDir && isTextEditable(item.name);
        const isImg = !isDir && isImageFile(item.name);
        const isAudio = !isDir && isAudioFile(item.name);
        const isVideo = !isDir && isVideoFile(item.name);
        const isMedia = isAudio || isVideo;
        const isChecked = state.selectedFileNames.has(item.name);
        const escapedName = item.name.replace(/'/g, "\\'");
        const escapedBadge = item.badgeText ? item.badgeText.replace(/'/g, "\\'") : '';

        const { icon, color } = getFileIcon(item.name, isDir);
        const iconClass = `${icon} ${color}`;

        const folderCountText = item.itemCount !== undefined 
            ? `${item.itemCount} ${item.itemCount === 1 ? 'item' : 'items'}` 
            : 'folder';

        const dragAttributes = isDir 
            ? `ondragover="window.handleFolderDragOver(event, this)" ondragleave="window.handleFolderDragLeave(event, this)" ondrop="window.handleFolderDrop(event, '${escapedName}', this)"`
            : '';

        return `
          <tr class="hover transition-colors ${isChecked ? 'bg-primary/5 font-medium' : ''} ${hasSelection ? 'cursor-pointer' : ''}" ${dragAttributes} onclick="window.handleRowClick(event, '${escapedName}', ${isDir}, '${isText ? 'text' : (isImg ? 'img' : (isMedia ? 'media' : 'default'))}', ${isVideo})">
            <td class="text-center" onclick="event.stopPropagation()">
              <input type="checkbox" class="checkbox checkbox-xs checkbox-primary cursor-pointer" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation()" onchange="window.toggleSelectRow('${escapedName}')" />
            </td>
            <td class="text-center font-medium text-xs">
              ${isDir ? '<span class="badge badge-warning badge-xs font-bold">DIR</span>' : '<span class="badge badge-ghost badge-xs">FILE</span>'}
            </td>
            <td class="whitespace-nowrap">
              <div class="font-mono text-xs ${isDir ? 'font-semibold text-primary hover:underline cursor-pointer' : (isText || isImg || isMedia ? 'font-medium text-base-content hover:text-primary cursor-pointer' : 'font-medium text-base-content')} transition inline-flex items-center gap-2 text-left whitespace-nowrap" title="${escapedName}">
                ${item.isPinned ? `<i class="ri-pushpin-fill text-amber-500 text-sm shrink-0" title="Pinned item"></i>` : ''}
                <i class="${iconClass} text-sm shrink-0"></i>
                <span>${item.name}</span>
                ${item.isPinned && item.badgeText ? `<span class="badge badge-secondary/15 text-secondary border border-secondary/30 badge-xs text-[10px] font-mono font-normal">${item.badgeText}</span>` : ''}
              </div>
            </td>
            <td class="font-mono text-xs text-right text-base-content/70">
              ${isDir ? `<span class="badge badge-ghost badge-xs font-mono text-[10px] opacity-75">${folderCountText}</span>` : formatBytes(item.size)}
            </td>
            <td class="font-mono text-xs text-base-content/70">
              ${item.rawModifiedAt || item.modifiedAt || '-'}
            </td>
            <td class="text-right" onclick="event.stopPropagation()">
              ${!hasSelection ? `
                <div class="join">
                  ${isText ? `
                    <button onclick="window.openCodeEditor('${escapedName}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="${(state.isUserAdmin || state.isPublicMode) ? 'Edit' : 'View'}">
                      <i class="${(state.isUserAdmin || state.isPublicMode) ? 'ri-code-line' : 'ri-file-text-line'} text-xs"></i>
                    </button>
                  ` : ''}
                  ${isImg ? `
                    <button onclick="window.openImagePreview('${escapedName}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Preview">
                      <i class="ri-eye-line text-xs"></i>
                    </button>
                  ` : ''}
                  ${isMedia ? `
                    <button onclick="window.openMediaPreview('${escapedName}', ${isVideo})" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Play">
                      <i class="ri-play-circle-line text-xs"></i>
                    </button>
                  ` : ''}
                  ${!isDir ? `
                    <button onclick="window.downloadFile('${escapedName}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Download">
                      <i class="ri-download-2-line text-xs"></i>
                    </button>
                  ` : ''}
                  ${state.isUserAdmin ? `
                    <button onclick="window.openPinModal('${escapedName}', ${item.isPinned ? `'${escapedBadge}'` : 'null'})" class="btn btn-ghost btn-xs join-item ${item.isPinned ? 'text-amber-500 hover:bg-amber-500/10' : 'text-primary hover:bg-primary/10'} transition-colors" title="${item.isPinned ? 'Edit / Remove Pin' : 'Pin Item'}">
                      <i class="${item.isPinned ? 'ri-pushpin-fill' : 'ri-pushpin-line'} text-xs"></i>
                    </button>
                  ` : ''}
                  ${(state.isUserAdmin || state.isPublicMode) ? `
                    <button onclick="window.openRenameModal('${escapedName}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Rename">
                      <i class="ri-edit-line text-xs"></i>
                    </button>
                    <button onclick="window.deleteItem('${escapedName}', ${isDir})" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Delete">
                      <i class="ri-delete-bin-line text-xs"></i>
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </td>
          </tr>
        `;
    }).join('');
}

export async function loadDirectory(skipCache = false) {
    const seq = ++currentDirectorySeq;
    const requestedPath = state.isPublicMode && state.currentPublicUser ? `pub_${state.currentPublicUser.clean_id}_${state.publicCurrentSubpath || '/'}` : state.currentPath;

    // Abort previous in-flight directory fetch if still running
    if (activeNavAbortController) {
        try { activeNavAbortController.abort(); } catch (e) {}
    }
    const abortController = new AbortController();
    activeNavAbortController = abortController;

    const refreshBtn = document.getElementById('refreshBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const searchInput = document.getElementById('searchInput');
    const filesTableBody = document.getElementById('filesTableBody');
    const breadcrumbBar = document.getElementById('breadcrumbBar');

    updateBreadcrumbs();

    // 1. Instant Navigation from Cache (Sub-millisecond response)
    const cached = !skipCache ? directoryCache.get(requestedPath) : null;
    const isCacheValid = cached && (Date.now() - cached.time < DIR_CACHE_TTL_MS);

    if (isCacheValid) {
        state.filesList = cached.data || [];
        renderTable(searchInput ? searchInput.value.trim() : '');
        isNavigating = false;
        return;
    }

    // Clear stale files when entering a non-cached folder to prevent flicker
    state.filesList = [];
    renderTable('');

    if (refreshBtn) refreshBtn.disabled = true;
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    if (filesTableBody) filesTableBody.classList.add('pointer-events-none', 'opacity-60');
    if (breadcrumbBar) breadcrumbBar.classList.add('pointer-events-none');

    try {
        if (state.isPublicMode && state.currentPublicUser) {
            const cleanId = state.currentPublicUser.clean_id;
            const subpath = state.publicCurrentSubpath || '/';
            const res = await apiFetch(`/api/public/list?user_id=${encodeURIComponent(cleanId)}&path=${encodeURIComponent(subpath)}`, { signal: abortController.signal });
            const data = await res.json();

            if ((data.requiresKey || res.status === 401) && !state.isUserAdmin) {
                isNavigating = false;
                promptPublicKeyModal({
                    userId: state.currentPublicUser.user_id,
                    cleanId: state.currentPublicUser.clean_id,
                    dirName: state.currentPublicUser.dir_name,
                    onSuccess: () => {
                        loadDirectory(true);
                    },
                    onCancel: () => {
                        exitPublicMode();
                    }
                });
                return;
            }

            if (data.success) {
                const list = data.data || [];
                state.currentPublicUsedBytes = data.used_bytes;
                state.currentPublicAvailableBytes = data.available_bytes;
                updatePublicModeBanner();
                directoryCache.set(requestedPath, { data: list, time: Date.now() });
                if (seq === currentDirectorySeq && state.isPublicMode) {
                    state.filesList = list;
                    renderTable(searchInput ? searchInput.value.trim() : '');
                    setBottomStatus('connected', 'Public Directory', state.publicCurrentSubpath === '/' ? '' : `public${state.publicCurrentSubpath}`);
                }
            } else {
                if (seq === currentDirectorySeq && state.isPublicMode) {
                    setBottomStatus('error', 'Public Space Error', data.error);
                }
            }
            return;
        }

        if (state.currentPath === '/public') {
            const myFp = (state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '').toLowerCase().replace(/^0x/, '');

            // Non-admin users are strictly routed to their own public space
            if (!state.isUserAdmin) {
                if (myFp) {
                    navigateToPublic(myFp, '/', false);
                    return;
                }
            }

            let users = [];
            try {
                const usersRes = await apiFetch('/api/public/users', { signal: abortController.signal });
                const usersData = await usersRes.json();
                users = (usersData && usersData.users) || [];
            } catch (e) {
                users = [];
            }

            if (myFp && !users.some(u => u.clean_id === myFp)) {
                users.unshift({
                    user_id: '0x' + myFp,
                    clean_id: myFp,
                    dir_name: 'public/' + myFp,
                    has_key: false,
                    isSelf: true
                });
            }

            const list = users.map(u => ({
                name: u.clean_id,
                type: 2,
                isDirectory: true,
                isPublicUserFolder: true,
                clean_id: u.clean_id,
                user_id: u.user_id,
                dir_name: u.dir_name,
                has_key: u.has_key,
                size: 0,
                rawModifiedAt: u.clean_id === myFp ? 'My Public Space' : (u.has_key ? 'Password Protected' : 'Open Space')
            }));

            directoryCache.set(requestedPath, { data: list, time: Date.now() });
            if (seq === currentDirectorySeq && state.currentPath === '/public') {
                state.filesList = list;
                renderTable(searchInput ? searchInput.value.trim() : '');
                setBottomStatus('connected', 'Public Spaces Directory', '/public');
            }
            return;
        }

        const res = await apiFetch(`/api/ftp/list?path=${encodeURIComponent(requestedPath)}`, { signal: abortController.signal });
        const data = await res.json();

        if (data.success) {
            let list = data.data || [];

            // If on root / and public mode is enabled, ensure customizable public folder is shown
            if (state.currentPath === '/' && state.publicModeConfig?.enabled) {
                const publicFolderName = (state.publicModeConfig?.public_folder_name || 'public').trim() || 'public';
                const hasPublic = list.some(f => f.name.toLowerCase() === publicFolderName.toLowerCase() || f.name.toLowerCase() === 'public');
                if (!hasPublic) {
                    list = [
                        {
                            name: publicFolderName,
                            type: 2,
                            isDirectory: true,
                            isPublicFolder: true,
                            size: 0,
                            rawModifiedAt: 'Public Space'
                        },
                        ...list
                    ];
                } else {
                    list = list.map(f => {
                        if (f.name.toLowerCase() === publicFolderName.toLowerCase() || f.name.toLowerCase() === 'public') {
                            return {
                                ...f,
                                name: publicFolderName,
                                isPublicFolder: true,
                                rawModifiedAt: 'Public Space'
                            };
                        }
                        return f;
                    });
                }
            }

            directoryCache.set(requestedPath, { data: list, time: Date.now() });
            if (seq === currentDirectorySeq && state.currentPath === requestedPath) {
                state.filesList = list;
                renderTable(searchInput ? searchInput.value.trim() : '');
                updateStorageInfo(false);
            }
        } else {
            if (seq === currentDirectorySeq && state.currentPath === requestedPath) {
                setBottomStatus('error', 'FTP connection error', data.error);
            }
        }
    } catch (err) {
        if (err.name === 'AbortError') return; // Cleanly ignored
        if (seq === currentDirectorySeq) {
            setBottomStatus('error', 'Connection failed', err.message);
        }
    } finally {
        if (seq === currentDirectorySeq) {
            isNavigating = false;
            if (refreshBtn) refreshBtn.disabled = false;
            if (btnSpinner) btnSpinner.classList.add('hidden');
            if (filesTableBody) filesTableBody.classList.remove('pointer-events-none', 'opacity-60');
            if (breadcrumbBar) breadcrumbBar.classList.remove('pointer-events-none');
        }
    }
}

export function updatePublicModeBanner() {
    const publicModeHeaderBanner = document.getElementById('publicModeHeaderBanner');
    const publicModeUserDisplay = document.getElementById('publicModeUserDisplay');
    const publicModeKeyBadge = document.getElementById('publicModeKeyBadge');
    const publicModeKeyBadgeText = document.getElementById('publicModeKeyBadgeText');
    const publicModeQuotaProgressBar = document.getElementById('publicModeQuotaProgressBar');
    const publicModeQuotaPercentBadge = document.getElementById('publicModeQuotaPercentBadge');
    const publicModeQuotaUsedText = document.getElementById('publicModeQuotaUsedText');
    const publicModeQuotaFreeText = document.getElementById('publicModeQuotaFreeText');
    const publicModeFormatChipsList = document.getElementById('publicModeFormatChipsList');
    const publicSetPasswordBtn = document.getElementById('publicSetPasswordBtn');
    const publicSetPasswordText = document.getElementById('publicSetPasswordText');
    const publicSetPasswordIcon = document.getElementById('publicSetPasswordIcon');
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');

    if (!state.isPublicMode || !state.currentPublicUser) {
        if (publicModeHeaderBanner) publicModeHeaderBanner.classList.add('hidden');
        return;
    }

    if (publicModeHeaderBanner) publicModeHeaderBanner.classList.remove('hidden');

    const cleanId = String(state.currentPublicUser.clean_id || '').toLowerCase().replace(/^0x/, '');
    if (publicModeUserDisplay) {
        const shortClean = cleanId.length > 14 
            ? `${cleanId.slice(0, 6)}...${cleanId.slice(-4)}` 
            : (cleanId || 'public');
        publicModeUserDisplay.textContent = `@${shortClean}`;
    }

    if (publicModeKeyBadge) {
        if (state.currentPublicUser.has_key) {
            if (publicModeKeyBadgeText) publicModeKeyBadgeText.textContent = 'Password Protected';
            publicModeKeyBadge.className = 'badge badge-warning badge-xs font-mono text-[10px] gap-1 py-2 px-2 rounded-lg';
            publicModeKeyBadge.classList.remove('hidden');
        } else {
            publicModeKeyBadge.classList.add('hidden');
        }
    }

    const maxSizeMB = state.publicModeConfig?.max_size || 100;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const usedBytes = state.currentPublicUsedBytes || 0;
    const availableBytes = state.currentPublicAvailableBytes !== undefined ? state.currentPublicAvailableBytes : Math.max(0, maxSizeBytes - usedBytes);
    const usedPct = maxSizeBytes > 0 ? Math.min(100, Math.round((usedBytes / maxSizeBytes) * 100)) : 0;

    if (publicModeQuotaProgressBar) {
        publicModeQuotaProgressBar.style.width = `${usedPct}%`;
        if (usedPct >= 90) {
            publicModeQuotaProgressBar.className = 'h-full bg-error rounded-full transition-all duration-500 ease-out';
        } else if (usedPct >= 75) {
            publicModeQuotaProgressBar.className = 'h-full bg-warning rounded-full transition-all duration-500 ease-out';
        } else {
            publicModeQuotaProgressBar.className = 'h-full bg-primary rounded-full transition-all duration-500 ease-out';
        }
    }

    if (publicModeQuotaPercentBadge) {
        publicModeQuotaPercentBadge.textContent = `${usedPct}% used`;
        if (usedPct >= 90) {
            publicModeQuotaPercentBadge.className = 'badge badge-error badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0';
        } else if (usedPct >= 75) {
            publicModeQuotaPercentBadge.className = 'badge badge-warning badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0';
        } else if (usedPct > 0) {
            publicModeQuotaPercentBadge.className = 'badge badge-primary badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0';
        } else {
            publicModeQuotaPercentBadge.className = 'badge badge-neutral badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0';
        }
    }

    const publicModeLimitText = document.getElementById('publicModeLimitText');
    if (publicModeLimitText) {
        publicModeLimitText.textContent = `${maxSizeMB} MB`;
    }

    if (publicModeQuotaUsedText) {
        publicModeQuotaUsedText.textContent = `${formatBytes(usedBytes)} / ${maxSizeMB} MB`;
    }
    if (publicModeQuotaFreeText) {
        publicModeQuotaFreeText.textContent = `${formatBytes(availableBytes)} free`;
    }

    const publicModeItemsCountText = document.getElementById('publicModeItemsCountText');
    const publicModeSubpathText = document.getElementById('publicModeSubpathText');
    if (publicModeItemsCountText) {
        const count = Array.isArray(state.filesList) ? state.filesList.length : 0;
        publicModeItemsCountText.textContent = `${count} item${count === 1 ? '' : 's'}`;
    }
    if (publicModeSubpathText) {
        publicModeSubpathText.textContent = state.publicCurrentSubpath || '/';
    }

    const publicModeAllowedFormatsContainer = document.getElementById('publicModeAllowedFormatsContainer');
    const formats = state.publicModeConfig?.allowed_format || [];
    if (Array.isArray(formats) && formats.length > 0) {
        if (publicModeAllowedFormatsContainer) publicModeAllowedFormatsContainer.classList.remove('hidden');
        if (publicModeFormatChipsList) {
            publicModeFormatChipsList.innerHTML = formats.map(fmt => {
                return `<span class="badge badge-xs bg-base-200 text-base-content/80 border border-base-300/80 rounded-md font-mono">${fmt}</span>`;
            }).join('');
        }
    } else {
        if (publicModeAllowedFormatsContainer) publicModeAllowedFormatsContainer.classList.add('hidden');
        if (publicModeFormatChipsList) {
            publicModeFormatChipsList.innerHTML = '';
        }
    }

    if (publicSetPasswordBtn) {
        if (publicSetPasswordText) {
            publicSetPasswordText.textContent = state.currentPublicUser.has_key ? 'Change Password' : 'Add Password';
        }
        if (publicSetPasswordIcon) {
            publicSetPasswordIcon.className = state.currentPublicUser.has_key ? 'ri-lock-password-line text-xs text-primary' : 'ri-shield-keyhole-line text-xs text-primary';
        }
        publicSetPasswordBtn.onclick = () => {
            if (typeof window.promptPublicSetPasswordModal === 'function') {
                window.promptPublicSetPasswordModal({
                    user: state.currentPublicUser,
                    onSuccess: (hasKey) => {
                        state.currentPublicUser.has_key = hasKey;
                        updatePublicModeBanner();
                    }
                });
            }
        };
    }

    // In Public Mode, enable FAB for uploading to public folder
    if (fabTriggerBtn) {
        fabTriggerBtn.classList.remove('hidden');
    }
}

export function exitPublicMode() {
    state.isPublicMode = false;
    state.currentPublicUser = null;
    state.publicCurrentSubpath = '/';
    updatePublicModeBanner();
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    if (!state.isUserAdmin && fabTriggerBtn) {
        fabTriggerBtn.classList.add('hidden');
    }
    navigateTo('/', true);
}

export function navigateToPublic(cleanId, subpath = '/', pushHistory = true) {
    if (isNavigating) return;
    isNavigating = true;

    const normalizedCleanId = String(cleanId || '').toLowerCase().replace(/^0x/, '').trim();
    const pm = state.publicModeConfig;
    if (!pm || !pm.enabled) {
        showToast('Public mode is currently disabled', 'warning');
        isNavigating = false;
        return;
    }

    let user = (pm.user_list || []).find(u => u.clean_id === normalizedCleanId);
    if (!user) {
        user = {
            user_id: cleanId.startsWith('0x') ? cleanId : '0x' + normalizedCleanId,
            clean_id: normalizedCleanId,
            dir_name: 'public/' + normalizedCleanId,
            has_key: false,
            key: '',
            isDynamic: true
        };
    }

    const normSubpath = subpath.startsWith('/') ? subpath : '/' + subpath;

    // Check if key is required (admins bypass key prompt since they have server admin access)
    if (user.has_key && !state.isUserAdmin) {
        const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + user.clean_id);
        if (!cachedKey) {
            isNavigating = false;
            promptPublicKeyModal({
                userId: user.user_id,
                cleanId: user.clean_id,
                dirName: user.dir_name,
                onSuccess: () => {
                    navigateToPublic(user.clean_id, normSubpath, pushHistory);
                },
                onCancel: () => {
                    exitPublicMode();
                }
            });
            return;
        }
    }

    state.isPublicMode = true;
    state.currentPublicUser = user;
    state.publicCurrentSubpath = normSubpath;
    state.selectedFileNames.clear();
    updateBatchToolbar();
    updatePublicModeBanner();

    const targetUrl = `/pub/${user.clean_id}${normSubpath !== '/' ? normSubpath : ''}`;
    if (pushHistory) {
        try {
            history.pushState({ public: true, user: user.clean_id, path: normSubpath }, '', targetUrl);
        } catch (e) {}
    } else {
        try {
            history.replaceState({ public: true, user: user.clean_id, path: normSubpath }, '', targetUrl);
        } catch (e) {}
    }

    isNavigating = false;
    loadDirectory();
}

export function navigateTo(targetPath, pushHistory = true) {
    if (isNavigating) return;
    isNavigating = true;

    if (state.isPublicMode) {
        state.isPublicMode = false;
        state.currentPublicUser = null;
        state.publicCurrentSubpath = '/';
        updatePublicModeBanner();
    }

    const norm = targetPath.startsWith('/') ? targetPath : '/' + targetPath;
    if (norm === state.currentPath && !pushHistory) {
        isNavigating = false;
        return;
    }

    state.currentPath = norm;
    state.selectedFileNames.clear();
    updateBatchToolbar();

    const targetUrl = state.currentPath === '/' ? '/' : '/#' + encodeURIComponent(state.currentPath);
    if (pushHistory) {
        try {
            history.pushState({ path: state.currentPath }, '', targetUrl);
        } catch (e) {}
    } else {
        try {
            history.replaceState({ path: state.currentPath }, '', targetUrl);
        } catch (e) {}
    }

    loadDirectory();
}

export function goUpDirectory(pushHistory = true) {
    if (isNavigating) return true;

    const renameModal = document.getElementById('renameModal');
    const draculaEditorModal = document.getElementById('draculaEditorModal');
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const mediaPreviewModal = document.getElementById('mediaPreviewModal');
    const newFileModal = document.getElementById('newFileModal');
    const newFolderModal = document.getElementById('newFolderModal');
    const settingsModal = document.getElementById('settingsModal');
    const publicKeyModal = document.getElementById('publicKeyModal');
    const fabMenu = document.getElementById('fabMenu');
    const fabPlusIcon = document.getElementById('fabPlusIcon');

    if (renameModal && renameModal.open) {
        renameModal.close();
        return true;
    }

    const openModals = [draculaEditorModal, imagePreviewModal, mediaPreviewModal, newFileModal, newFolderModal, settingsModal, publicKeyModal];
    for (const modal of openModals) {
        if (modal && modal.open) {
            modal.close();
            return true;
        }
    }

    if (state.selectedFileNames && state.selectedFileNames.size > 0) {
        cancelSelectionMode(false);
        return true;
    }

    if (fabMenu && !fabMenu.classList.contains('hidden')) {
        fabMenu.classList.add('hidden');
        if (fabPlusIcon) fabPlusIcon.className = 'ri-add-line text-2xl';
        return true;
    }

    if (state.isPublicMode && state.currentPublicUser) {
        if (state.publicCurrentSubpath === '/' || state.publicCurrentSubpath === '') {
            exitPublicMode();
            return true;
        }
        const parts = state.publicCurrentSubpath.split('/').filter(Boolean);
        parts.pop();
        const parentSub = parts.length === 0 ? '/' : '/' + parts.join('/');
        navigateToPublic(state.currentPublicUser.clean_id, parentSub, pushHistory);
        return true;
    }

    if (state.currentPath === '/' || state.currentPath === '') return false;
    const parts = state.currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    navigateTo(parentPath, pushHistory);
    return true;
}

export function downloadFile(fileName) {
    if (state.isPublicMode && state.currentPublicUser) {
        const sub = state.publicCurrentSubpath || '/';
        const filePath = (sub.endsWith('/') ? sub : sub + '/') + fileName;
        const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
        const masterKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || '';
        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';

        // If public space is password protected and no verified key in session, prompt password modal
        if (state.currentPublicUser.has_key && !cachedKey && !state.isUserAdmin) {
            if (typeof window.promptPublicKeyModal === 'function') {
                window.promptPublicKeyModal({
                    userId: state.currentPublicUser.user_id,
                    cleanId: state.currentPublicUser.clean_id,
                    dirName: state.currentPublicUser.dir_name,
                    onSuccess: () => {
                        downloadFile(fileName);
                    }
                });
            }
            return;
        }

        let downloadUrl = `/api/public/download?user_id=${encodeURIComponent(state.currentPublicUser.clean_id)}&path=${encodeURIComponent(filePath)}`;
        if (cachedKey) {
            downloadUrl += `&key=${encodeURIComponent(cachedKey)}`;
        }
        if (masterKey) {
            downloadUrl += `&masterkey=${encodeURIComponent(masterKey)}`;
        }
        if (fp) {
            downloadUrl += `&fingerprint=${encodeURIComponent(fp)}`;
        }

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    const filePath = (state.currentPath.endsWith('/') ? state.currentPath : state.currentPath + '/') + fileName;
    const link = document.createElement('a');
    link.href = `/api/ftp/download?path=${encodeURIComponent(filePath)}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function deleteItem(fileName, isDir) {
    if (state.isPublicMode && state.currentPublicUser) {
        if (!confirm(`Are you sure you want to delete ${isDir ? 'folder' : 'file'} "${fileName}"?`)) return;
        const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
        try {
            const res = await apiFetch('/api/public/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: state.currentPublicUser.clean_id,
                    path: state.publicCurrentSubpath || '/',
                    itemName: fileName,
                    isDir: isDir,
                    key: pubKey
                })
            });
            const data = await res.json();
            if (data && data.success) {
                state.selectedFileNames.delete(fileName);
                updateBatchToolbar();
                setBottomStatus('connected', `Deleted ${fileName}`, state.publicCurrentSubpath);
                invalidateDirectoryCache();
                loadDirectory(true);
            } else {
                setBottomStatus('error', `Delete failed: ${data?.error || 'Unknown error'}`);
                showToast(`Delete failed: ${data?.error || 'Unknown error'}`, 'error');
            }
        } catch (err) {
            setBottomStatus('error', `Delete error: ${err.message}`);
            showToast(`Delete error: ${err.message}`, 'error');
        }
        return;
    }

    if (!state.isUserAdmin) {
        showToast('View only mode: deletion is disabled', 'warning');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${isDir ? 'folder' : 'file'} "${fileName}"?`)) return;

    const filePath = (state.currentPath.endsWith('/') ? state.currentPath : state.currentPath + '/') + fileName;
    try {
        const res = await apiFetch(`/api/ftp/delete?path=${encodeURIComponent(filePath)}&isDir=${isDir}&fingerprint=${encodeURIComponent(state.currentDeviceFingerprint || '')}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
            state.selectedFileNames.delete(fileName);
            updateBatchToolbar();
            setBottomStatus('connected', `Deleted ${fileName}`, state.currentPath);
            invalidateDirectoryCache();
            loadDirectory(true);
            updateStorageInfo(true);
        } else {
            setBottomStatus('error', `Delete failed: ${data.error}`);
        }
    } catch (err) {
        setBottomStatus('error', `Delete error: ${err.message}`);
    }
}

export function initFileManager() {
    const refreshBtn = document.getElementById('refreshBtn');
    const navUpBtn = document.getElementById('navUpBtn');
    const navRootBtn = document.getElementById('navRootBtn');
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const sortNameHeader = document.getElementById('sortNameHeader');
    const sortSizeHeader = document.getElementById('sortSizeHeader');
    const sortDateHeader = document.getElementById('sortDateHeader');
    const sortNameIcon = document.getElementById('sortNameIcon');
    const sortSizeIcon = document.getElementById('sortSizeIcon');
    const sortDateIcon = document.getElementById('sortDateIcon');
    const batchDownloadBtn = document.getElementById('batchDownloadBtn');
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    const batchCopyBtn = document.getElementById('batchCopyBtn');
    const batchCutBtn = document.getElementById('batchCutBtn');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const cancelClipboardBtn = document.getElementById('cancelClipboardBtn');

    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        invalidateDirectoryCache();
        loadDirectory(true);
    });
    if (navUpBtn) navUpBtn.addEventListener('click', goUpDirectory);
    if (navRootBtn) navRootBtn.addEventListener('click', () => navigateTo('/'));

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTable(e.target.value.trim());
        });
    }

    const setSort = (col) => {
        if (state.sortColumn === col) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortColumn = col;
            state.sortDirection = 'asc';
        }

        if (sortNameIcon) sortNameIcon.className = state.sortColumn === 'name' ? (state.sortDirection === 'asc' ? 'ri-arrow-up-line text-xs text-primary' : 'ri-arrow-down-line text-xs text-primary') : 'ri-arrow-up-down-line text-xs opacity-50';
        if (sortSizeIcon) sortSizeIcon.className = state.sortColumn === 'size' ? (state.sortDirection === 'asc' ? 'ri-arrow-up-line text-xs text-primary' : 'ri-arrow-down-line text-xs text-primary') : 'ri-arrow-up-down-line text-xs opacity-50';
        if (sortDateIcon) sortDateIcon.className = state.sortColumn === 'date' ? (state.sortDirection === 'asc' ? 'ri-arrow-up-line text-xs text-primary' : 'ri-arrow-down-line text-xs text-primary') : 'ri-arrow-up-down-line text-xs opacity-50';

        renderTable(searchInput ? searchInput.value.trim() : '');
    };

    if (sortNameHeader) sortNameHeader.addEventListener('click', () => setSort('name'));
    if (sortSizeHeader) sortSizeHeader.addEventListener('click', () => setSort('size'));
    if (sortDateHeader) sortDateHeader.addEventListener('click', () => setSort('date'));

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                const wasEmpty = state.selectedFileNames.size === 0;
                state.filesList.forEach(item => state.selectedFileNames.add(item.name));
                if (wasEmpty && state.filesList.length > 0) {
                    enterSelectionMode();
                }
            } else {
                state.selectedFileNames.clear();
                hasPushedSelectionHistory = false;
            }
            updateBatchToolbar();
            renderTable(searchInput ? searchInput.value.trim() : '');
        });
    }

    if (batchCopyBtn) batchCopyBtn.addEventListener('click', copySelectedItems);
    if (batchCutBtn) batchCutBtn.addEventListener('click', cutSelectedItems);
    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => {
        state.selectedFileNames.clear();
        hasPushedSelectionHistory = false;
        updateBatchToolbar();
        renderTable(searchInput ? searchInput.value.trim() : '');
    });
    if (pasteBtn) pasteBtn.addEventListener('click', pasteClipboardItems);
    if (cancelClipboardBtn) cancelClipboardBtn.addEventListener('click', () => {
        clipboardState = null;
        updateClipboardUI();
        showToast('Clipboard cleared', 'info');
    });

    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', async () => {
            const count = state.selectedFileNames.size;
            const isPublic = state.isPublicMode && Boolean(state.currentPublicUser);
            if (!state.isUserAdmin && !isPublic) {
                showToast('View only mode: Deletion is only allowed inside public space', 'warning');
                return;
            }

            if (!confirm(`Are you sure you want to delete ${count} selected item(s)?`)) return;

            const itemsToDelete = Array.from(state.selectedFileNames);
            cancelSelectionMode();
            let deletedCount = 0;

            if (state.isPublicMode && state.currentPublicUser) {
                const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
                for (const fileName of itemsToDelete) {
                    const item = state.filesList.find(f => f.name === fileName);
                    const isDir = item ? (item.type === 2 || item.isDirectory) : false;
                    try {
                        const res = await apiFetch('/api/public/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user_id: state.currentPublicUser.clean_id,
                                path: state.publicCurrentSubpath || '/',
                                itemName: fileName,
                                isDir: isDir,
                                key: pubKey
                            })
                        });
                        const data = await res.json();
                        if (data && data.success) {
                            deletedCount++;
                        }
                    } catch (e) {
                        console.error('Public batch delete error:', e);
                    }
                }
                showToast(`Deleted ${deletedCount} of ${count} items`, 'success');
                invalidateDirectoryCache();
                loadDirectory(true);
                return;
            }

            for (const fileName of itemsToDelete) {
                const item = state.filesList.find(f => f.name === fileName);
                const isDir = item ? (item.type === 2 || item.isDirectory) : false;
                const filePath = (state.currentPath.endsWith('/') ? state.currentPath : state.currentPath + '/') + fileName;

                try {
                    const res = await apiFetch(`/api/ftp/delete?path=${encodeURIComponent(filePath)}&isDir=${isDir}&fingerprint=${encodeURIComponent(state.currentDeviceFingerprint || '')}`, {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (data.success) {
                        deletedCount++;
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            showToast(`Deleted ${deletedCount} of ${count} items`, 'success');
            invalidateDirectoryCache();
            loadDirectory(true);
            updateStorageInfo(true);
        });
    }

    const activeZipJobs = new Map(); // jobId -> { pollInterval, cardElem }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function updateActiveProcessStatus() {
        const zipCount = activeZipJobs.size;
        if (zipCount > 0) {
            setBottomStatus('connecting', zipCount === 1 ? 'Creating ZIP archive...' : `Processing ${zipCount} ZIP archives...`, state.currentPath);
        } else {
            setBottomStatus('connected', 'Connected to Storage', state.currentPath);
        }
    }

    async function triggerZipArchive(itemsToDownload) {
        if (!Array.isArray(itemsToDownload) || itemsToDownload.length === 0) return;

        const zipProgressContainer = document.getElementById('zipProgressContainer');
        if (!zipProgressContainer) return;

        const titleText = itemsToDownload.length === 1 
            ? `Zipping "${itemsToDownload[0]}"...` 
            : `Zipping ${itemsToDownload.length} items...`;
        const fromDir = (state.isPublicMode && state.currentPublicUser) ? (state.publicCurrentSubpath || '/') : (state.currentPath || '/');

        let payload = { path: state.currentPath, files: itemsToDownload };
        if (state.isPublicMode && state.currentPublicUser) {
            const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
            payload = {
                user_id: state.currentPublicUser.clean_id,
                path: state.publicCurrentSubpath || '/',
                files: itemsToDownload,
                key: cachedKey
            };
        }

        try {
            const startRes = await apiFetch('/api/ftp/create-zip-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const startData = await startRes.json();
            if (!startData.success || !startData.jobId) {
                const errMsg = startData.error || 'Failed to start ZIP process';
                showToast(errMsg, 'error');
                setBottomStatus('error', errMsg);
                return;
            }

            const jobId = startData.jobId;
            const isInitialQueued = startData.status === 'queued';

            // Create dynamic floating card for this job instance
            const cardElem = document.createElement('div');
            cardElem.id = `zipJobCard_${jobId}`;
            cardElem.className = 'alert bg-base-100 border border-base-300 shadow-xl text-xs py-3 px-4 flex flex-col gap-2 z-[160] rounded-2xl animate-fadeIn';
            cardElem.innerHTML = `
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-2 min-w-0">
                    <i class="ri-file-zip-line text-warning text-base animate-pulse zip-icon"></i>
                    <span class="font-mono font-bold truncate text-xs text-base-content zip-title">${escapeHtml(titleText)}</span>
                    <span class="text-[10px] text-base-content/50 font-mono hidden sm:inline truncate">from ${escapeHtml(fromDir)}</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="badge ${isInitialQueued ? 'badge-warning/80' : 'badge-warning'} badge-sm font-mono text-[10px] font-bold zip-pct">${isInitialQueued ? 'Queued' : '0%'}</span>
                    <button class="btn btn-ghost btn-xs text-error gap-1 px-2 font-sans font-medium hover:bg-error/10 zip-cancel-btn" title="Cancel ZIP process">
                      <i class="ri-close-circle-line text-xs"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
                <div class="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                  <div class="zip-bar h-full ${isInitialQueued ? 'bg-warning/60 animate-pulse' : 'bg-warning'} rounded-full transition-all duration-200" style="width: ${isInitialQueued ? '100%' : '0%'}"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-base-content/60 font-mono w-full min-h-[18px]">
                  <span class="zip-bytes">${isInitialQueued ? 'Waiting in line for zipping slot...' : 'Preparing archive...'}</span>
                  <div class="flex items-center gap-2 ml-auto">
                    <span class="zip-speed flex items-center">${isInitialQueued ? 'In Queue' : 'Starting...'}</span>
                  </div>
                </div>
            `;

            zipProgressContainer.appendChild(cardElem);

            const zipPct = cardElem.querySelector('.zip-pct');
            const zipBar = cardElem.querySelector('.zip-bar');
            const zipBytes = cardElem.querySelector('.zip-bytes');
            const zipSpeed = cardElem.querySelector('.zip-speed');
            const zipCancelBtn = cardElem.querySelector('.zip-cancel-btn');

            const removeCard = (delayMs = 0) => {
                setTimeout(() => {
                    if (cardElem.parentNode) {
                        cardElem.parentNode.removeChild(cardElem);
                    }
                    activeZipJobs.delete(jobId);
                    updateActiveProcessStatus();
                }, delayMs);
            };

            if (zipCancelBtn) {
                zipCancelBtn.onclick = async () => {
                    if (!confirm('Are you sure you want to cancel this ZIP process?')) return;

                    const jobRecord = activeZipJobs.get(jobId);
                    if (jobRecord && jobRecord.pollInterval) {
                        clearInterval(jobRecord.pollInterval);
                    }

                    if (zipPct) zipPct.textContent = 'Cancelled';
                    if (zipBar) zipBar.className = 'zip-bar h-full bg-error/60 rounded-full';
                    if (zipSpeed) zipSpeed.textContent = 'Cancelling...';
                    zipCancelBtn.classList.add('hidden');

                    try {
                        await apiFetch('/api/ftp/cancel-zip-job', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ jobId })
                        });
                    } catch (e) {}

                    showToast('ZIP process cancelled', 'info');
                    removeCard(1200);
                };
            }

            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await apiFetch(`/api/ftp/zip-job-status?jobId=${encodeURIComponent(jobId)}`);
                    const statusData = await statusRes.json();

                    if (!statusData.success) {
                        clearInterval(pollInterval);
                        const errMsg = statusData.error || 'ZIP status error';
                        if (zipBar) zipBar.className = 'zip-bar h-full bg-error rounded-full';
                        if (zipSpeed) zipSpeed.textContent = errMsg;
                        if (zipPct) zipPct.textContent = 'Failed';
                        if (zipCancelBtn) zipCancelBtn.classList.add('hidden');
                        showToast(errMsg, 'error');
                        removeCard(3000);
                        return;
                    }

                    if (statusData.status === 'queued') {
                        const queuePos = statusData.queuePosition;
                        const queueBadge = queuePos > 0 ? `Queued (${queuePos} in line)` : 'Queued';
                        const queueMsg = statusData.currentFile || 'Waiting in line for zipping slot...';
                        if (zipPct) zipPct.textContent = queueBadge;
                        if (zipBar) {
                            zipBar.className = 'zip-bar h-full bg-warning/60 rounded-full animate-pulse';
                            zipBar.style.width = '100%';
                        }
                        if (zipBytes) {
                            zipBytes.classList.remove('hidden');
                            zipBytes.textContent = queueMsg;
                        }
                        if (zipSpeed) zipSpeed.textContent = 'In Queue';
                    } else if (statusData.status === 'processing') {
                        const pct = statusData.percentage || 0;
                        const current = statusData.current || 0;
                        const total = statusData.total || itemsToDownload.length;

                        if (pct >= 85) {
                            if (zipBytes) {
                                zipBytes.classList.add('hidden');
                                zipBytes.textContent = '';
                            }
                            if (zipSpeed) {
                                zipSpeed.innerHTML = '<span class="loading loading-spinner loading-xs text-warning inline-block align-middle mr-1"></span> Packing ZIP archive...';
                            }
                            if (zipPct) zipPct.textContent = 'Packing...';
                            if (zipBar) {
                                zipBar.className = 'zip-bar h-full bg-warning rounded-full transition-all duration-300 animate-pulse';
                                zipBar.style.width = '100%';
                            }
                        } else {
                            if (zipBytes) {
                                zipBytes.classList.remove('hidden');
                                zipBytes.textContent = `File ${current}/${total}`;
                            }
                            if (zipSpeed) {
                                zipSpeed.textContent = statusData.currentFile ? `Downloading ${statusData.currentFile}` : 'Processing...';
                            }
                            if (zipPct) zipPct.textContent = `${pct}%`;
                            if (zipBar) {
                                zipBar.className = 'zip-bar h-full bg-warning rounded-full transition-all duration-200';
                                zipBar.style.width = `${pct}%`;
                            }
                        }
                    } else if (statusData.status === 'done') {
                        clearInterval(pollInterval);
                        if (zipCancelBtn) zipCancelBtn.classList.add('hidden');
                        if (zipBytes) {
                            zipBytes.classList.add('hidden');
                            zipBytes.textContent = '';
                        }
                        if (zipPct) zipPct.textContent = '100%';
                        if (zipBar) {
                            zipBar.className = 'zip-bar h-full bg-success rounded-full';
                            zipBar.style.width = '100%';
                        }
                        if (zipSpeed) zipSpeed.textContent = 'Ready! Downloading...';

                        // Trigger download via hidden anchor element without interrupting window
                        const dlAnchor = document.createElement('a');
                        dlAnchor.href = statusData.downloadUrl;
                        dlAnchor.download = statusData.zipName || 'archive.zip';
                        document.body.appendChild(dlAnchor);
                        dlAnchor.click();
                        document.body.removeChild(dlAnchor);

                        removeCard(2500);
                    } else if (statusData.status === 'error') {
                        clearInterval(pollInterval);
                        if (zipCancelBtn) zipCancelBtn.classList.add('hidden');
                        const errMsg = statusData.error || 'Failed to generate ZIP';
                        if (zipBar) zipBar.className = 'zip-bar h-full bg-error rounded-full';
                        if (zipSpeed) zipSpeed.textContent = errMsg;
                        if (zipPct) zipPct.textContent = 'Failed';
                        showToast(errMsg, 'error');
                        removeCard(3000);
                    }
                } catch (pollErr) {
                    clearInterval(pollInterval);
                    if (zipCancelBtn) zipCancelBtn.classList.add('hidden');
                    showToast(`ZIP connection drop: ${pollErr.message}`, 'error');
                    removeCard(3000);
                }
            }, 400);

            activeZipJobs.set(jobId, { pollInterval, cardElem });
            updateActiveProcessStatus();
        } catch (err) {
            showToast(`ZIP job error: ${err.message}`, 'error');
        }
    }

    if (batchDownloadBtn) {
        batchDownloadBtn.addEventListener('click', async () => {
            const itemsToDownload = Array.from(state.selectedFileNames);
            if (itemsToDownload.length === 0) return;

            const hasFolderSelected = itemsToDownload.some(name => {
                const item = state.filesList.find(f => f.name === name);
                return item ? (item.type === 2 || item.isDirectory) : false;
            });

            const mode = getDownloadMode();

            // Cancel selection immediately once download action is pressed
            cancelSelectionMode();

            if (hasFolderSelected) {
                // If any folder is selected, zip archive is required
                triggerZipArchive(itemsToDownload);
            } else if (itemsToDownload.length === 1) {
                // Single file selected: direct download without creating zip archive
                downloadFile(itemsToDownload[0]);
            } else if (mode === 'zip') {
                // Multiple files with ZIP mode enabled
                triggerZipArchive(itemsToDownload);
            } else {
                // Multiple files individually
                for (let i = 0; i < itemsToDownload.length; i++) {
                    const fileName = itemsToDownload[i];
                    downloadFile(fileName);
                    if (i < itemsToDownload.length - 1) {
                        await new Promise(r => setTimeout(r, 400));
                    }
                }
            }
        });
    }

    window.toggleSelectRow = (fileName) => {
        const wasEmpty = state.selectedFileNames.size === 0;
        if (state.selectedFileNames.has(fileName)) {
            state.selectedFileNames.delete(fileName);
            if (state.selectedFileNames.size === 0) {
                hasPushedSelectionHistory = false;
            }
        } else {
            state.selectedFileNames.add(fileName);
            if (wasEmpty) {
                enterSelectionMode();
            }
        }
        updateBatchToolbar();
        renderTable(searchInput ? searchInput.value.trim() : '');
    };

    window.handleRowClick = (event, fileName, isDir, type, isVideo) => {
        // Prevent spam clicking while navigation or folder transition is in flight
        if (isNavigating) return;

        // 1. If clicking inside action buttons or checkbox, let their own handlers process it
        if (event && event.target && event.target.closest('.join, .join-item, button, input[type="checkbox"], a, label')) {
            return;
        }

        // 2. If in selection mode (at least 1 item selected), clicking ANYWHERE on the file/folder container toggles selection
        if (state.selectedFileNames && state.selectedFileNames.size > 0) {
            window.toggleSelectRow(fileName);
            return;
        }

        // 3. Public Mode handling:
        if (state.isPublicMode && state.currentPublicUser) {
            if (isDir) {
                const curSub = state.publicCurrentSubpath.endsWith('/') ? state.publicCurrentSubpath : state.publicCurrentSubpath + '/';
                const nextSub = curSub + fileName;
                navigateToPublic(state.currentPublicUser.clean_id, nextSub);
            } else if (type === 'text') {
                window.openCodeEditor(fileName);
            } else if (type === 'img') {
                window.openImagePreview(fileName);
            } else if (type === 'media') {
                window.openMediaPreview(fileName, isVideo);
            }
            return;
        }

        // 4. Standard Mode handling:
        if (isDir) {
            if (state.currentPath === '/public') {
                navigateToPublic(fileName, '/');
                return;
            }
            const pubFolderName = (state.publicModeConfig?.public_folder_name || 'public').trim().toLowerCase();
            if ((fileName.toLowerCase() === pubFolderName || fileName.toLowerCase() === 'public') && state.currentPath === '/') {
                if (state.isUserAdmin) {
                    navigateTo('/public');
                    return;
                }
                const myFp = (state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '').toLowerCase().replace(/^0x/, '');
                if (myFp) {
                    navigateToPublic(myFp, '/');
                    return;
                }
            }
            const currentDir = state.currentPath.endsWith('/') ? state.currentPath : state.currentPath + '/';
            const targetPath = currentDir + fileName;
            window.navigateTo(targetPath);
        } else if (type === 'text') {
            window.openCodeEditor(fileName);
        } else if (type === 'img') {
            window.openImagePreview(fileName);
        } else if (type === 'media') {
            window.openMediaPreview(fileName, isVideo);
        }
    };

    const cancelAllActiveZipJobs = () => {
        for (const [jobId, record] of activeZipJobs.entries()) {
            if (record && record.pollInterval) {
                clearInterval(record.pollInterval);
            }
            try {
                navigator.sendBeacon(`/api/ftp/cancel-zip-job?jobId=${encodeURIComponent(jobId)}`);
            } catch (e) {}
        }
    };

    window.addEventListener('beforeunload', cancelAllActiveZipJobs);
    window.addEventListener('pagehide', cancelAllActiveZipJobs);

    window.navigateTo = navigateTo;
    window.navigateToPublic = navigateToPublic;
    window.exitPublicMode = exitPublicMode;
    window.goUpDirectory = goUpDirectory;
    window.downloadFile = downloadFile;
    window.deleteItem = deleteItem;
}
