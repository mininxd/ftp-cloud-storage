// Dracula Code & Text Editor Component
import { CodeJar } from 'codejar';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-ini';

import { state } from '../lib/state.js';
import { showToast } from '../lib/utils.js';
import { apiFetch } from '../lib/api.js';

// Syntax highlight helper for Prism + CodeJar
export function getPrismGrammar(ext) {
    switch (ext) {
        case 'js':
        case 'mjs':
        case 'cjs':
        case 'ts':
            return { grammar: Prism.languages.javascript, name: 'JAVASCRIPT' };
        case 'json':
            return { grammar: Prism.languages.json, name: 'JSON' };
        case 'css':
            return { grammar: Prism.languages.css, name: 'CSS' };
        case 'sh':
        case 'bash':
        case 'zsh':
            return { grammar: Prism.languages.bash, name: 'BASH' };
        case 'py':
            return { grammar: Prism.languages.python, name: 'PYTHON' };
        case 'yaml':
        case 'yml':
            return { grammar: Prism.languages.yaml, name: 'YAML' };
        case 'md':
            return { grammar: Prism.languages.markdown, name: 'MARKDOWN' };
        case 'ini':
        case 'cfg':
        case 'conf':
            return { grammar: Prism.languages.ini, name: 'CONFIG' };
        case 'html':
        case 'xml':
            return { grammar: Prism.languages.html || Prism.languages.markup, name: 'HTML' };
        default:
            return { grammar: null, name: 'TEXT' };
    }
}

// Initialize CodeJar for Dracula Code Editor
export function initCodeJar(initialContent, ext) {
    const codeJarContainer = document.getElementById('codeJarContainer');
    const editorSyntaxBadge = document.getElementById('editorSyntaxBadge');
    if (!codeJarContainer) return;

    if (state.jarInstance) {
        try {
            state.jarInstance.destroy();
        } catch (e) {}
    }

    const { grammar, name } = getPrismGrammar(ext);
    if (editorSyntaxBadge) editorSyntaxBadge.textContent = name;

    const highlight = (editor) => {
        const code = editor.textContent || '';
        if (grammar) {
            editor.innerHTML = Prism.highlight(code, grammar, ext);
        } else {
            editor.innerHTML = Prism.util.encode(code);
        }
    };

    state.jarInstance = CodeJar(codeJarContainer, highlight, { tab: '  ' });
    state.jarInstance.updateCode(initialContent || '');
}

export async function openCodeEditor(fileName) {
    const draculaEditorModal = document.getElementById('draculaEditorModal');
    const editorFilenameBadge = document.getElementById('editorFilenameBadge');
    const editorFilePathDisplay = document.getElementById('editorFilePathDisplay');
    const editorStatusText = document.getElementById('editorStatusText');
    const saveEditorFileBtn = document.getElementById('saveEditorFileBtn');
    const codeJarContainer = document.getElementById('codeJarContainer');

    const basePath = state.isPublicMode ? state.publicCurrentSubpath : state.currentPath;
    const filePath = (basePath.endsWith('/') ? basePath : basePath + '/') + fileName;
    state.activeEditorPath = filePath;
    if (editorFilenameBadge) editorFilenameBadge.textContent = fileName;
    if (editorFilePathDisplay) editorFilePathDisplay.textContent = filePath;
    if (editorStatusText) editorStatusText.textContent = 'Loading...';

    const canEdit = state.isUserAdmin || state.isPublicMode;
    if (saveEditorFileBtn) {
        if (canEdit) {
            saveEditorFileBtn.classList.remove('hidden');
        } else {
            saveEditorFileBtn.classList.add('hidden');
        }
    }

    if (draculaEditorModal) draculaEditorModal.showModal();

    let readUrl = `/api/ftp/read-file?path=${encodeURIComponent(filePath)}`;
    if (state.isPublicMode && state.currentPublicUser) {
        const cachedKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
        const masterKey = state.currentMasterKey || localStorage.getItem('mininxd_master_key') || '';
        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
        let authParams = `user_id=${encodeURIComponent(state.currentPublicUser.clean_id)}&path=${encodeURIComponent(filePath)}`;
        if (cachedKey) authParams += `&key=${encodeURIComponent(cachedKey)}`;
        if (masterKey) authParams += `&masterkey=${encodeURIComponent(masterKey)}`;
        if (fp) authParams += `&fingerprint=${encodeURIComponent(fp)}`;
        readUrl = `/api/public/read-file?${authParams}`;
    }

    try {
        const res = await apiFetch(readUrl);
        const data = await res.json();
        if (data && data.success) {
            const ext = fileName.split('.').pop().toLowerCase();
            initCodeJar(data.content || '', ext);

            if (!canEdit) {
                if (codeJarContainer) codeJarContainer.setAttribute('contenteditable', 'false');
            } else {
                if (codeJarContainer) codeJarContainer.setAttribute('contenteditable', 'plaintext-only');
            }
            if (editorStatusText) editorStatusText.textContent = 'Ready';
        } else {
            if (editorStatusText) editorStatusText.textContent = `Error: ${data?.error || 'Failed to read file'}`;
            initCodeJar(`// Error loading file: ${data?.error || 'Unknown error'}`, 'txt');
        }
    } catch (err) {
        if (editorStatusText) editorStatusText.textContent = `Network error`;
        initCodeJar(`// Network error: ${err.message}`, 'txt');
    }
}

