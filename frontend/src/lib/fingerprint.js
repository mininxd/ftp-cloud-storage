/**
 * Fingerprint.js - Static Cross-Browser Hardware Device Fingerprinting Library
 *
 * Generates a persistent, static device fingerprint that remains identical
 * across different browsers (Chrome, Firefox, Safari, Edge, Brave, Opera)
 * on the SAME physical machine.
 *
 * Excludes dynamic hardware (e.g. Audio DAC / headphones / Bluetooth peripherals).
 * Focuses purely on immutable hardware, GPU architecture, screen display, CPU, OS, and timezone.
 *
 * Output format: 0x{32_hex_characters} (e.g. 0x4a8f9c1b7e3d0a2f5b6c8d1e3a5b7c9d)
 */

/**
 * Pure JavaScript 128-bit MD5 implementation
 * Produces exactly 32 lowercase hexadecimal characters
 */
function md5(string) {
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        for (var i = 0; i < lNumberOfWords; i++) lWordArray[i] = 0;
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function wordToHex(lValue) {
        var WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = '0' + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    function utf8Encode(string) {
        string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    var x = [];
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = utf8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x04881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

/**
 * Format a 32-character hex hash into 0x{32_hex_chars} format
 */
function formatHexOutput(hexStr) {
    var cleanHex = (hexStr || '').replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    if (cleanHex.length < 32) {
        cleanHex = cleanHex.padEnd(32, '0');
    } else if (cleanHex.length > 32) {
        cleanHex = cleanHex.substring(0, 32);
    }
    return '0x' + cleanHex;
}

/**
 * Normalize GPU Renderer and Vendor strings across ANGLE, Direct3D, OpenGL, Metal, and Vulkan
 * Strips driver build numbers and wrapper variations to match identical GPU hardware across browsers.
 */
function normalizeGpuInfo(vendor, renderer) {
    if (!renderer && !vendor) return 'unknown-gpu';

    var raw = ((vendor || '') + ' ' + (renderer || '')).toLowerCase();

    // Identify primary GPU vendor
    var brand = 'unknown';
    if (/nvidia|geforce|quadro|nvs|rtx|gtx/i.test(raw)) brand = 'nvidia';
    else if (/amd|ati|radeon|firepro|ryzen/i.test(raw)) brand = 'amd';
    else if (/intel|iris|uhd|hd graphics/i.test(raw)) brand = 'intel';
    else if (/apple|m1|m2|m3|m4/i.test(raw)) brand = 'apple';
    else if (/qualcomm|adreno/i.test(raw)) brand = 'qualcomm';
    else if (/mali|bifrost|valhall|midgard/i.test(raw)) brand = 'arm-mali';
    else if (/powervr|img/i.test(raw)) brand = 'powervr';

    // Normalize chipset string: remove ANGLE prefixes, wrapper APIs, and driver version digits
    var clean = (renderer || raw)
        .toLowerCase()
        .replace(/angle\s*\([^,]+,\s*/gi, '')
        .replace(/direct3d\s*\d+(\.\d+)?/gi, '')
        .replace(/vs_\d+_\d+/gi, '')
        .replace(/ps_\d+_\d+/gi, '')
        .replace(/d3d\d+(-\d+(\.\d+)*)?/gi, '')
        .replace(/opengl\s*\d+(\.\d+)?/gi, '')
        .replace(/metal(-\d+)?/gi, '')
        .replace(/vulkan(-\d+)?/gi, '')
        .replace(/\b(corporation|inc|technologies|series|family|graphics|laptop gpu|gpu|pcie|sse2)\b/gi, '')
        .replace(/\([^)]*\)/g, '')
        .replace(/[\d.]+-[\d.]+/g, '')
        .replace(/\b\d+\.\d+\.\d+\.\d+\b/g, '') // strip IP-like driver versions
        .replace(/\s+/g, ' ')
        .trim();

    return brand + '|' + clean;
}

/**
 * Extract physical GPU architecture limits (WebGL Hardware Registers)
 * These values are fixed by the physical GPU hardware and driver architecture,
 * matching across Chrome, Firefox, Safari, Edge, Brave, Opera.
 */
function getWebGLHardwareProfile() {
    if (typeof document === 'undefined') return {};
    try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return { supported: false };

        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        var unmaskedVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
        var unmaskedRenderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

        var profile = {
            gpu: normalizeGpuInfo(unmaskedVendor, unmaskedRenderer),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxCubeMapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
            maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
            maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
            maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
            maxCombinedTextureUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
            maxVertexTextureUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
            maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
            maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            depthBits: gl.getParameter(gl.DEPTH_BITS),
            stencilBits: gl.getParameter(gl.STENCIL_BITS)
        };

        // Hardware floating-point precision range
        var vPrec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
        if (vPrec) {
            profile.vPrec = vPrec.rangeMin + ':' + vPrec.rangeMax + ':' + vPrec.precision;
        }
        var fPrec = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        if (fPrec) {
            profile.fPrec = fPrec.rangeMin + ':' + fPrec.rangeMax + ':' + fPrec.precision;
        }

        return profile;
    } catch (e) {
        return { supported: false };
    }
}

/**
 * Normalize OS family across platforms without relying on browser-specific UA versions
 */
function getNormalizedOS() {
    if (typeof navigator === 'undefined') return 'unknown-os';
    var platform = (navigator.platform || '').toLowerCase();
    var ua = (navigator.userAgent || '').toLowerCase();

    if (/win/i.test(platform) || /windows/i.test(ua)) return 'windows';
    if (/iphone|ipad|ipod/i.test(platform) || /iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/mac/i.test(platform) || /macintosh|mac os x/i.test(ua)) return 'macos';
    if (/android/i.test(ua)) return 'android';
    if (/linux/i.test(platform) || /linux/i.test(ua)) return 'linux';
    if (/cros/i.test(ua)) return 'chromeos';
    return 'other-os';
}

/**
 * Detect physical display properties invariant across browsers on same monitor
 */
function getScreenHardwareProfile() {
    if (typeof window === 'undefined' || typeof screen === 'undefined') return {};
    var scr = screen;
    var dpr = window.devicePixelRatio || 1;

    return {
        // Physical screen resolution
        width: scr.width || 0,
        height: scr.height || 0,
        // Color depth
        colorDepth: scr.colorDepth || 0,
        pixelDepth: scr.pixelDepth || 0,
        // Display scaling ratio
        devicePixelRatio: dpr
    };
}

/**
 * Detect installed OS system fonts via span metrics.
 * The set of detected fonts depends on files installed on the OS (e.g. C:\Windows\Fonts, /Library/Fonts),
 * which is identical across Chrome, Firefox, Safari, Edge on the same system.
 */
function getInstalledSystemFonts() {
    if (typeof document === 'undefined') return [];

    var candidateFonts = [
        'Segoe UI', 'Calibri', 'Cambria', 'Consolas', 'Candara', 'Corbel', 'Constantia',
        'Franklin Gothic Medium', 'Gabriola', 'Georgia', 'Impact', 'Lucida Console',
        'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype', 'Sylfaen',
        'Tahoma', 'Trebuchet MS', 'Verdana', 'Arial', 'Times New Roman', 'Courier New',
        'Apple Color Emoji', 'Helvetica Neue', 'San Francisco', 'Geneva', 'Monaco',
        'Ubuntu', 'Roboto', 'Liberation Sans', 'DejaVu Sans', 'Cantarell'
    ];

    var baseFonts = ['monospace', 'sans-serif', 'serif'];
    var testString = 'mmmmmmmmmmlliWWWW1234';
    var testSize = '72px';

    try {
        var body = document.getElementsByTagName('body')[0] || document.documentElement;
        var container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.visibility = 'hidden';
        body.appendChild(container);

        var span = document.createElement('span');
        span.style.fontSize = testSize;
        span.innerHTML = testString;
        container.appendChild(span);

        var baseWidths = {};
        for (var b = 0; b < baseFonts.length; b++) {
            span.style.fontFamily = baseFonts[b];
            baseWidths[baseFonts[b]] = span.offsetWidth;
        }

        var detected = [];
        for (var f = 0; f < candidateFonts.length; f++) {
            var font = candidateFonts[f];
            var matched = false;
            for (var j = 0; j < baseFonts.length; j++) {
                span.style.fontFamily = "'" + font + "'," + baseFonts[j];
                if (span.offsetWidth !== baseWidths[baseFonts[j]]) {
                    matched = true;
                    break;
                }
            }
            if (matched) detected.push(font);
        }

        body.removeChild(container);
        return detected;
    } catch (e) {
        return [];
    }
}

/**
 * Collect Static Cross-Browser Invariant Hardware & System Signals
 * Purely based on immutable physical device characteristics (CPU, OS, display panel, audio engine, timezone)
 * Completely excludes GPU/WebGL noise and font subpixel calculations to ensure 100% cross-browser parity.
 */
function collectStaticHardwareComponents() {
    var components = {};

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        var nav = navigator;

        // 1. Operating System Family (Normalized: windows, macos, linux, android, ios, chromeos)
        components.os = getNormalizedOS();

        // 2. Hardware CPU Concurrency (Logical CPU cores)
        components.cpuCores = nav.hardwareConcurrency || 4;

        // 3. Physical Touch Capabilities
        components.touchPoints = nav.maxTouchPoints || 0;

        // 4. Physical Display Screen Architecture (Orientation-invariant)
        var scr = typeof screen !== 'undefined' ? screen : {};
        var sw = scr.width || 0;
        var sh = scr.height || 0;
        var saw = scr.availWidth || 0;
        var sah = scr.availHeight || 0;
        components.screenLong = Math.max(sw, sh);
        components.screenShort = Math.min(sw, sh);
        components.availLong = Math.max(saw, sah);
        components.availShort = Math.min(saw, sah);
        components.colorDepth = scr.colorDepth || 24;
        components.pixelRatio = window.devicePixelRatio || 1;

        // 5. Display Panel Gamut & HDR Capabilities
        try {
            if (typeof window.matchMedia === 'function') {
                if (window.matchMedia('(color-gamut: rec2020)').matches) {
                    components.colorGamut = 'rec2020';
                } else if (window.matchMedia('(color-gamut: p3)').matches) {
                    components.colorGamut = 'p3';
                } else if (window.matchMedia('(color-gamut: srgb)').matches) {
                    components.colorGamut = 'srgb';
                }

                components.hdrSupport = Boolean(window.matchMedia('(dynamic-range: high)').matches);
                components.pointerType = window.matchMedia('(pointer: fine)').matches ? 'fine' : (window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'none');
                components.hoverCapability = Boolean(window.matchMedia('(hover: hover)').matches);
            }
        } catch (e) {}

        // 6. Native OS Audio Subsystem Frequency (Sample Rate)
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                var actx = new AudioCtx();
                components.audioSampleRate = actx.sampleRate || 48000;
                if (typeof actx.close === 'function') {
                    actx.close().catch(function() {});
                }
            }
        } catch (e) {}

        // 7. Timezone & Locale Constants (Physical machine clock & zone)
        try {
            components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            components.calendar = Intl.DateTimeFormat().resolvedOptions().calendar || 'gregory';
            components.numberLocale = Intl.NumberFormat().resolvedOptions().locale || '';
        } catch (e) {
            components.timezone = '';
        }
        components.timezoneOffset = new Date().getTimezoneOffset();

        // 8. Device Memory (if reported by browser)
        if (typeof nav.deviceMemory === 'number') {
            components.deviceMemory = nav.deviceMemory;
        }
    } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Server-side / Node.js fallback
        try {
            var os = awaitImportOs();
            if (os) {
                components.osPlatform = os.platform();
                components.osArch = os.arch();
                components.osHostname = os.hostname();
                components.osTotalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024)); // Normalized GB
                components.cpus = (os.cpus() || []).map(function (c) { return c.model; }).sort().join(';');
                components.networkInterfaces = Object.keys(os.networkInterfaces() || {}).sort().join(',');
            } else {
                components.nodeEnv = (process.platform || 'node') + '_' + (process.arch || 'unknown');
            }
        } catch (e) {
            components.nodeEnv = (process.platform || 'node') + '_' + (process.arch || 'unknown');
        }
    } else {
        components.unknownEnv = 'standalone-device';
    }

    return components;
}

