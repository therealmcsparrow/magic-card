import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import type { HomeAssistant } from '../../types';
import {
  BG_LAYER_STATUS_EVENT, IDLE_PAUSE_MS, MAX_BACKGROUND_LAYERS, STALE_FAILED_REFRESHES, STALE_MIN_AGE_MS,
  type BackgroundLayerConfig, type BgLayerProblem, type BgLayerStatus, type BgStackHost,
} from '../../contracts/bg-stack';
import { LAYER_BLENDS } from '../../contracts/layer-placement';
import { safeColor } from '../../utils/animation';
import {
  blurOf, cssUrl, gradientCss, opacityOf, panZoomOf, patternCss, positionCss, repeatCss, safeImageUrl, sanitiseStates, sizeCss,
  type PanZoom,
} from './values';

/*
 * <mc-bg-stack> (contract bg-stack 1.0.0): the card backdrop, defined by the lazy chunk
 * 'layers'. Everything it needs from magic-card.js comes through `host`. Rules this file keeps:
 * - every URL goes through safeImageUrl, every colour through host.cssColor + safeColor, gradients are
 *   rebuilt from parseGradient output, enums are allow-listed (values.ts); per-instance CSS only through the CSSOM (sty directive, one validated value per property);
 * - pan / zoom is a transform animation on the inner image box, blur sits on a static outer box;
 * - nothing runs while off screen, page hidden or card paused (host.observeOffscreen sets `offscreen`):
 *   camera refresh, stale ticker and idle timers are cleared and restarted on return (card-pause rule 2);
 * - a decode that resolves after disconnect, or for an older source, writes nothing.
 */

const TAG = 'mc-bg-stack';
const FADE_MS = 300;
const PILL_TICK_MS = 60_000;
const REDUCED = '(prefers-reduced-motion: reduce)';
const ENTITY = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const ATTR = /^[A-Za-z0-9_]{1,64}$/;
const PATTERNS: readonly string[] = ['dots', 'grid', 'lines', 'diagonal', 'checks'];
const BLENDS = LAYER_BLENDS as readonly string[];
const PILL_STYLE = 'display:inline-block;font:13px/1.4 sans-serif;color:#fff;background:rgba(0,0,0,.85);padding:2px 8px;border-radius:999px';
const INPUT_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart'] as const;

// ── one passive input listener per page, shared by every stack, throttled to 1 Hz ──
const inputSubs = new Set<() => void>();
let lastInputAt = 0;
let lastInputTick = 0;
const onInput = (): void => {
  const now = Date.now();
  if (now - lastInputTick < 1000) return;
  lastInputTick = lastInputAt = now;
  inputSubs.forEach((f) => f());
};
function subscribeInput(f: () => void): () => void {
  if (!inputSubs.size) for (const e of INPUT_EVENTS) document.addEventListener(e, onInput, { passive: true });
  inputSubs.add(f);
  lastInputAt = Date.now();
  return () => {
    inputSubs.delete(f);
    if (!inputSubs.size) for (const e of INPUT_EVENTS) document.removeEventListener(e, onInput);
  };
}

/** Decode off the DOM (Image.decode, onload fallback); false on any failure. */
function decodeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(false);
    img.src = url;
    if (typeof img.decode === 'function') img.decode().then(() => resolve(true), () => resolve(img.complete && img.naturalWidth > 0));
    else img.onload = () => resolve(true);
  });
}

/** `href` with a changing query parameter, set on the parsed URL (never string concatenation). */
function busted(href: string): string {
  if (/^data:/i.test(href)) return href;
  try {
    const u = new URL(href);
    u.searchParams.set('mc_t', String(Date.now()));
    return u.href;
  } catch {
    return href;
  }
}

interface Src {
  url?: string;
  pending?: boolean;
  problem?: BgLayerProblem;
  detail?: string;
}

