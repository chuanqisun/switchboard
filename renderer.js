const {ipcRenderer} = require('electron')
const systemConfig = require('./system-config');

// Webdriver
/* require this up front or the 1st launch will be laggy */
require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const ChromeBuilder = new Builder().forBrowser('chrome');

// DOM elements
const body = document.querySelector('body');
const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const minimizeButton = document.getElementById('minimize');
const closeButton = document.getElementById('close');
const allEnvironments = document.getElementById('all-environments');
const favoriteEnvironments = document.getElementById('favorite-environments');
const viewToggle = document.getElementById('view-toggle');
const viewCarousel = document.getElementById('view-carousel');
const toolbar = document.getElementById('toolbar');
const scrollAreas = document.getElementsByClassName('js-scroll-area');

// Handle DOM events
signInButton.onclick = () => ipcRenderer.send('trySignIn');
signOutButton.onclick = () => ipcRenderer.send('trySignOut');
minimizeButton.onclick = () => ipcRenderer.send('tryMinimize');
closeButton.onclick = () => ipcRenderer.send('tryClose');
allEnvironments.onclick = (event) => handleEnvironmentActions(event);
viewToggle.onclick = () => handleViewToggle();


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
  allEnvironments.innerHTML = renderAllEnvironments(environments);
  favoriteEnvironments.innerHTML = renderFavoriteEnvironments(environments, userSettings);
  
  createObserver();
});

// Init
ipcRenderer.send('getSignInStatus');

// Render functions
function renderAllEnvironments(environments) {
  return environments.map(environment => renderEnvironment(environment, false)).join('');
}

function renderFavoriteEnvironments(environments, userSettings) {
  const favoriteEnvironments = environments.filter(environment => userSettings.favorites.includes(environment.appName));

  return favoriteEnvironments.map(environment => renderEnvironment(environment, true)).join('');
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

function handleViewToggle() {
  const selectedOption = viewToggle.dataset.selectedOption;
  const options = [...viewToggle.children];
  const leftLabelWidth = options[0].offsetWidth;

  // on first call, measure left label width
  if (!viewToggle.style.getPropertyValue('--indicator-width')) {
    viewToggle.style.setProperty('--indicator-width', `${leftLabelWidth}px`);
  }

  // update view toggle
  const leavingOption = options.filter(option => option.dataset.option === selectedOption)[0];
  const enteringOption = options.filter(option => option.dataset.option !== selectedOption)[0];
  delete leavingOption.dataset.selected;
  enteringOption.dataset.selected = '';

  viewToggle.dataset.selectedOption = enteringOption.dataset.option;
  viewToggle.style.setProperty('--indicator-width', `${enteringOption.offsetWidth}px`);
  viewToggle.style.setProperty('--indicator-translate', enteringOption === options[1] ? `${leftLabelWidth}px` : '0');

  // update carousel
  const views = [...viewCarousel.querySelectorAll(`[data-option]`)];
  const leavingView = views.filter(view => view.dataset.option === selectedOption)[0];
  const enteringView = views.filter(view => view.dataset.option !== selectedOption)[0];

  delete leavingView.dataset.selected;
  enteringView.dataset.selected = '';
}

function createObserver() {
  [...scrollAreas].forEach(scrollArea => {

    const options = {
      root: scrollArea,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(e => {
      if (e[0].isIntersecting) {
        toolbar.classList.remove('toolbar--with-scroll');
      } else {
        toolbar.classList.add('toolbar--with-scroll');
      }
    }, options);

    observer.observe(scrollArea.querySelector('.js-scroll-sentinel'));
  });

}