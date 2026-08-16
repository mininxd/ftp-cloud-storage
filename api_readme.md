# Mininxd FTP Server API Documentation

Welcome to the **Mininxd FTP Server & Web Management API** reference. This backend provides high-performance FTP file operations, device fingerprint authentication, and storage analytics.

---

## 1. General Information & Configuration

- **Configuration File**: `config.json`
  ```json
  {
    "ftp_server": "127.0.0.1",
    "ftp_port": 21,
    "ftp_name": "Mininxd Storage",
    "ftp_user": "ftpuser",
    "ftp_password": "YourFtpPassword123",
    "storage_in_GB": 32
  }
  ```
- **Default Port**: `3690` (Configurable via `PORT` environment variable)
- **Base URL**: `http://<server-ip>:3690`
- **Database**: SQLite (`devices.db`)
- **Default Storage Capacity**: Configurable via `storage_in_GB` in `config.json` or `MAX_CAPACITY` environment variable.

---

## 2. Authentication & Authorization

All requests can supply a unique **Device Fingerprint** (`0x{32_hex_characters}`) and personal **Master Key** via:
1. **Headers**: `x-device-fingerprint: 0x...` and `x-master-key: YourMasterKey`
2. **JSON Body**: `{ "fingerprint": "0x...", "masterkey": "YourMasterKey" }`
3. **Query Parameters**: `?fingerprint=0x...&masterkey=...`
4. **Admin URL Navigation**: `http://<server-ip>:3690/<user_id>` (e.g. `http://localhost:3690/0x11112222333344445555666677778888`)
   - If `user_id` matches the verified physical device and valid Master Key, admin access is unlocked.
   - If invalid or view-only, the page rejects entry and redirects back.

### Roles & Permissions
| Role | Capabilities |
| :--- | :--- |
| **Admin (`isAdmin: 1`)** | Full read & write permissions (Upload, Create File, Save/Edit, Create Folder, Rename, Copy, Move, Delete, Batch Delete, Download). |
| **View-Only (`isAdmin: 0`)** | Read-only access (List directories, Preview images/media, Download files/ZIPs, View text, View storage). Mutating requests return `403 Forbidden`. |

---

## 3. API Endpoints Reference

### 3.1 Device Authentication & User Management

#### `POST /api/verify` (or `/verify`, `GET /verify`)
Registers a new device fingerprint into SQLite or checks existing verification & authorization status.

- **Request Body**:
  ```json
  {
    "fingerprint": "0x11112222333344445555666677778888"
  }
  ```
- **Response (Admin)**:
  ```json
  {
    "success": true,
    "verified": true,
    "isNew": false,
    "fingerprint": "0x11112222333344445555666677778888",
    "isAdmin": true,
    "requiresMasterKey": true
  }
  ```
- **Response (Normal View-Only User)**:
  ```json
  {
    "success": true,
    "fingerprint": "0xaaaabbbbccccddddeeeeffff00001111"
  }
  ```

---

#### `POST /api/verify_masterkey`
Verifies an administrator's Master Key with brute-force rate-limiting and timing attack protection.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
- **Request Body**:
  ```json
  {
    "masterkey": "YourSecureMasterKey123!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "valid": true
  }
  ```

---

#### `GET /api/list_user` (or `/list_user`, `POST /list_user`)
Lists all registered users/devices from SQLite (Admin Only).

- **Response**:
  ```json
  [
    {
      "userid": "0x11112222333344445555666677778888",
      "roles": "admin",
      "isAdmin": true,
      "createdAt": "2026-08-12T00:00:00.000Z"
    },
    {
      "userid": "0xaaaabbbbccccddddeeeeffff00001111",
      "roles": "user",
      "isAdmin": false,
      "createdAt": "2026-08-12T00:05:00.000Z"
    }
  ]
  ```

---

#### `POST /api/add_admin` (or `/add_admin`, `GET /add_admin`)
Promotes a user to admin or configures initial administrator with required Master Key.

- **Request Body / Query**:
  ```json
  {
    "userid": "0xaaaabbbbccccddddeeeeffff00001111",
    "masterkey": "YourSecureMasterKey123!"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "User 0xaaaabbbbccccddddeeeeffff00001111 promoted to admin",
    "userid": "0xaaaabbbbccccddddeeeeffff00001111",
    "roles": "admin",
    "isAdmin": true
  }
  ```
