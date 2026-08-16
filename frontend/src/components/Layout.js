// Main Application HTML Shell & Modals

export function renderAppLayout() {
    document.querySelector('#app').innerHTML = `
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
    `;
}
