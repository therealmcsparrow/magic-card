import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import { t } from '../i18n';

const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh'] as const;
/** Value of the unit select's "Custom" option: the input takes any CSS value as text. */
export const CUSTOM_UNIT = 'custom';

/** CSS units a stored value may carry (one outside the field's list is offered next to it). */
const CSS_UNITS = new Set([
  'px', 'em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax', 'dvh', 'dvw', 'svh', 'svw', 'lvh', 'lvw', 'ch', 'ex', 'lh', 'rlh',
  'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax', 'cm', 'mm', 'q', 'in', 'pt', 'pc', 's', 'ms', 'deg', 'rad', 'grad', 'turn', 'fr',
]);
const NUM = '[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?';
/** A plain number (no unit). */
export const PLAIN_NUMBER_RE = new RegExp(`^${NUM}$`, 'i');
const VALUE_RE = new RegExp(`^(${NUM})\\s*([a-z]+|%)?$`, 'i');

export interface UnitValue {
  /** The number as shown in the number input ('' when empty or custom). */
  number: string;
  /** The value's own unit; undefined for a bare number or an empty / custom value. */
  unit?: string;
  /** Not a number with a CSS unit (auto, calc(…), var(…), …): edited as text. */
  custom: boolean;
}

/** `"12px"` → 12 + px, `0` / `"1.5"` → a bare number, `"auto"` / `"calc(…)"` → custom. */
export function parseUnitValue(value: unknown): UnitValue {
  if (typeof value === 'number') return Number.isFinite(value) ? { number: String(value), custom: false } : { number: '', custom: false };
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return { number: '', custom: false };
  const m = raw.match(VALUE_RE);
  if (!m) return { number: '', custom: true };
  const unit = m[2]?.toLowerCase();
  if (unit && !CSS_UNITS.has(unit)) return { number: '', custom: true };
  // as typed in YAML, normalised for the number input ("+5" → "5", ".5" → "0.5")
  return { number: String(Number(m[1])), unit, custom: false };
}

/**
 * A number input plus unit select; the unit joins the number on commit (change, blur, Enter), an empty number removes the value.
 * "Custom" (or a non-numeric stored value) switches to a text input. Emits `value-changed` with `detail.value`.
 */
