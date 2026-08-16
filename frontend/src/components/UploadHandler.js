// Upload & Drag-and-Drop Queue Handler Component
import { state } from '../lib/state.js';
import { getFingerprint } from '../lib/fingerprint.js';
import { formatBytes, showToast, setBottomStatus } from '../lib/utils.js';
import { apiFetch } from '../lib/api.js';
import { updateStorageInfo } from './StorageWidget.js';
import { loadDirectory, pendingCachedUploads, invalidateDirectoryCache } from './FileManager.js';

// Upload Queue State
let uploadQueue = [];
let isUploadingQueue = false;
let hideProgressTimeout = null;

export function renderPendingUploadsBanner() {
    const banner = document.getElementById('pendingUploadsBanner');
    const title = document.getElementById('pendingBannerTitle');
    const subtitle = document.getElementById('pendingBannerSubtitle');
    const resumeBtn = document.getElementById('pendingBannerResumeBtn');
    if (!banner) return;

    if (pendingCachedUploads.size === 0) {
        banner.classList.add('hidden');
        return;
    }

    const items = Array.from(pendingCachedUploads.values());
    const count = items.length;
    banner.classList.remove('hidden');
    
    if (title) {
        title.textContent = `${count} Cached Upload${count > 1 ? 's' : ''} Ready to Resume`;
    }
    if (subtitle) {
        subtitle.textContent = items.map(i => `${i.fileName} (${formatBytes(i.size)}) to ${i.targetDir}`).join(', ');
    }
    if (resumeBtn) {
        resumeBtn.onclick = async () => {
            resumeBtn.disabled = true;
            resumeBtn.innerHTML = '<span class="loading loading-spinner loading-xs"></span><span>Resuming...</span>';
            for (const item of items) {
                await retryCachedUpload(item.uploadId);
            }
            resumeBtn.disabled = false;
            resumeBtn.innerHTML = '<i class="ri-play-line text-xs"></i><span>Resume Upload</span>';
            renderPendingUploadsBanner();
        };
    }
}

export async function checkPendingUploads() {
    try {
        const res = await fetch('/api/ftp/pending-uploads');
        const data = await res.json();
        if (data.success && data.pending && data.pending.length > 0) {
            for (const item of data.pending) {
                pendingCachedUploads.set(item.uploadId, item);
            }
            renderPendingUploadsBanner();
        } else {
            pendingCachedUploads.clear();
            renderPendingUploadsBanner();
        }
    } catch (err) {
        console.warn('Failed to check pending uploads:', err);
    }
}

