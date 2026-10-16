import { PARTICLES_ENGINE, PARTICLES_V2_CAPS, type BakedElement, type BakedLoop, type BakedStop, type BakeGeometry, type BakeInput } from '../contracts/particles-v2';
import { deriveSeed, mulberry32 } from './rng';
import { createWorld, simulateLife, spawnParent, type Particle, type Sample, type World } from './sim';
import { childCount, spawnChildren, triggerOf } from './children';
import { BASE_TOLERANCE, rankStops, simplifyRanked, type RawStop } from './simplify';

const CAPS = PARTICLES_V2_CAPS;
/** Bytes of one element's CSS besides its stops (slot rule and @keyframes wrapper); the CSS writer (T2.3) should stay near it. */
export const ELEMENT_OVERHEAD = 160;
/** Tolerances tried, % of the layer, until the layer fits maxBytes. */
const TOLERANCES = [BASE_TOLERANCE, 1, 2, 4, 8, 16, 32];

const rnd = (v: number, d: number) => {
  const f = 10 ** d;
  const r = Math.round(v * f) / f;
  return r === 0 ? 0 : r;
};
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The bake geometry: aspect to 0.25 steps in [0.25, 8], content box edges to 5 %. */
export function quantizeGeometry(g: BakeGeometry): BakeGeometry {
  const a = Number.isFinite(g.aspect) && g.aspect > 0 ? g.aspect : 2;
  const aspect = clamp(Math.round(a * 4) / 4, 0.25, 8);
  const c = g.content;
  if (!c || ![c.x, c.y, c.w, c.h].every(Number.isFinite)) return { aspect };
  const q = (v: number) => clamp(Math.round(v / 5) * 5, 0, 100);
  return { aspect, content: { x: q(c.x), y: q(c.y), w: q(c.w), h: q(c.h) } };
}

const pct = (t: number) => rnd(t * 100, 3);

/** One keyframe stop as the CSS writer emits it (stats.bytes counts these). */
export function stopDecl(s: BakedStop): string {
  return `${pct(s.t)}%{translate:${s.x}cqw ${s.y}cqh;rotate:${s.rotate}deg;opacity:${s.opacity}${s.scale !== 1 ? `;scale:${s.scale}` : ''}}`;
}

const elementBytes = (stops: BakedStop[]) => stops.reduce((n, s) => n + stopDecl(s).length, ELEMENT_OVERHEAD);

interface TimedPoint extends Sample {
  tau: number;
  keep?: boolean;
}

const lerpPoint = (a: TimedPoint, b: TimedPoint, tau: number): TimedPoint => {
  const u = b.tau > a.tau ? (tau - a.tau) / (b.tau - a.tau) : 0;
  const m = (k: 'x' | 'y' | 'rotate' | 'opacity' | 'scale' | 'age') => a[k] + (b[k] - a[k]) * u;
  return { tau, age: m('age'), x: m('x'), y: m('y'), rotate: m('rotate'), opacity: m('opacity'), scale: m('scale'), keep: true };
};

/**
 * A particle's life as stops over one period (ADR 0004): born at `birth`, invisible outside its life,
 * a life that crosses the period end wraps, t=0 equals t=1. Persistent flows cover the whole period;
 * their rotation turns a whole number of times per loop so the CSS loop point is seamless too.
 */
export function loopStops(w: World, p: Particle, samples: Sample[]): RawStop[] {
  const P = w.period;
  const pts: TimedPoint[] = samples.map((s) => ({ ...s, tau: p.birth + s.age }));
  if (!p.persistent) {
    pts[0].keep = true;
    pts[pts.length - 1].keep = true;
    pts.push({ ...pts[0], tau: p.birth + P, keep: true });
  } else {
    pts[pts.length - 1] = { ...pts[0], tau: p.birth + P };
  }
  let seq: TimedPoint[];
  if (p.birth <= 0) seq = pts;
  else {
    let k = pts.findIndex((q) => q.tau >= P);
    if (k < 1) k = 1;
    const q = pts[k].tau === P ? { ...pts[k], keep: true } : lerpPoint(pts[k - 1], pts[k], P);
    const before = pts.slice(0, k);
    const after = pts.slice(pts[k].tau === P ? k + 1 : k, -1).map((x) => ({ ...x, tau: x.tau - P }));
    seq = [{ ...q, tau: 0 }, ...after, ...before, { ...q, tau: P }];
  }
  const total = p.persistent ? Math.round((p.spin * P) / 360) * 360 : 0;
  const raw: RawStop[] = seq.map((s) => ({
    t: s.tau / P,
    x: (s.x / w.W) * 100,
    y: (s.y / w.H) * 100,
    rotate: p.persistent ? (total * s.tau) / P : s.rotate,
    opacity: s.opacity,
    scale: s.scale,
    ...(s.keep ? { keep: true } : {}),
  }));
  raw[0].t = 0;
  raw[raw.length - 1].t = 1;
  return raw;
}

