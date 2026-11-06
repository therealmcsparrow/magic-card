import type { SceneId } from '../utils/seasonal';
import {
  AMBIENT_PIECES,
  SCENES,
  isSceneId,
  particleBudget,
  seededRandom,
  type Ambient,
  type Particle,
  type ParticleSpec,
  type SceneLayout,
} from '../utils/seasonal-scenes';

/** Particle layout of the seasonal scenes. Chunk-only (dist/magic-card-seasonal.js). */

const r2 = (n: number) => Math.round(n * 100) / 100;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Particle counts per spec: the budget split by weight (each scene an equal share), at most `max`
 * per spec, rounded by largest remainder so the total is exact (unless every spec is full).
 */
function counts(entries: Array<{ spec: ParticleSpec; share: number }>, budget: number): number[] {
  const out = entries.map(() => 0);
  let left = budget;
  // a few passes: what a full spec cannot take goes to the others
  for (let pass = 0; pass < 4 && left > 0; pass++) {
    const open = entries.map((e, i) => ({ e, i })).filter(({ e, i }) => out[i] < (e.spec.max ?? Infinity));
    const total = open.reduce((s, { e }) => s + e.share, 0);
    if (!total) break;
    const raw = open.map(({ e, i }) => ({ i, want: (left * e.share) / total, room: (e.spec.max ?? Infinity) - out[i] }));
    let given = 0;
    for (const r of raw) {
      const n = Math.min(Math.floor(r.want), r.room);
      out[r.i] += n;
      given += n;
    }
    const rest = raw
      .filter((r) => out[r.i] < (entries[r.i].spec.max ?? Infinity))
      .sort((a, b) => b.want - Math.floor(b.want) - (a.want - Math.floor(a.want)) || a.i - b.i);
    for (const r of rest) {
      if (given >= left) break;
      out[r.i]++;
      given++;
    }
    left -= given;
  }
  return out;
}

/** The particles and ambient layers of `scenes` (unknown ids skipped) at `intensity` (0..1), laid out from `seed`. */
export function layoutScenes(scenes: readonly SceneId[], intensity: number, seed = 'mc'): SceneLayout {
  const defs = scenes.filter(isSceneId).filter((s, i, a) => a.indexOf(s) === i).map((s) => SCENES[s]);
  const ambient: Ambient[] = [];
  for (const d of defs) for (const kind of d.ambient ?? []) if (!ambient.some((a) => a.kind === kind)) ambient.push({ key: `a-${kind}`, kind });
  const entries = defs.flatMap((d) => {
    const total = d.particles.reduce((s, p) => s + p.weight, 0) || 1;
    return d.particles.map((spec, i) => ({ scene: d.id, spec, index: i, share: spec.weight / total / defs.length }));
  });
  const pieces = ambient.reduce((sum, a) => sum + AMBIENT_PIECES[a.kind], 0);
  const n = counts(entries, particleBudget(intensity, pieces));
  const particles: Particle[] = [];
  entries.forEach(({ scene, spec, index }, e) => {
    const count = n[e];
    // a per-spec offset so two kinds do not line up column by column
    const offset = seededRandom(`${seed}|${scene}|${index}`)();
    for (let k = 0; k < count; k++) {
      const rnd = seededRandom(`${seed}|${scene}|${spec.kind}|${index}|${k}`);
      const depth = rnd();
      const band = spec.band ?? [4, 96];
      const swatch = spec.palette[(k + Math.floor(offset * spec.palette.length)) % spec.palette.length];
      const [color, accent] = typeof swatch === 'string' ? [swatch, undefined] : swatch;
      // intermittent effects (firework bursts, wind gusts) share one cycle with evenly staggered
      // phases, so one of them is on screen most of the time instead of several at once
      const staggered = spec.motion === 'burst' || spec.motion === 'gust';
      const dur = staggered ? lerp(spec.dur[0], spec.dur[1], 0.5) : lerp(spec.dur[1], spec.dur[0], depth);
      const phase = staggered ? (k + 0.5 + (rnd() - 0.5) * 0.3) / count : 0;
      const [o0, o1] = spec.opacity ?? [1, 1];
      particles.push({
        key: `${scene}-${index}-${k}`,
        scene,
        kind: spec.kind,
        motion: spec.motion,
        variant: k % (spec.variants ?? 1),
        // stratified: evenly spread with a jitter inside each slot
        x: r2(((((k + 0.15 + rnd() * 0.7) / count + offset) % 1) * 100 * 0.94) + 3),
        y: r2(lerp(band[0], band[1], rnd())),
        size: r2(lerp(spec.size[0], spec.size[1], depth)),
        dur: r2(dur),
        delay: r2(-(staggered ? phase : rnd()) * dur),
        color,
        accent,
        opacity: r2(lerp(o0, o1, depth)),
        drift: r2((rnd() * 2 - 1) * (spec.drift ?? 20)),
        rotate: Math.round(rnd() * 360),
        flip: rnd() < 0.5,
      });
    }
  });
  return { particles, ambient };
}
