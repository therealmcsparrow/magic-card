import type { TemplateResult } from 'lit';
import type { ShapeKind, ShapeOptions, SliderModuleConfig } from '../types';
import type { ModuleView } from './lazy-module';

/*
 * Contract: slider looks. Version 1.0.0 (Architect-owned). ADR 0037. Task flow-slider-styles.
 * r2 2026-10-19 (designer round 1 request R5 and question 1, folded into 1.0.0 in place per
 * ADR 0020, nothing built yet): entity colour combines with fill modes, touch-action / capture
 * rules, failed-call feedback through runServiceCall's onError, lingering bubble, outlines and
 * flat glass colours, rem label sizes, live on every style.
 * r4 2026-10-20 (build deviations agreed after the build, still unreleased, so 1.0.0 in place):
 * error state 5 s; outline opacity 0.55; in-track value as a chip; auto-brightness ramp as a 75 %
 * black overlay; inline <style> exception (lit.S7); AC11 reading; no restore after a cancelled
 * live drag; 12rem vertical big-fill height; show_icon / icon / icon_position confirmed.
 * Applies to `type: slider` only (the light module's track and the slider layout are unchanged).
 *
 * Seam: the slider Module (src/modules/controls/slider-module.ts, magic-card.js) keeps today's
 * markup and owns one view slot (src/modules/controls/slider-look-slot.ts). The slider-look Module
 * (lazy chunk magic-card-slider-look.js, entry src/slider-look/chunk.ts, lazy-module 1.2.0 name
 * 'slider-look'; 1.3.0 if the background-layers run merges first) fills it from install() with a
 * ModuleView. Nothing else imports src/slider-look/**. Not to be confused with the existing
 * 'slider' chunk, which is the slider layout (swiper).
 *
 * ── YAML (flat keys on the slider module; all optional) ──
 * SliderLookConfig below. A slider "has a look" when any SLIDER_LOOK_KEYS key is not undefined
 * (hasSliderLook). Without a look the module renders exactly as before (AC1) and never loads the
 * chunk. Existing keys keep their meaning: `slider_color` (fill colour; the gradient's start),
 * `track_color`, `show_value`, `direction`, `min` / `max` / `step`.
 *
 * Precedence:
 * - Value display: `show_value: false` hides the value whatever `value_position` says. The editor
 *   keeps them in sync (Hidden writes show_value: false; picking a position removes show_value).
 * - Fill colour source (they combine): the start colour S is the light's rgb when
 *   use_entity_color is on and the light reports one (lifted to 3:1 against the empty track),
 *   else slider_color. fill_mode then decides the shape of the fill:
 *   solid (also unset, for every entity, AC1) -> S;
 *   gradient -> S to slider_color_to;
 *   auto, brightness -> S under a linear rgba(0,0,0,0.75) -> rgba(0,0,0,0) overlay along the axis,
 *   darkest at the low end (r4; replaces "25 % to 100 % lightness", which needs color-mix());
 *   auto, colour temperature (kelvin) -> #ffa94d to #bfe0ff (S not used);
 *   auto, any other entity -> solid S.
 *   The editor never disables Gradient or Auto because of use_entity_color.
 * - thumb options apply to circle / pill / square; thumb_icon only to those; none of them to
 *   line or none. Style-specific keys of another style are kept in YAML and ignored.
 * - stops outside [min, max] are ignored at render; with `snap`, drag and keys go stop to stop.
 * - live works on every track style (the Big fill preset sets it).
 * - big-fill (r4, confirmed): show_icon (default true) shows the entity's icon or `icon`;
 *   icon_position start (default) or center (center only for vertical).
 *
 * ── magic-card.js side (slider Module) ──
 * - types.ts: `SliderModuleConfig extends SliderLookConfig`.
 * - renderPreview: hasSliderLook(c) and the slot is filled -> slot.renderPreview(c, hass). Slot
 *   empty -> start the 'slider-look' load, whenReady -> currentRenderContext()?.requestUpdate, and
 *   render today's markup meanwhile (failed: today's markup for good, no retry).
 * - prefetchLazy(config) loads 'slider-look' when a slider module (nested included, card_config
 *   skipped) hasSliderLook.
 * - src/utils/slider-track.ts: TrackOptions extends TrackOptionsLook (below), additive;
 *   interaction, ARIA and keyboard stay in renderTrack; the chunk imports it, never copies it.
 *   Contractual: touch-action pan-y (horizontal) / pan-x (vertical) on the track; pointer capture
 *   from pointerdown for a mouse and after the 8 px drag intent for touch and pen (so the page
 *   still scrolls across the track); pointercancel sends nothing and restores the value, except
 *   during a live drag (r4): values already sent stay, so the fill keeps the last sent value
 *   instead of jumping back to a value the entity no longer has; pointer and click events never
 *   leave the track (a slider layout never swipes from a drag that started on it).
 * - src/utils/entity-control.ts runServiceCall(hass, call, onError?): additive optional
 *   callback, called once when the call rejects (the console warning stays).
 *   src/utils/pending-value.ts gains clearPendingValue(key) if it has no equivalent, so a failed
 *   call snaps the fill back to the entity's value.
 *
 * ── Renderer rules (the chunk) ──
 * 1. The focusable element is always renderTrack's `.mc-tile-slider` with role=slider and
 *    aria-valuenow / min / max / valuetext, for every thumb including none (AC10). With stops,
 *    valuetext is "<label>, <value text>" when the value sits on a labelled stop.
 * 2. Keys: arrows by step, Page Up / Down by a tenth, Home / End; with snap: arrows and Page go to
 *    the next / previous stop (nextValue).
 * 3. live (default false; the Big fill preset sets it, CEO 2026-10-19): during a drag service calls
 *    go out at most 4 per second (250 ms throttle, leading and trailing) through onInput, and the
 *    final value always goes out on release (onCommit). AC11 reading (r4): the throttled calls are
 *    at most 4 in any second; the release call is extra and may fall in the same second, so a
 *    drag shorter than one second can send 5. Without live: only on release (today).
 * 4. Shape (track_shape): track and fill are clipped to shapePath() (src/utils/shape-path.ts, from
 *    magic-card.js; custom shapes through the custom-shape 1.0.0 loader); the clip sits on an inner
 *    element, never on the focusable element or its ancestors, so the focus ring is never clipped
 *    (AC13). A 1 px outline of the shape in the track colour at 40 % shows an empty fill.
 * 5. Contrast: thumb vs track >= 3:1; focus ring 2 px accent with a 1 px inner ring in the
 *    opposite of the surface (>= 3:1 on any fill); the big-fill icon flips light / dark for
 *    >= 4.5:1 (AC13). (r4) The in-track value is a chip (text colour background, surface colour
 *    text, like the bubble), so it reaches 4.5:1 on any fill without flipping. Thin, segmented and
 *    pill tracks, the Minimal and Neon presets and both glass states draw a 1 px outline in the
 *    theme text colour at 0.55 opacity (r4, was 0.45: 0.45 missed 3:1 on #f2f2f2). Glass flat
 *    (glass_blur off): track = text colour at 0.08, fill = slider colour at 0.70 with a 0.25 top
 *    highlight in the surface colour; glass_blur adds backdrop-filter: blur(8px) on a static
 *    element, dropped where unsupported. Paint is floor-safe: rgba() / separate opacity, never
 *    color-mix() (flow-look 1.0.0 colour rule).
 * 6. Motion: thumb scale on drag and the bubble fade are off under reduced motion (the bubble then
 *    appears and disappears without a fade). No animation runs while idle; the only timers are the
 *    live throttle, the 2 s bubble linger and the error state, all started by input.
 * 7. Thin and segmented tracks keep a 40 px hit area (touch).
 * 8. value_position bubble: shown while dragging, on keyboard focus, and for 2 s after release
 *    or a tap (touch has no hover).
 * 9. Failed call (onError): the fill snaps back, and for 5 s (r4, was 1.5 s: WCAG 2.2.1, testers
 *    asked for >= 3 s) the track shows a 2 px outline in var(--error-color) plus a 16 px mdi:alert
 *    at the value end (replacing the value beside it), and a visually hidden role=status says
 *    "Couldn't set {name}" (card i18n namespace). Never colour alone; no shake.
 * 10. Min / max, tick and stop labels use rem (0.75rem default), not px.
 * 11. (r4) Styles: the view renders `<style>${css}</style>` as the first child of its template, a
 *    written exception to lit.S7 (static styles): the view is a template inside the card's shadow
 *    root, not its own element, so it has no `static styles`; the inline sheet also orders before
 *    the card's adopted sheet as intended. Lit renders the same string once per instance; no
 *    other chunk may copy this pattern without an exception of its own.
 * 12. (r4) Vertical big-fill: 12rem tall (max 100 % minus 3rem), so it has a height inside an
 *    auto-height column; module design height still wins where set.
 */

