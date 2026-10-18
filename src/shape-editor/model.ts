import { CORNER_TYPES, MAX_SHAPE_POINTS } from '../contracts/custom-shape';
import type { AnchoredCoord, AnchoredPoint, CornerKey, CornerType, CustomShapeOptions, ShapeLength } from '../contracts/custom-shape';
import type { Anchor, AnchorKind, EditPath, Pt } from '../contracts/path-model';
import type { ShapeOptions } from '../types';
import { clamp, parseShapeLength } from '../utils/shape-path';

/*
 * The shape editor's document and the pure rules around it (contract custom-shape 1.0.0 revision 3):
 * corner mode (type and size per corner, px or %), free path mode (points anchored to an edge or
 * stretching), the `padding` rules ("Space for text"), "Edit as custom" from the presets and a small
 * YAML writer. No DOM, no lit.
 */

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Sides = Record<Side, number>;
export const SIDES: Side[] = ['top', 'right', 'bottom', 'left'];
export const KEYS: CornerKey[] = ['tl', 'tr', 'br', 'bl'];
export const noSides = (): Sides => ({ top: 0, right: 0, bottom: 0, left: 0 });

export const DEFAULT_SMOOTHING = 0.6;
/** The size a corner gets when it names a type and has none (the runtime's 16 px). */
export const DEFAULT_CORNER = 16;

// ── sizes ──

export interface EditSize {
  id: 'tile' | 'row' | 'wide' | 'custom';
  w: number;
  h: number;
}
export const SIZES: EditSize[] = [
  { id: 'tile', w: 120, h: 120 },
  { id: 'row', w: 360, h: 120 },
  { id: 'wide', w: 720, h: 200 },
];

// ── corners ──

export interface Corner {
  type: CornerType;
  /** px, or % of the shorter side when `pct`. Kept while the type is square. */
  size: number;
  pct: boolean;
}
export type Corners = Record<CornerKey, Corner>;

const TYPES = new Set<unknown>(CORNER_TYPES);
const isType = (v: unknown): v is CornerType => TYPES.has(v);
const round = (n: number, d = 2): number => {
  const f = 10 ** d;
  const v = Math.round(n * f) / f;
  return Object.is(v, -0) ? 0 : v;
};
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

const length = (v: unknown): { n: number; pct: boolean } | undefined => {
  const n = parseShapeLength(v, 100);
  return n === undefined ? undefined : { n, pct: typeof v === 'string' && v.trim().endsWith('%') };
};

export const squareCorner = (): Corner => ({ type: 'square', size: DEFAULT_CORNER, pct: false });
export const cornersOf = (c: Corner): Corners => ({ tl: { ...c }, tr: { ...c }, br: { ...c }, bl: { ...c } });

/** The four corners as the runtime reads `corner`, `corner_type` and `corners` (a size of 0 is a square corner). */
export function readCorners(o: CustomShapeOptions): Corners {
  const shared = length(o.corner) ?? { n: isType(o.corner_type) ? DEFAULT_CORNER : 0, pct: false };
  const out = {} as Corners;
  for (const k of KEYS) {
    const c = o.corners?.[k];
    const d = (c && typeof c === 'object' ? c : { type: c, size: c }) as { type?: unknown; size?: unknown };
    const t = isType(d.type) ? d.type : undefined;
    const s = length(d.size) ?? (t && !shared.n ? { n: DEFAULT_CORNER, pct: false } : shared);
    const type = t ?? (isType(o.corner_type) ? o.corner_type : 'round');
    out[k] = type === 'square' || !s.n ? { type: 'square', size: s.n || DEFAULT_CORNER, pct: s.n ? s.pct : false } : { type, size: s.n, pct: s.pct };
  }
  return out;
}

const sizeValue = (c: Corner): ShapeLength => (c.pct ? `${round(c.size)}%` : round(c.size));
const same = (a: Corner, b: Corner): boolean => a.type === b.type && (a.type === 'square' || (a.size === b.size && a.pct === b.pct));

/** The `corner` / `corner_type` / `corners` keys for these corners (the shortest form that says it). */
export function writeCorners(c: Corners): CustomShapeOptions {
  const [a, ...rest] = KEYS.map((k) => c[k]);
  if (rest.every((b) => same(a, b))) return a.type === 'square' ? { corner_type: 'square' } : { corner: sizeValue(a), corner_type: a.type };
  const corners: CustomShapeOptions['corners'] = {};
  for (const k of KEYS) corners[k] = c[k].type === 'square' ? 'square' : { type: c[k].type, size: sizeValue(c[k]) };
  return { corners };
}

