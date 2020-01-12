import { html } from '../lib/lit-html.js';
import { component, useState, useEffect } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';

function ViewToggle() {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);
  const [isToggleOnLeft, setIsToggleOnLeft] = useState(true);

  const onToggle = () => {
    if (isToggleOnLeft) {
      animateToRight();
      setIsToggleOnLeft(false);
    } else {
      animateToLeft();
      setIsToggleOnLeft(true);
    }
  };

  const animateToRight = () => {
    const knobElement = this.shadowRoot.querySelector('.knob');
    const fromWidth = knobElement.getBoundingClientRect().width;

    // fast forward
    knobElement.innerText = 'All';
    const toWidth = knobElement.getBoundingClientRect().width;

    // back
    knobElement.innerText = 'Favorites';

    // play
    const scaleRatio = toWidth / fromWidth;
    knobElement.style.setProperty('--x-translate', `${fromWidth}px`);
    knobElement.style.setProperty('--x-scale', `${scaleRatio}`);
  };

  const animateToLeft = () => {
    const knobElement = this.shadowRoot.querySelector('.knob');

    knobElement.style.setProperty('--x-translate', `0`);
    knobElement.style.setProperty('--x-scale', `1`);
  };

  return html`
    <button class="toggle" @click=${onToggle}>
      <div class="knob" aria-hidden="true">Favorites</div>
      <div class="option-text">Favorites</div>
      <div class="option-text">All</div>
    </button>
    <style>
      .toggle {
        --x-translate: 0;
        --x-scale: 1;
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
        border-radius: 1rem;
        top: 0;
        bottom: 0;
        color: transparent;
        left: 0;
        position: absolute;
        padding: 0 1rem;
        background-color: white;
        transform-origin: left;
        transform: translateX(var(--x-translate)) scaleX(var(--x-scale));
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('view-toggle', component(ViewToggle));
