const { app, dialog } = require('electron').remote;
import { urls } from '../../urls.js';
const { shell } = require('electron').remote;

export function showAbout() {
  dialog.showMessageBox({
    buttons: ['Close'],
    title: 'Switchboard',
    type: 'info',
    message: `
Version ${app.getVersion()}
Platform ${process.platform}
-----------------
Node ${process.versions.node}
Chrome ${process.versions.chrome}
Electron ${process.versions.electron}
    `.trim(),
  });
}

export async function updateAvailable({ latestVersion, currentVersion }) {
  const dialogResult = await dialog.showMessageBox({
    title: 'Switchboard',
    type: 'question',
    message: `Updates are available`,
    detail: `The latest version is ${latestVersion}. Your current version is ${currentVersion}.`,
    defaultId: 0,
    cancelId: 1,
    noLink: true,
    buttons: ['Download from GitHub', 'Cancel'],
  });

  if (dialogResult.response === 0) {
    downloadUpdate();
  }
}

export function noUpdates({ currentVersion }) {
  dialog.showMessageBox({
    title: 'Switchboard',
    type: 'info',
    message: `There are no updates available. Your version ${currentVersion} is the latest.`,
    noLink: true,
    buttons: ['OK'],
  });
}

// TODO refactor this to separate util
export function downloadUpdate() {
  shell.openExternal(urls.latestReleaseUrl);
}
