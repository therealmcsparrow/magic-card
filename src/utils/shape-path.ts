import type { ShapeKind, ShapeOptions } from '../types';
import { customBuilder } from './shape-custom-loader';

/** Outline shapes for modules, rows, columns and the card as SVG paths in px. Pure (no DOM). */

export type ShapeSide = 'top' | 'right' | 'bottom' | 'left';

export interface ShapeInset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ShapePathResult {
  d: string;
  inset: ShapeInset;
}

export interface Pt {
  x: number;
  y: number;
}

/** A path command: a line to `to`, or a cubic through control points `c1`, `c2` to `to`. */
export type Seg = { to: Pt; c1?: Pt; c2?: Pt };

export interface Outline {
  start: Pt;
  segs: Seg[];
  inset: ShapeInset;
}

const KINDS = new Set<ShapeKind>(['custom', 'squircle', 'hexagon', 'octagon', 'blob', 'wave', 'notch', 'ticket', 'pill', 'circle']);

/** Cubic handle length of a quarter circle. */
const KAPPA = 0.5522847498;
const SQRT1_2 = Math.SQRT1_2;
/** Rounded joins of hexagon / octagon corners (px). */
const JOIN = 1.5;

export const SHAPE_DEFAULTS = {
  smoothing: 0.6,
  /** Notch / ticket cut (px). */
  corner: 16,
  amplitude: 8,
  waves: 3,
  seed: 7,
  wobble: 0.25,
};

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
export const p = (x: number, y: number): Pt => ({ x, y });
export const zero = (): ShapeInset => ({ top: 0, right: 0, bottom: 0, left: 0 });

/** A length option: a px number, `'16px'`, `'16'`, or `'25%'` of `ref`. Undefined when unreadable / negative. */
export function parseShapeLength(v: unknown, ref: number): number | undefined {
  let n: number | undefined;
  if (typeof v === 'string' && /^\s*-?\d*\.?\d+\s*%\s*$/.test(v)) n = (parseFloat(v) / 100) * ref;
  else if (typeof v === 'string' && /^\s*-?\d*\.?\d+\s*(px)?\s*$/i.test(v)) n = parseFloat(v);
  else n = num(v);
  return n !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined;
}

// ── Builders ──

