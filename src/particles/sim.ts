import { PARTICLES_V2_CAPS, type BakeGeometry, type ParticlePhysics, type ParticlesSim, type ParticlesSpecV2, type WeightedShape } from '../contracts/particles-v2';
import { FLOWS, type FlowBody, type FlowCtx, type FlowDef } from './flows';
import { buildColliders, collide, type Box, type ColliderSet, type Hit } from './colliders';

export type { Hit };
import { deriveSeed, pickWeighted, uniform, type Rng } from './rng';
import { dragFactor, gravityVector, turbulence, type Vec } from './physics';

/*
 * World units: 1 unit = 1 % of the layer's shorter side, so motion is round on any aspect.
 * The layer is W x H units (aspect 2: 200 x 100). Velocities and accelerations of the sim are
 * in these units per s / s^2. Positions leave the sim as % of the layer's width and height.
 * Particle sizes are px: collisions convert them with REF_PX (the shorter side of a typical card).
 */

/** px of the layer's shorter side assumed when a px size becomes a collision radius. */
export const REF_PX = 120;
const DT = PARTICLES_V2_CAPS.dt;
/** Shortest life, s (a birth and a death never share a stop). */
const MIN_LIFE = 2 * DT;
/**
 * Longest simulated life, s: bounds the bake's cost (periods can reach 6,000 s). Persistent flows
 * (orbit, wander) need the whole period, so with a longer period they live and fade like the others.
 */
export const MAX_LIFE = 20;

export const DOT: WeightedShape['shape'] = { builtin: 'circle' };

export interface World {
  spec: ParticlesSpecV2;
  sim: ParticlesSim;
  period: number;
  W: number;
  H: number;
  flow: FlowDef;
  ctx: FlowCtx;
  physics: ParticlePhysics;
  colliders: ColliderSet;
  /** Content collider box in world units, when it is on for this geometry. */
  content?: Box;
  /** Gravity plus the flow's built-in fall, units per s^2. */
  gravity: Vec;
  /** Rebounds slower than this rest; slower impacts are no hits. */
  rest: number;
  noiseSeed: number;
}

export interface Particle extends FlowBody {
  index: number;
  /** Loop time of the birth, s, in [0, period). */
  birth: number;
  /** s; a persistent flow lives the whole period. */
  life: number;
  /** deg per s, signed. */
  spin: number;
  /** Peak opacity. */
  peak: number;
  /** px. */
  size: number;
  /** World units. */
  radius: number;
  shape: WeightedShape['shape'];
  color?: string;
  persistent: boolean;
  /** Physics the particle steps with (children may override the parent's). */
  physics: ParticlePhysics;
  gravity: Vec;
  /** Children are pure physics: no flow steering. */
  flow?: FlowDef;
}

/** A point where children can be emitted: position, the parent's velocity there, and for a hit the face normal. */
export interface Emit {
  age: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  nx?: number;
  ny?: number;
  speed?: number;
}

const emitOf = (p: Particle): Emit => ({ age: p.age, x: p.x, y: p.y, vx: p.vx, vy: p.vy });

export interface Sample {
  age: number;
  /** World units. */
  x: number;
  y: number;
  /** deg. */
  rotate: number;
  opacity: number;
  scale: number;
}

const mid = ([a, b]: [number, number]) => (a + b) / 2;
const restSpeed = (g: Vec) => 2 + 2 * Math.hypot(g.x, g.y) * DT;
export const clampLife = (life: number, period: number): number => Math.min(Math.max(life, MIN_LIFE), Math.max(MIN_LIFE, Math.min(MAX_LIFE, period - MIN_LIFE)));
const addVec = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });

/** Everything a bake (or the live engine) needs, from the spec, the loop period and the layer geometry. */
export function createWorld(spec: ParticlesSpecV2, period: number, geometry: BakeGeometry): World {
  const sim = spec.sim;
  const a = geometry.aspect > 0 ? geometry.aspect : 2;
  const W = a >= 1 ? 100 * a : 100;
  const H = a >= 1 ? 100 : 100 / a;
  const flow = FLOWS[sim.flow] ?? FLOWS.fall;
  const noiseSeed = deriveSeed(sim.seed, 3);
  const ctx: FlowCtx = { W, H, spread: spec.spread, vMean: Math.abs(mid(sim.ranges.speed)), lifeMean: clampLife(mid(sim.ranges.lifetime), period), noiseSeed };
  const colliders = buildColliders(sim.colliders, geometry, W, H);
  const gravity = addVec(gravityVector(sim.physics.gravity), { x: 0, y: flow.fall?.(ctx) ?? 0 });
  return {
    spec,
    sim,
    period,
    W,
    H,
    flow,
    ctx,
    physics: sim.physics,
    colliders,
    ...(colliders.content ? { content: colliders.content } : {}),
    gravity,
    rest: restSpeed(gravity),
    noiseSeed,
  };
}

export const shapeOf = (rng: Rng, shapes: WeightedShape[]): WeightedShape['shape'] => {
  const i = pickWeighted(rng, shapes.map((s) => s.weight));
  return shapes.length ? shapes[i].shape : DOT;
};

