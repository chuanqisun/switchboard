import { html } from '../lib/lit-html.js';
import { component, useEffect } from '../lib/haunted.js';
const { ipcRenderer } = require('electron');

function LoadingIndicator() {
  useEffect(() => {
    // Handle IPC events
    const loadingIndicator = this.shadowRoot.querySelector('#loading-indicator');

    ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
      if (isSignedIn) {
        loadingIndicator.dataset.state = 'get-environments';
        ipcRenderer.send('getEnvironments');
        ipcRenderer.send('checkMetadata');
      } else {
        loadingIndicator.dataset.state = 'done';
      }
    });
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
    </style>
  `;
}

customElements.define('sb-loading-indicator', component(LoadingIndicator));
