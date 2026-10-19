/*
 * The preset chunk (magic-card-theme-presets.js) loads next to this bundle, wherever HA
 * serves it from (/hacsfiles/magic-card/, /local/...). The bundle is an ES module (the
 * magic-card-utils panel loads it with import()), so import.meta.url is the URL of this file.
 * chunkBase turns it into the directory URL, but only when it has the page's scheme and host:
 * a chunk base from another host is refused ('') and the dialog shows its retry. Nothing here
 * reads document.currentScript or an error stack, which page markup or another script can influence.
 * First import of src/theme-editor/index.ts: set before anything calls import().
 * src/anim-studio/public-path.ts is a copy (the entry may not import outside its folder).
 */

/** The directory URL (no query, no hash) of `url` when it shares scheme and host with `page`, else ''. */
export function chunkBase(url: string, page: { protocol: string; host: string }): string {
  try {
    const u = new URL(url);
    return u.protocol === page.protocol && u.host === page.host ? new URL('.', u).href : '';
  } catch {
    return '';
  }
}

if (typeof location !== 'undefined') {
  const base = chunkBase(import.meta.url, location);
  // '' leaves webpack's own '' (the chunk import fails; the dialog then shows its retry)
  if (base) __webpack_public_path__ = base;
}
