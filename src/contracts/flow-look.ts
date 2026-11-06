import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ColorRange, FlowConfig, HomeAssistant } from '../types';
import type { FlowGeometry } from '../utils/flow-geometry';
import type { ResolvedFlow } from '../utils/flow';

/** Contract: flow looks. Version 2.0.0. Travel is transform keyframes in each flow's own <style> (compositor). No
 * offset-path probe, SMIL fallback or SMIL pause; FlowLookRenderOptions has no `offsetPath` or `motion`. */

export const FLOW_LOOK_CONTRACT = '2.0.0';
export const FLOW_LOOK_CONTRACT_REVISION = 6;

export type FlowLineStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'wave' | 'zigzag' | 'tube' | 'neon' | 'cable';
export type FlowShape = 'dot' | 'arrow' | 'chevron' | 'square' | 'diamond' | 'star' | 'comet' | 'spark' | 'bubble' | 'drop' | 'icon';
export type FlowCap = 'none' | 'round' | 'arrow';
/** Quality tier chosen by mc-flows from H. */
export type FlowLookQuality = 'full' | 'lite' | 'minimal';

// FLOW_QUALITY_THRESHOLDS, FLOW_SPIN_SHAPES, FLOW_LOOK_KEYS and hasFlowLook live in flow-look.needs.ts, which
// magic-card.js imports; re-exported unchanged. H above `lite` -> lite; above `minimal` -> minimal (H <= 3 full,
// <= 6 lite, > 6 minimal).
export { FLOW_QUALITY_THRESHOLDS, FLOW_SPIN_SHAPES, FLOW_LOOK_KEYS, hasFlowLook } from './flow-look.needs';

/** Sampler and geometry constants. */
export const FLOW_GEOMETRY = {
  /** Path commands flowPath() emits (absolute). */
  grammar: ['M', 'L', 'H', 'V', 'C', 'A'],
  /** Taper length T = min(taperMax, run x taperRunShare); amplitude capped at T only where T < taperMax. */
  taperMax: 12,
  taperRunShare: 0.25,
  /** Amplitude <= curvatureShare x local radius of curvature. */
  curvatureShare: 0.4,
  /** Douglas-Peucker tolerance for emitted offset polylines (px). */
  simplifyPx: 0.2,
  /** Gradient segments: clamp(ceil(L / segmentPx), min, max), overlapping by overlapPx. */
  gradient: { segmentPx: 10, min: 4, max: 32, overlapPx: 1 },
  /** Round cap diameter as a share of cap_size. */
  roundCapShare: 2 / 3,
} as const;

/** A floor-safe paint: colour plus a separate opacity (fill-opacity / stroke-opacity). */
export interface FlowPaint {
  paint: string;
  opacity: number;
}
const TEXT = 'var(--primary-text-color, #212121)';

/** Theme-derived defaults of unset colour keys and the parts without a key. */
export const FLOW_LOOK_THEME = {
  /** tube_tint unset: glass fill (decorative). */
  tubeTint: { paint: TEXT, opacity: 0.08 },
  /** Tube wall (1 px) and the level mark (2 px across the tube at the liquid surface): >= 3:1. */
  tubeWall: { paint: TEXT, opacity: 0.55 },
  /** neon_core unset on a dark card. Light card: line colour + black overlay stroke at 0.45. */
  neonCoreDark: { paint: '#ffffff', opacity: 0.85 },
  neonCoreLightShade: { paint: '#000000', opacity: 0.45 },
  /** Cable outline (1 px): >= 3:1 (0.5, measured by the contrast script). */
  cableOutline: { paint: TEXT, opacity: 0.5 },
} as const satisfies Record<string, FlowPaint>;

/** Defaults and ranges (clamped by resolve(); the editor uses the same numbers): src/contracts/flow-look.defaults.ts, re-exported here. */
export { FLOW_LOOK_DEFAULTS, defaultCapSize } from './flow-look.defaults';

