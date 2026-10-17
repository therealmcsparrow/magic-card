import type { AnimationDoc, AnimationKeyframe, KeyframeTransform, ParticleDirection, ParticleShape, ParticlesSpec } from '../anim-studio/model';
import type { CatalogueGroup, CataloguePreset } from '../contracts/preset-catalogue';
import type { ParticleFlow, ParticlePhysics, ParticleColliders, ParticleRanges, ParticlesSim, SubEmitter, WeightedShape, BuiltinShape, Range } from '../contracts/particles-v2';

/*
 * Builders shared by the catalogue files. Chunk rule (preset-catalogue 1.1.0): this file imports
 * types only, so nothing from either bundle is copied into the chunk. Every builder returns a fresh
 * object per call (the studio and the card editor may change what they get).
 *
 * Art direction (Living rigs, assets/brand/icon-library/p4-spec.json motion.*): every keyframes
 * loop ends where it starts, motion has weight (anticipation, overshoot, settle), event presets
 * act in the first 60 % and rest for the last 40 %, blinks stay at or under 3 per second and use
 * opacity 0.35..1. Reduced motion is the card's job (it holds the rest pose / one still frame).
 */

/** Theme pairs from p4-spec.json motion.themes (icon colour 3:1 on dark and light; glow decorative). */
export const THEME = {
  fire: { icon: '#d84315', glow: '#ffb300' },
  cleaning: { icon: '#0091a1', glow: '#80deea' },
  christmas: { icon: '#e53935', alt: '#3f8f3f', glow: '#ffd54f' },
  halloween: { icon: '#e65100', alt: '#a050c8', glow: '#b2ff59' },
  valentine: { icon: '#e0457b', glow: '#ff8a80' },
  home: { icon: '#1e88e5', glow: '#ffca28' },
  light: { icon: '#c77700', glow: '#fff3c4' },
} as const;

/** p4-spec motion.global.easing. */
export const EASE = {
  /** Default move. */
  std: 'cubic-bezier(.4,0,.2,1)',
  /** Overshoot into place (settle). */
  settle: 'cubic-bezier(.34,1.56,.64,1)',
  /** Gather before a move (anticipation, falls). */
  in: 'cubic-bezier(.55,0,.75,.3)',
  soft: 'ease-in-out',
  linear: 'linear',
} as const;

/** A drop-shadow glow for icon keyframes (0 px: no glow, still a valid filter so the lane interpolates). */
export const glow = (px: number, colour: string): string => `drop-shadow(0 0 ${px}px ${colour})`;

type T = KeyframeTransform;
/** One keyframe: `at` %, a transform and the other fields. */
export const k = (at: number, transform?: T, rest: Omit<AnimationKeyframe, 'at' | 'transform'> = {}): AnimationKeyframe => ({
  at,
  ...(transform ? { transform: { ...transform } } : {}),
  ...rest,
});

export interface MotionInput {
  /** s; 1.2-4 (art direction). */
  duration: number;
  keyframes: AnimationKeyframe[];
  target?: 'element' | 'icon';
  origin?: string;
  easing?: string;
  direction?: AnimationDoc['direction'];
}

/** A keyframes document (template id: the consumer replaces it). */
export function motionDoc(id: string, name: string, m: MotionInput): AnimationDoc {
  return {
    id,
    name,
    kind: 'keyframes',
    duration: m.duration,
    easing: m.easing ?? EASE.std,
    iterations: 'infinite',
    ...(m.direction ? { direction: m.direction } : {}),
    target: m.target ?? 'icon',
    origin: m.origin ?? 'center',
    version: 1,
    keyframes: m.keyframes.map((f) => clone(f)),
  };
}

/** A deep copy of plain JSON data (the documents hold nothing else). */
const clone = <V>(v: V): V => JSON.parse(JSON.stringify(v)) as V;

/** What a v1-only card plays for each flow (copy of particles-v2 FALLBACK_DIRECTION; runtime imports are not allowed here, the contract test checks they match). */
export const FALLBACK: Record<ParticleFlow, ParticleDirection> = {
  fall: 'fall',
  rise: 'rise',
  drift: 'drift',
  burst: 'burst',
  orbit: 'orbit',
  spiral: 'spiral',
  fountain: 'rise',
  explode: 'burst',
  wave: 'drift',
  vortex: 'spiral',
  zigzag: 'fall',
  rain: 'fall',
  wander: 'drift',
};

/** A weighted built-in shape. */
export const b = (shape: BuiltinShape, weight = 1): WeightedShape => ({ shape: { builtin: shape }, weight });
/** A weighted icon shape. */
export const ic = (icon: string, weight = 1): WeightedShape => ({ shape: { icon }, weight });