export const cornerPx = (c: Corner, w: number, h: number): number => (c.type === 'square' ? 0 : c.pct ? (c.size / 100) * Math.min(w, h) : c.size);

/** The factor every corner is scaled by so no side is over-full (CSS border-radius rule, as the builder). */
export function clampFactor(c: Corners, w: number, h: number): number {
  const [a, b, d, e] = KEYS.map((k) => cornerPx(c[k], w, h));
  const f = Math.min(1, w / (a + b || 1), h / (b + d || 1), w / (d + e || 1), h / (e + a || 1));
  return f;
}

/** Corners that are drawn smaller than asked at w x h: { key, from, to } in px. */
export function clamped(c: Corners, w: number, h: number): Array<{ key: CornerKey; from: number; to: number }> {
  const f = clampFactor(c, w, h);
  if (f >= 0.9999) return [];
  return KEYS.filter((k) => cornerPx(c[k], w, h) > 0).map((k) => ({ key: k, from: cornerPx(c[k], w, h), to: cornerPx(c[k], w, h) * f }));
}

export const STARTERS: Array<{ id: string; corners: () => Corners }> = [
  { id: 'rounded', corners: () => cornersOf({ type: 'round', size: 16, pct: false }) },
  { id: 'cut', corners: () => cornersOf({ type: 'bevel', size: 16, pct: false }) },
  { id: 'scooped', corners: () => cornersOf({ type: 'scoop', size: 16, pct: false }) },
  { id: 'notched', corners: () => cornersOf({ type: 'notch', size: 16, pct: false }) },
  {
    id: 'two',
    corners: () => ({ tl: { type: 'notch', size: 16, pct: false }, tr: squareCorner(), br: { type: 'notch', size: 16, pct: false }, bl: squareCorner() }),
  },
];

// ── anchored points ──

/** One axis of a point: `l` px from the near edge, `r` px from the far edge, `s` percent of the side (plus `off` px). */
export interface Axis {
  k: 'l' | 'r' | 's';
  v: number;
  off?: number;
}
export interface EPoint {
  x: Axis;
  y: Axis;
  /** Handle offsets in px from the anchor. */
  in?: [number, number];
  out?: [number, number];
  kind?: AnchorKind;
}

const COORD = /^\s*(?:(-?[\d.]+)%)?([+-]?[\d.]+)?(?:px)?\s*$/;

export function parseAxis(v: AnchoredCoord): Axis | undefined {
  let p: number | undefined;
  let n: number;
  if (typeof v === 'number') n = v;
  else {
    const m = COORD.exec(String(v));
    if (!m || !/\d/.test(m[0])) return undefined;
    p = m[1] === undefined ? undefined : +m[1];
    n = m[2] === undefined ? 0 : +m[2];
  }
  if (!Number.isFinite(n) || (p !== undefined && !Number.isFinite(p))) return undefined;
  if (p === undefined || p === 0) return { k: 'l', v: Math.max(0, n) };
  if (p === 100 && n <= 0) return { k: 'r', v: -n };
  return { k: 's', v: p, off: n };
}

export function fmtAxis(a: Axis): AnchoredCoord {
  if (a.k === 'l') return round(a.v, 1);
  if (a.k === 'r') return a.v ? `100%-${round(a.v, 1)}` : '100%';
  const o = a.off ? (a.off > 0 ? `+${round(a.off, 1)}` : `${round(a.off, 1)}`) : '';
  return `${round(a.v)}%${o}`;
}

export function absOf(a: Axis, size: number): number {
  return clamp(a.k === 'l' ? a.v : a.k === 'r' ? size - a.v : (a.v / 100) * size + (a.off ?? 0), 0, size);
}

/** The same kind of anchor, moved so it resolves to `x` (px from the near edge) on a `size` px side. */
export function withAbs(a: Axis, x: number, size: number): Axis {
  const c = clamp(x, 0, size);
  if (a.k === 'l') return { k: 'l', v: round(c, 1) };
  if (a.k === 'r') return { k: 'r', v: round(size - c, 1) };
  return { k: 's', v: size ? round(((c - (a.off ?? 0)) / size) * 100) : 0, off: a.off };
}

