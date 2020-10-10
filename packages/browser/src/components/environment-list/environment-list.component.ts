import { html, render } from "lit-html";
import { BehaviorSubject } from "rxjs";
import { EnvironmentsService } from "../../services/environments/environments.service";
import { di } from "../../utils/di";

export class EnvironmentListComponent extends HTMLElement {
  environments: any[] = [];
  environmentsService = di.getSingleton(EnvironmentsService);

  connectedCallback() {
    this.update();
  }

  update() {
    render(
      html` <h1>Environments</h1>
        <ul>
          ${this.environments.map((e) => html`<li>e-${e}</li>`)}
        </ul>`,
      this
    );
  }
}
