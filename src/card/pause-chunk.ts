import { BUILD_VERSION } from '../utils/build-version';
import { CardPause } from './card-pause';

/*
 * Chunk entry of dist/magic-card-pause.js (lazy-module 1.4.0 chunk `pause`): the viewer's Pause motion button of a card
 * (state, remembered pause, button) and its rules (`styles`). The offscreen observer hooks it drives (setCardPaused,
 * motionCount) stay in the card bundle. The card reserves the button's 24 px strip from the config before this file loads
 * (pauseGap, pause-gap-css.ts), and the button is absolutely positioned, so installing the chunk moves nothing.
 */

export const BUILD: string = BUILD_VERSION;

/** The button rules and the rule that stops the card's CSS animations while it is paused; Core adopts them with the chunk. */
export { pauseCardStyles as styles } from './pause-css';

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { create: (host: ConstructorParameters<typeof CardPause>[0]): CardPause => new CardPause(host) } as const;

export type PauseApi = typeof api;

export function install(): void {}
