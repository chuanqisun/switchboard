import { html } from './lib/lit-html.js';
import { component } from './lib/haunted.js';

function ViewCarousel({ dataLeft, dataRight, dataSelected }) {
  return html`
    <div class="view-carousel">
      <div class="item item--left${dataSelected === dataLeft ? ' item--selected' : ''}">
        <slot name="${dataLeft}">left content selected ${dataSelected}</slot>
      </div>
      <div class="item item--right${dataSelected === dataRight ? ' item--selected' : ''}">
        <slot name="${dataRight}">right content selected ${dataSelected}</slot>
      </div>
    </div>
    <style>
      :host {
        display: contents;
      }
      .view-carousel {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .item {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: transform 250ms;
      }

      .item--left {
        transform: translate3d(-100%, 0, 0);
      }

      .item--right {
        transform: translate3d(100%, 0, 0);
      }

      .item--selected {
        transform: translate3d(0, 0, 0);
      }
    </style>
  `;
}

ViewCarousel.observedAttributes = ['data-left', 'data-right', 'data-selected'];

customElements.define('sb-view-carousel', component(ViewCarousel));
