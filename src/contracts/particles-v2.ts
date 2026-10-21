import type { ParticleShape, ParticleDirection, ParticlesSpec } from '../anim-studio/model';
import type { ParticleSlot } from '../anim-studio/compile';

/*
 * Contract: particles model v2, bake simulator, live engine. Version 1.2.0.
 * Engine 1 output is unchanged since 1.0. Compiler rules:
 * - BakeGeometry.aspect 0 is the "unmeasured" geometry: the unbaked full slot pool, no bake.
 * - A 'baked' CompiledParticlesV2 may carry static rules only (no keyframes) until the layer is measured.
 * - CompiledParticlesV2.slots is the full slot pool at every geometry, so a re-bake never changes the DOM.
 * - ParticlesModule.bakedCss takes an optional `pool`.
 * - The card's first render is unmeasured (`-g0`); `apply` bakes once for the measured size.
 * An implementation that follows 1.0.x and bakes aspect 0 at 0.25 does not fit the card's render path.
 *
 * Multiple emitters, each in front of or behind the card content. Engine stays 1.
 * - validateSim takes an optional `spec` (count, layer), so the document-wide parent cap is checked
 *   where the sim is validated; the compiler's emitter plan still trims as a safety net.
 * - A `layer` equal to ParticlesSpec.layer is valid and means the same as a missing one; the validator
 *   no longer normalises it (the studio's ops never write it).
 * - Lenient: a missing, malformed or duplicate extra emitter id is replaced by a generated `e<n>`;
 *   a broken `children` drops only the children, for every emitter (as for the primary). Invariant:
 *   lenient output always passes strict.
 * - CompiledParticlesV2.emitterSlots: each emitter's part and slot range, for the studio's stage hide
 *   rule (studio-layers contract). Hiding an emitter is no longer an opacity [0, 0] document edit.
 * - bakedCss keeps its signature; per-part rules stay internal to the chunk (apply.ts / css.ts).
 *
 * - ParticlesSim gets optional `emitters` (ParticleEmitter[], 1..PARTICLES_V2_CAPS.emitters - 1 extra
 *   emitters), `id` and `name`. The sim's own fields plus the spec's count / size / colors / fade /
 *   spread are emitter 0, "the primary emitter". A sim without `emitters` (or with an empty list,
 *   which the validator drops) is a 1.1.0 sim and bakes, compiles and renders byte for byte as before.
 * - Placement per emitter. ParticlesSpec.layer is the primary emitter's
 *   placement and the default of every extra emitter; ParticleEmitter.layer overrides it for that
 *   emitter. The studio writes ParticleEmitter.layer only when it differs from ParticlesSpec.layer
 *   (and removes it when equal), so a document whose emitters all sit on one side stores no `layer`
 *   on its extras. When the primary changes side, the studio rewrites the extras' `layer` so they
 *   keep their own side (one undo step). A stored `layer` equal to ParticlesSpec.layer (hand-edited
 *   YAML) is valid, behaves as missing and is kept as stored.
 * - Parts: a document renders AT MOST TWO particle layers, never one per emitter.
 *   Part 0 = the emitters on ParticlesSpec.layer's side (always holds the primary), in array order.
 *   Part 1 = the emitters on the other side, in array order; it exists only when at least one
 *   emitter is there. A document without part 1 renders exactly one layer, as 1.1.0 did
 *   (byte-identical: golden tests).
 * - Shared by all emitters of a document: ParticlesSpec.speed (the period), preset / intensity, and
 *   sim.engine, sim.mode, sim.colliders. Everything else, now including `layer`, is per emitter.
 * - Paint order: within a part, the part's first emitter is drawn first (bottom), its last emitter
 *   last (top). Across parts the card's z-order decides (back under the content, front over it).
 *   The document's slot pool and BakedLoop.elements are [part 0 emitters, then part 1 emitters], each
 *   emitter's block in array order: [e parents, e children] (within an emitter as 1.1.0). So part 0 is
 *   a prefix of the pool, part 1 the rest (BakedLoop.parts gives the cut). Each emitter's block is
 *   contiguous (CompiledParticlesV2.emitterSlots).
 * - Each emitter simulates on its own: its own seed (primary: sim.seed), its own children stream
 *   (deriveSeed(seed, 2) baked, deriveSeed(seed, 5) live layout). Emitters do not collide with each
 *   other. So removing, reordering or moving one emitter to the other side never changes another's
 *   motion, and hiding one in the studio (a stage rule over its slot range) changes nothing baked.
 * - Budgets per DOCUMENT (both parts together) stay the 1.1.0 numbers: parents of all emitters
 *   <= PARTICLES_V2_CAPS.parents; elements of all emitters <= PARTICLES_V2_CAPS.elements; child slots
 *   (elements - all parents) are split over the emitters with children in proportion to their
 *   parents (floor, remainders to the lowest emitter first, clamped to what the emitter wants);
 *   maxBytes is split the same way over emitters by element count (never by bytes, so one emitter's
 *   CSS size never moves another's stops) and covers the CSS of both parts together. With one
 *   emitter these rules give exactly the 1.1.0 numbers. Splitting into two parts adds one layer
 *   element (a span), never slots.
 *   Where the parent cap is enforced: validateSim with `spec` checks
 *   spec.count + all extras' counts (strict: error at `particles.sim.emitters`; lenient: extras'
 *   counts trimmed from the last emitter down, an extra trimmed to 0 is dropped). Without `spec` it
 *   checks the extras' own sum against PARTICLES_V2_CAPS.parents - 1. The compiler's emitter plan
 *   (emitters.ts) always applies the lenient trim with the real spec, so the bound holds on every path.
 *   model.ts (Core) does not check emitters.
 * - One bake per geometry per document: both parts share it (they fill the same wrapper, so they
 *   measure the same). Each part is applied, released and (live) stepped as its own layer; a live
 *   part steps only its own emitters' simulations.
 * - BakedElement.slot indexes the document's pool. With emitters an emitter that bakes fewer elements
 *   than its pool share leaves slots unused, so `slot` may skip; consumers (bakedCss) must key by
 *   `slot`, not by array position. For one emitter slot === array position, as before.
 * - Names: part 0 keeps `<base>-g<key>`; part 1 is `<base>o-g<key>` (unmeasured `<base>o-g0`). The
 *   card keys part 1's stylesheet entry `<docId>o-g<key>` (ParticlesApplyCtx.part), so the two parts
 *   never replace each other's rules.
 * - v1 fallback (old cards, chunk not loaded): the spec's v1 fields describe emitter 0 only, one layer
 *   on ParticlesSpec.layer. An older chunk (1.1.0) drops `emitters`, `id` and `name` (its validator
 *   builds a new object) and plays emitter 0. An older card with this chunk ignores `other` and plays
 *   part 0. No document migration, no AnimationDoc.version change.
 * - Validation (validateSim). Every extra emitter is checked by the primary's per-field rules, error
 *   paths `particles.sim.emitters[i].*`; count 1..PARTICLES_V2_CAPS.parents (integer), size / colors /
 *   fade / spread as ParticlesSpec; `layer` 'front' | 'back' or missing (strict: error; lenient: the
 *   field is dropped, the emitter follows ParticlesSpec.layer). Strict: every problem is an error.
 *   Lenient, same outcome for the primary and the extras:
 *   - a broken `children` drops only `children`; the emitter plays without them;
 *   - any other broken field of an extra drops that extra as a whole (the others play); more than
 *     the cap: the rest are dropped; the parent trim as above.
 *   `id`: 1-16 of [a-z0-9-], unique within the sim (the primary's `sim.id` included). Strict: error on
 *   a missing, malformed or duplicate id. Lenient: such an id is replaced by `e<n>`, n the smallest
 *   positive integer whose `e<n>` is not yet used in the sim, assigned in array order after drops
 *   (deterministic). A malformed `sim.id` is dropped in lenient mode (the studio shows 'main').
 *   `name`: trimmed text, at most 40 characters (lenient: cut to 40).
 *   Lenient output always passes strict with the same `spec`.
 * - ids are written by the studio only once a document has two or more emitters, so a single-emitter
 *   document saved by the 1.2.0 studio is byte-identical to one saved before.
 *
 * Card side of the parts (magic-card.js grows by 230 B measured, 1,024 B at most):
 * - compile.ts compileSim: CompiledAnimation.css = part 0 css + part 1 css (unmeasured pools);
 *   CompiledAnimation gets optional `split: { name, layer: CompiledLayer, sim }` from
 *   CompiledParticlesV2.other, with sim.part = 1. Absent when there is no part 1.
 * - utils/animation.ts customEntry: after part 0's FxLayer it pushes part 1's FxLayer (same style,
 *   tap and timing, its own `front`, `particles`, `sim`). The two spans are adjacent in the wrapper,
 *   in the entry's place, so their order against other entries' layers, seasonal, ring, value
 *   background, border lines and shape is what one layer had. Back parts sit at z-index -1, front
 *   parts at z-index auto (css/animations.ts unchanged); both are clipped by the wrapper as before;
 *   "On tap" restarts both (tap-fx.ts unchanged).
 * - card/magic-card.ts _syncParticles: the stylesheet key gains `o` for part 1. card-decorations.ts,
 *   the loaders and the stylesheet do not change. The card ignores emitterSlots.
 *
 * Implementation: module `particles` (src/particles/, lazy chunk dist/magic-card-particles.js, cap
 * 38,912 B; the studio bundle imports src/particles/index.ts directly).
 * Consumers: the card (src/utils/animation.ts, src/card/*) only through src/utils/particles-loader.ts,
 * the particles editor, the studio's stage hide (emitterSlots) and the studio's animated SVG export.
 *
 * Compatibility:
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
 * Live engine rules: one shared requestAnimationFrame loop for all live layers on the page;
 * a layer steps only while on screen (src/icons/offscreen.ts watchOffscreen) and the page is
 * visible; release() or disconnect stops it; reduced motion draws one still frame and never starts
 * the loop. Baked layers register nothing per frame. 1.2.0: a layer steps one simulation per emitter
 * of its part in the same loop entry and writes one frame over that part's pool.
 *
 * Render sequence on the card (1.1.0; 1.2.0: per part, one bake per geometry shared by both parts):
 * 1. Render: the compiler runs with geometry `{ aspect: 0 }` (the layer has no size yet). It returns
 *    the unbaked pool under `<base>-g0`: static slot rules, no keyframes, no bake. The slots sit at
 *    the base opacity 0 and `animation:none`, so the first paint shows nothing and nothing flashes.
 * 2. After render: `apply` measures the layer, bakes once for the quantised geometry (cached per
 *    document, up to PARTICLES_V2_CAPS.geometryVariants), swaps `data-fx` to that variant's name and
 *    adds its rules. The DOM slots do not change. A layer that cannot be measured bakes DEFAULT_GEOMETRY.
 * 3. A later size change repeats step 2 only.
 * So a card costs one bake per geometry. The pool is the same at every step.
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
 * The layer the bake simulates in, quantised so near-equal cards share one bake: aspect
 * (width / height) to 0.25 steps clamped to [0.25, 8]; content box edges to 5 %.
 *
 * Unmeasured (1.1.0): `aspect` 0 (any value <= 0) is not a size. It is valid only as input to a
 * ParticlesCompiler and means "the layer has not been measured yet". The compiler returns the
 * unbaked full slot pool under the name `<base>-g0` and does not bake, so the 0.25 clamp does not
 * apply to it. `bake()` itself still quantises and clamps as above, and the card never calls it with
 * aspect 0. The card's render uses aspect 0 (the layer has no size before layout); `apply` measures
 * and bakes once. DEFAULT_GEOMETRY (aspect 2) is what `apply` bakes when the layer stays
 * unmeasurable (hidden, not laid out).
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
   * 1.1.0: always the full slot pool of the spec: the parents, then
   * min(parents x children per parent, PARTICLES_V2_CAPS.elements - parents) child slots. It is the
   * same pool at every geometry (measured or not) and in both modes, so a re-bake for another size
   * changes only the rules and the layer's `data-fx`, never the DOM. A bake with fewer elements than
   * slots leaves the rest unanimated (base opacity 0). Baked: element k takes pool look k (shape,
   * size, colour); the collision radius still comes from the bake's own draw of that element.
   * 1.2.0: the pools of part 0's emitters, concatenated in array order (each with its share of child
   * slots, see the header); a baked element takes the pool look of its `slot`.
   */
  slots: ParticleSlotV2[];
  /** Part 0's placement: ParticlesSpec.layer === 'front'. */
  front: boolean;
  /** Part 1, present only when at least one emitter is on the other side. */
  other?: CompiledParticlesPart;
  /**
   * Every emitter of the validated sim (one entry for a single-emitter
   * document), in index order. Optional in the type only so the 1.1.0 chunk still compiles; a 1.2.0
   * chunk always sets it, at every geometry and in both modes. Used by the studio's stage hide
   * (studio-layers contract); the card ignores it. Not part of css, slots or names, so the
   * goldens are unaffected.
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
   * A baked loop as layer CSS (the card). Optional `pool` (1.1.0): the spec's full slot looks. With
   * it, `slots` is the whole pool (not one per baked element) and element k takes pool look k. Without
   * it, one slot per baked element (export, tests). 1.2.0: with `pool`, an element takes pool look
   * `element.slot` (equal to k for one emitter). Renders the whole document as one layer; the card's
   * per-part rules come from the compiler and apply (internal arguments, not part of this contract).
   */
  bakedCss(loop: BakedLoop, name: string, docId: string, pool?: ParticleSlotLook[]): { css: string; slots: ParticleSlotV2[] };
  /** A baked loop as standalone animated SVG markup (studio export, P2-6; live documents export their bake). 1.2.0: back part first, then front. */
  bakedSvg(loop: BakedLoop, opts: { width: number; height: number; background?: string }): string;
  /**
   * After each render, per fx layer of a v2 document: measures the layer, re-bakes when the
   * quantised geometry differs from the compiled one (swaps the layer's data-fx name), and in live
   * mode starts the engine. Idempotent per render. Never throws (logs once).
   * The render before it is unmeasured (`-g0`, no bake); apply bakes once for the measured geometry,
   * or DEFAULT_GEOMETRY when the layer has no size. 1.2.0: `ctx.part` picks the part's name, rules
   * and (live) simulations; both parts use the same cached bake.
   */
  apply(layer: HTMLElement, ctx: ParticlesApplyCtx): void;
  /** The layer left the DOM or the card disconnected: stop and forget it. */
  release(layer: HTMLElement): void;
}
