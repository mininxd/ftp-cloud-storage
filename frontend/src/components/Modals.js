// Modals & Action Dialogs Component
import { state, getDownloadMode } from '../lib/state.js';
import { showToast, setBottomStatus } from '../lib/utils.js';
import { apiFetch } from '../lib/api.js';
import { loadDirectory, updateBatchToolbar, invalidateDirectoryCache } from './FileManager.js';
import { updateStorageInfo } from './StorageWidget.js';

export function openRenameModal(fileName) {
    const renameModal = document.getElementById('renameModal');
    const renameOldPathInput = document.getElementById('renameOldPathInput');
    const renameNewNameInput = document.getElementById('renameNewNameInput');

    const basePath = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
    const filePath = (basePath.endsWith('/') ? basePath : basePath + '/') + fileName;
    if (renameOldPathInput) renameOldPathInput.value = filePath;
    if (renameNewNameInput) renameNewNameInput.value = fileName;
    if (renameModal) renameModal.showModal();
    if (renameNewNameInput) {
        setTimeout(() => {
            renameNewNameInput.focus();
            const dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > 0) {
                renameNewNameInput.setSelectionRange(0, dotIndex);
            } else {
                renameNewNameInput.select();
            }
        }, 100);
    }
}

export function initModals() {
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    const fabMenu = document.getElementById('fabMenu');
    const fabPlusIcon = document.getElementById('fabPlusIcon');

    const openNewFileModalBtn = document.getElementById('openNewFileModalBtn');
    const openNewFolderModalBtn = document.getElementById('openNewFolderModalBtn');
    const newFileModal = document.getElementById('newFileModal');
    const newFileNameInput = document.getElementById('newFileNameInput');
    const newFileContentInput = document.getElementById('newFileContentInput');
    const submitNewFileBtn = document.getElementById('submitNewFileBtn');

    const newFolderModal = document.getElementById('newFolderModal');
    const newFolderNameInput = document.getElementById('newFolderNameInput');
    const submitNewFolderBtn = document.getElementById('submitNewFolderBtn');

    const renameModal = document.getElementById('renameModal');
    const renameOldPathInput = document.getElementById('renameOldPathInput');
    const renameNewNameInput = document.getElementById('renameNewNameInput');
    const submitRenameBtn = document.getElementById('submitRenameBtn');
    const cancelRenameBtn = document.getElementById('cancelRenameBtn');

    const radioDownloadZip = document.getElementById('radioDownloadZip');
    const radioDownloadIndividual = document.getElementById('radioDownloadIndividual');

    const welcomeSetupModal = document.getElementById('welcomeSetupModal');
    const welcomeCopyUserIdBtn = document.getElementById('welcomeCopyUserIdBtn');
    const welcomeClaimAdminBtn = document.getElementById('welcomeClaimAdminBtn');
    const welcomeDismissBtn = document.getElementById('welcomeDismissBtn');

    // FAB Toggle
    if (fabTriggerBtn) {
        fabTriggerBtn.addEventListener('click', () => {
            const isClosed = fabMenu ? fabMenu.classList.contains('hidden') : true;
            if (isClosed) {
                if (fabMenu) fabMenu.classList.remove('hidden');
                if (fabPlusIcon) fabPlusIcon.className = 'ri-close-line text-2xl';
            } else {
                if (fabMenu) fabMenu.classList.add('hidden');
                if (fabPlusIcon) fabPlusIcon.className = 'ri-add-line text-2xl';
            }
        });
    }

    // Modal Openers
    if (openNewFileModalBtn) {
        openNewFileModalBtn.addEventListener('click', () => {
            if (fabMenu) fabMenu.classList.add('hidden');
            if (fabPlusIcon) fabPlusIcon.className = 'ri-add-line text-2xl';
            if (newFileNameInput) newFileNameInput.value = '';
            if (newFileContentInput) newFileContentInput.value = '';
            if (newFileModal) newFileModal.showModal();
        });
    }

    if (openNewFolderModalBtn) {
        openNewFolderModalBtn.addEventListener('click', () => {
            if (fabMenu) fabMenu.classList.add('hidden');
            if (fabPlusIcon) fabPlusIcon.className = 'ri-add-line text-2xl';
            if (newFolderNameInput) newFolderNameInput.value = '';
            if (newFolderModal) newFolderModal.showModal();
        });
    }

    // Create New File Submit
    if (submitNewFileBtn) {
        submitNewFileBtn.addEventListener('click', async () => {
            const filename = newFileNameInput ? newFileNameInput.value.trim() : '';
            const content = newFileContentInput ? newFileContentInput.value : '';
            if (!filename) {
                showToast('Filename is required', 'warning');
                return;
            }

            try {
                if (state.isPublicMode && state.currentPublicUser) {
                    const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const file = new File([blob], filename, { type: 'text/plain' });
                    const formData = new FormData();
                    formData.append('user_id', state.currentPublicUser.clean_id);
                    formData.append('subpath', state.publicCurrentSubpath || '/');
                    if (pubKey) formData.append('key', pubKey);
                    formData.append('file', file);

                    const res = await apiFetch('/api/public/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        if (newFileModal) newFileModal.close();
                        showToast(`Created file "${filename}"`, 'success');
                        setBottomStatus('connected', `Created file "${filename}"`, state.publicCurrentSubpath);
                        invalidateDirectoryCache();
                        loadDirectory(true);
                    } else {
                        showToast(data?.error || 'Failed to create file', 'error');
                    }
                    return;
                }

                const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
                const res = await apiFetch('/api/ftp/create-file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: state.currentPath,
                        filename,
                        content,
                        fingerprint: fp
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    if (newFileModal) newFileModal.close();
                    showToast(`Created file "${filename}"`, 'success');
                    setBottomStatus('connected', `Created file "${filename}"`, state.currentPath);
                    invalidateDirectoryCache();
                    loadDirectory(true);
                    updateStorageInfo(true);
                } else {
                    showToast(data?.error || 'Failed to create file', 'error');
                }
            } catch (err) {
                showToast(err?.message || 'Error creating file', 'error');
            }
        });
    }

    if (newFileNameInput) {
        newFileNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (submitNewFileBtn) submitNewFileBtn.click();
            }
        });
    }

    // Create New Folder Submit
    if (submitNewFolderBtn) {
        submitNewFolderBtn.addEventListener('click', async () => {
            const dirname = newFolderNameInput ? newFolderNameInput.value.trim() : '';
            if (!dirname) {
                showToast('Folder name is required', 'warning');
                return;
            }

            try {
                if (state.isPublicMode && state.currentPublicUser) {
                    const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
                    const res = await apiFetch('/api/public/mkdir', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: state.currentPublicUser.clean_id,
                            path: state.publicCurrentSubpath || '/',
                            folderName: dirname,
                            key: pubKey
                        })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        if (newFolderModal) newFolderModal.close();
                        showToast(`Created folder "${dirname}"`, 'success');
                        setBottomStatus('connected', `Created folder "${dirname}"`, state.publicCurrentSubpath);
                        invalidateDirectoryCache();
                        loadDirectory(true);
                    } else {
                        showToast(data?.error || 'Failed to create folder', 'error');
                    }
                    return;
                }

                const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
                const res = await apiFetch('/api/ftp/mkdir', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: state.currentPath,
                        dirname,
                        fingerprint: fp
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    if (newFolderModal) newFolderModal.close();
                    showToast(`Created folder "${dirname}"`, 'success');
                    setBottomStatus('connected', `Created folder "${dirname}"`, state.currentPath);
                    invalidateDirectoryCache();
                    loadDirectory(true);
                    updateStorageInfo(true);
                } else {
                    showToast(data?.error || 'Failed to create folder', 'error');
                }
            } catch (err) {
                showToast(err?.message || 'Error creating folder', 'error');
            }
        });
    }

    if (newFolderNameInput) {
        newFolderNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (submitNewFolderBtn) submitNewFolderBtn.click();
            }
        });
    }

    // Rename Submit
    if (submitRenameBtn) {
        submitRenameBtn.addEventListener('click', async () => {
            const oldPath = renameOldPathInput ? renameOldPathInput.value : '';
            const newName = renameNewNameInput ? renameNewNameInput.value.trim() : '';
            if (!newName) {
                showToast('New name is required', 'warning');
                return;
            }
            if (!oldPath) {
                showToast('Old file path is missing', 'warning');
                return;
            }

            const lastSlash = oldPath.lastIndexOf('/');
            const dir = lastSlash <= 0 ? '/' : oldPath.substring(0, lastSlash);
            const newPath = (dir.endsWith('/') ? dir : dir + '/') + newName;
            const oldName = oldPath.split('/').pop();

            if (oldName === newName) {
                if (renameModal) renameModal.close();
                return;
            }

            try {
                submitRenameBtn.disabled = true;

                if (state.isPublicMode && state.currentPublicUser) {
                    const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
                    const res = await apiFetch('/api/public/rename', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: state.currentPublicUser.clean_id,
                            path: state.publicCurrentSubpath || '/',
                            oldName: oldName,
                            newName: newName,
                            key: pubKey
                        })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        if (state.selectedFileNames.has(oldName)) {
                            state.selectedFileNames.delete(oldName);
                            state.selectedFileNames.add(newName);
                            updateBatchToolbar();
                        }
                        if (renameModal) renameModal.close();
                        showToast(`Renamed "${oldName}" to "${newName}"`, 'success');
                        setBottomStatus('connected', `Renamed to "${newName}"`, state.publicCurrentSubpath);
                        invalidateDirectoryCache();
                        loadDirectory(true);
                    } else {
                        showToast(`Rename failed: ${data?.error || 'Unknown error'}`, 'error');
                    }
                    return;
                }

                const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
                const res = await apiFetch('/api/ftp/rename', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        oldPath,
                        newPath,
                        fingerprint: fp
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    if (state.selectedFileNames.has(oldName)) {
                        state.selectedFileNames.delete(oldName);
                        state.selectedFileNames.add(newName);
                        updateBatchToolbar();
                    }
                    if (renameModal) renameModal.close();
                    showToast(`Renamed "${oldName}" to "${newName}"`, 'success');
                    setBottomStatus('connected', `Renamed to "${newName}"`, state.currentPath);
                    invalidateDirectoryCache();
                    loadDirectory(true);
                    updateStorageInfo(true);
                } else {
                    showToast(`Rename failed: ${data?.error || 'Unknown error'}`, 'error');
                }
            } catch (err) {
                showToast(`Rename error: ${err?.message || 'Unknown error'}`, 'error');
            } finally {
                if (submitRenameBtn) submitRenameBtn.disabled = false;
            }
        });
    }

    if (cancelRenameBtn) {
        cancelRenameBtn.addEventListener('click', () => {
            if (renameModal) renameModal.close();
        });
    }

    if (renameModal) {
        renameModal.addEventListener('cancel', (e) => {
            e.preventDefault();
        });
    }

    if (renameNewNameInput) {
        renameNewNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (submitRenameBtn) submitRenameBtn.click();
            }
        });
    }

    // Radio Download Mode
    if (radioDownloadZip) {
        radioDownloadZip.addEventListener('change', () => {
            localStorage.setItem('mininxd_download_mode', 'zip');
            updateBatchToolbar();
            showToast('Multi-select download mode: ZIP Archive', 'info');
        });
    }
    if (radioDownloadIndividual) {
        radioDownloadIndividual.addEventListener('change', () => {
            localStorage.setItem('mininxd_download_mode', 'individual');
            updateBatchToolbar();
            showToast('Multi-select download mode: Individual Files', 'info');
        });
    }

    // Welcome Setup Modal Listeners
    if (welcomeCopyUserIdBtn) {
        welcomeCopyUserIdBtn.addEventListener('click', () => {
            const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
            if (fp) {
                navigator.clipboard.writeText(fp).then(() => {
                    showToast('User ID copied to clipboard', 'success');
                }).catch(() => {
                    showToast(fp, 'info');
                });
            }
        });
    }

    if (welcomeDismissBtn && welcomeSetupModal) {
        welcomeDismissBtn.addEventListener('click', () => {
            try {
                localStorage.setItem('mininxd_welcome_dismissed', 'true');
                sessionStorage.setItem('mininxd_welcome_dismissed', 'true');
            } catch (e) {}
            welcomeSetupModal.close();
        });
    }

    if (welcomeSetupModal) {
        welcomeSetupModal.addEventListener('close', () => {
            try {
                localStorage.setItem('mininxd_welcome_dismissed', 'true');
                sessionStorage.setItem('mininxd_welcome_dismissed', 'true');
            } catch (e) {}
        });
    }

    if (welcomeClaimAdminBtn) {
        welcomeClaimAdminBtn.addEventListener('click', async () => {
            const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
            const welcomeMasterKeyInput = document.getElementById('welcomeMasterKeyInput');
            const masterKey = welcomeMasterKeyInput ? welcomeMasterKeyInput.value.trim() : '';

            if (!fp) return;
            if (!masterKey) {
                showToast('Master Key is required to create your administrator account', 'warning');
                if (welcomeMasterKeyInput) welcomeMasterKeyInput.focus();
                return;
            }

            welcomeClaimAdminBtn.disabled = true;
            try {
                const res = await apiFetch('/api/add_admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userid: fp,
                        masterkey: masterKey
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    if (masterKey) {
                        try {
                            localStorage.setItem('mininxd_master_key', masterKey);
                            state.currentMasterKey = masterKey;
                        } catch (e) {}
                    }
                    showToast('This device has been configured as Admin! Reloading...', 'success');
                    setTimeout(() => {
                        window.location.href = `/${fp}`;
                    }, 800);
                } else {
                    showToast(`Failed: ${data?.error || 'Error setting admin'}`, 'error');
                    welcomeClaimAdminBtn.disabled = false;
                }
            } catch (err) {
                showToast(`Error: ${err?.message || 'Error'}`, 'error');
                welcomeClaimAdminBtn.disabled = false;
            }
        });
    }

    window.openRenameModal = openRenameModal;
}

