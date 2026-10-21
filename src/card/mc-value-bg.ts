import { LitElement, css, html, nothing, PropertyValues, svg, TemplateResult } from 'lit';
import type { HomeAssistant } from '../types';
import { ResolvedValueBackground, sparklineHistory, sparklinePath } from '../utils/value-background';
import { entityNumber, isUnavailable } from '../utils/entity-value';
import { CachedHistory, getHistory, HISTORY_TTL_MS, HistorySample, peekHistory } from '../services/history-cache';
import { unwatchOffscreen, watchOffscreen } from '../icons/offscreen';
import { borderBoxSize, unwatchSize, watchSize } from './size-watch';

/*
 * Value background of a module / row / column wrapper or the card (design `value_background`,
 * src/utils/value-background.ts): an aria-hidden layer without pointer events behind the element's
 * content and above its own background (the parent, `data-mc-value-bg`, is an isolated stacking
 * context and the layer sits at z-index -1), clipped by its corner radius or shape clip-path.
 * - fill: a tank filled to the value's level from one side, moved with a transform (600 ms
 *   transition), with a scrolling wave on its surface; a faint hatch without a value, a 2 px floor
 *   line at a real 0. The wave pauses off-screen (the shared IntersectionObserver) and stands still
 *   for reduced motion.
 * - sparkline: the entity's recorded history (the shared history cache: one fetch per entity /
 *   hours / attribute, however many readers) over the last `hours` up to now, in the lower ~65% of
 *   the element, with the live value appended (without one the last value is held, dashed). Fetches
 *   only while on screen (before the first off-screen report and off-screen it shows what is
 *   cached); asks the cache again when its history goes stale. The bucketed history is worked out
 *   once per fetch. Only a sparkline measures its size (the ResizeObserver rings share).
 */

const REDUCED = '(prefers-reduced-motion: reduce)';
/** The wave strip: four periods over twice the layer's width, scrolled by half of it per cycle. */
const WAVE_PATH = 'M0 5Q12.5 0 25 5T50 5T75 5T100 5T125 5T150 5T175 5T200 5V10H0Z';
/** The sparkline keeps out of the top 35% (where a module's text usually sits). */
const SPARK_TOP = 0.35;

const same = (a?: ResolvedValueBackground, b?: ResolvedValueBackground) => JSON.stringify(a) === JSON.stringify(b);
const r2 = (n: number) => Math.round(n * 100) / 100;

