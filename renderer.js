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
favoriteEnvironments.onclick = (event) => handleEnvironmentActions(event);
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

// Cache environment list for entire session
let cachedEnvironments = [];

ipcRenderer.once('onEnvironmentsAvailable', (event, {environments, userSettings}) => {
  body.classList.add('environment-available');
  cachedEnvironments = environments;
  allEnvironments.innerHTML = renderAllEnvironments({environments, userSettings, animateEnter: true});
  favoriteEnvironments.innerHTML = renderFavoriteEnvironments({environments, userSettings, animateEnter: true});
  
  initializeToggle({userSettings});

  scrollObservers = createObserver();
});

ipcRenderer.on('onFavoritesChange', (event, {userSettings}) => {
  updateAllEnvironments({userSettings});

  viewToggle.dataset.selectedOption === 'favorites' ?
    updateFavoriteEnvironments({userSettings}) :
    favoriteEnvironments.innerHTML = renderFavoriteEnvironments({environments: cachedEnvironments, userSettings});
});

// Init
ipcRenderer.send('getSignInStatus');

// Render functions
function initializeToggle({userSettings}) {
  const selectedOptions = document.querySelectorAll(`[data-option="${viewToggle.dataset.selectedOption}"]`);
  [...selectedOptions].forEach(option => option.dataset.selected = '');

  if (!userSettings.favorites.length) {
    handleViewToggle();
  }
}

function renderAllEnvironments({environments, userSettings, animateEnter}) {
  return environments.map(environment => renderEnvironment({environment, userSettings, animateEnter})).join('');
}

function renderFavoriteEnvironments({environments, userSettings, animateEnter}) {
  const favoriteEnvironments = environments.filter(environment => userSettings.favorites.includes(environment.appName));

  return favoriteEnvironments.map(environment => renderEnvironment({environment, userSettings, animateEnter})).join('');
}

function updateAllEnvironments({userSettings}) {
  const unFavorited = allEnvironments.querySelectorAll(`[data-action="addFavorite"]`);
  const favorited = allEnvironments.querySelectorAll(`[data-action="removeFavorite"]`);

  [...unFavorited].forEach(item => {
    if (userSettings.favorites.includes(item.dataset.appId)) {
      item.dataset.action = 'removeFavorite';
      item.classList.remove('button--add-favorite');
      item.classList.add('button--remove-favorite');
    }
  });

  [...favorited].forEach(item => {
    if (!userSettings.favorites.includes(item.dataset.appId)) {
      item.dataset.action = 'addFavorite';
      item.classList.remove('button--remove-favorite');
      item.classList.add('button--add-favorite');
    }
  });
}

function updateFavoriteEnvironments({userSettings}) {
  const favorited = favoriteEnvironments.querySelectorAll(`[data-action="removeFavorite"]`);

  [...favorited].forEach(item => {
    if (!userSettings.favorites.includes(item.dataset.appId)) {
      const unFavoritedCard = favoriteEnvironments.querySelector(`.js-card[data-app-id="${item.dataset.appId}"]`);
      unFavoritedCard.addEventListener('animationend', e => {
        unFavoritedCard.parentNode.removeChild(unFavoritedCard);
      });
      unFavoritedCard.classList.add('card--animate-exit');
    }
  });
}

function renderEnvironment({environment, userSettings, animateEnter}) {
  return `
  <div
    class="card js-card${animateEnter ? ' card--animation-enter' : ''}"
    data-app-id="${environment.appName}">
    <div class="card__header">
      <h1 class="card__title">${environment.appName}</h1>
      <button
        class="button button--favorite${userSettings.favorites.includes(environment.appName) ? ' button--remove-favorite' : ' button--add-favorite'}" 
        data-app-id="${environment.appName}"
        data-action="${userSettings.favorites.includes(environment.appName) ? 'removeFavorite' : 'addFavorite'}"
      >
        <svg class="star" width="16" height="15">
          <use xlink:href="#svg-star" />
        </svg>     
      </button>
    </div>
    <div class="card__actions">
      ${environment.instances.map(instance => `
      <button
        class="button button--primary button--launch"
        data-action="launch"
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

  if (targetButton.dataset.action === 'launch') {
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
  } else if (targetButton.dataset.action === 'addFavorite') {
    ipcRenderer.send('addFavorite', {appId: targetButton.dataset.appId});
  } else if (targetButton.dataset.action === 'removeFavorite') {
    ipcRenderer.send('removeFavorite', {appId: targetButton.dataset.appId});
  }
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
  enteringView.scrollTop = 0;
  toolbar.classList.remove('toolbar--with-scroll');
}

function createObserver() {
  [...scrollAreas].map(scrollArea => {

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