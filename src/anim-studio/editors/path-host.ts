import { html, css, svg, nothing, type CSSResultGroup, type PropertyValues, type TemplateResult, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Box, EditPath } from '../../contracts/path-model';
import type { CanvasPlacement, PathChange, PathPaint, SnapConfig } from '../../contracts/path-canvas';
import type { AnimationDoc } from '../model';
import type { StageInfo } from '../slots';
import { t } from '../i18n';
import { parsePath, pointAtTime, serializePath } from './path-utils';
import { CanvasHost, placeBox, stepLabel } from './canvas-host';

/** Grid step in document units: 5% (percent paths) or 10 px. */
const gridStep = (units: string | undefined): number => (units === 'px' ? 10 : 5);

type Pt = [number, number];
const NO_PAINT: PathPaint[] = [];
const SNAPS = new Map<number, SnapConfig>();
/** One SnapConfig object per grid step, so the canvas is not asked to render again for an equal value. */
const snapFor = (grid: number): SnapConfig => {
  let c = SNAPS.get(grid);
  if (!c) SNAPS.set(grid, (c = { enabled: true, grid, anchors: false, frame: false }));
  return c;
};

const same = (a: object, b: object): boolean => Object.entries(a).every(([k, v]) => Math.abs((b as Record<string, number>)[k] - (v as number)) < 0.005);

interface Geometry {
  frame: Box;
  place: CanvasPlacement;
  units: '%' | 'px';
  step: number;
}

/**
 * The motion path editor over the stage: an <mc-path-canvas> in overlay mode (contract path-canvas 1.1.0) with the
 * studio's own picture under it (origin cross, direction arrows, the subject at `.time`, the Start tag, a hint).
 * It sits in the stage's `canvas` slot, outside the scaled card, and maps the path's units to the screen with
 * `stage.screen`: percent paths are % of the subject's box (the stage for particles), px paths are stage px, and (0, 0)
 * is the subject's rest centre or, for particles, the stage's top left corner.
 * Pace: while a point is dragged the canvas shows the live outline and this host keeps its picture on the last
 * committed path; one `doc-change` per commit, never one per move.
 * Events: doc-change { doc, label } like every kind editor.
 */
