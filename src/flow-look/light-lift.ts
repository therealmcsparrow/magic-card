import type { FlowWithLook } from '../contracts/flow-look';
import { parseColour } from './colour';
import { unmix } from './paint';

/** Relative luminance with gamma 2.2 for the sRGB curve (within 0.003 for the colours that matter here); scaling a colour by k scales it by k ** 2.2. */
const lum = (c: number[]) => [0.2126, 0.7152, 0.0722].reduce((s, w, i) => s + w * (c[i] / 255) ** 2.2, 0);
/** A little under 0.2626, the highest luminance that has 3:1 on #f2f2f2, the lightest light card (white has more). */
const MAX = 0.255;

/** One paint darkened to 3:1 on a light card; a var(), a name or anything not hex / rgb() / hsl() stays as written. */
export function liftColour(c: string): string {
  const { paint, opacity } = unmix(c);
  const rgb = parseColour(paint);
  const l = rgb ? lum(rgb) : 0;
  if (!rgb || l <= MAX) return c;
  const out = `rgb(${rgb.slice(0, 3).map((v) => Math.round(v * (MAX / l) ** (1 / 2.2)))})`;
  return opacity < 1 ? `color-mix(in srgb, ${out} ${Math.round(opacity * 100)}%, transparent)` : out;
}

/**
 * A light card: the line and gradient-end colours reach 3:1 (WCAG 1.4.11), like the slider's lift(). A dark card is
 * untouched. Shape colours stay as set: every shape carries a card-coloured outline of its own.
 */
export function liftFlow(f: FlowWithLook, dark: boolean): FlowWithLook {
  return dark ? f : { ...f, color: liftColour(f.color), colorTo: f.colorTo && liftColour(f.colorTo) };
}