export function promptAdminMasterKeyModal({ onSuccess, onCancel } = {}) {
    const adminMasterKeyModal = document.getElementById('adminMasterKeyModal');
    const adminMasterKeyModalInput = document.getElementById('adminMasterKeyModalInput');
    const adminMasterKeyForm = document.getElementById('adminMasterKeyForm');
    const adminMasterKeyCancelBtn = document.getElementById('adminMasterKeyCancelBtn');
    const adminMasterKeySubmitBtn = document.getElementById('adminMasterKeySubmitBtn');

    if (!adminMasterKeyModal) return;

    if (adminMasterKeyModalInput) {
        adminMasterKeyModalInput.value = '';
    }

    const cleanup = () => {
        if (adminMasterKeyForm) adminMasterKeyForm.onsubmit = null;
        if (adminMasterKeyCancelBtn) adminMasterKeyCancelBtn.onclick = null;
    };

    if (adminMasterKeyCancelBtn) {
        adminMasterKeyCancelBtn.onclick = () => {
            cleanup();
            try { adminMasterKeyModal.close(); } catch (e) {}
            if (typeof onCancel === 'function') onCancel();
        };
    }

    if (adminMasterKeyForm) {
        adminMasterKeyForm.onsubmit = async (e) => {
            e.preventDefault();
            const key = adminMasterKeyModalInput ? adminMasterKeyModalInput.value.trim() : '';
            if (!key) {
                showToast('Please enter the Master Key', 'warning');
                return;
            }
            if (adminMasterKeySubmitBtn) adminMasterKeySubmitBtn.disabled = true;
            try {
                const res = await apiFetch('/api/verify_masterkey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ masterkey: key })
                });
                const data = await res.json();
                if (data && data.success) {
                    try {
                        localStorage.setItem('mininxd_master_key', key);
                        state.currentMasterKey = key;
                    } catch (e) {}
                    showToast('Master Key verified! Admin permissions unlocked.', 'success');
                    cleanup();
                    try { adminMasterKeyModal.close(); } catch (e) {}
                    if (typeof onSuccess === 'function') onSuccess();
                } else {
                    showToast(`Invalid Master Key: ${data?.error || 'Authorization failed'}`, 'error');
                }
            } catch (err) {
                showToast(`Verification error: ${err.message}`, 'error');
            } finally {
                if (adminMasterKeySubmitBtn) adminMasterKeySubmitBtn.disabled = false;
            }
        };
    }

    try {
        adminMasterKeyModal.showModal();
        setTimeout(() => {
            if (adminMasterKeyModalInput) adminMasterKeyModalInput.focus();
        }, 150);
    } catch (e) {}
}

