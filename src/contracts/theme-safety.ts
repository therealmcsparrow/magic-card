// Contract: theme safety. Version 1.0.0 (THEME_SAFETY_VERSION). The text pairs whose contrast a theme must meet,
// the lowest ratio and the Wall tablet preview frame, shared by share-kit and the theme editor.

import type { ThemeMode } from './theme-editor';

export const THEME_SAFETY_VERSION = '1.0.0';

/** Lowest contrast ratio a text pair may have (WCAG 2.2 AA for normal text). */
export const MIN_TEXT_CONTRAST = 4.5;

export type TextPairId = 'primary-on-card' | 'primary-on-page' | 'secondary-on-card' | 'on-primary' | 'mc-text-on-card';

/** A text token on a background token; both are theme variable names without the leading "--". */
export interface TextPair {
  readonly id: TextPairId;
  readonly text: string;
  readonly background: string;
  /** Checked only when the theme sets both tokens. */
  readonly optional: boolean;
}

/** The pairs every theme is checked on, in light and in dark. */
export const TEXT_PAIRS = [
  { id: 'primary-on-card', text: 'primary-text-color', background: 'card-background-color', optional: false },
  { id: 'primary-on-page', text: 'primary-text-color', background: 'primary-background-color', optional: false },
  { id: 'secondary-on-card', text: 'secondary-text-color', background: 'card-background-color', optional: false },
  { id: 'on-primary', text: 'text-primary-color', background: 'primary-color', optional: false },
  { id: 'mc-text-on-card', text: 'mc-text', background: 'mc-card-bg', optional: true },
] as const satisfies readonly TextPair[];

/** One pair in one mode. `fallback`: a token could not be resolved and Home Assistant's own value was used. */
export interface PairContrast {
  pair: TextPairId;
  mode: ThemeMode;
  /** Contrast ratio, 1 to 21. */
  ratio: number;
  pass: boolean;
  fallback: boolean;
}

/** Every checked pair; `pass` is true when each one reaches MIN_TEXT_CONTRAST. */
export interface ContrastReport {
  pairs: PairContrast[];
  pass: boolean;
}

/** The tablet viewport the Wall tablet preview draws, in CSS px. */
export const WALL_TABLET_VIEWPORT = { width: 1280, height: 800 } as const;
/** Width of the one sample card on the tablet: one dashboard column. */
export const WALL_TABLET_CARD_WIDTH = 412;
/** Distance a tablet is read from in the hand, and from across the room, in metres. */
export const WALL_TABLET_NEAR_M = 0.6;
export const WALL_TABLET_FAR_M = 3;
/** Scale of the drawn tablet, near over far, so text shows at the size it appears from across the room. */
export const WALL_TABLET_SCALE = 0.2;
