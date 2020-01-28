import { html } from '../lib/lit-html.js';
import { component, useEffect, useRef, useState, useContext } from '../lib/haunted.js';
import { EnvironmentsContext } from './contexts/environments-context.js';
import { FavoritesContext } from './contexts/favorites-context.js';

function AppRoot() {
  const viewToggleRef = useRef(null);
  const viewCarouselRef = useRef(null);
  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);

  const [isHeaderElevated, setIsHeaderElevated] = useState(false);

  // Cache DOM elements
  useEffect(() => {
    viewToggleRef.current = this.shadowRoot.querySelector('sb-view-toggle');
    viewCarouselRef.current = this.shadowRoot.querySelector('sb-view-carousel');
  }, []);

  // Initialize toggle and carousel
  useEffect(() => {
    if (environmentsContext.status === 'loaded' && favoritesContext.status === 'loaded') {
      if (!favoritesContext.favorites.length) {
        onViewToggle();
      }
    }
  }, [environmentsContext.status, favoritesContext.status]);

  // Initialize scroll observer
  useEffect(() => {
    createObserver();
  }, []);

  // Handle pre-sign-in state
  useEffect(() => {
    if (environmentsContext.status === 'signed-out') {
      document.body.classList.add('pre-sign-in');
    } else {
      document.body.classList.remove('pre-sign-in');
    }
  }, [environmentsContext.status]);

  const onViewToggle = () => {
    const viewToggle = viewToggleRef.current;
    if (viewToggle.dataset.selected === viewToggle.dataset.left) {
      viewToggle.dataset.selected = viewToggle.dataset.right;
    } else {
      viewToggle.dataset.selected = viewToggle.dataset.left;
    }

    viewCarouselRef.current.dataset.selected = viewToggle.dataset.selected;
    [...this.shadowRoot.querySelectorAll('sb-scroll-observer')].forEach(item => item.scrollToTop());
  };

  const createObserver = () => {
    const root = this.shadowRoot;

    const scrollAreas = root.querySelectorAll('sb-scroll-observer');
    const observer = new MutationObserver(() => {
      setIsHeaderElevated(isAnyAreaScrolled(root));
    });

    observer.observe(scrollAreas[0], { attributes: true, attributeFilter: ['data-scrolled'] });
    observer.observe(scrollAreas[1], { attributes: true, attributeFilter: ['data-scrolled'] });
  };

  const isAnyAreaScrolled = root => {
    return [...root.querySelectorAll('sb-scroll-observer')].some(observer => observer.getAttribute('data-scrolled') === 'true');
  };

  return html`
    <sb-app-header></sb-app-header>
    <sb-loading-indicator></sb-loading-indicator>
    <main class="main body--flex-middle">
      <sb-sign-in-form></sb-sign-in-form>

      <sb-notifications></sb-notifications>

      <div class="toolbar${isHeaderElevated ? ' toolbar--with-scroll' : ''}">
        <sb-view-toggle data-left="Favorites" data-right="All" data-selected="Favorites" @click=${onViewToggle}></sb-view-toggle>
        <sb-app-menu></sb-app-menu>
      </div>

      <sb-view-carousel data-left="Favorites" data-right="All" data-selected="Favorites">
        <div slot="Favorites">
          <sb-scroll-observer class="scroll-area view-carousel__item" data-selected>
            <sb-environments data-empty-text="You have no favorite apps." data-favorites-only></sb-environments>
          </sb-scroll-observer>
        </div>
        <div slot="All">
          <sb-scroll-observer class="scroll-area view-carousel__item" data-selected>
            <sb-environments data-empty-text="You have no apps."></sb-environments>
          </sb-scroll-observer>
        </div>
      </sb-view-carousel>
    </main>

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

      sb-notifications {
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
