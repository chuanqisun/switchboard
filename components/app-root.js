import { html } from '../lib/lit-html.js';
import { component, useContext } from '../lib/haunted.js';
import { CarouselContext } from './contexts/index.js';

function AppRoot() {
  const carouselContext = useContext(CarouselContext);

  return html`
    <sb-title-bar></sb-title-bar>
    <sb-loading-indicator></sb-loading-indicator>
    <main class="main">
      <sb-sign-in-form></sb-sign-in-form>

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

      sb-notifications {
        position: absolute;
        bottom: 0;
      }

      .main {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
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
