import { html } from '../lib/lit-html.js';
import { component, useContext } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { Star } from './icons.js';
import { FavoritesContext } from './favorites-context.js';
import { EnvironmentsContext } from './environments-context.js';
import { signInDynamicsUCApp } from '../helpers/automation.js';
import { ChromiumContext } from './chromium-context.js';

function Environments({ dataFavoritesOnly, dataEmptyText }) {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);
  const chromiumContext = useContext(ChromiumContext);

  let environments = environmentsContext.environments;
  if (dataFavoritesOnly) {
    environments = environmentsContext.environments.filter(environment => favoritesContext.favorites.includes(environment.appId));
  }

  const isEmptyState = environmentsContext.status === 'loaded' && environments.length === 0;

  const launchEnvironment = async environment => {
    const { url, username, password } = environment;
    try {
      await signInDynamicsUCApp(chromiumContext.exec, url, username, password);
    } catch (e) {
      console.dir(e);
      console.log('[environments] automation runtime error');
    }
  };

  const renderEnvironment = ({ environment }) => {
    return html`
      <div class="environment-card">
        <button class="main-action" @click=${() => launchEnvironment(environment)}>
          ${environment.appName}
        </button>
        <button
          class="more${favoritesContext.isFavorite(environment.appId) ? ' more--favorite' : ''}"
          @click=${() => favoritesContext.toggleFavorite(environment.appId)}
        >
          <svg class="star" width="16" height="15">
            <use xlink:href="#svg-star" />
          </svg>
        </button>
      </div>
    `;
  };

  return html`
    ${Star}
    <div class="environment-list">
      ${isEmptyState
        ? html`
            <div class="empty-text">${dataEmptyText}</div>
          `
        : null}
      ${environments.map(environment => renderEnvironment({ environment }))}
      <style>
        .empty-text {
          color: white;
          --star-fill: white;
          --star-stroke: var(--color-off-black);
          padding: 0 1rem;
        }
        .environment-list {
          margin: 1rem;
          display: grid;
          overflow: hidden;
          border-radius: 4px;
        }
        .environment-card {
          background-color: white;
          display: flex;
        }
        .environment-card:hover .more {
          opacity: 1;
        }
        .environment-card + .environment-card {
          border-top: 1px solid rgba(0, 0, 0, 0.21);
        }
        .main-action {
          cursor: pointer;
          text-align: left;
          font-family: var(--font-family-system);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 1rem 1rem;
          flex: 1 0 auto;
          border: none;
          background-color: transparent;
        }
        .more {
          --star-stroke-width: 1.25px;
          --star-stroke: var(--color-off-black);
          --star-fill: transparent;
          opacity: 0;
          padding: 1rem;
          flex: 0 0 2rem;
          border: none;
          background-color: transparent;
          cursor: pointer;
        }
        .more:hover {
          transform: scale(1.2);
        }

        .more--favorite {
          opacity: 1;
          --star-fill: var(--color-yellow);
        }
      </style>
    </div>
    ${FocusVisibleStyle}
  `;
}

Environments.observedAttributes = ['data-favorites-only', 'data-empty-text'];

customElements.define('sb-environments', component(Environments));
