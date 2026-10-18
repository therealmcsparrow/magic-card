import type { SceneId } from './seasonal';

/*
 * Seasonal scenes as data: per scene the particle kinds (drawn by src/card/seasonal-symbols.ts),
 * their motion (a CSS keyframe in src/card/seasonal-css.ts), duration / size ranges, palette and
 * share of the particle budget, ambient layers (sun glow, dusk gradient, lightning, moon) and the
 * border decorations (<mc-seasonal-deco>). `layoutScenes` turns scenes + intensity + a seed into a
 * stable particle layout: the same seed always gives the same layout, so re-renders never jump.
 * Pure (no DOM).
 */

/** Hard cap of elements (particles + ambient layers) in one layer. */
export const PARTICLE_CAP = 24;

export type ParticleKind =
  | 'snowdot'
  | 'flake'
  | 'leaf'
  | 'petal'
  | 'blossom'
  | 'butterfly'
  | 'mote'
  | 'bat'
  | 'heart'
  | 'egg'
  | 'firework'
  | 'confetti'
  | 'star'
  | 'sparkle'
  | 'firefly'
  | 'cloud'
  | 'raindrop'
  | 'windline'
  | 'fogband';

/**
 * fall: straight down with a sway (snow); tumble: down while flipping (leaves, petals, confetti);
 * rain: fast slanted streaks; drizzle: rain now and then; rise: up with a sway (hearts); flutter:
 * wander around a spot (butterflies, motes); fly: across the layer (bats); blow: sideways with a
 * tumble (wind leaves); twinkle: in place (stars); firefly: wander + blink; burst: firework
 * radial bursts; bob: in place up and down (eggs); drift: slow side to side (fog); across: slow
 * crossing (clouds); gust: wind lines.
 */
export type Motion =
  | 'fall'
  | 'tumble'
  | 'rain'
  | 'drizzle'
  | 'rise'
  | 'flutter'
  | 'fly'
  | 'blow'
  | 'twinkle'
  | 'firefly'
  | 'burst'
  | 'bob'
  | 'drift'
  | 'across'
  | 'gust';

export type AmbientKind = 'sun' | 'dusk' | 'flash' | 'moon';

/** Elements each ambient layer draws (they count against the cap). */
export const AMBIENT_PIECES: Record<AmbientKind, number> = { sun: 3, dusk: 2, flash: 5, moon: 2 };

export type DecoMotif = 'lights' | 'icicles' | 'frost' | 'cobweb' | 'pumpkin' | 'vine';

/** A colour, or a main + accent pair (eggs, fireworks, butterflies). */
export type Swatch = string | readonly [string, string];

export interface ParticleSpec {
  kind: ParticleKind;
  motion: Motion;
  /** Share of the scene's particle budget. */
  weight: number;
  /** At most this many. */
  max?: number;
  /** Seconds (near particles get the short end: they move faster). */
  dur: readonly [number, number];
  /** px (width for clouds / fog / wind lines). */
  size: readonly [number, number];
  /** Far .. near opacity. */
  opacity?: readonly [number, number];
  palette: readonly Swatch[];
  /** Vertical band (% of the height) for particles that stay in place or cross; the static spot for the rest. */
  band?: readonly [number, number];
  /** Shape variants (cycled, so each one shows). */
  variants?: number;
  /** Horizontal drift range (px) while falling / rising. */
  drift?: number;
}

export interface SceneDef {
  id: SceneId;
  label: string;
  particles: readonly ParticleSpec[];
  ambient?: readonly AmbientKind[];
  decorations?: readonly DecoMotif[];
}

