
const {app, BrowserWindow, protocol} = require('electron');
const path = require('path');

const ERR_ADDRESS_INVALID = -108;
const ERR_NAME_NOT_RESOLVED = -105;

const PRIVILEGED_SCHEMES = [
    {
        scheme: 'menhera-app',
        privileges: {
            standard: true,
            secure: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
        },
    }
];
protocol.registerSchemesAsPrivileged(PRIVILEGED_SCHEMES);

const APP_BASE_PATH = path.join(app.getAppPath(), 'app');


const openAppWindow = () => {
    const w = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), 'preload.js'),
        },
    });

    w.loadURL('menhera-app://localhost/index.html');
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        openAppWindow();
    }
});

app.whenReady().then(() => {
    protocol.registerFileProtocol('menhera-app', (request, callback) => {
        const matches = request.url.match(/^[^:]+:\/\/([^/]+)([^?#]*)/);
        if (!matches) {
            callback({
                error: ERR_ADDRESS_INVALID,
            });
        } else if ('localhost' !== matches[1]) {
            callback({
                error: ERR_NAME_NOT_RESOLVED,
            });
        } else {
            callback({
                path: path.join(APP_BASE_PATH, matches[2]),
                headers: {
                    'Content-Security-Policy': [
                        "default-src 'self'; connect-src http: https: ws: wss: menhera-app:; base-uri 'none'; form-action 'none'; navigate-to 'self'; frame-ancestors 'none'"
                    ]
                }
            });
        }
    });
    openAppWindow();
});

