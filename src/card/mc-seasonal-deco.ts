import { LitElement, css, html, unsafeCSS, nothing, PropertyValues, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SceneId } from '../utils/seasonal';
import { sceneDecorations, type DecoMotif } from '../utils/seasonal-scenes';
import { layoutDeco, type DecoBox, type DecoLayout } from '../utils/seasonal-deco';
import { readRadii } from '../utils/ring-path';
import { unwatchOffscreen, watchOffscreen } from '../icons/offscreen';
import { borderBoxSize, unwatchSize, watchSize } from './mc-ring';
import type { ResolvedShape } from './mc-shape';

const REDUCED = '(prefers-reduced-motion: reduce)';

/** Bulb colours, cycled along the string (and through time). */
export const LIGHT_COLOURS = ['#ff4040', '#ffc61a', '#2fbf4f', '#2f8cff', '#ff5cc8'];
/** One colour step (s) of the colour cycle. */
const CYCLE_STEP = 2.4;

const sameList = (a?: readonly string[], b?: readonly string[]) =>
  a === b || (!!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]));

const BULB = 'M0 2.2C2.6 2.6 3.5 5.3 3.1 7.4 2.7 9.6 1.3 11.1 0 11.1-1.3 11.1-2.7 9.6-3.1 7.4-3.5 5.3-2.6 2.6 0 2.2Z';

function lights(l: NonNullable<DecoLayout['lights']>): SVGTemplateResult {
  return svg`<g class="lights">
    <path d=${l.wire} class="wire"></path>
    ${l.bulbs.map(
      (b) => svg`<g class="bulb" style="--i:${b.index};color:${LIGHT_COLOURS[b.index % LIGHT_COLOURS.length]}"
        transform="translate(${b.x} ${b.y}) rotate(${b.angle}) scale(${l.scale})">
        <circle cy="7" r="8.5" class="halo"></circle>
        <circle cy="7" r="5.2" class="halo"></circle>
        <path d=${BULB} class="glass"></path>
        <ellipse cx="-1.15" cy="5.8" rx=".75" ry="1.8" class="hi"></ellipse>
        <rect x="-1.8" y="-.8" width="3.6" height="3.4" rx=".9" class="socket"></rect>
      </g>`,
    )}
  </g>`;
}

function icicles(l: NonNullable<DecoLayout['icicles']>): SVGTemplateResult {
  return svg`<g class="icicles">
    ${l.icicles.map((i) => svg`<path d=${i.d} class="ice"></path>`)}
    ${l.icicles.map((i) => svg`<path d="M${i.x - 0.6} ${i.y + 1}L${i.x - 0.3} ${i.y + i.length * 0.6}" class="ice-hi"></path>`)}
    <path d=${l.cap} class="cap-shade"></path>
    <path d=${l.cap} class="cap"></path>
  </g>`;
}

function frost(l: NonNullable<DecoLayout['frost']>): SVGTemplateResult {
  return svg`<g class="frost" clip-path="url(#mc-deco-clip)">
    <path d=${l.outline} class="frost-edge"></path>
    ${l.corners.map((c) => svg`<circle cx=${c.x} cy=${c.y} r=${c.radius} fill="url(#mc-deco-frost)"></circle>`)}
    <path d=${l.corners.map((c) => c.crystals).join('')} class="crystal"></path>
  </g>`;
}

