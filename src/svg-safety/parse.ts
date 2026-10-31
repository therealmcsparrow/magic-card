import type { SvgParse } from '../contracts/svg-safety';

// Parses untrusted SVG text as XML first, else as text/html in an inert document; nothing here throws.
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
