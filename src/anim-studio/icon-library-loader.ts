/*
 * The icon library (192 animated icons and their MDI shapes) is the largest part of the studio, so
 * it is a lazy chunk, magic-card-icon-library.js, loaded next to the studio bundle (public path:
 * public-path.ts) when the icon animation start opens. Nothing else in the studio imports it.
 */
export type IconLibrary = typeof import('./icon-library-chunk');

let pending: Promise<IconLibrary> | undefined;
let loaded: IconLibrary | undefined;

/** Load the chunk once; rejects when it cannot load (the next call tries again). */
export function loadIconLibrary(): Promise<IconLibrary> {
  pending ??= import(/* webpackChunkName: "icon-library" */ './icon-library-chunk').then(
    (m) => (loaded = m),
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: icon library not loaded', err);
      throw err;
    },
  );
  return pending;
}

/** The library when it has loaded, else undefined. */
export const iconLibraryIfLoaded = (): IconLibrary | undefined => loaded;