const lerp = (a: Pt, b: Pt, t: number): Pt => p(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

/** A closed polygon; each vertex rounded over `join` px (a quadratic-like cubic inside the corner). */
function polygon(pts: Pt[], join: number): Pick<Outline, 'start' | 'segs'> {
  if (join <= 0) return { start: pts[0], segs: [...pts.slice(1), pts[0]].map((to) => ({ to })) };
  const n = pts.length;
  const corners = pts.map((v, i) => {
    const prev = pts[(i + n - 1) % n];
    const next = pts[(i + 1) % n];
    const jIn = Math.min(join, dist(prev, v) / 3);
    const jOut = Math.min(join, dist(v, next) / 3);
    return { v, a: lerp(v, prev, jIn / (dist(prev, v) || 1)), b: lerp(v, next, jOut / (dist(v, next) || 1)) };
  });
  const segs: Seg[] = [];
  corners.forEach((c, i) => {
    segs.push({ c1: lerp(c.a, c.v, 2 / 3), c2: lerp(c.b, c.v, 2 / 3), to: c.b });
    segs.push({ to: corners[(i + 1) % n].a });
  });
  return { start: corners[0].a, segs };
}

/**
 * Cubic Hermite pieces through `pts` with tangents `tan` (per unit of the parameter, `step` apart):
 * the curve passes every point with that tangent.
 */
function hermite(pts: Pt[], tan: Pt[], step: number): Seg[] {
  const segs: Seg[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    segs.push({
      c1: p(a.x + (tan[i].x * step) / 3, a.y + (tan[i].y * step) / 3),
      c2: p(b.x - (tan[i + 1].x * step) / 3, b.y - (tan[i + 1].y * step) / 3),
      to: b,
    });
  }
  return segs;
}

/** Catmull-Rom tangents (unit step) of a closed loop / open chain (end tangents one-sided). */
function catmullTangents(pts: Pt[], closed: boolean): Pt[] {
  const n = pts.length;
  return pts.map((_, i) => {
    const prev = closed ? pts[(i + n - 1) % n] : pts[Math.max(0, i - 1)];
    const next = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
    const f = closed || (i > 0 && i < n - 1) ? 0.5 : 1;
    return p((next.x - prev.x) * f, (next.y - prev.y) * f);
  });
}

/** A smooth closed curve through `pts` (Catmull-Rom → cubic). */
function smoothLoop(pts: Pt[]): Pick<Outline, 'start' | 'segs'> {
  const tan = catmullTangents(pts, true);
  return { start: pts[0], segs: hermite([...pts, pts[0]], [...tan, tan[0]], 1) };
}


/**
 * A rectangle with every corner the same curve of radius r: a superellipse of exponent `n` sampled
 * in `steps` pieces (n = 2: a circle quarter, drawn exactly with one cubic). Clockwise from the top
 * left corner's end.
 */
function roundedRect(w: number, h: number, r: number, n: number, steps: number): Pick<Outline, 'start' | 'segs'> {
  const segs: Seg[] = [];
  const start = p(r, 0);
  let cur = start;
  for (const [c, a0] of cornerCentres(w, h, r)) {
    const arc = cornerArc(c, a0, r, n, steps);
    if (dist(cur, arc.from) > 1e-9) segs.push({ to: arc.from });
    segs.push(...arc.segs);
    cur = segs[segs.length - 1].to;
  }
  if (dist(cur, start) > 1e-9) segs.push({ to: start });
  return { start, segs };
}

/** Corner centres and the angle each corner starts at (clockwise on screen: TR, BR, BL, TL). */
export const cornerCentres = (w: number, h: number, r: number): Array<[Pt, number]> => [
  [p(w - r, r), -90],
  [p(w - r, h - r), 0],
  [p(r, h - r), 90],
  [p(r, r), 180],
];

/**
 * One corner of radius r around centre `c`, starting at angle `a0` (degrees, clockwise): a superellipse
 * of exponent `n` (2: a circle quarter, one cubic) sampled in `steps` pieces whose end tangents run
 * along the sides. `from` is where it meets the incoming side.
 */
export function cornerArc(c: Pt, a0: number, r: number, n: number, steps: number): { from: Pt; segs: Seg[] } {
  const at = (deg: number): Pt => {
    const t = (deg * Math.PI) / 180;
    const cs = Math.cos(t);
    const sn = Math.sin(t);
    const e = 2 / n;
    return p(c.x + r * Math.sign(cs) * Math.abs(cs) ** e, c.y + r * Math.sign(sn) * Math.abs(sn) ** e);
  };
  const from = at(a0);
  const t0 = (a0 * Math.PI) / 180;
  const t1 = ((a0 + 90) * Math.PI) / 180;
  if (n === 2) {
    const to = at(a0 + 90);
    return {
      from,
      segs: [
        {
          c1: p(from.x - Math.sin(t0) * r * KAPPA, from.y + Math.cos(t0) * r * KAPPA),
          c2: p(to.x + Math.sin(t1) * r * KAPPA, to.y - Math.cos(t1) * r * KAPPA),
          to,
        },
      ],
    };
  }
  // sampled superellipse; end tangents along the sides (the curve meets them flat)
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) pts.push(at(a0 + (90 * i) / steps));
  const tan = catmullTangents(pts, false);
  const l0 = Math.hypot(tan[0].x, tan[0].y);
  const l1 = Math.hypot(tan[steps].x, tan[steps].y);
  tan[0] = p(-Math.sin(t0) * l0, Math.cos(t0) * l0);
  tan[steps] = p(-Math.sin(t1) * l1, Math.cos(t1) * l1);
  return { from, segs: hermite(pts, tan, 1) };
}

/**
 * Share of a corner radius the content's top / bottom keeps clear of a curved outline: 60% of the
 * depth of the curve's 45° point (a circle: ~0.18). Little height (a circle or a pill grows ~1.2x its
 * content), width given up beside it instead.
 */
const curveDown = (n: number) => 0.6 * (1 - 0.5 ** (1 / n));
const CURVE_DOWN = curveDown(2);
/**
 * Squircle corners: what the sampled superellipse may dip inside the true curve (px). Circle quarters
 * take a hair for the path's rounding to 0.01 px.
 */
const CURVE_SLACK = 0.25;

/**
 * Horizontal inset of a corner curve (a superellipse quarter of radius r, exponent n) at depth y
 * below the flat edge: where the curve is at that depth.
 */
function cornerAcross(r: number, n: number, y: number): number {
  if (!(r > 0) || y >= r) return 0;
  const dy = r - Math.max(0, y);
  return r - Math.max(0, r ** n - dy ** n) ** (1 / n);
}

/** How far down the content's corners sit: the shape's own inset `v`, or lower where the padding is. */
const depth = (v: number, pad: ShapeInset) => Math.max(v, Math.min(pad.top, pad.bottom));
/** The same across (tall hexagons). */
const depthAcross = (v: number, pad: ShapeInset) => Math.max(v, Math.min(pad.left, pad.right));

