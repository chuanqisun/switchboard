import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';
import { Minimize, Close } from './icons.js';

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
          <svg width="0.6rem" height="0.6rem">
            <use xlink:href="#svg-minimize" />
          </svg>
        </button>
        <button class="button button--shell" @click=${onClose}>
          <svg width="0.6rem" height="0.6rem">
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
        height: var(--app-header-height);
        padding: 0;
        -webkit-app-region: drag;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        background-color: #323130;
        color: white;
        transition: background-color 250ms;
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
        display: flex;
      }

      button {
        cursor: pointer;
        -webkit-app-region: no-drag;
      }

      .button--shell {
        width: 3rem;
        background-color: transparent;
        border: none;
        padding: 0;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .button--shell:hover,
      .button--shell:focus {
        outline: none;
        background-color: #484644;
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-title-bar', component(TitleBar));
