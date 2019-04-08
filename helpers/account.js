const {BrowserWindow} = require('electron')
const environmentDataFileLocation = 'https://microsoft.sharepoint.com/teams/Live.Drive.Repeat2/Shared%20Documents/General/Environments/environments.txt';
const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';

async function checkSignInStatus() {
  return new Promise((resolve, reject) => {
    console.log('[acount] check login status: start');
    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });
    
    tempWindow.loadURL(environmentDataFileLocation);

    tempWindow.webContents.on('dom-ready', () => {
      const url = tempWindow.webContents.getURL()
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        tempWindow.destroy();
        resolve(false);
        console.log('[acount] check sign in status: not signed in');
      }
      
      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        tempWindow.destroy();
        resolve(true);
        console.log('[acount] check sign in status: signed in');
      }
    });
  });
}

async function signOut() {
  return new Promise((resolve, reject) => {
    console.log('[acount] sign out: start');

    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });
    
    tempWindow.loadURL(environmentDataFileLocation);

    tempWindow.webContents.on('dom-ready', () => {
        tempWindow.webContents.session.clearStorageData();
        tempWindow.webContents.session.clearCache(() => {});
        tempWindow.webContents.session.clearHostResolverCache();
        tempWindow.webContents.session.clearAuthCache({type: 'password'});
        tempWindow.webContents.session.clearAuthCache({type: 'clientCertificate'});
        console.log('[acount] sign out: success. all data cleared');
        tempWindow.destroy();
        resolve();
    });
  });
}

async function signIn(parentWindow) {
  return new Promise((resolve, reject) => {
    console.log('[acount] sign in: start');
    const {screen} = require('electron');
    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;

    const tempWindow = new BrowserWindow({
      parent: parentWindow,
      modal: true,
      width: 376,
      height: 808,
      x: width - 384,
      y: 16,
    });

    tempWindow.setMenu(null);
    
    tempWindow.loadURL(environmentDataFileLocation);

    tempWindow.webContents.on('dom-ready', () => {
      const url = tempWindow.webContents.getURL()
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        console.log('[acount] sign in: SSO page displayed');
      }
      
      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        console.log('[acount] sign in: success. Close window');
        tempWindow.webContents.session.flushStorageData();
        tempWindow.destroy();
        resolve();
      }
    });
  });
}

module.exports = {
  checkSignInStatus,
  signOut,
  signIn,
}
