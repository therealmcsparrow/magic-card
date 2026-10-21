import { VERSION } from '../../version';
import { defineBgStack } from './mc-bg-stack';

/*
 * Chunk entry of dist/magic-card-layers.js (contract lazy-module 1.2.0). Evaluating this file changes
 * nothing global: install() defines <mc-bg-stack> (contract bg-stack), guarded. The layer placement
 * runtime and its CSS are part of magic-card.js (src/layers/layer-slot.ts).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  defineBgStack();
}
