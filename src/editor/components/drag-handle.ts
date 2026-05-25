import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentControlStyles, dragHandleStyles } from '../../css/css';

@customElement('mc-drag-handle')
export class DragHandle extends LitElement {
  static styles = [componentControlStyles, dragHandleStyles];

  protected render(): TemplateResult {
    return html`<ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>`;
  }
}
