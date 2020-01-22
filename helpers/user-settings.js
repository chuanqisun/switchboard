const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const userDataPath = app.getPath('userData');
const userSettingsFilename = 'user-settings.json';
const userSettingsPath = path.join(userDataPath, userSettingsFilename);

async function ensureUserSettings() {
  return new Promise(resolve => {
    try {
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
