import { cssLengths, safeColor, str } from './safe-css';

/** Border sides or corners, and the longest list of colours or style words. */
const SIDES = 4;
const SIDES_MAX = 256;
// The border-style words (safe-css has the same list; a second user there would add a function to the card bundle).
const BORDER_STYLE = /^(?:none|hidden|solid|dashed|dotted|double|groove|ridge|inset|outset)$/;

/** A colour the browser also accepts as a colour (where it can tell), never one with a function outside the allow-list. */
export function colour(v: unknown): string | undefined {
  const c = safeColor(v);
  return c && (typeof CSS === 'undefined' || typeof CSS.supports !== 'function' || CSS.supports('color', c)) ? c : undefined;
}

export function length(v: unknown, most: number, max: number, pct: boolean): string | undefined {
  const s = cssLengths(v, most);
  return s && s.split(' ').every((t) => parseFloat(t) <= max && (pct || !t.endsWith('%'))) ? s : undefined;
}

/** Splits at depth 0 on a comma or on whitespace, so a colour function keeps its own commas and spaces. */
export function splitTop(s: string, sep: ',' | ' '): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i <= s.length; i++) {
    const ch = s[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (i === s.length || (depth === 0 && (sep === ',' ? ch === ',' : /\s/.test(ch)))) {
      const part = s.slice(from, i).trim();
      if (part) out.push(part);
      from = i + 1;
    }
  }
  return out;
}

/** One to four colours, one per side in CSS order; one colour is read exactly as any other colour. */
export function colours(v: unknown): string | undefined {
  const s = str(v);
  if (!s || s.length > SIDES_MAX) return undefined;
  const parts = splitTop(s, ' ');
  if (parts.length === 1) return colour(s);
  if (parts.length > SIDES) return undefined;
  const out = parts.map(colour);
  return out.every(Boolean) ? out.join(' ') : undefined;
}

/** One to four border-style words, one per side in CSS order. */
export function styles(v: unknown): string | undefined {
  const s = str(v)?.toLowerCase();
  if (!s || s.length > SIDES_MAX) return undefined;
  const parts = s.split(/\s+/);
  return parts.length <= SIDES && parts.every((w) => BORDER_STYLE.test(w)) ? parts.join(' ') : undefined;
}

/** The hover Border width, style and colour of a tabs module as declarations for its tab buttons; each value passes the checks of tab_border_*. */
export function tabBorderStyle(d: unknown): string {
  const r = d && typeof d === 'object' && !Array.isArray(d) ? (d as Record<string, unknown>) : {};
  const width = length(r.border_width, 4, 32, false);
  const style = styles(r.border_style) ?? (width ? 'solid' : undefined);
  const color = colours(r.border_color);
  return [width && `border-width: ${width}`, style && `border-style: ${style}`, color && `border-color: ${color}`].filter(Boolean).join('; ');
}
