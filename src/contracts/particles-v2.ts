import type { ParticleShape, ParticleDirection, ParticlesSpec } from '../anim-studio/model';
import type { ParticleSlot } from '../anim-studio/compile';

/**
 * Contract: particles model v2, bake simulator, live engine. Version 1.2.0. Engine 1 output is unchanged since
 * 1.0.
 */

export const PARTICLES_CONTRACT_VERSION = '1.2.0';
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

/** One shape of the weighted mix; `weight` > 0, relative to the others. */
export interface WeightedShape {
  shape: { builtin: BuiltinShape } | ParticleShape;
  weight: number;
}

/** [min, max], min <= max; each particle draws a uniform value from it. */
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

/**
 * One extra emitter of a document. Its fields mean what the same-named fields of
 * ParticlesSpec (count, size, colors, fade, spread, layer) and ParticlesSim (seed, flow, shapes,
 * ranges, physics, children) mean for the primary emitter. Shared fields (speed, engine, mode,
 * colliders) are the document's, never per emitter.
 */
export interface ParticleEmitter {
  /** Stable key for the studio (layer view state, selection): 1-16 of [a-z0-9-], unique within the sim. Lenient validation generates `e<n>` for a missing or bad one. */
  id: string;
  /** Shown in the layers list; missing: the flow's label (numbered when two emitters share it). At most 40 characters. */
  name?: string;
  /**
   * This emitter's placement. Missing: ParticlesSpec.layer (the primary's side).
   * Written only when it differs from ParticlesSpec.layer. Emitters on the other side than the primary
   * render in part 1, the document's second (and last) particle layer.
   */
  layer?: 'front' | 'back';
  /** uint32; this emitter's own PRNG stream. */
  seed: number;
  /** Parents, 1..PARTICLES_V2_CAPS.parents; all emitters of a document together at most PARTICLES_V2_CAPS.parents. */
  count: number;
  /** [min, max] px. */
  size: Range;
  /** Empty: the animation colour. */
  colors: string[];
  fade: boolean;
  /** 0-100, as ParticlesSpec.spread. */
  spread: number;
  flow: ParticleFlow;
  /** Empty: a dot (circle). At most PARTICLES_V2_CAPS.shapes entries. */
  shapes: WeightedShape[];
  ranges: ParticleRanges;
  physics: ParticlePhysics;
  children?: SubEmitter;
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
  /** 1.2.0: the primary emitter's id (same rules as ParticleEmitter.id); written only when `emitters` is set. */
  id?: string;
  /** 1.2.0: the primary emitter's name (same rules as ParticleEmitter.name). */
  name?: string;
  /** 1.2.0: extra emitters in array order (each drawn above the earlier ones of its side). Missing or empty: one emitter. */
  emitters?: ParticleEmitter[];
}

/** A v2 spec: the v1 fields (fallback and shared look: count, size, colors, fade, spread, layer, speed) plus `sim`. */
export type ParticlesSpecV2 = ParticlesSpec & { sim: ParticlesSim };

/** Hard limits. The studio warns when a bake reports stats.warn or stats.capped. */
export const PARTICLES_V2_CAPS = {
  /** Parents per document (same as ANIMATION_CAPS.particles); 1.2.0: all emitters of both parts together. */
  parents: 60,
  childrenPerParent: 8,
  /** All elements of one document, parents + children (1.2.0: of all emitters, both parts). */
  elements: 160,
  shapes: 6,
  /** 1.2.0: emitters per document, the primary included. */
  emitters: 4,
  /** Particle layers per document (part 0 and part 1). */
  parts: 2,
  /** Keyframe stops per element after simplification. */
  stopsPerElement: 32,
  /** Baked CSS of one document (both parts), bytes: warn above warnBytes; never emit more than maxBytes (coarser stops, then fewer children). */
  warnBytes: 64 * 1024,
  maxBytes: 128 * 1024,
  /** Fixed simulation step, s. */
  dt: 1 / 60,
  /** Geometry variants baked per document per page (LRU). */
  geometryVariants: 4,
} as const;

