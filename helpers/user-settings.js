const {app} = require('electron')
const fs = require('fs');
const path = require('path');
const systemConfig = require('../system-config');
const userDataPath = app.getPath('userData');
const userSettingsPath = path.join(userDataPath, systemConfig.userSettingsFilename);

function ensureUserSettings() {
  try {
    const userSettings = require(userSettingsPath);
    ensureUserSettingsSchema(userSettings);
    console.log(`[user-settings] settings file found at ${userSettingsPath}`);
    return userSettings;
  } catch (e) {
    console.log(e);
    console.log('[user-settings] settings file does not exist');
    const userSettings = getDefaultUserSettings();
    fs.writeFileSync(userSettingsPath, JSON.stringify(userSettings));
    console.log('[user-settings] settings file created with default settings');

    return userSettings;
  }
}

function getDefaultUserSettings() {
  return {
    favorites: []
  }
}

function ensureUserSettingsSchema(userSettings) {
  if (!userSettings.favorites) throw new Error('NO_FAVORITES');
  if (!Array.isArray(userSettings.favorites)) throw new Error('FAVORITES_NOT_ARRAY');
}

module.exports = {
  ensureUserSettings
}