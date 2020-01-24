import { html } from '../lib/lit-html.js';
import { component, useContext } from '../lib/haunted.js';
import { ChromiumContext } from './chromium-context.js';

function Notifications() {
  const chromiumContext = useContext(ChromiumContext);

  return html`
    <div id="notification-container" class="notification-container">
      <span id="notification">${chromiumContext.status}</span>
    </div>
  `;
}

customElements.define('sb-notifications', component(Notifications));