export class McValueBg extends LitElement {
  static properties = {
    value: { attribute: false, hasChanged: (a?: ResolvedValueBackground, b?: ResolvedValueBackground) => !same(a, b) },
    offscreen: { type: Boolean },
    _size: { state: true },
  };

  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      z-index: -1;
      display: block;
      overflow: hidden;
      pointer-events: none;
      border-radius: inherit;
      container-type: size;
    }
    /* no value: a faint hatch (a real 0 is an empty tank with a floor line) */
    .hatch {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        135deg,
        color-mix(in srgb, var(--mc-vb-color) 35%, transparent) 0 2px,
        transparent 2px 8px
      );
    }
    .floor {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: color-mix(in srgb, var(--mc-vb-color) 60%, transparent);
    }
    .fill {
      position: absolute;
      inset: 0;
    }
    /* other directions turn the layer (left / right: its sides swapped) */
    .fill[data-dir='down'] {
      transform: rotate(180deg);
    }
    .fill[data-dir='left'],
    .fill[data-dir='right'] {
      inset: auto;
      left: 50%;
      top: 50%;
      width: 100cqh;
      height: 100cqw;
      transform: translate(-50%, -50%) rotate(90deg);
    }
    .fill[data-dir='left'] {
      transform: translate(-50%, -50%) rotate(-90deg);
    }
    .liquid {
      position: absolute;
      inset: 0;
      background: var(--mc-vb-paint);
      transition: transform 600ms ease-in-out;
    }
    .wave {
      position: absolute;
      left: 0;
      bottom: calc(100% - 1px);
      width: 200%;
      height: 8px;
      fill: var(--mc-vb-color);
    }
    .wave[data-animate] {
      animation: mc-vb-wave 3s linear infinite;
    }
    :host([offscreen]) .wave {
      animation-play-state: paused;
    }
    @keyframes mc-vb-wave {
      to {
        transform: translateX(-50%);
      }
    }
    svg.spark {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    /* behind text: the line stays faint (the theme can turn it up) */
    .line {
      fill: none;
      opacity: var(--mc-value-bg-line-opacity, 0.45);
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @media (prefers-reduced-motion: reduce) {
      .liquid {
        transition: none;
      }
      .wave {
        animation: none !important;
      }
    }
  `;

  value?: ResolvedValueBackground;

  /** Set by the shared off-screen observer while the layer is watched (a moving wave, a sparkline). */
  offscreen = false;

  private _size?: { w: number; h: number };

  private _hass?: HomeAssistant;
  private _media?: MediaQueryList;
  private _onMedia = () => this.requestUpdate();
  private _onFetched = () => this.requestUpdate();
  private _watchingSize = false;
  private _watchingScreen = false;
  /** Was the screen watch started as pausable (a moving wave) or not (a sparkline)? */
  private _watchPausable = true;
  /** The last off-screen report: undefined before the first one (nothing is fetched until then). */
  private _onScreen?: boolean;
  private _timer?: ReturnType<typeof setTimeout>;
  /** When the timer fires (just after the cached history goes stale). */
  private _timerAt?: number;
  /** The bucketed history of one fetched history: per render only the live value is appended. */
  private _memo?: { hist: CachedHistory; hours: number; points: HistorySample[]; last?: number };

  /** The card's hass: a sparkline re-renders when its entity's state changes (the live value). */
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }
  set hass(h: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = h;
    const id = this.value?.type === 'sparkline' ? this.value.entity : undefined;
    if (!id) return;
    if (!old || !h || old.states?.[id] !== h.states?.[id]) this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    if (this.hasUpdated) this._sync();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = undefined;
    this._unwatchSize();
    this._unwatchScreen();
    this._clearTimer();
  }

  /** Read the layer's size (sparklines only). */
  measure(): void {
    const { w, h } = borderBoxSize(this);
    if (!this._size || Math.abs(this._size.w - w) > 0.5 || Math.abs(this._size.h - h) > 0.5) this._size = { w, h };
  }

  private _reduced(): boolean {
    return !!this._media?.matches;
  }

  /** The wave scrolls: a fill with a wave, partly full, motion allowed. */
  private _waveMoves(): boolean {
    const v = this.value;
    return !!v && v.type === 'fill' && v.wave && this._level() > 0 && this._level() < 0.99 && !this._reduced();
  }

  private _level(): number {
    const l = this.value?.level;
    return l === undefined || !Number.isFinite(l) ? 0 : Math.min(1, Math.max(0, l));
  }

  private _unwatchSize(): void {
    if (this._watchingSize) unwatchSize(this, this);
    this._watchingSize = false;
  }

  private _unwatchScreen(): void {
    if (this._watchingScreen) unwatchOffscreen(this);
    this._watchingScreen = false;
    this._onScreen = undefined;
  }

  private _clearTimer(): void {
    if (this._timer !== undefined) clearTimeout(this._timer);
    this._timer = undefined;
    this._timerAt = undefined;
  }

  /** The cached history of a sparkline, without fetching. */
  private _peek(v: ResolvedValueBackground): CachedHistory | undefined {
    return v.entity ? peekHistory(v.entity, v.hours, v.attribute) : undefined;
  }

  /** A report of the shared off-screen observer: on screen with stale (or no) history → render (a fetch). */
  private _onReport = (onScreen: boolean): void => {
    const was = this._onScreen;
    this._onScreen = onScreen;
    const v = this.value;
    if (!onScreen || was === true || !this.isConnected || v?.type !== 'sparkline') return;
    const hist = this._peek(v);
    if (!hist || Date.now() - hist.timestamp > HISTORY_TTL_MS) this.requestUpdate();
  };

  /** Observers and timers for what is drawn now (none for a still fill, nothing once disconnected). */
  private _sync(): void {
    // an update after disconnect (the offscreen attribute removed, a fetch that finished) arms nothing
    if (!this.isConnected) return;
    const v = this.value;
    const spark = v?.type === 'sparkline';
    if (spark && !this._watchingSize) {
      watchSize(this, this);
      this._watchingSize = true;
      this.measure();
    } else if (!spark) this._unwatchSize();
    const watch = spark || this._waveMoves();
    // a sparkline updates but does not move: it keeps updating in a paused card and is no motion (card-pause 1.0.0)
    if (watch && this._watchingScreen && this._watchPausable === spark) this._unwatchScreen();
    if (watch && !this._watchingScreen) {
      this._watchingScreen = true;
      this._watchPausable = !spark;
      this._onScreen = undefined;
      // nothing reports without an IntersectionObserver: on screen
      if (!watchOffscreen(this, this._onReport, { pausable: !spark })) this._onScreen = true;
    } else if (!watch) this._unwatchScreen();
    // the cached history goes stale 5 minutes after its fetch: ask again just after that. Already
    // stale or missing: a fetch is running or starts once on screen, and its re-render arms the timer.
    const hist = spark && v ? this._peek(v) : undefined;
    const due = hist ? hist.timestamp + HISTORY_TTL_MS + 1000 : undefined;
    if (due === undefined || due <= Date.now()) this._clearTimer();
    else if (this._timerAt !== due) {
      this._clearTimer();
      this._timerAt = due;
      this._timer = setTimeout(() => {
        this._timer = undefined;
        this._timerAt = undefined;
        if (!this.isConnected) return;
        // off-screen: the next on-screen report finds the history stale
        if (this._onScreen) this.requestUpdate();
      }, due - Date.now());
    }
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._sync();
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const v = this.value;
    // no value: an empty, hatched tank
    this.toggleAttribute('data-empty', !!v && v.type === 'fill' && v.level === undefined);
  }

  protected render(): TemplateResult | typeof nothing {
    const v = this.value;
    if (!v) return nothing;
    return v.type === 'fill' ? this._renderFill(v) : this._renderSparkline(v);
  }

  private _renderFill(v: ResolvedValueBackground): TemplateResult {
    const level = this._level();
    const wave = v.wave && level > 0 && level < 0.99;
    const empty = v.level === undefined;
    return html`${empty ? html`<div class="hatch" style="--mc-vb-color: ${v.color}"></div>` : nothing}
      <div class="fill" data-dir=${v.direction} style="--mc-vb-color: ${v.color}; --mc-vb-paint: ${v.paint ?? v.color}">
        ${!empty && level <= 0 ? html`<div class="floor"></div>` : nothing}
        <div class="liquid" style="opacity: ${v.opacity}; transform: translateY(${r2((1 - level) * 100)}%)">
          ${wave
            ? html`<svg class="wave" ?data-animate=${this._waveMoves()} viewBox="0 0 200 10" preserveAspectRatio="none" focusable="false">
                <path d=${WAVE_PATH}></path>
              </svg>`
            : nothing}
        </div>
      </div>`;
  }

  /**
   * The cached history. On screen a fetch starts when it is missing or stale; before the first
   * off-screen report, off-screen and disconnected only what is cached. Undefined until it arrived.
   */
  private _history(v: ResolvedValueBackground): CachedHistory | undefined {
    const hass = this._hass;
    if (!v.entity) return undefined;
    if (this._onScreen && this.isConnected && hass && typeof hass.callWS === 'function') {
      return getHistory(hass, v.entity, v.hours, v.attribute, this._onFetched);
    }
    return this._peek(v);
  }

  /** The bucketed history of a fetched history (worked out once per fetch and window length). */
  private _historyPoints(hist: CachedHistory, hours: number): { points: HistorySample[]; last?: number } {
    const m = this._memo;
    if (m && m.hist === hist && m.hours === hours) return m;
    const end = hist.timestamp;
    this._memo = { hist, hours, ...sparklineHistory(hist.samples, end - hours * 3600_000, end) };
    return this._memo;
  }

  private _renderSparkline(v: ResolvedValueBackground): TemplateResult | typeof nothing {
    const hist = this._history(v);
    const size = this._size;
    // a failed fetch draws nothing; a failed refetch still draws the history fetched before
    if (!hist || !hist.samples.length || !size || !(size.w > 0 && size.h > 0)) return nothing;
    const end = Date.now();
    const start = end - v.hours * 3600_000;
    const { points: history, last } = this._historyPoints(hist, v.hours);
    const points = history.slice();
    // the live value, appended (the history is up to 5 minutes old); without one the last value is held
    const stateObj = v.entity ? this._hass?.states?.[v.entity] : undefined;
    const live = isUnavailable(stateObj, v.attribute) ? undefined : entityNumber(stateObj, v.attribute);
    if (live !== undefined && (!points.length || points[points.length - 1].t < end)) points.push({ t: end, v: live });
    const top = Math.round(size.h * SPARK_TOP);
    const { line, area, tail } = sparklinePath(points, size.w, size.h - top, {
      min: v.min,
      max: v.max,
      smoothing: v.smoothing,
      area: v.area,
      pad: v.lineWidth / 2 + 1,
      start,
      end,
      hold: live === undefined ? last : undefined,
      splitHeld: live === undefined,
    });
    if (!line && !tail) return nothing;
    const stroke = `stroke: ${v.color}; stroke-width: ${v.lineWidth}px`;
    return html`<svg class="spark" viewBox="0 0 ${r2(size.w)} ${r2(size.h)}" preserveAspectRatio="none" focusable="false">
      ${area
        ? svg`<defs>
            <linearGradient id="mc-vb-area" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" style="stop-color: ${v.color}; stop-opacity: ${v.opacity}"></stop>
              <stop offset="1" style="stop-color: ${v.color}; stop-opacity: 0"></stop>
            </linearGradient>
          </defs>`
        : nothing}
      <g transform="translate(0 ${top})">
        ${area ? svg`<path class="area" d=${area} fill="url(#mc-vb-area)"></path>` : nothing}
        ${line ? svg`<path class="line" d=${line} style=${stroke}></path>` : nothing}
        ${tail ? svg`<path class="line tail" d=${tail} style=${stroke} stroke-dasharray="3 3"></path>` : nothing}
      </g>
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-value-bg': McValueBg;
  }
}
