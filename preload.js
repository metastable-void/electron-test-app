
const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('menheraNative', {
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
});
