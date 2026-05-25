import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DesignConfig } from '../../types';
import './unit-field';
import { boxFieldStyles, componentControlStyles } from '../../css/css';

@customElement('mc-box-field')
export class BoxField extends LitElement {
  static styles = [componentControlStyles, boxFieldStyles];

  @property({ attribute: false }) design: DesignConfig = {};
  @property({ attribute: false }) onChange!: (updates: Record<string, unknown>) => void;
  @property({ type: String }) baseName: 'padding' | 'margin' | 'border_radius' = 'padding';

  @state() private _linked = false;

  private _getSuffixKey(baseName: string, suffix: string): string {
    // Handle border-radius special naming
    if (baseName === 'border_radius') {
      const suffixMap: Record<string, string> = {
        'top': 'border_top_left_radius',
        'right': 'border_top_right_radius',
        'bottom': 'border_bottom_right_radius',
        'left': 'border_bottom_left_radius',
      };
      return suffixMap[suffix] || `${baseName}_${suffix}`;
    }
    return `${baseName}_${suffix}`;
  }

  private _getValue(suffix: 'top' | 'right' | 'bottom' | 'left'): string {
    const key = this._getSuffixKey(this.baseName, suffix);
    const design = this.design as Record<string, unknown>;

    // If shorthand is present, use it.
    if (this.design[this.baseName]) {
      const parts = String(this.design[this.baseName]).split(' ');
      if (parts.length === 1) return parts[0];
      if (parts.length === 2) {
        return (suffix === 'top' || suffix === 'bottom') ? parts[0] : parts[1];
      }
      if (parts.length === 3) {
        if (suffix === 'top') return parts[0];
        if (suffix === 'right' || suffix === 'left') return parts[1];
        if (suffix === 'bottom') return parts[2];
      }
      if (parts.length === 4) {
        if (suffix === 'top') return parts[0];
        if (suffix === 'right') return parts[1];
        if (suffix === 'bottom') return parts[2];
        if (suffix === 'left') return parts[3];
      }
    }

    return (design[key] as string) || '';
  }

  private _handleValueChange(
    position: 'top' | 'right' | 'bottom' | 'left',
    value: string,
  ) {
    const updates: Record<string, unknown> = {};

    const topKey = this._getSuffixKey(this.baseName, 'top');
    const rightKey = this._getSuffixKey(this.baseName, 'right');
    const bottomKey = this._getSuffixKey(this.baseName, 'bottom');
    const leftKey = this._getSuffixKey(this.baseName, 'left');
    const baseKey = this.baseName;

    // Clear shorthand before applying longhand
    updates[baseKey] = undefined;

    if (this._linked && position === 'top') {
      // When linked, changing the master (top) value updates all
      updates[topKey] = value;
      updates[rightKey] = value;
      updates[bottomKey] = value;
      updates[leftKey] = value;
    } else if (!this._linked) {
      // When not linked, only update the specific field
      const key = this._getSuffixKey(this.baseName, position);
      updates[key] = value;
    }
    // If linked and not top, ignore the change (field is disabled)

    this.onChange(updates);
  }

  private _toggleLink() {
    this._linked = !this._linked;

    // When linking, set all values to the top value
    if (this._linked) {
      const masterValue = this._getValue('top');
      if (masterValue) {
        const updates: Record<string, unknown> = {};
        updates[this.baseName] = undefined;
        updates[this._getSuffixKey(this.baseName, 'top')] = masterValue;
        updates[this._getSuffixKey(this.baseName, 'right')] = masterValue;
        updates[this._getSuffixKey(this.baseName, 'bottom')] = masterValue;
        updates[this._getSuffixKey(this.baseName, 'left')] = masterValue;
        this.onChange(updates);
      }
    }
  }

  private _getLabel(position: 'top' | 'right' | 'bottom' | 'left'): string {
    if (this.baseName === 'border_radius') {
      const labelMap: Record<string, string> = {
        'top': 'TL',
        'right': 'TR',
        'bottom': 'BR',
        'left': 'BL',
      };
      return labelMap[position] || position;
    }
    return position.charAt(0).toUpperCase();
  }

  private _renderInput(position: 'top' | 'right' | 'bottom' | 'left') {
    const isDisabled = this._linked && position !== 'top';
    const displayValue = this._linked ? this._getValue('top') : this._getValue(position);

    return html`
      <div class="mc-box-input ${isDisabled ? 'disabled' : ''}">
        <label>${this._getLabel(position)}</label>
        <mc-unit-field
          .value=${displayValue}
          ?disabled=${isDisabled}
          @value-changed=${(e: CustomEvent) => this._handleValueChange(position, e.detail.value)}
        ></mc-unit-field>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-box-field">
        <div class="mc-box-toolbar">
          <button
            class="mc-box-link-btn ${this._linked ? 'linked' : ''}"
            title="${this._linked ? 'Unlink values' : 'Link values'}"
            @click=${this._toggleLink}
          >
            <ha-icon icon="${this._linked ? 'mdi:link' : 'mdi:link-off'}"></ha-icon>
            <span>${this._linked ? 'Linked' : 'Per side'}</span>
          </button>
        </div>
        <div class="mc-box-inputs">
          ${this._renderInput('top')}
          ${this._renderInput('right')}
          ${this._renderInput('bottom')}
          ${this._renderInput('left')}
        </div>
      </div>
    `;
  }
}
