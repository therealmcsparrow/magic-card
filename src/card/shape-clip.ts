import { parseClosed, polygonCss } from '../path/core';
import { clipPathSupported } from './shape-resolve';

/** The clip-path value of a shape path. */
export function shapeClip(d: string): string {
  if (clipPathSupported()) return `path('${d}')`;
  const o = parseClosed(d);
  return o ? polygonCss(o) : 'none';
}
