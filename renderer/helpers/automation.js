const puppeteer = require('puppeteer-core');

export async function signInDynamicsUCApp(exec, url, username, password) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: exec });

  const page = (await browser.pages())[0];

  page.goto(url);

  await fillInput(page, 'input[type="email"]', username);
  await clickButton(page, 'input[type="submit"][value="Next"]');
  await fillInput(page, 'input[type="password"]', password);
  await clickButton(page, 'input[type="submit"][value="Sign in"]');
  await clickButton(page, 'input[type="submit"][value="Yes"]');
}

async function clickButton(page, selector) {
  const submitButton = await page.waitFor(selector);
  await submitButton.click();
}

async function fillInput(page, selector, content) {
  const input = await page.waitFor(selector);
  await input.focus();
  await page.keyboard.type(content);
}