function awaitImportOs() {
    try {
        if (typeof require === 'function') {
            return require('os');
        }
    } catch (e) {}
    return null;
}

/**
 * Hashes component payload to 32 hex chars
 */
function hashComponents(components) {
    var serialized = typeof components === 'string' ? components : JSON.stringify(components, Object.keys(components).sort());
    return md5(serialized);
}

/**
 * Asynchronously retrieve static cross-browser device fingerprint: "0x{32_hex_characters}"
 * Completely static, immutable, and audio-free.
 * @returns {Promise<string>}
 */
export async function getFingerprint() {
    var components = collectStaticHardwareComponents();
    var hash = hashComponents(components);
    return formatHexOutput(hash);
}

/**
 * Synchronously retrieve static cross-browser device fingerprint: "0x{32_hex_characters}"
 * @returns {string}
 */
export function getFingerprintSync() {
    var components = collectStaticHardwareComponents();
    var hash = hashComponents(components);
    return formatHexOutput(hash);
}

/**
 * Retrieve raw breakdown of static hardware components (async)
 * @returns {Promise<object>}
 */
export async function getComponents() {
    return collectStaticHardwareComponents();
}

/**
 * Retrieve raw breakdown of static hardware components synchronously
 * @returns {object}
 */
export function getComponentsSync() {
    return collectStaticHardwareComponents();
}

/**
 * Generate a random 32-character hex fingerprint: "0x{32_hex_characters}"
 * @returns {string}
 */
export function generateRandom() {
    var hex = '';
    for (var i = 0; i < 32; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
    }
    return '0x' + hex;
}

export const generateRandomFingerprint = generateRandom;

/**
 * Core Fingerprint Object
 */
export const Fingerprint = {
    getFingerprint: getFingerprint,
    getFingerprintSync: getFingerprintSync,
    getComponents: getComponents,
    getComponentsSync: getComponentsSync,
    generateRandom: generateRandom,
    generateRandomFingerprint: generateRandomFingerprint,
    formatHexOutput: formatHexOutput,
    md5: md5,
    crossBrowser: true,
    audioDisabled: true
};

// Bind to global/window if available for browser script usage
if (typeof globalThis !== 'undefined') {
    globalThis.Fingerprint = Fingerprint;
} else if (typeof window !== 'undefined') {
    window.Fingerprint = Fingerprint;
}

export default Fingerprint;
