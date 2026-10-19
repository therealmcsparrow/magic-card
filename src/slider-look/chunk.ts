import { VERSION } from '../version';
import { sliderLookSlot } from '../modules/controls/slider-look-slot';
import { sliderLookView } from './view';

/*
 * Chunk entry of dist/magic-card-slider-look.js (contracts lazy-module 1.2.0, slider-look 1.0.0).
 * Evaluating this file changes nothing global: the view is provided to the slot in install(), which
 * src/utils/lazy-chunk.ts calls only when BUILD matches the magic-card.js that loaded it (AC13).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  sliderLookSlot.provide(sliderLookView);
}
