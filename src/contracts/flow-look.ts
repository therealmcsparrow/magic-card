import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ColorRange, FlowConfig, HomeAssistant } from '../types';
import type { FlowGeometry } from '../utils/flow-geometry';
import type { ResolvedFlow } from '../utils/flow';

/*
 * Contract: flow looks. Version 1.0.0 (Architect-owned). ADR 0037. Task flow-slider-styles.
 *
 * Seam: the flows Module (src/utils/flow.ts resolver, src/card/mc-flows.ts overlay, both in
 * magic-card.js) keeps today's look (solid line, dots or moving dashes, reduced-motion arrow) and
 * owns one renderer slot (src/card/flow-look-slot.ts). The flow-look Module (lazy chunk
 * magic-card-flow-look.js, entry src/flow-look/chunk.ts, lazy-module 1.2.0 name 'flow-look')
 * fills the slot from install(). Nothing else imports src/flow-look/**.
 *
 * ── YAML (flat keys on a flow, next to the existing ones; all optional) ──
 * FlowLookConfig below. A flow "has a look" when any FLOW_LOOK_KEYS key is not undefined
 * (hasFlowLook). A flow without a look never touches the chunk and renders exactly as before
 * (AC1). Existing keys keep their meaning and stay outside FLOW_LOOK_KEYS: `color` (line colour;
 * the gradient's start), `idle_color`, `width`, `scale_width`, `glow` (shape glow), `dots`
 * (count of travelling shapes, 0-8), `dot_size` (shape size, 1-40), `speed` / `min_speed`
 * (travel time; pulse: the pulse period is the travel time / count).
 *
 * Mode precedence (one rule for both modes; the other mode's keys stay in YAML, unused):
 * - Colour: `color_mode` decides when set. Unset: `thresholds` present -> value; else `color_to`
 *   present -> gradient; else single. single uses `color`; gradient `color` -> `color_to`;
 *   value: the last `thresholds` entry whose `from` <= |value| (no match, or no value: `color`).
 *   The editor writes `color_mode` only when the user switches mode.
 * - Spacing: `spacing_mode` decides when set. Unset: `spacing` present -> pixels; else even.
 *   pixels / random: count = min(40, floor(length / spacing)) and `dots` is ignored; random
 *   jitters each gap by up to +-50 % (seeded by the flow key: stable across renders).
 *   motion: pulse places shapes evenly whatever spacing_mode says.
 * - Value-dependent options without an entity (thresholds, tube_fill_value) fall back silently:
 *   single colour, full tube.
 *
 * Wave / zigzag geometry (designer question 2, settled): the offset is applied along the normal of
 * the sampled centre line on every route. The amplitude tapers to 0 over the first and last 12 px
 * of the path and over 12 px on each side of an elbow corner arc (so anchors, caps and corners
 * stay clean), and is capped at 40 % of the local radius of curvature on curves (no loops on tight
 * curves). The shape is computed once per geometry change, never per frame: the wave is still,
 * and its motion is a moving highlight dash plus the shapes on the centre line. electric: three
 * seeded zigzag variants stacked, switched by a CSS steps() opacity animation (no per-frame JS).
 *
 * ── magic-card.js side (flows Module) ──
 * - types.ts: `FlowConfig extends FlowLookConfig`.
 * - resolveFlow() adds `value` (signed number, undefined without one) and `t` (the 0..1 log
 *   curve it already computes; 1 without an entity) to every ResolvedFlow, and, when
 *   hasFlowLook(f) and the slot is filled, `look = slot.resolve(...)`. Slot empty: no `look`,
 *   the flow renders the classic way (chunk loading, or failed: classic for good, no retry).
 * - prefetchLazy(config) loads 'flow-look' when any `config.flows` entry hasFlowLook; the card
 *   re-resolves its flows once (whenReady -> requestUpdate).
 * - mc-flows: a flow with `look` is drawn by slot.render(); every other flow by today's _flow().
 *   Card budget: MAX_CARD_DOTS (40) covers every element that moves (dots, shapes, bubbles,
 *   ripples and splash droplets). mc-flows sums slot.requested() of look flows and the dots of
 *   classic flows, scales each moving flow to floor(n * 40 / total), at least 1, and passes it as
 *   `count`. After each render it exposes `budget` (FlowBudget) for the editor's "some shapes are
 *   skipped" notice.
 * - mc-flows renders `<style>${slot.css}</style>` once in its shadow root while any flow has a
 *   look, and one HTML layer per z level (`div.html.back` z-index 0, `div.html.front` z-index 2,
 *   inset 0, pointer-events none, pauseOffscreen()) for `html` parts (MDI icon shapes, spike S1).
 *
 * ── Renderer rules (the chunk) ──
 * 1. Pure templates from (flow, geo, opts); no requestAnimationFrame loops, no timers, no layout
 *    reads. Motion is CSS: offset-distance, transform, opacity, stroke-dashoffset only.
 * 2. No `filter` (SVG or CSS) on an animated element or any ancestor of one. Glows (shape glow,
 *    neon outer and mid layer) are wider translucent strokes or shapes, the current dot-glow
 *    pattern. A static blur on a non-animated neon outer layer (flicker off) is allowed only if
 *    spike S3 measures it within the frame budget, with the blur radius capped at 12 px.
 * 3. opts.reduced: nothing moves (no travel, highlight, bubbles, flicker, pulse, spin, ripple,
 *    splash); the line stays in its style (wave keeps its shape, tube its level, neon full
 *    brightness), shapes are removed, and one direction mark stays: the arrow end cap when set,
 *    else a 10 px chevron in the line colour at 55 % of the path. Idle (direction 0): still line
 *    in the idle colour, no shapes, bubbles hidden, liquid empty (AC5).
 * 4. Every animation in `css` pauses under `svg[offscreen]` and `div.html[offscreen]` and is
 *    `animation: none` under `@media (prefers-reduced-motion: reduce)`. Flicker never exceeds
 *    2 dips per second (WCAG 2.3.1).
 * 5. Direction: start / end, caps, gradients and the tube fill follow the travel direction
 *    (direction -1: start is the `to` end). Shapes point along the path tangent (offset-rotate:
 *    auto; icons when shape_icon_rotate), through elbow corners (AC6, AC7). Spin is a rotation on
 *    an inner element, added to the tangent.
 * 6. Every route (curve, straight, elbow) and both layers (AC4). geo.d uses only M, L, C and A
 *    commands (flow-geometry), so offsets and lengths come from the chunk's own sampler for that
 *    grammar (spike S2), never from DOM measuring.
 * 7. Keeps `g.flow[data-flow]` and `path.line` (studio flowAt() and the selection halo, which
 *    mc-flows still draws, rely on them). `path.line` is the centre line (may be transparent).
 * 8. shape: icon without shape_icon draws a dot (never an empty line).
 *
 * Frame budget (AC15, Sanne's wall tablet): a card with 6 tube or neon flows, bubbles on, holds
 * >= 50 fps with no frame over 50 ms in Chromium DevTools at 4x CPU throttling on the gallery
 * card built for it, and costs 0 main-thread time per frame while off-screen.
 */