/** Content width a narrow curved shape keeps (px; at most a share of its width): a word fits. */
const WORD = 70;
const WORD_SHARE = 0.85;
/** The most a narrow curved shape's content may give up across, per side (w: the box width). */
const roomAcross = (w: number) => Math.max(0, (w - Math.min(WORD, WORD_SHARE * w)) / 2);

/**
 * Content inset of a rounded rectangle (corner radius r, exponent n) in a box w wide. The corners
 * sit lower when that keeps a word's width (roomAcross), at most at the curve's 45° point.
 */
function roundedInset(r: number, n: number, pad: ShapeInset, w: number): ShapeInset {
  if (!(r > 0)) return zero();
  const slack = n === 2 ? 0.1 : CURVE_SLACK;
  const x0 = Math.max(0, Math.min(r, roomAcross(w) - slack));
  // the depth where the curve is x0 in (cornerAcross inverted)
  const word = r - Math.max(0, r ** n - (r - x0) ** n) ** (1 / n);
  const v = Math.min(Math.max(r * curveDown(n), word), r * (1 - 0.5 ** (1 / n)));
  const x = cornerAcross(r, n, depth(v, pad)) + slack;
  return { top: v, right: x, bottom: v, left: x };
}

/**
 * Content inset of an ellipse of radii q·rx, q·ry around the box centre (rx, ry: half the box): the
 * corners CURVE_DOWN of the radius below its top, across where the ellipse is at that height; lower
 * when that keeps a word's width (roomAcross), at most down to `lowest` (a share of the radius above
 * the centre).
 */
function ellipseInset(rx: number, ry: number, q: number, pad: ShapeInset, lowest: number): ShapeInset {
  // the corner's height above the centre (a share of the radius) where the ellipse is a word wide
  const across = (rx - Math.max(0, roomAcross(2 * rx) - 0.1)) / (q * rx);
  const word = across < 1 ? Math.sqrt(1 - across * across) : 0;
  const v = ry - q * ry * clamp(Math.min(1 - CURVE_DOWN, word), lowest, 1);
  // the corner's height above the centre, as a share of the radius
  const up = clamp((ry - depth(v, pad)) / (q * ry), 0, 1);
  // (+ a hair for the path's rounding to 0.01 px)
  const x = rx - q * rx * Math.sqrt(1 - up * up) + 0.1;
  return { top: v, right: x, bottom: v, left: x };
}

