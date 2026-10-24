/*
 * The colour popup's four text formats: HEXA, RGBA, HSLA and OKLCH, read and written without a regular expression
 * that can backtrack. Text longer than MAX_COLOUR is never looked at.
 */

export type ColourFormat = 'HEXA' | 'RGBA' | 'HSLA' | 'OKLCH';
export const COLOUR_FORMATS: readonly ColourFormat[] = ['HEXA', 'RGBA', 'HSLA', 'OKLCH'];

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** A parsed colour: sRGB channels 0..255 (not rounded), alpha 0..1, and whether it lies outside sRGB. */
export interface ParsedColour extends Rgba {
  wide: boolean;
}

const MAX_COLOUR = 80;
const NUMBER = /^(\d+(?:\.\d+)?|\.\d+)(%|deg)?$/;
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const FUNCTION = /^(rgba?|hsla?|oklch)\(([^()]*)\)$/;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** The format a value is written in; anything that is not a colour function reads as HEXA. */
export function formatOf(value: string): ColourFormat {
  const v = value.trim().slice(0, 8).toLowerCase();
  if (v.startsWith('rgb')) return 'RGBA';
  if (v.startsWith('hsl')) return 'HSLA';
  if (v.startsWith('oklch')) return 'OKLCH';
  return 'HEXA';
}

interface Num {
  n: number;
  unit: string;
}

function numbers(args: string): Num[] | null {
  const parts = args.trim().split(/[\s,/]+/);
  if (parts.length < 3 || parts.length > 4) return null;
  const out: Num[] = [];
  for (const p of parts) {
    const m = NUMBER.exec(p);
    if (!m) return null;
    out.push({ n: Number(m[1]), unit: m[2] ?? '' });
  }
  return out;
}

const alphaOf = (x?: Num): number => (x ? clamp(x.unit === '%' ? x.n / 100 : x.n, 0, 1) : 1);

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  return [0, 8, 4].map((n) => 255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))) as [number, number, number];
}

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number): number => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** OKLCH (lightness 0..1, chroma, hue in degrees) to sRGB 0..255, clamped; `wide` when it had to be clamped. */
function oklchToRgb(L: number, C: number, H: number): { rgb: [number, number, number]; wide: boolean } {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  const wide = lin.some((c) => c < -0.0005 || c > 1.0005);
  return { rgb: lin.map((c) => 255 * clamp(fromLinear(c), 0, 1)) as [number, number, number], wide };
}

/** Reads a hex, rgb(a), hsl(a) or oklch() colour in either the comma or the space syntax; null for anything else. */
export function parseColour(text: string): ParsedColour | null {
  const s = text.trim().toLowerCase();
  if (!s || s.length > MAX_COLOUR) return null;
  const hex = HEX.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const byte = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return { r: byte(0), g: byte(2), b: byte(4), a: h.length === 8 ? byte(6) / 255 : 1, wide: false };
  }
  const fn = FUNCTION.exec(s);
  if (!fn) return null;
  const v = numbers(fn[2]);
  if (!v) return null;
  const a = alphaOf(v[3]);
  if (fn[1].startsWith('rgb')) {
    const ch = (x: Num) => clamp(x.unit === '%' ? x.n * 2.55 : x.n, 0, 255);
    return { r: ch(v[0]), g: ch(v[1]), b: ch(v[2]), a, wide: false };
  }
  if (fn[1].startsWith('hsl')) {
    const [r, g, b] = hslToRgb(v[0].n % 360, clamp(v[1].n, 0, 100) / 100, clamp(v[2].n, 0, 100) / 100);
    return { r, g, b, a, wide: false };
  }
  const { rgb, wide } = oklchToRgb(clamp(v[0].unit === '%' ? v[0].n / 100 : v[0].n, 0, 1), v[1].unit === '%' ? (v[1].n * 0.4) / 100 : v[1].n, v[2].n % 360);
  return { r: rgb[0], g: rgb[1], b: rgb[2], a, wide };
}

const trim = (n: number, digits: number): string => String(+n.toFixed(digits));

function rgbToHsl({ r, g, b }: Rgba): [number, number, number] {
  const [x, y, z] = [r / 255, g / 255, b / 255];
  const max = Math.max(x, y, z);
  const min = Math.min(x, y, z);
  const d = max - min;
  const l = (max + min) / 2;
  if (d === 0) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === x ? ((y - z) / d + (y < z ? 6 : 0)) : max === y ? (z - x) / d + 2 : (x - y) / d + 4;
  return [h * 60, s * 100, l * 100];
}

function rgbToOklch({ r, g, b }: Rgba): [number, number, number] {
  const [x, y, z] = [r, g, b].map((c) => toLinear(c / 255));
  const l = Math.cbrt(0.4122214708 * x + 0.5363325363 * y + 0.0514459929 * z);
  const m = Math.cbrt(0.2119034982 * x + 0.6806995451 * y + 0.1073969566 * z);
  const s = Math.cbrt(0.0883024619 * x + 0.2817188376 * y + 0.6299787005 * z);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  return [L * 100, C, C < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360];
}

/** The colour written in a format; an opaque colour has no alpha part (hex excepted: #rrggbb). Channels are rounded to whole bytes first. */
export function writeColour(c: Rgba, format: ColourFormat): string {
  const rgb = { r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b), a: c.a };
  const alpha = rgb.a < 1;
  if (format === 'HEXA') {
    const hex = '#' + [rgb.r, rgb.g, rgb.b, ...(alpha ? [Math.round(rgb.a * 255)] : [])].map((n) => n.toString(16).padStart(2, '0')).join('');
    return hex;
  }
  if (format === 'RGBA') return alpha ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${trim(rgb.a, 2)})` : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  if (format === 'HSLA') {
    const [h, s, l] = rgbToHsl(rgb);
    const body = `${trim(h, 1)}, ${trim(s, 1)}%, ${trim(l, 1)}%`;
    return alpha ? `hsla(${body}, ${trim(rgb.a, 2)})` : `hsl(${body})`;
  }
  const [L, C, H] = rgbToOklch(rgb);
  return `oklch(${trim(L, 2)}% ${trim(C, 4)} ${trim(H, 2)}${alpha ? ` / ${trim(rgb.a, 2)}` : ''})`;
}
