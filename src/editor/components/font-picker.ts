import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles, fontPickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { LOCAL_FONT_NAMES } from '../../google-fonts/local-fonts';
import type { GoogleCategory, GoogleFamily } from '../../google-fonts/catalogue';
import { googleFontsAllowed, googleFontsChunk, loadCatalogue } from '../../utils/google-fonts';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t } from '../i18n';

interface FontOption {
  name: string;
  family: string;
  category: string;
  isLocal?: boolean;
  google?: GoogleFamily;
}

const CATEGORIES: GoogleCategory[] = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace'];
/** Most rows the Google list renders at once; the rest is reached by searching or filtering. */
const MAX_ROWS = 60;
/** Only for drawing a row in its own face; the stored value comes from genericFor in the catalogue chunk. */
const GENERIC: Record<GoogleCategory, string> = { 'sans-serif': 'sans-serif', serif: 'serif', display: 'sans-serif', handwriting: 'cursive', monospace: 'monospace' };
const PLAIN_NAME = /^[A-Za-z0-9 ]{1,64}$/;

const categoryLabel = (c: GoogleCategory): string => {
  switch (c) {
    case 'sans-serif': return t('card-editor.font-picker.category-sans-serif');
    case 'serif': return t('card-editor.font-picker.category-serif');
    case 'display': return t('card-editor.font-picker.category-display');
    case 'handwriting': return t('card-editor.font-picker.category-handwriting');
    default: return t('card-editor.font-picker.category-monospace');
  }
};

/**
 * A bare catalogue family name becomes `"Name", <generic>` (the form every font field stores); anything else comes back trimmed and otherwise unchanged.
 * Looks the name up in the lazy catalogue chunk, which is a local import and not a Google request.
 */
export async function normaliseFontValue(value: string): Promise<string> {
  const v = value.trim();
  if (!PLAIN_NAME.test(v) || LOCAL_FONT_NAMES.some((n) => n.toLowerCase() === v.toLowerCase())) return v;
  try {
    const m = await googleFontsChunk();
    const family = m.findFamily(v);
    return family ? `"${family.name}", ${m.genericFor(family.category)}` : v;
  } catch {
    return v;
  }
}