// ── Palettes ──
/** Snow follows the theme (--mc-sn-snow): pale blue on light cards, near white on dark ones. */
const SNOW = ['snow'] as const;
const LEAVES = ['#e8590c', '#f08c00', '#d9480f', '#c92a2a', '#b35a1f', '#e0a526', '#a8761b'] as const;
const PETALS = ['#ffc9de', '#fcc2d7', '#f9a8c9', '#ffdeeb', '#f7a1c4'] as const;
const HEARTS = ['#e03131', '#f03e3e', '#e64980', '#f06595', '#ff6b81', '#c2255c'] as const;
const CONFETTI = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#da77f2', '#ff922b', '#f783ac', '#e9c46a'] as const;
const EGGS = [
  ['#ffd8a8', '#f76707'],
  ['#b2f2bb', '#2b8a3e'],
  ['#a5d8ff', '#1864ab'],
  ['#fcc2d7', '#c2255c'],
  ['#d0bfff', '#5f3dc4'],
  ['#ffec99', '#e67700'],
] as const;
const FIREWORKS = [
  ['#ff6b6b', '#ffe066'],
  ['#4dabf7', '#d0ebff'],
  ['#ffd43b', '#fff9db'],
  ['#da77f2', '#ffdeeb'],
  ['#51cf66', '#ebfbee'],
  ['#ff922b', '#fff4e6'],
] as const;
const BUTTERFLIES = [
  ['#f59f00', '#ffd43b'],
  ['#339af0', '#a5d8ff'],
  ['#fab005', '#fff3bf'],
  ['#e64980', '#ffdeeb'],
  ['#7950f2', '#d0bfff'],
] as const;
const GOLD = ['#ffd43b', '#fcc419', '#ffe066'] as const;
const NIGHT_STARS = ['#fff9db', '#e7f5ff', '#ffec99', '#ffffff'] as const;
const FIREFLIES = ['#d8f5a2', '#ffec99', '#c0eb75'] as const;
const RAIN = ['#5c9ce6', '#74a9e6', '#4a8bd6'] as const;
const MIST = ['mist'] as const;

// ── Particle specs (shared between scenes) ──
const snowDots = (weight: number): ParticleSpec => ({
  kind: 'snowdot',
  motion: 'fall',
  weight,
  dur: [9, 17],
  size: [4, 8],
  opacity: [0.55, 1],
  palette: SNOW,
  drift: 26,
});
const flakes = (weight: number, max: number): ParticleSpec => ({
  kind: 'flake',
  motion: 'fall',
  weight,
  max,
  dur: [11, 19],
  size: [12, 22],
  opacity: [0.7, 1],
  palette: SNOW,
  variants: 3,
  drift: 34,
});
const petals = (weight: number): ParticleSpec => ({
  kind: 'petal',
  motion: 'tumble',
  weight,
  dur: [9, 15],
  size: [13, 19],
  opacity: [0.8, 1],
  palette: PETALS,
  drift: 60,
});
const rain = (weight: number, motion: Motion = 'rain'): ParticleSpec => ({
  kind: 'raindrop',
  motion,
  weight,
  dur: motion === 'rain' ? [0.6, 1] : [7, 11],
  size: [18, 30],
  opacity: motion === 'rain' ? [0.45, 0.85] : [0.35, 0.6],
  palette: RAIN,
});

