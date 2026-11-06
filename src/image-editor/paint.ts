import type { Part } from './part';
import type { TextData } from './text';

// Paints of an image layer beyond Main, Accent and None (hex or theme colour, gradient, opacity, dashes), kept in `look`.

export const MAIN = 'var(--mc-image-main)';
export const ACCENT = 'var(--mc-image-accent)';
export const MAX_STOPS = 8;
export const MAX_DASHES = 8;

export interface Stop {
  /** Position on the gradient line, 0..1. */
  o: number;
  /** Main, Accent or a colour (see solidOf). */
  c: string;
  /** Stop opacity, 0..1 (absent = 1). */
  a?: number;
}

/** linear: p = [x1, y1, x2, y2]; radial: p = [cx, cy, r]. Fractions of the layer's box; r is a fraction of its longer side. */
export interface Grad {
  t: 'linear' | 'radial';
  s: Stop[];
  p: number[];
}

export type Rich = string | Grad;

export interface Look {
  fill?: Rich;
  stroke?: Rich;
  /** Layer opacity, 0..100 (absent = 100). */
  opacity?: number;
  dash?: number[];
  offset?: number;
  /** A text layer: its words and type (see text.ts). */
  text?: TextData;
  /** An imported part: a locked layer that keeps its own markup (see part.ts). */
  part?: Part;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Painted {
  fill: 'none' | 'main' | 'accent';
  stroke: 'none' | 'main' | 'accent';
  width: number;
  look?: Look;
}

const r2 = (n: number): number => Math.round(n * 100) / 100 || 0;
const r3 = (n: number): number => Math.round(n * 1000) / 1000 || 0;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

// ── colour values ──

const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FN_RE = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([-+\d.,%\s/a-z]*\)$/i;
const THEME_RE = /^var\(\s*(--[a-z0-9][a-z0-9-]{0,63})\s*\)$/;

/** The name of a theme variable written as var(--name), or undefined. Main and Accent are not theme colours. */
export function themeOf(v: string): string | undefined {
  const m = THEME_RE.exec(v);
  return m && !m[1].startsWith('--mc-image-') ? m[1] : undefined;
}

/** A colour the editor writes: hex (3, 4, 6 or 8 digits), a colour function, or a theme variable; else undefined. */
export function solidOf(raw: string): string | undefined {
  const v = raw.trim();
  if (v.length > 100) return undefined;
  if (HEX_RE.test(v)) return v.toLowerCase();
  const th = themeOf(v);
  if (th) return `var(${th})`;
  return FN_RE.test(v) ? v : undefined;
}

const TONE_RE = /^var\(\s*--mc-image-(main|accent)\s*\)$/;

/** 'main' or 'accent' for the layer's own variables (spaces allowed), else undefined. */
export const toneOf = (raw: string): 'main' | 'accent' | undefined => (TONE_RE.exec(raw.trim())?.[1] as 'main' | 'accent' | undefined);

/** A gradient stop colour: Main, Accent or a solid colour. */
export const stopOf = (raw: string): string | undefined => {
  const t = toneOf(raw);
  return t ? (t === 'main' ? MAIN : ACCENT) : solidOf(raw);
};

/** A paint value as the editor canvas draws it (Main and Accent are the editor's own variables). */
export const cssOf = (v: string): string => (v === MAIN ? 'var(--m)' : v === ACCENT ? 'var(--a)' : v);

// ── gradient geometry ──

/** The two points of a linear gradient at an angle (degrees, 0 = left to right, 90 = top to bottom) across a w x h box, as fractions. */
export function linearPts(deg: number, w: number, h: number): [number, number, number, number] {
  const a = (deg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
  const fx = w > 0 ? (half * dx) / w : 0;
  const fy = h > 0 ? (half * dy) / h : 0;
  return [r3(0.5 - fx), r3(0.5 - fy), r3(0.5 + fx), r3(0.5 + fy)];
}

/** The angle of a linear gradient's points in a w x h box, 0 to 360 degrees. */
export function angleOf(p: readonly number[], w: number, h: number): number {
  const deg = (Math.atan2((p[3] - p[1]) * h, (p[2] - p[0]) * w) * 180) / Math.PI;
  return Math.round(((deg + 360) % 360) * 10) / 10;
}

const side = (b: Box): number => Math.max(b.w, b.h) || 1;

/** Where a handle sits in drawing units: 'a' (start, or centre), 'b' (end, or the edge of the radius) or a stop's index. */
export function handleAt(g: Grad, b: Box, h: 'a' | 'b' | number): [number, number] {
  const lin = g.t === 'linear';
  const a: [number, number] = [b.x + g.p[0] * b.w, b.y + g.p[1] * b.h];
  const e: [number, number] = lin ? [b.x + g.p[2] * b.w, b.y + g.p[3] * b.h] : [a[0] + g.p[2] * side(b), a[1]];
  if (h === 'a') return a;
  if (h === 'b') return e;
  const o = g.s[h]?.o ?? 0;
  return [a[0] + o * (e[0] - a[0]), a[1] + o * (e[1] - a[1])];
}

/** The gradient with a handle moved to a point in drawing units. */
export function dragHandle(g: Grad, b: Box, h: 'a' | 'b' | number, to: readonly [number, number]): Grad {
  const fx = b.w > 0 ? r3((to[0] - b.x) / b.w) : 0;
  const fy = b.h > 0 ? r3((to[1] - b.y) / b.h) : 0;
  const p = g.p.slice();
  if (typeof h === 'number') {
    const a = handleAt(g, b, 'a');
    const e = handleAt(g, b, 'b');
    const vx = e[0] - a[0];
    const vy = e[1] - a[1];
    const len = vx * vx + vy * vy;
    const o = len > 0 ? clamp(((to[0] - a[0]) * vx + (to[1] - a[1]) * vy) / len, 0, 1) : 0;
    return { ...g, s: g.s.map((s, i) => (i === h ? { ...s, o: r3(o) } : s)) };
  }
  if (h === 'a') [p[0], p[1]] = [fx, fy];
  else if (g.t === 'linear') [p[2], p[3]] = [fx, fy];
  else {
    const c = handleAt(g, b, 'a');
    p[2] = Math.max(0.01, r3(Math.hypot(to[0] - c[0], to[1] - c[1]) / side(b)));
  }
  return { ...g, p };
}

// ── dashes ──

/** A dash list typed as numbers separated by spaces or commas: [] for empty (solid), 'bad' when it cannot be used. */
export function parseDash(text: string): number[] | 'bad' {
  const t = text.trim();
  if (!t) return [];
  const parts = t.split(/[\s,]+/);
  if (parts.length > MAX_DASHES || !parts.every((x) => /^\d+(?:\.\d+)?$/.test(x))) return 'bad';
  const n = parts.map(Number);
  return n.every((x) => Number.isFinite(x) && x <= 100000) && n.some((x) => x > 0) ? n : 'bad';
}

export const dashText = (d: readonly number[]): string => d.join(' ');

// ── markup out ──

const sorted = (g: Grad): Stop[] => g.s.slice().sort((p, q) => p.o - q.o);

/** The numbers of a gradient in drawing units for a layer with this box: [x1, y1, x2, y2] or [cx, cy, r]. */
export function gradGeo(g: Grad, b: Box): number[] {
  const at = (i: number): number => r2(i % 2 ? b.y + g.p[i] * b.h : b.x + g.p[i] * b.w);
  return g.t === 'linear' ? [at(0), at(1), at(2), at(3)] : [at(0), at(1), r2(g.p[2] * side(b))];
}

/** The stops of a gradient in offset order. */
export const stopsOf = sorted;

/** One gradient as a definition in drawing units for a layer with this box. */
export function gradientDef(g: Grad, id: string, b: Box): string {
  const n = gradGeo(g, b);
  const geo = g.t === 'linear' ? `x1="${n[0]}" y1="${n[1]}" x2="${n[2]}" y2="${n[3]}"` : `cx="${n[0]}" cy="${n[1]}" r="${n[2]}"`;
  const tag = g.t === 'linear' ? 'linearGradient' : 'radialGradient';
  const stops = sorted(g)
    .map((s) => `<stop offset="${r3(s.o)}" stop-color="${s.c}"${s.a !== undefined && s.a < 1 ? ` stop-opacity="${r3(s.a)}"` : ''}/>`)
    .join('');
  return `<${tag} id="${id}" gradientUnits="userSpaceOnUse" ${geo}>${stops}</${tag}>`;
}

/** The paint a layer has: its look, else Main, Accent or none. */
export const paintOf = (s: Painted, k: 'fill' | 'stroke'): Rich | 'none' => (s[k] === 'none' ? 'none' : (s.look?.[k] ?? (s[k] === 'main' ? MAIN : ACCENT)));

/** True when the layer draws an outline. */
export const stroked = (s: Painted): boolean => s.stroke !== 'none' && s.width > 0;

/**
 * Attributes of one layer's paint: fill, stroke with its width, opacity and dashes. A gradient adds its definition to `defs`
 * under the id `id()` gives; `box()` is asked only when a gradient needs it, and a gradient on a layer with no box (nothing to
 * place it on) is written as its first colour.
 */
export function layerPaint(s: Painted, box: () => Box | undefined, defs: string[], id: () => string): string {
  const value = (v: Rich | 'none'): string => {
    if (typeof v === 'string') return v;
    const b = box();
    if (!b) return sorted(v)[0].c;
    const n = id();
    defs.push(gradientDef(v, n, b));
    return `url(#${n})`;
  };
  const on = stroked(s);
  const l = s.look;
  return (
    ` fill="${value(paintOf(s, 'fill'))}"` +
    (on ? ` stroke="${value(paintOf(s, 'stroke'))}" stroke-width="${r2(s.width)}"` : '') +
    (l?.opacity !== undefined && l.opacity < 100 ? ` opacity="${r3(l.opacity / 100)}"` : '') +
    (on && l?.dash?.length ? ` stroke-dasharray="${dashText(l.dash)}"${l.offset ? ` stroke-dashoffset="${r2(l.offset)}"` : ''}` : '')
  );
}

// ── markup in ──

/** Collects what could not be kept; the caller then opens the image view-only. */
export interface Flag {
  v: boolean;
}

const num = (el: Element, k: string, d: number, f: Flag, plain: boolean): number => {
  const raw = el.getAttribute(k)?.trim();
  if (raw === undefined || raw === '') return d;
  const pct = /^[-+]?\d*\.?\d+%$/.test(raw);
  if (plain && pct) f.v = true;
  const n = pct ? parseFloat(raw) / 100 : /^[-+]?\d*\.?\d+(?:e[-+]?\d+)?$/i.test(raw) ? parseFloat(raw) : NaN;
  if (!Number.isFinite(n)) f.v = true;
  return Number.isFinite(n) ? n : d;
};

/** A gradient element as the editor's gradient in this box; `f.v` is set when something in it cannot be kept. */
export function readGradient(el: Element, b: Box, f: Flag): Grad | undefined {
  const lin = el.localName === 'linearGradient';
  const user = el.getAttribute('gradientUnits') === 'userSpaceOnUse';
  const same = Math.abs(b.w - b.h) <= Math.max(b.w, b.h) * 0.01;
  if (el.hasAttribute('gradientTransform') || (el.getAttribute('spreadMethod') ?? 'pad') !== 'pad') f.v = true;
  const stops: Stop[] = [];
  for (const st of el.children) {
    if (st.localName !== 'stop') continue;
    const c = stopOf(st.getAttribute('stop-color')?.trim() ?? '#000000');
    const a = num(st, 'stop-opacity', 1, f, false);
    if (!c) f.v = true;
    stops.push({ o: clamp(num(st, 'offset', 0, f, false), 0, 1), c: c ?? '#000000', ...(a < 1 ? { a } : {}) });
  }
  if (stops.length < 2 || stops.length > MAX_STOPS) f.v = true;
  const read = (k: string, d: number): number => num(el, k, d, f, user);
  if (lin) {
    const q = [read('x1', 0), read('y1', 0), read('x2', user ? 0 : 1), read('y2', 0)];
    if (user) {
      const p = [b.w > 0 ? (q[0] - b.x) / b.w : 0, b.h > 0 ? (q[1] - b.y) / b.h : 0, b.w > 0 ? (q[2] - b.x) / b.w : 0, b.h > 0 ? (q[3] - b.y) / b.h : 0];
      return { t: 'linear', s: stops, p: p.map(r3) };
    }
    if (q[0] !== q[2] && q[1] !== q[3] && !same) f.v = true;
    return { t: 'linear', s: stops, p: q.map(r3) };
  }
  const cx = read('cx', user ? 0 : 0.5);
  const cy = read('cy', user ? 0 : 0.5);
  const r = read('r', user ? 0 : 0.5);
  const fx = el.hasAttribute('fx') ? read('fx', cx) : cx;
  const fy = el.hasAttribute('fy') ? read('fy', cy) : cy;
  if (fx !== cx || fy !== cy || read('fr', 0) !== 0) f.v = true;
  if (user) return { t: 'radial', s: stops, p: [b.w > 0 ? (cx - b.x) / b.w : 0, b.h > 0 ? (cy - b.y) / b.h : 0, r / side(b)].map(r3) };
  if (!same) f.v = true;
  return { t: 'radial', s: stops, p: [cx, cy, r].map(r3) };
}

/** A paint value that is not none, Main or Accent: its colour or gradient, or undefined with `f.v` set. */
export function readPaint(v: string, doc: Document | undefined, b: Box, f: Flag): Rich | undefined {
  const url = /^url\(#([^)]+)\)$/.exec(v);
  if (url) {
    const el = doc?.getElementById(url[1]);
    if (el && /^(?:linear|radial)Gradient$/.test(el.localName)) return readGradient(el, b, f);
    f.v = true;
    return undefined;
  }
  const c = solidOf(v);
  if (!c) f.v = true;
  return c;
}