/** A seeded PRNG (mulberry32): the same seed draws the same blob. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(v: unknown): number {
  const n = num(v);
  if (n !== undefined) return Math.round(n);
  if (typeof v === 'string' && v) return [...v].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7);
  return SHAPE_DEFAULTS.seed;
}

// ── Shapes ──

function build(kind: ShapeKind, w: number, h: number, o: ShapeOptions, pad: ShapeInset = zero()): Outline | undefined {
  const m = Math.min(w, h);
  const corner = (def: number, max: number) => clamp(parseShapeLength(o.corner, m) ?? def, 0, max);

  switch (kind) {
    case 'custom':
      return customBuilder()?.(w, h, o);
    case 'squircle': {
      const smoothing = clamp(num(o.smoothing) ?? SHAPE_DEFAULTS.smoothing, 0, 1);
      // smoothing 1 → n 3 (round), 0 → n 8 (almost square corners); the classic squircle is n 4
      const n = 3 + (1 - smoothing) * 5;
      const r = corner(m / 2, m / 2);
      if (r <= 0) return { start: p(0, 0), segs: [{ to: p(w, 0) }, { to: p(w, h) }, { to: p(0, h) }], inset: zero() };
      return { ...roundedRect(w, h, r, n, 16), inset: roundedInset(r, n, pad, w) };
    }
    case 'pill': {
      const r = m / 2;
      return { ...roundedRect(w, h, r, 2, 1), inset: roundedInset(r, 2, pad, w) };
    }
    case 'circle': {
      const rx = w / 2;
      const ry = h / 2;
      const kx = rx * KAPPA;
      const ky = ry * KAPPA;
      const segs: Seg[] = [
        { c1: p(rx + kx, 0), c2: p(w, ry - ky), to: p(w, ry) },
        { c1: p(w, ry + ky), c2: p(rx + kx, h), to: p(rx, h) },
        { c1: p(rx - kx, h), c2: p(0, ry + ky), to: p(0, ry) },
        { c1: p(0, ry - ky), c2: p(rx - kx, 0), to: p(rx, 0) },
      ];
      // (the cubics run a hair outside the true ellipse: its inset holds) at most 30° up
      return { start: p(rx, 0), segs, inset: ellipseInset(rx, ry, 1, pad, 0.5) };
    }
    case 'notch':
    case 'octagon': {
      // octagon: a regular octagon's cut by default (side / (2 + √2)), with rounded joins
      const c = cutCorner(kind, w, h, o);
      const pts = [p(c, 0), p(w - c, 0), p(w, c), p(w, h - c), p(w - c, h), p(c, h), p(0, h - c), p(0, c)];
      // content corners on each cut (x + y = c) a quarter of the way down from the flat top /
      // bottom, or at the content's padding when that is lower; the octagon's rounded joins dip at
      // most ~0.3 px inside a vertex
      const s = kind === 'octagon' && c > 0 ? JOIN * 0.2 : 0;
      const down = c / 4 + s;
      const across = Math.max(0, c - depth(c / 4, pad)) + 2 * s;
      return { ...polygon(dedupe(pts), kind === 'octagon' ? JOIN : 0), inset: { top: down, right: across, bottom: down, left: across } };
    }
    case 'hexagon': {
      const { pts, c, wide } = hexagonPoints(w, h, o);
      // wide (tips left / right): the flat top and bottom need no inset; the content's corners sit
      // on the slanted sides at its padding (with none: the whole cut in). Tall: the same turned,
      // the flat sides need none. (+ the ~0.4 px a rounded join dips inside a corner)
      const j = c > 0 ? JOIN * 0.25 : 0;
      const slant = (at: number, size: number) => Math.max(0, c * (1 - (2 * at) / size)) + 2 * j;
      const inset = wide
        ? { top: j, right: slant(depth(j, pad), h), bottom: j, left: slant(depth(j, pad), h) }
        : { top: slant(depthAcross(j, pad), w), right: j, bottom: slant(depthAcross(j, pad), w), left: j };
      return { ...polygon(dedupe(pts), JOIN), inset };
    }
    case 'ticket': {
      // a semicircle bitten out of the middle of the left and right sides
      const r = corner(SHAPE_DEFAULTS.corner, Math.min(h / 2, w / 4));
      const cy = h / 2;
      const k = r * KAPPA;
      const segs: Seg[] = [{ to: p(w, 0) }];
      if (r > 0) {
        segs.push(
          { to: p(w, cy - r) },
          { c1: p(w - k, cy - r), c2: p(w - r, cy - k), to: p(w - r, cy) },
          { c1: p(w - r, cy + k), c2: p(w - k, cy + r), to: p(w, cy + r) },
        );
      }
      segs.push({ to: p(w, h) }, { to: p(0, h) });
      if (r > 0) {
        segs.push(
          { to: p(0, cy + r) },
          { c1: p(k, cy + r), c2: p(r, cy + k), to: p(r, cy) },
          { c1: p(r, cy - k), c2: p(k, cy - r), to: p(0, cy - r) },
        );
      }
      segs.push({ to: p(0, 0) });
      return { start: p(0, 0), segs: dedupeSegs(p(0, 0), segs), inset: { top: 0, right: r, bottom: 0, left: r } };
    }
    case 'wave':
      return wave(w, h, o);
    case 'blob':
      return blob(w, h, o, pad);
    default:
      return undefined;
  }
}

/** Notch / octagon cut (px): a regular octagon's by default (side / (2 + √2)). */
function cutCorner(kind: 'notch' | 'octagon', w: number, h: number, o: ShapeOptions): number {
  const m = Math.min(w, h);
  const def = kind === 'notch' ? SHAPE_DEFAULTS.corner : m / (2 + Math.SQRT2);
  return clamp(parseShapeLength(o.corner, m) ?? def, 0, m / 2);
}

/** Squircle corner radius (px). */
function squircleRadius(w: number, h: number, o: ShapeOptions): number {
  const m = Math.min(w, h);
  return clamp(parseShapeLength(o.corner, m) ?? m / 2, 0, m / 2);
}

/** Hexagon corners, pointy along the longer axis; the default cut makes 60° tips. */
function hexagonPoints(w: number, h: number, o: ShapeOptions): { pts: Pt[]; c: number; wide: boolean } {
  const m = Math.min(w, h);
  const c = clamp(parseShapeLength(o.corner, m) ?? (m / 2) * Math.tan(Math.PI / 6), 0, m / 2);
  const wide = w >= h;
  const pts = wide
    ? [p(c, 0), p(w - c, 0), p(w, h / 2), p(w - c, h), p(c, h), p(0, h / 2)]
    : [p(w / 2, 0), p(w, c), p(w, h - c), p(w / 2, h), p(0, h - c), p(0, c)];
  return { pts, c, wide };
}

