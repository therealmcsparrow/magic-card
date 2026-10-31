import type { SvgPolicy, SvgValueKind, SvgWalkLimits } from '../contracts/svg-safety';

/*
 * Value rules shared by the icon and image sanitisers: they mirror how a browser reads an SVG
 * presentation attribute and reject script URLs, external url(), CSS escapes, expression() and
 * @import. Every check is an allow-list or a bounded scan.
 */

/** Tokens that make a value unsafe whatever its kind: backslash, angle brackets, `//`, comments, script and data URLs. */
const DENY_RE = /[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i;

/** True when the value holds a deny token of the shared set or of the policy. */
export function denied(value: string, policy: SvgPolicy): boolean {
  if (DENY_RE.test(value)) return true;
  if (!policy.denyExtra.length) return false;
  const low = value.toLowerCase();
  return policy.denyExtra.some((t) => low.includes(t));
}

/** JavaScript `\s`, by code unit. */
const isSpace = (c: number): boolean =>
  c === 32 || (c >= 9 && c <= 13) || c === 0xa0 || c === 0x1680 || (c >= 0x2000 && c <= 0x200a) || c === 0x2028 || c === 0x2029 || c === 0x202f || c === 0x205f || c === 0x3000 || c === 0xfeff;
export const isLetter = (c: number): boolean => (c >= 65 && c <= 90) || (c >= 97 && c <= 122);

/** True when every "(" in the value opens a function named in `allowed` (lower-case names). */
export function onlyFunctions(value: string, allowed: readonly string[]): boolean {
  for (let i = value.indexOf('('); i >= 0; i = value.indexOf('(', i + 1)) {
    let end = i;
    while (end > 0 && isSpace(value.charCodeAt(end - 1))) end--;
    let start = end;
    while (start > 0 && (isLetter(value.charCodeAt(start - 1)) || value.charCodeAt(start - 1) === 45)) start--;
    if (start === end || !allowed.includes(value.slice(start, end).toLowerCase())) return false;
  }
  return true;
}

/** The kind the policy gives an attribute name, or undefined when the name is not kept. */
export function kindOf(policy: SvgPolicy, name: string): SvgValueKind | undefined {
  return Object.prototype.hasOwnProperty.call(policy.kinds, name) ? policy.kinds[name] : policy.fallback;
}

/** Class tokens that are plain words, joined by one space; undefined when none is left. */
export function classTokens(v: string, re: RegExp): string | undefined {
  const tokens = v.split(/\s+/).filter((t) => re.test(t));
  return tokens.length ? tokens.join(' ') : undefined;
}

/**
 * The value to keep for an attribute of the icon policy, or undefined to drop (and list) it. Everything is checked with
 * the deny tokens and the function lists, and the value is kept as written.
 */
export function cleanIconValue(kind: SvgValueKind, raw: string, policy: SvgPolicy): string | undefined {
  if (policy.maxValueChars !== undefined && raw.length > policy.maxValueChars) return undefined;
  const v = raw.trim();
  if (denied(v, policy)) return undefined;
  if (kind === 'transform') return onlyFunctions(v, policy.transformFunctions) ? raw : undefined;
  if (!onlyFunctions(v.replace(/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi, ''), policy.colourFunctions)) return undefined;
  if (kind === 'id') return /^[\w.:-]+$/.test(v) ? v : undefined;
  if (kind === 'class') return classTokens(v, /^[\w-]+$/);
  return raw;
}

/** 'too_complex' when the tree holds more elements than `limits.maxNodes` or nests deeper than `limits.maxDepth`. */
export function withinLimits(root: Element, limits: SvgWalkLimits): 'ok' | 'too_complex' {
  const stack: Element[] = [root];
  const depths: number[] = [0];
  let nodes = 0;
  while (stack.length) {
    const el = stack.pop() as Element;
    const depth = depths.pop() as number;
    if (depth > limits.maxDepth) return 'too_complex';
    for (let c = el.firstElementChild; c; c = c.nextElementSibling) {
      if (++nodes > limits.maxNodes) return 'too_complex';
      stack.push(c);
      depths.push(depth + 1);
    }
  }
  return 'ok';
}

/** UTF-8 length of a text. */
export function byteLength(text: string): number {
  return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length;
}

export const escapeText = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeAttr = (s: string): string => escapeText(s).replace(/"/g, '&quot;');
