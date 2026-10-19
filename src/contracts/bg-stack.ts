import type { HomeAssistant } from '../types';
import type { LayerAnchor, LayerBlend } from './layer-placement';

/*
 * Contract: card background stack. Version 1.0.0 (Architect-owned). ADR 0038.
 * Task background-layers (brief topic 4; CEO: max 4 layers, pan/zoom on images and camera snapshots
 * only, this topic is trimmed first if the magic-card.js budget runs short).
 *
 * Seam: magic-card.js (Core render pipeline) renders `<mc-bg-stack>` as the first child of
 * .mc-card-content when the resolved card config has a non-empty `background_layers`, and prefetches
 * the lazy chunk 'layers' (dist/magic-card-layers.js, lazy-module 1.2.0, entry
 * src/layers/stack/chunk.ts) from setConfig / template merge when the key is present. The chunk's
 * install() defines <mc-bg-stack>. Everything the element needs from magic-card.js comes through its
 * `host` property (BgStackHost), so the chunk never imports magic-card.js modules (sanity ceiling
 * 16 KiB; cap = measured + 5 %, rounded up to 1 KiB).
 * Before the chunk is defined the element is empty: the card shows its own `background` /
 * `background_image` only (fallback = the bottom of the stack).
 *
 * ── YAML (card level; also allowed in conditional_appearance overrides) ──
 *   background_layers:            at most MAX_BACKGROUND_LAYERS; extra entries are ignored (editor
 *                                 blocks adding a 5th). FIRST ENTRY = FRONT (CSS convention, Q-UX5).
 *     - type: image | gradient | pattern | color
 *       hidden: boolean           eye toggle; hidden layers render nothing and stay in YAML
 *       opacity: 0-100            default 100
 *       blend: LayerBlend         default normal (blends with the layers below it and the card colour)
 *       # image
 *       image: url | media-source id | /local/...   Picture source; with `states` it is "Otherwise"
 *       entity: entity id         Entity source: picture from `attribute`; omitted = the card entity
 *                                 (entity-scope 1.x effective card entity), so `states` alone works
 *       attribute: string         default entity_picture
 *       states: { <state>: image } By state source: exact state match, else `image`, else next layer
 *       refresh: seconds          camera.* only; default 10, minimum 5; snapshot re-fetched while on
 *                                 screen (cache-busting query), paused off screen
 *       position: LayerAnchor | "<x>% <y>%"   default center
 *       size: cover | contain | auto | "<n>%"  default cover
 *       repeat: no-repeat | repeat | repeat-x | repeat-y   default no-repeat; ignored with cover
 *       blur: 0-40 px             image only; oversized by 2 x blur inside the clip
 *       pan_zoom:                 image only (pictures and camera snapshots; never live streams)
 *         from: 100-200 (%)       default 100
 *         to: 100-200 (%)         default 115
 *         focus: LayerAnchor      default center; where the framing ends
 *         duration: 10-120 s      default 30
 *         alternate: boolean      default true (back and forth)
 *       # gradient
 *       gradient: CSS gradient    linear / radial (the editor's gradient-editor value)
 *       # pattern
 *       pattern: dots | grid | lines | diagonal | checks
 *       color: CSS colour         pattern ink (with alpha); for type color, the fill
 *       size: 4-64 (px)           pattern cell (same key as the image size; `type` decides the meaning)
 *       thickness: 1-8 px         line width, or dot size for dots / checks
 *       # color
 *       color: CSS colour
 * Source of an image layer: `states` set -> By state; else `entity` set -> Entity; else Picture.
 * Conditional appearance (Q-UX2: yes): a rule that sets `background_layers` replaces the whole list
 * (the existing shallow merge); `hover` never carries it (not a DesignConfig key).
 * Template merge: `background_layers` is a whole value like `background` (no per-entry merge).
 *
 * ── Rendering (inside the chunk) ──
 * - <mc-bg-stack>: position absolute, inset 0, z-index -1, overflow hidden, border-radius inherit,
 *   pointer-events none, aria-hidden true. One child per visible layer, painted back to front
 *   (reverse of YAML order), each with its own opacity, mix-blend-mode, position / size / repeat.
 *   The card content is isolated while the element is present (data-mc-layers), so blend modes
 *   mix only with the card colour / image and the layers below.
 * - Image change (entity state, attribute, refresh): the new image is decoded off-DOM (Image.decode,
 *   onload fallback) and swapped in with a 300 ms crossfade (instant under reduced motion); the old
 *   image stays until then, so no blank frame. A load error, missing entity, empty attribute or no
 *   state match without `image`: the layer renders nothing, the layers under it show (AC fallback).
 *   A failed camera refresh keeps the last good frame.
 * - Pan / zoom: CSS keyframes on transform (scale + translate toward `focus`) of the image element
 *   only; paused through host.observeOffscreen; `@media (prefers-reduced-motion: reduce)`: no
 *   animation, the image rests at the start framing (`from`, centred). No requestAnimationFrame.
 * - Patterns are CSS gradients only (no images, no canvas). Colours are passed through
 *   host.cssColor (entity / theme colour tokens resolve like design colours).
 * - URLs only from host.resolveImage (media-source ids, /api/ paths with the HA base, entity
 *   pictures); the chunk never builds an authenticated URL itself and adds no network request
 *   other than the image fetches the browser makes. GDPR: images stay inside the user's HA.
 *
 * ── Errors for the editor ──
 * The element fires `mc-bg-layer-status` (bubbles, composed) with BgLayerStatus whenever a layer's
 * status changes; the studio maps `reason` to the designer's sentences (03-ui-ux-designer.md
 * section 8). The dashboard ignores it.
 */

