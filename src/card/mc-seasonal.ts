import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit';
import type { SceneId } from '../utils/seasonal';
import type { Particle, SceneLayout } from '../utils/seasonal-scenes';
import { layoutScenes } from './seasonal-layout';
import { unwatchOffscreen, watchOffscreen } from '../icons/offscreen';
import { seasonalStyles } from './seasonal-css';
import { MOON, particleArt, SYMBOL_DEFS } from './seasonal-symbols';

const REDUCED = '(prefers-reduced-motion: reduce)';
/** Opacity of a layer drawn over the content. */
export const FRONT_OPACITY = 0.55;

/** Palette names that follow the theme (text colour mixes) instead of a fixed colour. */
const THEMED: Record<string, string> = {
  mist: 'var(--mc-sn-mist)',
  wind: 'var(--mc-sn-wind)',
  bat: 'var(--mc-sn-bat)',
  cloud: 'var(--mc-sn-cloud)',
  snow: 'var(--mc-sn-snow)',
  'ghost-violet': 'var(--mc-sn-ghost-violet)',
  'ghost-green': 'var(--mc-sn-ghost-green)',
};
const colour = (c: string) => THEMED[c] ?? c;

const sameList = (a?: readonly string[], b?: readonly string[]) =>
  a === b || (!!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]));

/** The inline custom properties of one particle. */
function particleStyle(p: Particle): string {
  const sway = Math.max(4, Math.abs(p.drift) / 3);
  let r = p.rotate;
  // upright kinds only lean a little
  if (p.motion === 'rise' || p.motion === 'flutter' || p.motion === 'bob') r = (p.rotate % 30) - 15;
  if (p.kind === 'star') r = (p.rotate % 24) - 12;
  const wander = p.kind === 'butterfly' ? 3.4 : p.kind === 'firefly' ? 2.4 : p.motion === 'drift' ? 2.2 : 1.4;
  const parts = [
    `--x:${p.x}%`,
    `--y:${p.y}%`,
    `--s:${p.size}px`,
    `--d:${p.dur}s`,
    `--dl:${p.delay}s`,
    `--c:${colour(p.color)}`,
    `--o:${p.opacity}`,
    `--dx:${p.drift}px`,
    `--sw:${Math.round(sway * 10) / 10}px`,
    `--r:${r}deg`,
    `--wx:${Math.round(p.drift * wander)}px`,
    `--wy:${Math.round((Math.abs(p.drift) * wander) / 2.5 + 8)}px`,
  ];
  if (p.accent) parts.push(`--c2:${colour(p.accent)}`);
  return parts.join(';');
}

function ambientArt(kind: string): TemplateResult {
  switch (kind) {
    case 'sun':
      return html`<i class="a a-rays"></i><i class="a a-sun"></i><i class="a a-shimmer"></i>`;
    case 'dusk':
      return html`<i class="a a-dusk"></i><i class="a a-dusk-sun"></i>`;
    case 'flash':
      // two strikes half a cycle apart, in different places
      return html`<i class="a a-gloom"></i><i class="a a-flash"></i><i class="a a-bolt"></i><i class="a a-flash f2"></i><i class="a a-bolt b2"></i>`;
    case 'moon':
      return html`<i class="a a-sky"></i><i class="a a-moon">${MOON}</i>`;
    default:
      return html``;
  }
}

/**
 * A seasonal particle layer over its parent's padding box: up to 24 CSS-animated particles plus
 * ambient light layers, laid out from `seed` (stable across renders). aria-hidden and without
 * pointer events; off-screen it pauses (shared IntersectionObserver), under reduced motion it is a
 * still composition. Renders nothing (and watches nothing) without a known scene.
 */
export class McSeasonal extends LitElement {
  static properties = {
    scenes: { attribute: false, hasChanged: (a?: SceneId[], b?: SceneId[]) => !sameList(a, b) },
    intensity: { type: Number },
    layer: { reflect: true },
    seed: {},
    noflash: { type: Boolean, reflect: true },
    _static: { state: true },
  };

  static styles = seasonalStyles;

  scenes: SceneId[] = [];
  /** Particle density 0..1. */
  intensity = 0.5;
  layer: 'back' | 'front' = 'back';
  /** Layout seed (e.g. the card / element id): the same seed always lays out the same. */
  seed = 'mc';
  /** Skip the storm flash (the card has enough flashing layers). */
  noflash = false;

  private _static = false;

  private _media?: MediaQueryList;
  private _watching = false;
  private _layout?: { key: string; value: SceneLayout };
  private _onMedia = () => {
    this._static = !!this._media?.matches;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
    this._media = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._media?.addEventListener?.('change', this._onMedia);
    this._static = !!this._media?.matches;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._media?.removeEventListener?.('change', this._onMedia);
    this._unwatch();
  }

  /** The current layout (memoised on scenes / intensity / seed). */
  get layout(): SceneLayout {
    const key = `${this.scenes.join(',')}|${this.intensity}|${this.seed}`;
    if (this._layout?.key !== key) this._layout = { key, value: layoutScenes(this.scenes, this.intensity, this.seed) };
    return this._layout.value;
  }

  private _unwatch(): void {
    if (!this._watching) return;
    this._watching = false;
    unwatchOffscreen(this);
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.toggleAttribute('static', this._static);
    // `flash`: this layer's lightning shows; the card's styles turn later siblings' off
    this.toggleAttribute('flash', !this.noflash && this.layout.ambient.some((a) => a.kind === 'flash'));
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const l = this.layout;
    // only a moving layer is watched; a still or empty one costs nothing
    const animated = !this._static && (l.particles.length > 0 || l.ambient.length > 0);
    if (animated && !this._watching && this.isConnected) this._watching = watchOffscreen(this, () => undefined);
    else if (!animated) this._unwatch();
  }

  protected render(): TemplateResult | typeof nothing {
    const l = this.layout;
    if (!l.particles.length && !l.ambient.length) return nothing;
    const front = this.layer === 'front';
    const needsDefs = l.particles.some((p) => p.kind === 'egg');
    return html`<div class="layer ${this._static ? 'still' : ''}" style=${front ? `opacity:${FRONT_OPACITY}` : ''}>
      ${needsDefs ? SYMBOL_DEFS : nothing}
      ${l.ambient.map((a) => ambientArt(a.kind))}
      ${l.particles.map(
        (p) =>
          html`<i
            class="p m-${p.motion} k-${p.kind}${p.flip && p.motion === 'fly' ? ' rev' : ''}"
            data-scene=${p.scene}
            style=${particleStyle(p)}
            >${particleArt(p.kind, p.variant)}</i
          >`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-seasonal': McSeasonal;
  }
}
