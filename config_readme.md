# FTP Server Configuration Guide (`config.json`)

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/mininxd)
[![Saweria](https://img.shields.io/badge/Saweria-Donate-FFAA00?logo=curseforge&logoColor=white)](https://saweria.co/mininxd)

This document provides a comprehensive guide for configuring the **FTP Server** via [config.json](file:///root/ftp-server/config.json) and environment variable overrides.

---

## 1. Full `config.json` Schema & Structure

```json
{
  "ftp_server": "127.0.0.1",
  "ftp_port": 21,
  "ftp_name": "FTP Server",
  "ftp_user": "username",
  "ftp_password": "password",
  "storage_in_GB": 32,
  "advanced_options": {
    "simulatenous_zip_process": 0,
    "admin_counts": 1,
    "system_info": "auto"
  },
  "public_mode": {
    "enabled": true,
    "max_size": 100,
    "public_folder_name": "",
    "allowed_format": ["png", "jpg"]
  }
}
```

---

## 2. Core Configuration Parameters

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ftp_server` | `string` | `"127.0.0.1"` | IP address or hostname of the target FTP server backend. |
| `ftp_port` | `number` | `21` | Port number of the target FTP server (standard FTP is `21`). |
| `ftp_name` | `string` | `"FTP Server"` | Display title shown in the web interface header, browser tab, and modal footer. |
| `ftp_user` | `string` | `"username"` | Username for authenticating with the FTP server backend. |
| `ftp_password` | `string` | `"password"` | Password for authenticating with the FTP server backend. |
| `storage_in_GB` | `number` | `32` | Total storage capacity in Gigabytes (used for storage widget calculation and capacity metrics). |

---

## 3. Advanced Options (`advanced_options`)

The `advanced_options` object configures server concurrency, administrative seat limits, and platform hardware diagnostics:

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `simulatenous_zip_process` | `number` | `0` | **ZIP Rate Limiter & Concurrency Controller**. Controls how many ZIP packaging jobs can run simultaneously. |
| `admin_counts` | `number` | `1` | **Maximum Administrator Accounts Allowed**. Limits the total number of devices that can hold the `admin` role simultaneously. |
| `system_info` | `string` | `"auto"` | **System Diagnostics & Telemetry Mode**. Configures how hardware metrics (CPU, RAM, thermals, battery) are collected. |

### Detailed Advanced Parameters

#### A. ZIP Concurrency (`simulatenous_zip_process`)
- **`0` (Default - Recommended for Routers, SBCs & Mobile Devices)**:
  - **Strict Rate Limiting**: Exactly **1 active ZIP process** at a time.
  - Subsequent requests automatically join a **FIFO Queue** (`Waiting in line...`) and execute sequentially without causing CPU or memory spikes.
- **`N` (e.g. `2`, `4`, `8`)**:
  - Allows up to **N simultaneous ZIP processes** concurrently before queueing additional requests.
- **`-1` (Unlimited)**:
  - Disables rate limiting. All ZIP jobs execute immediately in parallel.

#### B. Admin Seat Limits (`admin_counts`)
- Controls how many physical devices can be granted administrative privileges (`isAdmin: 1`).
- If set to `1` (default), only one device can register as an admin. Additional promotion attempts return `400 Admin limit reached`.
- Existing database records in SQLite (`devices.db`) always maintain priority.
- **Note on Master Key**: The Master Key is created and configured directly by the administrator during first-time device setup in the Web UI welcome guide.

#### C. System Diagnostics (`system_info`)
- **`"auto"` (Default)**: Automatically detects the host environment (Android Termux, Ubuntu, Debian, Alpine, Arch, Raspbian, Fedora, macOS, Windows).
- **`"ubuntu"` / `"debian"` / `"linux"`**: Uses standard Linux `/proc/stat`, `/proc/cpuinfo`, `/proc/loadavg`, `/sys/class/thermal/`, and `/proc/meminfo`.
- **`"termux"`**: Queries Android system properties (`getprop`), CPU scaling sysfs entries, and Termux API (`termux-battery-status`) for Android hardware & battery telemetry.

---

## 4. Public Mode Configuration (`public_mode`)

Public mode enables a secure, multi-tenant guest upload/download area where users are sandboxed into individual directories:

```json
"public_mode": {
  "enabled": true,
  "max_size": 100,
  "public_folder_name": "",
  "allowed_format": ["png", "jpg"]
}
```

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Enables or disables Public Mode. When enabled, users can access `/public` spaces without administrative privileges. |
| `max_size` | `number` | `100` | Maximum allowable storage capacity **per public user directory** in Megabytes (MB). |
| `public_folder_name` | `string` | `""` | The root folder name on the FTP server where public spaces are stored (defaults to `"public"` when empty). |
| `allowed_format` | `array` | `["png", "jpg"]` | Whitelist of allowed file extensions and MIME types. If empty `[]`, all formats are permitted. |

### Supported Format Filtering Rules:
1. **Wildcard MIME Types**: `"image/*"`, `"video/*"`, `"audio/*"`, `"text/*"`.
2. **Exact MIME Types**: `"application/zip"`, `"application/pdf"`, `"application/json"`.
3. **File Extensions**: `"png"`, `".png"`, `"jpg"`, `"mp4"`, `"pdf"`, `"txt"` (leading dots are optional, and `jpg`/`jpeg` are automatically treated as aliases).

---

## 5. Environment Variable Overrides

Any value in `config.json` can be overridden at runtime using environment variables. Environment variables always take precedence:

| Environment Variable | Overrides `config.json` Field | Default Fallback |
| :--- | :--- | :--- |
| `FTP_HOST` | `ftp_server` | `"127.0.0.1"` |
| `FTP_PORT` | `ftp_port` | `21` |
| `FTP_USER` | `ftp_user` | `"username"` |
| `FTP_PASSWORD` | `ftp_password` | `"password"` |
| `MAX_CAPACITY` | `storage_in_GB` | `32` |
| `SIMULTANEOUS_ZIP_PROCESS` | `advanced_options.simulatenous_zip_process` | `0` |
| `ADMIN_COUNTS` | `advanced_options.admin_counts` | `1` |
| `SYSTEM_INFO` | `advanced_options.system_info` | `"auto"` |
| `PORT` | Web Server HTTP Port | `3690` |

---

## 6. Recommended Deployment Profiles

### Profile A: Low-Resource Devices (Routers, Android Termux, Single Board Computers)
Ideal for Raspberry Pi, OpenWrt routers, and Android phones running Termux:
```json
{
  "ftp_server": "127.0.0.1",
  "ftp_port": 21,
  "ftp_name": "Home Gateway Storage",
  "ftp_user": "admin",
  "ftp_password": "SecurePassword123",
  "storage_in_GB": 32,
  "advanced_options": {
    "simulatenous_zip_process": 0,
    "admin_counts": 1,
    "system_info": "auto"
  },
  "public_mode": {
    "enabled": true,
    "max_size": 100,
    "public_folder_name": "",
    "allowed_format": []
  }
}
```

---

### Profile B: High-Performance Server / Dedicated VPS / NAS
Ideal for multi-core dedicated servers or heavy multi-user environments:
```json
{
  "ftp_server": "127.0.0.1",
  "ftp_port": 21,
  "ftp_name": "High-Speed Storage",
  "ftp_user": "storage_admin",
  "ftp_password": "SuperSecretPassword",
  "storage_in_GB": 1000,
  "advanced_options": {
    "simulatenous_zip_process": 4,
    "admin_counts": 5,
    "system_info": "ubuntu"
  },
  "public_mode": {
    "enabled": true,
    "max_size": 500,
    "public_folder_name": "public_spaces",
    "allowed_format": []
  }
}
```

---

## 7. Configuration Best Practices & Security

1. **First-Time Admin Setup**: On first launch, open the Web UI to claim administrator access and set your Master Key.
2. **Constrain Public Mode Quotas**: Always configure `max_size` when enabling `public_mode` to prevent disk exhaustion.
3. **Format Whitelisting**: For public dropzones, restrict `allowed_format` to expected media/document types to prevent malicious uploads.
4. **FTP User Least-Privilege**: Ensure the underlying FTP backend account (`ftp_user`) is chrooted or restricted to the intended root storage directory.

---

## Support & Donations

If this project helps your workflow, consider supporting its development:

- ☕ **Ko-fi**: [ko-fi.com/mininxd](https://ko-fi.com/mininxd)
- 💛 **Saweria**: [saweria.co/mininxd](https://saweria.co/mininxd)

---

## Related Documentation

- 📖 [Main Project Documentation (README.md)](file:///root/ftp-server/README.md)
- 📡 [REST API & WebSocket Documentation (api_readme.md)](file:///root/ftp-server/api_readme.md)