/**
 * A convex clockwise polygon with every side moved `off` px inward (sides meeting at mitred
 * corners). Undefined when a side would vanish or turn around.
 */
function offsetPolygon(pts: Pt[], off: number): Pt[] | undefined {
  const n = pts.length;
  const lines = pts.map((a, i) => {
    const b = pts[(i + 1) % n];
    const len = dist(a, b) || 1;
    const dir = p(b.x - a.x, b.y - a.y);
    return { at: p(a.x - (dir.y / len) * off, a.y + (dir.x / len) * off), dir };
  });
  const out = lines.map((l, i) => {
    const k = lines[(i + n - 1) % n];
    const den = k.dir.x * l.dir.y - k.dir.y * l.dir.x;
    if (Math.abs(den) < 1e-12) return l.at;
    const t = ((l.at.x - k.at.x) * l.dir.y - (l.at.y - k.at.y) * l.dir.x) / den;
    return p(k.at.x + k.dir.x * t, k.at.y + k.dir.y * t);
  });
  for (let i = 0; i < n; i++) {
    const a = out[i];
    const b = out[(i + 1) % n];
    if ((b.x - a.x) * lines[i].dir.x + (b.y - a.y) * lines[i].dir.y <= 1e-9) return undefined;
  }
  return out;
}

export const translate = (o: Outline, d: number): Outline => {
  const m = (q: Pt) => p(q.x + d, q.y + d);
  return { start: m(o.start), segs: o.segs.map((s) => (s.c1 && s.c2 ? { c1: m(s.c1), c2: m(s.c2), to: m(s.to) } : { to: m(s.to) })), inset: o.inset };
};

/**
 * The outline of a w x h box moved `off` px inward (in the box's coordinates). Cut and rounded
 * corners are a true offset: corners resolved against the outer box, a 45° cut c becomes
 * c − (2 − √2)·off, a squircle radius r − off, hexagon sides move along their normals. Other shapes
 * are the shape of the smaller box.
 */
function buildInset(kind: ShapeKind, w: number, h: number, o: ShapeOptions, off: number): Outline | undefined {
  if (!(off > 0)) return build(kind, w, h, o);
  const iw = w - 2 * off;
  const ih = h - 2 * off;
  if (!(iw > 0 && ih > 0)) return undefined;
  if (kind === 'custom') return customBuilder()?.(w, h, o, off);
  let inner: ShapeOptions = o;
  if (kind === 'notch' || kind === 'octagon') inner = { ...o, corner: Math.max(0, cutCorner(kind, w, h, o) - (2 - Math.SQRT2) * off) };
  else if (kind === 'squircle') inner = { ...o, corner: Math.max(0, squircleRadius(w, h, o) - off) };
  else if (kind === 'hexagon') {
    const pts = offsetPolygon(hexagonPoints(w, h, o).pts, off);
    if (pts) return { ...polygon(dedupe(pts), JOIN), inset: zero() };
  }
  const b = build(kind, iw, ih, inner);
  return b && translate(b, off);
}

function dedupe(pts: Pt[]): Pt[] {
  const out = pts.filter((q, i) => dist(q, pts[(i + 1) % pts.length]) > 1e-9);
  return out.length >= 3 ? out : pts;
}

export function dedupeSegs(start: Pt, segs: Seg[]): Seg[] {
  let cur = start;
  return segs.filter((s) => {
    const keep = !!s.c1 || dist(cur, s.to) > 1e-9;
    if (keep) cur = s.to;
    return keep;
  });
}

const EDGES: Array<ShapeSide | 'all'> = ['top', 'right', 'bottom', 'left', 'all'];
/** Most waves along one edge. */
const MAX_WAVES = 50;

/**
 * A wavy edge (or every edge): whole cosine periods that start and end on a crest on the box edge.
 * With `all`, the corners are quarter arcs and each wave runs between them; amplitude and period
 * are limited so neighbouring waves never cross.
 */