/** The anchor a new point gets: the nearest edge in the outer thirds of a side, stretch in the middle. */
export function defaultAxis(x: number, size: number): Axis {
  const c = clamp(x, 0, size);
  if (c < size / 3) return { k: 'l', v: round(c, 1) };
  if (c > (size * 2) / 3) return { k: 'r', v: round(size - c, 1) };
  return { k: 's', v: size ? round((c / size) * 100) : 0 };
}

export function readPoints(list: unknown): EPoint[] | undefined {
  if (!Array.isArray(list)) return undefined;
  const out: EPoint[] = [];
  for (const q of list as AnchoredPoint[]) {
    const x = q && parseAxis(q.x);
    const y = q && parseAxis(q.y);
    if (!x || !y || out.length >= MAX_SHAPE_POINTS) continue;
    const hd = (v?: number[]): [number, number] | undefined => (Array.isArray(v) && num(v[0]) !== undefined && num(v[1]) !== undefined ? [v[0], v[1]] : undefined);
    const p: EPoint = { x, y };
    const i = hd(q.in);
    const o = hd(q.out);
    if (i) p.in = i;
    if (o) p.out = o;
    if (q.kind) p.kind = q.kind;
    out.push(p);
  }
  return out.length >= 3 ? out : undefined;
}

export function writePoints(points: EPoint[]): AnchoredPoint[] {
  return points.map((p) => {
    const q: AnchoredPoint = { x: fmtAxis(p.x), y: fmtAxis(p.y) };
    if (p.in) q.in = [round(p.in[0], 1), round(p.in[1], 1)];
    if (p.out) q.out = [round(p.out[0], 1), round(p.out[1], 1)];
    if (p.kind && p.kind !== 'corner') q.kind = p.kind;
    return q;
  });
}

/** The points resolved in a w x h box, as canvas anchors (handles clamped into the box like the runtime does). */
export function toAnchors(points: EPoint[], w: number, h: number): Anchor[] {
  return points.map((p) => {
    const x = absOf(p.x, w);
    const y = absOf(p.y, h);
    const a: Anchor = { x, y };
    if (p.in) a.in = [clamp(x + p.in[0], 0, w), clamp(y + p.in[1], 0, h)];
    if (p.out) a.out = [clamp(x + p.out[0], 0, w), clamp(y + p.out[1], 0, h)];
    if (p.kind) a.kind = p.kind;
    return a;
  });
}

const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-6;

/**
 * The canvas's anchors back to anchored points. Same count: point by point. Otherwise points that did
 * not move keep their anchoring and a new point gets the default one (adds and deletes).
 */
export function fromAnchors(prev: EPoint[], anchors: Anchor[], w: number, h: number): EPoint[] {
  const old = toAnchors(prev, w, h);
  const make = (a: Anchor, from?: EPoint): EPoint => {
    const p: EPoint = { x: from ? withAbs(from.x, a.x, w) : defaultAxis(a.x, w), y: from ? withAbs(from.y, a.y, h) : defaultAxis(a.y, h) };
    if (a.in) p.in = [round(a.in[0] - a.x, 1), round(a.in[1] - a.y, 1)];
    if (a.out) p.out = [round(a.out[0] - a.x, 1), round(a.out[1] - a.y, 1)];
    if (a.kind) p.kind = a.kind;
    return p;
  };
  if (anchors.length === prev.length) {
    return anchors.map((a, i) => {
      const o = old[i];
      const p = make(a, prev[i]);
      // an untouched point keeps exactly what it had (no rounding drift, handles beyond the box stay)
      return near(o.x, a.x) && near(o.y, a.y) && sameHandle(o.in, a.in) && sameHandle(o.out, a.out) && o.kind === a.kind ? prev[i] : p;
    });
  }
  const used = new Set<number>();
  return anchors.map((a) => {
    const j = old.findIndex((o, i) => !used.has(i) && near(o.x, a.x) && near(o.y, a.y));
    if (j < 0) return make(a);
    used.add(j);
    const o = old[j];
    return sameHandle(o.in, a.in) && sameHandle(o.out, a.out) ? prev[j] : make(a, prev[j]);
  });
}

const sameHandle = (a?: [number, number], b?: [number, number]): boolean => (!a && !b) || (!!a && !!b && near(a[0], b[0]) && near(a[1], b[1]));

export const toEditPath = (points: EPoint[], w: number, h: number): EditPath => ({ anchors: toAnchors(points, w, h), closed: true });


