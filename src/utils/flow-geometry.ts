import type { ShapeKind, ShapeOptions } from '../types';
import type { Side } from './flow';
import { shapePoint } from './shape-path';
import type { Pose } from './flow-motion';

/**
 * Flow line geometry (pure): two module rects (px, relative to the card content box) + anchor sides
 * + route -> an SVG path `d`, a point on the path halfway (label) and its length (dash timing).
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** The module's outline shape (src/utils/shape-path.ts): anchors sit on the outline, not the box. */
  shape?: { kind: ShapeKind; options?: ShapeOptions };
}

export interface Point {
  x: number;
  y: number;
}

export interface FlowGeometry {
  d: string;
  /** Where a label sits on the line: the curve's / line's middle, an elbow's longest segment's middle. */
  mid: Point;
  /** Unit direction of the path at `mid`. */
  tangent: Point;
  /** Length of the stretch `mid` is the middle of (the whole path; an elbow's segment). */
  run: number;
  /** Path length (px). */
  length: number;
  /** Position and travel direction (degrees) at arc length `s` (clamped to 0..length). */
  at: (s: number) => Pose;
  /** Arc lengths of the corners: keyframes of the shapes riding the line always include them. */
  knots?: number[];
}

/** Anchors sit this far outside the module's side. */
const ANCHOR_OFFSET = 4;
/** Curve control points: pushed along the side normal by min(CURVE_MAX, distance / 2). */
const CURVE_MAX = 120;
/** Elbow corner radius. */
const ELBOW_RADIUS = 8;

const SIDES: readonly Side[] = ['top', 'right', 'bottom', 'left'];
const horizontal = (s: Side) => s === 'left' || s === 'right';
const NORMAL: Record<Side, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

/**
 * The anchor of `side`, ANCHOR_OFFSET px outwards: at `t` along the side (0 = top / left end,
 * 0.5 = its midpoint).
 */
export function anchorPoint(r: Rect, side: Side, t = 0.5, out = 0): Point {
  const n = NORMAL[side];
  const off = ANCHOR_OFFSET + out;
  // a shaped module: where a line in from that point of the side meets the outline
  const s = r.shape ? shapePoint(r.shape.kind, r.w, r.h, r.shape.options, side, t) : undefined;
  if (s) return { x: r.x + s.x + n.x * off, y: r.y + s.y + n.y * off };
  return {
    x: n.x ? r.x + r.w / 2 + (n.x * r.w) / 2 + n.x * off : r.x + r.w * t,
    y: n.y ? r.y + r.h / 2 + (n.y * r.h) / 2 + n.y * off : r.y + r.h * t,
  };
}

/** Largest distance between two spread anchors on one side (px). */
const SPREAD_GAP = 16;

/**
 * Where each flow sits along its sides (`[t at from, t at to]`, 0.5 = midpoint): flows sharing a
 * module's side spread along it, ordered by where their other end is (along that side), so they
 * don't start on top of each other and don't cross right away. The gap is SPREAD_GAP px, packed to
 * 60 % of the side when it is short. A flow alone on its side keeps the midpoint.
 */
export function spreadAnchors(flows: ReadonlyArray<{ from: string; to: string; sides: [Side, Side] }>, rects: ReadonlyMap<string, Rect>): Array<[number, number]> {
  const out: Array<[number, number]> = flows.map(() => [0.5, 0.5]);
  const groups = new Map<string, Array<{ flow: number; end: 0 | 1; key: number }>>();
  flows.forEach((f, i) => {
    const ra = rects.get(f.from);
    const rb = rects.get(f.to);
    if (!ra || !rb) return;
    ([0, 1] as const).forEach((end) => {
      const [id, side, other, otherSide] = end === 0 ? [f.from, f.sides[0], rb, f.sides[1]] : [f.to, f.sides[1], ra, f.sides[0]];
      const o = anchorPoint(other, otherSide);
      const k = `${id}|${side}`;
      const list = groups.get(k) ?? [];
      list.push({ flow: i, end, key: horizontal(side) ? o.y : o.x });
      groups.set(k, list);
    });
  });
  for (const [k, list] of groups) {
    const n = list.length;
    if (n < 2) continue;
    const [id, side] = k.split('|') as [string, Side];
    const r = rects.get(id)!;
    const len = horizontal(side) ? r.h : r.w;
    if (len <= 0) continue;
    const gap = Math.min(SPREAD_GAP, (0.6 * len) / (n - 1));
    list.sort((a, b) => a.key - b.key || a.flow - b.flow);
    list.forEach((e, i) => {
      out[e.flow][e.end] = 0.5 + ((i - (n - 1) / 2) * gap) / len;
    });
  }
  return out;
}

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** Both anchors point at each other (a line leaving a side never heads back into its module). */
function facing(a: Rect, b: Rect, s0: Side, s1: Side): boolean {
  const p0 = anchorPoint(a, s0);
  const p1 = anchorPoint(b, s1);
  const n0 = NORMAL[s0];
  const n1 = NORMAL[s1];
  return n0.x * (p1.x - p0.x) + n0.y * (p1.y - p0.y) >= 0 && n1.x * (p0.x - p1.x) + n1.y * (p0.y - p1.y) >= 0;
}

