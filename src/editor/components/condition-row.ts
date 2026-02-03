import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DisplayCondition } from '../../types';

@customElement('mc-condition-row')
export class ConditionRow extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-cond {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 8px;
      position: relative;
    }

    .mc-cond-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-cond-type {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--primary-color, #6366f1);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .mc-cond-remove {
      margin-left: auto;
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mc-cond-remove:hover {
      background: var(--divider-color);
      color: var(--error-color, #ef4444);
    }

    .mc-cond-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .mc-cond-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .mc-cond-field label {
      font-size: 0.6875rem;
      color: var(--secondary-text-color, #6b7280);
    }

    .mc-cond-field input,
    .mc-cond-field select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 4px;
      font-size: 0.8125rem;
      outline: none;
    }

    .mc-cond-field.full {
      grid-column: 1 / -1;
    }
  `;

  @property({ attribute: false }) condition?: DisplayCondition;
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
      case 'attribute':
        return html`
          <div class="mc-cond-field full">
            <label>Entity</label>
            <input type="text" .value=${c.entity || ''} placeholder="entity_id"
              @input=${(e: InputEvent) => this.onChange?.({ entity: (e.target as HTMLInputElement).value })} />
          </div>
          ${c.type === 'attribute' ? html`
            <div class="mc-cond-field">
              <label>Attribute</label>
              <input type="text" .value=${c.attribute || ''}
                @input=${(e: InputEvent) => this.onChange?.({ attribute: (e.target as HTMLInputElement).value })} />
            </div>
          ` : nothing}
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
      case 'time':
        return html`
          <div class="mc-cond-field">
            <label>After (HH:MM)</label>
            <input type="text" .value=${c.after || ''} placeholder="08:00"
              @input=${(e: InputEvent) => this.onChange?.({ after: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="mc-cond-field">
            <label>Before (HH:MM)</label>
            <input type="text" .value=${c.before || ''} placeholder="22:00"
              @input=${(e: InputEvent) => this.onChange?.({ before: (e.target as HTMLInputElement).value })} />
          </div>
        `;
      case 'template':
        return html`
          <div class="mc-cond-field full">
            <label>Template</label>
            <textarea .value=${c.template || ''} rows="3" placeholder="{{ states('sensor.example') == 'on' }}"
              @input=${(e: InputEvent) => this.onChange?.({ template: (e.target as HTMLTextAreaElement).value })}
              style="padding:6px 8px;border:1px solid var(--divider-color);border-radius:4px;font-size:0.8125rem;resize:vertical"
            ></textarea>
          </div>
        `;
      default:
        return html``;
    }
  }
}