export const FLOW_LOOK_CONTRACT = '1.0.0';

export type FlowLineStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'wave' | 'zigzag' | 'tube' | 'neon' | 'cable';
export type FlowShape = 'dot' | 'arrow' | 'chevron' | 'square' | 'diamond' | 'star' | 'comet' | 'spark' | 'bubble' | 'drop' | 'icon';
export type FlowCap = 'none' | 'round' | 'arrow';

/** Shapes the `shape_spin` switch applies to (CEO 2026-10-19). */
export const FLOW_SPIN_SHAPES: readonly FlowShape[] = ['star', 'square', 'diamond', 'icon'];

/** Defaults and ranges (clamped by resolve(); the editor uses the same numbers). */
export const FLOW_LOOK_DEFAULTS = {
  line_style: 'solid',
  dash_length: 10, // 2-40
  dash_gap: 6, // 2-40 (dashed and dotted)
  rail_gap: 6, // 2-24
  amplitude: 6, // 1-20
  wavelength_wave: 32, // 8-80
  wavelength_zigzag: 24, // 8-80
  electric: false,
  tube_tint: 'color-mix(in srgb, #fff 18%, transparent)',
  bubbles: true, // on once line_style is tube
  bubble_count: 4, // 1-8
  tube_fill_value: false,
  flicker: 'off',
  neon_core: 'color-mix(in srgb, #fff 85%, transparent)',
  neon_glow: 8, // `glow` unset on a neon line
  twisted: false,
  color_mode: 'single',
  start_cap: 'none',
  end_cap: 'none',
  cap_size_factor: 3, // cap_size unset: 3 x width; set: 4-40 px
  shape: 'dot',
  shape_icon_rotate: true,
  shape_spin: false,
  spacing_mode: 'even',
  spacing: 32, // 4-400 px
  size_variation: 0, // 0-60 %
  motion: 'travel',
  arrival: 'none',
  arrival_size: 24, // 8-80 px
  /** Style default widths (placeholder of `width` while it is unset). */
  width: { tube: 12, neon: 3, cable: 5 },
} as const;

