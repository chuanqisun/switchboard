const { app } = require('electron').remote;
import { getMetadata } from './metadata.js';

export async function isVersionSupported() {
  const metadata = await getMetadata();
  const { supportedAppVersions } = metadata;
  const currentVersion = app.getVersion();

  return supportedAppVersions.includes(currentVersion);
}
