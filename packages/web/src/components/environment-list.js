import { ChromiumContext, EnvironmentsContext, FavoritesContext } from '../contexts/index.js';
import { useFocusVisible } from '../hooks/use-focus-visible.js';
import { component, html, useContext } from '../lib/index.js';

function EnvironmentList({ dataFavoritesOnly, dataEmptyText, dataIsSelectedView }) {
  const { FocusVisibleStyle } = useFocusVisible();

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

  return html`
    ${areEnvironmentsReady
      ? html`
          <div class="environment-list">
            ${isEmptyState
              ? html`
                  <div class="empty-text">${dataEmptyText}</div>
                `
              : null}
            ${environments.map(
              (environment, index) =>
                html`
                  <sb-environment-card .environment=${environment} .focusable=${isSelectedView} .animationDelay=${index * 100 + 400}></sb-environment-card>
                `
            )}
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
    </style>
    ${FocusVisibleStyle}
  `;
}

EnvironmentList.observedAttributes = ['data-favorites-only', 'data-empty-text', 'data-is-selected-view'];

customElements.define('sb-environment-list', component(EnvironmentList));
