import { BUILD_VERSION } from '../utils/build-version';
import { CardPause } from './card-pause';

/** Chunk entry of dist/magic-card-pause.js: the viewer's Pause motion button and its rules. */

export const BUILD: string = BUILD_VERSION;

/** The button rules and the rule that stops the card's CSS animations while it is paused; Core adopts them with the chunk. */
export { pauseCardStyles as styles } from './pause-css';

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { create: (host: ConstructorParameters<typeof CardPause>[0]): CardPause => new CardPause(host) } as const;

export type PauseApi = typeof api;

export function install(): void {}
