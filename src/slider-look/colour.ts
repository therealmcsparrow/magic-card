/*
 * Colour maths of the slider looks (slider-look 1.0.0 rule 5): contrast ratios and the lifts that keep
 * the thumb, the ring and the light's own colour at 3:1. Only colours the card can read (hex, rgb())
 * are computed; a var() or a named colour keeps its CSS value and the theme decides.
 */
export type RGB = [number, number, number];

/** Surfaces a look is checked against (card background, light and dark; the tool for flows uses the same). */
export const SURFACE_LIGHT: RGB = [255, 255, 255];
export const SURFACE_DARK: RGB = [28, 28, 28];

const byte = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

/** #rgb, #rrggbb, rgb() / rgba() (commas or spaces); undefined for anything else. */
export function parseColour(s: string | undefined): RGB | undefined {
  if (!s) return undefined;
  const v = s.trim();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(v);
  if (m) {
    const h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  m = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/i.exec(v);
  return m ? [byte(+m[1]), byte(+m[2]), byte(+m[3])] : undefined;
}

export const css = (c: RGB): string => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

const lin = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const luminance = (c: RGB): number => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);

/** WCAG contrast ratio, 1 to 21. */
export function ratio(a: RGB, b: RGB): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const mix = (a: RGB, b: RGB, t: number): RGB => [byte(a[0] + (b[0] - a[0]) * t), byte(a[1] + (b[1] - a[1]) * t), byte(a[2] + (b[2] - a[2]) * t)];

/** `c` moved toward black (light surface) or white (dark surface) until it has `min`:1 against `bg`. */
export function lift(c: RGB, bg: RGB, min = 3): RGB {
  if (ratio(c, bg) >= min) return c;
  const to: RGB = luminance(bg) > 0.18 ? [0, 0, 0] : [255, 255, 255];
  for (let t = 0.04; t < 1; t += 0.04) {
    const m = mix(c, to, t);
    if (ratio(m, bg) >= min) return m;
  }
  return to;
}

/** White or near-black, whichever reads better on `bg` (at least 4.5:1 on any colour). */
export function readableOn(bg: RGB): RGB {
  const w: RGB = [255, 255, 255];
  const k: RGB = [0, 0, 0];
  return ratio(w, bg) >= ratio(k, bg) ? w : k;
}

export interface ThumbColours {
  /** Thumb face: reads at 3:1 or more on the fill. */
  face: RGB;
  /** Ring around the thumb: 3:1 or more on the surface, so the thumb shows on the empty track. */
  ring: RGB;
  /** Icon on the face. */
  icon: RGB;
}

export function thumbColours(fill: RGB, surface: RGB): ThumbColours {
  const face = readableOn(fill);
  return { face, ring: lift(fill, surface, 3), icon: readableOn(face) };
}
