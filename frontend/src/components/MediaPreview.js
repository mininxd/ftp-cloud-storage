// Media Preview Lightbox & Player Component
import { state } from '../lib/state.js';

export function openImagePreview(fileName) {
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const imagePreviewTitle = document.getElementById('imagePreviewTitle');
    const imagePreviewElement = document.getElementById('imagePreviewElement');
    const imageDownloadDirectBtn = document.getElementById('imageDownloadDirectBtn');

    const basePath = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
    const filePath = (basePath.endsWith('/') ? basePath : basePath + '/') + fileName;
    
    let viewUrl = `/api/ftp/view-file?path=${encodeURIComponent(filePath)}`;
    let downloadUrl = `/api/ftp/download?path=${encodeURIComponent(filePath)}`;

    if (state.isPublicMode && state.currentPublicUser) {
        const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
        const masterKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || '';
        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
        let authParams = `user_id=${encodeURIComponent(state.currentPublicUser.clean_id)}&path=${encodeURIComponent(filePath)}`;
        if (cachedKey) authParams += `&key=${encodeURIComponent(cachedKey)}`;
        if (masterKey) authParams += `&masterkey=${encodeURIComponent(masterKey)}`;
        if (fp) authParams += `&fingerprint=${encodeURIComponent(fp)}`;

        viewUrl = `/api/public/raw?${authParams}`;
        downloadUrl = `/api/public/download?${authParams}`;
    }

    if (imagePreviewTitle) imagePreviewTitle.textContent = fileName;
    if (imagePreviewElement) imagePreviewElement.src = viewUrl;
    if (imageDownloadDirectBtn) imageDownloadDirectBtn.href = downloadUrl;
    if (imagePreviewModal) imagePreviewModal.showModal();
}

export function openMediaPreview(fileName, isVideo) {
    const mediaPreviewModal = document.getElementById('mediaPreviewModal');
    const mediaPreviewTitle = document.getElementById('mediaPreviewTitle');
    const mediaPreviewIcon = document.getElementById('mediaPreviewIcon');
    const mediaTypeBadge = document.getElementById('mediaTypeBadge');
    const videoPlayerElement = document.getElementById('videoPlayerElement');
    const audioPlayerContainer = document.getElementById('audioPlayerContainer');
    const audioPlayerElement = document.getElementById('audioPlayerElement');
    const mediaDownloadDirectBtn = document.getElementById('mediaDownloadDirectBtn');

    const basePath = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
    const filePath = (basePath.endsWith('/') ? basePath : basePath + '/') + fileName;
    
    let streamUrl = `/api/ftp/view-file?path=${encodeURIComponent(filePath)}`;
    let downloadUrl = `/api/ftp/download?path=${encodeURIComponent(filePath)}`;

    if (state.isPublicMode && state.currentPublicUser) {
        const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
        const masterKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || '';
        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
        let authParams = `user_id=${encodeURIComponent(state.currentPublicUser.clean_id)}&path=${encodeURIComponent(filePath)}`;
        if (cachedKey) authParams += `&key=${encodeURIComponent(cachedKey)}`;
        if (masterKey) authParams += `&masterkey=${encodeURIComponent(masterKey)}`;
        if (fp) authParams += `&fingerprint=${encodeURIComponent(fp)}`;

        streamUrl = `/api/public/raw?${authParams}`;
        downloadUrl = `/api/public/download?${authParams}`;
    }

    if (mediaPreviewTitle) mediaPreviewTitle.textContent = fileName;
    if (mediaDownloadDirectBtn) mediaDownloadDirectBtn.href = downloadUrl;

    if (isVideo) {
        if (mediaPreviewIcon) mediaPreviewIcon.className = 'ri-film-line text-rose-500 text-lg';
        if (mediaTypeBadge) {
            mediaTypeBadge.textContent = 'VIDEO';
            mediaTypeBadge.className = 'badge badge-error badge-xs font-mono text-white';
        }
        
        if (audioPlayerContainer) audioPlayerContainer.classList.add('hidden');
        if (audioPlayerElement) {
            audioPlayerElement.pause();
            audioPlayerElement.src = '';
        }

        if (videoPlayerElement) {
            videoPlayerElement.classList.remove('hidden');
            videoPlayerElement.src = streamUrl;
            videoPlayerElement.load();
        }
    } else {
        if (mediaPreviewIcon) mediaPreviewIcon.className = 'ri-music-2-line text-amber-500 text-lg';
        if (mediaTypeBadge) {
            mediaTypeBadge.textContent = 'AUDIO';
            mediaTypeBadge.className = 'badge badge-warning badge-xs font-mono text-amber-950';
        }

        if (videoPlayerElement) {
            videoPlayerElement.classList.add('hidden');
            videoPlayerElement.pause();
            videoPlayerElement.src = '';
        }

        if (audioPlayerContainer) audioPlayerContainer.classList.remove('hidden');
        if (audioPlayerElement) {
            audioPlayerElement.src = streamUrl;
            audioPlayerElement.load();
            audioPlayerElement.play().catch(() => {});
        }
    }

    if (mediaPreviewModal) mediaPreviewModal.showModal();
}

export function closeMediaPlayer() {
    const videoPlayerElement = document.getElementById('videoPlayerElement');
    const audioPlayerElement = document.getElementById('audioPlayerElement');
    const mediaPreviewModal = document.getElementById('mediaPreviewModal');

    if (videoPlayerElement) {
        videoPlayerElement.pause();
        videoPlayerElement.src = '';
    }
    if (audioPlayerElement) {
        audioPlayerElement.pause();
        audioPlayerElement.src = '';
    }
    if (mediaPreviewModal && mediaPreviewModal.open) {
        mediaPreviewModal.close();
    }
}

export function isTextEditable(fileName) {
    const textExts = ['txt', 'json', 'js', 'mjs', 'cjs', 'ts', 'css', 'html', 'xml', 'svg', 'sh', 'bash', 'py', 'yaml', 'yml', 'md', 'ini', 'cfg', 'conf', 'env', 'log', 'htaccess', 'php', 'sql'];
    const ext = fileName.split('.').pop().toLowerCase();
    return textExts.includes(ext);
}

export function isImageFile(fileName) {
    const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp'];
    const ext = fileName.split('.').pop().toLowerCase();
    return imgExts.includes(ext);
}

export function isVideoFile(fileName) {
    const videoExts = ['mp4', 'mkv', 'webm', 'mov', 'ogv'];
    const ext = fileName.split('.').pop().toLowerCase();
    return videoExts.includes(ext);
}

export function isAudioFile(fileName) {
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
    const ext = fileName.split('.').pop().toLowerCase();
    return audioExts.includes(ext);
}

export function initMediaPreview() {
    const mediaPreviewModal = document.getElementById('mediaPreviewModal');
    const closeMediaModalBtn = document.getElementById('closeMediaModalBtn');

    if (closeMediaModalBtn) {
        closeMediaModalBtn.addEventListener('click', closeMediaPlayer);
    }
    if (mediaPreviewModal) {
        mediaPreviewModal.addEventListener('close', closeMediaPlayer);
    }

    window.openImagePreview = openImagePreview;
    window.openMediaPreview = openMediaPreview;
    window.closeMediaPlayer = closeMediaPlayer;
}
