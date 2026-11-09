import { IMAGE_MORPH_MAX_FRAMES, IMAGE_MORPH_MIN_FRAMES } from '../contracts/image-animation';
import { IMAGE_FONT_FAMILIES, IMAGE_ID_RE, THEME_VAR_NAME_RE } from '../contracts/svg-image';
import {
  MORPH_ATTRIBUTES,
  MORPH_CALC_MODES,
  MORPH_DUR_RE,
  MORPH_ELEMENT,
  MORPH_FILLS,
  MORPH_FIXED,
  MORPH_NUMBER_LIST_RE,
  MORPH_PARENT,
  MORPH_REPEAT_RE,
  MORPH_REQUIRED,
  MORPH_VALUES_SEPARATOR,
  type MorphMiss,
  type SvgPolicy,
  type SvgValueKind,
} from '../contracts/svg-safety';
import { classTokens, denied, isLetter, onlyFunctions } from './values';

// The image policy value rules: one length-capped pattern per attribute kind, mirroring how the browser reads the attribute.

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const WORD_RE = /^[A-Za-z]{3,20}$/;
const URL_REF_RE = /^url\(#([A-Za-z][\w.-]{0,63})\)$/;
const VAR_RE = /^var\(\s*(--[a-z0-9][a-z0-9-]{0,63})\s*(?:,\s*(#[0-9a-fA-F]{3,8})\s*)?\)$/;
const COLOR_CHARS_RE = /^[\w\s.,%/#()+-]+$/;
const LENGTH_RE = /^[\s\d.,eE+%a-zA-Z-]+$/;
const KEYWORD_RE = /^[A-Za-z0-9\s-]{1,40}$/;
const PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz\d\s.,eE+-]*$/;
const NUMBERS_RE = /^[\s\d.,eE+%-]*$/;
const ARGS_RE = /^[\s\d.,eE+-]*$/;
const CLASS_TOKEN_RE = /^[\w-]{1,64}$/;
// eslint-disable-next-line no-control-regex
const DATA_NAME_RE = /^[^<>"&\\\u0000-\u001f]{1,80}$/;

/** A paint value: a colour, a local url(#id), or var(--name[, #hex]). At most maxPaintChars here. */
function paintOk(v: string, policy: SvgPolicy): boolean {
  if (v.length > (policy.maxPaintChars ?? 200)) return false;
  if (HEX_RE.test(v) || WORD_RE.test(v) || URL_REF_RE.test(v)) return true;
  const m = policy.paintVar ? VAR_RE.exec(v) : null;
  if (m) return THEME_VAR_NAME_RE.test(m[1]);
  if (!COLOR_CHARS_RE.test(v) || v.includes('//') || v.includes('/*')) return false;
  return v.includes('(') && onlyFunctions(v, policy.colourFunctions);
}

/** A transform list: only the transform functions with numeric arguments, at most `maxTransformFunctions` of them. */
function transformOk(v: string, policy: SvgPolicy): boolean {
  const n = v.length;
  const max = policy.maxTransformFunctions ?? 16;
  let i = 0;
  let count = 0;
  for (;;) {
    while (i < n && (v[i] === ' ' || v[i] === ',' || v[i] === '\t' || v[i] === '\n' || v[i] === '\r')) i++;
    if (i >= n) return count > 0;
    let j = i;
    while (j < n && isLetter(v.charCodeAt(j))) j++;
    if (!policy.transformFunctions.includes(v.slice(i, j).toLowerCase()) || v[j] !== '(') return false;
    const close = v.indexOf(')', j);
    if (close < 0 || !ARGS_RE.test(v.slice(j + 1, close)) || ++count > max) return false;
    i = close + 1;
  }
}

/** The value to keep for an attribute of the image policy, or undefined to drop (and list) it. The value is kept trimmed. */
export function cleanImageValue(kind: SvgValueKind, raw: string, policy: SvgPolicy): string | undefined {
  if (kind === 'path' || kind === 'points') {
    return raw.length <= policy.css.maxWrittenBytes && (kind === 'path' ? PATH_RE : NUMBERS_RE).test(raw) ? raw : undefined;
  }
  if (policy.maxValueChars !== undefined && raw.length > policy.maxValueChars) return undefined;
  const v = raw.charCodeAt(0) <= 32 || raw.charCodeAt(raw.length - 1) <= 32 ? raw.trim() : raw;
  // font, data-name and class have patterns of their own that decide everything
  if (kind !== 'font' && kind !== 'data-name' && kind !== 'class' && denied(v, policy)) return undefined;
  switch (kind) {
    case 'length':
      return LENGTH_RE.test(v) ? v : undefined;
    case 'paint':
      return paintOk(v, policy) ? v : undefined;
    case 'keyword':
      return KEYWORD_RE.test(v) ? v : undefined;
    case 'transform':
      return transformOk(v, policy) ? v : undefined;
    case 'reference':
      return v === 'none' || URL_REF_RE.test(v) ? v : undefined;
    case 'font': {
      const low = v.toLowerCase();
      return IMAGE_FONT_FAMILIES.includes(low) ? low : 'sans-serif';
    }
    case 'id':
      return IMAGE_ID_RE.test(v) ? v : undefined;
    case 'data-name':
      return DATA_NAME_RE.test(v) ? v : undefined;
    case 'class':
      return classTokens(v, CLASS_TOKEN_RE);
    default:
      return undefined;
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const NUMBER_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

const PATH_TOKEN_RE = /([MmLlHhVvCcSsQqTtAaZz])|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[ ,]+/y;

/**
 * The command structure of one path-data text, which every frame of a morph shares: its command letters in order, each
 * with the count of numbers after it ("M 2 L 4"). Undefined when some text is no token, a number comes before the first
 * letter, or there is no letter.
 */
export function pathStructure(d: string): string | undefined {
  const text = d.replace(/[\t\n\r\f]/g, ' ');
  const parts: string[] = [];
  PATH_TOKEN_RE.lastIndex = 0;
  while (PATH_TOKEN_RE.lastIndex < text.length) {
    const m = PATH_TOKEN_RE.exec(text);
    if (!m) return undefined;
    if (m[1]) parts.push(m[1], '0');
    else if (/^[ ,]/.test(m[0])) continue;
    else if (parts.length) parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1);
    else return undefined;
  }
  return parts.length ? parts.join(' ') : undefined;
}

/** The numbers of a `;`-separated list, or undefined when any item is not a plain non-negative number. */
function numberList(v: string, split: string): number[] | undefined {
  if (!MORPH_NUMBER_LIST_RE.test(v)) return undefined;
  const items = v.split(split).map((s) => s.trim());
  return items.every((s) => NUMBER_RE.test(s)) ? items.map(Number) : undefined;
}

/** True when the numbers are 0..1 and never fall. */
const risingUnit = (n: number[]): boolean => n.every((x, i) => x >= 0 && x <= 1 && (i === 0 || x >= n[i - 1]));

/** The `keySplines` check: one control-point set of four numbers in 0..1 per segment. */
function splinesMiss(v: string, segments: number): MorphMiss | undefined {
  if (!MORPH_NUMBER_LIST_RE.test(v)) return 'value';
  const sets = v.split(MORPH_VALUES_SEPARATOR).map((s) => numberList(s.trim().replace(/ +/g, ';'), MORPH_VALUES_SEPARATOR));
  if (sets.some((n) => !n)) return 'value';
  return sets.length === segments && sets.every((n) => n!.length === 4 && n!.every((x) => x <= 1)) ? undefined : 'counts';
}

/**
 * The morph rule for one `<animate>` (svg-safety 1.3.1): why it must go, or undefined to keep it exactly as written.
 * `siblings` is how many animate elements its parent holds; `ids` the animate ids the record's morphs name.
 */
export function morphMiss(el: Element, parent: Element, siblings: number, ids: ReadonlySet<string> | undefined): MorphMiss | undefined {
  if (el.namespaceURI !== SVG_NS || el.localName !== MORPH_ELEMENT) return 'namespace';
  if (parent.namespaceURI !== SVG_NS || parent.localName !== MORPH_PARENT) return 'parent';
  if (el.firstChild) return 'children';
  if (siblings > 1) return 'second';
  const a: Record<string, string> = Object.create(null);
  for (const attr of Array.from(el.attributes)) {
    if (attr.namespaceURI !== null || !(MORPH_ATTRIBUTES as readonly string[]).includes(attr.name)) return 'attribute';
    a[attr.name] = attr.value;
  }
  if (MORPH_REQUIRED.some((k) => a[k] === undefined)) return 'attribute';
  if (!IMAGE_ID_RE.test(a.id)) return 'value';
  if (!ids || !ids.has(a.id)) return 'unnamed';
  for (const [k, v] of Object.entries(MORPH_FIXED)) if (a[k] !== v) return 'value';
  if (!MORPH_DUR_RE.test(a.dur)) return 'value';
  if (a.repeatCount !== undefined && !MORPH_REPEAT_RE.test(a.repeatCount)) return 'value';
  if (a.fill !== undefined && !(MORPH_FILLS as readonly string[]).includes(a.fill)) return 'value';
  if (a.calcMode !== undefined && !(MORPH_CALC_MODES as readonly string[]).includes(a.calcMode)) return 'value';
  const frames = a.values.split(MORPH_VALUES_SEPARATOR);
  if (frames.length < IMAGE_MORPH_MIN_FRAMES || frames.length > IMAGE_MORPH_MAX_FRAMES) return 'counts';
  const shapes = frames.map(pathStructure);
  if (shapes.some((s) => !s)) return 'value';
  if (shapes.some((s) => s !== shapes[0])) return 'frames';
  if (a.keyTimes !== undefined) {
    const times = numberList(a.keyTimes, MORPH_VALUES_SEPARATOR);
    if (!times) return 'value';
    if (times.length !== frames.length || times[0] !== 0 || times[times.length - 1] !== 1 || !risingUnit(times)) return 'counts';
  }
  if (a.calcMode === 'spline' && a.keySplines === undefined) return 'counts';
  return a.keySplines === undefined ? undefined : splinesMiss(a.keySplines, frames.length - 1);
}