/**
 * The sides a flow leaves `a` and enters `b` by. Auto: horizontal neighbours (overlapping rows)
 * connect right -> left (or left -> right), vertical neighbours bottom -> top (or top -> bottom);
 * otherwise (diagonal, or one side fixed) the facing pair with the shortest anchor distance.
 */
export function anchorSides(a: Rect, b: Rect, fromSide: Side | 'auto', toSide: Side | 'auto'): [Side, Side] {
  if (fromSide !== 'auto' && toSide !== 'auto') return [fromSide, toSide];
  if (fromSide === 'auto' && toSide === 'auto') {
    const overlapY = a.y < b.y + b.h && b.y < a.y + a.h;
    const overlapX = a.x < b.x + b.w && b.x < a.x + a.w;
    if (overlapY && !overlapX) return a.x < b.x ? ['right', 'left'] : ['left', 'right'];
    if (overlapX && !overlapY) return a.y < b.y ? ['bottom', 'top'] : ['top', 'bottom'];
  }
  const froms = fromSide === 'auto' ? SIDES : [fromSide];
  const tos = toSide === 'auto' ? SIDES : [toSide];
  let best: [Side, Side] | undefined;
  let bestScore = Infinity;
  for (const s0 of froms) {
    for (const s1 of tos) {
      // pairs pointing away from each other only win when nothing faces
      const score = dist(anchorPoint(a, s0), anchorPoint(b, s1)) + (facing(a, b, s0, s1) ? 0 : 1e6);
      if (score < bestScore) {
        bestScore = score;
        best = [s0, s1];
      }
    }
  }
  return best!;
}

/** Path numbers: 2 decimals, no "-0". */
function n(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(r === 0 ? 0 : r);
}

function curve(p0: Point, p1: Point, s0: Side, s1: Side): FlowGeometry {
  const k = Math.min(CURVE_MAX, dist(p0, p1) / 2);
  const c0 = { x: p0.x + NORMAL[s0].x * k, y: p0.y + NORMAL[s0].y * k };
  const c1 = { x: p1.x + NORMAL[s1].x * k, y: p1.y + NORMAL[s1].y * k };
  const at = (t: number): Point => {
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c0.x + 3 * u * t * t * c1.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c0.y + 3 * u * t * t * c1.y + t * t * t * p1.y,
    };
  };
  let length = 0;
  let prev = p0;
  const cum = [0];
  for (let i = 1; i <= 32; i++) {
    const p = at(i / 32);
    length += dist(prev, p);
    cum.push(length);
    prev = p;
  }
  // arc length -> t (linear inside each of the 32 pieces), then the point and the derivative there
  const pose = (s: number): Pose => {
    const c = Math.min(length, Math.max(0, s));
    let i = 1;
    while (i < 32 && cum[i] < c) i++;
    const t = (i - 1 + (cum[i] > cum[i - 1] ? (c - cum[i - 1]) / (cum[i] - cum[i - 1]) : 0)) / 32;
    const u = 1 - t;
    const dx = 3 * (u * u * (c0.x - p0.x) + 2 * u * t * (c1.x - c0.x) + t * t * (p1.x - c1.x));
    const dy = 3 * (u * u * (c0.y - p0.y) + 2 * u * t * (c1.y - c0.y) + t * t * (p1.y - c1.y));
    const p = at(t);
    return { x: p.x, y: p.y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
  };
  // B'(0.5)
  const dx = 0.75 * (c0.x - p0.x) + 1.5 * (c1.x - c0.x) + 0.75 * (p1.x - c1.x);
  const dy = 0.75 * (c0.y - p0.y) + 1.5 * (c1.y - c0.y) + 0.75 * (p1.y - c1.y);
  return {
    d: `M ${n(p0.x)} ${n(p0.y)} C ${n(c0.x)} ${n(c0.y)} ${n(c1.x)} ${n(c1.y)} ${n(p1.x)} ${n(p1.y)}`,
    mid: at(0.5),
    tangent: Math.hypot(dx, dy) > 1e-6 ? unit({ x: 0, y: 0 }, { x: dx, y: dy }) : unit(p0, p1),
    run: length,
    length,
    at: pose,
  };
}


