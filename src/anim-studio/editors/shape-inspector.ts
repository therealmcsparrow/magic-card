import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
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
import type { PathDraw } from '../../contracts/path-model';
import { loadPathCanvas } from '../../path-canvas/loader';
import { addDrawOnTrack, hasDrawOn, isFilled, isStroked, moveShape, removeDrawOn, removeShape, setTrackPath, updateShape } from './draw-utils';
import { t, tx, m, type MessageId } from '../i18n';

// mc-anim-shape-inspector (place 'inspector'): settings of a selected drawn shape (fill, stroke, ends, layer, order,
// smoothing, draw-on, motion path) or the options of the active draw tool. Every edit is one doc-change.

const CAPS: Array<{ value: NonNullable<RigShape['linecap']>; label: MessageId }> = [
  { value: 'round', label: m('anim-studio.shape-inspector.round') },
  { value: 'butt', label: m('anim-studio.shape-inspector.flat') },
  { value: 'square', label: m('anim-studio.shape-inspector.square') },
];
const LAYERS: Array<{ value: RigShape['layer']; label: MessageId; icon: string }> = [
  { value: 'over', label: m('anim-studio.shape-inspector.over-the-icon'), icon: 'mdi:arrange-bring-forward' },
  { value: 'under', label: m('anim-studio.shape-inspector.under-the-icon'), icon: 'mdi:arrange-send-backward' },
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

  /** The chunk's freehand fit; the smoothing slider waits for it. */
  @state() private _draw?: PathDraw;
  private _drawLoading = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._unsub = drawStore.subscribe(() => this.requestUpdate());
  }

  protected willUpdate(): void {
    if (this._draw || this._drawLoading) return;
    if (!drawStore.lastFreehand && activeTool(this.selection) !== 'freehand') return;
    this._drawLoading = true;
    void loadPathCanvas().then((chunk) => {
      this._drawLoading = false;
      if (chunk) this._draw = chunk.pathDraw;
    });
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

  private _seg<T extends string>(label: string, options: Array<{ value: T; label: MessageId; icon?: string }>, value: T, pick: (v: T) => void, cls = ''): TemplateResult {
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
            ${o.icon ? html`<ha-icon icon=${o.icon}></ha-icon>` : nothing}${t(o.label)}
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
      <div class="group-head"><h3 id="h-paint">${t('anim-studio.shape-inspector.paint')}</h3></div>
      ${p.closed
        ? html`<div class="paint">
            ${this._switch(t('anim-studio.shape-inspector.fill'), '', p.fill !== undefined, () => set.fill(p.fill !== undefined ? undefined : 'currentColor'), 'fill-on', p.fill !== undefined && p.stroke === undefined)}
            ${p.fill !== undefined ? this._color(t('anim-studio.shape-inspector.fill-colour'), p.fill, (v) => set.fill(v), 'fill-color') : nothing}
          </div>`
        : nothing}
      <div class="paint">
        ${this._switch(t('anim-studio.shape-inspector.stroke'), p.closed ? '' : t('anim-studio.shape-inspector.an-open-line-is-drawn-by-its-stroke'), p.stroke !== undefined, () => set.stroke(p.stroke !== undefined ? undefined : 'currentColor'), 'stroke-on', !p.closed || (p.stroke !== undefined && p.fill === undefined))}
        ${p.stroke !== undefined
          ? html`${this._color(t('anim-studio.shape-inspector.stroke-colour'), p.stroke, (v) => set.stroke(v), 'stroke-color')}
              <div class="two">
                ${this._number('f-width', t('anim-studio.shape-inspector.stroke-width-icon-units'), p.width, 0.25, 100, set.width)}
              </div>
              ${this._seg(t('anim-studio.shape-inspector.line-ends'), CAPS, p.cap, set.cap, 'caps')}`
          : nothing}
      </div>
    </section>`;
  }

  /** `onChange(tol, final)`: dragging the slider sends transient values, letting go the final one. */
  private _smoothing(onChange: (tol: number, final: boolean) => void, help: string, waiting = false): TemplateResult {
    const tol = drawStore.options.tolerance;
    return html`<div class="field">
      <div class="field-head"><label for="f-tol">${t('anim-studio.shape-inspector.smoothing')}</label><span class="val">${tol.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">${t('anim-studio.shape-inspector.detail')}</span>
        <input
          id="f-tol"
          type="range"
          min=${TOLERANCE_RANGE.min}
          max=${TOLERANCE_RANGE.max}
          step=${TOLERANCE_RANGE.step}
          .value=${String(tol)}
          aria-valuetext=${t('anim-studio.shape-inspector.size-icon-units', { size: tol.toFixed(2) })}
          ?disabled=${this.disabled || waiting}
          @input=${(e: Event) => onChange(Number((e.target as HTMLInputElement).value), false)}
          @change=${(e: Event) => onChange(Number((e.target as HTMLInputElement).value), true)}
        />
        <span aria-hidden="true">${t('anim-studio.shape-inspector.smooth')}</span>
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
    const fit = this._draw?.fitFreehand(last.raw, tol);
    if (!fit) return;
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
        <div class="group-head"><h3 id="h-shape">${t('anim-studio.shape-inspector.shape')}</h3><span class="id" title=${t('anim-studio.shape-inspector.target')}>${target}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">${t('anim-studio.shape-inspector.name')}</label></div>
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
        ${this._seg(t('anim-studio.shape-inspector.layer'), LAYERS, s.layer, (layer) => this._patch(s, { layer }, layer === 'under' ? t('anim-studio.shape-inspector.shape-under-the-icon') : t('anim-studio.shape-inspector.shape-over-the-icon')), 'layer')}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled || idx >= list.length - 1} @click=${() => this._emit(moveShape(doc, s.id, idx + 1), 'Bring shape forward')}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>${t('anim-studio.shape-inspector.bring-forward')}
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled || idx <= 0} @click=${() => this._emit(moveShape(doc, s.id, idx - 1), 'Send shape backward')}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>${t('anim-studio.shape-inspector.send-backward')}
          </button>
        </div>
      </section>
      ${this._paint(
        { fill: isFilled(s) ? (s.fill ?? 'currentColor') : undefined, stroke: isStroked(s) ? s.stroke : undefined, width: s.stroke_width ?? 1, cap: s.linecap ?? 'butt', closed },
        {
          fill: (v) => this._patch(s, { fill: v }, v ? t('anim-studio.shape-inspector.change-fill') : t('anim-studio.shape-inspector.remove-fill')),
          stroke: (v) => this._patch(s, v ? { stroke: v, stroke_width: s.stroke_width ?? 1 } : { stroke: undefined, stroke_width: undefined, linecap: undefined }, v ? t('anim-studio.shape-inspector.change-stroke') : t('anim-studio.shape-inspector.remove-stroke')),
          width: (n) => this._patch(s, { stroke_width: clampWidth(n) }, 'Change stroke width'),
          cap: (c) => this._patch(s, { linecap: c }, 'Change line ends'),
        },
      )}
      ${freehand
        ? html`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">${t('anim-studio.shape-inspector.freehand')}</h3></div>
            ${this._smoothing((t, f) => this._refit(t, f), t('anim-studio.shape-inspector.more-smoothing-fewer-points-and-a-calmer'), !this._draw)}
          </section>`
        : nothing}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">${t('anim-studio.shape-inspector.animation')}</h3></div>
        ${this._switch(
          t('anim-studio.shape-inspector.draw-on'),
          isFilled(s) ? t('anim-studio.shape-inspector.the-outline-draws-in-over-the-cycle-then') : t('anim-studio.shape-inspector.the-line-draws-in-over-the-cycle'),
          hasDrawOn(doc, target),
          () => (hasDrawOn(doc, target) ? this._emit(removeDrawOn(doc, target), 'Remove draw on') : this._emit(addDrawOnTrack(doc, target), 'Draw on')),
          'draw-on',
        )}
        <div class="field">
          <div class="field-head"><span class="lbl">${t('anim-studio.shape-inspector.motion-path')}</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${() => this._select({ kind: 'tool', tool: 'motion', target })}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${track?.path ? t('anim-studio.shape-inspector.redraw') : t('anim-studio.shape-inspector.draw-motion-path')}
            </button>
            ${track?.path
              ? html`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${() => this._emit(setTrackPath(doc, target, undefined, false), 'Remove motion path')}>
                  ${t('anim-studio.shape-inspector.remove')}
                </button>`
              : nothing}
          </div>
          ${track?.path
            ? this._switch(t('anim-studio.shape-inspector.follow-the-path'), t('anim-studio.shape-inspector.the-shape-turns-with-the-direction-it'), !!track.path.follow_rotation, () => {
                const tracks = (doc.tracks ?? []).map((t) => (t === track ? { ...t, path: { ...t.path!, follow_rotation: !t.path!.follow_rotation } } : t));
                this._emit({ ...doc, tracks }, 'Follow the path');
              }, 'follow')
            : html`<p class="help">${t('anim-studio.shape-inspector.draw-on-the-stage-where-the-shape')}</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${() => {
          this._emit(removeShape(doc, s.id), 'Delete shape');
          this._select({ kind: 'tool', tool: 'select' });
        }}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t('anim-studio.shape-inspector.delete-shape')}
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
        <div class="group-head tool-head"><ha-icon icon=${info.icon}></ha-icon><h3 id="h-tool">${t(info.label)}</h3></div>
        <p class="help lead">${t(info.hint)}</p>
        ${tool === 'motion'
          ? isRigRef(target)
            ? html`<p class="help">${tx('anim-studio.shape-inspector.moving-target', { target: html`<span class="id">${target}</span>` })}</p>
                ${this._switch(t('anim-studio.shape-inspector.follow-the-path'), t('anim-studio.shape-inspector.it-turns-with-the-direction-it-travels'), o.follow, () => this._opt({ follow: !o.follow }), 'follow-opt')}`
            : html`<p class="help">${t('anim-studio.shape-inspector.select-a-part-or-shape-first')}</p>`
          : nothing}
        ${tool === 'rect' ? this._number('f-radius', t('anim-studio.shape-inspector.corner-radius-icon-units'), o.radius, 0.5, 12, (n) => this._opt({ radius: n })) : nothing}
        ${tool === 'freehand' || tool === 'motion'
          ? this._smoothing(
              (t, f) => (tool === 'freehand' ? this._refit(t, f) : this._opt({ tolerance: t })),
              tool === 'freehand' && drawStore.lastFreehand ? t('anim-studio.shape-inspector.changes-the-last-stroke-too-the-dotted') : t('anim-studio.shape-inspector.more-smoothing-fewer-points-and-a-calmer-2'),
              tool === 'freehand' && !this._draw,
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
              <div class="group-head"><h3 id="h-new">${t('anim-studio.shape-inspector.new-shapes')}</h3></div>
              ${this._seg(t('anim-studio.shape-inspector.layer'), LAYERS, o.layer, (layer) => this._opt({ layer }), 'layer')}
            </section>`
        : nothing}
      ${tool !== 'erase' && tool !== 'select'
        ? html`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">${t('anim-studio.shape-inspector.snapping')}</h3></div>
            ${this._switch(t('anim-studio.shape-inspector.grid'), t('anim-studio.shape-inspector.points-land-on-whole-icon-units-hold'), o.grid, () => this._opt({ grid: !o.grid }), 'snap-grid')}
            ${this._switch(t('anim-studio.shape-inspector.anchor-points'), t('anim-studio.shape-inspector.points-jump-to-the-icon-s-and-other'), o.anchors, () => this._opt({ anchors: !o.anchors }), 'snap-anchors')}
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

registerPanel({ tag: 'mc-anim-shape-inspector', place: 'inspector', when: drawActive, title: m('anim-studio.shape-inspector.drawing'), order: 30 });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-shape-inspector': AnimShapeInspector;
  }
}
