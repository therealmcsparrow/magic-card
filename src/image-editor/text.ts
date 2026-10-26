import type { EditPath } from '../contracts/path-model';
import { IMAGE_FONT_FAMILIES, IMAGE_MAX_TEXT_CHARS } from '../contracts/svg-image';
import type { Box, Flag } from './paint';

/*
 * Text layers. A text layer is a layer like any other (its placeholder path is the rectangle the text occupies, so moving,
 * aligning, selecting and the layer list work unchanged) that keeps its words in `look.text`. The text sits on its anchor,
 * which is read from the rectangle: its left edge, middle or right edge by alignment, and the first baseline a fixed share
 * of the size below its top. The markup written is plain <text> with <tspan> lines, so the editor canvas, the saved file and
 * the card draw the same thing with fonts the device already has.
 */

export interface TextData {
  /** The words; a new line is "\n". */
  s: string;
  /** Size in drawing units. */
  z: number;
  /** Weight, one of WEIGHTS. */
  w: number;
  i?: true;
  /** Alignment on the anchor. */
  a: 'start' | 'middle' | 'end';
  /** Letter spacing in drawing units (absent = 0). */
  l?: number;
  /** One of IMAGE_FONT_FAMILIES. */
  f: string;
}

export const WEIGHTS: readonly number[] = [300, 400, 500, 600, 700, 800];
export const FONTS: readonly string[] = IMAGE_FONT_FAMILIES;
export const MAX_TEXT_SIZE = 1000;
/** Line distance as a multiple of the size; the top of the box lies ASCENT * size above the first baseline. */
export const LINE = 1.2;
const ASCENT = 0.8;
const DESCENT = 0.22;

export type Measure = (line: string, t: TextData) => number;

const r2 = (n: number): number => Math.round(n * 100) / 100 || 0;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

export const linesOf = (s: string): string[] => s.split('\n');

/** Words as a layer may hold them: line breaks as "\n", no other control characters, at most IMAGE_MAX_TEXT_CHARS. */
export function cleanText(raw: string): string {
  // eslint-disable-next-line no-control-regex
  let out = raw.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f\u2028\u2029]/g, '').slice(0, IMAGE_MAX_TEXT_CHARS);
  if (/[\ud800-\udbff]$/.test(out)) out = out.slice(0, -1);
  return out;
}

/** Words Magic Card Utils refuses anywhere in an image, text and layer names included. */
const REFUSED = ['javascript:', 'vbscript:', '@import', 'expression('];

/** The first refused word that `s` holds (any case, line breaks and tabs inside it ignored), else undefined. */
export function refusedWord(s: string): string | undefined {
  const low = s.toLowerCase().replace(/[\t\n\r]/g, '');
  return REFUSED.find((w) => low.includes(w));
}

/** The layer's default name for these words: the first line, cut at 24 characters ("Text" when empty). */
export function nameOf(s: string, fallback: string): string {
  const first = linesOf(s).map((l) => l.trim()).find(Boolean) ?? '';
  const chars = [...first];
  return chars.length > 24 ? `${chars.slice(0, 24).join('')}…` : first || fallback;
}

export const safeWeight = (n: number): number => WEIGHTS.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));

/** A size for a new text layer on this drawing: a sixteenth of the shorter side. */
export const defaultSize = (w: number, h: number): number => clamp(Math.round(Math.min(w, h) / 16), 8, 400);

// ── measuring ──

const estimate: Measure = (line, t) => [...line].length * (t.z * 0.56 + (t.l ?? 0));

let ctx: CanvasRenderingContext2D | null | undefined;

/** The width of one line in the font the layer asks for (the browser's own measure; an estimate where there is none). */
export const measure: Measure = (line, t) => {
  if (ctx === undefined) {
    try {
      ctx = document.createElement('canvas').getContext('2d');
    } catch {
      ctx = null;
    }
  }
  if (!ctx) return estimate(line, t);
  ctx.font = `${t.i ? 'italic ' : ''}${t.w} ${t.z}px ${t.f}`;
  const w = ctx.measureText(line).width;
  return Number.isFinite(w) ? w + (t.l ?? 0) * [...line].length : estimate(line, t);
};

// ── geometry ──

/** The rectangle of a text with its anchor at `at`. */
export function boxFor(at: readonly [number, number], t: TextData, m: Measure = measure): Box {
  const lines = linesOf(t.s);
  const w = Math.max(1, ...lines.map((l) => m(l, t)));
  const x = t.a === 'start' ? at[0] : t.a === 'middle' ? at[0] - w / 2 : at[0] - w;
  return { x: r2(x), y: r2(at[1] - ASCENT * t.z), w: r2(w), h: r2((ASCENT + DESCENT) * t.z + (lines.length - 1) * LINE * t.z) };
}

/** Where the first baseline starts: the box's left edge, middle or right edge, and the baseline. */
export function anchorOf(b: Box, t: TextData): [number, number] {
  return [t.a === 'start' ? b.x : t.a === 'middle' ? b.x + b.w / 2 : b.x + b.w, b.y + ASCENT * t.z];
}

/** The rectangle as the layer's placeholder path. */
export const boxPaths = (b: Box): EditPath[] => [
  {
    anchors: [
      { x: b.x, y: b.y },
      { x: b.x + b.w, y: b.y },
      { x: b.x + b.w, y: b.y + b.h },
      { x: b.x, y: b.y + b.h },
    ],
    closed: true,
  },
];

/** The y of line `i` (0 = the first baseline). */
export const lineY = (y: number, i: number, t: TextData): number => r2(y + i * LINE * t.z);

