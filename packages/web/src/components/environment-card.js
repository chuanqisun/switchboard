import { urls } from '../constants.js';
import { ChromiumContext, FavoritesContext } from '../contexts/index.js';
import { autoSignIn } from '../helpers/automation.js';
import { useFocusVisible } from '../hooks/use-focus-visible.js';
import { Star } from '../icons.js';
import { component, html, useContext, useState } from '../lib/index.js';

const badgeTooltips = new Map([
  ['demo', ['DEMO', 'Demo environments come with customizations and extensions. They showcase possibilities to customers.']],
  ['dev', ['DEV', 'Dev environments come with bugs and experiments. They help developement and testing.']],
  ['viewonly', ['VIEW-ONLY', "Changes in this environment may break other people's work. Please don't make changes even if you can."]],
]);

function EnvironmentCard({ environment, focusable, animationDelay }) {
  const { FocusVisibleStyle } = useFocusVisible();

  const chromiumContext = useContext(ChromiumContext);
  const favoritesContext = useContext(FavoritesContext);

  const [isLaunching, setIsLaunching] = useState(false);

  const launchEnvironment = async (event, environment) => {
    setIsLaunching(true);

    const { url, username, password, signInStrategy } = environment;
    const { exec } = chromiumContext;

    try {
      await autoSignIn({ signInStrategy, exec, url, username, password });
    } catch (e) {
      console.dir(e);
      console.log('[environments] automation runtime error');
    }
  };

  const getDecoratorDisplayText = key => (badgeTooltips.has(key) ? badgeTooltips.get(key)[0] : key.toLocaleUpperCase());

  const getDecoratorTooltip = key => (badgeTooltips.has(key) ? badgeTooltips.get(key)[1] : '');

  const onAnimationEnd = () => {
    setIsLaunching(false);
  };

  return html`
    ${Star}
    <div class="environment-card${environment.primary ? ` environment-card--${environment.primary}` : ''}">
      <button class="main-action" @click=${e => launchEnvironment(e, environment)} tabindex="${focusable ? 0 : -1}">
        <img class="main-action__icon" src="${urls.assetsRoot}/product-icons/${environment.appIcon}" />
        <span class="main-action__app-name"
          >${environment.appName}
          ${environment.decorators
            ? html`
                <sup class="main-action__badges"
                  >${environment.decorators.map(
                    (decorator, index) =>
                      html`
                        ${index > 0
                          ? html`
                              <span>·</span>
                            `
                          : null}
                        <span class="main-action__badge" title="${getDecoratorTooltip(decorator)}">${getDecoratorDisplayText(decorator)}</span>
                      `
                  )}</sup
                >
              `
            : null}</span
        >
      </button>
      <button
        tabindex="${focusable ? 0 : -1}"
        class="more${favoritesContext.isFavorite(environment.appId) ? ' more--favorite' : ''}"
        @click=${() => favoritesContext.toggleFavorite(environment.appId)}
      >
        <svg class="star" width="16" height="15">
          <use xlink:href="#svg-star" />
        </svg>
      </button>
      <div class="launch-indicator${isLaunching ? ' animating' : ''}" @animationend=${onAnimationEnd}></div>
    </div>
    <style>
      .environment-card {
        --badge-color: #666;
        --launch-btn-indicator-color: var(--color-primary);

        background-color: white;
        display: flex;
        align-items: center;
        border-radius: 4px;
        box-shadow: var(--shadow-2);
        position: relative;
        overflow: hidden;

        animation: card-enter 400ms 400ms;
        animation-fill-mode: both;
        animation-delay: ${animationDelay}ms;
      }
      .environment-card--red {
        --launch-btn-indicator-color: #ff9349; /** use organge to avoid the "error" connotation of red */
      }
      .environment-card--yellow {
        --launch-btn-indicator-color: #ffb900;
      }
      .environment-card--green {
        --launch-btn-indicator-color: #107c10;
      }
      .environment-card--cyan {
        --launch-btn-indicator-color: #008575;
      }
      .environment-card--blue {
        --launch-btn-indicator-color: #0078d4;
      }
      .environment-card--purple {
        --launch-btn-indicator-color: #8661c5;
      }
      .environment-card:hover {
        color: var(--color-primary);
        box-shadow: var(--shadow-3);
        --badge-color: var(--color-primary);
      }
      .environment-card:active {
        box-shadow: var(--shadow-1);
      }

      .environment-card:focus-within .more:not(:focus),
      .environment-card:hover .more,
      .more:focus-visible {
        opacity: 1;
      }
      .main-action {
        color: inherit;
        display: flex;
        cursor: pointer;
        align-items: center;
        text-align: left;
        font-family: var(--font-family-system);
        font-size: 1rem;
        font-weight: 600;
        padding: 0 1rem;
        flex: 1 1 auto;
        border: none;
        background-color: transparent;
        height: 4rem;
      }
      .main-action__icon {
        flex: 0 0 auto;
        width: 2rem;
        height: 2rem;
        padding: 0 1rem 0 0;
      }
      .main-action__badge {
        color: var(--badge-color);
        font-size: 0.7rem;
        font-weight: 600;
      }
      .main-action__badge[title]:not([title='']):hover {
        cursor: help;
        text-decoration: underline dotted;
      }
      .more {
        --star-stroke-width: 1.25px;
        --star-stroke: var(--color-off-black);
        --star-fill: transparent;
        opacity: 0;
        padding: 1rem;
        flex: 0 0 2rem;
        border: none;
        background-color: transparent;
        cursor: pointer;
      }
      .more:hover {
        transform: scale(1.2);
      }

      .more--favorite {
        opacity: 1;
        --star-fill: var(--color-yellow);
      }

      .launch-indicator {
        height: 4px;
        background-color: var(--launch-btn-indicator-color);
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        will-change: transform, opacity;
        transform: translateX(-100%);
      }

      .launch-indicator.animating {
        animation: launch 500ms;
        animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
        animation-fill-mode: backwards;
      }

      @keyframes launch {
        0% {
          transform: translateX(-100%);
          opacity: 1;
        }
        40% {
          transform: translateX(0);
          opacity: 1;
        }
        100% {
          transform: translateX(0);
          opacity: 0;
        }
      }

      @keyframes card-enter {
        0% {
          transform: translate3d(-64px, 0, 0);
          opacity: 0;
        }
        100% {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
      }
    </style>
    ${FocusVisibleStyle}
  `;
}

customElements.define('sb-environment-card', component(EnvironmentCard));