export function promptPublicKeyModal({ userId, cleanId, dirName, onSuccess, onCancel } = {}) {
    const publicKeyModal = document.getElementById('publicKeyModal');
    const publicKeyModalSubtitle = document.getElementById('publicKeyModalSubtitle');
    const publicKeyModalPromptText = document.getElementById('publicKeyModalPromptText');
    const publicKeyModalInput = document.getElementById('publicKeyModalInput');
    const publicKeyModalForm = document.getElementById('publicKeyModalForm');
    const publicKeyModalCancelBtn = document.getElementById('publicKeyModalCancelBtn');
    const publicKeyModalSubmitBtn = document.getElementById('publicKeyModalSubmitBtn');
    const togglePublicKeyVisibilityBtn = document.getElementById('togglePublicKeyVisibilityBtn');
    const togglePublicKeyIcon = document.getElementById('togglePublicKeyIcon');

    if (!publicKeyModal) return;

    if (publicKeyModalSubtitle) {
        publicKeyModalSubtitle.textContent = `Directory: ${dirName || cleanId} (${cleanId})`;
    }
    if (publicKeyModalPromptText) {
        publicKeyModalPromptText.textContent = `Access to public directory "${dirName || cleanId}" is protected. Please enter the password or key to continue.`;
    }
    if (publicKeyModalInput) {
        publicKeyModalInput.value = '';
        publicKeyModalInput.type = 'password';
    }
    if (togglePublicKeyIcon) {
        togglePublicKeyIcon.className = 'ri-eye-line text-xs';
    }

    if (togglePublicKeyVisibilityBtn && publicKeyModalInput && togglePublicKeyIcon) {
        togglePublicKeyVisibilityBtn.onclick = () => {
            const isPassword = publicKeyModalInput.type === 'password';
            publicKeyModalInput.type = isPassword ? 'text' : 'password';
            togglePublicKeyIcon.className = isPassword ? 'ri-eye-off-line text-xs' : 'ri-eye-line text-xs';
        };
    }

    const cleanup = () => {
        if (publicKeyModalForm) publicKeyModalForm.onsubmit = null;
        if (publicKeyModalCancelBtn) publicKeyModalCancelBtn.onclick = null;
    };

    if (publicKeyModalCancelBtn) {
        publicKeyModalCancelBtn.onclick = () => {
            cleanup();
            try { publicKeyModal.close(); } catch (e) {}
            if (typeof onCancel === 'function') onCancel();
        };
    }

    if (publicKeyModalForm) {
        publicKeyModalForm.onsubmit = async (e) => {
            e.preventDefault();
            const key = publicKeyModalInput ? publicKeyModalInput.value.trim() : '';
            if (!key) {
                showToast('Please enter the password / key', 'warning');
                return;
            }
            if (publicKeyModalSubmitBtn) publicKeyModalSubmitBtn.disabled = true;

            try {
                const res = await apiFetch('/api/public/verify-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: cleanId, key: key })
                });
                const data = await res.json();
                if (data && data.success && data.valid) {
                    try {
                        sessionStorage.setItem('mininxd_pub_key_' + cleanId, key);
                    } catch (e) {}
                    showToast('Access Key verified! Public space unlocked.', 'success');
                    cleanup();
                    try { publicKeyModal.close(); } catch (e) {}
                    if (typeof onSuccess === 'function') onSuccess(key);
                } else {
                    showToast(data?.error || 'Invalid key or password', 'error');
                }
            } catch (err) {
                showToast(`Verification error: ${err.message}`, 'error');
            } finally {
                if (publicKeyModalSubmitBtn) publicKeyModalSubmitBtn.disabled = false;
            }
        };
    }

    try {
        publicKeyModal.showModal();
        setTimeout(() => {
            if (publicKeyModalInput) publicKeyModalInput.focus();
        }, 150);
    } catch (e) {}
}

