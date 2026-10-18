import { PARTICLES_V2_CAPS as CAPS, type ParticleEmitter, type ParticlesSpecV2 } from '../contracts/particles-v2';
import { childCount } from './children';

/*
 * Emitters (particles-v2 1.2.0): a document is a list of emitters, each run by the single-emitter code
 * (bake, live) as a whole spec of its own. A plan orders them into at most two parts (part 0 = the
 * emitters on the primary's side, part 1 = the others) and gives each its parents, child slots and
 * pool offset. One emitter: the plan is the spec itself, so everything stays what 1.1.0 produced.
 */

export interface Plan {
  spec: ParticlesSpecV2;
  /** Parents, children slots and where its block starts in the document pool. */
  n: number;
  m: number;
  at: number;
  front: boolean;
  /** 0 = the primary, i = sim.emitters[i - 1]. */
  index: number;
}

export interface DocPlan {
  /** Part 0's emitters, then part 1's. */
  plans: Plan[];
  /** Index of part 1's first emitter in `plans`; plans.length: no part 1. */
  cut: number;
  pool: number;
}

const asSpec = (s: ParticlesSpecV2, e: ParticleEmitter): ParticlesSpecV2 => ({
  ...s,
  count: e.count,
  size: e.size,
  colors: e.colors,
  fade: e.fade,
  spread: e.spread,
  layer: e.layer ?? s.layer,
  sim: { ...s.sim, seed: e.seed, flow: e.flow, shapes: e.shapes, ranges: e.ranges, physics: e.physics, children: e.children },
});

const sum = (a: number[]): number => a.reduce((x, y) => x + y, 0);

export function emitterPlan(spec: ParticlesSpecV2): DocPlan {
  const all = [spec, ...(spec.sim.emitters ?? []).slice(0, CAPS.emitters - 1).map((e) => asSpec(spec, e))];
  // parents: the document cap, trimmed from the last emitter down
  let left = CAPS.parents;
  const ns = all.map((s) => {
    const n = Math.min(Math.max(0, Math.floor(s.count)), left);
    left -= n;
    return n;
  });
  // child slots: what each wants, or the room shared in proportion to the parents (remainders to the lowest first)
  const want = all.map((s, i) => ns[i] * childCount(s.sim.children));
  const room = CAPS.elements - sum(ns);
  let ms = want;
  if (sum(want) > room) {
    const kids = sum(ns.filter((_, i) => want[i]));
    ms = want.map((w, i) => w && Math.min(w, Math.floor((room * ns[i]) / kids)));
    let rest = room - sum(ms);
    ms = ms.map((m, i) => (m < want[i] && rest-- > 0 ? m + 1 : m));
  }
  const back = spec.layer !== 'front';
  const plans: Plan[] = all.map((s, i) => ({ spec: s, n: ns[i], m: ms[i], at: 0, front: s.layer === 'front', index: i }));
  const other = (p: Plan) => p.front === back;
  const ordered = [...plans.filter((p) => !other(p)), ...plans.filter(other)];
  let at = 0;
  ordered.forEach((p) => {
    p.at = at;
    at += p.n + p.m;
  });
  const cut = ordered.findIndex(other);
  return { plans: ordered, cut: cut < 0 ? ordered.length : cut, pool: at };
}

/** First pool slot of part 1 (the pool length when there is none). */
export const cutSlot = (d: DocPlan): number => (d.cut < d.plans.length ? d.plans[d.cut].at : d.pool);

/** Part 0's and part 1's share of a pool-ordered list. */
export const parts = <T>(d: DocPlan, xs: T[]): [T[], T[]] => [xs.slice(0, cutSlot(d)), xs.slice(cutSlot(d))];
