import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';

@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public value?: string;
  @property() public label?: string;
  @property({ type: Boolean }) public disabled = false;

  protected render() {
    return html`
      <ha-icon-picker
        .hass=${this.hass}
        .value=${this.value}
        .label=${this.label}
        .disabled=${this.disabled}
        @value-changed=${this._valueChanged}
      ></ha-icon-picker>
    `;
  }

  private _valueChanged(ev: CustomEvent) {
    const value = ev.detail.value;
    if (this.value !== value) {
      this.value = value;
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: {
            value: value,
          },
        })
      );
    }
  }
}
