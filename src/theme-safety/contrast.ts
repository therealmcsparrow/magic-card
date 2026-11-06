// WCAG 2.2 contrast maths: read a computed CSS colour, blend it over a background, and give the contrast ratio of two colours.

export interface Rgb {
  r: number;
  g: number;
  b: number;
}
export interface Rgba extends Rgb {
  a: number;
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** A colour written as #rgb, #rgba, #rrggbb, #rrggbbaa, rgb() or rgba() (comma or space form); undefined for anything else. */
export function parseColor(s: string): Rgba | undefined {
  const v = s.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(v)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex;
    const [r, g, b, a] = [0, 2, 4, 6].map((i) => (full.length > i ? parseInt(full.slice(i, i + 2), 16) : 255));
    return { r, g, b, a: a / 255 };
  }
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/.exec(v);
  if (!fn) return undefined;
  const [r, g, b] = [fn[1], fn[2], fn[3]].map((x) => clamp(Math.round(parseFloat(x)), 0, 255));
  const a = fn[4] === undefined ? 1 : clamp(parseFloat(fn[4]) / (fn[5] ? 100 : 1), 0, 1);
  return { r, g, b, a };
}

/** `top` laid over the opaque colour `under`. */
export const blend = (top: Rgba, under: Rgb): Rgb => ({
  r: top.r * top.a + under.r * (1 - top.a),
  g: top.g * top.a + under.g * (1 - top.a),
  b: top.b * top.a + under.b * (1 - top.a),
});

const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** Relative luminance, 0 to 1. */
export const luminance = ({ r, g, b }: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** Contrast ratio of two opaque colours, 1 to 21, whichever is lighter. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
