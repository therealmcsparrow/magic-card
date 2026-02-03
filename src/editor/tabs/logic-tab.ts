import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';

@customElement('mc-logic-tab')
export class LogicTab extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange?: (updated: CardModule) => void;

  protected render(): TemplateResult {
    if (!this.module || !this.onChange) {
      return html`<p>No module selected</p>`;
    }

    const handler = ModuleRegistry.get(this.module.type);
    if (!handler?.renderLogicTab) {
      return html`<p>No logic options for this module</p>`;
    }

    return handler.renderLogicTab(this.module, this.hass, this.onChange);
  }
}
