import { html, component, useContext } from '../lib/index.js';
import { CarouselContext } from '../contexts/index.js';

function AppRoot() {
  return html`
    <sb-chromium-provider>
      <sb-environments-provider>
        <sb-favorites-provider>
          <sb-carousel-provider data-selected="Favorites">
            <sb-scroll-provider>
              <sb-app-root-internal></sb-app-root-internal>
            </sb-scroll-provider>
          </sb-carousel-provider>
        </sb-favorites-provider>
      </sb-environments-provider>
    </sb-chromium-provider>
    <style>
      :host {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-app-root', component(AppRoot));

function AppRootInternal() {
  const carouselContext = useContext(CarouselContext);

  return html`
    <sb-title-bar></sb-title-bar>
    <sb-loading-indicator></sb-loading-indicator>
    <main class="main">
      <sb-sign-in-form></sb-sign-in-form>

      <sb-menu-bar></sb-menu-bar>

      <sb-view-carousel data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}">
        <sb-scroll-area slot="Favorites">
          <sb-environment-list
            data-empty-text="You have no favorite apps."
            data-favorites-only
            data-is-selected-view="${carouselContext.selected === 'Favorites' ? 'true' : 'false'}"
          ></sb-environment-list>
        </sb-scroll-area>
        <sb-scroll-area slot="All">
          <sb-environment-list
            data-empty-text="You have no apps."
            data-is-selected-view="${carouselContext.selected === 'All' ? 'true' : 'false'}"
          ></sb-environment-list>
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

customElements.define('sb-app-root-internal', component(AppRootInternal));
