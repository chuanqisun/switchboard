import { html, createContext, useState, component } from '../lib/index.js';

export const CarouselContext = createContext({
  selected: '',
  setSelected: () => {},
});

customElements.define('sb-carousel-provider-internal', CarouselContext.Provider);

function CarouselProvider({ dataSelected }) {
  const [selected, setSelected] = useState(dataSelected);

  const contextValue = {
    selected,
    setSelected,
  };

  return html`
    <sb-carousel-provider-internal .value=${contextValue}><slot></slot></sb-carousel-provider-internal>
    <style>
      :host,
      sb-carousel-provider-internal {
        display: contents;
      }
    </style>
  `;
}

CarouselProvider.observedAttributes = ['data-selected'];

customElements.define('sb-carousel-provider', component(CarouselProvider));
