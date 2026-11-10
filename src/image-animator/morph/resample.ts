import { MORPH_PATH_DATA_RE } from '../../contracts/image-animation';
import { IMAGE_MAX_BYTES } from '../../contracts/mcu-library-images';
import { flatten, parsePath, type Pt, type SubPath } from '../../path/core';

// Gives paths of any shape one shared command structure, so a morph between them interpolates in every engine.
// Each subpath becomes the same number of points at equal arc length: M, then L per point, then Z when it is closed.

/** Longest path data accepted (characters) and most subpaths in one path. */
const MAX_D_CHARS = 262_144;
const MAX_SUBPATHS = 256;
const CURVE_STEPS = 16;
const MIN_POINTS = 3;
/** Each point is written as at least `L0 0 ` (5 bytes), so more points than this can never fit in a saved image. */
const MAX_POINTS = Math.floor(IMAGE_MAX_BYTES / 5);

interface Ring {
  pts: Pt[];
  closed: boolean;
  /** How many points describe the subpath well: a line counts 1, a curve 4. */
  weight: number;
}

/** Path data with other whitespace as spaces; throws when it is not plain path data. */
function plain(d: unknown): string {
  const text = typeof d === 'string' && d.length <= MAX_D_CHARS ? d.replace(/\s+/g, ' ').trim() : '';
  if (!text || !MORPH_PATH_DATA_RE.test(text)) throw new Error('Not path data');
  return text;
}

function ringOf(s: SubPath): Ring {
  const weight = s.segs.reduce((n, g) => n + (g.c1 ? 4 : 1), 0);
  return { pts: flatten(s, CURVE_STEPS), closed: s.closed, weight };
}

function parse(d: string): Ring[] {
  const rings = parsePath(plain(d)).map(ringOf);
  if (!rings.length || rings.length > MAX_SUBPATHS) throw new Error('No usable subpaths');
  return rings;
}

/** The point on the chain `s` away from its start; `i` is the segment search start, which only moves forward. */
function walk(chain: readonly Pt[], cum: readonly number[], s: number, from: number): { p: Pt; at: number } {
  let i = from;
  while (i < chain.length - 2 && cum[i + 1] < s) i += 1;
  const len = cum[i + 1] - cum[i];
  const u = len > 0 ? Math.min(1, Math.max(0, (s - cum[i]) / len)) : 0;
  const a = chain[i];
  const b = chain[i + 1];
  return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], at: i };
}

/** `count` points at equal arc length along the ring; a closed output does not repeat its first point. */
function sample(ring: Ring, count: number, closed: boolean): Pt[] {
  const chain = ring.closed ? [...ring.pts, ring.pts[0]] : ring.pts;
  if (chain.length < 2) return Array.from({ length: count }, () => chain[0]);
  const cum = [0];
  for (let i = 1; i < chain.length; i++) cum.push(cum[i - 1] + Math.hypot(chain[i][0] - chain[i - 1][0], chain[i][1] - chain[i - 1][1]));
  const total = cum[cum.length - 1];
  const out: Pt[] = [];
  let at = 0;
  for (let k = 0; k < count; k++) {
    const r = walk(chain, cum, closed ? (total * k) / count : (total * k) / (count - 1), at);
    at = r.at;
    out.push(r.p);
  }
  return out;
}

/** A subpath that has no extent, at the middle of the path, for a path with fewer subpaths than another. */
function point(rings: readonly Ring[]): Ring {
  const all = rings.flatMap((r) => r.pts);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const mid: Pt = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  return { pts: [mid], closed: true, weight: 0 };
}

const fmt = (n: number): string => {
  if (!Number.isFinite(n)) throw new Error('Not a finite number');
  const r = Math.round(n * 100) / 100;
  return String(r === 0 ? 0 : r);
};

function write(sub: readonly Pt[], closed: boolean): string {
  const [first, ...rest] = sub;
  return `M${fmt(first[0])} ${fmt(first[1])}${rest.map((p) => ` L${fmt(p[0])} ${fmt(p[1])}`).join('')}${closed ? ' Z' : ''}`;
}

/**
 * The paths again, all with the same subpath count, point counts and open or closed subpaths, in the order given.
 * Throws for data that is not a path, and for a result too large to save in any image (MAX_POINTS).
 */
export function resample(paths: readonly string[]): string[] {
  const all = paths.map(parse);
  const count = Math.max(...all.map((r) => r.length));
  const shape = Array.from({ length: count }, (_, i) => {
    const real = all.filter((r) => r[i]).map((r) => r[i]);
    return { points: Math.max(MIN_POINTS, ...real.map((r) => r.weight)), closed: real.every((r) => r.closed) };
  });
  const total = shape.reduce((n, s) => n + s.points, 0) * all.length;
  if (total > MAX_POINTS) throw new Error('Too many points to morph');
  return all.map((rings) =>
    shape
      .map((s, i) => write(sample(rings[i] ?? point(rings), s.points, s.closed), s.closed))
      .join(' '),
  );
}