- **Error Response (Unauthorized)**:
  ```json
  {
    "success": false,
    "error": "Unauthorized: Action not allowed"
  }
  ```

---

#### `POST /api/remove_admin` (or `/remove_admin`, `GET /remove_admin`)
Demotes an admin user to standard view-only user (`isAdmin: 0` and clears `masterkey`).

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body / Query**:
  ```json
  {
    "userid": "0xaaaabbbbccccddddeeeeffff00001111"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Admin privileges removed for user 0xaaaabbbbccccddddeeeeffff00001111",
    "userid": "0xaaaabbbbccccddddeeeeffff00001111",
    "roles": "user",
    "isAdmin": false
  }
  ```

---

#### `POST /api/change_masterkey` (or `/change_masterkey`)
Updates the personal Master Key for an administrator in SQLite database.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "userid": "0x11112222333344445555666677778888",
    "newMasterKey": "MyNewSecureKey123!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Master key updated successfully for admin 0x11112222333344445555666677778888",
    "userid": "0x11112222333344445555666677778888"
  }
  ```

---

### 3.2 Server Health & Heartbeat

#### `GET /api/ftp/heartbeat` (or `/api/health`, `/ftp/heartbeat`)
Checks connectivity to the FTP server.

- **Response**:
  ```json
  {
    "success": true,
    "connected": true,
    "message": "FTP server connected and responsive",
    "host": "127.0.0.1",
    "port": 21,
    "timestamp": 1723261500000
  }
  ```

---

### 3.3 File & Directory Browsing

#### `GET /api/ftp/list` (or `POST /api/ftp/list`, `/ftp/list`)
Lists files and directories in a given path.

- **Query / Body Parameters**:
  - `path` (string, optional): Directory path (default `/`).
- **Response**:
  ```json
  {
    "success": true,
    "path": "/",
    "data": [
      {
        "name": "documents",
        "type": 2,
        "isDirectory": true,
        "size": 0,
        "itemCount": 5,
        "modifiedAt": "2026-08-12 10:00:00"
      },
      {
        "name": "notes.txt",
        "type": 1,
        "isDirectory": false,
        "size": 1024,
        "modifiedAt": "2026-08-12 10:05:00"
      }
    ]
  }
  ```

---

#### `GET /api/ftp/storage-info` (or `/ftp/storage-info`)
Calculates exact FTP storage usage and reports total capacity in `X/YGB` format.

- **Query Parameters**:
  - `refresh` (boolean, optional): Force cache invalidation and fresh scan (`true`/`false`).
  - `capacityGb` (number, optional): Override total disk size in GB.
- **Response**:
  ```json
  {
    "success": true,
    "cached": false,
    "usedBytes": 25680123,
    "totalBytes": 34359738368,
    "freeBytes": 34334058245,
    "usedFormatted": "24.5 MB",
    "totalFormatted": "32 GB",
    "freeFormatted": "32.0 GB",
    "compactDisplay": "24.5MB/32GB",
    "percentage": 0.07,
    "fileCount": 18,
    "folderCount": 4,
    "timestamp": 1723261500000
  }
  ```

---

### 3.4 File Viewing, Reading & Downloading

#### `GET /api/ftp/read-file`
Reads UTF-8 text content for the code/text editor.

- **Query Parameters**:
  - `path` (string, required): File path.
- **Response**:
  ```json
  {
    "success": true,
    "path": "/notes.txt",
    "content": "Hello World\nThis is text content."
  }
  ```

---

#### `GET /api/ftp/view-file`
Streams an image, audio, or video file with HTTP Range support for media seeking.

- **Query Parameters**:
  - `path` (string, required): File path.

---

#### `GET /api/ftp/download`
Downloads a single file as a browser attachment.

- **Query Parameters**:
  - `path` (string, required): File path.

---

### 3.5 Write & Mutating Operations *(Admin Only)*

> [!NOTE]
> All mutating operations require dual-factor authorization: an authorized Admin fingerprint and Master Key passed via headers (`x-device-fingerprint`, `x-master-key`) or body payload.

#### `POST /api/ftp/upload`
Uploads a file to FTP with server-side caching for automatic disconnection retries.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: Binary file.
  - `path`: Target directory path (e.g. `/`).
- **Response**:
  ```json
  {
    "success": true,
    "message": "Uploaded example.jpg",
    "path": "/example.jpg",
    "uploadId": "up_1723261500_abc123"
  }
  ```

---

#### `POST /api/ftp/save-file`
Saves updated content to an existing or new text file directly.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "path": "/config.json",
    "content": "{\n  \"theme\": \"dracula\"\n}"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Saved config.json",
    "path": "/config.json"
  }
  ```

