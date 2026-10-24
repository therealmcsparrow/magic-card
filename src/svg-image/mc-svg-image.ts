import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import type { HassEntity, HomeAssistant } from '../types';
import type { BackgroundLayerConfig, BgLayerStatus } from '../contracts/bg-stack';
import { IMAGE_MAX_DESCRIPTION_CHARS, IMAGE_REF_PREFIX, IMAGE_REF_RE, IMAGE_SKELETON_MS, MAX_LAYER_PREFETCH, type ImagePoint } from '../contracts/svg-image';
import { entityStateColor, isEntityColor } from '../utils/entity-color';
import { safeColor } from '../utils/safe-css';
import { loadImage, watchImage, type ImageEntry } from './client';
import { drawStep, whenIdle } from './frames';
import { layerPlacement, type ImageFit, type Placement } from './layer-box';

export type ImageStatus = 'waiting' | 'ready' | 'missing';

const DEFAULT_MAIN = 'var(--primary-text-color)';
const DEFAULT_ACCENT = 'var(--accent-color)';
const STATUS_EVENT = 'mc-svg-image-status';
/** BG_LAYER_STATUS_EVENT of bg-stack 1.2.0, written out: a value import would split that module out of magic-card.js's scope (about 70 B gzip). */
const BG_LAYER_STATUS_EVENT = 'mc-bg-layer-status';

/**
 * A library image drawn inline (contract svg-image 1.0.0): in an image module, or as the drawing of a background layer
 * when `layer` is set by <mc-bg-stack>. Defined by the svg-image chunk's install().
 */
