import { VERSION } from '../version';
import { McSeasonal } from './mc-seasonal';
import { McSeasonalDeco } from './mc-seasonal-deco';

/*
 * Chunk entry of dist/magic-card-seasonal.js (contract lazy-module 1.0.0). Evaluating this file changes
 * nothing global: everything happens in install(), which src/utils/lazy-chunk.ts calls only when
 * BUILD matches the magic-card.js that loaded it (AC13). Defines <mc-seasonal> and <mc-seasonal-deco>; they upgrade in place.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  if (!customElements.get('mc-seasonal')) customElements.define('mc-seasonal', McSeasonal);
  if (!customElements.get('mc-seasonal-deco')) customElements.define('mc-seasonal-deco', McSeasonalDeco);
}
