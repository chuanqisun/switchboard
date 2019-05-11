const {ipcRenderer} = require('electron')
const systemConfig = require('./system-config');

// Webdriver
/* require this up front or the 1st launch will be laggy */
require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const ChromeBuilder = new Builder().forBrowser('chrome');

// DOM elements
const body = document.querySelector('body');
const signInButton = document.querySelector('#sign-in');
const signOutButton = document.querySelector('#sign-out');
const minimizeButton = document.querySelector('#minimize');
const closeButton = document.querySelector('#close');
const environmentList = document.querySelector('#environments');
const tabFavorites = document.querySelector('#tab-favorites');
const tabAll = document.querySelector('#tab-all');
const toolbar = document.querySelector('#toolbar');
const scrollArea = document.querySelector('#scroll-area');

// Handle DOM events
signInButton.onclick = () => ipcRenderer.send('trySignIn');
signOutButton.onclick = () => ipcRenderer.send('trySignOut');
minimizeButton.onclick = () => ipcRenderer.send('tryMinimize');
closeButton.onclick = () => ipcRenderer.send('tryClose');
environmentList.onclick = (event) => handleEnvironmentActions(event);
tabFavorites.onclick = () => handleSwitchToTabFavorites();
tabAll.onclick = () => handleSwitchToTabAll();


// Handle IPC events
ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
  if (isSignedIn) {
    body.classList.add('post-sign-in');
    ipcRenderer.send('getEnvironments');
  } else {
    body.classList.add('pre-sign-in');
  }
});

ipcRenderer.once('onEnvironmentsAvailable', (event, {environments, userSettings}) => {
  body.classList.add('environment-available');
  environmentList.innerHTML = renderEnvironments(environments, userSettings);

  
  createObserver();
});

// Init
ipcRenderer.send('getSignInStatus');

// Render functions
function renderEnvironments(environments, userSettings) {
  const favoriteEnvironments = environments.filter(environment => userSettings.favorites.includes(environment.appName));

  return `
  ${favoriteEnvironments.map(environment => renderEnvironment(environment, true)).join('')}
  ${environments.map(environment => renderEnvironment(environment, false)).join('')}
  `.trim();
}

function renderEnvironment(environment, isFavorite) {
  return `
  <div class="card">
    <div class="card__header">
      <h1 class="card__title">${environment.appName}</h1>
      <button class="button button--pin${isFavorite ? ' button--pinned' : ''}" data-id="${environment.appName}">
        <svg class="star" width="16" height="15">
          <use xlink:href="#svg-star" />
        </svg>     
      </button>
    </div>
    <div class="card__actions">
      ${environment.instances.map(instance => `
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
  `.trim();
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

  let {url, username, password} = targetButton.dataset;
  if (event.shiftKey) {
    url = systemConfig.trialAdminPortalUrl;
  }

  let driver = await ChromeBuilder.build();
  await driver.get(url);
  await driver.wait(until.elementLocated(By.name('loginfmt')));
  await driver.findElement(By.name('loginfmt')).sendKeys(username, Key.RETURN);
  await driver.wait(until.elementLocated(By.id('displayName')));
  await driver.findElement(By.name('passwd')).sendKeys(password, Key.RETURN);
  await driver.wait(until.elementLocated(By.id('KmsiCheckboxField')));
  await driver.findElement(By.id('idSIButton9')).click();
}

function handleSwitchToTabFavorites() {
  tabFavorites.classList.add('button--tab-selected');
  tabAll.classList.remove('button--tab-selected');
}

function handleSwitchToTabAll() {
  tabAll.classList.add('button--tab-selected');
  tabFavorites.classList.remove('button--tab-selected');
}

function createObserver() {
  var observer;

  var options = {
    root: scrollArea,
    rootMargin: "0px",
    threshold: 0,
  };

  observer = new IntersectionObserver(e => {
    if (e[0].isIntersecting) {
      toolbar.classList.remove('toolbar--with-scroll');
    } else {
      toolbar.classList.add('toolbar--with-scroll');
    }
  }, options);

  observer.observe(document.getElementById('scroll-sentinel'));
}