@customElement('mc-anim-path-host')
export class AnimPathHost extends CanvasHost {
  static styles: CSSResultGroup = [
    CanvasHost.styles,
    css`
      .decor {
        fill: none;
      }
      .origin {
        stroke: color-mix(in srgb, var(--ch-ink) 45%, transparent);
        stroke-width: 1.25;
      }
      .line {
        stroke: var(--ch-accent);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .arrow {
        fill: var(--ch-accent);
        stroke: var(--ch-surface);
        stroke-width: 1;
      }
      .tag {
        font:
          500 10px/1 Roboto,
          system-ui,
          sans-serif;
        fill: var(--ch-ink);
        paint-order: stroke;
        stroke: var(--ch-surface);
        stroke-width: 3px;
        stroke-linejoin: round;
      }
      .subject .body {
        fill: color-mix(in srgb, var(--ch-ink) 14%, transparent);
        stroke: color-mix(in srgb, var(--ch-ink) 75%, transparent);
        stroke-width: 1.5;
        stroke-dasharray: 3 2;
      }
      .subject .core,
      .subject .heading {
        fill: var(--ch-ink);
      }
      .hint {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 6px 12px;
        border-radius: 9999px;
        background: var(--ch-surface);
        color: var(--ch-ink);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.16),
          0 2px 6px rgba(0, 0, 0, 0.08);
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  /** 0-1: where the subject is drawn along the path. */
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The stage geometry (slots.ts StageInfo); `screen` places the canvas. */
  @property({ attribute: false }) stage?: StageInfo;
  /** The moving element's box at rest in the card, when the stage has not reported one. */
  @property({ attribute: false }) subjectRect?: { x: number; y: number; width: number; height: number };
  /** Contract props, unused here. */
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;

  /** What the canvas shows and edits: the committed path, then the live one during a drag. */
  @state() private _live: EditPath = { anchors: [], closed: false };
  /** `_live` as the canvas takes it: the same array until the path changes, so a playing preview never renders the canvas again. */
  private _list: EditPath[] = [];
  private _geo?: Geometry;
  /** The last committed path: what the picture under the canvas draws. */
  @state() private _path: EditPath = { anchors: [], closed: false };
  @state() private _announce = '';
  /** The path data `_path` stands for (an incoming doc with other data is parsed again). */
  private _d?: string;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc')) {
      const d = this.doc?.path?.d ?? '';
      if (d !== this._d) {
        this._path = parsePath(d);
        this._d = d;
        this._setLive(this._path);
      }
    }
    if (this.doc?.kind === 'path') this.ensureCanvas();
  }

  private _setLive(p: EditPath): void {
    this._live = p;
    this._list = p.anchors.length ? [p] : [];
  }

  // ── geometry ──

  private _geometry(): Geometry | undefined {
    const spec = this.doc?.path;
    const stage = this.stage;
    const w = stage?.rect.width ?? 0;
    const h = stage?.rect.height ?? 0;
    if (!stage || !spec || !(w > 0) || !(h > 0)) return undefined;
    const px = spec.units === 'px';
    const sub = this.stage?.subject ?? this.subjectRect;
    const particles = spec.subject === 'particles';
    const box = !particles && sub && sub.width > 0 && sub.height > 0 ? sub : { x: 0, y: 0, width: w, height: h };
    const place = placeBox(stage, box);
    if (!place) return undefined;
    const bw = px ? box.width : 100;
    const bh = px ? box.height : 100;
    const frame: Box = particles ? { x: 0, y: 0, w: bw, h: bh } : { x: -bw / 2, y: -bh / 2, w: bw, h: bh };
    const units = px ? 'px' : '%';
    const step = gridStep(spec.units);
    const old = this._geo;
    // an equal geometry keeps its objects, so the canvas only renders again when the picture moved
    if (old && old.units === units && old.step === step && same(old.frame, frame) && same(old.place, place)) return old;
    return (this._geo = { frame, place, units, step });
  }

  private _px(g: Geometry, p: Pt): Pt {
    return [g.place.left + ((p[0] - g.frame.x) * g.place.width) / g.frame.w, g.place.top + ((p[1] - g.frame.y) * g.place.height) / g.frame.h];
  }

  protected toolsReady(): void {
    this._announce = t('The drawing tools are ready.');
    this.renderRoot.querySelector<HTMLElement>('mc-path-canvas')?.focus({ preventScroll: true });
  }

  // ── writing ──

  private _onChange = (e: Event): void => {
    e.stopPropagation();
    const detail = (e as CustomEvent<PathChange>).detail;
    const paths = detail.paths;
    this._setLive(paths[0] ?? { anchors: [], closed: false });
    if (!detail.commit || !this.doc) return;
    const d = serializePath(this._live);
    this._path = this._live;
    this._d = d;
    const label = stepLabel(detail.label);
    const doc: AnimationDoc = { ...this.doc, path: { ...(this.doc.path ?? { units: 'percent', follow_rotation: false, subject: 'element' }), d } };
    this._announce = label;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  };

  // ── picture under the canvas ──

  private _mapD(g: Geometry): string {
    const map = (p: Pt): Pt => this._px(g, p);
    return serializePath({
      closed: this._path.closed,
      anchors: this._path.anchors.map((a) => {
        const [x, y] = map([a.x, a.y]);
        return { ...a, x, y, in: a.in ? map(a.in) : undefined, out: a.out ? map(a.out) : undefined };
      }),
    });
  }

  private _arrows(g: Geometry): SVGTemplateResult[] {
    const d = this._d ?? '';
    if (this._path.anchors.length < 2 || !d) return [];
    return [0.25, 0.5, 0.75].map((q) => {
      const a = pointAtTime(d, q - 0.01);
      const b = pointAtTime(d, q + 0.01);
      const c = pointAtTime(d, q);
      if (!a || !b || !c) return svg``;
      const pa = this._px(g, [a.x, a.y]);
      const pb = this._px(g, [b.x, b.y]);
      const pc = this._px(g, [c.x, c.y]);
      if (Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) < 0.5) return svg``;
      const ang = (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI;
      return svg`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${pc[0].toFixed(1)} ${pc[1].toFixed(1)}) rotate(${ang.toFixed(1)})"></path>`;
    });
  }

  /** The subject at `q`: a neutral ghost dot, with its heading when it follows the path. */
  private _dot(g: Geometry, d: string, q: number, follow: boolean, k: number): SVGTemplateResult | typeof nothing {
    const s = pointAtTime(d, q);
    if (!s) return nothing;
    const [x, y] = this._px(g, [s.x, s.y]);
    let heading: SVGTemplateResult | typeof nothing = nothing;
    if (follow) {
      const a = pointAtTime(d, Math.max(0, q - 0.005));
      const b = pointAtTime(d, Math.min(1, q + 0.005));
      if (a && b) {
        const pa = this._px(g, [a.x, a.y]);
        const pb = this._px(g, [b.x, b.y]);
        const ang = (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI;
        heading = svg`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${ang.toFixed(1)})"></path>`;
      }
    }
    return svg`<g class="subject" data-k=${k} transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${heading}
    </g>`;
  }

  /** Where the subject is at `.time`; particles: each one, spaced evenly along the path like the compiled layer. */
  private _subject(g: Geometry): Array<SVGTemplateResult | typeof nothing> | typeof nothing {
    const d = this._d ?? '';
    if (this._path.anchors.length < 2) return nothing;
    const spec = this.doc?.path;
    const follow = !!spec?.follow_rotation;
    const q = Math.min(1, Math.max(0, Number.isFinite(this.time) ? this.time : 0));
    const n = spec?.subject === 'particles' ? Math.min(60, Math.max(1, spec.particles?.count ?? 3)) : 1;
    return Array.from({ length: n }, (_, k) => this._dot(g, d, k === 0 ? q : (q + k / n) % 1, follow, k));
  }

  protected render(): TemplateResult {
    const g = this._geometry();
    if (!g) return html`${this.renderNotice()}`;
    const n = this._path.anchors.length;
    const sd = this._mapD(g);
    const o = this._px(g, [0, 0]);
    const start = n > 1 ? this._px(g, [this._path.anchors[0].x, this._path.anchors[0].y]) : undefined;
    const ready = this.canvasState === 'ready';
    return html`
      <svg class="layer decor" aria-hidden="true">
        <path class="origin" d="M${o[0] - 6} ${o[1]}h12M${o[0]} ${o[1] - 6}v12"></path>
        ${sd && n > 1 ? svg`<path class="line" d=${sd}></path>` : nothing} ${this._arrows(g)} ${this._subject(g)}
        ${start ? svg`<text class="tag" x=${start[0] + 10} y=${start[1] - 9}>${t('Start')}</text>` : nothing}
      </svg>
      ${ready
        ? html`<mc-path-canvas
            overlay
            .placement=${g.place}
            .frame=${g.frame}
            .units=${g.units}
            .paths=${this._list}
            .paint=${NO_PAINT}
            .mode=${this.disabled ? 'view' : this._live.closed ? 'nodes' : 'add'}
            .maxPaths=${1}
            .gridStep=${g.step}
            .snap=${snapFor(g.step)}
            .nudge=${1}
            .bigNudge=${g.step}
            .fineNudge=${0.1}
            aria-label=${t('Motion path. Click to add points, drag to move them.')}
            @mc-path-change=${this._onChange}
          ></mc-path-canvas>`
        : nothing}
      ${n === 0 && ready && !this.disabled ? html`<p class="hint">${t('Click to place the first point')}</p>` : n === 1 && ready && !this.disabled ? html`<p class="hint">${t('Click to add the next point')}</p>` : nothing}
      ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-path-host': AnimPathHost;
  }
}
