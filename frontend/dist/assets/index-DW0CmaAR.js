var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),l=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o(((e,t)=>{t.exports={}}));function d(e){function t(e,t){return e<<t|e>>>32-t}function n(e,t){var n,r,i=e&2147483648,a=t&2147483648,o;return n=e&1073741824,r=t&1073741824,o=(e&1073741823)+(t&1073741823),n&r?o^2147483648^i^a:n|r?o&1073741824?o^3221225472^i^a:o^1073741824^i^a:o^i^a}function r(e,t,n){return e&t|~e&n}function i(e,t,n){return e&n|t&~n}function a(e,t,n){return e^t^n}function o(e,t,n){return t^(e|~n)}function s(e,i,a,o,s,c,l){return e=n(e,n(n(r(i,a,o),s),l)),n(t(e,c),i)}function c(e,r,a,o,s,c,l){return e=n(e,n(n(i(r,a,o),s),l)),n(t(e,c),r)}function l(e,r,i,o,s,c,l){return e=n(e,n(n(a(r,i,o),s),l)),n(t(e,c),r)}function u(e,r,i,a,s,c,l){return e=n(e,n(n(o(r,i,a),s),l)),n(t(e,c),r)}function d(e){for(var t,n=e.length,r=n+8,i=((r-r%64)/64+1)*16,a=Array(i-1),o=0;o<i;o++)a[o]=0;for(var s=0,c=0;c<n;)t=(c-c%4)/4,s=c%4*8,a[t]=a[t]|e.charCodeAt(c)<<s,c++;return t=(c-c%4)/4,s=c%4*8,a[t]=a[t]|128<<s,a[i-2]=n<<3,a[i-1]=n>>>29,a}function f(e){var t=``,n=``,r,i;for(i=0;i<=3;i++)r=e>>>i*8&255,n=`0`+r.toString(16),t+=n.substr(n.length-2,2);return t}function p(e){e=(e+``).replace(/\r\n/g,`
`).replace(/\r/g,`
`);for(var t=``,n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):r>127&&r<2048?(t+=String.fromCharCode(r>>6|192),t+=String.fromCharCode(r&63|128)):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128),t+=String.fromCharCode(r&63|128))}return t}var m=[],h,g,_,v,y,b,x,S,C,w=7,T=12,E=17,D=22,O=5,k=9,A=14,j=20,M=4,N=11,P=16,F=23,I=6,L=10,ee=15,R=21;for(e=p(e),m=d(e),b=1732584193,x=4023233417,S=2562383102,C=271733878,h=0;h<m.length;h+=16)g=b,_=x,v=S,y=C,b=s(b,x,S,C,m[h+0],w,3614090360),C=s(C,b,x,S,m[h+1],T,3905402710),S=s(S,C,b,x,m[h+2],E,606105819),x=s(x,S,C,b,m[h+3],D,3250441966),b=s(b,x,S,C,m[h+4],w,4118548399),C=s(C,b,x,S,m[h+5],T,1200080426),S=s(S,C,b,x,m[h+6],E,2821735955),x=s(x,S,C,b,m[h+7],D,4249261313),b=s(b,x,S,C,m[h+8],w,1770035416),C=s(C,b,x,S,m[h+9],T,2336552879),S=s(S,C,b,x,m[h+10],E,4294925233),x=s(x,S,C,b,m[h+11],D,2304563134),b=s(b,x,S,C,m[h+12],w,1804603682),C=s(C,b,x,S,m[h+13],T,4254626195),S=s(S,C,b,x,m[h+14],E,2792965006),x=s(x,S,C,b,m[h+15],D,1236535329),b=c(b,x,S,C,m[h+1],O,4129170786),C=c(C,b,x,S,m[h+6],k,3225465664),S=c(S,C,b,x,m[h+11],A,643717713),x=c(x,S,C,b,m[h+0],j,3921069994),b=c(b,x,S,C,m[h+5],O,3593408605),C=c(C,b,x,S,m[h+10],k,38016083),S=c(S,C,b,x,m[h+15],A,3634488961),x=c(x,S,C,b,m[h+4],j,3889429448),b=c(b,x,S,C,m[h+9],O,568446438),C=c(C,b,x,S,m[h+14],k,3275163606),S=c(S,C,b,x,m[h+3],A,4107603335),x=c(x,S,C,b,m[h+8],j,1163531501),b=c(b,x,S,C,m[h+13],O,2850285829),C=c(C,b,x,S,m[h+2],k,4243563512),S=c(S,C,b,x,m[h+7],A,1735328473),x=c(x,S,C,b,m[h+12],j,2368359562),b=l(b,x,S,C,m[h+5],M,4294588738),C=l(C,b,x,S,m[h+8],N,2272392833),S=l(S,C,b,x,m[h+11],P,1839030562),x=l(x,S,C,b,m[h+14],F,4259657740),b=l(b,x,S,C,m[h+1],M,2763975236),C=l(C,b,x,S,m[h+4],N,1272893353),S=l(S,C,b,x,m[h+7],P,4139469664),x=l(x,S,C,b,m[h+10],F,3200236656),b=l(b,x,S,C,m[h+13],M,681279174),C=l(C,b,x,S,m[h+0],N,3936430074),S=l(S,C,b,x,m[h+3],P,3572445317),x=l(x,S,C,b,m[h+6],F,76029189),b=l(b,x,S,C,m[h+9],M,3654602809),C=l(C,b,x,S,m[h+12],N,3873151461),S=l(S,C,b,x,m[h+15],P,530742520),x=l(x,S,C,b,m[h+2],F,3299628645),b=u(b,x,S,C,m[h+0],I,4096336452),C=u(C,b,x,S,m[h+7],L,1126891415),S=u(S,C,b,x,m[h+14],ee,2878612391),x=u(x,S,C,b,m[h+5],R,4237533241),b=u(b,x,S,C,m[h+12],I,1700485571),C=u(C,b,x,S,m[h+3],L,2399980690),S=u(S,C,b,x,m[h+10],ee,4293915773),x=u(x,S,C,b,m[h+1],R,2240044497),b=u(b,x,S,C,m[h+8],I,1873313359),C=u(C,b,x,S,m[h+15],L,4264355552),S=u(S,C,b,x,m[h+6],ee,2734768916),x=u(x,S,C,b,m[h+13],R,1309151649),b=u(b,x,S,C,m[h+4],I,4149444226),C=u(C,b,x,S,m[h+11],L,3174756917),S=u(S,C,b,x,m[h+2],ee,718787259),x=u(x,S,C,b,m[h+9],R,3951481745),b=n(b,g),x=n(x,_),S=n(S,v),C=n(C,y);return(f(b)+f(x)+f(S)+f(C)).toLowerCase()}function f(e){var t=(e||``).replace(/[^0-9a-fA-F]/g,``).toLowerCase();return t.length<32?t=t.padEnd(32,`0`):t.length>32&&(t=t.substring(0,32)),`0x`+t}function p(){if(typeof navigator>`u`)return`unknown-os`;var e=(navigator.platform||``).toLowerCase(),t=(navigator.userAgent||``).toLowerCase();return/win/i.test(e)||/windows/i.test(t)?`windows`:/iphone|ipad|ipod/i.test(e)||/iphone|ipad|ipod/i.test(t)?`ios`:/mac/i.test(e)||/macintosh|mac os x/i.test(t)?`macos`:/android/i.test(t)?`android`:/linux/i.test(e)||/linux/i.test(t)?`linux`:/cros/i.test(t)?`chromeos`:`other-os`}function m(){var e={};if(typeof window<`u`&&typeof navigator<`u`){var t=navigator;e.os=p(),e.cpuCores=t.hardwareConcurrency||4,e.touchPoints=t.maxTouchPoints||0;var n=typeof screen<`u`?screen:{},r=n.width||0,i=n.height||0,a=n.availWidth||0,o=n.availHeight||0;e.screenLong=Math.max(r,i),e.screenShort=Math.min(r,i),e.availLong=Math.max(a,o),e.availShort=Math.min(a,o),e.colorDepth=n.colorDepth||24,e.pixelRatio=window.devicePixelRatio||1;try{typeof window.matchMedia==`function`&&(window.matchMedia(`(color-gamut: rec2020)`).matches?e.colorGamut=`rec2020`:window.matchMedia(`(color-gamut: p3)`).matches?e.colorGamut=`p3`:window.matchMedia(`(color-gamut: srgb)`).matches&&(e.colorGamut=`srgb`),e.hdrSupport=!!window.matchMedia(`(dynamic-range: high)`).matches,e.pointerType=window.matchMedia(`(pointer: fine)`).matches?`fine`:window.matchMedia(`(pointer: coarse)`).matches?`coarse`:`none`,e.hoverCapability=!!window.matchMedia(`(hover: hover)`).matches)}catch{}try{var s=window.AudioContext||window.webkitAudioContext;if(s){var c=new s;e.audioSampleRate=c.sampleRate||48e3,typeof c.close==`function`&&c.close().catch(function(){})}}catch{}try{e.timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||``,e.calendar=Intl.DateTimeFormat().resolvedOptions().calendar||`gregory`,e.numberLocale=Intl.NumberFormat().resolvedOptions().locale||``}catch{e.timezone=``}e.timezoneOffset=new Date().getTimezoneOffset(),typeof t.deviceMemory==`number`&&(e.deviceMemory=t.deviceMemory)}else if(typeof process<`u`&&process.versions&&process.versions.node)try{var l=h();l?(e.osPlatform=l.platform(),e.osArch=l.arch(),e.osHostname=l.hostname(),e.osTotalMemory=Math.round(l.totalmem()/1073741824),e.cpus=(l.cpus()||[]).map(function(e){return e.model}).sort().join(`;`),e.networkInterfaces=Object.keys(l.networkInterfaces()||{}).sort().join(`,`)):e.nodeEnv=(process.platform||`node`)+`_`+(process.arch||`unknown`)}catch{e.nodeEnv=(process.platform||`node`)+`_`+(process.arch||`unknown`)}else e.unknownEnv=`standalone-device`;return e}function h(){try{if(typeof l==`function`)return u()}catch{}return null}function g(e){return d(typeof e==`string`?e:JSON.stringify(e,Object.keys(e).sort()))}async function _(){return f(g(m()))}function v(){return f(g(m()))}async function y(){return m()}function b(){return m()}function x(){for(var e=``,t=0;t<32;t++)e+=Math.floor(Math.random()*16).toString(16);return`0x`+e}var S={getFingerprint:_,getFingerprintSync:v,getComponents:y,getComponentsSync:b,generateRandom:x,generateRandomFingerprint:x,formatHexOutput:f,md5:d,crossBrowser:!0,audioDisabled:!0};typeof globalThis<`u`?globalThis.Fingerprint=S:typeof window<`u`&&(window.Fingerprint=S);function C(){if(window.location.hash&&window.location.hash.length>1)try{let e=decodeURIComponent(window.location.hash.substring(1));if(e.startsWith(`/`))return e}catch(e){console.warn(`Invalid hash path:`,e)}let e=localStorage.getItem(`mininxd_current_path`);return e&&e.startsWith(`/`)?e:`/`}function w(){return localStorage.getItem(`mininxd_download_mode`)||`zip`}var T={currentPath:C(),filesList:[],selectedFileNames:new Set,sortColumn:`name`,sortDirection:`asc`,hideBottomStatusTimeout:null,activeEditorPath:null,jarInstance:null,currentDeviceFingerprint:localStorage.getItem(`mininxd_device_fingerprint`)||null,currentMasterKey:localStorage.getItem(`mininxd_master_key`)||null,isUserAdmin:localStorage.getItem(`mininxd_is_admin`)===`true`,adminUserList:[],publicModeConfig:null,isPublicMode:!1,currentPublicUser:null,publicCurrentSubpath:`/`};function E(e,t=1){if(!e||e===0)return`0 B`;let n=1024,r=[`B`,`KB`,`MB`,`GB`,`TB`],i=Math.floor(Math.log(e)/Math.log(n));return parseFloat((e/n**i).toFixed(t))+` `+r[i]}function D(e){if(!e)return`--`;try{let t=new Date(e);return isNaN(t.getTime())?String(e):t.toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}catch{return String(e)}}function O(e,t){if(t)return{icon:`ri-folder-fill`,color:`text-amber-500`};let n=(e||``).split(`.`).pop().toLowerCase();return[`apk`,`aab`,`xapk`,`apks`].includes(n)?{icon:`ri-android-fill`,color:`text-emerald-500`}:[`iso`,`chd`,`img`,`bin`,`cue`,`nrg`,`mdf`,`mds`,`cso`,`vdi`,`vmdk`,`qcow2`,`dmg`].includes(n)?{icon:`ri-disc-fill`,color:`text-cyan-500`}:[`zip`,`rar`,`7z`,`tar`,`gz`,`tgz`,`bz2`,`xz`,`zst`,`z`,`cab`].includes(n)?{icon:`ri-file-zip-fill`,color:`text-amber-600`}:[`png`,`jpg`,`jpeg`,`gif`,`webp`,`svg`,`bmp`,`ico`,`tiff`,`tif`,`heic`,`heif`,`avif`,`raw`,`psd`,`ai`].includes(n)?{icon:`ri-image-fill`,color:`text-emerald-500`}:[`mp3`,`wav`,`ogg`,`flac`,`m4a`,`aac`,`opus`,`wma`,`aiff`,`mid`,`midi`].includes(n)?{icon:`ri-music-2-fill`,color:`text-pink-500`}:[`mp4`,`mkv`,`webm`,`avi`,`mov`,`flv`,`wmv`,`m4v`,`3gp`,`ts`,`vob`].includes(n)?{icon:`ri-film-fill`,color:`text-rose-500`}:[`js`,`mjs`,`cjs`].includes(n)?{icon:`ri-javascript-fill`,color:`text-yellow-500`}:[`ts`,`tsx`].includes(n)?{icon:`ri-code-box-fill`,color:`text-blue-500`}:[`jsx`].includes(n)?{icon:`ri-reactjs-fill`,color:`text-cyan-400`}:[`html`,`htm`].includes(n)?{icon:`ri-html5-fill`,color:`text-orange-500`}:[`css`,`scss`,`sass`,`less`].includes(n)?{icon:`ri-css3-fill`,color:`text-blue-400`}:[`py`,`pyw`,`ipynb`].includes(n)?{icon:`ri-python-fill`,color:`text-blue-500`}:[`rs`,`rust`].includes(n)?{icon:`ri-code-s-slash-fill`,color:`text-orange-600`}:[`c`,`cpp`,`cc`,`cxx`,`h`,`hpp`].includes(n)?{icon:`ri-code-s-slash-fill`,color:`text-blue-600`}:[`java`,`kt`,`kts`].includes(n)?{icon:`ri-java-fill`,color:`text-red-500`}:[`php`].includes(n)?{icon:`ri-code-box-fill`,color:`text-indigo-400`}:[`go`].includes(n)?{icon:`ri-code-box-fill`,color:`text-cyan-600`}:[`sh`,`bash`,`zsh`,`fish`,`cmd`,`bat`,`ps1`].includes(n)?{icon:`ri-terminal-box-fill`,color:`text-emerald-600`}:[`sql`,`db`,`sqlite`,`sqlite3`].includes(n)?{icon:`ri-database-2-fill`,color:`text-sky-500`}:[`json`,`yaml`,`yml`,`xml`,`toml`,`ini`,`env`,`conf`,`cfg`].includes(n)?{icon:`ri-settings-4-fill`,color:`text-purple-400`}:n===`pdf`?{icon:`ri-file-pdf-fill`,color:`text-red-500`}:[`doc`,`docx`,`odt`,`rtf`].includes(n)?{icon:`ri-file-word-fill`,color:`text-blue-600`}:[`xls`,`xlsx`,`csv`,`tsv`,`ods`].includes(n)?{icon:`ri-file-excel-fill`,color:`text-emerald-600`}:[`ppt`,`pptx`,`odp`].includes(n)?{icon:`ri-file-ppt-fill`,color:`text-amber-500`}:[`txt`,`md`,`log`].includes(n)?{icon:`ri-file-text-fill`,color:`text-base-content/70`}:[`exe`,`msi`,`deb`,`rpm`,`appimage`,`pkg`].includes(n)?{icon:`ri-terminal-window-fill`,color:`text-indigo-500`}:{icon:`ri-file-3-fill`,color:`text-base-content/60`}}function k(e,t){if(!e)return;let n=0,r=0,i=0,a=!1,o=t=>{let i=t.touches?t.touches[0]:t;n=i.clientX,r=i.clientY,a=!0,e.style.transition=`none`},s=t=>{if(!a)return;let o=t.touches?t.touches[0]:t,s=o.clientX-n,c=Math.abs(o.clientY-r);if(c>Math.abs(s)&&c>10&&i===0){a=!1;return}if(s>0){i=s,e.style.transform=`translateX(${s}px)`;let t=Math.max(0,1-s/200);e.style.opacity=t}},c=()=>{a&&(a=!1,e.style.transition=`transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)`,i>50?(e.style.transform=`translateX(120%)`,e.style.opacity=`0`,setTimeout(()=>{typeof t==`function`?t():e.parentNode&&e.remove()},250)):(e.style.transform=``,e.style.opacity=``,i=0))};e.addEventListener(`touchstart`,o,{passive:!0}),e.addEventListener(`touchmove`,s,{passive:!0}),e.addEventListener(`touchend`,c),e.addEventListener(`mousedown`,o),window.addEventListener(`mousemove`,s),window.addEventListener(`mouseup`,c)}function A(e,t=`info`){let n=document.getElementById(`toastContainer`);if(!n)return;let r=document.createElement(`div`),i=t===`success`?`bg-success/90 text-success-content border-success/30`:t===`error`?`bg-error/90 text-error-content border-error/30`:t===`warning`?`bg-warning/90 text-warning-content border-warning/30`:`bg-base-100/90 text-base-content border-base-300`,a=t===`success`?`ri-checkbox-circle-fill`:t===`error`?`ri-error-warning-fill`:t===`warning`?`ri-alert-fill`:`ri-information-fill`;r.className=`alert ${i} shadow-xl py-2.5 px-3.5 text-xs flex items-center gap-2 animate-fadeIn rounded-2xl border backdrop-blur-md font-sans pointer-events-auto cursor-grab active:cursor-grabbing select-none transition-all duration-200`,r.innerHTML=`
        <i class="${a} text-sm shrink-0"></i>
        <span class="flex-1 font-medium leading-snug">${e}</span>
        <button class="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100 shrink-0" title="Dismiss">
            <i class="ri-close-line text-xs"></i>
        </button>
    `;let o=r.querySelector(`button`);o&&(o.onclick=e=>{e.stopPropagation(),r.style.transition=`transform 0.2s ease, opacity 0.2s ease`,r.style.transform=`translateX(100%)`,r.style.opacity=`0`,setTimeout(()=>r.remove(),200)}),k(r,()=>r.remove()),n.appendChild(r),setTimeout(()=>{r&&r.parentNode&&(r.style.transition=`transform 0.3s ease, opacity 0.3s ease`,r.style.transform=`translateX(100%)`,r.style.opacity=`0`,setTimeout(()=>r.remove(),300))},4e3)}function j(e,t,n=``,r={}){let i=document.getElementById(`bottomStatusBar`),a=document.getElementById(`bottomStatusDot`),o=document.getElementById(`bottomStatusTitle`),s=document.getElementById(`bottomStatusSub`),c=document.getElementById(`bottomStatusRetryBtn`);if(!i)return;let l=document.getElementById(`adminDashboardView`);l&&!l.classList.contains(`hidden`)&&e!==`error`||(i._dragAttached||(i._dragAttached=!0,k(i,()=>{i.classList.add(`hidden`),i.style.transform=``,i.style.opacity=``})),T.hideBottomStatusTimeout&&=(clearTimeout(T.hideBottomStatusTimeout),null),i.classList.remove(`hidden`),i.style.transform=``,i.style.opacity=``,e===`connected`?(a&&(a.className=`w-2 h-2 rounded-full bg-success ring-4 ring-success/20 shrink-0`),o&&(o.textContent=t||`Connected to Storage`),s&&(s.textContent=n?`• ${n}`:``),c&&c.classList.add(`hidden`),T.hideBottomStatusTimeout=setTimeout(()=>{i&&i.classList.add(`hidden`)},3e3)):e===`connecting`?(a&&(a.className=`w-2 h-2 rounded-full bg-warning ring-4 ring-warning/20 shrink-0 animate-pulse`),o&&(o.textContent=t||`Connecting to Storage...`),s&&(s.textContent=n?`• ${n}`:``),c&&c.classList.add(`hidden`)):e===`error`&&(a&&(a.className=`w-2 h-2 rounded-full bg-error ring-4 ring-error/20 shrink-0`),o&&(o.textContent=t||`Connection Issue`),s&&(s.textContent=n?`• ${n}`:``),c&&r.showRetry&&c.classList.remove(`hidden`)))}function M(){try{if(window.GM!==void 0||window.GM_info!==void 0||typeof window.GM_setValue==`function`||typeof window.GM_getValue==`function`||typeof window.GM_xmlhttpRequest==`function`||typeof window.GM_registerMenuCommand==`function`||typeof window.GM_addStyle==`function`||typeof window.GM_log==`function`||window.__tampermonkey_injected||window.__tampermonkey_api||window.__VIOLENTMONKEY_EXTENSION__||window.violentmonkey||document.__tampermonkey||document.__violentmonkey||window.unsafeWindow!==void 0&&window.unsafeWindow!==window)return!0;let e=document.querySelectorAll(`script[src*="tampermonkey"], script[src*="violentmonkey"], script[data-userscript]`);return!!(e&&e.length>0)}catch{return!1}}async function N(e,t={}){let n={...t.headers||{}},r=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),i=M();if(r&&(n[`x-device-fingerprint`]=r,n[`x-fingerprint`]=r),!i){let e=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||sessionStorage.getItem(`mininxd_master_key`);e&&(n[`x-master-key`]=e,n[`x-masterkey`]=e)}if(T.currentPublicUser&&T.currentPublicUser.clean_id){let e=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id);e&&(n[`x-public-key`]=e,n[`x-pub-key`]=e)}return fetch(e,{...t,headers:n})}function P(){document.querySelector(`#app`).innerHTML=`
  <!-- Toast Container -->
  <div id="toastContainer" class="fixed top-4 right-4 z-[250] flex flex-col gap-2 pointer-events-none"></div>

  <!-- Drag and Drop Full Screen Overlay -->
  <div id="dragDropOverlay" class="fixed inset-0 z-[300] bg-primary/10 border-4 border-dashed border-primary backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none hidden animate-fadeIn">
    <div class="bg-base-100 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-3 border border-primary/30">
      <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl">
        <i class="ri-upload-cloud-2-line"></i>
      </div>
      <h3 class="font-bold text-lg text-base-content">Drop files to upload</h3>
      <p class="text-xs text-base-content/60 font-mono" id="dropTargetLabel">Uploading to current directory</p>
    </div>
  </div>

  <!-- Minimal Clean Header with Refined Title, Storage Info Pill & Settings Button -->
  <div class="navbar bg-base-100 border-b border-base-300 px-4 sm:px-8 min-h-16 sticky top-0 z-30 shadow-xs">
    <div class="flex-1 flex items-center gap-3 min-w-0">
      <h1 id="navAppTitle" class="text-base sm:text-lg font-semibold text-base-content tracking-tight">FTP Server</h1>
    </div>
    
    <div class="flex items-center gap-2">
      <!-- Setup Admin / Welcome Button (Visible only while admin is not setup) -->
      <button id="navWelcomeSetupBtn" class="hidden btn btn-warning btn-sm h-8 px-2.5 rounded-xl gap-1.5 text-xs font-semibold shadow-xs animate-pulse" title="Initial Setup: Configure Admin & Master Key">
        <i class="ri-shield-keyhole-line text-sm"></i>
        <span class="hidden xs:inline">Setup Admin</span>
      </button>

      <!-- Admin Console Button (Visible when user is verified admin and on file manager view) -->
      <button id="navAdminConsoleBtn" class="hidden btn btn-ghost btn-sm h-8 px-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition" title="Open Admin Console">
        <i class="ri-shield-check-line text-sm"></i>
        <span class="hidden xs:inline">Admin Console</span>
      </button>

      <!-- Storage Info Badge / Pill on Navbar -->
      <button id="navStorageWidget" class="btn btn-ghost btn-sm h-8 px-2.5 rounded-xl border border-base-300 bg-base-200/60 hover:bg-base-200 flex items-center gap-2 text-xs font-mono transition shadow-2xs group cursor-pointer font-normal" title="Storage Usage: Click to view details">
        <div class="flex items-center gap-1.5 text-primary">
          <i id="navStorageIcon" class="ri-hard-drive-2-line text-sm group-hover:scale-110 transition-transform"></i>
          <span id="navStorageText" class="font-medium text-base-content text-[11px] sm:text-xs">...</span>
        </div>
        <div class="w-12 sm:w-16 h-1.5 bg-base-300 rounded-full overflow-hidden hidden xs:block">
          <div id="navStorageBar" class="h-full bg-primary rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <main class="max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
    
    <!-- Toast / Notification Bar -->
    <div id="toastMessage" class="hidden alert alert-info text-xs py-2 px-4 shadow-md flex items-center gap-2 z-[150] rounded-2xl">
      <i class="ri-information-line text-base"></i>
      <span id="toastText"></span>
    </div>

    <!-- VIEW 1: FILE EXPLORER (Default) -->
    <div id="fileManagerView" class="flex flex-col gap-4">
      <!-- Floating Clipboard Bar for Paste Action -->
      <div id="clipboardBar" class="hidden alert bg-base-100 border border-primary/40 shadow-xl text-xs py-2 px-4 flex items-center justify-between gap-3 z-[150] rounded-2xl animate-fadeIn">
        <div class="flex items-center gap-2.5 min-w-0 font-mono">
          <i id="clipboardIcon" class="ri-file-copy-line text-primary text-base"></i>
          <span id="clipboardText" class="font-medium text-base-content truncate text-xs">0 items copied</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button id="pasteBtn" class="btn btn-primary btn-xs gap-1.5 font-sans font-semibold">
            <i class="ri-clipboard-line text-xs"></i>
            <span>Paste Here</span>
          </button>
          <button id="cancelClipboardBtn" class="btn btn-ghost btn-xs btn-circle" title="Cancel Copy/Cut">
            <i class="ri-close-line text-xs"></i>
          </button>
        </div>
      </div>

      <!-- ZIP Creation / Download Queue Progress Floating Cards Container -->
      <div id="zipProgressContainer" class="flex flex-col gap-2 z-[160] w-full"></div>

      <!-- Upload Progress Floating Card with Backend Cache & Retry Support -->
      <div id="uploadProgressContainer" class="hidden alert bg-base-100 border border-base-300 shadow-xl text-xs py-3 px-4 flex flex-col gap-2 z-[160] rounded-2xl animate-fadeIn">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 min-w-0">
            <i id="uploadProgressIcon" class="ri-upload-cloud-2-line text-primary text-base animate-bounce"></i>
            <span id="uploadProgressFilename" class="font-mono font-bold truncate text-xs sm:text-sm text-base-content">uploading_file.zip</span>
            <span id="uploadProgressTargetDir" class="text-[11px] text-base-content/50 font-mono hidden sm:inline truncate">to /apk_mod</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span id="uploadProgressPct" class="badge badge-primary badge-xs font-mono text-[10px] font-bold">0%</span>
            <button id="uploadCloseBtn" class="btn btn-ghost btn-xs btn-circle hidden" title="Dismiss">
              <i class="ri-close-line text-xs"></i>
            </button>
          </div>
        </div>
        <div class="w-full bg-base-300 h-2 rounded-full overflow-hidden">
          <div id="uploadProgressBar" class="h-full bg-primary rounded-full transition-all duration-200" style="width: 0%"></div>
        </div>
        <div class="flex items-center justify-between text-[11px] text-base-content/60 font-mono w-full min-h-[18px]">
          <span id="uploadProgressBytes">0 MB / 0 MB</span>
          <div class="flex items-center gap-2 ml-auto">
            <span id="uploadProgressSpeed" class="flex items-center">Uploading...</span>
            <button id="uploadRetryBtn" class="btn btn-xs btn-warning hidden gap-1 font-sans font-medium" title="Retry upload from backend cache">
              <i class="ri-refresh-line text-xs"></i>
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Public Access Info (Option 3 Minimalist Inline Status Bar) -->
      <div id="publicModeHeaderBanner" class="hidden flex items-center justify-between gap-2.5 bg-base-100/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-base-300 shadow-2xs animate-fadeIn flex-wrap sm:flex-nowrap">
        <!-- Left / Core Metadata (Identity + Micro Quota + Security + Formats) -->
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <!-- Title: Public Shared Folder -->
          <span class="text-sm sm:text-base font-bold text-base-content tracking-tight shrink-0 flex items-center gap-1.5 mr-1">
            <i class="ri-folder-shared-line text-primary text-base sm:text-lg"></i>
            <span>Public Shared Folder</span>
          </span>

          <!-- Combined Grid: (@userid) (storage) -->
          <div class="grid grid-cols-2 gap-1.5 items-center">
            <!-- Monospace ID Chip -->
            <div id="publicModeUserChip" class="flex items-center gap-1.5 bg-base-200/90 text-base-content px-2.5 py-1 rounded-xl border border-base-300/80 text-xs font-mono select-all transition" title="Public Space ID">
              <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span id="publicModeUserDisplay" class="font-bold truncate">@public</span>
            </div>

            <!-- Micro Inline Quota Pill with Storage Icon & Percent Badge -->
            <div class="flex items-center gap-2 bg-base-200/50 border border-base-300/60 px-2.5 py-1 rounded-xl text-[11px] font-mono text-base-content/80 min-w-0" title="Storage Progress">
              <i class="ri-hard-drive-2-line text-primary text-xs shrink-0"></i>
              <div class="flex-1 min-w-8 bg-base-300 h-1.5 rounded-full overflow-hidden">
                <div id="publicModeQuotaProgressBar" class="h-full bg-primary rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
              <span id="publicModeQuotaPercentBadge" class="badge badge-neutral badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0">0% used</span>
            </div>
          </div>

          <!-- Storage Limit Badge with Storage Icon & 0 MB / 100 MB -->
          <div id="publicModeLimitBadge" class="flex items-center gap-1.5 bg-base-200/50 border border-base-300/60 px-2.5 py-1 rounded-xl text-[11px] font-mono text-base-content/80" title="Storage Usage & Limit">
            <i class="ri-hard-drive-2-line text-primary text-xs shrink-0"></i>
            <span id="publicModeQuotaUsedText" class="font-bold">0 MB / 100 MB</span>
          </div>

          <!-- Security Badge -->
          <span id="publicModeKeyBadge" class="hidden badge badge-warning badge-xs font-mono text-[10px] gap-1 py-1.5 px-2 rounded-lg">
            <i class="ri-lock-2-line text-[10px]"></i>
            <span id="publicModeKeyBadgeText">Protected</span>
          </span>

          <!-- Allowed Formats Inline Chips (Only shown when whitelist mode is active) -->
          <div id="publicModeAllowedFormatsContainer" class="hidden flex items-center gap-1.5 bg-base-200/50 border border-base-300/60 px-2.5 py-1 rounded-xl text-[11px] font-mono">
            <span class="text-base-content/50 font-sans text-[10px]">Allowed:</span>
            <div id="publicModeFormatChipsList" class="flex items-center gap-1 flex-wrap"></div>
          </div>
        </div>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-1.5 shrink-0 ml-auto">
          <!-- Password Management Button -->
          <button id="publicSetPasswordBtn" type="button" class="btn btn-ghost btn-xs h-7 px-2.5 rounded-xl border border-base-300 hover:border-primary gap-1 text-[11px] font-sans font-medium transition shadow-2xs" title="Manage password for this public space">
            <i class="ri-shield-keyhole-line text-xs text-primary" id="publicSetPasswordIcon"></i>
            <span id="publicSetPasswordText">Add Password</span>
          </button>
        </div>
      </div>

      <!-- File Explorer Window / Card (70% Screen Height) -->
      <div class="card bg-base-100 border border-base-300 shadow-sm rounded-2xl overflow-hidden min-h-[70vh] flex flex-col">
        
        <!-- Toolbar & Breadcrumb Bar with Refresh Button -->
        <div class="p-3 sm:p-4 border-b border-base-300 bg-base-200/40 flex items-center justify-between gap-3 flex-wrap">
          
          <!-- Breadcrumb / Path Navigation -->
          <div class="flex items-center gap-1 text-xs font-mono overflow-x-auto py-1" id="breadcrumbBar">
            <button class="btn btn-ghost btn-xs text-primary font-bold px-2 gap-1" id="navRootBtn">
              root
            </button>
            <span class="text-base-content/40">/</span>
          </div>

          <!-- Toolbar Controls: Refresh, Up, Search -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button id="refreshBtn" class="btn btn-primary btn-xs sm:btn-sm gap-1.5 font-semibold" title="Refresh Directory">
              <span id="btnSpinner" class="hidden loading loading-spinner loading-xs"></span>
              <i class="ri-refresh-line text-xs sm:text-sm"></i>
              <span>Refresh</span>
            </button>

            <button id="navUpBtn" class="btn btn-outline btn-xs sm:btn-sm gap-1" title="Go to Parent Directory">
              <i class="ri-arrow-up-line text-xs sm:text-sm"></i>
              <span>Up</span>
            </button>
            
            <div class="relative flex-1 sm:w-48">
              <input type="text" id="searchInput" placeholder="Filter files..." class="input input-bordered input-xs sm:input-sm w-full text-xs pl-7 font-mono" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
              <i class="ri-search-line text-base-content/40 absolute left-2.5 top-2 text-xs"></i>
            </div>
          </div>
        </div>

        <!-- Pending / Failed Uploads Notice Banner (Above Table) -->
        <div id="pendingUploadsBanner" class="hidden m-3 p-3 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-warning/20 text-warning flex items-center justify-center shrink-0">
              <i class="ri-upload-cloud-2-line text-base"></i>
            </div>
            <div class="min-w-0 font-mono">
              <div class="font-bold text-base-content flex items-center gap-2 text-xs">
                <span id="pendingBannerTitle">1 Cached Upload Ready</span>
                <span class="badge badge-warning badge-xs font-sans font-semibold">Saved</span>
              </div>
              <p id="pendingBannerSubtitle" class="text-[11px] text-base-content/60 truncate">file.zip to /path</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button id="pendingBannerResumeBtn" class="btn btn-warning btn-xs gap-1 font-sans font-semibold shadow-xs">
              <i class="ri-play-line text-xs"></i>
              <span>Resume</span>
            </button>
          </div>
        </div>

        <!-- File Table with Sortable Columns and Checkboxes -->
        <div class="overflow-x-auto flex-1">
          <table class="table table-zebra table-sm sm:table-md w-full">
            <thead>
              <tr class="text-xs uppercase tracking-wider text-base-content/60 border-b border-base-300">
                <th class="w-8 text-center">
                  <input type="checkbox" id="selectAllCheckbox" class="checkbox checkbox-xs checkbox-primary" />
                </th>
                <th class="w-10 text-center">Type</th>
                <th class="cursor-pointer hover:text-primary transition select-none" id="sortNameHeader">
                  <div class="flex items-center gap-1.5">
                    <span>Name</span>
                    <i id="sortNameIcon" class="ri-arrow-up-down-line text-xs opacity-50"></i>
                  </div>
                </th>
                <th class="text-right cursor-pointer hover:text-primary transition select-none w-28 sm:w-32" id="sortSizeHeader">
                  <div class="flex items-center justify-end gap-1.5">
                    <span>Size</span>
                    <i id="sortSizeIcon" class="ri-arrow-up-down-line text-xs opacity-50"></i>
                  </div>
                </th>
                <th class="cursor-pointer hover:text-primary transition select-none w-40 sm:w-48" id="sortDateHeader">
                  <div class="flex items-center gap-1.5">
                    <span>Modified</span>
                    <i id="sortDateIcon" class="ri-arrow-up-down-line text-xs opacity-50"></i>
                  </div>
                </th>
                <th class="text-right w-28 sm:w-36">Actions</th>
              </tr>
            </thead>
            <tbody id="filesTableBody">
              <tr>
                <td colspan="6" class="py-12 text-center text-xs text-base-content/50">
                  Loading directory...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Info -->
        <div class="p-3 sm:p-4 bg-base-200/30 border-t border-base-300 text-xs text-base-content/60 flex items-center justify-between mt-auto">
          <span id="footerItemCount">0 items</span>
          <span class="font-mono" id="currentPathDisplay">/</span>
        </div>
      </div>
    </div>

    <!-- VIEW 2: DEDICATED ADMIN DASHBOARD -->
    <div id="adminDashboardView" class="hidden flex flex-col gap-4 sm:gap-6 animate-fadeIn">
      <!-- Admin Header Banner -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
            <h2 class="text-lg sm:text-xl font-bold text-base-content tracking-tight">Admin Console</h2>
            <span class="badge badge-success badge-sm font-mono font-bold">ADMIN ACTIVE</span>
          </div>
          <p class="text-xs text-base-content/60 font-mono mt-1" id="adminCurrentUserIdDisplay">User ID: 0x...</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="adminRefreshBtn" class="btn btn-ghost btn-sm border border-base-300 gap-1.5 text-xs font-medium">
            <i class="ri-refresh-line text-sm" id="adminRefreshIcon"></i>
            <span>Refresh</span>
          </button>
          <button id="adminGoToFileManagerBtn" class="btn btn-primary btn-sm gap-1.5 text-xs font-semibold">
            <i class="ri-folder-open-line text-sm"></i>
            <span>File Manager</span>
          </button>
        </div>
      </div>

      <!-- Admin Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- Stat 1: Total Devices -->
        <div class="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-base-content/60 font-medium">Registered Devices</span>
            <i class="ri-device-line text-primary text-base"></i>
          </div>
          <div class="text-2xl font-bold text-base-content font-mono" id="adminStatTotalUsers">--</div>
          <span class="text-[10px] text-base-content/40">In SQLite Database</span>
        </div>

        <!-- Stat 2: Admin Accounts -->
        <div class="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-base-content/60 font-medium">Admin Accounts</span>
            <i class="ri-shield-check-line text-success text-base"></i>
          </div>
          <div class="text-2xl font-bold text-success font-mono" id="adminStatTotalAdmins">--</div>
          <span class="text-[10px] text-base-content/40">Full write permissions</span>
        </div>

        <!-- Stat 3: FTP Connection -->
        <div class="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-base-content/60 font-medium">FTP Server</span>
            <i class="ri-server-line text-primary text-base"></i>
          </div>
          <div class="text-sm font-bold text-base-content font-mono truncate" id="adminStatFtpHost">192.168.100.1</div>
          <span class="text-[10px] text-success font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-success"></span> Online (Port 21)
          </span>
        </div>

        <!-- Stat 4: Storage Capacity -->
        <div class="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-base-content/60 font-medium">FTP Storage</span>
            <i class="ri-hard-drive-2-line text-primary text-base"></i>
          </div>
          <div class="text-sm font-bold text-base-content font-mono" id="adminStatStorageText">-- / 32GB</div>
          <div class="w-full h-1.5 bg-base-300 rounded-full overflow-hidden mt-1">
            <div id="adminStatStorageBar" class="h-full bg-primary rounded-full transition-all" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- User & Device Management Card -->
      <div class="bg-base-100 rounded-2xl border border-base-300 shadow-xs overflow-hidden flex flex-col">
        <div class="p-4 sm:p-5 border-b border-base-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-base text-base-content flex items-center gap-2">
              <i class="ri-group-line text-primary"></i> Device & User Authorization
            </h3>
            <p class="text-xs text-base-content/60">Manage permissions for registered device fingerprints</p>
          </div>

          <!-- Quick Add Admin Box -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" id="adminAddUserInput" placeholder="Enter 0x... User ID" class="input input-bordered input-sm font-mono text-xs w-full sm:w-64" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
            <button id="adminAddUserBtn" class="btn btn-primary btn-sm gap-1 font-semibold shrink-0">
              <i class="ri-user-add-line text-xs"></i>
              <span>Add Admin</span>
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="table table-sm sm:table-md w-full">
            <thead>
              <tr class="bg-base-200/50 text-base-content/70 text-[11px] uppercase tracking-wider font-semibold">
                <th>User ID (Device Fingerprint)</th>
                <th class="text-center">Role</th>
                <th>Registered At</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="adminUsersTableBody">
              <tr>
                <td colspan="4" class="text-center py-8 text-xs text-base-content/50">
                  <span class="loading loading-spinner loading-sm"></span> Loading users...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Master Key Management Card -->
      <div class="bg-base-100 rounded-2xl border border-base-300 shadow-xs p-4 sm:p-5 flex flex-col gap-3">
        <div>
          <h3 class="font-bold text-base text-base-content flex items-center gap-2">
            <i class="ri-key-2-line text-primary"></i> Master Key Security
          </h3>
          <p class="text-xs text-base-content/60">Update your administrator master key stored in SQLite database</p>
        </div>

        <form id="adminChangeMasterKeyForm" onsubmit="return false;" autocomplete="off" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
          <input type="password" id="adminNewMasterKeyInput" placeholder="Enter new Master Key..." class="input input-bordered input-sm font-mono text-xs w-full focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" />
          <button type="submit" id="adminChangeMasterKeyBtn" class="btn btn-primary btn-sm gap-1.5 font-semibold shrink-0">
            <i class="ri-shield-keyhole-line text-xs"></i>
            <span>Update Key</span>
          </button>
        </form>
      </div>
    </div>
  </main>

  <!-- Simple Flat Connection Status Bottom Popup (Z-Index 30) -->
  <div id="bottomStatusBar" class="hidden fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-30 transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto">
    <div id="bottomStatusCard" class="bg-base-100 border border-base-300 text-xs py-2 px-3 flex items-center justify-between gap-2.5 rounded-xl shadow-md text-base-content">
      <div class="flex items-center gap-2 min-w-0">
        <span id="bottomStatusDot" class="w-2 h-2 rounded-full bg-info animate-pulse shrink-0"></span>
        <p id="bottomStatusTitle" class="font-medium text-xs truncate">Connecting to Storage</p>
      </div>
      <button id="bottomStatusRetryBtn" class="btn btn-xs btn-ghost shrink-0 hidden font-medium text-xs">Retry</button>
    </div>
  </div>

  <!-- Floating Action Button (FAB) & Batch Selection Dock (Z-Index 50 to Stay on Top) -->
  <div class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-2.5">
    <!-- Popover Action Menu -->
    <div id="fabMenu" class="hidden flex flex-col items-end gap-2 mb-1 animate-fadeIn">
      <button id="openNewFileModalBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer">
        <i class="ri-file-add-line text-sm"></i>
        <span>New File</span>
      </button>
      <button id="openNewFolderModalBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer">
        <i class="ri-folder-add-line text-sm"></i>
        <span>New Folder</span>
      </button>
      <label class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer">
        <i class="ri-upload-cloud-2-line text-sm"></i>
        <span>Upload File</span>
        <input type="file" id="fileUploadInput" class="hidden" multiple />
      </label>
    </div>

    <!-- Floating Batch Actions Stack (Vertical FAB Mode with Active Press Transitions) -->
    <div id="batchActionToolbar" class="hidden flex flex-col items-end gap-2 z-50 animate-fadeIn text-xs">
      <!-- Selected Counter Header Pill (Solid Opaque) -->
      <div class="px-3.5 py-1.5 bg-blue-100 text-blue-800 border border-blue-300 shadow-md rounded-full text-xs font-mono font-medium flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></span>
        <span id="selectedCountBadge" class="font-bold">0</span>
        <span class="font-sans text-xs opacity-90">selected</span>
        <button id="clearSelectionBtn" class="btn btn-ghost btn-xs btn-circle ml-1 -mr-2 text-blue-600 hover:text-blue-900 hover:bg-blue-200 active:bg-blue-300 active:scale-90 transition-all duration-150" title="Clear selection">
          <i class="ri-close-line text-xs"></i>
        </button>
      </div>

      <!-- Download Button -->
      <button id="batchDownloadBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer" title="Download Selected">
        <i class="ri-download-2-line text-sm"></i>
        <span id="batchDownloadBtnText">Download ZIP</span>
      </button>

      <!-- Copy Button -->
      <button id="batchCopyBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer" title="Copy Selected">
        <i class="ri-file-copy-line text-sm"></i>
        <span>Copy</span>
      </button>

      <!-- Cut Button -->
      <button id="batchCutBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer" title="Cut Selected">
        <i class="ri-scissors-2-line text-sm"></i>
        <span>Cut</span>
      </button>

      <!-- Delete Button -->
      <button id="batchDeleteBtn" class="btn btn-sm bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-700 active:bg-primary active:text-primary-content active:border-primary active:scale-95 border border-blue-200 shadow-md gap-2 text-xs font-medium rounded-full px-4 min-w-36 justify-start transition-all duration-150 ease-out cursor-pointer" title="Delete Selected">
        <i class="ri-delete-bin-line text-sm"></i>
        <span>Delete</span>
      </button>
    </div>

    <!-- Main FAB Trigger Button (Prominent size, shown only for verified admins in File Manager view) -->
    <button id="fabTriggerBtn" class="hidden btn btn-primary btn-circle btn-lg w-14 h-14 sm:w-16 sm:h-16 shadow-2xl shadow-primary/30 active:scale-95 transition-all text-2xl sm:text-3xl" title="Add File or Folder">
      <i id="fabPlusIcon" class="ri-add-line text-2xl sm:text-3xl"></i>
    </button>
  </div>

  <!-- Modal: Settings & Preferences (85vh Height, max-w-4xl w-11/12 matching Code Editor) -->
  <dialog id="settingsModal" class="modal z-[200]">
    <div class="modal-box max-w-4xl w-11/12 p-4 sm:p-6 h-[85vh] max-h-[85vh] overflow-y-auto overflow-x-hidden flex flex-col justify-between rounded-2xl">
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-xs sm:text-sm flex items-center gap-1.5">
            <i class="ri-settings-3-line text-primary text-base"></i> Storage & Settings
          </h3>
          <form method="dialog">
            <button class="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-base-content" title="Close Settings">✕</button>
          </form>
        </div>
        
        <div class="flex flex-col gap-2 w-full max-w-full">
          <!-- Swipeable Overview Deck: Slide 1 Storage Overview | Slide 2 Server System Diagnostics -->
          <div class="relative overflow-hidden rounded-xl border border-base-300 bg-base-200/60 flex flex-col shadow-inner w-full max-w-full">
            <div id="overviewCarousel" class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth transition-all select-none w-full max-w-full">
              
              <!-- Slide 1: Storage Overview Card (6 Balanced Metrics - Compact) -->
              <div id="slideStorageOverview" class="w-full min-w-full max-w-full shrink-0 snap-start p-2 sm:p-2.5 flex flex-col gap-1.5 box-border">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs flex items-center gap-1.5 truncate">
                    <i class="ri-hard-drive-2-line text-primary"></i> Storage Overview
                  </span>
                  <span id="modalStorageStatusBadge" class="badge badge-primary badge-xs font-mono text-[9px] font-bold shrink-0">0% USED</span>
                </div>

                <!-- Dual Storage Used & Free Mini Progress Bars (2 Columns) -->
                <div class="grid grid-cols-2 gap-1.5 w-full">
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 flex flex-col gap-0.5 min-w-0">
                    <div class="flex justify-between items-center text-[10px] sm:text-[11px] font-sans">
                      <span class="text-base-content/70 flex items-center gap-1 truncate"><i class="ri-pie-chart-2-line text-primary"></i> Used (<span id="modalStorageUsedDetail" class="font-mono">--</span>)</span>
                      <span id="modalStoragePctText" class="font-mono font-bold text-primary shrink-0">0%</span>
                    </div>
                    <div class="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                      <div id="modalStorageUsedProgressBar" class="h-full bg-primary rounded-full transition-all duration-500" style="width: 0%"></div>
                    </div>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 flex flex-col gap-0.5 min-w-0">
                    <div class="flex justify-between items-center text-[10px] sm:text-[11px] font-sans">
                      <span class="text-base-content/70 flex items-center gap-1 truncate"><i class="ri-check-double-line text-success"></i> Free (<span id="modalStorageFreeDetail" class="font-mono">--</span>)</span>
                      <span id="modalStorageFreePctText" class="font-mono font-bold text-success shrink-0">100%</span>
                    </div>
                    <div class="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                      <div id="modalStorageFreeProgressBar" class="h-full bg-success rounded-full transition-all duration-500" style="width: 100%"></div>
                    </div>
                  </div>
                </div>

                <!-- Storage Breakdown (Single Column on Mobile, 2 Columns on Desktop) -->
                <div class="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 w-full">
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">Total Capacity</span>
                    <span id="modalStorageTotalText" class="font-bold text-xs text-base-content block font-mono">--</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">Files Stored</span>
                    <span id="modalStorageFilesText" class="font-bold text-xs text-base-content block font-mono">-- files</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">Folders Stored</span>
                    <span id="modalStorageFoldersText" class="font-bold text-xs text-base-content block font-mono">-- folders</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">FTP Gateway</span>
                    <span id="modalStorageGatewayText" class="font-bold text-xs text-base-content block font-mono">--:21</span>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-0.5">
                  <button id="modalRefreshStorageBtn" class="btn btn-ghost btn-xs text-primary gap-1 px-1.5 font-sans text-[11px]" title="Recalculate storage stats">
                    <i id="modalRefreshStorageIcon" class="ri-refresh-line text-xs"></i>
                    <span>Refresh Storage</span>
                  </button>
                  <button id="btnGoToSystemSlide" type="button" class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary gap-0.5 px-1.5 text-[11px] font-sans">
                    <span>System Info</span>
                    <i class="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>

              <!-- Slide 2: Server System Info Card (Compact & Modern) -->
              <div id="slideSystemInfo" class="w-full min-w-full max-w-full shrink-0 snap-start p-2 sm:p-2.5 flex flex-col gap-1.5 box-border">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs flex items-center gap-1.5 truncate">
                    <i class="ri-cpu-line text-primary"></i> Server System Info
                  </span>
                  <div class="flex items-center gap-1.5">
              <span id="modalBatteryPill" class="hidden badge bg-base-200/60 text-base-content/60 border border-base-300 badge-xs font-mono text-[9px] font-medium flex items-center gap-1">
                <i class="ri-battery-line text-[10px] text-base-content/50" id="modalBatteryIcon"></i>
                <span id="modalBatteryPercent">--%</span>
              </span>
              <span id="modalSysModeBadge" class="badge badge-neutral badge-xs font-mono text-[9px] uppercase font-bold shrink-0">Ubuntu</span>
            </div>
          </div>

                <!-- Dual CPU & RAM Mini Progress Bars (2 Columns) -->
                <div class="grid grid-cols-2 gap-1.5 w-full">
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 flex flex-col gap-0.5 min-w-0">
                    <div class="flex justify-between items-center text-[10px] sm:text-[11px] font-sans">
                      <span class="text-base-content/70 flex items-center gap-1 truncate"><i class="ri-dashboard-line text-primary"></i> CPU Load</span>
                      <span id="modalCpuPctText" class="font-mono font-bold text-primary shrink-0">0%</span>
                    </div>
                    <div class="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                      <div id="modalCpuProgressBar" class="h-full bg-primary rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 flex flex-col gap-0.5 min-w-0">
                    <div class="flex justify-between items-center text-[10px] sm:text-[11px] font-sans">
                      <span class="text-base-content/70 flex items-center gap-1 truncate"><i class="ri-ram-2-line text-secondary"></i> RAM Usage</span>
                      <span id="modalRamPctText" class="font-mono font-bold text-secondary shrink-0">0%</span>
                    </div>
                    <div class="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                      <div id="modalRamProgressBar" class="h-full bg-secondary rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                  </div>
                </div>

                <!-- System Breakdown -->
                <div class="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 w-full">
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">RAM Used / Total</span>
                    <span id="modalRamDetailText" class="font-bold text-xs text-base-content block font-mono">-- / --</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">CPU Cores</span>
                    <span id="modalCpuModelText" class="font-bold text-xs text-base-content block font-mono">--</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">System Uptime</span>
                    <span id="modalUptimeText" class="font-bold text-xs text-base-content block font-mono">--</span>
                  </div>
                  <div class="overview-card-cell bg-base-100 p-1.5 sm:p-2 rounded-lg border border-base-300/60 min-w-0 flex flex-col gap-0.5">
                    <span id="modalExtraLabelText" class="text-[9px] sm:text-[10px] text-base-content/60 uppercase tracking-wider block font-sans">OS & Platform</span>
                    <span id="modalExtraValueText" class="font-bold text-xs text-base-content block font-mono">--</span>
                  </div>
                </div>

                <div class="flex items-center justify-end pt-0.5">
                  <button id="btnGoToStorageSlide" type="button" class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary gap-0.5 px-1.5 text-[11px] font-sans">
                    <i class="ri-arrow-left-s-line"></i>
                    <span>Storage</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- Carousel Dots / Slide Indicators -->
            <div class="flex justify-center items-center gap-1.5 pb-1.5 pt-0.5">
              <button type="button" id="carouselDot0" class="w-2.5 h-1 rounded-full bg-primary transition-all duration-300 cursor-pointer" aria-label="Storage Slide"></button>
              <button type="button" id="carouselDot1" class="w-1 h-1 rounded-full bg-base-300 hover:bg-base-content/30 transition-all duration-300 cursor-pointer" aria-label="System Info Slide"></button>
            </div>
          </div>

          <div>
            <label class="font-semibold text-[11px] sm:text-xs text-base-content/80 block mb-1">Multiple Selection Download Mode</label>
            <div class="flex flex-col gap-1 bg-base-200/50 p-2 rounded-xl border border-base-300">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="downloadModeRadio" value="zip" id="radioDownloadZip" class="radio radio-primary radio-xs" checked />
                <div>
                  <p class="font-semibold text-xs">ZIP Archive (Recommended)</p>
                  <p class="text-[10px] text-base-content/60">Bundles all selected items into a single .zip file</p>
                </div>
              </label>
              <div class="divider my-0 opacity-40"></div>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="downloadModeRadio" value="individual" id="radioDownloadIndividual" class="radio radio-primary radio-xs" />
                <div>
                  <p class="font-semibold text-xs">Individual Files</p>
                  <p class="text-[10px] text-base-content/60">Downloads each selected file separately in browser</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="font-semibold text-[11px] sm:text-xs text-base-content/80 block mb-1">User ID</label>
            <div class="flex items-center gap-1.5 bg-base-200/50 p-1.5 rounded-lg border border-base-300">
              <span id="settingsUserIdDisplay" class="text-xs font-mono text-base-content/80 select-all truncate flex-1 font-medium">0x...</span>
              <button type="button" id="copyUserIdBtn" class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary" title="Copy User ID">
                <i class="ri-file-copy-line text-xs"></i>
              </button>
            </div>
            <div id="settingsAdminConsoleContainer" class="hidden mt-2">
              <button type="button" id="settingsOpenAdminConsoleBtn" class="btn btn-outline btn-primary btn-xs w-full gap-1.5 font-semibold">
                <i class="ri-shield-check-line text-xs"></i>
                <span>Open Admin Console</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2.5 pt-2 border-t border-base-300/60 flex items-center justify-between shrink-0">
        <span id="modalFooterAppName" class="text-[11px] opacity-75 font-mono text-base-content/60">FTP Server</span>
        <form method="dialog">
          <button class="btn btn-sm btn-primary px-4 font-semibold">Close</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- Modal: First-Time Welcome & Initial Setup Guide (Compact) -->
  <dialog id="welcomeSetupModal" class="modal z-[220] border-none outline-none">
    <div class="modal-box max-w-xl p-6 sm:p-8 bg-base-100 rounded-3xl border border-base-300 shadow-2xl animate-fadeIn flex flex-col outline-none">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          <i class="ri-shield-keyhole-line"></i>
        </div>
        <div>
          <h3 class="font-bold text-base sm:text-lg text-base-content tracking-tight leading-tight">Welcome to FTP Server</h3>
          <p class="text-xs text-base-content/60">Initial System Setup & Administrator Guide</p>
        </div>
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-4 text-xs">
        <div class="alert alert-warning/15 border border-warning/30 text-xs py-2 px-3.5 rounded-xl flex items-start gap-2">
          <i class="ri-information-fill text-warning text-base shrink-0 mt-0.5"></i>
          <div class="text-base-content/80 text-xs leading-relaxed">
            <span class="font-bold text-base-content">No Admin Configured:</span> Devices operate in <span class="badge badge-warning badge-xs font-semibold">View-Only</span> mode until an admin is initialized.
          </div>
        </div>

        <!-- Step 1: Your Device ID -->
        <div class="bg-base-200/50 p-3.5 rounded-2xl border border-base-300 flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs flex items-center gap-2 text-base-content">
              <span class="w-4 h-4 rounded-full bg-primary text-primary-content text-[10px] font-mono flex items-center justify-center">1</span>
              Your Device User ID
            </span>
            <span class="badge badge-ghost badge-xs font-mono">Fingerprint</span>
          </div>
          <div class="flex items-center gap-2 bg-base-100 p-2 rounded-xl border border-base-300">
            <span id="welcomeUserIdDisplay" class="font-mono text-xs font-semibold text-primary truncate flex-1 select-all">0x...</span>
            <button id="welcomeCopyUserIdBtn" class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary" title="Copy User ID">
              <i class="ri-file-copy-line text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Step 2: Initialize Admin -->
        <div class="bg-base-200/50 p-3.5 rounded-2xl border border-base-300 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs flex items-center gap-2 text-base-content">
              <span class="w-4 h-4 rounded-full bg-primary text-primary-content text-[10px] font-mono flex items-center justify-center">2</span>
              Configure Administrator
            </span>
          </div>
          <p class="text-xs text-base-content/70">
            Register this device as admin:
          </p>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-base-content/80 flex items-center justify-between">
              <span class="flex items-center gap-1"><i class="ri-key-2-line text-primary"></i> Master Key:</span>
              <span class="text-[10px] text-error font-semibold">* Required</span>
            </label>
            <input type="password" id="welcomeMasterKeyInput" placeholder="Enter master key (Required)..." class="input input-bordered input-sm font-mono text-xs w-full focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" required />
          </div>
          <button id="welcomeClaimAdminBtn" class="btn btn-primary btn-sm gap-1.5 font-semibold shadow-xs">
            <i class="ri-shield-check-line text-sm"></i>
            <span>Set This Device as Admin</span>
          </button>
        </div>

        <!-- Step 3: Access Admin Mode -->
        <div class="bg-base-200/50 p-3.5 rounded-2xl border border-base-300 flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs flex items-center gap-2 text-base-content">
              <span class="w-4 h-4 rounded-full bg-primary text-primary-content text-[10px] font-mono flex items-center justify-center">3</span>
              How to Enter Admin Console
            </span>
          </div>
          <p class="text-xs text-base-content/70">
            Navigate to the URL path with your User ID:
          </p>
          <div class="bg-base-100 p-2 rounded-xl border border-base-300 font-mono text-xs text-primary truncate select-all" id="welcomeAdminUrlSample">
            http://localhost:3690/0x...
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="modal-action mt-4 pt-3 border-t border-base-300 shrink-0 flex items-center justify-between">
        <span class="text-xs text-base-content/40 font-mono">FTP Server</span>
        <button id="welcomeDismissBtn" class="btn btn-ghost btn-sm font-medium">Dismiss</button>
      </div>
    </div>
  </dialog>

  <!-- Modal: Admin Master Key Verification -->
  <dialog id="adminMasterKeyModal" class="modal z-[250] border-none outline-none">
    <div class="modal-box max-w-sm p-6 bg-base-100 rounded-3xl border border-base-300 shadow-2xl animate-fadeIn flex flex-col gap-3 outline-none">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          <i class="ri-shield-keyhole-line"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm sm:text-base text-base-content leading-tight">Admin Authentication</h3>
          <p class="text-xs text-base-content/60">Master Key Verification</p>
        </div>
      </div>
      <p class="text-xs text-base-content/70">
        Enter the Master Key to unlock full admin permissions.
      </p>
      <form id="adminMasterKeyForm" onsubmit="return false;" autocomplete="off" class="flex flex-col gap-3">
        <input type="password" id="adminMasterKeyModalInput" placeholder="Enter master key..." class="input input-bordered input-sm font-mono text-xs w-full focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" />
        <div class="modal-action mt-0 flex items-center justify-end gap-2">
          <button type="button" id="adminMasterKeyCancelBtn" class="btn btn-ghost btn-sm text-xs font-medium">View Only</button>
          <button type="submit" id="adminMasterKeySubmitBtn" class="btn btn-primary btn-sm text-xs font-semibold gap-1.5">
            <i class="ri-check-line text-xs"></i>
            <span>Unlock</span>
          </button>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Modal: Public Access Key Verification -->
  <dialog id="publicKeyModal" class="modal z-[250] border-none outline-none">
    <div class="modal-box max-w-sm p-6 bg-base-100 rounded-3xl border border-base-300 shadow-2xl animate-fadeIn flex flex-col gap-3.5 outline-none">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          <i class="ri-lock-password-line"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm sm:text-base text-base-content leading-tight">Public Space Protected</h3>
          <p class="text-xs text-base-content/60" id="publicKeyModalSubtitle">Password Required</p>
        </div>
      </div>
      <p class="text-xs text-base-content/70" id="publicKeyModalPromptText">
        This public directory is protected. Please enter the access key or password to continue.
      </p>
      <form id="publicKeyModalForm" onsubmit="return false;" autocomplete="off" class="flex flex-col gap-3">
        <div class="relative">
          <input type="password" id="publicKeyModalInput" placeholder="Enter access key / password..." class="input input-bordered input-sm font-mono text-xs w-full pr-8 focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" required />
          <button type="button" id="togglePublicKeyVisibilityBtn" class="btn btn-ghost btn-xs btn-circle absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content" title="Show/Hide Key">
            <i class="ri-eye-line text-xs" id="togglePublicKeyIcon"></i>
          </button>
        </div>
        <div class="modal-action mt-0 flex items-center justify-end gap-2">
          <button type="button" id="publicKeyModalCancelBtn" class="btn btn-ghost btn-sm text-xs font-medium">Cancel</button>
          <button type="submit" id="publicKeyModalSubmitBtn" class="btn btn-primary btn-sm text-xs font-semibold gap-1.5">
            <i class="ri-lock-unlock-line text-xs"></i>
            <span>Unlock Space</span>
          </button>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Modal: Public Space Password Settings (Add / Change / Remove Password) -->
  <dialog id="publicSetPasswordModal" class="modal z-[250] border-none outline-none">
    <div class="modal-box max-w-sm p-6 bg-base-100 rounded-3xl border border-base-300 shadow-2xl animate-fadeIn flex flex-col gap-3.5 outline-none">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          <i class="ri-shield-keyhole-line"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm sm:text-base text-base-content leading-tight" id="publicSetPasswordModalTitle">Public Access Password</h3>
          <p class="text-xs text-base-content/60" id="publicSetPasswordModalSubtitle">Protect this folder</p>
        </div>
      </div>
      <p class="text-xs text-base-content/70" id="publicSetPasswordModalDesc">
        Set a password to protect and control access to your folder.
      </p>
      <form id="publicSetPasswordForm" onsubmit="return false;" autocomplete="off" class="flex flex-col gap-3">
        <div id="publicCurrentPasswordGroup" class="hidden flex flex-col gap-1">
          <label class="text-[11px] font-mono text-base-content/60">Current Password</label>
          <div class="relative">
            <input type="password" id="publicCurrentPasswordInput" placeholder="Enter current password..." class="input input-bordered input-sm font-mono text-xs w-full pr-8 focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" />
            <button type="button" id="toggleCurrentPasswordVisBtn" class="btn btn-ghost btn-xs btn-circle absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content">
              <i class="ri-eye-line text-xs" id="toggleCurrentPasswordIcon"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-mono text-base-content/60" id="publicNewPasswordLabel">New Password</label>
          <div class="relative">
            <input type="password" id="publicNewPasswordInput" placeholder="Enter new password (or leave blank to remove)..." class="input input-bordered input-sm font-mono text-xs w-full pr-8 focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" readonly onfocus="this.removeAttribute('readonly');" />
            <button type="button" id="toggleNewPasswordVisBtn" class="btn btn-ghost btn-xs btn-circle absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content">
              <i class="ri-eye-line text-xs" id="toggleNewPasswordIcon"></i>
            </button>
          </div>
        </div>

        <div class="modal-action mt-1 flex items-center justify-between gap-2">
          <button type="button" id="publicRemovePasswordBtn" class="hidden btn btn-ghost btn-sm text-xs font-medium text-error hover:bg-error/10">Remove</button>
          <div class="flex items-center gap-2 ml-auto">
            <button type="button" id="publicSetPasswordCancelBtn" class="btn btn-ghost btn-sm text-xs font-medium">Cancel</button>
            <button type="submit" id="publicSetPasswordSubmitBtn" class="btn btn-primary btn-sm text-xs font-semibold gap-1.5">
              <i class="ri-check-line text-xs"></i>
              <span>Save</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Modal: Pin Item & Custom Badge Settings (Admin Only) -->
  <dialog id="pinModal" class="modal z-[250] border-none outline-none">
    <div class="modal-box max-w-sm p-6 bg-base-100 rounded-3xl border border-base-300 shadow-2xl animate-fadeIn flex flex-col gap-3.5 outline-none">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
          <i class="ri-pushpin-fill"></i>
        </div>
        <div class="min-w-0">
          <h3 class="font-bold text-sm sm:text-base text-base-content leading-tight" id="pinModalTitle">Pin Item</h3>
          <p class="text-xs text-base-content/60 font-mono truncate" id="pinModalItemName">item.ext</p>
        </div>
      </div>
      <p class="text-xs text-base-content/70">
        Pinned items are displayed at the top of the folder for all users. You can add an optional custom badge label.
      </p>
      <form id="pinForm" onsubmit="return false;" autocomplete="off" class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-mono text-base-content/60">Custom Badge Message (Optional)</label>
          <input type="text" id="pinBadgeTextInput" placeholder="e.g. shared public storage, Important..." maxlength="40" class="input input-bordered input-sm font-mono text-xs w-full focus:input-primary" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        </div>

        <div class="modal-action mt-1 flex items-center justify-between gap-2">
          <button type="button" id="unpinItemBtn" class="hidden btn btn-ghost btn-sm text-xs font-medium text-error hover:bg-error/10">Unpin</button>
          <div class="flex items-center gap-2 ml-auto">
            <button type="button" id="pinCancelBtn" class="btn btn-ghost btn-sm text-xs font-medium">Cancel</button>
            <button type="submit" id="pinSubmitBtn" class="btn btn-primary btn-sm text-xs font-semibold gap-1.5">
              <i class="ri-pushpin-fill text-xs"></i>
              <span id="pinSubmitBtnText">Pin Item</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Modal: Dracula Code & Text Editor -->
  <dialog id="draculaEditorModal" class="modal z-[200]">
    <div class="modal-box max-w-4xl w-11/12 p-0 bg-[#282a36] text-[#f8f8f2] border border-[#44475a] shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[85vh]">
      <!-- Editor Header -->
      <div class="px-4 py-3 bg-[#21222c] border-b border-[#44475a] flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex items-center gap-1.5 mr-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5555]"></span>
            <span class="w-3 h-3 rounded-full bg-[#f1fa8c]"></span>
            <span class="w-3 h-3 rounded-full bg-[#50fa7b]"></span>
          </div>
          <span id="editorFilenameBadge" class="font-mono text-xs font-bold text-[#50fa7b] truncate">filename.txt</span>
          <span id="editorSyntaxBadge" class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#bd93f9]/20 text-[#bd93f9] border border-[#bd93f9]/30">TEXT</span>
        </div>

        <div class="flex items-center gap-2">
          <span id="editorStatusText" class="text-[11px] text-[#6272a4] font-mono mr-2">Ready</span>
          <button id="saveEditorFileBtn" class="hidden btn btn-xs bg-[#50fa7b] hover:bg-[#40d868] text-[#282a36] font-bold border-none gap-1">
            <i class="ri-save-line text-xs"></i>
            <span>Save</span>
          </button>
          <form method="dialog">
            <button class="btn btn-xs btn-circle btn-ghost text-[#f8f8f2]">✕</button>
          </form>
        </div>
      </div>

      <!-- Editor Text Body with CodeJar Dracula Syntax Highlighting -->
      <div class="flex-1 overflow-auto relative p-4 dracula-editor">
        <div id="codeJarContainer" class="dracula-editor outline-none w-full min-h-full font-mono text-sm leading-relaxed"></div>
      </div>

      <!-- Editor Footer -->
      <div class="px-4 py-2 bg-[#21222c] border-t border-[#44475a] text-[11px] text-[#6272a4] flex items-center justify-between font-mono">
        <span id="editorFilePathDisplay">/</span>
        <span>Dracula Theme &bull; UTF-8</span>
      </div>
    </div>
  </dialog>

  <!-- Modal: Image Preview / Lightbox -->
  <dialog id="imagePreviewModal" class="modal z-[200]">
    <div class="modal-box max-w-3xl p-4 bg-base-100 border border-base-300 shadow-2xl rounded-2xl flex flex-col items-center gap-3">
      <div class="w-full flex items-center justify-between pb-2 border-b border-base-300">
        <h3 id="imagePreviewTitle" class="font-bold text-sm font-mono truncate">image.png</h3>
        <form method="dialog">
          <button class="btn btn-xs btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <div class="w-full max-h-[70vh] flex items-center justify-center overflow-auto rounded-xl bg-base-200/50 p-2">
        <img id="imagePreviewElement" src="" alt="Preview" class="max-h-[65vh] object-contain rounded-lg shadow-md" />
      </div>
      <div class="w-full flex justify-end gap-2 pt-2">
        <a id="imageDownloadDirectBtn" href="#" class="btn btn-sm btn-primary gap-1.5" download>
          <i class="ri-download-2-line"></i> Download Image
        </a>
      </div>
    </div>
  </dialog>

  <!-- Modal: Media (Audio / Video) Player -->
  <dialog id="mediaPreviewModal" class="modal z-[200]">
    <div class="modal-box max-w-2xl p-4 bg-base-100 border border-base-300 shadow-2xl rounded-2xl flex flex-col gap-3">
      <div class="w-full flex items-center justify-between pb-2 border-b border-base-300">
        <div class="flex items-center gap-2 min-w-0">
          <i id="mediaPreviewIcon" class="ri-movie-line text-primary text-lg"></i>
          <h3 id="mediaPreviewTitle" class="font-bold text-sm font-mono truncate">media.mp4</h3>
          <span id="mediaTypeBadge" class="badge badge-primary badge-xs font-mono">MEDIA</span>
        </div>
        <form method="dialog">
          <button class="btn btn-xs btn-circle btn-ghost" id="closeMediaModalBtn">✕</button>
        </form>
      </div>
      
      <div class="w-full flex flex-col items-center justify-center rounded-xl bg-base-200/60 p-3 min-h-[160px]">
        <!-- Video Player -->
        <video id="videoPlayerElement" controls playsinline class="hidden max-h-[60vh] w-full rounded-lg shadow bg-black"></video>
        
        <!-- Audio Player & Visualizer Card -->
        <div id="audioPlayerContainer" class="hidden w-full flex flex-col items-center gap-3 py-4">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl shadow-inner animate-pulse">
            <i class="ri-music-2-fill"></i>
          </div>
          <audio id="audioPlayerElement" controls class="w-full max-w-md"></audio>
        </div>
      </div>

      <div class="w-full flex justify-between items-center pt-2">
        <span id="mediaFormatNotice" class="text-[11px] text-base-content/50 font-mono">Direct streaming via FTP</span>
        <a id="mediaDownloadDirectBtn" href="#" class="btn btn-sm btn-primary gap-1.5" download>
          <i class="ri-download-2-line"></i> Download Media
        </a>
      </div>
    </div>
  </dialog>

  <!-- Modal: New File -->
  <dialog id="newFileModal" class="modal z-[200]">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-sm mb-3 flex items-center gap-1.5">
        <i class="ri-file-add-line text-primary text-base"></i> Create New File
      </h3>
      <div class="flex flex-col gap-2.5">
        <div>
          <label class="label py-0.5 text-[11px] font-medium text-base-content/60">Filename</label>
          <input type="text" id="newFileNameInput" placeholder="notes.txt" class="input input-bordered input-sm w-full font-mono text-xs" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        </div>
        <div>
          <label class="label py-0.5 text-[11px] font-medium text-base-content/60">Content (Optional)</label>
          <textarea id="newFileContentInput" placeholder="Write file content..." class="textarea textarea-bordered textarea-sm w-full font-mono text-xs h-24" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
        </div>
      </div>
      <div class="modal-action mt-4">
        <form method="dialog" autocomplete="off">
          <button class="btn btn-ghost btn-sm">Cancel</button>
        </form>
        <button id="submitNewFileBtn" class="btn btn-primary btn-sm">Create File</button>
      </div>
    </div>
  </dialog>

  <!-- Modal: New Folder -->
  <dialog id="newFolderModal" class="modal z-[200]">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-sm mb-3 flex items-center gap-1.5">
        <i class="ri-folder-add-line text-primary text-base"></i> Create New Directory
      </h3>
      <div>
        <label class="label py-0.5 text-[11px] font-medium text-base-content/60">Folder Name</label>
        <input type="text" id="newFolderNameInput" placeholder="documents" class="input input-bordered input-sm w-full font-mono text-xs" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      </div>
      <div class="modal-action mt-4">
        <form method="dialog" autocomplete="off">
          <button class="btn btn-ghost btn-sm">Cancel</button>
        </form>
        <button id="submitNewFolderBtn" class="btn btn-primary btn-sm">Create Folder</button>
      </div>
    </div>
  </dialog>

  <!-- Modal: Rename -->
  <dialog id="renameModal" class="modal z-[200]">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-sm mb-3 flex items-center gap-1.5">
        <i class="ri-edit-line text-base"></i> Rename Item
      </h3>
      <input type="hidden" id="renameOldPathInput" />
      <div>
        <label class="label py-0.5 text-[11px] font-medium text-base-content/60">New Name</label>
        <input type="text" id="renameNewNameInput" class="input input-bordered input-sm w-full font-mono text-xs" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      </div>
      <div class="modal-action mt-4">
        <button id="cancelRenameBtn" type="button" class="btn btn-ghost btn-sm">Cancel</button>
        <button id="submitRenameBtn" type="button" class="btn btn-primary btn-sm">Save Rename</button>
      </div>
    </div>
  </dialog>
    `}var F=!1,I=!1,L=null,ee=!1;function R(e){try{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.focus(),t.select();let n=document.execCommand(`copy`);document.body.removeChild(t),n?A(`User ID copied to clipboard`,`success`):A(`User ID: ${e}`,`info`)}catch{A(`User ID: ${e}`,`info`)}}function te(e){e&&(navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(e).then(()=>{A(`User ID copied to clipboard`,`success`)}).catch(()=>{R(e)}):R(e))}async function z(e=!1){let t=document.getElementById(`navStorageText`),n=document.getElementById(`navStorageBar`),r=document.getElementById(`modalStorageStatusBadge`),i=document.getElementById(`modalStorageUsedDetail`),a=document.getElementById(`modalStoragePctText`),o=document.getElementById(`modalStorageUsedProgressBar`),s=document.getElementById(`modalStorageFreeDetail`),c=document.getElementById(`modalStorageFreePctText`),l=document.getElementById(`modalStorageFreeProgressBar`),u=document.getElementById(`modalStorageTotalText`),d=document.getElementById(`modalStorageFilesText`),f=document.getElementById(`modalStorageFoldersText`),p=document.getElementById(`modalStorageGatewayText`),m=document.getElementById(`modalRefreshStorageIcon`);if(!F){F=!0,m&&e&&m.classList.add(`animate-spin`);try{let m=await(await N(`/api/ftp/storage-info?refresh=${e?`true`:`false`}`)).json();if(m.success){let e=m.compactDisplay||`${m.usedFormatted||`0B`}/${m.totalFormatted||`0GB`}`.replace(/\s+/g,``),h=m.percentage===void 0?0:m.percentage,g=m.freePercentage===void 0?Math.max(0,parseFloat((100-h).toFixed(2))):m.freePercentage,_=`bg-primary`,v=`badge-primary text-primary-content`;if(h>=95?(_=`bg-error animate-pulse`,v=`badge-error text-white`):h>=80&&(_=`bg-warning`,v=`badge-warning text-neutral`),t&&(t.textContent=e),n&&(n.className=`h-full ${_} rounded-full transition-all duration-500`,n.style.width=`${Math.min(100,Math.max(1,h))}%`),r&&(r.className=`badge ${v} badge-sm font-mono text-[10px] font-bold shrink-0`,r.textContent=`${h}% USED`),i&&(i.textContent=m.usedFormatted||`--`),a&&(a.textContent=`${h}%`),o&&(o.className=`h-full ${_} rounded-full transition-all duration-500`,o.style.width=`${Math.min(100,Math.max(1,h))}%`),s&&(s.textContent=m.freeFormatted||`--`),c&&(c.textContent=`${g}%`),l&&(l.className=`h-full bg-success rounded-full transition-all duration-500`,l.style.width=`${Math.min(100,Math.max(1,g))}%`),u&&(u.textContent=m.totalFormatted||`-- GB`),d){let e=m.fileCount===void 0?0:m.fileCount;d.textContent=`${e} file${e===1?``:`s`}`}if(f){let e=m.folderCount===void 0?0:m.folderCount;f.textContent=`${e} folder${e===1?``:`s`}`}p&&(p.textContent=m.gateway||`Active / Ready`)}}catch(e){console.error(`Error fetching storage stats:`,e)}finally{F=!1,m&&setTimeout(()=>m.classList.remove(`animate-spin`),300)}}}function ne(e){if(!e||!e.success)return;let t=document.getElementById(`modalSysModeBadge`),n=document.getElementById(`modalCpuPctText`),r=document.getElementById(`modalCpuProgressBar`),i=document.getElementById(`modalRamPctText`),a=document.getElementById(`modalRamProgressBar`),o=document.getElementById(`modalRamDetailText`),s=document.getElementById(`modalCpuModelText`),c=document.getElementById(`modalUptimeText`),l=document.getElementById(`modalExtraLabelText`),u=document.getElementById(`modalExtraValueText`);if(t){let n=e.mode||`Ubuntu`;t.textContent=e.configMode===`auto`?`Auto (${n})`:n,t.className=n.toLowerCase()===`termux`?`badge badge-accent badge-sm font-mono text-[10px] uppercase font-bold text-accent-content shrink-0`:n.toLowerCase()===`ubuntu`?`badge badge-primary badge-sm font-mono text-[10px] uppercase font-bold text-primary-content shrink-0`:`badge badge-neutral badge-sm font-mono text-[10px] uppercase font-bold shrink-0`}let d=e.cpu?.usagePercent===void 0?0:e.cpu.usagePercent;if(n&&(n.textContent=`${d}%`),r){let e=`bg-primary`;d>=90?e=`bg-error animate-pulse`:d>=70&&(e=`bg-warning`),r.className=`h-full ${e} rounded-full transition-all duration-300`,r.style.width=`${Math.min(100,Math.max(1,d))}%`}if(s){let t=e.cpu?.cores||1,n=e.cpu?.model||`Generic Processor`,r=e.cpu?.temperature;s.textContent=`${t} Cores (${n}${r!=null&&!isNaN(r)?` | ${r}°C`:``})`}let f=e.memory?.usagePercent===void 0?0:e.memory.usagePercent;if(i&&(i.textContent=`${f}%`),a){let e=`bg-secondary`;f>=90?e=`bg-error animate-pulse`:f>=75&&(e=`bg-warning`),a.className=`h-full ${e} rounded-full transition-all duration-300`,a.style.width=`${Math.min(100,Math.max(1,f))}%`}o&&(o.textContent=`${e.memory?.usedFormatted||`--`} / ${e.memory?.totalFormatted||`--`}`),c&&(c.textContent=e.os?.systemUptimeFormatted||`${Math.floor((e.os?.systemUptimeSec||0)/3600)}h`);let p=String(e.mode||``).toLowerCase()===`termux`||e.isTermux===!0,m=p?e.battery||e.termux?.battery:null,h=document.getElementById(`modalBatteryPill`),g=document.getElementById(`modalBatteryIcon`),_=document.getElementById(`modalBatteryPercent`);if(p&&m&&m.percentage!==null&&m.percentage!==void 0){l&&(l.textContent=`Battery Status`);let e=m.percentage,t=(m.status||`Discharging`).trim(),n=t.toUpperCase(),r=String(m.plugged||``).toUpperCase().trim(),i=n===`CHARGING`||n===`FULL`||r.startsWith(`PLUGGED`)&&r!==`UNPLUGGED`,a=m.temperature?` | ${m.temperature}°C`:``;u&&(u.textContent=`${e}% (${t}${a})`),h&&_&&(h.classList.remove(`hidden`),_.textContent=`${e}%`,i?(h.className=`badge badge-success/15 text-success border border-success/30 badge-xs font-mono text-[9px] font-semibold flex items-center gap-1`,g&&(g.className=`ri-battery-charge-line text-[10px] text-success animate-pulse`)):(h.className=`badge bg-base-200/60 text-base-content/60 border border-base-300 badge-xs font-mono text-[9px] font-medium flex items-center gap-1`,g&&(g.className=e<=15?`ri-battery-low-line text-[10px] text-error animate-pulse`:`ri-battery-line text-[10px] text-base-content/50`)))}else{l&&(l.textContent=`OS & Platform`);let t=e.os?.platform||`linux`,n=e.os?.arch||`x64`,r=(e.os?.release||``).split(`-`)[0];u&&(u.textContent=`${t} ${n} (${r})`),h&&h.classList.add(`hidden`)}}function B(){if(ee=!0,L&&(L.readyState===WebSocket.OPEN||L.readyState===WebSocket.CONNECTING))return;let e=`${window.location.protocol===`https:`?`wss:`:`ws:`}//${window.location.host}/ws/system_info`;try{L=new WebSocket(e),L.onmessage=e=>{try{ne(JSON.parse(e.data))}catch{}},L.onclose=()=>{L=null,ee&&setTimeout(B,2500)},L.onerror=()=>{H(!1)}}catch{H(!1)}}function V(){if(ee=!1,L){try{L.close()}catch{}L=null}}async function H(){if(L&&L.readyState===WebSocket.OPEN)try{L.send(JSON.stringify({action:`refresh`}))}catch{}if(!I){I=!0;try{ne(await(await N(`/api/system_info`)).json())}catch(e){console.error(`Error fetching system info:`,e)}finally{I=!1}}}function re(){let e=document.getElementById(`navStorageWidget`),t=document.getElementById(`settingsModal`),n=document.getElementById(`modalRefreshStorageBtn`),r=document.getElementById(`copyUserIdBtn`),i=document.getElementById(`settingsUserIdDisplay`),a=document.getElementById(`overviewCarousel`),o=document.getElementById(`slideStorageOverview`),s=document.getElementById(`slideSystemInfo`),c=document.getElementById(`carouselDot0`),l=document.getElementById(`carouselDot1`),u=document.getElementById(`btnGoToSystemSlide`),d=document.getElementById(`btnGoToStorageSlide`);function f(){let e=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``;i&&e&&(i.textContent=e,i.title=e)}r&&r.addEventListener(`click`,()=>{let e=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``;e?te(e):A(`User ID not available`,`warning`)});function p(e){c&&l&&(e===0?(c.className=`w-2.5 h-1.5 rounded-full bg-primary transition-all duration-300 cursor-pointer`,l.className=`w-1.5 h-1.5 rounded-full bg-base-300 hover:bg-base-content/30 transition-all duration-300 cursor-pointer`):(c.className=`w-1.5 h-1.5 rounded-full bg-base-300 hover:bg-base-content/30 transition-all duration-300 cursor-pointer`,l.className=`w-2.5 h-1.5 rounded-full bg-primary transition-all duration-300 cursor-pointer`))}if(e&&t&&e.addEventListener(`click`,()=>{f(),z(!1),H(),B(),t.showModal()}),t&&(t.addEventListener(`close`,()=>{V()}),t.addEventListener(`click`,e=>{let n=t.querySelector(`.modal-box`);n&&!n.contains(e.target)&&t.close()})),n&&n.addEventListener(`click`,()=>{z(!0)}),a){a.addEventListener(`scroll`,()=>{let e=a.scrollLeft,t=a.clientWidth||1,n=Math.round(e/t);p(n),n===1&&(B(),H())},{passive:!0});let e=!1,t=0,n=0;a.addEventListener(`mousedown`,r=>{e=!0,t=r.pageX-a.offsetLeft,n=a.scrollLeft}),a.addEventListener(`mouseleave`,()=>{e=!1}),a.addEventListener(`mouseup`,()=>{e=!1}),a.addEventListener(`mousemove`,r=>{if(!e)return;r.preventDefault();let i=(r.pageX-a.offsetLeft-t)*1.2;a.scrollLeft=n-i})}u&&a&&s&&u.addEventListener(`click`,()=>{s.scrollIntoView({behavior:`smooth`,inline:`start`,block:`nearest`}),B(),H()}),d&&a&&o&&d.addEventListener(`click`,()=>{o.scrollIntoView({behavior:`smooth`,inline:`start`,block:`nearest`})}),c&&a&&o&&c.addEventListener(`click`,()=>{o.scrollIntoView({behavior:`smooth`,inline:`start`,block:`nearest`})}),l&&a&&s&&l.addEventListener(`click`,()=>{s.scrollIntoView({behavior:`smooth`,inline:`start`,block:`nearest`}),B(),H()})}function ie(e){let t=document.getElementById(`imagePreviewModal`),n=document.getElementById(`imagePreviewTitle`),r=document.getElementById(`imagePreviewElement`),i=document.getElementById(`imageDownloadDirectBtn`),a=T.isPublicMode?T.publicCurrentSubpath:T.currentPath,o=(a.endsWith(`/`)?a:a+`/`)+e,s=`/api/ftp/view-file?path=${encodeURIComponent(o)}`,c=`/api/ftp/download?path=${encodeURIComponent(o)}`;if(T.isPublicMode&&T.currentPublicUser){let e=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,t=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||``,n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``,r=`user_id=${encodeURIComponent(T.currentPublicUser.clean_id)}&path=${encodeURIComponent(o)}`;e&&(r+=`&key=${encodeURIComponent(e)}`),t&&(r+=`&masterkey=${encodeURIComponent(t)}`),n&&(r+=`&fingerprint=${encodeURIComponent(n)}`),s=`/api/public/raw?${r}`,c=`/api/public/download?${r}`}n&&(n.textContent=e),r&&(r.src=s),i&&(i.href=c),t&&t.showModal()}function ae(e,t){let n=document.getElementById(`mediaPreviewModal`),r=document.getElementById(`mediaPreviewTitle`),i=document.getElementById(`mediaPreviewIcon`),a=document.getElementById(`mediaTypeBadge`),o=document.getElementById(`videoPlayerElement`),s=document.getElementById(`audioPlayerContainer`),c=document.getElementById(`audioPlayerElement`),l=document.getElementById(`mediaDownloadDirectBtn`),u=T.isPublicMode?T.publicCurrentSubpath:T.currentPath,d=(u.endsWith(`/`)?u:u+`/`)+e,f=`/api/ftp/view-file?path=${encodeURIComponent(d)}`,p=`/api/ftp/download?path=${encodeURIComponent(d)}`;if(T.isPublicMode&&T.currentPublicUser){let e=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,t=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||``,n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``,r=`user_id=${encodeURIComponent(T.currentPublicUser.clean_id)}&path=${encodeURIComponent(d)}`;e&&(r+=`&key=${encodeURIComponent(e)}`),t&&(r+=`&masterkey=${encodeURIComponent(t)}`),n&&(r+=`&fingerprint=${encodeURIComponent(n)}`),f=`/api/public/raw?${r}`,p=`/api/public/download?${r}`}r&&(r.textContent=e),l&&(l.href=p),t?(i&&(i.className=`ri-film-line text-rose-500 text-lg`),a&&(a.textContent=`VIDEO`,a.className=`badge badge-error badge-xs font-mono text-white`),s&&s.classList.add(`hidden`),c&&(c.pause(),c.src=``),o&&(o.classList.remove(`hidden`),o.src=f,o.load())):(i&&(i.className=`ri-music-2-line text-amber-500 text-lg`),a&&(a.textContent=`AUDIO`,a.className=`badge badge-warning badge-xs font-mono text-amber-950`),o&&(o.classList.add(`hidden`),o.pause(),o.src=``),s&&s.classList.remove(`hidden`),c&&(c.src=f,c.load(),c.play().catch(()=>{}))),n&&n.showModal()}function oe(){let e=document.getElementById(`videoPlayerElement`),t=document.getElementById(`audioPlayerElement`),n=document.getElementById(`mediaPreviewModal`);e&&(e.pause(),e.src=``),t&&(t.pause(),t.src=``),n&&n.open&&n.close()}function se(e){let t=[`txt`,`json`,`js`,`mjs`,`cjs`,`ts`,`css`,`html`,`xml`,`svg`,`sh`,`bash`,`py`,`yaml`,`yml`,`md`,`ini`,`cfg`,`conf`,`env`,`log`,`htaccess`,`php`,`sql`],n=e.split(`.`).pop().toLowerCase();return t.includes(n)}function ce(e){let t=[`png`,`jpg`,`jpeg`,`gif`,`webp`,`svg`,`ico`,`bmp`],n=e.split(`.`).pop().toLowerCase();return t.includes(n)}function le(e){let t=[`mp4`,`mkv`,`webm`,`mov`,`ogv`],n=e.split(`.`).pop().toLowerCase();return t.includes(n)}function ue(e){let t=[`mp3`,`wav`,`ogg`,`flac`,`m4a`,`aac`],n=e.split(`.`).pop().toLowerCase();return t.includes(n)}function de(){let e=document.getElementById(`mediaPreviewModal`),t=document.getElementById(`closeMediaModalBtn`);t&&t.addEventListener(`click`,oe),e&&e.addEventListener(`close`,oe),window.openImagePreview=ie,window.openMediaPreview=ae,window.closeMediaPlayer=oe}function fe(e){let t=document.getElementById(`renameModal`),n=document.getElementById(`renameOldPathInput`),r=document.getElementById(`renameNewNameInput`),i=T.isPublicMode?T.publicCurrentSubpath:T.currentPath,a=(i.endsWith(`/`)?i:i+`/`)+e;n&&(n.value=a),r&&(r.value=e),t&&t.showModal(),r&&setTimeout(()=>{r.focus();let t=e.lastIndexOf(`.`);t>0?r.setSelectionRange(0,t):r.select()},100)}function pe(){let e=document.getElementById(`fabTriggerBtn`),t=document.getElementById(`fabMenu`),n=document.getElementById(`fabPlusIcon`),r=document.getElementById(`openNewFileModalBtn`),i=document.getElementById(`openNewFolderModalBtn`),a=document.getElementById(`newFileModal`),o=document.getElementById(`newFileNameInput`),s=document.getElementById(`newFileContentInput`),c=document.getElementById(`submitNewFileBtn`),l=document.getElementById(`newFolderModal`),u=document.getElementById(`newFolderNameInput`),d=document.getElementById(`submitNewFolderBtn`),f=document.getElementById(`renameModal`),p=document.getElementById(`renameOldPathInput`),m=document.getElementById(`renameNewNameInput`),h=document.getElementById(`submitRenameBtn`),g=document.getElementById(`cancelRenameBtn`),_=document.getElementById(`radioDownloadZip`),v=document.getElementById(`radioDownloadIndividual`),y=document.getElementById(`welcomeSetupModal`),b=document.getElementById(`welcomeCopyUserIdBtn`),x=document.getElementById(`welcomeClaimAdminBtn`),S=document.getElementById(`welcomeDismissBtn`);e&&e.addEventListener(`click`,()=>{!t||t.classList.contains(`hidden`)?(t&&t.classList.remove(`hidden`),n&&(n.className=`ri-close-line text-2xl`)):(t&&t.classList.add(`hidden`),n&&(n.className=`ri-add-line text-2xl`))}),r&&r.addEventListener(`click`,()=>{t&&t.classList.add(`hidden`),n&&(n.className=`ri-add-line text-2xl`),o&&(o.value=``),s&&(s.value=``),a&&a.showModal()}),i&&i.addEventListener(`click`,()=>{t&&t.classList.add(`hidden`),n&&(n.className=`ri-add-line text-2xl`),u&&(u.value=``),l&&l.showModal()}),c&&c.addEventListener(`click`,async()=>{let e=o?o.value.trim():``,t=s?s.value:``;if(!e){A(`Filename is required`,`warning`);return}try{if(T.isPublicMode&&T.currentPublicUser){let n=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,r=new Blob([t],{type:`text/plain;charset=utf-8`}),i=new File([r],e,{type:`text/plain`}),o=new FormData;o.append(`user_id`,T.currentPublicUser.clean_id),o.append(`subpath`,T.publicCurrentSubpath||`/`),n&&o.append(`key`,n),o.append(`file`,i);let s=await(await N(`/api/public/upload`,{method:`POST`,body:o})).json();s&&s.success?(a&&a.close(),A(`Created file "${e}"`,`success`),j(`connected`,`Created file "${e}"`,T.publicCurrentSubpath),K(),Y(!0)):A(s?.error||`Failed to create file`,`error`);return}let n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),r=await(await N(`/api/ftp/create-file`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({path:T.currentPath,filename:e,content:t,fingerprint:n})})).json();r&&r.success?(a&&a.close(),A(`Created file "${e}"`,`success`),j(`connected`,`Created file "${e}"`,T.currentPath),K(),Y(!0),z(!0)):A(r?.error||`Failed to create file`,`error`)}catch(e){A(e?.message||`Error creating file`,`error`)}}),o&&o.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),c&&c.click())}),d&&d.addEventListener(`click`,async()=>{let e=u?u.value.trim():``;if(!e){A(`Folder name is required`,`warning`);return}try{if(T.isPublicMode&&T.currentPublicUser){let t=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,n=await(await N(`/api/public/mkdir`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:T.currentPublicUser.clean_id,path:T.publicCurrentSubpath||`/`,folderName:e,key:t})})).json();n&&n.success?(l&&l.close(),A(`Created folder "${e}"`,`success`),j(`connected`,`Created folder "${e}"`,T.publicCurrentSubpath),K(),Y(!0)):A(n?.error||`Failed to create folder`,`error`);return}let t=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),n=await(await N(`/api/ftp/mkdir`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({path:T.currentPath,dirname:e,fingerprint:t})})).json();n&&n.success?(l&&l.close(),A(`Created folder "${e}"`,`success`),j(`connected`,`Created folder "${e}"`,T.currentPath),K(),Y(!0),z(!0)):A(n?.error||`Failed to create folder`,`error`)}catch(e){A(e?.message||`Error creating folder`,`error`)}}),u&&u.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),d&&d.click())}),h&&h.addEventListener(`click`,async()=>{let e=p?p.value:``,t=m?m.value.trim():``;if(!t){A(`New name is required`,`warning`);return}if(!e){A(`Old file path is missing`,`warning`);return}let n=e.lastIndexOf(`/`),r=n<=0?`/`:e.substring(0,n),i=(r.endsWith(`/`)?r:r+`/`)+t,a=e.split(`/`).pop();if(a===t){f&&f.close();return}try{if(h.disabled=!0,T.isPublicMode&&T.currentPublicUser){let e=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,n=await(await N(`/api/public/rename`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:T.currentPublicUser.clean_id,path:T.publicCurrentSubpath||`/`,oldName:a,newName:t,key:e})})).json();n&&n.success?(T.selectedFileNames.has(a)&&(T.selectedFileNames.delete(a),T.selectedFileNames.add(t),q()),f&&f.close(),A(`Renamed "${a}" to "${t}"`,`success`),j(`connected`,`Renamed to "${t}"`,T.publicCurrentSubpath),K(),Y(!0)):A(`Rename failed: ${n?.error||`Unknown error`}`,`error`);return}let n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),r=await(await N(`/api/ftp/rename`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({oldPath:e,newPath:i,fingerprint:n})})).json();r&&r.success?(T.selectedFileNames.has(a)&&(T.selectedFileNames.delete(a),T.selectedFileNames.add(t),q()),f&&f.close(),A(`Renamed "${a}" to "${t}"`,`success`),j(`connected`,`Renamed to "${t}"`,T.currentPath),K(),Y(!0),z(!0)):A(`Rename failed: ${r?.error||`Unknown error`}`,`error`)}catch(e){A(`Rename error: ${e?.message||`Unknown error`}`,`error`)}finally{h&&(h.disabled=!1)}}),g&&g.addEventListener(`click`,()=>{f&&f.close()}),f&&f.addEventListener(`cancel`,e=>{e.preventDefault()}),m&&m.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),h&&h.click())}),_&&_.addEventListener(`change`,()=>{localStorage.setItem(`mininxd_download_mode`,`zip`),q(),A(`Multi-select download mode: ZIP Archive`,`info`)}),v&&v.addEventListener(`change`,()=>{localStorage.setItem(`mininxd_download_mode`,`individual`),q(),A(`Multi-select download mode: Individual Files`,`info`)}),b&&b.addEventListener(`click`,()=>{let e=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`);e&&navigator.clipboard.writeText(e).then(()=>{A(`User ID copied to clipboard`,`success`)}).catch(()=>{A(e,`info`)})}),S&&y&&S.addEventListener(`click`,()=>{try{localStorage.setItem(`mininxd_welcome_dismissed`,`true`),sessionStorage.setItem(`mininxd_welcome_dismissed`,`true`)}catch{}y.close()}),y&&y.addEventListener(`close`,()=>{try{localStorage.setItem(`mininxd_welcome_dismissed`,`true`),sessionStorage.setItem(`mininxd_welcome_dismissed`,`true`)}catch{}}),x&&x.addEventListener(`click`,async()=>{let e=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),t=document.getElementById(`welcomeMasterKeyInput`),n=t?t.value.trim():``;if(e){if(!n){A(`Master Key is required to create your administrator account`,`warning`),t&&t.focus();return}x.disabled=!0;try{let t=await(await N(`/api/add_admin`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({userid:e,masterkey:n})})).json();if(t&&t.success){if(n)try{localStorage.setItem(`mininxd_master_key`,n),T.currentMasterKey=n}catch{}A(`This device has been configured as Admin! Reloading...`,`success`),setTimeout(()=>{window.location.href=`/${e}`},800)}else A(`Failed: ${t?.error||`Error setting admin`}`,`error`),x.disabled=!1}catch(e){A(`Error: ${e?.message||`Error`}`,`error`),x.disabled=!1}}}),window.openRenameModal=fe}function me({onSuccess:e,onCancel:t}={}){let n=document.getElementById(`adminMasterKeyModal`),r=document.getElementById(`adminMasterKeyModalInput`),i=document.getElementById(`adminMasterKeyForm`),a=document.getElementById(`adminMasterKeyCancelBtn`),o=document.getElementById(`adminMasterKeySubmitBtn`);if(!n)return;r&&(r.value=``);let s=()=>{i&&(i.onsubmit=null),a&&(a.onclick=null)};a&&(a.onclick=()=>{s();try{n.close()}catch{}typeof t==`function`&&t()}),i&&(i.onsubmit=async t=>{t.preventDefault();let i=r?r.value.trim():``;if(!i){A(`Please enter the Master Key`,`warning`);return}o&&(o.disabled=!0);try{let t=await(await N(`/api/verify_masterkey`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({masterkey:i})})).json();if(t&&t.success){try{localStorage.setItem(`mininxd_master_key`,i),T.currentMasterKey=i}catch{}A(`Master Key verified! Admin permissions unlocked.`,`success`),s();try{n.close()}catch{}typeof e==`function`&&e()}else A(`Invalid Master Key: ${t?.error||`Authorization failed`}`,`error`)}catch(e){A(`Verification error: ${e.message}`,`error`)}finally{o&&(o.disabled=!1)}});try{n.showModal(),setTimeout(()=>{r&&r.focus()},150)}catch{}}function he({userId:e,cleanId:t,dirName:n,onSuccess:r,onCancel:i}={}){let a=document.getElementById(`publicKeyModal`),o=document.getElementById(`publicKeyModalSubtitle`),s=document.getElementById(`publicKeyModalPromptText`),c=document.getElementById(`publicKeyModalInput`),l=document.getElementById(`publicKeyModalForm`),u=document.getElementById(`publicKeyModalCancelBtn`),d=document.getElementById(`publicKeyModalSubmitBtn`),f=document.getElementById(`togglePublicKeyVisibilityBtn`),p=document.getElementById(`togglePublicKeyIcon`);if(!a)return;o&&(o.textContent=`Directory: ${n||t} (${t})`),s&&(s.textContent=`Access to public directory "${n||t}" is protected. Please enter the password or key to continue.`),c&&(c.value=``,c.type=`password`),p&&(p.className=`ri-eye-line text-xs`),f&&c&&p&&(f.onclick=()=>{let e=c.type===`password`;c.type=e?`text`:`password`,p.className=e?`ri-eye-off-line text-xs`:`ri-eye-line text-xs`});let m=()=>{l&&(l.onsubmit=null),u&&(u.onclick=null)};u&&(u.onclick=()=>{m();try{a.close()}catch{}typeof i==`function`&&i()}),l&&(l.onsubmit=async e=>{e.preventDefault();let n=c?c.value.trim():``;if(!n){A(`Please enter the password / key`,`warning`);return}d&&(d.disabled=!0);try{let e=await(await N(`/api/public/verify-key`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:t,key:n})})).json();if(e&&e.success&&e.valid){try{sessionStorage.setItem(`mininxd_pub_key_`+t,n)}catch{}A(`Access Key verified! Public space unlocked.`,`success`),m();try{a.close()}catch{}typeof r==`function`&&r(n)}else A(e?.error||`Invalid key or password`,`error`)}catch(e){A(`Verification error: ${e.message}`,`error`)}finally{d&&(d.disabled=!1)}});try{a.showModal(),setTimeout(()=>{c&&c.focus()},150)}catch{}}function ge({user:e,onSuccess:t,onCancel:n}={}){let r=document.getElementById(`publicSetPasswordModal`),i=document.getElementById(`publicSetPasswordModalTitle`),a=document.getElementById(`publicSetPasswordModalSubtitle`),o=document.getElementById(`publicSetPasswordModalDesc`),s=document.getElementById(`publicSetPasswordForm`),c=document.getElementById(`publicCurrentPasswordGroup`),l=document.getElementById(`publicCurrentPasswordInput`),u=document.getElementById(`toggleCurrentPasswordVisBtn`),d=document.getElementById(`toggleCurrentPasswordIcon`),f=document.getElementById(`publicNewPasswordLabel`),p=document.getElementById(`publicNewPasswordInput`),m=document.getElementById(`toggleNewPasswordVisBtn`),h=document.getElementById(`toggleNewPasswordIcon`),g=document.getElementById(`publicRemovePasswordBtn`),_=document.getElementById(`publicSetPasswordCancelBtn`),v=document.getElementById(`publicSetPasswordSubmitBtn`);if(!r||!e)return;let y=!!e.has_key;i&&(i.textContent=y?`Change Public Password`:`Add Public Password`),a&&(a.textContent=`User ID: ${e.clean_id}`),o&&(o.textContent=y?`Enter your current password and the new password below, or click Remove to make this folder open access.`:`Set a password to protect and control access to your folder.`),c&&(y?(c.classList.remove(`hidden`),l&&(l.value=``,l.type=`password`)):(c.classList.add(`hidden`),l&&(l.value=``))),f&&(f.textContent=y?`New Password`:`Password`),p&&(p.value=``,p.type=`password`,p.placeholder=y?`Enter new password...`:`Enter password...`),g&&(y?g.classList.remove(`hidden`):g.classList.add(`hidden`)),u&&l&&d&&(d.className=`ri-eye-line text-xs`,u.onclick=()=>{let e=l.type===`password`;l.type=e?`text`:`password`,d.className=e?`ri-eye-off-line text-xs`:`ri-eye-line text-xs`}),m&&p&&h&&(h.className=`ri-eye-line text-xs`,m.onclick=()=>{let e=p.type===`password`;p.type=e?`text`:`password`,h.className=e?`ri-eye-off-line text-xs`:`ri-eye-line text-xs`});let b=()=>{s&&(s.onsubmit=null),_&&(_.onclick=null),g&&(g.onclick=null)};_&&(_.onclick=()=>{b();try{r.close()}catch{}typeof n==`function`&&n()}),g&&(g.onclick=async()=>{let n=l?l.value.trim():``;if(y&&!n){A(`Please enter your current password to remove protection`,`warning`),l&&l.focus();return}v&&(v.disabled=!0),g&&(g.disabled=!0);try{let i=await(await N(`/api/public/set-password`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:e.user_id,current_key:n,new_key:``})})).json();if(i&&i.success){try{sessionStorage.removeItem(`mininxd_pub_key_`+e.clean_id)}catch{}A(`Password protection removed! Folder is now open access.`,`success`),b();try{r.close()}catch{}typeof t==`function`&&t(!1)}else A(i?.error||`Failed to remove password`,`error`)}catch(e){A(`Error: ${e.message}`,`error`)}finally{v&&(v.disabled=!1),g&&(g.disabled=!1)}}),s&&(s.onsubmit=async n=>{n.preventDefault();let i=l?l.value.trim():``,a=p?p.value.trim():``;if(y&&!i){A(`Please enter your current password`,`warning`),l&&l.focus();return}if(!a){A(`Please enter a password`,`warning`),p&&p.focus();return}v&&(v.disabled=!0);try{let n=await(await N(`/api/public/set-password`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:e.user_id,current_key:i,new_key:a})})).json();if(n&&n.success){try{sessionStorage.setItem(`mininxd_pub_key_`+e.clean_id,a)}catch{}A(`Public space password updated successfully!`,`success`),b();try{r.close()}catch{}typeof t==`function`&&t(!0)}else A(n?.error||`Failed to update password`,`error`)}catch(e){A(`Error: ${e.message}`,`error`)}finally{v&&(v.disabled=!1)}});try{r.showModal(),setTimeout(()=>{y&&l?l.focus():p&&p.focus()},150)}catch{}}window.promptPublicKeyModal=he,window.promptPublicSetPasswordModal=ge;function _e(e,t=null){let n=document.getElementById(`pinModal`),r=document.getElementById(`pinModalTitle`),i=document.getElementById(`pinModalItemName`),a=document.getElementById(`pinBadgeTextInput`),o=document.getElementById(`unpinItemBtn`),s=document.getElementById(`pinSubmitBtnText`),c=document.getElementById(`pinCancelBtn`),l=document.getElementById(`pinForm`),u=document.getElementById(`pinSubmitBtn`);if(!n)return;let d=T.isPublicMode&&T.currentPublicUser?T.currentPublicUser.dir_name||`public/`+T.currentPublicUser.clean_id:T.currentPath,f=T.isPublicMode?T.publicCurrentSubpath||`/`:``,p=T.isPublicMode?f===`/`?d:d+f:d,m=(p.endsWith(`/`)?p:p+`/`)+e,h=t!=null;r&&(r.textContent=h?`Edit Pin`:`Pin Item`),i&&(i.textContent=e),a&&(a.value=h?String(t||``):``),s&&(s.textContent=h?`Update Pin`:`Pin Item`),o&&(h?(o.classList.remove(`hidden`),o.onclick=async()=>{try{o.disabled=!0;let t=await(await N(`/api/pins/remove`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({path:m})})).json();t&&t.success?(A(`Unpinned "${e}"`,`info`),n.close(),K(),Y(!0)):A(`Failed to unpin: ${t?.error||`Unknown error`}`,`error`)}catch(e){A(`Unpin error: ${e.message}`,`error`)}finally{o.disabled=!1}}):o.classList.add(`hidden`)),c&&(c.onclick=()=>n.close()),l&&(l.onsubmit=async t=>{t&&t.preventDefault();let r=a?a.value.trim():``;try{u&&(u.disabled=!0);let t=await(await N(`/api/pins/set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({path:m,badge_text:r})})).json();t&&t.success?(A(h?`Updated pin for "${e}"`:`Pinned "${e}"`,`success`),n.close(),K(),Y(!0)):A(`Failed to pin: ${t?.error||`Unknown error`}`,`error`)}catch(e){A(`Pin error: ${e.message}`,`error`)}finally{u&&(u.disabled=!1)}}),n.showModal(),a&&setTimeout(()=>a.focus(),150)}window.openPinModal=_e;var U=null,W=!1,G=new Map,ve=new Map,ye=2e4,be=0,xe=null;function K(){ve.clear()}function Se(){let e=document.getElementById(`clipboardBar`),t=document.getElementById(`clipboardIcon`),n=document.getElementById(`clipboardText`);if(!e)return;if(!U||!U.items||U.items.length===0){e.classList.add(`hidden`);return}e.classList.remove(`hidden`);let r=U.items.length,i=U.mode===`cut`;t&&(t.className=i?`ri-scissors-2-line text-primary text-base`:`ri-file-copy-line text-primary text-base`),n&&(n.textContent=`${r} ${r===1?`item`:`items`} ${i?`cut`:`copied`} from ${U.sourceDir}`)}function Ce(){let e=T.isPublicMode&&!!T.currentPublicUser;if(!T.isUserAdmin&&!e){A(`View only mode: Copy is only allowed inside public space`,`warning`);return}let t=e?T.publicCurrentSubpath||`/`:T.currentPath,n=Array.from(T.selectedFileNames).map(n=>{let r=T.filesList.find(e=>e.name===n),i=r?r.type===2||r.isDirectory:!1;return{path:(t.endsWith(`/`)?t:t+`/`)+n,isDir:i,name:n,isPublic:e,publicUserId:e?T.currentPublicUser.clean_id:null}});n.length!==0&&(U={mode:`copy`,items:n,sourceDir:e?`public${t===`/`?``:t}`:t,isPublic:e,publicUserId:e?T.currentPublicUser.clean_id:null},Ee(),Se(),A(`Copied ${n.length} item(s) to clipboard`,`info`))}function we(){let e=T.isPublicMode&&!!T.currentPublicUser;if(!T.isUserAdmin&&!e){A(`View only mode: Cut is only allowed inside public space`,`warning`);return}let t=e?T.publicCurrentSubpath||`/`:T.currentPath,n=Array.from(T.selectedFileNames).map(n=>{let r=T.filesList.find(e=>e.name===n),i=r?r.type===2||r.isDirectory:!1;return{path:(t.endsWith(`/`)?t:t+`/`)+n,isDir:i,name:n,isPublic:e,publicUserId:e?T.currentPublicUser.clean_id:null}});n.length!==0&&(U={mode:`cut`,items:n,sourceDir:e?`public${t===`/`?``:t}`:t,isPublic:e,publicUserId:e?T.currentPublicUser.clean_id:null},Ee(),Se(),A(`Cut ${n.length} item(s) to clipboard`,`info`))}async function Te(){let e=document.getElementById(`pasteBtn`);if(!U||!U.items||U.items.length===0)return;let t=T.isPublicMode&&!!T.currentPublicUser;if(!T.isUserAdmin&&!t){A(`View only mode: Pasting is only allowed inside public space`,`warning`);return}let{mode:n,items:r,isPublic:i,publicUserId:a}=U,o=n===`cut`?`Moving`:`Copying`;if(T.isPublicMode&&T.currentPublicUser){let i=T.publicCurrentSubpath||`/`,s=T.currentPublicUser.clean_id;if(t&&a&&a!==s){A(`Cannot paste between different public spaces`,`warning`);return}let c=n===`cut`?`/api/public/move`:`/api/public/copy`,l=sessionStorage.getItem(`mininxd_pub_key_`+s)||``;A(`${o} ${r.length} item(s) to public${i}...`,`info`),e&&(e.disabled=!0);try{let e=await(await N(c,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:s,path:i,items:r,key:l})})).json();e.success?(A(`${n===`cut`?`Moved`:`Copied`} ${e.count||r.length} item(s) successfully!`,`success`),U=null,Se(),K(),Y(!0)):A(`Paste failed: ${e.error||`Unknown error`}`,`error`)}catch(e){A(`Paste error: ${e.message}`,`error`)}finally{e&&(e.disabled=!1)}return}if(!T.isUserAdmin){A(`View only mode: pasting is disabled`,`warning`);return}let s=n===`cut`?`/api/ftp/move`:`/api/ftp/copy`;A(`${o} ${r.length} item(s) to ${T.currentPath}...`,`info`),e&&(e.disabled=!0);try{let e=await(await N(s,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({items:r,targetDir:T.currentPath,fingerprint:T.currentDeviceFingerprint})})).json();e.success?(A(`${n===`cut`?`Moved`:`Copied`} ${e.count||r.length} item(s) successfully!`,`success`),U=null,Se(),K(),Y(!0),z(!0)):A(`Paste failed: ${e.error||`Unknown error`}`,`error`)}catch(e){A(`Paste error: ${e.message}`,`error`)}finally{e&&(e.disabled=!1)}}function Ee(e=!1){let t=document.getElementById(`searchInput`);return T.selectedFileNames&&T.selectedFileNames.size>0?(T.selectedFileNames.clear(),q(),J(t?t.value.trim():``),!0):!1}function q(){let e=document.getElementById(`batchActionToolbar`),t=document.getElementById(`selectedCountBadge`),n=document.getElementById(`selectAllCheckbox`),r=document.getElementById(`fabTriggerBtn`),i=document.getElementById(`fabMenu`),a=document.getElementById(`batchCopyBtn`),o=document.getElementById(`batchCutBtn`),s=document.getElementById(`batchDeleteBtn`),c=document.getElementById(`adminDashboardView`),l=c&&!c.classList.contains(`hidden`),u=T.selectedFileNames.size;if(u>0){e&&e.classList.remove(`hidden`),t&&(t.textContent=`${u}`),r&&r.classList.add(`hidden`),i&&i.classList.add(`hidden`),T.isUserAdmin||T.isPublicMode&&T.currentPublicUser?(a&&a.classList.remove(`hidden`),o&&o.classList.remove(`hidden`),s&&s.classList.remove(`hidden`)):(a&&a.classList.add(`hidden`),o&&o.classList.add(`hidden`),s&&s.classList.add(`hidden`));let n=document.getElementById(`batchDownloadBtn`),c=document.getElementById(`batchDownloadBtnText`)||(n?n.querySelector(`span`):null),l=w(),d=Array.from(T.selectedFileNames).some(e=>{let t=T.filesList.find(t=>t.name===e);return t?t.type===2||t.isDirectory:!1});n&&c&&(d?(c.textContent=`Download ZIP`,n.title=`Download Selected as ZIP Archive (Folder included)`):u===1?(c.textContent=`Download File`,n.title=`Download Selected File`):l===`individual`?(c.textContent=`Download Files`,n.title=`Download Selected Files Individually`):(c.textContent=`Download ZIP`,n.title=`Download Selected as ZIP Archive`))}else e&&e.classList.add(`hidden`),r&&((T.isUserAdmin||T.isPublicMode)&&!l?r.classList.remove(`hidden`):r.classList.add(`hidden`));n&&(n.checked=T.filesList.length>0&&T.selectedFileNames.size===T.filesList.length)}function De(){let e=document.getElementById(`currentPathDisplay`),t=document.getElementById(`dropTargetLabel`),n=document.getElementById(`breadcrumbBar`);if(T.isPublicMode&&T.currentPublicUser){let r=T.publicCurrentSubpath||`/`,i=r===`/`?`public`:`public${r}`;if(e&&(e.textContent=i),t&&(t.textContent=`Uploading to public storage`),!n)return;let a=(T.publicCurrentSubpath||`/`).split(`/`).filter(Boolean),o=`
          <button class="btn btn-ghost btn-xs text-primary font-bold px-1.5 gap-1" onclick="window.exitPublicMode()" title="Return to root">root</button>
          <span class="text-base-content/40">/</span>
          <button class="btn btn-ghost btn-xs text-secondary font-mono font-bold px-1.5" onclick="window.navigateToPublic('${T.currentPublicUser.clean_id}', '/')">${T.currentPublicUser.clean_id}</button>
        `,s=``;a.forEach(e=>{s+=`/`+e;let t=s;o+=`
              <span class="text-base-content/40">/</span>
              <button class="btn btn-ghost btn-xs font-mono font-medium px-1.5" onclick="window.navigateToPublic('${T.currentPublicUser.clean_id}', '${t}')">${e}</button>
            `}),n.innerHTML=o;return}if(e&&(e.textContent=T.currentPath),t&&(t.textContent=`Uploading to: ${T.currentPath}`),localStorage.setItem(`mininxd_current_path`,T.currentPath),!n)return;let r=T.currentPath.split(`/`).filter(Boolean),i=`<button class="btn btn-ghost btn-xs text-primary font-bold px-1.5 gap-1" onclick="window.navigateTo('/')">root</button>`,a=``;r.forEach(e=>{a+=`/`+e,i+=`
          <span class="text-base-content/40">/</span>
          <button class="btn btn-ghost btn-xs font-mono font-medium px-1.5" onclick="window.navigateTo('${a}')">${e}</button>
        `}),n.innerHTML=i}function J(e=``){let t=document.getElementById(`filesTableBody`),n=document.getElementById(`footerItemCount`);if(!t)return;let r=T.selectedFileNames.size>0,i=T.filesList.filter(t=>t.name.toLowerCase().includes(e.toLowerCase()));if(i.sort((e,t)=>{if(e.isPinned&&!t.isPinned)return-1;if(!e.isPinned&&t.isPinned)return 1;let n=e.type===2||e.isDirectory,r=t.type===2||t.isDirectory;if(n&&!r)return-1;if(!n&&r)return 1;let i=0;return T.sortColumn===`name`?i=e.name.localeCompare(t.name,void 0,{numeric:!0,sensitivity:`base`}):T.sortColumn===`size`?i=(e.size||0)-(t.size||0):T.sortColumn===`date`&&(i=new Date(e.rawModifiedAt||e.modifiedAt||0).getTime()-new Date(t.rawModifiedAt||t.modifiedAt||0).getTime()),T.sortDirection===`asc`?i:-i}),n&&(n.textContent=`${i.length} item(s)`),i.length===0){t.innerHTML=`
          <tr>
            <td colspan="6" class="py-10 text-center text-xs text-base-content/50">
              No files or folders found in this directory.
            </td>
          </tr>
        `;return}t.innerHTML=i.map(e=>{let t=e.type===2||e.isDirectory,n=!t&&se(e.name),i=!t&&ce(e.name),a=!t&&ue(e.name),o=!t&&le(e.name),s=a||o,c=T.selectedFileNames.has(e.name),l=e.name.replace(/'/g,`\\'`),u=e.badgeText?e.badgeText.replace(/'/g,`\\'`):``,{icon:d,color:f}=O(e.name,t),p=`${d} ${f}`,m=e.itemCount===void 0?`folder`:`${e.itemCount} ${e.itemCount===1?`item`:`items`}`,h=t?`ondragover="window.handleFolderDragOver(event, this)" ondragleave="window.handleFolderDragLeave(event, this)" ondrop="window.handleFolderDrop(event, '${l}', this)"`:``;return`
          <tr class="hover transition-colors ${c?`bg-primary/5 font-medium`:``} ${r?`cursor-pointer`:``}" ${h} onclick="window.handleRowClick(event, '${l}', ${t}, '${n?`text`:i?`img`:s?`media`:`default`}', ${o})">
            <td class="text-center" onclick="event.stopPropagation()">
              <input type="checkbox" class="checkbox checkbox-xs checkbox-primary cursor-pointer" ${c?`checked`:``} onclick="event.stopPropagation()" onchange="window.toggleSelectRow('${l}')" />
            </td>
            <td class="text-center font-medium text-xs">
              ${t?`<span class="badge badge-warning badge-xs font-bold">DIR</span>`:`<span class="badge badge-ghost badge-xs">FILE</span>`}
            </td>
            <td class="whitespace-nowrap">
              <div class="font-mono text-xs ${t?`font-semibold text-primary hover:underline cursor-pointer`:n||i||s?`font-medium text-base-content hover:text-primary cursor-pointer`:`font-medium text-base-content`} transition inline-flex items-center gap-2 text-left whitespace-nowrap" title="${l}">
                ${e.isPinned?`<i class="ri-pushpin-fill text-amber-500 text-sm shrink-0" title="Pinned item"></i>`:``}
                <i class="${p} text-sm shrink-0"></i>
                <span>${e.name}</span>
                ${e.isPinned&&e.badgeText?`<span class="badge badge-secondary/15 text-secondary border border-secondary/30 badge-xs text-[10px] font-mono font-normal">${e.badgeText}</span>`:``}
              </div>
            </td>
            <td class="font-mono text-xs text-right text-base-content/70">
              ${t?`<span class="badge badge-ghost badge-xs font-mono text-[10px] opacity-75">${m}</span>`:E(e.size)}
            </td>
            <td class="font-mono text-xs text-base-content/70">
              ${e.rawModifiedAt||e.modifiedAt||`-`}
            </td>
            <td class="text-right" onclick="event.stopPropagation()">
              ${r?``:`
                <div class="join">
                  ${n?`
                    <button onclick="window.openCodeEditor('${l}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="${T.isUserAdmin||T.isPublicMode?`Edit`:`View`}">
                      <i class="${T.isUserAdmin||T.isPublicMode?`ri-code-line`:`ri-file-text-line`} text-xs"></i>
                    </button>
                  `:``}
                  ${i?`
                    <button onclick="window.openImagePreview('${l}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Preview">
                      <i class="ri-eye-line text-xs"></i>
                    </button>
                  `:``}
                  ${s?`
                    <button onclick="window.openMediaPreview('${l}', ${o})" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Play">
                      <i class="ri-play-circle-line text-xs"></i>
                    </button>
                  `:``}
                  ${t?``:`
                    <button onclick="window.downloadFile('${l}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Download">
                      <i class="ri-download-2-line text-xs"></i>
                    </button>
                  `}
                  ${T.isUserAdmin?`
                    <button onclick="window.openPinModal('${l}', ${e.isPinned?`'${u}'`:`null`})" class="btn btn-ghost btn-xs join-item ${e.isPinned?`text-amber-500 hover:bg-amber-500/10`:`text-primary hover:bg-primary/10`} transition-colors" title="${e.isPinned?`Edit / Remove Pin`:`Pin Item`}">
                      <i class="${e.isPinned?`ri-pushpin-fill`:`ri-pushpin-line`} text-xs"></i>
                    </button>
                  `:``}
                  ${T.isUserAdmin||T.isPublicMode?`
                    <button onclick="window.openRenameModal('${l}')" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Rename">
                      <i class="ri-edit-line text-xs"></i>
                    </button>
                    <button onclick="window.deleteItem('${l}', ${t})" class="btn btn-ghost btn-xs join-item text-primary hover:bg-primary/10 transition-colors" title="Delete">
                      <i class="ri-delete-bin-line text-xs"></i>
                    </button>
                  `:``}
                </div>
              `}
            </td>
          </tr>
        `}).join(``)}async function Y(e=!1){let t=++be,n=T.isPublicMode&&T.currentPublicUser?`pub_${T.currentPublicUser.clean_id}_${T.publicCurrentSubpath||`/`}`:T.currentPath;if(xe)try{xe.abort()}catch{}let r=new AbortController;xe=r;let i=document.getElementById(`refreshBtn`),a=document.getElementById(`btnSpinner`),o=document.getElementById(`searchInput`),s=document.getElementById(`filesTableBody`),c=document.getElementById(`breadcrumbBar`);De();let l=e?null:ve.get(n);if(l&&Date.now()-l.time<ye){T.filesList=l.data||[],J(o?o.value.trim():``),W=!1;return}T.filesList=[],J(``),i&&(i.disabled=!0),a&&a.classList.remove(`hidden`),s&&s.classList.add(`pointer-events-none`,`opacity-60`),c&&c.classList.add(`pointer-events-none`);try{if(T.isPublicMode&&T.currentPublicUser){let e=T.currentPublicUser.clean_id,i=T.publicCurrentSubpath||`/`,a=await N(`/api/public/list?user_id=${encodeURIComponent(e)}&path=${encodeURIComponent(i)}`,{signal:r.signal}),s=await a.json();if((s.requiresKey||a.status===401)&&!T.isUserAdmin){W=!1,he({userId:T.currentPublicUser.user_id,cleanId:T.currentPublicUser.clean_id,dirName:T.currentPublicUser.dir_name,onSuccess:()=>{Y(!0)},onCancel:()=>{ke()}});return}if(s.success){let e=s.data||[];T.currentPublicUsedBytes=s.used_bytes,T.currentPublicAvailableBytes=s.available_bytes,Oe(),ve.set(n,{data:e,time:Date.now()}),t===be&&T.isPublicMode&&(T.filesList=e,J(o?o.value.trim():``),j(`connected`,`Public Directory`,T.publicCurrentSubpath===`/`?``:`public${T.publicCurrentSubpath}`))}else t===be&&T.isPublicMode&&j(`error`,`Public Space Error`,s.error);return}if(T.currentPath===`/public`){let e=(T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``).toLowerCase().replace(/^0x/,``);if(!T.isUserAdmin&&e){X(e,`/`,!1);return}let i=[];try{let e=await(await N(`/api/public/users`,{signal:r.signal})).json();i=e&&e.users||[]}catch{i=[]}e&&!i.some(t=>t.clean_id===e)&&i.unshift({user_id:`0x`+e,clean_id:e,dir_name:`public/`+e,has_key:!1,isSelf:!0});let a=i.map(t=>({name:t.clean_id,type:2,isDirectory:!0,isPublicUserFolder:!0,clean_id:t.clean_id,user_id:t.user_id,dir_name:t.dir_name,has_key:t.has_key,size:0,rawModifiedAt:t.clean_id===e?`My Public Space`:t.has_key?`Password Protected`:`Open Space`}));ve.set(n,{data:a,time:Date.now()}),t===be&&T.currentPath===`/public`&&(T.filesList=a,J(o?o.value.trim():``),j(`connected`,`Public Spaces Directory`,`/public`));return}let e=await(await N(`/api/ftp/list?path=${encodeURIComponent(n)}`,{signal:r.signal})).json();if(e.success){let r=e.data||[];if(T.currentPath===`/`&&T.publicModeConfig?.enabled){let e=(T.publicModeConfig?.public_folder_name||`public`).trim()||`public`;r=r.some(t=>t.name.toLowerCase()===e.toLowerCase()||t.name.toLowerCase()===`public`)?r.map(t=>t.name.toLowerCase()===e.toLowerCase()||t.name.toLowerCase()===`public`?{...t,name:e,isPublicFolder:!0,rawModifiedAt:`Public Space`}:t):[{name:e,type:2,isDirectory:!0,isPublicFolder:!0,size:0,rawModifiedAt:`Public Space`},...r]}ve.set(n,{data:r,time:Date.now()}),t===be&&T.currentPath===n&&(T.filesList=r,J(o?o.value.trim():``),z(!1))}else t===be&&T.currentPath===n&&j(`error`,`FTP connection error`,e.error)}catch(e){if(e.name===`AbortError`)return;t===be&&j(`error`,`Connection failed`,e.message)}finally{t===be&&(W=!1,i&&(i.disabled=!1),a&&a.classList.add(`hidden`),s&&s.classList.remove(`pointer-events-none`,`opacity-60`),c&&c.classList.remove(`pointer-events-none`))}}function Oe(){let e=document.getElementById(`publicModeHeaderBanner`),t=document.getElementById(`publicModeUserDisplay`),n=document.getElementById(`publicModeKeyBadge`),r=document.getElementById(`publicModeKeyBadgeText`),i=document.getElementById(`publicModeQuotaProgressBar`),a=document.getElementById(`publicModeQuotaPercentBadge`),o=document.getElementById(`publicModeQuotaUsedText`),s=document.getElementById(`publicModeQuotaFreeText`),c=document.getElementById(`publicModeFormatChipsList`),l=document.getElementById(`publicSetPasswordBtn`),u=document.getElementById(`publicSetPasswordText`),d=document.getElementById(`publicSetPasswordIcon`),f=document.getElementById(`fabTriggerBtn`);if(!T.isPublicMode||!T.currentPublicUser){e&&e.classList.add(`hidden`);return}e&&e.classList.remove(`hidden`);let p=String(T.currentPublicUser.clean_id||``).toLowerCase().replace(/^0x/,``);t&&(t.textContent=`@${p.length>14?`${p.slice(0,6)}...${p.slice(-4)}`:p||`public`}`),n&&(T.currentPublicUser.has_key?(r&&(r.textContent=`Password Protected`),n.className=`badge badge-warning badge-xs font-mono text-[10px] gap-1 py-2 px-2 rounded-lg`,n.classList.remove(`hidden`)):n.classList.add(`hidden`));let m=T.publicModeConfig?.max_size||100,h=m*1024*1024,g=T.currentPublicUsedBytes||0,_=T.currentPublicAvailableBytes===void 0?Math.max(0,h-g):T.currentPublicAvailableBytes,v=h>0?Math.min(100,Math.round(g/h*100)):0;i&&(i.style.width=`${v}%`,i.className=v>=90?`h-full bg-error rounded-full transition-all duration-500 ease-out`:v>=75?`h-full bg-warning rounded-full transition-all duration-500 ease-out`:`h-full bg-primary rounded-full transition-all duration-500 ease-out`),a&&(a.textContent=`${v}% used`,a.className=v>=90?`badge badge-error badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0`:v>=75?`badge badge-warning badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0`:v>0?`badge badge-primary badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0`:`badge badge-neutral badge-soft badge-xs font-mono text-[9px] py-1 px-1.5 rounded-md shrink-0`);let y=document.getElementById(`publicModeLimitText`);y&&(y.textContent=`${m} MB`),o&&(o.textContent=`${E(g)} / ${m} MB`),s&&(s.textContent=`${E(_)} free`);let b=document.getElementById(`publicModeItemsCountText`),x=document.getElementById(`publicModeSubpathText`);if(b){let e=Array.isArray(T.filesList)?T.filesList.length:0;b.textContent=`${e} item${e===1?``:`s`}`}x&&(x.textContent=T.publicCurrentSubpath||`/`);let S=document.getElementById(`publicModeAllowedFormatsContainer`),C=T.publicModeConfig?.allowed_format||[];Array.isArray(C)&&C.length>0?(S&&S.classList.remove(`hidden`),c&&(c.innerHTML=C.map(e=>`<span class="badge badge-xs bg-base-200 text-base-content/80 border border-base-300/80 rounded-md font-mono">${e}</span>`).join(``))):(S&&S.classList.add(`hidden`),c&&(c.innerHTML=``)),l&&(u&&(u.textContent=T.currentPublicUser.has_key?`Change Password`:`Add Password`),d&&(d.className=T.currentPublicUser.has_key?`ri-lock-password-line text-xs text-primary`:`ri-shield-keyhole-line text-xs text-primary`),l.onclick=()=>{typeof window.promptPublicSetPasswordModal==`function`&&window.promptPublicSetPasswordModal({user:T.currentPublicUser,onSuccess:e=>{T.currentPublicUser.has_key=e,Oe()}})}),f&&f.classList.remove(`hidden`)}function ke(){T.isPublicMode=!1,T.currentPublicUser=null,T.publicCurrentSubpath=`/`,Oe();let e=document.getElementById(`fabTriggerBtn`);!T.isUserAdmin&&e&&e.classList.add(`hidden`),Ae(`/`,!0)}function X(e,t=`/`,n=!0){if(W)return;W=!0;let r=String(e||``).toLowerCase().replace(/^0x/,``).trim(),i=T.publicModeConfig;if(!i||!i.enabled){A(`Public mode is currently disabled`,`warning`),W=!1;return}let a=(i.user_list||[]).find(e=>e.clean_id===r);a||={user_id:e.startsWith(`0x`)?e:`0x`+r,clean_id:r,dir_name:`public/`+r,has_key:!1,key:``,isDynamic:!0};let o=t.startsWith(`/`)?t:`/`+t;if(a.has_key&&!T.isUserAdmin&&!sessionStorage.getItem(`mininxd_pub_key_`+a.clean_id)){W=!1,he({userId:a.user_id,cleanId:a.clean_id,dirName:a.dir_name,onSuccess:()=>{X(a.clean_id,o,n)},onCancel:()=>{ke()}});return}T.isPublicMode=!0,T.currentPublicUser=a,T.publicCurrentSubpath=o,T.selectedFileNames.clear(),q(),Oe();let s=`/pub/${a.clean_id}${o===`/`?``:o}`;if(n)try{history.pushState({public:!0,user:a.clean_id,path:o},``,s)}catch{}else try{history.replaceState({public:!0,user:a.clean_id,path:o},``,s)}catch{}W=!1,Y()}function Ae(e,t=!0){if(W)return;W=!0,T.isPublicMode&&(T.isPublicMode=!1,T.currentPublicUser=null,T.publicCurrentSubpath=`/`,Oe());let n=e.startsWith(`/`)?e:`/`+e;if(n===T.currentPath&&!t){W=!1;return}T.currentPath=n,T.selectedFileNames.clear(),q();let r=T.currentPath===`/`?`/`:`/#`+encodeURIComponent(T.currentPath);if(t)try{history.pushState({path:T.currentPath},``,r)}catch{}else try{history.replaceState({path:T.currentPath},``,r)}catch{}Y()}function je(e=!0){if(W)return!0;let t=document.getElementById(`renameModal`),n=document.getElementById(`draculaEditorModal`),r=document.getElementById(`imagePreviewModal`),i=document.getElementById(`mediaPreviewModal`),a=document.getElementById(`newFileModal`),o=document.getElementById(`newFolderModal`),s=document.getElementById(`settingsModal`),c=document.getElementById(`publicKeyModal`),l=document.getElementById(`fabMenu`),u=document.getElementById(`fabPlusIcon`);if(t&&t.open)return t.close(),!0;let d=[n,r,i,a,o,s,c];for(let e of d)if(e&&e.open)return e.close(),!0;if(T.selectedFileNames&&T.selectedFileNames.size>0)return Ee(!1),!0;if(l&&!l.classList.contains(`hidden`))return l.classList.add(`hidden`),u&&(u.className=`ri-add-line text-2xl`),!0;if(T.isPublicMode&&T.currentPublicUser){if(T.publicCurrentSubpath===`/`||T.publicCurrentSubpath===``)return ke(),!0;let t=T.publicCurrentSubpath.split(`/`).filter(Boolean);t.pop();let n=t.length===0?`/`:`/`+t.join(`/`);return X(T.currentPublicUser.clean_id,n,e),!0}if(T.currentPath===`/`||T.currentPath===``)return!1;let f=T.currentPath.split(`/`).filter(Boolean);return f.pop(),Ae(f.length===0?`/`:`/`+f.join(`/`),e),!0}function Me(e){if(T.isPublicMode&&T.currentPublicUser){let t=T.publicCurrentSubpath||`/`,n=(t.endsWith(`/`)?t:t+`/`)+e,r=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,i=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||``,a=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``;if(T.currentPublicUser.has_key&&!r&&!T.isUserAdmin){typeof window.promptPublicKeyModal==`function`&&window.promptPublicKeyModal({userId:T.currentPublicUser.user_id,cleanId:T.currentPublicUser.clean_id,dirName:T.currentPublicUser.dir_name,onSuccess:()=>{Me(e)}});return}let o=`/api/public/download?user_id=${encodeURIComponent(T.currentPublicUser.clean_id)}&path=${encodeURIComponent(n)}`;r&&(o+=`&key=${encodeURIComponent(r)}`),i&&(o+=`&masterkey=${encodeURIComponent(i)}`),a&&(o+=`&fingerprint=${encodeURIComponent(a)}`);let s=document.createElement(`a`);s.href=o,s.download=e,document.body.appendChild(s),s.click(),document.body.removeChild(s);return}let t=(T.currentPath.endsWith(`/`)?T.currentPath:T.currentPath+`/`)+e,n=document.createElement(`a`);n.href=`/api/ftp/download?path=${encodeURIComponent(t)}`,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n)}async function Ne(e,t){if(T.isPublicMode&&T.currentPublicUser){if(!confirm(`Are you sure you want to delete ${t?`folder`:`file`} "${e}"?`))return;let n=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``;try{let r=await(await N(`/api/public/delete`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:T.currentPublicUser.clean_id,path:T.publicCurrentSubpath||`/`,itemName:e,isDir:t,key:n})})).json();r&&r.success?(T.selectedFileNames.delete(e),q(),j(`connected`,`Deleted ${e}`,T.publicCurrentSubpath),K(),Y(!0)):(j(`error`,`Delete failed: ${r?.error||`Unknown error`}`),A(`Delete failed: ${r?.error||`Unknown error`}`,`error`))}catch(e){j(`error`,`Delete error: ${e.message}`),A(`Delete error: ${e.message}`,`error`)}return}if(!T.isUserAdmin){A(`View only mode: deletion is disabled`,`warning`);return}if(!confirm(`Are you sure you want to delete ${t?`folder`:`file`} "${e}"?`))return;let n=(T.currentPath.endsWith(`/`)?T.currentPath:T.currentPath+`/`)+e;try{let r=await(await N(`/api/ftp/delete?path=${encodeURIComponent(n)}&isDir=${t}&fingerprint=${encodeURIComponent(T.currentDeviceFingerprint||``)}`,{method:`DELETE`})).json();r.success?(T.selectedFileNames.delete(e),q(),j(`connected`,`Deleted ${e}`,T.currentPath),K(),Y(!0),z(!0)):j(`error`,`Delete failed: ${r.error}`)}catch(e){j(`error`,`Delete error: ${e.message}`)}}function Pe(){let e=document.getElementById(`refreshBtn`),t=document.getElementById(`navUpBtn`),n=document.getElementById(`navRootBtn`),r=document.getElementById(`searchInput`),i=document.getElementById(`selectAllCheckbox`),a=document.getElementById(`sortNameHeader`),o=document.getElementById(`sortSizeHeader`),s=document.getElementById(`sortDateHeader`),c=document.getElementById(`sortNameIcon`),l=document.getElementById(`sortSizeIcon`),u=document.getElementById(`sortDateIcon`),d=document.getElementById(`batchDownloadBtn`),f=document.getElementById(`batchDeleteBtn`),p=document.getElementById(`batchCopyBtn`),m=document.getElementById(`batchCutBtn`),h=document.getElementById(`clearSelectionBtn`),g=document.getElementById(`pasteBtn`),_=document.getElementById(`cancelClipboardBtn`);e&&e.addEventListener(`click`,()=>{K(),Y(!0)}),t&&t.addEventListener(`click`,je),n&&n.addEventListener(`click`,()=>Ae(`/`)),r&&r.addEventListener(`input`,e=>{J(e.target.value.trim())});let v=e=>{T.sortColumn===e?T.sortDirection=T.sortDirection===`asc`?`desc`:`asc`:(T.sortColumn=e,T.sortDirection=`asc`),c&&(c.className=T.sortColumn===`name`?T.sortDirection===`asc`?`ri-arrow-up-line text-xs text-primary`:`ri-arrow-down-line text-xs text-primary`:`ri-arrow-up-down-line text-xs opacity-50`),l&&(l.className=T.sortColumn===`size`?T.sortDirection===`asc`?`ri-arrow-up-line text-xs text-primary`:`ri-arrow-down-line text-xs text-primary`:`ri-arrow-up-down-line text-xs opacity-50`),u&&(u.className=T.sortColumn===`date`?T.sortDirection===`asc`?`ri-arrow-up-line text-xs text-primary`:`ri-arrow-down-line text-xs text-primary`:`ri-arrow-up-down-line text-xs opacity-50`),J(r?r.value.trim():``)};a&&a.addEventListener(`click`,()=>v(`name`)),o&&o.addEventListener(`click`,()=>v(`size`)),s&&s.addEventListener(`click`,()=>v(`date`)),i&&i.addEventListener(`change`,e=>{if(e.target.checked){let e=T.selectedFileNames.size===0;T.filesList.forEach(e=>T.selectedFileNames.add(e.name)),e&&T.filesList.length}else T.selectedFileNames.clear();q(),J(r?r.value.trim():``)}),p&&p.addEventListener(`click`,Ce),m&&m.addEventListener(`click`,we),h&&h.addEventListener(`click`,()=>{T.selectedFileNames.clear(),q(),J(r?r.value.trim():``)}),g&&g.addEventListener(`click`,Te),_&&_.addEventListener(`click`,()=>{U=null,Se(),A(`Clipboard cleared`,`info`)}),f&&f.addEventListener(`click`,async()=>{let e=T.selectedFileNames.size,t=T.isPublicMode&&!!T.currentPublicUser;if(!T.isUserAdmin&&!t){A(`View only mode: Deletion is only allowed inside public space`,`warning`);return}if(!confirm(`Are you sure you want to delete ${e} selected item(s)?`))return;let n=Array.from(T.selectedFileNames);Ee();let r=0;if(T.isPublicMode&&T.currentPublicUser){let t=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``;for(let e of n){let n=T.filesList.find(t=>t.name===e),i=n?n.type===2||n.isDirectory:!1;try{let n=await(await N(`/api/public/delete`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:T.currentPublicUser.clean_id,path:T.publicCurrentSubpath||`/`,itemName:e,isDir:i,key:t})})).json();n&&n.success&&r++}catch(e){console.error(`Public batch delete error:`,e)}}A(`Deleted ${r} of ${e} items`,`success`),K(),Y(!0);return}for(let e of n){let t=T.filesList.find(t=>t.name===e),n=t?t.type===2||t.isDirectory:!1,i=(T.currentPath.endsWith(`/`)?T.currentPath:T.currentPath+`/`)+e;try{(await(await N(`/api/ftp/delete?path=${encodeURIComponent(i)}&isDir=${n}&fingerprint=${encodeURIComponent(T.currentDeviceFingerprint||``)}`,{method:`DELETE`})).json()).success&&r++}catch(e){console.error(e)}}A(`Deleted ${r} of ${e} items`,`success`),K(),Y(!0),z(!0)});let y=new Map;function b(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`):``}function x(){let e=y.size;e>0?j(`connecting`,e===1?`Creating ZIP archive...`:`Processing ${e} ZIP archives...`,T.currentPath):j(`connected`,`Connected to Storage`,T.currentPath)}async function S(e){if(!Array.isArray(e)||e.length===0)return;let t=document.getElementById(`zipProgressContainer`);if(!t)return;let n=e.length===1?`Zipping "${e[0]}"...`:`Zipping ${e.length} items...`,r=T.isPublicMode&&T.currentPublicUser?T.publicCurrentSubpath||`/`:T.currentPath||`/`,i={path:T.currentPath,files:e};if(T.isPublicMode&&T.currentPublicUser){let t=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``;i={user_id:T.currentPublicUser.clean_id,path:T.publicCurrentSubpath||`/`,files:e,key:t}}try{let a=await(await N(`/api/ftp/create-zip-job`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i)})).json();if(!a.success||!a.jobId){let e=a.error||`Failed to start ZIP process`;A(e,`error`),j(`error`,e);return}let o=a.jobId,s=a.status===`queued`,c=document.createElement(`div`);c.id=`zipJobCard_${o}`,c.className=`alert bg-base-100 border border-base-300 shadow-xl text-xs py-3 px-4 flex flex-col gap-2 z-[160] rounded-2xl animate-fadeIn`,c.innerHTML=`
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-2 min-w-0">
                    <i class="ri-file-zip-line text-warning text-base animate-pulse zip-icon"></i>
                    <span class="font-mono font-bold truncate text-xs text-base-content zip-title">${b(n)}</span>
                    <span class="text-[10px] text-base-content/50 font-mono hidden sm:inline truncate">from ${b(r)}</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="badge ${s?`badge-warning/80`:`badge-warning`} badge-sm font-mono text-[10px] font-bold zip-pct">${s?`Queued`:`0%`}</span>
                    <button class="btn btn-ghost btn-xs text-error gap-1 px-2 font-sans font-medium hover:bg-error/10 zip-cancel-btn" title="Cancel ZIP process">
                      <i class="ri-close-circle-line text-xs"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
                <div class="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                  <div class="zip-bar h-full ${s?`bg-warning/60 animate-pulse`:`bg-warning`} rounded-full transition-all duration-200" style="width: ${s?`100%`:`0%`}"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-base-content/60 font-mono w-full min-h-[18px]">
                  <span class="zip-bytes">${s?`Waiting in line for zipping slot...`:`Preparing archive...`}</span>
                  <div class="flex items-center gap-2 ml-auto">
                    <span class="zip-speed flex items-center">${s?`In Queue`:`Starting...`}</span>
                  </div>
                </div>
            `,t.appendChild(c);let l=c.querySelector(`.zip-pct`),u=c.querySelector(`.zip-bar`),d=c.querySelector(`.zip-bytes`),f=c.querySelector(`.zip-speed`),p=c.querySelector(`.zip-cancel-btn`),m=(e=0)=>{setTimeout(()=>{c.parentNode&&c.parentNode.removeChild(c),y.delete(o),x()},e)};p&&(p.onclick=async()=>{if(!confirm(`Are you sure you want to cancel this ZIP process?`))return;let e=y.get(o);e&&e.pollInterval&&clearInterval(e.pollInterval),l&&(l.textContent=`Cancelled`),u&&(u.className=`zip-bar h-full bg-error/60 rounded-full`),f&&(f.textContent=`Cancelling...`),p.classList.add(`hidden`);try{await N(`/api/ftp/cancel-zip-job`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({jobId:o})})}catch{}A(`ZIP process cancelled`,`info`),m(1200)});let h=setInterval(async()=>{try{let t=await(await N(`/api/ftp/zip-job-status?jobId=${encodeURIComponent(o)}`)).json();if(!t.success){clearInterval(h);let e=t.error||`ZIP status error`;u&&(u.className=`zip-bar h-full bg-error rounded-full`),f&&(f.textContent=e),l&&(l.textContent=`Failed`),p&&p.classList.add(`hidden`),A(e,`error`),m(3e3);return}if(t.status===`queued`){let e=t.queuePosition,n=e>0?`Queued (${e} in line)`:`Queued`,r=t.currentFile||`Waiting in line for zipping slot...`;l&&(l.textContent=n),u&&(u.className=`zip-bar h-full bg-warning/60 rounded-full animate-pulse`,u.style.width=`100%`),d&&(d.classList.remove(`hidden`),d.textContent=r),f&&(f.textContent=`In Queue`)}else if(t.status===`processing`){let n=t.percentage||0,r=t.current||0,i=t.total||e.length;n>=85?(d&&(d.classList.add(`hidden`),d.textContent=``),f&&(f.innerHTML=`<span class="loading loading-spinner loading-xs text-warning inline-block align-middle mr-1"></span> Packing ZIP archive...`),l&&(l.textContent=`Packing...`),u&&(u.className=`zip-bar h-full bg-warning rounded-full transition-all duration-300 animate-pulse`,u.style.width=`100%`)):(d&&(d.classList.remove(`hidden`),d.textContent=`File ${r}/${i}`),f&&(f.textContent=t.currentFile?`Downloading ${t.currentFile}`:`Processing...`),l&&(l.textContent=`${n}%`),u&&(u.className=`zip-bar h-full bg-warning rounded-full transition-all duration-200`,u.style.width=`${n}%`))}else if(t.status===`done`){clearInterval(h),p&&p.classList.add(`hidden`),d&&(d.classList.add(`hidden`),d.textContent=``),l&&(l.textContent=`100%`),u&&(u.className=`zip-bar h-full bg-success rounded-full`,u.style.width=`100%`),f&&(f.textContent=`Ready! Downloading...`);let e=document.createElement(`a`);e.href=t.downloadUrl,e.download=t.zipName||`archive.zip`,document.body.appendChild(e),e.click(),document.body.removeChild(e),m(2500)}else if(t.status===`error`){clearInterval(h),p&&p.classList.add(`hidden`);let e=t.error||`Failed to generate ZIP`;u&&(u.className=`zip-bar h-full bg-error rounded-full`),f&&(f.textContent=e),l&&(l.textContent=`Failed`),A(e,`error`),m(3e3)}}catch(e){clearInterval(h),p&&p.classList.add(`hidden`),A(`ZIP connection drop: ${e.message}`,`error`),m(3e3)}},400);y.set(o,{pollInterval:h,cardElem:c}),x()}catch(e){A(`ZIP job error: ${e.message}`,`error`)}}d&&d.addEventListener(`click`,async()=>{let e=Array.from(T.selectedFileNames);if(e.length===0)return;let t=e.some(e=>{let t=T.filesList.find(t=>t.name===e);return t?t.type===2||t.isDirectory:!1}),n=w();if(Ee(),t)S(e);else if(e.length===1)Me(e[0]);else if(n===`zip`)S(e);else for(let t=0;t<e.length;t++){let n=e[t];Me(n),t<e.length-1&&await new Promise(e=>setTimeout(e,400))}}),window.toggleSelectRow=e=>{T.selectedFileNames.size,T.selectedFileNames.has(e)?(T.selectedFileNames.delete(e),T.selectedFileNames.size):T.selectedFileNames.add(e),q(),J(r?r.value.trim():``)},window.handleRowClick=(e,t,n,r,i)=>{if(!W&&!(e&&e.target&&e.target.closest(`.join, .join-item, button, input[type="checkbox"], a, label`))){if(T.selectedFileNames&&T.selectedFileNames.size>0){window.toggleSelectRow(t);return}if(T.isPublicMode&&T.currentPublicUser){if(n){let e=(T.publicCurrentSubpath.endsWith(`/`)?T.publicCurrentSubpath:T.publicCurrentSubpath+`/`)+t;X(T.currentPublicUser.clean_id,e)}else r===`text`?window.openCodeEditor(t):r===`img`?window.openImagePreview(t):r===`media`&&window.openMediaPreview(t,i);return}if(n){if(T.currentPath===`/public`){X(t,`/`);return}let e=(T.publicModeConfig?.public_folder_name||`public`).trim().toLowerCase();if((t.toLowerCase()===e||t.toLowerCase()===`public`)&&T.currentPath===`/`){if(T.isUserAdmin){Ae(`/public`);return}let e=(T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``).toLowerCase().replace(/^0x/,``);if(e){X(e,`/`);return}}let n=(T.currentPath.endsWith(`/`)?T.currentPath:T.currentPath+`/`)+t;window.navigateTo(n)}else r===`text`?window.openCodeEditor(t):r===`img`?window.openImagePreview(t):r===`media`&&window.openMediaPreview(t,i)}};let C=()=>{for(let[e,t]of y.entries()){t&&t.pollInterval&&clearInterval(t.pollInterval);try{navigator.sendBeacon(`/api/ftp/cancel-zip-job?jobId=${encodeURIComponent(e)}`)}catch{}}};window.addEventListener(`beforeunload`,C),window.addEventListener(`pagehide`,C),window.navigateTo=Ae,window.navigateToPublic=X,window.exitPublicMode=ke,window.goUpDirectory=je,window.downloadFile=Me,window.deleteItem=Ne}var Fe=[],Ie=!1,Le=null;function Re(){let e=document.getElementById(`pendingUploadsBanner`),t=document.getElementById(`pendingBannerTitle`),n=document.getElementById(`pendingBannerSubtitle`),r=document.getElementById(`pendingBannerResumeBtn`);if(!e)return;if(G.size===0){e.classList.add(`hidden`);return}let i=Array.from(G.values()),a=i.length;e.classList.remove(`hidden`),t&&(t.textContent=`${a} Cached Upload${a>1?`s`:``} Ready to Resume`),n&&(n.textContent=i.map(e=>`${e.fileName} (${E(e.size)}) to ${e.targetDir}`).join(`, `)),r&&(r.onclick=async()=>{r.disabled=!0,r.innerHTML=`<span class="loading loading-spinner loading-xs"></span><span>Resuming...</span>`;for(let e of i)await Be(e.uploadId);r.disabled=!1,r.innerHTML=`<i class="ri-play-line text-xs"></i><span>Resume Upload</span>`,Re()})}async function ze(){try{let e=await(await fetch(`/api/ftp/pending-uploads`)).json();if(e.success&&e.pending&&e.pending.length>0){for(let t of e.pending)G.set(t.uploadId,t);Re()}else G.clear(),Re()}catch(e){console.warn(`Failed to check pending uploads:`,e)}}async function Be(e){let t=G.get(e);if(!t)return;Le&&=(clearTimeout(Le),null);let n=document.getElementById(`uploadProgressContainer`),r=document.getElementById(`uploadProgressFilename`),i=document.getElementById(`uploadProgressTargetDir`),a=document.getElementById(`uploadProgressPct`),o=document.getElementById(`uploadProgressBar`),s=document.getElementById(`uploadProgressSpeed`),c=document.getElementById(`uploadRetryBtn`),l=document.getElementById(`uploadCloseBtn`);n&&(n.classList.remove(`hidden`),r&&(r.textContent=t.fileName),i&&(i.textContent=`to ${t.targetDir}`),a&&(a.textContent=`Retrying...`),o&&(o.className=`h-full bg-warning rounded-full transition-all duration-300`,o.style.width=`70%`),s&&(s.textContent=`Streaming cached file to FTP storage...`),c&&c.classList.add(`hidden`),l&&l.classList.add(`hidden`)),j(`connecting`,`Retrying upload "${t.fileName}"...`,t.targetDir);try{let r=null,i=Date.now(),u=document.getElementById(`uploadProgressBytes`);r=setInterval(async()=>{try{let n=await fetch(`/api/ftp/upload-status?uploadId=${encodeURIComponent(e)}`);if(n.ok){let e=await n.json();if(e&&e.success){let n=e.ftpWrittenBytes||0,r=e.totalBytes||t.size,c=r>0?Math.min(99,Math.round(n/r*100)):0,l=(Date.now()-i)/1e3,d=l>0&&n>0?n/l:0;d>0&&`${E(d)}`,u&&(u.classList.add(`hidden`),u.textContent=``),a&&(a.textContent=`${c}%`),o&&(o.className=`h-full bg-primary rounded-full transition-all duration-200`,o.style.width=`${c}%`),s&&(s.innerHTML=`<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...`)}}}catch{}},250);let d=await N(`/api/ftp/retry-upload`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({uploadId:e})});r&&clearInterval(r);let f=await d.json();if(f.success)return G.delete(e),u&&(u.classList.add(`hidden`),u.textContent=``),a&&(a.textContent=`100%`),o&&(o.className=`h-full bg-success rounded-full transition-all duration-300`,o.style.width=`100%`),s&&(s.textContent=`Upload complete!`),j(`connected`,`Uploaded "${t.fileName}"`,t.targetDir),Le=setTimeout(()=>{n&&G.size===0&&!Ie&&n.classList.add(`hidden`)},1500),K(),Y(!0),z(!0),Re(),!0;{r&&clearInterval(r);let t=f.error||`Retry failed`;return A(t,`error`),a&&(a.textContent=`Failed`),o&&(o.className=`h-full bg-error rounded-full transition-all duration-300`),s&&(s.textContent=`Retry failed: ${t}`),c&&(c.classList.remove(`hidden`),c.innerHTML=`<i class="ri-refresh-line text-xs"></i><span>Retry</span>`,c.onclick=()=>Be(e)),l&&(l.classList.remove(`hidden`),l.onclick=()=>{n&&n.classList.add(`hidden`)}),j(`error`,`Upload retry failed: ${t}`),Re(),!1}}catch(t){return A(`Connection error: ${t.message}`,`error`),a&&(a.textContent=`Offline`),o&&(o.className=`h-full bg-error rounded-full`),s&&(s.textContent=`Connection error: ${t.message}`),c&&(c.classList.remove(`hidden`),c.innerHTML=`<i class="ri-refresh-line text-xs"></i><span>Retry</span>`,c.onclick=()=>Be(e)),l&&(l.classList.remove(`hidden`),l.onclick=()=>{n&&n.classList.add(`hidden`)}),j(`error`,`FTP Connection Disconnected`),Re(),!1}}function Ve(e,t,n=1,r=1){let i=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``,a=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||sessionStorage.getItem(`mininxd_master_key`)||``,o=document.getElementById(`uploadProgressContainer`),s=document.getElementById(`uploadProgressFilename`),c=document.getElementById(`uploadProgressTargetDir`),l=document.getElementById(`uploadProgressPct`),u=document.getElementById(`uploadProgressBar`),d=document.getElementById(`uploadProgressBytes`),f=document.getElementById(`uploadProgressSpeed`),p=document.getElementById(`uploadRetryBtn`),m=document.getElementById(`uploadCloseBtn`);return new Promise((h,g)=>{let _=new FormData,v=`/api/ftp/upload`,y=T.isPublicMode||window.location.pathname.startsWith(`/pub`)||typeof t==`string`&&(t.startsWith(`pub_`)||t.startsWith(`/public`)||t.startsWith(`public`)),b=T.currentPublicUser?T.currentPublicUser.clean_id:``;if(!b){let e=window.location.pathname.match(/^\/pub\/([^/]+)/);if(e&&e[1])b=e[1].toLowerCase().replace(/^0x/,``);else if(typeof t==`string`&&t.startsWith(`pub_`)){let e=t.split(`_`);b=e[1]?e[1].toLowerCase().replace(/^0x/,``):``}else b=(T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``).toLowerCase().replace(/^0x/,``)}let x=T.publicCurrentSubpath||`/`;if((!x||x===`/`)&&typeof t==`string`&&t.startsWith(`pub_`)){let e=t.split(`_`);e.length>=3&&(x=e.slice(2).join(`_`))}if(y&&b){v=`/api/public/upload`;let e=sessionStorage.getItem(`mininxd_pub_key_`+b)||``;_.append(`user_id`,b),_.append(`subpath`,x),e&&_.append(`key`,e)}else _.append(`path`,t),i&&_.append(`fingerprint`,i),a&&_.append(`masterkey`,a);let S=`up_${Date.now()}_${Math.random().toString(36).substring(2,9)}`;_.append(`upload_id`,S),_.append(`file`,e);let C=new XMLHttpRequest;if(C.open(`POST`,v,!0),C.setRequestHeader(`x-upload-id`,S),y&&b){let e=sessionStorage.getItem(`mininxd_pub_key_`+b)||``;e&&(C.setRequestHeader(`x-public-key`,e),C.setRequestHeader(`x-pub-key`,e))}else i&&(C.setRequestHeader(`x-device-fingerprint`,i),C.setRequestHeader(`x-fingerprint`,i)),a&&(C.setRequestHeader(`x-master-key`,a),C.setRequestHeader(`x-masterkey`,a));let w=r>1?`[${n}/${r}] `:``;o&&(o.classList.remove(`hidden`),s&&(s.textContent=`${w}${e.name}`),c&&(c.textContent=`to ${t}`),l&&(l.textContent=r>1?`${n}/${r} (0%)`:`0%`),u&&(u.className=`h-full bg-primary rounded-full transition-all duration-200`,u.style.width=`0%`),d&&(d.classList.remove(`hidden`),d.textContent=`0 B / ${E(e.size)}`),f&&(f.textContent=`Starting upload...`),p&&p.classList.add(`hidden`),m&&m.classList.add(`hidden`)),j(`connecting`,`${w}Uploading "${e.name}"...`,t);let D=Date.now(),O=null,k=0,M=()=>{O||=(k=Date.now(),setInterval(async()=>{try{let t=await fetch(`/api/ftp/upload-status?uploadId=${encodeURIComponent(S)}`);if(t.ok){let i=await t.json();if(i&&i.success){let t=i.ftpWrittenBytes||0,a=i.totalBytes||e.size,o=a>0?Math.min(99,Math.round(t/a*100)):0,s=(Date.now()-k)/1e3;s>0&&t>0&&t/s,d&&(d.classList.add(`hidden`),d.textContent=``),l&&(l.textContent=r>1?`${n}/${r} (${o}%)`:`${o}%`),u&&(u.className=`h-full bg-primary rounded-full transition-all duration-200`,u.style.width=`${o}%`),f&&(f.innerHTML=`<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...`)}}}catch{}},250))},N=()=>{O&&=(clearInterval(O),null)};C.upload.onprogress=e=>{if(e.lengthComputable){let t=Math.round(e.loaded/e.total*100),i=E(e.loaded),a=E(e.total),o=(Date.now()-D)/1e3,s=`${E(o>0?e.loaded/o:0)}/s`;t>=100?(d&&(d.classList.add(`hidden`),d.textContent=``),f&&(f.innerHTML=`<span class="loading loading-spinner loading-xs text-primary inline-block align-middle mr-1"></span> Writing to FTP...`),l&&(l.textContent=r>1?`${n}/${r} (Writing)`:`Writing...`),M()):(d&&(d.classList.remove(`hidden`),d.textContent=`${i} / ${a}`),f&&(f.textContent=`Uploading: ${s}`),l&&(l.textContent=r>1?`${n}/${r} (${t}%)`:`${t}%`),u&&(u.className=`h-full bg-primary rounded-full transition-all duration-200`,u.style.width=`${t}%`))}},C.onload=()=>{N();let i=null;try{i=JSON.parse(C.responseText)}catch{}if(C.status>=200&&C.status<300&&i&&i.success)j(`connected`,`Uploaded "${e.name}"`,t),d&&(d.classList.add(`hidden`),d.textContent=``),l&&(l.textContent=r>1?`${n}/${r} (100%)`:`100%`),u&&(u.className=`h-full bg-success rounded-full`,u.style.width=`100%`),f&&(f.textContent=`Complete!`),h(i);else{let n=i?.error||(C.status===403?`View Only Mode: Admin permissions required`:`Upload failed`);A(n,`error`);let r=i?.uploadId||S;C.status===400||C.status===403||C.status===401||i?.retryable===!1||/storage|limit|quota|exceed|full|permission|unauthorized|forbidden|format/i.test(n)?(r&&G.delete(r),p&&p.classList.add(`hidden`)):(r&&G.set(r,{uploadId:r,fileName:e.name,targetDir:t,size:e.size}),p&&r&&(p.classList.remove(`hidden`),p.innerHTML=`<i class="ri-refresh-line text-xs"></i><span>Retry</span>`,p.onclick=()=>Be(r))),d&&(d.classList.add(`hidden`),d.textContent=``),l&&(l.textContent=C.status===403?`Forbidden`:`Failed`),u&&(u.className=`h-full bg-error rounded-full`),f&&(f.textContent=n),m&&(m.classList.remove(`hidden`),m.onclick=()=>{o&&o.classList.add(`hidden`)}),j(`error`,`Upload error: ${n}`),Re(),g(Error(n))}},C.onerror=()=>{N(),A(`Network error while uploading "${e.name}"`,`error`),l&&(l.textContent=`Error`),u&&(u.className=`h-full bg-error rounded-full`),f&&(f.textContent=`Network drop. Check connection.`),m&&(m.classList.remove(`hidden`),m.onclick=()=>{o&&o.classList.add(`hidden`)}),j(`error`,`FTP Connection Offline`),g(Error(`Network error`))},C.onabort=()=>{N()},C.send(_)})}async function He(){if(Fe.length===0){Ie=!1;return}Ie=!0,Le&&=(clearTimeout(Le),null),Fe.length;let e=0,t=0,n=document.getElementById(`uploadProgressContainer`);for(n&&n.classList.remove(`hidden`);Fe.length>0;){let n=Fe.shift(),r=e+t+1,i=r+Fe.length;try{await Ve(n.file,n.targetDir,r,i),e++}catch(e){console.error(`Batch upload failed for ${n.file.name}:`,e),t++}}Ie=!1,e>0&&t===0?j(`connected`,`Completed upload of ${e} file(s)`):e>0&&t>0&&A(`Uploaded ${e} file(s), ${t} failed`,`warning`),K(),Y(!0),z(!0),Re(),G.size===0&&t===0&&(Le=setTimeout(()=>{!Ie&&Fe.length===0&&n&&n.classList.add(`hidden`)},2500))}function Ue(e,t,n){if(!Array.isArray(n)||n.length===0)return!0;let r=String(e||``).trim(),i=r.lastIndexOf(`.`),a=i>=0?r.slice(i+1).toLowerCase():``,o=(t||``).toLowerCase().trim();for(let e of n){if(!e||typeof e!=`string`)continue;let t=e.trim().toLowerCase();if(!t)continue;if(t.endsWith(`/*`)){let e=t.slice(0,-1);if(o&&o.startsWith(e)||e===`image/`&&[`png`,`jpg`,`jpeg`,`gif`,`webp`,`svg`,`ico`,`bmp`,`avif`].includes(a)||e===`video/`&&[`mp4`,`webm`,`ogv`,`mov`,`mkv`,`avi`].includes(a)||e===`audio/`&&[`mp3`,`wav`,`ogg`,`flac`,`m4a`,`aac`].includes(a))return!0;continue}if(t.includes(`/`)){if(o&&o===t)return!0;continue}let n=t.replace(/^\./,``);if(a&&a===n||a&&(n===`jpg`&&a===`jpeg`||n===`jpeg`&&a===`jpg`))return!0}return!1}async function We(e,t){if(!e||e.length===0)return;if(!T.currentDeviceFingerprint)try{T.currentDeviceFingerprint=await _()}catch{}if(!T.isUserAdmin&&!T.isPublicMode){A(`View Only Mode: Admin permissions required to upload files.`,`error`);return}let n=t||(T.isPublicMode?T.publicCurrentSubpath:T.currentPath),r=T.isPublicMode&&T.publicModeConfig?.allowed_format||[],i=Array.from(e);for(let e of i){if(T.isPublicMode){let t=T.publicModeConfig?.max_size||100,n=t*1024*1024,i=e.name.length>10?`${e.name.slice(0,10)}...`:e.name;if(e.size>n){A(`File "${i}" (${E(e.size)}) exceeds maximum allowed limit of ${t} MB`,`error`);continue}if(r.length>0&&!Ue(e.name,e.type,r)){A(`File "${i}" format is not allowed. Allowed: ${r.join(`, `)}`,`warning`);continue}}Fe.push({file:e,targetDir:n})}!Ie&&Fe.length>0&&He()}function Ge(){let e=document.getElementById(`fileUploadInput`),t=document.getElementById(`fabMenu`),n=document.getElementById(`fabPlusIcon`),r=document.getElementById(`dragDropOverlay`);e&&(e.addEventListener(`click`,()=>{let t=T.isPublicMode&&T.publicModeConfig?.allowed_format||[];if(T.isPublicMode&&t.length>0){let n=t.map(e=>{let t=String(e).trim();return t.startsWith(`.`)||t.includes(`/`)?t:`.`+t}).join(`,`);e.setAttribute(`accept`,n)}else e.removeAttribute(`accept`)}),e.addEventListener(`change`,async r=>{let i=r.target.files;!i||i.length===0||(t&&t.classList.add(`hidden`),n&&(n.className=`ri-add-line text-2xl`),await We(i,T.isPublicMode?T.publicCurrentSubpath:T.currentPath),e.value=``)})),window.addEventListener(`dragenter`,e=>{e.preventDefault(),r&&r.classList.remove(`hidden`)}),r&&(r.addEventListener(`dragover`,e=>{e.preventDefault()}),r.addEventListener(`dragleave`,e=>{e.relatedTarget===null&&r.classList.add(`hidden`)})),window.addEventListener(`drop`,async e=>{if(e.preventDefault(),r&&r.classList.add(`hidden`),e.dataTransfer&&e.dataTransfer.files.length>0){let t=T.isPublicMode?T.publicCurrentSubpath:T.currentPath;await We(e.dataTransfer.files,t)}}),window.handleFolderDragOver=(e,t)=>{e.preventDefault(),e.stopPropagation(),t&&t.classList.add(`bg-primary/20`,`ring-2`,`ring-primary`,`ring-inset`)},window.handleFolderDragLeave=(e,t)=>{e.preventDefault(),e.stopPropagation(),t&&t.classList.remove(`bg-primary/20`,`ring-2`,`ring-primary`,`ring-inset`)},window.handleFolderDrop=async(e,t,n)=>{if(e.preventDefault(),e.stopPropagation(),n&&n.classList.remove(`bg-primary/20`,`ring-2`,`ring-primary`,`ring-inset`),r&&r.classList.add(`hidden`),e.dataTransfer&&e.dataTransfer.files.length>0){let n=T.isPublicMode?T.publicCurrentSubpath:T.currentPath,r=(n.endsWith(`/`)?n:n+`/`)+t;A(`Uploading ${e.dataTransfer.files.length} file(s) into "${t}"...`,`info`),await We(e.dataTransfer.files,r)}}}var Ke=window;function qe(e,t,n={}){let r={tab:`	`,indentOn:/[({\[]$/,moveToNewLine:/^[)}\]]/,spellcheck:!1,catchTab:!0,preserveIdent:!0,addClosing:!0,history:!0,window:Ke,autoclose:{open:`([{'"`,close:`)]}'"`},...n},i=r.window,a=i.document,o=[],s=[],c=-1,l=!1,u=()=>void 0,d;e.setAttribute(`contenteditable`,`plaintext-only`),e.setAttribute(`spellcheck`,r.spellcheck?`true`:`false`),e.style.outline=`none`,e.style.overflowWrap=`break-word`,e.style.overflowY=`auto`,e.style.whiteSpace=`pre-wrap`;let f=(e,n)=>{t(e,n)},p=i.navigator.userAgent.match(/Firefox\/([0-9]+)\./),m=p?parseInt(p[1]):0,h=!1;(e.contentEditable!==`plaintext-only`||m>=136)&&(h=!0),h&&e.setAttribute(`contenteditable`,`true`);let g=z(()=>{let t=x();f(e,t),S(t)},30),_=!1,v=e=>!I(e)&&!L(e)&&e.key!==`Meta`&&e.key!==`Control`&&e.key!==`Alt`&&!e.key.startsWith(`Arrow`),y=z(e=>{v(e)&&(j(),_=!1)},300),b=(t,n)=>{o.push([t,n]),e.addEventListener(t,n)};b(`keydown`,e=>{e.defaultPrevented||(d=B(),r.preserveIdent?E(e):D(e),r.catchTab&&k(e),r.addClosing&&O(e),r.history&&(A(e),v(e)&&!_&&(j(),_=!0)),h&&!ee(e)&&S(x()))}),b(`keyup`,e=>{e.defaultPrevented||e.isComposing||(d!==B()&&g(),y(e),u(B()))}),b(`focus`,e=>{l=!0}),b(`blur`,e=>{l=!1}),b(`paste`,e=>{j(),M(e),j(),u(B())}),b(`cut`,e=>{j(),N(e),j(),u(B())});function x(){let t=H(),n={start:0,end:0,dir:void 0},{anchorNode:r,anchorOffset:i,focusNode:o,focusOffset:s}=t;if(!r||!o)throw`error1`;if(r===e&&o===e)return n.start=i>0&&e.textContent?e.textContent.length:0,n.end=s>0&&e.textContent?e.textContent.length:0,n.dir=s>=i?`->`:`<-`,n;if(r.nodeType===Node.ELEMENT_NODE){let e=a.createTextNode(``);r.insertBefore(e,r.childNodes[i]),r=e,i=0}if(o.nodeType===Node.ELEMENT_NODE){let e=a.createTextNode(``);o.insertBefore(e,o.childNodes[s]),o=e,s=0}return P(e,e=>{if(e===r&&e===o)return n.start+=i,n.end+=s,n.dir=i<=s?`->`:`<-`,`stop`;if(e===r){if(n.start+=i,!n.dir)n.dir=`->`;else return`stop`}else if(e===o){if(n.end+=s,!n.dir)n.dir=`<-`;else return`stop`}e.nodeType===Node.TEXT_NODE&&(n.dir!=`->`&&(n.start+=e.nodeValue.length),n.dir!=`<-`&&(n.end+=e.nodeValue.length))}),e.normalize(),n}function S(t){let n=H(),r,i=0,o,s=0;if(t.dir||=`->`,t.start<0&&(t.start=0),t.end<0&&(t.end=0),t.dir==`<-`){let{start:e,end:n}=t;t.start=n,t.end=e}let c=0;P(e,e=>{if(e.nodeType!==Node.TEXT_NODE)return;let n=(e.nodeValue||``).length;if(c+n>t.start&&(r||(r=e,i=t.start-c),c+n>t.end))return o=e,s=t.end-c,`stop`;c+=n}),r||(r=e,i=e.childNodes.length),o||(o=e,s=e.childNodes.length),t.dir==`<-`&&([r,i,o,s]=[o,s,r,i]);{let e=C(r);if(e){let t=a.createTextNode(``);e.parentNode?.insertBefore(t,e),r=t,i=0}let t=C(o);if(t){let e=a.createTextNode(``);t.parentNode?.insertBefore(e,t),o=e,s=0}}n.setBaseAndExtent(r,i,o,s),e.normalize()}function C(t){for(;t&&t!==e;){if(t.nodeType===Node.ELEMENT_NODE){let e=t;if(e.getAttribute(`contenteditable`)==`false`)return e}t=t.parentNode}}function w(){let t=H().getRangeAt(0),n=a.createRange();return n.selectNodeContents(e),n.setEnd(t.startContainer,t.startOffset),n.toString()}function T(){let t=H().getRangeAt(0),n=a.createRange();return n.selectNodeContents(e),n.setStart(t.endContainer,t.endOffset),n.toString()}function E(e){if(e.key===`Enter`){let t=w(),n=T(),[i]=ne(t),a=i;if(r.indentOn.test(t)&&(a+=r.tab),a.length>0?(V(e),e.stopPropagation(),te(`
`+a)):D(e),a!==i&&r.moveToNewLine.test(n)){let e=x();te(`
`+i),S(e)}}}function D(e){if(h&&e.key===`Enter`){if(V(e),e.stopPropagation(),T()==``){te(`
 `);let e=x();e.start=--e.end,S(e)}else te(`
`)}}function O(e){let t=r.autoclose.open,n=r.autoclose.close;if(t.includes(e.key)){V(e);let r=x(),i=r.start==r.end?``:H().toString();te(e.key+i+(n[t.indexOf(e.key)]??``)),r.start++,r.end++,S(r)}}function k(e){if(e.key===`Tab`){if(V(e),e.shiftKey){let[e,t]=ne(w());if(e.length>0){let n=x(),i=Math.min(r.tab.length,e.length);S({start:t,end:t+i}),a.execCommand(`delete`),n.start-=i,n.end-=i,S(n)}}else te(r.tab)}}function A(t){if(I(t)){V(t),c--;let n=s[c];n&&(e.innerHTML=n.html,S(n.pos)),c<0&&(c=0)}if(L(t)){V(t),c++;let n=s[c];n&&(e.innerHTML=n.html,S(n.pos)),c>=s.length&&c--}}function j(){if(!l)return;let t=e.innerHTML,n=x(),r=s[c];r&&r.html===t&&r.pos.start===n.start&&r.pos.end===n.end||(c++,s[c]={html:t,pos:n},s.splice(c+1),c>300&&(c=300,s.splice(0,1)))}function M(t){if(t.defaultPrevented)return;V(t);let n=(t.originalEvent??t).clipboardData.getData(`text/plain`).replace(/\r\n?/g,`
`),r=x();te(n),f(e),S({start:Math.min(r.start,r.end)+n.length,end:Math.min(r.start,r.end)+n.length,dir:`<-`})}function N(t){let n=x(),r=H();(t.originalEvent??t).clipboardData.setData(`text/plain`,r.toString()),a.execCommand(`delete`),f(e),S({start:Math.min(n.start,n.end),end:Math.min(n.start,n.end),dir:`<-`}),V(t)}function P(e,t){let n=[];e.firstChild&&n.push(e.firstChild);let r=n.pop();for(;r&&t(r)!==`stop`;)r.nextSibling&&n.push(r.nextSibling),r.firstChild&&n.push(r.firstChild),r=n.pop()}function F(e){return e.metaKey||e.ctrlKey}function I(e){return F(e)&&!e.shiftKey&&R(e)===`Z`}function L(e){return F(e)&&e.shiftKey&&R(e)===`Z`}function ee(e){return F(e)&&R(e)===`C`}function R(e){let t=e.key||e.keyCode||e.which;if(t)return(typeof t==`string`?t:String.fromCharCode(t)).toUpperCase()}function te(e){e=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`),a.execCommand(`insertHTML`,!1,e)}function z(e,t){let n=0;return(...r)=>{clearTimeout(n),n=i.setTimeout(()=>e(...r),t)}}function ne(e){let t=e.length-1;for(;t>=0&&e[t]!==`
`;)t--;t++;let n=t;for(;n<e.length&&/[ \t]/.test(e[n]);)n++;return[e.substring(t,n)||``,t,n]}function B(){return e.textContent||``}function V(e){e.preventDefault()}function H(){return e.getRootNode().getSelection()}return{updateOptions(e){Object.assign(r,e)},updateCode(t,n=!0){e.textContent=t,f(e),n&&u(t)},onUpdate(e){u=e},toString:B,save:x,restore:S,recordHistory:j,destroy(){for(let[t,n]of o)e.removeEventListener(t,n)}}}var Z=c(o(((e,t)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,r={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/\u00a0/g,` `)},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++n}),e.__id},clone:function e(t,n){n||={};var r,a;switch(i.util.type(t)){case`Object`:if(a=i.util.objId(t),n[a])return n[a];for(var o in r={},n[a]=r,t)t.hasOwnProperty(o)&&(r[o]=e(t[o],n));return r;case`Array`:return a=i.util.objId(t),n[a]?n[a]:(r=[],n[a]=r,t.forEach(function(t,i){r[i]=e(t,n)}),r);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return`none`},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,`gi`),``),e.classList.add(`language-`+n)},currentScript:function(){if(typeof document>`u`)return null;if(document.currentScript&&document.currentScript.tagName===`SCRIPT`)return document.currentScript;try{throw Error()}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var t=document.getElementsByTagName(`script`);for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var r=`no-`+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(r))return!1;e=e.parentElement}return!!n}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,t){var n=i.util.clone(i.languages[e]);for(var r in t)n[r]=t[r];return n},insertBefore:function(e,t,n,r){r||=i.languages;var a=r[e],o={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var c in n)n.hasOwnProperty(c)&&(o[c]=n[c]);n.hasOwnProperty(s)||(o[s]=a[s])}var l=r[e];return r[e]=o,i.languages.DFS(i.languages,function(t,n){n===l&&t!=e&&(this[t]=o)}),o},DFS:function e(t,n,r,a){a||={};var o=i.util.objId;for(var s in t)if(t.hasOwnProperty(s)){n.call(t,s,t[s],r||s);var c=t[s],l=i.util.type(c);l===`Object`&&!a[o(c)]?(a[o(c)]=!0,e(c,n,null,a)):l===`Array`&&!a[o(c)]&&(a[o(c)]=!0,e(c,n,s,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var r={callback:n,container:e,selector:`code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code`};i.hooks.run(`before-highlightall`,r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),i.hooks.run(`before-all-elements-highlight`,r);for(var a=0,o;o=r.elements[a++];)i.highlightElement(o,t===!0,r.callback)},highlightElement:function(t,n,r){var a=i.util.getLanguage(t),o=i.languages[a];i.util.setLanguage(t,a);var s=t.parentElement;s&&s.nodeName.toLowerCase()===`pre`&&i.util.setLanguage(s,a);var c={element:t,language:a,grammar:o,code:t.textContent};function l(e){c.highlightedCode=e,i.hooks.run(`before-insert`,c),c.element.innerHTML=c.highlightedCode,i.hooks.run(`after-highlight`,c),i.hooks.run(`complete`,c),r&&r.call(c.element)}if(i.hooks.run(`before-sanity-check`,c),s=c.element.parentElement,s&&s.nodeName.toLowerCase()===`pre`&&!s.hasAttribute(`tabindex`)&&s.setAttribute(`tabindex`,`0`),!c.code){i.hooks.run(`complete`,c),r&&r.call(c.element);return}if(i.hooks.run(`before-highlight`,c),!c.grammar){l(i.util.encode(c.code));return}if(n&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){l(e.data)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else l(i.highlight(c.code,c.grammar,c.language))},highlight:function(e,t,n){var r={code:e,grammar:t,language:n};if(i.hooks.run(`before-tokenize`,r),!r.grammar)throw Error(`The language "`+r.language+`" has no grammar.`);return r.tokens=i.tokenize(r.code,r.grammar),i.hooks.run(`after-tokenize`,r),a.stringify(i.util.encode(r.tokens),r.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var r in n)t[r]=n[r];delete t.rest}var i=new c;return l(i,i.head,e),s(e,i,t,i.head,0),d(i)},hooks:{all:{},add:function(e,t){var n=i.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=i.hooks.all[e];if(!(!n||!n.length))for(var r=0,a;a=n[r++];)a(t)}},Token:a};e.Prism=i;function a(e,t,n,r){this.type=e,this.content=t,this.alias=n,this.length=(r||``).length|0}a.stringify=function e(t,n){if(typeof t==`string`)return t;if(Array.isArray(t)){var r=``;return t.forEach(function(t){r+=e(t,n)}),r}var a={type:t.type,content:e(t.content,n),tag:`span`,classes:[`token`,t.type],attributes:{},language:n},o=t.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(a.classes,o):a.classes.push(o)),i.hooks.run(`wrap`,a);var s=``;for(var c in a.attributes)s+=` `+c+`="`+(a.attributes[c]||``).replace(/"/g,`&quot;`)+`"`;return`<`+a.tag+` class="`+a.classes.join(` `)+`"`+s+`>`+a.content+`</`+a.tag+`>`};function o(e,t,n,r){e.lastIndex=t;var i=e.exec(n);if(i&&r&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function s(e,t,n,r,c,d){for(var f in n)if(!(!n.hasOwnProperty(f)||!n[f])){var p=n[f];p=Array.isArray(p)?p:[p];for(var m=0;m<p.length;++m){if(d&&d.cause==f+`,`+m)return;var h=p[m],g=h.inside,_=!!h.lookbehind,v=!!h.greedy,y=h.alias;if(v&&!h.pattern.global){var b=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,b+`g`)}for(var x=h.pattern||h,S=r.next,C=c;S!==t.tail&&!(d&&C>=d.reach);C+=S.value.length,S=S.next){var w=S.value;if(t.length>e.length)return;if(!(w instanceof a)){var T=1,E;if(v){if(E=o(x,C,e,_),!E||E.index>=e.length)break;var D=E.index,O=E.index+E[0].length,k=C;for(k+=S.value.length;D>=k;)S=S.next,k+=S.value.length;if(k-=S.value.length,C=k,S.value instanceof a)continue;for(var A=S;A!==t.tail&&(k<O||typeof A.value==`string`);A=A.next)T++,k+=A.value.length;T--,w=e.slice(C,k),E.index-=C}else if(E=o(x,0,w,_),!E)continue;var D=E.index,j=E[0],M=w.slice(0,D),N=w.slice(D+j.length),P=C+w.length;d&&P>d.reach&&(d.reach=P);var F=S.prev;M&&(F=l(t,F,M),C+=M.length),u(t,F,T);var I=new a(f,g?i.tokenize(j,g):j,y,j);if(S=l(t,F,I),N&&l(t,S,N),T>1){var L={cause:f+`,`+m,reach:P};s(e,t,n,S.prev,C,L),d&&L.reach>d.reach&&(d.reach=L.reach)}}}}}}function c(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function l(e,t,n){var r=t.next,i={value:n,prev:t,next:r};return t.next=i,r.prev=i,e.length++,i}function u(e,t,n){for(var r=t.next,i=0;i<n&&r!==e.tail;i++)r=r.next;t.next=r,r.prev=t,e.length-=i}function d(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}if(!e.document)return e.addEventListener&&(i.disableWorkerMessageHandler||e.addEventListener(`message`,function(t){var n=JSON.parse(t.data),r=n.language,a=n.code,o=n.immediateClose;e.postMessage(i.highlight(a,i.languages[r],r)),o&&e.close()},!1)),i;var f=i.util.currentScript();f&&(i.filename=f.src,f.hasAttribute(`data-manual`)&&(i.manual=!0));function p(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m===`loading`||m===`interactive`&&f&&f.defer?document.addEventListener(`DOMContentLoaded`,p):window.requestAnimationFrame?window.requestAnimationFrame(p):window.setTimeout(p,16)}return i}(typeof window<`u`?window:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?self:{});t!==void 0&&t.exports&&(t.exports=n),typeof global<`u`&&(global.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside[`attr-value`].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside[`internal-subset`].inside=n.languages.markup,n.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(e,t){var r={};r[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i[`language-`+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:i},n.languages.insertBefore(`markup`,`cdata`,a)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(e,t){n.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend(`markup`,{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend(`clike`,{"class-name":[n.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),n.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),n.languages.markup&&(n.languages.markup.tag.addInlined(`script`,`javascript`),n.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),n.languages.js=n.languages.javascript,(function(){if(n===void 0||typeof document>`u`)return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e=`Loading…`,t=function(e,t){return`✖ Error `+e+` while fetching file: `+t},r=`✖ Error: File does not exist or is empty`,i={js:`javascript`,py:`python`,rb:`ruby`,ps1:`powershell`,psm1:`powershell`,sh:`bash`,bat:`batch`,h:`c`,tex:`latex`},a=`data-src-status`,o=`loading`,s=`loaded`,c=`failed`,l=`pre[data-src]:not([`+a+`="`+s+`"]):not([`+a+`="`+o+`"])`;function u(e,n,i){var a=new XMLHttpRequest;a.open(`GET`,e,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?n(a.responseText):a.status>=400?i(t(a.status,a.statusText)):i(r))},a.send(null)}function d(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||``);if(t){var n=Number(t[1]),r=t[2],i=t[3];return r?i?[n,Number(i)]:[n,void 0]:[n,n]}}n.hooks.add(`before-highlightall`,function(e){e.selector+=`, `+l}),n.hooks.add(`before-sanity-check`,function(t){var r=t.element;if(r.matches(l)){t.code=``,r.setAttribute(a,o);var f=r.appendChild(document.createElement(`CODE`));f.textContent=e;var p=r.getAttribute(`data-src`),m=t.language;if(m===`none`){var h=(/\.(\w+)$/.exec(p)||[,`none`])[1];m=i[h]||h}n.util.setLanguage(f,m),n.util.setLanguage(r,m);var g=n.plugins.autoloader;g&&g.loadLanguages(m),u(p,function(e){r.setAttribute(a,s);var t=d(r.getAttribute(`data-range`));if(t){var i=e.split(/\r\n?|\n/g),o=t[0],c=t[1]==null?i.length:t[1];o<0&&(o+=i.length),o=Math.max(0,Math.min(o-1,i.length)),c<0&&(c+=i.length),c=Math.max(0,Math.min(c,i.length)),e=i.slice(o,c).join(`
`),r.hasAttribute(`data-start`)||r.setAttribute(`data-start`,String(o+1))}f.textContent=e,n.highlightElement(f)},function(e){r.setAttribute(a,c),f.textContent=e})}}),n.plugins.fileHighlight={highlight:function(e){for(var t=(e||document).querySelectorAll(l),r=0,i;i=t[r++];)n.highlightElement(i)}};var f=!1;n.fileHighlight=function(){f||=(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()}))(),1);Prism.languages.javascript=Prism.languages.extend(`clike`,{"class-name":[Prism.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),Prism.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined(`script`,`javascript`),Prism.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),Prism.languages.js=Prism.languages.javascript,Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:`keyword`}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(Prism),(function(e){var t=`\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b`,n={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:`punctuation`,inside:null},r={bash:n,environment:{pattern:RegExp(`\\$`+t),alias:`constant`},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp(`(\\{)`+t),lookbehind:!0,alias:`constant`}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:`important`},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:`function`},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:`function`}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:`variable`,lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp(`(^|[\\s;|&]|[<>]\\()`+t),lookbehind:!0,alias:`constant`}},alias:`variable`,lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:`variable`,lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:r},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:n}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:r},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:r.entity}}],environment:{pattern:RegExp(`\\$?`+t),alias:`constant`},variable:r.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:`class-name`},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:`important`},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:`important`}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},n.inside=e.languages.bash;for(var i=[`comment`,`function-name`,`for-or-select`,`assign-left`,`parameter`,`string`,`environment`,`function`,`keyword`,`builtin`,`boolean`,`file-descriptor`,`operator`,`punctuation`,`number`],a=r.variable[1].inside,o=0;o<i.length;o++)a[i[o]]=e.languages.bash[i[o]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism),Prism.languages.python={comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0,greedy:!0},"string-interpolation":{pattern:/(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,greedy:!0,inside:{interpolation:{pattern:/((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,lookbehind:!0,inside:{"format-spec":{pattern:/(:)[^:(){}]+(?=\}$)/,lookbehind:!0},"conversion-option":{pattern:/![sra](?=[:}]$)/,alias:`punctuation`},rest:null}},string:/[\s\S]+/}},"triple-quoted-string":{pattern:/(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,greedy:!0,alias:`string`},string:{pattern:/(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,greedy:!0},function:{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)\w+/i,lookbehind:!0},decorator:{pattern:/(^[\t ]*)@\w+(?:\.\w+)*/m,lookbehind:!0,alias:[`annotation`,`punctuation`],inside:{punctuation:/\./}},keyword:/\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,builtin:/\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,boolean:/\b(?:False|None|True)\b/,number:/\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,operator:/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,punctuation:/[{}[\];(),.:]/},Prism.languages.python[`string-interpolation`].inside.interpolation.inside.rest=Prism.languages.python,Prism.languages.py=Prism.languages.python,(function(e){var t=/[*&][^\s[\]{},]+/,n=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r=`(?:`+n.source+`(?:[ 	]+`+t.source+`)?|`+t.source+`(?:[ 	]+`+n.source+`)?)`,i=`(?:[^\\s\\x00-\\x08\\x0e-\\x1f!"#%&'*,\\-:>?@[\\]\`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \\t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*`.replace(/<PLAIN>/g,function(){return`[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]`}),a=`"(?:[^"\\\\\\r\\n]|\\\\.)*"|'(?:[^'\\\\\\r\\n]|\\\\.)*'`;function o(e,t){t=(t||``).replace(/m/g,``)+`m`;var n=`([:\\-,[{]\\s*(?:\\s<<prop>>[ \\t]+)?)(?:<<value>>)(?=[ \\t]*(?:$|,|\\]|\\}|(?:[\\r\\n]\\s*)?#))`.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return e});return RegExp(n,t)}e.languages.yaml={scalar:{pattern:RegExp(`([\\-:]\\s*(?:\\s<<prop>>[ \\t]+)?[|>])[ \\t]*(?:((?:\\r?\\n|\\r)[ \\t]+)\\S[^\\r\\n]*(?:\\2[^\\r\\n]+)*)`.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:`string`},comment:/#.*/,key:{pattern:RegExp(`((?:^|[:\\-,[{\\r\\n?])[ \\t]*(?:<<prop>>[ \\t]+)?)<<key>>(?=\\s*:\\s)`.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return`(?:`+i+`|`+a+`)`})),lookbehind:!0,greedy:!0,alias:`atrule`},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:`important`},datetime:{pattern:o(`\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \\t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \\t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?`),lookbehind:!0,alias:`number`},boolean:{pattern:o(`false|true`,`i`),lookbehind:!0,alias:`important`},null:{pattern:o(`null|~`,`i`),lookbehind:!0,alias:`important`},string:{pattern:o(a),lookbehind:!0,greedy:!0},number:{pattern:o(`[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)`,`i`),lookbehind:!0},tag:n,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),(function(e){function t(e){return e=e.replace(/<inner>/g,function(){return`(?:\\\\.|[^\\\\\\n\\r]|(?:\\n|\\r\\n?)(?![\\r\\n]))`}),RegExp(`((?:^|[^\\\\])(?:\\\\{2})*)(?:`+e+`)`)}var n="(?:\\\\.|``(?:[^`\\r\\n]|`(?!`))+``|`[^`\\r\\n]+`|[^\\\\|\\r\\n`])+",r=`\\|?__(?:\\|__)+\\|?(?:(?:\\n|\\r\\n?)|(?![\\s\\S]))`.replace(/__/g,function(){return n}),i=`\\|?[ \\t]*:?-{3,}:?[ \\t]*(?:\\|[ \\t]*:?-{3,}:?[ \\t]*)+\\|?(?:\\n|\\r\\n?)`;e.languages.markdown=e.languages.extend(`markup`,{}),e.languages.insertBefore(`markdown`,`prolog`,{"front-matter-block":{pattern:/(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,lookbehind:!0,greedy:!0,inside:{punctuation:/^---|---$/,"front-matter":{pattern:/\S+(?:\s+\S+)*/,alias:[`yaml`,`language-yaml`],inside:e.languages.yaml}}},blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:`punctuation`},table:{pattern:RegExp(`^`+r+i+`(?:`+r+`)*`,`m`),inside:{"table-data-rows":{pattern:RegExp(`^(`+r+i+`)(?:`+r+`)*$`),lookbehind:!0,inside:{"table-data":{pattern:RegExp(n),inside:e.languages.markdown},punctuation:/\|/}},"table-line":{pattern:RegExp(`^(`+r+`)`+i+`$`),lookbehind:!0,inside:{punctuation:/\||:?-{3,}:?/}},"table-header-row":{pattern:RegExp(`^`+r+`$`),inside:{"table-header":{pattern:RegExp(n),alias:`important`,inside:e.languages.markdown},punctuation:/\|/}}}},code:[{pattern:/((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,lookbehind:!0,alias:`keyword`},{pattern:/^```[\s\S]*?^```$/m,greedy:!0,inside:{"code-block":{pattern:/^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,lookbehind:!0},"code-language":{pattern:/^(```).+/,lookbehind:!0},punctuation:/```/}}],title:[{pattern:/\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,alias:`important`,inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#.+/m,lookbehind:!0,alias:`important`,inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:`punctuation`},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:`punctuation`},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:`url`},bold:{pattern:t(`\\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\\b|\\*\\*(?:(?!\\*)<inner>|\\*(?:(?!\\*)<inner>)+\\*)+\\*\\*`),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^..)[\s\S]+(?=..$)/,lookbehind:!0,inside:{}},punctuation:/\*\*|__/}},italic:{pattern:t(`\\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\\b|\\*(?:(?!\\*)<inner>|\\*\\*(?:(?!\\*)<inner>)+\\*\\*)+\\*`),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^.)[\s\S]+(?=.$)/,lookbehind:!0,inside:{}},punctuation:/[*_]/}},strike:{pattern:t(`(~~?)(?:(?!~)<inner>)+\\2`),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^~~?)[\s\S]+(?=\1$)/,lookbehind:!0,inside:{}},punctuation:/~~?/}},"code-snippet":{pattern:/(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,lookbehind:!0,greedy:!0,alias:[`code`,`keyword`]},url:{pattern:t(`!?\\[(?:(?!\\])<inner>)+\\](?:\\([^\\s)]+(?:[\\t ]+"(?:\\\\.|[^"\\\\])*")?\\)|[ \\t]?\\[(?:(?!\\])<inner>)+\\])`),lookbehind:!0,greedy:!0,inside:{operator:/^!/,content:{pattern:/(^\[)[^\]]+(?=\])/,lookbehind:!0,inside:{}},variable:{pattern:/(^\][ \t]?\[)[^\]]+(?=\]$)/,lookbehind:!0},url:{pattern:/(^\]\()[^\s)]+/,lookbehind:!0},string:{pattern:/(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,lookbehind:!0}}}}),[`url`,`bold`,`italic`,`strike`].forEach(function(t){[`url`,`bold`,`italic`,`strike`,`code-snippet`].forEach(function(n){t!==n&&(e.languages.markdown[t].inside.content.inside[n]=e.languages.markdown[n])})}),e.hooks.add(`after-tokenize`,function(e){if(e.language!==`markdown`&&e.language!==`md`)return;function t(e){if(!(!e||typeof e==`string`))for(var n=0,r=e.length;n<r;n++){var i=e[n];if(i.type!==`code`){t(i.content);continue}var a=i.content[1],o=i.content[3];if(a&&o&&a.type===`code-language`&&o.type===`code-block`&&typeof a.content==`string`){var s=a.content.replace(/\b#/g,`sharp`).replace(/\b\+\+/g,`pp`);s=(/[a-z][\w-]*/i.exec(s)||[``])[0].toLowerCase();var c=`language-`+s;o.alias?typeof o.alias==`string`?o.alias=[o.alias,c]:o.alias.push(c):o.alias=[c]}}}t(e.tokens)}),e.hooks.add(`wrap`,function(t){if(t.type===`code-block`){for(var n=``,r=0,i=t.classes.length;r<i;r++){var a=t.classes[r],o=/language-(.+)/.exec(a);if(o){n=o[1];break}}var s=e.languages[n];if(s)t.content=e.highlight(c(t.content),s,n);else if(n&&n!==`none`&&e.plugins.autoloader){var l=`md-`+new Date().valueOf()+`-`+Math.floor(Math.random()*0x2386f26fc10000);t.attributes.id=l,e.plugins.autoloader.loadLanguages(n,function(){var t=document.getElementById(l);t&&(t.innerHTML=e.highlight(t.textContent,e.languages[n],n))})}}});var a=RegExp(e.languages.markup.tag.pattern.source,`gi`),o={amp:`&`,lt:`<`,gt:`>`,quot:`"`},s=String.fromCodePoint||String.fromCharCode;function c(e){var t=e.replace(a,``);return t=t.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi,function(e,t){return t=t.toLowerCase(),t[0]===`#`?s(t[1]===`x`?parseInt(t.slice(2),16):Number(t.slice(1))):o[t]||e}),t}e.languages.md=e.languages.markdown})(Prism),Prism.languages.ini={comment:{pattern:/(^[ \f\t\v]*)[#;][^\n\r]*/m,lookbehind:!0},section:{pattern:/(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,lookbehind:!0,inside:{"section-name":{pattern:/(^\[[ \f\t\v]*)[^ \f\t\v\]]+(?:[ \f\t\v]+[^ \f\t\v\]]+)*/,lookbehind:!0,alias:`selector`},punctuation:/\[|\]/}},key:{pattern:/(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,lookbehind:!0,alias:`attr-name`},value:{pattern:/(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,lookbehind:!0,alias:`attr-value`,inside:{"inner-value":{pattern:/^("|').+(?=\1$)/,lookbehind:!0}}},punctuation:/=/};function Je(e){switch(e){case`js`:case`mjs`:case`cjs`:case`ts`:return{grammar:Z.default.languages.javascript,name:`JAVASCRIPT`};case`json`:return{grammar:Z.default.languages.json,name:`JSON`};case`css`:return{grammar:Z.default.languages.css,name:`CSS`};case`sh`:case`bash`:case`zsh`:return{grammar:Z.default.languages.bash,name:`BASH`};case`py`:return{grammar:Z.default.languages.python,name:`PYTHON`};case`yaml`:case`yml`:return{grammar:Z.default.languages.yaml,name:`YAML`};case`md`:return{grammar:Z.default.languages.markdown,name:`MARKDOWN`};case`ini`:case`cfg`:case`conf`:return{grammar:Z.default.languages.ini,name:`CONFIG`};case`html`:case`xml`:return{grammar:Z.default.languages.html||Z.default.languages.markup,name:`HTML`};default:return{grammar:null,name:`TEXT`}}}function Ye(e,t){let n=document.getElementById(`codeJarContainer`),r=document.getElementById(`editorSyntaxBadge`);if(!n)return;if(T.jarInstance)try{T.jarInstance.destroy()}catch{}let{grammar:i,name:a}=Je(t);r&&(r.textContent=a),T.jarInstance=qe(n,e=>{let n=e.textContent||``;e.innerHTML=i?Z.default.highlight(n,i,t):Z.default.util.encode(n)},{tab:`  `}),T.jarInstance.updateCode(e||``)}async function Xe(e){let t=document.getElementById(`draculaEditorModal`),n=document.getElementById(`editorFilenameBadge`),r=document.getElementById(`editorFilePathDisplay`),i=document.getElementById(`editorStatusText`),a=document.getElementById(`saveEditorFileBtn`),o=document.getElementById(`codeJarContainer`),s=T.isPublicMode?T.publicCurrentSubpath:T.currentPath,c=(s.endsWith(`/`)?s:s+`/`)+e;T.activeEditorPath=c,n&&(n.textContent=e),r&&(r.textContent=c),i&&(i.textContent=`Loading...`);let l=T.isUserAdmin||T.isPublicMode;a&&(l?a.classList.remove(`hidden`):a.classList.add(`hidden`)),t&&t.showModal();let u=`/api/ftp/read-file?path=${encodeURIComponent(c)}`;if(T.isPublicMode&&T.currentPublicUser){let e=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,t=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||``,n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``,r=`user_id=${encodeURIComponent(T.currentPublicUser.clean_id)}&path=${encodeURIComponent(c)}`;e&&(r+=`&key=${encodeURIComponent(e)}`),t&&(r+=`&masterkey=${encodeURIComponent(t)}`),n&&(r+=`&fingerprint=${encodeURIComponent(n)}`),u=`/api/public/read-file?${r}`}try{let t=await(await N(u)).json();if(t&&t.success){let n=e.split(`.`).pop().toLowerCase();Ye(t.content||``,n),l?o&&o.setAttribute(`contenteditable`,`plaintext-only`):o&&o.setAttribute(`contenteditable`,`false`),i&&(i.textContent=`Ready`)}else i&&(i.textContent=`Error: ${t?.error||`Failed to read file`}`),Ye(`// Error loading file: ${t?.error||`Unknown error`}`,`txt`)}catch(e){i&&(i.textContent=`Network error`),Ye(`// Network error: ${e.message}`,`txt`)}}async function Ze(e){let t=document.getElementById(`editorStatusText`),n=document.getElementById(`codeJarContainer`);if(!T.activeEditorPath){A(`No active file selected to save`,`warning`);return}if(!(T.isUserAdmin||T.isPublicMode)){A(`View Only Mode: Permissions required to edit or save files.`,`error`);return}let r=``;try{T.jarInstance&&typeof T.jarInstance.toString==`function`?r=T.jarInstance.toString():n&&(r=n.textContent||``)}catch{n&&(r=n.textContent||``)}t&&(t.textContent=`Saving...`);let i=(T.activeEditorPath||``).split(`/`).pop()||`file`;try{if(T.isPublicMode&&T.currentPublicUser){let n=sessionStorage.getItem(`mininxd_pub_key_`+T.currentPublicUser.clean_id)||``,a=new Blob([r],{type:`text/plain;charset=utf-8`}),o=new File([a],i,{type:`text/plain`}),s=new FormData;s.append(`user_id`,T.currentPublicUser.clean_id);let c=T.activeEditorPath.lastIndexOf(`/`)>0?T.activeEditorPath.substring(0,T.activeEditorPath.lastIndexOf(`/`)):`/`;s.append(`subpath`,c),n&&s.append(`key`,n),s.append(`file`,o);let l=await(await N(`/api/public/upload`,{method:`POST`,body:s})).json();l&&l.success?(t&&(t.textContent=`Saved`),A(`Saved "${i}"`,`success`),setTimeout(()=>{t&&(t.textContent=`Ready`)},2e3),typeof e==`function`&&e()):(t&&(t.textContent=`Error`),A(`Save failed: ${l?.error||`Unknown error`}`,`error`));return}let n=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`),a=await(await N(`/api/ftp/save-file`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({path:T.activeEditorPath,content:r,fingerprint:n})})).json();a&&a.success?(t&&(t.textContent=`Saved`),A(`Saved "${i}"`,`success`),setTimeout(()=>{t&&(t.textContent=`Ready`)},2e3),typeof e==`function`&&e()):(t&&(t.textContent=`Error`),A(`Save failed: ${a?.error||`Unknown error`}`,`error`))}catch(e){t&&(t.textContent=`Error`),A(`Save error: ${e?.message||String(e)}`,`error`)}}function Qe(e){let t=document.getElementById(`saveEditorFileBtn`);t&&t.addEventListener(`click`,()=>Ze(e)),window.openCodeEditor=Xe}function Q(e,t){let n=document.getElementById(`settingsUserIdDisplay`);n&&t&&(n.textContent=t,n.title=t)}function $(){M()&&(T.isUserAdmin=!1);let e=document.getElementById(`fabTriggerBtn`),t=document.getElementById(`fabMenu`),n=document.getElementById(`batchDeleteBtn`),r=document.getElementById(`batchCopyBtn`),i=document.getElementById(`batchCutBtn`),a=document.getElementById(`saveEditorFileBtn`),o=document.getElementById(`navAdminConsoleBtn`),s=document.getElementById(`settingsAdminConsoleContainer`),c=document.getElementById(`adminDashboardView`),l=c&&!c.classList.contains(`hidden`),u=(T.isUserAdmin||T.isPublicMode)&&!l;e&&(u?e.classList.remove(`hidden`):(e.classList.add(`hidden`),t&&t.classList.add(`hidden`))),n&&(T.isUserAdmin||T.isPublicMode?(n.classList.remove(`hidden`),r&&r.classList.remove(`hidden`),i&&i.classList.remove(`hidden`)):(n.classList.add(`hidden`),r&&r.classList.add(`hidden`),i&&i.classList.add(`hidden`))),a&&(T.isUserAdmin||T.isPublicMode?a.classList.remove(`hidden`):a.classList.add(`hidden`)),o&&(T.isUserAdmin&&!l?o.classList.remove(`hidden`):o.classList.add(`hidden`)),s&&(T.isUserAdmin&&!l?s.classList.remove(`hidden`):s.classList.add(`hidden`))}async function $e(){let e=document.getElementById(`adminRefreshIcon`),t=document.getElementById(`adminCurrentUserIdDisplay`),n=document.getElementById(`adminStatTotalUsers`),r=document.getElementById(`adminStatTotalAdmins`),i=document.getElementById(`adminStatStorageText`),a=document.getElementById(`adminStatStorageBar`),o=document.getElementById(`adminStatFtpHost`),s=document.getElementById(`adminUsersTableBody`);e&&e.classList.add(`animate-spin`),t&&(t.textContent=`User ID: ${T.currentDeviceFingerprint||`Unknown`}`);try{let e=await(await N(`/api/list_user`)).json();if(Array.isArray(e)){T.adminUserList=e;let t=e.length,i=e.filter(e=>e.roles===`admin`||e.isAdmin===!0).length;n&&(n.textContent=t),r&&(r.textContent=i),et()}else s&&(s.innerHTML=`
                  <tr>
                    <td colspan="4" class="text-center py-8 text-xs text-error">
                      ${e?.error||`Failed to load registered devices.`}
                    </td>
                  </tr>
                `);let t=await(await N(`/api/ftp/storage-info`)).json();if(t&&t.success&&(i&&(i.textContent=t.compactDisplay||`${t.usedFormatted}/${t.totalFormatted}`),a)){let e=t.percentage===void 0?0:t.percentage;a.style.width=`${Math.min(100,Math.max(1,e))}%`}let c=await(await N(`/api/config`)).json();c&&c.success&&o&&c.ftp_server&&(o.textContent=`${c.ftp_server}:${c.ftp_port||21}`)}catch(e){console.error(`Error loading admin data:`,e)}finally{e&&setTimeout(()=>e.classList.remove(`animate-spin`),300)}}function et(){let e=document.getElementById(`adminUsersTableBody`);if(!e)return;if(T.adminUserList.length===0){e.innerHTML=`
          <tr>
            <td colspan="4" class="text-center py-8 text-xs text-base-content/50">
              No registered devices in SQLite database.
            </td>
          </tr>
        `;return}let t=(T.currentDeviceFingerprint||``).toLowerCase().replace(/^0x/,``);e.innerHTML=T.adminUserList.map(e=>{let n=e.roles===`admin`||e.isAdmin===!0,r=(e.userid||``).toLowerCase().replace(/^0x/,``),i=!!(r&&t&&r===t),a=e.createdAt?D(e.createdAt):`-`;return`
          <tr class="hover">
            <td class="font-mono text-xs">
              <div class="flex items-center gap-2">
                <span class="font-semibold select-all">${e.userid}</span>
                ${i?`<span class="badge badge-xs badge-primary font-sans font-bold">YOU</span>`:``}
                <button onclick="window.copyToClipboard('${e.userid}')" class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary" title="Copy User ID">
                  <i class="ri-file-copy-line text-xs"></i>
                </button>
              </div>
            </td>
            <td class="text-center">
              ${n?`<span class="badge badge-success badge-xs font-mono font-bold">ADMIN</span>`:`<span class="badge badge-ghost badge-xs font-mono">VIEW ONLY</span>`}
            </td>
            <td class="text-xs text-base-content/60 font-mono">
              ${a}
            </td>
            <td class="text-right">
              ${i?`<span class="text-[11px] text-base-content/40 font-mono italic pr-2">Active Session</span>`:n?`<button onclick="window.demoteAdminUser('${e.userid}')" class="btn btn-ghost btn-xs text-warning hover:bg-warning/10 font-semibold gap-1">
                        <i class="ri-user-unfollow-line text-xs"></i>
                        <span>Revoke Admin</span>
                       </button>`:`<button onclick="window.promoteAdminUser('${e.userid}')" class="btn btn-ghost btn-xs text-success hover:bg-success/10 font-semibold gap-1">
                        <i class="ri-shield-check-line text-xs"></i>
                        <span>Make Admin</span>
                       </button>`}
            </td>
          </tr>
        `}).join(``)}function tt(){if(M()){T.isUserAdmin=!1,$(),window.location.replace(`/`);return}let e=document.getElementById(`fileManagerView`),t=document.getElementById(`adminDashboardView`),n=document.getElementById(`bottomStatusBar`),r=document.getElementById(`fabTriggerBtn`),i=document.getElementById(`fabMenu`);e&&e.classList.add(`hidden`),t&&t.classList.remove(`hidden`),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`),i&&i.classList.add(`hidden`),$();try{let e=T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`);if(e){let t=`/${e}`;window.location.pathname!==t&&window.history.pushState({admin:!0},``,t)}}catch{}$e()}function nt(e){let t=document.getElementById(`fileManagerView`),n=document.getElementById(`adminDashboardView`);document.getElementById(`fabTriggerBtn`);let r=document.getElementById(`fabMenu`);n&&n.classList.add(`hidden`),t&&t.classList.remove(`hidden`),r&&r.classList.add(`hidden`);try{let e=T.currentPath&&T.currentPath!==`/`?`/#${encodeURIComponent(T.currentPath)}`:`/`;(window.location.pathname!==`/`||window.location.hash!==(T.currentPath&&T.currentPath!==`/`?`#${encodeURIComponent(T.currentPath)}`:``))&&window.history.pushState({path:T.currentPath||`/`},``,e)}catch{}$(),typeof e==`function`&&e()}function rt(e){let t=document.getElementById(`adminGoToFileManagerBtn`),n=document.getElementById(`adminRefreshBtn`),r=document.getElementById(`adminAddUserBtn`),i=document.getElementById(`adminAddUserInput`),a=document.getElementById(`navAdminConsoleBtn`),o=document.getElementById(`settingsOpenAdminConsoleBtn`);a&&!a._bound&&(a._bound=!0,a.addEventListener(`click`,()=>{tt()})),o&&!o._bound&&(o._bound=!0,o.addEventListener(`click`,()=>{let e=document.getElementById(`settingsModal`);e&&e.open&&e.close(),tt()})),t&&t.addEventListener(`click`,()=>nt(e)),n&&n.addEventListener(`click`,$e),r&&i&&r.addEventListener(`click`,async()=>{let e=i.value.trim();if(!e){A(`Please enter a valid User ID`,`warning`);return}await window.promoteAdminUser(e),i.value=``});let s=document.getElementById(`adminChangeMasterKeyForm`),c=document.getElementById(`adminNewMasterKeyInput`),l=document.getElementById(`adminChangeMasterKeyBtn`);s&&s.addEventListener(`submit`,async e=>{e.preventDefault();let t=c?c.value.trim():``;if(!t){A(`Please enter a new master key`,`warning`);return}l&&(l.disabled=!0);try{let e=await(await N(`/api/change_masterkey`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:T.currentDeviceFingerprint,userid:T.currentDeviceFingerprint,newMasterKey:t})})).json();if(e&&e.success){try{localStorage.setItem(`mininxd_master_key`,t),T.currentMasterKey=t}catch{}c&&(c.value=``),A(`Master key updated successfully in database!`,`success`)}else A(`Failed: ${e?.error||`Could not update master key`}`,`error`)}catch(e){A(`Error: ${e.message}`,`error`)}finally{l&&(l.disabled=!1)}}),window.copyToClipboard=e=>{navigator.clipboard.writeText(e).then(()=>{A(`Copied to clipboard`,`success`)}).catch(()=>{A(e,`info`)})},window.promoteAdminUser=async e=>{if(!e)return;let t=e.trim(),n=prompt(`Enter Master Key for new admin ${t} (Required):`);if(!n||!n.trim()){A(`Master Key is required to promote a user to admin`,`warning`);return}try{let e=await(await N(`/api/add_admin`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:T.currentDeviceFingerprint,userid:t,targetUserId:t,masterkey:n.trim()})})).json();e&&e.success?(A(`User promoted to admin (${e.adminCount||``} admins total)`,`success`),await $e()):A(`Failed: ${e?.error||`Unknown error`}`,`error`)}catch(e){A(`Error: ${e.message}`,`error`)}},window.demoteAdminUser=async e=>{if(e){if(e.toLowerCase().replace(/^0x/,``)===(T.currentDeviceFingerprint||``).toLowerCase().replace(/^0x/,``)){A(`Cannot revoke admin privileges on your current active session`,`warning`);return}if(confirm(`Revoke admin privileges for user ${e}?`))try{let t=await(await N(`/api/remove_admin`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:T.currentDeviceFingerprint,userid:e,targetUserId:e})})).json();t&&t.success?(A(`Admin privileges removed`,`info`),await $e()):A(`Failed: ${t?.error||`Unknown error`}`,`error`)}catch(e){A(`Error: ${e.message}`,`error`)}}}}P();async function it(){let e=document.getElementById(`navAppTitle`);try{let t=await(await N(`/api/config`)).json();if(t.success){if(t.ftp_name){e&&(e.textContent=t.ftp_name);let n=document.getElementById(`modalFooterAppName`);n&&(n.textContent=t.ftp_name),document.title=t.ftp_name}t.public_mode&&(T.publicModeConfig=t.public_mode)}}catch{}}var at=null,ot=!1;async function st(e=!0){if(!ot){ot=!0,e||j(`connecting`,`Connecting to Storage...`);try{let e=await(await N(`/api/ftp/heartbeat`)).json();if(e.success&&e.status===`connected`){let e=at===!1;at=!0,e&&j(`connected`,`Connected to Storage`)}else at=!1,j(`error`,`Not Connected to Storage`,e.error||`530 Login incorrect`,{showRetry:!0})}catch(e){at=!1,j(`error`,`Not Connected to Storage`,e.message||`Connection Failed`,{showRetry:!0})}finally{ot=!1}}}var ct=!1;function lt(){let e=window.location.pathname.toLowerCase(),t=``;if(!e.startsWith(`/pub`)&&!e.startsWith(`/public`)&&!e.startsWith(`/api`)&&!e.startsWith(`/assets`)){let e=window.location.pathname.replace(/^\/+/,``).replace(/\/+$/,``).trim();e&&!e.includes(`/`)&&(t=e)}if(!t&&window.location.hash){let e=window.location.hash.replace(/^#\/?/,``).trim();e&&!e.includes(`/`)&&(t=e)}let n=new URLSearchParams(window.location.search);if(!t&&(n.get(`userid`)||n.get(`user_id`)||n.get(`admin`))&&(t=(n.get(`userid`)||n.get(`user_id`)||n.get(`admin`)||``).trim()),!t)return null;let r=t.toLowerCase().replace(/^0x/,``),i=/^[0-9a-f]{32,64}$/i.test(r),a=t.toLowerCase()===`admin`||t===`1`;return i||a?{raw:t,clean:r,isAdminKeyword:a}:null}async function ut(){if(ct)return;ct=!0;let e=document.getElementById(`navWelcomeSetupBtn`);e&&!e._bound&&(e._bound=!0,e.addEventListener(`click`,()=>{if(welcomeUserIdDisplay&&(welcomeUserIdDisplay.textContent=T.currentDeviceFingerprint),welcomeAdminUrlSample&&(welcomeAdminUrlSample.textContent=`${window.location.origin}/${T.currentDeviceFingerprint}`),welcomeSetupModal)try{welcomeSetupModal.showModal()}catch{}}));try{let t=await _();T.currentDeviceFingerprint=t;try{localStorage.setItem(`mininxd_device_fingerprint`,t)}catch{}if(M()){T.isUserAdmin=!1;try{localStorage.setItem(`mininxd_is_admin`,`false`)}catch{}$(),Q(!1,t),e&&e.classList.add(`hidden`),T.filesList&&T.filesList.length>0&&J(searchInput?searchInput.value.trim():``);return}let n=null;try{let e=await N(`/api/verify`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:t})});e&&e.ok&&(n=await e.json())}catch(e){console.warn(`Verify fetch failed:`,e)}if(!n||!n.success){console.warn(`Device verification failed or offline, skipping welcome setup modal`),Q(T.isUserAdmin,T.currentDeviceFingerprint),$(),T.filesList&&T.filesList.length>0&&J(searchInput?searchInput.value.trim():``);return}sessionStorage.setItem(`mininxd_session_verified_fp`,t),n.hasAdmins!==!1&&n.adminCount>0&&sessionStorage.setItem(`mininxd_has_admins`,`true`);let r=!!n.isAdmin,i=lt();if(i){let e=(t||``).toLowerCase().replace(/^0x/,``),a=i.clean;if(!(i.isAdminKeyword?r:r&&a===e)){A(`Unauthorized: Hardware verification failed. This device is view-only. Canceling...`,`error`),T.isUserAdmin=!1,$(),Q(!1,t),setTimeout(()=>{window.location.replace(`/`)},1e3);return}if(n.requiresMasterKey){let e=!1,n=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||sessionStorage.getItem(`mininxd_master_key`);if(n)try{let r=await(await N(`/api/verify_masterkey`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:t,masterkey:n})})).json();r&&r.success&&(e=!0,T.currentMasterKey=n)}catch{}if(!e){T.isUserAdmin=!1,$(),Q(!1,T.currentDeviceFingerprint),me({onSuccess:()=>{T.isUserAdmin=!0;try{localStorage.setItem(`mininxd_is_admin`,`true`)}catch{}$(),Q(!0,T.currentDeviceFingerprint),A(`Admin & Master Key verified. Welcome to Admin Console!`,`success`),tt()},onCancel:()=>{T.isUserAdmin=!1;try{localStorage.setItem(`mininxd_is_admin`,`false`)}catch{}$(),Q(!1,T.currentDeviceFingerprint),A(`Master Key verification required. Access denied.`,`warning`),setTimeout(()=>{window.location.replace(`/`)},1e3)}});return}}T.isUserAdmin=!0;try{localStorage.setItem(`mininxd_is_admin`,`true`)}catch{}$(),Q(!0,T.currentDeviceFingerprint),A(`Admin & Master Key verified. Welcome to Admin Console!`,`success`),tt();return}let a=!1;if(r){if(n.requiresMasterKey){let e=T.currentMasterKey||localStorage.getItem(`mininxd_master_key`)||sessionStorage.getItem(`mininxd_master_key`);if(e)try{let n=await(await N(`/api/verify_masterkey`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fingerprint:t,masterkey:e})})).json();n&&n.success&&(a=!0,T.currentMasterKey=e)}catch{}a||(T.isUserAdmin=!1,$(),Q(!1,T.currentDeviceFingerprint))}else a=!0}T.isUserAdmin=r&&(!n.requiresMasterKey||a);try{localStorage.setItem(`mininxd_is_admin`,T.isUserAdmin?`true`:`false`)}catch{}if(n.isNew&&n.hasAdmins!==!1){window.location.reload();return}Q(T.isUserAdmin,T.currentDeviceFingerprint),$();let o=n.success===!0&&(n.hasAdmins===!1||n.adminCount===0)&&!r&&!T.isUserAdmin;if(e&&(o?e.classList.remove(`hidden`):e.classList.add(`hidden`)),o&&welcomeSetupModal){welcomeUserIdDisplay&&(welcomeUserIdDisplay.textContent=T.currentDeviceFingerprint),welcomeAdminUrlSample&&(welcomeAdminUrlSample.textContent=`${window.location.origin}/${T.currentDeviceFingerprint}`);try{welcomeSetupModal.open||welcomeSetupModal.showModal()}catch{}}T.filesList&&T.filesList.length>0&&J(searchInput?searchInput.value.trim():``)}catch(e){console.error(`Device verification error:`,e)}finally{ct=!1}}window.addEventListener(`popstate`,e=>{let t=document.getElementById(`renameModal`);if(t&&t.open){t.close();return}let n=[document.getElementById(`draculaEditorModal`),document.getElementById(`imagePreviewModal`),document.getElementById(`mediaPreviewModal`),document.getElementById(`newFileModal`),document.getElementById(`newFolderModal`),document.getElementById(`settingsModal`),document.getElementById(`publicKeyModal`),document.getElementById(`publicSetPasswordModal`)],r=!1;for(let e of n)e&&e.open&&(e.id===`mediaPreviewModal`?oe():e.close(),r=!0);if(r)return;if(T.selectedFileNames&&T.selectedFileNames.size>0){Ee(!0);return}let i=document.getElementById(`adminDashboardView`),a=i&&!i.classList.contains(`hidden`);if(lt()){if(T.isUserAdmin){tt();return}}else if(a){nt();return}if(e.state&&e.state.public&&e.state.user){X(e.state.user,e.state.path||`/`,!1);return}let o=window.location.pathname.replace(/^\/+/,``);if(o.startsWith(`pub/`)){let e=o.split(`/`),t=(e[1]||``).toLowerCase().replace(/^0x/,``),n=e.slice(2).length>0?`/`+e.slice(2).join(`/`):`/`;if(t){X(t,n,!1);return}}if(T.isPublicMode&&!o.startsWith(`pub`)){ke();return}let s=null;if(e.state&&typeof e.state.path==`string`)s=e.state.path;else if(window.location.hash)try{let e=window.location.hash.replace(/^#/,``);s=decodeURIComponent(e)}catch{}(!s||!s.startsWith(`/`))&&(s=`/`),s!==T.currentPath&&Ae(s,!1)}),window.addEventListener(`keydown`,e=>{let t=e.target&&e.target.tagName?e.target.tagName.toLowerCase():``,n=t===`input`||t===`textarea`||t===`select`||e.target&&e.target.isContentEditable||e.target&&e.target.classList&&e.target.classList.contains(`dracula-editor`),r=document.getElementById(`renameModal`);if(document.getElementById(`searchInput`),!n&&!(r&&r.open)){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`c`&&T.selectedFileNames.size>0){e.preventDefault(),Ce();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`x`&&T.selectedFileNames.size>0){e.preventDefault(),we();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`v`){e.preventDefault(),Te();return}if(e.key===`Escape`&&T.selectedFileNames.size>0){T.selectedFileNames.clear(),Ee();return}(e.key===`Backspace`||e.altKey&&e.key===`ArrowLeft`||e.key===`BrowserBack`)&&(e.preventDefault(),je())}}),Pe(),Ge(),de(),Qe(()=>{K(),Y(!0),z(!0)}),rt(()=>{K(),Y(!0)}),re(),pe();var dt=document.getElementById(`bottomStatusRetryBtn`);dt&&dt.addEventListener(`click`,async()=>{await st(!1),K(),Y(!0),z(!0)});async function ft(){await it();let e=lt(),t=window.location.pathname.replace(/^\/+/,``).replace(/\/+$/,``).split(`/`).filter(Boolean);if(t.length>0&&(t[0]===`pub`||t[0]===`public`)){if(await ut(),t[0]===`public`&&t.length===1&&T.isUserAdmin){T.currentPath=`/public`,await Y(),z(!1),st(!0),ze();return}let e=``;if(t.length>1)e=t[1].toLowerCase().replace(/^0x/,``);else{let t=(T.currentDeviceFingerprint||localStorage.getItem(`mininxd_device_fingerprint`)||``).toLowerCase().replace(/^0x/,``);t?e=t:T.publicModeConfig&&T.publicModeConfig.user_list&&T.publicModeConfig.user_list.length>0&&(e=T.publicModeConfig.user_list[0].clean_id)}if(e){let n=t.slice(2).length>0?`/`+t.slice(2).join(`/`):`/`;X(e,n,!1),z(!1),st(!0),ze();return}}if(!e){if(window.location.hash)try{let e=window.location.hash.replace(/^#/,``),t=decodeURIComponent(e);t&&t.startsWith(`/`)&&(T.currentPath=t)}catch{}try{let e=T.currentPath===`/`?`/`:`/#`+encodeURIComponent(T.currentPath);history.replaceState({path:T.currentPath},``,e)}catch{}}await ut(),await Y(),z(!1),st(!0),ze()}ft(),setInterval(()=>st(!0),25e3);