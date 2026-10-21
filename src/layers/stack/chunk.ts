import { VERSION } from '../../version';
import { bgFx } from './fx';
import { provideBgFx } from './fx-slot';

/*
 * Chunk entry of dist/magic-card-layers.js (contract lazy-module 1.2.0). Evaluating this file changes
 * nothing global: install() hands the motion and refresh part of <mc-bg-stack> (contract bg-stack) to
 * every live and future stack. <mc-bg-stack> and the layer placement runtime are part of magic-card.js.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  provideBgFx(bgFx);
}
