// Everything that turns font-family text into Google Font stylesheet links. Reached only through the lazy `google-fonts` chunk (or from other lazy chunks).
import { collectConfigFonts, googleFontsAllowed, whenGoogleFontsAllowed } from '../utils/google-fonts';
import { LOCAL_FONT_NAMES } from './local-fonts';
import { allFamilies, findFamily, genericFor, type GoogleFamily } from './catalogue';

export { LOCAL_FONT_NAMES, findFamily, allFamilies, genericFor };

const SKIPPED = new Set(['serif', 'monospace', 'cursive', 'inherit', 'initial', 'roboto', ...LOCAL_FONT_NAMES.map((n) => n.toLowerCase())]);
/** Hyphenated generics (`sans-serif`, `system-ui`) never match, so only the plain ones are listed. */
const NAME = /^[A-Za-z0-9 ]{1,64}$/;

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

/** Every font family name a card config could load (see collectConfigFonts for the keys walked). */
export function configFontCandidates(config: object): string[] {
  return [...new Set(collectConfigFonts(config).flatMap(fontCandidates))];
}

/** The catalogue entries for the names. */
export function resolveGoogleFonts(names: string[]): Promise<GoogleFamily[]> {
  return Promise.resolve(names.map((n) => findFamily(n)).filter((f): f is GoogleFamily => !!f));
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
    if (document.head.querySelector(`link[data-mc-font="${CSS.escape(family.name)}"]`)) continue;
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
