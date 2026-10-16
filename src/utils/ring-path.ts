import type { RingStart, ShapeKind, ShapeOptions } from '../types';
import { shapeInsetPath, shapePath } from './shape-path';
import { outlinePath, parseOutline, restartOutline, reverseOutline, translateOutline } from './shape-outline';

/*
 * The outline of a CSS rounded rectangle as an SVG path, from an element's rendered size and its
 * computed border radii (per corner, elliptical, %), clamped like CSS, optionally inset (the ring
 * sits inside / on / outside the border edge). The path starts at a chosen point and runs clockwise
 * or counter-clockwise, so a dash with pathLength="100" fills from there in percent.
 */

export interface CornerRadius {
  x: number;
  y: number;
}

export interface Radii {
  tl: CornerRadius;
  tr: CornerRadius;
  br: CornerRadius;
  bl: CornerRadius;
}

export interface RingPathOptions {
  /** Distance the outline moves inward from the border edge (negative: outward). */
  inset?: number;
  start?: RingStart;
  direction?: 'cw' | 'ccw';
}

/** The radius-related part of a CSSStyleDeclaration. */
export type RadiusStyle = Pick<
  CSSStyleDeclaration,
  'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomRightRadius' | 'borderBottomLeftRadius'
>;

/**
 * A length as px: `12px`, `50%` (of `of`), or a math function the computed style keeps because it
 * mixes a percentage with a length (`calc(10% + 4px)`, `min(50%, 16px)`, `clamp(...)`); getComputedStyle
 * already resolves every other unit and calc() of absolute lengths to px. NaN when unreadable.
 */