export const BG_STACK_CONTRACT = '1.0.0';
export const MAX_BACKGROUND_LAYERS = 4;

export type BgLayerType = 'image' | 'gradient' | 'pattern' | 'color';
export type BgPattern = 'dots' | 'grid' | 'lines' | 'diagonal' | 'checks';

export interface PanZoomConfig {
  from?: number;
  to?: number;
  focus?: LayerAnchor;
  duration?: number;
  alternate?: boolean;
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
  position?: LayerAnchor | string;
  size?: 'cover' | 'contain' | 'auto' | string | number;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  blur?: number;
  pan_zoom?: PanZoomConfig;
  gradient?: string;
  pattern?: BgPattern;
  color?: string;
  thickness?: number;
}

/** MagicCardConfig gains `background_layers?: BackgroundLayerConfig[]` (src/types.ts). */
export interface BackgroundLayersKey {
  background_layers?: BackgroundLayerConfig[];
}

/** What magic-card.js hands the element (property `host`); stable object per card instance. */
export interface BgStackHost {
  /** Media-source id, /local/, /api/ or absolute URL -> URL the browser can load; undefined until resolved. */
  resolveImage(hass: HomeAssistant | undefined, source: string): string | undefined;
  /** Effective card entity (entity-scope) for layers without their own `entity`. */
  cardEntity(): string | undefined;
  /** Design colour value -> CSS colour. */
  cssColor(value: string, entity: string | undefined): string;
  /** Shared offscreen observer (src/icons/offscreen.ts): sets / clears `offscreen` on el; returns stop(). */
  observeOffscreen(el: Element): () => void;
}

/** <mc-bg-stack> properties set by magic-card.js. */
export interface BgStackElementProps {
  layers: BackgroundLayerConfig[];
  hass: HomeAssistant | undefined;
  host: BgStackHost;
  /** Studio Preview seg for pan / zoom (editor only, not saved): undefined = play. */
  preview?: 'start' | 'end';
}

export type BgLayerProblem = 'entity-missing' | 'no-picture' | 'no-state-image' | 'load-failed' | 'snapshot-failed';

export interface BgLayerStatus {
  /** YAML index. */
  index: number;
  status: 'empty' | 'loading' | 'ok' | 'error';
  reason?: BgLayerProblem;
  /** Entity id or state, for the message. */
  detail?: string;
}

export const BG_LAYER_STATUS_EVENT = 'mc-bg-layer-status';
