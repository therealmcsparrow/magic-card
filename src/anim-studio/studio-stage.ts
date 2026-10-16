import { LitElement, html, css, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { editorPrimitives, editorTokens } from '../css/editor-system';
import { compileAnimationDoc } from './compile';
import type { AnimationDoc } from './model';
import { previewConfig } from './studio-model';
import { TILES, tileHass, type PreviewTile } from './tiles';
import type { PreviewChangeDetail, StageInfo } from './slots';
import { DEFAULT_SIM, SIM_ENTITY, applyPreviewChange, simulates, withSimEntity, type PreviewSim } from './editors/states-sim';

/*
 * The studio's preview stage: the real `magic-card` (already loaded by the page, never defined
 * here) playing the edited document on an icon, button or text tile, on a light or dark card, with
 * speed, play / pause, scrub and a reduced-motion preview (the still state the card shows then).
 *
 * The card is laid out at its natural width (FRAME_WIDTH) and scaled down to fit the canvas
 * (`transform: scale(k)`, k <= MAX_ZOOM = 1: never enlarged), so the stage never scrolls and never
 * grows its column. With `zoomIcon` (the studio sets it while icon parts or drawing tools are in use)
 * the stage zooms to the card's icon instead: the icon's box, with some room around it, fills the
 * canvas (up to ICON_ZOOM) and the rest of the card is cut off. The overlay slot (path overlay,
 * stage tools) is scaled and moved with the card: overlays draw in unscaled card px, and
 * `stage-rect` reports unscaled sizes plus the scale.
 *
 * A document with states or bindings (or a panel's `preview-change`, `.preview`) plays from a
 * simulated entity: the animation entry gets `entity: PREVIEW_ENTITY` and the preview hass carries
 * its state and attributes (track E's states-sim). The tile's own entities (the card tile's sensor)
 * are added with tileHass.
 */

export type StageTheme = 'light' | 'dark';

const THEMES: Array<{ id: StageTheme; label: string; icon: string }> = [
  { id: 'light', label: 'Light card', icon: 'mdi:white-balance-sunny' },
  { id: 'dark', label: 'Dark card', icon: 'mdi:weather-night' },
];
export const SPEEDS = [0.25, 0.5, 1, 1.5, 2];
/** The preview card's natural width (px), before it is scaled to fit. */
export const FRAME_WIDTH = 360;
/** Canvas padding around the scaled card (px). */
const FIT_PAD = 16;

/** The preview card's simulated entity (track E's SIM_ENTITY; a panel's `preview-change` sets its state). */
export const PREVIEW_ENTITY = SIM_ENTITY;

/** The simulation the stage plays: the default one with the panels' preview-change merged in. */
export const previewSim = (p: PreviewChangeDetail | undefined): PreviewSim => (p ? applyPreviewChange(DEFAULT_SIM, p) : DEFAULT_SIM);

/**
 * The preview drives its animation entry from the simulated entity (`entity:` on the entry, not on
 * the module), so states and value bindings react on every tile while the module keeps its own
 * entity (the card tile still shows its name and state).
 */
export const drivesPreview = (doc: AnimationDoc | undefined, p: PreviewChangeDetail | undefined): boolean => !!p || simulates(doc);

/** The scale that fits a `fw` x `fh` frame into an `aw` x `ah` area (never above `max`, never below 0.2). */
export function fitScale(aw: number, ah: number, fw: number, fh: number, max = 1): number {
  if (!(fw > 0) || !(fh > 0) || !(aw > 0) || !(ah > 0)) return 1;
  return Math.max(0.2, Math.min(max, aw / fw, ah / fh));
}

/** The card is never drawn larger than it is on a dashboard (only scaled down to fit). */
export const MAX_ZOOM = 1;
/** Zoomed to the icon: at most this scale, with this much room (card px) around the icon. */
export const ICON_ZOOM = 4;
const ICON_ROOM = 20;

/**
 * Zoomed to an icon box (unscaled card px) in an `aw` x `ah` canvas: the scale and the frame's offset
 * that put the icon, with ICON_ROOM around it, in the middle of the canvas (padding FIT_PAD).
 */
export function iconZoom(aw: number, ah: number, box: { x: number; y: number; width: number; height: number }): { k: number; x: number; y: number } {
  const k = Math.round(fitScale(aw - 2 * FIT_PAD, ah - 2 * FIT_PAD, box.width + 2 * ICON_ROOM, box.height + 2 * ICON_ROOM, ICON_ZOOM) * 1000) / 1000;
  return { k, x: Math.round(aw / 2 - (box.x + box.width / 2) * k), y: Math.round(ah / 2 - (box.y + box.height / 2) * k) };
}

/** HA theme variables of the light and dark preview cards. */
const THEME_VARS: Record<StageTheme, string> = {
  light:
    '--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#f2f3f5;--primary-text-color:#212121;--secondary-text-color:#5f6368;--divider-color:rgba(0,0,0,.12);--state-icon-color:#44739e;color-scheme:light',
  dark: '--card-background-color:#1c1c1c;--primary-background-color:#111111;--secondary-background-color:#282a2d;--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--divider-color:rgba(225,225,225,.12);--state-icon-color:#9fbcd9;color-scheme:dark',
};

type CardElement = HTMLElement & { setConfig(c: unknown): void; hass?: unknown };

/** A hass for the preview when the page has none (the standalone studio). */
export function standaloneHass(dark: boolean): Record<string, unknown> {
  return {
    states: {},
    entities: {},
    language: 'en',
    locale: { language: 'en', number_format: 'language', time_format: 'language' },
    themes: { themes: {}, darkMode: dark },
    callWS: async () => ({}),
    callService: async () => undefined,
  };
}

/** Every Web / CSS animation running inside `root`, its nested shadow roots included. */
export function animationsIn(root: ShadowRoot | null | undefined): Animation[] {
  const out = new Set<Animation>();
  const walk = (r: ShadowRoot): void => {
    for (const a of (r as ShadowRoot & { getAnimations?: () => Animation[] }).getAnimations?.() ?? []) out.add(a);
    for (const el of r.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
  };
  if (root) walk(root);
  return [...out];
}

/** Seconds of one cycle of `doc` (what the scrubber spans). */
export function cycleSeconds(doc: AnimationDoc, lookup?: (id: string) => AnimationDoc | undefined): number {
  if (doc.kind === 'sequence') {
    const total = compileAnimationDoc(doc, { lookup }).schedule?.total ?? 0;
    return total > 0 ? total : 1;
  }
  const speed = doc.kind === 'particles' && !doc.particles?.preset ? doc.particles?.speed || 1 : 1;
  return Math.max(0.05, doc.duration / speed);
}

/** The page is dark: its text colour is light. */
function isDarkText(el: Element): boolean {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(el).color || '');
  if (!m) return false;
  const [r, g, b] = m.slice(1).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
}

export class AnimationStage extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) lookup: (id: string) => AnimationDoc | undefined = () => undefined;
  @property({ attribute: false }) hass?: Record<string, unknown>;
  /** The preview tile (the studio owns it; a pick here emits `stage-tile` { tile }). */
  @property({ attribute: false }) tile: PreviewTile = 'icon';
  /** The simulated entity of the preview (a panel's preview-change); none: no entity. */
  @property({ attribute: false }) preview?: PreviewChangeDetail;
  /** The target whose box `stage-rect` reports as the subject (default: what the document moves). */
  @property({ attribute: false }) subjectTarget?: string;
  /** Zoom to the card's icon (icon parts and drawing tools); no icon on the tile: the whole card. */
  @property({ type: Boolean }) zoomIcon = false;

  @state() theme: StageTheme = 'light';
  @state() reduced = false;
  @state() speed = 1;
  @state() playing = true;
  /** Position in the cycle, seconds. */
  @state() private _t = 0;
  /** The card's scale in the canvas (fit) and its unscaled height. */
  @state() private _k = 1;
  @state() private _fh = 0;
  /** Zoomed to the icon: the frame's offset in the canvas (px). */
  @state() private _off?: { x: number; y: number };

  private _card?: CardElement;
  private _raf = 0;
  private _last = 0;
  private _poll?: ReturnType<typeof setInterval>;
  private _hassFor?: { src: unknown; theme: StageTheme; tile: PreviewTile; sim?: PreviewSim; value: unknown };
  private _ro?: ResizeObserver;
  private _lastTimeEvent = 0;
  private _sentTime = -1;

  private _themeSet = false;
  /** Per animation: its own rate and the rate the stage set (see _rate). */
  private _rates = new WeakMap<Animation, { base: number; set: number }>();
  /** The preview's entry is driven by the simulated entity. */
  private _drives = false;

  connectedCallback(): void {
    super.connectedCallback();
    // the preview card starts in the page's theme (HA's dark mode, else the text colour's lightness)
    if (!this._themeSet) {
      this._themeSet = true;
      const dark = (this.hass?.themes as { darkMode?: boolean } | undefined)?.darkMode;
      this.theme = (dark ?? isDarkText(this)) ? 'dark' : 'light';
    }
    if (!customElements.get('magic-card')) void customElements.whenDefined('magic-card').then(() => this.requestUpdate());
    this._poll = setInterval(() => this._sync(), 250);
    this._loop();
    if (this.hasUpdated) this._observeFrame();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = undefined;
    cancelAnimationFrame(this._raf);
    this._raf = 0;
    if (this._poll) clearInterval(this._poll);
    this._poll = undefined;
  }

  /** The preview card (once magic-card is defined). */
  get card(): CardElement | undefined {
    return this._card;
  }

  get cycle(): number {
    return this.doc ? cycleSeconds(this.doc, this.lookup) : 1;
  }

  /** The card's scale in the canvas (1: natural size). */
  get scale(): number {
    return this._k;
  }

  togglePlay(): void {
    if (this.playing) this.pause();
    else this.play();
  }

  play(): void {
    this.playing = true;
    for (const a of this._anims()) {
      this._rate(a);
      a.play();
    }
  }

  pause(): void {
    this.playing = false;
    for (const a of this._anims()) a.pause();
  }

  /** Jump to `seconds` into the cycle and hold there. */
  seek(seconds: number): void {
    this.playing = false;
    this._t = Math.min(this.cycle, Math.max(0, seconds));
    for (const a of this._anims()) {
      a.pause();
      a.currentTime = this._t * 1000;
    }
    this._emitTime(true);
  }

  /** `stage-time` { time: 0-1 }: the scrub position, for the editors' playheads (about 30 per second). */
  private _emitTime(force = false): void {
    const now = performance.now();
    const time = Math.min(1, Math.max(0, this._t / this.cycle));
    if (!force && (now - this._lastTimeEvent < 33 || time === this._sentTime)) return;
    this._lastTimeEvent = now;
    this._sentTime = time;
    this.dispatchEvent(new CustomEvent('stage-time', { detail: { time } }));
  }

  private _observeFrame(): void {
    const frame = this.shadowRoot?.querySelector<HTMLElement>('.frame');
    const canvas = this.shadowRoot?.querySelector<HTMLElement>('.area');
    if (!frame || !canvas || this._ro || typeof ResizeObserver === 'undefined') return;
    this._ro = new ResizeObserver(() => this._fit());
    this._ro.observe(frame);
    this._ro.observe(canvas);
  }

  /** Fit the card's unscaled frame into the canvas (minus padding), then report the rect. */
  private _fit(): void {
    const frame = this.shadowRoot?.querySelector<HTMLElement>('.frame');
    const canvas = this.shadowRoot?.querySelector<HTMLElement>('.area');
    if (!frame || !canvas) return;
    const fh = frame.offsetHeight;
    const box = this.zoomIcon ? this._iconBox(frame) : undefined;
    let k: number;
    let off: { x: number; y: number } | undefined;
    if (box && canvas.clientWidth > 0 && canvas.clientHeight > 0) {
      const z = iconZoom(canvas.clientWidth, canvas.clientHeight, box);
      k = z.k;
      off = { x: z.x, y: z.y };
    } else k = Math.round(fitScale(canvas.clientWidth - 2 * FIT_PAD, canvas.clientHeight - 2 * FIT_PAD, frame.offsetWidth, fh, MAX_ZOOM) * 1000) / 1000;
    if (k !== this._k) this._k = k;
    if (fh !== this._fh) this._fh = fh;
    if (off?.x !== this._off?.x || off?.y !== this._off?.y) this._off = off;
    // report what is drawn: after this render (the overlays scale and move with the frame)
    if (this.isUpdatePending) void this.updateComplete.then(() => this._emitRect());
    else this._emitRect();
  }

  /**
   * `stage-rect` { width, height, scale, subject? }: the preview card's unscaled size (the overlay
   * slot covers it and is scaled with it), its scale in the canvas, and the moving element's box at
   * rest within it, in unscaled px, measured without its animation's transform.
   */
  private _emitRect(): void {
    const frame = this.shadowRoot?.querySelector<HTMLElement>('.frame');
    if (!frame) return;
    this.dispatchEvent(new CustomEvent('stage-rect', { detail: this._rectDetail(frame) }));
  }

  private _rectDetail(frame: HTMLElement): {
    width: number;
    height: number;
    scale: number;
    subject?: StageInfo['subject'];
    viewBox?: StageInfo['viewBox'];
  } {
    const subject = this._subjectRect(frame);
    const viewBox = this._iconViewBox();
    return {
      width: frame.offsetWidth,
      height: frame.offsetHeight,
      scale: this._k,
      ...(subject ? { subject } : {}),
      ...(viewBox ? { viewBox } : {}),
    };
  }

  /** The viewBox of the preview's icon when it is drawn as an SVG (mc-svg-icon, as icon rigs are). */
  private _iconViewBox(): [number, number, number, number] | undefined {
    const icon = this._card?.shadowRoot?.querySelector('.mc-anim-icon');
    const vb = icon?.tagName === 'MC-SVG-ICON' ? icon.shadowRoot?.querySelector('svg')?.getAttribute('viewBox') : null;
    const n = vb
      ?.trim()
      .split(/[\s,]+/)
      .map(Number);
    return n && n.length === 4 && n.every(Number.isFinite) ? (n as [number, number, number, number]) : undefined;
  }

  /** The subject's untransformed box relative to the frame (unscaled px): offsets inside its (static) offset parent. */
  private _subjectRect(frameEl: HTMLElement): { x: number; y: number; width: number; height: number } | undefined {
    const root = this._card?.shadowRoot;
    if (!root || !this.doc) return undefined;
    const t = this.subjectTarget;
    const part = t === 'name' || t === 'state' || t === 'background' ? root.querySelector<HTMLElement>(`[data-mc-part="${t}"]`) : null;
    const icon = t ? t === 'icon' || /^(part|group|shape):/.test(t) : this.doc.kind === 'path' ? this.doc.path?.subject === 'icon' : this.doc.target === 'icon';
    const el = part ?? (icon ? root.querySelector<HTMLElement>('.mc-anim-icon') : null) ?? root.querySelector<HTMLElement>('.mc-module-wrapper');
    return this._boxOf(el, frameEl);
  }

  /** The card's icon box in the frame (unscaled px), for the zoom; none on a tile without an icon. */
  private _iconBox(frameEl: HTMLElement): { x: number; y: number; width: number; height: number } | undefined {
    return this._boxOf(this._card?.shadowRoot?.querySelector<HTMLElement>('.mc-anim-icon') ?? null, frameEl);
  }

  private _boxOf(el: HTMLElement | null, frameEl: HTMLElement): { x: number; y: number; width: number; height: number } | undefined {
    const parent = el?.offsetParent as HTMLElement | null | undefined;
    if (!el || !parent || !el.offsetWidth) return undefined;
    const frame = frameEl.getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    const k = this._k || 1;
    return {
      x: Math.round((p.left - frame.left) / k + parent.clientLeft + el.offsetLeft),
      y: Math.round((p.top - frame.top) / k + parent.clientTop + el.offsetTop),
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  }

  setSpeed(v: number): void {
    this.speed = v;
    for (const a of this._anims()) this._rate(a);
  }

  /**
   * The stage speed on top of the animation's own rate: a runtime may set rates itself (a speed
   * binding, a rotate_speed spin), so the stage scales the rate it found instead of replacing it,
   * and takes a rate it did not set as the new base.
   */
  private _rate(a: Animation): void {
    const seen = this._rates.get(a);
    const base = seen && a.playbackRate === seen.set ? seen.base : a.playbackRate;
    const want = base * this.speed;
    if (a.playbackRate !== want) a.playbackRate = want;
    this._rates.set(a, { base, set: a.playbackRate });
  }

  private _anims(): Animation[] {
    return animationsIn(this._card?.shadowRoot);
  }

  /** New animations (a re-render) take the speed, and stay paused while the stage is paused. */
  private _sync(): void {
    for (const a of this._anims()) {
      this._rate(a);
      if (!this.playing && a.playState === 'running') {
        a.pause();
        a.currentTime = this._t * 1000;
      }
    }
  }

  private _loop = (): void => {
    if (!this.isConnected) return;
    const now = performance.now();
    if (this.playing && this._last) {
      const c = this.cycle;
      this._t = (this._t + ((now - this._last) / 1000) * this.speed) % c;
      this._emitTime();
    }
    this._last = now;
    this._raf = requestAnimationFrame(this._loop);
  };

  private _previewHass(): unknown {
    const src = this.hass;
    const c = this._hassFor;
    const sim = drivesPreview(this.doc, this.preview) ? previewSim(this.preview) : undefined;
    if (c && c.src === src && c.theme === this.theme && c.tile === this.tile && JSON.stringify(c.sim) === JSON.stringify(sim)) return c.value;
    const dark = this.theme === 'dark';
    const base = (src ? { ...src, themes: { ...((src.themes as object) ?? {}), darkMode: dark } } : standaloneHass(dark)) as { states?: Record<string, unknown> };
    const withTile = tileHass(this.tile, base);
    const value = sim ? withSimEntity(withTile, sim) : withTile;
    this._hassFor = { src, theme: this.theme, tile: this.tile, sim, value };
    return value;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!customElements.get('magic-card') || !this.doc) return;
    if (!this._card) this._card = document.createElement('magic-card') as CardElement;
    // the entity goes on the entry only when the simulation starts or stops (not per state)
    const drives = drivesPreview(this.doc, this.preview);
    const entityChanged = drives !== this._drives;
    this._drives = drives;
    if (changed.has('doc') || changed.has('tile') || changed.has('reduced') || changed.has('lookup') || entityChanged || !this._card.shadowRoot) {
      try {
        this._card.setConfig(
          previewConfig(this.doc, this.lookup, {
            tile: this.tile,
            still: this.reduced,
            ...(drives ? { entity: PREVIEW_ENTITY } : {}),
          }),
        );
      } catch (err) {
        console.warn('Magic Card studio: preview failed', err);
      }
    }
    if (changed.has('hass') || changed.has('theme') || changed.has('preview') || changed.has('tile') || changed.has('doc') || !this._card.hass) {
      const hass = this._previewHass();
      if (hass !== this._card.hass) this._card.hass = hass;
    }
  }

  protected firstUpdated(): void {
    this._observeFrame();
  }

  protected updated(changed: PropertyValues): void {
    // a new config restarts the card's animations: keep the stage's speed / pause
    if (changed.has('subjectTarget')) requestAnimationFrame(() => this._emitRect());
    if (changed.has('zoomIcon')) requestAnimationFrame(() => this._fit());
    if (changed.has('doc') || changed.has('tile') || changed.has('reduced') || changed.has('preview')) {
      void (this._card as unknown as { updateComplete?: Promise<unknown> })?.updateComplete?.then(() => {
        this._sync();
        requestAnimationFrame(() => this._fit());
      });
    }
  }

  private _pickTile(tile: PreviewTile): void {
    if (tile === this.tile) return;
    this.tile = tile;
    this.dispatchEvent(new CustomEvent('stage-tile', { detail: { tile }, bubbles: true, composed: true }));
  }

  private _seg<T extends string>(
    label: string,
    items: Array<{ id: T; label: string; icon: string }>,
    value: T,
    pick: (v: T) => void,
    cls: string,
  ): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const i = items.findIndex((x) => x.id === value);
      const map: Record<string, number> = {
        ArrowRight: (i + 1) % items.length,
        ArrowLeft: (i - 1 + items.length) % items.length,
        Home: 0,
        End: items.length - 1,
      };
      const next = map[e.key];
      if (next === undefined) return;
      e.preventDefault();
      pick(items[next].id);
      const group = e.currentTarget as HTMLElement;
      void this.updateComplete.then(() => group.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
    };
    return html`<div class="seg ${cls}" role="radiogroup" aria-label=${label} @keydown=${onKey}>
      ${items.map((x) => {
        const on = x.id === value;
        return html`<button
          type="button"
          role="radio"
          aria-checked=${on ? 'true' : 'false'}
          tabindex=${on ? '0' : '-1'}
          title=${x.label}
          @click=${() => pick(x.id)}
        >
          <ha-icon icon=${x.icon}></ha-icon><span class="lbl">${x.label}</span>
        </button>`;
      })}
    </div>`;
  }

  private _missing(): TemplateResult {
    return html`<div class="missing" role="status">
      <ha-icon icon="mdi:card-off-outline"></ha-icon>
      <strong>Magic Card is not loaded on this page</strong>
      <p>The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.</p>
    </div>`;
  }

  protected render(): TemplateResult {
    const cycle = this.cycle;
    const t = Math.min(this._t, cycle);
    const defined = !!customElements.get('magic-card');
    const k = this._k;
    const off = this._off;
    const fit = off ? '' : `width: ${Math.round(FRAME_WIDTH * k)}px; height: ${this._fh ? `${Math.round(this._fh * k)}px` : 'auto'}`;
    const move = off ? `translate(${off.x}px, ${off.y}px) ` : '';
    return html`
      <div class="canvas">
        <div class="dock dock-top"><slot name="top"></slot></div>
        <div class="area">
        <div class="fit ${off ? 'zoomed' : ''}" style=${fit}>
          <div class="frame" style="${THEME_VARS[this.theme]};width:${FRAME_WIDTH}px;transform:${move}scale(${k})" data-theme=${this.theme}>
            ${defined && this._card ? this._card : this._missing()}
            <div class="overlay"><slot name="overlay"></slot></div>
          </div>
        </div>
        ${this.reduced && defined ? html`<p class="note">With reduced motion the card shows its still state: this animation does not play.</p>` : nothing}
        ${off
          ? html`<span class="zoom-tag" title="Zoomed to the icon while you edit its parts or draw">Icon ${Math.round(k * 100)}%</span>`
          : Math.abs(k - 1) > 0.005
            ? html`<span class="zoom-tag" title="The preview is scaled to fit the stage">${Math.round(k * 100)}%</span>`
            : nothing}
        </div>
        <div class="dock dock-bottom"><slot name="bottom"></slot></div>
      </div>
      <div class="transport">
        <button
          type="button"
          class="icon-btn sm play"
          aria-label=${this.playing ? 'Pause (Space)' : 'Play (Space)'}
          title=${this.playing ? 'Pause (Space)' : 'Play (Space)'}
          ?disabled=${this.reduced || !defined}
          @click=${() => this.togglePlay()}
        >
          <ha-icon icon=${this.playing ? 'mdi:pause' : 'mdi:play'}></ha-icon>
        </button>
        <input
          class="scrub"
          type="range"
          min="0"
          max=${cycle}
          step="0.01"
          aria-label="Position in the cycle"
          aria-valuetext="${t.toFixed(2)} of ${cycle.toFixed(2)} seconds"
          .value=${String(t)}
          ?disabled=${this.reduced || !defined}
          @input=${(e: Event) => this.seek(Number((e.target as HTMLInputElement).value))}
        />
        <span class="time mono" aria-hidden="true">${t.toFixed(2)} / ${cycle.toFixed(2)} s</span>
        <label class="speed">
          <span class="sr-only">Speed</span>
          <div class="select">
            <select class="input" aria-label="Speed" @change=${(e: Event) => this.setSpeed(Number((e.target as HTMLSelectElement).value))}>
              ${SPEEDS.map((s) => html`<option value=${s} ?selected=${s === this.speed}>${s}×</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </label>
        <span class="view">
          ${this._seg('Preview tile', TILES, this.tile, (v) => this._pickTile(v), 'tiles')}
          ${this._seg('Card theme', THEMES, this.theme, (v) => (this.theme = v), 'themes')}
          <button
            type="button"
            class="toggle reduced"
            aria-pressed=${this.reduced ? 'true' : 'false'}
            aria-label="Reduced motion"
            title="Preview with reduced motion"
            @click=${() => (this.reduced = !this.reduced)}
          >
            <ha-icon icon="mdi:motion-pause-outline"></ha-icon>
          </button>
        </span>
      </div>
    `;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    css`
      :host {
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }
      .transport {
        display: flex;
        align-items: center;
        gap: 6px 8px;
        flex-wrap: wrap;
        padding: 6px 12px;
        background: var(--mc-surface);
        border-top: 1px solid var(--mc-divider);
        min-width: 0;
      }
      /* tile, theme and reduced motion: right-aligned, wrapping as one group when the stage is narrow */
      .view {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        padding-left: 8px;
        border-left: 1px solid var(--mc-divider);
      }
      .seg > button {
        gap: 6px;
        min-height: 28px;
        padding: 0 8px;
      }
      .seg > button ha-icon {
        --mdc-icon-size: 16px;
      }
      /* icon-only tiles and themes: the label is for assistive tech, the title for the tooltip */
      .seg .lbl {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
      .toggle {
        display: inline-grid;
        place-items: center;
        width: 34px;
        height: 34px;
        padding: 0;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
        transition:
          background-color 0.15s ease-out,
          color 0.15s ease-out;
      }
      .toggle:hover {
        background: var(--mc-surface-2);
        color: var(--mc-text);
      }
      .toggle[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        border-color: transparent;
        color: var(--mc-accent-ink);
      }
      .canvas {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 16px 16px;
      }
      /* the card's area: what the card is fitted into */
      .area {
        position: relative;
        /* fills a stage of fixed height (the studio); a stage of auto height wraps the card */
        flex: 1 1 auto;
        display: grid;
        place-items: center;
        padding: ${unsafeCSS(FIT_PAD)}px;
        min-height: 0;
        min-width: 0;
      }
      /* docked stage tools (toolbars, the preview-entity capsule): unscaled, above / below the card, never over it */
      .dock {
        flex: none;
        min-width: 0;
      }
      .dock ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        display: flex !important;
        justify-content: center;
        margin: 8px 12px 0;
      }
      .dock-bottom ::slotted(*) {
        margin: 0 12px 8px;
      }
      /* the scaled card's box; the frame inside keeps its natural size and scales from its corner */
      .fit {
        position: relative;
      }
      /* zoomed to the icon: the canvas shows the part of the card around it */
      .fit.zoomed {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .frame {
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        color: var(--primary-text-color);
      }
      /* the path editor's overlay and stage tools: exactly over the preview card */
      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .overlay ::slotted(*) {
        position: absolute;
        inset: 0;
        pointer-events: auto;
      }
      .frame magic-card {
        display: block;
      }
      .note {
        position: absolute;
        left: 50%;
        bottom: 8px;
        transform: translateX(-50%);
        width: max-content;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 4px 10px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        text-align: center;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .zoom-tag {
        position: absolute;
        right: 8px;
        top: 8px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        font-size: 0.6875rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        pointer-events: none;
      }
      .missing {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px;
        text-align: center;
        border: 1px dashed var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        color: var(--mc-text);
      }
      .missing ha-icon {
        --mdc-icon-size: 32px;
        color: var(--mc-text-2);
      }
      .missing strong {
        font-weight: 500;
      }
      .missing p {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
        max-width: 36ch;
      }
      .scrub {
        flex: 1 1 120px;
        min-width: 80px;
        accent-color: var(--mc-accent-fill);
      }
      .time {
        flex: none;
        min-width: 11ch;
        text-align: right;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .speed .select {
        width: 76px;
      }
      .speed select.input {
        min-height: 32px;
        padding-top: 2px;
        padding-bottom: 2px;
      }
    `,
  ];
}
