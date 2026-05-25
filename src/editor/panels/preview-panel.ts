import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { componentControlStyles, previewPanelStyles } from '../../css/css';

@customElement('mc-preview-panel')
export class PreviewPanel extends LitElement {
  static styles = [componentControlStyles, previewPanelStyles];

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;

  protected render(): TemplateResult {
    if (!this.module) {
      return html`<div class="mc-preview mc-preview-muted">No module selected</div>`;
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
