import type { ParticlePhysics } from '../contracts/particles-v2';
import { hash3 } from './rng';

/** Vector in world units (see sim.ts: 1 unit = 1 % of the layer's shorter side). */
export interface Vec {
  x: number;
  y: number;
}

const DEG = Math.PI / 180;

/** Gravity as a vector: angle 0 = down, 90 = left, 180 = up, 270 = right (y grows downwards). */
export function gravityVector(g: ParticlePhysics['gravity']): Vec {
  const a = g.angle * DEG;
  return { x: -Math.sin(a) * g.strength, y: Math.cos(a) * g.strength };
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth value noise in [-1, 1] over a 3D lattice (x, y in features, z in time). Seeded, integer hashing only. */
export function noise3(seed: number, x: number, y: number, z: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const z0 = Math.floor(z);
  const fx = smooth(x - x0);
  const fy = smooth(y - y0);
  const fz = smooth(z - z0);
  const v = (i: number, j: number, k: number) => hash3(seed, x0 + i, y0 + j, z0 + k);
  const a = lerp(lerp(v(0, 0, 0), v(1, 0, 0), fx), lerp(v(0, 1, 0), v(1, 1, 0), fx), fy);
  const b = lerp(lerp(v(0, 0, 1), v(1, 0, 1), fx), lerp(v(0, 1, 1), v(1, 1, 1), fx), fy);
  return lerp(a, b, fz) * 2 - 1;
}

/** How fast the turbulence field changes, lattice cells per s. */
const TURBULENCE_RATE = 0.6;

/** Turbulence force at a point and time: two independent noise channels scaled by strength. */
export function turbulence(seed: number, t: ParticlePhysics['turbulence'], p: Vec, time: number): Vec {
  if (!(t.strength > 0)) return { x: 0, y: 0 };
  const s = Math.max(1, t.scale);
  const z = time * TURBULENCE_RATE;
  return {
    x: noise3(seed, p.x / s, p.y / s, z) * t.strength,
    y: noise3(seed ^ 0x5bd1e995, p.x / s, p.y / s, z + 17) * t.strength,
  };
}

/** Velocity factor of one step of air resistance (exponential, so any dt is stable). */
export const dragFactor = (drag: number, dt: number): number => (drag > 0 ? Math.exp(-drag * dt) : 1);