function evalLength(src: string, of: number): number {
  const tokens = src.match(/-?\d*\.?\d+(?:e[+-]?\d+)?(?:px|%)?|[a-z-]+\(|[()+\-*/,]/gi) ?? [];
  if (tokens.join('').replace(/\s+/g, '') !== src.replace(/\s+/g, '')) return NaN;
  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  const args = (): number[] => {
    const out = [expr()];
    while (peek() === ',') {
      next();
      out.push(expr());
    }
    if (next() !== ')') return [NaN];
    return out;
  };
  const factor = (): number => {
    const t = next();
    if (t === undefined) return NaN;
    if (t === '(') {
      const v = expr();
      return next() === ')' ? v : NaN;
    }
    if (t === '-') return -factor();
    const fn = /^([a-z-]+)\($/i.exec(t)?.[1].toLowerCase();
    if (fn) {
      const a = args();
      if (fn === 'calc' && a.length === 1) return a[0];
      if (fn === 'min') return Math.min(...a);
      if (fn === 'max') return Math.max(...a);
      if (fn === 'clamp' && a.length === 3) return Math.max(a[0], Math.min(a[1], a[2]));
      return NaN;
    }
    const n = parseFloat(t);
    return t.endsWith('%') ? (n / 100) * of : n;
  };
  const term = (): number => {
    let v = factor();
    while (peek() === '*' || peek() === '/') v = next() === '*' ? v * factor() : v / factor();
    return v;
  };
  // binary + / - (CSS needs spaces around them, so a "-4px" token after a value is a subtraction)
  const expr = (): number => {
    let v = term();
    for (;;) {
      const t = peek();
      if (t === '+' || t === '-') {
        next();
        v = t === '+' ? v + term() : v - term();
      } else if (t !== undefined && /^-\d|^-\./.test(t)) {
        v += term();
      } else return v;
    }
  };
  const v = expr();
  return i === tokens.length ? v : NaN;
}

function length(v: string | undefined, of: number): number {
  if (!v) return 0;
  const n = /^[a-z-]+\(/i.test(v.trim()) ? evalLength(v.trim(), of) : v.trim().endsWith('%') ? (parseFloat(v) / 100) * of : parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Split at top-level whitespace (not inside a function's parentheses). */
function values(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of value.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

/** A computed `border-*-radius` ("12px", "10px 20px", "50%", "calc(10% + 4px)"): horizontal of the width, vertical of the height. */
export function parseRadius(value: string | undefined, w: number, h: number): CornerRadius {
  const [a, b = a] = values(value || '');
  return { x: length(a, w), y: length(b, h) };
}

export function readRadii(cs: RadiusStyle, w: number, h: number): Radii {
  return {
    tl: parseRadius(cs.borderTopLeftRadius, w, h),
    tr: parseRadius(cs.borderTopRightRadius, w, h),
    br: parseRadius(cs.borderBottomRightRadius, w, h),
    bl: parseRadius(cs.borderBottomLeftRadius, w, h),
  };
}

const scale = (c: CornerRadius, f: number): CornerRadius => ({ x: c.x * f, y: c.y * f });

/** CSS "overlapping curves": when adjacent radii exceed a side, every radius scales by the smallest ratio. */
export function clampRadii(r: Radii, w: number, h: number): Radii {
  const ratio = (side: number, sum: number) => (sum > side ? side / sum : 1);
  const f = Math.min(
    ratio(w, r.tl.x + r.tr.x),
    ratio(h, r.tr.y + r.br.y),
    ratio(w, r.br.x + r.bl.x),
    ratio(h, r.tl.y + r.bl.y),
  );
  return f >= 1 ? r : { tl: scale(r.tl, f), tr: scale(r.tr, f), br: scale(r.br, f), bl: scale(r.bl, f) };
}

/** Radii of the outline moved inward by `d` (like a padding edge); outward only rounded corners grow. */
export function insetRadii(r: Radii, d: number): Radii {
  const one = (c: CornerRadius): CornerRadius => {
    if (d >= 0) return { x: Math.max(0, c.x - d), y: Math.max(0, c.y - d) };
    return { x: c.x > 0 ? c.x - d : 0, y: c.y > 0 ? c.y - d : 0 };
  };
  return { tl: one(r.tl), tr: one(r.tr), br: one(r.br), bl: one(r.bl) };
}

interface Pt {
  x: number;
  y: number;
}

/** One piece of the outline, walked clockwise; `group` merges pieces of one side / corner again. */
interface Seg {
  kind: 'L' | 'A';
  group: string;
  from: Pt;
  to: Pt;
  rx: number;
  ry: number;
}

const fmt = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return String(Object.is(v, -0) ? 0 : v);
};
const same = (a: Pt, b: Pt) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6;

/** The two halves of a corner arc around `c`, from angle a0 to a0 + 90deg (clockwise on screen). */
function corner(group: string, c: Pt, r: CornerRadius, a0: number): Seg[] {
  const at = (deg: number): Pt => {
    const t = (deg * Math.PI) / 180;
    return { x: c.x + r.x * Math.cos(t), y: c.y + r.y * Math.sin(t) };
  };
  const [p0, pm, p1] = [at(a0), at(a0 + 45), at(a0 + 90)];
  return [
    { kind: 'A', group, from: p0, to: pm, rx: r.x, ry: r.y },
    { kind: 'A', group, from: pm, to: p1, rx: r.x, ry: r.y },
  ];
}

function side(group: string, from: Pt, to: Pt): Seg[] {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return [
    { kind: 'L', group, from, to: mid, rx: 0, ry: 0 },
    { kind: 'L', group, from: mid, to, rx: 0, ry: 0 },
  ];
}

/**
 * Index in the clockwise loop where each start position begins: [top 2nd half, TR 1, TR 2,
 * right 1, right 2, BR 1, BR 2, bottom 1, bottom 2, BL 1, BL 2, left 1, left 2, TL 1, TL 2, top 1st half].
 */
const START_INDEX: Record<RingStart, number> = { top: 0, right: 4, bottom: 8, left: 12, 'top-left': 14 };

/**
 * The outline path of a w x h border box with these radii. Empty for an empty box. Radii are
 * clamped like CSS (for the box and again for the inset outline).
 */
export function ringPath(w: number, h: number, radii: Radii, opts: RingPathOptions = {}): string {
  const d = opts.inset ?? 0;
  const x0 = d;
  const y0 = d;
  const x1 = w - d;
  const y1 = h - d;
  if (!(w > 0 && h > 0) || x1 <= x0 || y1 <= y0) return '';
  const r = clampRadii(insetRadii(clampRadii(radii, w, h), d), x1 - x0, y1 - y0);

  // clockwise from the top side's middle: top (2nd half), TR, right, BR, bottom, BL, left, TL, top (1st half)
  const top = side('top', { x: x0 + r.tl.x, y: y0 }, { x: x1 - r.tr.x, y: y0 });
  const loop: Seg[] = [
    top[1],
    ...corner('tr', { x: x1 - r.tr.x, y: y0 + r.tr.y }, r.tr, -90),
    ...side('right', { x: x1, y: y0 + r.tr.y }, { x: x1, y: y1 - r.br.y }),
    ...corner('br', { x: x1 - r.br.x, y: y1 - r.br.y }, r.br, 0),
    ...side('bottom', { x: x1 - r.br.x, y: y1 }, { x: x0 + r.bl.x, y: y1 }),
    ...corner('bl', { x: x0 + r.bl.x, y: y1 - r.bl.y }, r.bl, 90),
    ...side('left', { x: x0, y: y1 - r.bl.y }, { x: x0, y: y0 + r.tl.y }),
    ...corner('tl', { x: x0 + r.tl.x, y: y0 + r.tl.y }, r.tl, 180),
    top[0],
  ];
  const i = START_INDEX[opts.start ?? 'top'] ?? 0;
  let segs = [...loop.slice(i), ...loop.slice(0, i)];
  const ccw = opts.direction === 'ccw';
  if (ccw) segs = segs.reverse().map((s) => ({ ...s, from: s.to, to: s.from }));

  // drop empty pieces, merge consecutive pieces of the same side / corner
  const merged: Seg[] = [];
  for (const s of segs) {
    if (same(s.from, s.to)) continue;
    const prev = merged[merged.length - 1];
    if (prev && prev.group === s.group && same(prev.to, s.from)) prev.to = s.to;
    else merged.push({ ...s });
  }
  if (!merged.length) return '';
  const start = merged[0].from;
  // the closing line is drawn by Z
  const last = merged[merged.length - 1];
  if (last.kind === 'L' && same(last.to, start) && merged.length > 1) merged.pop();

  const sweep = ccw ? 0 : 1;
  const parts = [`M${fmt(start.x)} ${fmt(start.y)}`];
  for (const s of merged) {
    parts.push(
      s.kind === 'L'
        ? `L${fmt(s.to.x)} ${fmt(s.to.y)}`
        : `A${fmt(s.rx)} ${fmt(s.ry)} 0 0 ${sweep} ${fmt(s.to.x)} ${fmt(s.to.y)}`,
    );
  }
  parts.push('Z');
  return parts.join(' ');
}

/** Where a ring's start sits on a w x h box (the outline point nearest to it starts the path). */
function startTarget(start: RingStart | undefined, w: number, h: number): { x: number; y: number } {
  switch (start) {
    case 'right':
      return { x: w, y: h / 2 };
    case 'bottom':
      return { x: w / 2, y: h };
    case 'left':
      return { x: 0, y: h / 2 };
    case 'top-left':
      return { x: 0, y: 0 };
    default:
      return { x: w / 2, y: 0 };
  }
}

/**
 * The outline of a shaped w x h border box (src/utils/shape-path.ts) for a ring or a border stroke:
 * the shape moved inward by `inset` (a true offset for cut / rounded corners: shapeInsetPath;
 * negative: the shape of the bigger box), starting at the outline point nearest to `start` and
 * running clockwise / counter-clockwise. Empty when nothing is left of the box or the shape is
 * none / unknown.
 */
export function shapeRingPath(kind: ShapeKind, w: number, h: number, options: ShapeOptions | undefined, opts: RingPathOptions = {}): string {
  const d = opts.inset ?? 0;
  let base;
  if (d >= 0) {
    const path = shapeInsetPath(kind, w, h, options, d);
    base = path ? parseOutline(path) : undefined;
  } else {
    const res = w - 2 * d > 0 && h - 2 * d > 0 ? shapePath(kind, w - 2 * d, h - 2 * d, options) : undefined;
    const o = res && parseOutline(res.d);
    base = o && translateOutline(o, d, d);
  }
  if (!base) return '';
  let o = restartOutline(base, startTarget(opts.start, w, h));
  if (opts.direction === 'ccw') o = reverseOutline(o);
  return outlinePath(o);
}
