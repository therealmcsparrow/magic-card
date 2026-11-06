import { cubicsToPath, Pt, toCubicSubpaths } from '../path/core';

// Geometry of SVG drawings: transform lists as matrices, shapes as path data, and a transformed outline.
// Maths on values the sanitisers have already cleaned; none of it decides what is safe to keep.

export const fmt = (n: number): string => String(+n.toFixed(3));
export const num = (v: string | null | undefined): number | undefined => {
  if (v === null || v === undefined || /%/.test(v)) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Affine matrix [a, b, c, d, e, f] (SVG order). */
export type Matrix = [number, number, number, number, number, number];
const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];
export const multiply = (m: Matrix, n: Matrix): Matrix => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
const isIdentity = (m: Matrix) => m.every((v, i) => Math.abs(v - IDENTITY[i]) < 1e-9);

export function parseTransform(t: string | null): Matrix {
  let m: Matrix = IDENTITY;
  if (!t) return m;
  for (const [, fn, args] of t.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (a.some((n) => !Number.isFinite(n))) continue;
    let n: Matrix = IDENTITY;
    switch (fn) {
      case 'matrix':
        if (a.length === 6) n = a as Matrix;
        break;
      case 'translate':
        n = [1, 0, 0, 1, a[0] ?? 0, a[1] ?? 0];
        break;
      case 'scale':
        n = [a[0] ?? 1, 0, 0, a[1] ?? a[0] ?? 1, 0, 0];
        break;
      case 'rotate': {
        const r = ((a[0] ?? 0) * Math.PI) / 180;
        const [cx, cy] = [a[1] ?? 0, a[2] ?? 0];
        const rot: Matrix = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
        n = multiply(multiply([1, 0, 0, 1, cx, cy], rot), [1, 0, 0, 1, -cx, -cy]);
        break;
      }
      case 'skewX':
        n = [1, 0, Math.tan(((a[0] ?? 0) * Math.PI) / 180), 1, 0, 0];
        break;
      case 'skewY':
        n = [1, Math.tan(((a[0] ?? 0) * Math.PI) / 180), 0, 1, 0, 0];
        break;
    }
    m = multiply(m, n);
  }
  return m;
}

export function transformPath(d: string, m: Matrix): string {
  if (isIdentity(m)) return d;
  const apply = (p: Pt): Pt => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  return cubicsToPath(toCubicSubpaths(d).map((sub) => sub.map((c) => c.map(apply) as typeof c)));
}

function points(v: string | null): number[][] {
  const n = (v ?? '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const out: number[][] = [];
  for (let i = 0; i + 1 < n.length; i += 2) if (Number.isFinite(n[i]) && Number.isFinite(n[i + 1])) out.push([n[i], n[i + 1]]);
  return out;
}

export function shapePath(el: Element, name: string): string | undefined {
  const a = (k: string) => num(el.getAttribute(k));
  switch (name) {
    case 'path': {
      const d = el.getAttribute('d')?.trim();
      return d || undefined;
    }
    case 'circle':
    case 'ellipse': {
      const cx = a('cx') ?? 0;
      const cy = a('cy') ?? 0;
      const rx = name === 'circle' ? a('r') : a('rx') ?? a('ry');
      const ry = name === 'circle' ? rx : a('ry') ?? a('rx');
      if (!rx || !ry || rx <= 0 || ry <= 0) return undefined;
      const arc = `A${fmt(rx)} ${fmt(ry)} 0 1 0`;
      return `M${fmt(cx - rx)} ${fmt(cy)}${arc} ${fmt(cx + rx)} ${fmt(cy)}${arc} ${fmt(cx - rx)} ${fmt(cy)}Z`;
    }
    case 'rect': {
      const x = a('x') ?? 0;
      const y = a('y') ?? 0;
      const w = a('width');
      const h = a('height');
      if (!w || !h || w <= 0 || h <= 0) return undefined;
      let rx = a('rx') ?? a('ry') ?? 0;
      let ry = a('ry') ?? a('rx') ?? 0;
      rx = Math.min(Math.max(rx, 0), w / 2);
      ry = Math.min(Math.max(ry, 0), h / 2);
      if (!rx || !ry) return `M${fmt(x)} ${fmt(y)}H${fmt(x + w)}V${fmt(y + h)}H${fmt(x)}Z`;
      const arc = `A${fmt(rx)} ${fmt(ry)} 0 0 1`;
      return `M${fmt(x + rx)} ${fmt(y)}H${fmt(x + w - rx)}${arc} ${fmt(x + w)} ${fmt(y + ry)}V${fmt(y + h - ry)}${arc} ${fmt(x + w - rx)} ${fmt(y + h)}H${fmt(x + rx)}${arc} ${fmt(x)} ${fmt(y + h - ry)}V${fmt(y + ry)}${arc} ${fmt(x + rx)} ${fmt(y)}Z`;
    }
    case 'line':
      return `M${fmt(a('x1') ?? 0)} ${fmt(a('y1') ?? 0)}L${fmt(a('x2') ?? 0)} ${fmt(a('y2') ?? 0)}`;
    case 'polyline':
    case 'polygon': {
      const p = points(el.getAttribute('points'));
      if (p.length < 2) return undefined;
      return `M${p.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L')}${name === 'polygon' ? 'Z' : ''}`;
    }
  }
  return undefined;
}
