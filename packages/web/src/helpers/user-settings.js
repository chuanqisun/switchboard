const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const userDataPath = app.getPath('userData');
import { reloadWindow } from './window.js';
const userSettingsFilename = 'user-settings.json';
const userSettingsPath = path.join(userDataPath, userSettingsFilename);

export async function ensureUserSettings() {
  return new Promise(resolve => {
    try {
      // clear cache each time so node always get the latest user settings
      delete require.cache[require.resolve(userSettingsPath)];
      const userSettings = require(userSettingsPath);
      ensureUserSettingsSchema(userSettings);
      console.log(`[user-settings] settings file found at ${userSettingsPath}`);
      resolve(userSettings);
    } catch (e) {
      console.log(e);
      console.log('[user-settings] settings file does not exist');
      const userSettings = getDefaultUserSettings();
      fs.writeFile(userSettingsPath, JSON.stringify(userSettings), () => {
        console.log('[user-settings] settings file created with default settings');
        resolve(userSettings);
      });
    }
  });
}

function getDefaultUserSettings() {
  return {
    favorites: [],
  };
}

export function addFavorite(appId) {
  const userSettings = require(userSettingsPath);
  const favorites = [appId, ...userSettings.favorites];
  const dedupedFavorites = [...new Set(favorites)];
  userSettings.favorites = dedupedFavorites;

  return userSettings;
}

export function removeFavorite(appId) {
  const userSettings = require(userSettingsPath);
  const favorites = userSettings.favorites.filter(existingAppId => existingAppId !== appId);
  userSettings.favorites = favorites;

  return userSettings;
}

export function isFavorite(appId) {
  const userSettings = require(userSettingsPath);
  return userSettings.favorites.some(existingAppId => existingAppId === appId);
}

export function saveUserSettings(userSettings) {
  return new Promise(resolve => {
    fs.writeFile(userSettingsPath, JSON.stringify(userSettings), () => {
      console.log('[user-settings] settings file saved');
      resolve(userSettings);
    });
  });
}

export function deleteUserSettings() {
  fs.unlinkSync(userSettingsPath);
  reloadWindow();
}

function ensureUserSettingsSchema(userSettings) {
  if (!userSettings.favorites) throw new Error('NO_FAVORITES');
  if (!Array.isArray(userSettings.favorites)) throw new Error('FAVORITES_NOT_ARRAY');
}

module.exports = {
  ensureUserSettings,
  addFavorite,
  removeFavorite,
  saveUserSettings,
};
