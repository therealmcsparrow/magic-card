
// Contract: flow anchors. Version 1.2.0. FLOW_END_SELECTOR lives in src/contracts/flow-anchor.needs.ts, the only
// file of this contract the entry imports; this file re-exports it.

export const FLOW_ANCHOR_CONTRACT = '1.2.0';

/** YAML values of from_anchor / to_anchor. Unset (and anything unknown) = the look default (1.1.0). */
export type FlowAnchor = 'icon' | 'box';

export interface FlowAnchorConfig {
  /** Where the line attaches at the `from` module; unset = the look default (icon for a thin look, box for a wide one). */
  from_anchor?: FlowAnchor;
  /** Same for the `to` module. */
  to_anchor?: FlowAnchor;
}

/** Fields resolveFlow() adds to ResolvedFlow; present only when the end attaches to the box (YAML 'box', or the look default of a wide look). */
export interface FlowResolvedAnchors {
  fromBox?: true;
  toBox?: true;
}

// The two main-visual markers (DOM seam) live in flow-anchor.needs.ts, which magic-card.js imports; re-exported unchanged.
export { FLOW_END_SELECTOR } from './flow-anchor.needs';

/** Marker attribute for modules without an `.mc-anim-icon` hook. */
export const FLOW_END_ATTR = 'data-mc-flow-end';

/**
 * Module types that render a main visual (editor: "Attach to" is shown only for these; the
 * runtime never reads this list, it finds the marker). Editor-only import: keep it out of magic-card.js.
 */
export const FLOW_ANCHOR_TYPES: readonly string[] = ['icon', 'button', 'info', 'light', 'weather', 'image', 'camera', 'gauge'];