interface Item {
  index: number;
  cfg: BackgroundLayerConfig;
  states: Record<string, string>;
  hasStates: boolean;
  pz?: PanZoom;
  camera: boolean;
  /** Refresh period in ms (camera layers). */
  refresh: number;
  base?: string;
  shown?: string;
  prev?: string;
  gen: number;
  loading: boolean;
  failures: number;
  lastGood: number;
  lastTry: number;
  since: number;
  stale: boolean;
  evKey: string;
  timer?: ReturnType<typeof setTimeout>;
  fadeTimer?: ReturnType<typeof setTimeout>;
}

/** Sets one validated value per property through the CSSOM (never a concatenated style string). */
class StyleSet extends Directive {
  private _keys: string[] = [];

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('sty() is an element directive');
  }

  render(_m: Record<string, string>): typeof nothing {
    return nothing;
  }

  update(part: ElementPart, [m]: [Record<string, string>]): typeof nothing {
    const st = (part.element as HTMLElement).style;
    for (const k of this._keys) if (!(k in m)) st.removeProperty(k);
    this._keys = Object.keys(m);
    for (const k of this._keys) st.setProperty(k, m[k]);
    return nothing;
  }
}
const sty = directive(StyleSet);

const srcKey = (s: Src): string => `${s.url ?? ''}|${s.pending ? 1 : 0}|${s.problem ?? ''}|${s.detail ?? ''}`;

export class McBgStack extends LitElement {
  static styles = css`
    :host{display:block;position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1;overflow:hidden;border-radius:inherit;pointer-events:none}
    .l,.img,.fill,.pic{position:absolute;top:0;right:0;bottom:0;left:0}
    .img{animation:mcbg-in .3s ease-out}
    .pz{animation:mcbg-pz var(--d) ease-in-out infinite var(--dir);animation-play-state:paused}
    .pz[data-pz=play]{animation-play-state:running}
    .pz[data-pz=start],.pz[data-pz=end]{animation:none;transform:translate(var(--x0,0),var(--y0,0)) scale(var(--s0))}
    .pz[data-pz=end]{--x0:var(--tx);--y0:var(--ty);--s0:var(--t)}
    .pz[data-pz=start]{--s0:var(--f)}
    @keyframes mcbg-in{from{opacity:0}}
    @keyframes mcbg-pz{from{transform:scale(var(--f))}to{transform:translate(var(--tx),var(--ty)) scale(var(--t))}}
    @media (prefers-reduced-motion:reduce){.img{animation:none}}
  `;

  static properties = {
    layers: { attribute: false },
    hass: { attribute: false },
    host: { attribute: false },
    preview: { attribute: false },
  };

  declare layers: BackgroundLayerConfig[];
  declare hass?: HomeAssistant;
  declare host?: BgStackHost;
  /** Studio Preview seg for pan / zoom (editor only). */
  declare preview?: 'play' | 'start' | 'end';

  private _items: Item[] = [];

  private _sig0 = '';
  private _onScreen = true;
  private _visible = true;
  private _reduced = false;
  private _idle = false;
  private _mq?: MediaQueryList;
  private _mo?: MutationObserver;
  private _obsHost?: BgStackHost;
  private _stopObs?: () => void;
  private _stopInput?: () => void;
  private _idleTimer?: ReturnType<typeof setTimeout>;
  private _pillTimer?: ReturnType<typeof setInterval>;
  private _pill?: HTMLElement;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._visible = document.visibilityState !== 'hidden';
    this._onScreen = !this.hasAttribute('offscreen');
    this._mq = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._reduced = !!this._mq?.matches;
    this._mq?.addEventListener?.('change', this._onMotion);
    document.addEventListener('visibilitychange', this._onVisibility);
    this._mo = new MutationObserver(this._onOffscreen);
    this._mo.observe(this, { attributes: true, attributeFilter: ['offscreen'] });
    this._watch();
    if (this.hasUpdated) {
      this._sync();
      this._arm();
      this.requestUpdate();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mq?.removeEventListener?.('change', this._onMotion);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._mo?.disconnect();
    this._mo = undefined;
    this._stopObs?.();
    this._stopObs = this._obsHost = undefined;
    this._disarm();
    for (const i of this._items) {
      clearTimeout(i.fadeTimer);
      i.fadeTimer = undefined;
      i.prev = undefined;
      if (i.loading) {
        i.loading = false;
        i.gen++;
        i.base = undefined;
      }
    }
    this._removePill();
  }

