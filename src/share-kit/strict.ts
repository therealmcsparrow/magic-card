// Strict value checks for shared files: one allow-list grammar per type, anchored and without nested quantifiers.
// Each grammar mirrors the CSS tokenizer's view of one declaration value; colour and length copy src/utils/safe-css.ts.

import { BREAKOUT_MARKERS, FONT_NAME_RE, KEYWORD_RE, PAINT_DATA_URL_RE, PAINT_LOCAL_PATH_RE, STRICT_ANY_TYPES, THEME_KEY_TYPES } from '../contracts/share-kit';
import type { StrictRuleId, StrictType, ValueRefusal, ValueVerdict } from '../contracts/share-kit';

const MAX_VALUE = 1024;
const MAX_SHORT = 64;
const MAX_COLOR = 256;
const MAX_DEPTH = 3;
const MAX_SCAN_DEPTH = 40;
const isControl = (c: string): boolean => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127;
const GLOBAL_KEYWORDS = new Set(['inherit', 'initial', 'unset']);
const COLOR_FUNCTIONS = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'var', 'light-dark', 'calc', 'min', 'max', 'clamp']);
const NUM = '(?:\\d+(?:\\.\\d+)?|\\.\\d+)';
const LENGTH_RE = new RegExp(`^-?${NUM}(?:px|em|rem|%|vw|vh)?$`);
const NUMBER_RE = new RegExp(`^-?${NUM}%?$`);
const TIME_RE = new RegExp(`^${NUM}(?:ms|s)?$`);
const ANGLE_RE = new RegExp(`^-?${NUM}(?:deg|grad|rad|turn)$`);
const VAR_RE = /^var\(\s*(--[A-Za-z0-9_-]{1,64})\s*(?:,([\s\S]*))?\)$/;
const GRADIENT_RE = /^(?:repeating-)?(?:linear|radial|conic)-gradient\(([\s\S]*)\)$/;
const GRADIENT_WORDS = new Set(['to', 'top', 'bottom', 'left', 'right', 'center', 'circle', 'ellipse', 'closest-side', 'farthest-side', 'closest-corner', 'farthest-corner', 'at', 'from', 'in', 'srgb', 'hsl', 'oklab', 'oklch', 'shorter', 'longer', 'increasing', 'decreasing', 'hue']);
const CALC_RE = /^calc\(([^()]*(?:\([^()]*\)[^()]*)*)\)$/;
const URL_RE = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)$/;

/** True when `s` holds a break-out or escape marker: BREAKOUT_MARKERS, a control character or a `;` outside quotes and parentheses. */
export function markerIn(s: string): boolean {
  const low = s.toLowerCase();
  if ([...s].some(isControl) || BREAKOUT_MARKERS.some((m) => low.includes(m))) return true;
  let depth = 0;
  let quote = '';
  for (const c of s) {
    if (quote) quote = c === quote ? '' : quote;
    else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth <= 0) return true;
  }
  return false;
}

/** The first marker in any string or key of `value` as a refusal at `path`; a value nested too deep is refused. */
export function scanMarkers(item: number, path: string, value: unknown, depth = 0): ValueRefusal | undefined {
  const refuse = (): ValueRefusal => ({ item, path, rule: 'strict.marker' });
  if (typeof value === 'string') return markerIn(value) ? refuse() : undefined;
  if (typeof value !== 'object' || value === null) return undefined;
  if (depth > MAX_SCAN_DEPTH) return refuse();
  const entries: [string, unknown][] = Array.isArray(value) ? value.map((v, i): [string, unknown] => [`[${i}]`, v]) : Object.entries(value);
  for (const [k, v] of entries) {
    const at = Array.isArray(value) ? path + k : `${path}.${k}`;
    if (!Array.isArray(value) && markerIn(k)) return { item, path: at, rule: 'strict.marker' };
    const hit = scanMarkers(item, at, v, depth + 1);
    if (hit) return hit;
  }
  return undefined;
}

const URL_BASES = ['https://a.invalid/', 'http://b.invalid:8123/'] as const;
const FETCH_SCHEME_RE = /^(?:https?|wss?|ftp|file|data|blob|javascript|vbscript|filesystem|about|chrome|view-source|media-source)$/i;

/** The value as the URL parser reads it: outer control characters and spaces cut, tabs and line breaks removed, `\` read as `/`. */
const flat = (s: string): string => {
  let a = 0;
  let b = s.length;
  while (a < b && s.charCodeAt(a) <= 32) a++;
  while (b > a && s.charCodeAt(b - 1) <= 32) b--;
  return [...s.slice(a, b)]
    .filter((ch) => ch !== '\t' && ch !== '\n' && ch !== '\r')
    .map((ch) => (ch === '\\' ? '/' : ch))
    .join('');
};

