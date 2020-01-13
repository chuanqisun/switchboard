import { html } from '../lib/lit-html.js';
import { component, useState, useEffect, useRef } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';

function ViewToggle() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);
  const [isToggleOnLeft, setIsToggleOnLeft] = useState(true);

  const fromWidth = useRef(null);
  const toWidth = useRef(null);
  const knobElement = useRef(null);

  useEffect(() => {
    measureElements();
  }, []);

  const onToggle = () => {
    if (isToggleOnLeft) {
      animateToRight();
      setIsToggleOnLeft(false);
    } else {
      animateToLeft();
      setIsToggleOnLeft(true);
    }
  };

  const measureElements = () => {
    if (!knobElement.current) {
      knobElement.current = this.shadowRoot.querySelector('.knob');
    }

    if (!toWidth.current) {
      toWidth.current = this.shadowRoot.querySelector('.option-text--right').getBoundingClientRect().width;
    }

    if (!fromWidth.current) {
      fromWidth.current = this.shadowRoot.querySelector('.option-text--left').getBoundingClientRect().width;
      knobElement.current.style.setProperty('--knob-width', `${fromWidth.current}px`);
    }
  };

  const animateToRight = () => {
    // play
    knobElement.current.style.setProperty('--x-translate', `${fromWidth.current}px`);
    knobElement.current.style.setProperty('--knob-width', `${toWidth.current}px`);
  };

  const animateToLeft = () => {
    knobElement.current.style.setProperty('--x-translate', `0`);
    knobElement.current.style.setProperty('--knob-width', `${fromWidth.current}px`);
  };

  return html`
    <style>
      .toggle {
        display: flex;
        padding: 0;
        border: none;
        position: relative;
        background-color: var(--color-primary-dark);
        height: 2rem;
        border-radius: 1rem;
        box-shadow: inset var(--shadow-2);
      }
      .option-text {
        position: relative;
        padding: 0 1rem;
      }
      .knob {
        box-sizing: border-box;
        border-radius: 1rem;
        top: 0;
        bottom: 0;
        color: transparent;
        left: 0;
        position: absolute;
        padding: 0 1rem;
        background-color: white;
        transform-origin: left;
        transform: translateX(var(--x-translate, 0));
        width: var(--knob-width, auto);
        transition: width 250ms, transform 250ms;
      }
    </style>
    <button class="toggle" @click=${onToggle}>
      <div class="knob" aria-hidden="true">Favorites</div>
      <div class="option-text option-text--left">Favorites</div>
      <div class="option-text option-text--right">All</div>
    </button>
    ${FocusVisibleStyle}
  `;
}

customElements.define('view-toggle', component(ViewToggle));
