import { createContext, useState, component, useEffect, useContext } from '../../lib/haunted.js';
import { html } from '../../lib/lit-html.js';
import { ensureUserSettings, addFavorite, removeFavorite, saveUserSettings, isFavorite } from '../../helpers/user-settings.js';
import { EnvironmentsContext } from '../contexts/environments-context.js';

export const FavoritesContext = createContext({
  status: 'loading',
  favorites: [],
  isFavorite: () => {},
  toggleFavorite: () => {},
});

customElements.define('sb-favorites-provider-internal', FavoritesContext.Provider);

function FavoritesProvider() {
  const [favorites, setFavorites] = useState([]);
  const [rawFavorites, setRawFavorites] = useState([]);
  const environmentsContext = useContext(EnvironmentsContext);
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded'

  useEffect(async () => {
    const userSettings = await ensureUserSettings();
    setRawFavorites(userSettings.favorites);
  }, []);

  useEffect(async () => {
    if (environmentsContext.status === 'loaded') {
      const effectiveFavorites = rawFavorites.filter(rawFavorite => environmentsContext.environments.find(environment => environment.appId === rawFavorite));
      setFavorites(effectiveFavorites);
      setStatus('loaded');
    }
  }, [rawFavorites, environmentsContext.status]);

  const addFavoriteInContext = async appId => {
    const userSettings = addFavorite(appId);
    setRawFavorites(userSettings.favorites);
    await saveUserSettings(userSettings);
  };
  const removeFavoriteInContext = async appId => {
    const userSettings = removeFavorite(appId);
    setRawFavorites(userSettings.favorites);
    await saveUserSettings(userSettings);
  };

  const toggleFavorite = async appId => {
    if (isFavorite(appId)) {
      await removeFavoriteInContext(appId);
    } else {
      await addFavoriteInContext(appId);
    }
  };

  const contextValue = {
    status,
    favorites,
    isFavorite,
    toggleFavorite,
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
