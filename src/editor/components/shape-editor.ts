import { LitElement, html, css, svg, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ShapeKind, ShapeOptions } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { SHAPE_DEFAULTS, shapePath } from '../../utils/shape-path';
import { fieldReset } from './field-reset';

import './unit-field';

/** What a shape edit writes: both keys (undefined = removed). */
export interface ShapePatch {
  shape: ShapeKind | undefined;
  shape_options: ShapeOptions | undefined;
}

type OptionKey = Exclude<keyof ShapeOptions, 'phase'>;

interface ShapeTile {
  kind: ShapeKind;
  label: string;
  /** The options this shape reads (others are dropped when switching to it). */
  options: OptionKey[];
}

export const SHAPE_TILES: ShapeTile[] = [
  { kind: 'none', label: 'None', options: [] },
  { kind: 'squircle', label: 'Squircle', options: ['corner', 'smoothing'] },
  { kind: 'pill', label: 'Pill', options: [] },
  { kind: 'circle', label: 'Circle', options: [] },
  { kind: 'hexagon', label: 'Hexagon', options: ['corner'] },
  { kind: 'octagon', label: 'Octagon', options: ['corner'] },
  { kind: 'notch', label: 'Notch', options: ['corner'] },
  { kind: 'ticket', label: 'Ticket', options: ['corner'] },
  { kind: 'wave', label: 'Wave', options: ['edge', 'amplitude', 'waves', 'animate'] },
  { kind: 'blob', label: 'Blob', options: ['seed', 'wobble', 'animate'] },
];

const EDGES: Array<{ value: NonNullable<ShapeOptions['edge']>; label: string }> = [
  { value: 'top', label: 'Top' },
  { value: 'right', label: 'Right' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'all', label: 'All' },
];

const LENGTH_UNITS = ['px', '%'];

/** Placeholder of the corner field per shape (its default). */
const CORNER_PLACEHOLDER: Partial<Record<ShapeKind, string>> = {
  squircle: '50',
  notch: String(SHAPE_DEFAULTS.corner),
  ticket: String(SHAPE_DEFAULTS.corner),
  hexagon: 'auto',
  octagon: 'auto',
};

const CORNER_LABEL: Partial<Record<ShapeKind, string>> = {
  squircle: 'Corner size',
  notch: 'Cut size',
  ticket: 'Cutout size',
  hexagon: 'Side cut',
  octagon: 'Side cut',
};

const PREVIEW_W = 40;
const PREVIEW_H = 28;
const previewCache = new Map<string, string>();

/** A tile is about a third of a typical module: px lengths shrink with it, % stays. */
const PREVIEW_SCALE = 0.35;
/** Preview lengths (px) for options left at their default (the defaults would fill a tiny tile). */
const PREVIEW_DEFAULTS: Partial<Record<ShapeKind, ShapeOptions>> = {
  notch: { corner: SHAPE_DEFAULTS.corner * PREVIEW_SCALE },
  ticket: { corner: SHAPE_DEFAULTS.corner * PREVIEW_SCALE },
  wave: { amplitude: SHAPE_DEFAULTS.amplitude * PREVIEW_SCALE },
};

function previewLength(v: unknown): unknown {
  if (typeof v === 'string' && v.trim().endsWith('%')) return v;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n * PREVIEW_SCALE : undefined;
}

/** The options as drawn on a tile: px lengths scaled to the tile, defaults sized for it, no motion. */
function previewOptions(kind: ShapeKind, opts: ShapeOptions): ShapeOptions {
  const out: ShapeOptions = { ...PREVIEW_DEFAULTS[kind], ...opts, animate: false };
  for (const k of ['corner', 'amplitude'] as const) {
    if (opts[k] !== undefined) out[k] = previewLength(opts[k]) as ShapeOptions[typeof k];
  }
  return out;
}

