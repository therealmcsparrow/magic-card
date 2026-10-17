import { LitElement, css, html, nothing, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { readRadii, ringPath, shapeRingPath } from '../utils/ring-path';
import type { ResolvedShape } from './mc-shape';
import { linearGradientSvg, parseGradient } from '../utils/gradient';
import { ResolvedRing, ringInset, ringStroke, ringTimerTick } from '../utils/ring';
import { TimerTick } from '../utils/timer';

const REDUCED = '(prefers-reduced-motion: reduce)';

/** Something re-measured when its observed element resizes (rings, shapes). */
export interface SizeWatcher {
  measure(): void;
}

/**
 * An element's border box size, sub-pixel (offsetWidth / offsetHeight are rounded) unless a
 * transform scales it (then its layout size).
 */
export function borderBoxSize(el: HTMLElement): { w: number; h: number } {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const r = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : undefined;
  if (r && Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return { w: r.width, h: r.height };
  return { w, h };
}

/** Rings / shapes per observed parent, for the one ResizeObserver they all share. */
const watchers = new Map<Element, Set<SizeWatcher>>();
let shared: ResizeObserver | undefined;

/** The ResizeObserver every ring's parent is observed by (created on first use; none without the API). */
export function ringResizeObserver(): ResizeObserver | undefined {
  if (!shared && typeof ResizeObserver === 'function') {
    shared = new ResizeObserver((entries) => {
      for (const e of entries) watchers.get(e.target)?.forEach((r) => r.measure());
    });
  }
  return shared;
}

/** Re-measure `ring` whenever `parent` resizes (the shared ResizeObserver). */
export function watchSize(parent: Element, ring: SizeWatcher): void {
  let set = watchers.get(parent);
  if (!set) {
    set = new Set();
    watchers.set(parent, set);
    ringResizeObserver()?.observe(parent);
  }
  set.add(ring);
}

export function unwatchSize(parent: Element, ring: SizeWatcher): void {
  const set = watchers.get(parent);
  if (!set) return;
  set.delete(ring);
  if (set.size) return;
  watchers.delete(parent);
  shared?.unobserve(parent);
}

/** Two resolved rings draw the same (a card render makes a new object every time). */
function sameRing(a: ResolvedRing | undefined, b: ResolvedRing | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a) as Array<keyof ResolvedRing>;
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k] || (k === 'timer' && JSON.stringify(a[k]) === JSON.stringify(b[k])));
}

/**
 * The ring overlay of a card / row / column / module: an aria-hidden SVG over the parent's border
 * box whose path follows the parent's rendered size and border radii (re-measured on resize).
 * Never takes layout space or pointer events. The parent is made position: relative by the card
 * (`[data-mc-ring]`). Measuring only happens when the parent resizes (one ResizeObserver shared by
 * all rings) or its inline style / class changes (radius from a rule or appearance), not per render.
 */
