import { html, component, useEffect, useContext } from '../lib/index.js';
import { CarouselContext, ScrollContext } from '../contexts/index.js';

function ScrollArea() {
  const scrollContext = useContext(ScrollContext);
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    const scrollArea = this.shadowRoot.querySelector('.js-scroll-area');

    const options = {
      root: scrollArea,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(e => {
      const isScrolled = !e[0].isIntersecting;

      if (isScrolled) {
        scrollContext.increaseScrolledArea();
      } else {
        scrollContext.decreaseScrolledArea();
      }
    }, options);

    observer.observe(scrollArea.querySelector('.js-sentinel'));
  }, []);

  useEffect(() => {
    const scrollArea = this.shadowRoot.querySelector('.js-scroll-area');
    scrollArea.scrollTop = 0;
  }, [carouselContext.selected]);

  return html`
    <!-- use tab index to resolve a bug where unwanted focus is added by chrome -->
    <div class="js-scroll-area scroll-area" tabindex="-1">
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
