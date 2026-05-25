import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentControlStyles, unitFieldStyles } from '../../css/css';

const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh', 'auto'] as const;
type Unit = typeof UNITS[number];

@customElement('mc-unit-field')
export class UnitField extends LitElement {
  static styles = [componentControlStyles, unitFieldStyles];

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) disabled = false;

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
          ?disabled=${this.disabled || unit === 'auto'}
          @input=${(e: InputEvent) => {
            const val = (e.target as HTMLInputElement).value;
            this._emitChange(val, unit);
          }}
        />
        <select
          class="mc-unit-select"
          .value=${unit}
          ?disabled=${this.disabled}
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
