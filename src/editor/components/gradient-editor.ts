import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import { parseGradient } from '../../utils/gradient';
import { safeColor } from '../../utils/animation';
// the stops use <mc-color-picker> by tag: color-picker.ts imports this file and defines it

/** What the editor can write: a linear (`<n>deg`) or radial (`circle`) gradient of 2 to 5 stops, no positions. */
export interface GradientModel {
  radial: boolean;
  angle: number;
  stops: string[];
}

export const MAX_STOPS = 5;
const MIN_STOPS = 2;

export function gradientToString(g: GradientModel): string {
  return `${g.radial ? 'radial' : 'linear'}-gradient(${g.radial ? 'circle' : `${g.angle}deg`}, ${g.stops.join(', ')})`;
}

const squash = (s: string) => s.replace(/\s+/g, '');

/**
 * The model for a value the editor can represent exactly, else undefined (a solid colour, an
 * unparseable string, or custom CSS such as `to right`, stop positions, more than 5 stops).
 */
export function editableGradient(value: unknown, allowRadial: boolean): GradientModel | undefined {
  const p = parseGradient(value);
  if (!p || p.stops.length > MAX_STOPS || (p.radial && !allowRadial)) return undefined;
  const g: GradientModel = { radial: p.radial, angle: p.angle, stops: p.stops };
  return squash(gradientToString(g)) === squash(String(value)) ? g : undefined;
}

export interface SegOption {
  value: string;
  label: string;
}

/** A segmented radiogroup with roving tabindex and arrow keys, the same markup the other editors use. */
export function renderSeg(label: string, value: string, options: SegOption[], onPick: (v: string) => void, disabled = false): TemplateResult {
  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in step)) return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + step[e.key] + options.length) % options.length].value;
    const group = e.currentTarget as HTMLElement;
    onPick(next);
    requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
  };
  return html`<div class="seg full" role="radiogroup" aria-label=${label} @keydown=${onKey}>
    ${options.map((o) => {
      const on = o.value === value;
      return html`<button
        type="button"
        role="radio"
        data-val=${o.value}
        aria-checked=${on ? 'true' : 'false'}
        tabindex=${on ? '0' : '-1'}
        ?disabled=${disabled}
        @click=${() => onPick(o.value)}
      >${o.label}</button>`;
    })}
  </div>`;
}

