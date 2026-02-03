import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Modal overlay */
    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 420px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-picker-close:hover {
      background: var(--divider-color, #e0e0e0);
    }
  `;

  @property({ attribute: false }) hass?: unknown;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Icon';

  @state() private _showModal = false;

  private _openModal(): void {
    this._showModal = true;
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _selectIcon(e: CustomEvent): void {
    const icon = e.detail.value;
    if (this.value !== icon) {
        this.value = icon;
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: icon },
            bubbles: true,
            composed: true,
        }));
    }
    this._closeModal();
  }

  private _onInputChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="mdi:icon"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:emoticon-outline"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    return html`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:emoticon-outline"></ha-icon>
            <span class="mc-picker-title">Select Icon</span>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
          </div>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${this.value}
            .label=${this.label}
            @value-changed=${this._selectIcon}
          ></ha-icon-picker>
        </div>
      </div>
    `;
  }
}