import type { Pt } from '../contracts/path-model';
import { CUT_TOLERANCE_PX } from '../contracts/custom-shape';
import { clamp } from '../utils/shape-path';
import type { Sides } from './model';

/*
 * "Space for text" maths on an outline polyline (px, closed): the inscribed-rectangle solver that fills
 * a free path's `padding`, and the checks the previews run (W6: content cut; the outline crossing itself).
 */

export function inside(poly: Pt[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

export function distEdge(poly: Pt[], x: number, y: number): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy;
    const t = l2 ? clamp(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1) : 0;
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** The sample points around a rectangle's edge, every `step` px. */
function ring(r: Rect, step: number): Pt[] {
  const out: Pt[] = [];
  for (let x = r.left; x <= r.right + 0.01; x += step) out.push([x, r.top], [x, r.bottom]);
  for (let y = r.top; y <= r.bottom + 0.01; y += step) out.push([r.left, y], [r.right, y]);
  out.push([r.right, r.top], [r.right, r.bottom]);
  return out;
}

/** How far (px) the farthest sample of the rectangle's edge lies outside the outline; 0 = inside. */
export function cutBy(poly: Pt[], r: Rect): number {
  let worst = 0;
  for (const [x, y] of ring(r, 2)) if (!inside(poly, x, y)) worst = Math.max(worst, distEdge(poly, x, y));
  return worst < 1e-6 ? 0 : worst;
}

/** The content rectangle of a w x h box with this `padding`. */
export const textRect = (w: number, h: number, pad: Sides): Rect => ({ left: pad.left, top: pad.top, right: w - pad.right, bottom: h - pad.bottom });

/** W6: the text area sticks out of the outline by more than CUT_TOLERANCE_PX. */
export const isCut = (poly: Pt[], w: number, h: number, pad: Sides): boolean => {
  const r = textRect(w, h, pad);
  return r.right - r.left >= 1 && r.bottom - r.top >= 1 && cutBy(poly, r) > CUT_TOLERANCE_PX;
};

type Span = [number, number];

/** The x-intervals where the horizontal line at y is inside the outline. */
function spans(poly: Pt[], y: number): Span[] {
  const xs: number[] = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
  }
  xs.sort((a, b) => a - b);
  const out: Span[] = [];
  for (let k = 0; k + 1 < xs.length; k += 2) out.push([xs[k], xs[k + 1]]);
  return out;
}

const meet = (a: Span[], b: Span[]): Span[] => {
  const out: Span[] = [];
  for (const [a0, a1] of a) for (const [b0, b1] of b) if (Math.min(a1, b1) > Math.max(a0, b0)) out.push([Math.max(a0, b0), Math.min(a1, b1)]);
  return out;
};

/**
 * The inscribed rectangle of an outline as per-side insets (whole px): the largest-area rectangle inside, width counting double.
 * Rows are tested every pixel; sides without a feature stay 0.
 */
export function solveSpace(poly: Pt[], w: number, h: number): Sides {
  const rows = Math.ceil(h);
  const lines: Span[][] = [];
  for (let k = 0; k <= rows; k++) lines.push(spans(poly, k <= 0 ? 0.01 : Math.min(k, h) >= h ? h - 0.01 : k));
  let best = { score: 0, t: 0, b: rows, l: 0, r: w };
  for (let t = 0; t < rows; t++) {
    let f = lines[t];
    for (let b = t + 1; b <= rows && f.length; b++) {
      f = meet(f, lines[b]);
      for (const [x0, x1] of f) {
        const score = (x1 - x0) ** 2 * (b - t);
        if (score > best.score + 1e-9) best = { score, t, b, l: x0, r: x1 };
      }
    }
  }
  if (!best.score) return { top: 0, right: 0, bottom: 0, left: 0 };
  const up = (n: number): number => Math.max(0, Math.ceil(n - 1e-6));
  return { top: up(best.t), right: up(w - best.r), bottom: up(h - best.b), left: up(best.l) };
}

const cross = (o: Pt, a: Pt, b: Pt): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** The outline crosses itself (two non-adjacent pieces of the polyline intersect). */
export function selfCrosses(poly: Pt[]): boolean {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      const c = poly[j];
      const d = poly[(j + 1) % n];
      if (cross(a, b, c) * cross(a, b, d) < -1e-9 && cross(c, d, a) * cross(c, d, b) < -1e-9) return true;
    }
  }
  return false;
}
