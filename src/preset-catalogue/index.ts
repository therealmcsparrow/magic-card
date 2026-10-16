import type { CataloguePreset, PresetCatalogueModule } from '../contracts/preset-catalogue';

/*
 * The preset catalogue chunk (dist/magic-card-preset-catalogue.js, contract preset-catalogue 1.1.0).
 * T1.1 ships it empty so the studio's tile grid and its loader can be built and tested; T3.1 fills
 * CATALOGUE with the themed presets (one file per group). Chunk rule: type-only imports from
 * outside src/preset-catalogue/.
 */

export const version: PresetCatalogueModule['version'] = '1.1.0';

export const CATALOGUE: CataloguePreset[] = [];
