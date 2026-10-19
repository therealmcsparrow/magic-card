import type { FlowLineStyle, FlowShape } from '../contracts/flow-look';

/*
 * Static tile pictures of the flow editor (look-editor contract rule 9): chunk constants drawn in currentColor, never
 * animated and never built from config text (the tile group renders them with unsafeHTML).
 */
const line = (inner: string): string =>
  `<svg viewBox="0 0 56 20" width="56" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const LINE_TILES: Readonly<Record<FlowLineStyle, string>> = {
  solid: line('<path d="M3 10H53"/>'),
  dashed: line('<path d="M3 10H53" stroke-dasharray="10 6" stroke-linecap="butt"/>'),
  dotted: line('<path d="M3 10H53" stroke-dasharray="0 7"/>'),
  double: line('<path d="M3 6H53M3 14H53" stroke-width="2"/>'),
  wave: line('<path d="M3 10q6.2-9 12.4 0t12.4 0 12.4 0 12.4 0" stroke-width="2.5"/>'),
  zigzag: line('<path d="M3 14l6.2-8 6.2 8 6.2-8 6.2 8 6.2-8 6.2 8 6.2-8 6.2 8" stroke-width="2.5"/>'),
  tube: line('<rect x="3" y="4" width="50" height="12" rx="6" stroke-width="1.5"/><rect x="5.5" y="6.5" width="28" height="7" rx="3.5" fill="currentColor" stroke="none" opacity=".6"/>'),
  neon: line('<path d="M3 10H53" stroke-width="9" opacity=".3"/><path d="M3 10H53" stroke-width="3"/>'),
  cable: line('<path d="M3 10H53" stroke-width="7"/><path d="M12 6l4 8M22 6l4 8M32 6l4 8M42 6l4 8" stroke-width="1" opacity=".5"/>'),
};

const shape = (inner: string): string =>
  `<svg viewBox="0 0 56 32" width="56" height="32" fill="currentColor" stroke="none" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const SHAPE_TILES: Readonly<Record<FlowShape, string>> = {
  dot: shape('<circle cx="28" cy="16" r="6"/>'),
  arrow: shape('<path d="M18 7l22 9-22 9z"/>'),
  chevron: shape('<path d="M22 7l12 9-12 9" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
  square: shape('<rect x="20" y="8" width="16" height="16" rx="1.5"/>'),
  diamond: shape('<path d="M28 4l12 12-12 12-12-12z"/>'),
  star: shape('<path d="M28 4l3.5 8.2 8.5.8-6.4 5.7 1.9 8.6L28 22.8l-7.5 4.5 1.9-8.6L16 13l8.5-.8z"/>'),
  comet: shape('<path d="M6 16l26-5v10z" opacity=".4"/><circle cx="36" cy="16" r="6"/>'),
  spark: shape('<path d="M16 19l12-13v9l12-3-12 14v-9z"/>'),
  bubble: shape('<circle cx="28" cy="16" r="8" fill-opacity=".2" stroke="currentColor" stroke-width="1.8"/><path d="M23 13a6 6 0 0 1 4-3" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  drop: shape('<path d="M44 16L33 8a9 9 0 1 0 0 16z"/>'),
  icon: shape('<rect x="19" y="7" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M28 12v8M24 16h8" fill="none" stroke="currentColor" stroke-width="2"/>'),
};