/** True when the whole value reads as a URL: it starts with a slash, or with a scheme that is not a plain icon id or a sentence. */
export function urlLike(s: string): boolean {
  const t = flat(s);
  if (t.startsWith('/')) return true;
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(t);
  if (!m) return false;
  if (FETCH_SCHEME_RE.test(m[1])) return true;
  const rest = t.slice(m[0].length);
  return !(/^[\w-]+$/.test(rest) || /^\s/.test(rest) || rest === '');
}

/** True when the value stays on the page's own origin whatever the page is (checked against an https and an http base by the real URL parser). */
export function sameOriginRelative(s: string): boolean {
  const t = flat(s);
  if ([...t].some(isControl)) return false;
  try {
    return URL_BASES.every((b) => new URL(t, b).origin === new URL(b).origin);
  } catch {
    return false;
  }
}

/** A URL a shared card may hold: a raster data: image, or a path on this origin. */
export const urlAllowed = (s: string): boolean => PAINT_DATA_URL_RE.test(s.trim()) || (sameOriginRelative(s) && !markerIn(s) && !/["'`()\s]/.test(s.trim()));

/** Every url(...) of `s` names an allowed URL; a string without url() passes. */
export function urlsOk(s: string): boolean {
  const open = (s.match(/url\s*\(/gi) ?? []).length;
  const args = [...s.matchAll(/url\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)/gi)].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
  return args.length === open && args.every(urlAllowed);
}

/** Splits at top level (outside parentheses and quotes) on commas or whitespace; undefined when unbalanced. */
function splitTop(s: string, comma: boolean): string[] | undefined {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  let quote = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) quote = c === quote ? '' : quote;
    else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')' && --depth < 0) return undefined;
    else if (depth === 0 && (comma ? c === ',' : c === ' ' || c === '\t' || c === '\n')) {
      out.push(s.slice(start, i));
      start = i + 1;
    }
  }
  if (depth !== 0 || quote) return undefined;
  out.push(s.slice(start));
  const parts = out.map((p) => p.trim());
  return comma ? parts : parts.filter((p) => p !== '');
}

