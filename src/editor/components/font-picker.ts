import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles, fontPickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

interface FontOption {
  name: string;
  family: string;
  category: string;
  isLocal?: boolean;
}

// Common local fonts available in most systems
const LOCAL_FONTS: FontOption[] = [
  { name: 'Arial', family: 'Arial, sans-serif', category: 'Sans-serif', isLocal: true },
  { name: 'Helvetica', family: 'Helvetica, sans-serif', category: 'Sans-serif', isLocal: true },
  { name: 'Times New Roman', family: '"Times New Roman", serif', category: 'Serif', isLocal: true },
  { name: 'Georgia', family: 'Georgia, serif', category: 'Serif', isLocal: true },
  { name: 'Courier New', family: '"Courier New", monospace', category: 'Monospace', isLocal: true },
  { name: 'Verdana', family: 'Verdana, sans-serif', category: 'Sans-serif', isLocal: true },
  { name: 'Tahoma', family: 'Tahoma, sans-serif', category: 'Sans-serif', isLocal: true },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', category: 'Sans-serif', isLocal: true },
  { name: 'Comic Sans MS', family: '"Comic Sans MS", cursive', category: 'Cursive', isLocal: true },
  { name: 'Impact', family: 'Impact, sans-serif', category: 'Sans-serif', isLocal: true },
];

// Popular Google Fonts
const GOOGLE_FONTS: FontOption[] = [
  { name: 'Roboto', family: 'Roboto, sans-serif', category: 'Sans-serif' },
  { name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'Sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif', category: 'Sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'Sans-serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif', category: 'Sans-serif' },
  { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif', category: 'Sans-serif' },
  { name: 'Raleway', family: 'Raleway, sans-serif', category: 'Sans-serif' },
  { name: 'PT Sans', family: '"PT Sans", sans-serif', category: 'Sans-serif' },
  { name: 'Merriweather', family: 'Merriweather, serif', category: 'Serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'Serif' },
  { name: 'Lora', family: 'Lora, serif', category: 'Serif' },
  { name: 'PT Serif', family: '"PT Serif", serif', category: 'Serif' },
  { name: 'Noto Sans', family: '"Noto Sans", sans-serif', category: 'Sans-serif' },
  { name: 'Ubuntu', family: 'Ubuntu, sans-serif', category: 'Sans-serif' },
  { name: 'Poppins', family: 'Poppins, sans-serif', category: 'Sans-serif' },
  { name: 'Nunito', family: 'Nunito, sans-serif', category: 'Sans-serif' },
  { name: 'Inconsolata', family: 'Inconsolata, monospace', category: 'Monospace' },
  { name: 'Fira Code', family: '"Fira Code", monospace', category: 'Monospace' },
  { name: 'Source Code Pro', family: '"Source Code Pro", monospace', category: 'Monospace' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive', category: 'Cursive' },
];

@customElement('mc-font-picker')
export class FontPicker extends LitElement {
  static styles = [pickerStyles, fontPickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';

  private _modalCtrl = new ModalDragResizeController(this);

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedFont: FontOption | null = null;
  @state() private _activeTab: 'local' | 'google' = 'local';

  private _onInputChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _openModal(): void {
    this._showModal = true;
    this._searchQuery = '';
    this._selectedFont = null;
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
    this._showModal = false;
  }

  private _selectFont(font: FontOption): void {
    this._selectedFont = font;
  }

  private _handleSave(): void {
    if (!this._selectedFont) {
      this._closeModal();
      return;
    }

    // If it's a Google Font, we need to add the @import statement to custom CSS
    // But for now, we'll just set the font-family value
    const value = this._selectedFont.family;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));

    this._closeModal();
  }

  private _getFilteredFonts(): FontOption[] {
    const fonts = this._activeTab === 'local' ? LOCAL_FONTS : GOOGLE_FONTS;

    if (!this._searchQuery) return fonts;

    const q = this._searchQuery.toLowerCase();
    return fonts.filter((font) =>
      font.name.toLowerCase().includes(q) ||
      font.category.toLowerCase().includes(q)
    );
  }

  private _getFontIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'serif':
        return 'mdi:format-font';
      case 'sans-serif':
        return 'mdi:format-text';
      case 'monospace':
        return 'mdi:code-tags';
      case 'cursive':
        return 'mdi:script-text';
      default:
        return 'mdi:format-font';
    }
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="Font family"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:format-font"></ha-icon>
          Browse
        </button>
      </div>
      ${this._showModal ? this._renderModal() : nothing}
    `;
  }

  private _renderModal(): TemplateResult {
    const fonts = this._getFilteredFonts();

    return html`
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:format-font"></ha-icon>
              <span class="mc-picker-title">Select Font</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            <button
              class="mc-modal-tab ${this._activeTab === 'local' ? 'active' : ''}"
              @click=${() => { this._activeTab = 'local'; this._searchQuery = ''; }}
            >
              <ha-icon icon="mdi:desktop-classic"></ha-icon>
              Local Fonts
            </button>
            <button
              class="mc-modal-tab ${this._activeTab === 'google' ? 'active' : ''}"
              @click=${() => { this._activeTab = 'google'; this._searchQuery = ''; }}
            >
              <ha-icon icon="mdi:google"></ha-icon>
              Google Fonts
            </button>
          </div>

          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search fonts..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>

          ${this._selectedFont ? this._renderPreview() : nothing}

          <div class="mc-picker-list">
            ${fonts.length > 0
              ? fonts.map((font) => this._renderFontItem(font))
              : html`<div class="mc-picker-empty">No fonts found</div>`
            }
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedFont}>Save</button>
          </div>

          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }

  private _renderPreview(): TemplateResult {
    if (!this._selectedFont) return html``;

    return html`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    `;
  }

  private _renderFontItem(font: FontOption): TemplateResult {
    const isSelected = this._selectedFont?.name === font.name;

    return html`
      <div class="mc-picker-item ${isSelected ? 'selected' : ''}" @click=${() => this._selectFont(font)}>
        <div class="mc-picker-item-icon">
          <ha-icon icon=${this._getFontIcon(font.category)}></ha-icon>
        </div>
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name" style="font-family: ${font.family}">
            ${font.name}
          </div>
          <div class="mc-picker-item-id">${font.category}</div>
        </div>
        ${font.isLocal
          ? html`<span class="mc-picker-item-badge">Local</span>`
          : html`<span class="mc-picker-item-badge" style="background: #4285f4; color: white;">Google</span>`
        }
      </div>
    `;
  }
}
