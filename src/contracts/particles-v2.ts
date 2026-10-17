import type { ParticleShape, ParticleDirection, ParticlesSpec } from '../anim-studio/model';
import type { ParticleSlot } from '../anim-studio/compile';

/*
 * Contract: particles model v2, bake simulator, live engine. Version 1.0.1 (Architect-owned).
 * 1.0.1: documentation only (units text and field comments). No type, constant or behaviour change.
 *
 * Implementation: module `particles` (src/particles/, lazy chunk dist/magic-card-particles.js;
 * the studio bundle imports src/particles/index.ts directly).
 * Consumers: the card (src/utils/animation.ts, src/card/*) only through src/utils/particles-loader.ts,
 * the particles editor and the studio's animated SVG export.
 *
 * Compatibility (P2-9):
 * - A ParticlesSpec without `sim` is a v1 (2026.10.03) spec. It compiles through the existing
 *   compile.ts particlesCss, byte for byte as before. Nothing in this contract touches that path.
 * - `sim` is additive. AnimationDoc.version stays 1. The magic-card-utils integration checks
 *   structure and size only, so it stores `sim` unchanged (no integration release needed).
 * - The card bundle keeps `sim` as stored (unchecked, like the v2 rig fields). Only the particles
 *   chunk and the studio validate it (ParticlesModule.validateSim).
 * - With `sim`, the v1 fields still hold a playable fallback: `direction` = FALLBACK_DIRECTION of
 *   the flow, `shape` = the first non-builtin shape of the mix (or none). An older card, or this
 *   card while the chunk loads or after it failed to load, plays that fallback.
 * - `sim.engine` pins simulator behaviour. A change that alters baked output for the same input
 *   adds engine 2 and keeps engine 1 producing what it produced. Never change engine 1's output.
 *
 * Units (pinned as engine 1 implements them, src/particles/sim.ts; 1.0.1 corrects the 1.0.0 text,
 * which said "% per s" of width / height):
 * - Time in s, angles in deg.
 * - World unit u: 1 u = 1 % of the layer's SHORTER side, so motion is round on any aspect. A layer of
 *   aspect a (width / height) is 100a x 100 u when a >= 1, else 100 x 100/a u (aspect 2: 200 x 100 u).
 * - Speeds (ranges.speed, child speed) are u per s; gravity strength, turbulence strength and flow
 *   forces are u per s^2. On a wide card 10 u/s moves 10 % of the HEIGHT per s, which is
 *   10 / aspect % of the width per s. They are not % of width / height.
 * - Drag is 1/s: v *= exp(-drag * dt) per fixed step. Unit-free.
 * - Turbulence scale is the noise feature size in u (values below 1 act as 1). The field drifts at
 *   0.6 lattice cells per s.
 * - bounce, inherit, opacity and weights are unit-free shares (0-1, or relative).
 * - Positions that leave the sim (BakedStop x, y) are % of the layer's width (x) and height (y),
 *   x / W * 100 and y / H * 100 with W, H the layer in u. Content collider boxes
 *   (BakeGeometry.content) are likewise % of the layer's width and height.
 * - spread (the v1 field, 0-100) is a share of the spawn edge: of the width for fall and rise, of the
 *   height for drift and wave. Rain, fountain, orbit and vortex scale it their own way (flows.ts;
 *   orbit and vortex use it as a ring radius in u: max(5, spread/2) and max(10, spread/2)).
 * - Particle size is px (as v1). Collisions turn it into a radius of size / 2 / 120 * 100 u, as if the
 *   layer's shorter side were 120 px (REF_PX). The drawn size does not scale with the layer.
 * - Lifetime is clamped to [2/60 s, min(20 s, period - 2/60 s)]; persistent flows (orbit, wander)
 *   live the whole period when the period is at most 20 s. delay wraps modulo the period.
 * - The fixed step is PARTICLES_V2_CAPS.dt (1/60 s), semi-implicit Euler.
 *
 * Live engine rules (P2-3): one shared requestAnimationFrame loop for all live layers on the page;
 * a layer steps only while on screen (src/icons/offscreen.ts watchOffscreen) and the page is
 * visible; release() or disconnect stops it; reduced motion draws one still frame and never starts
 * the loop. Baked layers register nothing per frame.
 */

export const PARTICLES_CONTRACT_VERSION = '1.0.1';
export const PARTICLES_ENGINE = 1 as const;

export type ParticleMode = 'baked' | 'live';

/** v1 directions plus the seven new flows. */
export type ParticleFlow = ParticleDirection | 'fountain' | 'explode' | 'wave' | 'vortex' | 'zigzag' | 'rain' | 'wander';
export const NEW_FLOWS = ['fountain', 'explode', 'wave', 'vortex', 'zigzag', 'rain', 'wander'] as const;

