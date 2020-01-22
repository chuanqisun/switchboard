import { html } from '../lib/lit-html.js';
import { component, useState, useEffect, useRef } from '../lib/haunted.js';
import { useFocusVisible } from './use-focus-visible.js';

function ViewToggle({ dataLeft, dataRight, dataSelected }) {
  const { FocusVisibleStyle } = useFocusVisible(this.shadowRoot);
  const isToggleOnLeft = dataSelected === dataLeft;
  const isToggleOnRight = dataSelected === dataRight;

  const fromWidth = useRef(null);
  const toWidth = useRef(null);
  const knobElement = useRef(null);

  useEffect(() => {
    measureElements();
  }, []);

  useEffect(() => {
    isToggleOnRight && animateToRight();
    isToggleOnLeft && animateToLeft();
  }, [dataSelected]);

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
    knobElement.current.style.setProperty('--x-translate', `${fromWidth.current}px`);
    knobElement.current.style.setProperty('--knob-width', `${toWidth.current}px`);
  };

  const animateToLeft = () => {
    knobElement.current.style.setProperty('--x-translate', `0`);
    knobElement.current.style.setProperty('--knob-width', `${fromWidth.current}px`);
  };

  return html`
    <button class="toggle">
      <div class="knob" aria-hidden="true">${dataLeft}</div>
      <div class="option-text option-text--left${isToggleOnLeft ? ' option-text--active' : ''}">${dataLeft}</div>
      <div class="option-text option-text--right${isToggleOnRight ? ' option-text--active' : ''}">${dataRight}</div>
    </button>
    <style>
      .toggle {
        font-family: var(--font-family-system);
        background-color: var(--color-primary-dark);
        border-radius: 0.8rem;
        border: none;
        box-shadow: inset var(--shadow-2);
        cursor: pointer;
        display: flex;
        height: 1.6rem;
        padding: 0;
        position: relative;
      }
      .option-text {
        color: white;
        font-weight: 600;
        position: relative;
        padding: 0 1rem;
        transition: color 250ms;
      }
      .option-text--active {
        color: var(--color-primary-dark);
      }
      .knob {
        box-sizing: border-box;
        box-shadow: var(--shadow-2);
        border-radius: 1rem;
        top: -0.2rem;
        bottom: -0.2rem;
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
    ${FocusVisibleStyle}
  `;
}

ViewToggle.observedAttributes = ['data-left', 'data-right', 'data-selected'];

customElements.define('sb-view-toggle', component(ViewToggle));