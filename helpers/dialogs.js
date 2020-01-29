const { app, dialog, nativeImage } = require('electron').remote;
const path = require('path');
const iconPath = path.join(__dirname, '../build/icon.png');
const messageBoxIcon = nativeImage.createFromPath(iconPath);
import { urls } from '../urls.js';
const { shell } = require('electron').remote;

export function showAbout() {
  dialog.showMessageBox({
    buttons: ['Close'],
    title: 'About - Switchboard',
    message: `
Version ${app.getVersion()}
Platform ${process.platform}
-----------------
Node ${process.versions.node}
Chrome ${process.versions.chrome}
Electron ${process.versions.electron}
    `.trim(),
    icon: messageBoxIcon,
  });
}

export function downloadUpdate() {
  shell.openExternal(urls.latestReleaseUrl);
}

module.exports = {
  showAbout,
  downloadUpdate,
};
