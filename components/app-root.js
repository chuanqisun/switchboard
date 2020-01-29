import { html } from '../lib/lit-html.js';
import { component, useEffect, useContext } from '../lib/haunted.js';
import { EnvironmentsContext, FavoritesContext, CarouselContext } from './contexts/index.js';

function AppRoot() {
  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);
  const carouselContext = useContext(CarouselContext);

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

  return html`
    <sb-title-bar></sb-title-bar>
    <sb-loading-indicator></sb-loading-indicator>
    <main class="main body--flex-middle">
      <sb-sign-in-form></sb-sign-in-form>

      <sb-notifications></sb-notifications>

      <sb-menu-bar></sb-menu-bar>

      <sb-view-carousel data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}">
        <sb-scroll-area slot="Favorites">
          <sb-environments
            data-empty-text="You have no favorite apps."
            data-favorites-only
            data-is-selected-view="${carouselContext.selected === 'Favorites' ? 'true' : 'false'}"
          ></sb-environments>
        </sb-scroll-area>
        <sb-scroll-area slot="All">
          <sb-environments
            data-empty-text="You have no apps."
            data-is-selected-view="${carouselContext.selected === 'All' ? 'true' : 'false'}"
          ></sb-environments>
        </sb-scroll-area>
      </sb-view-carousel>
    </main>

    <style>
      :host {
        display: contents;
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
        background: var(--gradient-menu-bar), var(--gradient-app-background);
        background-size: 100% calc(var(--app-background-offset-post-signin)), 100% calc(100% - var(--app-header-height) - var(--menu-bar-height));
        background-position: top left, top calc(var(--app-header-height) + var(--menu-bar-height)) left;
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
    </style>
  `;
}

customElements.define('sb-app-root', component(AppRoot));
