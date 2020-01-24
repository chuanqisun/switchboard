const { ipcRenderer } = require('electron');

// DOM elements
const viewToggle = document.querySelector('sb-view-toggle');
const viewCarousel = document.getElementById('view-carousel');
const toolbar = document.getElementById('toolbar');
const notification = document.getElementById('notification');
const environments = document.querySelectorAll('sb-environments');

// Handle DOM events
viewToggle.onclick = e => handleViewToggle();
environments.forEach(environments =>
  environments.addEventListener('launch', async e => {
    const { signInDynamicsUCApp } = require('./helpers/automation');
    const { url, username, password } = e.detail.environment;
    await signInDynamicsUCApp(url, username, password);
  })
);

// Handle IPC events
ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
  if (isSignedIn) {
    ipcRenderer.send('getEnvironments');
    ipcRenderer.send('checkMetadata');
  } else {
    document.body.classList.add('pre-sign-in');
  }
});

ipcRenderer.once('onEnvironmentsAvailable', (event, { environments, userSettings }) => {
  initializeToggle({ userSettings });
  initializeCarousel();

  scrollObservers = createObserver();
});

ipcRenderer.on('onDownloadProgress', (event, { percent }) => {
  notification.innerText = percent;
});

ipcRenderer.on('onDownloadComplete', (event, { exec }) => {
  notification.innerText = 'Installing...';
});

// Init
ipcRenderer.send('getSignInStatus');
const { initializeChromium } = require('./helpers/automation');
initializeChromium().then(() => {
  notification.innerText = 'Installed';
});

// Render functions
function initializeToggle({ userSettings }) {
  if (!userSettings.favorites.length) {
    handleViewToggle();
  } else {
    updateCarouselFocusTargets();
  }
}

function initializeCarousel() {
  setTimeout(() => {
    [...viewCarousel.children].forEach(child => (child.dataset.canAnimate = ''));
  }, 100); // without timeout the scroll bar will be part of the slide-in animation
}

// Event handler functions
function handleViewToggle() {
  if (viewToggle.dataset.selected === viewToggle.dataset.left) {
    viewToggle.dataset.selected = viewToggle.dataset.right;
  } else {
    viewToggle.dataset.selected = viewToggle.dataset.left;
  }

  // update carousel
  const views = [...viewCarousel.querySelectorAll(`[data-option]`)];
  const leavingView = views.filter(view => view.dataset.option !== viewToggle.dataset.selected)[0];
  const enteringView = views.filter(view => view.dataset.option === viewToggle.dataset.selected)[0];

  delete leavingView.dataset.selected;
  enteringView.dataset.selected = '';
  updateCarouselFocusTargets();

  // reset scroll
  leavingView.scrollToTop();
}

function createObserver() {
  const scrollAreas = document.querySelectorAll('sb-scroll-observer');
  const scrollAreaLeft = scrollAreas[0];
  const scrollAreaRight = scrollAreas[1];

  const observer = new MutationObserver(() => {
    // the value is "true" or "false" in string type
    if (isAnyAreaScrolled()) {
      toolbar.classList.add('toolbar--with-scroll');
    } else {
      toolbar.classList.remove('toolbar--with-scroll');
    }
  });

  observer.observe(scrollAreaLeft, { attributes: true, attributeFilter: ['data-scrolled'] });
  observer.observe(scrollAreaRight, { attributes: true, attributeFilter: ['data-scrolled'] });
}

function isAnyAreaScrolled() {
  return [...document.querySelectorAll('sb-scroll-observer')].some(observer => observer.getAttribute('data-scrolled') === 'true');
}

function updateCarouselFocusTargets() {
  console.log('// TODO prevent focus in unreachable slide');
}
