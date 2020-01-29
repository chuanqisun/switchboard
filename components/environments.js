import { html } from '../lib/lit-html.js';
import { component, useContext } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { Star } from './icons.js';
import { signInDynamicsUCApp } from '../helpers/automation.js';
import { ChromiumContext, EnvironmentsContext, FavoritesContext } from './contexts/index.js';

function Environments({ dataFavoritesOnly, dataEmptyText, dataIsSelectedView }) {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);
  const chromiumContext = useContext(ChromiumContext);

  const isSelectedView = dataIsSelectedView === 'true';
  const areEnvironmentsReady = favoritesContext.status === 'loaded' && environmentsContext.status === 'loaded' && chromiumContext.status === 'installed';

  let environments = environmentsContext.environments;
  if (dataFavoritesOnly && areEnvironmentsReady) {
    environments = environmentsContext.environments.filter(environment => favoritesContext.favorites.includes(environment.appId));
  }
  const isEmptyState = areEnvironmentsReady && environments.length === 0;

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
      <div class="environment-card card--animation-enter">
        <button class="main-action" @click=${() => launchEnvironment(environment)} tabindex="${isSelectedView ? 0 : -1}">
          ${environment.appName}
        </button>
        <button
          tabindex="${isSelectedView ? 0 : -1}"
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
    ${areEnvironmentsReady
      ? html`
          <div class="environment-list">
            ${isEmptyState
              ? html`
                  <div class="empty-text">${dataEmptyText}</div>
                `
              : null}
            ${environments.map(environment => renderEnvironment({ environment }))}
          </div>
        `
      : null}

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
        gap: 1rem;
      }
      .environment-card {
        background-color: white;
        display: flex;
        border-radius: 4px;
        box-shadow: var(--shadow-2);
      }
      .environment-card:hover {
        box-shadow: var(--shadow-3);
      }
      .environment-card:focus-within .more,
      .environment-card:hover .more {
        opacity: 1;
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
      .card--animation-enter:nth-child(10) {
        animation-delay: 1300ms;
      }
      .card--animation-enter:nth-child(11) {
        animation-delay: 1400ms;
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
    </style>
    ${FocusVisibleStyle}
  `;
}

Environments.observedAttributes = ['data-favorites-only', 'data-empty-text', 'data-is-selected-view'];

customElements.define('sb-environments', component(Environments));
