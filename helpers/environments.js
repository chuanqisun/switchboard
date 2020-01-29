const { BrowserWindow, screen } = require('electron').remote;
import { urls } from '../urls.js';

// TODO share url with auth.js
const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';
const getEnvironmentsEndpoint = 'https://aka.ms/switchboard-environments-v2';
export const rejectReasonSignedOut = 'signed-out';
export const rejectReasonInvalidEnvironmentsJson = 'invalid-environment-json';

export async function getEnvironments() {
  return new Promise((resolve, reject) => {
    console.log('[environments-context] get environments: start');
    const tempWindow = new BrowserWindow({
      show: false,
    });

    tempWindow.loadURL(getEnvironmentsEndpoint);

    tempWindow.webContents.on('dom-ready', async () => {
      const url = tempWindow.webContents.getURL();
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        tempWindow.destroy();
        reject('signed-out');
      }

      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        console.log('[environments-context] signed in');
        try {
          const result = await tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`);
          tempWindow.destroy();
          const resultObject = JSON.parse(result);
          resolve(resultObject);
        } catch (e) {
          console.log(e);
          reject('invalid-environments-json');
        }
      }
    });
  });
}

export async function editEnvironments() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  const tempWindow = new BrowserWindow({
    width: 800,
    height: height - 64,
    x: Math.max(16, width - 16 - 420 - 16 - 800),
    y: 16,
  });

  tempWindow.setMenu(null);
  tempWindow.loadURL(urls.editEnvironmentsEndpoint);
}
