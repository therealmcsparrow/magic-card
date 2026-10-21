import { MAX_SHAPE_POINTS } from '../contracts/custom-shape';
import type { AnchoredPoint, CornerKey, CornerType, CustomShapeOptions } from '../contracts/custom-shape';
import { clamp, cornerArc, cornerCentres, dedupeSegs, p, parseShapeLength, SHAPE_DEFAULTS, translate } from './shape-path';
import type { Outline, Pt, Seg } from './shape-path';
export { BUILD_VERSION as BUILD } from './build-version';

/** LazyChunkModule (lazy-module 1.4.0): the builder is registered by src/utils/shape-custom-loader.ts, which owns the entry's side. */
export const install = (): void => {};

/*
 * `shape: custom` (contract custom-shape 1.0.0): per-corner types and sizes, or anchored free-path
 * points, built into the same Outline the presets use. Nothing here runs unless the kind is 'custom'.
 * A lazy chunk (dist/magic-card-shape-custom.js): only the loader imports it. The reference
 * resolution and the option merge stay in src/utils/shape-ref.ts.
 */

/**
 * Per corner type: how far in it takes content from each of its two sides (in sizes; undefined for the
 * curves), how its size changes in the inset outline (per px inward), and its points after the first
 * (in sizes: u along the incoming side, v along the outgoing).
 */
const TYPES: Record<CornerType, [reach?: number, grow?: number, segs?: number[][]]> = {
  square: [0],
  round: [undefined, -1],
  squircle: [undefined, -1],
  bevel: [0.5, Math.SQRT2 - 2, [[0, 1]]],
  scoop: [Math.SQRT1_2],
  notch: [1, 0, [[1, 1], [0, 1]]],
};
const KEYS: CornerKey[] = ['tl', 'tr', 'br', 'bl'];
const NAMES = new Set<unknown>(Object.keys(TYPES));
const isType = (v: unknown): v is CornerType => NAMES.has(v);

interface Corner {
  t: CornerType;
  s: number;
}

/** CSS-style clamp: every size scaled by the same factor so no side is over-full. */
function fit(w: number, h: number, list: Corner[]): Corner[] {
  const [a, b, c, d] = list.map((x) => x.s);
  const f = Math.min(1, w / (a + b), h / (b + c), w / (c + d), h / (d + a));
  return list.map((x) => ({ t: x.t, s: x.s * f }));
}

/** The four corners (tl, tr, br, bl) of a w x h box; a bad value falls back to the shared one, then square. */
function corners(w: number, h: number, o: CustomShapeOptions): Corner[] {
  const len = (v: unknown) => parseShapeLength(v, Math.min(w, h));
  const type = (v: unknown) => (isType(v) ? v : undefined);
  const shared = len(o.corner) ?? (type(o.corner_type) ? 16 : 0);
  return fit(
    w,
    h,
    KEYS.map((k) => {
      const c = o.corners?.[k];
      const d = (c && typeof c === 'object' ? c : { type: c, size: c }) as { type?: unknown; size?: unknown };
      const t = type(d.type);
      return { t: t ?? type(o.corner_type) ?? 'round', s: len(d.size) ?? (t && !shared ? 16 : shared) };
    }),
  );
}

/**
 * The outline of a w x h box with these corners. `off`: the box is the shape moved `off` px inward,
 * so a scoop stays a circle around the original box corner (radius s + off, cut off by this box).
 */
function cornerOutline(w: number, h: number, list: Corner[], n: number, off: number): Pick<Outline, 'start' | 'segs'> {
  // box corner, unit vectors along the incoming and the outgoing side (clockwise)
  const frames = [[0, 0, 0, 1, 1, 0], [w, 0, -1, 0, 0, 1], [w, h, 0, -1, -1, 0], [0, h, 1, 0, 0, -1]];
  const parts = list.map(({ t, s }, i) => {
    const [x, y, a, b, c, d] = frames[i];
    const at = (u: number, v: number): Pt => p(x + a * u + c * v, y + b * u + d * v);
    if (!(s > 1e-9) || t === 'square') return { from: at(0, 0), segs: [] as Seg[] };
    if (t === 'round' || t === 'squircle') {
      const [ctr, a0] = cornerCentres(w, h, s)[(i + 3) % 4];
      return cornerArc(ctr, a0, s, t === 'round' ? 2 : n, 16);
    }
    if (t === 'scoop') {
      // a circle of radius R around the original corner, from the side v = 0 to u = 0
      const R = s + off;
      const e = Math.sqrt(R * R - off * off) - off;
      const g = Math.atan2(off, e + off);
      const k = (4 / 3) * Math.tan(Math.PI / 8 - g / 2) * R;
      const [sn, cs] = [Math.sin(g) * k, Math.cos(g) * k];
      return { from: at(e, 0), segs: [{ c1: at(e - sn, cs), c2: at(cs, e - sn), to: at(0, e) }] };
    }
    return { from: at(s, 0), segs: TYPES[t][2]!.map(([u, v]) => ({ to: at(u * s, v * s) })) };
  });
  const start = parts[0].segs[parts[0].segs.length - 1]?.to ?? parts[0].from;
  const segs: Seg[] = [];
  for (const i of [1, 2, 3, 0]) segs.push({ to: parts[i].from }, ...parts[i].segs);
  // (the last segment returns to the start: polyline consumers read an explicit closing edge)
  return { start, segs: dedupeSegs(start, segs) };
}

