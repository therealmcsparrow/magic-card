import { VERSION } from '../version';
import { CardSeasonal, seasonalSeed } from './card-seasonal';
import { McSeasonal } from './mc-seasonal';
import { McSeasonalDeco } from './mc-seasonal-deco';
import { SeasonalBudget, sceneDecorations, sceneFlashes } from '../utils/seasonal-scenes';
import { seasonalPreviewDate, setSeasonalPreviewDate } from '../utils/seasonal-preview';

/*
 * Chunk entry of dist/magic-card-seasonal.js: install() defines <mc-seasonal> and
 * <mc-seasonal-deco>. It also carries the `api` the card reads to resolve and budget a scene.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/** What the entry calls into (a plain object, so the entry never imports a chunk file at run time). */
export const api = { CardSeasonal, SeasonalBudget, sceneDecorations, sceneFlashes, seasonalSeed, seasonalPreviewDate, setSeasonalPreviewDate } as const;

export type SeasonalApi = typeof api;

export function install(): void {
  if (!customElements.get('mc-seasonal')) customElements.define('mc-seasonal', McSeasonal);
  if (!customElements.get('mc-seasonal-deco')) customElements.define('mc-seasonal-deco', McSeasonalDeco);
}
