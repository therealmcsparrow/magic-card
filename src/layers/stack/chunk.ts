import { VERSION } from '../../version';

/*
 * Chunk entry of dist/magic-card-layers.js (contract lazy-module 1.2.0). Stub: the <mc-bg-stack>
 * element is defined here by background-layers T5. Evaluating this file changes nothing global.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  // T5 defines <mc-bg-stack> here (guarded: customElements.get first).
}
