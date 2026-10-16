import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import { safeCssValue, type AnimationDoc } from '../model';
import type { RigShape, TargetRef } from '../model-v2';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import {
  TOLERANCE_RANGE,
  TOOL_INFO,
  activeTool,
  drawActive,
  selectedShapeId,
  drawStore,
  isDrawTool,
  isRigRef,
  type DrawOptions,
  type DrawTool,
} from './draw-store';
import { addDrawOnTrack, fitFreehand, hasDrawOn, isFilled, isStroked, moveShape, removeDrawOn, removeShape, setTrackPath, updateShape } from './draw-utils';

/*
 * mc-anim-shape-inspector (place 'inspector'): the settings of a selected drawn shape (name, fill,
 * stroke, width, line ends, layer over / under the icon, order, smoothing of a freehand stroke,
 * draw-on and its motion path), or, while a draw tool is active, that tool's options for new shapes
 * (and snapping). mc-unit-field / mc-color-picker are used by tag only (the card bundle defines
 * them). Every edit is one doc-change.
 */

const CAPS: Array<{ value: NonNullable<RigShape['linecap']>; label: string }> = [
  { value: 'round', label: 'Round' },
  { value: 'butt', label: 'Flat' },
  { value: 'square', label: 'Square' },
];
const LAYERS: Array<{ value: RigShape['layer']; label: string; icon: string }> = [
  { value: 'over', label: 'Over the icon', icon: 'mdi:arrange-bring-forward' },
  { value: 'under', label: 'Under the icon', icon: 'mdi:arrange-send-backward' },
];

/** A colour picker value as a shape colour (entity colours stay `entity` / `entity N%`). */
export function shapeColor(v: string): string | undefined {
  const t = v.trim();
  if (!t) return undefined;
  if (/^entity( \d{1,3}%)?$/.test(t)) return t;
  return safeCssValue(t, 'color');
}

const clampWidth = (n: number): number => Math.min(100, Math.max(0, Math.round(n * 100) / 100));