// ── bake ──

/**
 * The layer the bake simulates in, quantised so near-equal cards share one bake: aspect (width / height) to 0.25
 * steps clamped to [0.25, 8]; content box edges to 5 %. Unmeasured (1.1.0): `aspect` 0 (any value <= 0) is not a
 * size. It is valid only as input to a ParticlesCompiler and means "the layer has not been measured yet".
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
  /** Index into the document's slot pool (part 0 emitters, then part 1; per emitter parents, then children). 1.2.0: may skip. */
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
  /**
   * Where part 1 starts, present only when the document has part 1. `element`: index
   * of its first entry in `elements`; `slot`: its first pool slot; `front`: part 1 is in front of the
   * content. bakedCss renders the whole loop (export, tests); bakedSvg draws the back part first.
   */
  parts?: { element: number; slot: number; front: boolean };
}

/** Same input, same output: pure, no DOM, no Date, no Math.random. */
export type Bake = (input: BakeInput) => BakedLoop;

// ── what the card renders ──

/** compile.ts ParticleSlot plus per-slot content of a mixed layer (additive; v1 slots never set them). */
export interface ParticleSlotV2 extends ParticleSlot {
  /** Built-in shape: the slot renders <i data-s="star">. */
  shape?: BuiltinShape;
  /** Icon / emoji of this slot (overrides the layer's symbol). */
  symbol?: { icon: string } | { text: string };
}

/** What one slot looks like (1.1.0): the same for a baked element and a pool entry. */
export interface ParticleSlotLook {
  shape: WeightedShape['shape'];
  /** px. */
  size: number;
  color?: string;
}

/** The second particle layer of a document (part 1, the emitters on the other side). */
export interface CompiledParticlesPart {
  /** `<base>o-g<geometryKey>`; unmeasured `<base>o-g0`. */
  name: string;
  /** Part 1's rules, as CompiledParticlesV2.css for part 0. */
  css: string;
  /** Part 1's pool (the document pool from BakedLoop.parts.slot on); nth-child k+1 = pool slot parts.slot + k. */
  slots: ParticleSlotV2[];
  /** Always !CompiledParticlesV2.front. */
  front: boolean;
}

/**
 * One emitter's slots in its part's layer. Its block is
 * contiguous: parents at nth-child first+1 .. first+parents, then children at
 * first+parents+1 .. first+parents+children. Counts are the pool shares after the budget split
 * (what the DOM holds), not what the bake filled. Independent of geometry.
 */
export interface CompiledEmitterSlots {
  /** 0 = the primary, i = sim.emitters[i - 1] of the VALIDATED sim. */
  index: number;
  /** 0: in CompiledParticlesV2's own layer; 1: in `other`. */
  part: 0 | 1;
  /** 0-based offset of the emitter's first slot within its part's slots. */
  first: number;
  parents: number;
  children: number;
}

