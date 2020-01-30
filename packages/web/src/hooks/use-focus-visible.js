import { useEffect } from '../lib/haunted.js';
import { html } from '../lib/lit-html.js';

export function useFocusVisible(shadowRoot) {
  useEffect(() => {
    if (window.applyFocusVisiblePolyfill != null) {
      window.applyFocusVisiblePolyfill(shadowRoot);
    }
  }, []);

  const FocusVisibleStyle = html`
    <style>
      :focus:not(.focus-visible) {
        outline: none;
      }

      :focus.focus-visible {
        outline: 2px solid orange;
        outline-offset: -2px;
      }
    </style>
  `;

  return { FocusVisibleStyle };
}
