import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ColorRange, FlowConfig, HomeAssistant } from '../types';
import type { FlowGeometry } from '../utils/flow-geometry';
import type { ResolvedFlow } from '../utils/flow';

/*
 * Contract: flow looks. Version 2.0.0.
 * Travel is transform keyframes in each flow's own <style> (compositor). There is no offset-path /
 * rotation probe, no SMIL fallback and no SMIL pause in mc-flows. `offsetPath`, `motion` and
 * `FlowMotionSupport` are not part of FlowLookRenderOptions; hosts pass neither. Unset cap_size =
 * 2 x width, at most 24 px (defaultCapSize, cap_size_default_max); highlight dashes are travelling bars.
 * FLOW_QUALITY_THRESHOLDS, FLOW_SPIN_SHAPES, FLOW_LOOK_KEYS and hasFlowLook live in
 * src/contracts/flow-look.needs.ts, the only file of this contract magic-card.js imports; this file
 * re-exports them.
 *
 * Seam: the flows Module (src/utils/flow.ts resolver, src/card/mc-flows.ts overlay, both in
 * magic-card.js) keeps today's look (solid line, dots or moving dashes, reduced-motion arrow) and
 * owns one renderer slot (src/card/flow-look-slot.ts). The flow-look Module (lazy chunk
 * magic-card-flow-look.js, entry src/flow-look/chunk.ts, lazy-module name 'flow-look') fills the slot
 * from install(). Nothing else
 * imports src/flow-look/**. Both sides build travel keyframes with the shared pure helpers in
 * src/utils/flow-motion.ts (travelFrames, flattenPath; magic-card.js, no DOM).
 *
 * ── YAML (flat keys on a flow, next to the existing ones; all optional) ──
 * FlowLookConfig below. A flow "has a look" when any FLOW_LOOK_KEYS key is not undefined
 * (hasFlowLook). A flow without a look never touches the chunk and renders exactly as before.
 * Existing keys keep their meaning and stay outside FLOW_LOOK_KEYS: `color` (line colour;
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
 *   pixels / random: count = min(40, max(1, floor(L / spacing))) (a line shorter than one
 *   spacing still carries one shape) and `dots` is ignored; random jitters each gap by up to
 *   +-50 % (seeded by the flow key: stable across renders). motion: pulse places shapes evenly
 *   whatever spacing_mode says. The card budget (40) still applies on top.
 * - Value-dependent options without an entity (thresholds, tube_fill_value) fall back silently:
 *   single colour, full tube.
 *
 * ── Path geometry ──
 * geo.d from flowPath() uses only absolute M, L, H, V, C and A commands (A: rx = ry, no rotation,
 * small arc; the elbow corners). The chunk's own sampler (src/flow-look/sampler.ts, about 3.8 KB
 * minified, 1.9 KB gzip) parses exactly that grammar; offsets and lengths come from it, never from
 * DOM measuring. Offset lines are emitted as polylines simplified by Douglas-Peucker at 0.2 px.
 *
 * Wave / zigzag: the offset is applied along the normal of the sampled centre line on every route.
 * Taper: the amplitude goes to 0 (smoothstep) at both path ends and on every elbow corner arc,
 * over T px on each side, T = min(12, run / 4), run = the straight or curved stretch between two
 * of those points. Only where T < 12 (a short stretch) is the amplitude on that stretch also
 * capped at T, so a short stub never gets a steep jump; long stretches keep the full amplitude
 * (up to 20 px) with the 12 px taper. Amplitude is also capped at 40 % of the local radius of
 * curvature (no loops). Computed once per geometry change, never per frame: the wave is still;
 * its motion is a moving highlight plus the shapes on the centre line. electric: three seeded
 * zigzag variants stacked, switched by a CSS steps() opacity animation (no per-frame JS).
 * Double rail: exact offset curves at +-(rail_gap + width) / 2, loops cut, mitred inner corners.
 * Where parallel runs of one route lie closer than the rail offset (short elbows) the rails of
 * different runs overlap: accepted, documented, not capped.
 *
 * Gradient: straight routes use one linearGradient from start to end
 * (userSpaceOnUse; exact there). Every other route draws N = clamp(ceil(L / 10), 4, 32) segments
 * of the same `d` (stroke-dasharray / dashoffset, no extra geometry), each in its opaque colour at
 * its arc-length position, overlapping the next by 1 px, all inside one <g opacity="a">, where a
 * is the average of the two end colours' alpha (their colours are drawn opaque). Two very
 * different end alphas are therefore approximated. On wave / zigzag lines the segments run along
 * the offset polyline (colour position off by the wave's length ratio, a few %: accepted).
 * Segments are static (no frame cost).
 *
 * Caps: start_cap / end_cap sit on the line's ends in the travel direction, size cap_size.
 * Unset cap_size (2 x width, so a tube's arrowhead does not cover module text): defaultCapSize(width)
 * = min(cap_size_default_max, cap_size_factor x width) = min(24, 2 x width) px; resolve() and the
 * editor placeholder both use it. Set: 4-40 px as written. round: a filled circle of diameter
 * 2/3 x cap_size with a 1 px ring in the card background colour. arrow: a filled triangle cap_size
 * long; the end arrow points forward along the tangent, the start arrow points out of the line
 * (backwards, away from the line), so both ends read as arrowheads of a two-headed line; the
 * direction of travel is carried by the end arrow and the shapes.
 *
 * ── Quality tiers (deterministic, no frame-time probe) ──
 * H = the number of heavy flows among the card's resolved flows (visible or not): line tube or
 * neon counts 1, zigzag with electric counts 0.5. mc-flows picks the tier once per render and
 * passes it as opts.quality; reduced motion wins over every tier.
 * - full (H <= 3): everything the YAML asks for.
 * - lite (3 < H <= 6): bubbles at most 2 per flow; flicker drawn as off; electric drawn as one
 *   still zigzag.
 * - minimal (H > 6): no bubbles, no moving highlight, no arrival ring or splash; travelling
 *   shapes at most 2 per flow; line style, level, static glow and the direction mark stay.
 * Tiers never change a line style (a tube stays a tube). Thresholds 3 and 6 are constants
 * (FLOW_QUALITY_THRESHOLDS); The cost is the number of moving elements (about 8 ms/s of
 * main thread per element at 4x), which the 40 cap and these tiers bound, so no probe is needed.
 * With transform keyframes a running flow measures about 0 % main thread at 4x, so the
 * tiers bound compositor layers, not main-thread time.
 *
 * ── Colours and contrast (floor-safe) ──
 * Paint the chunk writes itself is hex, rgb() / rgba(), `var(--primary-text-color, #212121)` or
 * the resolved line colour, with any transparency as a separate fill-opacity / stroke-opacity /
 * group opacity: never color-mix() (Chromium 85-110 rejects it as SVG paint).
 * Defaults in FLOW_LOOK_THEME. The light-theme neon core is the line colour with a black stroke at
 * 0.45 opacity drawn over it (per gradient segment too). A value the user sets (tube_tint,
 * neon_core, cable_color) is used as written. Information-carrying parts (tube wall, tube level
 * mark, neon core, cable outline) are >= 3:1 against the card surface on both themes (WCAG
 * 1.4.11): tools/check-look-contrast.mjs (node, no browser) composites each part of every preset
 * over #ffffff, #f2f2f2, #111111 and #1c1c1c with the HA default text colours (#212121 light,
 * #e1e1e1 dark) and exits 1 below 3.0. It runs with the release gate checks.
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
 *   ripples and splash droplets). mc-flows sums slot.requested() of look flows (after the tier
 *   caps) and the dots of classic flows, scales each moving flow to floor(n * 40 / total), at
 *   least 1, and passes it as `count`. After each render it exposes `budget` (FlowBudget).
 * - mc-flows renders `<style>${slot.css}</style>` once in its shadow root while any flow has a
 *   look, and one HTML layer per z level (`div.html.back` z-index 0, `div.html.front` z-index 2,
 *   inset 0, pointer-events none, pauseOffscreen()) for `html` parts (MDI icon shapes).
 * - No motion probe and no layout reads: travel needs only CSS
 *   transform animations, which every supported browser runs. Classic dots travel the same way: each
 *   classic flow with dots writes its own `@keyframes` (travelFrames over flattenPath(geo.d)) in a
 *   `<style>` next to its dots; the dash fallback is left only for `dots: 0`. mc-flows no longer
 *   calls pauseAnimations() / unpauseAnimations() (there is no SMIL to pause).
 * - mc-flows reflects `page-hidden` on its host while document.visibilityState is 'hidden'
 *   (visibilitychange listener, removed on disconnect). flows-css.ts pauses the classic dots and
 *   dashes under :host([page-hidden]) too. The shared offscreen observer (Core) is not changed.
 * - Background layers (layer-placement 1.0.0): containers holding
 *   background modules are isolated and lifted to z-index 1 by layer-css.ts; flows
 *   `layer: back` (classic and look, SVG and HTML layer) pass under them, `layer: front` and labels
 *   draw over every layer. The flow-look chunk never sets z-index or isolation outside mc-flows'
 *   shadow root and never changes the back 0 / front 2 levels.
 *
 * ── Renderer rules (the chunk) ──
 * 1. Pure templates from (flow, geo, opts); no requestAnimationFrame loops, no timers, no layout
 *    reads. Motion is CSS and stays on the compositor: transform and opacity only, with one
 *    exception, the dashed / dotted line style sliding its own dash pattern by stroke-dashoffset
 *    (main thread, same as the classic `dots: 0` dash; accepted). Travelling elements (dots,
 *    shapes, tube bubbles, icon shapes, highlight bars) play `transform` keyframes sampled from the
 *    centre line or the offset line: translate, plus rotate to the travel direction for shapes that
 *    turn (src/flow-look/motion.ts stops(): a stop about every 5 px on curves and corner arcs, the
 *    ends of straight pieces, and a snap to the new direction at a sharp corner). Each flow writes
 *    its keyframes, named `mc-flow-<index>-<kind>` with numbers rounded to 0.01 px / 0.001 %, in a
 *    `<style>` element of its own inside its template (per-instance geometry; no config text reaches it). Elements share one set of keyframes
 *    per flow and are staggered by a negative animation-delay; a backwards flow plays them with
 *    animation-direction reverse (turning shapes use a second set turned 180 degrees). Highlight
 *    dashes are straight bars (at most 24 per line; on a wave or zigzag at most a third of the
 *    wavelength long, so they do not bend at corners). No offset-path / offset-distance, no SMIL.
 * 2. No `filter` on an animated element or any ancestor of one. Shape glow and the neon mid layer
 *    are wider translucent strokes or shapes. The neon outer layer may be a static
 *    blur(<= 8 px) when flicker is off; with flicker on it is stacked translucent strokes.
 *    On a neon line the travelling shapes also get the neon glow: a translucent halo shape
 *    of the neon glow size riding with each shape (the dot-glow pattern; it is the same moving
 *    element for the 40 budget, never a filter). No `vector-effect: non-scaling-stroke` on an
 *    animated element (it keeps a transform animation off the compositor): the arrival ring's
 *    stroke scales with it.
 * 3. opts.reduced: nothing moves (no travel, highlight, bubbles, flicker, pulse, ripple, splash),
 *    travelling shapes are removed, so nothing spins either; the line stays in its style (wave
 *    keeps its shape, tube its level, neon full brightness), and a direction mark stays: the arrow
 *    end cap when set, else a 14 px chevron in the line colour every 160 px (at least one, at
 *    55 % on short lines), >= 3:1 against the surface. Idle (direction 0): still line in the idle
 *    colour, no shapes, bubbles hidden, liquid empty with the wall and a 2 px level mark at the
 *    start end kept. Reduced motion is decided in JS (no travelling elements are
 *    rendered), so an inline animation-name can never outrank the reduced-motion CSS.
 * 4. Every CSS animation of the chunk carries class `an` and pauses under `svg[offscreen]`,
 *    `div.html[offscreen]` and `:host([page-hidden])` with `animation-play-state: paused
 *    !important` (inline `animation:` shorthands reset the play state, so the rule must win),
 *    and is `animation: none` under `@media (prefers-reduced-motion: reduce)`. Flicker never
 *    exceeds 2 dips per second (WCAG 2.3.1).
 * 5. Direction: start / end, caps, gradients and the tube fill follow the travel direction
 *    (direction -1: start is the `to` end). Shapes point along the path tangent through elbow
 *    corners: the rotate() in their transform keyframes; icons too when
 *    shape_icon_rotate, else they travel upright (translate only). Spin is a second animation on
 *    an inner element, added to the tangent (never on the travelling element itself).
 * 6. Every route (curve, straight, elbow) and both layers, through the sampler above.
 * 7. Keeps `g.flow[data-flow]` and `path.line` (studio flowAt() and the selection halo, which
 *    mc-flows still draws, rely on them). `path.line` is the centre line (may be transparent).
 * 8. shape: icon without shape_icon draws a dot (never an empty line).
 * 9. opts.quality caps are applied in requested() and render() alike.
 *
 * Frame budget (a wall tablet): a card with 6 tube or neon flows, bubbles on, holds
 * >= 50 fps with no frame over 50 ms at 4x CPU throttling on the gallery card built for it, and
 * costs 0 main-thread time per frame while off-screen or page-hidden. Measured: 110-139 fps, worst
 * frame 35 ms, for 36-48 moving elements. Six heavy flows running: about 0 % main thread
 * at 4x in headless Chrome (software drawing); a real tablet GPU is not covered.
 * Device checks (not provable in headless Chrome): Safari / iOS 16.4 rotation through elbows on the
 * gallery card; Chromium 85 floor.
 */

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
