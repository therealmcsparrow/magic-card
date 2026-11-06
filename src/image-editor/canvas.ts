import { IMAGE_CANVAS_MIN, IMAGE_CANVAS_PRESETS } from '../contracts/image-editor';
import type { Doc } from '../svg-editor/model';
import { K } from './kit';
import { MAX_IMAGE_BOX } from '../contracts/mcu-library-images';

/** Drawing grid sizes for big canvases; the default is the longest side / 48, rounded to the nearest of these. */
export const IMAGE_GRID_STEPS: readonly number[] = [1, 2, 5, 10, 20, 25, 40, 50, 100];
export const IMAGE_GRID_MIN = 0.1;

export const sideOk = (n: number): boolean => Number.isFinite(n) && n >= IMAGE_CANVAS_MIN && n <= MAX_IMAGE_BOX;

export function gridFor(w: number, h: number): number {
  const want = Math.max(w, h) / 48;
  return IMAGE_GRID_STEPS.reduce((a, b) => (Math.abs(Math.log(b / want)) < Math.abs(Math.log(a / want)) ? b : a));
}

/** The other side after one side changed with "Keep ratio" on, kept inside the allowed range. */
export function keepRatio(from: { w: number; h: number }, edited: 'w' | 'h', value: number): { w: number; h: number } {
  const r = from.w / from.h;
  const clamp = (n: number): number => Math.min(MAX_IMAGE_BOX, Math.max(IMAGE_CANVAS_MIN, Math.round(n)));
  return edited === 'w' ? { w: value, h: clamp(value / r) } : { w: clamp(value * r), h: value };
}

/** The preset ratio ("16:9") a size equals, else 'custom'. */
export const presetOf = (w: number, h: number): string => IMAGE_CANVAS_PRESETS.find((p) => p.width === w && p.height === h)?.ratio ?? 'custom';

export const DEFAULT_PRESET = IMAGE_CANVAS_PRESETS[2];

/** Width and height as the pair of whole numbers a Create press would use, or undefined with the side at fault. */
export function readSize(w: string, h: string): { ok: true; w: number; h: number } | { ok: false; bad: Array<'w' | 'h'> } {
  const a = Number(w.trim().replace(',', '.'));
  const b = Number(h.trim().replace(',', '.'));
  const bad: Array<'w' | 'h'> = [];
  if (!w.trim() || !sideOk(a)) bad.push('w');
  if (!h.trim() || !sideOk(b)) bad.push('h');
  return bad.length ? { ok: false, bad } : { ok: true, w: Math.round(a), h: Math.round(b) };
}

/** How many layers reach outside a canvas of w x h (the box starts at the view box origin). */
export function outsideCount(d: Doc, w: number, h: number): number {
  const { x, y } = d.vb;
  return d.shapes.filter((s) => {
    const b = K.shapeBox(s);
    return !!b && (b.x < x - 0.01 || b.y < y - 0.01 || b.x + b.w > x + w + 0.01 || b.y + b.h > y + h + 0.01);
  }).length;
}
