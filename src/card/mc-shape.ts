import { LitElement, html, nothing, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { DesignConfig, ShapeKind, ShapeOptions } from '../types';
import type { CustomShapeOptions, ShapeLookup } from '../contracts/custom-shape';
import { LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library.needs';
import type { LibraryChangedDetail, MagicCardUtilsWindow } from '../contracts/mcu-library';
import { parseShapeLength, shapePath } from '../utils/shape-path';
import { resolveCustomShape } from '../utils/shape-ref';
import { customShapesReady, loadCustomShapes } from '../utils/shape-custom-loader';
import { parseClosed, polygonCss } from '../path/core';
import { shapeRingPath } from '../utils/ring-path';
import type { ShapeStroke } from '../utils/css-utils';
import { offscreenObserver } from '../icons/offscreen';
import { borderBoxSize, unwatchSize, watchSize } from './mc-ring';
import { shapeLayerStyles } from './shape-css';

/*
 * Outline shapes on a module / row / column wrapper or the card (design `shape`, src/utils/shape-path.ts).
 * <mc-shape> sits inside the shaped element (aria-hidden, no layout, no pointer events) and, from the
 * element's rendered size (the ResizeObserver rings share):
 * - sets the element's `clip-path: path(...)` (a polygon where path() is unsupported): its
 *   background, content and hit area follow the shape;
 * - sets `--mc-shape-it / -ir / -ib / -il`, the shape's content inset, which the card's padding
 *   for shaped elements uses as a minimum (shapeElementStyle), so content stays inside the shape
 *   (the element's own padding, where it is more, lets the inset across be smaller; in a box taller
 *   than its content the content may move down to where the shape is wider);
 * - draws the border as an SVG stroke along the shape (the real border stays, transparent), masked
 *   to the border length windows; `--mc-shape-stroke` on the element overrides its colour (hover).
 * The element's inline style is the card's (Lit rewrites it on a change): the clip-path and vars
 * are written again when they go missing. Blob / wave `animate` morphs the clip (Web Animations)
 * and the stroke (SMIL) together; paused off-screen, off for reduced motion.
 */

const REDUCED = '(prefers-reduced-motion: reduce)';
const KINDS = new Set<ShapeKind>(['custom', 'squircle', 'hexagon', 'octagon', 'blob', 'wave', 'notch', 'ticket', 'pill', 'circle']);
const INSET_VARS = ['--mc-shape-it', '--mc-shape-ir', '--mc-shape-ib', '--mc-shape-il'] as const;
/** Wave animation: frames per period and the period; blob: seconds per morph cycle. */
const WAVE_FRAMES = 8;
const WAVE_PERIOD_S = 3;
const BLOB_CYCLE_S = 12;

export interface ResolvedShape {
  kind: ShapeKind;
  options?: ShapeOptions;
}

/**
 * The design's shape, or undefined for none / unknown (the element is not shaped at all). A custom
 * shape's `ref` is resolved here (library, then the card's inline copy), so everything downstream
 * (clip, stroke, rings, flows, decorations) reads the finished options. A custom shape whose builder
 * chunk is not loaded yet starts the load and is undefined (unshaped) meanwhile.
 */
export function resolveShape(design: Pick<DesignConfig, 'shape' | 'shape_options'> | undefined, lookup?: ShapeLookup): ResolvedShape | undefined {
  const kind = design?.shape;
  if (!kind || !KINDS.has(kind)) return undefined;
  // until the builder chunk is in, a custom shape renders as `none` (the card re-renders when it lands)
  if (kind === 'custom' && !customShapesReady()) {
    void loadCustomShapes();
    return undefined;
  }
  let o = design?.shape_options;
  if (kind === 'custom' && o && typeof o === 'object') o = resolveCustomShape(o, lookup);
  return o && typeof o === 'object' && Object.keys(o).length ? { kind, options: o } : { kind };
}

/** A saved shape of the provider's library (Magic Card Utils); undefined until it is ready and for unknown ids. */
export const libraryShape = (id: string): CustomShapeOptions | undefined =>
  (window as unknown as { magicCardUtils?: Partial<MagicCardUtilsWindow> }).magicCardUtils?.shapes?.get(id);

/** Call `cb` when the library's shapes change; returns the stop function. */
export function watchShapes(cb: () => void): () => void {
  const on = (e: Event) => (e as CustomEvent<LibraryChangedDetail>).detail?.kind === 'shapes' && cb();
  window.addEventListener(LIBRARY_CHANGED_EVENT, on);
  return () => window.removeEventListener(LIBRARY_CHANGED_EVENT, on);
}

let pathSupport: boolean | undefined;
/** `clip-path: path()` support (checked once). */
export function clipPathSupported(): boolean {
  if (pathSupport === undefined) {
    pathSupport = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ? CSS.supports('clip-path', 'path("M0 0")') : true;
  }
  return pathSupport;
}

/** Test hook: forget the clip-path path() support check. */
export function __resetClipPathSupport(value?: boolean): void {
  pathSupport = value;
}

/** The clip-path value of a shape path. */
export function shapeClip(d: string): string {
  if (clipPathSupported()) return `path('${d}')`;
  const o = parseClosed(d);
  return o ? polygonCss(o) : 'none';
}

type Side = 'top' | 'right' | 'bottom' | 'left';
type Pt = { x: number; y: number };

/** Keep the part of a convex polygon where `inside` holds (Sutherland-Hodgman, one half-plane). */
function clipPoly(poly: Pt[], inside: (p: Pt) => number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = inside(a);
    const fb = inside(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

/**
 * The border length mask of a w x h box: per drawn side, the part of the box nearest that side (split
 * at 45 degrees from the corners, like CSS border sides) inside the side's length window.
 */
export function strokeMaskPolygons(w: number, h: number, length: NonNullable<ShapeStroke['length']>): Pt[][] {
  const m = Math.min(w, h) / 2;
  const zones: Record<Side, Pt[]> = {
    top: [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w - m, y: m }, { x: m, y: m }],
    right: [{ x: w, y: 0 }, { x: w, y: h }, { x: w - m, y: h - m }, { x: w - m, y: m }],
    bottom: [{ x: w, y: h }, { x: 0, y: h }, { x: m, y: h - m }, { x: w - m, y: h - m }],
    left: [{ x: 0, y: h }, { x: 0, y: 0 }, { x: m, y: m }, { x: m, y: h - m }],
  };
  const f = length.align === 'start' ? 0 : length.align === 'end' ? 1 : 0.5;
  return length.sides.flatMap((side) => {
    const across = side === 'top' || side === 'bottom';
    const full = across ? w : h;
    const len = Math.min(full, parseShapeLength(length.value, full) ?? full);
    const a = (full - len) * f;
    const b = a + len;
    const axis = (p: Pt) => (across ? p.x : p.y);
    const poly = clipPoly(clipPoly(zones[side], (p) => axis(p) - a), (p) => b - axis(p));
    return poly.length >= 3 ? [poly] : [];
  });
}

const r2 = (n: number) => Math.round(n * 100) / 100;
let maskSeq = 0;

interface Box {
  w: number;
  h: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  /** Border stroke width (px). */
  bw: number;
  /** The element takes focus (an action): its focus ring is drawn along the shape. */
  focus: boolean;
  /** Where the content starts on each side whatever the shape's inset: border + own padding (px). */
  pad: [number, number, number, number];
  /** How far down the content can sit in a box taller than it (a min height), px from the edge; 0: none. */
  free: number;
}

/** The element holding the content and its padding: the element, or the card's content element. */
const paddedOf = (parent: HTMLElement): HTMLElement =>
  parent.tagName === 'HA-CARD' ? ((parent.querySelector(':scope > .mc-card-content') as HTMLElement | null) ?? parent) : parent;

/**
 * The element's own padding per side (top, right, bottom, left): the computed padding where it is
 * more than the shape's inset var (padding: max(own, var)), else 0 (unknown, at most the var).
 */
function ownPadding(parent: HTMLElement, el: HTMLElement): [number, number, number, number] {
  const cs = getComputedStyle(el);
  const pads = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => parseFloat(v) || 0);
  return INSET_VARS.map((v, i) => (pads[i] > (parseFloat(parent.style.getPropertyValue(v)) || 0) + 0.01 ? pads[i] : 0)) as [number, number, number, number];
}

/**
 * The height of the in-flow content of `el` (its children's layout boxes, transforms ignored), or
 * undefined when nothing has a size or the children are not laid out inside it. Undefined for a
 * content-box element too: its min height leaves no room inside the padding.
 */
function contentHeight(el: HTMLElement): number | undefined {
  if (getComputedStyle(el).boxSizing !== 'border-box') return undefined;
  let top = Infinity;
  let bottom = -Infinity;
  for (const c of el.children) {
    if (!(c instanceof HTMLElement) || c.tagName === 'MC-SHAPE' || !c.offsetHeight) continue;
    const pos = getComputedStyle(c).position;
    if (pos === 'absolute' || pos === 'fixed') continue;
    if (c.offsetParent !== el && c.offsetParent !== el.offsetParent) return undefined;
    const at = c.offsetParent === el ? c.offsetTop : c.offsetTop - el.offsetTop;
    top = Math.min(top, at);
    bottom = Math.max(bottom, at + c.offsetHeight);
  }
  return bottom > top ? bottom - top : undefined;
}

@customElement('mc-shape')
export class McShape extends LitElement {
  static styles = shapeLayerStyles;

  @property({ attribute: false, hasChanged: (a?: ResolvedShape, b?: ResolvedShape) => JSON.stringify(a) !== JSON.stringify(b) })
  shape?: ResolvedShape;

  @property({ attribute: false, hasChanged: (a?: ShapeStroke, b?: ShapeStroke) => JSON.stringify(a) !== JSON.stringify(b) })
  stroke?: ShapeStroke;

  /**
   * A band along the edge the content keeps clear of (seasonal decorations: px per side, top right
   * bottom left): the content rectangle grown by it lies inside the shape, so every content point is
   * at least that far inside.
   */
  @property({ attribute: false, hasChanged: (a?: readonly number[], b?: readonly number[]) => JSON.stringify(a) !== JSON.stringify(b) })
  edge?: readonly number[];

  /** Set by the shared off-screen observer while the shape animates. */
  @property({ type: Boolean, reflect: false }) offscreen = false;

  @state() private _box?: Box;

  private _parent?: HTMLElement;
  private _mutations?: MutationObserver;
  private _media?: MediaQueryList;
  private _onMedia = () => this.requestUpdate();
  /** What was written on the parent (as read back), to see when a re-render dropped it. */
  private _clip = '';
  private _insets: string[] = [];
  private _raf = 0;
  private _anim?: Animation;
  private _animKey = '';
  private _watching = false;
  /** The clip-path value last written (before the browser re-serialised it). */
  private _clipSource = '';
  private _maskId = `mc-shape-mask-${++maskSeq}`;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    this._observe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._media?.removeEventListener?.('change', this._onMedia);
    this._unobserve();
  }

  private _observe(): void {
    const parent = this.parentElement ?? undefined;
    if (!parent || parent === this._parent) return;
    this._unobserve();
    this._parent = parent;
    watchSize(parent, this);
    if (typeof MutationObserver === 'function') {
      this._mutations = new MutationObserver(() => this._restore());
      this._mutations.observe(parent, { attributes: true, attributeFilter: ['style', 'class', 'tabindex'] });
    }
    this.measure();
  }

  private _unobserve(): void {
    const parent = this._parent;
    this._stopAnimation();
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    this._mutations?.disconnect();
    this._mutations = undefined;
    if (!parent) return;
    unwatchSize(parent, this);
    // leave the element unshaped (the card drops the shape: its style no longer asks for it)
    if (this._clip && parent.style.getPropertyValue('clip-path') === this._clip) parent.style.removeProperty('clip-path');
    for (const v of INSET_VARS) parent.style.removeProperty(v);
    this._clip = '';
    this._insets = [];
    this._parent = undefined;
    this._box = undefined;
  }

  /** Read the parent's border box and border width; re-apply the clip when it changed. */
  measure(): void {
    const parent = this.parentElement;
    if (!parent || !this.shape) return;
    const cs = getComputedStyle(parent);
    const px = /^\s*([\d.]+)px\s*$/.exec(this.stroke?.width ?? '');
    const { w, h } = borderBoxSize(parent);
    const top = parseFloat(cs.borderTopWidth) || 0;
    const left = parseFloat(cs.borderLeftWidth) || 0;
    const right = parseFloat(cs.borderRightWidth) || 0;
    const bottom = parseFloat(cs.borderBottomWidth) || 0;
    const padded = paddedOf(parent);
    const own = ownPadding(parent, padded);
    // a box taller than its content (a min height) has room to move the content down to where the
    // shape is wider: up to the middle, at most a quarter of the height. 1 px less than that room, so
    // once the box is sized by its content again the room closes, a pixel per frame
    const ch = contentHeight(padded);
    const free = ch === undefined ? 0 : Math.max(0, Math.min(h / 4, (h - ch) / 2 - 1));
    const box: Box = {
      w,
      h,
      top,
      left,
      right,
      bottom,
      bw: this.stroke ? (px ? parseFloat(px[1]) : top) : 0,
      focus: parent.hasAttribute('tabindex'),
      pad: [top + own[0], right + own[1], bottom + own[2], left + own[3]],
      free,
    };
    if (JSON.stringify(box) !== JSON.stringify(this._box)) this._box = box;
    this._apply(false);
  }

  /** A re-render rewrote the parent's style: put the clip and insets back (same values). */
  private _restore(): void {
    const parent = this._parent;
    if (!parent) return;
    const lost = parent.style.getPropertyValue('clip-path') !== this._clip || INSET_VARS.some((v, i) => parent.style.getPropertyValue(v) !== (this._insets[i] ?? ''));
    if (lost) this._apply(true);
    this.measure();
    this._mutations?.takeRecords();
  }

  /**
   * Write the clip-path now and the inset vars (they change the padding, so the size: a frame later,
   * not inside the ResizeObserver callback) unless `now`.
   */
  private _apply(now: boolean): void {
    const parent = this._parent;
    const b = this._box;
    if (!parent || !b || !this.shape) return;
    const { kind, options } = this.shape;
    // the content rectangle grown by the edge band (e) inside the shape: the inset for where that
    // starts, plus the band
    const e = [0, 1, 2, 3].map((i) => Math.max(0, Number(this.edge?.[i]) || 0));
    const inset = (top: number, right: number, bottom: number, left: number) => {
      const r = shapePath(kind, b.w, b.h, options, { top: top - e[0], right: right - e[1], bottom: bottom - e[2], left: left - e[3] });
      return r && { d: r.d, inset: { top: r.inset.top + e[0], right: r.inset.right + e[1], bottom: r.inset.bottom + e[2], left: r.inset.left + e[3] } };
    };
    const [top, right, bottom, left] = b.pad;
    const own = inset(top, right, bottom, left);
    // the content moved down into a min height's room (free), where that narrows the inset across
    const deep = b.free > Math.min(top, bottom) ? inset(Math.max(top, b.free), right, Math.max(bottom, b.free), left) : undefined;
    const across = (r: typeof own) => (r ? Math.ceil(r.inset.left) + Math.ceil(r.inset.right) : Infinity);
    const lower = !!deep && across(deep) < across(own);
    const res = lower ? deep : own;
    if (!res) return;
    const down = lower ? b.free : 0;
    const clip = shapeClip(res.d);
    if (parent.style.getPropertyValue('clip-path') !== this._clip || this._clipSource !== clip) {
      parent.style.setProperty('clip-path', clip);
      this._clip = parent.style.getPropertyValue('clip-path');
      this._clipSource = clip;
    }
    // the padding starts inside the border: the inset less the border on that side
    const borders = [b.top, b.right, b.bottom, b.left];
    const insets = [Math.max(res.inset.top, down), res.inset.right, Math.max(res.inset.bottom, down), res.inset.left].map(
      (n, i) => `${Math.max(0, Math.ceil(n - borders[i] - 1e-6))}px`,
    );
    const write = () => {
      this._raf = 0;
      const p = this._parent;
      if (!p) return;
      INSET_VARS.forEach((v, i) => {
        if (p.style.getPropertyValue(v) !== insets[i]) p.style.setProperty(v, insets[i]);
      });
      this._insets = INSET_VARS.map((v) => p.style.getPropertyValue(v));
      this._mutations?.takeRecords();
      // the padding moved the border box (the shared observer watches the content box): measure
      // again; a size-dependent inset settles over a few frames
      this.measure();
    };
    const missing = INSET_VARS.some((v, i) => parent.style.getPropertyValue(v) !== insets[i]);
    if (!missing) return;
    if (now || typeof requestAnimationFrame !== 'function') write();
    else if (!this._raf) this._raf = requestAnimationFrame(write);
    else {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(write);
    }
    this._mutations?.takeRecords();
  }

  /** The blob / wave animation frames of this size (undefined: not animated). */
  private _frames(b: Box, inset = 0): string[] | undefined {
    const s = this.shape;
    if (!s?.options?.animate || (s.kind !== 'blob' && s.kind !== 'wave') || this._media?.matches) return undefined;
    const w = b.w - 2 * inset;
    const h = b.h - 2 * inset;
    if (!(w > 0 && h > 0)) return undefined;
    const o = s.options;
    if (s.kind === 'wave') {
      return Array.from({ length: WAVE_FRAMES + 1 }, (_, i) => shapePath('wave', w, h, { ...o, phase: i / WAVE_FRAMES })?.d ?? '');
    }
    const n = Number(o.seed ?? 7);
    // the same blob comes back: seed, seed + 1, seed + 2, seed (same commands every frame)
    const seedOf = (k: number) => (Number.isFinite(n) ? n + k : k ? `${o.seed}-${k}` : o.seed);
    return [0, 1, 2, 0].map((k) => shapePath('blob', w, h, { ...o, seed: seedOf(k) })?.d ?? '');
  }

  private _duration(): number {
    return (this.shape?.kind === 'wave' ? WAVE_PERIOD_S : BLOB_CYCLE_S) * 1000;
  }

  private _stopAnimation(): void {
    this._anim?.cancel();
    this._anim = undefined;
    this._animKey = '';
    if (this._watching) offscreenObserver()?.unobserve(this);
    this._watching = false;
  }

  /** Start / stop / pause the clip animation for the current size, motion setting and visibility. */
  private _syncAnimation(): void {
    const parent = this._parent;
    const b = this._box;
    const frames = b ? this._frames(b) : undefined;
    if (!parent || !frames || typeof parent.animate !== 'function') {
      this._stopAnimation();
      return;
    }
    const key = frames.join('|');
    if (key !== this._animKey) {
      this._anim?.cancel();
      this._animKey = key;
      this._anim = parent.animate(
        frames.map((d) => ({ clipPath: shapeClip(d) })),
        { duration: this._duration(), iterations: Infinity, easing: this.shape?.kind === 'blob' ? 'ease-in-out' : 'linear' },
      );
    }
    if (!this._watching) {
      offscreenObserver()?.observe(this);
      this._watching = true;
    }
    if (this.offscreen) this._anim?.pause();
    else this._anim?.play();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    // moved to another element by a re-render: follow it
    this._observe();
    if (changed.has('shape') || changed.has('stroke') || changed.has('edge')) this.measure();
    this._syncAnimation();
    const svgEl = this.renderRoot.querySelector('svg');
    if (svgEl && typeof (svgEl as SVGSVGElement).pauseAnimations === 'function') {
      if (this.offscreen) (svgEl as SVGSVGElement).pauseAnimations();
      else (svgEl as SVGSVGElement).unpauseAnimations();
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const b = this._box;
    const shape = this.shape;
    if (!b || !shape) return nothing;
    const border = this._renderStroke(b, shape);
    // a focusable element's outline would be clipped: a focus ring along the shape instead, coloured
    // by --mc-shape-focus while the element has keyboard focus
    const fd = b.focus ? shapeRingPath(shape.kind, b.w, b.h, shape.options, { inset: 1 }) : '';
    if (!border && !fd) return nothing;
    const box = `top: ${-b.top}px; left: ${-b.left}px; width: ${b.w}px; height: ${b.h}px`;
    return html`<svg style=${box} viewBox="0 0 ${b.w} ${b.h}" preserveAspectRatio="none" focusable="false">
      ${border ?? nothing}${fd ? svg`<path class="focus" d=${fd} style="stroke: var(--mc-shape-focus, transparent); stroke-width: 2px"></path>` : nothing}
    </svg>`;
  }

  /** The border stroke along the shape (masked to the border length), or undefined without one. */
  private _renderStroke(b: Box, shape: ResolvedShape): TemplateResult | undefined {
    const s = this.stroke;
    if (!s || !(b.bw > 0)) return undefined;
    const bw = b.bw;
    const d = shapeRingPath(shape.kind, b.w, b.h, shape.options, { inset: bw / 2 });
    if (!d) return undefined;
    const dash = s.style === 'dashed' ? `${r2(bw * 3)} ${r2(bw * 2)}` : s.style === 'dotted' ? `0 ${r2(bw * 2)}` : 'none';
    const style = `stroke: var(--mc-shape-stroke, ${s.color}); stroke-width: ${bw}px; stroke-dasharray: ${dash}; stroke-linecap: ${s.style === 'dotted' ? 'round' : 'butt'}`;
    const polys = s.length ? strokeMaskPolygons(b.w, b.h, s.length) : undefined;
    // animated: the stroke morphs with the clip (frames of the inset outline, moved by half the stroke)
    const frames = this._frames(b, bw / 2);
    return svg`${polys
        ? svg`<mask id=${this._maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${b.w} height=${b.h}>${polys.map(
            (p) => svg`<polygon points=${p.map((q) => `${r2(q.x)},${r2(q.y)}`).join(' ')} fill="#fff"></polygon>`,
          )}</mask>`
        : nothing}
      ${frames
        ? svg`<g mask=${polys ? `url(#${this._maskId})` : nothing}><g transform="translate(${r2(bw / 2)} ${r2(bw / 2)})">
            <path class="stroke" d=${frames[0]} style=${style}><animate attributeName="d" values=${frames.join(';')}
              dur="${this._duration() / 1000}s" repeatCount="indefinite" calcMode=${shape.kind === 'blob' ? 'spline' : 'linear'}
              keySplines=${shape.kind === 'blob' ? frames.slice(1).map(() => '0.42 0 0.58 1').join(';') : nothing}></animate></path>
          </g></g>`
        : svg`<path class="stroke" d=${d} style=${style} mask=${polys ? `url(#${this._maskId})` : nothing}></path>`}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-shape': McShape;
  }
}
