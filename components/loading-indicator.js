import { html } from './lib/lit-html.js';
import { component, useEffect, useContext, useState } from './lib/haunted.js';
import { EnvironmentsContext, ChromiumContext } from './contexts/index.js';

function LoadingIndicator() {
  const environmentsContext = useContext(EnvironmentsContext);
  const chromiumContext = useContext(ChromiumContext);

  const [loadingMessage, setLoadingMessage] = useState(null); // null means no message to show

  useEffect(() => {
    if (environmentsContext.status === 'loading') {
      setLoadingMessage('Loading environments…');
    } else if (environmentsContext.status === 'signed-out') {
      setLoadingMessage(null);
    } else if (environmentsContext.status === 'error') {
      setLoadingMessage('Sorry, something went wrong. Please close and open the app to try again.');
    } else if (environmentsContext.status === 'loaded') {
      if (chromiumContext.status === 'checking') {
        setLoadingMessage('Checking browser version…');
      } else if (chromiumContext.status === 'downloading') {
        setLoadingMessage(`Downloading Chromium browser… ${chromiumContext.downloadProgress}%`);
      } else if (chromiumContext.status === 'installing') {
        setLoadingMessage('Installing Chromium browser…');
      } else if (chromiumContext.status === 'installed') {
        setLoadingMessage(null);
      }
    }
  }, [environmentsContext.status, chromiumContext.status, chromiumContext.downloadProgress]);

  return html`
    <div id="loading-indicator" class="loading-indicator${loadingMessage === null ? '' : ' active'}">
      <img class="loading-image" src="./assets/bolt.svg" />
      <div class="loading-message">${loadingMessage}</div>
    </div>
    <style>
      .loading-indicator {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 1rem;
      }

      .loading-image {
        width: 3rem;
        animation: pulse 3s infinite;
      }

      .loading-message {
        margin-top: 1rem;
        color: white;
      }

      .loading-indicator.active {
        display: flex;
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
