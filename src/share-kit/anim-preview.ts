import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { reducedMotion } from '../utils/reduced-motion';
import { t } from './i18n';
import { strictValue } from './strict';
import type { StrictType } from '../contracts/share-kit';

// Preview of an imported keyframe animation: a still first frame under reduced motion, a Play button that is always there.

interface PreviewKeyframe {
  at?: unknown;
  transform?: Record<string, unknown>;
  opacity?: unknown;
  color?: unknown;
  background?: unknown;
  shadow?: unknown;
  blur?: unknown;
  radius?: unknown;
}
export interface PreviewDoc {
  duration?: unknown;
  easing?: unknown;
  iterations?: unknown;
  keyframes?: unknown;
}

type Frame = Record<string, string>;
const EASINGS: ReadonlySet<string> = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);
const MAX_FRAMES = 40;
const FRAME_PROPS = ['transform', 'opacity', 'color', 'background', 'box-shadow', 'filter', 'border-radius'];

const num = (v: unknown, lo: number, hi: number): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : undefined);
const strict = (v: unknown, types: StrictType[]): string | undefined => {
  const r = strictValue(v, types);
  return r.verdict === 'kept' && typeof r.value === 'string' ? r.value : undefined;
};

function transformOf(tr: Record<string, unknown> | undefined): string | undefined {
  if (!tr || typeof tr !== 'object') return undefined;
  const parts: string[] = [];
  const x = num(tr.x, -1000, 1000);
  const y = num(tr.y, -1000, 1000);
  if (x !== undefined || y !== undefined) parts.push(`translate(${x ?? 0}px, ${y ?? 0}px)`);
  const s = num(tr.scale, -20, 20);
  const sx = num(tr.scale_x, -20, 20);
  const sy = num(tr.scale_y, -20, 20);
  if (s !== undefined) parts.push(`scale(${s})`);
  if (sx !== undefined || sy !== undefined) parts.push(`scale(${sx ?? 1}, ${sy ?? 1})`);
  const r = num(tr.rotate, -3600, 3600);
  if (r !== undefined) parts.push(`rotate(${r}deg)`);
  const kx = num(tr.skew_x, -89, 89);
  const ky = num(tr.skew_y, -89, 89);
  if (kx !== undefined) parts.push(`skewX(${kx}deg)`);
  if (ky !== undefined) parts.push(`skewY(${ky}deg)`);
  return parts.length ? parts.join(' ') : undefined;
}

/** The CSS properties of one keyframe, each checked on its own; a value that fails its check is left out. */
function frameOf(k: PreviewKeyframe): Frame {
  const f: Frame = {};
  const tr = transformOf(k.transform);
  if (tr) f.transform = tr;
  const o = num(k.opacity, 0, 1);
  if (o !== undefined) f.opacity = String(o);
  const c = strict(k.color, ['colour']);
  if (c) f.color = c;
  const bg = strict(k.background, ['colour', 'gradient']);
  if (bg) f.background = bg;
  const sh = strict(k.shadow, ['shadow']);
  if (sh) f['box-shadow'] = sh;
  const b = num(k.blur, 0, 100);
  if (b !== undefined) f.filter = `blur(${b}px)`;
  const r = num(k.radius, 0, 1000);
  if (r !== undefined) f['border-radius'] = `${r}px`;
  return f;
}

const sorted = (doc: PreviewDoc | undefined): PreviewKeyframe[] =>
  (Array.isArray(doc?.keyframes) ? (doc.keyframes as PreviewKeyframe[]) : [])
    .filter((k) => !!k && typeof k === 'object' && num(k.at, 0, 100) !== undefined)
    .slice(0, MAX_FRAMES)
    .sort((a, b) => (a.at as number) - (b.at as number));

/** The first keyframe (lowest position) as checked CSS properties: the still shown under reduced motion. */
export function firstFrame(doc: PreviewDoc | undefined): Frame {
  const k = sorted(doc)[0];
  return k ? frameOf(k) : {};
}

const camel = (p: string): string => p.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

@customElement('mc-anim-preview')
export class AnimPreview extends LitElement {
  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 12px; }
    [data-anim-box] { width: 56px; height: 56px; border-radius: 8px; background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
    button { min-height: 36px; min-width: 64px; padding: 0 12px; border: 1px solid var(--divider-color, #888); border-radius: 8px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #000); font: inherit; cursor: pointer; }
    button[aria-pressed='true'] { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
    button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  `;

  /** The imported animation document. */
  @property({ attribute: false }) doc?: PreviewDoc;
  @state() private _playing = false;

  private _anim?: Animation;
  private _visible = true;
  private _mq?: MediaQueryList;
  private _io?: IntersectionObserver;
  private readonly _onMotion = (): void => {
    if (reducedMotion()) this._stop();
  };

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof matchMedia === 'function') {
      this._mq = matchMedia('(prefers-reduced-motion: reduce)');
      this._mq.addEventListener('change', this._onMotion);
    }
    if (typeof IntersectionObserver === 'function') {
      this._io = new IntersectionObserver((entries) => {
        this._visible = entries[entries.length - 1]?.isIntersecting ?? true;
        this._sync();
      });
      this._io.observe(this);
    }
    if (!reducedMotion()) this._playing = true;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mq?.removeEventListener('change', this._onMotion);
    this._mq = undefined;
    this._io?.disconnect();
    this._io = undefined;
    this._anim?.cancel();
    this._anim = undefined;
  }

  protected updated(): void {
    this._sync();
  }

  private _box(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('[data-anim-box]');
  }

  private _stop(): void {
    this._anim?.cancel();
    this._anim = undefined;
    this._playing = false;
  }

  private _sync(): void {
    const box = this._box();
    if (!box) return;
    if (!this._playing) {
      this._anim?.cancel();
      this._anim = undefined;
      for (const p of FRAME_PROPS) box.style.removeProperty(p);
      for (const [p, v] of Object.entries(firstFrame(this.doc))) box.style.setProperty(p, v);
      return;
    }
    if (!this._anim && typeof box.animate === 'function') {
      const frames = sorted(this.doc).map((k) => ({ ...Object.fromEntries(Object.entries(frameOf(k)).map(([p, v]) => [camel(p), v])), offset: (k.at as number) / 100 }));
      if (frames.length < 2) return;
      const d = num(this.doc?.duration, 0.1, 60) ?? 1;
      const it = this.doc?.iterations === 'infinite' ? Infinity : (num(this.doc?.iterations, 1, 100) ?? 1);
      const ease = typeof this.doc?.easing === 'string' && EASINGS.has(this.doc.easing) ? this.doc.easing : 'linear';
      this._anim = box.animate(frames, { duration: d * 1000, iterations: it, easing: ease });
    }
    if (this._visible) this._anim?.play();
    else this._anim?.pause();
  }

  private _toggle(): void {
    if (this._playing) this._anim?.pause();
    this._playing = !this._playing;
  }

  protected render() {
    return html`<div data-anim-box role="img" aria-label=${t('share-kit.anim-preview.animation-preview')}></div>
      <button type="button" aria-pressed=${this._playing ? 'true' : 'false'} @click=${() => this._toggle()}>${t('share-kit.anim-preview.play')}</button>`;
  }
}
