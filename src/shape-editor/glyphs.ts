import { svg, type SVGTemplateResult } from 'lit';
import type { CornerType } from '../contracts/custom-shape';

/*
 * The corner type glyphs: 24 x 24, stroke 1.5, a top left corner drawn in the style of the type
 * (design 04 section 1). The mini card turns them to the other corners.
 */
const PATHS: Record<CornerType, string> = {
  round: 'M4 20V12A8 8 0 0 1 12 4H20',
  squircle: 'M4 20V12C4 6.5 6.5 4 12 4H20',
  bevel: 'M4 20V10L10 4H20',
  scoop: 'M4 20V10A6 6 0 0 0 10 4H20',
  notch: 'M4 20V10H10V4H20',
  square: 'M4 20V4H20',
};

export const glyph = (t: CornerType, turn = 0): SVGTemplateResult =>
  svg`<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" style=${turn ? `transform:rotate(${turn}deg)` : ''}><path d=${PATHS[t]} /></svg>`;
