import { VERSION } from '../version';
import { CardSeasonal, seasonalSeed } from './card-seasonal';
import { McSeasonal } from './mc-seasonal';
import { McSeasonalDeco } from './mc-seasonal-deco';
import { SeasonalBudget, sceneDecorations, sceneFlashes } from '../utils/seasonal-scenes';

/*
 * Chunk entry of dist/magic-card-seasonal.js (contract lazy-module 1.0.0). Evaluating this file changes
 * nothing global: everything happens in install(), which src/utils/lazy-chunk.ts calls only when
 * BUILD matches the magic-card.js that loaded it (AC13). Defines <mc-seasonal> and <mc-seasonal-deco>; they upgrade in place.
 *
 * The chunk also carries what the card needs to resolve and budget a scene (S1a.4): the card reads `api` from
 * lazyChunks.seasonal.module() once the chunk is ready (src/card/seasonal-seam.ts). Until then the card renders
 * without a scene and keeps the layout band from its config (src/utils/seasonal.needs.ts).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/** What the entry calls into (a plain object, so the entry never imports a chunk file at run time). */
export const api = { CardSeasonal, SeasonalBudget, sceneDecorations, sceneFlashes, seasonalSeed } as const;

export type SeasonalApi = typeof api;

export function install(): void {
  if (!customElements.get('mc-seasonal')) customElements.define('mc-seasonal', McSeasonal);
  if (!customElements.get('mc-seasonal-deco')) customElements.define('mc-seasonal-deco', McSeasonalDeco);
}
