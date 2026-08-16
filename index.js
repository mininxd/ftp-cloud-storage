import express from 'express';
import http from 'http';
import path from 'path';
import { PORT, ROOT_DIR } from './lib/config.js';
import { initSystemWebSocket } from './lib/systemWs.js';

// Import Route Modules
import configRoutes from './routes/config.routes.js';
import authRoutes from './routes/auth.routes.js';
import systemRoutes from './routes/system.routes.js';
import browseRoutes from './routes/browse.routes.js';
import storageRoutes from './routes/storage.routes.js';
import mutationsRoutes from './routes/mutations.routes.js';
import zipRoutes from './routes/zip.routes.js';
import publicRoutes from './routes/public.routes.js';

const app = express();
const server = http.createServer(app);

// Initialize WebSocket Telemetry Stream
initSystemWebSocket(server);

// Security & Express Middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verbose HTTP Request Logger
app.use((req, res, next) => {
    const start = Date.now();
    const fp = req.headers['x-device-fingerprint'] || req.headers['x-fingerprint'] || req.query?.fingerprint || req.body?.fingerprint || '-';
    const hasMk = Boolean(req.headers['x-master-key'] || req.headers['x-masterkey'] || req.body?.masterkey || req.query?.masterkey);
    const ip = req.ip || req.socket?.remoteAddress || '-';

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`[HTTP] ${req.method} ${req.originalUrl || req.url} -> ${color}${status}${reset} (${duration}ms) | IP: ${ip} | FP: ${fp} | MK: ${hasMk ? 'YES' : 'NO'}`);
    });
    next();
});

// Static Frontend Bundle (Vite output)
app.use(express.static(path.join(ROOT_DIR, 'frontend', 'dist')));

// Mount API Routes
app.use(configRoutes);
app.use(authRoutes);
app.use(systemRoutes);
app.use(browseRoutes);
app.use(storageRoutes);
app.use(mutationsRoutes);
app.use(zipRoutes);
app.use(publicRoutes);

// Fallback Route for SPA Client-Side Routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'frontend', 'dist', 'index.html'));
});

// Start Server
server.listen(PORT, () => {
    console.log(`Mininxd Server is running at http://localhost:${PORT}`);
});

export { app, server };
export default app;
