const { app, dialog } = require('electron').remote;
import { openLatestRelease } from './open-external.js';
import { chromium } from '../constants.js';

export function showAbout() {
  dialog.showMessageBox({
    buttons: ['Close'],
    title: 'Switchboard',
    type: 'info',
    message: `
Version ${app.getVersion()}
Platform ${process.platform}
Node ${process.versions.node}
Chrome ${process.versions.chrome}
Electron ${process.versions.electron}
Puppeteer ${getPuppeteerVersion()}
Puppeteer Chromium ${chromium.publicVersion}
    `.trim(),
  });
}

function getPuppeteerVersion() {
  const path = require('path');
  try {
    const packageJson = require(path.join(require('puppeteer-core')._projectRoot, 'package.json'));
    return packageJson.version;
  } catch (e) {
    console.log('[dialog] get puppeteer version failed');
    console.dir(e);
    return 'unknown';
  }
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
    openLatestRelease();
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
