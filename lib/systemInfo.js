import os from 'os';
import fs from 'fs';
import { execSync } from 'child_process';
import { getSystemInfoMode, getRawSystemInfoConfig } from './config.js';

let prevProcStat = null;
let prevOsCpuStat = null;
let prevProcessCpu = null;
let prevProcessTime = 0;

export function detectTotalCpuCores() {
    // 1. Try /sys/devices/system/cpu/possible (e.g. '0-7' -> 8 cores)
    try {
        if (fs.existsSync('/sys/devices/system/cpu/possible')) {
            const raw = fs.readFileSync('/sys/devices/system/cpu/possible', 'utf8').trim();
            const match = raw.match(/(\d+)-(\d+)/);
            if (match) {
                const count = parseInt(match[2], 10) - parseInt(match[1], 10) + 1;
                if (count > 0) return count;
            }
        }
    } catch (e) {}

    // 2. Try /sys/devices/system/cpu/present
    try {
        if (fs.existsSync('/sys/devices/system/cpu/present')) {
            const raw = fs.readFileSync('/sys/devices/system/cpu/present', 'utf8').trim();
            const match = raw.match(/(\d+)-(\d+)/);
            if (match) {
                const count = parseInt(match[2], 10) - parseInt(match[1], 10) + 1;
                if (count > 0) return count;
            }
        }
    } catch (e) {}

    // 3. Try counting /sys/devices/system/cpu/cpu[0-9]+ directories
    try {
        if (fs.existsSync('/sys/devices/system/cpu')) {
            const dirs = fs.readdirSync('/sys/devices/system/cpu').filter(d => /^cpu\d+$/.test(d));
            if (dirs.length > 0) return dirs.length;
        }
    } catch (e) {}

    // 4. Try /proc/cpuinfo
    try {
        if (fs.existsSync('/proc/cpuinfo')) {
            const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
            const processors = cpuinfo.match(/^processor\s*:\s*\d+/gim);
            if (processors && processors.length > 0) return processors.length;
        }
    } catch (e) {}

    // 5. Fallback to os.cpus()
    const osCpus = os.cpus();
    return osCpus && osCpus.length > 0 ? osCpus.length : 1;
}

