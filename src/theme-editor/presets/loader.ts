import type * as Chunk from './chunk';
import type { ThemePresetLibrary } from '../../contracts/theme-editor';
import { PRESETS_BUILD } from './build';

/*
 * The 45 presets and their picker are a lazy chunk, magic-card-theme-presets.js, loaded
 * next to the editor bundle (public path: ../public-path.ts) when the create dialog first opens.
 * A load that takes over 8 s counts as failed (a stalled request would hang for minutes).
 * Memoised while pending and once loaded; a failure or timeout clears the memo so "Try again" can
 * call import() again. What that retry does depends on why the last attempt ended:
 * - after a load error, webpack has dropped the chunk's request, so the retry asks for the chunk
 *   under a new URL (see `real` below);
 * - after the 8 s timeout, the original request is still in flight and webpack hands back that
 *   same promise, so no new request is sent: Try again waits on the stalled request and either
 *   gets it or times out again 8 s later.
 * The failure message tells the user to reload the page if it keeps failing.
 */
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
