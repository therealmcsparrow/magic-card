import type { ParticlePhysics, SubEmitter } from '../contracts/particles-v2';
import { PARTICLES_V2_CAPS } from '../contracts/particles-v2';
import { uniform, type Rng } from './rng';
import { gravityVector, type Vec } from './physics';
import { clampLife, radiusOf, shapeOf, simulateLife, type Emit, type Particle, type World } from './sim';

const DEG = Math.PI / 180;

/** Children per trigger the spec asks for, within the cap. */
export const childCount = (c: SubEmitter | undefined): number => (c ? Math.max(0, Math.min(PARTICLES_V2_CAPS.childrenPerParent, Math.floor(c.count))) : 0);

/** Where the parent's children start: its first hit, its death, or `at` s after birth. One trigger per parent life. */
export function triggerOf(c: SubEmitter, run: ReturnType<typeof simulateLife>): Emit | undefined {
  if (c.trigger === 'collision') return run.hits[0];
  if (c.trigger === 'time') return run.at;
  return run.end;
}

/** The children's physics: the parent's, with the emitter's override on top. */
export function childPhysics(w: World, c: SubEmitter): { physics: ParticlePhysics; gravity: Vec } {
  const o = c.physics ?? {};
  const physics: ParticlePhysics = { ...w.physics, ...o };
  const flowFall = w.gravity.y - gravityVector(w.physics.gravity).y;
  const g = gravityVector(physics.gravity);
  return { physics, gravity: { x: g.x, y: g.y + flowFall } };
}

/**
 * `count` children of `parent` at `e`. Children burst out in a cone around the hit normal (collision)
 * or the parent's direction of travel (death, time), plus `inherit` of the parent's velocity.
 * Each child draws, in this order: shape, size, speed, spin, spin sign, lifetime, opacity, cone angle.
 * Every requested child draws, even when the element cap keeps only the first `keep` (stable streams).
 */
export function spawnChildren(w: World, c: SubEmitter, parent: Particle, e: Emit, rng: Rng, keep: number): Particle[] {
  const n = childCount(c);
  const { physics, gravity } = childPhysics(w, c);
  const sp = Math.hypot(e.vx, e.vy);
  const base = e.nx !== undefined && e.ny !== undefined ? Math.atan2(e.nx, -e.ny) : sp > 1e-9 ? Math.atan2(e.vx, -e.vy) : 0;
  const cone = Math.max(0, Math.min(360, c.cone)) * DEG;
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const shape = shapeOf(rng, c.shapes);
    const size = uniform(rng, c.size);
    const speed = uniform(rng, c.ranges.speed);
    const spinAbs = uniform(rng, c.ranges.spin);
    const spin = rng() < 0.5 ? -spinAbs : spinAbs;
    const life = clampLife(uniform(rng, c.ranges.lifetime), w.period);
    const peak = uniform(rng, c.ranges.opacity);
    const a = base + (rng() - 0.5) * cone;
    if (i >= keep) continue;
    const color = c.colors.length ? c.colors[i % c.colors.length] : parent.color;
    out.push({
      index: i,
      x: e.x,
      y: e.y,
      vx: Math.sin(a) * speed + e.vx * c.inherit,
      vy: -Math.cos(a) * speed + e.vy * c.inherit,
      age: 0,
      speed,
      dir: 1,
      baseX: e.x,
      baseY: e.y,
      birth: (((parent.birth + e.age) % w.period) + w.period) % w.period,
      life,
      spin,
      peak,
      size,
      radius: radiusOf(size),
      shape,
      ...(color !== undefined ? { color } : {}),
      persistent: false,
      physics,
      gravity,
    });
  }
  return out;
}
