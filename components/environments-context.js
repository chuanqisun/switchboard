import { createContext, useState, component, useEffect } from '../lib/haunted.js';
import { html } from '../lib/lit-html.js';
import { getJsonFromUrl } from '../helpers/get-json-from-url.js';

export const EnvironmentsContext = createContext({
  environments: [],
});

customElements.define('sb-environments-provider-internal', EnvironmentsContext.Provider);

function EnvironmentsProvider() {
  const [environments, setEnvironments] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded'

  useEffect(async () => {
    const result = await getJsonFromUrl('https://aka.ms/switchboard-environments-v2');
    setEnvironments(result);
    setStatus('loaded');
  }, []);

  const contextValue = {
    environments,
    status,
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
