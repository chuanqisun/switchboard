import { html, component, useEffect, useContext, useCallback } from '../lib/index.js';
import { useFocusVisible } from '../hooks/use-focus-visible.js';
import { EnvironmentsContext } from '../contexts/environments-context.js';
import { urls } from '../constants.js';
import { reloadWindow } from '../helpers/window.js';
import { signOut } from '../helpers/auth.js';

import { ChromiumContext } from '../contexts/chromium-context.js';

function SignInForm() {
  const { FocusVisibleStyle } = useFocusVisible();
  const environmentsContext = useContext(EnvironmentsContext);
  const { exec } = useContext(ChromiumContext);

  useEffect(() => {
    if (environmentsContext.status === 'signed-out') {
      this.setAttribute('data-active', '');
    } else {
      this.removeAttribute('data-active');
    }
  }, [environmentsContext.status]);

  const handleSignIn = useCallback(async () => {
    await environmentsContext.signIn({ exec });
    reloadWindow();
  }, [environmentsContext, exec]);

  const handleRetry = useCallback(async () => {
    await environmentsContext.abortSignIn();
    await signOut({ exec });
    reloadWindow();
  }, [environmentsContext, exec]);

  return html`
    <div class="sign-in-container main__pre-sign-in-container${environmentsContext.status === 'signed-out' ? ' sign-in-container--active' : ''}">
      ${environmentsContext.isSigningIn
        ? html` <div class="sign-in-message">
            <p>Sign in with your work account in the popped-up window.</p>
            <p>Something went wrong? <button class="button button--inline" @click=${handleRetry}>Try again here</button>.</p>
          </div>`
        : html`<button class="button button--primary button--extra-wide button--sign-in" @click=${handleSignIn}>Sign in</button>`}
    </div>
    <style>
      button {
        cursor: pointer;
      }

      .button--primary {
        background-color: white;
        border: none;
        border-radius: 4px;
        color: var(--color-primary);
        height: 2rem;
        padding: 0 1rem;
        font-weight: 600;
        font-size: 0.85rem;
        box-shadow: var(--shadow-2);
        outline-offset: 2px !important;
      }

      .button--primary:hover,
      .button--primary.focus-visible {
        box-shadow: var(--shadow-3);
      }

      .button--primary:active {
        box-shadow: var(--shadow-1);
      }

      .button--extra-wide {
        width: 100%;
        max-width: 24rem;
      }

      .button--sign-in {
        animation: button-enter 400ms 200ms;
        animation-fill-mode: both;
        will-change: transform, opacity;
        box-sizing: border-box;
      }

      .button--inline {
        display: inline;
        background: none;
        border: none;
        text-decoration: underline;
        padding: 0;
        color: inherit;
        font: inherit;
      }

      .sign-in-message {
        color: white;
      }

      .sign-in-container {
        padding: 1rem;
        box-sizing: border-box;
        display: none;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: url('${urls.assetsRoot}/sitting-3.svg') bottom right no-repeat, var(--gradient-app-background);
        background-size: 65%, 100% 100%;
      }

      .sign-in-container--active {
        display: flex;
      }

      .main__pre-sign-in-container {
        flex: 1 0 auto;
      }

      @keyframes button-enter {
        0% {
          transform: translateY(16px);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-sign-in-form', component(SignInForm));
