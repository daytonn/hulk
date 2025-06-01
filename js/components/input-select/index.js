import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export default class InputSelect extends LitElement {
  render() {
    return html`<select>
      <slot name="options"></slot>
    </select>`
  }
}

customElements.define("hulk-input-select", InputSelect)
