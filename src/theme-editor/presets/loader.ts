import type * as Chunk from './chunk';
import type { ThemePresetLibrary } from '../../contracts/theme-editor';
import { PRESETS_BUILD } from './build';

// Loads the presets and picker lazy chunk when the create dialog first opens; a failure clears the memo.
export type PresetChunk = typeof Chunk;
type Importer = () => Promise<PresetChunk>;

declare const __webpack_require__: { u: (id: unknown) => string } | undefined;
let tries = 0;
// Chrome and Safari remember a failed import() of a URL, so every call after the first rewrites the
// chunk URL. webpack only reads it when it starts a new request (after a real load error).
const real: Importer = () => {
  if (tries++ && typeof __webpack_require__ !== 'undefined') {
    const u = __webpack_require__.u;
    const n = tries;
    __webpack_require__.u = (id) => {
      const url = u(id);
      return `${url}${url.includes('?') ? '&' : '?'}r=${n}`;
    };
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
  pending ??= new Promise<PresetChunk>((ok, no) => (setTimeout(no, 8000, Error('timed out')), importer().then(ok, no)))
    .then((m) => {
      // a cached older chunk never runs against a newer editor (see src/utils/lazy-chunk.ts sameBuild)
      if ((m as { BUILD?: string })?.BUILD !== PRESETS_BUILD) {
        console.warn(`Magic Card was updated, reload the page (magic-card-theme-presets.js ${String((m as { BUILD?: string })?.BUILD)}, editor ${PRESETS_BUILD}).`);
        throw new Error('the presets are from another release');
      }
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
