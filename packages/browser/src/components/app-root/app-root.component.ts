import { html, render } from "lit-html";
import { defineElement } from "../../utils/define-element";

import "./app-root.component.css";

@defineElement("app-root")
export class AppRoot extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.update();
  }

  update() {
    render(html` <h1>Hello Switchboard 3</h1> `, this);
  }
}
