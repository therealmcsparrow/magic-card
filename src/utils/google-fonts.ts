// The gate for Google Fonts, plus the cheap part of loading them: spotting that a card config names a font at all. Everything else lives in the lazy
// `google-fonts` chunk (src/google-fonts/loader.ts), which is only fetched once Magic Card Utils allows Google Fonts.

/** True when Magic Card Utils is installed and its Google Fonts switch is on. */
export function googleFontsAllowed(): boolean {
  return (window as unknown as { magicCardUtils?: { settings?: { googleFonts?: boolean } } }).magicCardUtils?.settings?.googleFonts === true;
}

/** Calls `cb` now when allowed, otherwise once on the first `mcu-settings` event that allows it. */
export function whenGoogleFontsAllowed(cb: () => void): void {
  if (googleFontsAllowed()) return cb();
  window.addEventListener('mcu-settings', function on() {
    if (!googleFontsAllowed()) return;
    window.removeEventListener('mcu-settings', on);
    cb();
  });
}

const CSS_FONT_FAMILY = /font-family\s*:\s*([^;]+)/gi;
const configCache = new WeakMap<object, string[]>();

/**
 * The raw font-family strings a card config holds: `font_family` and `tab_font_family` anywhere, `label_font_family` inside a button module (row / column / module designs,
 * nested children, hover, conditional rules) and `font-family` declarations in any `css` text.
 */
export function collectConfigFonts(config: object): string[] {
  const cached = configCache.get(config);
  if (cached) return cached;
  const found = new Set<string>();
  const seen = new WeakSet<object>();
  const walk = (node: unknown, button = false): void => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach((n) => walk(n, button));
      return;
    }
    const inButton = button || (node as { type?: unknown }).type === 'button';
    for (const [key, value] of Object.entries(node)) {
      if (key === 'font_family' || key === 'tab_font_family' || (key === 'label_font_family' && inButton)) {
        if (typeof value === 'string') found.add(value);
      } else if (key === 'css' && typeof value === 'string') {
        for (const m of value.matchAll(CSS_FONT_FAMILY)) found.add(m[1]);
      } else if (value && typeof value === 'object') walk(value, inButton);
    }
  };
  walk(config);
  const out = [...found];
  configCache.set(config, out);
  return out;
}

/** Font strings already handed on: each is looked at once per page, however often the card renders. */
const asked = new Set<string>();

/** Loads the Google Fonts a config names. Does nothing without a font string, and fetches the loader chunk only once the gate is open. */
export function loadConfigFonts(config: object): void {
  const fresh = collectConfigFonts(config).filter((s) => !asked.has(s));
  if (!fresh.length) return;
  fresh.forEach((s) => asked.add(s));
  whenGoogleFontsAllowed(() => {
    import(/* webpackChunkName: "google-fonts" */ '../google-fonts/loader').then((m) => m.loadFontsFor(fresh.flatMap(m.fontCandidates)), () => 0);
  });
}
