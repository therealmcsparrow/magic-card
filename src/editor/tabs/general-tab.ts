import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';

@customElement('mc-general-tab')
export class GeneralTab extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange?: (updated: CardModule) => void;

  protected render(): TemplateResult {
    if (!this.module || !this.onChange) {
      return html`<p>No module selected</p>`;
    }

    const handler = ModuleRegistry.get(this.module.type);
    if (!handler) {
      return html`<p>Unknown module type: ${this.module.type}</p>`;
    }

    return handler.renderGeneralTab(this.module, this.hass, this.onChange);
  }
}
