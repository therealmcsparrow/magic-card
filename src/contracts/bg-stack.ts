import type { HomeAssistant } from '../types';
import type { LayerAnchor, LayerBlend } from './layer-placement';

/**
 * Contract: card background stack ("Card backdrop" in the UI). Version 1.2.0. At most 4 layers; pan/zoom on images and camera snapshots only. */

export const BG_STACK_CONTRACT = '1.2.0';
export const BG_STACK_CONTRACT_REVISION = 6;
export { MAX_BACKGROUND_LAYERS, BG_LAYER_STATUS_EVENT } from './bg-stack.needs';
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

/** MagicCardConfig and CardAppearanceOverrides gain `background_layers` (src/types.ts). */
export interface BackgroundLayersKey {
  background_layers?: BackgroundLayerConfig[];
}

/** src/utils/gradient.ts: a gradient head (`<n>deg`, `to <side>`, `to <corner>`) as degrees; undefined when it is not a head. */
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
  /** A live layer is shown: start the svg-image chunk and mark it met for the card's failure notice (idempotent). */
  needImage(): void;
}

/** <mc-bg-stack> properties set by magic-card.js. */
export interface BgStackElementProps {
  layers: BackgroundLayerConfig[];
  hass: HomeAssistant | undefined;
  host: BgStackHost;
  /** Studio Preview seg for pan / zoom (editor only, not saved): undefined = normal rules. */
  preview?: 'play' | 'start' | 'end';
}

export type BgLayerProblem = 'entity-missing' | 'no-picture' | 'no-state-image' | 'load-failed' | 'snapshot-failed' | 'stale' | 'image-missing';

export interface BgLayerStatus {
  /** YAML index. */
  index: number;
  status: 'empty' | 'loading' | 'ok' | 'error';
  reason?: BgLayerProblem;
  /** Entity id or state for the message; for `stale`, seconds since the last good frame. */
  detail?: string | number;
}

/** Pan / zoom settings after the contract defaults and clamps. */
export interface BgPanZoom {
  from: number;
  to: number;
  /** Focus direction, -1..1. */
  fx: number;
  fy: number;
  duration: number;
  alternate: boolean;
  idle: boolean;
}

/** The state <mc-bg-stack> keeps per layer; BgStackFx reads and writes the camera fields. */
export interface BgStackItem {
  index: number;
  cfg: BackgroundLayerConfig;
  states: Record<string, string>;
  hasStates: boolean;
  pz?: BgPanZoom;
  camera: boolean;
  /** A URL, or a library image reference for a live layer. */
  base?: string;
  shown?: string;
  prev?: string;
  gen: number;
  loading: boolean;
  failures?: number;
  lastGood?: number;
  lastTry: number;
  since: number;
  stale: boolean;
  evKey: string;
  timer?: ReturnType<typeof setTimeout>;
  fadeTimer?: ReturnType<typeof setTimeout>;
}

/** What BgStackFx may use of a stack. */
export interface BgStackView extends HTMLElement {
  items: BgStackItem[];
  host?: BgStackHost;
  preview?: 'play' | 'start' | 'end';
  /** Decode `url` (a cache-busted form of `base` for a refresh) and swap it in; a library reference swaps in without a decode. */
  load(item: BgStackItem, base: string, url?: string): Promise<void>;
  status(item: BgStackItem, status: BgLayerStatus['status'], reason?: BgLayerProblem, detail?: string | number): void;
  requestUpdate(): void;
}

/** The motion and refresh part of one stack, made by BgStackFx.attach. */
export interface BgStackRun {
  /** Pan / zoom settings of a layer's `pan_zoom` value; undefined when it is not an object. */
  pan(value: unknown): BgPanZoom | undefined;
  /** The `data-pz` state of a moving picture. */
  motion(pz: BgPanZoom): 'play' | 'pause' | 'start' | 'end';
  /** Start or clear every timer and listener for the current on-screen / visible state. */
  arm(): void;
  /** Plan the next camera refresh of a layer. */
  schedule(item: BgStackItem): void;
  /** A frame loaded. */
  good(item: BgStackItem): void;
  /** A camera refresh failed. */
  bad(item: BgStackItem): void;
  /** The stack is disconnected: remove listeners, timers and the pill. */
  stop(): void;
}

/** What the 'layers' chunk provides (provideBgFx in src/layers/stack/fx-slot.ts). */
export interface BgStackFx {
  attach(el: BgStackView): BgStackRun;
}
