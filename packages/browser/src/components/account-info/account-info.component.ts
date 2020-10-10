import { html, render } from "lit-html";
import { AuthService } from "../../services/auth/auth.service";
import { di } from "../../utils/di";

export class AccountInfoComponent extends HTMLElement {
  authService = di.getSingleton(AuthService);

  connectedCallback() {
    this.update();
    this.authService.authStateSubject.subscribe(() => this.update());
  }

  update() {
    render(
      html`<div>
        ${this.authService.authStateSubject.value === "unknown" ? html`Authenticating` : ""}
        ${this.authService.authStateSubject.value === "signed-in" ? html`<button @click=${this.authService.signOut}>Sign out</button>` : ""}
        ${this.authService.authStateSubject.value === "signed-out" ? html`<button @click=${this.authService.signIn}>Sign in</button>` : ""}
      </div>`,
      this
    );
  }
}