export interface FlowLookConfig {
  /** Line style; unset = solid (today's line). Picking solid in the editor removes the key. */
  line_style?: FlowLineStyle;
  /** dashed: dash length (px). */
  dash_length?: number;
  /** dashed / dotted: gap (px). Dotted dots are `width` wide (round caps). */
  dash_gap?: number;
  /** double: gap between the two rails (px); each rail is `width` wide. */
  rail_gap?: number;
  /** wave / zigzag: height (px); lower on short runs (taper rule). */
  amplitude?: number;
  /** wave / zigzag: length of one period (px). */
  wavelength?: number;
  /** zigzag: electric flicker. */
  electric?: boolean;
  /** tube: glass tint (colour, used as written); unset = theme text colour at 8 %. */
  tube_tint?: string;
  /** tube: rising bubbles while flowing (default on for a tube). */
  bubbles?: boolean;
  bubble_count?: number;
  /** P3 tube: liquid length = (|value| - min) / (max - min), from the start end; needs an entity. */
  tube_fill_value?: boolean;
  /** neon: flicker strength. */
  flicker?: 'off' | 'subtle' | 'strong';
  /** neon: core colour (used as written); unset = theme-derived (FLOW_LOOK_THEME). */
  neon_core?: string;
  /** cable: sheath colour (default a darker shade of `color`). */
  cable_color?: string;
  /** cable: diagonal strand marks. */
  twisted?: boolean;
  /** Colour mode; precedence in the header. */
  color_mode?: 'single' | 'gradient' | 'value';
  /** gradient: end colour (`color` is the start; `entity` / `entity N%` allowed). */
  color_to?: string;
  /** value: ranges on |value| (same ColorRange as ring `thresholds`; `to` is ignored). */
  thresholds?: ColorRange[];
  /** Caps at the start / end of the line, in the travel direction (start arrow points out of the line). */
  start_cap?: FlowCap;
  end_cap?: FlowCap;
  /** Cap size (px, 4-40); unset = defaultCapSize(width): 2 x width, at most 24. A round cap is 2/3 of it across. */
  cap_size?: number;
  /** Travelling shape; unset = dot. */
  shape?: FlowShape;
  /** shape: icon, the MDI icon (mdi:name). */
  shape_icon?: string;
  /** shape: icon, turn with the line (default true; false keeps it upright). */
  shape_icon_rotate?: boolean;
  /**
   * Spin: star, square, diamond and icon shapes turn a full circle every 3 s on
   * top of the tangent; default false; ignored for other shapes. Reduced motion removes travelling
   * shapes, so nothing spins there.
   */
  shape_spin?: boolean;
  /** Shape colour; unset = the line colour. */
  shape_color?: string;
  /** Every second shape is this one. */
  shape_alternate?: FlowShape;
  /** Size variation, 0-60 % (seeded, stable). */
  size_variation?: number;
  /** Spacing mode; precedence in the header. */
  spacing_mode?: 'even' | 'pixels' | 'random';
  /** Gap between shapes (px); at least one shape on any line. */
  spacing?: number;
  /** travel (default) or pulse: shapes stay put and pulse, faster with a higher value. */
  motion?: 'travel' | 'pulse';
  /** P2 effect at the arriving end each time a shape arrives (none under pulse). */
  arrival?: 'none' | 'ring' | 'splash';
  arrival_size?: number;
}

/**
 * What resolve() returns, stored as ResolvedFlow.look: JSON-safe (mc-flows compares flows by
 * JSON), colours resolved, numbers clamped and defaulted, modes decided. The colour mode result is
 * applied to ResolvedFlow.color (single / value) or color + colorTo (gradient). Unset tube_tint /
 * neon_core resolve to undefined and the renderer uses FLOW_LOOK_THEME.
 */
export interface FlowLookResolved {
  line: FlowLineStyle;
  dashLength: number;
  dashGap: number;
  railGap: number;
  amplitude: number;
  wavelength: number;
  electric: boolean;
  /** flow-anchor 1.1.0: a wide look (isWideFlowLook); resolveFlow() then defaults unset anchors to the box. */
  wide: boolean;
  tubeTint?: string;
  /** Bubble count; 0 = none. */
  bubbles: number;
  /** 0..1 liquid level (1 unless tube_fill_value with a value). */
  level: number;
  flicker: 'off' | 'subtle' | 'strong';
  neonCore?: string;
  cableColor?: string;
  twisted: boolean;
  colorTo?: string;
  startCap: FlowCap;
  endCap: FlowCap;
  /** cap_size as set, else defaultCapSize(width). */
  capSize: number;
  shape: FlowShape;
  icon?: string;
  iconRotate: boolean;
  spin: boolean;
  shapeColor?: string;
  alternate?: FlowShape;
  sizeVariation: number;
  spacing?: { mode: 'pixels' | 'random'; px: number };
  motion: 'travel' | 'pulse';
  arrival: 'none' | 'ring' | 'splash';
  arrivalSize: number;
}

export interface FlowLookRenderOptions {
  /** The flow's index on the card (unique ids and keyframe names: `mc-flow-<index>-<kind>`). */
  index: number;
  reduced: boolean;
  /** Moving elements this flow may draw (card budget applied). */
  count: number;
  /** HA dark mode (mc-flows `dark`): picks the theme-derived neon core. */
  dark: boolean;
  /** Card-wide quality tier. */
  quality: FlowLookQuality;
}

export interface FlowLookParts {
  /** Goes into the flow's layer SVG (back or front). Root: `<g class="flow" data-flow=...>`. */
  svg: SVGTemplateResult;
  /** Goes into the HTML layer of the same z level (icon shapes); absent when unused. */
  html?: TemplateResult;
}

export type FlowWithLook = ResolvedFlow & { look: FlowLookResolved; colorTo?: string };

/** The slot the chunk fills from install(). */
export interface FlowLookRenderer {
  /** Called by resolveFlow (has hass); `colorEntity` resolves `entity` colours like `color` does. */
  resolve(f: FlowConfig, base: ResolvedFlow, hass: HomeAssistant | undefined, colorEntity: string | undefined): FlowLookResolved;
  /** Moving elements this flow wants after the tier caps, before the card budget (0 when idle or reduced). */
  requested(f: FlowWithLook, geo: FlowGeometry, reduced: boolean, quality: FlowLookQuality): number;
  render(f: FlowWithLook, geo: FlowGeometry, opts: FlowLookRenderOptions): FlowLookParts;
  /** Styles for the mc-flows shadow root (rules 2-4); per-flow keyframes are not in it (rule 1). */
  readonly css: string;
}

/** magic-card.js side: src/card/flow-look-slot.ts (set once by install(), read by flow.ts and mc-flows). */
export interface FlowLookSlot {
  provide(r: FlowLookRenderer): void;
  get(): FlowLookRenderer | undefined;
}

/** mc-flows, after each render (additive public property `budget`); quality is the card's tier. */
export type FlowBudget = ReadonlyMap<string, { requested: number; drawn: number; quality: FlowLookQuality }>;
