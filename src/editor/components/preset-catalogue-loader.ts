import type { LoadCatalogue, PresetCatalogueModule } from '../../contracts/preset-catalogue';
import { sameBuild } from '../../utils/lazy-chunk';

/*
 * The card editor's loader of the preset catalogue chunk (magic-card-preset-catalogue.js, contract
 * preset-catalogue 1.1.0, ADR 0005), called when the Animations list connects. Same chunk name as
 * the studio's loader, so both bundles share one file. One shared promise; a failure resolves
 * undefined (console.warn) and the next call tries again.
 */

let importer = (): Promise<unknown> => import(/* webpackChunkName: "preset-catalogue" */ '../../preset-catalogue/index');
let pending: Promise<PresetCatalogueModule | undefined> | undefined;

export const loadCatalogue: LoadCatalogue = () =>
  (pending ??= importer().then(
    (m) => sameBuild('magic-card-preset-catalogue.js', m as { BUILD?: string }) as PresetCatalogueModule | undefined,
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: preset catalogue not loaded', err);
      return undefined;
    },
  ));

/** Tests: forget the shared promise; `load` replaces the import (restored when omitted). */
export function __setCatalogueImportForTests(load?: () => Promise<unknown>): void {
  pending = undefined;
  importer = load ?? (() => import(/* webpackChunkName: "preset-catalogue" */ '../../preset-catalogue/index'));
}
