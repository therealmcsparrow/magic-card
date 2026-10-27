import type { SvgParse } from '../contracts/svg-safety';

/*
 * Parses untrusted SVG text the way the sanitisers consume it: as XML first, and when that is not well-formed or its root
 * is not <svg>, as text/html in an inert document (nothing in it loads or runs). Nothing here throws.
 * `acceptXml` lets a caller refuse an XML root it cannot take (the image sanitiser wants no foreign namespace); a refused
 * root falls through to the html parse like a parse error.
 */
export function parseLenient(text: string, acceptXml?: (root: Element) => boolean): SvgParse {
  if (typeof DOMParser === 'undefined') return undefined;
  const parser = new DOMParser();
  try {
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const root = doc.documentElement;
    if (root && root.localName === 'svg' && !doc.getElementsByTagName('parsererror').length && (!acceptXml || acceptXml(root))) {
      return { root, via: 'xml', doc };
    }
  } catch {
    // not well-formed XML: the html parser below is lenient
  }
  try {
    const doc = parser.parseFromString(text, 'text/html');
    const all = doc.getElementsByTagName('*');
    for (let i = 0; i < all.length; i++) if (all[i].localName.toLowerCase() === 'svg') return { root: all[i], via: 'html', doc };
  } catch {
    // not markup
  }
  return undefined;
}
