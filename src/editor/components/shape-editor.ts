import { LitElement, html, css, svg, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, ShapeKind, ShapeOptions } from '../../types';
import type { CustomShapeOptions } from '../../contracts/custom-shape';
import type { SavedShape } from '../../contracts/mcu-library';
import { freeId, listShapes, saveShape, slug, type Listing } from '../custom/library';
import { applyShapePatch, openShapeEditor, type ShapeWrite } from '../custom/shape-host';
import { cardStateOf } from '../custom/bridge';
import { openLibrary } from '../custom/library-sheet';
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
  { kind: 'custom', label: 'Custom', options: [] },
];

/** Presets "Edit as custom" can convert to corners or a path (shape editor, design 04 section 0). */
const EDITABLE: ShapeKind[] = ['squircle', 'pill', 'circle', 'hexagon', 'octagon', 'notch'];
/** Presets that cannot be edited yet: the line under the picker says so. */
const NOT_EDITABLE: ShapeKind[] = ['ticket', 'wave', 'blob'];

const SHAPE_GROUPS: Array<[string, ShapeKind[]]> = [
  ['Rounded', ['squircle', 'pill', 'circle']],
  ['Cut corners', ['hexagon', 'octagon', 'notch', 'ticket']],
  ['Organic', ['wave', 'blob']],
  ['Your own', ['custom']],
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
 * The Shape section (design of a card, row, column or module): a select of shapes (None first,
 * grouped) with a small preview, and the options of the picked shape. Writes `shape` and
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
      .pick {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        container-type: inline-size;
      }
      .pick .select {
        min-width: 0;
      }
      .preview {
        width: 56px;
        height: 40px;
        overflow: visible;
        color: var(--mc-text-2);
        background: var(--mc-surface-2);
        border-radius: var(--mc-radius);
      }
      .preview path {
        fill: color-mix(in srgb, currentColor 14%, transparent);
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linejoin: round;
      }
      .preview .none-mark {
        fill: none;
        stroke-dasharray: 3 3;
      }
      @container (max-width: 259px) {
        .pick {
          grid-template-columns: 1fr;
        }
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
      .shape-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .mine {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .mine li {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .mine .nm {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .save-form {
        display: grid;
        gap: 8px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
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
  /** Reads the saved shapes (My shapes, Save as shape) and opens the shape editor. */
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The name of the target in the shape editor's title: "Shape for Living room tile". */
  @property({ type: String }) label = '';

  @state() private _lib?: Listing<SavedShape>;
  @state() private _source: 'presets' | 'mine' = 'presets';
  /** The shape editor's chunk: loading or failed (E1). */
  @state() private _opening: 'loading' | 'failed' | '' = '';
  /** "Save as shape": the name field is open. */
  @state() private _saving?: { name: string; error?: string; busy?: boolean };
  @state() private _status = '';
  private _listed?: unknown;

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
    if (kind === 'custom') {
      // the Custom tile opens the editor; nothing is written until it commits a change
      if (this._kind !== 'custom') void this._open();
      this.requestUpdate();
      return;
    }
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

  private _picker(kind: ShapeKind): TemplateResult {
    const opt = (t: ShapeTile) => html`<option value=${t.kind} ?selected=${t.kind === kind}>${t.label}</option>`;
    const group = (label: string, kinds: ShapeKind[]) =>
      html`<optgroup label=${label}>${kinds.map((k) => opt(SHAPE_TILES.find((t) => t.kind === k)!))}</optgroup>`;
    const d = kind === 'none' || kind === 'custom' ? '' : previewPath(kind, this._opts);
    return html`<div class="pick">
      <div class="select">
        <select class="input" id="shape-kind" data-focus-key="shape-entry" aria-label="Shape" @change=${(e: Event) => this._pick((e.target as HTMLSelectElement).value as ShapeKind)}>
          ${opt(SHAPE_TILES[0])}
          ${SHAPE_GROUPS.map(([label, kinds]) => group(label, kinds))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <svg class="preview" viewBox="-8 -6 ${PREVIEW_W + 16} ${PREVIEW_H + 12}" aria-hidden="true">
        ${kind === 'none' ? svg`<path class="none-mark" d="M2 2H38V26H2Z"></path>` : kind === 'custom' ? svg`<path d="M10 2H38V18L30 26H2V10Z"></path>` : svg`<path d=${d}></path>`}
      </svg>
    </div>`;
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

  // ── custom shapes: the shape editor, My shapes, Save as shape ──

  /** The card's `custom_shapes` (copies of saved shapes), read through the card editor's state. */
  private _copies(): Record<string, CustomShapeOptions> {
    return (cardStateOf(this)?.getConfig().custom_shapes ?? {}) as Record<string, CustomShapeOptions>;
  }

  private async _open(preset?: { shape: string; shape_options?: ShapeOptions }): Promise<void> {
    // the entry button stays enabled while the chunk loads: a disabled button drops focus, and focus must return to it
    if (this._opening === 'loading') return;
    this._opening = 'loading';
    const kind = this._kind;
    const r = await openShapeEditor({
      from: this,
      hass: this.hass,
      label: this.label || `Shape for this ${this.target}`,
      value: kind === 'custom' ? { shape: 'custom', shape_options: this._opts } : undefined,
      preset,
      apply: (patch) => this.onChange?.(patch),
    });
    this._opening = r === 'failed' ? 'failed' : '';
  }

  /** A patch with inline copies: the two keys go to the consumer, the copies to the card's custom_shapes (same undo step). */
  private _write(patch: ShapeWrite): void {
    applyShapePatch(cardStateOf(this), patch, (keys) => this.onChange?.(keys));
  }

  private _use(item: SavedShape, asCopy: boolean): void {
    // a link keeps an inline copy in the card (it draws when Magic Card Utils is missing)
    this._write(
      asCopy
        ? { shape: 'custom', shape_options: { ...item.shape } }
        : { shape: 'custom', shape_options: { ref: item.id }, custom_shapes: { [item.id]: item.shape } },
    );
    this._status = asCopy ? `Using a copy of ${item.name}.` : `Using ${item.name}. Changes to it reach every card that uses it.`;
  }

  /** A linked shape becomes this card's own: the library's options without the link. */
  private _detach(): void {
    const id = this._opts.ref;
    if (!id) return;
    const own = this._lib?.items.find((i) => i.id === id)?.shape ?? this._copies()[id];
    if (!own) return;
    this._write({ shape: 'custom', shape_options: { ...own } });
    this._status = 'This card now has its own copy.';
  }

  private async _saveAs(): Promise<void> {
    const f = this._saving;
    if (!f || f.busy) return;
    const name = f.name.trim();
    if (!name) {
      this._saving = { ...f, error: 'Give it a name.' };
      return;
    }
    if (name.length > 80) {
      this._saving = { ...f, error: 'Use at most 80 characters.' };
      return;
    }
    this._saving = { ...f, busy: true, error: undefined };
    const taken = new Set((this._lib?.items ?? []).map((i) => i.id));
    const shape: ShapeOptions = { ...this._opts };
    delete shape.ref;
    const r = await saveShape(this.hass, { id: freeId(slug(name, 'shape'), taken), name, shape });
    if (r.shape) {
      this._saving = undefined;
      this._status = `Saved as ${r.shape.name}. Find it under My shapes.`;
      this._lib = await listShapes(this.hass);
      return;
    }
    const why = {
      readonly: 'Your account can use the library but not change it. Ask an admin.',
      full: 'The library is full. Delete a shape first.',
      invalid: 'This shape can not be saved.',
      unreachable: 'Could not reach Magic Card Utils. Try again.',
    }[r.error ?? 'unreachable'];
    this._saving = { ...f, busy: false, error: why };
  }

  private _sourceChips(): TemplateResult | typeof nothing {
    if (this._lib?.state !== 'ok') return nothing;
    const chip = (v: 'presets' | 'mine', label: string) =>
      html`<button type="button" role="radio" aria-checked=${this._source === v ? 'true' : 'false'} @click=${() => (this._source = v)}>${label}</button>`;
    return html`<div class="seg full" role="radiogroup" aria-label="Shape source">${chip('presets', 'Presets')}${chip('mine', `My shapes (${this._lib.items.length})`)}</div>`;
  }

  private _mine(): TemplateResult {
    const items = this._lib?.items ?? [];
    if (!items.length) {
      return html`<div class="mine-empty"><p class="help">No saved shapes yet. Make a custom shape, then choose Save as shape.</p>
        <button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" @click=${() => void this._open()}>Make a custom shape</button></div>`;
    }
    return html`<ul class="mine" aria-label="My shapes">
      ${items.map(
        (i) => html`<li>
          <span class="nm">${i.name}</span>
          <button type="button" class="btn btn-secondary btn-sm" aria-label=${`Use ${i.name}`} @click=${() => this._use(i, false)}>Use</button>
          <button type="button" class="btn btn-text btn-sm" aria-label=${`Use a copy of ${i.name}`} @click=${() => this._use(i, true)}>Use as copy</button>
        </li>`,
      )}
    </ul>
    <p class="help">Use follows the library: change a shape and every card that uses it changes. Use as copy makes this card independent.</p>`;
  }

  private _openButton(label: string, onClick: () => void): TemplateResult {
    const loading = this._opening === 'loading';
    return html`<button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" aria-busy=${loading ? 'true' : 'false'} @click=${onClick}>
      ${label}${loading ? html`<span class="sr-only"> Loading</span>` : nothing}
    </button>`;
  }

  private _actions(kind: ShapeKind): TemplateResult | typeof nothing {
    if (kind === 'none') return nothing;
    const parts: TemplateResult[] = [];
    if (kind === 'custom') {
      const ref = this._opts.ref;
      parts.push(this._openButton('Edit shape', () => void this._open()));
      if (ref) {
        parts.push(html`<button type="button" class="btn btn-text btn-sm" @click=${() => this._detach()}>Use as copy</button>`);
      } else if (this._lib) {
        const off = this._lib.state !== 'ok';
        parts.push(
          html`<button type="button" class="btn btn-text btn-sm" aria-disabled=${off ? 'true' : 'false'} aria-describedby=${off ? 'shape-lib-hint' : nothing}
            @click=${() => (off ? undefined : (this._saving = { name: 'Custom shape' }))}>Save as shape</button>`,
        );
      }
    } else if (EDITABLE.includes(kind)) {
      parts.push(this._openButton('Edit as custom', () => void this._open({ shape: kind, shape_options: this._opts })));
    }
    const hints: TemplateResult[] = [];
    if (NOT_EDITABLE.includes(kind)) hints.push(html`<p class="help">Ticket, Wave and Blob can not be edited yet. Use the preset as it is.</p>`);
    if (kind === 'custom' && this._opts.ref) {
      const name = this._lib?.items.find((i) => i.id === this._opts.ref)?.name ?? this._opts.ref;
      hints.push(html`<p class="help">Linked to the saved shape ${name}. Change it there and every card that uses it changes.</p>`);
    }
    if (kind === 'custom' && !this._opts.ref && this._lib && this._lib.state !== 'ok') {
      hints.push(html`<p class="help" id="shape-lib-hint">Keep your own shapes for every dashboard with the free Magic Card Utils add-on. Until then, this shape is saved in this card only.</p>`);
    }
    if (this._opening === 'failed') {
      hints.push(html`<p class="help error" role="alert">The shape editor could not load. Check your connection and try again.</p>`);
    }
    return html`<div class="shape-actions">${parts}</div>${hints}${this._saveForm()}`;
  }

  private _saveForm(): TemplateResult | typeof nothing {
    const f = this._saving;
    if (!f) return nothing;
    return html`<form class="save-form" @submit=${(e: Event) => { e.preventDefault(); void this._saveAs(); }}>
      <label for="shape-save-name">Name</label>
      <input class="input" id="shape-save-name" .value=${f.name} maxlength="80" aria-invalid=${f.error ? 'true' : 'false'} aria-describedby=${f.error ? 'shape-save-err' : nothing}
        @input=${(e: InputEvent) => (this._saving = { ...f, name: (e.target as HTMLInputElement).value, error: undefined })}
        @keydown=${(e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); this._saving = undefined; } }} />
      ${f.error ? html`<p class="help error" id="shape-save-err" role="alert">${f.error}</p>` : nothing}
      <div class="shape-actions">
        <button type="submit" class="btn btn-primary btn-sm" ?disabled=${f.busy}>Save</button>
        <button type="button" class="btn btn-text btn-sm" @click=${() => (this._saving = undefined)}>Cancel</button>
      </div>
    </form>`;
  }

  protected willUpdate(): void {
    // the saved shapes: listed once per hass (a page without Magic Card Utils answers "missing" at once)
    if (this.hass && this._listed !== this.hass) {
      this._listed = this.hass;
      void listShapes(this.hass).then((l) => (this._lib = l));
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

  protected updated(): void {
    // options inside an optgroup do not always take `selected`: set the value after render
    const sel = this.renderRoot.querySelector<HTMLSelectElement>('select#shape-kind');
    if (sel && sel.value !== this._kind) sel.value = this._kind;
  }

  protected render(): TemplateResult {
    const kind = this._kind;
    return html`
      <div class="shape-ed">
        ${this._sourceChips()}
        ${this._source === 'mine' && this._lib?.state === 'ok'
          ? this._mine()
          : html`${this._picker(kind)}${this._actions(kind)}${this._hints(kind)}${this._options(kind)}`}
        <div class="shape-actions"><button type="button" class="btn btn-text btn-sm" @click=${(e: Event) => void openLibrary(e.currentTarget as HTMLElement, this.hass, 'shape')}>Library</button></div>
        <p class="sr-only" role="status">${this._status}</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-shape-editor': ShapeEditor;
  }
}
