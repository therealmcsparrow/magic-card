import type { FlowConfig } from '../types';
import type { FlowLookConfig, FlowShape } from './flow-look';

/*
 * flow-look 2.0.0, the predicates, key list and numbers magic-card.js needs at run time (mc-flows, flow.ts, magic-card.ts,
 * lazy-features). They sit in this file, not in flow-look.ts, because the entry may import only *.needs.ts of a contract
 * (see tools/check-entry-graph.mjs); flow-look.ts re-exports them.
 */

/** H above `lite` -> lite; above `minimal` -> minimal (H <= 3 full, <= 6 lite, > 6 minimal). */
export const FLOW_QUALITY_THRESHOLDS = { lite: 3, minimal: 6 } as const;

/** Shapes the `shape_spin` switch applies to. */
export const FLOW_SPIN_SHAPES: readonly FlowShape[] = ['star', 'square', 'diamond', 'icon'];

/** Every look key; any of them set = the flow needs the flow-look chunk. */
export const FLOW_LOOK_KEYS: readonly (keyof FlowLookConfig)[] = [
  'line_style', 'dash_length', 'dash_gap', 'rail_gap', 'amplitude', 'wavelength', 'electric', 'tube_tint', 'bubbles',
  'bubble_count', 'tube_fill_value', 'flicker', 'neon_core', 'cable_color', 'twisted', 'color_mode', 'color_to',
  'thresholds', 'start_cap', 'end_cap', 'cap_size', 'shape', 'shape_icon', 'shape_icon_rotate', 'shape_spin',
  'shape_color', 'shape_alternate', 'size_variation', 'spacing_mode', 'spacing', 'motion', 'arrival', 'arrival_size',
];

export const hasFlowLook = (f: Partial<FlowConfig> | undefined): boolean =>
  !!f && FLOW_LOOK_KEYS.some((k) => (f as Record<string, unknown>)[k] !== undefined);
