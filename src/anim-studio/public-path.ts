/*
 * Lazy chunks of the studio (magic-card-icon-library.js) load next to this bundle, wherever HA
 * serves it from (/hacsfiles/magic-card/, /local/...). The magic-card-utils panel loads it with
 * import(), so it runs as a module and has no document.currentScript; the bundle cannot read
 * import.meta either (that would not parse as a classic script). So: currentScript when loaded by a
 * <script> tag, else the URL of this file in the stack of its own evaluation. First import of
 * src/anim-studio/index.ts: set before anything calls import().
 */

/** A frame's script URL: Chrome `at fn (url:1:2)` / `at url:1:2`, Firefox and Safari `fn@url:1:2`. */
const FRAME_RE = /((?:https?|file):\/\/[^\s()@]+?):\d+(?::\d+)?\)?\s*$/;

/** The directory URL (no query, no hash) of the studio bundle, or '' when it cannot be told. */
export function studioBase(currentSrc: string | undefined, stack: string | undefined): string {
  let url = currentSrc || '';
  if (!url && stack) {
    const frames = stack
      .split('\n')
      .map((l) => FRAME_RE.exec(l.trim())?.[1])
      .filter((u): u is string => !!u);
    url = frames.find((u) => /\/magic-card-animation-studio\.js(?:[?#]|$)/.test(u)) ?? frames[0] ?? '';
  }
  try {
    return url ? new URL('.', url).href : '';
  } catch {
    return '';
  }
}

if (typeof document !== 'undefined') {
  const base = studioBase((document.currentScript as HTMLScriptElement | null)?.src, new Error().stack);
  // '' leaves webpack's own '' (chunks resolve against the page; the library then shows its retry)
  if (base) __webpack_public_path__ = base;
}
