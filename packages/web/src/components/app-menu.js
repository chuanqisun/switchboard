import { urls } from '../constants.js';
import { ChromiumContext, EnvironmentsContext } from '../contexts/index.js';
import { signOut } from '../helpers/auth.js';
import { autoSignIn } from '../helpers/automation.js';
import { resetChromium } from '../helpers/chromium.js';
import { noUpdates, showAbout, updateAvailable } from '../helpers/dialogs.js';
import {
  openAllReleases,
  openCustomerDigitalExperience,
  openDocumentation,
  openHelp,
  openLatestRelease,
  openEnvironmentsFile,
} from '../helpers/open-external.js';
import { resetApp } from '../helpers/reset.js';
import { deleteUserSettings } from '../helpers/user-settings.js';
import { reloadWindow } from '../helpers/window.js';
import { useFocusVisible } from '../hooks/use-focus-visible.js';
import { component, html, useContext, useEffect, useState } from '../lib/index.js';
import { useVersionSummary } from '../hooks/use-version-summary.js';
import { useMemo } from '../../node_modules_unmanaged/haunted/web.js';

function AppMenu() {
  const { FocusVisibleStyle } = useFocusVisible();
  const [isUpdateIndicatorVisible, setIsUpdateIndicatorVisible] = useState(false);
  const environmentsContext = useContext(EnvironmentsContext);
  const chromiumContext = useContext(ChromiumContext);
  const [adminEnvironmentCRM, setadminEnvironmentCRM] = useState(null);
  const [adminEnvironmentMarketing, setAdminEnvironmentMarketing] = useState(null);
  const { versionSummary } = useVersionSummary();

  const isMetadataAvailable = useMemo(() => !!environmentsContext.metadata, [environmentsContext.metadata]);

  useEffect(async () => {
    const { isUpdatedRequired } = versionSummary;
    if (isUpdatedRequired) {
      setIsUpdateIndicatorVisible(true);
    }
  }, [versionSummary]);

  useEffect(() => {
    if (environmentsContext.status === 'loaded') {
      const qualifiedCRMEnvironment = environmentsContext.environments.find((environment) => environment.appId === 'sales-trial');
      if (qualifiedCRMEnvironment) {
        setadminEnvironmentCRM(qualifiedCRMEnvironment);
      }
      const qualifiedMarketingEnvironment = environmentsContext.environments.find((environment) => environment.appId === 'marketing-trial');
      if (qualifiedMarketingEnvironment) {
        setAdminEnvironmentMarketing(qualifiedMarketingEnvironment);
      }
    }
  }, [environmentsContext.status]);

  const manageTrials = () => {
    signInEnvironment({ ...adminEnvironmentCRM, url: urls.manageEnvironments });
  };

  const createTrialMarketing = () => {
    signInEnvironment({ ...adminEnvironmentCRM, url: urls.createTrialMarketing });
  };

  const createTrialCRM = () => {
    signInEnvironment({ ...adminEnvironmentMarketing, url: urls.createTrialCRM });
  };

  const openTrialUserAccount = () => {
    signInEnvironment({ ...adminEnvironmentCRM, url: urls.changeTrialUserPassword });
  };

  const signInEnvironment = async (environment) => {
    const { url, username, password, signInStrategy } = environment;
    const { exec } = chromiumContext;

    try {
      await autoSignIn({ signInStrategy, exec, url, username, password });
    } catch (e) {
      console.dir(e);
      console.log('[app-menu] automation runtime error');
    }
  };

  const handleMainMenuClick = async () => {
    const menu = await createMenu();
    const { getCurrentWindow } = require('electron').remote;
    menu.popup({ window: getCurrentWindow() });
  };

  const createMenu = async () => {
    const { Menu, MenuItem } = require('electron').remote;
    const menu = new Menu();

    const { isUpdatedRequired, isUpdateAvailable, currentVersion, latestVersion } = versionSummary;
    const userRole = environmentsContext.userRole;

    menu.append(
      new MenuItem({
        label: 'Report issue',
        click: () => openHelp(),
      })
    );

    menu.append(
      new MenuItem({
        label: 'Documentation',
        click: () => openDocumentation(),
      })
    );

    menu.append(new MenuItem({ type: 'separator' }));

    isUpdatedRequired &&
      menu.append(
        new MenuItem({
          label: 'Update now 🎁',
          click: () => openLatestRelease(), // TODO implement a separate check for getting the latest version
        })
      );

    !isUpdatedRequired &&
      isMetadataAvailable &&
      menu.append(
        new MenuItem({
          label: 'Check for updates',
          click: () => (isUpdateAvailable ? updateAvailable({ latestVersion, currentVersion }) : noUpdates({ currentVersion })),
        })
      );

    menu.append(
      new MenuItem({
        label: 'All downloads',
        click: () => openAllReleases(),
      })
    );

    menu.append(new MenuItem({ type: 'separator' }));

    menu.append(
      new MenuItem({
        label: 'User tools',
        submenu: [
          { label: 'Reset favorites', click: () => deleteUserSettings() },
          {
            label: 'Reset Chromium',
            click: () => resetChromium(),
          },
          {
            label: 'Reset Switchboard',
            click: () => resetApp(),
          },
          {
            type: 'separator',
          },
          {
            label: 'Diagnostics',
            click: () => showAbout(),
          },
        ],
      })
    );

    menu.append(new MenuItem({ type: 'separator' }));

    userRole === 'admin' &&
      menu.append(
        new MenuItem({
          label: 'Admin tools',
          submenu: [
            {
              label: 'Edit environments',
              click: () => openEnvironmentsFile(),
            },
            {
              type: 'separator',
            },
            {
              label: 'Manage demos',
              click: () => openCustomerDigitalExperience(),
            },
            {
              type: 'separator',
            },
            {
              label: 'Manage trials',
              enabled: !!adminEnvironmentCRM,
              click: () => manageTrials(),
            },
            {
              label: 'Create CRM trial',
              enabled: !!adminEnvironmentCRM,
              click: () => createTrialCRM(),
            },
            {
              label: 'Create Marketing trial',
              enabled: !!adminEnvironmentMarketing,
              click: () => createTrialMarketing(),
            },
            {
              type: 'separator',
            },
            {
              label: 'Change trial user password',
              enabled: !!adminEnvironmentCRM,
              click: () => openTrialUserAccount(),
            },
          ],
        })
      );

    userRole === 'admin' && menu.append(new MenuItem({ type: 'separator' }));

    menu.append(
      new MenuItem({
        label: 'Sign out',
        click: async () => {
          await signOut({ exec: chromiumContext.exec });
          reloadWindow();
        },
      })
    );
    menu.append(
      new MenuItem({
        label: 'Restart',
        click: reloadWindow,
      })
    );

    return menu;
  };

  return html`
    <button class="menu-button" id="main-menu" @click=${handleMainMenuClick}>
      <span>Menu</span>
      ${isUpdateIndicatorVisible ? html` <span class="menu-button__update-indicator">🎁</span> ` : null}
    </button>

    <style>
      .menu-button {
        cursor: pointer;
        background-color: white;
        border: none;
        border-radius: 4px;
        color: var(--color-primary);
        height: 2rem;
        padding: 0 1rem;
        font-family: var(--font-family-system);
        font-weight: 600;
        font-size: 0.85rem;
        box-shadow: var(--shadow-2);
        outline-offset: 2px !important;
        display: flex;
        align-items: center;

        animation: menu-bar-enter 400ms;
        will-change: transform, opacity;
        animation-fill-mode: both;
      }

      .menu-button:hover,
      .menu-button.focus-visible {
        box-shadow: var(--shadow-3);
      }

      .menu-button:active {
        box-shadow: var(--shadow-1);
      }

      .menu-button__update-indicator {
        margin-left: 0.5rem;
      }

      @keyframes menu-bar-enter {
        0% {
          transform: translateY(-16px);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-app-menu', component(AppMenu));
