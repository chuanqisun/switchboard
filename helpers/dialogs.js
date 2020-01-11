const { app, dialog, nativeImage } = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, '../build/icon.png');
const messageBoxIcon = nativeImage.createFromPath(iconPath);

function showAbout() {
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

function downloadUpdate() {
  const urls = require('../urls');
  const { shell } = require('electron');
  shell.openExternal(urls.latestReleaseUrl);
}

module.exports = {
  showAbout,
  downloadUpdate,
};