// ── markup out ──

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The attributes that place and set the text (the layer's paint comes from layerPaint). */
export function textAttrs(t: TextData, at: readonly [number, number]): string {
  return (
    ` x="${r2(at[0])}" y="${r2(at[1])}" font-size="${r2(t.z)}" font-family="${t.f}" font-weight="${t.w}"` +
    (t.i ? ' font-style="italic"' : '') +
    ` text-anchor="${t.a}"` +
    (t.l ? ` letter-spacing="${r2(t.l)}"` : '')
  );
}

/** The content of the <text> element: the words, or one <tspan> per non-empty line. */
export function textBody(t: TextData, at: readonly [number, number]): string {
  const lines = linesOf(t.s);
  if (lines.length === 1) return esc(lines[0]);
  return lines.map((l, i) => (l.trim() ? `<tspan x="${r2(at[0])}" y="${lineY(at[1], i, t)}">${esc(l)}</tspan>` : '')).join('');
}

/** True when there is nothing to draw. */
export const blank = (t: TextData): boolean => !t.s.trim();

// ── markup in ──

/** The value of a presentation attribute on the element or the nearest group above it. */
export function inherited(el: Element, k: string): string | undefined {
  for (let e: Element | null = el; e; e = e.parentElement) {
    const v = e.getAttribute(k);
    if (v !== null) return v.trim();
  }
  return undefined;
}

const NUM = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i;
const KNOWN = new Set(['id', 'data-name', 'x', 'y', 'fill', 'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'font-size', 'font-family', 'font-weight', 'font-style', 'text-anchor', 'letter-spacing', 'class']);

function num(v: string | undefined, d: number, f: Flag): number {
  if (v === undefined || v === '') return d;
  const m = /^(.*?)(?:px)?$/.exec(v)![1];
  if (NUM.test(m)) return parseFloat(m);
  f.v = true;
  return d;
}

/**
 * A <text> element as the editor's text and its anchor, or undefined with `f.v` set when it holds something the editor would lose (a
 * transform, a position list, nested elements, sizes in other units, lines that do not follow the line distance).
 */
export function readText(el: Element, flag: Flag): { t: TextData; at: [number, number] } | undefined {
  const f: Flag = { v: false };
  const bad = (): undefined => ((flag.v = true), undefined);
  for (let e: Element | null = el; e; e = e.parentElement) if (e.hasAttribute('transform')) return bad();
  if ([...el.attributes].some((a) => !KNOWN.has(a.name) && !a.name.startsWith('xmlns'))) return bad();
  const x = num(el.getAttribute('x')?.trim(), 0, f);
  const y = num(el.getAttribute('y')?.trim(), 0, f);
  const size = num(inherited(el, 'font-size'), 16, f);
  const wRaw = inherited(el, 'font-weight') ?? 'normal';
  const weight = wRaw === 'normal' ? 400 : wRaw === 'bold' ? 700 : NUM.test(wRaw) ? safeWeight(parseFloat(wRaw)) : 0;
  const style = inherited(el, 'font-style') ?? 'normal';
  const anchor = inherited(el, 'text-anchor') ?? 'start';
  const ls = inherited(el, 'letter-spacing');
  const spacing = ls === undefined || ls === 'normal' ? 0 : num(ls, 0, f);
  const fam = inherited(el, 'font-family') ?? 'sans-serif';
  if (!weight || (style !== 'normal' && style !== 'italic') || (anchor !== 'start' && anchor !== 'middle' && anchor !== 'end')) return bad();
  if (!(size > 0 && size <= MAX_TEXT_SIZE) || f.v) return bad();
  const t: TextData = { s: '', z: size, w: weight, a: anchor, f: FONTS.includes(fam) ? fam : 'sans-serif' };
  if (style === 'italic') t.i = true;
  if (spacing) t.l = spacing;
  const kids = [...el.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent!.trim()));
  const spans = kids.filter((n): n is Element => n.nodeType === 1);
  const words = (n: Node): string => n.textContent!.replace(/\s+/g, ' ').trim();
  if (!spans.length) t.s = words(el);
  else {
    if (spans.length !== kids.length) return bad();
    const lines: string[] = [];
    for (const sp of spans) {
      const bs = [...sp.attributes].map((a) => a.name);
      const ok = sp.localName === 'tspan' && bs.every((n) => n === 'x' || n === 'y') && !sp.children.length;
      const sx = num(sp.getAttribute('x')?.trim(), x, f);
      const sy = sp.hasAttribute('y') ? num(sp.getAttribute('y')!.trim(), y, f) : NaN;
      const at = (sy - y) / (LINE * size);
      const i = Math.round(at);
      if (!ok || f.v || Math.abs(sx - x) > 0.01 || !(i >= 0 && i < 200) || Math.abs(at - i) > 0.02 || lines[i] !== undefined) return bad();
      lines[i] = words(sp);
    }
    t.s = Array.from(lines, (l) => l ?? '').join('\n');
  }
  if (t.s.length > IMAGE_MAX_TEXT_CHARS) return bad();
  return { t, at: [x, y] };
}

// ── editing ──

/** The text after a change (values kept inside what the markup allows) and its box rebuilt round the same anchor. */
export function changed(t: TextData, box: Box | undefined, patch: Partial<TextData>, m?: Measure): { t: TextData; box: Box } {
  const n: TextData = { ...t, ...patch };
  n.s = cleanText(n.s);
  n.z = clamp(Number.isFinite(n.z) ? n.z : t.z, 1, MAX_TEXT_SIZE);
  n.w = safeWeight(n.w);
  if (!FONTS.includes(n.f)) n.f = 'sans-serif';
  if (!n.i) delete n.i;
  if (n.l) n.l = clamp(n.l, -100, 1000);
  else delete n.l;
  return { t: n, box: boxFor(box ? anchorOf(box, t) : [0, 0], n, m) };
}
