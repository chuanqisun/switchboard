import { createContext, useState, component, useEffect } from '../lib/haunted.js';
import { html } from '../lib/lit-html.js';

export const FavoritesContext = createContext([]);

customElements.define('sb-favorites-provider-internal', FavoritesContext.Provider);

function FavoritesProvider() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(['1', '11', '2']);
  }, []);

  return html`
    <sb-favorites-provider-internal .value=${favorites}><slot></slot></sb-favorites-provider-internal>
    <style>
      :host,
      sb-favorites-provider-internal {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-favorites-provider', component(FavoritesProvider));