  private _watch(): void {
    if (!this.isConnected || !this.host || this._obsHost === this.host) return;
    this._stopObs?.();
    this._obsHost = this.host;
    this._stopObs = this.host.observeOffscreen(this);
  }

  private _onOffscreen = (): void => {
    const on = !this.hasAttribute('offscreen');
    if (on === this._onScreen) return;
    this._onScreen = on;
    this._arm();
    this.requestUpdate();
  };

  private _onVisibility = (): void => {
    this._visible = document.visibilityState !== 'hidden';
    this._arm();
    this.requestUpdate();
  };

  private _onMotion = (): void => {
    this._reduced = !!this._mq?.matches;
    this.requestUpdate();
  };

  private _active(): boolean {
    return this.isConnected && this._onScreen && this._visible;
  }

  /** Start or clear every timer and listener for the current on-screen / visible state. */
  private _arm(): void {
    if (!this._active()) {
      this._disarm();
      return;
    }
    for (const i of this._items) this._schedule(i);
    if (this._items.some((i) => i.pz?.idle && !i.cfg.hidden)) {
      if (!this._stopInput) {
        this._idle = false;
        this._stopInput = subscribeInput(this._wake);
      }
      this._armIdle();
    } else {
      this._stopInput?.();
      this._stopInput = undefined;
    }
    this._armPill();
  }

  private _disarm(): void {
    for (const i of this._items) {
      clearTimeout(i.timer);
      i.timer = undefined;
    }
    clearTimeout(this._idleTimer);
    this._idleTimer = undefined;
    clearInterval(this._pillTimer);
    this._pillTimer = undefined;
    this._stopInput?.();
    this._stopInput = undefined;
  }

  private _wake = (): void => {
    const was = this._idle;
    this._idle = false;
    this._armIdle();
    if (was) this.requestUpdate();
  };

  private _armIdle(): void {
    clearTimeout(this._idleTimer);
    if (!this._stopInput) return;
    this._idleTimer = setTimeout(() => {
      this._idleTimer = undefined;
      this._idle = true;
      this.requestUpdate();
    }, Math.max(0, IDLE_PAUSE_MS - (Date.now() - lastInputAt)));
  }

  // ── Lit ──

