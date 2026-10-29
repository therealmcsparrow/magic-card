import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import type { HomeAssistant } from '../../types';
import { BG_LAYER_STATUS_EVENT, MAX_BACKGROUND_LAYERS } from '../../contracts/bg-stack.needs';
import { LAYER_BLENDS } from '../../contracts/layer-placement.needs';
import type { BackgroundLayerConfig, BgLayerProblem, BgLayerStatus, BgStackHost, BgStackItem, BgStackRun, BgStackView } from '../../contracts/bg-stack';
import { safeColor } from '../../utils/safe-css';
import { blurOf, cssUrl, gradientCss, opacityOf, patternCss, positionCss, repeatCss, safeImageUrl, sanitiseStates, sizeCss } from './values';
import { currentFx, liveStacks } from './fx-slot';

/*
 * <mc-bg-stack>: the card backdrop. Everything it needs from magic-card.js comes through `host`.
 * Rules this file keeps:
 * - every URL goes through safeImageUrl, every colour through host.cssColor + safeColor, gradients are
 *   rebuilt from parseGradient output, enums are allow-listed (values.ts); per-instance CSS only through the CSSOM (sty directive, one validated value per property);
 * - blur sits on a static outer box; a moving picture (pan / zoom) is a transform animation on the inner image box;
 * - pan / zoom, camera refresh, the stale state and the idle, visibility and reduced-motion wiring belong to
 *   the BgStackRun that fx-slot.ts hands over (host.observeOffscreen sets `offscreen`); without it a picture
 *   shows unscaled and a camera layer keeps its first frame;
 * - a decode that resolves after disconnect, or for an older source, writes nothing;
 * - a value that starts with `mcu-image:` is a library image: never a URL, never decoded, drawn by <mc-svg-image> (the chunk's).
 */

const TAG = 'mc-bg-stack';
const FADE_MS = 300;
const REDUCED = '(prefers-reduced-motion: reduce)';
const ENTITY = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const ATTR = /^[A-Za-z0-9_]{1,64}$/;
const PATTERNS: readonly string[] = ['dots', 'grid', 'lines', 'diagonal', 'checks'];
const BLENDS = LAYER_BLENDS as readonly string[];

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

interface Src {
  url?: string;
  pending?: boolean;
  problem?: BgLayerProblem;
  detail?: string;
}

/** `fade`: the newest picture arrived on screen with motion allowed, so its element carries the arrival fade. */
type Item = BgStackItem & { fade?: boolean };

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

/** IMAGE_REF_PREFIX of svg-image 1.0.0, written out: importing the contract file would put its allow-lists in magic-card.js. */
const isRef = (v: string): boolean => v.startsWith('mcu-image:');

const srcKey = (s: Src): string => `${s.url ?? ''}|${s.pending ? 1 : 0}|${s.problem ?? ''}|${s.detail ?? ''}`;

