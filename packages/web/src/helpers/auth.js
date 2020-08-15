const { BrowserWindow, screen, getCurrentWindow, session } = require('electron').remote;
import { adminUsers, urls } from '../constants.js';
import { sessionDataDir } from './session.js';

const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';

export async function getUserRoleFromEmail(email) {
  if (email === 'guest') {
    return 'guest';
  } else if (email === 'unknown') {
    return 'unknown';
  } else if (adminUsers.find((adminEmail) => adminEmail === email)) {
    return 'admin';
  } else {
    return 'member';
  }
}

export function getUserEmailFromCookies(cookies) {
  const authCookie = cookies.filter((c) => c.domain === 'microsoft.sharepoint.com' && c.name === 'FedAuth');
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
  const fs = require('fs');

  fs.rmdirSync(sessionDataDir, { recursive: true });
  console.log('[auth] signed out. User dir purged');
}
