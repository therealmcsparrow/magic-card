import { LitElement, html, nothing, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  FLOW_QUALITY_THRESHOLDS,
  FLOW_SPIN_SHAPES,
  type FlowBudget,
  type FlowLookQuality,
  type FlowLookResolved,
  type FlowMotionSupport,
  type FlowWithLook,
} from '../contracts/flow-look';
import type { ResolvedFlow } from '../utils/flow';
import { anchorSides, flowPath, spreadAnchors, type FlowGeometry, type Point, type Rect } from '../utils/flow-geometry';
import { travelFrames } from '../utils/flow-motion';
import { pauseOffscreen, unwatchOffscreen, watchOffscreen } from '../icons/offscreen';
import { flowLookSlot } from './flow-look-slot';
import { flowsOverlayStyles } from './flows-css';

const REDUCED = '(prefers-reduced-motion: reduce)';
/** Most moving elements one card animates at once (each moving flow keeps at least one). */
const MAX_CARD_DOTS = 40;

/**
 * Tier H (flow-look 1.0.0 r2): the heavy flows among all of the card's resolved flows, visible or
 * not. A tube or neon line counts 1, a zigzag with electric 0.5. full up to 3, lite up to 6, else
 * minimal. Deterministic: no frame-time probe.
 */
export function pickFlowQuality(flows: ReadonlyArray<{ look?: Pick<FlowLookResolved, 'line' | 'electric'> }>): FlowLookQuality {
  let h = 0;
  for (const { look } of flows) {
    if (!look) continue;
    if (look.line === 'tube' || look.line === 'neon') h += 1;
    else if (look.line === 'zigzag' && look.electric) h += 0.5;
  }
  return h > FLOW_QUALITY_THRESHOLDS.minimal ? 'minimal' : h > FLOW_QUALITY_THRESHOLDS.lite ? 'lite' : 'full';
}

/**
 * The card budget: `n` moving elements per flow (after the tier caps), `weight` 2 for flows whose
 * shapes spin (spike S1: spin is the dearest variant), 1 otherwise. Over the cap every moving flow is
 * scaled to floor(n * max / total) with total = sum of n x weight, at least 1; idle flows stay 0.
 */
export function allocateBudget(items: ReadonlyArray<{ id: string; n: number; weight: number }>, max = MAX_CARD_DOTS): Map<string, number> {
  const total = items.reduce((s, { n, weight }) => s + n * weight, 0);
  const out = new Map<string, number>();
  for (const { id, n } of items) out.set(id, total > max && n > 0 ? Math.max(1, Math.floor((n * max) / total)) : n);
  return out;
}

/** Spinning shapes weigh 2 in the budget. */
const spinWeight = (look: FlowLookResolved): number =>
  look.spin && (FLOW_SPIN_SHAPES.includes(look.shape) || (!!look.alternate && FLOW_SPIN_SHAPES.includes(look.alternate))) ? 2 : 1;

/** Same flows (a card render makes new objects every time). */
function sameFlows(a?: ResolvedFlow[], b?: ResolvedFlow[]): boolean {
  if (a === b) return true;
  return !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
}

/** Label size cache: entries kept, and the key (digits are equal width: tabular-nums). */
const MAX_LABEL_SIZES = 200;
const labelKey = (text: string) => text.replace(/\d/g, '0');
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Events (captured on the content) after which modules may have moved without a resize. */
const LAYOUT_EVENTS = ['scroll', 'transitionend', 'animationend'] as const;

/** The parent element, across a shadow root boundary. */
function parentOf(el: Element): HTMLElement | null {
  const p = el.parentElement ?? (el.getRootNode() as ShadowRoot).host ?? null;
  return p instanceof HTMLElement ? p : null;
}

/** Clear room kept around a label (px). */
const LABEL_MARGIN = 2;
/** Gap between a label beside the line and the line's edge (px). */
const LABEL_GAP = 4;

/** The arrowhead's size (reduced motion) for a line of `width`. */
const arrowSize = (width: number) => Math.max(8, width * 3);