function wave(w: number, h: number, o: ShapeOptions): Outline {
  const edge = EDGES.includes(o.edge as ShapeSide) ? (o.edge as ShapeSide | 'all') : 'bottom';
  const all = edge === 'all';
  const waving = (s: ShapeSide) => all || edge === s;
  const m = Math.min(w, h);
  // a wave band is 2 * amplitude deep: at most half the box across it (a quarter each side with 'all')
  const across = edge === 'top' || edge === 'bottom' ? h : w;
  const a = clamp(parseShapeLength(o.amplitude, m) ?? SHAPE_DEFAULTS.amplitude, 0, all ? m / 8 : across / 4);
  const wavesWanted = Math.round(num(o.waves) ?? SHAPE_DEFAULTS.waves);

  // animation frames: the waves shifted by `phase` periods; every frame has the same commands
  const phased = num(o.phase) !== undefined;
  const shift = phased ? num(o.phase)! : 0;
  const box = [p(0, 0), p(w, 0), p(w, h), p(0, h)];
  const dirs = [p(1, 0), p(0, 1), p(-1, 0), p(0, -1)];
  const normals = [p(0, -1), p(1, 0), p(0, 1), p(-1, 0)];
  const sides: ShapeSide[] = ['top', 'right', 'bottom', 'left'];
  // corner radius (every edge waving)
  const r = all && a > 0 ? a : 0;
  const k = r * KAPPA;
  const start = p(r, 0);
  const segs: Seg[] = [];
  sides.forEach((side, i) => {
    const dir = dirs[i];
    const next = box[(i + 1) % 4];
    const from = p(box[i].x + dir.x * r, box[i].y + dir.y * r);
    const to = p(next.x - dir.x * r, next.y - dir.y * r);
    if (!waving(side) || a <= 0) segs.push({ to });
    else {
      const len = dist(from, to);
      const count = clamp(wavesWanted, 1, Math.max(1, Math.min(MAX_WAVES, Math.floor(len / (2.5 * a)))));
      const nrm = normals[i];
      const steps = count * 8;
      // all edges, shifted: the shift fades out over the half period next to each corner, so the
      // wave still meets the corner arcs flat
      const fading = all && phased;
      const env = (s: number) => {
        if (!fading) return 1;
        const e = clamp(Math.min(s, 1 - s) * 2 * count, 0, 1);
        return e * e * (3 - 2 * e);
      };
      const offAt = (s: number) => (a * Math.cos(2 * Math.PI * (count * s + shift)) - a) * env(s);
      const slope = (s: number) => {
        if (!fading) return -a * 2 * Math.PI * count * Math.sin(2 * Math.PI * (count * s + shift));
        const e = 1e-5;
        const s0 = Math.max(0, s - e);
        const s1 = Math.min(1, s + e);
        return (offAt(s1) - offAt(s0)) / (s1 - s0);
      };
      const pts: Pt[] = [];
      const tan: Pt[] = [];
      for (let j = 0; j <= steps; j++) {
        const s = j / steps;
        const off = offAt(s);
        const dOff = slope(s);
        pts.push(p(from.x + (to.x - from.x) * s + nrm.x * off, from.y + (to.y - from.y) * s + nrm.y * off));
        tan.push(p(to.x - from.x + nrm.x * dOff, to.y - from.y + nrm.y * dOff));
      }
      // one edge, shifted: the wave's ends leave the edge, joined to the corners by lines
      if (phased && !all) segs.push({ to: pts[0] });
      segs.push(...hermite(pts, tan, 1 / steps));
      if (phased && !all) segs.push({ to });
    }
    if (r > 0) {
      const nd = dirs[(i + 1) % 4];
      const end = p(next.x + nd.x * r, next.y + nd.y * r);
      segs.push({ c1: p(to.x + dir.x * k, to.y + dir.y * k), c2: p(end.x - nd.x * k, end.y - nd.y * k), to: end });
    }
  });
  const d = 2 * a;
  return {
    start,
    segs,
    inset: {
      top: waving('top') ? d : 0,
      right: waving('right') ? d : 0,
      bottom: waving('bottom') ? d : 0,
      left: waving('left') ? d : 0,
    },
  };
}

const BLOB_POINTS = 12;

function blob(w: number, h: number, o: ShapeOptions, pad: ShapeInset): Outline {
  const wobble = clamp(num(o.wobble) ?? SHAPE_DEFAULTS.wobble, 0, 1);
  const rnd = random(seedOf(o.seed));
  const cx = w / 2;
  const cy = h / 2;
  // radius share per point: 1 at most, down to 0.5 at full wobble
  const pts: Pt[] = [];
  for (let i = 0; i < BLOB_POINTS; i++) {
    const share = 1 - wobble * 0.5 * rnd();
    const t = (2 * Math.PI * i) / BLOB_POINTS - Math.PI / 2;
    pts.push(p(cx + cx * share * Math.cos(t), cy + cy * share * Math.sin(t)));
  }
  const loop = smoothLoop(pts);
  // the content sits in the largest centred ellipse inside the curve: its least radius (sampled
  // finely, less a little for between the samples)
  let q = 1;
  let cur = loop.start;
  for (const s of loop.segs) {
    const c1 = s.c1 ?? cur;
    const c2 = s.c2 ?? s.to;
    for (let i = 1; i <= 32; i++) {
      const t = i / 32;
      const u = 1 - t;
      const x = u * u * u * cur.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * s.to.x;
      const y = u * u * u * cur.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * s.to.y;
      q = Math.min(q, Math.hypot((x - cx) / cx, (y - cy) / cy));
    }
    cur = s.to;
  }
  return { ...loop, inset: ellipseInset(cx, cy, q * 0.99, pad, 0.65) };
}