/** The Gradient body of the colour picker: preview, type, angle, 2 to 5 stops. Writes the C1 string. */
@customElement('mc-gradient-editor')
export class GradientEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .grad {
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px;
        min-width: 0;
        border: 1px solid var(--mc-divider, var(--divider-color));
        border-radius: var(--mc-radius-lg, 12px);
      }
      .preview {
        display: block;
        min-height: 32px;
        border: 1px solid var(--mc-divider, var(--divider-color));
        border-radius: var(--mc-radius-md, 8px);
        overflow: hidden;
        background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
        background-size: 8px 8px;
        background-position: 0 0, 0 4px, 4px -4px, -4px 0;
      }
      .preview > span {
        display: block;
        min-height: 32px;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }
      .row > label,
      .row > .lbl {
        flex: 0 0 auto;
        min-width: 48px;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .row > .seg,
      .row > input[type='range'] {
        flex: 1 1 120px;
        min-width: 0;
      }
      .angle-num {
        flex: 0 0 64px;
        width: 64px;
        min-width: 0;
      }
      .stops {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
      }
      .stop {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .stop mc-color-picker {
        flex: 1 1 0;
        min-width: 0;
      }
      .stop .icon-btn {
        flex: 0 0 auto;
        min-width: 36px;
        min-height: 36px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      @container (max-width: 239px) {
        .row {
          flex-direction: column;
          align-items: stretch;
        }
        .angle-num {
          flex-basis: auto;
          width: 100%;
        }
        .actions {
          flex-direction: column;
        }
        .actions > button {
          width: 100%;
        }
      }
    `,
  ];

  @property({ type: Object }) model: GradientModel = { radial: false, angle: 135, stops: ['#ffffff', '#000000'] };
  @property({ type: String }) label = 'color';
  /** Offer the Type control (CSS targets). Ring and icon gradients are linear only. */
  @property({ type: Boolean }) allowRadial = false;
  @property({ type: Boolean }) disabled = false;

  /** While the angle slider moves, the preview follows before the value is written on release. */
  @state() private _draft?: number;
  @state() private _badStop = -1;
  private _focusStop = -1;

  protected updated(): void {
    if (this._focusStop < 0) return;
    const i = this._focusStop;
    this._focusStop = -1;
    const picker = this.renderRoot.querySelectorAll('mc-color-picker')[i] as (HTMLElement & { updateComplete?: Promise<unknown> }) | undefined;
    void picker?.updateComplete?.then(() => picker.shadowRoot?.querySelector<HTMLInputElement>('input.input')?.focus());
  }

  private _emit(g: GradientModel): void {
    this._draft = undefined;
    this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: gradientToString(g) } }));
  }

  private _angle(raw: string): number {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(360, n))) : this.model.angle;
  }

  private _setStop(i: number, value: string, e: Event): void {
    e.stopPropagation();
    const color = safeColor(value);
    this._badStop = color ? -1 : i;
    if (!color || color === this.model.stops[i]) return;
    this._emit({ ...this.model, stops: this.model.stops.map((s, j) => (j === i ? color : s)) });
  }

  private _add(): void {
    const { stops } = this.model;
    if (stops.length >= MAX_STOPS) return;
    // evenly spaced stops: the new one goes before the last, with the colour of the one before it
    const at = stops.length - 1;
    this._focusStop = at;
    this._emit({ ...this.model, stops: [...stops.slice(0, at), stops[at - 1], ...stops.slice(at)] });
  }

  private _remove(i: number): void {
    const { stops } = this.model;
    if (stops.length <= MIN_STOPS) return;
    this._badStop = -1;
    this._emit({ ...this.model, stops: stops.filter((_, j) => j !== i) });
  }

  private _renderStop(s: string, i: number, n: number): TemplateResult {
    const num = i + 1;
    const atMin = n <= MIN_STOPS;
    return html`<div class="stop" role="group" aria-label=${`Stop ${num} of ${n}`}>
      <mc-color-picker
        .value=${s}
        .label=${`Stop ${num} color`}
        ?aria-invalid=${this._badStop === i}
        @value-changed=${(e: CustomEvent) => this._setStop(i, String(e.detail.value), e)}
      ></mc-color-picker>
      <button
        type="button"
        class="icon-btn"
        aria-label=${`Remove stop ${num}`}
        title=${atMin ? 'A gradient needs at least 2 stops' : `Remove stop ${num}`}
        ?disabled=${atMin || this.disabled}
        @click=${() => this._remove(i)}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>`;
  }

  protected render(): TemplateResult {
    const g = this.model;
    const angle = this._draft ?? g.angle;
    const paint = gradientToString({ ...g, angle });
    const n = g.stops.length;
    const name = this.label;
    return html`
      <div class="grad">
        <div class="preview" role="img" aria-label="Gradient preview"><span style=${`background: ${paint}`}></span></div>
        ${this.allowRadial
          ? html`<div class="row">
              <span class="lbl">Type</span>
              ${renderSeg(
                `${name} gradient type`,
                g.radial ? 'radial' : 'linear',
                [
                  { value: 'linear', label: 'Linear' },
                  { value: 'radial', label: 'Radial' },
                ],
                (v) => v !== (g.radial ? 'radial' : 'linear') && this._emit({ ...g, radial: v === 'radial' }),
                this.disabled,
              )}
            </div>`
          : nothing}
        ${g.radial
          ? nothing
          : html`<div class="row">
              <label for="angle">Angle</label>
              <input
                id="angle"
                type="range"
                min="0"
                max="360"
                step="1"
                .value=${String(angle)}
                aria-valuetext=${`${angle} degrees`}
                ?disabled=${this.disabled}
                @input=${(e: Event) => (this._draft = this._angle((e.target as HTMLInputElement).value))}
                @change=${(e: Event) => this._emit({ ...g, angle: this._angle((e.target as HTMLInputElement).value) })}
              />
              <input
                class="input angle-num"
                type="number"
                min="0"
                max="360"
                step="1"
                aria-label="Angle in degrees"
                .value=${String(angle)}
                ?disabled=${this.disabled}
                @change=${(e: Event) => this._emit({ ...g, angle: this._angle((e.target as HTMLInputElement).value) })}
              />
              <span aria-hidden="true">deg</span>
            </div>`}
        <div class="stops">${g.stops.map((s, i) => this._renderStop(s, i, n))}</div>
        ${this._badStop >= 0 ? html`<div class="help error" role="alert">Use a hex color, rgb(a) or var(--name).</div>` : nothing}
        <div class="actions">
          <button
            type="button"
            class="btn btn-text btn-sm"
            title=${n >= MAX_STOPS ? `Up to ${MAX_STOPS} stops` : 'Add stop'}
            ?disabled=${n >= MAX_STOPS || this.disabled}
            @click=${this._add}
          >
            <ha-icon icon="mdi:plus"></ha-icon> Add stop
          </button>
          <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => this._emit({ ...g, stops: [...g.stops].reverse() })}>
            <ha-icon icon="mdi:swap-horizontal"></ha-icon> Reverse
          </button>
        </div>
      </div>
    `;
  }
}