export const SLIDER_LOOK_CONTRACT = '1.0.0';
export const SLIDER_LOOK_CONTRACT_REVISION = 4;

export type SliderTrackStyle = 'standard' | 'thin' | 'pill' | 'segmented' | 'glass' | 'big-fill';
export type SliderThumb = 'line' | 'circle' | 'pill' | 'square' | 'none';

export const SLIDER_LOOK_DEFAULTS = {
  track_style: 'standard',
  /** Thickness per style (px, 2-96); vertical uses it as width. Vertical big-fill height: 12rem. */
  track_thickness: { standard: 40, thin: 6, pill: 16, segmented: 16, glass: 28, 'big-fill': 64 },
  /** Track corners (px, 0-48): unset follows the style (standard: --mc-slider-radius; pill: 999; big-fill: 20). */
  segment_gap: 2, // 1-8 px; segments unset: from step, at most 20 (2-20)
  glass_blur: false,
  fill_mode: 'solid',
  use_entity_color: false,
  show_icon: true, // big-fill only
  icon_position: 'start',
  live: false,
  thumb: 'line',
  /** Thumb long side (px, 4-64) per shape; line: 50 % of the thickness; pill short side = 0.57 x size. */
  thumb_size: { circle: 20, pill: 28, square: 18 },
  thumb_border: 0, // 0-6 px
  thumb_border_color: '#ffffff',
  thumb_glow: 0, // 0-30 px, colour follows the fill
  value_position: 'beside',
  bubble_linger_ms: 2000,
  error_ms: 5000,
  live_throttle_ms: 250,
  outline_opacity: 0.55,
  brightness_overlay: 'rgba(0, 0, 0, 0.75)',
  vertical_big_fill_height: '12rem',
  ticks: false,
  show_limits: false,
  snap: false,
  max_stops: 12,
} as const;

