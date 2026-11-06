/* Sets the chunk base URL from import.meta.url; a base from another scheme or host is refused. */

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