// ── corners to points ("Convert to path") ──

const KAPPA = 0.5522847498;
const TRAVEL: number[][] = [[0, 0, 0, 1, 1, 0], [1, 0, -1, 0, 0, 1], [1, 1, 0, -1, -1, 0], [0, 1, 1, 0, 0, -1]];

/**
 * The corners as points at a w x h box, clockwise from the top left corner: the shape the corners draw,
 * frozen at this size (px distances to the nearest edge). Squircle corners are sampled and joined with
 * smooth curves (within a pixel or so of the true curve).
 */
export function cornersToPoints(c: Corners, w: number, h: number, smoothing = DEFAULT_SMOOTHING): EPoint[] {
  const f = clampFactor(c, w, h);
  const n = 3 + (1 - clamp(smoothing, 0, 1)) * 5;
  const out: EPoint[] = [];
  const add = (x: number, y: number, hin?: [number, number], hout?: [number, number]): void => {
    const last = out[out.length - 1];
    const px = round(x, 2);
    const py = round(y, 2);
    const prev = last && absOf(last.x, w) === px && absOf(last.y, h) === py;
    const q: EPoint = prev ? last : { x: { k: 'l', v: 0 }, y: { k: 'l', v: 0 } };
    q.x = px <= w / 2 ? { k: 'l', v: px } : { k: 'r', v: round(w - px, 2) };
    q.y = py <= h / 2 ? { k: 'l', v: py } : { k: 'r', v: round(h - py, 2) };
    if (hin) q.in = hin;
    if (hout) q.out = hout;
    if (hin || hout) q.kind = 'smooth';
    if (!prev) out.push(q);
  };
  KEYS.forEach((k, i) => {
    const [x, y, a, b, cc, d] = TRAVEL[i];
    const [ox, oy] = [x * w, y * h];
    const s = cornerPx(c[k], w, h) * f;
    const at = (u: number, v: number): Pt => [ox + a * u + cc * v, oy + b * u + d * v];
    const t = c[k].type;
    if (t === 'square' || s < 1e-6) return add(...at(0, 0));
    if (t === 'bevel') return add(...at(s, 0)), add(...at(0, s));
    if (t === 'notch') return add(...at(s, 0)), add(...at(s, s)), add(...at(0, s));
    if (t === 'scoop') {
      const [p1, p2] = [at(s, 0), at(0, s)];
      const e1 = at(s, KAPPA * s);
      const e2 = at(KAPPA * s, s);
      add(p1[0], p1[1], undefined, [round(e1[0] - p1[0], 2), round(e1[1] - p1[1], 2)]);
      return add(p2[0], p2[1], [round(e2[0] - p2[0], 2), round(e2[1] - p2[1], 2)]);
    }
    // round (one cubic) and squircle (a superellipse, sampled): u = s (1 - sin^e), v = s (1 - cos^e)
    const e = t === 'round' ? 1 : 2 / n;
    const steps = t === 'round' ? 1 : 4;
    const phi = (j: number): number => (Math.PI / 2) * (j / steps);
    const pt = (j: number): Pt => at(s * (1 - Math.sin(phi(j)) ** e), s * (1 - Math.cos(phi(j)) ** e));
    const dir = (j: number): Pt => {
      if (j === 0) return [-a, -b];
      if (j === steps) return [cc, d];
      const g = phi(j);
      const du = -e * Math.sin(g) ** (e - 1) * Math.cos(g);
      const dv = e * Math.cos(g) ** (e - 1) * Math.sin(g);
      const m = Math.hypot(du, dv) || 1;
      // (u, v) to screen: u runs along (a, b), v along (cc, d)
      return [(du * a + dv * cc) / m, (du * b + dv * d) / m];
    };
    for (let j = 0; j <= steps; j++) {
      const q = pt(j);
      const len = (from: number, to: number): number => (steps === 1 ? KAPPA * s : Math.hypot(pt(to)[0] - pt(from)[0], pt(to)[1] - pt(from)[1]) / 3);
      const [dx, dy] = dir(j);
      const lo = j < steps ? len(j, j + 1) : 0;
      const li = j > 0 ? len(j - 1, j) : 0;
      add(q[0], q[1], j > 0 ? [round(-dx * li, 2), round(-dy * li, 2)] : undefined, j < steps ? [round(dx * lo, 2), round(dy * lo, 2)] : undefined);
    }
  });
  // the last point may sit on the first
  if (out.length > 3) {
    const a = out[0];
    const z = out[out.length - 1];
    if (absOf(a.x, w) === absOf(z.x, w) && absOf(a.y, h) === absOf(z.y, h)) {
      if (z.in) a.in = z.in;
      out.pop();
    }
  }
  return out;
}

