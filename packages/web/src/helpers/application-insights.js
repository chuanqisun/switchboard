import { applicationInsights } from '../constants.js';

/**
 * Snippet setup from https://github.com/Microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup
 */
var sdkInstance = 'appInsightsSDK';
window[sdkInstance] = 'appInsights';
var aiName = window[sdkInstance],
  aisdk =
    window[aiName] ||
    (function(n) {
      var o = { config: n, initialize: !0 },
        t = document,
        e = window,
        i = 'script';
      setTimeout(function() {
        var e = t.createElement(i);
        (e.src = n.url || 'https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js'), t.getElementsByTagName(i)[0].parentNode.appendChild(e);
      });
      try {
        o.cookie = t.cookie;
      } catch (e) {}
      function a(n) {
        o[n] = function() {
          var e = arguments;
          o.queue.push(function() {
            o[n].apply(o, e);
          });
        };
      }
      (o.queue = []), (o.version = 2);
      for (var s = ['Event', 'PageView', 'Exception', 'Trace', 'DependencyData', 'Metric', 'PageViewPerformance']; s.length; ) a('track' + s.pop());
      var r = 'Track',
        c = r + 'Page';
      a('start' + c), a('stop' + c);
      var u = r + 'Event';
      if (
        (a('start' + u),
        a('stop' + u),
        a('addTelemetryInitializer'),
        a('setAuthenticatedUserContext'),
        a('clearAuthenticatedUserContext'),
        a('flush'),
        (o.SeverityLevel = { Verbose: 0, Information: 1, Warning: 2, Error: 3, Critical: 4 }),
        !(
          !0 === n.disableExceptionTracking ||
          (n.extensionConfig &&
            n.extensionConfig.ApplicationInsightsAnalytics &&
            !0 === n.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)
        ))
      ) {
        a('_' + (s = 'onerror'));
        var p = e[s];
        (e[s] = function(e, n, t, i, a) {
          var r = p && p(e, n, t, i, a);
          return !0 !== r && o['_' + s]({ message: e, url: n, lineNumber: t, columnNumber: i, error: a }), r;
        }),
          (n.autoExceptionInstrumented = !0);
      }
      return o;
    })({
      instrumentationKey: applicationInsights.instrumentationKey,
    });
/** disable tracking of first page view */
// (window[aiName] = aisdk).queue && 0 === aisdk.queue.length && aisdk.trackPageView({});
(window[aiName] = aisdk).queue && 0 === aisdk.queue.length;

/** @type { import('@microsoft/applicationinsights-web').ApplicationInsights} */
export const appInsights = window.appInsights;
