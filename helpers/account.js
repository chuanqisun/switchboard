const { BrowserWindow } = require('electron');
const urls = require('../urls');

const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';

async function signOut() {
  return new Promise((resolve, reject) => {
    console.log('[account] sign out: start');

    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });

    tempWindow.loadURL(urls.getEnvironmentsEndpoint);

    tempWindow.webContents.on('dom-ready', () => {
      tempWindow.webContents.session.clearStorageData();
      tempWindow.webContents.session.clearCache(() => {});
      tempWindow.webContents.session.clearHostResolverCache();
      tempWindow.webContents.session.clearAuthCache({ type: 'password' });
      tempWindow.webContents.session.clearAuthCache({ type: 'clientCertificate' });
      console.log('[account] sign out: success. all data cleared');
      tempWindow.destroy();
      resolve();
    });
  });
}

async function signIn(parentWindow) {
  return new Promise((resolve, reject) => {
    console.log('[account] sign in: start');
    const { screen } = require('electron');
    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;

    const tempWindow = new BrowserWindow({
      parent: parentWindow,
      modal: true,
      width: 436,
      height: 808,
      x: width - 444,
      y: 16,
    });

    tempWindow.setMenu(null);

    tempWindow.loadURL(urls.getEnvironmentsEndpoint);

    tempWindow.webContents.on('dom-ready', () => {
      const url = tempWindow.webContents.getURL();
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        console.log('[account] sign in: SSO page displayed');
      }

      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        console.log('[account] sign in: success. Close window');
        tempWindow.webContents.session.flushStorageData();
        tempWindow.destroy();
        resolve();
      }
    });
  });
}

module.exports = {
  signOut,
  signIn,
};
