const { BrowserWindow, screen, getCurrentWindow, session } = require('electron').remote;
import { urls, adminUsers } from '../constants.js';

const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';

export async function getUserRole() {
  const userEmail = await getUserEmail();
  if (userEmail === 'guest') {
    return 'guest';
  } else if (userEmail === 'unknown') {
    return 'unknown';
  } else if (adminUsers.find((adminEmail) => adminEmail === userEmail)) {
    return 'admin';
  } else {
    return 'member';
  }
}

export async function getUserEmail() {
  const authCookie = await session.defaultSession.cookies.get({ url: 'https://microsoft.sharepoint.com', name: 'FedAuth' });
  if (!authCookie.length) {
    return 'guest';
  }

  try {
    const email = atob(authCookie[0].value)
      .split(',')
      .filter((item) => item.includes('@microsoft'))[0]
      .split('|')
      .pop();

    return email;
  } catch (e) {
    console.log('[auth] cannot parse user email from cookie');
    return 'unknown';
  }
}

export async function signOut() {
  return new Promise((resolve, reject) => {
    console.log('[auth] sign out: start');

    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });

    tempWindow.loadURL(urls.viewEnvironments);

    tempWindow.webContents.on('dom-ready', () => {
      tempWindow.webContents.session.clearStorageData();
      tempWindow.webContents.session.clearCache(() => {});
      tempWindow.webContents.session.clearHostResolverCache();
      tempWindow.webContents.session.clearAuthCache({ type: 'password' });
      tempWindow.webContents.session.clearAuthCache({ type: 'clientCertificate' });
      console.log('[auth] sign out: success. all data cleared');
      tempWindow.destroy();
      resolve();
    });
  });
}

export async function signIn() {
  return new Promise((resolve, reject) => {
    console.log('[auth] sign in: start');
    let display = screen.getPrimaryDisplay();
    const currentWindow = getCurrentWindow();
    let width = display.bounds.width;

    const tempWindow = new BrowserWindow({
      parent: currentWindow,
      modal: true,
      width: 436,
      height: 808,
      x: width - 444,
      y: 16,
    });

    tempWindow.setMenu(null);

    tempWindow.loadURL(urls.viewEnvironments);

    tempWindow.webContents.on('dom-ready', () => {
      const url = tempWindow.webContents.getURL();
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        console.log('[auth] sign in: SSO page displayed');
      }

      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        console.log('[auth] sign in: success. Close window');
        tempWindow.webContents.session.flushStorageData();
        tempWindow.destroy();
        resolve();
      }
    });
  });
}
