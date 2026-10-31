import { LitElement, html, css, svg, nothing, type PropertyValues, type SVGTemplateResult, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AnimationDoc, TargetRef } from '../model';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { LayerView } from '../../contracts/studio-layers';
import { isLocked, resolveHidden } from '../layer-view';
import type { PreviewTile } from '../tiles';
import type { IconGeometry } from '../../icons/icon-source';
import type { SplitPiece } from '../../icons/icon-split';
import { moveAnchor, serialize as serializePath, snap, type EditPath } from '../../path/edit';
import { parsePath } from './path-utils';
import {
  emitDoc,
  emitSelection,
  groupOfPart,
  groupParts,
  groupRef,
  hasRig,
  hasTrackPivot,
  loadGeometry,
  partIdsOf,
  partRef,
  peekGeometry,
  piecesOf,
  selectedRefs,
  setEffectivePivot,
  setPartPath,
  sourceIcon,
  targetBox,
  targetName,
  targetPivot,
  targetSelection,
  trackOf,
  type Box,
} from './parts-model';
import { t, m } from '../i18n';

// Icon parts on the stage (slot 'stage-tool'), drawn over the rigged icon: hover, click and band select; selected parts
// show box and pivot, the pivot drags (0.25 snap, Shift free, arrows nudge) and a motion path shows draggable points.
// Pointer events only, handles 24 px or larger. The icon box is measured on the live preview; `.stage` is the fallback.

type Pt = [number, number];
/** The icon box in the overlay's own (unscaled) px. */
interface IconBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DRAG_SLOP = 3;
/** Handle radius in screen px (24 px targets). */
const HANDLE_R = 12;

interface Drag {
  pointerId: number;
  kind: 'pivot' | 'band' | 'anchor';
  ref?: TargetRef;
  index?: number;
  start: Pt;
  startClient: Pt;
  /** The document at the press (a cancelled drag goes back to it). */
  startDoc: AnimationDoc;
  moved: boolean;
  additive: boolean;
  path?: EditPath;
}

/** The preview card's main icon (the first module's), through the stage's shadow roots. */
export function findPreviewIcon(host: Element): HTMLElement | undefined {
  let n: Node | null = host;
  while (n) {
    if (n instanceof Element) {
      const card = n.shadowRoot?.querySelector('magic-card') ?? n.querySelector('magic-card');
      if (card) return card.shadowRoot?.querySelector<HTMLElement>('[data-mc-part="icon"]') ?? undefined;
      n = n.parentElement ?? (n.getRootNode() as ShadowRoot).host ?? null;
    } else n = (n as ShadowRoot).host ?? null;
  }
  return undefined;
}

function parseViewBox(vb: string | null | undefined): Box | undefined {
  const v = (vb ?? '').split(/[\s,]+/).map(Number);
  return v.length === 4 && v.every(Number.isFinite) && v[2] > 0 && v[3] > 0 ? (v as Box) : undefined;
}