/** The same outline walked the other way. */
export const reversePoints = (pts: EPoint[]): EPoint[] =>
  [...pts].reverse().map((p) => {
    const q: EPoint = { x: p.x, y: p.y };
    if (p.out) q.in = p.out;
    if (p.in) q.out = p.in;
    if (p.kind) q.kind = p.kind;
    return q;
  });

/** A blank rectangle as four points, each anchored to its nearest corner. */
export const rectPoints = (): EPoint[] => {
  const l: Axis = { k: 'l', v: 0 };
  const r: Axis = { k: 'r', v: 0 };
  return [{ x: l, y: l }, { x: r, y: l }, { x: r, y: r }, { x: l, y: r }].map((q) => ({ x: { ...q.x }, y: { ...q.y } }));
};

// ── the document ──

export interface Doc {
  mode: 'corners' | 'path';
  corners: Corners;
  smoothing: number;
  /** Corner mode: "Extra space", px per side, 0 = none. */
  extra: Sides;
  points: EPoint[];
  /** Path mode: the `padding` written (px). */
  pad: Sides;
  /** Path mode: what the solver gave last time (to tell a raise from the solver's own value). */
  solver: Sides;
}

export const blankDoc = (): Doc => ({ mode: 'corners', corners: cornersOf(squareCorner()), smoothing: DEFAULT_SMOOTHING, extra: noSides(), points: [], pad: noSides(), solver: noSides() });

const padSide = (pad: CustomShapeOptions['padding'], s: Side, ref: number): number | undefined =>
  parseShapeLength(pad && typeof pad === 'object' ? pad[s] : pad, ref);

/**
 * A document from options. A % `padding` becomes px at this edit size (a hand-written value may settle
 * differently from a cold or warm start; the editor stores px). `solve` fills `padding` of a free path
 * that has none and tells a raise from the solver's value.
 */
export function readDoc(o: CustomShapeOptions, w: number, h: number, solve?: (points: EPoint[]) => Sides, inset?: (o: CustomShapeOptions) => Sides | undefined): Doc {
  const d = blankDoc();
  d.smoothing = parseShapeLength(o.smoothing, 1) ?? DEFAULT_SMOOTHING;
  const points = readPoints(o.points);
  const m = Math.min(w, h);
  if (points) {
    d.mode = 'path';
    d.points = points;
    d.solver = solve ? solve(points) : noSides();
    for (const s of SIDES) {
      const v = padSide(o.padding, s, m);
      d.pad[s] = Math.ceil(v ?? d.solver[s]);
    }
  } else {
    d.corners = readCorners(o);
    const base = o.padding === undefined ? undefined : inset?.({ ...o, padding: undefined });
    if (base) for (const s of SIDES) d.extra[s] = Math.max(0, Math.ceil(padSide(o.padding, s, m) ?? 0)) > base[s] ? Math.ceil(padSide(o.padding, s, m) ?? 0) : 0;
  }
  return d;
}

/** The options for a document. `inset`: the corner mode inset without padding (raised sides write max(extra, inset)). */
export function writeDoc(d: Doc, inset?: Sides): CustomShapeOptions {
  if (d.mode === 'path') return { points: writePoints(d.points), padding: { top: d.pad.top, right: d.pad.right, bottom: d.pad.bottom, left: d.pad.left } };
  const o = writeCorners(d.corners);
  if (Object.values(d.corners).some((c) => c.type === 'round' || c.type === 'squircle') && Math.abs(d.smoothing - DEFAULT_SMOOTHING) > 1e-9) o.smoothing = round(d.smoothing);
  const raised = SIDES.filter((s) => d.extra[s] > 0);
  if (raised.length) {
    const p: Partial<Record<Side, number>> = {};
    // `padding` replaces the computed inset on the sides it names: name the raised ones, and only raise
    for (const s of SIDES) if (d.extra[s] > 0) p[s] = Math.max(d.extra[s], Math.ceil(inset?.[s] ?? 0));
    o.padding = p;
  }
  return o;
}

/**
 * The padding after the points changed: new side = max(new solver value, old stored value if it differed
 * from the old solver value, else 0), so a user's raise survives an edit.
 */