export async function retryCachedUpload(uploadId) {
    const item = pendingCachedUploads.get(uploadId);
    if (!item) return;

    if (hideProgressTimeout) {
        clearTimeout(hideProgressTimeout);
        hideProgressTimeout = null;
    }

    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    const uploadProgressFilename = document.getElementById('uploadProgressFilename');
    const uploadProgressTargetDir = document.getElementById('uploadProgressTargetDir');
    const uploadProgressPct = document.getElementById('uploadProgressPct');
    const uploadProgressBar = document.getElementById('uploadProgressBar');
    const uploadProgressSpeed = document.getElementById('uploadProgressSpeed');
    const uploadRetryBtn = document.getElementById('uploadRetryBtn');
    const uploadCloseBtn = document.getElementById('uploadCloseBtn');

    if (uploadProgressContainer) {
        uploadProgressContainer.classList.remove('hidden');
        if (uploadProgressFilename) uploadProgressFilename.textContent = item.fileName;
        if (uploadProgressTargetDir) uploadProgressTargetDir.textContent = `to ${item.targetDir}`;
        if (uploadProgressPct) uploadProgressPct.textContent = 'Retrying...';
        if (uploadProgressBar) {
            uploadProgressBar.className = 'h-full bg-warning rounded-full transition-all duration-300';
            uploadProgressBar.style.width = '70%';
        }
        if (uploadProgressSpeed) uploadProgressSpeed.textContent = 'Streaming cached file to FTP storage...';
        if (uploadRetryBtn) uploadRetryBtn.classList.add('hidden');
        if (uploadCloseBtn) uploadCloseBtn.classList.add('hidden');
    }

    setBottomStatus('connecting', `Retrying upload "${item.fileName}"...`, item.targetDir);

    try {
        let retryPollInterval = null;
        const retryStartTime = Date.now();
        const uploadProgressBytes = document.getElementById('uploadProgressBytes');
        retryPollInterval = setInterval(async () => {
            try {
                const statusRes = await fetch(`/api/ftp/upload-status?uploadId=${encodeURIComponent(uploadId)}`);
                if (statusRes.ok) {
                    const sData = await statusRes.json();
                    if (sData && sData.success) {
                        const written = sData.ftpWrittenBytes || 0;
                        const total = sData.totalBytes || item.size;
                        const ftpPct = total > 0 ? Math.min(99, Math.round((written / total) * 100)) : 0;
                        const elapsed = (Date.now() - retryStartTime) / 1000;
                        const speed = elapsed > 0 && written > 0 ? written / elapsed : 0;
                        const speedStr = speed > 0 ? ` (${formatBytes(speed)}/s)` : '';

                        if (uploadProgressBytes) {
                            uploadProgressBytes.classList.add('hidden');
                            uploadProgressBytes.textContent = '';
                        }
                        if (uploadProgressPct) uploadProgressPct.textContent = `${ftpPct}%`;
                        if (uploadProgressBar) {
                            uploadProgressBar.className = 'h-full bg-primary rounded-full transition-all duration-200';
                            uploadProgressBar.style.width = `${ftpPct}%`;
                        }
                        if (uploadProgressSpeed) {
                            uploadProgressSpeed.innerHTML = '<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...';
                        }
                    }
                }
            } catch (e) {}
        }, 250);

        const res = await apiFetch('/api/ftp/retry-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uploadId })
        });
        if (retryPollInterval) clearInterval(retryPollInterval);
        const data = await res.json();

        if (data.success) {
            pendingCachedUploads.delete(uploadId);
            if (uploadProgressBytes) {
                uploadProgressBytes.classList.add('hidden');
                uploadProgressBytes.textContent = '';
            }
            if (uploadProgressPct) uploadProgressPct.textContent = '100%';
            if (uploadProgressBar) {
                uploadProgressBar.className = 'h-full bg-success rounded-full transition-all duration-300';
                uploadProgressBar.style.width = '100%';
            }
            if (uploadProgressSpeed) uploadProgressSpeed.textContent = 'Upload complete!';
            setBottomStatus('connected', `Uploaded "${item.fileName}"`, item.targetDir);

            hideProgressTimeout = setTimeout(() => {
                if (uploadProgressContainer && pendingCachedUploads.size === 0 && !isUploadingQueue) {
                    uploadProgressContainer.classList.add('hidden');
                }
            }, 1500);

            invalidateDirectoryCache();
            loadDirectory(true);
            updateStorageInfo(true);
            renderPendingUploadsBanner();
            return true;
        } else {
            if (retryPollInterval) clearInterval(retryPollInterval);
            const errMsg = data.error || 'Retry failed';
            showToast(errMsg, 'error');
            if (uploadProgressPct) uploadProgressPct.textContent = 'Failed';
            if (uploadProgressBar) {
                uploadProgressBar.className = 'h-full bg-error rounded-full transition-all duration-300';
            }
            if (uploadProgressSpeed) uploadProgressSpeed.textContent = `Retry failed: ${errMsg}`;
            if (uploadRetryBtn) {
                uploadRetryBtn.classList.remove('hidden');
                uploadRetryBtn.innerHTML = '<i class="ri-refresh-line text-xs"></i><span>Retry</span>';
                uploadRetryBtn.onclick = () => retryCachedUpload(uploadId);
            }
            if (uploadCloseBtn) {
                uploadCloseBtn.classList.remove('hidden');
                uploadCloseBtn.onclick = () => {
                    if (uploadProgressContainer) uploadProgressContainer.classList.add('hidden');
                };
            }
            setBottomStatus('error', `Upload retry failed: ${errMsg}`);
            renderPendingUploadsBanner();
            return false;
        }
    } catch (err) {
        showToast(`Connection error: ${err.message}`, 'error');
        if (uploadProgressPct) uploadProgressPct.textContent = 'Offline';
        if (uploadProgressBar) uploadProgressBar.className = 'h-full bg-error rounded-full';
        if (uploadProgressSpeed) uploadProgressSpeed.textContent = `Connection error: ${err.message}`;
        if (uploadRetryBtn) {
            uploadRetryBtn.classList.remove('hidden');
            uploadRetryBtn.innerHTML = '<i class="ri-refresh-line text-xs"></i><span>Retry</span>';
            uploadRetryBtn.onclick = () => retryCachedUpload(uploadId);
        }
        if (uploadCloseBtn) {
            uploadCloseBtn.classList.remove('hidden');
            uploadCloseBtn.onclick = () => {
                if (uploadProgressContainer) uploadProgressContainer.classList.add('hidden');
            };
        }
        setBottomStatus('error', `FTP Connection Disconnected`);
        renderPendingUploadsBanner();
        return false;
    }
}

