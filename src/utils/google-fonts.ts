/**
 * Google Fonts the card can load. A design font family naming one of them gets the font loaded (a
 * stylesheet link in document.head, once per family); system fonts and Roboto (Home Assistant's own
 * font) load nothing. The editor's font list (font-picker.ts) carries the family strings and categories.
 */

/** The weights requested (upright only), so light, medium and bold are real faces, not synthesised. */
export const COMMON_WEIGHTS = [300, 400, 500, 700];

const LIGHT_REGULAR_BOLD = [300, 400, 700];
const REGULAR_BOLD = [400, 700];
const REGULAR_MEDIUM_BOLD = [400, 500, 700];

/** Each offered family with the upright weights it has when not all of the common ones (css2 rejects a missing weight). */
export const GOOGLE_FONT_WEIGHTS: Record<string, number[] | undefined> = {
  Roboto: undefined,
  'Open Sans': undefined,
  Lato: LIGHT_REGULAR_BOLD,
  Montserrat: undefined,
  Oswald: undefined,
  'Source Sans Pro': LIGHT_REGULAR_BOLD,
  Raleway: undefined,
  'PT Sans': REGULAR_BOLD,
  Merriweather: undefined,
  'Playfair Display': REGULAR_MEDIUM_BOLD,
  Lora: REGULAR_MEDIUM_BOLD,
  'PT Serif': REGULAR_BOLD,
  'Noto Sans': undefined,
  Ubuntu: undefined,
  Poppins: undefined,
  Nunito: undefined,
  Inconsolata: undefined,
  'Fira Code': undefined,
  'Source Code Pro': undefined,
  'Dancing Script': REGULAR_MEDIUM_BOLD,
};

const BY_NAME = new Map(Object.keys(GOOGLE_FONT_WEIGHTS).map((name) => [name.toLowerCase(), name]));
/** The css2 stylesheet URL of a family with its common upright weights (`Open+Sans:wght@300;400;500;700`). */
export function googleFontUrl(family: string): string {
  const weights = (GOOGLE_FONT_WEIGHTS[family] ?? COMMON_WEIGHTS).join(';');
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${weights}&display=swap`;
}

/** The Google Fonts named in a CSS font-family value (`"Open Sans", sans-serif` → `['Open Sans']`). */
export function googleFontFamilies(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  const out: string[] = [];
  for (const part of value.split(',')) {
    const name = BY_NAME.get(part.trim().replace(/^["']|["']$/g, '').trim().toLowerCase());
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

const CSS_FONT_FAMILY = /font-family\s*:\s*([^;]+)/gi;
const configCache = new WeakMap<object, string[]>();

/**
 * Every Google Font a card config uses: `font_family` anywhere (row / column / module designs,
 * nested children, hover, conditional rules) and `font-family` declarations in any `css` text.
 */
export function configGoogleFonts(config: object): string[] {
  const cached = configCache.get(config);
  if (cached) return cached;
  const found = new Set<string>();
  const seen = new WeakSet<object>();
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'font_family') googleFontFamilies(value).forEach((f) => found.add(f));
      else if (key === 'css' && typeof value === 'string') {
        for (const m of value.matchAll(CSS_FONT_FAMILY)) googleFontFamilies(m[1]).forEach((f) => found.add(f));
      } else if (value && typeof value === 'object') walk(value);
    }
  };
  walk(config);
  const out = [...found];
  configCache.set(config, out);
  return out;
}

/** Families Home Assistant already loads (its UI font): offered in the picker, never fetched. */
const BUNDLED = new Set(['Roboto']);
/** Families with a stylesheet link in document.head (filled from the head once, then kept here). */
let requested: Set<string> | undefined;

/**
 * A stylesheet link per family in document.head (Google's css2 API, common weights), added once.
 * Families already requested return right away (no DOM query on every render).
 */
export function loadGoogleFonts(families: string[]): void {
  if (typeof document === 'undefined' || !document.head) return;
  if (requested && families.every((f) => requested!.has(f) || BUNDLED.has(f))) return;
  requested ??= new Set([...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')].map((l) => l.dataset.mcFont ?? ''));
  for (const family of families) {
    if (requested.has(family) || BUNDLED.has(family)) continue;
    requested.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = googleFontUrl(family);
    link.dataset.mcFont = family;
    document.head.appendChild(link);
  }
}