/** The colour grammar of safeColor: hex, names and colour functions; never url(), a path, a slash outside a function or a backslash. */
function colour(s: string): boolean {
  if (!s || s.length > MAX_COLOR || !/^[#\w\s(),.%+*/-]+$/.test(s) || s.includes('/*') || s.includes('*/') || s.includes('//')) return false;
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')' && --depth < 0) return false;
    else if (depth === 0 && ch === '/') return false;
  }
  if (depth !== 0 || /[a-z]\.[a-z]/i.test(s.replace(/\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ''))) return false;
  const fns = [...s.matchAll(/([a-z-]+)\s*\(/gi)];
  return fns.length === (s.match(/\(/g)?.length ?? 0) && fns.every((m) => COLOR_FUNCTIONS.has(m[1].toLowerCase()));
}

function lengthOf(s: string, max: number): boolean {
  const tokens = s.length <= MAX_SHORT ? s.split(/\s+/) : [];
  return tokens.length >= 1 && tokens.length <= max && tokens.every((t) => LENGTH_RE.test(t));
}

function length(s: string): boolean {
  const calc = CALC_RE.exec(s);
  if (!calc) return lengthOf(s, 4);
  const rest = calc[1].replace(new RegExp(`${NUM}(?:px|em|rem|%|vw|vh)?`, 'g'), 'N');
  return s.length <= 2 * MAX_SHORT && /^[N\s+\-*/()]+$/.test(rest) && rest.includes('N');
}

const rgb = (s: string): boolean => /^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(s) && s.split(',').every((p) => +p <= 255);
const number = (s: string): boolean => s.length <= MAX_SHORT && NUMBER_RE.test(s) && Math.abs(parseFloat(s)) <= 1e6;
const keyword = (s: string): boolean => {
  const tokens = s.split(/\s+/);
  return tokens.length <= 4 && tokens.every((t) => KEYWORD_RE.test(t));
};

function time(s: string): boolean {
  const parts = s.length <= MAX_SHORT ? s.split(',').map((p) => p.trim()) : [];
  return parts.length >= 1 && parts.length <= 4 && parts.every((p) => TIME_RE.test(p));
}

function gradient(s: string): boolean {
  const inner = GRADIENT_RE.exec(s)?.[1];
  const parts = inner === undefined ? undefined : splitTop(inner, true);
  if (!parts || parts.length > 16) return false;
  return parts.every((part) => {
    const tokens = splitTop(part, false);
    return !!tokens && tokens.length >= 1 && tokens.length <= 8 && tokens.every((t) => GRADIENT_WORDS.has(t) || ANGLE_RE.test(t) || LENGTH_RE.test(t) || colour(t));
  });
}

function shadow(s: string): boolean {
  if (s === 'none') return true;
  const layers = splitTop(s, true);
  if (!layers || layers.length > 4) return false;
  return layers.every((layer) => {
    const tokens = splitTop(layer, false);
    if (!tokens) return false;
    const lengths = tokens.filter((t) => LENGTH_RE.test(t)).length;
    const rest = tokens.filter((t) => !LENGTH_RE.test(t) && t !== 'inset');
    return lengths >= 2 && lengths <= 4 && tokens.filter((t) => t === 'inset').length <= 1 && rest.length <= 1 && rest.every(colour);
  });
}

function font(s: string): boolean {
  const names = splitTop(s, true);
  if (!names || names.length > 8) return false;
  return names.every((n) => {
    const q = /^(["'])([^"']*)\1$/.exec(n);
    return FONT_NAME_RE.test(q ? q[2] : n);
  });
}

function paintUrl(token: string): boolean | undefined {
  const m = URL_RE.exec(token);
  if (!m) return undefined;
  const url = m[1] ?? m[2] ?? m[3] ?? '';
  return PAINT_DATA_URL_RE.test(url) || PAINT_LOCAL_PATH_RE.test(url);
}

function paintImage(s: string): boolean {
  const layers = splitTop(s, true);
  if (!layers || layers.length > 4) return false;
  let urls = 0;
  const ok = layers.every((layer) =>
    (splitTop(layer, false) ?? [undefined]).every((t) => {
      if (t === undefined) return false;
      if (t.startsWith('url(')) {
        urls++;
        return paintUrl(t) === true;
      }
      return t === '/' || KEYWORD_RE.test(t) || LENGTH_RE.test(t) || gradient(t) || colour(t);
    }),
  );
  return ok && urls > 0;
}

const CHECKS: Record<StrictType, (s: string) => boolean> = { colour, rgb, gradient, length, number, time, shadow, font, keyword, 'paint-image': paintImage };

function matches(s: string, types: readonly StrictType[], depth: number): boolean {
  if (GLOBAL_KEYWORDS.has(s.toLowerCase())) return true;
  const v = VAR_RE.exec(s);
  if (v) {
    const fallback = v[2]?.trim();
    return !fallback || (depth < MAX_DEPTH && matches(fallback, types, depth + 1));
  }
  return types.some((ty) => CHECKS[ty](s));
}

/** One value against the types allowed for it: kept, dropped (fits no type) or refused (holds a break-out marker). */
export function strictValue(value: unknown, types: readonly StrictType[]): ValueVerdict {
  const rule: StrictRuleId = types.length === 1 ? `strict.${types[0]}` : 'strict.any';
  if (typeof value === 'number') return Number.isFinite(value) && types.includes('number') ? { verdict: 'kept', value } : { verdict: 'dropped', rule };
  if (typeof value !== 'string') return { verdict: 'dropped', rule };
  if (markerIn(value)) return { verdict: 'refused', rule: 'strict.marker' };
  const s = value.trim();
  if (!s || s.length > MAX_VALUE || !matches(s, types, 0)) return { verdict: 'dropped', rule };
  return { verdict: 'kept', value };
}

/** font-weight 1-1000 and opacity 0-1 (or a percentage); other keys take any finite number. */
function inRange(key: string, n: number, percent: boolean): boolean {
  if (/font-weight$/i.test(key)) return n >= 1 && n <= 1000;
  if (/opacity$/i.test(key)) return percent ? n >= 0 && n <= 100 : n >= 0 && n <= 1;
  return true;
}

/** One theme value, typed by its key name. card-mod-* keys keep the card_mod note and may hold no url(. */
export function themeValue(key: string, value: unknown): ValueVerdict {
  if (/^card-mod-/i.test(key)) {
    if (typeof value !== 'string') return Number.isFinite(value) ? { verdict: 'kept', value: value as number, note: 'card_mod' } : { verdict: 'dropped', rule: 'strict.card-mod' };
    if (markerIn(value) || /url\s*\(/i.test(value)) return { verdict: 'dropped', rule: 'strict.card-mod' };
    return { verdict: 'kept', value, note: 'card_mod' };
  }
  const rule = THEME_KEY_TYPES.find((r) => r.match.test(key));
  const id: StrictRuleId = rule?.id ?? 'strict.any';
  if (typeof value === 'number') return Number.isFinite(value) && inRange(key, value, false) ? { verdict: 'kept', value } : { verdict: 'dropped', rule: id };
  const v = strictValue(value, rule?.types ?? STRICT_ANY_TYPES);
  if (v.verdict !== 'kept') return v.verdict === 'dropped' ? { verdict: 'dropped', rule: id } : v;
  const s = String(v.value).trim();
  if (id === 'strict.number' && NUMBER_RE.test(s) && !inRange(key, parseFloat(s), s.endsWith('%'))) return { verdict: 'dropped', rule: id };
  return /url\(\s*["']?\/local\//i.test(s) ? { ...v, note: 'local_path' } : v;
}