export function repad(d: Doc, solver: Sides): Doc {
  const pad = noSides();
  for (const s of SIDES) pad[s] = Math.max(solver[s], d.pad[s] !== d.solver[s] ? d.pad[s] : 0);
  return { ...d, pad, solver };
}

// ── "Edit as custom" ──

export interface PresetStart {
  options: CustomShapeOptions;
  /** The preset's own name for the caption. */
  from: string;
  /** The caption key: `bevel` for the notch preset (its corners are cut straight). */
  note: 'same' | 'bevel' | 'path' | 'ellipse';
}

/** A regular octagon's cut, side / (2 + sqrt 2), as % of the shorter side. */
const OCTAGON_CUT = '29.289%';

/**
 * A preset as custom options. Corner presets become corners (within 1 px at every size); the hexagon
 * becomes points at the edit size. `notch` is the BEVEL preset (cut corners), `Ticket`, `Wave` and
 * `Blob` have no custom form (undefined).
 */
export function presetToCustom(kind: string, o: ShapeOptions | undefined, w: number, h: number): PresetStart | undefined {
  const m = Math.min(w, h);
  const size = (def: ShapeLength): ShapeLength => (length(o?.corner) ? (o!.corner as ShapeLength) : def);
  switch (kind) {
    case 'squircle': {
      const out: CustomShapeOptions = { corner: size('50%'), corner_type: 'squircle' };
      if (o?.smoothing !== undefined) out.smoothing = o.smoothing;
      return { options: out, from: 'Squircle', note: 'same' };
    }
    case 'notch':
      return { options: { corner: size(16), corner_type: 'bevel' }, from: 'Notch', note: 'bevel' };
    case 'octagon':
      return { options: { corner: size(OCTAGON_CUT), corner_type: 'bevel' }, from: 'Octagon', note: 'same' };
    case 'pill':
      return { options: { corner: '50%', corner_type: 'round' }, from: 'Pill', note: 'same' };
    case 'circle':
      return { options: { corner: '50%', corner_type: 'round' }, from: 'Circle', note: w === h ? 'same' : 'ellipse' };
    case 'hexagon': {
      const c = clamp(parseShapeLength(o?.corner, m) ?? (m / 2) * Math.tan(Math.PI / 6), 0, m / 2);
      const P = (x: AnchoredCoord, y: AnchoredCoord): AnchoredPoint => ({ x, y });
      const r = (n: number): number => round(n, 1);
      const pts = w >= h
        ? [P(r(c), 0), P(`100%-${r(c)}`, 0), P('100%', '50%'), P(`100%-${r(c)}`, '100%'), P(r(c), '100%'), P(0, '50%')]
        : [P('50%', 0), P('100%', r(c)), P('100%', `100%-${r(c)}`), P('50%', '100%'), P(0, `100%-${r(c)}`), P(0, r(c))];
      return { options: { points: pts }, from: 'Hexagon', note: 'path' };
    }
    default:
      return undefined;
  }
}

// ── YAML for people who read it ──

const plain = /^[A-Za-z_][\w.-]*$/;
const scalar = (v: unknown): string => (typeof v === 'string' ? (plain.test(v) ? v : JSON.stringify(v)) : String(v));
const flow = (v: unknown): string =>
  Array.isArray(v) ? `[${v.map(flow).join(', ')}]` : v && typeof v === 'object' ? `{ ${Object.entries(v).map(([k, x]) => `${k}: ${flow(x)}`).join(', ')} }` : scalar(v);

export function toYaml(shapeOptions: CustomShapeOptions): string {
  const lines = ['shape: custom', 'shape_options:'];
  const put = (v: unknown, pad: string, key: string): void => {
    if (Array.isArray(v) && v.some((x) => x && typeof x === 'object')) {
      lines.push(`${pad}${key}:`);
      for (const x of v) lines.push(`${pad}  - ${flow(x)}`);
    } else if (v && typeof v === 'object' && !Array.isArray(v) && key === 'corners') {
      lines.push(`${pad}${key}:`);
      for (const [k, x] of Object.entries(v)) lines.push(`${pad}  ${k}: ${flow(x)}`);
    } else lines.push(`${pad}${key}: ${flow(v)}`);
  };
  for (const [k, v] of Object.entries(shapeOptions)) if (v !== undefined) put(v, '  ', k);
  return lines.join('\n');
}
