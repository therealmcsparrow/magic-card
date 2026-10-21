import type { LayerAnchor, LayerBlend } from './layer-placement';

/*
 * layer-placement, the names magic-card.js needs at run time. They sit in this file, not in
 * layer-placement.ts, because the entry may import only *.needs.ts of a contract (see
 * tools/check-entry-graph.mjs); layer-placement.ts re-exports them. Type-only imports.
 */

export const LAYER_ANCHORS: readonly LayerAnchor[] = [
  'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right',
];
/** Overlays with these anchors come before the in-flow modules in DOM / focus order. */
export const LEADING_ANCHORS: readonly LayerAnchor[] = ['top-left', 'top', 'top-right'];
export const LAYER_BLENDS: readonly LayerBlend[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light'];
export const MAX_OVERLAY_RANK = 40;
/** Blur range for module layers and image layers; above BLUR_LIGHT_MAX is "heavy". */
export const BLUR_MAX = 24;
/** Scrim fade: full strength over this share of the length from the edge. */
export const SCRIM_HOLD = 0.35;
export const SCRIM_DEFAULT_STRENGTH = 60;
