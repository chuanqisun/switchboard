import { createContext, useState, component, useEffect } from '../lib/haunted.js';
import { html } from '../lib/lit-html.js';
import { useJsonFromUrl } from './use-json-from-url.js';

export const EnvironmentsContext = createContext([]);

customElements.define('sb-environments-provider-internal', EnvironmentsContext.Provider);

function EnvironmentsProvider() {
  const environments = useJsonFromUrl('https://aka.ms/switchboard-environments-v2') || [];

  return html`
    <sb-environments-provider-internal .value=${environments}><slot></slot></sb-environments-provider-internal>
  `;
}

customElements.define('sb-environments-provider', component(EnvironmentsProvider));
