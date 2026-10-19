import type { HomeAssistant } from '../types';
import type { LayerAnchor, LayerBlend } from './layer-placement';

/*
 * Contract: card background stack ("Card backdrop" in the UI). Version 1.0.0 revision 3
 * (Architect-owned). ADR 0038. Task background-layers (brief topic 4; CEO: max 4 layers, pan/zoom on
 * images and camera snapshots only, this topic is trimmed first if the magic-card.js budget runs
 * short). r2 (2026-10-19, folded into 1.0.0; designer 11-ui-ux-designer.md, spikes S1 and S2):
 * pan_zoom.pause_when_idle, stale_badge and the badge host, status reason `stale`, page-hidden pause,
 * first-paint fade, low power, floor-safe CSS, blend scope, blur max 24 px and the performance rules
 * (layer-placement 1.0.0 "Performance rules" bind here too). r3 (2026-10-20, folded into 1.0.0):
 * the 'layers' chunk also carries the layer-placement runtime; `to <side>` gradient heads;
 * CardAppearanceOverrides gains `background_layers`; card pause stops the stack.
 *
 * Seam: magic-card.js (Core render pipeline) renders `<mc-bg-stack>` as the first child of
 * .mc-card-content when the resolved card config has a non-empty `background_layers`, and prefetches
 * the lazy chunk 'layers' (dist/magic-card-layers.js, lazy-module 1.2.0 r2, entry
 * src/layers/stack/chunk.ts) from setConfig / template merge when the key is present. The chunk's
 * install() defines <mc-bg-stack> and fills the layer slot (layer-placement 1.0.0 r3). Everything the
 * element needs from magic-card.js comes through its `host` property (BgStackHost), so the chunk
 * never imports magic-card.js modules other than shared utils that stay there (ceiling 24 KiB for
 * the whole chunk; cap = measured + 5 %, rounded up to 1 KiB).
 * Before the chunk is defined the element is empty: the card shows its own `background` /
 * `background_image` only (fallback = the bottom of the stack).
 *
 * ── YAML (card level; also allowed in conditional_appearance overrides) ──
 *   background_layers:            at most MAX_BACKGROUND_LAYERS; extra entries are ignored (editor
 *                                 blocks adding a 5th). FIRST ENTRY = FRONT (CSS convention, Q-UX5).
 *     - type: image | gradient | pattern | color
 *       hidden: boolean           eye toggle; hidden layers render nothing and stay in YAML
 *       opacity: 0-100            default 100
 *       blend: LayerBlend         default normal (scope: layer-placement "Blend scope")
 *       # image
 *       image: url | media-source id | /local/...   "One picture"; with `states` it is "Any other state"
 *       entity: entity id         "Follows a device": picture from `attribute`; omitted = the card
 *                                 entity (entity-scope 1.x effective card entity), so `states` alone works
 *       attribute: string         default entity_picture
 *       states: { <state>: image } "Changes with state": exact state match, else `image`, else next layer
 *       refresh: seconds          camera.* only; default 10, minimum 5; snapshot re-fetched while on
 *                                 screen, page visible and card not paused (cache-busting query)
 *       stale_badge: boolean      camera.* only; default true. See "Stale snapshots".
 *       position: LayerAnchor | "<x>% <y>%"   default center
 *       size: cover | contain | auto | "<n>%"  default cover
 *       repeat: no-repeat | repeat | repeat-x | repeat-y   default no-repeat; ignored with cover
 *       blur: 0-24 px             image only (BLUR_MAX, S1); above 12 is "heavy" in the cost meter;
 *                                 bleed 3 x blur on each side inside the clip
 *       pan_zoom:                 image only (pictures and camera snapshots; never live streams)
 *         from: 100-200 (%)       default 100
 *         to: 100-200 (%)         default 115
 *         focus: LayerAnchor      default center; where the framing ends
 *         duration: 10-120 s      default 30
 *         alternate: boolean      default true (back and forth)
 *         pause_when_idle: boolean  default false in YAML (the editor writes true when the switch
 *                                 is first turned on). See "Motion".
 *       # gradient
 *       gradient: CSS gradient    linear / radial, 2-8 stops. Head: `<n>deg` or (r3) `to <side>` /
 *                                 `to <corner>`, read through gradientHeadAngle() (src/utils/
 *                                 gradient.ts): top 0, right 90, bottom 180, left 270, corners 45 /
 *                                 135 / 225 / 315 (approximate on non-square cards). No head = 180.
 *                                 Stop positions are not kept (parseGradient spaces stops evenly).
 *       # pattern
 *       pattern: dots | grid | lines | diagonal | checks
 *       color: CSS colour         pattern ink (with alpha); for type color, the fill
 *       size: 4-64 (px)           pattern cell (same key as the image size; `type` decides the meaning)
 *       thickness: 1-8 px         line width, or dot size for dots / checks
 *       # color
 *       color: CSS colour
 * Source of an image layer: `states` set -> Changes with state; else `entity` -> Follows a device;
 * else One picture.
 * Card key `layers_low_power` (layer-placement 1.0.0) also applies here: no blur, blend normal,
 * pan / zoom rests at the start framing.
 * Conditional appearance (Q-UX2: yes): a rule that sets `background_layers` replaces the whole list
 * (the existing shallow merge), an empty list included; (r3) CardAppearanceOverrides in src/types.ts
 * gains `background_layers?: BackgroundLayerConfig[]` (no cast in the rule code). `hover` never carries
 * it (not a DesignConfig key).
 * Template merge: `background_layers` is a whole value like `background` (no per-entry merge).
 *
 * ── Rendering (inside the chunk) ──
 * - <mc-bg-stack>: position absolute, top / right / bottom / left 0 (no `inset`, Chromium 85),
 *   z-index -1, overflow hidden, border-radius inherit, pointer-events none, aria-hidden true, never
 *   isolated (blends must reach the card content's own background). One layer box per visible layer,
 *   painted back to front (reverse of YAML order), absolute on all four sides (blurred image layers:
 *   each side -3 x blur), carrying opacity, mix-blend-mode and the blur `filter`; the box is never
 *   animated. Inside it the image element carries position / size / repeat and the pan / zoom
 *   transform animation. ha-card[data-mc-layers] is the clip box (layer-placement "Clip box").
 * - Image change (entity state, attribute, refresh): the new image is decoded off-DOM (Image.decode,
 *   onload fallback) and swapped in with a 300 ms crossfade (instant under reduced motion or while
 *   the card is paused); the old image stays until then, so no blank frame. The first picture of a
 *   layer fades in the same way over the layers beneath (no pop-in). A load error, missing entity,
 *   empty attribute or no state match without `image`: the layer renders nothing, the layers under
 *   it show (AC fallback), silently on the dashboard.
 * - Patterns are CSS gradients only (no images, no canvas). Colours go through host.cssColor.
 * - URLs only from host.resolveImage (media-source ids, /api/ paths with the HA base, entity
 *   pictures); the chunk never builds an authenticated URL itself and adds no network request
 *   other than the image fetches the browser makes. GDPR: images stay inside the user's HA.
 *
 * ── Motion and timers (pan / zoom, camera refresh) ──
 * Pan / zoom is a CSS keyframe animation of `transform` (scale + translate toward `focus`) on the
 * image element only, no requestAnimationFrame; filter, position offsets and background-position
 * are never animated (S1). It plays only while all hold: on screen and card not paused
 * (host.observeOffscreen; card-pause 1.0.0 reports a paused card as off screen), page visible
 * (visibilitychange; Fully Kiosk raises it when the screen turns off), not low power, no
 * `prefers-reduced-motion: reduce`, and, with pause_when_idle, input seen within the last
 * IDLE_PAUSE_MS (pointerdown, pointermove, keydown, touchstart on the document; one passive
 * listener per page shared by every stack, throttled to 1 Hz). Not playing = animation-play-state
 * paused; under reduced motion or low power the image rests at the start framing. Off screen, page
 * hidden or paused, the camera refresh timer and any idle timer are cleared (S1: a running timer
 * costs about 3 ms/s off screen) and restarted on return, with one immediate refresh if one is due.
 * The studio Preview seg (`preview`) overrides this in the editor only (Play works under reduced
 * motion as a user action).
 *
 * ── Stale snapshots ──
 * For image layers whose entity is camera.* and stale_badge !== false: stale = 3 failed refreshes
 * in a row, or the last good frame older than max(3 x refresh, 60 s) while on screen and not paused.
 * While stale the frame is dimmed (opacity 0.6, grayscale) and a pill "Not updated {time}" ({time}
 * from the card i18n namespace via host.staleText, updated once a minute, no live region) renders
 * into host.badgeHost(): an element Core renders as the LAST child of .mc-card-content (class
 * mc-bg-badge, position absolute, top 8px, right 8px, z-index 3, pointer-events none, inert) only
 * when some layer can go stale. Pill: 13 px white on rgba(0,0,0,.85). It clears on the next good
 * frame. The stack fires status `stale`.
 *
 * ── Errors for the editor ──
 * The element fires `mc-bg-layer-status` (bubbles, composed) with BgLayerStatus whenever a layer's
 * status changes; the studio maps `reason` to the designer's sentences (03 section 8, 11 J). The
 * dashboard ignores it.
 */

