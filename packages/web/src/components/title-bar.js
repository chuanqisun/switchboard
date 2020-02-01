import { html, component } from '../lib/index.js';
import { useFocusVisible } from '../hooks/use-focus-visible.js';
import { Minimize, Close } from '../icons.js';

function TitleBar() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const onMinimize = () => {
    const { remote } = require('electron');
    remote.getCurrentWindow().minimize();
  };

  const onClose = () => {
    const { remote } = require('electron');
    remote.getCurrentWindow().close();
  };

  return html`
    ${Minimize} ${Close}
    <header id="header" class="header body--fixed-top">
      <div class="header__title">Switchboard</div>
      <div class="header__actions">
        <button class="button button--shell" @click=${onMinimize}>
          <svg width="1rem" height="1rem">
            <use xlink:href="#svg-minimize" />
          </svg>
        </button>
        <button class="button button--shell button--destructive" @click=${onClose}>
          <svg width="1rem" height="1rem">
            <use xlink:href="#svg-close" />
          </svg>
        </button>
      </div>
    </header>
    <style>
      .body--fixed-top {
        flex: 0 0 auto;
      }

      .header {
        --title-bar-background-color: #333;
        --title-bar-background-color-hover: #444;
        --title-bar-text-color: #ccc;
        --title-bar-text-color-strong: white;
        --title-bar-destructive-background: #d0062a;
        --title-bar-height: 1.875rem;
        --title-bar-window-action-width: 2.875rem;

        color: var(--title-bar-text-color);
        height: var(--title-bar-height);
        padding: 0;
        -webkit-app-region: drag;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        background-color: var(--title-bar-background-color);
        position: relative;
        z-index: var(--z-app-header);
      }

      .header__title {
        display: flex;
        align-items: center;
        font-size: 0.85rem;
        padding: 0 1rem;
      }

      .header__actions {
        display: flex; /* prevent button-to-button gaps*/
      }

      button {
        cursor: pointer;
        -webkit-app-region: no-drag;
      }

      .button--shell {
        color: inherit;
        width: var(--title-bar-window-action-width);
        background-color: transparent;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .button--shell:hover,
      .button--shell:focus {
        background-color: var(--title-bar-background-color-hover);
        color: var(--title-bar-text-color-strong);
      }

      .button--destructive:hover,
      .button--destructive:focus {
        background-color: var(--title-bar-destructive-background);
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-title-bar', component(TitleBar));
