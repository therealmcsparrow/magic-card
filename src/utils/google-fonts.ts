/**
 * Google Fonts offered by the font picker. A design font family naming one of them gets the font
 * loaded (a stylesheet link in document.head, once per family); system fonts and Roboto (Home
 * Assistant's own font) load nothing.
 */
export interface GoogleFont {
  name: string;
  family: string;
  category: string;
  /** Upright weights the family has of COMMON_WEIGHTS, when not all of them (css2 rejects a missing weight). */
  weights?: number[];
}

/** The weights requested (upright only), so light, medium and bold are real faces, not synthesised. */
export const COMMON_WEIGHTS = [300, 400, 500, 700];

export const GOOGLE_FONTS: GoogleFont[] = [
  { name: 'Roboto', family: 'Roboto, sans-serif', category: 'Sans-serif' },
  { name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'Sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif', category: 'Sans-serif', weights: [300, 400, 700] },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'Sans-serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif', category: 'Sans-serif' },
  { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif', category: 'Sans-serif', weights: [300, 400, 700] },
  { name: 'Raleway', family: 'Raleway, sans-serif', category: 'Sans-serif' },
  { name: 'PT Sans', family: '"PT Sans", sans-serif', category: 'Sans-serif', weights: [400, 700] },
  { name: 'Merriweather', family: 'Merriweather, serif', category: 'Serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'Serif', weights: [400, 500, 700] },
  { name: 'Lora', family: 'Lora, serif', category: 'Serif', weights: [400, 500, 700] },
  { name: 'PT Serif', family: '"PT Serif", serif', category: 'Serif', weights: [400, 700] },
  { name: 'Noto Sans', family: '"Noto Sans", sans-serif', category: 'Sans-serif' },
  { name: 'Ubuntu', family: 'Ubuntu, sans-serif', category: 'Sans-serif' },
  { name: 'Poppins', family: 'Poppins, sans-serif', category: 'Sans-serif' },
  { name: 'Nunito', family: 'Nunito, sans-serif', category: 'Sans-serif' },
  { name: 'Inconsolata', family: 'Inconsolata, monospace', category: 'Monospace' },
  { name: 'Fira Code', family: '"Fira Code", monospace', category: 'Monospace' },
  { name: 'Source Code Pro', family: '"Source Code Pro", monospace', category: 'Monospace' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive', category: 'Cursive', weights: [400, 500, 700] },
];

const BY_NAME = new Map(GOOGLE_FONTS.map((f) => [f.name.toLowerCase(), f.name]));
const WEIGHTS = new Map(GOOGLE_FONTS.map((f) => [f.name, f.weights ?? COMMON_WEIGHTS]));

/** The css2 stylesheet URL of a family with its common upright weights (`Open+Sans:wght@300;400;500;700`). */
export function googleFontUrl(family: string): string {
  const weights = (WEIGHTS.get(family) ?? COMMON_WEIGHTS).join(';');
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