function cobweb(l: NonNullable<DecoLayout['cobweb']>): SVGTemplateResult {
  const s = l.spider;
  const legs = [-1, 1]
    .flatMap((side) =>
      [-0.5, -0.15, 0.2, 0.5].map((k, i) => {
        const y = s.y + k * s.size * 0.6;
        const x1 = s.x + side * s.size * 0.95;
        const knee = `${s.x + side * s.size * 0.7} ${y - s.size * (0.35 - i * 0.12)}`;
        return `M${s.x} ${y}Q${knee} ${x1} ${y + s.size * (i - 1) * 0.28}`;
      }),
    )
    .join('');
  return svg`<g class="cobweb">
    <g clip-path="url(#mc-deco-clip)"><path d=${l.threads} class="web"></path><path d=${l.spiral} class="web web-ring"></path></g>
    <path d=${s.thread} class="web"></path>
    <path d=${legs} class="leg"></path>
    <circle cx=${s.x} cy=${s.y + s.size * 0.2} r=${s.size * 0.42} class="spider"></circle>
    <circle cx=${s.x} cy=${s.y - s.size * 0.32} r=${s.size * 0.26} class="spider"></circle>
    <circle cx=${s.x - s.size * 0.1} cy=${s.y - s.size * 0.36} r=${s.size * 0.06} class="eye"></circle>
    <circle cx=${s.x + s.size * 0.1} cy=${s.y - s.size * 0.36} r=${s.size * 0.06} class="eye"></circle>
  </g>`;
}

function pumpkin(l: NonNullable<DecoLayout['pumpkin']>): SVGTemplateResult {
  return svg`<g class="pumpkin" transform="translate(${l.x} ${l.y}) scale(${Math.round((l.size / 32) * 1000) / 1000})">
    <ellipse cx="0" cy="-.4" rx="15" ry="2.2" class="shadow"></ellipse>
    <ellipse cx="-8.2" cy="-11" rx="8" ry="10.8" class="rib back"></ellipse>
    <ellipse cx="8.2" cy="-11" rx="8" ry="10.8" class="rib back"></ellipse>
    <ellipse cx="-4.6" cy="-11.2" rx="7.4" ry="11.4" class="rib mid"></ellipse>
    <ellipse cx="4.6" cy="-11.2" rx="7.4" ry="11.4" class="rib mid"></ellipse>
    <ellipse cx="0" cy="-11.4" rx="6.4" ry="11.7" class="rib front"></ellipse>
    <path d="M-1.4-21.4C-1.6-25-.8-27.6 1.6-29.2L3.1-27.7C1.7-26.4 1.3-24.4 1.5-21.5Z" class="stem"></path>
    <path d="M-.8-21.8C-4.6-26-8.8-24.4-10-21.2-6.4-19.8-3.2-20.2-.8-21.8Z" class="pleaf"></path>
    <path d="M1.4-22.6C4.2-25.6 8.2-24.6 7.6-22 7.2-20.6 5.6-21 6-22.2" class="curl"></path>
    <g class="face">
      <path d="M-6.8-13.6H-3L-4.9-17.4ZM3-13.6H6.8L4.9-17.4ZM-1.1-11.2H1.1L0-13.2ZM-7.8-8.4Q0-2.6 7.8-8.4 6-5.4 3.8-5L3.2-6.6 1.6-4.9 0-6.6-1.6-4.9-3.2-6.6-3.8-5Q-6-5.4-7.8-8.4Z"></path>
    </g>
  </g>`;
}

function vine(l: NonNullable<DecoLayout['vine']>): SVGTemplateResult {
  return svg`<g class="vine">
    <path d=${l.stem} class="vstem"></path>
    <path d=${l.tendrils} class="tendril"></path>
    ${l.leaves.map(
      (f, i) => svg`<g transform="translate(${f.x} ${f.y}) rotate(${f.angle}) scale(${Math.round((f.size / 8) * 100) / 100})">
        <path d="M0 0C2-2.6 6-2.9 8.4 0 6 2.9 2 2.6 0 0Z" class="vleaf v${i % 3}"></path><path d="M.6 0H7" class="vrib"></path>
      </g>`,
    )}
    ${l.flowers.map(
      (f) => svg`<g transform="translate(${f.x} ${f.y}) rotate(${f.rotate}) scale(${Math.round((f.size / 10) * 100) / 100})">
        ${[0, 72, 144, 216, 288].map((a) => svg`<ellipse cx="0" cy="-3.3" rx="2.3" ry="3.4" transform="rotate(${a})" class="vpetal"></ellipse>`)}
        <circle r="1.7" class="vheart"></circle>
      </g>`,
    )}
  </g>`;
}

