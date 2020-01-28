import { html } from '../lib/lit-html.js';
import { component, useEffect, useState } from '../lib/haunted.js';

function ScrollArea() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollArea = this.shadowRoot.querySelector('.js-scroll-area');

    const options = {
      root: scrollArea,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(e => {
      setIsScrolled(!e[0].isIntersecting);
    }, options);

    observer.observe(scrollArea.querySelector('.js-sentinel'));

    this.scrollToTop = () => {
      scrollArea.scrollTop = 0;
    };
  }, []);

  useEffect(() => {
    this.setAttribute('data-scrolled', isScrolled);
  }, isScrolled);

  return html`
    <div class="js-scroll-area scroll-area">
      <div class="js-sentinel"></div>
      <slot></slot>

      <style>
        :host {
          display: block;
        }

        .scroll-area {
          height: 100%;
          overflow: auto;
        }
      </style>
    </div>
  `;
}

customElements.define('sb-scroll-area', component(ScrollArea));
