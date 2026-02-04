import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';

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
      border-radius: 0 6px 6px 0;
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
    
    .mc-picker-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        flex-shrink: 0;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-right: none;
        border-radius: 6px 0 0 6px;
        color: var(--primary-color, #6366f1);
        --mdc-icon-size: 22px;
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
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        width: 800px;
        max-width: 100%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .mc-picker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }
    
    .mc-picker-header-start {
        display: flex;
        align-items: center;
        gap: 10px;
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

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-list {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .action-btn {
        border-radius: 6px;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
    }

    .save-btn {
        background-color: #4CAF50;
        color: white;
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Icon';

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedIcon = '';

  private _openModal(): void {
    this._selectedIcon = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _handleSave(): void {
    this.value = this._selectedIcon;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this._selectedIcon },
      bubbles: true,
      composed: true,
    }));
    this._closeModal();
  }

  private _selectIcon(e: CustomEvent): void {
    this._selectedIcon = e.detail.value;
    this._searchQuery = e.detail.value;
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
        ${this.value ? html`<div class="mc-picker-preview"><ha-icon .icon=${this.value}></ha-icon></div>` : ''}
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

  private _handleSearchChange(ev: Event) {
    this._searchQuery = (ev.target as HTMLInputElement).value;
  }

  private _renderModal(): TemplateResult {
    return html`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header">
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:emoticon-outline"></ha-icon>
                <span class="mc-picker-title">Select Icon</span>
            </div>
            <div>
                <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
                <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
          </div>
          <div class="mc-picker-search">
            <input
                type="text"
                placeholder="Search icons..."
               .value=${this._searchQuery}
               @input=${this._handleSearchChange}
            />
          </div>
          <div class="mc-picker-list">
            <ha-icon-picker
              .hass=${this.hass}
              .value=${this._selectedIcon}
              .search=${this._searchQuery}
              @value-changed=${this._selectIcon}
            ></ha-icon-picker>
          </div>
        </div>
      </div>
    `;
  }
}
