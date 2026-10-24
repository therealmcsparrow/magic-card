import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { pickerStyles, colorPickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerWindow, PickerWindowController } from './picker-parts';
import { parseEntityColor, attrRgb } from '../../utils/entity-color';
import { ENTITY_PAINT_RE } from '../../contracts/entity-colour';
import { parseGradient } from '../../utils/gradient';
import { safeColor } from '../../utils/safe-css';
import { editableGradient, gradientToString, renderSeg, MAX_STOPS, type GradientModel } from './gradient-editor';
import { COLOUR_FORMATS, formatOf, parseColour, writeColour, type ColourFormat } from './colour-formats';
import './unit-field';
import { t } from '../i18n';

const STORAGE_KEY = 'magic-card-saved-colors';
const MAX_SAVED_COLORS = 12;

/** The CSS function the HA theme chips stand for: a code word, not translated. */
const CSS_VAR = 'var';

const PRESET_COLORS = [
  // Row 1 - Grays
  '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#1f2937', '#000000',
  // Row 2 - Primary colors
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  // Row 3 - Light variants
  '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#bfdbfe', '#ddd6fe', '#fbcfe8',
  // Row 4 - HA theme colors
  'var(--primary-color)', 'var(--accent-color)', 'var(--primary-text-color)',
  'var(--secondary-text-color)', 'var(--card-background-color)', 'var(--divider-color)',
  'var(--success-color)', 'var(--error-color)',
];

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

@customElement('mc-color-picker')
export class ColorPicker extends LitElement {
  static styles = [
    editorSystem,
    pickerStyles,
    colorPickerStyles,
    css`
      mc-gradient-editor + .help,
      .help + .help {
        margin-top: 6px;
      }
      .mc-color-tools {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mc-color-tools .seg {
        flex: 1;
      }
      .help:empty {
        display: none;
      }
      /* an empty field that takes this colour from the design below: dimmed, hatched */
      .swatch-fill[data-hint] > span {
        opacity: 0.5;
      }
      .swatch-fill[data-hint] {
        background-image: repeating-linear-gradient(135deg, transparent 0 3px, color-mix(in srgb, var(--mc-text) 35%, transparent) 3px 4px);
      }
    `,
  ];

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  /** What an empty field shows: the colour it takes from the design below (a dimmed swatch and the text). */
  @property({ type: String }) placeholder = '';
  /** Offer the "Entity color" toggle (a module design with an entity): the value becomes `entity` / `entity N%`. */
  @property({ type: Boolean }) allowEntity = false;
  /** The entity's live state colour (CSS), shown in the swatch while the entity colour is used. */
  @property({ type: String }) entityColor = '';
  /** With allowEntity: also offer a colour read from an attribute of the entity (`entity.<attr>`, contract entity-colour 1.0.0). */
  @property({ type: Boolean }) allowAttribute = false;
  /** The entity's attributes, for the "Colour from" list (only the ones that hold a colour are offered). */
  @property({ attribute: false }) entityAttributes?: Record<string, unknown>;

  /** Offer a Solid | Gradient switch: 'linear' (angle only, ring and icon) or 'css' (linear and radial). */
  @property({ type: String }) gradient: '' | 'linear' | 'css' = '';
  /** A hint under the gradient editor (for example how text and icons use it). */
  @property({ type: String }) gradientNote = '';

