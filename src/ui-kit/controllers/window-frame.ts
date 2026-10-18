/*
 * Placement maths of <mc-ui-window> (contract ui-kit r3): the rectangle rules for drag, resize, dock, width steps and
 * maximise. Pure functions, so the window element only wires events.
 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MIN_W = 320;
export const MIN_H = 240;
/** Gap to the viewport edge for the maximum size and the docks. */
export const MARGIN = 16;
/** At least this much of the header stays on screen. */
const KEEP = 48;
/** Keyboard step, and with Shift. */
export const STEP = 16;
export const STEP_BIG = 64;
/** A pointer release within this distance of its press is a click, not a drag (WCAG 2.5.7). */
export const CLICK_PX = 4;
/** Widths of size s, m, l, xl: the click-to-step ladder of the resize grip. */
export const WIDTHS = [420, 480, 640, 880];

export type Dock = 'centre' | 'end' | 'start';

export function clampRect(r: Rect, vw: number, vh: number): Rect {
  const w = Math.min(Math.max(r.w, MIN_W), vw - 2 * MARGIN);
  const h = Math.min(Math.max(r.h, MIN_H), vh - 2 * MARGIN);
  return { w, h, x: Math.min(Math.max(r.x, KEEP - w), vw - KEEP), y: Math.min(Math.max(r.y, 0), vh - KEEP) };
}

export const maximisedRect = (vw: number, vh: number): Rect => ({ x: MARGIN, y: MARGIN, w: vw - 2 * MARGIN, h: vh - 2 * MARGIN });

export const centred = (r: Rect, vw: number, vh: number): Rect => ({ ...r, x: (vw - r.w) / 2, y: (vh - r.h) / 2 });

/** Docks the window to the centre, the inline-end edge or the inline-start edge, keeping its size (and its height position at the edges). */
export function dockRect(r: Rect, to: Dock, rtl: boolean, vw: number, vh: number): Rect {
  if (to === 'centre') return centred(r, vw, vh);
  const right = (to === 'end') !== rtl;
  return { ...r, x: right ? vw - r.w - MARGIN : MARGIN };
}

/** The next width on the s, m, l, xl ladder, wrapping to s; never wider than the viewport allows. */
export function stepWidth(r: Rect, vw: number): Rect {
  const next = WIDTHS.find((n) => n > r.w + 1) ?? WIDTHS[0];
  return { ...r, w: Math.min(next, vw - 2 * MARGIN) };
}

/** Arrow keys: [dx, dy] in px, or null. Left/right follow the reading direction for the resize grip. */
export function arrowDelta(key: string, shift: boolean): [number, number] | null {
  const n = shift ? STEP_BIG : STEP;
  switch (key) {
    case 'ArrowLeft':
      return [-n, 0];
    case 'ArrowRight':
      return [n, 0];
    case 'ArrowUp':
      return [0, -n];
    case 'ArrowDown':
      return [0, n];
    default:
      return null;
  }
}

/** Interactive controls inside the header that must not start a drag. */
export const NO_DRAG = 'button, input, select, textarea, a, [role="button"]';
