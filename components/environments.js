import { html } from '../lib/lit-html.js';
import { component, useContext, useEffect } from '../lib/haunted.js';
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
      <div class="environment-card js-stagger-animate">
        <button class="main-action" @click=${() => launchEnvironment(environment)} tabindex="${isSelectedView ? 0 : -1}">
          <img class="main-action__icon" src="./assets/product-icons/${environment.appIcon}" />
          <span class="main-action__app-name">${environment.appName}</span>
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

  useEffect(() => {
    if (areEnvironmentsReady) {
      [...this.shadowRoot.querySelectorAll('.js-stagger-animate')].forEach((item, index) => {
        item.style['animation-delay'] = `${index * 100 + 400}ms`;
      });

      this.shadowRoot.querySelector('.js-stagger-container').classList.add('animate');
    }
  }, [areEnvironmentsReady]);

  return html`
    ${Star}
    ${areEnvironmentsReady
      ? html`
          <div class="environment-list js-stagger-container">
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
        align-items: center;
        border-radius: 4px;
        box-shadow: var(--shadow-2);

        animation: card-enter 400ms 400ms;
        animation-fill-mode: both;
        animation-play-state: paused;
      }
      .environment-card:hover {
        color: var(--color-primary);
        box-shadow: var(--shadow-3);
      }
      .main-action:focus-within .more,
      .more:focus.focus-visible,
      .environment-card:hover .more {
        opacity: 1;
      }
      .main-action {
        color: inherit;
        display: flex;
        cursor: pointer;
        align-items: center;
        text-align: left;
        font-family: var(--font-family-system);
        font-size: 1rem;
        font-weight: 600;
        padding: 0 1rem;
        flex: 1 1 auto;
        border: none;
        background-color: transparent;
        height: 4rem;
      }
      .main-action__icon {
        flex: 0 0 auto;
        width: 2rem;
        height: 2rem;
        padding: 0 1rem 0 0;
      }
      .more {
        --star-stroke-width: 1.25px;
        --star-stroke: var(--color-off-black);
        --star-fill: transparent;
        opacity: 0;
        padding: 0 1rem;
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

      .js-stagger-container.animate .js-stagger-animate {
        animation-play-state: running;
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
