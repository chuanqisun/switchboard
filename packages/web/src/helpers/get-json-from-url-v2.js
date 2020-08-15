const puppeteer = require('puppeteer-core');
import { sessionDataDir } from './session.js';

const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
export const rejectReasonSignedOut = 'signed-out';
export const rejectReasonInvalidJson = 'invalid-json';

export async function getJsonFromUrl({ exec, url, humanAuth, onCookies }) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: exec, userDataDir: sessionDataDir });
  const page = (await browser.pages())[0];
  await page.goto(url);

  if (!humanAuth) {
    const resultUrl = page.url();
    if (resultUrl.indexOf(signInBlockerUrlPrefix) === 0) {
      await page.close();

      throw rejectReasonSignedOut;
    }
  }

  let result;

  if (humanAuth) {
    // stay signed in to prevent sign-in form from blocking reading data
    // make sure this is non-blocking
    page.waitFor('input[type="submit"][value="Yes"]').then((button) => button.click());
  }

  try {
    const fileContent = await page.waitForSelector('body > pre:first-child', { timeout: humanAuth ? 0 : 30000 });
    const elementHandle = await fileContent.getProperty('textContent');
    const fileString = await elementHandle.jsonValue();
    result = JSON.parse(fileString);
  } catch (e) {
    console.log('[get-json-from-url]', e);
  }

  if (typeof onCookies === 'function') {
    const cookies = await page.cookies();
    await onCookies(cookies);
  }

  await page.close();

  if (!result) {
    throw rejectReasonInvalidJson;
  }

  return result;
}
