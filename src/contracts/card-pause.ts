// Contract: card pause (viewer-side "Pause motion" button, WCAG 2.2.2). Version 2.0.0. A pause button per card
// stops every moving thing on the card. watchOffscreen and the pauseOffscreen directive take a `counted` option.

export const CARD_PAUSE_CONTRACT = '2.0.0';
export const CARD_PAUSE_CONTRACT_REVISION = 5;

export type PauseButtonMode = 'auto' | 'always' | 'hidden';
export type PauseButtonCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

/** Default of `pause_button`. */
export const PAUSE_BUTTON_DEFAULT: PauseButtonMode = 'hidden';

/** Card keys; MagicCardConfig gains them in src/types.ts. */
export interface CardPauseKeys {
  pause_button?: PauseButtonMode;
  pause_button_corner?: PauseButtonCorner;
}

// The three names live in card-pause.needs.ts, which magic-card.js imports; re-exported unchanged.
export { PAUSE_ATTRIBUTE, PAUSE_EVENT, PAUSE_STORAGE_PREFIX } from './card-pause.needs';

export interface PauseChangeDetail {
  paused: boolean;
}

/** The editor preview pause on <magic-card> (Core card element, additive public property). */
export interface PreviewPauseApi {
  /** Freeze the card's motion while editing; never remembered, survives setConfig. Default false. */
  previewPaused: boolean;
}

/** Options of watchOffscreen and (counted only) the pauseOffscreen directive. */
export interface OffscreenWatchOptions {
  /** false: keeps running in a paused card (updates, does not move); never counted. Default true. */
  pausable?: boolean;
  /** false: pauses with the card but is left out of motionCount (no sign of motion on its own). Default true. */
  counted?: boolean;
}

/** src/icons/offscreen.ts additions (Core item "Shared offscreen observer"). */
export interface OffscreenPauseApi {
  /** Mark a <magic-card> host paused / playing and re-report its observed elements. */
  setCardPaused(host: Element, paused: boolean): void;
  isCardPaused(host: Element): boolean;
  /** Pausable, counted observed elements inside host (for `auto`). */
  motionCount(host: Element): number;
  /** Existing signature plus options; pausable and counted default to true. */
  watchOffscreen(el: Element, cb: (onScreen: boolean) => void, opts?: OffscreenWatchOptions): boolean;
}
