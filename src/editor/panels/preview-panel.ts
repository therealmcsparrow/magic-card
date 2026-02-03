import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';

@customElement('mc-preview-panel')
export class PreviewPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-preview {
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 8px;
      padding: 16px;
      background: var(--card-background-color, #fff);
      min-height: 60px;
    }

    .mc-preview-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color, #6b7280);
      margin-bottom: 8px;
    }
  `;

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;

  protected render(): TemplateResult {
    if (!this.module) {
      return html`<div class="mc-preview" style="color:var(--secondary-text-color)">No module selected</div>`;
    }

    const handler = ModuleRegistry.get(this.module.type);
    if (!handler) {
      return html`<div class="mc-preview">Unknown module type</div>`;
    }

    return html`
      <div class="mc-preview-label">Preview</div>
      <div class="mc-preview">
        ${handler.renderPreview(this.module, this.hass)}
      </div>
    `;
  }
}
