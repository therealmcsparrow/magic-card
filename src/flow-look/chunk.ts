import { VERSION } from '../version';

/*
 * Chunk entry of dist/magic-card-flow-look.js (contracts lazy-module 1.2.0, flow-look 1.0.0). Evaluating
 * this file changes nothing global: the renderer is provided to the slot in install(), which
 * src/utils/lazy-chunk.ts calls only when BUILD matches the magic-card.js that loaded it (AC13).
 * T1 stub: install() is empty; T3-T5 fill the slot (flowLookSlot.provide).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  // empty until T3
}
