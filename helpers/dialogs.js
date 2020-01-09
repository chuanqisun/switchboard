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

function showDownloadPrompt({ metadata, clientProfile }) {
  const latestVersion = metadata.supportedAppVersions[metadata.supportedAppVersions.length - 1];
  const currentVersion = clientProfile.appVersion;
  const systemConfig = require('../system-config');

  dialog
    .showMessageBox({
      title: 'Switchboard',
      type: 'question',
      message: `Updates are available`,
      detail: `The latest version is ${latestVersion}. Your current version is ${currentVersion}.`,
      defaultId: 0,
      cancelId: 1,
      noLink: true,
      buttons: ['Download from GitHub', 'Cancel'],
    })
    .then(({ response }) => {
      if (response === 0) {
        const { shell } = require('electron');
        shell.openExternal(systemConfig.latestReleaseUrl);
      }
    });
}

module.exports = {
  showAbout,
  showDownloadPrompt,
};