// Common local fonts available in most systems
const LOCAL_FAMILY: Record<string, { family: string; category: string }> = {
  Arial: { family: 'Arial, sans-serif', category: 'Sans-serif' },
  Helvetica: { family: 'Helvetica, sans-serif', category: 'Sans-serif' },
  'Times New Roman': { family: '"Times New Roman", serif', category: 'Serif' },
  Georgia: { family: 'Georgia, serif', category: 'Serif' },
  'Courier New': { family: '"Courier New", monospace', category: 'Monospace' },
  Verdana: { family: 'Verdana, sans-serif', category: 'Sans-serif' },
  Tahoma: { family: 'Tahoma, sans-serif', category: 'Sans-serif' },
  'Trebuchet MS': { family: '"Trebuchet MS", sans-serif', category: 'Sans-serif' },
  'Comic Sans MS': { family: '"Comic Sans MS", cursive', category: 'Cursive' },
  Impact: { family: 'Impact, sans-serif', category: 'Sans-serif' },
};
const LOCAL_FONTS: FontOption[] = LOCAL_FONT_NAMES.map((name) => ({ name, ...LOCAL_FAMILY[name], isLocal: true }));

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
  @state() private _category: GoogleCategory | null = null;
  @state() private _catalogue: GoogleFamily[] = [];
  /** Google rows that have been in view: only these are drawn in their own face. */
  @state() private _inView = new Set<string>();
  private _observer?: IntersectionObserver;

  private _onSettings = (): void => this.requestUpdate();

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mcu-settings', this._onSettings);
  }

  disconnectedCallback(): void {
    window.removeEventListener('mcu-settings', this._onSettings);
    this._observer?.disconnect();
    super.disconnectedCallback();
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

  private async _onInputCommit(e: Event): Promise<void> {
    const raw = (e.target as HTMLInputElement).value;
    const value = await normaliseFontValue(raw);
    if (value === raw) return;
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
    this._category = null;
    if (googleFontsAllowed() && !this._catalogue.length) loadCatalogue().then((c) => { this._catalogue = c; }, () => 0);
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _selectFont(font: FontOption): void {
    this._selectedFont = font;
  }

  private async _handleSave(): Promise<void> {
    const font = this._selectedFont;
    if (!font) {
      this._closeModal();
      return;
    }

    // the card loads a Google Font it uses (src/utils/google-fonts.ts)
    const value = font.google ? await normaliseFontValue(font.name) : font.family;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));

    this._closeModal();
  }

  private _googleRows(): { rows: FontOption[]; total: number } {
    const q = this._searchQuery.trim().toLowerCase();
    const all = this._catalogue.filter((f) => (!this._category || f.category === this._category) && (!q || f.name.toLowerCase().includes(q)));
    const rows = all.slice(0, MAX_ROWS).map((f) => ({ name: f.name, family: `"${f.name}", ${GENERIC[f.category]}`, category: f.category, google: f }));
    return { rows, total: all.length };
  }

  private _getFilteredFonts(): FontOption[] {
    if (!this._searchQuery) return LOCAL_FONTS;
    const q = this._searchQuery.toLowerCase();
    return LOCAL_FONTS.filter((font) => font.name.toLowerCase().includes(q) || font.category.toLowerCase().includes(q));
  }

  protected updated(): void {
    this._observer?.disconnect();
    this._observer = undefined;
    if (!this._showModal || this._activeTab !== 'google') return;
    const rows = [...this.renderRoot.querySelectorAll<HTMLElement>('[data-gf]')].filter((r) => !this._inView.has(r.dataset.gf!));
    if (!rows.length) return;
    if (typeof IntersectionObserver === 'undefined') return this._reveal(rows.map((r) => r.dataset.gf!));
    this._observer = new IntersectionObserver((entries) => {
      const names = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.gf!);
      if (names.length) this._reveal(names);
    });
    rows.forEach((r) => this._observer!.observe(r));
  }

  /** Marks rows as seen and loads their font for the preview (a no-op while Google Fonts are not allowed). */
  private _reveal(names: string[]): void {
    const fresh = names.filter((n) => !this._inView.has(n));
    if (!fresh.length) return;
    this._inView = new Set([...this._inView, ...fresh]);
    const families = this._catalogue.filter((f) => fresh.includes(f.name));
    googleFontsChunk().then((m) => m.loadGoogleFonts(families), () => 0);
  }

  private _getFontIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'serif':
      case 'display':
        return 'mdi:format-font';
      case 'sans-serif':
        return 'mdi:format-text';
      case 'monospace':
        return 'mdi:code-tags';
      case 'cursive':
      case 'handwriting':
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
          placeholder=${t('card-editor.font-picker.font-family')}
          aria-label=${t('card-editor.font-picker.font-family')}
          @input=${this._onInputChange}
          @change=${this._onInputCommit}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${t('card-editor.font-picker.browse')}</button>
      </div>
      ${this._showModal ? this._renderModal() : nothing}
    `;
  }

  private _setTab(tab: 'local' | 'google'): void {
    this._activeTab = tab;
    this._searchQuery = '';
    this._selectedFont = null;
  }

  private _renderModal(): TemplateResult {
    const google = googleFontsAllowed();
    const tab = google ? this._activeTab : 'local';
    const { rows, total } = tab === 'google' ? this._googleRows() : { rows: this._getFilteredFonts(), total: 0 };
    const fonts = rows;

    return html`
      ${renderPickerWindow(t('card-editor.font-picker.select-font'), () => this._closeModal(), 'm', html`

          <div class="mc-picker-search">
            <div class="seg full" role="tablist" aria-label=${t('card-editor.font-picker.font-source')}>
              <button
                type="button"
                role="tab"
                aria-selected=${tab === 'local' ? 'true' : 'false'}
                @click=${() => this._setTab('local')}
              >
                <ha-icon icon="mdi:desktop-classic"></ha-icon>
                ${t('card-editor.font-picker.local-fonts')}
              </button>
              ${google ? html`<button
                  type="button"
                  role="tab"
                  aria-selected=${tab === 'google' ? 'true' : 'false'}
                  @click=${() => this._setTab('google')}
                >
                  <ha-icon icon="mdi:google"></ha-icon>
                  ${t('card-editor.font-picker.google-fonts')}
                </button>` : nothing}
            </div>
            ${renderPickerSearch(t('card-editor.font-picker.search-fonts'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>

          ${tab === 'google' ? html`<div class="mc-font-cats" role="group" aria-label=${t('card-editor.font-picker.categories')}>
            ${CATEGORIES.map((c) => html`<button type="button" class="chip mc-font-cat" aria-pressed=${this._category === c ? 'true' : 'false'} @click=${() => { this._category = this._category === c ? null : c; }}>${categoryLabel(c)}</button>`)}
          </div>
          <div class="mc-font-count" aria-live="polite">${t('card-editor.font-picker.results', { total })}</div>` : nothing}

          ${this._selectedFont ? this._renderPreview() : nothing}

          <div class="mc-picker-list" role="listbox" aria-label=${t('card-editor.font-picker.fonts')}>
            ${fonts.length > 0
              ? fonts.map((font) => this._renderFontItem(font))
              : html`<div class="mc-picker-empty">${t('card-editor.font-picker.no-fonts-found')}</div>`
            }
            ${tab === 'google' && total > rows.length
              ? html`<div class="mc-font-more">${t('card-editor.font-picker.showing-first', { n: rows.length, total })}</div>`
              : nothing}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('card-editor.font-picker.cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedFont}>${t('card-editor.font-picker.save')}</button>
          </div>
      `)}
    `;
  }

  private _renderPreview(): TemplateResult {
    if (!this._selectedFont) return html``;

    return html`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          ${t('card-editor.font-picker.the-quick-brown-fox-jumps-over-the-lazy')}
        </div>
      </div>
    `;
  }

  private _renderFontItem(font: FontOption): TemplateResult {
    const isSelected = this._selectedFont?.name === font.name;
    const own = font.isLocal || this._inView.has(font.name) ? `font-family: ${font.family}` : '';

    return html`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        data-gf=${font.google ? font.name : nothing}
        aria-selected=${isSelected ? 'true' : 'false'}
        @click=${() => this._selectFont(font)}
      >
        <span class="mc-picker-item-icon"><ha-icon icon=${this._getFontIcon(font.category)}></ha-icon></span>
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name" style=${own}>${font.name}</span>
          <span class="mc-picker-item-meta">${font.google ? categoryLabel(font.google.category) : font.category}</span>
        </span>
        <span class="chip">${font.isLocal ? t('card-editor.font-picker.local') : t('card-editor.font-picker.google')}</span>
      </button>
    `;
  }
}