@customElement('mc-unit-field')
export class UnitField extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      /* "Custom" needs a wider select than a unit */
      .unit > .select.is-custom {
        width: 92px;
      }
      .unit > .select.is-custom select {
        padding-right: 28px;
      }
      .unit > .select.is-custom > ha-icon {
        right: 6px;
      }
      /* compact (box field sides): a narrower unit select */
      :host([compact]) .unit > .input {
        min-width: 5ch;
        padding-left: 10px;
        padding-right: 6px;
      }
      :host([compact]) .unit > .select {
        width: 64px;
      }
      :host([compact]) .unit > .select.is-custom {
        width: 84px;
      }
      :host([compact]) .unit > .select select {
        padding-left: 8px;
        padding-right: 24px;
      }
      :host([compact]) .unit > .select > ha-icon {
        right: 4px;
      }
    `,
  ];

  @property({ attribute: false }) value: string | number | undefined = '';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) disabled = false;
  /** Narrow unit select (the sides of a box field). */
  @property({ type: Boolean, reflect: true }) compact = false;
  /** id of the input (a `<label for>` in the same shadow root can't reach it; for tests and focus). */
  @property({ type: String }) inputId = '';
  /** Units offered (default: px, em, rem, %, vw, vh); the first is used for a bare number. */
  @property({ attribute: false }) units?: string[];
  /** No "Custom" option (values the consumer only reads as a number with a unit, e.g. shape lengths). */
  @property({ type: Boolean }) noCustom = false;

  /** "Custom" picked here (the stored value may still be a number until the text is committed). */
  @state() private _custom = false;
  /** Unit picked while there is no number yet: used by the next committed number. */
  @state() private _unit?: string;
  /** The last value this field emitted: a different incoming value is an outside change (undo, YAML). */
  private _emitted?: string;

  private get _units(): readonly string[] {
    const list = this.units?.length ? this.units : UNITS;
    return list.filter((u) => u !== 'auto' && u !== CUSTOM_UNIT);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('value') && String(this.value ?? '') !== this._emitted) {
      this._custom = false;
      this._unit = undefined;
      this._emitted = undefined;
    }
  }

  /** Show the stored value again, dropping typed text the host rejected (not written). */
  revert(): void {
    this._custom = false;
    this._unit = undefined;
    this._emitted = undefined;
    this.requestUpdate();
    void this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector<HTMLInputElement>('input');
      const parsed = parseUnitValue(this.value);
      if (input) input.value = parsed.custom ? String(this.value ?? '') : parsed.number;
    });
  }

  /** Focus the input (a box field's side label). */
  focus(): void {
    this.renderRoot.querySelector<HTMLInputElement>('input')?.focus();
  }

  private _emit(value: string): void {
    this._emitted = value;
    this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value } }));
  }

  /** The unit the select shows: the value's own, else a pending choice, else the first unit. */
  private _shownUnit(parsed: UnitValue): string {
    return parsed.unit ?? this._unit ?? this._units[0] ?? 'px';
  }

  private _commitNumber(input: HTMLInputElement): void {
    const parsed = parseUnitValue(this.value);
    const s = input.value.trim();
    if (!s) {
      // half-typed ("-", "1e"): the number input reports it as bad and empty; keep the stored value
      if (input.validity?.badInput) {
        input.value = parsed.number;
        return;
      }
      if (String(this.value ?? '') !== '') this._emit('');
      return;
    }
    if (!PLAIN_NUMBER_RE.test(s)) return;
    if (s === parsed.number && (parsed.unit !== undefined || this._unit === undefined)) return;
    this._emit(`${s}${this._shownUnit(parsed)}`);
  }

  private _commitText(input: HTMLInputElement): void {
    const s = input.value.trim();
    if (s !== String(this.value ?? '').trim()) this._emit(s);
  }

  private _pickUnit(select: HTMLSelectElement): void {
    const unit = select.value;
    const parsed = parseUnitValue(this.value);
    const custom = this._custom || parsed.custom;
    if (unit === CUSTOM_UNIT) {
      if (custom) return;
      this._custom = true;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('input')?.focus());
      return;
    }
    this._unit = unit;
    if (custom) {
      // back to a unit: a number (as typed, with or without a unit) converts, anything else is cleared
      this._custom = false;
      const text = (this.renderRoot.querySelector<HTMLInputElement>('input')?.value ?? String(this.value ?? '')).trim();
      const p = parseUnitValue(text);
      if (!p.custom && p.number) this._emit(`${p.number}${unit}`);
      else if (String(this.value ?? '') !== '') this._emit('');
      return;
    }
    if (parsed.number && parsed.unit !== unit) this._emit(`${parsed.number}${unit}`);
  }

  protected render(): TemplateResult {
    const parsed = parseUnitValue(this.value);
    const custom = this._custom || parsed.custom;
    const unit = this._shownUnit(parsed);
    const units = this._units.includes(unit) ? this._units : [...this._units, unit];
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const input = e.target as HTMLInputElement;
      if (custom) this._commitText(input);
      else this._commitNumber(input);
    };
    return html`
      <div class="unit">
        ${custom
          ? html`<input
              class="input mono"
              id=${this.inputId || nothing}
              type="text"
              spellcheck="false"
              autocomplete="off"
              aria-label=${this.label || nothing}
              placeholder="auto, calc(100% - 8px)"
              .value=${String(this.value ?? '')}
              ?disabled=${this.disabled}
              @change=${(e: Event) => this._commitText(e.target as HTMLInputElement)}
              @keydown=${onKey}
            />`
          : html`<input
              class="input"
              id=${this.inputId || nothing}
              type="number"
              step="any"
              inputmode="decimal"
              aria-label=${this.label || nothing}
              placeholder=${this.placeholder || '0'}
              .value=${parsed.number}
              ?disabled=${this.disabled}
              @change=${(e: Event) => this._commitNumber(e.target as HTMLInputElement)}
              @keydown=${onKey}
            />`}
        <div class="select ${custom ? 'is-custom' : ''}">
          <select class="input" aria-label=${this.label ? t('card-editor.unit-field.label-unit', { label: this.label }) : t('card-editor.unit-field.unit')} ?disabled=${this.disabled} @change=${(e: Event) => this._pickUnit(e.target as HTMLSelectElement)}>
            ${units.map((u) => html`<option value=${u} ?selected=${!custom && unit === u}>${u}</option>`)}
            ${this.noCustom && !custom ? nothing : html`<option value=${CUSTOM_UNIT} ?selected=${custom}>${t('card-editor.unit-field.custom')}</option>`}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-unit-field': UnitField;
  }
}
