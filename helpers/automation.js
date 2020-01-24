const puppeteer = require('puppeteer-core');

const chromiumExecPromise = new Promise(resolve => {
  // version comes from latest pupeeter release: https://github.com/puppeteer/puppeteer/releases
  const download = require('download-chromium');
  const path = require('path');
  const { app } = require('electron').remote;
  const revision = 706915;

  const userDataPath = app.getPath('userData');
  console.log(userDataPath);
  console.log('[automation] will download ' + revision);

  download({
    revision,
    installPath: path.join(userDataPath, '/local-chromium'),
    onProgress: ({ percent }) => {
      console.log(percent);
    },
  }).then(exec => {
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
