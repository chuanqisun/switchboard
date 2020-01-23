import { html } from '../lib/lit-html.js';
import { component, useEffect, useContext } from '../lib/haunted.js';
import { EnvironmentsContext } from './environments-context.js';

function LoadingIndicator() {
  const environmentsContext = useContext(EnvironmentsContext);

  useEffect(() => {
    const loadingIndicator = this.shadowRoot.querySelector('#loading-indicator');

    switch (environmentsContext.status) {
      case 'loaded':
      case 'signed-out':
      case 'error':
        loadingIndicator.dataset.state = 'done';
        break;
    }
  }, [environmentsContext.status]);

  return html`
    <div id="loading-indicator" class="loading-indicator" data-state="get-environments">
      <img class="loading-image" src="./assets/bolt.svg" />
      <div class="loading-message" data-for-state="get-environments">
        Getting apps…
      </div>
    </div>
    <style>
      .loading-indicator {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .loading-image {
        width: 3rem;
        animation: pulse 3s infinite;
      }

      .loading-message {
        margin-top: 1rem;
        color: white;
        display: none;
      }

      .loading-indicator[data-state='get-environments'] [data-for-state='get-environments'] {
        display: initial;
      }

      .loading-indicator[data-state='done'] {
        display: none;
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        10% {
          opacity: 1;
        }
      }
    </style>
  `;
}

customElements.define('sb-loading-indicator', component(LoadingIndicator));
