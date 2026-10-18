import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles, fontPickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-system';
import { GOOGLE_FONTS, loadGoogleFonts } from '../../utils/google-fonts';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t } from '../i18n';

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

@customElement('mc-font-picker')
export class FontPicker extends LitElement {
  static styles = [editorSystem, pickerStyles, fontPickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

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

    // the card loads a Google Font it uses (src/utils/google-fonts.ts)
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
    // the Google tab previews each font in its own face
    if (this._activeTab === 'google') loadGoogleFonts(GOOGLE_FONTS.map((f) => f.name));
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
          class="input"
          .value=${this.value}
          placeholder=${t('Font family')}
          aria-label=${t('Font family')}
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${t('Browse')}</button>
      </div>
      ${this._showModal ? this._renderModal() : nothing}
    `;
  }

  private _setTab(tab: 'local' | 'google'): void {
    this._activeTab = tab;
    this._searchQuery = '';
  }

  private _renderModal(): TemplateResult {
    const fonts = this._getFilteredFonts();

    return html`
      ${renderPickerWindow(t('Select font'), () => this._closeModal(), 'm', html`

          <div class="mc-picker-search">
            <div class="seg full" role="tablist" aria-label=${t('Font source')}>
              <button
                type="button"
                role="tab"
                aria-selected=${this._activeTab === 'local' ? 'true' : 'false'}
                @click=${() => this._setTab('local')}
              >
                <ha-icon icon="mdi:desktop-classic"></ha-icon>
                ${t('Local fonts')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected=${this._activeTab === 'google' ? 'true' : 'false'}
                @click=${() => this._setTab('google')}
              >
                <ha-icon icon="mdi:google"></ha-icon>
                ${t('Google Fonts')}
              </button>
            </div>
            ${renderPickerSearch(t('Search fonts'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>

          ${this._selectedFont ? this._renderPreview() : nothing}

          <div class="mc-picker-list" role="listbox" aria-label=${t('Fonts')}>
            ${fonts.length > 0
              ? fonts.map((font) => this._renderFontItem(font))
              : html`<div class="mc-picker-empty">${t('No fonts found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedFont}>${t('Save')}</button>
          </div>
      `)}
    `;
  }

  private _renderPreview(): TemplateResult {
    if (!this._selectedFont) return html``;

    return html`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          ${t('The quick brown fox jumps over the lazy dog')}
        </div>
      </div>
    `;
  }

  private _renderFontItem(font: FontOption): TemplateResult {
    const isSelected = this._selectedFont?.name === font.name;

    return html`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${isSelected ? 'true' : 'false'}
        @click=${() => this._selectFont(font)}
      >
        <span class="mc-picker-item-icon"><ha-icon icon=${this._getFontIcon(font.category)}></ha-icon></span>
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name" style="font-family: ${font.family}">${font.name}</span>
          <span class="mc-picker-item-meta">${font.category}</span>
        </span>
        <span class="chip">${font.isLocal ? t('Local') : t('Google')}</span>
      </button>
    `;
  }
}