/**
 * Seasonal border decorations of a card / row / column / module: an aria-hidden SVG over the
 * parent's border box, drawn along its outline (rounded rectangle from its radii, or `shape`) and
 * re-laid out when the parent resizes (the ResizeObserver shared with rings and shapes). Lights
 * twinkle and cycle colours with stepped CSS animations (paused off-screen, still under reduced
 * motion); the other motifs are static. Without motifs it renders and observes nothing.
 */
@customElement('mc-seasonal-deco')
export class McSeasonalDeco extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
      --mc-deco-wire: color-mix(in srgb, var(--primary-text-color, #212121) 30%, #2b4a2e);
      --mc-deco-frost: #c9e2fc;
      --mc-deco-crystal: color-mix(in srgb, var(--primary-text-color, #212121) 22%, #b4d4f6);
      --mc-deco-web: color-mix(in srgb, var(--primary-text-color, #212121) 48%, transparent);
      --mc-deco-spider: color-mix(in srgb, var(--primary-text-color, #212121) 55%, #1d1426);
    }
    /* a dark theme (the card passes hass.themes.darkMode): pale frost stands out much more there */
    :host([dark]) {
      --mc-deco-frost: rgba(205, 228, 252, 0.3);
    }
    svg {
      position: absolute;
      overflow: visible;
    }
    .wire {
      fill: none;
      stroke: var(--mc-deco-wire);
      stroke-width: 1.2;
      stroke-linecap: round;
    }
    .bulb {
      animation: mc-deco-cycle ${CYCLE_STEP * LIGHT_COLOURS.length}s steps(1, end) infinite;
      animation-delay: calc(var(--i) * -${CYCLE_STEP}s);
    }
    .halo {
      fill: currentColor;
      opacity: 0.16;
      animation: mc-deco-twinkle 1.8s steps(1, end) infinite;
      animation-delay: calc(var(--i) * -0.7s);
    }
    .glass {
      fill: currentColor;
      stroke: color-mix(in srgb, currentColor 60%, #000);
      stroke-width: 0.5;
    }
    .hi {
      fill: #fff;
      opacity: 0.7;
    }
    .socket {
      fill: #3d5a40;
      stroke: #23362a;
      stroke-width: 0.4;
    }
    @keyframes mc-deco-cycle {
      ${unsafeCSS(LIGHT_COLOURS.map((c, i) => `${(i * 100) / LIGHT_COLOURS.length}% { color: ${c}; }`).join(' '))}
    }
    @keyframes mc-deco-twinkle {
      0% {
        opacity: 0.16;
      }
      40% {
        opacity: 0.04;
      }
      70% {
        opacity: 0.22;
      }
    }

    .ice {
      fill: url(#mc-deco-ice);
      stroke: rgba(74, 134, 196, 0.5);
      stroke-width: 0.6;
    }
    .ice-hi {
      stroke: #fff;
      stroke-width: 0.7;
      stroke-linecap: round;
      opacity: 0.8;
    }
    .cap {
      fill: none;
      stroke: #fff;
      stroke-width: 3.6;
      stroke-linecap: round;
    }
    .cap-shade {
      fill: none;
      stroke: rgba(120, 165, 215, 0.55);
      stroke-width: 4.6;
      stroke-linecap: round;
      translate: 0 0.9px;
    }
    .ice-top {
      stop-color: #fff;
      stop-opacity: 0.95;
    }
    .ice-tip {
      stop-color: #a5d8ff;
      stop-opacity: 0.6;
    }

    .frost-edge {
      fill: none;
      stroke: var(--mc-deco-frost);
      stroke-width: 10;
      opacity: 0.4;
      filter: url(#mc-deco-blur);
    }
    .frost-in {
      stop-color: var(--mc-deco-frost);
      stop-opacity: 0.6;
    }
    .frost-out {
      stop-color: var(--mc-deco-frost);
      stop-opacity: 0;
    }
    .crystal {
      fill: none;
      stroke: var(--mc-deco-crystal);
      stroke-width: 0.8;
      stroke-linecap: round;
      opacity: 0.85;
    }

    .web {
      fill: none;
      stroke: var(--mc-deco-web);
      stroke-width: 0.8;
    }
    .web-ring {
      stroke-width: 0.6;
    }
    .spider {
      fill: var(--mc-deco-spider);
    }
    .leg {
      fill: none;
      stroke: var(--mc-deco-spider);
      stroke-width: 0.7;
      stroke-linecap: round;
    }
    .eye {
      fill: #ff6b6b;
    }

    .pumpkin .shadow {
      fill: rgba(0, 0, 0, 0.18);
    }
    .rib {
      stroke: #a63c06;
      stroke-width: 0.7;
    }
    .rib.back {
      fill: #d9480f;
    }
    .rib.mid {
      fill: #f76707;
    }
    .rib.front {
      fill: #fd8c2c;
    }
    .stem {
      fill: #5f7f2a;
      stroke: #3f5a1a;
      stroke-width: 0.5;
    }
    .pleaf {
      fill: #74b816;
    }
    .curl {
      fill: none;
      stroke: #6b8e23;
      stroke-width: 0.9;
      stroke-linecap: round;
    }
    .face path {
      fill: #ffd43b;
      stroke: #ffa94d;
      stroke-width: 0.6;
      stroke-linejoin: round;
    }
    .face {
      filter: drop-shadow(0 0 1.6px rgba(255, 196, 0, 0.9));
    }

    .vstem {
      fill: none;
      stroke: #5c940d;
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .tendril {
      fill: none;
      stroke: #74b816;
      stroke-width: 0.9;
      stroke-linecap: round;
    }
    .vleaf.v0 {
      fill: #51cf66;
    }
    .vleaf.v1 {
      fill: #40c057;
    }
    .vleaf.v2 {
      fill: #2f9e44;
    }
    .vrib {
      stroke: rgba(0, 0, 0, 0.22);
      stroke-width: 0.5;
    }
    .vpetal {
      fill: #ffdeeb;
      stroke: #e64980;
      stroke-width: 0.45;
      stroke-opacity: 0.7;
    }
    .vheart {
      fill: #fcc419;
      stroke: #e67700;
      stroke-width: 0.4;
    }

    :host([offscreen]) *,
    :host([static]) * {
      animation-play-state: paused !important;
    }
    :host([static]) * {
      animation: none !important;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
      }
    }
  `;

  /** Motifs to draw (wins over `scenes`). */
  @property({ attribute: false, hasChanged: (a?: DecoMotif[], b?: DecoMotif[]) => !sameList(a, b) }) motifs?: DecoMotif[];
  /** Scenes whose decorations to draw (src/utils/seasonal-scenes.ts). */
  @property({ attribute: false, hasChanged: (a?: SceneId[], b?: SceneId[]) => !sameList(a, b) }) scenes?: SceneId[];
  /** The parent's outline shape: decorations follow it instead of the rounded rectangle. */
  @property({ attribute: false, hasChanged: (a?: ResolvedShape, b?: ResolvedShape) => JSON.stringify(a) !== JSON.stringify(b) })
  shape?: ResolvedShape;
  @property() seed = 'mc';
  /** The card is on a dark theme: softer frost. */
  @property({ type: Boolean, reflect: true }) dark = false;

  @state() private _box?: DecoBox & { top: number; left: number };
  @state() private _static = false;

  private _observed?: Element;
  private _mutations?: MutationObserver;
  /** A measure waiting for the next frame (style / class mutations, coalesced). */
  private _frame?: number;
  private _media?: MediaQueryList;
  private _watchingScreen = false;
  private _onMedia = () => {
    this._static = !!this._media?.matches;
  };

  /** The motifs this element draws. */
  get activeMotifs(): DecoMotif[] {
    return this.motifs ?? sceneDecorations(this.scenes ?? []);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    this._static = !!this._media?.matches;
    this._sync();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unobserve();
    this._media?.removeEventListener?.('change', this._onMedia);
  }

  private _unobserve(): void {
    if (this._observed) unwatchSize(this._observed, this);
    this._mutations?.disconnect();
    this._mutations = undefined;
    if (this._frame !== undefined) cancelAnimationFrame(this._frame);
    this._frame = undefined;
    this._observed = undefined;
    if (this._watchingScreen) unwatchOffscreen(this);
    this._watchingScreen = false;
  }

  /** Observe the parent while there is something to draw; nothing otherwise. */
  private _sync(): void {
    const parent = this.parentElement;
    const motifs = this.activeMotifs;
    if (!this.isConnected || !parent || !motifs.length) {
      this._unobserve();
      this._box = undefined;
      return;
    }
    if (parent !== this._observed) {
      this._unobserve();
      this._observed = parent;
      watchSize(parent, this);
      if (typeof MutationObserver === 'function') {
        this._mutations = new MutationObserver(() => this._measureSoon());
        this._mutations.observe(parent, { attributes: true, attributeFilter: ['style', 'class'] });
      }
      this.measure();
    }
    const animated = motifs.includes('lights') && !this._static;
    if (animated && !this._watchingScreen) this._watchingScreen = watchOffscreen(this, () => undefined);
    else if (!animated && this._watchingScreen) {
      unwatchOffscreen(this);
      this._watchingScreen = false;
    }
  }

  /** Measure once in the next frame, however many mutations come before it. */
  private _measureSoon(): void {
    if (this._frame !== undefined) return;
    this._frame = requestAnimationFrame(() => {
      this._frame = undefined;
      if (this._mutations) this.measure();
    });
  }

  /** Read the parent's border box and computed radii. */
  measure(): void {
    const parent = this.parentElement as HTMLElement | null;
    if (!parent) return;
    const cs = getComputedStyle(parent);
    const { w, h } = borderBoxSize(parent);
    const box = {
      w,
      h,
      top: parseFloat(cs.borderTopWidth) || 0,
      left: parseFloat(cs.borderLeftWidth) || 0,
      radii: readRadii(cs, w, h),
      shape: this.shape,
    };
    if (JSON.stringify(box) !== JSON.stringify(this._box)) this._box = box;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.toggleAttribute('static', this._static);
    if (changed.has('shape') && this._box && JSON.stringify(this._box.shape) !== JSON.stringify(this.shape)) this._box = { ...this._box, shape: this.shape };
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._sync();
  }

  /** The layout drawn now (undefined before the first measure / without motifs). */
  get layout(): DecoLayout | undefined {
    const b = this._box;
    const motifs = this.activeMotifs;
    if (!b || !motifs.length || !(b.w > 0 && b.h > 0)) return undefined;
    return layoutDeco(motifs, b, this.seed);
  }

  protected render(): TemplateResult | typeof nothing {
    const l = this.layout;
    const b = this._box;
    if (!l || !b || !(l.lights || l.icicles || l.frost || l.cobweb || l.pumpkin || l.vine)) return nothing;
    const box = `top: ${-b.top}px; left: ${-b.left}px; width: ${b.w}px; height: ${b.h}px`;
    return html`<svg style=${box} viewBox="0 0 ${b.w} ${b.h}" focusable="false">
      <defs>
        <clipPath id="mc-deco-clip"><path d=${l.clip}></path></clipPath>
        ${l.icicles
          ? svg`<linearGradient id="mc-deco-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ice-top"></stop><stop offset="1" class="ice-tip"></stop></linearGradient>`
          : nothing}
        ${l.frost
          ? svg`<radialGradient id="mc-deco-frost"><stop offset="0" class="frost-in"></stop><stop offset="1" class="frost-out"></stop></radialGradient>
            <filter id="mc-deco-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>`
          : nothing}
      </defs>
      ${l.frost ? frost(l.frost) : nothing} ${l.vine ? vine(l.vine) : nothing} ${l.cobweb ? cobweb(l.cobweb) : nothing}
      ${l.icicles ? icicles(l.icicles) : nothing} ${l.pumpkin ? pumpkin(l.pumpkin) : nothing} ${l.lights ? lights(l.lights) : nothing}
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-seasonal-deco': McSeasonalDeco;
  }
}
