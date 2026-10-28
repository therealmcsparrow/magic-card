import { html, type TemplateResult } from 'lit';
import { REFERENCE_ALIGN_KEY_PREFIX, REFERENCE_MAX_FILE_BYTES, REFERENCE_MAX_SIDE, REFERENCE_TYPES } from '../contracts/image-editor';
import { t } from './i18n';
import type { ImageExt } from './chunk';

/*
 * The reference picture: a photo or plan behind the canvas for tracing, while editing only. It is drawn from a <canvas>
 * held in page memory, so nothing about it is ever a URL, a markup string or part of the document. Only five alignment
 * numbers are kept on this device, per image.
 */

export interface Align {
  /** Offset of the picture's middle from the canvas middle, in drawing units. */
  x: number;
  y: number;
  /** Percent of the size that fits the canvas. */
  s: number;
  /** Degrees, -180 to 180. */
  r: number;
  /** Opacity percent. */
  o: number;
}
export interface Picture {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
}
export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const FRESH: Align = { x: 0, y: 0, s: 100, r: 0, o: 50 };
/** No image id matches this (ids start with a letter), so an unsaved image never shares a key with a saved one. */
const DRAFT = REFERENCE_ALIGN_KEY_PREFIX + '~draft';

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));
export const tenth = (n: number): number => Math.round(n * 10) / 10;
const num = (n: unknown, d: number): number => (typeof n === 'number' && Number.isFinite(n) ? n : d);

/** Degrees as -180..180. */
export const turn = (r: number): number => {
  const m = ((r % 360) + 360) % 360;
  return tenth(m > 180 ? m - 360 : m);
};

export function clean(a: Partial<Align>, from: Align = FRESH): Align {
  return {
    x: tenth(clamp(num(a.x, from.x), -100000, 100000)),
    y: tenth(clamp(num(a.y, from.y), -100000, 100000)),
    s: tenth(clamp(num(a.s, from.s), 1, 1000)),
    r: turn(num(a.r, from.r)),
    o: Math.round(clamp(num(a.o, from.o), 0, 100)),
  };
}

// ── what is remembered ──

export const alignKey = (id?: string): string => (id ? REFERENCE_ALIGN_KEY_PREFIX + id : DRAFT);

export function readAlign(id?: string): Align | undefined {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(alignKey(id)) ?? 'null');
    return Array.isArray(v) && v.length === 5 && v.every((n) => typeof n === 'number' && Number.isFinite(n)) ? clean({ x: v[0], y: v[1], s: v[2], r: v[3], o: v[4] }) : undefined;
  } catch {
    return undefined;
  }
}

export function writeAlign(id: string | undefined, a: Align): void {
  try {
    localStorage.setItem(alignKey(id), JSON.stringify([a.x, a.y, a.s, a.r, a.o]));
  } catch {
    /* storage is full or blocked: the alignment is simply not remembered */
  }
}

export function dropDraft(): void {
  try {
    localStorage.removeItem(DRAFT);
  } catch {
    /* nothing to remove */
  }
}

// ── the file ──

export const checkFile = (f: { type: string; size: number }): 'type' | 'big' | undefined => (!REFERENCE_TYPES.includes(f.type) ? 'type' : f.size > REFERENCE_MAX_FILE_BYTES ? 'big' : undefined);

/** Decodes in the browser; a side over REFERENCE_MAX_SIDE is scaled down, never refused. */
export async function decodePicture(f: Blob): Promise<Picture> {
  const bmp = await createImageBitmap(f);
  try {
    const k = Math.min(1, REFERENCE_MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * k));
    const h = Math.max(1, Math.round(bmp.height * k));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext('2d');
    if (!g) throw new Error('no canvas');
    g.drawImage(bmp, 0, 0, w, h);
    return { canvas, w, h };
  } finally {
    bmp.close();
  }
}

// ── geometry ──

/** The picture at Scale 100: as large as fits inside the canvas, same shape as the picture. */
export function baseSize(p: Picture, f: Frame): { w: number; h: number } {
  const k = Math.min(f.w / p.w, f.h / p.h);
  return { w: p.w * k, h: p.h * k };
}