/**
 * Where a flow's label goes (its centre, content px), or undefined to hide it. `auto`: on the line
 * when the stretch around `mid` leaves room (its length minus 2 x (arrowhead + 6) holds the label
 * plus 16 px), else beside the line (above a horizontal line, right of a vertical one), else on the
 * other side; a spot is taken only when the label (+2 px) misses the modules, the labels already
 * placed and the content's edges. Nothing fits: hidden. `line` / `side`: always there.
 */
export function placeLabel(
  geo: FlowGeometry,
  size: { w: number; h: number },
  opts: { position: 'auto' | 'line' | 'side' | 'hidden'; width: number; arrow: number; obstacles: Rect[]; bounds?: { w: number; h: number } },
): Point | undefined {
  const { position, width, arrow, obstacles, bounds } = opts;
  if (position === 'hidden') return undefined;
  const { mid, tangent: t } = geo;
  if (position === 'line') return mid;
  const box = (c: Point): Rect => ({
    x: c.x - size.w / 2 - LABEL_MARGIN,
    y: c.y - size.h / 2 - LABEL_MARGIN,
    w: size.w + 2 * LABEL_MARGIN,
    h: size.h + 2 * LABEL_MARGIN,
  });
  const free = (c: Point) => {
    const b = box(c);
    if (bounds && (b.x < 0 || b.y < 0 || b.x + b.w > bounds.w || b.y + b.h > bounds.h)) return false;
    return !obstacles.some((o) => intersect(b, o));
  };
  const candidates: Point[] = [];
  const along = Math.abs(t.x) * size.w + Math.abs(t.y) * size.h;
  if (position === 'auto' && geo.run - 2 * (arrow + 6) >= along + 16) candidates.push(mid);
  // beside: above a (mostly) horizontal line, right of a (mostly) vertical one
  let n = { x: -t.y, y: t.x };
  if (Math.abs(t.x) >= Math.abs(t.y) ? n.y > 0 : n.x < 0) n = { x: -n.x, y: -n.y };
  const off = (Math.abs(n.x) * size.w + Math.abs(n.y) * size.h) / 2 + width / 2 + LABEL_GAP;
  const side = { x: mid.x + n.x * off, y: mid.y + n.y * off };
  candidates.push(side, { x: mid.x - n.x * off, y: mid.y - n.y * off });
  const spot = candidates.find(free);
  return spot ?? (position === 'side' ? side : undefined);
}

/** The overlap of two rects; undefined when they don't overlap. */
function intersect(a: Rect, b: Rect): Rect | undefined {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const w = Math.min(a.x + a.w, b.x + b.w) - x;
  const h = Math.min(a.y + a.h, b.y + b.h) - y;
  return w > 0 && h > 0 ? { x, y, w, h } : undefined;
}

/**
 * An endpoint's layout box (content px) without its own transform: a module animation or the tap
 * scale must not make the lines jitter. Its parent's screen box (all the ancestors' transforms
 * included: a slider's translate, the studio scale) + the element's layout offset inside the parent
 * (offsetLeft / offsetTop, minus the parent's scroll). Falls back to the element's screen box when
 * the offsets can't be related (no offsetParent: jsdom, display: contents parents, other trees).
 */
function layoutBox(el: HTMLElement, fromScreen: (r: DOMRect) => Rect, sx: number, sy: number): Rect | undefined {
  const op = el.offsetParent;
  const parent = el.parentElement;
  if (op && parent && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
    let dx: number | undefined;
    let dy: number | undefined;
    if (parent === op) {
      dx = parent.clientLeft + el.offsetLeft;
      dy = parent.clientTop + el.offsetTop;
    } else if (parent.offsetParent === op) {
      dx = el.offsetLeft - parent.offsetLeft;
      dy = el.offsetTop - parent.offsetTop;
    }
    const pr = parent.getBoundingClientRect();
    if (dx !== undefined && dy !== undefined && parent.offsetWidth > 0 && parent.offsetHeight > 0) {
      // parent layout px -> content layout px (an ancestor between them may scale)
      const kx = pr.width / parent.offsetWidth / sx;
      const ky = pr.height / parent.offsetHeight / sy;
      const p = fromScreen(pr);
      return {
        x: p.x + (dx - parent.scrollLeft) * kx,
        y: p.y + (dy - parent.scrollTop) * ky,
        w: el.offsetWidth * kx,
        h: el.offsetHeight * ky,
      };
    }
  }
  const r = el.getBoundingClientRect();
  return fromScreen(r);
}

