import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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
  static styles = css`
    :host {
      display: block;
    }

    .mc-color-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-color-preview {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 2px solid var(--divider-color, #e5e7eb);
      cursor: pointer;
      flex-shrink: 0;
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      position: relative;
      overflow: hidden;
    }

    .mc-color-preview-inner {
      position: absolute;
      inset: 0;
    }

    .mc-color-text {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      min-width: 0;
    }

    .mc-color-text:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-color-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .mc-color-btn:hover {
      background: var(--divider-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
    }

    /* Modal Overlay */
    .mc-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }

    .mc-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 320px;
      max-width: 100%;
      max-height: 90vh;
      overflow: auto;
    }

    .mc-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
    }

    .mc-modal-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-modal-close:hover {
      background: var(--divider-color, #e5e7eb);
    }

    .mc-modal-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Color Area */
    .mc-color-area {
      position: relative;
      width: 100%;
      height: 180px;
      border-radius: 8px;
      cursor: crosshair;
      touch-action: none;
    }

    .mc-color-area-gradient {
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: linear-gradient(to right, #fff, transparent),
        linear-gradient(to top, #000, transparent);
    }

    .mc-color-area-pointer {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    /* Sliders */
    .mc-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mc-slider-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--secondary-text-color, #6b7280);
      width: 20px;
      flex-shrink: 0;
    }

    .mc-slider-track {
      flex: 1;
      height: 12px;
      border-radius: 6px;
      position: relative;
      cursor: pointer;
      touch-action: none;
    }

    .mc-hue-track {
      background: linear-gradient(
        to right,
        #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
      );
    }

    .mc-opacity-track {
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    }

    .mc-opacity-gradient {
      position: absolute;
      inset: 0;
      border-radius: 6px;
    }

    .mc-slider-thumb {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
      transform: translate(-50%, -50%);
      top: 50%;
      pointer-events: none;
    }

    .mc-slider-value {
      width: 48px;
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 4px;
      font-size: 0.75rem;
      text-align: center;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
    }

    /* Input Row */
    .mc-input-row {
      display: flex;
      gap: 8px;
    }

    .mc-input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mc-input-label {
      font-size: 0.625rem;
      font-weight: 500;
      color: var(--secondary-text-color, #6b7280);
      text-transform: uppercase;
    }

    .mc-input-field {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 4px;
      font-size: 0.75rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      width: 100%;
      box-sizing: border-box;
    }

    /* Color Sections */
    .mc-color-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mc-color-section-header {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-color-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
    }

    .mc-color-swatch {
      aspect-ratio: 1;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.15s;
      position: relative;
    }

    .mc-color-swatch:hover {
      transform: scale(1.1);
      z-index: 1;
    }

    .mc-color-swatch.selected {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-color-swatch.var-color {
      font-size: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }

    .mc-saved-colors {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .mc-saved-swatch {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      position: relative;
    }

    .mc-saved-swatch:hover {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-saved-swatch .mc-remove-btn {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--error-color, #ef4444);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 0.625rem;
      display: none;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .mc-saved-swatch:hover .mc-remove-btn {
      display: flex;
    }

    .mc-add-saved-btn {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 2px dashed var(--divider-color, #e5e7eb);
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .mc-add-saved-btn:hover {
      border-color: var(--primary-color, #6366f1);
      color: var(--primary-color, #6366f1);
    }

    /* Footer */
    .mc-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid var(--divider-color, #e5e7eb);
    }

    .mc-btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.15s;
    }

    .mc-btn-primary {
      background: var(--primary-color, #6366f1);
      color: white;
    }

    .mc-btn-primary:hover {
      filter: brightness(1.1);
    }

    .mc-btn-secondary {
      background: var(--divider-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-btn-secondary:hover {
      filter: brightness(0.95);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

  @state() private _isOpen = false;
  @state() private _hsva: HSVA = { h: 0, s: 100, v: 100, a: 1 };
  @state() private _savedColors: string[] = [];
  @state() private _hexInput = '';

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
    this._isOpen = false;
  }

  private _applyColor(): void {
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
      <div class="mc-modal-overlay" @click=${this._closeModal}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-modal-header">
            <span class="mc-modal-title">Color Picker</span>
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
            <button class="mc-btn mc-btn-secondary" @click=${this._closeModal}>Cancel</button>
            <button class="mc-btn mc-btn-primary" @click=${this._applyColor}>Apply</button>
          </div>
        </div>
      </div>
    `;
  }
}
