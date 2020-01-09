const puppeteer = require('puppeteer-core');
const { ipcRenderer } = require('electron');

const chromiumExecPromise = new Promise(resolve => {
  // version comes from latest pupeeter release: https://github.com/puppeteer/puppeteer/releases
  ipcRenderer.send('download-chromium', { revision: 706915 });
  ipcRenderer.on('onDownloadProgress', (event, { percent }) => {
    console.log(percent);
  });

  ipcRenderer.on('onDownloadComplete', (event, { exec }) => {
    console.log('Complete!');
    console.log(exec);
    resolve(exec);
  });
});

async function initializeChromium() {
  await chromiumExecPromise;
}

async function signInDynamicsUCApp(url, username, password) {
  const chromiumExec = await chromiumExecPromise;

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: chromiumExec });

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

module.exports = {
  signInDynamicsUCApp,
  initializeChromium,
};