export interface SliderStop {
  value: number;
  /** Shown under the tick (8 characters, full text in aria-valuetext). */
  label?: string;
}

export interface SliderLookConfig {
  /** Track style; unset = standard (today). Picking standard in the editor removes the key. */
  track_style?: SliderTrackStyle;
  track_thickness?: number;
  /** Track corners (px); the module's own corners stay in the Design tab. */
  track_radius?: number;
  /** segmented: number of segments and the gap between them (px). */
  segments?: number;
  segment_gap?: number;
  /** glass: blur what is behind the track (CEO 2026-10-19); false = flat translucent fill. */
  glass_blur?: boolean;
  /** Fill shape; precedence in the header. */
  fill_mode?: 'solid' | 'gradient' | 'auto';
  /** gradient: end colour (the start is the fill colour source). */
  slider_color_to?: string;
  /** P5 The light's own colour as the fill's start colour (combines with fill_mode). */
  use_entity_color?: boolean;
  /** big-fill: show the entity's icon (default true) or `icon`. */
  show_icon?: boolean;
  /** big-fill: icon instead of the entity's (mdi:name). */
  icon?: string;
  /** big-fill: icon position; center only for vertical. */
  icon_position?: 'start' | 'center';
  /** Update the entity while dragging (at most 4 calls a second), every track style; default false. */
  live?: boolean;
  /** Thumb ("Handle" in the UI); unset = line (today's grip). Picking line removes the key. */
  thumb?: SliderThumb;
  thumb_size?: number;
  thumb_border?: number;
  thumb_border_color?: string;
  thumb_glow?: number;
  /** MDI icon in a circle / pill / square thumb. */
  thumb_icon?: string;
  /** Where the value shows; precedence with show_value in the header. track = a chip in the track. */
  value_position?: 'beside' | 'bubble' | 'track' | 'hidden';
  /** Tick marks; tick_every unset = auto (5-10 ticks). */
  ticks?: boolean;
  tick_every?: number;
  /** Min and max labels at the ends. */
  show_limits?: boolean;
  /** (m) Track shape from the shapes system. */
  track_shape?: ShapeKind;
  track_shape_options?: ShapeOptions;
  /** P4 Named stops (at most 12) and snapping to them. */
  stops?: SliderStop[];
  snap?: boolean;
}

/** Every look key; any of them set = the slider needs the slider-look chunk. */
export const SLIDER_LOOK_KEYS: readonly (keyof SliderLookConfig)[] = [
  'track_style', 'track_thickness', 'track_radius', 'segments', 'segment_gap', 'glass_blur', 'fill_mode',
  'slider_color_to', 'use_entity_color', 'show_icon', 'icon', 'icon_position', 'live', 'thumb', 'thumb_size',
  'thumb_border', 'thumb_border_color', 'thumb_glow', 'thumb_icon', 'value_position', 'ticks', 'tick_every',
  'show_limits', 'track_shape', 'track_shape_options', 'stops', 'snap',
];

export const hasSliderLook = (c: Partial<SliderModuleConfig> | undefined): boolean =>
  !!c && SLIDER_LOOK_KEYS.some((k) => (c as Record<string, unknown>)[k] !== undefined);

/** Additive options of renderTrack (src/utils/slider-track.ts TrackOptions extends this). */
export interface TrackOptionsLook {
  /** Extra children inside the track after the bar (thumb, ticks, bubble, icon, value, error mark). */
  parts?: TemplateResult;
  /** Each drag move, with the snapped value (live updates, bubble text). */
  onInput?: (value: number) => void;
  /** Drag ended (release, tap or cancel): starts the bubble linger. */
  onRelease?: () => void;
  /** Drag snapping (stops); default snapValue to step. */
  snap?: (value: number) => number;
  /** Key handling override (stops); undefined = renderTrack's default for that key. */
  nextValue?: (current: number, key: string) => number | undefined;
}

/** The slot the chunk fills from install(): the full slider view for a slider with a look. */
export type SliderLookView = ModuleView;

/** magic-card.js side: src/modules/controls/slider-look-slot.ts. */
export interface SliderLookSlot {
  provide(v: SliderLookView): void;
  get(): SliderLookView | undefined;
}
