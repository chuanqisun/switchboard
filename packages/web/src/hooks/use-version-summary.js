const { app } = require('electron').remote;
import { useMemo } from '../../node_modules_unmanaged/haunted/web.js';
import { EnvironmentsContext } from '../contexts/index.js';
import { useContext } from '../lib/index.js';

const initialSummary = {
  currentVersion: 'unknown',
  latestVersion: 'unknown',
  isUpdateAvailable: false,
  isUpdatedRequired: false,
};

export function useVersionSummary() {
  const environmentsContext = useContext(EnvironmentsContext);

  const versionSummary = useMemo(() => {
    if (!environmentsContext.metadata) return initialSummary;

    try {
      const { supportedAppVersions } = environmentsContext.metadata;
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
    } catch (e) {
      console.log('[use-version-summary] parse version summary failed', e);
      return initialSummary;
    }
  }, [environmentsContext.metadata]);

  return { versionSummary };
}
