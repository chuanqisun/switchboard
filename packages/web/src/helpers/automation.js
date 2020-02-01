const puppeteer = require('puppeteer-core');

/**
 *
 * automation strategy:
 *   aad1fa - basic aad flow
 *   mi - market insight flow
 */
export async function autoSignIn({ signInStrategy = 'aad1fa', exec, url, username, password }) {
  console.log('[automation] sign in with strategy: ' + signInStrategy);
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: exec });
  const page = (await browser.pages())[0];
  page.goto(url);

  switch (signInStrategy) {
    case 'mi':
      return signInMarketInsight({ page, exec, url, username, password });
    case 'aad1fa':
      return signInAADSingleFactor({ page, exec, url, username, password });
    default:
      console.log('unknown automation strategy');
  }
}

async function signInMarketInsight({ page, exec, url, username, password }) {
  await clickButton(page, 'button#AzureADExchange');
  await signInAADSingleFactor({ page, exec, url, username, password });
}

async function signInAADSingleFactor({ page, exec, url, username, password }) {
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
