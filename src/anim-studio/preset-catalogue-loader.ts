import type { PresetCatalogueModule } from '../contracts/preset-catalogue';

/*
 * The studio's loader of the preset catalogue chunk (magic-card-preset-catalogue.js, contract
 * preset-catalogue 1.1.0), loaded when the "Customise a preset" dialog opens. Same shape as
 * icon-library-loader.ts: one shared promise; a failure resolves undefined (console.warn) and the
 * next call tries again.
 */

let pending: Promise<PresetCatalogueModule | undefined> | undefined;

export function loadPresetCatalogue(): Promise<PresetCatalogueModule | undefined> {
  pending ??= import(/* webpackChunkName: "preset-catalogue" */ '../preset-catalogue/index').then(
    (m) => m as PresetCatalogueModule,
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: preset catalogue not loaded', err);
      return undefined;
    },
  );
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetPresetCatalogueForTests(): void {
  pending = undefined;
}
