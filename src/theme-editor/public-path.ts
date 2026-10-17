/*
 * The preset chunk (magic-card-theme-presets.js) loads next to this bundle, wherever HA serves it
 * from (/hacsfiles/magic-card/, /local/...). The magic-card-utils panel loads the bundle with
 * import(), so it runs as a module and has no document.currentScript, and the bundle cannot read
 * import.meta. So: the URL of this file from currentScript when a <script> tag loaded it, else
 * from the stack of its own evaluation (Chrome `at fn (url:1:2)`, Firefox and Safari `fn@url:1:2`).
 * First import of src/theme-editor/index.ts: set before anything calls import(). A smaller copy of
 * src/anim-studio/public-path.ts (the entry may not import outside src/theme-editor/).
 */

/** The directory URL of the theme editor bundle (with a trailing slash), or '' when it cannot be told. */
export const editorBase = (currentSrc: string | undefined, stack: string | undefined): string =>
  /((?:https?|file):\/\/[^\s()@]*\/)magic-card-theme-editor\.js/.exec(
    currentSrc || stack || '',
  )?.[1] ?? '';

if (typeof document !== 'undefined') {
  const base = editorBase(
    (document.currentScript as HTMLScriptElement | null)?.src,
    new Error().stack,
  );
  // '' leaves webpack's own '' (the chunk resolves against the page; the dialog then shows its retry)
  if (base) __webpack_public_path__ = base;
}
