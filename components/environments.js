import { html } from '../lib/lit-html.js';
import { component, useContext } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { Star } from './icons.js';
import { FavoritesContext } from './favorites-context.js';
import { EnvironmentsContext } from './environments-context.js';

function Environments({ dataFavoritesOnly }) {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  let environments = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);

  if (dataFavoritesOnly) {
    environments = environments.filter(environment => favoritesContext.favorites.includes(environment.appId));
  }

  const renderEnvironment = ({ environment, root }) => {
    const launchEnvironment = env => {
      const event = new CustomEvent('launch', {
        bubbles: true,
        composed: true,
        detail: { environment },
      });
      root.dispatchEvent(event);
    };

    return html`
      <div class="environment-card">
        <button class="main-action" @click=${() => launchEnvironment(environment)}>
          ${environment.appName}
        </button>
        <button
          class="more${favoritesContext.isFavorite(environment.appId) ? ' more--favorite' : ''}"
          @click=${() => favoritesContext.toggleFavoriteInContext(environment.appId)}
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
      ${environments.map(environment => renderEnvironment({ environment, root: this }))}
      <style>
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

Environments.observedAttributes = ['data-favorites-only'];

customElements.define('sb-environments', component(Environments));