export async function saveActiveCodeFile(refreshDirectoryCallback) {
    const editorStatusText = document.getElementById('editorStatusText');
    const codeJarContainer = document.getElementById('codeJarContainer');

    if (!state.activeEditorPath) {
        showToast('No active file selected to save', 'warning');
        return;
    }

    const canEdit = state.isUserAdmin || state.isPublicMode;
    if (!canEdit) {
        showToast('View Only Mode: Permissions required to edit or save files.', 'error');
        return;
    }

    let content = '';
    try {
        if (state.jarInstance && typeof state.jarInstance.toString === 'function') {
            content = state.jarInstance.toString();
        } else if (codeJarContainer) {
            content = codeJarContainer.textContent || '';
        }
    } catch (e) {
        if (codeJarContainer) content = codeJarContainer.textContent || '';
    }

    if (editorStatusText) editorStatusText.textContent = 'Saving...';
    const filename = (state.activeEditorPath || '').split('/').pop() || 'file';

    try {
        if (state.isPublicMode && state.currentPublicUser) {
            const pubKey = sessionStorage.getItem('mininxd_pub_key_' + state.currentPublicUser.clean_id) || '';
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const file = new File([blob], filename, { type: 'text/plain' });
            const formData = new FormData();
            formData.append('user_id', state.currentPublicUser.clean_id);
            const parentDir = state.activeEditorPath.lastIndexOf('/') > 0 ? state.activeEditorPath.substring(0, state.activeEditorPath.lastIndexOf('/')) : '/';
            formData.append('subpath', parentDir);
            if (pubKey) formData.append('key', pubKey);
            formData.append('file', file);

            const res = await apiFetch('/api/public/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data && data.success) {
                if (editorStatusText) editorStatusText.textContent = 'Saved';
                showToast(`Saved "${filename}"`, 'success');
                setTimeout(() => {
                    if (editorStatusText) editorStatusText.textContent = 'Ready';
                }, 2000);
                if (typeof refreshDirectoryCallback === 'function') {
                    refreshDirectoryCallback();
                }
            } else {
                if (editorStatusText) editorStatusText.textContent = 'Error';
                showToast(`Save failed: ${data?.error || 'Unknown error'}`, 'error');
            }
            return;
        }

        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint');
        const res = await apiFetch('/api/ftp/save-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: state.activeEditorPath,
                content: content,
                fingerprint: fp
            })
        });
        const data = await res.json();
        if (data && data.success) {
            if (editorStatusText) editorStatusText.textContent = 'Saved';
            showToast(`Saved "${filename}"`, 'success');
            setTimeout(() => {
                if (editorStatusText) editorStatusText.textContent = 'Ready';
            }, 2000);
            if (typeof refreshDirectoryCallback === 'function') {
                refreshDirectoryCallback();
            }
        } else {
            if (editorStatusText) editorStatusText.textContent = 'Error';
            showToast(`Save failed: ${data?.error || 'Unknown error'}`, 'error');
        }
    } catch (err) {
        if (editorStatusText) editorStatusText.textContent = 'Error';
        showToast(`Save error: ${err?.message || String(err)}`, 'error');
    }
}

export function initCodeEditor(refreshDirectoryCallback) {
    const saveEditorFileBtn = document.getElementById('saveEditorFileBtn');
    if (saveEditorFileBtn) {
        saveEditorFileBtn.addEventListener('click', () => saveActiveCodeFile(refreshDirectoryCallback));
    }
    window.openCodeEditor = openCodeEditor;
}
