import { html, svg } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';

function AppHeader() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  const onMinimize = () => {
    const { remote } = require('electron');
    remote.getCurrentWindow().minimize();
  };

  const onClose = () => {
    const { remote } = require('electron');
    remote.getCurrentWindow().close();
  };

  const symbols = svg`
  <symbol id="svg-minimize" viewBox="0 0 2048 2048">
    <path fill="currentcolor" transform="translate(0,2048) scale(1,-1)" d="M0 1229L2048 1229L2048 1024L0 1024L0 1229Z"></path>
  </symbol>
  <symbol id="svg-close" viewBox="0 0 2048 2048">
    <path
      fill="currentcolor"
      transform="translate(0,2048) scale(1,-1)"
      d="M2048 1903L1169 1024L2048 145L1903 0L1024 879L145 0L0 145L879 1024L0 1903L145 2048L1024 1169L1903 2048L2048 1903Z"
    ></path>
  </symbol>`;

  return html`
    ${symbols}
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

customElements.define('app-header', component(AppHeader));
