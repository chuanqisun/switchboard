const {ipcRenderer, remote} = require('electron')

// DOM elements
const body = document.querySelector('body');
const signInButton = document.querySelector('#sign-in');
const signOutButton = document.querySelector('#sign-out');
const minimizeButton = document.querySelector('#minimize');
const closeButton = document.querySelector('#close');
const environmentList = document.querySelector('#environments');

// Handle DOM events
signInButton.onclick = () => ipcRenderer.send('trySignIn');
signOutButton.onclick = () => ipcRenderer.send('trySignOut');
minimizeButton.onclick = () => ipcRenderer.send('tryMinimize');
closeButton.onclick = () => ipcRenderer.send('tryClose');
environmentList.onclick = (event) => handleEnvironmentActions(event);


// Handle IPC events
ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
  if (isSignedIn) {
    body.classList.add('post-sign-in');
    ipcRenderer.send('getEnvironments');
  } else {
    body.classList.add('pre-sign-in')
  }
});

ipcRenderer.once('onEnvironmentsAvailable', (event, environments) => {
  environmentList.innerHTML = renderEnvironments(environments);
});



// Init
ipcRenderer.send('getSignInStatus');

// Render functions
function renderEnvironments(environments) {
  return `${environments.map(app => `
  <div class="card">
    <h1 class="card__title">${app.appName}</h1>
    <div class="card__actions">
      ${app.instances.map(instance => `
      <button
        class="button button--primary button--launch"
        data-type=${instance.type}
        data-url="${instance.url}"
        data-username="${instance.username}"
        data-password="${instance.password}"
      >${instance.type}</button>
      `.trim()).join('')}
    </div>
  </div>
  `.trim()).join('')}`;
}

// Event handler functions
async function handleEnvironmentActions(event) {
  const targetButton = event.target.closest('button');
  if (!targetButton) return;

  const animationEndHandler = (e) => {
    event.target.classList.remove('button--launching');
    event.target.removeEventListener("animationend", animationEndHandler);
  }
  event.target.addEventListener("animationend", animationEndHandler);
  window.setTimeout(() => {
    event.target.classList.add('button--launching');
  },50);

  const {url, username, password} = targetButton.dataset;

  require('chromedriver');
  const {Builder, By, Key, until} = require('selenium-webdriver');
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.get(url);
  await driver.wait(until.elementLocated(By.name('loginfmt')));
  await driver.findElement(By.name('loginfmt')).sendKeys(username, Key.RETURN);
  await driver.wait(until.elementLocated(By.id('displayName')));
  await driver.findElement(By.name('passwd')).sendKeys(password, Key.RETURN);
  await driver.wait(until.elementLocated(By.id('KmsiCheckboxField')));
  await driver.findElement(By.id('idSIButton9')).click();
}
