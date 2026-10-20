import type { FlowWithLook } from '../contracts/flow-look';
import { css, lift, LIGHT_CARD, parseColour } from '../slider-look/colour';
import { unmix } from './paint';

/** One paint darkened to 3:1 on a light card; a var(), a name or anything not hex / rgb() stays as written. */
export function liftColour(c: string): string {
  const p = unmix(c);
  const rgb = parseColour(p.paint);
  if (!rgb) return c;
  const to = lift(rgb, LIGHT_CARD, 3);
  if (to === rgb) return c;
  return p.opacity < 1 ? `color-mix(in srgb, ${css(to)} ${Math.round(p.opacity * 100)}%, transparent)` : css(to);
}

/**
 * A light card: the line and gradient-end colours reach 3:1 (WCAG 1.4.11), like the slider's lift(). A dark card is
 * untouched. Shape colours stay as set: every shape carries a card-coloured outline of its own.
 */
export function liftFlow(f: FlowWithLook, dark: boolean): FlowWithLook {
  if (dark) return f;
  const { colorTo } = f;
  return {
    ...f,
    color: liftColour(f.color),
    ...(colorTo !== undefined ? { colorTo: liftColour(colorTo) } : {}),
  };
}