/** Rounds a simplified element and drops stops that round onto the previous one's time. */
function finish(stops: RawStop[]): BakedStop[] {
  const out: BakedStop[] = [];
  stops.forEach((s, i) => {
    const t = i === stops.length - 1 ? 1 : rnd(s.t, 5);
    const r: BakedStop = { t, x: rnd(s.x, 2), y: rnd(s.y, 2), rotate: rnd(s.rotate, 1), opacity: rnd(clamp(s.opacity, 0, 1), 3), scale: rnd(s.scale, 3) };
    const prev = out[out.length - 1];
    if (prev && prev.t >= t) {
      if (i === stops.length - 1) out[out.length - 1] = r;
      else if (s.keep) out[out.length - 1] = r;
      return;
    }
    out.push(r);
  });
  return out;
}

interface Item {
  p: Particle;
  raw: RawStop[];
  rank: Float64Array;
  /** Parent index of a child. */
  parent?: number;
}

/** Same input, same output (P2-2): no DOM, no Date, no Math.random. */
export function bake(input: BakeInput): BakedLoop {
  const { spec } = input;
  const sim = spec.sim;
  const period = input.period > 0 && Number.isFinite(input.period) ? input.period : 1;
  const geometry = quantizeGeometry(input.geometry);
  const w = createWorld(spec, period, geometry);
  const asked = Math.max(0, Math.floor(spec.count));
  const n = Math.min(asked, CAPS.parents);
  let capped = asked > CAPS.parents;

  const c = sim.children;
  const per = childCount(c);
  const rng = mulberry32(sim.seed);
  const parents: Item[] = [];
  const runs: Array<ReturnType<typeof simulateLife>> = [];
  for (let i = 0; i < n; i++) {
    const p = spawnParent(w, rng, i);
    const run = simulateLife(w, p, c?.trigger === 'time' ? (c.at ?? 0) : undefined);
    runs.push(run);
    const raw = loopStops(w, p, run.samples);
    parents.push({ p, raw, rank: rankStops(raw) });
  }

  // children: one trigger per parent, slots after all parents, the element cap shared evenly
  const kids: Item[] = [];
  if (c && per > 0) {
    const firing = parents.map((it, i) => (triggerOf(c, runs[i]) ? i : -1)).filter((i) => i >= 0);
    const budget = CAPS.elements - n;
    const base = firing.length ? Math.floor(budget / firing.length) : 0;
    const extra = firing.length ? budget % firing.length : 0;
    if (firing.length * per > budget) capped = true;
    const crng = mulberry32(deriveSeed(sim.seed, 2));
    firing.forEach((i, j) => {
      const keep = Math.min(per, base + (j < extra ? 1 : 0));
      const e = triggerOf(c, runs[i])!;
      for (const ch of spawnChildren(w, c, parents[i].p, e, crng, keep)) {
        const raw = loopStops(w, ch, simulateLife(w, ch).samples);
        kids.push({ p: ch, raw, rank: rankStops(raw), parent: i });
      }
    });
  }

  // stops: tolerance 0.5 %, coarser until the layer fits maxBytes, then fewer children, then fewer elements
  let limit = per;
  let elements: BakedElement[] = [];
  let bytes = 0;
  for (;;) {
    const items = [...parents, ...kids.filter((k) => k.p.index < limit)];
    for (const tol of TOLERANCES) {
      elements = [];
      bytes = 0;
      const slotOf = new Map<number, number>();
      items.forEach((it, slot) => {
        if (it.parent === undefined) slotOf.set(it.p.index, slot);
        const stops = finish(simplifyRanked(it.raw, it.rank, tol, CAPS.stopsPerElement));
        bytes += elementBytes(stops);
        elements.push({
          slot,
          ...(it.parent !== undefined ? { parent: slotOf.get(it.parent)! } : {}),
          shape: { ...it.p.shape },
          size: rnd(it.p.size, 2),
          ...(it.p.color !== undefined ? { color: it.p.color } : {}),
          stops,
        });
      });
      if (bytes <= CAPS.maxBytes) break;
      capped = true;
    }
    if (bytes <= CAPS.maxBytes || limit === 0) break;
    limit = Math.floor(limit / 2);
  }
  while (bytes > CAPS.maxBytes && elements.length) {
    const e = elements.pop()!;
    bytes -= elementBytes(e.stops);
    capped = true;
  }

  const stops = elements.reduce((s, e) => s + e.stops.length, 0);
  return {
    engine: PARTICLES_ENGINE,
    period,
    geometry,
    elements,
    stats: { elements: elements.length, stops, bytes, capped, warn: bytes > CAPS.warnBytes },
  };
}
