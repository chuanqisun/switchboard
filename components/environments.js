import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';

function Environments() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);

  return html`
    <style></style>
    ${FocusVisibleStyle}
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
  `;
}

customElements.define('environments', component(Environments));