export interface CompiledParticlesV2 {
  /** The spec's mode. An unmeasured (aspect 0) 'baked' layer keeps mode 'baked' while its css is static (see css). */
  mode: ParticleMode;
  /** data-fx / keyframes prefix for this geometry: `mcc-<id>-<hash>-g<geometryKey>`; unmeasured: `...-g0`. */
  name: string;
  /**
   * Measured baked: the layer's rules and keyframes. Live: only the static slot rules (shapes, sizes).
   * Unmeasured (aspect 0), either mode (1.1.0): only the static slot rules, no keyframes and
   * `animation:none`, until `apply` swaps in the measured bake. A consumer must not assume that a
   * 'baked' result has keyframes. 1.2.0: part 0 only.
   */
  css: string;
  /**
   * 1.1.0: always the full slot pool of the spec: the parents, then min(parents x children per parent,
   * PARTICLES_V2_CAPS.elements - parents) child slots. It is the same pool at every geometry (measured or not) and
   * in both modes, so a re-bake for another size changes only the rules and the layer's `data-fx`, never the DOM.
   */
  slots: ParticleSlotV2[];
  /** Part 0's placement: ParticlesSpec.layer === 'front'. */
  front: boolean;
  /** Part 1, present only when at least one emitter is on the other side. */
  other?: CompiledParticlesPart;
  /**
   * Every emitter of the validated sim (one entry for a single-emitter document), in index order. Optional in the
   * type only so the 1.1.0 chunk still compiles; a 1.2.0 chunk always sets it, at every geometry and in both modes.
   * Used by the studio's stage hide (studio-layers contract); the card ignores it.
   */
  emitterSlots?: CompiledEmitterSlots[];
  /** Unmeasured: elements = slots.length, stops 0, bytes = css length, capped and warn false. 1.2.0: the whole document. */
  stats: BakedLoop['stats'];
}

/**
 * Compile hook the chunk registers in compile.ts (useParticlesCompiler, like useV2Compiler).
 * `geometry.aspect` 0 = unmeasured: the unbaked pool, no bake (see BakeGeometry).
 */
export type ParticlesCompiler = (docId: string, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry) => CompiledParticlesV2;

// ── runtime (after render) ──

export interface ParticlesApplyCtx {
  /** Puts rules into the card's shared animation stylesheet (the card passes its useAnimationCss). */
  useCss(name: string, css: string): void;
  reducedMotion: boolean;
  /** The element whose icon / text box is the content collider. */
  content?: () => Element | undefined;
  docId: string;
  /** The whole document's spec, for both parts (the bake is shared). */
  spec: ParticlesSpecV2;
  period: number;
  /** This layer is part 1 (the emitters on the other side). Missing: part 0. */
  part?: 1;
}

/**
 * The chunk's public surface (src/particles/index.ts). Loading the chunk registers the compiler
 * and the lenient validator in the importing bundle; the card's next render compiles v2 specs.
 */
export interface ParticlesModule {
  version: typeof PARTICLES_CONTRACT_VERSION;
  /**
   * Strict (studio) or lenient (card: bad entries dropped) check of a raw `sim`; error paths
   * `particles.sim.*`. 1.2.0: optional `spec` (the primary's count and side) enables the
   * document-wide parent cap (see the header); the studio always passes it, the compiler too.
   */
  validateSim(raw: unknown, mode: 'strict' | 'lenient', spec?: Pick<ParticlesSpec, 'count' | 'layer'>): { sim?: ParticlesSim; errors: Array<{ path: string; message: string }> };
  bake: Bake;
  /**
   * A baked loop as layer CSS (the card). Optional `pool` (1.1.0): the spec's full slot looks. With it, `slots` is
   * the whole pool (not one per baked element) and element k takes pool look k. Without it, one slot per baked
   * element (export, tests). 1.2.0: with `pool`, an element takes pool look `element.slot` (equal to k for one.
   */
  bakedCss(loop: BakedLoop, name: string, docId: string, pool?: ParticleSlotLook[]): { css: string; slots: ParticleSlotV2[] };
  /** A baked loop as standalone animated SVG markup (studio export, P2-6; live documents export their bake). 1.2.0: back part first, then front. */
  bakedSvg(loop: BakedLoop, opts: { width: number; height: number; background?: string }): string;
  /**
   * After each render, per fx layer of a v2 document: measures the layer, re-bakes when the quantised geometry
   * differs from the compiled one (swaps the layer's data-fx name), and in live mode starts the engine. Idempotent
   * per render. Never throws (logs once).
   */
  apply(layer: HTMLElement, ctx: ParticlesApplyCtx): void;
  /** The layer left the DOM or the card disconnected: stop and forget it. */
  release(layer: HTMLElement): void;
}