export function detectCpuModel() {
    const osCpus = os.cpus() || [];
    if (osCpus[0]?.model && osCpus[0].model.trim()) {
        return osCpus[0].model.trim();
    }

    // Try /proc/cpuinfo for Hardware or Model name
    try {
        if (fs.existsSync('/proc/cpuinfo')) {
            const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
            const hwMatch = cpuinfo.match(/^Hardware\s*:\s*(.+)$/im);
            if (hwMatch && hwMatch[1]) return hwMatch[1].trim();
            const modelMatch = cpuinfo.match(/^model name\s*:\s*(.+)$/im);
            if (modelMatch && modelMatch[1]) return modelMatch[1].trim();
        }
    } catch (e) {}

    // Try getprop on Android
    try {
        if (fs.existsSync('/system/bin/getprop')) {
            const soc = execSync('getprop ro.soc.model', { timeout: 300, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            if (soc) return soc;
        }
    } catch (e) {}

    return os.arch() ? `${os.arch()} Processor` : 'Generic Processor';
}

export function detectCpuTemp() {
    // 1. Try thermal zones in /sys/class/thermal/thermal_zone*
    try {
        for (let i = 0; i < 20; i++) {
            const tempPath = `/sys/class/thermal/thermal_zone${i}/temp`;
            const typePath = `/sys/class/thermal/thermal_zone${i}/type`;
            try {
                if (fs.existsSync(tempPath)) {
                    const raw = parseFloat(fs.readFileSync(tempPath, 'utf8').trim());
                    if (!isNaN(raw) && raw > 0) {
                        const tempC = raw > 1000 ? parseFloat((raw / 1000).toFixed(1)) : parseFloat(raw.toFixed(1));
                        if (tempC >= 10 && tempC <= 125) {
                            let type = '';
                            try {
                                if (fs.existsSync(typePath)) {
                                    type = fs.readFileSync(typePath, 'utf8').toLowerCase().trim();
                                }
                            } catch (_) {}
                            if (type.includes('cpu') || type.includes('soc') || type.includes('core') || type.includes('pkg') || type.includes('tz') || type.includes('x86')) {
                                return tempC;
                            }
                            return tempC;
                        }
                    }
                }
            } catch (_) {}
        }
    } catch (_) {}

    // 2. Try Raspberry Pi vcgencmd
    try {
        const out = execSync('vcgencmd measure_temp', { timeout: 300, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
        const m = out.match(/temp=([\d.]+)'C/i);
        if (m && m[1]) return parseFloat(m[1]);
    } catch (_) {}

    // 3. Try lm-sensors CLI output
    try {
        const out = execSync('sensors', { timeout: 300, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
        const m = out.match(/(?:Package id 0|Core 0|Tctl|CPU|temp1):\s*\+?([\d.]+)°C/i);
        if (m && m[1]) return parseFloat(m[1]);
    } catch (_) {}

    return null;
}

export function getUptimeLoadAvg() {
    // 1. Try standard os.loadavg()
    const osLoad = os.loadavg();
    if (osLoad && (osLoad[0] > 0 || osLoad[1] > 0 || osLoad[2] > 0)) {
        return osLoad;
    }

    // 2. Try parsing CLI uptime output (common on Android/Termux)
    try {
        const out = execSync('uptime', { timeout: 300, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
        const m = out.match(/load average[s]?:\s*([\d.]+),?\s*([\d.]+),?\s*([\d.]+)/i);
        if (m) {
            return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
        }
    } catch (e) {}

    return [0, 0, 0];
}

function getProcStatSample() {
    try {
        if (fs.existsSync('/proc/stat')) {
            const content = fs.readFileSync('/proc/stat', 'utf8');
            const firstLine = content.split('\n')[0];
            if (firstLine && firstLine.startsWith('cpu ')) {
                const parts = firstLine.trim().split(/\s+/).slice(1).map(Number);
                if (parts.length >= 4) {
                    const idle = parts[3] + (parts[4] || 0); // idle + iowait
                    const total = parts.reduce((a, b) => a + b, 0);
                    return { idle, total, time: Date.now() };
                }
            }
        }
    } catch (e) {}
    return null;
}

function getCpuFreqUtilization() {
    try {
        let totalPct = 0;
        let counted = 0;
        const cores = detectTotalCpuCores() || 8;
        for (let i = 0; i < cores; i++) {
            const curPaths = [
                `/sys/devices/system/cpu/cpu${i}/cpufreq/scaling_cur_freq`,
                `/sys/devices/system/cpu/cpufreq/policy${i}/scaling_cur_freq`,
                `/sys/devices/system/cpu/cpu${i}/cpufreq/cpuinfo_cur_freq`
            ];
            const maxPaths = [
                `/sys/devices/system/cpu/cpu${i}/cpufreq/scaling_max_freq`,
                `/sys/devices/system/cpu/cpufreq/policy${i}/scaling_max_freq`,
                `/sys/devices/system/cpu/cpu${i}/cpufreq/cpuinfo_max_freq`
            ];
            const minPaths = [
                `/sys/devices/system/cpu/cpu${i}/cpufreq/scaling_min_freq`,
                `/sys/devices/system/cpu/cpufreq/policy${i}/scaling_min_freq`,
                `/sys/devices/system/cpu/cpu${i}/cpufreq/cpuinfo_min_freq`
            ];

            let cur = null, max = null, min = null;
            for (const p of curPaths) {
                if (fs.existsSync(p)) {
                    cur = parseInt(fs.readFileSync(p, 'utf8').trim(), 10);
                    if (!isNaN(cur)) break;
                }
            }
            for (const p of maxPaths) {
                if (fs.existsSync(p)) {
                    max = parseInt(fs.readFileSync(p, 'utf8').trim(), 10);
                    if (!isNaN(max)) break;
                }
            }
            for (const p of minPaths) {
                if (fs.existsSync(p)) {
                    min = parseInt(fs.readFileSync(p, 'utf8').trim(), 10);
                    if (!isNaN(min)) break;
                }
            }

            if (cur && max && max > (min || 0)) {
                const minVal = min || 0;
                const ratio = Math.max(0, Math.min(100, Math.round(((cur - minVal) / (max - minVal)) * 100)));
                totalPct += ratio;
                counted++;
            }
        }
        if (counted > 0) {
            return Math.min(100, Math.max(1, Math.round(totalPct / counted)));
        }
    } catch (e) {}
    return null;
}

function getTopCpuSample() {
    try {
        const topCmds = ['top -n 1', 'top -m 5 -n 1', 'toybox top -n 1', '/system/bin/top -n 1'];
        for (const cmd of topCmds) {
            try {
                const out = execSync(cmd, { timeout: 350, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
                if (!out) continue;

                // Match Android toybox top format: 800%cpu 15%user 0%nice 25%sys 760%idle
                const m1 = out.match(/(\d+)%cpu\s+(\d+)%user.*?(\d+)%sys.*?(\d+)%idle/i);
                if (m1) {
                    const user = parseInt(m1[2], 10) || 0;
                    const sys = parseInt(m1[3], 10) || 0;
                    const idle = parseInt(m1[4], 10) || 0;
                    const total = user + sys + idle;
                    if (total > 0) {
                        return Math.min(100, Math.max(1, Math.round(((user + sys) / total) * 100)));
                    }
                    return Math.min(100, Math.max(1, user + sys));
                }

                // Match format: User 12%, System 5%, IOW 0%, IRQ 0%
                const m2 = out.match(/User\s+(\d+)%,\s*System\s+(\d+)%/i);
                if (m2) {
                    const user = parseInt(m2[1], 10) || 0;
                    const sys = parseInt(m2[2], 10) || 0;
                    return Math.min(100, Math.max(1, user + sys));
                }

                // Match format: %Cpu(s): 12.5 us, 4.2 sy, 0.0 ni, 83.3 id
                const m3 = out.match(/%Cpu\(s\):\s*([\d.]+)\s*us,\s*([\d.]+)\s*sy.*?([\d.]+)\s*id/i);
                if (m3) {
                    const idle = parseFloat(m3[3]) || 0;
                    return Math.min(100, Math.max(1, Math.round(100 - idle)));
                }

                // Match format: CPU: 12% usr 4% sys 0% nic 83% idle
                const m4 = out.match(/CPU:\s*(\d+)%\s*usr\s*(\d+)%\s*sys/i);
                if (m4) {
                    const usr = parseInt(m4[1], 10) || 0;
                    const sys = parseInt(m4[2], 10) || 0;
                    return Math.min(100, Math.max(1, usr + sys));
                }
            } catch (err) {}
        }
    } catch (e) {}
    return null;
}

function getProcessCpuDeltaPercent() {
    const now = Date.now();
    const cpuUsage = process.cpuUsage();

    if (!prevProcessCpu || !prevProcessTime) {
        prevProcessCpu = cpuUsage;
        prevProcessTime = now;
        return 2;
    }

    const elapsedMs = Math.max(1, now - prevProcessTime);
    const userDeltaUs = cpuUsage.user - prevProcessCpu.user;
    const sysDeltaUs = cpuUsage.system - prevProcessCpu.system;
    const totalCpuUs = userDeltaUs + sysDeltaUs;

    prevProcessCpu = cpuUsage;
    prevProcessTime = now;

    // Total CPU time in ms = totalCpuUs / 1000
    const rawPct = (totalCpuUs / 1000 / elapsedMs) * 100;
    const scaledPct = Math.min(100, Math.max(1, Math.round(rawPct * 2.5)));
    return scaledPct;
}

function getOsCpuSample() {
    const cpus = os.cpus() || [];
    let totalIdle = 0;
    let totalTick = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    const count = Math.max(1, cpus.length);
    return {
        idle: totalIdle / count,
        total: totalTick / count,
        time: Date.now()
    };
}

export function getCpuUsagePercent() {
    const cores = detectTotalCpuCores() || 1;

    // Tier 1: /proc/stat delta (Linux / Ubuntu / Debian / Rooted Android)
    const procSample = getProcStatSample();
    if (procSample) {
        if (!prevProcStat) {
            prevProcStat = procSample;
            const load = getUptimeLoadAvg()[0];
            if (load > 0) return Math.min(100, Math.round((load / cores) * 100));
            return 3;
        }

        const diffTotal = procSample.total - prevProcStat.total;
        const diffIdle = procSample.idle - prevProcStat.idle;
        prevProcStat = procSample;

        if (diffTotal > 0) {
            const pct = Math.round(((diffTotal - diffIdle) / diffTotal) * 100);
            if (pct > 0) return Math.min(100, Math.max(1, pct));
        }
    }

    // Tier 2: System Load Average from Uptime (e.g. 1.5 load / 8 cores = 18%)
    const loadAvg = getUptimeLoadAvg();
    if (loadAvg && loadAvg[0] > 0) {
        const loadPct = Math.round((loadAvg[0] / cores) * 100);
        if (loadPct > 0) {
            return Math.min(100, Math.max(1, loadPct));
        }
    }

    // Tier 3: CPU Frequency Scaling Utilization (Android Governor load ratio)
    const freqPct = getCpuFreqUtilization();
    if (freqPct !== null && freqPct > 0) {
        return freqPct;
    }

    // Tier 4: Android / Termux CLI top snapshot
    const topPct = getTopCpuSample();
    if (topPct !== null && topPct > 0) {
        return topPct;
    }

    // Tier 5: os.cpus() tick delta (libuv fallback)
    const osSample = getOsCpuSample();
    if (osSample) {
        if (!prevOsCpuStat) {
            prevOsCpuStat = osSample;
        } else {
            const diffTotal = osSample.total - prevOsCpuStat.total;
            const diffIdle = osSample.idle - prevOsCpuStat.idle;
            prevOsCpuStat = osSample;

            if (diffTotal > 0) {
                const pct = Math.round(((diffTotal - diffIdle) / diffTotal) * 100);
                if (pct > 0) return Math.min(100, Math.max(1, pct));
            }
        }
    }

    // Tier 6: Node.js High-Resolution Process CPU Delta
    const procDelta = getProcessCpuDeltaPercent();
    if (procDelta > 0) {
        return procDelta;
    }

    return 2;
}

export function formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatUptime(seconds) {
    const sec = Math.floor(seconds || 0);
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0 || d > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

export function getMemoryStats() {
    const totalBytes = os.totalmem();
    const freeBytes = os.freemem();
    const usedBytes = Math.max(0, totalBytes - freeBytes);
    const usagePercent = totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0;

    let availableBytes = freeBytes;
    try {
        if (fs.existsSync('/proc/meminfo')) {
            const meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
            const match = meminfo.match(/MemAvailable:\s+(\d+)\s+kB/i);
            if (match && match[1]) {
                availableBytes = parseInt(match[1], 10) * 1024;
            }
        }
    } catch (e) {}

    const memUsage = process.memoryUsage();
    return {
        totalBytes,
        usedBytes,
        freeBytes,
        availableBytes,
        usagePercent,
        totalFormatted: formatBytes(totalBytes),
        usedFormatted: formatBytes(usedBytes),
        freeFormatted: formatBytes(freeBytes),
        availableFormatted: formatBytes(availableBytes),
        processRssFormatted: formatBytes(memUsage.rss),
        processHeapUsedFormatted: formatBytes(memUsage.heapUsed)
    };
}

function getTermuxData() {
    const data = {
        battery: null,
        device: null,
        termuxApiAvailable: false
    };

    const isTermuxEnv = Boolean(process.env.TERMUX_VERSION || fs.existsSync('/data/data/com.termux'));

    // 1. Battery Status via termux-battery-status CLI
    try {
        if (isTermuxEnv || fs.existsSync('/data/data/com.termux/files/usr/bin/termux-battery-status') || fs.existsSync('/system/bin/getprop')) {
            const out = execSync('termux-battery-status', { timeout: 800, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
            const parsed = JSON.parse(out);
            data.battery = {
                percentage: parsed.percentage,
                temperature: parsed.temperature ? parseFloat((parsed.temperature / (parsed.temperature > 100 ? 10 : 1)).toFixed(1)) : null,
                status: parsed.status, // e.g. CHARGING, DISCHARGING, FULL
                health: parsed.health, // e.g. GOOD, OVERHEAT
                plugged: parsed.plugged // e.g. PLUGGED_AC, PLUGGED_USB, UNPLUGGED
            };
            data.termuxApiAvailable = true;
        }
    } catch (e) {}

    // 2. Android device props via getprop
    try {
        if (isTermuxEnv || fs.existsSync('/system/bin/getprop')) {
            const model = execSync('getprop ro.product.model', { timeout: 500, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            const brand = execSync('getprop ro.product.brand', { timeout: 500, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            const manufacturer = execSync('getprop ro.product.manufacturer', { timeout: 500, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            const androidVer = execSync('getprop ro.build.version.release', { timeout: 500, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            const sdk = execSync('getprop ro.build.version.sdk', { timeout: 500, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();

            if (model || brand || manufacturer) {
                data.device = {
                    brand: brand || manufacturer,
                    model: model,
                    manufacturer: manufacturer,
                    androidVersion: androidVer,
                    sdkVersion: sdk
                };
            }
        }
    } catch (e) {}

    return data;
}

export function getSystemInfo() {
    const rawConfigMode = getRawSystemInfoConfig();
    const mode = getSystemInfoMode(); // 'ubuntu', 'termux', 'debian', etc.
    const cpuPercent = getCpuUsagePercent();
    const mem = getMemoryStats();
    const cores = detectTotalCpuCores();
    const cpuModel = detectCpuModel();
    const loadAvg = getUptimeLoadAvg();
    const uptimeSec = os.uptime();
    const processUptimeSec = process.uptime();
    const cpuTemp = detectCpuTemp();

    const info = {
        success: true,
        mode: mode,
        configMode: rawConfigMode,
        timestamp: Date.now(),
        cpu: {
            usagePercent: cpuPercent,
            cores: cores,
            model: cpuModel,
            temperature: cpuTemp,
            speedMHz: os.cpus()?.[0]?.speed || 0,
            loadAvg: [
                parseFloat((loadAvg[0] || 0).toFixed(2)),
                parseFloat((loadAvg[1] || 0).toFixed(2)),
                parseFloat((loadAvg[2] || 0).toFixed(2))
            ]
        },
        memory: {
            totalBytes: mem.totalBytes,
            usedBytes: mem.usedBytes,
            freeBytes: mem.freeBytes,
            availableBytes: mem.availableBytes,
            usagePercent: mem.usagePercent,
            totalFormatted: mem.totalFormatted,
            usedFormatted: mem.usedFormatted,
            freeFormatted: mem.freeFormatted,
            availableFormatted: mem.availableFormatted,
            processRssFormatted: mem.processRssFormatted,
            processHeapUsedFormatted: mem.processHeapUsedFormatted
        },
        os: {
            platform: os.platform(),
            type: os.type(),
            release: os.release(),
            arch: os.arch(),
            hostname: os.hostname(),
            nodeVersion: process.version,
            systemUptimeSec: uptimeSec,
            systemUptimeFormatted: formatUptime(uptimeSec),
            processUptimeSec: processUptimeSec,
            processUptimeFormatted: formatUptime(processUptimeSec)
        }
    };

    const isTermux = mode === 'termux';
    info.isTermux = isTermux;
    if (isTermux) {
        const termuxStats = getTermuxData();
        info.battery = termuxStats.battery || null;
        info.termux = termuxStats;
    } else {
        info.battery = null;
    }

    return info;
}
