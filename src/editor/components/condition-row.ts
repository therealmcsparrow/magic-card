import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DisplayCondition, HomeAssistant } from '../../types';

import './entity-picker';
import './attribute-picker';
import { componentControlStyles, conditionRowStyles } from '../../css/css';

@customElement('mc-condition-row')
export class ConditionRow extends LitElement {
  static styles = [componentControlStyles, conditionRowStyles];

  @property({ attribute: false }) condition?: DisplayCondition;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) moduleEntity?: string;
  @property({ attribute: false }) onChange?: (updates: Partial<DisplayCondition>) => void;
  @property({ attribute: false }) onRemove?: () => void;

  protected render(): TemplateResult {
    if (!this.condition) return html``;
    const c = this.condition;

    return html`
      <div class="mc-cond">
        <div class="mc-cond-header">
          <span class="mc-cond-type">${c.type}</span>
          <select @change=${(e: Event) => this.onChange?.({ type: (e.target as HTMLSelectElement).value as DisplayCondition['type'] })}>
            <option value="state" ?selected=${c.type === 'state'}>State</option>
            <option value="attribute" ?selected=${c.type === 'attribute'}>Attribute</option>
            <option value="time" ?selected=${c.type === 'time'}>Time</option>
            <option value="template" ?selected=${c.type === 'template'}>Template</option>
          </select>
          <button class="mc-cond-remove" @click=${() => this.onRemove?.()}>&times;</button>
        </div>
        <div class="mc-cond-fields">
          ${this._renderFields(c)}
        </div>
      </div>
    `;
  }

  private _renderFields(c: DisplayCondition): TemplateResult {
    switch (c.type) {
      case 'state':
      case 'attribute': {
        const useModuleEntity = c.use_module_entity !== false;
        const effectiveEntity = useModuleEntity ? (this.moduleEntity || c.entity || '') : (c.entity || '');
        return html`
          ${this.moduleEntity
            ? html`
                <div class="mc-cond-entity-toggle">
                  <label>
                    <input
                      type="checkbox"
                      .checked=${useModuleEntity}
                      @change=${(e: Event) =>
                        this.onChange?.({ use_module_entity: (e.target as HTMLInputElement).checked })}
                    />
                    Use module entity
                  </label>
                </div>
              `
            : nothing}
          ${!useModuleEntity || !this.moduleEntity
            ? html`
                <div class="mc-cond-field full">
                  <label>Entity</label>
                  <mc-entity-picker
                    .hass=${this.hass}
                    .value=${c.entity || ''}
                    @value-changed=${(e: CustomEvent) => this.onChange?.({ entity: e.detail.value })}
                  ></mc-entity-picker>
                </div>
              `
            : nothing}
          ${c.type === 'attribute'
            ? html`
                <div class="mc-cond-field full">
                  <label>Attribute</label>
                  <mc-attribute-picker
                    .hass=${this.hass}
                    .value=${c.attribute || ''}
                    .entityId=${effectiveEntity}
                    @value-changed=${(e: CustomEvent) => this.onChange?.({ attribute: e.detail.value })}
                  ></mc-attribute-picker>
                </div>
              `
            : nothing}
          <div class="mc-cond-field">
            <label>Equals</label>
            <input type="text" .value=${c.state || ''}
              @input=${(e: InputEvent) => this.onChange?.({ state: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="mc-cond-field">
            <label>Not equals</label>
            <input type="text" .value=${c.state_not || ''}
              @input=${(e: InputEvent) => this.onChange?.({ state_not: (e.target as HTMLInputElement).value })} />
          </div>
        `;
      }
      case 'time':
        return html`
          <div class="mc-cond-field">
            <label>After</label>
            <input type="time" .value=${c.after || ''}
              @input=${(e: InputEvent) => this.onChange?.({ after: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="mc-cond-field">
            <label>Before</label>
            <input type="time" .value=${c.before || ''}
              @input=${(e: InputEvent) => this.onChange?.({ before: (e.target as HTMLInputElement).value })} />
          </div>
        `;
      case 'template':
        return html`
          <div class="mc-cond-field full">
            <label>Template</label>
            <textarea .value=${c.template || ''} rows="3" placeholder="{{ states('sensor.example') == 'on' }}"
              @input=${(e: InputEvent) => this.onChange?.({ template: (e.target as HTMLTextAreaElement).value })}
              class="mc-cond-template"
            ></textarea>
          </div>
        `;
      default:
        return html``;
    }
  }
}