/** What a v1-only card plays for each flow (the studio writes it to ParticlesSpec.direction). */
export const FALLBACK_DIRECTION: Record<ParticleFlow, ParticleDirection> = {
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

export type BuiltinShape = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'ring' | 'line' | 'spark';
export const BUILTIN_SHAPES: BuiltinShape[] = ['circle', 'square', 'triangle', 'star', 'heart', 'ring', 'line', 'spark'];

/** One shape of the weighted mix; `weight` > 0, relative to the others (P2-7). */
export interface WeightedShape {
  shape: { builtin: BuiltinShape } | ParticleShape;
  weight: number;
}

/** [min, max], min <= max; each particle draws a uniform value from it (P2-5). */
export type Range = [number, number];

export interface ParticleRanges {
  /** Initial speed, world units per s (1 u = 1 % of the layer's shorter side). */
  speed: Range;
  /** deg per s; each particle also draws its sign. */
  spin: Range;
  /** Birth offset inside the loop period (baked) or between spawns (live), s. */
  delay: Range;
  /** s; baked: clamped to the loop period. */
  lifetime: Range;
  /** 0-1 peak opacity. */
  opacity: Range;
}

export interface ParticlePhysics {
  /** Direction deg (0 = down, 90 = left, 180 = up, 270 = right) and strength, world units per s^2. */
  gravity: { angle: number; strength: number };
  /** Air resistance, 1/s (0 = none). */
  drag: number;
  /** Noise force: strength world units per s^2; scale = feature size in world units (% of the layer's shorter side, min 1). */
  turbulence: { strength: number; scale: number };
  /** Kept share of the velocity on a collider hit, 0-1. */
  bounce: number;
}

export type ContentCollider = 'none' | 'icon' | 'text';

export interface ParticleColliders {
  floor: boolean;
  ceiling: boolean;
  left: boolean;
  right: boolean;
  /** The element's icon or text box (measured on the dashboard: BakeGeometry.content, % of the layer's width and height). */
  content: ContentCollider;
}

export type SubEmitTrigger = 'death' | 'collision' | 'time';

/** One level only: children never have children (validateSim rejects it). */
export interface SubEmitter {
  trigger: SubEmitTrigger;
  /** s after the parent's birth; trigger 'time' only. */
  at?: number;
  /** Children per trigger, 1..PARTICLES_V2_CAPS.childrenPerParent. */
  count: number;
  shapes: WeightedShape[];
  /** px. */
  size: Range;
  /** Empty: the parent's colour. */
  colors: string[];
  ranges: Pick<ParticleRanges, 'speed' | 'lifetime' | 'opacity' | 'spin'>;
  /** Emission cone, deg (360 = all round). */
  cone: number;
  /** 0-1 of the parent's velocity added to each child. */
  inherit: number;
  /** Physics override; missing fields take the parent's. */
  physics?: Partial<ParticlePhysics>;
}

export interface ParticlesSim {
  engine: typeof PARTICLES_ENGINE;
  mode: ParticleMode;
  /** uint32; PRNG mulberry32(seed). Shuffle writes a new one. */
  seed: number;
  flow: ParticleFlow;
  /** Empty: a dot (circle). At most PARTICLES_V2_CAPS.shapes entries. */
  shapes: WeightedShape[];
  ranges: ParticleRanges;
  physics: ParticlePhysics;
  colliders: ParticleColliders;
  children?: SubEmitter;
}

/** A v2 spec: the v1 fields (fallback and shared look: count, size, colors, fade, spread, layer, speed) plus `sim`. */
export type ParticlesSpecV2 = ParticlesSpec & { sim: ParticlesSim };

/** Hard limits. The studio warns when a bake reports stats.warn or stats.capped. */
export const PARTICLES_V2_CAPS = {
  /** Parents per layer (same as ANIMATION_CAPS.particles). */
  parents: 60,
  childrenPerParent: 8,
  /** All elements of one layer, parents + children. */
  elements: 160,
  shapes: 6,
  /** Keyframe stops per element after simplification. */
  stopsPerElement: 32,
  /** Baked CSS of one layer, bytes: warn above warnBytes; never emit more than maxBytes (coarser stops, then fewer children). */
  warnBytes: 64 * 1024,
  maxBytes: 128 * 1024,
  /** Fixed simulation step, s. */
  dt: 1 / 60,
  /** Geometry variants baked per document per page (LRU). */
  geometryVariants: 4,
} as const;

// ── bake ──

/**
 * The layer the bake simulates in, quantised so near-equal cards share one bake: aspect
 * (width / height) to 0.25 steps clamped to [0.25, 8]; content box edges to 5 %.
 */
export interface BakeGeometry {
  aspect: number;
  /** Content collider box in % of the layer's width (x, w) and height (y, h); missing: the content collider is off for this bake. */
  content?: { x: number; y: number; w: number; h: number };
}
export const DEFAULT_GEOMETRY: BakeGeometry = { aspect: 2 };

export interface BakeInput {
  spec: ParticlesSpecV2;
  /** s of one loop: doc.duration / spec.speed. */
  period: number;
  geometry: BakeGeometry;
}

/** One stop of a baked element; t in 0-1 of the period; x, y in % of the layer's width and height. */
export interface BakedStop {
  t: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
}

export interface BakedElement {
  /** Index into the layer's slots (parents first, then children). */
  slot: number;
  /** Parent slot of a child. */
  parent?: number;
  shape: WeightedShape['shape'];
  /** px. */
  size: number;
  color?: string;
  /**
   * Periodic: emission repeats every period, so stop t=0 equals t=1. A life that wraps past the
   * period end is split, the element is invisible (opacity 0) outside its life. Persistent flows
   * (orbit, wander) blend back to their start over the last 15 % of the period. No visible seam.
   */
  stops: BakedStop[];
}

export interface BakedLoop {
  engine: typeof PARTICLES_ENGINE;
  period: number;
  geometry: BakeGeometry;
  elements: BakedElement[];
  stats: { elements: number; stops: number; bytes: number; capped: boolean; warn: boolean };
}

/** Same input, same output (P2-2): pure, no DOM, no Date, no Math.random. */
export type Bake = (input: BakeInput) => BakedLoop;

// ── what the card renders ──

/** compile.ts ParticleSlot plus per-slot content of a mixed layer (additive; v1 slots never set them). */
export interface ParticleSlotV2 extends ParticleSlot {
  /** Built-in shape: the slot renders <i data-s="star">. */
  shape?: BuiltinShape;
  /** Icon / emoji of this slot (overrides the layer's symbol). */
  symbol?: { icon: string } | { text: string };
}

export interface CompiledParticlesV2 {
  mode: ParticleMode;
  /** data-fx / keyframes prefix for this geometry: `mcc-<id>-<hash>-g<geometryKey>`. */
  name: string;
  /** Baked: the layer's rules and keyframes. Live: only the static slot rules (shapes, sizes). */
  css: string;
  slots: ParticleSlotV2[];
  front: boolean;
  stats: BakedLoop['stats'];
}

/** Compile hook the chunk registers in compile.ts (useParticlesCompiler, like useV2Compiler). */
export type ParticlesCompiler = (docId: string, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry) => CompiledParticlesV2;

// ── runtime (after render) ──

export interface ParticlesApplyCtx {
  /** Puts rules into the card's shared animation stylesheet (the card passes its useAnimationCss). */
  useCss(name: string, css: string): void;
  reducedMotion: boolean;
  /** The element whose icon / text box is the content collider. */
  content?: () => Element | undefined;
  docId: string;
  spec: ParticlesSpecV2;
  period: number;
}

/**
 * The chunk's public surface (src/particles/index.ts). Loading the chunk registers the compiler
 * and the lenient validator in the importing bundle; the card's next render compiles v2 specs.
 */
export interface ParticlesModule {
  version: typeof PARTICLES_CONTRACT_VERSION;
  /** Strict (studio) or lenient (card: bad entries dropped) check of a raw `sim`; error paths `particles.sim.*`. */
  validateSim(raw: unknown, mode: 'strict' | 'lenient'): { sim?: ParticlesSim; errors: Array<{ path: string; message: string }> };
  bake: Bake;
  /** A baked loop as layer CSS (the card). */
  bakedCss(loop: BakedLoop, name: string, docId: string): { css: string; slots: ParticleSlotV2[] };
  /** A baked loop as standalone animated SVG markup (studio export, P2-6; live documents export their bake). */
  bakedSvg(loop: BakedLoop, opts: { width: number; height: number; background?: string }): string;
  /**
   * After each render, per fx layer of a v2 document: measures the layer, re-bakes when the
   * quantised geometry differs from the compiled one (swaps the layer's data-fx name), and in live
   * mode starts the engine. Idempotent per render. Never throws (logs once).
   */
  apply(layer: HTMLElement, ctx: ParticlesApplyCtx): void;
  /** The layer left the DOM or the card disconnected: stop and forget it. */
  release(layer: HTMLElement): void;
}
