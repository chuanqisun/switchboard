import { html, createContext, useState, component, useEffect, useContext, useCallback } from '../lib/index.js';
import { getEnvironments, rejectReasonSignedOut, rejectReasonInvalidJson } from '../helpers/environments.js';
import { getMetadata } from '../helpers/metadata.js';
import { ChromiumContext } from '../contexts/chromium-context.js';
import { getJsonFromUrl } from '../helpers/get-json-from-url-v2.js';
import { urls } from '../constants.js';
import { getUserEmailFromCookies, getUserRoleFromEmail } from '../helpers/auth.js';
import { provideIdentity } from '../helpers/analytics.js';

export const EnvironmentsContext = createContext({
  userRole: 'unknown',
  status: 'loading',
  environments: [],
  metadata: undefined,
  signIn: () => {},
});

customElements.define('sb-environments-provider-internal', EnvironmentsContext.Provider);

function EnvironmentsProvider() {
  const [environments, setEnvironments] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'signed-out' | 'loaded' | 'error'
  const [userRole, setUserRole] = useState('unknown'); // 'unknown' | 'guest' | 'member' | 'admin'
  const chromiumContext = useContext(ChromiumContext);
  const [metadata, setMetadata] = useState();

  // Sign in method
  const signIn = useCallback(async () => {
    const metadata = await getJsonFromUrl({ exec: chromiumContext.exec, url: urls.getMetadataEndpoint, humanAuth: true, onCookies: handleCookies });
    if (metadata) {
      console.log('[environments-context] signed in with metadata', metadata);
      setMetadata(metadata);

      await loadEnvironments({ exec: chromiumContext.exec });
    } else {
      console.log('[environments-context] sign in failed');
      setStatus('signed-out');
    }
  }, [chromiumContext.exec]);

  // Try load metadata and environments
  useEffect(async () => {
    if (chromiumContext.status !== 'installed') return;

    const metadata = await loadMetadata({ exec: chromiumContext.exec });
    if (metadata) {
      console.log('[environments-context] metadata ready', metadata);
      await loadEnvironments({ exec: chromiumContext.exec });
    } else {
      console.log('[environments-context] load medata failed');
    }
  }, [chromiumContext.status]);

  // Infer user role from cookie
  const handleCookies = useCallback(async (cookies) => {
    const email = getUserEmailFromCookies(cookies);
    const role = await getUserRoleFromEmail(email);
    provideIdentity(email);

    setUserRole(role);
  });

  const loadMetadata = useCallback(async ({ exec }) => {
    try {
      const metadata = await getMetadata({ exec, onCookies: handleCookies });
      setMetadata(metadata);
      return metadata;
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

  const loadEnvironments = useCallback(async ({ exec }) => {
    try {
      const environments = await getEnvironments({ exec });
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

  const contextValue = {
    status,
    environments,
    metadata,
    signIn,
    userRole,
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
