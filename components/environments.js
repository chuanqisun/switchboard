import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { useJsonFromUrl } from './use-json-from-url.js';

function Environments() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const environments = useJsonFromUrl('https://aka.ms/switchboard-environments-v2') || [];

  return html`
    <div class="environment-list">
      ${environments.map(environment => renderEnvironment({ environment, root: this }))}
      <style>
        .environment-list {
          margin: 1rem;
          display: grid;
          overflow: hidden;
          border-radius: 4px;
        }
        .environment-card {
          padding: 0.5rem 1rem;
          background-color: white;
          display: flex;
        }
        .environment-card + .environment-card {
          border-top: 1px solid #333;
        }
        .main-action {
          flex: 1 0 auto;
          border: none;
          background-color: transparent;
        }
        .more {
          flex: 0 0 2rem;
          border: none;
          background-color: transparent;
        }
      </style>
    </div>
    ${FocusVisibleStyle}
  `;
}

function renderEnvironment({ environment, root }) {
  const launchEnvironment = env => {
    const event = new CustomEvent('launch', {
      bubbles: true,
      composed: true,
      detail: { environment },
    });
    root.dispatchEvent(event);
  };

  return html`
    <div class="environment-card">
      <button class="main-action" @click=${() => launchEnvironment(environment)}>
        ${environment.appName}
      </button>
      <button class="more">...</button>
    </div>
  `;
}

customElements.define('sb-environments', component(Environments));
