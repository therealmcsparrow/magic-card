import type { Range } from '../contracts/particles-v2';

/** A seeded uniform source in [0, 1). */
export type Rng = () => number;

/** mulberry32 (particles-v2: `sim.seed` is its uint32 seed). Engine 1 output depends on it: never change. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** An independent stream for one purpose (parents, children, noise), so changing one part of a sim does not reshuffle the others. */
export const deriveSeed = (seed: number, salt: number): number => {
  let h = Math.imul((seed >>> 0) ^ Math.imul(salt, 0x9e3779b1), 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
};

/** A uniform draw inside [min, max] (P2-5); a reversed pair is read as [max, min]. */
export function uniform(rng: Rng, [a, b]: Range): number {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const r = rng();
  return hi === lo ? lo : lo + r * (hi - lo);
}

/** Index picked by relative weight (P2-7). Non-positive weights never win; all zero: index 0. Always draws once. */
export function pickWeighted(rng: Rng, weights: readonly number[]): number {
  const r = rng();
  let total = 0;
  for (const w of weights) total += w > 0 ? w : 0;
  if (!(total > 0)) return 0;
  let acc = 0;
  const x = r * total;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i] > 0 ? weights[i] : 0;
    acc += w;
    if (x < acc) return i;
  }
  for (let i = weights.length - 1; i >= 0; i--) if (weights[i] > 0) return i;
  return 0;
}

/** Hash of a lattice point to [0, 1) (turbulence value noise). Integer maths only. */
export function hash3(seed: number, x: number, y: number, z: number): number {
  let h = seed ^ Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
