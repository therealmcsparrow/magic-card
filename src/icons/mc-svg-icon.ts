import { LitElement, html, svg, nothing, PropertyValues, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type { HassEntity, HomeAssistant, IconFxConfig } from '../types';
import { isIconStateOn, stateIcon } from '../utils/entity-icon';
import { IconGeometry, StrokeShape, onIconGeometry, peekIconGeometry, peekSvgMarkup, registerSvgGeometry, resolveIconGeometry, svgError } from './icon-source';
import { iconBaseStyles } from './icon-css';
import { offscreenObserver, __resetOffscreenObserverForTests } from './offscreen';
import { resolveIconFx, ResolvedIconFx } from './icon-fx';
import { linearGradientSvg } from '../utils/gradient';
import { interpolate, matchShapes } from './path-math';

let uidSeq = 0;
const r3 = (n: number) => String(+n.toFixed(3));

/** Device animations that move the whole icon: they animate the <svg> element itself. */
const WHOLE = new Set(['spin', 'shake', 'pulse', 'drum']);

const deviceVars = (d: NonNullable<ResolvedIconFx['device']>): string => [
  `--mc-icon-speed: ${r3(d.speed > 0 ? d.speed : 1.5)}s`,
  `--mc-icon-intensity: ${r3(d.intensity)}`,
  ...(d.color ? [`--mc-icon-glow-color: ${d.color}`] : []),
].join('; ');

/** Icons with a looping animation are watched by the shared observer (offscreen.ts). */
export const __resetIconObserverForTests = __resetOffscreenObserverForTests;

interface Box { x: number; y: number; w: number; h: number }
/** A shape fading out (cross-fade, or a morph's secondary / own markup), drawn in its own viewBox. */
interface Outgoing {
  g: IconGeometry;
  markup?: string;
  /** Fade length and how far into it the layer starts (an interrupted fade-in continues from there). */
  ms: number;
  skip: number;
  timer?: ReturnType<typeof setTimeout>;
}
const MAX_OUTGOING = 3;

const MORPH_MS = 400;
const XFADE_MS = 250;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const reducedMotion = (): boolean =>
  typeof matchMedia === 'function' && !!matchMedia('(prefers-reduced-motion: reduce)')?.matches;
/** Shown in place of an own SVG that was rejected (or `icon: svg` without markup). */
const BROKEN_ICON = 'mdi:image-broken-variant';
const geomKey = (g: IconGeometry): string =>
  `${g.viewBox}|${g.paths.join(' ')}|${(g.secondary ?? []).join(' ')}|${(g.strokes ?? []).map((s) => `${s.d}@${s.width}`).join(' ')}`;

/** Stroked shapes as `<path>`s: no fill, their own width / caps / joins, painted by `style`. */
const strokePaths = (strokes: StrokeShape[], stroke: string, style?: string, extra?: { pathLength?: string; cls?: string }): SVGTemplateResult[] =>
  strokes.map((s) => svg`<path class=${extra?.cls ?? nothing} d=${s.d} pathLength=${extra?.pathLength ?? nothing} fill="none" stroke=${stroke}
    stroke-width=${r3(s.width)} stroke-linecap=${s.cap ?? nothing} stroke-linejoin=${s.join ?? nothing} style=${style ?? nothing}></path>`);

function parseViewBox(vb: string): Box {
  const [x, y, w, h] = vb.split(/[\s,]+/).map(Number);
  return [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 ? { x, y, w, h } : { x: 0, y: 0, w: 24, h: 24 };
}

/**
 * Icon rig mode (animation studio v2 parts), set by the lazy animation runtime (src/anim-runtime/rig.ts):
 * `ref` (an icon) or `svg` (own SVG markup) is the geometry source (none = this icon's own) and
 * `body` draws its parts in place of the plain shape (undefined: the plain shape). Until the geometry resolves, or
 * when it never does, the plain icon shows.
 */
export interface IconRig {
  ref?: string;
  /** An own SVG as the source (registered like `icon: svg`). */
  svg?: string;
  /** The rig as SVG markup (from the runtime chunk: sanitised parts, checked values). */
  body(g: IconGeometry): string | undefined;
  /** Adds (on) or removes the rig's stylesheet in this icon's shadow root. */
  sheet(root: ShadowRoot, on: boolean): void;
}

const ROTATION = { up: 0, right: 90, down: 180, left: -90 } as const;
/** The default paint, like ha-svg-icon: HA's --icon-primary-color, else the module's colour. */
const PRIMARY_VAR = 'var(--icon-primary-color, currentColor)';
const themed = (paint: string): string => (paint === 'currentColor' ? PRIMARY_VAR : paint);

/**
 * Inline SVG icon for icon effects. Draws the icon's path once its geometry is known; until then (or
 * when it can't be resolved: unknown icon, timeout, multi-colour logo) it renders <ha-icon>, so the
 * icon is never blank and colour / size still apply. Effect layers join in later tasks.
 */
@customElement('mc-svg-icon')
export class McSvgIcon extends LitElement {
  static styles = iconBaseStyles;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) icon?: string;
  @property({ attribute: false }) entity?: string;
  @property({ attribute: false }) fx?: IconFxConfig;
  @property({ attribute: false }) iconOn?: string;
  @property({ attribute: false }) iconOff?: string;
  @property({ attribute: false }) svg?: string;
  /**
   * Entity icons inside HA: a hidden <ha-state-icon> picks the icon (registry, attribute, icon
   * translations, device class) and this draws it; until then it is the visible fallback.
   */
  @property({ attribute: false }) stateObj?: HassEntity;
  /** The host is aria-hidden or labelled: the fallback icon is hidden from assistive tech too. */
  @property({ attribute: false }) decorative = false;
  @property({ attribute: false }) rig?: IconRig;

  private _unsub?: () => void;
  private _watched?: string;
  /** What <ha-state-icon> shows: an icon ref, or the path of its domain fallback. */
  private _stateRef?: string;
  private _stateGeom?: IconGeometry;
  private _stateTimers: ReturnType<typeof setTimeout>[] = [];
  /** Reads of ha-state-icon still scheduled; this update's plan; the registry entry last seen. */
  private _readsPending = false;
  private _readPlan?: 'full' | 'once';
  private _entry?: unknown;
  /** Rig mode with its geometry known: the rig's body replaces the shape. */
  private _rigOn = false;
  /** Drawing the last shape while ha-state-icon is read (see willUpdate). */
  private _holding = false;
  /** The last render has a looping animation (device motion, wave): watched for visibility. */
  private _animates = false;
  private _observed = false;
  /** Prefix of this instance's clipPath / gradient ids (unique per instance). */
  private readonly _uid = `mc-icon-${++uidSeq}`;
  /** Effects resolved against the current states (once per update). */
  private _fx?: ResolvedIconFx;
  /** The geometry this update draws (the target while a morph runs). */
  private _geom?: IconGeometry;
  /** The geometry last drawn (morph source, change detection) and its own SVG markup. */
  private _shown?: IconGeometry;
  private _shownKey?: string;
  private _shownMarkup?: string;
  private _lastState?: string;
  /** Morph tween: the path of the current frame, its rAF handle. */
  private _frame?: string;
  private _raf?: number;
  /** Shapes fading out (each in its own viewBox), newest last. */
  private _outs: Outgoing[] = [];
  /** Cross-fade in (shapes that can't be matched): when it started, its restart key and timer. */
  private _inStart?: number;
  private _inSeq = 0;
  private _inTimer?: ReturnType<typeof setTimeout>;
  /** Line-draw: playing, its restart key, timer, and whether `load` has played. */
  private _drawing = false;
  private _drawSeq = 0;
  private _drawTimer?: ReturnType<typeof setTimeout>;
  private _loaded = false;
  /** Own SVG: the markup last registered and its ref. */
  private _ownText?: string;
  private _ownRef?: string;
  /** Connected again after a disconnect: the next update re-reads ha-state-icon in full. */
  private _reconnected = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._ensure();
    // Reconnected (moved, or a re-shown view): Lit doesn't render again on its own. Render now: the
    // observer is re-attached, ha-state-icon read again, and a morph cut off by the disconnect
    // (stopped there) lands on its final frame.
    if (this.hasUpdated) {
      this._reconnected = true;
      this.requestUpdate();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
    this._watched = undefined;
    this._stateTimers.forEach(clearTimeout);
    this._stateTimers = [];
    this._readsPending = false;
    this._observe(false);
    this._stopMorph();
    clearTimeout(this._drawTimer);
    this._drawing = false;
  }

  private _observe(on: boolean): void {
    if (on === this._observed) return;
    const io = offscreenObserver();
    if (!io) return;
    this._observed = on;
    if (on) io.observe(this);
    else {
      io.unobserve(this);
      this.removeAttribute('offscreen');
    }
  }

  /** `iconOn` / `iconOff` by the entity's state, when set. */
  private get _byState(): string | undefined {
    return stateIcon(this.hass, this.entity, this.iconOn, this.iconOff);
  }

  /** Own SVG (`icon: svg`): its `svg:<hash>` ref, registered (sanitised) once per markup. */
  private get _own(): string | undefined {
    const text = this.rig?.svg ?? (this.icon === 'svg' ? this.svg : undefined);
    if (!text) return undefined;
    if (text !== this._ownText || !this._ownRef || (!peekIconGeometry(this._ownRef) && !svgError(this._ownRef))) {
      this._ownText = text;
      this._ownRef = registerSvgGeometry(text);
    }
    return this._ownRef;
  }

  /** Rig mode: the rig's geometry source (none: this icon's own). */
  private get _rigRef(): string | undefined {
    return this.rig ? (this.rig.svg ? this._own : this.rig.ref) : undefined;
  }

  private get _useState(): boolean {
    return !this._byState && !this._own && !!this.stateObj && typeof customElements !== 'undefined' && !!customElements.get('ha-state-icon');
  }

  /** The icon ref drawn: a state icon, the one <ha-state-icon> picked (state mode) or `icon`. */
  private get _ref(): string | undefined {
    return this._rigRef ?? this._byState ?? this._own ?? (this._useState ? this._stateRef : this.icon);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    this._ensure();
    this._readPlan = this._statePlan(changed);
    // Both state icons are fetched up front, so the first change can morph at once.
    for (const r of [this.iconOn, this.iconOff]) if (r && this.isConnected && !peekIconGeometry(r)) void resolveIconGeometry(r);
    this._fx = resolveIconFx(this.fx, { hass: this.hass, entity: this.entity, baseColor: 'currentColor' });
    const ref = this._ref;
    // rig mode draws its parts only on its own source; while that is unknown the plain icon shows
    // (the entity's icon through ha-state-icon when that is what the module draws)
    const rigRef = this._rigRef;
    const rigGeom = rigRef ? peekIconGeometry(rigRef) : undefined;
    this._rigOn = !!this.rig && (!rigRef || !!rigGeom);
    this._geom = rigGeom ?? (this._useState && this._stateGeom ? this._stateGeom : ref && !rigRef ? peekIconGeometry(ref) : undefined);
    // Switched to the entity's own icon (a state icon for the other side only) and ha-state-icon not
    // read yet: hold the last drawn shape while the reads run, then morph, rather than flash the
    // bare <ha-state-icon> in between.
    this._holding = !this._geom && this._useState && !!this._shown && (this._readPlan === 'full' || this._readsPending);
    if (this._holding) {
      this._geom = this._shown;
      return;
    }
    this._track(this._geom, this._fx, this._geom && ref?.startsWith('svg:') ? peekSvgMarkup(ref) : undefined);
  }

  /** Starts a morph / cross-fade / line-draw when the drawn shape or the entity state changes. */
  private _track(g: IconGeometry | undefined, fx: ResolvedIconFx, markup: string | undefined): void {
    // The entity's on / off side (isIconStateOn), not its raw state: a sensor's new reading or a cover
    // moving from open to opening doesn't replay a line-draw.
    const stateObj = this.entity ? this.hass?.states?.[this.entity] : undefined;
    const state = stateObj ? String(isIconStateOn(this.entity!.split('.')[0], stateObj.state, stateObj.attributes)) : undefined;
    const stateChanged = this._lastState !== undefined && state !== undefined && state !== this._lastState;
    if (state !== undefined) this._lastState = state;
    if (!g) return;
    const key = geomKey(g);
    const first = !this._shown;
    const changed = !first && key !== this._shownKey;
    const still = reducedMotion();
    // no morph in rig mode: the parts are split from the target shape, not a tween frame
    if (changed && fx.morph && !this.rig) {
      if (still) this._stopMorph();
      else this._morph(this._shown!, this._shownMarkup, g);
    }
    if (!still && !this.rig && ((first && fx.draw === 'load' && !this._loaded) || (fx.draw === 'change' && (changed || stateChanged)))) this._draw(fx);
    if (first && fx.draw === 'load') this._loaded = true;
    this._shown = g;
    this._shownKey = key;
    this._shownMarkup = markup;
  }

  /**
   * Tween from the shown shape (or the running frame) to `to`: only the primary layer tweens, the rest
   * (secondary paths, own SVG markup) cross-fades over the tween. Shapes that can't match (subpaths,
   * viewBoxes, strokes) cross-fade whole. A change mid-way continues from where things are: the tween
   * from its current frame, an icon still fading in fades out from its current opacity.
   */
  private _morph(from: IconGeometry, fromMarkup: string | undefined, to: IconGeometry): void {
    const now = Date.now();
    const tweening = this._frame !== undefined;
    const fromD = this._frame ?? from.paths.join(' ');
    if (this._raf !== undefined) cancelAnimationFrame(this._raf);
    this._raf = undefined;
    this._frame = undefined;
    // How far the icon now leaving had faded in (1 unless a cross-fade is interrupted).
    const shownIn = this._inStart !== undefined ? Math.min(1, (now - this._inStart) / XFADE_MS) : 1;
    clearTimeout(this._inTimer);
    this._inStart = undefined;
    // Only filled shapes morph: a stroked outline has no area to tween, so those cross-fade.
    const stroked = (!tweening && !!from.strokes?.length) || !!to.strokes?.length;
    const m = from.viewBox === to.viewBox && !stroked ? matchShapes(fromD, to.paths.join(' ')) : undefined;
    if (!m) {
      const old: IconGeometry = tweening ? { paths: [fromD], secondary: from.secondary, viewBox: from.viewBox } : from;
      this._fadeOut(old, tweening ? undefined : fromMarkup, XFADE_MS, shownIn);
      this._inStart = now;
      this._inSeq++;
      this._inTimer = setTimeout(() => {
        this._inStart = undefined;
        this.requestUpdate();
      }, XFADE_MS);
      return;
    }
    if (from.secondary?.length || fromMarkup) this._fadeOut({ paths: [], secondary: from.secondary, viewBox: from.viewBox }, fromMarkup, MORPH_MS, shownIn);
    const start = now;
    this._frame = interpolate(m, 0);
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / MORPH_MS);
      if (t >= 1) {
        this._raf = undefined;
        this._frame = undefined;
      } else {
        this._frame = interpolate(m, easeInOut(t));
        this._raf = requestAnimationFrame(step);
      }
      this.requestUpdate();
    };
    this._raf = requestAnimationFrame(step);
  }

  /** Adds a layer fading out over `ms`, starting at opacity `from` (0..1). */
  private _fadeOut(g: IconGeometry, markup: string | undefined, ms: number, from: number): void {
    const left = ms * Math.max(0, Math.min(1, from));
    if (left <= 0 || (!g.paths.length && !g.secondary?.length && !g.strokes?.length && !markup)) return;
    const out: Outgoing = { g, markup, ms, skip: ms - left };
    out.timer = setTimeout(() => {
      this._outs = this._outs.filter((o) => o !== out);
      this.requestUpdate();
    }, left);
    this._outs = [...this._outs, out];
    while (this._outs.length > MAX_OUTGOING) clearTimeout(this._outs.shift()!.timer);
  }

  private _stopMorph(): void {
    if (this._raf !== undefined) cancelAnimationFrame(this._raf);
    this._raf = undefined;
    this._frame = undefined;
    this._outs.forEach((o) => clearTimeout(o.timer));
    this._outs = [];
    clearTimeout(this._inTimer);
    this._inStart = undefined;
  }

  /** Plays the line-draw once (restarting it when it runs): a new key re-creates the svg. */
  private _draw(fx: ResolvedIconFx): void {
    clearTimeout(this._drawTimer);
    this._drawing = true;
    this._drawSeq++;
    this._drawTimer = setTimeout(() => {
      this._drawing = false;
      this.requestUpdate();
    }, fx.drawDuration * 1000);
  }

  /**
   * Subscribes to the current icon's geometry and, while it isn't known, asks for it again on every
   * update: cheap (a cached failure answers at once) and it recovers from a cache eviction, an
   * expired failure or a pack that registered late. A slow probe lands through the subscription.
   */
  private _ensure(): void {
    const ref = this._ref;
    if (!this.isConnected) return;
    if (ref !== this._watched) {
      this._unsub?.();
      this._unsub = undefined;
      this._watched = ref;
      if (ref) this._unsub = onIconGeometry(ref, () => this.requestUpdate());
    }
    if (!ref || peekIconGeometry(ref)) return;
    void resolveIconGeometry(ref).then((g) => {
      if (g && this._ref === ref) this.requestUpdate();
    });
  }

  /**
   * When to read ha-state-icon: in full after a new stateObj, a changed registry entry or a reconnect
   * (it picks its icon asynchronously: icon translations), once while nothing has been read yet,
   * otherwise not at all (no timer and query per icon on every hass update).
   */
  private _statePlan(changed: PropertyValues<this>): 'full' | 'once' | undefined {
    const reconnected = this._reconnected;
    this._reconnected = false;
    if (!this._useState) return undefined;
    const entry = this.hass?.entities?.[this.stateObj!.entity_id];
    const entryChanged = entry !== this._entry;
    this._entry = entry;
    if (changed.has('stateObj') || entryChanged || reconnected) return 'full';
    return this._stateRef || this._stateGeom ? undefined : 'once';
  }

  protected updated(_changed: PropertyValues<this>): void {
    if (_changed.has('rig')) {
      (_changed.get('rig') as IconRig | undefined)?.sheet?.(this.renderRoot as ShadowRoot, false);
      this.rig?.sheet?.(this.renderRoot as ShadowRoot, true);
    }
    this._observe(this._animates && this.isConnected);
    const plan = this._readPlan;
    this._readPlan = undefined;
    if (!plan || (plan === 'once' && this._readsPending)) return;
    const settle = plan === 'full' ? [0, 50, 300, 1000] : [0];
    this._stateTimers.forEach(clearTimeout);
    this._readsPending = true;
    this._stateTimers = settle.map((ms, i) =>
      setTimeout(() => {
        if (i === settle.length - 1) {
          this._stateTimers = [];
          this._readsPending = false;
        }
        this._readStateIcon();
        // Nothing read by the last try: stop holding, show ha-state-icon itself.
        if (i === settle.length - 1 && this._holding) this.requestUpdate();
      }, ms),
    );
  }

  private _readStateIcon(): void {
    const root = this.renderRoot.querySelector('ha-state-icon')?.shadowRoot;
    if (!root) return;
    const icon = root.querySelector<HTMLElement & { icon?: string }>('ha-icon');
    const ref = (typeof icon?.icon === 'string' && icon.icon) || icon?.getAttribute('icon') || undefined;
    let geom: IconGeometry | undefined;
    if (!ref) {
      const el = root.querySelector<HTMLElement & { path?: string; viewBox?: string }>('ha-svg-icon');
      const path = typeof el?.path === 'string' ? el.path.trim() : '';
      if (path) geom = { paths: [path], viewBox: typeof el?.viewBox === 'string' && el.viewBox.trim() ? el.viewBox.trim() : '0 0 24 24' };
    }
    const same = ref === this._stateRef && (geom?.paths[0] ?? '') === (this._stateGeom?.paths[0] ?? '');
    if (same || (!ref && !geom)) return;
    this._stateRef = ref;
    this._stateGeom = geom;
    this.requestUpdate();
  }

  protected render(): TemplateResult {
    this._animates = false;
    const g = this._geom;
    const fallback = this.icon === 'svg' ? BROKEN_ICON : this.icon;
    if (!this._useState) return g ? this._svg(g) : html`<ha-icon icon=${fallback || nothing} aria-hidden=${this.decorative ? 'true' : nothing}></ha-icon>`;
    // Same <ha-state-icon> element in both cases: it keeps reporting the entity's icon while hidden.
    return html`${g ? this._svg(g) : nothing}<ha-state-icon
        ?hidden=${!!g}
        .hass=${this.hass}
        .stateObj=${this.stateObj}
        aria-hidden=${this.decorative ? 'true' : nothing}
      ></ha-state-icon>`;
  }

  private _svg(target: IconGeometry): TemplateResult {
    const fx0 = this._fx ?? resolveIconFx(this.fx, { hass: this.hass, entity: this.entity, baseColor: 'currentColor' });
    // Rig mode: its parts in place of the shape; the colours of icon_fx apply, the liquid fill and the
    // line-draw do not (the parts draw on themselves)
    const rigBody = this._rigOn ? this.rig?.body?.(target) : undefined;
    const fx: ResolvedIconFx = rigBody ? { ...fx0, fill: undefined, draw: 'off' } : fx0;
    // A running morph draws its current frame in place of the target's primary shape; the target's
    // secondary paths / own markup fade in over the tween.
    const morphIn = !rigBody && this._frame !== undefined;
    const g: IconGeometry = morphIn ? { paths: [this._frame!], secondary: target.secondary, viewBox: target.viewBox } : target;
    const box = parseViewBox(g.viewBox);
    // Own SVG: its own markup (colours, strokes); painted styles recolour it.
    const ref = this._ref;
    const ownMarkup = ref?.startsWith('svg:') ? peekSvgMarkup(ref) : undefined;
    const needsClip = !!fx.fill || (fx.colors.style === 'duotone' && !g.secondary?.length);
    // Stroked shapes have no area for a clipPath: the clip is a mask with their strokes drawn white.
    const strokes = g.strokes ?? [];
    const clipUrl = `url(#${this._uid}-clip)`;
    const gradient = fx.colors.style === 'gradient' ? this._gradient(fx, box) : undefined;
    const paint = gradient ? `url(#${this._uid}-grad)` : (fx.colors.valueColor ?? fx.colors.primary);
    const dim = !fx.fill && !!fx.colors.valueMissing;
    const d = fx.device;
    // Whole-icon motions move the <svg> itself: a compositable transform around its box centre.
    const whole = !!d && d.speed > 0 && WHOLE.has(d.anim);
    const loop = fx.draw === 'loop' && !reducedMotion();
    const drawing = loop || (!rigBody && this._drawing);
    this._animates = (!!d && d.speed > 0) || loop; // a moving wave sets it too (_fill)
    const cls = [whole ? `dev dev-${d!.anim}` : '', loop ? 'mc-draw-loop' : drawing ? 'mc-draw' : ''].filter(Boolean).join(' ');
    const style = [whole ? deviceVars(d!) : '', drawing ? `--mc-draw-dur: ${r3(fx.drawDuration)}s` : ''].filter(Boolean).join('; ');
    const bodyCls = ['body', dim ? 'dim' : ''].filter(Boolean).join(' ');
    // The cross-fade's scale-in wraps the body: its animation combines with the line-draw's on .body.
    const body = svg`<g class=${bodyCls}>
        ${rigBody
          ? svg`<g style=${paint.startsWith('url(') ? `--mc-rig-fill: ${paint}` : paint !== 'currentColor' ? `--mc-rig-paint: ${themed(paint)}` : nothing}>${unsafeSVG(rigBody)}</g>`
          : morphIn && ownMarkup
          ? svg`${this._base(g, fx, paint, box)}<g class="morph-in">${this._ownSvg(ownMarkup, target, fx, paint, box, false)}</g>`
          : this._base(g, fx, paint, box, ownMarkup)}
        ${fx.fill ? this._fill(fx.fill, box, themed(fx.fill.color === fx.colors.primary ? paint : fx.fill.color), strokes.length ? { mask: clipUrl } : { clip: clipUrl }) : nothing}
      </g>`;
    return html`${keyed(this._drawSeq, html`<svg part="svg" viewBox=${g.viewBox} aria-hidden="true" focusable="false"
      class=${cls || nothing} style=${style || nothing}>
      ${needsClip || gradient
        ? svg`<defs>
            ${needsClip ? this._clip(g, box) : nothing}
            ${gradient ?? nothing}
          </defs>`
        : nothing}
      ${this._device(fx, g, box, whole, svg`${this._outs.map((o) => this._outgoing(o, box, fx, paint))}${this._inStart !== undefined
        ? keyed(this._inSeq, svg`<g class="xfade-in">${body}</g>`)
        : body}${drawing ? this._drawLayer(g, box, paint) : nothing}`)}
    </svg>`)}`;
  }

  /** A layer fading out, in its own viewBox fitted to the current one (icons of any size cross-fade). */
  private _outgoing(o: Outgoing, box: Box, fx: ResolvedIconFx, paint: string): SVGTemplateResult {
    const own = parseViewBox(o.g.viewBox);
    const timing = [o.ms !== XFADE_MS ? `animation-duration: ${r3(o.ms / 1000)}s` : '', o.skip > 0 ? `animation-delay: ${r3(-o.skip / 1000)}s` : ''].filter(Boolean).join('; ');
    const style = paint !== 'currentColor' ? `fill: ${themed(paint)}` : undefined;
    return svg`<svg class="xfade-out" aria-hidden="true" x=${r3(box.x)} y=${r3(box.y)} width=${r3(box.w)} height=${r3(box.h)}
      viewBox=${o.g.viewBox} overflow="visible" style=${timing || nothing}>${o.markup
        ? this._ownSvg(o.markup, o.g, fx, paint, own, false)
        : svg`${(o.g.secondary ?? []).map((d) => svg`<path class="secondary" d=${d} fill="currentColor" style=${style ?? nothing}></path>`)}${o.g.paths.map((d) => svg`<path class="old" d=${d} fill="currentColor" style=${`fill: ${themed(paint)}`}></path>`)}${strokePaths(o.g.strokes ?? [], 'currentColor', `stroke: ${themed(paint)}`, { cls: 'old' })}`}</svg>`;
  }

  /** Line-draw: the outline traced with a pathLength=1 dash (keyframes in icon-css). */
  private _drawLayer(g: IconGeometry, box: Box, paint: string): SVGTemplateResult {
    const width = r3((box.w / 24) * 1.2);
    const style = paint !== 'currentColor' ? `stroke: ${themed(paint)}` : undefined;
    // Filled shapes trace their outline; stroked shapes draw themselves, at their own width.
    return svg`<g class="draw" aria-hidden="true">${[...(g.secondary ?? []), ...g.paths].map((p) => svg`<path d=${p} pathLength="1"
      fill="none" stroke="currentColor" stroke-width=${width} stroke-linecap="round" stroke-linejoin="round" style=${style ?? nothing}></path>`)}${strokePaths(g.strokes ?? [], 'currentColor', style, { pathLength: '1' })}</g>`;
  }

  /**
   * The icon's area for the liquid fill (and the duotone outline): a clipPath of the filled shapes,
   * or, with stroked shapes, a mask with the fills white and the strokes drawn white at their width.
   */
  private _clip(g: IconGeometry, box: Box): SVGTemplateResult {
    const id = `${this._uid}-clip`;
    const fills = [...g.paths, ...(g.secondary ?? [])];
    if (!g.strokes?.length) return svg`<clipPath id=${id}>${fills.map((p) => svg`<path d=${p}></path>`)}</clipPath>`;
    const pad = Math.max(...g.strokes.map((s) => s.width));
    return svg`<mask id=${id} maskUnits="userSpaceOnUse" x=${r3(box.x - pad)} y=${r3(box.y - pad)} width=${r3(box.w + 2 * pad)} height=${r3(box.h + 2 * pad)}>
      ${fills.map((p) => svg`<path d=${p} fill="#fff"></path>`)}${strokePaths(g.strokes, '#fff')}
    </mask>`;
  }

  /**
   * Device animation (keyframes in icon-css, timing from `--mc-icon-speed`; speed 0 = static pose).
   * Spin / shake / pulse / drum move the whole <svg> (`whole`); the rest animate a group around a
   * pivot on the viewBox. Glow is a still blurred copy whose opacity breathes, flame's shadow sits on
   * a still wrapper: no filter is re-rendered per frame. Snow particles / the pulse ring sit beside.
   */
  private _device(fx: ResolvedIconFx, g: IconGeometry, box: Box, whole: boolean, body: SVGTemplateResult): SVGTemplateResult {
    const d = fx.device;
    if (!d) return body;
    const vars = deviceVars(d);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const unit = Math.min(box.w, box.h);
    let extra: SVGTemplateResult | typeof nothing = nothing;
    if (d.anim === 'snow') {
      // 6 flakes spread over the box, each falling one cycle with its own delay
      const flakes = [0, 1, 2, 3, 4, 5].map((i) => {
        const x = box.x + box.w * (0.14 + 0.144 * i);
        const y = box.y + box.h * (0.2 + ((i * 0.37) % 0.6));
        return svg`<circle cx=${r3(x)} cy=${r3(y)} r=${r3(unit * 0.05)} style=${`animation-delay: ${r3((-i / 6) * (d.speed || 1.5))}s`}></circle>`;
      });
      extra = svg`<g class="snow" style=${`${vars}; --mc-snow-dy: ${r3(box.h * 0.2)}px`}>${flakes}</g>`;
    } else if (d.anim === 'pulse') {
      // r 0.44 + half the stroke, at the 1.05 peak scale: still inside the box
      extra = svg`<circle class="ring" cx=${r3(cx)} cy=${r3(cy)} r=${r3(unit * 0.44)} style=${`${vars}; stroke-width: ${r3(unit * 0.06)}`}></circle>`;
    }
    if (whole) return svg`${body}${extra}`;
    const cls = `dev dev-${d.anim}${d.speed > 0 ? '' : ' dev-static'}`;
    // The pivot in user units on the viewBox (not the group's fill box, which a liquid fill's
    // oversized rect stretches far below the icon): swing on the left edge, flame / eq on the bottom.
    const [ox, oy] = d.anim === 'swing' ? [box.x, cy] : d.anim === 'flame' || d.anim === 'eq' ? [cx, box.y + box.h] : [cx, cy];
    const pivot = `transform-box: view-box; transform-origin: ${r3(ox)}px ${r3(oy)}px`;
    const glow = d.anim === 'glow'
      ? svg`<g class="glow-copy" aria-hidden="true" style=${`filter: blur(${r3(unit * 0.07)}px)`}>${[...(g.secondary ?? []), ...g.paths].map((p) => svg`<path d=${p}></path>`)}${strokePaths(g.strokes ?? [], 'currentColor', 'stroke: var(--mc-icon-glow-color, currentColor)')}</g>`
      : nothing;
    const group = svg`<g class=${cls} style=${`${vars}; ${pivot}`}>${glow}${body}</g>`;
    return d.anim === 'flame' ? svg`<g class="flame-glow" style=${vars}>${group}</g>${extra}` : svg`${group}${extra}`;
  }

  /** The icon itself: primary paths (dimmed under a liquid fill), secondary paths, duotone tones. */
  private _base(g: IconGeometry, fx: ResolvedIconFx, paint: string, box: Box, own?: string): SVGTemplateResult {
    const emptyColor = fx.fill?.emptyColor;
    if (own) return this._ownSvg(own, g, fx, paint, box);
    if (emptyColor) {
      // A liquid fill with an empty colour: the whole icon in that colour under the liquid.
      return svg`${[...(g.secondary ?? []), ...g.paths].map((d, i) => svg`<path class=${i < (g.secondary?.length ?? 0) ? 'secondary duo' : 'primary'} d=${d}
        fill="currentColor" style=${`fill: ${emptyColor}`}></path>`)}`;
    }
    const empty = fx.fill ? r3(fx.fill.emptyOpacity) : undefined;
    const style = paint !== 'currentColor' ? `fill: ${paint}` : undefined;
    const duo = fx.colors.style === 'duotone' ? fx.colors.secondary : undefined;
    if (duo && !g.secondary?.length) {
      // One-tone icon: the body in the second tone, an inner outline in the primary.
      const width = r3((Math.min(box.w, box.h) / 24) * 3);
      return svg`
        ${g.paths.map((d) => svg`<path class="primary duo-body" d=${d} fill="currentColor" fill-opacity=${empty ?? nothing} style=${`fill: ${duo}`}></path>`)}
        ${g.paths.map((d) => svg`<path class="duo-line" d=${d} clip-path=${`url(#${this._uid}-clip)`} opacity=${empty ?? nothing}
          style=${`fill: none; stroke: ${themed(paint)}; stroke-width: ${width}`}></path>`)}`;
    }
    return svg`
      ${(g.secondary ?? []).map((d) => svg`<path class=${`${duo ? 'secondary duo' : 'secondary'}${this._frame !== undefined ? ' morph-in' : ''}`} d=${d} fill="currentColor"
        fill-opacity=${empty ?? nothing} style=${duo ? `fill: ${duo}` : style ?? nothing}></path>`)}
      ${g.paths.map((d) => svg`<path class="primary" d=${d} fill="currentColor" fill-opacity=${empty ?? nothing} style=${style ?? nothing}></path>`)}`;
  }

  /**
   * Own SVG: always its markup (strokes, dashes, opacities kept). Solid: unpainted and currentColor
   * parts take the icon colour. Gradient / value / duotone / an empty colour paint every filled shape
   * (`mc-f`) and stroke (`mc-s`) through --mc-own-fill / --mc-own-stroke: a stroke icon keeps its
   * outline instead of turning into a blob. mc-accent parts take the second colour when one is set.
   */
  private _ownSvg(own: string, g: IconGeometry, fx: ResolvedIconFx, paint: string, box: Box, outlined = true): SVGTemplateResult {
    const emptyColor = fx.fill?.emptyColor;
    const style = fx.colors.style;
    const oneTone = style === 'duotone' && !g.secondary?.length;
    const painted = !!emptyColor || style !== 'solid';
    const accent = emptyColor || oneTone ? undefined : fx.colors.secondary;
    const solid = !painted && paint !== 'currentColor' ? themed(paint) : undefined;
    const empty = fx.fill && !emptyColor ? r3(fx.fill.emptyOpacity) : undefined;
    const vars = [
      solid ? `color: ${solid}; fill: ${solid}` : '',
      painted ? `--mc-own-fill: ${emptyColor ?? (oneTone ? fx.colors.secondary : themed(paint))}; --mc-own-stroke: ${emptyColor ?? themed(paint)}` : '',
      accent ? `--mc-icon-accent: ${accent}` : '',
    ].filter(Boolean).join('; ');
    const cls = ['own', painted ? 'painted' : '', accent ? 'accented' : ''].filter(Boolean).join(' ');
    // One-tone duotone of a filled icon: the body in the second tone, an inner outline in the primary.
    const width = r3((Math.min(box.w, box.h) / 24) * 3);
    const outline = outlined && oneTone && !emptyColor && !g.strokes?.length
      ? g.paths.map((d) => svg`<path class="duo-line" d=${d} clip-path=${`url(#${this._uid}-clip)`} opacity=${empty ?? nothing}
          style=${`fill: none; stroke: ${themed(paint)}; stroke-width: ${width}`}></path>`)
      : nothing;
    return svg`<g class=${cls} fill="currentColor" opacity=${empty ?? nothing} style=${vars || nothing}>${unsafeSVG(own)}</g>${outline}`;
  }

  /**
   * Gradient paint: a linearGradient along `angle` (CSS convention: 0 = upwards, 90 = to the right)
   * in user space over the viewBox, like CSS `linear-gradient` on that box: every path, and the
   * liquid's static paint rect, share one gradient at the right angle on non-square boxes too.
   */
  private _gradient(fx: ResolvedIconFx, box: Box): SVGTemplateResult {
    return linearGradientSvg(`${this._uid}-grad`, fx.colors.angle, fx.colors.stops ?? [], box);
  }

  /**
   * Liquid fill, clipped by the icon: a body rising from the bottom to `level` (moved with a
   * transform so level changes can transition) and a wave on its surface (two sine periods,
   * scrolled by one period per cycle). Other directions rotate the whole layer.
   */
  private _fill(f: NonNullable<ResolvedIconFx['fill']>, box: Box, paint: string, area: { clip?: string; mask?: string }): SVGTemplateResult | typeof nothing {
    if (f.level === undefined) return nothing;
    // Level 0 parks the liquid below the box (kept, so a rise transitions from empty).
    const level = Math.max(0, f.level);
    const deg = ROTATION[f.direction];
    const side = deg === 90 || deg === -90;
    const bw = side ? box.h : box.w;
    const bh = side ? box.w : box.h;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const x0 = cx - bw / 2;
    const y0 = cy - bh / 2;
    // The wave flattens out when empty and near full (it would poke out of a full icon).
    const amp = f.wave && level > 0 ? bh * 0.05 * Math.min(1, Math.max(0, (0.98 - level) / 0.08)) : 0;
    if (amp > 0) this._animates = true;
    const wave = (fill: string) => {
      let d = `M${r3(x0)} ${r3(y0)}`;
      for (let i = 0; i < 4; i++) {
        const x = x0 + (i * bw) / 2;
        d += `Q${r3(x + bw / 4)} ${r3(y0 + (i % 2 ? amp : -amp))} ${r3(x + bw / 2)} ${r3(y0)}`;
      }
      d += `V${r3(y0 + amp + 0.5)}H${r3(x0)}Z`;
      return svg`<path class="wave" d=${d} style=${`fill: ${fill}; --mc-wave-dx: ${r3(-bw)}px`}></path>`;
    };
    const liquid = (fill: string) => svg`<g transform=${deg ? `rotate(${deg} ${r3(cx)} ${r3(cy)})` : nothing}>
        <g class="liquid" style=${`transform: translateY(${r3((1 - level) * bh)}px)`}>
          <rect x=${r3(x0 - bw)} y=${r3(y0 + amp / 2)} width=${r3(bw * 3)} height=${r3(bh * 2)} style=${`fill: ${fill}`}></rect>
          ${amp > 0 ? wave(fill) : nothing}
        </g>
      </g>`;
    if (!paint.startsWith('url(')) return svg`<g class="fill" clip-path=${area.clip ?? nothing} mask=${area.mask ?? nothing}>${liquid(paint)}</g>`;
    // A gradient stays put: one box-sized rect carries it and the moving liquid only masks it.
    return svg`<g class="fill" clip-path=${area.clip ?? nothing} mask=${area.mask ?? nothing}>
      <mask id=${`${this._uid}-liquid`} maskUnits="userSpaceOnUse" x=${r3(box.x)} y=${r3(box.y)} width=${r3(box.w)} height=${r3(box.h)}>${liquid('#fff')}</mask>
      <rect class="paint" x=${r3(box.x)} y=${r3(box.y)} width=${r3(box.w)} height=${r3(box.h)} mask=${`url(#${this._uid}-liquid)`} style=${`fill: ${paint}`}></rect>
    </g>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-svg-icon': McSvgIcon;
  }
}
