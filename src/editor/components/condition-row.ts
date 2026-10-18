import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DisplayCondition, HomeAssistant } from '../../types';

import './entity-picker';
import './attribute-picker';
import { editorSystem } from '../../css/editor-system';
import { t, m, type MessageId } from '../i18n';

const CONDITION_TYPES: Array<{ value: DisplayCondition['type']; label: MessageId }> = [
  { value: 'state', label: m('State') },
  { value: 'attribute', label: m('Attribute') },
  { value: 'time', label: m('Time') },
  { value: 'template', label: m('Template') },
];

@customElement('mc-condition-row')
export class ConditionRow extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
      }
      .cond-head .select {
        flex: 1;
      }
    `,
  ];

  @property({ attribute: false }) condition?: DisplayCondition;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) moduleEntity?: string;
  @property({ attribute: false }) onChange?: (updates: Partial<DisplayCondition>) => void;
  @property({ attribute: false }) onRemove?: () => void;

  protected render(): TemplateResult {
    if (!this.condition) return html``;
    const c = this.condition;

    return html`
      <div class="cond">
        <div class="cond-head">
          <div class="select">
            <select
              class="input"
              aria-label=${t('Condition type')}
              @change=${(e: Event) => this.onChange?.({ type: (e.target as HTMLSelectElement).value as DisplayCondition['type'] })}
            >
              ${CONDITION_TYPES.map(
                (ct) => html`<option value=${ct.value} ?selected=${c.type === ct.value}>${t(ct.label)}</option>`,
              )}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${t('Remove condition')}
            title=${t('Remove condition')}
            @click=${() => this.onRemove?.()}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${this._renderFields(c)}
      </div>
    `;
  }

  private _textField(label: string, value: string | undefined, onInput: (v: string) => void, type = 'text'): TemplateResult {
    return html`
      <label class="field">
        <span class="field-head"><span class="lbl">${label}</span></span>
        <input
          class="input"
          type=${type}
          .value=${value || ''}
          @input=${(e: InputEvent) => onInput((e.target as HTMLInputElement).value)}
        />
      </label>
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
                <div class="switch-row">
                  <span class="txt">${t('Use module entity')}</span>
                  <button
                    type="button"
                    class="switch"
                    role="switch"
                    aria-checked=${useModuleEntity ? 'true' : 'false'}
                    aria-label=${t('Use module entity')}
                    @click=${() => this.onChange?.({ use_module_entity: !useModuleEntity })}
                  ></button>
                </div>
              `
            : nothing}
          ${!useModuleEntity || !this.moduleEntity
            ? html`
                <div class="field">
                  <div class="field-head"><span class="lbl">${t('Entity')}</span></div>
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
                <div class="field">
                  <div class="field-head"><span class="lbl">${t('Attribute')}</span></div>
                  <mc-attribute-picker
                    .hass=${this.hass}
                    .value=${c.attribute || ''}
                    .entityId=${effectiveEntity}
                    @value-changed=${(e: CustomEvent) => this.onChange?.({ attribute: e.detail.value })}
                  ></mc-attribute-picker>
                </div>
              `
            : nothing}
          <div class="two">
            ${this._textField(t('Equals'), c.state, (v) => this.onChange?.({ state: v }))}
            ${this._textField(t('Not equals'), c.state_not, (v) => this.onChange?.({ state_not: v }))}
          </div>
        `;
      }
      case 'time':
        return html`
          <div class="two">
            ${this._textField(t('After'), c.after, (v) => this.onChange?.({ after: v }), 'time')}
            ${this._textField(t('Before'), c.before, (v) => this.onChange?.({ before: v }), 'time')}
          </div>
        `;
      case 'template':
        return html`
          <label class="field">
            <span class="field-head"><span class="lbl">${t('Template')}</span></span>
            <textarea
              class="input"
              rows="3"
              placeholder="{{ states('sensor.example') == 'on' }}"
              .value=${c.template || ''}
              @input=${(e: InputEvent) => this.onChange?.({ template: (e.target as HTMLTextAreaElement).value })}
            ></textarea>
          </label>
        `;
      default:
        return html``;
    }
  }
}
