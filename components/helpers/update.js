const { app } = require('electron').remote;
import { getMetadata } from './metadata.js';

export async function getVersionSummary() {
  const metadata = await getMetadata();
  const { supportedAppVersions } = metadata;
  const currentVersion = app.getVersion();
  const isCurrentVersionSupported = supportedAppVersions.includes(currentVersion);
  const latestVersion = supportedAppVersions.length && supportedAppVersions[supportedAppVersions.length - 1];
  const isUpdateAvailable = latestVersion !== currentVersion;
  const isUpdatedRequired = isUpdateAvailable && !isCurrentVersionSupported;

  return {
    currentVersion,
    latestVersion,
    isUpdateAvailable,
    isUpdatedRequired,
  };
}
