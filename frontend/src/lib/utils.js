// UI Formatting & Utility Helpers
import { state } from './state.js';

export function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export function formatDate(dateStr) {
    if (!dateStr) return '--';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return String(dateStr);
    }
}

export function getFileIcon(name, isDir) {
    if (isDir) return { icon: 'ri-folder-fill', color: 'text-amber-500' };
    const ext = (name || '').split('.').pop().toLowerCase();
    
    // 1. Android Packages & Mobile Apps
    if (['apk', 'aab', 'xapk', 'apks'].includes(ext)) {
        return { icon: 'ri-android-fill', color: 'text-emerald-500' };
    }

    // 2. Optical Disc Images, ISO & Virtual ROMs
    if (['iso', 'chd', 'img', 'bin', 'cue', 'nrg', 'mdf', 'mds', 'cso', 'vdi', 'vmdk', 'qcow2', 'dmg'].includes(ext)) {
        return { icon: 'ri-disc-fill', color: 'text-cyan-500' };
    }

    // 3. Archives & Compressed Packages
    if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', 'z', 'cab'].includes(ext)) {
        return { icon: 'ri-file-zip-fill', color: 'text-amber-600' };
    }

    // 4. Images & Graphics
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif', 'heic', 'heif', 'avif', 'raw', 'psd', 'ai'].includes(ext)) {
        return { icon: 'ri-image-fill', color: 'text-emerald-500' };
    }

    // 5. Audio Files
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'opus', 'wma', 'aiff', 'mid', 'midi'].includes(ext)) {
        return { icon: 'ri-music-2-fill', color: 'text-pink-500' };
    }

    // 6. Video Files
    if (['mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', 'm4v', '3gp', 'ts', 'vob'].includes(ext)) {
        return { icon: 'ri-film-fill', color: 'text-rose-500' };
    }

    // 7. Code & Development Source Files
    if (['js', 'mjs', 'cjs'].includes(ext)) {
        return { icon: 'ri-javascript-fill', color: 'text-yellow-500' };
    }
    if (['ts', 'tsx'].includes(ext)) {
        return { icon: 'ri-code-box-fill', color: 'text-blue-500' };
    }
    if (['jsx'].includes(ext)) {
        return { icon: 'ri-reactjs-fill', color: 'text-cyan-400' };
    }
    if (['html', 'htm'].includes(ext)) {
        return { icon: 'ri-html5-fill', color: 'text-orange-500' };
    }
    if (['css', 'scss', 'sass', 'less'].includes(ext)) {
        return { icon: 'ri-css3-fill', color: 'text-blue-400' };
    }
    if (['py', 'pyw', 'ipynb'].includes(ext)) {
        return { icon: 'ri-python-fill', color: 'text-blue-500' };
    }
    if (['rs', 'rust'].includes(ext)) {
        return { icon: 'ri-code-s-slash-fill', color: 'text-orange-600' };
    }
    if (['c', 'cpp', 'cc', 'cxx', 'h', 'hpp'].includes(ext)) {
        return { icon: 'ri-code-s-slash-fill', color: 'text-blue-600' };
    }
    if (['java', 'kt', 'kts'].includes(ext)) {
        return { icon: 'ri-java-fill', color: 'text-red-500' };
    }
    if (['php'].includes(ext)) {
        return { icon: 'ri-code-box-fill', color: 'text-indigo-400' };
    }
    if (['go'].includes(ext)) {
        return { icon: 'ri-code-box-fill', color: 'text-cyan-600' };
    }
    if (['sh', 'bash', 'zsh', 'fish', 'cmd', 'bat', 'ps1'].includes(ext)) {
        return { icon: 'ri-terminal-box-fill', color: 'text-emerald-600' };
    }
    if (['sql', 'db', 'sqlite', 'sqlite3'].includes(ext)) {
        return { icon: 'ri-database-2-fill', color: 'text-sky-500' };
    }
    if (['json', 'yaml', 'yml', 'xml', 'toml', 'ini', 'env', 'conf', 'cfg'].includes(ext)) {
        return { icon: 'ri-settings-4-fill', color: 'text-purple-400' };
    }

    // 8. Documents & PDF
    if (ext === 'pdf') {
        return { icon: 'ri-file-pdf-fill', color: 'text-red-500' };
    }
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) {
        return { icon: 'ri-file-word-fill', color: 'text-blue-600' };
    }
    if (['xls', 'xlsx', 'csv', 'tsv', 'ods'].includes(ext)) {
        return { icon: 'ri-file-excel-fill', color: 'text-emerald-600' };
    }
    if (['ppt', 'pptx', 'odp'].includes(ext)) {
        return { icon: 'ri-file-ppt-fill', color: 'text-amber-500' };
    }
    if (['txt', 'md', 'log'].includes(ext)) {
        return { icon: 'ri-file-text-fill', color: 'text-base-content/70' };
    }

    // 9. Executable Binaries & Installers
    if (['exe', 'msi', 'deb', 'rpm', 'appimage', 'pkg'].includes(ext)) {
        return { icon: 'ri-terminal-window-fill', color: 'text-indigo-500' };
    }

    return { icon: 'ri-file-3-fill', color: 'text-base-content/60' };
}