export function promptPublicSetPasswordModal({ user, onSuccess, onCancel } = {}) {
    const modal = document.getElementById('publicSetPasswordModal');
    const modalTitle = document.getElementById('publicSetPasswordModalTitle');
    const modalSubtitle = document.getElementById('publicSetPasswordModalSubtitle');
    const modalDesc = document.getElementById('publicSetPasswordModalDesc');
    const form = document.getElementById('publicSetPasswordForm');
    const currentGroup = document.getElementById('publicCurrentPasswordGroup');
    const currentInput = document.getElementById('publicCurrentPasswordInput');
    const toggleCurrentVisBtn = document.getElementById('toggleCurrentPasswordVisBtn');
    const toggleCurrentIcon = document.getElementById('toggleCurrentPasswordIcon');
    const newLabel = document.getElementById('publicNewPasswordLabel');
    const newInput = document.getElementById('publicNewPasswordInput');
    const toggleNewVisBtn = document.getElementById('toggleNewPasswordVisBtn');
    const toggleNewIcon = document.getElementById('toggleNewPasswordIcon');
    const removeBtn = document.getElementById('publicRemovePasswordBtn');
    const cancelBtn = document.getElementById('publicSetPasswordCancelBtn');
    const submitBtn = document.getElementById('publicSetPasswordSubmitBtn');

    if (!modal || !user) return;

    const hasExistingKey = Boolean(user.has_key);

    if (modalTitle) modalTitle.textContent = hasExistingKey ? 'Change Public Password' : 'Add Public Password';
    if (modalSubtitle) modalSubtitle.textContent = `User ID: ${user.clean_id}`;
    if (modalDesc) {
        modalDesc.textContent = hasExistingKey 
            ? 'Enter your current password and the new password below, or click Remove to make this folder open access.'
            : 'Set a password to protect and control access to your folder.';
    }

    if (currentGroup) {
        if (hasExistingKey) {
            currentGroup.classList.remove('hidden');
            if (currentInput) {
                currentInput.value = '';
                currentInput.type = 'password';
            }
        } else {
            currentGroup.classList.add('hidden');
            if (currentInput) currentInput.value = '';
        }
    }

    if (newLabel) newLabel.textContent = hasExistingKey ? 'New Password' : 'Password';
    if (newInput) {
        newInput.value = '';
        newInput.type = 'password';
        newInput.placeholder = hasExistingKey ? 'Enter new password...' : 'Enter password...';
    }

    if (removeBtn) {
        if (hasExistingKey) {
            removeBtn.classList.remove('hidden');
        } else {
            removeBtn.classList.add('hidden');
        }
    }

    if (toggleCurrentVisBtn && currentInput && toggleCurrentIcon) {
        toggleCurrentIcon.className = 'ri-eye-line text-xs';
        toggleCurrentVisBtn.onclick = () => {
            const isPass = currentInput.type === 'password';
            currentInput.type = isPass ? 'text' : 'password';
            toggleCurrentIcon.className = isPass ? 'ri-eye-off-line text-xs' : 'ri-eye-line text-xs';
        };
    }

    if (toggleNewVisBtn && newInput && toggleNewIcon) {
        toggleNewIcon.className = 'ri-eye-line text-xs';
        toggleNewVisBtn.onclick = () => {
            const isPass = newInput.type === 'password';
            newInput.type = isPass ? 'text' : 'password';
            toggleNewIcon.className = isPass ? 'ri-eye-off-line text-xs' : 'ri-eye-line text-xs';
        };
    }

    const cleanup = () => {
        if (form) form.onsubmit = null;
        if (cancelBtn) cancelBtn.onclick = null;
        if (removeBtn) removeBtn.onclick = null;
    };

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            cleanup();
            try { modal.close(); } catch (e) {}
            if (typeof onCancel === 'function') onCancel();
        };
    }

    if (removeBtn) {
        removeBtn.onclick = async () => {
            const curKey = currentInput ? currentInput.value.trim() : '';
            if (hasExistingKey && !curKey) {
                showToast('Please enter your current password to remove protection', 'warning');
                if (currentInput) currentInput.focus();
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (removeBtn) removeBtn.disabled = true;

            try {
                const res = await apiFetch('/api/public/set-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        current_key: curKey,
                        new_key: ''
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    try { sessionStorage.removeItem('mininxd_pub_key_' + user.clean_id); } catch (e) {}
                    showToast('Password protection removed! Folder is now open access.', 'success');
                    cleanup();
                    try { modal.close(); } catch (e) {}
                    if (typeof onSuccess === 'function') onSuccess(false);
                } else {
                    showToast(data?.error || 'Failed to remove password', 'error');
                }
            } catch (err) {
                showToast(`Error: ${err.message}`, 'error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (removeBtn) removeBtn.disabled = false;
            }
        };
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const curKey = currentInput ? currentInput.value.trim() : '';
            const newKey = newInput ? newInput.value.trim() : '';

            if (hasExistingKey && !curKey) {
                showToast('Please enter your current password', 'warning');
                if (currentInput) currentInput.focus();
                return;
            }
            if (!newKey) {
                showToast('Please enter a password', 'warning');
                if (newInput) newInput.focus();
                return;
            }

            if (submitBtn) submitBtn.disabled = true;

            try {
                const res = await apiFetch('/api/public/set-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        current_key: curKey,
                        new_key: newKey
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    try { sessionStorage.setItem('mininxd_pub_key_' + user.clean_id, newKey); } catch (e) {}
                    showToast('Public space password updated successfully!', 'success');
                    cleanup();
                    try { modal.close(); } catch (e) {}
                    if (typeof onSuccess === 'function') onSuccess(true);
                } else {
                    showToast(data?.error || 'Failed to update password', 'error');
                }
            } catch (err) {
                showToast(`Error: ${err.message}`, 'error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        };
    }

    try {
        modal.showModal();
        setTimeout(() => {
            if (hasExistingKey && currentInput) currentInput.focus();
            else if (newInput) newInput.focus();
        }, 150);
    } catch (e) {}
}

window.promptPublicKeyModal = promptPublicKeyModal;
window.promptPublicSetPasswordModal = promptPublicSetPasswordModal;

export function openPinModal(itemName, currentBadge = null) {
    const pinModal = document.getElementById('pinModal');
    const pinModalTitle = document.getElementById('pinModalTitle');
    const pinModalItemName = document.getElementById('pinModalItemName');
    const pinBadgeTextInput = document.getElementById('pinBadgeTextInput');
    const unpinItemBtn = document.getElementById('unpinItemBtn');
    const pinSubmitBtnText = document.getElementById('pinSubmitBtnText');
    const pinCancelBtn = document.getElementById('pinCancelBtn');
    const pinForm = document.getElementById('pinForm');
    const pinSubmitBtn = document.getElementById('pinSubmitBtn');

    if (!pinModal) return;

    const basePath = state.isPublicMode && state.currentPublicUser ? (state.currentPublicUser.dir_name || ('public/' + state.currentPublicUser.clean_id)) : state.currentPath;
    const subpath = state.isPublicMode ? (state.publicCurrentSubpath || '/') : '';
    const fullDir = state.isPublicMode ? (subpath === '/' ? basePath : (basePath + subpath)) : basePath;
    const itemFullPath = (fullDir.endsWith('/') ? fullDir : fullDir + '/') + itemName;

    const isCurrentlyPinned = currentBadge !== null && currentBadge !== undefined;

    if (pinModalTitle) pinModalTitle.textContent = isCurrentlyPinned ? 'Edit Pin' : 'Pin Item';
    if (pinModalItemName) pinModalItemName.textContent = itemName;
    if (pinBadgeTextInput) pinBadgeTextInput.value = isCurrentlyPinned ? String(currentBadge || '') : '';
    if (pinSubmitBtnText) pinSubmitBtnText.textContent = isCurrentlyPinned ? 'Update Pin' : 'Pin Item';

    if (unpinItemBtn) {
        if (isCurrentlyPinned) {
            unpinItemBtn.classList.remove('hidden');
            unpinItemBtn.onclick = async () => {
                try {
                    unpinItemBtn.disabled = true;
                    const res = await apiFetch('/api/pins/remove', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: itemFullPath })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        showToast(`Unpinned "${itemName}"`, 'info');
                        pinModal.close();
                        invalidateDirectoryCache();
                        loadDirectory(true);
                    } else {
                        showToast(`Failed to unpin: ${data?.error || 'Unknown error'}`, 'error');
                    }
                } catch (e) {
                    showToast(`Unpin error: ${e.message}`, 'error');
                } finally {
                    unpinItemBtn.disabled = false;
                }
            };
        } else {
            unpinItemBtn.classList.add('hidden');
        }
    }

    if (pinCancelBtn) {
        pinCancelBtn.onclick = () => pinModal.close();
    }

    if (pinForm) {
        pinForm.onsubmit = async (e) => {
            if (e) e.preventDefault();
            const badgeText = pinBadgeTextInput ? pinBadgeTextInput.value.trim() : '';
            try {
                if (pinSubmitBtn) pinSubmitBtn.disabled = true;
                const res = await apiFetch('/api/pins/set', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: itemFullPath,
                        badge_text: badgeText
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    showToast(isCurrentlyPinned ? `Updated pin for "${itemName}"` : `Pinned "${itemName}"`, 'success');
                    pinModal.close();
                    invalidateDirectoryCache();
                    loadDirectory(true);
                } else {
                    showToast(`Failed to pin: ${data?.error || 'Unknown error'}`, 'error');
                }
            } catch (err) {
                showToast(`Pin error: ${err.message}`, 'error');
            } finally {
                if (pinSubmitBtn) pinSubmitBtn.disabled = false;
            }
        };
    }

    pinModal.showModal();
    if (pinBadgeTextInput) {
        setTimeout(() => pinBadgeTextInput.focus(), 150);
    }
}

window.openPinModal = openPinModal;


