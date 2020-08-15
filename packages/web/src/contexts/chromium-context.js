import { html, createContext, useState, component, useEffect } from '../lib/index.js';
const download = require('download-chromium');
import { getChromiumInstallPath, getChromiumRevision } from '../helpers/chromium.js';

export const ChromiumContext = createContext({
  status: 'checking',
  exec: '',
  downloadProgress: 0,
});

customElements.define('sb-chromium-provider-internal', ChromiumContext.Provider);

function ChromiumProvider() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'downloading' | 'installing' | 'installed'
  const [downloadProgress, setDownloadProgress] = useState(0); // 0 - 100
  const [exec, setExec] = useState('');

  useEffect(() => {
    // version comes from latest pupeeter release: https://github.com/puppeteer/puppeteer/releases
    const revision = getChromiumRevision();
    const installPath = getChromiumInstallPath();
    console.log('[chromium] will download ' + revision);
    console.log('[chromium] will save in ' + installPath);

    download({
      revision,
      installPath,
      onProgress: ({ percent }) => {
        if (percent < 1) {
          setStatus('downloading');
          setDownloadProgress(Math.round(100 * percent));
          console.log('[chromium] ' + percent);
        }

        if (percent === 1) {
          setStatus('installing');
          console.log('[chromium] downloading 100%');
        }
      },
    }).then((exec) => {
      setStatus('installed');
      console.log('[chromium] installed in ' + exec);
      setExec(exec);
    });
  }, []);

  const contextValue = {
    status,
    exec,
    downloadProgress,
  };

  return html`
    <sb-chromium-provider-internal .value=${contextValue}><slot></slot></sb-chromium-provider-internal>
    <style>
      :host,
      sb-chromium-provider-internal {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-chromium-provider', component(ChromiumProvider));
