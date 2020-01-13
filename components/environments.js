import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { useJsonFromUrl } from './use-json-from-url.js';

function Environments() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const environments = useJsonFromUrl('https://aka.ms/switchboard-environments-v2') || [];

  const userSettings = {
    favorites: [],
  };
  const animateEnter = false;

  return html`
    ${environments.map(environment => renderEnvironment({ environment, userSettings, animateEnter }))}
    <style></style>
    ${FocusVisibleStyle}
  `;
}

function renderEnvironment({ environment, userSettings, animateEnter }) {
  return html`
    <div class="card js-card${animateEnter ? ' card--animation-enter' : ''}" data-app-id="${environment.appId}">
      <div class="card__header">
        <h1 class="card__title">${environment.appName}</h1>
        <button
          class="button button--favorite${userSettings.favorites.includes(environment.appId) ? ' button--remove-favorite' : ' button--add-favorite'}"
          data-app-id="${environment.appId}"
          data-action="${userSettings.favorites.includes(environment.appId) ? 'removeFavorite' : 'addFavorite'}"
          title="${userSettings.favorites.includes(environment.appId) ? 'Remove from favorites' : 'Add to favorites'}"
        >
          <svg class="star" width="16" height="15">
            <use xlink:href="#svg-star" />
          </svg>
        </button>
      </div>
      <div class="card__actions">
        <button
          class="button button--primary button--launch"
          data-action="launch"
          data-type=${environment.type}
          data-url="${environment.url}"
          data-username="${environment.username}"
          data-password="${environment.password}"
        >
          Launch
        </button>
      </div>
    </div>
  `;
}

customElements.define('sb-environments', component(Environments));
