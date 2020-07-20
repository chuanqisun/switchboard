import { html, createContext, useState, component, useEffect } from '../lib/index.js';
import { getEnvironments, rejectReasonSignedOut, rejectReasonInvalidJson } from '../helpers/environments.js';
import { useInterval } from '../hooks/use-interval.js';

export const EnvironmentsContext = createContext({
  status: 'loading',
  environments: [],
});

customElements.define('sb-environments-provider-internal', EnvironmentsContext.Provider);

function EnvironmentsProvider() {
  const [environments, setEnvironments] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'signed-out' | 'loaded' | 'error'

  useEffect(async () => {
    try {
      const environments = await getEnvironments();
      if (Array.isArray(environments)) {
        setEnvironments(environments);
        setStatus('loaded');
      } else {
        console.log('[environments-context] parse environments json is not an array');
        setStatus('error');
      }
    } catch (e) {
      switch (e) {
        case rejectReasonSignedOut:
          console.log('[environments-context] not signed in');
          setStatus('signed-out');
          break;
        case rejectReasonInvalidJson:
          console.log('[environments-context] parse environments json failed');
          setStatus('error');
          break;
      }
    }
  }, []);

  // try refresh environments every 60 seconds. Avoid updating states or unstable network connection may affect UI
  useInterval(
    async () => {
      try {
        const environments = await getEnvironments();
        if (Array.isArray(environments)) {
          setEnvironments(environments);
        } else {
          console.log('[environments-context] parse environments json is not an array');
        }
      } catch (e) {
        switch (e) {
          case rejectReasonSignedOut:
            console.log('[environments-context] not signed in');
            break;
          case rejectReasonInvalidJson:
            console.log('[environments-context] parse environments json failed');
            break;
        }
      }
    },
    status === 'loaded' ? 60 * 1000 : null
  );

  const contextValue = {
    status,
    environments,
  };

  return html`
    <sb-environments-provider-internal .value=${contextValue}><slot></slot></sb-environments-provider-internal>
    <style>
      :host,
      sb-environments-provider-internal {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-environments-provider', component(EnvironmentsProvider));
