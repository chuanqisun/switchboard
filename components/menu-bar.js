import { html } from '../lib/lit-html.js';
import { component, useContext, useRef, useEffect } from '../lib/haunted.js';
import { ScrollContext, CarouselContext, EnvironmentsContext, FavoritesContext } from './contexts/index.js';

function MenuBar() {
  const viewToggleRef = useRef(null);

  const scrollContext = useContext(ScrollContext);
  const carouselContext = useContext(CarouselContext);
  const environmentsContext = useContext(EnvironmentsContext);
  const favoritesContext = useContext(FavoritesContext);

  useEffect(() => {
    viewToggleRef.current = this.shadowRoot.querySelector('sb-view-toggle');
  }, []);

  useEffect(() => {
    if (environmentsContext.status === 'loaded' && favoritesContext.status === 'loaded') {
      if (!favoritesContext.favorites.length) {
        onViewToggle();
      }
    }
  }, [environmentsContext.status, favoritesContext.status]);

  const onViewToggle = () => {
    const viewToggle = viewToggleRef.current;
    if (viewToggle.dataset.selected === viewToggle.dataset.left) {
      carouselContext.setSelected(viewToggle.dataset.right);
    } else {
      carouselContext.setSelected(viewToggle.dataset.left);
    }
  };

  return html`
    <div class="menu-bar${scrollContext.scrollCount > 0 ? ' menu-bar--with-scroll' : ''}">
      <sb-view-toggle data-left="Favorites" data-right="All" data-selected="${carouselContext.selected}" @click=${onViewToggle}></sb-view-toggle>
      <sb-app-menu></sb-app-menu>
    </div>

    <style>
      .menu-bar {
        display: none;
        flex: 0 0 auto;
        height: var(--menu-bar-height);
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background: var(--gradient-menu-bar);
        position: relative;
        z-index: var(--z-toolbar);

        display: flex;

        animation: menu-bar-enter 400ms;
        will-change: transform, opacity;
        animation-fill-mode: both;
      }

      .menu-bar--with-scroll {
        box-shadow: var(--shadow-3);
      }

      @keyframes menu-bar-enter {
        0% {
          transform: translateY(-16px);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  `;
}

customElements.define('sb-menu-bar', component(MenuBar));