@customElement('mc-anim-parts-overlay')
export class AnimPartsOverlay extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ attribute: false }) tile: PreviewTile = 'icon';
  @property({ attribute: false }) stage?: StageInfo;
  /** Hidden and locked parts cannot be picked on the stage. */
  @property({ attribute: false }) layerView?: LayerView;
  /** Tests / hosts without a stage: the icon element to sit on. */
  @property({ attribute: false }) iconEl?: HTMLElement;

  @state() private _box?: IconBox;
  @state() private _vb: Box = [0, 0, 24, 24];
  /** The overlay's display scale (screen px per card px). */
  @state() private _scale = 1;
  @state() private _hover?: TargetRef;
  @state() private _band?: [Pt, Pt];
  @state() private _geom?: IconGeometry;
  /** Pivot / path while dragged (shown before the transient doc comes back). */
  @state() private _live?: { ref: TargetRef; pivot?: Pt; path?: string };
  private _ref?: string;
  private _drag?: Drag;
  /** Keyboard pivot nudges: the document before the first of a repeat run (one undo step on key up). */
  private _nudge?: { ref: TargetRef; doc: AnimationDoc };
  private _ro?: ResizeObserver;
  private _watched = new WeakSet<Element>();

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._watched = new WeakSet();
      this._ro = new ResizeObserver(() => requestAnimationFrame(() => this._measure()));
      this._ro.observe(this);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  // ── geometry ──

  private get _pieces(): SplitPiece[] {
    return this._geom ? piecesOf(this._geom) : [];
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has('doc') || changed.has('tile')) && this.doc) {
      const ref = sourceIcon(this.doc, this.tile);
      if (ref !== this._ref) {
        this._ref = ref;
        this._geom = peekGeometry(ref);
        if (!this._geom)
          void loadGeometry(ref).then((g) => {
            if (this._ref === ref && g) this._geom = g;
          });
      }
    }
    // a drag feeds transient documents back: keep its live value until the drag ends
    if (changed.has('doc') && !this._drag) this._live = undefined;
  }

  protected updated(): void {
    // measure after layout (a state change from inside updated() would schedule a second update)
    requestAnimationFrame(() => this._measure());
  }

  private _icon(): HTMLElement | undefined {
    return this.iconEl ?? findPreviewIcon(this);
  }

  /** Where the icon is in our own px (and its viewBox). */
  private _measure(): void {
    if (!this.isConnected) return;
    const icon = this._icon();
    const host = this.getBoundingClientRect();
    const k = this.offsetWidth > 0 && host.width > 0 ? host.width / this.offsetWidth : 1;
    let box: IconBox | undefined;
    let vb: Box | undefined;
    // the icon and its card move without an update of ours (the rig arrives, the card relays out):
    // watch their sizes too
    for (const el of [icon, (icon?.getRootNode() as ShadowRoot | undefined)?.host]) {
      if (el && this._ro && !this._watched.has(el)) {
        this._watched.add(el);
        this._ro.observe(el);
      }
    }
    if (icon) {
      const svgEl = icon.shadowRoot?.querySelector('svg[part="svg"]');
      const r = (svgEl ?? icon).getBoundingClientRect();
      if (r.width > 0) box = { x: (r.left - host.left) / k, y: (r.top - host.top) / k, w: r.width / k, h: r.height / k };
      vb = parseViewBox(svgEl?.getAttribute('viewBox'));
    }
    if (!box && this.stage?.subject) {
      const s = this.stage.subject;
      box = { x: s.x, y: s.y, w: s.width, h: s.height };
    }
    vb ??= this.stage?.viewBox ?? parseViewBox(this._geom?.viewBox) ?? [0, 0, 24, 24];
    const same = (a?: IconBox, b?: IconBox) => !!a && !!b && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5;
    if (!same(box, this._box) && (box || this._box)) this._box = box;
    if (vb.join(' ') !== this._vb.join(' ')) this._vb = vb;
    // the display scale (the stage scales its frame to fit): measured, else the stage's
    const measured = this.offsetWidth > 0 && host.width > 0;
    const scale = measured ? k : this.stage && this.stage.scale > 0 ? this.stage.scale : 1;
    if (Math.abs(scale - this._scale) > 0.001) this._scale = scale;
  }

  /** Icon units per screen px (the box is in unscaled card px; the stage shows it at _scale). */
  private get _unit(): number {
    return this._box && this._box.w > 0 ? this._vb[2] / (this._box.w * (this._scale || 1)) : 0.1;
  }

  private _toVb(e: PointerEvent): Pt {
    const svgEl = this.renderRoot.querySelector('svg.ov');
    const r = svgEl?.getBoundingClientRect();
    if (!r || !r.width) return [0, 0];
    return [this._vb[0] + ((e.clientX - r.left) / r.width) * this._vb[2], this._vb[1] + ((e.clientY - r.top) / r.height) * this._vb[3]];
  }

  // ── selection ──

  /** Locked (directly, or through its group): no pivot or path handles, no grouping, not caught by the band. */
  private _lk(ref: TargetRef): boolean {
    return !!this.doc && !!this.layerView?.locked.length && isLocked(this.doc, this.layerView, ref);
  }

  private get _sel(): TargetRef[] {
    return selectedRefs(this.selection);
  }

  /** The top-level hit for a piece of a part: the part itself. */
  private _pick(ref: TargetRef, e: PointerEvent | KeyboardEvent): void {
    const sel = this._sel;
    if (e.shiftKey) emitSelection(this, targetSelection([...sel, ref], ref));
    else if (e.ctrlKey || e.metaKey) emitSelection(this, targetSelection(sel.includes(ref) ? sel.filter((r) => r !== ref) : [...sel, ref], ref));
    else emitSelection(this, targetSelection([ref], ref));
  }

  // ── pointer ──

  private _onDown(e: PointerEvent): void {
    if (this.disabled || e.button > 0 || !this.doc) return;
    const t = e.target as Element;
    const pivot = t.closest('[data-pivot]')?.getAttribute('data-pivot') as TargetRef | undefined;
    const anchor = t.closest('[data-anchor]')?.getAttribute('data-anchor');
    const hit = t.closest('[data-ref]')?.getAttribute('data-ref') as TargetRef | undefined;
    const p = this._toVb(e);
    const base: Drag = { pointerId: e.pointerId, kind: 'band', start: p, startClient: [e.clientX, e.clientY], startDoc: this.doc, moved: false, additive: e.shiftKey || e.ctrlKey || e.metaKey };
    if (pivot) {
      if (this._lk(pivot)) return;
      this._drag = { ...base, kind: 'pivot', ref: pivot };
    } else if (anchor !== undefined && anchor !== null && this.selection.target) {
      if (this._lk(this.selection.target)) return;
      const d = trackOf(this.doc, this.selection.target)?.path?.d;
      if (!d) return;
      this._drag = { ...base, kind: 'anchor', ref: this.selection.target, index: Number(anchor), path: parsePath(d) };
    } else if (hit) {
      this._pick(hit, e);
      return;
    } else this._drag = base;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }

  private _onMove(e: PointerEvent): void {
    const d = this._drag;
    if (!d) {
      const hit = (e.target as Element).closest?.('[data-ref]')?.getAttribute('data-ref') as TargetRef | undefined;
      if (hit !== this._hover) this._hover = hit;
      return;
    }
    if (e.pointerId !== d.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.startClient[0], e.clientY - d.startClient[1]) < DRAG_SLOP) return;
    d.moved = true;
    const p = this._toVb(e);
    const step = e.shiftKey ? 0 : 0.25;
    if (d.kind === 'band') this._band = [d.start, p];
    else if (d.kind === 'pivot' && d.ref) {
      const pivot: Pt = [snap(p[0], step), snap(p[1], step)];
      this._live = { ref: d.ref, pivot };
      emitDoc(this, setEffectivePivot(this.doc!, d.ref, pivot), 'Move pivot', true);
    } else if (d.kind === 'anchor' && d.ref && d.path && d.index !== undefined) {
      const o = this._pivotOf(d.ref) ?? [0, 0];
      const path = serializePath(moveAnchor(d.path, d.index, snap(p[0] - o[0], step), snap(p[1] - o[1], step)));
      this._live = { ref: d.ref, path };
      const track = trackOf(this.doc!, d.ref)!;
      emitDoc(this, setPartPath(this.doc!, d.ref, { ...track.path!, d: path }), 'Move path point', true);
    }
  }

  private _onUp(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    this._drag = undefined;
    const doc = this.doc!;
    const live = this._live;
    this._live = undefined;
    if (d.kind === 'band') {
      const band = this._band;
      this._band = undefined;
      if (!d.moved || !band) {
        if (!d.additive) emitSelection(this, { kind: 'none' });
        return;
      }
      const [a, b] = band;
      const x0 = Math.min(a[0], b[0]);
      const x1 = Math.max(a[0], b[0]);
      const y0 = Math.min(a[1], b[1]);
      const y1 = Math.max(a[1], b[1]);
      const hits = (doc.rig?.parts ?? [])
        .map((p) => partRef(p.id))
        .filter((ref) => !this._lk(ref))
        .filter((ref) => {
          const bx = targetBox(doc, ref, this._pieces);
          // fully inside the band (parts overlap a lot: touching would catch the whole icon)
          return !!bx && bx[0] >= x0 && bx[0] + bx[2] <= x1 && bx[1] >= y0 && bx[1] + bx[3] <= y1;
        });
      emitSelection(this, targetSelection(d.additive ? [...this._sel, ...hits] : hits));
      return;
    }
    if (!d.moved) return;
    if (d.kind === 'pivot' && d.ref && live?.pivot) emitDoc(this, setEffectivePivot(doc, d.ref, live.pivot), 'Move pivot');
    if (d.kind === 'anchor' && d.ref && live?.path) {
      const track = trackOf(doc, d.ref);
      if (track?.path) emitDoc(this, setPartPath(doc, d.ref, { ...track.path, d: live.path }), 'Move path point');
    }
  }

  /** The pointer was taken away (touch scroll, system gesture): a drag goes back to where it started. */
  private _onCancel(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    this._drag = undefined;
    this._band = undefined;
    this._live = undefined;
    // the start again, as a final change: the shell closes the gesture and leaves no undo step
    if (d.moved && d.kind !== 'band') emitDoc(this, d.startDoc, d.kind === 'pivot' ? t('anim-studio.parts-overlay.move-pivot') : t('anim-studio.parts-overlay.move-path-point'));
  }

  /** Arrow keys nudge the pivot; a held key repeats as transient moves, one undo step on key up. */
  private _onPivotKey(e: KeyboardEvent, ref: TargetRef): void {
    const dirs: Record<string, Pt> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const dir = dirs[e.key];
    if (!dir || this.disabled || !this.doc || this._lk(ref)) return;
    e.preventDefault();
    const step = e.shiftKey ? 1 : 0.25;
    const p = this._pivotOf(ref) ?? [12, 12];
    if (this._nudge?.ref !== ref) this._nudge = { ref, doc: this.doc };
    emitDoc(this, setEffectivePivot(this.doc, ref, [p[0] + dir[0] * step, p[1] + dir[1] * step]), 'Move pivot', true);
  }

  private _onKeyUp(e: KeyboardEvent): void {
    const n = this._nudge;
    if (!n || !e.key.startsWith('Arrow') || !this.doc) return;
    this._nudge = undefined;
    if (this.doc !== n.doc) emitDoc(this, this.doc, 'Move pivot');
  }

  private _onKey(e: KeyboardEvent): void {
    if (!this.doc || this.disabled) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
      if (this._sel.some((r) => this._lk(r))) return;
      const r = groupParts(this.doc, this._sel);
      if (!r.id) return;
      e.preventDefault();
      emitDoc(this, r.doc, 'Group parts');
      emitSelection(this, targetSelection([groupRef(r.id)]));
    } else if (e.key === 'Escape' && this._sel.length) {
      e.preventDefault();
      emitSelection(this, { kind: 'none' });
    }
  }

  private _pivotOf(ref: TargetRef): Pt | undefined {
    if (this._live?.ref === ref && this._live.pivot) return this._live.pivot;
    return this.doc ? (targetPivot(this.doc, ref, this._pieces, this._vb) as Pt | undefined) : undefined;
  }

  // ── render ──

  private _partPaths(ref: TargetRef): string[] {
    const d = this.doc!;
    const pieces = this._pieces;
    return partIdsOf(d, [ref]).flatMap((id) => (d.rig!.parts.find((p) => p.id === id)?.from ?? []).map((i) => pieces[i]?.d).filter((x): x is string => !!x));
  }

  private _selected(sel: TargetRef[], u: number): SVGTemplateResult[] {
    const d = this.doc!;
    return sel.flatMap((ref) => {
      if (!/^(part|group):/.test(ref)) return [];
      const b = targetBox(d, ref, this._pieces);
      const o = this._pivotOf(ref);
      const primary = ref === this.selection.target;
      const out: SVGTemplateResult[] = [];
      out.push(svg`${this._partPaths(ref).map((p) => svg`<path class="sel-outline" d=${p}></path>`)}`);
      if (b) out.push(svg`<rect class="bbox" x=${b[0]} y=${b[1]} width=${b[2]} height=${b[3]}></rect>`);
      if (o && primary && !this._lk(ref)) {
        const name = targetName(d, ref);
        out.push(svg`<g
          class="pivot"
          data-pivot=${ref}
          tabindex="0"
          role="slider"
          aria-label=${hasTrackPivot(d, ref) ? t('anim-studio.parts-overlay.preset-pivot-of-name', { name }) : t('anim-studio.parts-overlay.pivot-of-name', { name })}
          aria-valuetext=${`x ${o[0].toFixed(2)}, y ${o[1].toFixed(2)}`}
          @keydown=${(e: KeyboardEvent) => this._onPivotKey(e, ref)}
        >
          <circle class="pivot-hit" cx=${o[0]} cy=${o[1]} r=${HANDLE_R * u}></circle>
          <circle class="pivot-ring" cx=${o[0]} cy=${o[1]} r=${5 * u} style=${`stroke-width: ${2 * u}`}></circle>
          <path class="pivot-cross" d=${`M${o[0] - 9 * u} ${o[1]}H${o[0] + 9 * u}M${o[0]} ${o[1] - 9 * u}V${o[1] + 9 * u}`} style=${`stroke-width: ${1.5 * u}`}></path>
        </g>`);
      }
      return out;
    });
  }

  private _motionPath(u: number): SVGTemplateResult | typeof nothing {
    const ref = this.selection.target;
    if (!ref || !this.doc || !/^(part|group):/.test(ref)) return nothing;
    const d = this._live?.ref === ref && this._live.path ? this._live.path : trackOf(this.doc, ref)?.path?.d;
    const o = this._pivotOf(ref);
    if (!d || !o) return nothing;
    const ep = parsePath(d);
    return svg`<g class="mpath" transform=${`translate(${o[0]} ${o[1]})`}>
      <path class="mline" d=${d} style=${`stroke-width: ${2 * u}`}></path>
      ${this._lk(ref) ? nothing : ep.anchors.map(
        (a, i) => svg`<g class="anchor" data-anchor=${i}>
          <circle class="anchor-hit" cx=${a.x} cy=${a.y} r=${HANDLE_R * u}></circle>
          <circle class="anchor-dot" cx=${a.x} cy=${a.y} r=${4.5 * u} style=${`stroke-width: ${1.5 * u}`}></circle>
        </g>`,
      )}
    </g>`;
  }

  protected render(): TemplateResult {
    const d = this.doc;
    if (!d || !hasRig(d)) return html``;
    const box = this._box;
    const u = this._unit;
    const sel = this._sel;
    const lv = this.layerView;
    const hidden = lv ? resolveHidden(d, lv) : new Set<string>();
    const vb = this._vb;
    const band = this._band;
    const hover = this._hover && !sel.includes(this._hover) ? this._hover : undefined;
    // hit areas: every part (a group's members select themselves), later parts on top
    const hits = d.rig!.parts
      .map((p) => partRef(p.id))
      .filter((ref) => !hidden.has(ref) && !hidden.has(groupRef(groupOfPart(d.rig, ref.slice(5))?.id ?? '')) && !(lv && isLocked(d, lv, ref)))
      .map((ref) => svg`<g class="hit" data-ref=${ref}>${this._partPaths(ref).map((p) => svg`<path d=${p} style=${`stroke-width: ${8 * u}`}></path>`)}</g>`);
    return html`<div
      class="layer"
      @pointerdown=${this._onDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onUp}
      @pointercancel=${this._onCancel}
      @keyup=${this._onKeyUp}
      @pointerleave=${() => !this._drag && (this._hover = undefined)}
      @keydown=${this._onKey}
    >
      ${box
        ? html`<svg
            class="ov"
            viewBox=${vb.join(' ')}
            style=${`left: ${box.x}px; top: ${box.y}px; width: ${box.w}px; height: ${box.h}px`}
            role="group"
            aria-label=${t('anim-studio.parts-overlay.icon-parts-on-the-stage')}
          >
            ${hits}
            ${hover ? svg`${this._partPaths(hover).map((p) => svg`<path class="hover" d=${p} style=${`stroke-width: ${2 * u}`}></path>`)}` : nothing}
            <g style=${`--u: ${u}`}>${this._selected(sel, u)}</g>
            ${this._motionPath(u)}
            ${band
              ? svg`<rect class="band" x=${Math.min(band[0][0], band[1][0])} y=${Math.min(band[0][1], band[1][1])}
                  width=${Math.abs(band[1][0] - band[0][0])} height=${Math.abs(band[1][1] - band[0][1])} style=${`stroke-width: ${u}`}></rect>`
              : nothing}
          </svg>`
        : nothing}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    .layer {
      position: absolute;
      inset: 0;
    }
    svg.ov {
      position: absolute;
      overflow: visible;
    }
    .hit path {
      fill: transparent;
      stroke: transparent;
      cursor: pointer;
    }
    .hover {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      opacity: 0.7;
      vector-effect: non-scaling-stroke;
      stroke-width: 1.5px !important;
      pointer-events: none;
    }
    .sel-outline {
      fill: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .bbox {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1px;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .pivot {
      cursor: move;
      outline: none;
    }
    .pivot-hit {
      fill: transparent;
    }
    .pivot-ring {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-color, #03a9f4);
    }
    .pivot-cross {
      stroke: var(--primary-color, #03a9f4);
      pointer-events: none;
    }
    .pivot:focus-visible .pivot-ring {
      stroke: var(--primary-text-color, #212121);
    }
    .mline {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-dasharray: 3 2;
      vector-effect: non-scaling-stroke;
      stroke-width: 1.5px !important;
      pointer-events: none;
    }
    .anchor {
      cursor: grab;
    }
    .anchor-hit {
      fill: transparent;
    }
    .anchor-dot {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-color, #03a9f4);
    }
    .band {
      fill: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      stroke: var(--primary-color, #03a9f4);
      vector-effect: non-scaling-stroke;
      stroke-width: 1px !important;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .sel-outline,
      .bbox {
        transition: opacity 0.15s ease-out;
      }
    }
  `;
}

registerPanel({
  tag: 'mc-anim-parts-overlay',
  place: 'stage-tool',
  title: m('anim-studio.parts-overlay.icon-parts'),
  order: 20,
  when: (doc, sel) => doc.kind === 'keyframes' && hasRig(doc) && sel.kind !== 'tool',
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-parts-overlay': AnimPartsOverlay;
  }
}
