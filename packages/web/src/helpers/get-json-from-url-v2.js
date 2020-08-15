const puppeteer = require('puppeteer-core');
const { app } = require('electron').remote;
const path = require('path');
const userDataPath = app.getPath('userData');
const userDataDir = path.join(userDataPath, 'chrome-session');

export async function getJsonFromUrl({ exec, url }) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: exec, userDataDir });
  const page = (await browser.pages())[0];
  await page.goto(url);

  const result = await page.evaluate(() => {
    const string = document.querySelector('pre').innerText;
    const resultObject = JSON.parse(string);
    return resultObject;
  });

  await page.close();
  return result;
}