export class McSvgImage extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      container-type: size;
    }
    :host([data-layer]) {
      position: absolute;
      inset: 0;
      width: auto;
      height: auto;
      pointer-events: none;
    }
    .sk {
      position: absolute;
      inset: 0;
      background: var(--divider-color, rgba(127, 127, 127, 0.25));
      border-radius: 4px;
    }
    .stage {
      position: absolute;
      left: calc((100cqw - var(--sw)) * var(--px));
      top: calc((100cqh - var(--sh)) * var(--py));
      width: var(--sw);
      height: var(--sh);
    }
    .stage > svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    @supports not (width: 1cqw) {
      .stage {
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
        aspect-ratio: var(--ar);
      }
    }
  `;

  /** `mcu-image:<id>`. */
  @property({ attribute: false }) ref = '';
  @property({ attribute: false }) colors?: { main?: string; accent?: string };
  @property({ attribute: false }) fit?: ImageFit;
  @property({ attribute: false }) entity?: string;
  @property({ attribute: false }) description?: string;
  @property({ attribute: false }) stateSummary?: boolean;
  @property({ attribute: false }) layer?: BackgroundLayerConfig;
  @property({ attribute: false }) at?: number;

  private _hass?: HomeAssistant;
  private _status: ImageStatus = 'waiting';
  private _drawn = false;
  private _entry?: ImageEntry;
  private _mounted?: ImageEntry;
  private _svg?: SVGElement;
  private _id?: string;
  private _gen = 0;
  private _asked = false;
  private _stopWatch?: () => void;
  private _cancelDraw?: () => void;
  private _skeletonTimer?: ReturnType<typeof setTimeout>;
  private _sent = '';
  private _prefetched?: string;

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }
  set hass(v: HomeAssistant | undefined) {
    const first = !this._hass;
    this._hass = v;
    if (first && v) this._begin();
    else if (this._entityColours()) this.requestUpdate();
  }

  get status(): ImageStatus {
    return this._status;
  }

  connectedCallback(): void {
    // a property set before the chunk defined the element sits on the instance and hides the accessor
    if (Object.prototype.hasOwnProperty.call(this, 'hass')) {
      const v = (this as { hass?: HomeAssistant }).hass;
      delete (this as { hass?: HomeAssistant }).hass;
      this._hass = v;
    }
    super.connectedCallback();
    this.toggleAttribute('data-layer', !!this.layer);
    this._begin();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopWatch?.();
    this._stopWatch = undefined;
    this._cancelDraw?.();
    this._cancelDraw = undefined;
    clearTimeout(this._skeletonTimer);
    this._skeletonTimer = undefined;
    this._gen++;
    this._asked = false;
    this._svg?.remove();
    this._svg = this._mounted = undefined;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('layer')) this.toggleAttribute('data-layer', !!this.layer);
    if (changed.has('ref')) this._begin();
  }

  // ── loading ──

  private _idOf(): string | undefined {
    return this.ref.startsWith(IMAGE_REF_PREFIX) ? IMAGE_REF_RE.exec(this.ref)?.[1] : undefined;
  }

  /** Starts (or restarts) reading the item this element shows. */
  private _begin(): void {
    if (!this.isConnected) return;
    const id = this._idOf();
    if (this._asked && id === this._id) return;
    this._stopWatch?.();
    this._stopWatch = undefined;
    this._id = id;
    this._asked = false;
    if (!id) {
      this._gen++;
      this._miss();
      return;
    }
    this._stopWatch = watchImage(id, () => {
      this._asked = false;
      this._ask();
    });
    this._ask();
  }

  private _ask(): void {
    const id = this._id;
    const hass = this._hass;
    if (!id || !hass?.callWS || this._asked) return;
    this._asked = true;
    const gen = ++this._gen;
    if (!this._drawn && !this._skeletonTimer) this._skeletonTimer = setTimeout(() => {
      this._skeletonTimer = undefined;
      if (!this._drawn) this._miss();
    }, IMAGE_SKELETON_MS);
    void loadImage(id, (msg) => hass.callWS(msg), hass.connection as never).then((r) => {
      if (gen !== this._gen) return;
      if ('entry' in r) this._show(r.entry);
      else this._miss();
    });
  }

  private _show(entry: ImageEntry): void {
    this._cancelDraw?.();
    this._cancelDraw = drawStep(() => {
      this._cancelDraw = undefined;
      if (!this.isConnected) return;
      clearTimeout(this._skeletonTimer);
      this._skeletonTimer = undefined;
      this._entry = entry;
      this._drawn = true;
      this._status = 'ready';
      this.requestUpdate();
    });
  }

  private _miss(): void {
    this._cancelDraw?.();
    this._cancelDraw = undefined;
    clearTimeout(this._skeletonTimer);
    this._skeletonTimer = undefined;
    this._entry = undefined;
    this._drawn = false;
    this._status = 'missing';
    this.requestUpdate();
  }

  // ── rendering ──

  private _entityColours(): boolean {
    return !this.layer && (isEntityColor(this.colors?.main) || isEntityColor(this.colors?.accent));
  }

  private _paint(value: string | undefined, fallback: string): string {
    if (!value) return fallback;
    if (isEntityColor(value)) return (this.entity && entityStateColor(this._hass?.states?.[this.entity] as HassEntity | undefined)) || 'currentColor';
    return safeColor(value) ?? fallback;
  }

  private _placement(): Placement {
    return this.layer ? layerPlacement(this.layer) : { fit: this.fit ?? 'contain', px: 0.5, py: 0.5 };
  }

  private _stageStyle(): string {
    const [, , w, h] = (this._entry?.viewBox ?? '0 0 1 1').split(' ').map(Number);
    const p = this._placement();
    const colors = this.layer ? undefined : this.colors;
    const sw =
      p.pct !== undefined
        ? `calc(100cqw * ${p.pct})`
        : p.fit === 'cover'
          ? 'max(100cqw, calc(100cqh * var(--ar)))'
          : p.fit === 'fill'
            ? '100cqw'
            : p.fit === 'none'
              ? 'calc(var(--vw) * 1px)'
              : 'min(100cqw, calc(100cqh * var(--ar)))';
    const sh = p.fit === 'fill' ? '100cqh' : 'calc(var(--sw) / var(--ar))';
    return [
      `--ar: ${+(w / h).toFixed(5)}`,
      `--vw: ${w}`,
      `--vh: ${h}`,
      `--px: ${+p.px.toFixed(4)}`,
      `--py: ${+p.py.toFixed(4)}`,
      `--sw: ${sw}`,
      `--sh: ${sh}`,
      `--mc-image-main: ${this._paint(colors?.main, DEFAULT_MAIN)}`,
      `--mc-image-accent: ${this._paint(colors?.accent, DEFAULT_ACCENT)}`,
    ].join('; ');
  }

  protected render() {
    return html`${this._drawn || this.layer ? nothing : html`<div class="sk"></div>`}<div class="stage" style=${this._stageStyle()}><slot></slot></div>`;
  }

  protected updated(): void {
    const stage = this.renderRoot.querySelector('.stage');
    if (stage && this._entry !== this._mounted) {
      this._svg?.remove();
      this._svg = undefined;
      this._mounted = this._entry;
      const svg = this._entry ? (document.importNode(this._entry.template.content, true).firstElementChild as SVGElement | null) : null;
      if (svg) {
        stage.insertBefore(svg, stage.firstChild);
        this._svg = svg;
        if (this.layer) whenIdle(() => this._prefetch());
      }
    }
    const svg = this._svg;
    if (svg) {
      svg.setAttribute('preserveAspectRatio', this._placement().fit === 'fill' ? 'none' : 'xMidYMid meet');
      const label = this.layer ? undefined : this.description?.slice(0, IMAGE_MAX_DESCRIPTION_CHARS);
      if (label) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', label);
        svg.removeAttribute('aria-hidden');
      } else {
        svg.removeAttribute('role');
        svg.removeAttribute('aria-label');
        svg.setAttribute('aria-hidden', 'true');
      }
    }
    this._report();
  }

  /** Tells the stack (layer mode) and the view (attribute and event) what happened, once per change. */
  private _report(): void {
    const status = this._status;
    if (status === 'waiting' || status === this._sent) return;
    this._sent = status;
    this.setAttribute('status', status);
    this.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status } }));
    if (!this.layer || this.at === undefined) return;
    const detail: BgLayerStatus = status === 'ready' ? { index: this.at, status: 'ok' } : { index: this.at, status: 'error', reason: 'image-missing' };
    this.dispatchEvent(new CustomEvent<BgLayerStatus>(BG_LAYER_STATUS_EVENT, { bubbles: true, composed: true, detail }));
  }

  /** The other references of this layer go into the page cache, so a state swap is a cache hit. */
  private _prefetch(): void {
    const layer = this.layer;
    const hass = this._hass;
    if (!layer || !hass?.callWS || !this.isConnected) return;
    const values = [layer.image, ...Object.values(layer.states ?? {})];
    const ids: string[] = [];
    for (const v of values) {
      const id = typeof v === 'string' && v.startsWith(IMAGE_REF_PREFIX) ? IMAGE_REF_RE.exec(v)?.[1] : undefined;
      if (id && id !== this._id && !ids.includes(id) && ids.length < MAX_LAYER_PREFETCH) ids.push(id);
    }
    const key = ids.join(' ');
    if (!ids.length || key === this._prefetched) return;
    this._prefetched = key;
    for (const id of ids) void loadImage(id, (msg) => hass.callWS(msg), hass.connection as never);
  }

  /** The centre of a drawing part in percent of the viewBox; undefined when it is not drawn. */
  pointOf(partId: string): ImagePoint | undefined {
    const svg = this._svg;
    const part = (this.renderRoot as ShadowRoot).getElementById?.(partId);
    if (!svg || !part) return undefined;
    const box = svg.getBoundingClientRect();
    const r = part.getBoundingClientRect();
    if (!box.width || !box.height) return undefined;
    const pct = (v: number) => +Math.min(100, Math.max(0, v)).toFixed(2);
    return { x: pct(((r.left + r.width / 2 - box.left) / box.width) * 100), y: pct(((r.top + r.height / 2 - box.top) / box.height) * 100) };
  }
}