/** Elbow stub length out of a side, and overshoot past both modules. */
const ELBOW_OUT = 16;

/**
 * Between two rects along one axis: the middle of the gap between them, else past both (+16).
 * a0..a1 / b0..b1: each rect's extent on that axis.
 */
function between(a0: number, a1: number, b0: number, b1: number): number {
  if (a1 <= b0) return (a1 + b0) / 2;
  if (b1 <= a0) return (b1 + a0) / 2;
  return Math.max(a1, b1) + ELBOW_OUT;
}

/**
 * Corner points of an orthogonal route from p0 (leaving `a` by s0) to p1 (entering `b` by s1).
 * Opposite sides that face away from each other (the target is behind) detour around both
 * modules: out of each side, then across between them (or past them).
 */
function elbowPoints(p0: Point, p1: Point, s0: Side, s1: Side, a: Rect, b: Rect): Point[] {
  const pts: Point[] = [p0];
  const n0 = NORMAL[s0];
  const n1 = NORMAL[s1];
  const behind = s0 !== s1 && horizontal(s0) === horizontal(s1) && n0.x * (p1.x - p0.x) + n0.y * (p1.y - p0.y) < 0;
  if (behind && horizontal(s0)) {
    const x0 = p0.x + n0.x * ELBOW_OUT;
    const x1 = p1.x + n1.x * ELBOW_OUT;
    const my = between(a.y, a.y + a.h, b.y, b.y + b.h);
    pts.push({ x: x0, y: p0.y }, { x: x0, y: my }, { x: x1, y: my }, { x: x1, y: p1.y });
  } else if (behind) {
    const y0 = p0.y + n0.y * ELBOW_OUT;
    const y1 = p1.y + n1.y * ELBOW_OUT;
    const mx = between(a.x, a.x + a.w, b.x, b.x + b.w);
    pts.push({ x: p0.x, y: y0 }, { x: mx, y: y0 }, { x: mx, y: y1 }, { x: p1.x, y: y1 });
  } else if (horizontal(s0) && horizontal(s1)) {
    let mx = (p0.x + p1.x) / 2;
    if (s0 === s1) mx = s0 === 'right' ? Math.max(p0.x, p1.x) + 16 : Math.min(p0.x, p1.x) - 16;
    pts.push({ x: mx, y: p0.y }, { x: mx, y: p1.y });
  } else if (!horizontal(s0) && !horizontal(s1)) {
    let my = (p0.y + p1.y) / 2;
    if (s0 === s1) my = s0 === 'bottom' ? Math.max(p0.y, p1.y) + 16 : Math.min(p0.y, p1.y) - 16;
    pts.push({ x: p0.x, y: my }, { x: p1.x, y: my });
  } else if (horizontal(s0)) {
    pts.push({ x: p1.x, y: p0.y });
  } else {
    pts.push({ x: p0.x, y: p1.y });
  }
  pts.push(p1);
  // drop repeated points and straight-through corners
  const out: Point[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (last && dist(last, p) < 0.01) continue;
    const before = out[out.length - 2];
    if (before && last && ((before.x === last.x && last.x === p.x) || (before.y === last.y && last.y === p.y))) out.pop();
    out.push(p);
  }
  return out;
}

type Piece = { kind: 'line'; a: Point; b: Point } | { kind: 'arc'; c: Point; u: Point; v: Point; r: number };

