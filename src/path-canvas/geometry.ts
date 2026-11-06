import type { Box, EditPath, Pt } from '../contracts/path-model';
import type { MessageIndex } from '../contracts/i18n';
import { locale, m, t } from './i18n';
import { HIT_MIN_COARSE, HIT_MIN_FINE, LOUPE_OFFSET_PX, LOUPE_SIZE_PX, SEGMENT_BAND_COARSE, SEGMENT_BAND_FINE, type SnapConfig } from '../contracts/path-canvas';

// Pure maths of the path canvas: the view, hit sizes, snapping, keyboard steps, the touch loupe place and the texts it reads out.

/** zoom = CSS px per frame unit across (and down, unless `zy` says otherwise); (x, y) = where frame coordinate 0, 0 sits in the canvas (CSS px). */
export interface View {
  zoom: number;
  /** CSS px per frame unit down, when it differs from `zoom` (overlay mode on a box that is not square). */
  zy?: number;
  x: number;
  y: number;
}

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 400;

export const clampZoom = (z: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
export const toScreen = (v: View, p: Pt): Pt => [v.x + p[0] * v.zoom, v.y + p[1] * (v.zy ?? v.zoom)];
export const toFrame = (v: View, s: Pt): Pt => [(s[0] - v.x) / v.zoom, (s[1] - v.y) / (v.zy ?? v.zoom)];

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
  /** Safe-area inset in frame units (used with snap.safeArea). */
  safeArea?: number;
}

/** A line a drag can hold on to; the label is drawn next to its guide. */
export interface Line {
  v: number;
  label: MessageIndex;
}

export interface Snapped {
  pt: Pt;
  /** Lines the point snapped to (not the grid): drawn as a 1 px guide with their label. */
  guides: { x?: Line; y?: Line };
}

/** Snap targets on one axis (0 = x, 1 = y): safe area first, so it wins a tie. */
export function snapLines(c: Pick<SnapContext, 'snap' | 'frame' | 'safeArea'>, axis: 0 | 1, others: readonly Pt[] = []): Line[] {
  const s = c.snap;
  const o = axis ? c.frame.y : c.frame.x;
  const n = axis ? c.frame.h : c.frame.w;
  const sa = s.safeArea ? (c.safeArea ?? 0) : 0;
  const out: Line[] = [];
  const add = (v: number, label: MessageIndex): number => out.push({ v, label });
  if (sa > 0) {
    add(o + sa, m('path-canvas.geometry.safe-area-edge'));
    add(o + n - sa, m('path-canvas.geometry.safe-area-edge'));
  }
  if (s.frame) {
    add(o, m('path-canvas.geometry.edge'));
    add(o + n, m('path-canvas.geometry.edge'));
  }
  if (s.frame || sa > 0) add(o + n / 2, m('path-canvas.geometry.centre'));
  for (const v of (axis ? s.extra?.y : s.extra?.x) ?? []) add(v, m('path-canvas.geometry.edge'));
  for (const p of others) add(p[axis], m('path-canvas.geometry.edge'));
  return out;
}

/**
 * Snap one or more moving edges: the smallest shift that puts any of `vals` on a line within `reach`,
 * else the grid for the first value.
 */
export function snapEdges(vals: number[], lines: Line[], grid: number, reach: number): { d: number; line?: Line } {
  let bd = reach + 1e-9;
  let best: { d: number; line: Line } | undefined;
  for (const l of lines)
    for (const v of vals) {
      const d = l.v - v;
      if (Math.abs(d) < bd) {
        bd = Math.abs(d);
        best = { d, line: l };
      }
    }
  return best ?? { d: grid > 0 ? clean(Math.round(vals[0] / grid) * grid) - vals[0] : 0 };
}

/** Snap a dragged point: lines (anchors, frame, host lines, safe area) within reach win, else the grid. */
export function snapPoint(p: Pt, c: SnapContext): Snapped {
  if (!c.snap.enabled) return { pt: p, guides: {} };
  const x = snapEdges([p[0]], snapLines(c, 0, c.snap.anchors ? c.others : []), c.snap.grid, c.reach);
  const y = snapEdges([p[1]], snapLines(c, 1, c.snap.anchors ? c.others : []), c.snap.grid, c.reach);
  return { pt: [clean(p[0] + x.d), clean(p[1] + y.d)], guides: { x: x.line, y: y.line } };
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

/** Default keyboard steps by frame size. */
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

const formats: Record<string, Intl.NumberFormat> = {};
/** A coordinate or size rounded to two decimals, with the decimal separator of the active language (the messages take it as text). */
const shown = (v: number): number => Math.round(v * 100) / 100 || 0;
export const rnd = (v: number): string => (formats[locale()] ||= new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 })).format(shown(v));

export function kindWord(a: EditPath['anchors'][number], smooth: boolean): string {
  const k = a.kind ?? (smooth ? 'smooth' : 'corner');
  return k === 'smooth' ? t('path-canvas.geometry.smooth') : k === 'symmetric' ? t('path-canvas.geometry.symmetric') : t('path-canvas.geometry.corner');
}

/** An angle in degrees, said in the language. */
export const degrees = (v: number): string => t('path-canvas.geometry.n-degrees', { n: shown(v) });
