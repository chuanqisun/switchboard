import { appInsights } from './application-insights.js';

export const trackLaunchEnvironment = ({ appId, isFavorite }) => {
  appInsights.trackEvent({
    name: 'launch-environment',
    properties: {
      launchedAppId: appId,
      isFavorite,
    },
  });
  appInsights.flush();
};
