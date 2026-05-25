import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

@customElement('mc-attribute-picker')
export class AttributePicker extends LitElement {
  static styles = [pickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) entityId = '';

  private _modalCtrl = new ModalDragResizeController(this);

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedAttribute = '';

  private _openModal(): void {
    this._selectedAttribute = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
    this._showModal = false;
  }

  private _handleSave(): void {
    this.value = this._selectedAttribute;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this._selectedAttribute },
      bubbles: true,
      composed: true,
    }));
    this._closeModal();
  }

  private _selectAttribute(attr: string): void {
    this._selectedAttribute = attr;
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

  private _clearValue(): void {
    this.value = '';
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
  }

  private _getAttributes(): Array<{ name: string; value: string }> {
    if (!this.hass || !this.entityId) return [];
    const entity = this.hass.states[this.entityId];
    if (!entity) return [];

    return Object.entries(entity.attributes)
      .map(([name, val]) => ({
        name,
        value: String(val ?? ''),
      }))
      .filter(a => {
        if (!this._searchQuery) return true;
        const q = this._searchQuery.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.value.toLowerCase().includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _getAttributeValue(): string | null {
    if (!this.hass || !this.entityId || !this.value) return null;
    const entity = this.hass.states[this.entityId];
    if (!entity) return null;
    const val = entity.attributes[this.value];
    return val !== undefined ? String(val) : null;
  }

  protected render(): TemplateResult {
    const attrValue = this._getAttributeValue();

    return html`
      <div class="mc-picker-row">
        ${this.value && attrValue !== null
          ? html`
            <div class="mc-picker-entity-info" @click=${this._openModal} title=${this.value}>
              <div class="mc-picker-entity-icon">
                <ha-icon icon="mdi:tag-text-outline"></ha-icon>
              </div>
              <div class="mc-picker-entity-details">
                <div class="mc-picker-entity-name">${this.value}</div>
                <div class="mc-picker-entity-id">${attrValue}</div>
              </div>
            </div>
          `
          : html`
            <input
              type="text"
              class="mc-picker-input"
              .value=${this.value}
              placeholder="attribute"
              @input=${this._onInputChange}
            />
          `
        }
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const attributes = this._getAttributes();

    return html`
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
              <span class="mc-picker-title">Select Attribute</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search attributes..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>
          <div class="mc-picker-list">
            ${attributes.length > 0
              ? attributes.map(attr => html`
                  <div class="mc-picker-item ${this._selectedAttribute === attr.name ? 'selected' : ''}"
                       @click=${() => this._selectAttribute(attr.name)}>
                    <div class="mc-picker-item-icon">
                      <ha-icon icon="mdi:tag-text-outline"></ha-icon>
                    </div>
                    <div class="mc-picker-item-content">
                      <div class="mc-picker-item-name">${attr.name}</div>
                    </div>
                    <span class="mc-picker-item-state">${attr.value.length > 30 ? attr.value.slice(0, 30) + '...' : attr.value}</span>
                  </div>
                `)
              : html`<div class="mc-picker-empty">No attributes found</div>`
            }
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
