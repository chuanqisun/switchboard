import { html } from '../lib/lit-html.js';
import { component } from '../lib/haunted.js';

function ViewCarousel({ dataLeft, dataRight, dataSelected }) {
  return html`
    <div class="view-carousel">
      <slot name="${dataLeft}">left content selected ${dataSelected}</slot>
      <slot name="${dataRight}">right content selected ${dataSelected}</slot>
    </div>
  `;
}

ViewCarousel.observedAttributes = ['data-left', 'data-right', 'data-selected'];

customElements.define('sb-view-carousel', component(ViewCarousel));