/**
 * Flow lines of a card: one overlay over the card content (`inset: 0`, aria-hidden, never takes
 * pointer events) with a back SVG layer (behind module content), a front one and the labels.
 *
 * Module rects are measured relative to the card content box (screen px divided by any ancestor
 * transform scale, like the studio frames), by `data-mc-id`. Measuring happens when the content or
 * an endpoint resizes (one ResizeObserver per overlay, measured right in its callback so the lines
 * move in the same frame) or the content subtree changes (MutationObserver, batched per frame), and
 * the overlay only re-renders when a rect really changed. A flow whose endpoint is not rendered,
 * has no size or lies outside the content is not drawn.
 *
 * Motion is CSS only: dots play transform keyframes sampled from the line (compositor animations: no
 * main-thread work per frame; staggered negative delays, reverse direction), or a
 * dashed stroke moves (`dots: 0`, or no offset-path support). Reduced motion: a static line with an
 * arrowhead in the flow direction. Off-screen overlays pause (src/icons/offscreen.ts).
 */
@customElement('mc-flows')
export class McFlows extends LitElement {
  static styles = flowsOverlayStyles;

  /** Resolved flows (labels already rendered by the card). */
  @property({ attribute: false, hasChanged: (a?: ResolvedFlow[], b?: ResolvedFlow[]) => !sameFlows(a, b) })
  flows: ResolvedFlow[] = [];

  /** HA dark mode: the track under the dots is lighter there. */
  @property({ type: Boolean, reflect: true }) dark = false;

  /** Studio canvas: key of the selected flow, drawn with a highlight halo under its line. */
  @property({ attribute: false }) selected?: string | null;

  /**
   * Studio canvas: key of the drawn flow whose line passes within `tolerance` screen px of a client
   * point (the closest one), for selecting a flow by clicking its line.
   */
  flowAt(x: number, y: number, tolerance = 8): string | undefined {
    let best: { key: string; d: number } | undefined;
    for (const g of this.renderRoot.querySelectorAll<SVGGElement>('g.flow')) {
      const line = g.querySelector<SVGPathElement>('path.line');
      const ctm = line?.getScreenCTM?.();
      if (!line || !ctm || typeof line.getTotalLength !== 'function') continue;
      const p = new DOMPoint(x, y).matrixTransform(ctm.inverse());
      const scale = Math.hypot(ctm.a, ctm.b) || 1;
      const len = line.getTotalLength();
      for (let at = 0; at <= len; at += 2) {
        const q = line.getPointAtLength(at);
        const d = Math.hypot(q.x - p.x, q.y - p.y) * scale;
        if (d <= tolerance && (!best || d < best.d)) best = { key: g.dataset.flow ?? '', d };
      }
    }
    return best?.key || undefined;
  }

  private _rects = new Map<string, Rect>();
  private _rectKey = '';
  /** The drawn flows' endpoints at the last measure from updated(). */
  private _endsKey = '';
  /** The content's layout size (labels stay inside it). */
  private _bounds?: { w: number; h: number };
  /**
   * offset-path on SVG circles, checked once in this browser's layout (some WebViews accept the
   * property but don't move SVG elements): undefined = not known yet, false = draw dashes.
   */
  private _offsetPathWorks?: boolean;
  /** offset-rotate: auto turns SVG elements here (second probe); false -> SMIL animateMotion for turning shapes. */
  private _rotationWorks?: boolean;
  /** A look flow was drawn by the last render (the probe also runs for them). */
  private _lookDrawn = false;
  /** The last render drew look flows with SMIL motion: pause / unpause them with the page and the viewport. */
  private _smil = false;
  /** The layer SVGs watched for off-screen changes (SMIL ignores animation-play-state). */
  private _smilWatched = new Set<Element>();