/** Scale (percent) at which the turned picture fits the canvas. */
export function fitScale(p: Picture, f: Frame, r: number): number {
  const b = baseSize(p, f);
  const a = (r * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  return tenth(clamp(100 * Math.min(f.w / (b.w * c + b.h * s), f.h / (b.w * s + b.h * c)), 1, 1000));
}

/** A canvas with the picture's shape (turned a quarter, the sides swap), keeping the longer side of `f`. */
export function matchShape(p: Picture, r: number, f: Frame): { w: number; h: number } {
  const quarter = Math.abs(Math.sin((r * Math.PI) / 180)) > 0.7071;
  const pw = quarter ? p.h : p.w;
  const ph = quarter ? p.w : p.h;
  const long = Math.max(f.w, f.h);
  const k = long / Math.max(pw, ph);
  return { w: Math.max(1, Math.round(pw * k)), h: Math.max(1, Math.round(ph * k)) };
}

/** The picture behind the canvas, moved and zoomed with the view. Nothing in it takes a pointer. */
export function underlay(x: ImageExt): TemplateResult | undefined {
  const p = x.ref;
  if (!p || !x.shown) return undefined;
  const v = x.shell.view;
  const f = x.shell.doc.vb;
  const a = x.align;
  const b = baseSize(p, f);
  const tr = `translate(${v.x}px,${v.y}px) scale(${v.zoom}) translate(${f.x + f.w / 2 + a.x}px,${f.y + f.h / 2 + a.y}px) rotate(${a.r}deg) scale(${a.s / 100}) translate(${-b.w / 2}px,${-b.h / 2}px)`;
  return html`<div class="ref" aria-hidden="true" style=${`opacity:${a.o / 100}`}><div class="ref-pic" style=${`width:${b.w}px;height:${b.h}px;transform:${tr}`}>${p.canvas}</div></div>`;
}

// ── actions ──

const say = (x: ImageExt, s: string): void => x.shell.say(s);

export function setAlign(x: ImageExt, patch: Partial<Align>): void {
  x.align = clean(patch, x.align);
  if (x.ref) writeAlign(x.id, x.align);
  x.shell.requestUpdate();
}

export function fit(x: ImageExt): void {
  if (x.ref) setAlign(x, { x: 0, y: 0, s: fitScale(x.ref, x.shell.doc.vb, x.align.r) });
}

export function reset(x: ImageExt): void {
  if (!x.ref) return;
  x.note = undefined;
  setAlign(x, FRESH);
}

export function drop(x: ImageExt): void {
  if (x.ref) x.ref.canvas.width = x.ref.canvas.height = 0;
  x.ref = undefined;
}

export function remove(x: ImageExt): void {
  drop(x);
  x.msg = x.note = undefined;
  x.shell.requestUpdate();
  queueMicrotask(() => x.shell.renderRoot.querySelector<HTMLElement>('#ref-pick')?.focus());
}

/** The file to use, after the type and size checks and before anything is read. */
export async function pick(x: ImageExt, file: File): Promise<void> {
  x.msg = x.note = undefined;
  const bad = checkFile(file);
  if (bad) x.msg = bad === 'type' ? t('image-editor.reference.choose-a-png-jpeg-webp-gif-avif-or-bmp') : t('image-editor.reference.that-file-is-too-big-to-open-over-64-mb');
  else
    try {
      const pic = await x.decode(file);
      drop(x);
      x.ref = pic;
      x.shown = true;
      const kept = readAlign(x.id);
      x.align = kept ?? FRESH;
      if (kept) x.note = t('image-editor.reference.your-last-alignment-for-this-image-was');
      else writeAlign(x.id, x.align);
      say(x, x.note ?? t('image-editor.reference.reference-picture-on-not-saved'));
    } catch {
      x.msg = t('image-editor.reference.this-browser-cannot-open-that-picture');
    }
  x.shell.requestUpdate();
}

/** The alignment follows the image to its address on the first save (and to a copy's address). */
export function moved(x: ImageExt, was: string | undefined): void {
  if (x.ref) writeAlign(x.id, x.align);
  if (!was) dropDraft();
}

export function dispose(x: ImageExt): void {
  drop(x);
  if (!x.id) dropDraft();
}
