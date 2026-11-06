import { IMAGE_FONT_FAMILIES, IMAGE_ID_RE, THEME_VAR_NAME_RE } from '../contracts/svg-image';
import type { SvgPolicy, SvgValueKind } from '../contracts/svg-safety';
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
