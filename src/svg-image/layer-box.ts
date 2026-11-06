import type { BackgroundLayerConfig } from '../contracts/bg-stack';
import { positionCss, sizeCss } from '../layers/stack/values';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none';

/** How a drawing sits in its box: the fit, an optional width in percent of the box, and where the stage lies (0-1 each way). */
export interface Placement {
  fit: ImageFit;
  pct?: number;
  px: number;
  py: number;
}

const WORD: Record<string, number> = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
const fraction = (token: string | undefined): number => {
  if (!token) return 0.5;
  if (token.endsWith('%')) return Math.min(1, Math.max(0, parseFloat(token) / 100));
  return WORD[token] ?? 0.5;
};

/**
 * What a background layer's `size` and `position` mean for a drawing (contract svg-image, "In a background layer"). The
 * values pass through the stack's own readers, so a bad value means the same here as for a picture.
 */
export function layerPlacement(layer: BackgroundLayerConfig): Placement {
  const size = sizeCss(layer.size);
  const [x, y] = positionCss(layer.position).split(' ');
  const px = fraction(x);
  const py = y === undefined ? fraction(x) : fraction(y);
  if (size === 'contain') return { fit: 'contain', px, py };
  if (size === 'auto') return { fit: 'none', px, py };
  if (size.endsWith('%')) return { fit: 'contain', pct: parseFloat(size) / 100, px, py };
  return { fit: 'cover', px, py };
}
