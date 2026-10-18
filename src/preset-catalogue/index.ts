import type { CataloguePreset, PresetCatalogueModule } from '../contracts/preset-catalogue';
import { FIRE } from './fire';
import { CLEANING } from './cleaning';
import { CHRISTMAS } from './christmas';
import { HALLOWEEN } from './halloween';
import { VALENTINE } from './valentine';
import { HOME } from './home';
import { LIGHT } from './light';
export { BUILD_VERSION as BUILD } from '../utils/build-version';

/*
 * The preset catalogue chunk (dist/magic-card-preset-catalogue.js, contract preset-catalogue 1.1.0):
 * ready animation documents in the themed groups, one file per group, shared builders in kit.ts.
 * Chunk rule: type-only imports from outside src/preset-catalogue/.
 */

export const version: PresetCatalogueModule['version'] = '1.1.0';

export const CATALOGUE: CataloguePreset[] = [...FIRE, ...CLEANING, ...CHRISTMAS, ...HALLOWEEN, ...VALENTINE, ...HOME, ...LIGHT];
