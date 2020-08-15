import { appInsights } from './application-insights.js';

export function provideIdentity(email) {
  appInsights.setAuthenticatedUserContext(email, undefined, true);
}

export const trackOpenApp = async () => {
  appInsights.trackEvent({
    name: 'open-app',
  });
  appInsights.flush();
};

export const trackLaunchEnvironment = async ({ appId, isFavorite }) => {
  appInsights.trackEvent({
    name: 'launch-environment',
    properties: {
      launchedAppId: appId,
      isFavorite,
    },
  });
  appInsights.flush();
};