export const BG_STACK_CONTRACT = '1.0.0';
export const BG_STACK_CONTRACT_REVISION = 3;
export const MAX_BACKGROUND_LAYERS = 4;
/** pause_when_idle: motion rests this long after the last input. */
export const IDLE_PAUSE_MS = 120_000;
/** Stale rule. */
export const STALE_FAILED_REFRESHES = 3;
export const STALE_MIN_AGE_MS = 60_000;

export type BgLayerType = 'image' | 'gradient' | 'pattern' | 'color';
export type BgPattern = 'dots' | 'grid' | 'lines' | 'diagonal' | 'checks';

export interface PanZoomConfig {
  from?: number;
  to?: number;
  focus?: LayerAnchor;
  duration?: number;
  alternate?: boolean;
  pause_when_idle?: boolean;
}

export interface BackgroundLayerConfig {
  type: BgLayerType;
  hidden?: boolean;
  opacity?: number;
  blend?: LayerBlend;
  image?: string;
  entity?: string;
  attribute?: string;
  states?: Record<string, string>;
  refresh?: number;
  /** camera.* only; default true. */
  stale_badge?: boolean;
  position?: LayerAnchor | string;
  size?: 'cover' | 'contain' | 'auto' | string | number;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  /** 0-24 px (layer-placement BLUR_MAX). */
  blur?: number;
  pan_zoom?: PanZoomConfig;
  gradient?: string;
  pattern?: BgPattern;
  color?: string;
  thickness?: number;
}