// ── Output ──

const fmt = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return String(Object.is(v, -0) ? 0 : v);
};

function toPath(o: Outline, w: number, h: number): string {
  const pt = (q: Pt) => `${fmt(clamp(q.x, 0, w))} ${fmt(clamp(q.y, 0, h))}`;
  const parts = [`M${pt(o.start)}`];
  for (const s of o.segs) parts.push(s.c1 && s.c2 ? `C${pt(s.c1)} ${pt(s.c2)} ${pt(s.to)}` : `L${pt(s.to)}`);
  parts.push('Z');
  return parts.join(' ');
}

/**
 * Monotone cubic (Fritsch-Carlson) pieces through points with increasing x: the curve never runs
 * back in x and never overshoots between two points (it stays between their y values).
 */
function monotone(pts: Pt[]): Seg[] {
  const n = pts.length;
  const dx = pts.slice(1).map((q, i) => q.x - pts[i].x);
  const slope = pts.slice(1).map((q, i) => (dx[i] > 0 ? (q.y - pts[i].y) / dx[i] : 0));
  const m = pts.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    return slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  });
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / slope[i];
    const b = m[i + 1] / slope[i];
    const s2 = a * a + b * b;
    if (s2 > 9) {
      const t = 3 / Math.sqrt(s2);
      m[i] = t * a * slope[i];
      m[i + 1] = t * b * slope[i];
    }
  }
  return pts.slice(1).map((to, i) => {
    const from = pts[i];
    const h = dx[i] / 3;
    return { c1: p(from.x + h, from.y + m[i] * h), c2: p(to.x - h, to.y - m[i + 1] * h), to };
  });
}

/**
 * An open path through `pts` (x increasing): straight lines, or a smooth monotone curve (→ cubics)
 * that never runs back or overshoots. Every point, control points included, is clamped to
 * 0..w x 0..h. '' for fewer than two points.
 */
export function chainPath(pts: Pt[], w: number, h: number, smooth: boolean): string {
  if (pts.length < 2) return '';
  const segs = smooth ? monotone(pts) : pts.slice(1).map((to) => ({ to }));
  return toPath({ start: pts[0], segs, inset: zero() }, w, h).replace(/ Z$/, '');
}

const valid = (kind: unknown, w: number, h: number) =>
  KINDS.has(kind as ShapeKind) && Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0;

const round = (i: ShapeInset): ShapeInset => ({
  top: Math.round(i.top * 100) / 100,
  right: Math.round(i.right * 100) / 100,
  bottom: Math.round(i.bottom * 100) / 100,
  left: Math.round(i.left * 100) / 100,
});

interface ShapeOutline {
  d: string;
  inset: ShapeInset;
  /** The built outline; its polyline is only sampled when a flow asks (shapePoint). */
  b: Outline;
  w: number;
  h: number;
  /** The outline as a polyline (cubics sampled), for hit tests along a side. */
  poly?: Pt[];
}

/** The JSON of an options object, once per object (options objects are replaced, not edited, on a change). */
const optionKeys = new WeakMap<object, string>();
const keyOf = (o: ShapeOptions): string => {
  let k = optionKeys.get(o);
  if (k === undefined) optionKeys.set(o, (k = JSON.stringify(o)));
  return k;
};

/** Recent outlines (several layers ask for the same shape and size: clip, stroke, ring, flows). */
const memo = new Map<string, ShapeOutline | undefined>();
const MEMO_SIZE = 256;
/** The builder the memo was filled under; a different one (arrived, replaced, removed) drops the memo. */
let seenBuilder: ReturnType<typeof customBuilder>;