/** The tile preview path of a shape (with the current options for the selected one). */
function previewPath(kind: ShapeKind, opts: ShapeOptions): string {
  const key = `${kind}|${JSON.stringify(opts)}`;
  let d = previewCache.get(key);
  if (d === undefined) {
    d = shapePath(kind, PREVIEW_W, PREVIEW_H, previewOptions(kind, opts))?.d ?? '';
    if (previewCache.size > 64) previewCache.clear();
    previewCache.set(key, d);
  }
  return d;
}

/** A random seed 1..9999, never `not` (the current one). */
const randomSeed = (not?: unknown): number => {
  const s = 1 + Math.floor(Math.random() * 9999);
  return String(s) === String(not) ? (s % 9999) + 1 : s;
};

/**
 * The Shape section (design of a card, row, column or module): a grid of shape tiles (None first,
 * a radio group with arrow keys) and the options of the picked shape. Writes `shape` and
 * `shape_options` together; None removes both (on a template-linked card it writes `shape: none`,
 * so the template's shape stays off here).
 */
@customElement('mc-shape-editor')
export class ShapeEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .shape-ed {
        display: grid;
        gap: 16px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
        gap: 8px;
      }
      .tile {
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 4px;
        min-height: 64px;
        padding: 8px 4px 6px;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font: inherit;
        font-size: 0.75rem;
        line-height: 1.3;
        cursor: pointer;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .tile:hover {
        background: var(--mc-surface-2);
        border-color: var(--mc-text-2);
      }
      .tile:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .tile[aria-checked='true'] {
        border-color: var(--mc-accent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .tile svg {
        width: 40px;
        height: 28px;
        overflow: visible;
      }
      .tile path {
        fill: color-mix(in srgb, currentColor 14%, transparent);
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linejoin: round;
      }
      .tile .none-mark {
        fill: none;
        stroke-dasharray: 3 3;
      }
      .tile span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .seed {
        display: flex;
        gap: 8px;
      }
      .seed .input {
        flex: 1;
        min-width: 0;
      }
      .hints {
        display: grid;
        gap: 4px;
      }
      .hints .help {
        margin: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        .tile {
          transition: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) shape?: ShapeKind | string;
  @property({ attribute: false }) options?: ShapeOptions;
  /** A template-linked card: None writes `shape: none` (a removed key would take the template's). */
  @property({ type: Boolean }) explicitNone = false;
  /** module / row / column / card: the module and pop-up hints. */
  @property({ type: String }) target = 'module';
  /** The design has a border radius (the shape replaces it: hint). */
  @property({ type: Boolean }) hasRadius = false;
  /** The design has a box shadow (drawn as a drop shadow along the shape: hint). */
  @property({ type: Boolean }) hasShadow = false;
  /** The card is a pop-up (its open surface stays rectangular: hint). */
  @property({ type: Boolean }) popup = false;
  @property({ attribute: false }) onChange?: (patch: ShapePatch) => void;

  private get _kind(): ShapeKind {
    const s = this.shape;
    return SHAPE_TILES.some((t) => t.kind === s) ? (s as ShapeKind) : 'none';
  }

  private get _opts(): ShapeOptions {
    return this.options && typeof this.options === 'object' ? this.options : {};
  }

  /** The options `kind` reads, without empty values; undefined when none are left. */
  private _clean(kind: ShapeKind, opts: ShapeOptions): ShapeOptions | undefined {
    const keep = SHAPE_TILES.find((t) => t.kind === kind)?.options ?? [];
    const out: Record<string, unknown> = {};
    for (const k of keep) {
      const v = opts[k];
      if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) continue;
      out[k] = v;
    }
    return Object.keys(out).length ? (out as ShapeOptions) : undefined;
  }

  private _pick(kind: ShapeKind): void {
    if (kind === 'none') {
      this.onChange?.({ shape: this.explicitNone ? 'none' : undefined, shape_options: undefined });
      return;
    }
    this.onChange?.({ shape: kind, shape_options: this._clean(kind, this._opts) });
  }

  private _set(patch: Partial<ShapeOptions>): void {
    const kind = this._kind;
    if (kind === 'none') return;
    this.onChange?.({ shape: kind, shape_options: this._clean(kind, { ...this._opts, ...patch }) });
  }

  private _onTileKey(e: KeyboardEvent): void {
    const grid = e.currentTarget as HTMLElement;
    const i = SHAPE_TILES.findIndex((t) => t.kind === this._kind);
    const n = SHAPE_TILES.length;
    const cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length);
    const steps: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    let next: number;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key in steps) {
      next = i + steps[e.key];
      // left / right wrap around; up / down stop at the edges
      if (Math.abs(steps[e.key]) === 1) next = (next + n) % n;
      else if (next < 0 || next >= n) next = i;
    } else return;
    e.preventDefault();
    const kind = SHAPE_TILES[next].kind;
    if (next !== i) this._pick(kind);
    requestAnimationFrame(() => this.renderRoot.querySelector<HTMLElement>(`.tile[data-kind="${kind}"]`)?.focus());
  }

  private _tile(t: ShapeTile, current: ShapeKind): TemplateResult {
    const on = t.kind === current;
    const d = t.kind === 'none' ? '' : previewPath(t.kind, on ? this._opts : {});
    return html`<button
      type="button"
      class="tile"
      role="radio"
      data-kind=${t.kind}
      aria-checked=${on ? 'true' : 'false'}
      tabindex=${on ? '0' : '-1'}
      @click=${() => this._pick(t.kind)}
    >
      <svg viewBox="0 0 ${PREVIEW_W} ${PREVIEW_H}" aria-hidden="true">
        ${t.kind === 'none'
          ? svg`<path class="none-mark" d="M2 2H38V26H2Z"></path>`
          : svg`<path d=${d}></path>`}
      </svg>
      <span>${t.label}</span>
    </button>`;
  }

  private _field(label: string, key: OptionKey | undefined, control: TemplateResult, forId?: string, help?: string): TemplateResult {
    const v = key ? this._opts[key] : undefined;
    const set = v !== undefined && v !== '';
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${key ? fieldReset(label, set, () => this._set({ [key]: undefined })) : nothing}
        </div>
        ${control}
        ${help ? html`<p class="help">${help}</p>` : nothing}
      </div>
    `;
  }

  private _length(key: 'corner' | 'amplitude', label: string, placeholder: string): TemplateResult {
    const v = this._opts[key];
    return html`<mc-unit-field
      .value=${v === undefined ? '' : (v as string | number)}
      .label=${label}
      .units=${LENGTH_UNITS}
      .noCustom=${true}
      .placeholder=${placeholder}
      .inputId=${`shape-${key}`}
      @value-changed=${(e: CustomEvent) => this._set({ [key]: e.detail.value || undefined })}
    ></mc-unit-field>`;
  }

  private _number(key: 'smoothing' | 'waves' | 'seed' | 'wobble', placeholder: number, min?: number, max?: number, step = 1): TemplateResult {
    const v = this._opts[key];
    return html`<input
      class="input"
      id=${`shape-${key}`}
      type="number"
      min=${min ?? nothing}
      max=${max ?? nothing}
      step=${step}
      placeholder=${String(placeholder)}
      .value=${v === undefined ? '' : String(v)}
      @input=${(e: InputEvent) => {
        // a half-typed number ("-", "1e") keeps the stored value
        const s = (e.target as HTMLInputElement).value;
        const n = Number(s);
        if (s.trim() !== '' && Number.isFinite(n)) this._set({ [key]: n });
      }}
      @change=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.value.trim() === '' && !input.validity?.badInput) this._set({ [key]: undefined });
      }}
    />`;
  }

  private _animate(kind: ShapeKind): TemplateResult {
    const on = this._opts.animate === true;
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">Animate</span>
          ${fieldReset('Animate', this._opts.animate !== undefined, () => this._set({ animate: undefined }))}
        </div>
        <p class="help">${kind === 'wave' ? 'The waves flow along the edge.' : 'The blob morphs slowly.'} Paused off-screen and with reduced motion.</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label="Animate"
        @click=${() => this._set({ animate: on ? undefined : true })}
      ></button>
    </div>`;
  }

  private _edge(): TemplateResult {
    const value = this._opts.edge ?? 'bottom';
    const onKey = (e: KeyboardEvent) => {
      const i = EDGES.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = EDGES[(i + step[e.key] + EDGES.length) % EDGES.length].value;
      const group = e.currentTarget as HTMLElement;
      this._set({ edge: next });
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="seg full" role="radiogroup" aria-label="Wave edge" @keydown=${onKey}>
      ${EDGES.map((o) => {
        const on = o.value === value;
        return html`<button
          type="button"
          role="radio"
          data-val=${o.value}
          aria-checked=${on ? 'true' : 'false'}
          tabindex=${on ? '0' : '-1'}
          @click=${() => this._set({ edge: o.value })}
        >${o.label}</button>`;
      })}
    </div>`;
  }

  private _options(kind: ShapeKind): TemplateResult | typeof nothing {
    const lengthHelp = 'In px, or % of the shorter side.';
    switch (kind) {
      case 'squircle':
        return html`<div class="two">
          ${this._field('Corner size', 'corner', this._length('corner', 'Corner size', CORNER_PLACEHOLDER.squircle!), undefined, lengthHelp)}
          ${this._field('Smoothing', 'smoothing', this._number('smoothing', SHAPE_DEFAULTS.smoothing, 0, 1, 0.05), 'shape-smoothing', '1 is rounder, 0 is squarer.')}
        </div>`;
      case 'hexagon':
      case 'octagon':
      case 'notch':
      case 'ticket':
        return this._field(CORNER_LABEL[kind]!, 'corner', this._length('corner', CORNER_LABEL[kind]!, CORNER_PLACEHOLDER[kind]!), undefined, lengthHelp);
      case 'wave':
        return html`
          ${this._field('Edge', 'edge', this._edge())}
          <div class="two">
            ${this._field('Wave height', 'amplitude', this._length('amplitude', 'Wave height', String(SHAPE_DEFAULTS.amplitude)), undefined, lengthHelp)}
            ${this._field('Waves', 'waves', this._number('waves', SHAPE_DEFAULTS.waves, 1, 50), 'shape-waves')}
          </div>
          ${this._animate(kind)}
        `;
      case 'blob':
        return html`
          <div class="two">
            ${this._field(
              'Seed',
              'seed',
              html`<div class="seed">
                ${this._number('seed', SHAPE_DEFAULTS.seed, 0, undefined, 1)}
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  title="Pick another random blob"
                  @click=${() => this._set({ seed: randomSeed(this._opts.seed ?? SHAPE_DEFAULTS.seed) })}
                >
                  <ha-icon icon="mdi:dice-5-outline"></ha-icon>Shuffle
                </button>
              </div>`,
              'shape-seed',
            )}
            ${this._field('Wobble', 'wobble', this._number('wobble', SHAPE_DEFAULTS.wobble, 0, 1, 0.05), 'shape-wobble', '0 is round, 1 is most irregular.')}
          </div>
          ${this._animate(kind)}
        `;
      default:
        return nothing;
    }
  }

  private _hints(kind: ShapeKind): TemplateResult | typeof nothing {
    if (kind === 'none') return nothing;
    const hints: string[] = [];
    if (this.hasRadius) hints.push('The shape replaces Border radius here.');
    if (this.hasShadow) hints.push('Box shadow follows the shape as a drop shadow (first shadow only).');
    if (this.target === 'module') hints.push('The shape clips anything that pops out of the module, like dropdowns and tooltips.');
    if (this.target === 'card' && this.popup) hints.push('An open pop-up keeps a rectangular surface.');
    if (!hints.length) return nothing;
    return html`<div class="hints">${hints.map((h) => html`<p class="help">${h}</p>`)}</div>`;
  }

  protected render(): TemplateResult {
    const kind = this._kind;
    return html`
      <div class="shape-ed">
        <div class="tiles" role="radiogroup" aria-label="Shape" @keydown=${this._onTileKey}>
          ${SHAPE_TILES.map((t) => this._tile(t, kind))}
        </div>
        ${this._hints(kind)}
        ${this._options(kind)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-shape-editor': ShapeEditor;
  }
}