/** px size to a collision radius in world units. */
export const radiusOf = (size: number): number => (size / 2 / REF_PX) * 100;

/**
 * Parent `index`. Engine 1 draw order: shape, size, speed, spin, spin sign, delay, lifetime,
 * opacity, turning side, then the flow's own draws. Never reorder (P2-2 across versions).
 */
export function spawnParent(w: World, rng: Rng, index: number): Particle {
  const { sim, spec, period } = w;
  const shape = shapeOf(rng, sim.shapes);
  const size = uniform(rng, spec.size);
  const speed = uniform(rng, sim.ranges.speed);
  const spinAbs = uniform(rng, sim.ranges.spin);
  const spin = rng() < 0.5 ? -spinAbs : spinAbs;
  const delay = uniform(rng, sim.ranges.delay);
  const lifeDrawn = uniform(rng, sim.ranges.lifetime);
  const peak = uniform(rng, sim.ranges.opacity);
  const dir = rng() < 0.5 ? -1 : 1;
  const radius = radiusOf(size);
  const persistent = w.flow.persistent && period <= MAX_LIFE;
  const p: Particle = {
    index,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    age: 0,
    speed,
    dir,
    baseX: 0,
    baseY: 0,
    birth: period > 0 ? ((Math.max(0, delay) % period) + period) % period : 0,
    life: persistent ? period : clampLife(lifeDrawn, period),
    spin,
    peak,
    size,
    radius,
    shape,
    ...(spec.colors.length ? { color: spec.colors[index % spec.colors.length] } : {}),
    persistent,
    physics: w.physics,
    gravity: w.gravity,
    flow: w.flow,
  };
  w.flow.spawn(p, rng, w.ctx, radius);
  return p;
}

/** Opacity envelope: fade = 10 % ramps at both ends; no fade = a one-step ramp (invisible at birth and death). */
function envelope(p: Particle, age: number, fade: boolean, period: number): number {
  if (p.persistent) return fade ? 0.675 + 0.325 * Math.cos((age / period) * Math.PI * 2) : 1;
  const ramp = fade ? p.life * 0.1 : DT;
  return Math.max(0, Math.min(1, age / ramp, (p.life - age) / ramp));
}

/** The particle as drawn now (rotation, opacity envelope); shared by the bake and the live engine. */
export function sample(w: World, p: Particle): Sample {
  let rotate = p.spin * p.age;
  if (p.flow?.align && (p.vx || p.vy)) rotate += (Math.atan2(-p.vx, p.vy) * 180) / Math.PI;
  return { age: p.age, x: p.x, y: p.y, rotate, opacity: p.peak * envelope(p, p.age, w.spec.fade, w.period), scale: 1 };
}

/** One fixed step (semi-implicit Euler): forces, drag, move, collide. Returns the hit of this step, if any. */
export function stepParticle(w: World, p: Particle, dt: number): Hit | undefined {
  const a: Vec = { x: p.gravity.x, y: p.gravity.y };
  const t = turbulence(w.noiseSeed, p.physics.turbulence, p, p.age);
  a.x += t.x;
  a.y += t.y;
  p.flow?.accel?.(p, w.ctx, a);
  const k = dragFactor(p.physics.drag, dt);
  p.vx = (p.vx + a.x * dt) * k;
  p.vy = (p.vy + a.y * dt) * k;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.age += dt;
  return collide(p, p.radius, w.W, w.H, w.colliders, p.physics.bounce, w.rest, p.age);
}

/**
 * Steps a particle through its life at the fixed dt (the last step is shorter so it ends exactly
 * at `life`). Persistent flows blend back to their start over the last 15 % (ADR 0004).
 */
export function simulateLife(w: World, p: Particle, at?: number): { samples: Sample[]; hits: Emit[]; at?: Emit; end: Emit } {
  const samples: Sample[] = [sample(w, p)];
  const hits: Emit[] = [];
  let atState: Emit | undefined = at !== undefined && at <= 0 ? emitOf(p) : undefined;
  const start = { x: p.x, y: p.y };
  const steps = Math.ceil(p.life / DT - 1e-9);
  for (let i = 0; i < steps; i++) {
    const dt = Math.min(DT, p.life - p.age);
    if (dt <= 1e-12) break;
    const h = stepParticle(w, p, dt);
    if (i === steps - 1) p.age = p.life;
    if (h) hits.push({ ...h, vx: p.vx, vy: p.vy });
    if (at !== undefined && !atState && p.age >= at - 1e-9) atState = emitOf(p);
    const s = sample(w, p);
    if (p.persistent) {
      const u = Math.max(0, Math.min(1, (p.age - p.life * 0.85) / (p.life * 0.15)));
      const k = u * u * (3 - 2 * u);
      s.x += (start.x - s.x) * k;
      s.y += (start.y - s.y) * k;
    }
    samples.push(s);
  }
  const last = samples[samples.length - 1];
  return { samples, hits, ...(atState ? { at: atState } : {}), end: { ...emitOf(p), x: last.x, y: last.y } };
}