  @state() private _status = '';
  @state() private _isOpen = false;
  @state() private _hsva: HSVA = { h: 0, s: 100, v: 100, a: 1 };
  @state() private _savedColors: string[] = [];
  @state() private _hexInput = '';
  @state() private _format: ColourFormat = 'HEXA';
  /** An OKLCH colour outside sRGB, as written: kept until the popup edits the colour. */
  private _asWritten = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());
  private _dragging: 'area' | 'hue' | 'opacity' | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._loadSavedColors();
    this._parseValue(this.value);
  }

  /** The entity toggle swaps its button when the mode changes; focus goes back to the new one (keyboard users stay in place). */
  private _refocusToggle = false;

  updated(changedProps: Map<string, unknown>): void {
    if (this._refocusToggle) {
      this._refocusToggle = false;
      this.renderRoot.querySelector<HTMLElement>('.entity-toggle')?.focus();
    }
    if (changedProps.has('value') && !this._isOpen) {
      this._parseValue(this.value);
    }
  }

  private _loadSavedColors(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      this._savedColors = saved ? JSON.parse(saved) : [];
    } catch {
      this._savedColors = [];
    }
  }

  private _saveSavedColors(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._savedColors));
    } catch {
      // Ignore storage errors
    }
  }

  private _parseValue(value: string): void {
    this._asWritten = '';
    if (!value) {
      this._hsva = { h: 0, s: 0, v: 100, a: 1 };
      this._hexInput = '';
      this._format = 'HEXA';
      return;
    }

    this._format = formatOf(value);
    // If it's a CSS variable, keep as-is
    if (value.startsWith('var(')) {
      this._hexInput = value;
      return;
    }

    const hsva = this._colorToHsva(value);
    if (hsva) {
      this._hsva = hsva;
      this._hexInput = this._text(hsva);
      if (parseColour(value)?.wide) this._asWritten = this._hexInput = value.trim();
    } else {
      this._hexInput = value;
    }
  }

  /** The colour in the chosen format. */
  private _text(hsva: HSVA): string {
    return writeColour(this._hsvaToRgb(hsva), this._format);
  }

  /** A change made in the popup: the colour, and its text in the chosen format. */
  private _setHsva(hsva: HSVA): void {
    this._hsva = hsva;
    this._asWritten = '';
    this._hexInput = this._text(hsva);
  }

  private _setFormat(format: ColourFormat): void {
    this._format = format;
    if (this._hexInput.startsWith('var(') || !this._colorToHsva(this._hexInput)) return;
    this._asWritten = '';
    this._hexInput = this._text(this._hsva);
  }

  /** Takes the colour from the screen, like choosing a swatch. A cancel changes nothing. */
  private async _pipette(): Promise<void> {
    const Dropper = (window as unknown as { EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> } }).EyeDropper;
    if (!Dropper) return;
    try {
      this._selectPreset((await new Dropper().open()).sRGBHex);
    } catch {
      // closed without a pick
    }
  }

  private _colorToHsva(color: string): HSVA | null {
    const c = parseColour(color);
    return c ? this._rgbToHsva(c.r / 255, c.g / 255, c.b / 255, c.a) : null;
  }

  private _rgbToHsva(r: number, g: number, b: number, a: number): HSVA {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const v = max * 100;
    const s = max === 0 ? 0 : (d / max) * 100;
    let h = 0;

    if (d !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          h = ((b - r) / d + 2) * 60;
          break;
        case b:
          h = ((r - g) / d + 4) * 60;
          break;
      }
    }

    return { h, s, v, a };
  }

  private _hsvaToRgb(hsva: HSVA): { r: number; g: number; b: number; a: number } {
    const h = hsva.h / 60;
    const s = hsva.s / 100;
    const v = hsva.v / 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;
    if (h < 1) { r = c; g = x; }
    else if (h < 2) { r = x; g = c; }
    else if (h < 3) { g = c; b = x; }
    else if (h < 4) { g = x; b = c; }
    else if (h < 5) { r = x; b = c; }
    else { r = c; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a: hsva.a,
    };
  }

  private _hsvaToHex(hsva: HSVA): string {
    const rgb = this._hsvaToRgb(hsva);
    const hex = '#' +
      rgb.r.toString(16).padStart(2, '0') +
      rgb.g.toString(16).padStart(2, '0') +
      rgb.b.toString(16).padStart(2, '0');
    if (hsva.a < 1) {
      return hex + Math.round(hsva.a * 255).toString(16).padStart(2, '0');
    }
    return hex;
  }

  private _hsvaToRgbaString(hsva: HSVA): string {
    const rgb = this._hsvaToRgb(hsva);
    if (hsva.a < 1) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hsva.a.toFixed(2)})`;
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  private _getCurrentColor(): string {
    if (this._hexInput.startsWith('var(')) {
      return this._hexInput;
    }
    return this._asWritten || this._text(this._hsva);
  }

  private _emitChange(): void {
    const color = this._getCurrentColor();
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: color },
      }),
    );
  }

  private _openModal(): void {
    this._parseValue(this.value);
    this._isOpen = true;
  }

  private _closeModal(): void {
    this._isOpen = false;
  }

  private _handleSave(): void {
    this._emitChange();
    this._closeModal();
  }

  private _handleAreaPointerDown = (e: PointerEvent): void => {
    this._dragging = 'area';
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._updateArea(e);
  };

  private _handleHuePointerDown = (e: PointerEvent): void => {
    this._dragging = 'hue';
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._updateHue(e);
  };

  private _handleOpacityPointerDown = (e: PointerEvent): void => {
    this._dragging = 'opacity';
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._updateOpacity(e);
  };

  private _handlePointerMove = (e: PointerEvent): void => {
    if (!this._dragging) return;
    if (this._dragging === 'area') this._updateArea(e);
    else if (this._dragging === 'hue') this._updateHue(e);
    else if (this._dragging === 'opacity') this._updateOpacity(e);
  };

  private _handlePointerUp = (): void => {
    this._dragging = null;
  };

  private _updateArea(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    this._setHsva({ ...this._hsva, s: x * 100, v: (1 - y) * 100 });
  }

  private _updateHue(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._setHsva({ ...this._hsva, h: x * 360 });
  }

  private _updateOpacity(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._setHsva({ ...this._hsva, a: x });
  }

  private _handleHexInput(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this._hexInput = value;
    const hsva = this._colorToHsva(value);
    if (hsva) {
      this._hsva = hsva;
      this._asWritten = '';
    }
  }

  private _selectPreset(color: string): void {
    if (color.startsWith('var(')) {
      this._hexInput = color;
    } else {
      const hsva = this._colorToHsva(color);
      if (hsva) this._setHsva(hsva);
    }
  }

  private _addSavedColor(): void {
    const color = this._getCurrentColor();
    if (!this._savedColors.includes(color)) {
      this._savedColors = [color, ...this._savedColors].slice(0, MAX_SAVED_COLORS);
      this._saveSavedColors();
    }
  }

  private _removeSavedColor(color: string, e: Event): void {
    e.stopPropagation();
    this._savedColors = this._savedColors.filter((c) => c !== color);
    this._saveSavedColors();
  }

  private _handleTextInput(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  }

  private _emitValue(value: string): void {
    this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value } }));
  }

  private _renderEntityToggle(on: boolean): TemplateResult | typeof nothing {
    if (!this.allowEntity) return nothing;
    return html`<button
      type="button"
      class="icon-btn entity-toggle"
      aria-pressed=${on ? 'true' : 'false'}
      aria-label=${t('Entity colour for {name}', { name: (this.label || t('colour')).toLowerCase() })}
      title=${t("Use the entity's state colour")}
      @click=${() => {
        this._refocusToggle = true;
        this._emitValue(on ? '' : 'entity');
      }}
    >
      <ha-icon icon="mdi:palette-swatch-variant"></ha-icon>
    </button>`;
  }

  /** The field while it uses the entity colour: live swatch, read-only name, source, opacity. */
  private _renderEntity(opacity: number, attr?: string): TemplateResult {
    let base = this.entityColor || 'currentColor';
    const rgb = attr ? attrRgb(this.entityAttributes, attr) : undefined;
    if (attr) base = rgb ? `rgb(${rgb.join(', ')})` : 'transparent';
    const preview = opacity >= 100 ? base : `color-mix(in srgb, ${base} ${opacity}%, transparent)`;
    const name = this.label || t('colour');
    const emit = (a: string | undefined, o: number) => this._emitValue(`entity${a ? `.${a}` : ''}${o < 100 ? ` ${+o.toFixed(2)}%` : ''}`);
    return html`
      <div class="color">
        <button type="button" class="swatch" disabled aria-hidden="true" tabindex="-1" title=${t("The entity's state colour")}>
          <span class="swatch-fill"><span style="background: ${preview}"></span></span>
        </button>
        <input class="input" type="text" readonly .value=${t('Entity colour')} aria-label=${name} />
        ${this._renderEntityToggle(true)}
      </div>
      ${this.allowAttribute ? this._renderSource(attr, (a) => emit(a, opacity)) : nothing}
      <div class="field entity-opacity">
        <div class="field-head"><span class="lbl">${t('Opacity')}</span></div>
        <mc-unit-field
          .value=${opacity >= 100 ? '' : `${opacity}%`}
          .label=${t('{name} opacity', { name })}
          .units=${['%']}
          placeholder="100"
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            const n = parseFloat(String(e.detail.value));
            emit(attr, Number.isFinite(n) && n >= 0 && n < 100 ? n : 100);
          }}
        ></mc-unit-field>
      </div>
    `;
  }

  /** "Colour from": the state colour, or an attribute of the entity that holds a colour (or the one already chosen). */
  private _renderSource(attr: string | undefined, pick: (attr: string | undefined) => void): TemplateResult {
    const attrs = this.entityAttributes;
    const names = attrs ? Object.keys(attrs).filter((k) => /^[a-z0-9_]{1,64}$/.test(k) && attrRgb(attrs, k)).sort() : [];
    if (attr && !names.includes(attr)) names.push(attr);
    const id = 'src';
    return html`
      <div class="field">
        <label class="lbl" for=${id}>${t('Colour from')}</label>
        <select class="input" id=${id} aria-label=${t('{name}: colour from', { name: this.label || t('colour') })} @change=${(e: Event) => pick((e.target as HTMLSelectElement).value || undefined)}>
          <option value="" ?selected=${!attr}>${t('State colour')}</option>
          ${names.map((n) => html`<option value=${n} ?selected=${n === attr}>${n}</option>`)}
        </select>
      </div>
    `;
  }

  private _toSolid(g: GradientModel): void {
    this._status = t('Switched to Solid. Undo brings the gradient back.');
    this._emitValue(g.stops[0]);
  }

  private _toGradient(): void {
    const old = parseGradient(this.value);
    const cur = safeColor(this.value);
    const first = cur && !parseEntityColor(cur) ? cur : 'var(--primary-color)';
    const second = first === 'var(--accent-color)' ? '#ffffff' : 'var(--accent-color)';
    const g: GradientModel = old
      ? { radial: old.radial && this.gradient === 'css', angle: old.angle, stops: old.stops.slice(0, MAX_STOPS) }
      : { radial: false, angle: 135, stops: [first, second] };
    this._status = old ? t('Gradient replaced with the editor version.') : t('Gradient created from your colour.');
    this._emitValue(gradientToString(g));
  }

  private _renderMode(g: GradientModel | undefined): TemplateResult {
    const name = this.label || t('colour');
    return html`${renderSeg(
      t('{name} mode', { name }),
      g ? 'gradient' : 'solid',
      [
        { value: 'solid', label: t('Solid') },
        { value: 'gradient', label: t('Gradient') },
      ],
      (v) => {
        if (v === 'solid' && g) this._toSolid(g);
        else if (v === 'gradient' && !g) this._toGradient();
      },
    )}`;
  }

  /** The value as an entity colour: `entity` / `entity N%`, plus `entity.<attr>` where allowAttribute. */
  private _entityValue(): { opacity: number; attr?: string } | undefined {
    const m = this.value.trim().match(ENTITY_PAINT_RE);
    return m && (this.allowAttribute || !m[1]) ? { attr: m[1], opacity: Math.min(100, Number(m[2] ?? 100)) } : undefined;
  }

  protected render(): TemplateResult {
    const entity = this.allowEntity ? this._entityValue() : undefined;
    const g = this.gradient ? editableGradient(this.value, this.gradient === 'css') : undefined;
    const custom = !!this.gradient && !g && /gradient\(/i.test(this.value);
    const body = entity ? this._renderEntity(entity.opacity, entity.attr) : g ? this._renderGradient(g) : this._renderSolid();
    return html`
      ${this.gradient ? this._renderMode(g) : nothing}
      ${body}
      ${custom ? html`<div class="help">${t("This is custom gradient CSS. Choose Gradient to replace it with the editor's version.")}</div>` : nothing}
      ${g && this.gradientNote ? html`<div class="help">${this.gradientNote}</div>` : nothing}
      ${this.gradient ? html`<div class="help" role="status" aria-live="polite">${this._status}</div>` : nothing}
    `;
  }

  private _renderGradient(g: GradientModel): TemplateResult {
    return html`<mc-gradient-editor
      .model=${g}
      .label=${this.label || t('colour')}
      .allowRadial=${this.gradient === 'css'}
      @value-changed=${() => (this._status = '')}
    ></mc-gradient-editor>`;
  }

  private _renderSolid(): TemplateResult {
    const hinted = !this.value && !!this.placeholder;
    const displayColor = this.value || this.placeholder || 'transparent';
    const name = this.label || t('colour');

    return html`
      <div class="color">
        <button
          type="button"
          class="swatch"
          aria-label=${t('Pick {name}', { name: name.toLowerCase() })}
          title=${t('Open colour picker')}
          @click=${this._openModal}
        >
          <span class="swatch-fill" data-hint=${hinted ? '' : nothing}><span style="background: ${displayColor}"></span></span>
        </button>
        <input
          class="input mono"
          type="text"
          spellcheck="false"
          .value=${this.value || ''}
          placeholder=${this.placeholder || '#rrggbb or var(--name)'}
          aria-label=${name}
          @input=${this._handleTextInput}
        />
        ${this._renderEntityToggle(false)}
      </div>
      ${this._isOpen ? this._renderModal() : nothing}
    `;
  }

  private _renderModal(): TemplateResult {
    const rgb = this._hsvaToRgb(this._hsva);
    const hueColor = `hsl(${this._hsva.h}, 100%, 50%)`;
    const currentColor = this._hexInput.startsWith('var(')
      ? this._hexInput
      : this._hsvaToRgbaString(this._hsva);

    return html`
      ${renderPickerWindow(t('Colour picker'), () => this._closeModal(), 's', html`

          <div class="mc-color-body">
            <div
              class="mc-color-area"
              style="background: ${hueColor}"
              @pointerdown=${this._handleAreaPointerDown}
              @pointermove=${this._handlePointerMove}
              @pointerup=${this._handlePointerUp}
            >
              <div class="mc-color-area-gradient"></div>
              <div
                class="mc-color-area-pointer"
                style="left: ${this._hsva.s}%; top: ${100 - this._hsva.v}%; background: ${currentColor}"
              ></div>
            </div>

            <div class="mc-slider-row">
              <span class="mc-slider-label">H</span>
              <div
                class="mc-slider-track mc-hue-track"
                @pointerdown=${this._handleHuePointerDown}
                @pointermove=${this._handlePointerMove}
                @pointerup=${this._handlePointerUp}
              >
                <div
                  class="mc-slider-thumb"
                  style="left: ${(this._hsva.h / 360) * 100}%; background: ${hueColor}"
                ></div>
              </div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                aria-label=${t('Hue')}
                .value=${Math.round(this._hsva.h).toString()}
                @input=${(e: InputEvent) => {
                  const v = parseInt((e.target as HTMLInputElement).value) || 0;
                  this._setHsva({ ...this._hsva, h: Math.max(0, Math.min(360, v)) });
                }}
              />
            </div>

            <div class="mc-slider-row">
              <span class="mc-slider-label">A</span>
              <div
                class="mc-slider-track mc-opacity-track"
                @pointerdown=${this._handleOpacityPointerDown}
                @pointermove=${this._handlePointerMove}
                @pointerup=${this._handlePointerUp}
              >
                <div
                  class="mc-opacity-gradient"
                  style="background: linear-gradient(to right, transparent, ${this._hsvaToHex({ ...this._hsva, a: 1 })})"
                ></div>
                <div
                  class="mc-slider-thumb"
                  style="left: ${this._hsva.a * 100}%"
                ></div>
              </div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                aria-label=${t('Opacity percent')}
                .value=${Math.round(this._hsva.a * 100).toString()}
                @input=${(e: InputEvent) => {
                  const v = parseInt((e.target as HTMLInputElement).value) || 0;
                  this._setHsva({ ...this._hsva, a: Math.max(0, Math.min(100, v)) / 100 });
                }}
              />
            </div>

            <div class="mc-color-tools">
              ${renderSeg(
                t('Colour format'),
                this._format,
                COLOUR_FORMATS.map((f) => ({ value: f, label: f })),
                (v) => this._setFormat(v as ColourFormat),
              )}
              ${'EyeDropper' in window
                ? html`<button
                    type="button"
                    class="icon-btn"
                    title=${t('Pick a colour from the screen')}
                    aria-label=${t('Pick a colour from the screen')}
                    @click=${() => void this._pipette()}
                  >
                    <ha-icon icon="mdi:eyedropper"></ha-icon>
                  </button>`
                : nothing}
            </div>

            <div class="mc-input-row">
              <label class="field">
                <span class="lbl">${this._format}</span>
                <input class="input" type="text" spellcheck="false" .value=${this._hexInput} @input=${this._handleHexInput} />
              </label>
              <label class="field">
                <span class="lbl">R</span>
                <input class="input" type="text" .value=${rgb.r.toString()} readonly />
              </label>
              <label class="field">
                <span class="lbl">G</span>
                <input class="input" type="text" .value=${rgb.g.toString()} readonly />
              </label>
              <label class="field">
                <span class="lbl">B</span>
                <input class="input" type="text" .value=${rgb.b.toString()} readonly />
              </label>
            </div>

            <div class="mc-color-section">
              <span class="mc-color-section-header">${t('Presets')}</span>
              <div class="mc-color-grid">
                ${PRESET_COLORS.map((color) => html`
                  <button
                    type="button"
                    class="mc-color-swatch ${color.startsWith('var(') ? 'var-color' : ''}"
                    style="background: ${color}"
                    title=${color}
                    aria-label=${color}
                    @click=${() => this._selectPreset(color)}
                  >${color.startsWith('var(') ? html`<span class="var-tag">${CSS_VAR}</span>` : ''}</button>
                `)}
              </div>
            </div>

            <div class="mc-color-section">
              <span class="mc-color-section-header">${t('Saved colours')}</span>
              <div class="mc-saved-colors">
                ${this._savedColors.map((color) => html`
                  <div class="mc-saved-swatch" style="background: ${color}">
                    <button
                      type="button"
                      class="mc-saved-pick"
                      title=${color}
                      aria-label=${t('Use {value}', { value: color })}
                      @click=${() => this._selectPreset(color)}
                    ></button>
                    <button
                      type="button"
                      class="mc-remove-btn"
                      aria-label=${t('Remove {value}', { value: color })}
                      @click=${(e: Event) => this._removeSavedColor(color, e)}
                    >
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </div>
                `)}
                <button
                  type="button"
                  class="icon-btn sm"
                  title=${t('Save current colour')}
                  aria-label=${t('Save current colour')}
                  @click=${this._addSavedColor}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${t('Save')}</button>
          </div>
      `)}
    `;
  }
}