// Upload a single file with byte-level progress reporting
function uploadSingleFile(file, targetDir, currentItemNum = 1, totalItems = 1) {
    const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
    const mk = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || sessionStorage.getItem('mininxd_master_key') || '';

    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    const uploadProgressFilename = document.getElementById('uploadProgressFilename');
    const uploadProgressTargetDir = document.getElementById('uploadProgressTargetDir');
    const uploadProgressPct = document.getElementById('uploadProgressPct');
    const uploadProgressBar = document.getElementById('uploadProgressBar');
    const uploadProgressBytes = document.getElementById('uploadProgressBytes');
    const uploadProgressSpeed = document.getElementById('uploadProgressSpeed');
    const uploadRetryBtn = document.getElementById('uploadRetryBtn');
    const uploadCloseBtn = document.getElementById('uploadCloseBtn');

    return new Promise((resolve, reject) => {
        const formData = new FormData();
        let uploadEndpoint = '/api/ftp/upload';

        const isPublicUpload = state.isPublicMode || 
                               window.location.pathname.startsWith('/pub') || 
                               (typeof targetDir === 'string' && (targetDir.startsWith('pub_') || targetDir.startsWith('/public') || targetDir.startsWith('public')));

        let publicUserId = state.currentPublicUser ? state.currentPublicUser.clean_id : '';
        if (!publicUserId) {
            const match = window.location.pathname.match(/^\/pub\/([^/]+)/);
            if (match && match[1]) {
                publicUserId = match[1].toLowerCase().replace(/^0x/, '');
            } else if (typeof targetDir === 'string' && targetDir.startsWith('pub_')) {
                const parts = targetDir.split('_');
                publicUserId = parts[1] ? parts[1].toLowerCase().replace(/^0x/, '') : '';
            } else {
                publicUserId = (state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '').toLowerCase().replace(/^0x/, '');
            }
        }

        let publicSubpath = state.publicCurrentSubpath || '/';
        if ((!publicSubpath || publicSubpath === '/') && typeof targetDir === 'string' && targetDir.startsWith('pub_')) {
            const parts = targetDir.split('_');
            if (parts.length >= 3) {
                publicSubpath = parts.slice(2).join('_');
            }
        }

        if (isPublicUpload && publicUserId) {
            uploadEndpoint = '/api/public/upload';
            const pubKey = sessionStorage.getItem('mininxd_pub_key_' + publicUserId) || '';
            formData.append('user_id', publicUserId);
            formData.append('subpath', publicSubpath);
            if (pubKey) formData.append('key', pubKey);
        } else {
            formData.append('path', targetDir);
            if (fp) {
                formData.append('fingerprint', fp);
            }
            if (mk) {
                formData.append('masterkey', mk);
            }
        }
        const clientUploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        formData.append('upload_id', clientUploadId);
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadEndpoint, true);
        xhr.setRequestHeader('x-upload-id', clientUploadId);

        if (isPublicUpload && publicUserId) {
            const pubKey = sessionStorage.getItem('mininxd_pub_key_' + publicUserId) || '';
            if (pubKey) {
                xhr.setRequestHeader('x-public-key', pubKey);
                xhr.setRequestHeader('x-pub-key', pubKey);
            }
        } else {
            if (fp) {
                xhr.setRequestHeader('x-device-fingerprint', fp);
                xhr.setRequestHeader('x-fingerprint', fp);
            }
            if (mk) {
                xhr.setRequestHeader('x-master-key', mk);
                xhr.setRequestHeader('x-masterkey', mk);
            }
        }

        const batchPrefix = totalItems > 1 ? `[${currentItemNum}/${totalItems}] ` : '';

        if (uploadProgressContainer) {
            uploadProgressContainer.classList.remove('hidden');
            if (uploadProgressFilename) uploadProgressFilename.textContent = `${batchPrefix}${file.name}`;
            if (uploadProgressTargetDir) uploadProgressTargetDir.textContent = `to ${targetDir}`;
            if (uploadProgressPct) uploadProgressPct.textContent = totalItems > 1 ? `${currentItemNum}/${totalItems} (0%)` : '0%';
            if (uploadProgressBar) {
                uploadProgressBar.className = 'h-full bg-primary rounded-full transition-all duration-200';
                uploadProgressBar.style.width = '0%';
            }
            if (uploadProgressBytes) {
                uploadProgressBytes.classList.remove('hidden');
                uploadProgressBytes.textContent = `0 B / ${formatBytes(file.size)}`;
            }
            if (uploadProgressSpeed) uploadProgressSpeed.textContent = 'Starting upload...';
            if (uploadRetryBtn) uploadRetryBtn.classList.add('hidden');
            if (uploadCloseBtn) uploadCloseBtn.classList.add('hidden');
        }

        setBottomStatus('connecting', `${batchPrefix}Uploading "${file.name}"...`, targetDir);
        const startTime = Date.now();

        let ftpPollInterval = null;
        let ftpStartTime = 0;

        const startFtpProgressPolling = () => {
            if (ftpPollInterval) return;
            ftpStartTime = Date.now();
            ftpPollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/ftp/upload-status?uploadId=${encodeURIComponent(clientUploadId)}`);
                    if (statusRes.ok) {
                        const sData = await statusRes.json();
                        if (sData && sData.success) {
                            const written = sData.ftpWrittenBytes || 0;
                            const total = sData.totalBytes || file.size;
                            const ftpPct = total > 0 ? Math.min(99, Math.round((written / total) * 100)) : 0;
                            const elapsed = (Date.now() - ftpStartTime) / 1000;
                            const speed = elapsed > 0 && written > 0 ? written / elapsed : 0;
                            if (uploadProgressBytes) {
                                uploadProgressBytes.classList.add('hidden');
                                uploadProgressBytes.textContent = '';
                            }
                            if (uploadProgressPct) {
                                uploadProgressPct.textContent = totalItems > 1 ? `${currentItemNum}/${totalItems} (${ftpPct}%)` : `${ftpPct}%`;
                            }
                            if (uploadProgressBar) {
                                uploadProgressBar.className = 'h-full bg-primary rounded-full transition-all duration-200';
                                uploadProgressBar.style.width = `${ftpPct}%`;
                            }
                            if (uploadProgressSpeed) {
                                uploadProgressSpeed.innerHTML = '<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...';
                            }
                        }
                    }
                } catch (e) {}
            }, 250);
        };

        const stopFtpProgressPolling = () => {
            if (ftpPollInterval) {
                clearInterval(ftpPollInterval);
                ftpPollInterval = null;
            }
        };

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                const loadedStr = formatBytes(e.loaded);
                const totalStr = formatBytes(e.total);

                const elapsedSec = (Date.now() - startTime) / 1000;
                const speedBytesPerSec = elapsedSec > 0 ? e.loaded / elapsedSec : 0;
                const speedStr = `${formatBytes(speedBytesPerSec)}/s`;

                if (pct >= 100) {
                    // Browser has uploaded all bytes to backend -> now tracking live write to FTP
                    if (uploadProgressBytes) {
                        uploadProgressBytes.classList.add('hidden');
                        uploadProgressBytes.textContent = '';
                    }
                    if (uploadProgressSpeed) {
                        uploadProgressSpeed.innerHTML = '<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...';
                    }
                    if (uploadProgressPct) {
                        uploadProgressPct.textContent = totalItems > 1 ? `${currentItemNum}/${totalItems} (Writing)` : 'Writing...';
                    }
                    startFtpProgressPolling();
                } else {
                    if (uploadProgressBytes) {
                        uploadProgressBytes.classList.remove('hidden');
                        uploadProgressBytes.textContent = `${loadedStr} / ${totalStr}`;
                    }
                    if (uploadProgressSpeed) {
                        uploadProgressSpeed.textContent = `Uploading: ${speedStr}`;
                    }
                    if (uploadProgressPct) {
                        uploadProgressPct.textContent = totalItems > 1 ? `${currentItemNum}/${totalItems} (${pct}%)` : `${pct}%`;
                    }
                    if (uploadProgressBar) {
                        uploadProgressBar.className = 'h-full bg-primary rounded-full transition-all duration-200';
                        uploadProgressBar.style.width = `${pct}%`;
                    }
                }
            }
        };

        xhr.onload = () => {
            stopFtpProgressPolling();
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {}

            if (xhr.status >= 200 && xhr.status < 300 && data && data.success) {
                setBottomStatus('connected', `Uploaded "${file.name}"`, targetDir);
                if (uploadProgressBytes) {
                    uploadProgressBytes.classList.add('hidden');
                    uploadProgressBytes.textContent = '';
                }
                if (uploadProgressPct) {
                    uploadProgressPct.textContent = totalItems > 1 ? `${currentItemNum}/${totalItems} (100%)` : '100%';
                }
                if (uploadProgressBar) {
                    uploadProgressBar.className = 'h-full bg-success rounded-full';
                    uploadProgressBar.style.width = '100%';
                }
                if (uploadProgressSpeed) {
                    uploadProgressSpeed.textContent = 'Complete!';
                }
                resolve(data);
            } else {
                const errMsg = data?.error || (xhr.status === 403 ? 'View Only Mode: Admin permissions required' : 'Upload failed');
                showToast(errMsg, 'error');

                const uploadId = data?.uploadId || clientUploadId;
                const isStorageOrUnrecoverable = xhr.status === 400 || 
                                                xhr.status === 403 || 
                                                xhr.status === 401 || 
                                                data?.retryable === false ||
                                                /storage|limit|quota|exceed|full|permission|unauthorized|forbidden|format/i.test(errMsg);

                if (isStorageOrUnrecoverable) {
                    if (uploadId) {
                        pendingCachedUploads.delete(uploadId);
                    }
                    if (uploadRetryBtn) uploadRetryBtn.classList.add('hidden');
                } else {
                    if (uploadId) {
                        pendingCachedUploads.set(uploadId, {
                            uploadId,
                            fileName: file.name,
                            targetDir,
                            size: file.size
                        });
                    }
                    if (uploadRetryBtn && uploadId) {
                        uploadRetryBtn.classList.remove('hidden');
                        uploadRetryBtn.innerHTML = '<i class="ri-refresh-line text-xs"></i><span>Retry</span>';
                        uploadRetryBtn.onclick = () => retryCachedUpload(uploadId);
                    }
                }

                if (uploadProgressBytes) {
                    uploadProgressBytes.classList.add('hidden');
                    uploadProgressBytes.textContent = '';
                }
                if (uploadProgressPct) uploadProgressPct.textContent = xhr.status === 403 ? 'Forbidden' : 'Failed';
                if (uploadProgressBar) uploadProgressBar.className = 'h-full bg-error rounded-full';
                if (uploadProgressSpeed) uploadProgressSpeed.textContent = errMsg;

                if (uploadCloseBtn) {
                    uploadCloseBtn.classList.remove('hidden');
                    uploadCloseBtn.onclick = () => {
                        if (uploadProgressContainer) uploadProgressContainer.classList.add('hidden');
                    };
                }

                setBottomStatus('error', `Upload error: ${errMsg}`);
                renderPendingUploadsBanner();
                reject(new Error(errMsg));
            }
        };

        xhr.onerror = () => {
            stopFtpProgressPolling();
            showToast(`Network error while uploading "${file.name}"`, 'error');
            if (uploadProgressPct) uploadProgressPct.textContent = 'Error';
            if (uploadProgressBar) uploadProgressBar.className = 'h-full bg-error rounded-full';
            if (uploadProgressSpeed) uploadProgressSpeed.textContent = 'Network drop. Check connection.';
            if (uploadCloseBtn) {
                uploadCloseBtn.classList.remove('hidden');
                uploadCloseBtn.onclick = () => {
                    if (uploadProgressContainer) uploadProgressContainer.classList.add('hidden');
                };
            }
            setBottomStatus('error', 'FTP Connection Offline');
            reject(new Error('Network error'));
        };

        xhr.onabort = () => {
            stopFtpProgressPolling();
        };

        xhr.send(formData);
    });
}

// Sequential Batch Queue Processor
async function processUploadQueue() {
    if (uploadQueue.length === 0) {
        isUploadingQueue = false;
        return;
    }

    isUploadingQueue = true;

    if (hideProgressTimeout) {
        clearTimeout(hideProgressTimeout);
        hideProgressTimeout = null;
    }

    const totalBatchCount = uploadQueue.length;
    let completedCount = 0;
    let failedCount = 0;

    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    if (uploadProgressContainer) uploadProgressContainer.classList.remove('hidden');

    while (uploadQueue.length > 0) {
        const item = uploadQueue.shift();
        const currentItemNum = completedCount + failedCount + 1;
        const totalItemsInBatch = currentItemNum + uploadQueue.length;

        try {
            await uploadSingleFile(item.file, item.targetDir, currentItemNum, totalItemsInBatch);
            completedCount++;
        } catch (err) {
            console.error(`Batch upload failed for ${item.file.name}:`, err);
            failedCount++;
        }
    }

    isUploadingQueue = false;

    // Report batch results
    if (completedCount > 0 && failedCount === 0) {
        setBottomStatus('connected', `Completed upload of ${completedCount} file(s)`);
    } else if (completedCount > 0 && failedCount > 0) {
        showToast(`Uploaded ${completedCount} file(s), ${failedCount} failed`, 'warning');
    }

    invalidateDirectoryCache();
    loadDirectory(true);
    updateStorageInfo(true);
    renderPendingUploadsBanner();

    // Hide progress bar after 2.5s only if no uploads remain and no pending retries
    if (pendingCachedUploads.size === 0 && failedCount === 0) {
        hideProgressTimeout = setTimeout(() => {
            if (!isUploadingQueue && uploadQueue.length === 0 && uploadProgressContainer) {
                uploadProgressContainer.classList.add('hidden');
            }
        }, 2500);
    }
}

function isClientFormatAllowed(filename, mimetype, allowedFormats) {
    if (!Array.isArray(allowedFormats) || allowedFormats.length === 0) {
        return true;
    }
    const cleanFilename = String(filename || '').trim();
    const dotIndex = cleanFilename.lastIndexOf('.');
    const rawExt = dotIndex >= 0 ? cleanFilename.slice(dotIndex + 1).toLowerCase() : '';
    const detectedMime = (mimetype || '').toLowerCase().trim();

    for (const rule of allowedFormats) {
        if (!rule || typeof rule !== 'string') continue;
        const cleanRule = rule.trim().toLowerCase();
        if (!cleanRule) continue;

        if (cleanRule.endsWith('/*')) {
            const prefix = cleanRule.slice(0, -1);
            if (detectedMime && detectedMime.startsWith(prefix)) return true;
            if (prefix === 'image/' && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp', 'avif'].includes(rawExt)) return true;
            if (prefix === 'video/' && ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'avi'].includes(rawExt)) return true;
            if (prefix === 'audio/' && ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(rawExt)) return true;
            continue;
        }
        if (cleanRule.includes('/')) {
            if (detectedMime && detectedMime === cleanRule) return true;
            continue;
        }
        const extRule = cleanRule.replace(/^\./, '');
        if (rawExt && rawExt === extRule) return true;
        if (rawExt && ((extRule === 'jpg' && rawExt === 'jpeg') || (extRule === 'jpeg' && rawExt === 'jpg'))) return true;
    }
    return false;
}

// Public Multi-File Batch Dispatcher
export async function uploadFilesBatch(files, targetDir) {
    if (!files || files.length === 0) return;

    if (!state.currentDeviceFingerprint) {
        try {
            state.currentDeviceFingerprint = await getFingerprint();
        } catch (e) {}
    }

    if (!state.isUserAdmin && !state.isPublicMode) {
        showToast('View Only Mode: Admin permissions required to upload files.', 'error');
        return;
    }

    const effectiveTargetDir = targetDir || (state.isPublicMode ? state.publicCurrentSubpath : state.currentPath);
    const allowedFormats = state.isPublicMode ? (state.publicModeConfig?.allowed_format || []) : [];
    const fileList = Array.from(files);

    for (const file of fileList) {
        if (state.isPublicMode) {
            const maxSizeMB = state.publicModeConfig?.max_size || 100;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            const displayName = file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name;

            if (file.size > maxSizeBytes) {
                showToast(`File "${displayName}" (${formatBytes(file.size)}) exceeds maximum allowed limit of ${maxSizeMB} MB`, 'error');
                continue;
            }

            if (allowedFormats.length > 0) {
                if (!isClientFormatAllowed(file.name, file.type, allowedFormats)) {
                    showToast(`File "${displayName}" format is not allowed. Allowed: ${allowedFormats.join(', ')}`, 'warning');
                    continue;
                }
            }
        }
        uploadQueue.push({ file, targetDir: effectiveTargetDir });
    }

    if (!isUploadingQueue && uploadQueue.length > 0) {
        processUploadQueue();
    }
}

// Single file upload wrapper
export async function uploadFileWithProgress(file, targetDir) {
    return uploadFilesBatch([file], targetDir);
}

export function initUploadHandlers() {
    const fileUploadInput = document.getElementById('fileUploadInput');
    const fabMenu = document.getElementById('fabMenu');
    const fabPlusIcon = document.getElementById('fabPlusIcon');
    const dragDropOverlay = document.getElementById('dragDropOverlay');

    if (fileUploadInput) {
        fileUploadInput.addEventListener('click', () => {
            const allowedFormats = state.isPublicMode ? (state.publicModeConfig?.allowed_format || []) : [];
            if (state.isPublicMode && allowedFormats.length > 0) {
                const acceptTypes = allowedFormats.map(f => {
                    const clean = String(f).trim();
                    return clean.startsWith('.') || clean.includes('/') ? clean : '.' + clean;
                }).join(',');
                fileUploadInput.setAttribute('accept', acceptTypes);
            } else {
                fileUploadInput.removeAttribute('accept');
            }
        });

        fileUploadInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            if (fabMenu) fabMenu.classList.add('hidden');
            if (fabPlusIcon) fabPlusIcon.className = 'ri-add-line text-2xl';

            const targetDir = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
            await uploadFilesBatch(files, targetDir);
            fileUploadInput.value = '';
        });
    }

    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (dragDropOverlay) dragDropOverlay.classList.remove('hidden');
    });

    if (dragDropOverlay) {
        dragDropOverlay.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        dragDropOverlay.addEventListener('dragleave', (e) => {
            if (e.relatedTarget === null) {
                dragDropOverlay.classList.add('hidden');
            }
        });
    }

    window.addEventListener('drop', async (e) => {
        e.preventDefault();
        if (dragDropOverlay) dragDropOverlay.classList.add('hidden');

        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            const targetDir = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
            await uploadFilesBatch(e.dataTransfer.files, targetDir);
        }
    });

    window.handleFolderDragOver = (e, rowElem) => {
        e.preventDefault();
        e.stopPropagation();
        if (rowElem) {
            rowElem.classList.add('bg-primary/20', 'ring-2', 'ring-primary', 'ring-inset');
        }
    };

    window.handleFolderDragLeave = (e, rowElem) => {
        e.preventDefault();
        e.stopPropagation();
        if (rowElem) {
            rowElem.classList.remove('bg-primary/20', 'ring-2', 'ring-primary', 'ring-inset');
        }
    };

    window.handleFolderDrop = async (e, folderName, rowElem) => {
        e.preventDefault();
        e.stopPropagation();
        if (rowElem) {
            rowElem.classList.remove('bg-primary/20', 'ring-2', 'ring-primary', 'ring-inset');
        }
        if (dragDropOverlay) dragDropOverlay.classList.add('hidden');

        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            const basePath = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
            const targetSubdir = (basePath.endsWith('/') ? basePath : basePath + '/') + folderName;
            showToast(`Uploading ${e.dataTransfer.files.length} file(s) into "${folderName}"...`, 'info');
            await uploadFilesBatch(e.dataTransfer.files, targetSubdir);
        }
    };
}
