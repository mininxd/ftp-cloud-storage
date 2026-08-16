// Admin Console Component
import { state } from '../lib/state.js';
import { showToast, formatDate } from '../lib/utils.js';
import { apiFetch } from '../lib/api.js';
import { isUserscriptEnvironment } from '../lib/security.js';

export function updateDeviceAuthBadge(isAdmin, fp) {
    const settingsUserIdDisplay = document.getElementById('settingsUserIdDisplay');
    if (settingsUserIdDisplay && fp) {
        settingsUserIdDisplay.textContent = fp;
        settingsUserIdDisplay.title = fp;
    }
}

export function applyAdminPermissionsUI() {
    if (isUserscriptEnvironment()) {
        state.isUserAdmin = false;
    }

    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    const fabMenu = document.getElementById('fabMenu');
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    const batchCopyBtn = document.getElementById('batchCopyBtn');
    const batchCutBtn = document.getElementById('batchCutBtn');
    const saveEditorFileBtn = document.getElementById('saveEditorFileBtn');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const isAdminDashboardActive = adminDashboardView && !adminDashboardView.classList.contains('hidden');

    const canWrite = (state.isUserAdmin || state.isPublicMode) && !isAdminDashboardActive;

    if (fabTriggerBtn) {
        if (canWrite) {
            fabTriggerBtn.classList.remove('hidden');
        } else {
            fabTriggerBtn.classList.add('hidden');
            if (fabMenu) fabMenu.classList.add('hidden');
        }
    }
    if (batchDeleteBtn) {
        if (state.isUserAdmin || state.isPublicMode) {
            batchDeleteBtn.classList.remove('hidden');
            if (batchCopyBtn) batchCopyBtn.classList.remove('hidden');
            if (batchCutBtn) batchCutBtn.classList.remove('hidden');
        } else {
            batchDeleteBtn.classList.add('hidden');
            if (batchCopyBtn) batchCopyBtn.classList.add('hidden');
            if (batchCutBtn) batchCutBtn.classList.add('hidden');
        }
    }
    if (saveEditorFileBtn) {
        if (state.isUserAdmin || state.isPublicMode) {
            saveEditorFileBtn.classList.remove('hidden');
        } else {
            saveEditorFileBtn.classList.add('hidden');
        }
    }
}

export async function loadAdminData() {
    const adminRefreshIcon = document.getElementById('adminRefreshIcon');
    const adminCurrentUserIdDisplay = document.getElementById('adminCurrentUserIdDisplay');
    const adminStatTotalUsers = document.getElementById('adminStatTotalUsers');
    const adminStatTotalAdmins = document.getElementById('adminStatTotalAdmins');
    const adminStatStorageText = document.getElementById('adminStatStorageText');
    const adminStatStorageBar = document.getElementById('adminStatStorageBar');

    if (adminRefreshIcon) adminRefreshIcon.classList.add('animate-spin');
    if (adminCurrentUserIdDisplay) {
        adminCurrentUserIdDisplay.textContent = `User ID: ${state.currentDeviceFingerprint || 'Unknown'}`;
    }

    try {
        const res = await apiFetch('/api/list_user');
        const users = await res.json();

        if (Array.isArray(users)) {
            state.adminUserList = users;
            const totalCount = users.length;
            const adminCount = users.filter(u => u.roles === 'admin' || u.isAdmin === true).length;

            if (adminStatTotalUsers) adminStatTotalUsers.textContent = totalCount;
            if (adminStatTotalAdmins) adminStatTotalAdmins.textContent = adminCount;

            renderAdminUsersTable();
        }

        // Refresh storage stats for admin card
        const storageRes = await apiFetch('/api/ftp/storage-info');
        const storageData = await storageRes.json();
        if (storageData.success) {
            if (adminStatStorageText) {
                adminStatStorageText.textContent = storageData.compactDisplay || `${storageData.usedFormatted}/${storageData.totalFormatted}`;
            }
            if (adminStatStorageBar) {
                const pct = storageData.percentage !== undefined ? storageData.percentage : 0;
                adminStatStorageBar.style.width = `${Math.min(100, Math.max(1, pct))}%`;
            }
        }
    } catch (err) {
        console.error('Error loading admin data:', err);
    } finally {
        if (adminRefreshIcon) {
            setTimeout(() => adminRefreshIcon.classList.remove('animate-spin'), 300);
        }
    }
}

