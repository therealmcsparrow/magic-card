import { VERSION } from '../version';

declare const __MC_BUILD_VERSION__: string | undefined;

/** The release this bundle was built from (the webpack define; VERSION in tests). Lazy chunk entries export it as BUILD. */
export const BUILD_VERSION: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/**
 * The same check for the older lazy chunks (shape-custom, anim-runtime, particles, preset-catalogue,
 * icon-library, theme-presets), whose entries export BUILD but have no install(): the module when it
 * was built with this magic-card.js, else one warning and undefined (a cached older file never runs
 * against a newer card). The caller keeps its own load state and does not retry.
 */
export function sameBuild<T extends { BUILD?: string }>(file: string, mod: T): T | undefined {
  if (mod?.BUILD === BUILD_VERSION) return mod;
  console.warn(`Magic Card was updated, reload the page (magic-card.js ${BUILD_VERSION}, ${file} ${String(mod?.BUILD)}).`);
  return undefined;
}