// Drag / Swipe to the right to hide/dismiss popup elements
export function makeDraggableToDismiss(el, onDismiss) {
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = true;
        el.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        const diffX = touch.clientX - startX;
        const diffY = Math.abs(touch.clientY - startY);

        // Ignore vertical scrolling
        if (diffY > Math.abs(diffX) && diffY > 10 && currentX === 0) {
            isDragging = false;
            return;
        }

        if (diffX > 0) {
            currentX = diffX;
            el.style.transform = `translateX(${diffX}px)`;
            const opacity = Math.max(0, 1 - diffX / 200);
            el.style.opacity = opacity;
        }
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        el.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
        if (currentX > 50) {
            el.style.transform = 'translateX(120%)';
            el.style.opacity = '0';
            setTimeout(() => {
                if (typeof onDismiss === 'function') {
                    onDismiss();
                } else if (el.parentNode) {
                    el.remove();
                }
            }, 250);
        } else {
            el.style.transform = '';
            el.style.opacity = '';
            currentX = 0;
        }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);

    el.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
}

export function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    const alertClass = type === 'success' 
        ? 'bg-success/90 text-success-content border-success/30' 
        : (type === 'error' 
            ? 'bg-error/90 text-error-content border-error/30' 
            : (type === 'warning' 
                ? 'bg-warning/90 text-warning-content border-warning/30' 
                : 'bg-base-100/90 text-base-content border-base-300'));
    const iconClass = type === 'success' 
        ? 'ri-checkbox-circle-fill' 
        : (type === 'error' 
            ? 'ri-error-warning-fill' 
            : (type === 'warning' 
                ? 'ri-alert-fill' 
                : 'ri-information-fill'));

    toast.className = `alert ${alertClass} shadow-xl py-2.5 px-3.5 text-xs flex items-center gap-2 animate-fadeIn rounded-2xl border backdrop-blur-md font-sans pointer-events-auto cursor-grab active:cursor-grabbing select-none transition-all duration-200`;
    toast.innerHTML = `
        <i class="${iconClass} text-sm shrink-0"></i>
        <span class="flex-1 font-medium leading-snug">${message}</span>
        <button class="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100 shrink-0" title="Dismiss">
            <i class="ri-close-line text-xs"></i>
        </button>
    `;

    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            toast.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        };
    }

    makeDraggableToDismiss(toast, () => toast.remove());
    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

export function setBottomStatus(type, title, subtitle = '', options = {}) {
    const bottomStatusBar = document.getElementById('bottomStatusBar');
    const bottomStatusDot = document.getElementById('bottomStatusDot');
    const bottomStatusTitle = document.getElementById('bottomStatusTitle');
    const bottomStatusSub = document.getElementById('bottomStatusSub');
    const bottomStatusRetryBtn = document.getElementById('bottomStatusRetryBtn');
    if (!bottomStatusBar) return;

    if (!bottomStatusBar._dragAttached) {
        bottomStatusBar._dragAttached = true;
        makeDraggableToDismiss(bottomStatusBar, () => {
            bottomStatusBar.classList.add('hidden');
            bottomStatusBar.style.transform = '';
            bottomStatusBar.style.opacity = '';
        });
    }

    if (state.hideBottomStatusTimeout) {
        clearTimeout(state.hideBottomStatusTimeout);
        state.hideBottomStatusTimeout = null;
    }

    bottomStatusBar.classList.remove('hidden');
    bottomStatusBar.style.transform = '';
    bottomStatusBar.style.opacity = '';

    if (type === 'connected') {
        if (bottomStatusDot) bottomStatusDot.className = 'w-2 h-2 rounded-full bg-success ring-4 ring-success/20 shrink-0';
        if (bottomStatusTitle) bottomStatusTitle.textContent = title || 'Connected to Storage';
        if (bottomStatusSub) bottomStatusSub.textContent = subtitle ? `• ${subtitle}` : '';
        if (bottomStatusRetryBtn) bottomStatusRetryBtn.classList.add('hidden');

        state.hideBottomStatusTimeout = setTimeout(() => {
            if (bottomStatusBar) bottomStatusBar.classList.add('hidden');
        }, 3000);
    } else if (type === 'connecting') {
        if (bottomStatusDot) bottomStatusDot.className = 'w-2 h-2 rounded-full bg-warning ring-4 ring-warning/20 shrink-0 animate-pulse';
        if (bottomStatusTitle) bottomStatusTitle.textContent = title || 'Connecting to Storage...';
        if (bottomStatusSub) bottomStatusSub.textContent = subtitle ? `• ${subtitle}` : '';
        if (bottomStatusRetryBtn) bottomStatusRetryBtn.classList.add('hidden');
    } else if (type === 'error') {
        if (bottomStatusDot) bottomStatusDot.className = 'w-2 h-2 rounded-full bg-error ring-4 ring-error/20 shrink-0';
        if (bottomStatusTitle) bottomStatusTitle.textContent = title || 'Connection Issue';
        if (bottomStatusSub) bottomStatusSub.textContent = subtitle ? `• ${subtitle}` : '';
        if (bottomStatusRetryBtn && options.showRetry) {
            bottomStatusRetryBtn.classList.remove('hidden');
        }
    }
}

export function copyTextToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    } catch (e) {}
}