/** MagicCardConfig and (r3) CardAppearanceOverrides gain `background_layers` (src/types.ts). */
export interface BackgroundLayersKey {
  background_layers?: BackgroundLayerConfig[];
}

/** (r3) src/utils/gradient.ts: a gradient head (`<n>deg`, `to <side>`, `to <corner>`) as degrees; undefined when it is not a head. */
export type GradientHeadAngle = (head: string) => number | undefined;

/** What magic-card.js hands the element (property `host`); stable object per card instance. */
export interface BgStackHost {
  /** Media-source id, /local/, /api/ or absolute URL -> URL the browser can load; undefined until resolved. */
  resolveImage(hass: HomeAssistant | undefined, source: string): string | undefined;
  /** Effective card entity (entity-scope) for layers without their own `entity`. */
  cardEntity(): string | undefined;
  /** Design colour value -> CSS colour. */
  cssColor(value: string, entity: string | undefined): string;
  /** Shared offscreen observer (src/icons/offscreen.ts): sets / clears `offscreen` on el; returns stop(). Reports false while the card is paused. */
  observeOffscreen(el: Element): () => void;
  /** The .mc-bg-badge element for the stale pill; undefined when Core rendered none. */
  badgeHost(): HTMLElement | undefined;
  /** Card `layers_low_power`. */
  lowPower(): boolean;
  /** Card-namespace text for the pill, e.g. "Not updated 4 min" (i18n 1.0.0 in magic-card.js). */
  staleText(seconds: number): string;
}

/** <mc-bg-stack> properties set by magic-card.js. */
export interface BgStackElementProps {
  layers: BackgroundLayerConfig[];
  hass: HomeAssistant | undefined;
  host: BgStackHost;
  /** Studio Preview seg for pan / zoom (editor only, not saved): undefined = normal rules. */
  preview?: 'play' | 'start' | 'end';
}

export type BgLayerProblem = 'entity-missing' | 'no-picture' | 'no-state-image' | 'load-failed' | 'snapshot-failed' | 'stale';

export interface BgLayerStatus {
  /** YAML index. */
  index: number;
  status: 'empty' | 'loading' | 'ok' | 'error';
  reason?: BgLayerProblem;
  /** Entity id or state for the message; for `stale`, seconds since the last good frame. */
  detail?: string | number;
}

export const BG_LAYER_STATUS_EVENT = 'mc-bg-layer-status';
