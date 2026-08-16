import { WebSocketServer } from 'ws';
import { getSystemInfo } from './systemInfo.js';

let wss = null;
let broadcastTimer = null;

export function initSystemWebSocket(server) {
    wss = new WebSocketServer({ server, path: '/ws/system_info' });

    function broadcastTelemetry() {
        if (!wss || wss.clients.size === 0) {
            if (broadcastTimer) {
                clearInterval(broadcastTimer);
                broadcastTimer = null;
            }
            return;
        }

        try {
            const info = getSystemInfo();
            const message = JSON.stringify(info);
            for (const client of wss.clients) {
                if (client.readyState === 1 /* OPEN */) {
                    client.send(message);
                }
            }
        } catch (err) {
            console.error('[WS Telemetry Error]:', err.message || err);
        }
    }

    function ensureBroadcastTimer() {
        if (!broadcastTimer && wss && wss.clients.size > 0) {
            broadcastTimer = setInterval(broadcastTelemetry, 1500);
        }
    }

    wss.on('connection', (ws, req) => {
        // Send initial telemetry packet immediately
        try {
            const info = getSystemInfo();
            ws.send(JSON.stringify(info));
        } catch (e) {}

        ensureBroadcastTimer();

        ws.on('message', (message) => {
            try {
                const parsed = JSON.parse(message.toString());
                if (parsed.action === 'refresh' || parsed.action === 'ping') {
                    const info = getSystemInfo();
                    ws.send(JSON.stringify(info));
                }
            } catch (e) {}
        });

        ws.on('close', () => {
            if (wss.clients.size === 0 && broadcastTimer) {
                clearInterval(broadcastTimer);
                broadcastTimer = null;
            }
        });

        ws.on('error', (err) => {
            console.error('[WS Client Error]:', err.message || err);
        });
    });

    console.log('[WebSocket] System Telemetry WebSocket initialized on /ws/system_info');
    return wss;
}
