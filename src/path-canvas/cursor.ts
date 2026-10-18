import type { CanvasMode } from '../contracts/path-canvas';

/*
 * Which mouse cursor the surface shows (pure, no DOM). One answer per hit target, so the pointer always
 * tells what a press would do. '' means "set nothing": the host decides (draw tools, knife, hand).
 */

const ARROW = "%3Cpath d='M18.5 12a6.5 6.5 0 1 1-2-4.7M18.5 4v4h-4' fill='none' stroke-linecap='round' stroke-linejoin='round'";
/** A turning arrow, 24 px, white halo under a dark stroke so it reads on any ground. `grab` where data URIs are blocked. */
export const ROTATE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E${ARROW} stroke='%23fff' stroke-width='4'/%3E${ARROW} stroke='%23111' stroke-width='2'/%3E%3C/svg%3E") 12 12, grab`;

const RESIZE = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'] as const;

/** The resize cursor for handle side (sx, sy) of a box turned by `angle` degrees: the nearest of the four. */
export function resizeCursor(sx: number, sy: number, angle = 0): string {
  const a = (((Math.atan2(sy, sx) * 180) / Math.PI + angle) % 180 + 180) % 180;
  return RESIZE[Math.round(a / 45) % 4];
}

export interface CursorCtx {
  mode: CanvasMode;
  /** What is under the pointer (or what the running drag started on). */
  hit: { t: string; sx?: number; sy?: number };
  /** The kind of the running drag, if any. */
  drag?: string;
  /** Space is held. */
  space: boolean;
  /** A pan drag is running. */
  panning: boolean;
  /** The host owns the cursor (select mode without the host's own tools). */
  delegated: boolean;
  /** Rotation of the box in degrees (handles turn with it). */
  angle?: number;
}

export function cursorFor(c: CursorCtx): string {
  if (c.panning) return 'grabbing';
  if (c.space) return 'grab';
  if (c.mode === 'view') return 'default';
  if (c.delegated) return '';
  if (c.mode === 'add') return 'crosshair';
  const k = c.drag ?? '';
  const t = k === 'scale' ? 'scale' : k === 'rotate' ? 'rotate' : k === 'path' ? 'body' : k === 'anchor' || k === 'handle' ? k : k === 'marquee' ? 'none' : c.hit.t;
  switch (t) {
    case 'scale':
      return resizeCursor(c.hit.sx ?? 0, c.hit.sy ?? 0, c.angle);
    case 'rotate':
      return ROTATE_CURSOR;
    case 'anchor':
    case 'handle':
      return 'pointer';
    case 'body':
    case 'segment':
      return c.mode === 'select' ? 'move' : 'default';
    default:
      return 'default';
  }
}
