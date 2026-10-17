import type * as Chunk from './chunk';
import type { ThemePresetLibrary } from '../../contracts/theme-editor';

/*
 * The 45 presets and their picker are a lazy chunk, magic-card-theme-presets.js (ADR 0014), loaded
 * next to the editor bundle (public path: ../public-path.ts) when the create dialog first opens.
 * Memoised while pending and once loaded; a failure clears the memo so "Try again" asks again.
 */
export type PresetChunk = typeof Chunk;
type Importer = () => Promise<PresetChunk>;

declare const __webpack_require__: { u: (id: unknown) => string } | undefined;
let tries = 0;
// Chrome and Safari remember a failed import() of a URL, so every retry asks for the chunk under a new one
const real: Importer = () => {
  if (tries++ && typeof __webpack_require__ !== 'undefined') {
    const u = __webpack_require__.u;
    const n = tries;
    __webpack_require__.u = (id) => `${u(id)}&r=${n}`;
  }
  return import(/* webpackChunkName: "theme-presets" */ './chunk');
};
let importer: Importer = real;
let pending: Promise<PresetChunk> | undefined;
let loaded: PresetChunk | undefined;

/** Test seam: swap the importer (no argument restores the real one) and forget what was loaded. */
export function setPresetImporter(fn?: Importer): void {
  importer = fn ?? real;
  pending = loaded = undefined;
}

const sane = (lib: ThemePresetLibrary | undefined): boolean =>
  !!lib && /^1\./.test(lib.version) && Array.isArray(lib.presets) && lib.presets.length > 0;

/** Load the chunk once; rejects when it cannot load or its library is not a major 1 one. */
export function loadPresetLibrary(): Promise<PresetChunk> {
  pending ??= importer()
    .then((m) => {
      if (!sane(m?.THEME_PRESET_LIBRARY)) throw new Error('unexpected preset library');
      return (loaded = m);
    })
    .catch((err: unknown) => {
      pending = undefined;
      throw err;
    });
  return pending;
}

/** The chunk when it has loaded, else undefined. */
export const presetLibraryIfLoaded = (): PresetChunk | undefined => loaded;
