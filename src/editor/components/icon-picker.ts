import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles, iconPickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = [pickerStyles, iconPickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Icon';

  private _modalCtrl = new ModalDragResizeController(this);

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedIcon = '';

  private _openModal(): void {
    this._selectedIcon = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
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
        ${this.value
          ? html`
            <div class="mc-picker-entity-info" @click=${this._openModal} title=${this.value}>
              <div class="mc-picker-entity-icon">
                <ha-icon .icon=${this.value}></ha-icon>
              </div>
              <div class="mc-picker-entity-details">
                <div class="mc-picker-entity-name">${this.value}</div>
              </div>
            </div>
          `
          : html`
            <input
              type="text"
              class="mc-picker-input"
              .value=${this.value}
              placeholder="mdi:icon"
              @input=${this._onInputChange}
            />
          `
        }
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
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:emoticon-outline"></ha-icon>
                <span class="mc-picker-title">Select Icon</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
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
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }
}