/** px for a number, '<n>', '<n>px', '<p>%', '<p>%+<n>', '<p>%-<n>' on an axis `size` px long. */
function coord(v: unknown, size: number): number | undefined {
  const m = /^\s*(?:(-?[\d.]+)%)?([+-]?[\d.]+)?(?:px)?\s*$/.exec(String(v));
  const r = m && /\d/.test(m[0]) ? (+(m[1] ?? 0) / 100) * size + +(m[2] ?? 0) : NaN;
  return Number.isFinite(r) ? clamp(r, 0, size) : undefined;
}

interface Anchor {
  at: Pt;
  in?: Pt;
  out?: Pt;
}

/** The resolved anchors in a w x h box, clockwise; undefined with fewer than 3 valid points. */
function anchors(w: number, h: number, o: CustomShapeOptions): Anchor[] | undefined {
  const list: Anchor[] = [];
  for (const q of Array.isArray(o.points) ? (o.points as AnchoredPoint[]) : []) {
    const x = q && coord(q.x, w);
    const y = q && coord(q.y, h);
    if (x === undefined || y === undefined || list.length >= MAX_SHAPE_POINTS) continue;
    const hd = (v?: number[]) => (Array.isArray(v) && Number.isFinite(v[0] + v[1]) ? p(clamp(x + v[0], 0, w), clamp(y + v[1], 0, h)) : undefined);
    list.push({ at: p(x, y), in: hd(q.in), out: hd(q.out) });
  }
  const area = list.reduce((s, a, i) => s + a.at.x * list[(i + 1) % list.length].at.y - list[(i + 1) % list.length].at.x * a.at.y, 0);
  return list.length < 3 ? undefined : area < 0 ? list.reverse().map((a) => ({ at: a.at, in: a.out, out: a.in })) : list;
}

/**
 * The outline of a custom shape in a w x h box and the content inset (see the contract); with
 * `off` > 0 the outline of the shape moved `off` px inward (rings, inner border), same box.
 */
export function buildCustom(w: number, h: number, o: CustomShapeOptions, off = 0): Outline {
  const [iw, ih] = [w - 2 * off, h - 2 * off];
  const list = anchors(iw, ih, o);
  const n = 3 + (1 - clamp(parseShapeLength(o.smoothing, 1) ?? SHAPE_DEFAULTS.smoothing, 0, 1)) * 5;
  const cs = list ? [] : corners(w, h, o);
  const [a, b, c, d] = cs.map(({ t, s }) => (TYPES[t][0] ?? 1 - 0.5 ** (1 / (t === 'round' ? 2 : n))) * s);
  // `padding` replaces the inset on the sides it names (and is the only inset of a free path)
  const pad = o.padding;
  const side = (k: 'top' | 'right' | 'bottom' | 'left', i: number) =>
    parseShapeLength(pad && typeof pad === 'object' ? pad[k] : pad, Math.min(w, h)) ?? (list ? 0 : [Math.max(a, b), Math.max(b, c), Math.max(c, d), Math.max(d, a)][i]);
  const sized = fit(iw, ih, cs.map(({ t, s }) => ({ t, s: Math.max(0, s + (TYPES[t][1] ?? 0) * off) })));
  const out = {
    ...(list
      ? { start: list[0].at, segs: list.map((q, i): Seg => ((r) => (q.out || r.in ? { c1: q.out ?? q.at, c2: r.in ?? r.at, to: r.at } : { to: r.at }))(list[(i + 1) % list.length])) }
      : cornerOutline(iw, ih, sized, n, off)),
    inset: { top: side('top', 0), right: side('right', 1), bottom: side('bottom', 2), left: side('left', 3) },
  };
  return off ? translate(out, off) : out;
}
