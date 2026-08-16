# FTP Cloud Storage Server & Web Management Platform

[![Version](https://img.shields.io/badge/version-2.1.1-blue.svg)](./package.json)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)](./LICENSE)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/mininxd)
[![Saweria](https://img.shields.io/badge/Saweria-Donate-FFAA00?logo=curseforge&logoColor=white)](https://saweria.co/mininxd)

**FTP Cloud Storage** is a modern, high-performance, lightweight web-based FTP management platform and cloud storage gateway. It bridges traditional FTP servers (remote or local) with web browsers through a Single Page Application (SPA), zero external database dependencies (native SQLite engine), hardware-based zero-trust device authentication, live WebSocket telemetry, and resilient file operations.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites & Requirements](#prerequisites--requirements)
- [Quick Start & Installation](#quick-start--installation)
- [Core Features & Usage Guide](#core-features--usage-guide)
  - [1. Web File Manager](#1-web-file-manager)
  - [2. Code & Text Editor](#2-code--text-editor)
  - [3. Media Preview & Streaming](#3-media-preview--streaming)
  - [4. Asynchronous ZIP Archiving & Queue](#4-asynchronous-zip-archiving--queue)
  - [5. Resilient Uploads & Cache Recovery](#5-resilient-uploads--cache-recovery)
  - [6. Zero-Trust Hardware Fingerprinting & Security](#6-zero-trust-hardware-fingerprinting--security)
  - [7. Admin Console & Role Management](#7-admin-console--role-management)
  - [8. Multi-Tenant Public Mode](#8-multi-tenant-public-mode)
  - [9. Real-Time Telemetry & Hardware Diagnostics](#9-real-time-telemetry--hardware-diagnostics)
- [Configuration Guide](#configuration-guide)
- [REST API & WebSocket Documentation](#rest-api--websocket-documentation)
- [Release Packaging Guidelines](#release-packaging-guidelines)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Support & Donations](#support--donations)

---

## Key Features

- ⚡ **High-Speed Web FTP Gateway**: Fast directory listing, multi-part streaming, and connection pooling on top of FTP backends.
- 🎨 **Modern Responsive UI**: Built with a dark glassmorphic design system optimized for desktops, tablets, mobile browsers, and embedded touchscreens.
- 🔒 **Zero-Trust Device Fingerprinting**: Automatic 32-character hardware-level client fingerprinting (Canvas, WebGL, Audio, Screen, CPU traits) combined with SQLite device authorization and Master Key secrets.
- 📁 **Complete File Operations**:
  - Upload, download, create file, create folder, rename, move, cut, copy, and delete.
  - Multi-select batch actions (Batch Delete, Batch Copy, Batch Move, Batch ZIP download).
  - Clipboard system for copying/cutting and pasting items across folders.
  - Pinning system: Pin important files and directories to the top with custom badge labels.
- 📝 **Integrated Code & Text Editor**: In-browser editor with syntax highlighting, line numbers, unsaved changes indicators, and full-screen editing.
- 🎬 **Rich Media Lightbox & Streaming**: Inline viewer for images (with pan/zoom), audio player with waveform visuals, HTML5 video player, and PDF preview.
- 📦 **Smart Asynchronous ZIP Engine**:
  - Non-blocking ZIP generator with rate limiting and automated FIFO queueing.
  - Live progress polling and instant job cancellation.
- 🔄 **Resilient Upload Staging**: Backend upload cache (`uploadCache`) preserves file transfers and enables retry recovery even if browser connections drop.
- 🌐 **Public Multi-Tenant Mode**: Isolate guest/public folders (`/public/<user_id>`), enforce storage quotas, whitelist allowed file extensions or MIME types, and secure spaces with individual passwords.
- 📊 **Real-Time Telemetry & WebSocket Stream**: Live CPU load, per-core utilization, thermal sensor monitoring, RAM usage, storage allocation metrics, network interfaces, and battery telemetry (with Termux/Android and standard Linux auto-detection).

---

## Architecture & Tech Stack

```
+-----------------------------------------------------------------------+
|                           Browser Client                              |
|   Vite + Vanilla JS SPA  |  Hardware Fingerprint  |  WebSocket Stream |
+-----------------------------------------------------------------------+
                                   |  HTTP / REST / WS
                                   v
+-----------------------------------------------------------------------+
|                 FTP Cloud Storage Node.js Server (:3000)              |
|                                                                       |
|  +------------------------+  +-------------------------------------+  |
|  |  Express.js API Routes |  |  Security & Rate Limiting Engine    |  |
|  |  - Auth & Device Mgmt  |  |  - Constant-time Safe Comparison    |  |
|  |  - Browse & Media Read |  |  - Brute-force Request Throttling   |  |
|  |  - File Mutations      |  +-------------------------------------+  |
|  |  - ZIP Background Jobs |                                           |
|  |  - Public Mode Spaces  |  +-------------------------------------+  |
|  |  - System Diagnostics  |  |  SQLite Database (devices.db)       |  |
|  +------------------------+  |  - devices | public_users | pins    |  |
|                              +-------------------------------------+  |
|  +------------------------+                                           |
|  |  WebSocket Telemetry   |  +-------------------------------------+  |
|  |  (/ws/system_info)     |  |  Staging Cache & ZIP Engine         |  |
|  +------------------------+  |  - Archiver FIFO Queue              |  |
|                              |  - Multer Temporary Upload Cache    |  |
|                              +-------------------------------------+  |
+-----------------------------------------------------------------------+
                                   |  FTP Control & Data Streams (TCP)
                                   v
+-----------------------------------------------------------------------+
|                     Target FTP Server / NAS / Router                  |
|               (e.g., vsftpd, ProFTPD, Pure-FTPd, FileZilla)          |
+-----------------------------------------------------------------------+
```

### Backend
- **Runtime**: Node.js (`ESM` module format)
- **Web Framework**: Express 5
- **Database**: Native Node.js SQLite (`node:sqlite` `DatabaseSync`)
- **FTP Client**: `basic-ftp` with stream pipelines (`PassThrough`)
- **Compression**: `archiver` with asynchronous concurrency limiter
- **Real-Time Transport**: `ws` (WebSocket server)
- **Upload Handler**: `multer` with memory/disk cache management

### Frontend
- **Bundler**: Vite
- **Language**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Vanilla CSS (Tailored Design Tokens, Glassmorphism, CSS Grid & Flexbox)
- **Icons & UI**: Lucide-compatible vector icons and custom SVG assets

---

## Project Directory Structure

```text
ftp-cloud-storage/
├── config.json              # Main server & FTP connection configuration
├── config_readme.md         # Detailed configuration manual & tuning guide
├── api_readme.md            # Complete REST & WebSocket API specification
├── devices.db               # SQLite database (devices, public_users, pinned_items)
├── index.js                 # Server entry point & Express HTTP/WS bootstrap
├── package.json             # Root dependencies & project metadata
│
├── lib/                     # Core backend libraries & utilities
│   ├── config.js            # Configuration loader, defaults & validators
│   ├── db.js                # SQLite schema, queries & authorization helpers
│   ├── ftp.js               # FTP connection lifecycle, pooling & caching
│   ├── security.js          # Password hashing, constant-time compare & rate limiters
│   ├── systemInfo.js        # Multi-platform hardware & OS diagnostics
│   ├── systemWs.js          # WebSocket server & telemetry broadcast loop
│   ├── uploadCache.js       # Disk-backed staging cache for resilient uploads
│   └── zip.js               # Background ZIP worker, scanner & FIFO queue
│
├── routes/                  # Modular Express API routes
│   ├── auth.routes.js       # Device verification, admin promotion & master key
│   ├── browse.routes.js     # Directory listing, file reading & download streams
│   ├── config.routes.js     # Client runtime configuration endpoint
│   ├── mutations.routes.js  # Uploads, mkdir, rename, copy, move, delete
│   ├── public.routes.js     # Public multi-tenant spaces & quota management
│   ├── storage.routes.js    # Storage usage metrics & caching
│   ├── system.routes.js     # System diagnostics, heartbeat & versions
│   └── zip.routes.js        # Asynchronous ZIP archiving endpoints
│
└── frontend/                # Frontend Single Page Application (SPA)
    ├── index.html           # HTML shell entry point
    ├── vite.config.js       # Vite build & development configuration
    ├── package.json         # Frontend build tools & scripts
    └── src/
        ├── main.js          # Frontend initialization & state orchestrator
        ├── style.css        # Core styling, responsive design tokens & themes
        ├── components/
        │   ├── AdminConsole.js   # Admin user table & master key controls
        │   ├── CodeEditor.js     # Full-featured text/code editor
        │   ├── FileManager.js    # Table renderer, breadcrumbs, selections & clipboard
        │   ├── Layout.js         # Header, navigation, status bar & layout shell
        │   ├── MediaPreview.js   # Image, video, audio & PDF lightbox previewer
        │   ├── Modals.js         # Dialogs (setup, prompt, confirm, delete, new item)
        │   ├── StorageWidget.js  # Storage breakdown & live telemetry panels
        │   └── UploadHandler.js  # Upload queue, dropzone & cache retry monitor
        └── lib/
            ├── api.js            # API client wrapper with auto-fingerprint headers
            ├── fingerprint.js    # Client-side hardware fingerprint generator
            ├── security.js       # Anti-tamper & environment validation
            ├── state.js          # Global client reactive state store
            └── utils.js          # DOM helpers, formatters, toasts & status updates
```

---

## Prerequisites & Requirements

- **Node.js**: Version **18.0.0** or higher (Node.js 20+ or 22+ recommended for native `node:sqlite`).
- **FTP Server**: Any standard FTP server accessible over TCP (e.g. `vsftpd`, `ProFTPD`, `Pure-FTPd`, Android FTP server, Router NAS FTP).
- **Supported Operating Systems**:
  - Linux (Ubuntu, Debian, Alpine, Arch, Raspbian, Fedora, CentOS, RHEL)
  - Android (Termux environment with optional Termux:API)
  - macOS & Windows (Development and hosting)

---

## Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/mininxd/ftp-cloud-storage.git
cd ftp-cloud-storage

# Install backend dependencies
npm install

# Install frontend dependencies and build the client bundle
cd frontend
npm install
npm run build
cd ..
```

### 2. Configure FTP & Server Parameters

Edit [config.json](./config.json) with your FTP credentials and preferences:

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

> 📖 **Need detailed configuration docs?** Read the [Configuration Guide](./config_readme.md).

### 3. Start the Server

```bash
# Start the production server
node index.js
```

By default, the server runs on **http://localhost:3000** (or your device's LAN IP).

### 4. Development Workflow

To run with frontend hot module reloading (HMR):

```bash
# Terminal 1: Run Backend API
node index.js

# Terminal 2: Run Vite Dev Server
cd frontend
npm run dev
```

---

## Core Features & Usage Guide

### 1. Web File Manager

The web file manager provides an intuitive desktop-grade experience directly in your browser:

- **Navigation**: Click folders to enter, use the clickable breadcrumb bar or the "Up" button to navigate parent directories.
- **Search & Filter**: Type into the search bar to filter the current folder in real-time.
- **Multi-Select & Batch Toolbar**: Select multiple items using checkboxes. The batch toolbar allows:
  - **Batch Download as ZIP**: Packages selected files and folders into an archive.
  - **Batch Copy / Cut**: Stores items in the in-memory clipboard to paste elsewhere.
  - **Batch Delete**: Permanently removes selected files and directories.
- **Pinning Items**: Click the pin icon on any file or folder to pin it to the top of the directory with a customizable badge label.

---

### 2. Code & Text Editor

A lightweight text and code editor built for quick editing of configuration files, scripts, markdown, and source code directly on the FTP server:

- Opens any plain text file (`.txt`, `.json`, `.js`, `.py`, `.sh`, `.css`, `.html`, `.md`, `.env`, etc.).
- Line numbering and monospace typography.
- Unsaved changes guard to prevent accidental tab closing.
- Save operations stream directly back to the FTP backend via `/api/ftp/save-file`.

---

### 3. Media Preview & Streaming

View media without downloading files manually:

- **Images**: Inline viewer supporting JPG, PNG, WEBP, GIF, SVG, and BMP with smooth zoom and pan.
- **Audio**: Built-in player with progress scrubbing, time indicators, and audio format decoding (MP3, WAV, OGG, FLAC, AAC).
- **Video**: HTML5 video streaming player (MP4, WEBM, MKV, MOV) with full-screen playback.
- **PDF Documents**: Embedded PDF reader with page controls.

---

### 4. Asynchronous ZIP Archiving & Queue

Downloading large folders or multiple files over FTP can be slow and resource-heavy. FTP Cloud Storage solves this with an asynchronous worker:

1. Request a ZIP download via `/api/ftp/create-zip-job`.
2. The server scans directories and downloads files to a temporary staging folder.
3. If the server is busy, the job enters a **FIFO Queue** (`Waiting in line...`).
4. Once completed, a direct download link is generated, and temporary files are automatically purged after download or timeout.

---

### 5. Resilient Uploads & Cache Recovery

To protect against interrupted transfers and mobile network drops:

- Files uploaded through the UI are first written to local staging (`uploadCache`).
- The backend then streams the staged file into the FTP server.
- If the connection is disrupted, the pending upload is retained in the cache, allowing administrators to click **Retry** without re-uploading the original file from the browser.

---

### 6. Zero-Trust Hardware Fingerprinting & Security

FTP Cloud Storage does not rely on easily forged cookies or simple session tokens. Instead, it utilizes client-side hardware fingerprinting:

- **Fingerprint Generation**: Generates a 32-character hexadecimal identifier (`0x...`) combining hardware traits (Canvas rendering hash, WebGL vendor, AudioContext synthesis, CPU core count, screen dimensions, color depth).
- **Database Registration**: Fingerprints are registered in SQLite (`devices.db`) upon first visit.
- **Master Key Authentication**: Administrative operations require validating against the configured Master Key using timing-safe comparisons (`crypto.timingSafeEqual`) and brute-force attempt rate limiting (max 5 failed attempts per 60s cooldown).
- **HTTP Security Headers**: Express includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

### 7. Admin Console & Role Management

Authorized administrators have access to the **Admin Dashboard** (`/admin` or navigation switch):

- **Device Directory**: View all registered devices, their roles (`admin` vs `user`), and first seen timestamps.
- **Role Elevation**: Promote users to administrators (subject to `admin_counts` limit) or demote them back to view-only.
- **Master Key Management**: Rotate or update individual admin Master Keys.
- **Storage Analytics**: Real-time breakdown of used vs total capacity, file counts, and folder totals.

---

### 8. Multi-Tenant Public Mode

When `public_mode.enabled` is `true` in `config.json`:

- **Isolated User Directories**: Each guest receives a dedicated sandbox folder under `/public/<user_id>`.
- **Format Whitelist**: Restrict uploads to specific extensions (e.g., `["png", "jpg", "pdf"]`) or MIME wildcards (e.g., `["image/*", "video/*"]`).
- **Quota Limits**: Restrict the maximum storage space per public folder (e.g. `100` MB).
- **Password Protection**: Users can optionally set personal access keys for their public directories.

---

### 9. Real-Time Telemetry & Hardware Diagnostics

The built-in diagnostics engine monitors server health in real time:

- **WebSocket Stream**: Connects to `/ws/system_info` for live updates every 1.5 seconds.
- **Metrics Collected**:
  - **CPU**: Model name, core count, per-core utilization percentages, system load averages (1m, 5m, 15m), and thermal sensor temperatures (°C).
  - **Memory**: Total RAM, free RAM, used RAM, and usage percentage.
  - **OS & Platform**: Distribution name, kernel version, uptime, architecture, and hostname.
  - **Network**: Active interfaces, IPv4/IPv6 addresses, MAC addresses.
  - **Battery**: Battery percentage, charging status, temperature, and health (on supported Android/Termux & Linux environments).
- **Environment Auto-Detection**: Seamlessly switches diagnostic sources between Android Termux, Ubuntu, Debian, Alpine, Arch, Raspbian, Fedora, macOS, and Windows.

---

## Configuration Guide

The primary configuration file is [config.json](./config.json) located in the project root.

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

### Environment Variable Overrides

All settings can be dynamically overridden at runtime using environment variables:

| Variable | Overrides Key | Default |
| :--- | :--- | :--- |
| `FTP_HOST` | `ftp_server` | `"127.0.0.1"` |
| `FTP_PORT` | `ftp_port` | `21` |
| `FTP_USER` | `ftp_user` | `"username"` |
| `FTP_PASSWORD` | `ftp_password` | `"password"` |
| `MAX_CAPACITY` | `storage_in_GB` | `32` |
| `SIMULTANEOUS_ZIP_PROCESS` | `advanced_options.simulatenous_zip_process` | `0` |
| `ADMIN_COUNTS` | `advanced_options.admin_counts` | `1` |
| `SYSTEM_INFO` | `advanced_options.system_info` | `"auto"` |
| `PORT` | Web Server Port | `3000` |

> 📚 For comprehensive explanations, tuning tips, and environment profiles, refer to [config_readme.md](./config_readme.md).

---

## REST API & WebSocket Documentation

FTP Cloud Storage provides a REST API and WebSocket stream:

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/config` | Returns public server metadata & configuration |
| **System** | `GET` | `/api/ftp/heartbeat` | Health check & FTP round-trip latency |
| **System** | `GET` | `/api/system_info` | Detailed hardware and OS metrics |
| **System** | `WS` | `/ws/system_info` | Real-time WebSocket hardware telemetry stream |
| **Auth** | `POST` | `/api/verify` | Register/verify device hardware fingerprint |
| **Auth** | `POST` | `/api/verify_masterkey` | Authenticate admin Master Key |
| **Auth** | `GET` | `/api/list_user` | List all registered devices (Admin only) |
| **Auth** | `POST` | `/api/add_admin` | Promote device to admin |
| **Auth** | `POST` | `/api/remove_admin` | Demote device to view-only |
| **Browse** | `GET` | `/api/ftp/list` | List directory contents with pinned item badges |
| **Browse** | `GET` | `/api/ftp/read-file` | Read text file content for editor |
| **Browse** | `GET` | `/api/ftp/view-file` | Inline streaming for images, videos, audio, PDF |
| **Browse** | `GET` | `/api/ftp/download` | Download file as attachment |
| **Mutations** | `POST` | `/api/ftp/upload` | Upload file with staging cache |
| **Mutations** | `POST` | `/api/ftp/save-file` | Save edited text/code file |
| **Mutations** | `POST` | `/api/ftp/mkdir` | Create new directory |
| **Mutations** | `POST` | `/api/ftp/rename` | Rename file or folder |
| **Mutations** | `POST` | `/api/ftp/copy` | Copy file or directory recursively |
| **Mutations** | `POST` | `/api/ftp/move` | Move/cut file or directory |
| **Mutations** | `POST` | `/api/ftp/delete` | Delete file or directory |
| **ZIP** | `POST` | `/api/ftp/create-zip-job` | Start asynchronous ZIP packing job |
| **ZIP** | `GET` | `/api/ftp/zip-job-status`| Poll ZIP creation progress & queue status |
| **ZIP** | `GET` | `/api/ftp/zip-job-download`| Download completed ZIP archive |
| **Public** | `GET` | `/api/public/list` | List public user space files |
| **Public** | `POST` | `/api/public/upload` | Upload to public user space (quota & format checked) |

> 📖 For full request/response schemas and examples, see [api_readme.md](./api_readme.md).

---

## Release Packaging Guidelines

When preparing a release package for deployment or distribution:

1. **Build the Frontend First**:
   ```bash
   cd frontend && npm run build && cd ..
   ```
2. **Archive Naming**: Name the release archive as `storage_v<version>.zip` (e.g. `storage_v2.1.1.zip`).
3. **Exclusions**: Do not include `node_modules/`, `.git/`, or existing `.zip` files.
4. **Packaging Command**:
   ```bash
   zip -r storage_v2.1.1.zip . -x "node_modules/*" -x "frontend/node_modules/*" -x ".git/*" -x "*.zip"
   ```
5. **Distribution Target**: If distributing to an Android/SDCard environment, copy the zip to `/sdcard/storage_v<version>.zip` and remove older archives.

---

## Troubleshooting & FAQ

### 1. The web page shows "Not Connected to Storage"
- Ensure your FTP server daemon is running.
- Verify the IP address, port, username, and password in `config.json`.
- Test if the FTP server is reachable from the machine hosting FTP Cloud Storage:
  ```bash
  nc -zv <ftp_server_ip> 21
  ```

### 2. File uploads fail or show 403 Forbidden
- Ensure your current browser device has been registered and promoted to **Admin** via the Welcome Modal or Admin Console.
- View-only users cannot perform write or delete operations.

### 3. ZIP archive jobs are stuck in queue
- Check the `simulatenous_zip_process` setting in `config.json`. If set to `0`, exactly one ZIP job runs at a time.
- Verify server write permissions in the temporary operating system directory (`/tmp` or `os.tmpdir()`).

### 4. Admin promotion returns "Admin limit reached"
- Check the `admin_counts` setting in `config.json` (default: `1`). Increase the value if you need multiple administrator devices.

---

## Support & Donations

If you find **FTP Cloud Storage** helpful and would like to support its ongoing development and maintenance, consider buying a coffee or donating via:

- ☕ **Ko-fi**: [ko-fi.com/mininxd](https://ko-fi.com/mininxd)
- 💛 **Saweria**: [saweria.co/mininxd](https://saweria.co/mininxd)

Your support is greatly appreciated and helps keep the project fast, secure, and actively updated!

---

## License

This project is licensed under the [ISC License](./LICENSE).
