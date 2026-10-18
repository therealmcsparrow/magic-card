import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-system';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';

@customElement('mc-attribute-picker')
export class AttributePicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) entityId = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedAttribute = '';

  private _openModal(): void {
    this._selectedAttribute = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
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
    const entity = this.hass && this.entityId ? this.hass.states[this.entityId] : undefined;
    const names = entity ? Object.keys(entity.attributes).sort((a, b) => a.localeCompare(b)) : [];

    // Mockup: a plain select, "State (no attribute)" first. Without a known entity, a text field.
    if (!names.length) {
      return html`
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="attribute"
          aria-label="Attribute"
          spellcheck="false"
          @input=${this._onInputChange}
        />
        ${this._showModal ? this._renderModal() : ''}
      `;
    }
    const options = this.value && !names.includes(this.value) ? [this.value, ...names] : names;
    return html`
      <div class="select">
        <select
          class="input"
          aria-label="Attribute"
          .value=${this.value}
          @change=${(e: Event) => {
            this._onInputChange(e as InputEvent);
          }}
        >
          <option value="" ?selected=${!this.value}>State (no attribute)</option>
          ${options.map((n) => html`<option value=${n} ?selected=${n === this.value}>${n}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const attributes = this._getAttributes();

    return html`
      ${renderPickerWindow('Select attribute', () => this._closeModal(), 's', html`
          <div class="mc-picker-search">
            ${renderPickerSearch('Search attributes', this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label="Attributes">
            ${attributes.length > 0
              ? attributes.map(attr => html`
                  <button
                    type="button"
                    role="option"
                    class="mc-picker-item"
                    aria-selected=${this._selectedAttribute === attr.name ? 'true' : 'false'}
                    @click=${() => this._selectAttribute(attr.name)}
                  >
                    <span class="mc-picker-item-icon"><ha-icon icon="mdi:tag-text-outline"></ha-icon></span>
                    <span class="mc-picker-item-content">
                      <span class="mc-picker-item-name">${attr.name}</span>
                      <span class="mc-picker-item-id">${attr.value.length > 60 ? attr.value.slice(0, 60) + '...' : attr.value}</span>
                    </span>
                  </button>
                `)
              : html`<div class="mc-picker-empty">No attributes found</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>Cancel</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>Save</button>
          </div>
      `)}
    `;
  }
}