export class McBgStack extends LitElement implements BgStackView {
  static styles = css`
    :host{display:block;position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1;overflow:hidden;border-radius:inherit;pointer-events:none}
    .l,.img,.fill,.pic{position:absolute;top:0;right:0;bottom:0;left:0}
    .img.in{animation:mcbg-in .3s ease-out}
    .pz{animation:mcbg-pz var(--d) ease-in-out infinite var(--dir);animation-play-state:paused}
    .pz[data-pz=play]{animation-play-state:running}
    .pz[data-pz=start],.pz[data-pz=end]{animation:none;transform:translate(var(--x0,0),var(--y0,0)) scale(var(--s0))}
    .pz[data-pz=end]{--x0:var(--tx);--y0:var(--ty);--s0:var(--t)}
    .pz[data-pz=start]{--s0:var(--f)}
    @keyframes mcbg-in{from{opacity:0}}
    @keyframes mcbg-pz{from{transform:scale(var(--f))}to{transform:translate(var(--tx),var(--ty)) scale(var(--t))}}
    @media (prefers-reduced-motion:reduce){.img.in{animation:none}}
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

  items: Item[] = [];

  private _sig0 = '';
  private _obsHost?: BgStackHost;
  private _stopObs?: () => void;
  private _run?: BgStackRun;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    liveStacks.add(this);
    this.fxOn();
    this._watch();
    if (this.hasUpdated) {
      this._sync();
      this.requestUpdate();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    liveStacks.delete(this);
    this._stopObs?.();
    this._stopObs = this._obsHost = undefined;
    this._run?.stop();
    this._run = undefined;
    for (const i of this.items) {
      i.fade = false;
      clearTimeout(i.fadeTimer);
      i.fadeTimer = undefined;
      i.prev = undefined;
      if (i.loading) {
        i.loading = false;
        i.gen++;
        i.base = undefined;
      }
    }
  }

  /** Take the motion and refresh part once it exists; a shown moving picture whose start framing is scaled fades in over its still frame. */
  fxOn(): void {
    const fx = currentFx();
    if (!fx || this._run || !this.isConnected) return;
    this._run = fx.attach(this);
    if (!this.hasUpdated) return;
    this._rebuild();
    for (const i of this.items) {
      if (i.camera && !i.shown) i.base = undefined;
      if (i.pz && i.pz.from !== 1 && i.shown && !i.prev) {
        i.prev = i.shown;
        this._fade(i);
      }
    }
    this._sync();
    this.requestUpdate();
  }

  private _watch(): void {
    if (!this.isConnected || !this.host || this._obsHost === this.host) return;
    this._stopObs?.();
    this._obsHost = this.host;
    this._stopObs = this.host.observeOffscreen(this);
  }

  // ── Lit ──

  protected shouldUpdate(changed: PropertyValues): boolean {
    // a hass push only re-renders when a layer's own picture source changed
    // (a shown library image takes every push: its element reads hass)
    if (this.hasUpdated && changed.size === 1 && changed.has('hass')) return this._signature() !== this._sig0 || this.items.some((i) => i.shown && isRef(i.shown));
    return true;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('layers')) this._rebuild();
    if (changed.has('layers') || changed.has('hass') || changed.has('host')) this._sync();
  }

  protected updated(): void {
    this._watch();
    this._run?.arm();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.host) return nothing;
    const shown = this.items.filter((i) => !i.cfg.hidden).reverse(); // back to front
    return html`${shown.map((i) => keyed(i.index, this._box(i)))}`;
  }

  // ── model ──

  private _rebuild(): void {
    const list = Array.isArray(this.layers) ? this.layers.slice(0, MAX_BACKGROUND_LAYERS) : [];
    const old = this.items;
    const next: Item[] = [];
    list.forEach((cfg, index) => {
      if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return;
      const prev = old.find((o) => o.index === index && o.cfg.type === 'image' && cfg.type === 'image');
      const item: Item = prev ?? {
        index, cfg, states: Object.create(null), hasStates: false, camera: false, gen: 0, loading: false,
        lastTry: 0, since: Date.now(), stale: false, evKey: '',
      };
      item.cfg = cfg;
      item.states = cfg.type === 'image' ? sanitiseStates(cfg.states) : item.states;
      item.hasStates = cfg.type === 'image' && cfg.states !== undefined && cfg.states !== null;
      item.pz = cfg.type === 'image' ? this._run?.pan(cfg.pan_zoom) : undefined;
      next.push(item);
    });
    for (const o of old) {
      if (!next.includes(o)) {
        clearTimeout(o.timer);
        clearTimeout(o.fadeTimer);
      }
    }
    this.items = next;
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
    if (isRef(value)) return { url: value };
    const resolved = host.resolveImage(this.hass, value);
    if (resolved === undefined) return { pending: true };
    const url = safeImageUrl(resolved, location.href);
    return url ? { url } : { problem: 'load-failed' };
  }

  private _signature(): string {
    return this.items.map((i) => (i.cfg.type === 'image' && !i.cfg.hidden ? srcKey(this._source(i)) : '')).join('\n');
  }

  /** Bring every layer in line with the config and hass: start loads, drop what has no picture, report status. */
  private _sync(): void {
    this._sig0 = this._signature();
    for (const i of this.items) {
      const c = i.cfg;
      if (c.hidden) {
        this.status(i, 'empty');
      } else if (c.type === 'image') {
        const s = this._source(i);
        if (s.problem) {
          i.base = undefined;
          i.gen++;
          i.loading = false;
          i.shown = i.prev = undefined;
          this.status(i, s.problem === 'load-failed' ? 'error' : 'empty', s.problem, s.detail);
        } else if (s.pending) {
          if (!i.shown) this.status(i, 'loading');
        } else if (s.url !== i.base) {
          i.base = s.url;
          i.camera = !i.hasStates && !!this._entityOf(i)?.startsWith('camera.');
          void this.load(i, s.url!);
        }
      } else {
        const ok =
          c.type === 'gradient' ? !!gradientCss(c.gradient) : c.type === 'color' ? !!this._color(c.color, this._entityOf(i)) : c.type === 'pattern' && PATTERNS.includes(c.pattern as string);
        this.status(i, ok ? 'ok' : 'empty');
      }
    }
  }

  status(i: Item, status: BgLayerStatus['status'], reason?: BgLayerProblem, detail?: string | number): void {
    const key = `${status}|${reason ?? ''}`;
    if (key === i.evKey) return;
    i.evKey = key;
    const d: BgLayerStatus = { index: i.index, status, ...(reason ? { reason } : {}), ...(detail !== undefined ? { detail } : {}) };
    this.dispatchEvent(new CustomEvent<BgLayerStatus>(BG_LAYER_STATUS_EVENT, { bubbles: true, composed: true, detail: d }));
  }

  // ── loading, crossfade ──

  /** Decode `url` (default `base`) off the DOM, then swap it in. A refresh passes a cache-busted `url`. */
  async load(i: Item, base: string, url: string = base): Promise<void> {
    const gen = ++i.gen;
    if (isRef(url)) {
      // a library image: the chunk draws it, nothing to decode
      i.loading = false;
      this.host?.needImage();
      this._swap(i, url);
      this.status(i, 'ok');
      this.requestUpdate();
      return;
    }
    i.loading = true;
    i.lastTry = Date.now();
    if (!i.shown) this.status(i, 'loading');
    const ok = await decodeImage(url).then((r) => r, () => false);
    // a decode for an older source, or one that lands after disconnect, writes nothing
    if (gen !== i.gen || !this.isConnected || !this.items.includes(i)) return;
    i.loading = false;
    if (ok) {
      this._swap(i, url);
      this._run?.good(i);
      if (!i.stale) this.status(i, 'ok');
    } else if (i.camera && this._run) {
      this._run.bad(i);
    } else {
      i.shown = i.prev = undefined;
      this.status(i, 'error', 'load-failed');
    }
    this.requestUpdate();
    this._run?.schedule(i);
  }

  private _swap(i: Item, url: string): void {
    // the busted URL differs every time, so a camera frame crossfades like any new picture
    if (i.shown === url) return;
    i.prev = i.shown;
    i.shown = url;
    this._fade(i);
  }

  /**
   * Fade the new picture in over `prev` for FADE_MS. Under reduced motion, off screen or paused the picture
   * is shown at once and is not marked, so its element never gets the animation, now or when the card runs again.
   */
  private _fade(i: Item): void {
    clearTimeout(i.fadeTimer);
    i.fadeTimer = undefined;
    i.fade = !(window.matchMedia?.(REDUCED).matches || this.hasAttribute('offscreen'));
    if (!i.fade) i.prev = undefined;
    else if (i.prev) {
      i.fadeTimer = setTimeout(() => {
        i.fadeTimer = undefined;
        i.prev = undefined;
        this.requestUpdate();
      }, FADE_MS);
    }
  }

  // ── render ──

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
      return html`${urls.map((u, k) => keyed(u, this._pic(i, u, !k && i.prev === i.shown)))}`;
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

  private _pic(i: Item, url: string, still: boolean): TemplateResult {
    const c = i.cfg;
    const size = sizeCss(c.size);
    const live = isRef(url);
    const style: Record<string, string> = live
      ? {}
      : {
          'background-image': cssUrl(url),
          'background-position': positionCss(c.position),
          'background-size': size,
          'background-repeat': repeatCss(c.repeat, size),
        };
    // the still frame under a moving picture of the same URL fading in stays unscaled
    const pz = still ? undefined : i.pz;
    if (pz) {
      const k = (n: number) => `${+n.toFixed(2)}`;
      const reach = ((pz.to - 1) / 2) * 100;
      Object.assign(style, {
        '--f': k(pz.from), '--t': k(pz.to), '--tx': `${k(-pz.fx * reach)}%`, '--ty': `${k(-pz.fy * reach)}%`,
        '--d': `${pz.duration}s`, '--dir': pz.alternate ? 'alternate' : 'normal',
      });
    }
    return html`<div class=${!still && i.fade ? 'img in' : 'img'}><div class=${pz ? 'pic pz' : 'pic'} data-pz=${pz ? (this._run?.motion(pz) ?? nothing) : nothing} ${sty(style)}>${
      live ? html`<mc-svg-image .ref=${url} .hass=${this.hass} .layer=${c} .at=${i.index}></mc-svg-image>` : nothing
    }</div></div>`;
  }
}

/** Define <mc-bg-stack> once (guarded: a second copy of the module must not throw). */
export function defineBgStack(): void {
  if (!customElements.get(TAG)) customElements.define(TAG, McBgStack);
}