export function renderAdminUsersTable() {
    const adminUsersTableBody = document.getElementById('adminUsersTableBody');
    if (!adminUsersTableBody) return;

    if (state.adminUserList.length === 0) {
        adminUsersTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center py-8 text-xs text-base-content/50">
              No registered devices in SQLite database.
            </td>
          </tr>
        `;
        return;
    }

    adminUsersTableBody.innerHTML = state.adminUserList.map(user => {
        const isAdmin = user.roles === 'admin' || user.isAdmin === true;
        const isCurrentSessionUser = user.userid === state.currentDeviceFingerprint;
        const formattedDate = user.createdAt ? formatDate(user.createdAt) : '-';

        return `
          <tr class="hover">
            <td class="font-mono text-xs">
              <div class="flex items-center gap-2">
                <span class="font-semibold select-all">${user.userid}</span>
                ${isCurrentSessionUser ? '<span class="badge badge-xs badge-primary font-sans font-bold">YOU</span>' : ''}
                <button onclick="window.copyToClipboard('${user.userid}')" class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary" title="Copy User ID">
                  <i class="ri-file-copy-line text-xs"></i>
                </button>
              </div>
            </td>
            <td class="text-center">
              ${isAdmin 
                ? '<span class="badge badge-success badge-xs font-mono font-bold">ADMIN</span>' 
                : '<span class="badge badge-ghost badge-xs font-mono">VIEW ONLY</span>'}
            </td>
            <td class="text-xs text-base-content/60 font-mono">
              ${formattedDate}
            </td>
            <td class="text-right">
              ${isCurrentSessionUser
                ? `<span class="text-[11px] text-base-content/40 font-mono italic pr-2">Active Session</span>`
                : (isAdmin
                    ? `<button onclick="window.demoteAdminUser('${user.userid}')" class="btn btn-ghost btn-xs text-warning hover:bg-warning/10 font-semibold gap-1">
                        <i class="ri-user-unfollow-line text-xs"></i>
                        <span>Revoke Admin</span>
                       </button>`
                    : `<button onclick="window.promoteAdminUser('${user.userid}')" class="btn btn-ghost btn-xs text-success hover:bg-success/10 font-semibold gap-1">
                        <i class="ri-shield-check-line text-xs"></i>
                        <span>Make Admin</span>
                       </button>`
                  )
              }
            </td>
          </tr>
        `;
    }).join('');
}

export function showAdminDashboard() {
    if (isUserscriptEnvironment()) {
        state.isUserAdmin = false;
        applyAdminPermissionsUI();
        window.location.replace('/');
        return;
    }

    const fileManagerView = document.getElementById('fileManagerView');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const bottomStatusBar = document.getElementById('bottomStatusBar');
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    const fabMenu = document.getElementById('fabMenu');

    if (fileManagerView) fileManagerView.classList.add('hidden');
    if (adminDashboardView) adminDashboardView.classList.remove('hidden');
    if (bottomStatusBar) bottomStatusBar.classList.add('hidden');
    if (fabTriggerBtn) fabTriggerBtn.classList.add('hidden');
    if (fabMenu) fabMenu.classList.add('hidden');

    loadAdminData();
}

export function showFileManagerView(reloadFn) {
    // Cleanly update URL path to / for friendly UX
    try {
        if (window.location.pathname !== '/' || window.location.hash || window.location.search) {
            window.history.pushState({}, '', '/');
        }
    } catch (e) {}

    const fileManagerView = document.getElementById('fileManagerView');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const fabTriggerBtn = document.getElementById('fabTriggerBtn');
    const fabMenu = document.getElementById('fabMenu');

    if (adminDashboardView) adminDashboardView.classList.add('hidden');
    if (fileManagerView) fileManagerView.classList.remove('hidden');
    if (fabMenu) fabMenu.classList.add('hidden');

    if (fabTriggerBtn) {
        if (state.isUserAdmin) {
            fabTriggerBtn.classList.remove('hidden');
        } else {
            fabTriggerBtn.classList.add('hidden');
        }
    }

    if (typeof reloadFn === 'function') reloadFn();
}

export function initAdminConsole(reloadDirectoryFn) {
    const adminGoToFileManagerBtn = document.getElementById('adminGoToFileManagerBtn');
    const adminRefreshBtn = document.getElementById('adminRefreshBtn');
    const adminAddUserBtn = document.getElementById('adminAddUserBtn');
    const adminAddUserInput = document.getElementById('adminAddUserInput');

    if (adminGoToFileManagerBtn) {
        adminGoToFileManagerBtn.addEventListener('click', () => showFileManagerView(reloadDirectoryFn));
    }
    if (adminRefreshBtn) {
        adminRefreshBtn.addEventListener('click', loadAdminData);
    }

    if (adminAddUserBtn && adminAddUserInput) {
        adminAddUserBtn.addEventListener('click', async () => {
            const val = adminAddUserInput.value.trim();
            if (!val) {
                showToast('Please enter a valid User ID', 'warning');
                return;
            }
            await window.promoteAdminUser(val);
            adminAddUserInput.value = '';
        });
    }

    const adminChangeMasterKeyForm = document.getElementById('adminChangeMasterKeyForm');
    const adminNewMasterKeyInput = document.getElementById('adminNewMasterKeyInput');
    const adminChangeMasterKeyBtn = document.getElementById('adminChangeMasterKeyBtn');

    if (adminChangeMasterKeyForm) {
        adminChangeMasterKeyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newKey = adminNewMasterKeyInput ? adminNewMasterKeyInput.value.trim() : '';
            if (!newKey) {
                showToast('Please enter a new master key', 'warning');
                return;
            }
            if (adminChangeMasterKeyBtn) adminChangeMasterKeyBtn.disabled = true;
            try {
                const res = await apiFetch('/api/change_masterkey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userid: state.currentDeviceFingerprint,
                        newMasterKey: newKey 
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    try {
                        localStorage.setItem('mininxd_master_key', newKey);
                        state.currentMasterKey = newKey;
                    } catch (e) {}
                    if (adminNewMasterKeyInput) adminNewMasterKeyInput.value = '';
                    showToast('Master key updated successfully in database!', 'success');
                } else {
                    showToast(`Failed: ${data?.error || 'Could not update master key'}`, 'error');
                }
            } catch (err) {
                showToast(`Error: ${err.message}`, 'error');
            } finally {
                if (adminChangeMasterKeyBtn) adminChangeMasterKeyBtn.disabled = false;
            }
        });
    }

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard', 'success');
        }).catch(() => {
            showToast(text, 'info');
        });
    };

    window.promoteAdminUser = async (userId) => {
        if (!userId) return;
        const masterKey = prompt(`Enter Master Key for new admin ${userId} (Required):`);
        if (!masterKey || !masterKey.trim()) {
            showToast('Master Key is required to promote a user to admin', 'warning');
            return;
        }
        try {
            const res = await apiFetch('/api/add_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userid: userId, 
                    targetUserId: userId,
                    masterkey: masterKey.trim()
                })
            });
            const data = await res.json();
            if (data && data.success) {
                showToast(`User promoted to admin (${data.adminCount || ''} admins total)`, 'success');
                await loadAdminData();
            } else {
                showToast(`Failed: ${data?.error || 'Unknown error'}`, 'error');
            }
        } catch (e) {
            showToast(`Error: ${e.message}`, 'error');
        }
    };

    window.demoteAdminUser = async (userId) => {
        if (!userId) return;
        if (userId === state.currentDeviceFingerprint) {
            showToast('Cannot revoke admin privileges on your current active session', 'warning');
            return;
        }
        if (!confirm(`Revoke admin privileges for user ${userId}?`)) return;
        try {
            const res = await apiFetch('/api/remove_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: userId, targetUserId: userId })
            });
            const data = await res.json();
            if (data && data.success) {
                showToast(`Admin privileges removed`, 'info');
                await loadAdminData();
            } else {
                showToast(`Failed: ${data?.error || 'Unknown error'}`, 'error');
            }
        } catch (e) {
            showToast(`Error: ${e.message}`, 'error');
        }
    };
}
