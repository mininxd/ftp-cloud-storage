// Storage & Server System Diagnostics Widget Component (with Real-Time WebSocket Telemetry)
import { apiFetch } from '../lib/api.js';
import { state } from '../lib/state.js';
import { showToast } from '../lib/utils.js';

let isFetchingStorage = false;
let isFetchingSystem = false;
let systemSocket = null;
let isSocketSubscribed = false;

function fallbackCopy(text) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) {
            showToast('User ID copied to clipboard', 'success');
        } else {
            showToast(`User ID: ${text}`, 'info');
        }
    } catch (e) {
        showToast(`User ID: ${text}`, 'info');
    }
}

export function copyTextToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('User ID copied to clipboard', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

export async function updateStorageInfo(forceRefresh = false) {
    const navStorageText = document.getElementById('navStorageText');
    const navStorageBar = document.getElementById('navStorageBar');
    const modalStorageStatusBadge = document.getElementById('modalStorageStatusBadge');
    
    const modalStorageUsedDetail = document.getElementById('modalStorageUsedDetail');
    const modalStoragePctText = document.getElementById('modalStoragePctText');
    const modalStorageUsedProgressBar = document.getElementById('modalStorageUsedProgressBar');
    
    const modalStorageFreeDetail = document.getElementById('modalStorageFreeDetail');
    const modalStorageFreePctText = document.getElementById('modalStorageFreePctText');
    const modalStorageFreeProgressBar = document.getElementById('modalStorageFreeProgressBar');
    
    const modalStorageTotalText = document.getElementById('modalStorageTotalText');
    const modalStorageFilesText = document.getElementById('modalStorageFilesText');
    const modalStorageFoldersText = document.getElementById('modalStorageFoldersText');
    const modalStorageGatewayText = document.getElementById('modalStorageGatewayText');
    const modalRefreshStorageIcon = document.getElementById('modalRefreshStorageIcon');

    if (isFetchingStorage) return;
    isFetchingStorage = true;

    if (modalRefreshStorageIcon && forceRefresh) {
        modalRefreshStorageIcon.classList.add('animate-spin');
    }

    try {
        const res = await apiFetch(`/api/ftp/storage-info?refresh=${forceRefresh ? 'true' : 'false'}`);
        const data = await res.json();

        if (data.success) {
            const display = data.compactDisplay || `${data.usedFormatted || '0B'}/${data.totalFormatted || '0GB'}`.replace(/\s+/g, '');
            const pct = data.percentage !== undefined ? data.percentage : 0;
            const freePct = data.freePercentage !== undefined ? data.freePercentage : Math.max(0, parseFloat((100 - pct).toFixed(2)));
            
            // Color threshold for storage bar & indicators
            let barColorClass = 'bg-primary';
            let badgeColorClass = 'badge-primary text-primary-content';

            if (pct >= 95) {
                barColorClass = 'bg-error animate-pulse';
                badgeColorClass = 'badge-error text-white';
            } else if (pct >= 80) {
                barColorClass = 'bg-warning';
                badgeColorClass = 'badge-warning text-neutral';
            }

            // Navbar Storage Pill
            if (navStorageText) navStorageText.textContent = display;
            if (navStorageBar) {
                navStorageBar.className = `h-full ${barColorClass} rounded-full transition-all duration-500`;
                navStorageBar.style.width = `${Math.min(100, Math.max(1, pct))}%`;
            }

            // Storage Overview Header Badge
            if (modalStorageStatusBadge) {
                modalStorageStatusBadge.className = `badge ${badgeColorClass} badge-sm font-mono text-[10px] font-bold shrink-0`;
                modalStorageStatusBadge.textContent = `${pct}% USED`;
            }

            // Mini Card 1: Used Space
            if (modalStorageUsedDetail) modalStorageUsedDetail.textContent = data.usedFormatted || '--';
            if (modalStoragePctText) modalStoragePctText.textContent = `${pct}%`;
            if (modalStorageUsedProgressBar) {
                modalStorageUsedProgressBar.className = `h-full ${barColorClass} rounded-full transition-all duration-500`;
                modalStorageUsedProgressBar.style.width = `${Math.min(100, Math.max(1, pct))}%`;
            }

            // Mini Card 2: Free Space
            if (modalStorageFreeDetail) modalStorageFreeDetail.textContent = data.freeFormatted || '--';
            if (modalStorageFreePctText) modalStorageFreePctText.textContent = `${freePct}%`;
            if (modalStorageFreeProgressBar) {
                modalStorageFreeProgressBar.className = 'h-full bg-success rounded-full transition-all duration-500';
                modalStorageFreeProgressBar.style.width = `${Math.min(100, Math.max(1, freePct))}%`;
            }

            // Breakdown Grid Card 1: Total Capacity
            if (modalStorageTotalText) modalStorageTotalText.textContent = data.totalFormatted || '-- GB';

            // Breakdown Grid Card 2: Files Stored
            if (modalStorageFilesText) {
                const files = data.fileCount !== undefined ? data.fileCount : 0;
                modalStorageFilesText.textContent = `${files} file${files === 1 ? '' : 's'}`;
            }

            // Breakdown Grid Card 3: Folders Stored
            if (modalStorageFoldersText) {
                const folders = data.folderCount !== undefined ? data.folderCount : 0;
                modalStorageFoldersText.textContent = `${folders} folder${folders === 1 ? '' : 's'}`;
            }

            // Breakdown Grid Card 4: FTP Gateway
            if (modalStorageGatewayText) modalStorageGatewayText.textContent = data.gateway || 'Active / Ready';
        }
    } catch (err) {
        console.error('Error fetching storage stats:', err);
    } finally {
        isFetchingStorage = false;
        if (modalRefreshStorageIcon) {
            setTimeout(() => modalRefreshStorageIcon.classList.remove('animate-spin'), 300);
        }
    }
}

export function applySystemTelemetryData(data) {
    if (!data || !data.success) return;

    const modalSysModeBadge = document.getElementById('modalSysModeBadge');
    
    const modalCpuPctText = document.getElementById('modalCpuPctText');
    const modalCpuProgressBar = document.getElementById('modalCpuProgressBar');
    
    const modalRamPctText = document.getElementById('modalRamPctText');
    const modalRamProgressBar = document.getElementById('modalRamProgressBar');
    
    const modalRamDetailText = document.getElementById('modalRamDetailText');
    const modalCpuModelText = document.getElementById('modalCpuModelText');
    const modalUptimeText = document.getElementById('modalUptimeText');
    const modalExtraLabelText = document.getElementById('modalExtraLabelText');
    const modalExtraValueText = document.getElementById('modalExtraValueText');

    // Mode Badge (Ubuntu vs Termux vs Auto)
    if (modalSysModeBadge) {
        const modeName = data.mode || 'Ubuntu';
        const isAuto = data.configMode === 'auto';
        modalSysModeBadge.textContent = isAuto ? `Auto (${modeName})` : modeName;
        if (modeName.toLowerCase() === 'termux') {
            modalSysModeBadge.className = 'badge badge-accent badge-sm font-mono text-[10px] uppercase font-bold text-accent-content shrink-0';
        } else if (modeName.toLowerCase() === 'ubuntu') {
            modalSysModeBadge.className = 'badge badge-primary badge-sm font-mono text-[10px] uppercase font-bold text-primary-content shrink-0';
        } else {
            modalSysModeBadge.className = 'badge badge-neutral badge-sm font-mono text-[10px] uppercase font-bold shrink-0';
        }
    }

    // CPU Load Stats
    const cpuPct = data.cpu?.usagePercent !== undefined ? data.cpu.usagePercent : 0;
    if (modalCpuPctText) modalCpuPctText.textContent = `${cpuPct}%`;
    if (modalCpuProgressBar) {
        let cpuColor = 'bg-primary';
        if (cpuPct >= 90) cpuColor = 'bg-error animate-pulse';
        else if (cpuPct >= 70) cpuColor = 'bg-warning';
        modalCpuProgressBar.className = `h-full ${cpuColor} rounded-full transition-all duration-300`;
        modalCpuProgressBar.style.width = `${Math.min(100, Math.max(1, cpuPct))}%`;
    }

    // CPU Cores, Model & Temperature
    if (modalCpuModelText) {
        const cores = data.cpu?.cores || 1;
        const model = data.cpu?.model || 'Generic Processor';
        const temp = data.cpu?.temperature;
        const tempStr = (temp !== null && temp !== undefined && !isNaN(temp)) ? ` | ${temp}°C` : '';
        modalCpuModelText.textContent = `${cores} Cores (${model}${tempStr})`;
    }

    // RAM Usage Stats
    const ramPct = data.memory?.usagePercent !== undefined ? data.memory.usagePercent : 0;
    if (modalRamPctText) modalRamPctText.textContent = `${ramPct}%`;
    if (modalRamProgressBar) {
        let ramColor = 'bg-secondary';
        if (ramPct >= 90) ramColor = 'bg-error animate-pulse';
        else if (ramPct >= 75) ramColor = 'bg-warning';
        modalRamProgressBar.className = `h-full ${ramColor} rounded-full transition-all duration-300`;
        modalRamProgressBar.style.width = `${Math.min(100, Math.max(1, ramPct))}%`;
    }

    if (modalRamDetailText) {
        const used = data.memory?.usedFormatted || '--';
        const total = data.memory?.totalFormatted || '--';
        modalRamDetailText.textContent = `${used} / ${total}`;
    }

    // System Uptime
    if (modalUptimeText) {
        modalUptimeText.textContent = data.os?.systemUptimeFormatted || `${Math.floor((data.os?.systemUptimeSec || 0) / 3600)}h`;
    }

    // Auto-Detect: If Termux, show TermuxAPI Battery Status. If not Termux, show OS & Platform.
    const isTermux = String(data.mode || '').toLowerCase() === 'termux' || data.isTermux === true;
    const battery = isTermux ? (data.battery || data.termux?.battery) : null;
    const modalBatteryPill = document.getElementById('modalBatteryPill');
    const modalBatteryIcon = document.getElementById('modalBatteryIcon');
    const modalBatteryPercent = document.getElementById('modalBatteryPercent');

    if (isTermux && battery && battery.percentage !== null && battery.percentage !== undefined) {
        if (modalExtraLabelText) modalExtraLabelText.textContent = 'Battery Status';
        const pct = battery.percentage;
        const status = (battery.status || 'Discharging').trim();
        const statusUpper = status.toUpperCase();
        const pluggedUpper = String(battery.plugged || '').toUpperCase().trim();
        const isCharging = (statusUpper === 'CHARGING' || statusUpper === 'FULL') || 
                           (pluggedUpper.startsWith('PLUGGED') && pluggedUpper !== 'UNPLUGGED');
        const tempStr = battery.temperature ? ` | ${battery.temperature}°C` : '';

        if (modalExtraValueText) {
            modalExtraValueText.textContent = `${pct}% (${status}${tempStr})`;
        }

        if (modalBatteryPill && modalBatteryPercent) {
            modalBatteryPill.classList.remove('hidden');
            modalBatteryPercent.textContent = `${pct}%`;
            if (isCharging) {
                modalBatteryPill.className = 'badge badge-success/15 text-success border border-success/30 badge-xs font-mono text-[9px] font-semibold flex items-center gap-1';
                if (modalBatteryIcon) modalBatteryIcon.className = 'ri-battery-charge-line text-[10px] text-success animate-pulse';
            } else {
                modalBatteryPill.className = 'badge bg-base-200/60 text-base-content/60 border border-base-300 badge-xs font-mono text-[9px] font-medium flex items-center gap-1';
                if (modalBatteryIcon) {
                    modalBatteryIcon.className = pct <= 15 ? 'ri-battery-low-line text-[10px] text-error animate-pulse' : 'ri-battery-line text-[10px] text-base-content/50';
                }
            }
        }
    } else {
        if (modalExtraLabelText) modalExtraLabelText.textContent = 'OS & Platform';
        const platform = data.os?.platform || 'linux';
        const arch = data.os?.arch || 'x64';
        const release = (data.os?.release || '').split('-')[0];
        if (modalExtraValueText) {
            modalExtraValueText.textContent = `${platform} ${arch} (${release})`;
        }
        if (modalBatteryPill) {
            modalBatteryPill.classList.add('hidden');
        }
    }
}

export function startSystemTelemetrySocket() {
    isSocketSubscribed = true;
    if (systemSocket && (systemSocket.readyState === WebSocket.OPEN || systemSocket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/system_info`;

    try {
        systemSocket = new WebSocket(wsUrl);

        systemSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                applySystemTelemetryData(data);
            } catch (e) {}
        };

        systemSocket.onclose = () => {
            systemSocket = null;
            if (isSocketSubscribed) {
                setTimeout(startSystemTelemetrySocket, 2500);
            }
        };

        systemSocket.onerror = () => {
            updateSystemInfo(false);
        };
    } catch (e) {
        updateSystemInfo(false);
    }
}

export function stopSystemTelemetrySocket() {
    isSocketSubscribed = false;
    if (systemSocket) {
        try {
            systemSocket.close();
        } catch (e) {}
        systemSocket = null;
    }
}

export async function updateSystemInfo() {
    // If WebSocket is live, send instant refresh ping
    if (systemSocket && systemSocket.readyState === WebSocket.OPEN) {
        try {
            systemSocket.send(JSON.stringify({ action: 'refresh' }));
        } catch (e) {}
    }

    if (isFetchingSystem) return;
    isFetchingSystem = true;

    try {
        const res = await apiFetch('/api/system_info');
        const data = await res.json();
        applySystemTelemetryData(data);
    } catch (err) {
        console.error('Error fetching system info:', err);
    } finally {
        isFetchingSystem = false;
    }
}

export function initStorageWidget() {
    const navStorageWidget = document.getElementById('navStorageWidget');
    const settingsModal = document.getElementById('settingsModal');
    const modalRefreshStorageBtn = document.getElementById('modalRefreshStorageBtn');
    const copyUserIdBtn = document.getElementById('copyUserIdBtn');
    const settingsUserIdDisplay = document.getElementById('settingsUserIdDisplay');

    const overviewCarousel = document.getElementById('overviewCarousel');
    const slideStorageOverview = document.getElementById('slideStorageOverview');
    const slideSystemInfo = document.getElementById('slideSystemInfo');
    const carouselDot0 = document.getElementById('carouselDot0');
    const carouselDot1 = document.getElementById('carouselDot1');
    const btnGoToSystemSlide = document.getElementById('btnGoToSystemSlide');
    const btnGoToStorageSlide = document.getElementById('btnGoToStorageSlide');

    function syncSettingsUserId() {
        const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
        if (settingsUserIdDisplay && fp) {
            settingsUserIdDisplay.textContent = fp;
            settingsUserIdDisplay.title = fp;
        }
    }

    if (copyUserIdBtn) {
        copyUserIdBtn.addEventListener('click', () => {
            const fp = state.currentDeviceFingerprint || localStorage.getItem('mininxd_device_fingerprint') || '';
            if (fp) {
                copyTextToClipboard(fp);
            } else {
                showToast('User ID not available', 'warning');
            }
        });
    }

    function updateCarouselDots(activeIndex) {
        if (carouselDot0 && carouselDot1) {
            if (activeIndex === 0) {
                carouselDot0.className = 'w-2.5 h-1.5 rounded-full bg-primary transition-all duration-300 cursor-pointer';
                carouselDot1.className = 'w-1.5 h-1.5 rounded-full bg-base-300 hover:bg-base-content/30 transition-all duration-300 cursor-pointer';
            } else {
                carouselDot0.className = 'w-1.5 h-1.5 rounded-full bg-base-300 hover:bg-base-content/30 transition-all duration-300 cursor-pointer';
                carouselDot1.className = 'w-2.5 h-1.5 rounded-full bg-primary transition-all duration-300 cursor-pointer';
            }
        }
    }

    if (navStorageWidget && settingsModal) {
        navStorageWidget.addEventListener('click', () => {
            syncSettingsUserId();
            updateStorageInfo(false);
            updateSystemInfo();
            startSystemTelemetrySocket();
            settingsModal.showModal();
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('close', () => {
            stopSystemTelemetrySocket();
        });

        // Close on tap or click outside modal content
        settingsModal.addEventListener('click', (e) => {
            const modalBox = settingsModal.querySelector('.modal-box');
            if (modalBox && !modalBox.contains(e.target)) {
                settingsModal.close();
            }
        });
    }

    if (modalRefreshStorageBtn) {
        modalRefreshStorageBtn.addEventListener('click', () => {
            updateStorageInfo(true);
        });
    }

    if (overviewCarousel) {
        // Scroll listener for dot synchronization
        overviewCarousel.addEventListener('scroll', () => {
            const scrollLeft = overviewCarousel.scrollLeft;
            const width = overviewCarousel.clientWidth || 1;
            const activeIndex = Math.round(scrollLeft / width);
            updateCarouselDots(activeIndex);
            if (activeIndex === 1) {
                startSystemTelemetrySocket();
                updateSystemInfo();
            }
        }, { passive: true });

        // Mouse drag scrolling support
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;

        overviewCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - overviewCarousel.offsetLeft;
            scrollStart = overviewCarousel.scrollLeft;
        });
        overviewCarousel.addEventListener('mouseleave', () => { isDown = false; });
        overviewCarousel.addEventListener('mouseup', () => { isDown = false; });
        overviewCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - overviewCarousel.offsetLeft;
            const walk = (x - startX) * 1.2;
            overviewCarousel.scrollLeft = scrollStart - walk;
        });
    }

    if (btnGoToSystemSlide && overviewCarousel && slideSystemInfo) {
        btnGoToSystemSlide.addEventListener('click', () => {
            slideSystemInfo.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            startSystemTelemetrySocket();
            updateSystemInfo();
        });
    }

    if (btnGoToStorageSlide && overviewCarousel && slideStorageOverview) {
        btnGoToStorageSlide.addEventListener('click', () => {
            slideStorageOverview.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
    }

    if (carouselDot0 && overviewCarousel && slideStorageOverview) {
        carouselDot0.addEventListener('click', () => {
            slideStorageOverview.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
    }

    if (carouselDot1 && overviewCarousel && slideSystemInfo) {
        carouselDot1.addEventListener('click', () => {
            slideSystemInfo.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            startSystemTelemetrySocket();
            updateSystemInfo();
        });
    }
}