@customElement('mc-anim-shape-inspector')
export class AnimShapeInspector extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
      }
      .id {
        font: 0.75rem/1.5 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
        color: var(--secondary-text-color, #5f6368);
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .slider {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        min-height: 32px;
      }
      .slider input[type='range'] {
        width: 100%;
        margin: 0;
        accent-color: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        font-variant-numeric: tabular-nums;
      }
      .paint {
        display: grid;
        gap: 8px;
      }
      .danger-text {
        color: color-mix(in srgb, var(--error-color, #db4437) 80%, var(--primary-text-color, #212121));
      }
      .tool-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tool-head ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color, #5f6368);
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) tile?: string;
  @property({ attribute: false }) stage?: StageInfo;

  private _unsub?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._unsub = drawStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
  }

  private get _shape(): RigShape | undefined {
    const id = selectedShapeId(this.selection);
    return id ? this.doc?.rig?.shapes?.find((s) => s.id === id) : undefined;
  }

  private _emit(doc: AnimationDoc | undefined, label: string, transient = false): void {
    if (!doc) return;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
  }

  private _select(selection: StudioSelection): void {
    this.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
  }

  private _patch(s: RigShape, patch: Partial<RigShape>, label: string): void {
    if (this.doc) this._emit(updateShape(this.doc, s.id, patch), label);
  }

  // ── pieces ──

  private _seg<T extends string>(label: string, options: Array<{ value: T; label: string; icon?: string }>, value: T, pick: (v: T) => void, cls = ''): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const i = options.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = options[(i + step[e.key] + options.length) % options.length].value;
      const group = e.currentTarget as HTMLElement;
      pick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="field">
      <div class="field-head"><span class="lbl">${label}</span></div>
      <div class="seg full ${cls}" role="radiogroup" aria-label=${label} @keydown=${onKey}>
        ${options.map((o) => {
          const on = o.value === value;
          return html`<button
            type="button"
            role="radio"
            data-val=${o.value}
            aria-checked=${on ? 'true' : 'false'}
            tabindex=${on ? '0' : '-1'}
            ?disabled=${this.disabled}
            @click=${() => on || pick(o.value)}
          >
            ${o.icon ? html`<ha-icon icon=${o.icon}></ha-icon>` : nothing}${o.label}
          </button>`;
        })}
      </div>
    </div>`;
  }

  private _switch(label: string, help: string, on: boolean, toggle: () => void, cls: string, off = false): TemplateResult {
    return html`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${label}</span>
        ${help ? html`<p class="help">${help}</p>` : nothing}
      </div>
      <button
        type="button"
        class="switch ${cls}"
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label=${label}
        ?disabled=${this.disabled || off}
        @click=${toggle}
      ></button>
    </div>`;
  }

  private _color(label: string, value: string, set: (v: string) => void, cls: string): TemplateResult {
    return html`<mc-color-picker
      class=${cls}
      allowEntity
      .label=${label}
      .value=${value}
      ?disabled=${this.disabled}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        const v = shapeColor(String(e.detail.value ?? ''));
        if (v && v !== value) set(v);
      }}
    ></mc-color-picker>`;
  }

  private _number(id: string, label: string, value: number, step: number, max: number, set: (n: number) => void): TemplateResult {
    return html`<div class="field">
      <div class="field-head"><label for=${id}>${label}</label></div>
      <input
        id=${id}
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max=${max}
        step=${step}
        .value=${String(value)}
        ?disabled=${this.disabled}
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          const n = Number(input.value);
          if (input.value === '' || !Number.isFinite(n)) {
            input.value = String(value);
            return;
          }
          const v = Math.min(max, Math.max(0, Math.round(n * 100) / 100));
          input.value = String(v);
          if (v !== value) set(v);
        }}
      />
    </div>`;
  }

  /** Fill and stroke controls; `fill` / `stroke` undefined: off. */
  private _paint(
    p: { fill?: string; stroke?: string; width: number; cap: NonNullable<RigShape['linecap']>; closed: boolean },
    set: { fill: (v: string | undefined) => void; stroke: (v: string | undefined) => void; width: (n: number) => void; cap: (c: NonNullable<RigShape['linecap']>) => void },
  ): TemplateResult {
    return html`<section class="group" aria-labelledby="h-paint">
      <div class="group-head"><h3 id="h-paint">Paint</h3></div>
      ${p.closed
        ? html`<div class="paint">
            ${this._switch('Fill', '', p.fill !== undefined, () => set.fill(p.fill !== undefined ? undefined : 'currentColor'), 'fill-on', p.fill !== undefined && p.stroke === undefined)}
            ${p.fill !== undefined ? this._color('Fill colour', p.fill, (v) => set.fill(v), 'fill-color') : nothing}
          </div>`
        : nothing}
      <div class="paint">
        ${this._switch('Stroke', p.closed ? '' : 'An open line is drawn by its stroke.', p.stroke !== undefined, () => set.stroke(p.stroke !== undefined ? undefined : 'currentColor'), 'stroke-on', !p.closed || (p.stroke !== undefined && p.fill === undefined))}
        ${p.stroke !== undefined
          ? html`${this._color('Stroke colour', p.stroke, (v) => set.stroke(v), 'stroke-color')}
              <div class="two">
                ${this._number('f-width', 'Stroke width (icon units)', p.width, 0.25, 100, set.width)}
              </div>
              ${this._seg('Line ends', CAPS, p.cap, set.cap, 'caps')}`
          : nothing}
      </div>
    </section>`;
  }

  /** `onChange(tol, final)`: dragging the slider sends transient values, letting go the final one. */
  private _smoothing(onChange: (tol: number, final: boolean) => void, help: string): TemplateResult {
    const tol = drawStore.options.tolerance;
    return html`<div class="field">
      <div class="field-head"><label for="f-tol">Smoothing</label><span class="val">${tol.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">Detail</span>
        <input
          id="f-tol"
          type="range"
          min=${TOLERANCE_RANGE.min}
          max=${TOLERANCE_RANGE.max}
          step=${TOLERANCE_RANGE.step}
          .value=${String(tol)}
          aria-valuetext=${`${tol.toFixed(2)} icon units`}
          ?disabled=${this.disabled}
          @input=${(e: Event) => onChange(Number((e.target as HTMLInputElement).value), false)}
          @change=${(e: Event) => onChange(Number((e.target as HTMLInputElement).value), true)}
        />
        <span aria-hidden="true">Smooth</span>
      </div>
      <p class="help">${help}</p>
    </div>`;
  }

  /** A slider drag sent transient refits: the final value must be sent even when unchanged. */
  private _refitting = false;

  /**
   * Refit the last freehand stroke at a new tolerance: transient while the slider moves, one undo
   * step when it is let go.
   */
  private _refit(tol: number, final: boolean): void {
    drawStore.set({ tolerance: tol });
    const last = drawStore.lastFreehand;
    const s = last && this.doc?.rig?.shapes?.find((x) => x.id === last.id);
    if (!s || !this.doc) return;
    const fit = fitFreehand(last.raw, tol);
    if (!fit.d) return;
    if (!final) {
      if (fit.d === s.d) return;
      this._refitting = true;
      this._emit(updateShape(this.doc, s.id, { d: fit.d }), 'Smooth stroke', true);
      return;
    }
    if (fit.d !== s.d || this._refitting) this._emit(updateShape(this.doc, s.id, { d: fit.d }), 'Smooth stroke');
    this._refitting = false;
  }

  // ── a selected shape ──

  private _renderShape(s: RigShape): TemplateResult {
    const doc = this.doc!;
    const target: TargetRef = `shape:${s.id}`;
    const closed = /[Zz]\s*$/.test(s.d) || isFilled(s);
    const list = doc.rig?.shapes ?? [];
    const idx = list.findIndex((x) => x.id === s.id);
    const track = doc.tracks?.find((t) => t.target === target);
    const freehand = drawStore.lastFreehand?.id === s.id;
    return html`
      <section class="group" aria-labelledby="h-shape">
        <div class="group-head"><h3 id="h-shape">Shape</h3><span class="id" title="Target">${target}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">Name</label></div>
          <input
            id="f-name"
            class="input"
            .value=${s.name}
            maxlength="80"
            ?disabled=${this.disabled}
            @change=${(e: Event) => {
              const input = e.target as HTMLInputElement;
              const v = input.value.trim();
              if (!v) input.value = s.name;
              else if (v !== s.name) this._patch(s, { name: v }, 'Rename shape');
            }}
          />
        </div>
        ${this._seg('Layer', LAYERS, s.layer, (layer) => this._patch(s, { layer }, layer === 'under' ? 'Shape under the icon' : 'Shape over the icon'), 'layer')}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled || idx >= list.length - 1} @click=${() => this._emit(moveShape(doc, s.id, idx + 1), 'Bring shape forward')}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>Bring forward
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled || idx <= 0} @click=${() => this._emit(moveShape(doc, s.id, idx - 1), 'Send shape backward')}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>Send backward
          </button>
        </div>
      </section>
      ${this._paint(
        { fill: isFilled(s) ? (s.fill ?? 'currentColor') : undefined, stroke: isStroked(s) ? s.stroke : undefined, width: s.stroke_width ?? 1, cap: s.linecap ?? 'butt', closed },
        {
          fill: (v) => this._patch(s, { fill: v }, v ? 'Change fill' : 'Remove fill'),
          stroke: (v) => this._patch(s, v ? { stroke: v, stroke_width: s.stroke_width ?? 1 } : { stroke: undefined, stroke_width: undefined, linecap: undefined }, v ? 'Change stroke' : 'Remove stroke'),
          width: (n) => this._patch(s, { stroke_width: clampWidth(n) }, 'Change stroke width'),
          cap: (c) => this._patch(s, { linecap: c }, 'Change line ends'),
        },
      )}
      ${freehand
        ? html`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">Freehand</h3></div>
            ${this._smoothing((t, f) => this._refit(t, f), 'More smoothing: fewer points and a calmer line. The dotted line is what you drew.')}
          </section>`
        : nothing}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">Animation</h3></div>
        ${this._switch(
          'Draw on',
          isFilled(s) ? 'The outline draws in over the cycle, then the shape fills.' : 'The line draws in over the cycle.',
          hasDrawOn(doc, target),
          () => (hasDrawOn(doc, target) ? this._emit(removeDrawOn(doc, target), 'Remove draw on') : this._emit(addDrawOnTrack(doc, target), 'Draw on')),
          'draw-on',
        )}
        <div class="field">
          <div class="field-head"><span class="lbl">Motion path</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${() => this._select({ kind: 'tool', tool: 'motion', target })}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${track?.path ? 'Redraw' : 'Draw motion path'}
            </button>
            ${track?.path
              ? html`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${() => this._emit(setTrackPath(doc, target, undefined, false), 'Remove motion path')}>
                  Remove
                </button>`
              : nothing}
          </div>
          ${track?.path
            ? this._switch('Follow the path', 'The shape turns with the direction it travels.', !!track.path.follow_rotation, () => {
                const tracks = (doc.tracks ?? []).map((t) => (t === track ? { ...t, path: { ...t.path!, follow_rotation: !t.path!.follow_rotation } } : t));
                this._emit({ ...doc, tracks }, 'Follow the path');
              }, 'follow')
            : html`<p class="help">Draw on the stage where the shape travels, starting where it rests.</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${() => {
          this._emit(removeShape(doc, s.id), 'Delete shape');
          this._select({ kind: 'tool', tool: 'select' });
        }}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>Delete shape
        </button>
      </section>
    `;
  }

  // ── a tool's options ──

  private _opt(patch: Partial<DrawOptions>): void {
    drawStore.set(patch);
  }

  private _renderTool(tool: DrawTool): TemplateResult {
    const o = drawStore.options;
    const info = TOOL_INFO[tool];
    const makes = tool === 'pen' || tool === 'line' || tool === 'rect' || tool === 'ellipse' || tool === 'freehand';
    const closedTool = tool === 'rect' || tool === 'ellipse' || tool === 'pen';
    const target = this.selection.target;
    return html`
      <section class="group" aria-labelledby="h-tool">
        <div class="group-head tool-head"><ha-icon icon=${info.icon}></ha-icon><h3 id="h-tool">${info.label}</h3></div>
        <p class="help lead">${info.hint}</p>
        ${tool === 'motion'
          ? isRigRef(target)
            ? html`<p class="help">Moving <span class="id">${target}</span>.</p>
                ${this._switch('Follow the path', 'It turns with the direction it travels.', o.follow, () => this._opt({ follow: !o.follow }), 'follow-opt')}`
            : html`<p class="help">Select a part or shape first.</p>`
          : nothing}
        ${tool === 'rect' ? this._number('f-radius', 'Corner radius (icon units)', o.radius, 0.5, 12, (n) => this._opt({ radius: n })) : nothing}
        ${tool === 'freehand' || tool === 'motion'
          ? this._smoothing(
              (t, f) => (tool === 'freehand' ? this._refit(t, f) : this._opt({ tolerance: t })),
              tool === 'freehand' && drawStore.lastFreehand ? 'Changes the last stroke too. The dotted line is what you drew.' : 'More smoothing: fewer points and a calmer line.',
            )
          : nothing}
      </section>
      ${makes
        ? html`${this._paint(
              { fill: closedTool ? o.fill || undefined : undefined, stroke: o.stroke || (closedTool ? undefined : 'currentColor'), width: o.strokeWidth, cap: o.linecap, closed: closedTool },
              {
                fill: (v) => this._opt({ fill: v ?? '' }),
                stroke: (v) => this._opt({ stroke: v ?? '' }),
                width: (n) => this._opt({ strokeWidth: clampWidth(n) }),
                cap: (c) => this._opt({ linecap: c }),
              },
            )}
            <section class="group" aria-labelledby="h-new">
              <div class="group-head"><h3 id="h-new">New shapes</h3></div>
              ${this._seg('Layer', LAYERS, o.layer, (layer) => this._opt({ layer }), 'layer')}
            </section>`
        : nothing}
      ${tool !== 'erase' && tool !== 'select'
        ? html`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">Snapping</h3></div>
            ${this._switch('Grid', 'Points land on whole icon units. Hold Shift to place freely.', o.grid, () => this._opt({ grid: !o.grid }), 'snap-grid')}
            ${this._switch('Anchor points', 'Points jump to the icon’s and other shapes’ points nearby.', o.anchors, () => this._opt({ anchors: !o.anchors }), 'snap-anchors')}
          </section>`
        : nothing}
    `;
  }

  protected render(): TemplateResult {
    if (!this.doc) return html``;
    const s = this._shape;
    if (s) return this._renderShape(s);
    if (this.selection.kind === 'tool' && isDrawTool(this.selection.tool)) return this._renderTool(activeTool(this.selection));
    return html``;
  }
}

registerPanel({ tag: 'mc-anim-shape-inspector', place: 'inspector', when: drawActive, title: 'Drawing', order: 30 });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-shape-inspector': AnimShapeInspector;
  }
}
