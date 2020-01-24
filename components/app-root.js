import { html } from '../lib/lit-html.js';
import { component, useEffect } from '../lib/haunted.js';
const { ipcRenderer } = require('electron');

function AppRoot() {
  useEffect(() => {
    // TODO add all effects
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
    <style></style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-app-root', component(AppRoot));
