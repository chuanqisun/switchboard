import { html, component, useEffect, useContext } from '../lib/index.js';
import { ScrollContext, CarouselContext, EnvironmentsContext, FavoritesContext, ChromiumContext } from '../contexts/index.js';

function MenuBar() {
  const scrollContext = useContext(ScrollContext);
  const carouselContext = useContext(CarouselContext);
  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);
  const chromiumContext = useContext(ChromiumContext);

  const isToggleReady = environmentsContext.status === 'loaded' && favoritesContext.status === 'loaded' && chromiumContext.status === 'installed';
  const isMenuButtonReady = environmentsContext.status !== 'signed-out';

  useEffect(() => {
    if (isToggleReady) {
      if (!favoritesContext.favorites.length) {
        onViewToggle();
      }
    }
  }, [environmentsContext.status, favoritesContext.status, chromiumContext.status]);

  const onViewToggle = () => {
    const viewToggle = this.shadowRoot.querySelector('sb-view-toggle');
    if (viewToggle.dataset.selected === viewToggle.dataset.left) {
      carouselContext.setSelected(viewToggle.dataset.right);
    } else {
      carouselContext.setSelected(viewToggle.dataset.left);
    }
  };

  return html`
    <div class="menu-bar${scrollContext.scrollCount > 0 ? ' menu-bar--with-scroll' : ''}">
      ${isToggleReady
        ? html`
            <sb-view-toggle data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}" @click=${onViewToggle}></sb-view-toggle>
          `
        : html`
            <div></div>
          `}
      ${isMenuButtonReady
        ? html`
            <sb-app-menu></sb-app-menu>
          `
        : null}
    </div>

    <style>
      .menu-bar {
        display: flex;
        flex: 0 0 auto;
        height: var(--menu-bar-height);
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background: var(--gradient-menu-bar);
        position: relative;
        z-index: var(--z-toolbar);
      }

      .menu-bar--with-scroll {
        box-shadow: var(--shadow-3);
      }
    </style>
  `;
}

customElements.define('sb-menu-bar', component(MenuBar));