@customElement('mc-ring')
export class McRing extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
      z-index: 1;
    }
    svg {
      position: absolute;
      overflow: visible;
    }
    path {
      fill: none;
    }
    @keyframes mc-ring-run {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: -100;
      }
    }
    @keyframes mc-ring-pulse {
      0%,
      100% {
        opacity: 1;
        stroke-width: var(--mc-ring-w);
      }
      50% {
        opacity: 0.35;
        stroke-width: calc(var(--mc-ring-w) * 0.5);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      path {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  @property({ attribute: false, hasChanged: (a?: ResolvedRing, b?: ResolvedRing) => !sameRing(a, b) }) ring?: ResolvedRing;

  /** The parent's outline shape: the ring follows it instead of the rounded rectangle. */
  @property({ attribute: false, hasChanged: (a?: ResolvedShape, b?: ResolvedShape) => JSON.stringify(a) !== JSON.stringify(b) })
  shape?: ResolvedShape;

  /** Parent border box and radii, as measured. */
  @state() private _box?: { w: number; h: number; top: number; left: number; radii: ReturnType<typeof readRadii> };

  private _observed?: Element;
  private _mutations?: MutationObserver;
  private _media?: MediaQueryList;
  private _onMedia = () => this.requestUpdate();
  /** Only for a running timer ring: redraws every second while on screen (one shared ticker). */
  private _tick?: TimerTick;
  /** An "On tap" ring preset (data-tap) is hidden again once its lap is over. */
  private _onEnd = () => {
    if (this.hasAttribute('data-tap')) this.removeAttribute('data-tapped');
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    this._observe();
    this._timer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._tick?.run(false);
    this._unobserve();
    this._media?.removeEventListener?.('change', this._onMedia);
  }

  private _unobserve(): void {
    if (this._observed) unwatchSize(this._observed, this);
    this._mutations?.disconnect();
    this._mutations = undefined;
    this._observed = undefined;
  }

  private _observe(): void {
    const parent = this.parentElement;
    if (!parent || parent === this._observed) return;
    this._unobserve();
    this._observed = parent;
    watchSize(parent, this);
    if (typeof MutationObserver === 'function') {
      this._mutations = new MutationObserver(() => this.measure());
      this._mutations.observe(parent, { attributes: true, attributeFilter: ['style', 'class'] });
    }
    this.measure();
  }

  /** Read the parent's border box (untransformed) and computed radii. */
  measure(): void {
    const parent = this.parentElement;
    if (!parent) return;
    const cs = getComputedStyle(parent);
    // along a shape: the sub-pixel size the shape's clip is drawn for
    const { w, h } = this.shape ? borderBoxSize(parent as HTMLElement) : { w: parent.offsetWidth, h: parent.offsetHeight };
    const box = {
      w,
      h,
      top: parseFloat(cs.borderTopWidth) || 0,
      left: parseFloat(cs.borderLeftWidth) || 0,
      radii: readRadii(cs, w, h),
    };
    if (JSON.stringify(box) !== JSON.stringify(this._box)) this._box = box;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    // a ring moved to another parent by a re-render keeps following the right element
    this._observe();
    if (changed.has('ring')) this._timer();
  }

  /** Tick while the ring shows a timer that has time left. */
  private _timer(): void {
    const t = this.ring?.timer;
    const on = !!t && this.isConnected && t.end > Date.now();
    if (on) {
      this._tick ??= new TimerTick(this, () => {
        this.requestUpdate();
        // once it has run out, HA turns the timer idle (a new ring); nothing moves until then
        if (!(this.ring?.timer && this.ring.timer.end > Date.now())) this._tick?.run(false);
      });
    }
    this._tick?.run(on);
  }

  protected render(): TemplateResult | typeof nothing {
    const r = this.ring?.timer ? { ...this.ring, ...ringTimerTick(this.ring.timer) } : this.ring;
    const b = this._box;
    if (!r || !b) return nothing;
    const opts = { inset: ringInset(r.position, r.width), start: r.start, direction: r.direction };
    const d = this.shape
      ? shapeRingPath(this.shape.kind, b.w, b.h, this.shape.options, opts)
      : ringPath(b.w, b.h, b.radii, opts);
    const s = ringStroke(r, !!this._media?.matches);
    if (!d) return nothing;
    // a gradient ring (until a threshold or a timer tick moves the colour off its first stop)
    const g = parseGradient(r.paint);
    const paint = g?.stops[0] === r.color ? g : undefined;
    const glow = r.glow > 0 ? `; filter: drop-shadow(0 0 ${r.glow}px ${r.color})` : '';
    const style = [
      `--mc-ring-w: ${r.width}px`,
      `stroke: ${paint ? 'url(#g)' : r.color}`,
      `stroke-width: ${r.width}px`,
      `stroke-linecap: ${s.linecap}`,
      `stroke-dasharray: ${s.dasharray}`,
      `stroke-dashoffset: ${s.dashoffset}`,
      `opacity: ${s.opacity}`,
      `animation: ${s.animation}`,
      `transition: ${s.transition}`,
    ].join('; ');
    // the host covers the padding box; the svg covers the border box (the outline's reference).
    // The track is a nested template inside <svg>: svg``, or its <path> is an HTML element that draws nothing.
    const box = `top: ${-b.top}px; left: ${-b.left}px; width: ${b.w}px; height: ${b.h}px${r.opacity !== undefined ? `; opacity: ${r.opacity}` : ''}`;
    return html`<svg style=${box} viewBox="0 0 ${b.w} ${b.h}" preserveAspectRatio="none" focusable="false">
      ${paint ? linearGradientSvg('g', paint.angle, paint.stops, { x: 0, y: 0, w: b.w, h: b.h }) : nothing}
      ${r.track ? svg`<path d=${d} pathLength="100" style="stroke: ${r.track}; stroke-width: ${r.width}px"></path>` : nothing}
      <path d=${d} pathLength="100" style="${style}${glow}" @animationend=${this._onEnd}></path>
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-ring': McRing;
  }
}