---

#### `POST /api/ftp/mkdir`
Creates a new directory on FTP.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "path": "/",
    "dirname": "new_folder"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Directory new_folder created",
    "path": "/new_folder"
  }
  ```

---

#### `POST /api/ftp/rename`
Renames a file or directory (handles case-only changes seamlessly).

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "oldPath": "/old_name.txt",
    "newPath": "/new_name.txt"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Renamed old_name.txt to new_name.txt",
    "oldPath": "/old_name.txt",
    "newPath": "/new_name.txt"
  }
  ```

---

#### `POST /api/ftp/copy`
Copies one or more files or directories recursively.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "items": [
      { "path": "/file1.txt", "isDir": false, "name": "file1.txt" },
      { "path": "/docs", "isDir": true, "name": "docs" }
    ],
    "targetDir": "/backup"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Copied 2 item(s)",
    "count": 2,
    "targetDir": "/backup"
  }
  ```

---

#### `POST /api/ftp/move` (or `/api/ftp/cut`)
Moves/cuts one or more files or directories to a destination directory.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Request Body**:
  ```json
  {
    "items": [
      { "path": "/file1.txt", "isDir": false, "name": "file1.txt" }
    ],
    "targetDir": "/archive"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Moved 1 item(s)",
    "count": 1,
    "targetDir": "/archive"
  }
  ```

---

#### `DELETE /api/ftp/delete` (or `POST /api/ftp/delete`)
Deletes a file or directory recursively.

- **Headers**:
  - `x-device-fingerprint: 0x11112222333344445555666677778888`
  - `x-master-key: YourSecureMasterKey123!`
- **Query / Body Parameters**:
  - `path`: Target file or folder path.
  - `isDir`: `true` if target is a folder.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Deleted /old_file.txt",
    "path": "/old_file.txt"
  }
  ```

---

### 3.6 Archive & Batch ZIP Operations

#### `POST /api/ftp/create-zip-job`
Starts a non-blocking background job to download and bundle multiple files/folders into a ZIP archive.

- **Request Body**:
  ```json
  {
    "baseDir": "/",
    "files": ["file1.txt", "folderA"],
    "zipName": "archive.zip"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "jobId": "job_1723261500_xyz789",
    "status": "pending",
    "totalFiles": 2
  }
  ```

---

#### `GET /api/ftp/zip-job-status`
Polls the progress of a background ZIP job.

- **Query Parameters**:
  - `jobId` (string, required): Job identifier.
- **Response**:
  ```json
  {
    "success": true,
    "jobId": "job_1723261500_xyz789",
    "status": "completed",
    "progressPct": 100,
    "downloadedFiles": 2,
    "totalFiles": 2,
    "downloadUrl": "/api/ftp/zip-job-download?jobId=job_1723261500_xyz789"
  }
  ```

---

#### `GET /api/ftp/zip-job-download`
Downloads the completed ZIP archive created by a background job.

- **Query Parameters**:
  - `jobId` (string, required): Completed job identifier.

---

#### `GET /api/ftp/download-zip` (or `POST /api/ftp/download-zip`)
Direct streaming ZIP download for multiple files or entire folders.

- **Query / Body Parameters**:
  - `baseDir`: Base directory (e.g. `/`).
  - `files`: Comma-separated or JSON array of filenames.
  - `zipName`: Output zip filename (e.g. `download.zip`).

---

### 3.6 System & Version Information

#### `GET /api/versions` (or `/versions`, `GET /api/version`, `/version`)
Retrieves semantic version information and markdown release changelog from `version.md`.

- **Query Parameters**:
  - `raw` (boolean, optional): Set to `true` to receive plain markdown (`text/markdown`).
  - `format` (string, optional): Set to `markdown` or `text`.
- **Response (JSON default)**:
  ```json
  {
    "success": true,
    "version": "1.6.1",
    "content": "# Mininxd FTP Server Version & Release History\n..."
  }
  ```

---

