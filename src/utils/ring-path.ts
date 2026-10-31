import type { RingStart, ShapeKind, ShapeOptions } from '../types';
import { shapeInsetPath, shapePath } from './shape-path';
import { parseClosed, restartAt, reverse, toPathString, translate } from '../path/core';

/*
 * Computed border radii (per corner, elliptical, %) read from an element, clamped like CSS and optionally inset (the ring
 * sits inside / on / outside the border edge), and the outline of a shaped box as an SVG path that starts at a chosen point
 * and runs clockwise or counter-clockwise, so a dash with pathLength="100" fills from there in percent. The rounded
 * rectangle's own path is src/utils/ring-outline.ts.
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

/**
 * Index in the clockwise loop where each start position begins: [top 2nd half, TR 1, TR 2,
 * right 1, right 2, BR 1, BR 2, bottom 1, bottom 2, BL 1, BL 2, left 1, left 2, TL 1, TL 2, top 1st half].
 */
/** Every ring start, clockwise from the top: eighth turn i begins at loop index 2 * i. */
export const RING_STARTS: RingStart[] = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];

/**
 * The outline of a shaped w x h border box for a ring or border stroke: the shape moved inward by
 * `inset` (negative: the bigger box), starting nearest to `start`, clockwise or not. Empty when
 * nothing is left or the shape is none / unknown.
 */
export function shapeRingPath(kind: ShapeKind, w: number, h: number, options: ShapeOptions | undefined, opts: RingPathOptions = {}): string {
  const d = opts.inset ?? 0;
  let base;
  if (d >= 0) {
    const path = shapeInsetPath(kind, w, h, options, d);
    base = path ? parseClosed(path) : undefined;
  } else {
    const res = w - 2 * d > 0 && h - 2 * d > 0 ? shapePath(kind, w - 2 * d, h - 2 * d, options) : undefined;
    const o = res && parseClosed(res.d);
    base = o && translate(o, d, d);
  }
  if (!base) return '';
  // the start's point on the box: the eighth turn i is at angle i * 45deg clockwise from the top
  const a = (Math.max(0, RING_STARTS.indexOf(opts.start ?? 'top')) * Math.PI) / 4;
  let o = restartAt(base, [(w * (1 + Math.round(Math.sin(a)))) / 2, (h * (1 - Math.round(Math.cos(a)))) / 2]);
  if (opts.direction === 'ccw') o = reverse(o);
  return toPathString([o]);
}
