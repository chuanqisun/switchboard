const { app } = require('electron');

async function isUpdateAvailable() {
  // const { getMetadata } = require('./metadata');
  // const metadata = await getMetadata();
  // const { supportedAppVersions } = metadata;
  // const currentVersion = app.getVersion();

  // return supportedAppVersions.includes(currentVersion);

  return true;
}

module.exports = {
  isUpdateAvailable,
};