export const SCENES: Record<SceneId, SceneDef> = {
  winter: {
    id: 'winter',
    label: 'Winter',
    particles: [snowDots(6), flakes(3, 8)],
    decorations: ['frost', 'icicles'],
  },
  spring: {
    id: 'spring',
    label: 'Spring',
    particles: [petals(5), { kind: 'blossom', motion: 'tumble', weight: 1.6, max: 4, dur: [11, 16], size: [17, 24], opacity: [0.85, 1], palette: PETALS, drift: 50 }],
    decorations: ['vine'],
  },
  summer: {
    id: 'summer',
    label: 'Summer',
    ambient: ['sun'],
    particles: [
      { kind: 'butterfly', motion: 'flutter', weight: 1, max: 4, dur: [9, 15], size: [28, 38], palette: BUTTERFLIES, band: [18, 78] },
      { kind: 'mote', motion: 'flutter', weight: 1.4, max: 7, dur: [7, 12], size: [3, 6], opacity: [0.5, 0.9], palette: GOLD, band: [10, 90] },
    ],
  },
  autumn: {
    id: 'autumn',
    label: 'Autumn',
    particles: [
      { kind: 'leaf', motion: 'tumble', weight: 6, dur: [8, 14], size: [20, 32], opacity: [0.85, 1], palette: LEAVES, variants: 3, drift: 70 },
      rain(1.4, 'drizzle'),
    ],
  },
  christmas: {
    id: 'christmas',
    label: 'Christmas',
    particles: [
      snowDots(4),
      flakes(1.4, 4),
      { kind: 'star', motion: 'twinkle', weight: 2.4, max: 6, dur: [2.2, 3.8], size: [13, 21], opacity: [0.8, 1], palette: GOLD, band: [6, 62], variants: 1 },
    ],
    decorations: ['lights'],
  },
  new_year: {
    id: 'new_year',
    label: 'New Year',
    particles: [
      { kind: 'firework', motion: 'burst', weight: 2.4, max: 5, dur: [2.6, 4], size: [64, 100], opacity: [0.8, 0.95], palette: FIREWORKS, band: [14, 52] },
      { kind: 'confetti', motion: 'tumble', weight: 5, dur: [5, 8], size: [8, 13], palette: CONFETTI, variants: 3, drift: 40 },
    ],
  },
  valentine: {
    id: 'valentine',
    label: 'Valentine',
    particles: [{ kind: 'heart', motion: 'rise', weight: 1, dur: [8, 13], size: [12, 24], opacity: [0.6, 0.95], palette: HEARTS, variants: 2, drift: 30 }],
  },
  easter: {
    id: 'easter',
    label: 'Easter',
    particles: [
      petals(3),
      { kind: 'egg', motion: 'bob', weight: 1.6, max: 6, dur: [2.4, 3.6], size: [22, 30], palette: EGGS, band: [80, 92], variants: 3 },
    ],
  },
  halloween: {
    id: 'halloween',
    label: 'Halloween',
    particles: [
      { kind: 'bat', motion: 'fly', weight: 1, max: 7, dur: [7, 12], size: [24, 36], opacity: [0.8, 1], palette: ['bat'], band: [8, 55] },
      { kind: 'fogband', motion: 'drift', weight: 0.5, max: 3, dur: [16, 26], size: [260, 380], opacity: [0.55, 0.85], palette: ['ghost-violet', 'mist', 'ghost-green'], band: [70, 100] },
    ],
    decorations: ['cobweb', 'pumpkin'],
  },
  snow: { id: 'snow', label: 'Snow', particles: [snowDots(7), flakes(3, 8)] },
  rain: { id: 'rain', label: 'Rain', particles: [rain(1)] },
  storm: { id: 'storm', label: 'Thunderstorm', ambient: ['flash'], particles: [rain(1)] },
  sun: {
    id: 'sun',
    label: 'Sunny',
    ambient: ['sun'],
    particles: [{ kind: 'mote', motion: 'flutter', weight: 1, max: 8, dur: [7, 12], size: [3, 6], opacity: [0.5, 0.9], palette: GOLD, band: [10, 90] }],
  },
  clouds: {
    id: 'clouds',
    label: 'Cloudy',
    particles: [{ kind: 'cloud', motion: 'across', weight: 1, max: 5, dur: [50, 90], size: [64, 120], opacity: [0.55, 0.95], palette: ['cloud'], band: [6, 46] }],
  },
  fog: {
    id: 'fog',
    label: 'Fog',
    particles: [{ kind: 'fogband', motion: 'drift', weight: 1, max: 4, dur: [16, 28], size: [280, 420], opacity: [0.4, 0.75], palette: MIST, band: [25, 100] }],
  },
  wind: {
    id: 'wind',
    label: 'Windy',
    particles: [
      { kind: 'windline', motion: 'gust', weight: 2, max: 6, dur: [2.4, 5], size: [90, 160], opacity: [0.55, 0.95], palette: ['wind'], band: [12, 88], variants: 2 },
      { kind: 'leaf', motion: 'blow', weight: 1, max: 4, dur: [4, 6.5], size: [16, 22], palette: LEAVES, band: [20, 80], variants: 3 },
    ],
  },
  night: {
    id: 'night',
    label: 'Night',
    ambient: ['moon'],
    particles: [
      { kind: 'sparkle', motion: 'twinkle', weight: 3, max: 10, dur: [2.4, 4.6], size: [7, 14], opacity: [0.6, 1], palette: NIGHT_STARS, band: [4, 58] },
      { kind: 'firefly', motion: 'firefly', weight: 2, max: 6, dur: [9, 15], size: [10, 15], palette: FIREFLIES, band: [45, 92] },
    ],
  },
  dusk: {
    id: 'dusk',
    label: 'Dusk',
    ambient: ['dusk'],
    particles: [{ kind: 'sparkle', motion: 'twinkle', weight: 1, max: 3, dur: [3, 5], size: [6, 10], opacity: [0.45, 0.8], palette: NIGHT_STARS, band: [4, 30] }],
  },
};

export function isSceneId(v: unknown): v is SceneId {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(SCENES, v);
}

/** Border decorations of these scenes, in order, without repeats. */
export function sceneDecorations(scenes: readonly SceneId[]): DecoMotif[] {
  const out: DecoMotif[] = [];
  for (const s of scenes) for (const m of (isSceneId(s) && SCENES[s].decorations) || []) if (!out.includes(m)) out.push(m);
  return out;
}

// ── Layout ──

