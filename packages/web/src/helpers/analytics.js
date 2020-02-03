import { appInsights } from './application-insights.js';
import { getUserEmail } from './auth.js';

const initPromise = getUserEmail().then(email => {
  appInsights.setAuthenticatedUserContext(email, undefined, true);
});

export const trackOpenApp = async () => {
  await initPromise;

  appInsights.trackEvent({
    name: 'open-app',
  });
  appInsights.flush();
};

export const trackLaunchEnvironment = async ({ appId, isFavorite }) => {
  await initPromise;

  appInsights.trackEvent({
    name: 'launch-environment',
    properties: {
      launchedAppId: appId,
      isFavorite,
    },
  });
  appInsights.flush();
};
