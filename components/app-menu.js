import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { signOut, reloadWindow } from '../helpers/auth.js';
import { showAbout, downloadUpdate } from '../helpers/dialogs.js';
import { editEnvironments } from '../helpers/environments-v2.js';

function AppMenu() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  return html`
    <button class="menu-button" id="main-menu" @click=${handleMainMenuClick}>Menu</button>

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
      }

      .menu-button:hover,
      .menu-button.focus-visible {
        box-shadow: var(--shadow-3);
      }

      .menu-button:active {
        box-shadow: var(--shadow-1);
      }

      .menu-button {
        animation: menu-bar-enter 400ms;
        will-change: transform, opacity;
        animation-fill-mode: both;
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
  const { ipcRenderer } = require('electron');
  const menu = new Menu();
  const { isUpdateAvailable } = require('./helpers/update');

  const isDownloadUpdateEnabled = await isUpdateAvailable();

  menu.append(
    new MenuItem({
      enabled: isDownloadUpdateEnabled,
      label: 'Get updates',
      click: () => downloadUpdate(),
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

  menu.append(
    new MenuItem({
      label: 'About',
      click: () => showAbout(),
    })
  );

  menu.append(
    new MenuItem({
      label: 'Manage environments',
      click: () => editEnvironments(),
    })
  );
  return menu;
}

customElements.define('sb-app-menu', component(AppMenu));