export interface Particle {
  key: string;
  scene: SceneId;
  kind: ParticleKind;
  motion: Motion;
  variant: number;
  /** Centre, % of the layer. */
  x: number;
  y: number;
  /** px */
  size: number;
  /** s */
  dur: number;
  /** s, negative: already under way when it appears. */
  delay: number;
  color: string;
  accent?: string;
  opacity: number;
  /** px sideways while falling / rising (also sway amplitude). */
  drift: number;
  /** deg: starting rotation. */
  rotate: number;
  /** Mirrored (bats flying the other way, leaves). */
  flip: boolean;
}

export interface Ambient {
  key: string;
  kind: AmbientKind;
}

export interface SceneLayout {
  particles: Particle[];
  ambient: Ambient[];
}

/** FNV-1a. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: a small seeded generator (0..1). */
export function seededRandom(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Number of particles for this intensity (0..1) next to `ambient` layers: round(cap x intensity), within the cap. */
export function particleBudget(intensity: number, ambient = 0): number {
  const i = Number.isFinite(intensity) ? Math.min(1, Math.max(0, intensity)) : 0.5;
  return Math.max(0, Math.min(PARTICLE_CAP - ambient, Math.round(PARTICLE_CAP * i)));
}

// ── Per-card budget ──

/** Most seasonal particles one card draws, over all its layers (its scene and every seasonal preset). */
export const CARD_PARTICLE_CAP = 60;

/**
 * Most layers of one card whose storm flashes: a layer has 2 strikes of 2 peaks each per 7 s
 * cycle, so 5 layers stay under 3 flashes a second (WCAG 2.3.1).
 */
export const FLASH_LAYER_CAP = 5;

/** The scenes draw lightning. */
export function sceneFlashes(scenes: readonly SceneId[]): boolean {
  return scenes.some((s) => isSceneId(s) && !!SCENES[s].ambient?.includes('flash'));
}

/** Particles a layer of `scenes` asks for at `intensity` (the same count layoutScenes budgets). */
export function layerDemand(scenes: readonly SceneId[], intensity: number): number {
  const kinds = new Set<AmbientKind>();
  for (const s of scenes) if (isSceneId(s)) for (const k of SCENES[s].ambient ?? []) kinds.add(k);
  let pieces = 0;
  for (const k of kinds) pieces += AMBIENT_PIECES[k];
  return particleBudget(intensity, pieces);
}

export interface BudgetGrant {
  /** The intensity to draw at (scaled down when over the budget). */
  intensity: number;
  /** The layer must not flash (the card has enough flashing layers). */
  noflash: boolean;
}

/**
 * The seasonal particle budget of one card render. The card's own scene takes its particles first;
 * the seasonal presets share the rest, scaled down evenly when together they ask for more. Their
 * total is only known after the render, so the scale comes from the previous render's demand
 * (`settle()` says whether it changed and the card should render again); within a render the
 * remaining budget is a hard limit, so the cap holds from the first render on.
 */
export class SeasonalBudget {
  private _left = CARD_PARTICLE_CAP;
  private _flashes = 0;
  private _demand = 0;
  private _known = 0;
  private _scale?: number;

  constructor(private readonly _cap = CARD_PARTICLE_CAP) {}

  /** Start a render pass (the card's content). */
  begin(): void {
    this._left = this._cap;
    this._flashes = 0;
    this._demand = 0;
    this._scale = undefined;
  }

  /** The card's own scene: its full count (within the cap). */
  own(scenes: readonly SceneId[], intensity: number): BudgetGrant {
    return this._grant(scenes, intensity, 1);
  }

  /** A seasonal preset: scaled to share what is left. */
  preset(scenes: readonly SceneId[], intensity: number): BudgetGrant {
    const want = layerDemand(scenes, intensity);
    this._demand += want;
    if (this._scale === undefined) this._scale = this._known > this._left ? Math.max(0, this._left) / this._known : 1;
    return this._grant(scenes, intensity, this._scale, want);
  }

  /** After the render: the presets' demand changed (render again with the new scale). */
  settle(): boolean {
    if (this._demand === this._known) return false;
    this._known = this._demand;
    return true;
  }

  private _grant(scenes: readonly SceneId[], intensity: number, scale: number, want = layerDemand(scenes, intensity)): BudgetGrant {
    const n = Math.max(0, Math.min(this._left, Math.round(want * scale)));
    this._left -= n;
    const flashes = sceneFlashes(scenes);
    if (flashes) this._flashes++;
    return { intensity: n === want ? intensity : n / PARTICLE_CAP, noflash: flashes && this._flashes > FLASH_LAYER_CAP };
  }
}
