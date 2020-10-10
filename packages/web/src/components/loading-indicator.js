import { html, component, useEffect, useContext, useState } from '../lib/index.js';
import { EnvironmentsContext, ChromiumContext } from '../contexts/index.js';
import { urls } from '../constants.js';
import { useMemo } from '../../node_modules_unmanaged/haunted/web.js';

function LoadingIndicator() {
  const environmentsContext = useContext(EnvironmentsContext);
  const chromiumContext = useContext(ChromiumContext);

  const loadingMessage = useMemo(() => {
    if (chromiumContext.status === 'checking') {
      return 'Checking browser version…';
    } else if (chromiumContext.status === 'downloading') {
      return `Downloading Chromium browser… ${chromiumContext.downloadProgress}%`;
    } else if (chromiumContext.status === 'installing') {
      return 'Installing Chromium browser…';
    } else if (chromiumContext.status === 'installed') {
      if (environmentsContext.status === 'loading') {
        return 'Loading environments…';
      } else if (environmentsContext.status === 'signed-out') {
        return null;
      } else if (environmentsContext.status === 'error') {
        return 'Sorry, something went wrong. Please close and open the app to try again.';
      } else if (environmentsContext.status === 'loaded') {
        return null;
      }
    }
  }, [environmentsContext, chromiumContext]);

  return html`
    <div id="loading-indicator" class="loading-indicator${loadingMessage === null ? '' : ' active'}">
      <img class="loading-image" src="${urls.assetsRoot}/bolt.svg" />
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
