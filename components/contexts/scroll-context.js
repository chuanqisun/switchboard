import { createContext, useState, component, useEffect } from '../../lib/haunted.js';
import { html } from '../../lib/lit-html.js';

export const ScrollContext = createContext({
  isScrollToTopRequested: false,
  scrollCount: 0,
  increaseScrolledArea: () => {},
  decreaseScrolledArea: () => {},
  scrollAllToTop: () => {},
});

customElements.define('sb-scroll-provider-internal', ScrollContext.Provider);

function ScrollProvider() {
  const [scrollCount, setScrollCount] = useState(0);
  const [isScrollToTopRequested, setIsScrollToTopRequested] = useState(false);

  const increaseScrolledArea = () => setScrollCount(scrollCount + 1);
  const decreaseScrolledArea = () => setScrollCount(Math.max(0, scrollCount - 1));

  const scrollAllToTop = () => setIsScrollToTopRequested(true);

  useEffect(
    () => {
      if (isScrollToTopRequested && scrollCount === 0) {
        setIsScrollToTopRequested(false);
      }
    },
    scrollCount,
    isScrollToTopRequested
  );

  const contextValue = {
    isScrollToTopRequested,
    scrollCount,
    increaseScrolledArea,
    decreaseScrolledArea,
    scrollAllToTop,
  };

  return html`
    <sb-scroll-provider-internal .value=${contextValue}><slot></slot></sb-scroll-provider-internal>
    <style>
      :host,
      sb-scroll-provider-internal {
        display: contents;
      }
    </style>
  `;
}

customElements.define('sb-scroll-provider', component(ScrollProvider));
