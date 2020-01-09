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

  dialog.showMessageBox(
    {
      buttons: ['Download now', 'Maybe later'],
      title: 'Update available - Switchboard',
      message: `
Switchboard ${latestVersion} is ready for download.
    `.trim(),
      detail: `Your current version is ${currentVersion}.`,
      icon: messageBoxIcon,
      cancelId: 1,
    },
    response => {
      if (response === 0) {
        if (clientProfile.platform === 'win32') {
          openDownloadPage(metadata.win32DownloadUrl);
        } else if (clientProfile.platform === 'darwin') {
          openDownloadPage(metadata.osxDownloadUrl);
        }
      }
    }
  );
}

function openDownloadPage(url) {
  const { shell } = require('electron');

  shell.openExternal(url);
}

module.exports = {
  showAbout,
  showDownloadPrompt,
};
