import { html } from './lib/lit-html.js';
import { component, useEffect, useState } from './lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { signOut, reloadWindow } from './helpers/auth.js';
import { showAbout, downloadUpdate, noUpdates, updateAvailable } from './helpers/dialogs.js';
import { editEnvironments } from './helpers/environments.js';
import { getVersionSummary } from './helpers/update.js';

function AppMenu() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);
  const [isUpdateIndicatorVisible, setIsUpdateIndicatorVisible] = useState(false);

  useEffect(async () => {
    const { isUpdatedRequired } = await getVersionSummary();
    if (isUpdatedRequired) {
      setIsUpdateIndicatorVisible(true);
    }
  }, []);

  return html`
    <button class="menu-button" id="main-menu" @click=${handleMainMenuClick}>
      <span>Menu</span>
      ${isUpdateIndicatorVisible
        ? html`
            <span class="menu-button__update-indicator">🎁</span>
          `
        : null}
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

async function handleMainMenuClick() {
  // TODO implement toggle behavior
  const menu = await createMenu();
  const { getCurrentWindow } = require('electron').remote;
  menu.popup({ window: getCurrentWindow() });
}

async function createMenu() {
  const { Menu, MenuItem } = require('electron').remote;
  const menu = new Menu();

  const { isUpdatedRequired, isUpdateAvailable, currentVersion, latestVersion } = await getVersionSummary();

  isUpdatedRequired &&
    menu.append(
      new MenuItem({
        label: 'Update now 🎁',
        click: () => downloadUpdate(), // TODO implement a separate check for getting the latest version
      })
    );

  !isUpdatedRequired &&
    menu.append(
      new MenuItem({
        label: 'Check for updates…',
        click: () => (isUpdateAvailable ? updateAvailable({ latestVersion, currentVersion }) : noUpdates({ currentVersion })),
      })
    );

  menu.append(
    new MenuItem({
      label: 'Manage in SharePoint',
      click: () => editEnvironments(),
    })
  );

  menu.append(
    new MenuItem({
      label: 'About',
      click: () => showAbout(),
    })
  );

  menu.append(
    new MenuItem({
      label: 'Sign out',
      click: async () => {
        await signOut();
        reloadWindow();
      },
    })
  );

  return menu;
}

customElements.define('sb-app-menu', component(AppMenu));
