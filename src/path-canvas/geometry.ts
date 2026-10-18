import type { Box, EditPath, Pt } from '../contracts/path-model';
import { HIT_MIN_COARSE, HIT_MIN_FINE, LOUPE_OFFSET_PX, LOUPE_SIZE_PX, SEGMENT_BAND_COARSE, SEGMENT_BAND_FINE, type SnapConfig } from '../contracts/path-canvas';

/*
 * Pure maths of the path canvas: the view (frame units <-> CSS px), hit sizes, snapping, keyboard
 * steps, the touch loupe's place and the texts the canvas reads out. No DOM, no lit.
 */

/** zoom = CSS px per frame unit; (x, y) = where frame coordinate 0, 0 sits in the canvas (CSS px). */
export interface View {
  zoom: number;
  x: number;
  y: number;
}

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 400;

export const clampZoom = (z: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
export const toScreen = (v: View, p: Pt): Pt => [v.x + p[0] * v.zoom, v.y + p[1] * v.zoom];
export const toFrame = (v: View, s: Pt): Pt => [(s[0] - v.x) / v.zoom, (s[1] - v.y) / v.zoom];

/** Zoom to `zoom`, the frame point under the screen point `at` stays where it is. */
export function zoomAt(v: View, zoom: number, at: Pt): View {
  const z = clampZoom(zoom);
  const f = toFrame(v, at);
  return { zoom: z, x: at[0] - f[0] * z, y: at[1] - f[1] * z };
}

/** The view that shows `frame` whole, centred, with `margin` CSS px around it. */
export function fitView(frame: Box, w: number, h: number, margin = 24): View {
  const zoom = clampZoom(Math.min((w - margin * 2) / frame.w, (h - margin * 2) / frame.h));
  return { zoom, x: (w - frame.w * zoom) / 2 - frame.x * zoom, y: (h - frame.h * zoom) / 2 - frame.y * zoom };
}

/** Half the side of a point's hit target, and the half width of a segment's hit band, in CSS px. */
export const hitHalf = (coarse: boolean): number => (coarse ? HIT_MIN_COARSE : HIT_MIN_FINE) / 2;
export const bandHalf = (coarse: boolean): number => (coarse ? SEGMENT_BAND_COARSE : SEGMENT_BAND_FINE) / 2;

/** Is `p` inside the square target of side 2 * half around `c`? (Chebyshev distance.) */
export const inTarget = (c: Pt, p: Pt, half: number): boolean => Math.abs(c[0] - p[0]) <= half && Math.abs(c[1] - p[1]) <= half;

export const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Round away float noise from stepping (4 decimals). */
export const clean = (v: number): number => Math.round(v * 1e4) / 1e4;

/** Even-odd point-in-polygon. */
export function insidePolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

// ── snapping ──

export interface SnapContext {
  snap: SnapConfig;
  frame: Box;
  /** Other anchors in frame units (never the dragged one). */
  others: Pt[];
  /** Snap reach in frame units (about 6 CSS px). */
  reach: number;
}

export interface Snapped {
  pt: Pt;
  /** Lines the point snapped to (not the grid): drawn as a 1 px guide. */
  guides: { x?: number; y?: number };
}

function snapAxis(v: number, lines: number[], grid: number, reach: number): { v: number; line: boolean } {
  let best: number | undefined;
  let bd = reach;
  for (const l of lines) {
    const d = Math.abs(l - v);
    if (d <= bd) {
      bd = d;
      best = l;
    }
  }
  if (best !== undefined) return { v: best, line: true };
  return { v: grid > 0 ? clean(Math.round(v / grid) * grid) : v, line: false };
}

/** Snap a dragged point: lines (anchors, frame, host lines) within reach win, else the grid. */
export function snapPoint(p: Pt, c: SnapContext): Snapped {
  const s = c.snap;
  if (!s.enabled) return { pt: p, guides: {} };
  const xs: number[] = [...(s.extra?.x ?? [])];
  const ys: number[] = [...(s.extra?.y ?? [])];
  if (s.frame) {
    xs.push(c.frame.x, c.frame.x + c.frame.w / 2, c.frame.x + c.frame.w);
    ys.push(c.frame.y, c.frame.y + c.frame.h / 2, c.frame.y + c.frame.h);
  }
  if (s.anchors) {
    for (const o of c.others) {
      xs.push(o[0]);
      ys.push(o[1]);
    }
  }
  const x = snapAxis(p[0], xs, s.grid, c.reach);
  const y = snapAxis(p[1], ys, s.grid, c.reach);
  return { pt: [x.v, y.v], guides: { x: x.line ? x.v : undefined, y: y.line ? y.v : undefined } };
}

/** Handle angle: when within `tol` degrees of a multiple of `step`, the same length at that angle. */
export function snapAngle(origin: Pt, p: Pt, step = 15, tol = 4): Pt | undefined {
  const dx = p[0] - origin[0];
  const dy = p[1] - origin[1];
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return undefined;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const near = Math.round(deg / step) * step;
  if (Math.abs(near - deg) > tol) return undefined;
  const r = (near * Math.PI) / 180;
  return [clean(origin[0] + Math.cos(r) * len), clean(origin[1] + Math.sin(r) * len)];
}

/** One keyboard step along an axis. Snapped: on to the next multiple of the step. Fine: plain add. */
export function stepValue(v: number, delta: number, snapped: boolean): number {
  if (!snapped || delta === 0) return clean(v + delta);
  const step = Math.abs(delta);
  const q = v / step;
  const next = delta > 0 ? Math.floor(q + 1e-6) + 1 : Math.ceil(q - 1e-6) - 1;
  return clean(next * step);
}

/** Default keyboard steps by frame size (design 03 section 5). */
export function defaultSteps(frame: Box): { nudge: number; bigNudge: number; fineNudge: number } {
  const small = frame.w <= 24 && frame.h <= 24;
  return { nudge: small ? 0.5 : 1, bigNudge: small ? 4 : 10, fineNudge: 0.1 };
}

// ── touch loupe ──

/** Centre of the loupe (CSS px in the canvas): above the contact point, to the side near the top edge, never below. */
export function loupeCentre(contact: Pt, w: number): Pt {
  const r = LOUPE_SIZE_PX / 2;
  const clampX = (x: number): number => Math.min(Math.max(x, r), Math.max(r, w - r));
  if (contact[1] - LOUPE_OFFSET_PX - r >= 0) return [clampX(contact[0]), contact[1] - LOUPE_OFFSET_PX];
  const right = contact[0] + LOUPE_OFFSET_PX + r <= w;
  const left = contact[0] - LOUPE_OFFSET_PX - r >= 0;
  const x = right || !left ? contact[0] + LOUPE_OFFSET_PX : contact[0] - LOUPE_OFFSET_PX;
  return [clampX(x), Math.max(r, contact[1])];
}

// ── words ──

export const num = (v: number): string => String(Math.round(v * 100) / 100 || 0);

export function kindWord(a: EditPath['anchors'][number], smooth: boolean): string {
  return a.kind ?? (smooth ? 'smooth' : 'corner');
}

export const pointsWord = (n: number): string => `${n} ${n === 1 ? 'point' : 'points'}`;