/** The shape's outline (memoised): path, content inset and polyline; `off` px inward (buildInset). */
function shapeOutline(kind: ShapeKind, w: number, h: number, opts: ShapeOptions | undefined, off = 0, pad?: ShapeInset): ShapeOutline | undefined {
  if (!valid(kind, w, h)) return undefined;
  const cb = customBuilder();
  if (cb !== seenBuilder) {
    seenBuilder = cb;
    memo.clear();
  }
  if (kind === 'custom' && !cb) return undefined;
  const o = opts && typeof opts === 'object' ? opts : {};
  // (a custom shape's outline and inset do not depend on the content padding: one memo entry for all of them)
  const known = pad && kind !== 'custom' ? cleanPad(pad) : zero();
  const key = `${kind}|${w}|${h}|${off}|${known.top},${known.right},${known.bottom},${known.left}|${keyOf(o)}`;
  if (memo.has(key)) {
    const hit = memo.get(key);
    // most recently used last
    memo.delete(key);
    memo.set(key, hit);
    return hit;
  }
  const b = off > 0 ? buildInset(kind, w, h, o, off) : build(kind, w, h, o, known);
  const out = b ? { d: toPath(b, w, h), inset: round(b.inset), b, w, h } : undefined;
  memo.set(key, out);
  if (memo.size > MEMO_SIZE) memo.delete(memo.keys().next().value as string);
  return out;
}

const cleanPad = (pad: ShapeInset): ShapeInset => {
  const v = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0);
  return { top: v(pad.top), right: v(pad.right), bottom: v(pad.bottom), left: v(pad.left) };
};

/**
 * The shape's outline in px for a w x h element (clockwise, closed) and the content padding that
 * keeps content inside it. Undefined for `none`, an unknown shape or an empty box. `pad` is where
 * the content starts anyway (border + own padding); a known pad lets the inset across be smaller.
 */
export function shapePath(kind: ShapeKind, w: number, h: number, opts: ShapeOptions = {}, pad?: ShapeInset): ShapePathResult | undefined {
  const o = shapeOutline(kind, w, h, opts, 0, pad);
  return o && { d: o.d, inset: { ...o.inset } };
}

/**
 * The outline of the shape of a w x h box moved `off` px (≥ 0) inward, in the box's coordinates:
 * a true offset for notch / octagon / hexagon / squircle (rings and border strokes inside the
 * shape). Undefined when nothing is left.
 */
export function shapeInsetPath(kind: ShapeKind, w: number, h: number, opts: ShapeOptions | undefined, off: number): string | undefined {
  return shapeOutline(kind, w, h, opts, Math.max(0, off))?.d;
}

/** The outline as a polyline (cubics sampled). */
function flatten(o: Outline, w: number, h: number): Pt[] {
  const c = (q: Pt) => p(clamp(q.x, 0, w), clamp(q.y, 0, h));
  const out = [c(o.start)];
  let cur = out[0];
  for (const s of o.segs) {
    const to = c(s.to);
    if (s.c1 && s.c2) {
      const c1 = c(s.c1);
      const c2 = c(s.c2);
      for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        const u = 1 - t;
        out.push(p(
          u * u * u * cur.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * to.x,
          u * u * u * cur.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * to.y,
        ));
      }
    } else out.push(to);
    cur = to;
  }
  return out;
}

/**
 * Where a line drawn inward from a point on one of the box's sides (`t` 0..1 along it, left to right /
 * top to bottom) first meets the outline: the shape's anchor on that side (flow lines). Undefined
 * for no shape.
 */
export function shapePoint(
  kind: ShapeKind,
  w: number,
  h: number,
  opts: ShapeOptions | undefined,
  side: ShapeSide,
  t = 0.5,
): Pt | undefined {
  const so = shapeOutline(kind, w, h, opts);
  if (!so) return undefined;
  const poly = (so.poly ??= flatten(so.b, w, h));
  const vertical = side === 'top' || side === 'bottom';
  const along = clamp(Number.isFinite(t) ? t : 0.5, 0, 1) * (vertical ? w : h);
  // project every crossing of the line onto the axis across the side; keep the one nearest the side
  const hits: number[] = [];
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i];
    const b = poly[i + 1];
    const [ua, ub, va, vb] = vertical ? [a.x, b.x, a.y, b.y] : [a.y, b.y, a.x, b.x];
    if (along < Math.min(ua, ub) - 1e-9 || along > Math.max(ua, ub) + 1e-9) continue;
    if (Math.abs(ub - ua) < 1e-9) hits.push(va, vb);
    else hits.push(va + ((along - ua) / (ub - ua)) * (vb - va));
  }
  if (!hits.length) return undefined;
  const near = side === 'top' || side === 'left' ? Math.min(...hits) : Math.max(...hits);
  const r = (n: number) => {
    const v = Math.round(n * 100) / 100;
    return Object.is(v, -0) ? 0 : v;
  };
  return vertical ? { x: r(along), y: r(near) } : { x: r(near), y: r(along) };
}
