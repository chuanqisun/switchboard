import { createContext, useState, component, useEffect } from '../lib/haunted.js';
import { html } from '../lib/lit-html.js';
import { ensureUserSettings, addFavorite, removeFavorite, saveUserSettings, isFavorite } from '../helpers/user-settings-v2.js';

export const FavoritesContext = createContext([]);

customElements.define('sb-favorites-provider-internal', FavoritesContext.Provider);

function FavoritesProvider() {
  const [favorites, setFavorites] = useState([]);

  useEffect(async () => {
    const userSettings = await ensureUserSettings();
    setFavorites(userSettings.favorites);
  }, []);

  const addFavoriteInContext = async appId => {
    const userSettings = addFavorite(appId);
    setFavorites(userSettings.favorites);
    await saveUserSettings(userSettings);
  };
  const removeFavoriteInContext = async appId => {
    const userSettings = removeFavorite(appId);
    setFavorites(userSettings.favorites);
    await removeFavorite(appId);
  };

  const toggleFavoriteInContext = async appId => {
    if (isFavorite(appId)) {
      await removeFavoriteInContext(appId);
    } else {
      await addFavoriteInContext(appId);
    }
  };

  const contextValue = {
    favorites,
    isFavorite,
    toggleFavoriteInContext,
  };

  return html`
    <sb-favorites-provider-internal .value=${contextValue}><slot></slot></sb-favorites-provider-internal>
    <style>
      :host,
      sb-favorites-provider-internal {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-favorites-provider', component(FavoritesProvider));