  /** Per flow, after each render: moving elements wanted, drawn after the card budget, and the card's tier. */
  budget: FlowBudget = new Map();
  /**
   * Rendered label sizes by text shape (measured once, after their first render): digits are
   * normalised (labels use tabular-nums, so a new value of the same shape has the same size) and
   * the cache is capped (oldest dropped first).
   */
  private _labelSizes = new Map<string, { w: number; h: number }>();
  private _onFonts = () => {
    this._labelSizes.clear();
    this.requestUpdate();
    this._schedule();
  };
  private _ro?: ResizeObserver;
  private _mo?: MutationObserver;
  private _observed = new Set<Element>();
  private _content?: HTMLElement;
  private _raf = 0;
  private _media?: MediaQueryList;
  private _onMedia = () => this.requestUpdate();
  private _schedule = () => {
    if (this._raf || !this.isConnected) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this.measure();
    });
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    this._watch();
    document.fonts?.addEventListener?.('loadingdone', this._onFonts);
    document.fonts?.ready?.then(this._onFonts, () => undefined);
    this.toggleAttribute('page-hidden', document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', this._onVisibility);
    if (this.hasUpdated) this._watchSmil();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._media?.removeEventListener?.('change', this._onMedia);
    document.fonts?.removeEventListener?.('loadingdone', this._onFonts);
    this._unwatch();
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    document.removeEventListener('visibilitychange', this._onVisibility);
    for (const el of this._smilWatched) unwatchOffscreen(el);
    this._smilWatched.clear();
  }

  /** page-hidden on the host: the CSS pauses classic dots and dashes, the chunk's css its animations. */
  private _onVisibility = () => {
    this.toggleAttribute('page-hidden', document.visibilityState === 'hidden');
    this._syncSmil();
  };

  /** Watch the layer SVGs through the shared offscreen observer (no observer of our own). */
  private _watchSmil(): void {
    if (!this._smil) return;
    for (const el of this.renderRoot.querySelectorAll('svg')) {
      if (this._smilWatched.has(el)) continue;
      if (watchOffscreen(el, this._syncSmil)) this._smilWatched.add(el);
    }
  }

  /** SMIL ignores animation-play-state: pause the timeline of each layer SVG while off-screen or page-hidden. */
  private _syncSmil = (): void => {
    if (!this._smil) return;
    const hidden = this.hasAttribute('page-hidden');
    for (const el of this.renderRoot.querySelectorAll('svg')) {
      if (hidden || el.hasAttribute('offscreen')) el.pauseAnimations?.();
      else el.unpauseAnimations?.();
    }
  };

  /** Watch the overlay's card content; true when it is a new one. */
  private _watch(): boolean {
    const content = this.parentElement ?? undefined;
    if (!content || content === this._content) return false;
    this._unwatch();
    this._content = content;
    if (typeof ResizeObserver === 'function') {
      this._ro = new ResizeObserver(() => this.measure());
      this._ro.observe(content);
    }
    // scrolled containers, slider transitions and animations that end move modules without a resize
    for (const type of LAYOUT_EVENTS) content.addEventListener(type, this._schedule, { capture: true, passive: true });
    if (typeof MutationObserver === 'function') {
      this._mo = new MutationObserver(this._schedule);
      this._mo.observe(content, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden', 'data-mc-hidden'],
      });
    }
    return true;
  }

  private _unwatch(): void {
    for (const type of LAYOUT_EVENTS) this._content?.removeEventListener(type, this._schedule, { capture: true });
    this._ro?.disconnect();
    this._mo?.disconnect();
    this._ro = undefined;
    this._mo = undefined;
    this._observed.clear();
    this._content = undefined;
    this._endsKey = '';
  }

  /**
   * Probe, once per browser, in the layout: offset-path on an SVG circle must land at the end of its
   * 100 px path (else nothing travels), and (look flows only) offset-rotate: auto on a 20 x 4 rect
   * at the end of a vertical 100 px path must measure about 4 wide and 20 tall (else turning shapes
   * move by SMIL). Both run in one pass.
   */
  private _probeOffsetPath(): void {
    const host = this.renderRoot.querySelector('svg.back');
    if (!host) return;
    const wantPath = this._offsetPathWorks === undefined && (this._lookDrawn || !!this.renderRoot.querySelector('circle.dot'));
    const wantRot = this._lookDrawn && this._offsetPathWorks !== false && this._rotationWorks === undefined;
    if (!wantPath && !wantRot) return;
    const ns = 'http://www.w3.org/2000/svg';
    let c: SVGElement | undefined;
    let r: SVGElement | undefined;
    if (wantPath) {
      c = document.createElementNS(ns, 'circle');
      c.setAttribute('class', 'probe');
      c.setAttribute('r', '1');
      c.setAttribute('style', "offset-path: path('M 0 0 L 100 0'); offset-distance: 100%; offset-rotate: 0deg; visibility: hidden");
      host.append(c);
    }
    if (wantRot) {
      r = document.createElementNS(ns, 'rect');
      r.setAttribute('class', 'probe');
      r.setAttribute('width', '20');
      r.setAttribute('height', '4');
      r.setAttribute('style', "offset-path: path('M 0 0 L 0 100'); offset-distance: 100%; offset-rotate: auto; visibility: hidden");
      host.append(r);
    }
    const cb = c?.getBoundingClientRect();
    const rb = r?.getBoundingClientRect();
    const s = host.getBoundingClientRect();
    c?.remove();
    r?.remove();
    // not laid out (hidden card, test DOM): ask again next time
    if (!(s.width > 0) || (cb && !(cb.width > 0)) || (rb && !(rb.width > 0 && rb.height > 0))) return;
    const scale = host instanceof SVGSVGElement && host.clientWidth > 0 ? s.width / host.clientWidth : 1;
    if (cb) this._offsetPathWorks = cb.left + cb.width / 2 - s.left > 50 * scale;
    if (rb && this._offsetPathWorks) this._rotationWorks = rb.width < rb.height;
    if (!this._offsetPathWorks || this._rotationWorks === false) this.requestUpdate();
  }

  protected updated(): void {
    this._probeOffsetPath();
    // the card may have moved the overlay; new flows may name other endpoints (a value / colour
    // update alone moves nothing: the observers cover layout changes)
    const moved = this._watch();
    const ends = JSON.stringify((this.flows ?? []).filter((f) => f.visible).map((f) => [f.from, f.to]));
    if (moved || ends !== this._endsKey) {
      this._endsKey = ends;
      this.measure();
    }
    // labels rendered for measuring: their size, then place them
    let measured = false;
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>('.label[data-measure]')) {
      const key = labelKey(el.dataset.measure ?? '');
      if (this._labelSizes.has(key)) continue;
      if (this._labelSizes.size >= MAX_LABEL_SIZES) this._labelSizes.delete(this._labelSizes.keys().next().value!);
      this._labelSizes.set(key, { w: el.offsetWidth, h: el.offsetHeight });
      measured = true;
    }
    if (measured) this.requestUpdate();
    this._watchSmil();
    this._syncSmil();
  }

  /** Read the endpoint rects; re-render only when one changed. */
  measure(): void {
    const content = this._content;
    if (!content) return;
    const ids = new Set<string>();
    for (const f of this.flows ?? []) {
      if (f.visible) ids.add(f.from).add(f.to);
    }
    const els = new Map<string, HTMLElement>();
    // every module wrapper and column is observed too: any module changing size (an endpoint or a
    // neighbour pushing it) can move an endpoint without resizing the content box
    const watch = new Set<Element>();
    if (ids.size) {
      for (const el of content.querySelectorAll<HTMLElement>('[data-mc-id], .mc-column')) {
        watch.add(el);
        const id = el.dataset.mcId;
        if (id && ids.has(id) && !els.has(id)) els.set(id, el);
      }
    }
    for (const el of [...this._observed]) {
      if (!watch.has(el)) {
        this._ro?.unobserve(el);
        this._observed.delete(el);
      }
    }
    for (const el of watch) {
      if (!this._observed.has(el)) {
        this._ro?.observe(el);
        this._observed.add(el);
      }
    }

    const cr = content.getBoundingClientRect();
    // screen px -> the content's own layout px (an ancestor transform scales the screen rects)
    const sx = content.offsetWidth > 0 && cr.width > 0 ? cr.width / content.offsetWidth : 1;
    const sy = content.offsetHeight > 0 && cr.height > 0 ? cr.height / content.offsetHeight : 1;
    const cw = content.offsetWidth || cr.width;
    const ch = content.offsetHeight || cr.height;
    /** An element's screen box -> content layout px. */
    const fromScreen = (r: DOMRect): Rect => ({
      x: (r.left - cr.left) / sx - content.clientLeft,
      y: (r.top - cr.top) / sy - content.clientTop,
      w: r.width / sx,
      h: r.height / sy,
    });
    // the clip box (padding box, content px) of every clipping ancestor met this pass
    const clips = new Map<Element, Rect | null>();
    const clipOf = (a: HTMLElement): Rect | null => {
      let c = clips.get(a);
      if (c !== undefined) return c;
      const cs = getComputedStyle(a);
      c = null;
      if ([cs.overflowX, cs.overflowY, cs.overflow].some((v) => v && v !== 'visible')) {
        const b = fromScreen(a.getBoundingClientRect());
        const kx = a.offsetWidth > 0 ? b.w / a.offsetWidth : 1;
        const ky = a.offsetHeight > 0 ? b.h / a.offsetHeight : 1;
        c = {
          x: b.x + a.clientLeft * kx,
          y: b.y + a.clientTop * ky,
          w: a.clientWidth > 0 ? a.clientWidth * kx : b.w,
          h: a.clientHeight > 0 ? a.clientHeight * ky : b.h,
        };
      }
      clips.set(a, c);
      return c;
    };
    const rects = new Map<string, Rect>();
    for (const [id, el] of els) {
      if (typeof el.checkVisibility === 'function' && !el.checkVisibility()) continue;
      let box = layoutBox(el, fromScreen, sx, sy);
      // only the part inside every clipping ancestor (slider, scrolled container) counts
      for (let a = parentOf(el); box && a && a !== content; a = parentOf(a)) {
        const c = clipOf(a);
        if (c) box = intersect(box, c);
      }
      if (!box || box.w <= 0 || box.h <= 0) continue;
      const rect: Rect = { x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h) };
      // a shaped module (mc-shape layer): its anchors sit on the outline
      const shape = el.querySelector<HTMLElement & { shape?: Rect['shape'] }>(':scope > mc-shape')?.shape;
      if (shape) rect.shape = shape;
      // outside the content (an inactive slide): not drawn
      if (cw && ch && (rect.x >= cw || rect.y >= ch || rect.x + rect.w <= 0 || rect.y + rect.h <= 0)) continue;
      rects.set(id, rect);
    }
    const key = JSON.stringify([cw, ch, ...rects]);
    if (key === this._rectKey) return;
    this._rectKey = key;
    this._rects = rects;
    this._bounds = cw && ch ? { w: cw, h: ch } : undefined;
    this.requestUpdate();
  }

  protected render(): TemplateResult {
    const reduced = !!this._media?.matches;
    const offsetPath =
      this._offsetPathWorks !== false && typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('offset-path', 'path("M0 0")');
    const motion: FlowMotionSupport = !offsetPath ? 'none' : this._rotationWorks === false ? 'smil' : 'css';
    const slot = flowLookSlot.get();
    const back: SVGTemplateResult[] = [];
    const front: SVGTemplateResult[] = [];
    const htmlBack: TemplateResult[] = [];
    const htmlFront: TemplateResult[] = [];
    const labels: TemplateResult[] = [];
    const all = this.flows ?? [];
    const quality = pickFlowQuality(all);
    // the sides of every drawn flow first: flows sharing a side spread along it
    const drawn = all.flatMap((f, i) => {
      const a = this._rects.get(f.from);
      const b = this._rects.get(f.to);
      return f.visible && a && b ? [{ f, i, a, b, from: f.from, to: f.to, sides: anchorSides(a, b, f.fromSide, f.toSide) }] : [];
    });
    const spread = spreadAnchors(drawn, this._rects);
    const obstacles = [...this._rects.values()];
    // geometry first: the card budget needs what each look flow asks for
    const items = drawn.map(({ f, i, a, b, sides }, k) => {
      const look = slot && f.look ? (f as FlowWithLook) : undefined;
      // reduced motion: the arrowed end of a classic flow stops short by the arrowhead, which then ends at the anchor
      const arrow = !look && reduced && f.active && f.direction !== 0 ? arrowSize(f.width) : 0;
      const trim: [number, number] = f.direction < 0 ? [arrow, 0] : [0, arrow];
      return { f, i, look, arrow, geo: flowPath(a, b, sides, f.route, { t: spread[k], trim }) };
    });
    // moving elements per flow: classic dots, or what the look asks for after the tier caps (spin weighs 2)
    const dotted = (f: ResolvedFlow) => f.active && f.direction !== 0 && !reduced && offsetPath && f.dots > 0;
    const wanted = items.map(({ f, look, geo }) => ({
      id: f.id,
      n: look ? slot!.requested(look, geo, reduced, quality) : dotted(f) ? f.dots : 0,
      weight: look ? spinWeight(look.look) : 1,
    }));
    const counts = allocateBudget(wanted);
    this._lookDrawn = items.some(({ look }) => look);
    this._smil = this._lookDrawn && motion === 'smil';
    this.budget = new Map(wanted.map(({ id, n }) => [id, { requested: n, drawn: counts.get(id) ?? 0, quality }]));
    items.forEach(({ f, i, look, arrow, geo }) => {
      const count = counts.get(f.id) ?? 0;
      if (look) {
        const parts = slot!.render(look, geo, { index: i, reduced, offsetPath, motion, count, dark: this.dark, quality });
        const halo =
          !!this.selected && this.selected === f.id
            ? svg`<path class="sel" d=${geo.d} style="stroke-width: ${r1(f.width + 10)}px"></path>`
            : nothing;
        (f.layer === 'front' ? front : back).push(svg`${halo}${parts.svg}`);
        if (parts.html) (f.layer === 'front' ? htmlFront : htmlBack).push(parts.html);
      } else {
        (f.layer === 'front' ? front : back).push(this._flow(f, geo, i, reduced, offsetPath, count));
      }
      const text = f.label;
      if (!text || f.labelPosition === 'hidden') return;
      const color = f.active ? f.color : f.idleColor;
      const size = this._labelSizes.get(labelKey(text));
      if (!size) {
        // first render of this text: measured (invisible) in updated(), then placed
        labels.push(html`<div class="label" data-measure=${text} style="left: 0; top: 0; visibility: hidden">${text}</div>`);
        return;
      }
      const at = placeLabel(geo, size, { position: f.labelPosition, width: f.width, arrow, obstacles, bounds: this._bounds });
      if (!at) return;
      obstacles.push({ x: at.x - size.w / 2, y: at.y - size.h / 2, w: size.w, h: size.h });
      labels.push(html`<div class="label" style="left: ${r1(at.x)}px; top: ${r1(at.y)}px; --mc-flow-color: ${color}">${text}</div>`);
    });
    // deviates: lit.S7 - flow-look 1.0.0 injects the chunk's constant css once per shadow root while a flow has a look (no config value is in it)
    return html`${this._lookDrawn ? html`<style>${slot!.css}</style>` : nothing}
      <svg class="back" ${pauseOffscreen()} focusable="false">${back}</svg>
      ${htmlBack.length ? html`<div class="html back" ${pauseOffscreen()}>${htmlBack}</div>` : nothing}
      <svg class="front" ${pauseOffscreen()} focusable="false">${front}</svg>
      ${htmlFront.length ? html`<div class="html front" ${pauseOffscreen()}>${htmlFront}</div>` : nothing}
      <div class="labels">${labels}</div>
    `;
  }

  private _flow(f: ResolvedFlow, geo: FlowGeometry, i: number, reduced: boolean, offsetPath: boolean, count: number): SVGTemplateResult {
    const color = f.color;
    const moving = f.active && f.direction !== 0;
    const dir = f.direction < 0 ? 'reverse' : 'normal';
    const dots = moving && !reduced && f.dots > 0 && offsetPath;
    const dash = moving && !reduced && !dots;
    const arrow = moving && reduced;
    const markerId = `mc-flow-arrow-${i}`;
    const frames = `mc-flow-${i}-mv`;
    // a <style> element swallows the rest of a lit template: it is a template of its own
    const keyframes = dots ? svg`<style .textContent=${travelFrames(frames, geo.at, geo.length, false, geo.knots)}></style>` : nothing;
    const size = arrowSize(f.width);
    // dots: 0 (or no offset-path): the line is the faint track, the dashes move over it in colour
    const lineColor = moving && !dash ? color : f.idleColor;
    const dashLen = Math.max(4, f.width * 2);
    const period = dashLen * 2.5;
    const dashDur = geo.length > 0 ? (f.speedS * period) / geo.length : f.speedS;
    const selected = !!this.selected && this.selected === f.id;
    return svg`<g class="flow" data-flow=${f.id} data-dots=${dots ? '' : nothing} data-selected=${selected ? '' : nothing}>
      ${selected ? svg`<path class="sel" d=${geo.d} style="stroke-width: ${r1(f.width + 10)}px"></path>` : nothing}
      ${arrow
        ? svg`<marker id=${markerId} viewBox="0 0 10 10" refX="0" refY="5" markerWidth=${size} markerHeight=${size}
            markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" style="fill: ${color}; stroke: none"></path></marker>`
        : nothing}
      <path class="line" d=${geo.d} pathLength="100" style="stroke: ${lineColor}; stroke-width: ${r1(f.width)}px"
        marker-end=${arrow && f.direction > 0 ? `url(#${markerId})` : nothing}
        marker-start=${arrow && f.direction < 0 ? `url(#${markerId})` : nothing}></path>
      ${dash
        ? svg`<path class="dash" d=${geo.d} style="stroke: ${color}; stroke-width: ${r1(f.width)}px; stroke-dasharray: ${r1(dashLen)} ${r1(period - dashLen)}; --mc-flow-shift: ${-r1(period)}px; animation-duration: ${dashDur.toFixed(3)}s; animation-direction: ${dir}"></path>`
        : nothing}
      ${dots
        ? svg`${keyframes}<g class="dots" style="fill: ${color}">${Array.from({ length: count }, (_, k) => {
            const motion = `animation-name: ${frames}; animation-duration: ${f.speedS.toFixed(3)}s; animation-delay: ${+(-(f.speedS * k) / count).toFixed(3) || 0}s; animation-direction: ${dir}`;
            // glow: a larger faint circle riding with the dot (a filter would repaint every frame)
            return svg`${f.glow > 0 ? svg`<circle class="glow" r=${r1(f.dotSize / 2 + f.glow)} style=${motion}></circle>` : nothing}<circle
              class="dot" r=${f.dotSize / 2} style=${motion}></circle>`;
          })}</g>`
        : nothing}
    </g>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-flows': McFlows;
  }
}
