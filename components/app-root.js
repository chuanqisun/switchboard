import { html } from '../lib/lit-html.js';
import { component, useEffect, useRef, useContext } from '../lib/haunted.js';
import { EnvironmentsContext, FavoritesContext, ScrollContext, CarouselContext } from './contexts/index.js';

function AppRoot() {
  const viewToggleRef = useRef(null);
  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);
  const scrollContext = useContext(ScrollContext);
  const carouselContext = useContext(CarouselContext);

  // Cache DOM elements
  useEffect(() => {
    viewToggleRef.current = this.shadowRoot.querySelector('sb-view-toggle');
  }, []);

  // Initialize toggle and carousel
  useEffect(() => {
    if (environmentsContext.status === 'loaded' && favoritesContext.status === 'loaded') {
      if (!favoritesContext.favorites.length) {
        onViewToggle();
      }
    }
  }, [environmentsContext.status, favoritesContext.status]);

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
      carouselContext.setSelected(viewToggle.dataset.right);
    } else {
      carouselContext.setSelected(viewToggle.dataset.left);
    }
  };

  return html`
    <sb-app-header></sb-app-header>
    <sb-loading-indicator></sb-loading-indicator>
    <main class="main body--flex-middle">
      <sb-sign-in-form></sb-sign-in-form>

      <sb-notifications></sb-notifications>

      <div class="toolbar${scrollContext.scrollCount > 0 ? ' toolbar--with-scroll' : ''}">
        <sb-view-toggle data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}" @click=${onViewToggle}></sb-view-toggle>
        <sb-app-menu></sb-app-menu>
      </div>

      <sb-view-carousel data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}">
        <sb-scroll-area slot="Favorites">
          <sb-environments data-empty-text="You have no favorite apps." data-favorites-only></sb-environments>
        </sb-scroll-area>
        <sb-scroll-area slot="All">
          <sb-environments data-empty-text="You have no apps."></sb-environments>
        </sb-scroll-area>
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

      sb-scroll-area {
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
