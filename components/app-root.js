import { html } from '../lib/lit-html.js';
import { component, useEffect } from '../lib/haunted.js';
const { ipcRenderer } = require('electron');
import { signInDynamicsUCApp, initializeChromium } from '../helpers/automation.js';

function AppRoot() {
  useEffect(() => {
    // DOM elements
    const viewToggle = this.shadowRoot.querySelector('sb-view-toggle');
    const viewCarousel = this.shadowRoot.getElementById('view-carousel');
    const toolbar = this.shadowRoot.getElementById('toolbar');
    const notification = this.shadowRoot.getElementById('notification');
    const environments = this.shadowRoot.querySelectorAll('sb-environments');

    const root = this.shadowRoot;

    // Handle DOM events
    viewToggle.onclick = e => handleViewToggle();
    environments.forEach(environments =>
      environments.addEventListener('launch', async e => {
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

      createObserver(root);
    });

    ipcRenderer.on('onDownloadProgress', (event, { percent }) => {
      notification.innerText = percent;
    });

    ipcRenderer.on('onDownloadComplete', (event, { exec }) => {
      notification.innerText = 'Installing...';
    });

    // Init
    ipcRenderer.send('getSignInStatus');
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

    function createObserver(root) {
      const scrollAreas = root.querySelectorAll('sb-scroll-observer');
      const scrollAreaLeft = scrollAreas[0];
      const scrollAreaRight = scrollAreas[1];

      const observer = new MutationObserver(() => {
        // the value is "true" or "false" in string type
        if (isAnyAreaScrolled(root)) {
          toolbar.classList.add('toolbar--with-scroll');
        } else {
          toolbar.classList.remove('toolbar--with-scroll');
        }
      });

      observer.observe(scrollAreaLeft, { attributes: true, attributeFilter: ['data-scrolled'] });
      observer.observe(scrollAreaRight, { attributes: true, attributeFilter: ['data-scrolled'] });
    }

    function isAnyAreaScrolled(root) {
      return [...root.querySelectorAll('sb-scroll-observer')].some(observer => observer.getAttribute('data-scrolled') === 'true');
    }

    function updateCarouselFocusTargets() {
      console.log('// TODO prevent focus in unreachable slide');
    }
  }, []);

  return html`
    <sb-app-header></sb-app-header>
    <sb-environments-provider>
      <sb-loading-indicator></sb-loading-indicator>
      <main class="main body--flex-middle">
        <sb-sign-in-form></sb-sign-in-form>

        <div id="notification-container" class="notification-container">
          <span id="notification">Downloading Chromium...</span>
        </div>

        <div id="toolbar" class="toolbar">
          <sb-view-toggle data-left="Favorites" data-right="All" data-selected="Favorites"></sb-view-toggle>
          <sb-app-menu></sb-app-menu>
        </div>

        <sb-favorites-provider>
          <div id="view-carousel" class="view-carousel">
            <sb-scroll-observer class="scroll-area view-carousel__item view-carousel__item-left" data-selected data-option="Favorites">
              <sb-environments data-empty-text="You have no favorite apps." data-favorites-only></sb-environments>
            </sb-scroll-observer>
            <sb-scroll-observer class="scroll-area view-carousel__item view-carousel__item-right" data-option="All">
              <sb-environments data-empty-text="You have no apps."></sb-environments>
            </sb-scroll-observer>
          </div>
        </sb-favorites-provider>
      </main>
    </sb-environments-provider>
    <style>
      :host {
        display: contents;
      }

      .js-focus-visible :focus:not(.focus-visible) {
        outline: none;
      }

      .js-focus-visible :focus.focus-visible {
        outline: 2px solid orange;
        outline-offset: -2px;
      }

      * {
        color: inherit;
        box-sizing: inherit;
        font-family: inherit;
      }

      html {
        height: 100%;
        color: var(--color-off-black);
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        box-sizing: border-box;
        margin: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--gradient-app-toolbar), var(--gradient-app-background);
        background-size: 100% calc(var(--app-background-offset-post-signin)), 100% calc(100% - var(--app-header-height) - var(--app-toolbar-height));
        background-position: top left, top calc(var(--app-header-height) + var(--app-toolbar-height)) left;
        background-repeat: no-repeat, no-repeat;
        overflow: hidden;
      }

      body.pre-sign-in {
        background: url('../assets/sitting-3.svg') bottom right no-repeat, var(--gradient-app-background);
        background-size: 65%, 100% 100%;
      }

      .body--flex-middle {
        flex: 1 1 auto;
      }

      * {
        box-sizing: inherit;
      }

      .toolbar {
        display: none;
        flex: 0 0 auto;
        height: var(--app-toolbar-height);
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background: var(--gradient-app-toolbar);
        position: relative;
        z-index: var(--z-toolbar);

        display: flex;

        animation: toolbar-enter 400ms;
        will-change: transform, opacity;
        animation-fill-mode: both;
      }

      .toolbar--with-scroll {
        box-shadow: var(--shadow-3);
      }

      button {
        cursor: pointer;
        -webkit-app-region: no-drag;
      }

      .button--primary {
        background-color: white;
        border: none;
        border-radius: 4px;
        color: var(--color-primary);
        height: 2rem;
        padding: 0 1rem;
        font-weight: 600;
        font-size: 0.85rem;
        box-shadow: var(--shadow-2);
        outline-offset: 2px !important;
      }

      .button--primary:hover,
      .button--primary.focus-visible {
        box-shadow: var(--shadow-3);
      }

      .button--primary:active {
        box-shadow: var(--shadow-1);
      }

      .button--favorite {
        --star-stroke-width: 1.25px;
        --star-stroke: var(--color-off-black);
        background-color: transparent;
        border: none;
        padding: 0;
        width: 3rem;
        height: 3rem;
        transition: transform 200ms;

        position: absolute;
        right: -1rem;
        top: 50%;
        transform: translateY(-50%);
      }

      .button--favorite:hover {
        transform: translateY(-50%) scale(1.2);
      }

      .button--add-favorite {
        --star-fill: transparent;
      }

      .button--remove-favorite {
        --star-fill: var(--color-yellow);
      }

      .button--launch {
        color: white;
        position: relative;
        overflow: hidden;
        transform: perspective(1px) translateZ(0);
        text-transform: capitalize;
      }

      .button--launch[data-type='trial'] {
        background-color: var(--color-orange);
      }

      .button--launch[data-type='livedrive'] {
        background-color: var(--color-purple);
      }

      .button--launching::before {
        animation: launch 500ms;
        animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
        animation-fill-mode: backwards;
      }

      .button--launch::before {
        content: '';
        z-index: -1;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateX(-100%);
        will-change: transform, opacity;
      }

      .notification-container {
        position: absolute;
        bottom: 0;
      }

      .main {
        display: flex;
        flex-direction: column;
      }

      sb-sign-in-form {
        height: 100%;
        flex: 1 0 auto;
        display: none;
      }

      sb-sign-in-form[data-active] {
        display: block;
      }

      .view-carousel {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .view-carousel__item[data-can-animate] {
        transition: transform 250ms;
      }

      .view-carousel__item-left {
        transform: translate3d(-100%, 0, 0);
      }

      .view-carousel__item-right {
        transform: translate3d(100%, 0, 0);
      }

      .view-carousel__item[data-selected] {
        transform: translate3d(0, 0, 0);
      }

      .scroll-area {
        overflow: auto;
        flex: 0 1 auto;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
      }

      .scroll-sentinel {
        flex: 0 0 0px;
      }

      .no-favorite-message {
        display: none;
        color: white;
        --star-fill: white;
        --star-stroke: var(--color-off-black);
        padding: 0 1rem;
      }

      .no-favorite-message--show {
        display: initial;
      }

      .card {
        background-color: white;
        border-radius: 4px;
        padding: 1rem;
        box-shadow: var(--shadow-2);

        will-change: transform, opacity;
      }

      .card--animation-enter {
        animation: card-enter 400ms 400ms;
        animation-fill-mode: both;
      }

      .card--animation-enter:nth-child(2) {
        animation-delay: 500ms;
      }
      .card--animation-enter:nth-child(3) {
        animation-delay: 600ms;
      }
      .card--animation-enter:nth-child(4) {
        animation-delay: 700ms;
      }
      .card--animation-enter:nth-child(5) {
        animation-delay: 800ms;
      }
      .card--animation-enter:nth-child(6) {
        animation-delay: 900ms;
      }
      .card--animation-enter:nth-child(7) {
        animation-delay: 1000ms;
      }
      .card--animation-enter:nth-child(8) {
        animation-delay: 1100ms;
      }
      .card--animation-enter:nth-child(9) {
        animation-delay: 1200ms;
      }

      .card--animate-exit {
        animation: card-exit 250ms, just-wait 50ms;
        animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
        animation-fill-mode: both;
        animation-delay: 0ms, 250ms !important;
      }

      @keyframes card-enter {
        0% {
          transform: translate3d(-64px, 0, 0);
          opacity: 0;
        }
        100% {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
      }

      @keyframes card-exit {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0);
          opacity: 0;
        }
      }

      @keyframes just-wait {
        0% {
        }
        100% {
        }
      }

      @keyframes toolbar-enter {
        0% {
          transform: translateY(-16px);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes launch {
        0% {
          transform: translateX(-100%);
          opacity: 1;
        }
        40% {
          transform: translateX(0);
          opacity: 1;
        }
        100% {
          transform: translateX(0);
          opacity: 0;
        }
      }
    </style>
  `;
}

customElements.define('sb-app-root', component(AppRoot));
