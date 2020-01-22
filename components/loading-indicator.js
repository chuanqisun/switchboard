import { html } from '../lib/lit-html.js';
import { component, useEffect } from '../lib/haunted.js';
const { ipcRenderer } = require('electron');

// TODO use loading indicator inside auth and environments context
function LoadingIndicator() {
  useEffect(() => {
    const loadingIndicator = this.shadowRoot.querySelector('#loading-indicator');

    ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
      if (isSignedIn) {
        loadingIndicator.dataset.state = 'get-environments';
      } else {
        loadingIndicator.dataset.state = 'done';
      }
    });

    ipcRenderer.once('onEnvironmentsAvailable', (event, { environments, userSettings }) => {
      loadingIndicator.dataset.state = 'done';
    });

    ipcRenderer.send('getSignInStatus');
  }, []);

  return html`
    <div id="loading-indicator" class="loading-indicator" data-state="sign-in">
      <img class="loading-image" src="./assets/bolt.svg" />
      <div class="loading-message" data-for-state="sign-in">
        Checking sign-in status…
      </div>
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

      .loading-indicator[data-state='sign-in'] [data-for-state='sign-in'] {
        display: initial;
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
