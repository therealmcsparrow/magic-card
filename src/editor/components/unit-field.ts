import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh', 'auto'] as const;
type Unit = typeof UNITS[number];

@customElement('mc-unit-field')
export class UnitField extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-unit-field {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .mc-unit-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px 0 0 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      min-width: 0;
      border-right: none;
    }

    .mc-unit-input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-unit-select {
      padding: 8px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 0 6px 6px 0;
      font-size: 0.75rem;
      background: var(--card-background-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      cursor: pointer;
      min-width: 55px;
    }

    .mc-unit-select:focus {
      border-color: var(--primary-color, #6366f1);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';

  private _parseValue(): { number: string; unit: string } {
    if (!this.value) return { number: '', unit: 'px' };

    // Handle 'auto' specially
    if (this.value === 'auto') return { number: '', unit: 'auto' };

    // Match number and unit
    const match = this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);
    if (match) {
      return { number: match[1], unit: match[2] || 'px' };
    }

    // If no match, treat entire value as number with px
    return { number: this.value, unit: 'px' };
  }

  private _emitChange(number: string, unit: string): void {
    let value = '';
    if (unit === 'auto') {
      value = 'auto';
    } else if (number) {
      value = `${number}${unit}`;
    }

    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  }

  protected render(): TemplateResult {
    const { number, unit } = this._parseValue();

    return html`
      <div class="mc-unit-field">
        <input
          class="mc-unit-input"
          type="text"
          .value=${unit === 'auto' ? '' : number}
          placeholder=${this.placeholder || '0'}
          ?disabled=${unit === 'auto'}
          @input=${(e: InputEvent) => {
            const val = (e.target as HTMLInputElement).value;
            this._emitChange(val, unit);
          }}
        />
        <select
          class="mc-unit-select"
          .value=${unit}
          @change=${(e: Event) => {
            const newUnit = (e.target as HTMLSelectElement).value;
            this._emitChange(number, newUnit);
          }}
        >
          ${UNITS.map(u => html`
            <option value=${u} ?selected=${unit === u}>${u}</option>
          `)}
        </select>
      </div>
    `;
  }
}