#### `GET /api/health` (or `/api/ftp/heartbeat`)
Health and latency probe checking connection to the underlying FTP server.

- **Response**:
  ```json
  {
    "success": true,
    "status": "connected",
    "host": "127.0.0.1",
    "port": 21,
    "latencyMs": 4,
    "timestamp": 1723514600000
  }
  ```

---

#### `GET /api/system_info` (or `/system_info`, `GET /api/system-info`, `/system-info`)
Returns live server system diagnostics including CPU load, RAM usage, Uptime, OS, and Termux/Android metrics when enabled.

- **Response (Ubuntu mode)**:
  ```json
  {
    "success": true,
    "mode": "ubuntu",
    "cpu": {
      "usagePercent": 14,
      "cores": 8,
      "model": "ARMv8 Processor",
      "loadAvg": [0.45, 0.52, 0.48]
    },
    "memory": {
      "totalBytes": 8074567680,
      "usedBytes": 3221225472,
      "freeBytes": 4853342208,
      "usagePercent": 40,
      "totalFormatted": "7.52 GB",
      "usedFormatted": "3.00 GB",
      "freeFormatted": "4.52 GB"
    },
    "os": {
      "platform": "linux",
      "arch": "arm64",
      "hostname": "localhost",
      "nodeVersion": "v20.x.x",
      "systemUptimeFormatted": "5d 12h 30m"
    }
  }
  ```

---

#### `WebSocket /ws/system_info`
Real-time full-duplex WebSocket stream for live server telemetry without polling.

- **URL**: `ws://<server-ip>:3690/ws/system_info` (or `wss://`)
- **Broadcast Interval**: Automatically streams updated telemetry JSON every 1.5 seconds when active clients are connected.
- **Client Actions**: Send `{"action":"refresh"}` or `{"action":"ping"}` to trigger immediate telemetry recalculation.

---

## 4. HTTP Status Codes & Error Format

All error responses return a standardized JSON structure:

```json
{
  "success": false,
  "error": "Unauthorized: Action not allowed"
}
```

| HTTP Code | Description |
| :--- | :--- |
| `200 OK` | Request succeeded. |
| `400 Bad Request` | Missing required parameters or invalid request body. |
| `401 Unauthorized` | Invalid master key provided. |
| `403 Forbidden` | Non-admin / unauthorized device attempted a mutating write operation. |
| `404 Not Found` | File, directory, or cached upload job not found. |
| `429 Too Many Requests` | Rate limit triggered due to too many failed master key attempts. |
| `500 Server Error` | FTP connection error or file system operation failure. |

---

## 5. cURL Quick Examples

### Verify User Fingerprint
```bash
curl -X POST http://localhost:3690/api/verify \
  -H "Content-Type: application/json" \
  -d '{"fingerprint": "0x11112222333344445555666677778888"}'
```

### Verify Master Key
```bash
curl -X POST http://localhost:3690/api/verify_masterkey \
  -H "Content-Type: application/json" \
  -H "x-device-fingerprint: 0x11112222333344445555666677778888" \
  -d '{"masterkey": "YourSecureMasterKey123!"}'
```

### List Users (Admin Only)
```bash
curl http://localhost:3690/api/list_user \
  -H "x-device-fingerprint: 0x11112222333344445555666677778888" \
  -H "x-master-key: YourSecureMasterKey123!"
```

### Upload a File (Admin Only)
```bash
curl -X POST http://localhost:3690/api/ftp/upload \
  -H "x-device-fingerprint: 0x11112222333344445555666677778888" \
  -H "x-master-key: YourSecureMasterKey123!" \
  -F "file=@/path/to/document.pdf" \
  -F "path=/"
```

### Save Text File (Admin Only)
```bash
curl -X POST http://localhost:3690/api/ftp/save-file \
  -H "Content-Type: application/json" \
  -H "x-device-fingerprint: 0x11112222333344445555666677778888" \
  -H "x-master-key: YourSecureMasterKey123!" \
  -d '{"path": "/notes.txt", "content": "Hello FTP!"}'
```

### Delete File (Admin Only)
```bash
curl -X DELETE "http://localhost:3690/api/ftp/delete?path=/old_file.txt&isDir=false" \
  -H "x-device-fingerprint: 0x11112222333344445555666677778888" \
  -H "x-master-key: YourSecureMasterKey123!"
```
