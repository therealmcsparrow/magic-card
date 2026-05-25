import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { modalStyles, colorPickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

const STORAGE_KEY = 'magic-card-saved-colors';
const MAX_SAVED_COLORS = 12;

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
  static styles = [modalStyles, colorPickerStyles];

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

  @state() private _isOpen = false;
  @state() private _hsva: HSVA = { h: 0, s: 100, v: 100, a: 1 };
  @state() private _savedColors: string[] = [];
  @state() private _hexInput = '';

  private _modalCtrl = new ModalDragResizeController(this);
  private _dragging: 'area' | 'hue' | 'opacity' | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._loadSavedColors();
    this._parseValue(this.value);
  }

  updated(changedProps: Map<string, unknown>): void {
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
    if (!value) {
      this._hsva = { h: 0, s: 0, v: 100, a: 1 };
      this._hexInput = '';
      return;
    }

    // If it's a CSS variable, keep as-is
    if (value.startsWith('var(')) {
      this._hexInput = value;
      return;
    }

    const hsva = this._colorToHsva(value);
    if (hsva) {
      this._hsva = hsva;
      this._hexInput = this._hsvaToHex(hsva);
    } else {
      this._hexInput = value;
    }
  }

  private _colorToHsva(color: string): HSVA | null {
    // Handle hex
    const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length === 4) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return this._rgbToHsva(r, g, b, a);
    }

    // Handle rgba
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]) / 255;
      const g = parseInt(rgbaMatch[2]) / 255;
      const b = parseInt(rgbaMatch[3]) / 255;
      const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
      return this._rgbToHsva(r, g, b, a);
    }

    return null;
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
    return this._hsvaToHex(this._hsva);
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
    this._modalCtrl.reset();
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
    this._hsva = { ...this._hsva, s: x * 100, v: (1 - y) * 100 };
    this._hexInput = this._hsvaToHex(this._hsva);
  }

  private _updateHue(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._hsva = { ...this._hsva, h: x * 360 };
    this._hexInput = this._hsvaToHex(this._hsva);
  }

  private _updateOpacity(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._hsva = { ...this._hsva, a: x };
    this._hexInput = this._hsvaToHex(this._hsva);
  }

  private _handleHexInput(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this._hexInput = value;
    const hsva = this._colorToHsva(value);
    if (hsva) {
      this._hsva = hsva;
    }
  }

  private _selectPreset(color: string): void {
    if (color.startsWith('var(')) {
      this._hexInput = color;
    } else {
      const hsva = this._colorToHsva(color);
      if (hsva) {
        this._hsva = hsva;
        this._hexInput = this._hsvaToHex(hsva);
      }
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

  protected render(): TemplateResult {
    const displayColor = this.value || 'transparent';

    return html`
      <div class="mc-color-field">
        <div
          class="mc-color-preview"
          @click=${this._openModal}
          title="Click to open color picker"
        >
          <div class="mc-color-preview-inner" style="background: ${displayColor}"></div>
        </div>
        <input
          class="mc-color-text"
          type="text"
          .value=${this.value || ''}
          placeholder=${this.label || 'Color value'}
          @input=${this._handleTextInput}
        />
        <button class="mc-color-btn" @click=${this._openModal} title="Open color picker">
          <ha-icon icon="mdi:palette" style="--mdc-icon-size: 18px"></ha-icon>
        </button>
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
      <div class="mc-modal-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-modal-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <span class="mc-modal-title">Color Picker</span>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>

          <div class="mc-modal-body">
            <!-- Color Area -->
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

            <!-- Hue Slider -->
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
                class="mc-slider-value"
                type="text"
                .value=${Math.round(this._hsva.h).toString()}
                @input=${(e: InputEvent) => {
                  const v = parseInt((e.target as HTMLInputElement).value) || 0;
                  this._hsva = { ...this._hsva, h: Math.max(0, Math.min(360, v)) };
                  this._hexInput = this._hsvaToHex(this._hsva);
                }}
              />
            </div>

            <!-- Opacity Slider -->
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
                class="mc-slider-value"
                type="text"
                .value=${Math.round(this._hsva.a * 100).toString()}
                @input=${(e: InputEvent) => {
                  const v = parseInt((e.target as HTMLInputElement).value) || 0;
                  this._hsva = { ...this._hsva, a: Math.max(0, Math.min(100, v)) / 100 };
                  this._hexInput = this._hsvaToHex(this._hsva);
                }}
              />
            </div>

            <!-- Input Row -->
            <div class="mc-input-row">
              <div class="mc-input-group" style="flex: 2">
                <span class="mc-input-label">Hex</span>
                <input
                  class="mc-input-field"
                  type="text"
                  .value=${this._hexInput}
                  @input=${this._handleHexInput}
                />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">R</span>
                <input class="mc-input-field" type="text" .value=${rgb.r.toString()} readonly />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">G</span>
                <input class="mc-input-field" type="text" .value=${rgb.g.toString()} readonly />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">B</span>
                <input class="mc-input-field" type="text" .value=${rgb.b.toString()} readonly />
              </div>
            </div>

            <!-- Presets -->
            <div class="mc-color-section">
              <span class="mc-color-section-header">Presets</span>
              <div class="mc-color-grid">
                ${PRESET_COLORS.map((color) => html`
                  <div
                    class="mc-color-swatch ${color.startsWith('var(') ? 'var-color' : ''}"
                    style="background: ${color}"
                    @click=${() => this._selectPreset(color)}
                    title=${color}
                  >${color.startsWith('var(') ? 'var' : ''}</div>
                `)}
              </div>
            </div>

            <!-- Saved Colors -->
            <div class="mc-color-section">
              <span class="mc-color-section-header">Saved Colors</span>
              <div class="mc-saved-colors">
                ${this._savedColors.map((color) => html`
                  <div
                    class="mc-saved-swatch"
                    style="background: ${color}"
                    @click=${() => this._selectPreset(color)}
                    title=${color}
                  >
                    <button class="mc-remove-btn" @click=${(e: Event) => this._removeSavedColor(color, e)}>&times;</button>
                  </div>
                `)}
                <button class="mc-add-saved-btn" @click=${this._addSavedColor} title="Save current color">+</button>
              </div>
            </div>
          </div>
          <div class="mc-modal-footer">
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
