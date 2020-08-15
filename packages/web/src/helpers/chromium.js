import { chromium } from '../constants.js';
import { deleteFolderRecursive } from './fs.js';
import { reloadWindow } from './window.js';

export function getChromiumInstallPath() {
  const { app } = require('electron').remote;

  const userDataPath = app.getPath('userData');
  const path = require('path');

  return path.join(userDataPath, 'local-chromium');
}

export function getChromiumRevision() {
  return chromium.revision;
}

export function resetChromium() {
  const os = require('os');

  const cacheRoot = `${os.homedir()}/.chromium-cache`;

  try {
    deleteFolderRecursive(getChromiumInstallPath());
    console.log('[chromium] installed version removed');

    deleteFolderRecursive(cacheRoot);
    console.log('[chromium] cache removed');

    reloadWindow();
  } catch (e) {
    console.log('[chromium] failed:');
    console.dir(e);
  }
}
