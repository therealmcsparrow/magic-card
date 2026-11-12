// Google Fonts the card can load, only while Magic Card Utils allows them: a font family naming one gets a stylesheet
// link in document.head, once per family. Names are checked against the catalogue chunk before any request.
import type { GoogleFamily } from '../google-fonts/catalogue';

/** The fonts the picker lists as local: never fetched. */
export const LOCAL_FONT_NAMES: readonly string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS', 'Impact'];

const SKIPPED = new Set(['serif', 'monospace', 'cursive', 'inherit', 'initial', 'roboto', ...LOCAL_FONT_NAMES.map((n) => n.toLowerCase())]);
/** Hyphenated generics (`sans-serif`, `system-ui`) never match, so only the plain ones are listed. */
const NAME = /^[A-Za-z0-9 ]{1,64}$/;

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

/** The family names a font-family value could ask Google for (`"Open Sans", sans-serif` gives `['Open Sans']`). */
export function fontCandidates(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  const out: string[] = [];
  for (const part of value.split(',')) {
    const name = part.replace(/^\s*["']?|["']?\s*$/g, '');
    if (!NAME.test(name) || SKIPPED.has(name.toLowerCase()) || out.includes(name)) continue;
    out.push(name);
  }
  return out;
}

const CSS_FONT_FAMILY = /font-family\s*:\s*([^;]+)/gi;
const configCache = new WeakMap<object, string[]>();

/**
 * Every font family name a card config could load: `font_family` and `tab_font_family` anywhere, and `label_font_family` inside a button module (row / column / module designs,
 * nested children, hover, conditional rules) and `font-family` declarations in any `css` text.
 */
export function configFontCandidates(config: object): string[] {
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
      if (key === 'font_family' || key === 'tab_font_family' || (key === 'label_font_family' && inButton)) fontCandidates(value).forEach((f) => found.add(f));
      else if (key === 'css' && typeof value === 'string') {
        for (const m of value.matchAll(CSS_FONT_FAMILY)) fontCandidates(m[1]).forEach((f) => found.add(f));
      } else if (value && typeof value === 'object') walk(value, inButton);
    }
  };
  walk(config);
  const out = [...found];
  configCache.set(config, out);
  return out;
}

/** The catalogue entries for the names, through the catalogue chunk (not loaded for an empty list). */
export async function resolveGoogleFonts(names: string[]): Promise<GoogleFamily[]> {
  if (!names.length) return [];
  const { findFamily } = await import(/* webpackChunkName: "google-fonts" */ '../google-fonts/catalogue');
  return names.map((n) => findFamily(n)).filter((f): f is GoogleFamily => !!f);
}

/** The css2 stylesheet URL of a family with its common upright weights (300, 400, 500, 700 where it has them, so light, medium and bold are real faces) (`Open+Sans:wght@300;400;500;700`). */
export function googleFontUrl(f: GoogleFamily): string {
  const weights = f.weights.filter((w) => [300, 400, 500, 700].includes(w));
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.name).replace(/%20/g, '+')}${weights.length ? `:wght@${weights.join(';')}` : ''}&display=swap`;
}

/** A stylesheet link per family in document.head, added once. Does nothing while Magic Card Utils does not allow Google Fonts. */
export function loadGoogleFonts(families: GoogleFamily[]): void {
  if (!googleFontsAllowed()) return;
  for (const family of families) {
    if (document.head.querySelector(`link[data-mc-font="${family.name}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = googleFontUrl(family);
    link.dataset.mcFont = family.name;
    document.head.appendChild(link);
  }
}

/** Names already handed to loadFontsFor: each is checked once per page, however often the card renders. */
const asked = new Set<string>();

/** Waits for the switch, checks the names against the catalogue and loads the families found. */
export function loadFontsFor(names: string[]): void {
  names = names.filter((n) => !asked.has(n));
  if (!names.length) return;
  names.forEach((n) => asked.add(n));
  whenGoogleFontsAllowed(() => {
    resolveGoogleFonts(names).then(loadGoogleFonts, () => 0);
  });
}
