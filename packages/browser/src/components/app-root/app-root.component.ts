import { html, render } from "lit-html";
import { AuthService } from "../../services/auth/auth.service";
import { di } from "../../utils/di";

import "./app-root.component.css";

export class AppRootComponent extends HTMLElement {
  authService = di.getSingleton(AuthService);

  connectedCallback() {
    this.update();

    this.authService.authStateSubject.subscribe(() => this.update());
  }

  update() {
    render(
      html`
        <account-info></account-info>
        ${this.authService.authStateSubject.value === "signed-in" ? html`<environment-list></environment-list>` : ""}
      `,
      this
    );
  }
}
