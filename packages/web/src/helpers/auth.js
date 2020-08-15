const { BrowserWindow, screen, getCurrentWindow, session } = require('electron').remote;
const puppeteer = require('puppeteer-core');

import { adminUsers, urls } from '../constants.js';
import { sessionDataDir } from './session.js';

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

export async function signOut({ exec }) {
  const fs = require('fs');

  try {
    fs.rmdirSync(sessionDataDir, { recursive: true });
  } catch (error) {
    console.log('[auth] fs sign-out failed. Attemp pupeeter sign-out', error);
    const browser = await puppeteer.launch({ headless: true, userDataDir: sessionDataDir, executablePath: exec });
    const page = (await browser.pages())[0];
    await page.goto(urls.getMetadataEndpoint);
    await page._client.send('Network.clearBrowserCookies');
  }
  console.log('[auth] signed out. User dir purged');
}
