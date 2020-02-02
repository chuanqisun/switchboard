import { html } from '../lib/index.js';

export function useFocusVisible() {
  const FocusVisibleStyle = html`
    <style>
      :focus:not(:focus-visible) {
        outline: none;
      }

      :focus-visible {
        outline: 2px solid orange;
        outline-offset: -2px;
      }
    </style>
  `;

  return { FocusVisibleStyle };
}
