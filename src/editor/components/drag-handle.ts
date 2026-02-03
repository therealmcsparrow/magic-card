import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mc-drag-handle')
export class DragHandle extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      color: var(--secondary-text-color, #6b7280);
      opacity: 0.5;
      transition: opacity 0.15s;
      padding: 2px;
    }

    :host(:hover) {
      opacity: 1;
    }

    :host(:active) {
      cursor: grabbing;
    }
  `;

  protected render(): TemplateResult {
    return html`<ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>`;
  }
}
