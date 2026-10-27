/*
 * Text-based SVG detection. It is a module of its own, so a chunk that only reads files does not carry it.
 */

/** True for a .svg file name, or when the first element is <svg after white space, an XML prolog, a doctype and comments. */
export function looksLikeSvg(text: string, fileName?: string): boolean {
  if (fileName && /\.svg$/i.test(fileName)) return true;
  let i = 0;
  const n = text.length;
  for (;;) {
    while (i < n && /\s/.test(text[i])) i++;
    const rest = text.slice(i, i + 9);
    if (rest.startsWith('<?')) {
      const end = text.indexOf('?>', i);
      if (end < 0) return false;
      i = end + 2;
    } else if (rest.startsWith('<!--')) {
      const end = text.indexOf('-->', i);
      if (end < 0) return false;
      i = end + 3;
    } else if (/^<!doctype/i.test(rest)) {
      const end = text.indexOf('>', i);
      if (end < 0) return false;
      i = end + 1;
    } else return /^<svg[\s>/]/i.test(text.slice(i, i + 6));
  }
}