export interface FlowLookConfig {
  /** Line style; unset = solid (today's line). Picking solid in the editor removes the key. */
  line_style?: FlowLineStyle;
  /** dashed: dash length (px). */
  dash_length?: number;
  /** dashed / dotted: gap (px). Dotted dots are `width` wide (round caps). */
  dash_gap?: number;
  /** double: gap between the two rails (px); each rail is `width` wide. */
  rail_gap?: number;
  /** wave / zigzag: height (px). */
  amplitude?: number;
  /** wave / zigzag: length of one period (px). */
  wavelength?: number;
  /** zigzag: electric flicker. */
  electric?: boolean;
  /** tube: glass tint (colour). The liquid is `color` (or the active colour mode). */
  tube_tint?: string;
  /** tube: rising bubbles while flowing (default on for a tube). */
  bubbles?: boolean;
  bubble_count?: number;
  /** P3 tube: liquid length = (|value| - min) / (max - min), from the start end; needs an entity. */
  tube_fill_value?: boolean;
  /** neon: flicker strength. */
  flicker?: 'off' | 'subtle' | 'strong';
  /** neon: core colour. */
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
  /** Caps at the start / end of the line, in the travel direction. */
  start_cap?: FlowCap;
  end_cap?: FlowCap;
  /** Cap size (px); unset = 3 x width. */
  cap_size?: number;
  /** Travelling shape; unset = dot. */
  shape?: FlowShape;
  /** shape: icon, the MDI icon (mdi:name). */
  shape_icon?: string;
  /** shape: icon, turn with the line (default true; false keeps it upright). */
  shape_icon_rotate?: boolean;
  /**
   * Spin (CEO 2026-10-19): star, square, diamond and icon shapes turn a full circle every 3 s on
   * top of the tangent; default false; ignored for other shapes; still under reduced motion.
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
  /** Gap between shapes (px). */
  spacing?: number;
  /** travel (default) or pulse: shapes stay put and pulse, faster with a higher value. */
  motion?: 'travel' | 'pulse';
  /** P2 effect at the arriving end each time a shape arrives (none under pulse). */
  arrival?: 'none' | 'ring' | 'splash';
  arrival_size?: number;
}

/** Every look key; any of them set = the flow needs the flow-look chunk. */
export const FLOW_LOOK_KEYS: readonly (keyof FlowLookConfig)[] = [
  'line_style', 'dash_length', 'dash_gap', 'rail_gap', 'amplitude', 'wavelength', 'electric', 'tube_tint', 'bubbles',
  'bubble_count', 'tube_fill_value', 'flicker', 'neon_core', 'cable_color', 'twisted', 'color_mode', 'color_to',
  'thresholds', 'start_cap', 'end_cap', 'cap_size', 'shape', 'shape_icon', 'shape_icon_rotate', 'shape_spin',
  'shape_color', 'shape_alternate', 'size_variation', 'spacing_mode', 'spacing', 'motion', 'arrival', 'arrival_size',
];

export const hasFlowLook = (f: Partial<FlowConfig> | undefined): boolean =>
  !!f && FLOW_LOOK_KEYS.some((k) => (f as Record<string, unknown>)[k] !== undefined);

/**
 * What resolve() returns, stored as ResolvedFlow.look: JSON-safe (mc-flows compares flows by
 * JSON), colours resolved to CSS strings, numbers clamped and defaulted, modes decided. The colour
 * mode result is applied to ResolvedFlow.color (single / value) or color + colorTo (gradient).
 */
export interface FlowLookResolved {
  line: FlowLineStyle;
  dashLength: number;
  dashGap: number;
  railGap: number;
  amplitude: number;
  wavelength: number;
  electric: boolean;
  tubeTint: string;
  /** Bubble count; 0 = none. */
  bubbles: number;
  /** 0..1 liquid level (1 unless tube_fill_value with a value). */
  level: number;
  flicker: 'off' | 'subtle' | 'strong';
  neonCore: string;
  cableColor?: string;
  twisted: boolean;
  colorTo?: string;
  startCap: FlowCap;
  endCap: FlowCap;
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
  /** The flow's index on the card (unique ids: `mc-flow-<kind>-<index>`). */
  index: number;
  reduced: boolean;
  /** offset-path works on SVG here (mc-flows' probe); false: no travelling shapes, a moving dash instead. */
  offsetPath: boolean;
  /** Moving elements this flow may draw (card budget applied). */
  count: number;
  dark: boolean;
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
  /** Moving elements this flow wants before the card budget (0 when idle or reduced). */
  requested(f: FlowWithLook, geo: FlowGeometry, reduced: boolean): number;
  render(f: FlowWithLook, geo: FlowGeometry, opts: FlowLookRenderOptions): FlowLookParts;
  /** Styles for the mc-flows shadow root (rules 2-4). */
  readonly css: string;
}

/** magic-card.js side: src/card/flow-look-slot.ts (set once by install(), read by flow.ts and mc-flows). */
export interface FlowLookSlot {
  provide(r: FlowLookRenderer): void;
  get(): FlowLookRenderer | undefined;
}

/** mc-flows, after each render (additive public property `budget`). */
export type FlowBudget = ReadonlyMap<string, { requested: number; drawn: number }>;
