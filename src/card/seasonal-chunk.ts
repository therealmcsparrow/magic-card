import { VERSION } from '../version';

/*
 * Chunk entry of dist/magic-card-seasonal.js (contract lazy-module 1.0.0). Evaluating this file changes
 * nothing global: everything happens in install(), which src/utils/lazy-chunk.ts calls only when
 * BUILD matches the magic-card.js that loaded it (AC13). D2-D5 move the code in.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  // nothing moved here yet
}