  protected shouldUpdate(changed: PropertyValues): boolean {
    // a hass push only re-renders when a layer's own picture source changed
    if (this.hasUpdated && changed.size === 1 && changed.has('hass')) return this._signature() !== this._sig0;
    return true;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('layers')) this._rebuild();
    if (changed.has('layers') || changed.has('hass') || changed.has('host')) this._sync();
  }

  protected updated(): void {
    this._watch();
    this._arm();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.host) return nothing;
    const shown = this._items.filter((i) => !i.cfg.hidden).reverse(); // back to front
    return html`${shown.map((i) => keyed(i.index, this._box(i)))}`;
  }

  // ── model ──

  private _rebuild(): void {
    const list = Array.isArray(this.layers) ? this.layers.slice(0, MAX_BACKGROUND_LAYERS) : [];
    const old = this._items;
    const next: Item[] = [];
    list.forEach((cfg, index) => {
      if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return;
      const prev = old.find((o) => o.index === index && o.cfg.type === 'image' && cfg.type === 'image');
      const item: Item = prev ?? {
        index, cfg, states: Object.create(null), hasStates: false, camera: false, refresh: 10_000, gen: 0, loading: false,
        failures: 0, lastGood: 0, lastTry: 0, since: Date.now(), stale: false, evKey: '',
      };
      item.cfg = cfg;
      item.states = cfg.type === 'image' ? sanitiseStates(cfg.states) : item.states;
      item.hasStates = cfg.type === 'image' && cfg.states !== undefined && cfg.states !== null;
      item.pz = cfg.type === 'image' ? panZoomOf(cfg.pan_zoom) : undefined;
      const r = typeof cfg.refresh === 'number' && Number.isFinite(cfg.refresh) ? cfg.refresh : 10;
      item.refresh = Math.min(3600, Math.max(5, r)) * 1000;
      next.push(item);
    });
    for (const o of old) {
      if (!next.includes(o)) {
        clearTimeout(o.timer);
        clearTimeout(o.fadeTimer);
      }
    }
    this._items = next;
  }

  private _color(v: unknown, entity: string | undefined): string | undefined {
    if (typeof v !== 'string' || !v || v.length > 200 || !this.host) return undefined;
    return safeColor(this.host.cssColor(v, entity));
  }

  private _entityOf(i: Item): string | undefined {
    const id = i.cfg.entity;
    const e = typeof id === 'string' && ENTITY.test(id) ? id : undefined;
    return e ?? (i.hasStates || i.cfg.type !== 'image' ? this.host?.cardEntity() : undefined);
  }

  /** What an image layer wants to show right now. */
  private _source(i: Item): Src {
    const c = i.cfg;
    const host = this.host;
    if (!host) return { pending: true };
    const raw = typeof c.entity === 'string' && c.entity ? c.entity : undefined;
    if (raw !== undefined && !ENTITY.test(raw)) return { problem: 'entity-missing', detail: raw.slice(0, 64) };
    const ent = raw ?? (i.hasStates ? host.cardEntity() : undefined);
    let value: unknown;
    if (ent === undefined) {
      if (i.hasStates) return { problem: 'entity-missing' };
      value = c.image;
    } else {
      if (!this.hass) return { pending: true };
      const st = ENTITY.test(ent) ? this.hass.states?.[ent] : undefined;
      if (!st) return { problem: 'entity-missing', detail: ent };
      if (i.hasStates) {
        value = i.states[st.state] ?? c.image;
        if (typeof value !== 'string' || !value) return { problem: 'no-state-image', detail: st.state };
      } else {
        const a = typeof c.attribute === 'string' && ATTR.test(c.attribute) ? c.attribute : 'entity_picture';
        value = st.attributes && Object.prototype.hasOwnProperty.call(st.attributes, a) ? st.attributes[a] : undefined;
      }
    }
    if (typeof value !== 'string' || !value.trim()) return { problem: 'no-picture', detail: ent };
    const resolved = host.resolveImage(this.hass, value);
    if (resolved === undefined) return { pending: true };
    const url = safeImageUrl(resolved, location.href);
    return url ? { url } : { problem: 'load-failed' };
  }

  private _signature(): string {
    return this._items.map((i) => (i.cfg.type === 'image' && !i.cfg.hidden ? srcKey(this._source(i)) : '')).join('\n');
  }

  /** Bring every layer in line with the config and hass: start loads, drop what has no picture, report status. */
  private _sync(): void {
    this._sig0 = this._signature();
    for (const i of this._items) {
      const c = i.cfg;
      if (c.hidden) {
        this._status(i, 'empty');
      } else if (c.type === 'image') {
        const s = this._source(i);
        if (s.problem) {
          i.base = undefined;
          i.gen++;
          i.loading = false;
          i.shown = i.prev = undefined;
          this._status(i, s.problem === 'load-failed' ? 'error' : 'empty', s.problem, s.detail);
        } else if (s.pending) {
          if (!i.shown) this._status(i, 'loading');
        } else if (s.url !== i.base) {
          i.base = s.url;
          i.camera = !i.hasStates && !!this._entityOf(i)?.startsWith('camera.');
          void this._load(i, s.url!, false);
        }
      } else {
        const ok =
          c.type === 'gradient' ? !!gradientCss(c.gradient) : c.type === 'color' ? !!this._color(c.color, this._entityOf(i)) : c.type === 'pattern' && PATTERNS.includes(c.pattern as string);
        this._status(i, ok ? 'ok' : 'empty');
      }
    }
  }

  private _status(i: Item, status: BgLayerStatus['status'], reason?: BgLayerProblem, detail?: string | number): void {
    const key = `${status}|${reason ?? ''}`;
    if (key === i.evKey) return;
    i.evKey = key;
    const d: BgLayerStatus = { index: i.index, status, ...(reason ? { reason } : {}), ...(detail !== undefined ? { detail } : {}) };
    this.dispatchEvent(new CustomEvent<BgLayerStatus>(BG_LAYER_STATUS_EVENT, { bubbles: true, composed: true, detail: d }));
  }

  // ── loading, crossfade, refresh, stale ──

  private async _load(i: Item, base: string, bust: boolean): Promise<void> {
    const gen = ++i.gen;
    i.loading = true;
    i.lastTry = Date.now();
    if (!i.shown) this._status(i, 'loading');
    const ok = await decodeImage(bust ? busted(base) : base).then((r) => r, () => false);
    // a decode for an older source, or one that lands after disconnect, writes nothing
    if (gen !== i.gen || !this.isConnected || !this._items.includes(i)) return;
    i.loading = false;
    if (ok) {
      this._swap(i, bust ? busted(base) : base);
      i.failures = 0;
      i.lastGood = Date.now();
      this._evalStale(i);
      if (!i.stale) this._status(i, 'ok');
    } else if (i.camera) {
      i.failures++;
      this._evalStale(i);
      if (!i.stale) this._status(i, i.shown ? 'ok' : 'error', i.shown ? undefined : 'snapshot-failed', i.shown ? undefined : this._entityOf(i));
    } else {
      i.shown = i.prev = undefined;
      this._status(i, 'error', 'load-failed');
    }
    this.requestUpdate();
    this._schedule(i);
  }

  private _swap(i: Item, url: string): void {
    // the busted URL differs every time, so a camera frame crossfades like any new picture
    if (i.shown === url) return;
    i.prev = i.shown;
    i.shown = url;
    clearTimeout(i.fadeTimer);
    i.fadeTimer = undefined;
    if (i.prev && this._reduced) i.prev = undefined;
    else if (i.prev) {
      i.fadeTimer = setTimeout(() => {
        i.fadeTimer = undefined;
        i.prev = undefined;
        this.requestUpdate();
      }, FADE_MS);
    }
  }

  private _schedule(i: Item): void {
    if (!i.camera || i.cfg.hidden || i.timer !== undefined || i.loading || !i.base || !this._active()) return;
    const delay = i.lastTry ? Math.max(0, i.lastTry + i.refresh - Date.now()) : 0;
    i.timer = setTimeout(() => {
      i.timer = undefined;
      if (this._active() && i.base) void this._load(i, i.base, true);
    }, delay);
  }

  private _evalStale(i: Item): void {
    if (!i.camera || i.cfg.stale_badge === false) return;
    const age = Date.now() - (i.lastGood || i.since);
    const stale = i.failures >= STALE_FAILED_REFRESHES || age > Math.max(3 * i.refresh, STALE_MIN_AGE_MS);
    if (stale === i.stale) return;
    i.stale = stale;
    if (stale && i.shown) this._status(i, 'ok', 'stale', Math.floor(age / 1000));
    else if (stale) this._status(i, 'error', 'snapshot-failed', this._entityOf(i));
    this._updatePill();
    this._armPill();
  }

  private _armPill(): void {
    const any = this._items.some((i) => i.stale);
    if (any && this._active() && this._pillTimer === undefined) this._pillTimer = setInterval(() => this._updatePill(), PILL_TICK_MS);
    else if (!any || !this._active()) {
      clearInterval(this._pillTimer);
      this._pillTimer = undefined;
    }
  }

  private _updatePill(): void {
    const stale = this._items.filter((i) => i.stale);
    const badge = this.host?.badgeHost();
    if (!stale.length || !badge || !this.host) {
      this._removePill();
      return;
    }
    const secs = Math.floor(Math.max(...stale.map((i) => Date.now() - (i.lastGood || i.since))) / 1000);
    if (!this._pill) {
      this._pill = document.createElement('span');
      this._pill.setAttribute('style', PILL_STYLE);
      badge.appendChild(this._pill);
    }
    this._pill.textContent = this.host.staleText(secs);
    this.requestUpdate();
  }

  private _removePill(): void {
    this._pill?.remove();
    this._pill = undefined;
  }

  // ── render ──

  private _motion(pz: PanZoom): 'play' | 'pause' | 'start' | 'end' {
    if (this.preview) return this.preview;
    if (this._reduced || this.host?.lowPower()) return 'start';
    return this._active() && !(pz.idle && this._idle) ? 'play' : 'pause';
  }

  private _box(i: Item): TemplateResult {
    const c = i.cfg;
    const low = !!this.host?.lowPower();
    const blur = c.type === 'image' && !low ? blurOf(c.blur) : 0;
    const bleed = blur ? `${-3 * blur}px` : '0';
    const filters = [blur ? `blur(${blur}px)` : '', i.stale ? 'grayscale(1)' : ''].filter(Boolean).join(' ');
    const blend = !low && typeof c.blend === 'string' && BLENDS.includes(c.blend) ? c.blend : 'normal';
    const box = {
      top: bleed, right: bleed, bottom: bleed, left: bleed,
      opacity: String(+(opacityOf(c.opacity) * (i.stale ? 0.6 : 1)).toFixed(3)),
      'mix-blend-mode': blend,
      filter: filters || 'none',
    };
    return html`<div class="l" ${sty(box)}>${this._content(i)}</div>`;
  }

  private _content(i: Item): TemplateResult | typeof nothing {
    const c = i.cfg;
    if (c.type === 'image') {
      const urls = [i.prev, i.shown].filter((u): u is string => !!u);
      return html`${urls.map((u) => keyed(u, this._pic(i, u)))}`;
    }
    const ent = this._entityOf(i);
    if (c.type === 'color') {
      const col = this._color(c.color, ent);
      return col ? html`<div class="fill" ${sty({ 'background-color': col })}></div>` : nothing;
    }
    if (c.type === 'gradient') {
      const g = gradientCss(c.gradient);
      return g ? html`<div class="fill" ${sty({ 'background-image': g })}></div>` : nothing;
    }
    if (c.type === 'pattern' && PATTERNS.includes(c.pattern as string)) {
      const p = patternCss(c.pattern!, c.size, c.thickness, this._color(c.color, ent));
      return html`<div class="fill" ${sty({ 'background-image': p.image, 'background-size': p.size })}></div>`;
    }
    return nothing;
  }

  private _pic(i: Item, url: string): TemplateResult {
    const c = i.cfg;
    const size = sizeCss(c.size);
    const style: Record<string, string> = {
      'background-image': cssUrl(url),
      'background-position': positionCss(c.position),
      'background-size': size,
      'background-repeat': repeatCss(c.repeat, size),
    };
    const pz = i.pz;
    if (pz) {
      const k = (n: number) => `${+n.toFixed(2)}`;
      const reach = ((pz.to - 1) / 2) * 100;
      Object.assign(style, {
        '--f': k(pz.from), '--t': k(pz.to), '--tx': `${k(-pz.fx * reach)}%`, '--ty': `${k(-pz.fy * reach)}%`,
        '--d': `${pz.duration}s`, '--dir': pz.alternate ? 'alternate' : 'normal',
      });
    }
    return html`<div class="img"><div class=${pz ? 'pic pz' : 'pic'} data-pz=${pz ? this._motion(pz) : nothing} ${sty(style)}></div></div>`;
  }
}

/** Define <mc-bg-stack> once (guarded: a second copy of the chunk must not throw). */
export function defineBgStack(): void {
  if (!customElements.get(TAG)) customElements.define(TAG, McBgStack);
}