export interface ChildInput {
  trigger: SubEmitter['trigger'];
  at?: number;
  count: number;
  shapes?: WeightedShape[];
  size: Range;
  colors?: string[];
  speed: Range;
  lifetime: Range;
  opacity?: Range;
  spin?: Range;
  cone: number;
  inherit?: number;
  physics?: Partial<ParticlePhysics>;
}

export interface ParticlesInput {
  /** s of one baked loop. */
  duration: number;
  flow: ParticleFlow;
  seed: number;
  count: number;
  /** px. */
  size: Range;
  colors: string[];
  /** % of the layer the flow spawns across (or its radius). */
  spread: number;
  layer?: 'back' | 'front';
  fade?: boolean;
  shapes: WeightedShape[];
  ranges: Partial<ParticleRanges> & Pick<ParticleRanges, 'speed' | 'lifetime'>;
  physics?: Partial<ParticlePhysics>;
  colliders?: Partial<ParticleColliders>;
  children?: ChildInput;
}

/** The v1 fallback shape: the first non-builtin shape of the mix (particles-v2 compatibility rule). */
function fallbackShape(shapes: WeightedShape[]): ParticleShape | undefined {
  const s = shapes.find((x) => !('builtin' in x.shape))?.shape;
  return s ? (clone(s) as ParticleShape) : undefined;
}

/** A baked particles-v2 document with a v1 fallback that plays on older cards. */
export function particlesDoc(id: string, name: string, p: ParticlesInput): AnimationDoc {
  const physics: ParticlePhysics = {
    gravity: { angle: 0, strength: 0, ...(p.physics?.gravity ?? {}) },
    drag: p.physics?.drag ?? 0,
    turbulence: { strength: 0, scale: 20, ...(p.physics?.turbulence ?? {}) },
    bounce: p.physics?.bounce ?? 0.5,
  };
  const sim: ParticlesSim = {
    engine: 1,
    mode: 'baked',
    seed: p.seed >>> 0,
    flow: p.flow,
    shapes: clone(p.shapes),
    ranges: {
      speed: [...p.ranges.speed],
      spin: [...(p.ranges.spin ?? [0, 0])],
      delay: [...(p.ranges.delay ?? [0, p.duration])],
      lifetime: [...p.ranges.lifetime],
      opacity: [...(p.ranges.opacity ?? [1, 1])],
    },
    physics,
    colliders: { floor: false, ceiling: false, left: false, right: false, content: 'none', ...(p.colliders ?? {}) },
  };
  const c = p.children;
  if (c) {
    sim.children = {
      trigger: c.trigger,
      ...(c.trigger === 'time' ? { at: c.at ?? 0.5 } : {}),
      count: c.count,
      shapes: clone(c.shapes ?? []),
      size: [...c.size],
      colors: [...(c.colors ?? [])],
      ranges: { speed: [...c.speed], lifetime: [...c.lifetime], opacity: [...(c.opacity ?? [1, 1])], spin: [...(c.spin ?? [0, 0])] },
      cone: c.cone,
      inherit: c.inherit ?? 0,
      ...(c.physics ? { physics: clone(c.physics) } : {}),
    };
  }
  // v1 fallback: the flow's direction, the mean speed as gravity hint for falls / rises
  const g = physics.gravity;
  const down = Math.cos((g.angle * Math.PI) / 180) * g.strength;
  const shape = fallbackShape(p.shapes);
  const particles: ParticlesSpec = {
    ...(shape ? { shape } : {}),
    count: p.count,
    direction: FALLBACK[p.flow],
    speed: 1,
    size: [...p.size],
    colors: [...p.colors],
    spin: 0,
    fade: p.fade ?? true,
    spread: p.spread,
    gravity: Math.max(-1, Math.min(1, Math.round((down / 100) * 100) / 100)),
    layer: p.layer ?? 'back',
    sim,
  };
  return { id, name, kind: 'particles', duration: p.duration, easing: 'linear', iterations: 'infinite', target: 'element', origin: 'center', version: 1, particles };
}

export interface EntryInput {
  id: string;
  name: string;
  /** The mini card's icon in the tile. */
  icon: string;
  tags: string[];
  /** Still tile until hover / focus (P1-3): scenes with child particles, icon particles or many elements. */
  heavy?: boolean;
  doc: (id: string, name: string) => AnimationDoc;
}

/** The entries of one group; build() makes a fresh document whose template id is the entry id. */
export const group = (g: CatalogueGroup, list: EntryInput[]): CataloguePreset[] =>
  list.map((x) => ({ id: x.id, name: x.name, group: g, tags: [...x.tags], icon: x.icon, ...(x.heavy ? { heavy: true } : {}), build: () => x.doc(x.id, x.name) }));