function unit(a: Point, b: Point): Point {
  const l = dist(a, b) || 1;
  return { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
}

function elbow(p0: Point, p1: Point, s0: Side, s1: Side, a: Rect, b: Rect): FlowGeometry {
  const pts = elbowPoints(p0, p1, s0, s1, a, b);
  const pieces: Piece[] = [];
  const parts = [`M ${n(p0.x)} ${n(p0.y)}`];
  let cur = p0;
  const lineTo = (p: Point) => {
    if (dist(cur, p) < 0.01) return;
    parts.push(Math.abs(p.y - cur.y) < 0.01 ? `H ${n(p.x)}` : `V ${n(p.y)}`);
    pieces.push({ kind: 'line', a: cur, b: p });
    cur = p;
  };
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const p = pts[i];
    const next = pts[i + 1];
    const r = Math.min(ELBOW_RADIUS, dist(prev, p) / 2, dist(p, next) / 2);
    const dA = unit(prev, p);
    const dB = unit(p, next);
    const s = { x: p.x - dA.x * r, y: p.y - dA.y * r };
    const e = { x: p.x + dB.x * r, y: p.y + dB.y * r };
    lineTo(s);
    if (r > 0.01) {
      const sweep = dA.x * dB.y - dA.y * dB.x > 0 ? 1 : 0;
      parts.push(`A ${n(r)} ${n(r)} 0 0 ${sweep} ${n(e.x)} ${n(e.y)}`);
      const c = { x: s.x + dB.x * r, y: s.y + dB.y * r };
      pieces.push({ kind: 'arc', c, u: { x: -dB.x * r, y: -dB.y * r }, v: { x: dA.x * r, y: dA.y * r }, r });
      cur = e;
    }
  }
  lineTo(p1);
  const len = (pc: Piece) => (pc.kind === 'line' ? dist(pc.a, pc.b) : (Math.PI * pc.r) / 2);
  const length = pieces.reduce((s, pc) => s + len(pc), 0);
  // position and direction at arc length s: walk the pieces; corner arcs start and end at the knots
  const knots: number[] = [];
  const bounds: number[] = [];
  let run0 = 0;
  for (const pc of pieces) {
    if (pc.kind === 'arc') knots.push(run0, run0 + len(pc) / 2, run0 + len(pc));
    run0 += len(pc);
    bounds.push(run0);
  }
  const pose = (s: number): Pose => {
    const c = Math.min(length, Math.max(0, s));
    let i = 0;
    while (i < pieces.length - 1 && bounds[i] < c) i++;
    const pc = pieces[i];
    if (!pc) return { x: p0.x, y: p0.y, a: 0 };
    const f = len(pc) > 0 ? Math.min(1, Math.max(0, (c - (bounds[i] - len(pc))) / len(pc))) : 0;
    if (pc.kind === 'line') return { x: pc.a.x + (pc.b.x - pc.a.x) * f, y: pc.a.y + (pc.b.y - pc.a.y) * f, a: (Math.atan2(pc.b.y - pc.a.y, pc.b.x - pc.a.x) * 180) / Math.PI };
    const th = f * (Math.PI / 2);
    const cs = Math.cos(th);
    const sn = Math.sin(th);
    return { x: pc.c.x + pc.u.x * cs + pc.v.x * sn, y: pc.c.y + pc.u.y * cs + pc.v.y * sn, a: (Math.atan2(-pc.u.y * sn + pc.v.y * cs, -pc.u.x * sn + pc.v.x * cs) * 180) / Math.PI };
  };
  // the label sits in the middle of the longest straight segment (never on a corner)
  let best: { a: Point; b: Point } | undefined;
  for (const pc of pieces) if (pc.kind === 'line' && (!best || dist(pc.a, pc.b) > dist(best.a, best.b))) best = pc;
  if (!best) return { d: parts.join(' '), mid: p0, tangent: unit(p0, p1), run: 0, length, at: pose, knots };
  return {
    d: parts.join(' '),
    mid: { x: (best.a.x + best.b.x) / 2, y: (best.a.y + best.b.y) / 2 },
    tangent: unit(best.a, best.b),
    run: dist(best.a, best.b),
    length,
    at: pose,
    knots,
  };
}

/** Where the ends sit: `t` along their sides (spreadAnchors); `trim` px further out (arrowheads). */
export interface FlowEnds {
  t?: [number, number];
  trim?: [number, number];
}

/** The flow's path between the anchors of `sides` on `a` and `b`. */
export function flowPath(a: Rect, b: Rect, sides: [Side, Side], route: 'curve' | 'straight' | 'elbow', ends: FlowEnds = {}): FlowGeometry {
  const [s0, s1] = sides;
  const p0 = anchorPoint(a, s0, ends.t?.[0], ends.trim?.[0]);
  const p1 = anchorPoint(b, s1, ends.t?.[1], ends.trim?.[1]);
  if (route === 'curve') return curve(p0, p1, s0, s1);
  if (route === 'elbow') return elbow(p0, p1, s0, s1, a, b);
  return {
    d: `M ${n(p0.x)} ${n(p0.y)} L ${n(p1.x)} ${n(p1.y)}`,
    mid: { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 },
    tangent: unit(p0, p1),
    run: dist(p0, p1),
    length: dist(p0, p1),
    at: (s) => {
      const l = dist(p0, p1) || 1;
      const f = Math.min(1, Math.max(0, s / l));
      return { x: p0.x + (p1.x - p0.x) * f, y: p0.y + (p1.y - p0.y) * f, a: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI };
    },
  };
}
