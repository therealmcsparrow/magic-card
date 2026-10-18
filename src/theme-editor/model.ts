import { THEME_VAR_RE } from '../contracts/theme-catalogue';
import type { FieldKind } from '../contracts/theme-catalogue';
import type { ThemeDoc, ThemeMode, ThemeValue } from '../contracts/theme-editor';
import { t } from './i18n';

/*
 * The theme document model: pure functions on ThemeDoc, no DOM state. Docs are never mutated; every
 * edit returns a new doc that keeps the key order of the file (new keys go at the end of their
 * block) and every key it did not touch, so a save changes only what the user changed.
 */

export interface DocError {
  /** Backend path form: "theme.primary-color", "theme.modes.dark.x". */
  path: string;
  message: string;
}

const MODES: readonly string[] = ['light', 'dark'];
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** The backend's MAX_VALUE_CHARS and bad-character rule (theme_files.py), so the inline error comes before the save error. */
const MAX_VALUE_LENGTH = 4000;
// eslint-disable-next-line no-control-regex
const BAD_CHARS_RE = /[\u0000-\u0008\u000b-\u001f\u007f]/;

type Bag<T> = Record<string, T>;
const isRecord = (v: unknown): v is Bag<unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isScalar = (v: unknown): v is ThemeValue => typeof v === 'string' || typeof v === 'number';

// ── resolve and derive ──

/** The variables the theme gives in one mode: the base keys, then that mode's keys over them. */
export function resolveTheme(doc: ThemeDoc, mode: ThemeMode): Bag<ThemeValue> {
  const out: Bag<ThemeValue> = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k !== 'modes' && !FORBIDDEN_KEYS.has(k) && isScalar(v)) out[k] = v;
  }
  const block: unknown = doc.modes?.[mode];
  if (isRecord(block)) {
    for (const [k, v] of Object.entries(block)) {
      if (!FORBIDDEN_KEYS.has(k) && isScalar(v)) out[k] = v;
    }
  }
  return out;
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** "r, g, b" for #rgb / #rrggbb, else undefined. */
export function hexToRgb(value: string): string | undefined {
  const m = HEX_RE.exec(value.trim());
  if (!m) return undefined;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ');
}

/** Adds `rgb-<key>` for every hex colour whose `rgb-<key>` is not set, as HA's theme loader does. */
export function deriveRgb(vars: Bag<ThemeValue>): Bag<ThemeValue> {
  const out: Bag<ThemeValue> = { ...vars };
  for (const [k, v] of Object.entries(vars)) {
    if (typeof v !== 'string' || `rgb-${k}` in vars) continue;
    const rgb = hexToRgb(v);
    if (rgb) out[`rgb-${k}`] = rgb;
  }
  return out;
}

/** What the preview root sets: resolved + derived rgb variables, all strings. */
export function previewVars(doc: ThemeDoc, mode: ThemeMode): Bag<string> {
  return Object.fromEntries(Object.entries(deriveRgb(resolveTheme(doc, mode))).map(([k, v]) => [k, String(v)]));
}

// ── edits ──

export function cloneDoc(doc: ThemeDoc): ThemeDoc {
  const out: Bag<unknown> = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k === 'modes' && isRecord(v)) {
      const modes: Bag<unknown> = {};
      for (const [mk, mv] of Object.entries(v)) modes[mk] = isRecord(mv) ? { ...mv } : mv;
      out.modes = modes;
    } else {
      out[k] = v;
    }
  }
  return out as ThemeDoc;
}

const guardKey = (key: string): void => {
  if (FORBIDDEN_KEYS.has(key)) throw new Error(`Not a theme variable name: ${key}`);
};

/** `key` replaced in place if present, else appended (before the entry named `keepLast` when that one is last). */
function putKey<T>(block: Bag<T>, key: string, value: T, keepLast?: string): Bag<T> {
  const entries = Object.entries(block);
  const at = entries.findIndex(([k]) => k === key);
  if (at >= 0) entries[at] = [key, value];
  else if (keepLast && entries.length && entries[entries.length - 1][0] === keepLast) entries.splice(entries.length - 1, 0, [key, value]);
  else entries.push([key, value]);
  return Object.fromEntries(entries);
}

/** A new doc with `key` set in the base (no mode) or in that mode's block. */
export function setVar(doc: ThemeDoc, key: string, value: ThemeValue, mode?: ThemeMode): ThemeDoc {
  guardKey(key);
  const next = cloneDoc(doc);
  if (!mode) return putKey(next as Bag<unknown>, key, value, 'modes') as ThemeDoc;
  const modes = (next.modes ?? {}) as Bag<unknown>;
  const block = putKey<unknown>((modes[mode] as Bag<unknown> | undefined) ?? {}, key, value);
  return putKey(next as Bag<unknown>, 'modes', putKey(modes, mode, block)) as ThemeDoc;
}

/** A new doc without `key`; a mode block (and `modes`) emptied by it goes too. */
export function removeVar(doc: ThemeDoc, key: string, mode?: ThemeMode): ThemeDoc {
  const next = cloneDoc(doc);
  if (!mode) {
    delete next[key];
    return next;
  }
  const block = next.modes?.[mode];
  if (!next.modes || !block) return next;
  delete block[key];
  if (Object.keys(block).length === 0) delete next.modes[mode];
  if (Object.keys(next.modes).length === 0) delete next.modes;
  return next;
}

/** True when saving `current` would change the file relative to `saved` (value, key set or key order). */
export function isDirty(saved: ThemeDoc, current: ThemeDoc): boolean {
  return JSON.stringify(saved) !== JSON.stringify(current);
}

// ── validation ──

const SIZE_RE = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:px|r?em|%|vw|vh|vmin|vmax|dvh|svh|lvh|ch|ex|cm|mm|in|pt|pc|cqw|cqh)$/i;
const ZERO_RE = /^[-+]?0*\.?0+$/;
const FN_RE = /^(?:calc|min|max|clamp)\(.*\)$/is;
const VAR_RE = /^var\(.*\)$/is;
const GRADIENT_RE = /(?:^|[^\w-])(?:repeating-)?(?:linear|radial|conic)-gradient\(/i;
const RGB_RE = /^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/;

const balanced = (v: string): boolean => {
  let depth = 0;
  for (const c of v) {
    if (c === '(') depth++;
    else if (c === ')' && --depth < 0) return false;
  }
  return depth === 0;
};

/** The browser's CSS check; true where there is none (the structural checks above it still run). */
const supports = (prop: string, value: string): boolean => (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ? CSS.supports(prop, value) : true);

const sizeMsg = (): string => t('Enter a length like 12px or 1rem.');
const gradientMsg = (): string => t('This field takes one colour, not a gradient.');
const colourMsg = (): string => t('Enter a colour like #1a73e8 or rgb(26, 115, 232).');

/** True for the two colour-field errors the field group words itself (a colour field leads with the picker). */
export const isGradientMsg = (message: string): boolean => message === gradientMsg();
export const isColourMsg = (message: string): boolean => message === colourMsg();

/** null when `value` is fine for `kind`, else a short reason for the field's inline error. */
export function validateValue(kind: FieldKind, value: ThemeValue): string | null {
  if (typeof value === 'number' && !Number.isFinite(value)) return kind === 'number' ? t('Enter a number.') : t('Enter a value.');
  const v = String(value).trim();
  if (!v) return t('Enter a value.');
  if (v.length > MAX_VALUE_LENGTH) return t('This value is longer than {max} characters.', { max: String(MAX_VALUE_LENGTH) });
  if (BAD_CHARS_RE.test(v)) return t('This value has a control character. Remove it.');
  if (kind === 'text') return null;
  if (/[;{}]/.test(v) || !balanced(v)) return t('Remove {chars} and unmatched brackets from the value.', { chars: '; { }' });
  const isVar = VAR_RE.test(v);
  switch (kind) {
    case 'number':
      return Number.isFinite(Number(v)) ? null : t('Enter a number.');
    case 'rgb': {
      const m = RGB_RE.exec(v);
      return m && [m[1], m[2], m[3]].every((n) => Number(n) <= 255) ? null : t('Enter three numbers from 0 to 255, like 255, 120, 0.');
    }
    case 'size':
      if (isVar) return null;
      if (!SIZE_RE.test(v) && !ZERO_RE.test(v) && !FN_RE.test(v)) return sizeMsg();
      return supports('width', v) ? null : sizeMsg();
    case 'color':
      if (isVar) return null;
      if (GRADIENT_RE.test(v)) return gradientMsg();
      return supports('color', v) ? null : colourMsg();
    case 'background':
      return isVar || supports('background', v) ? null : t('Enter a colour or a gradient.');
    case 'shadow':
      return supports('box-shadow', v) ? null : t('Enter a shadow like 0 2px 6px rgba(0, 0, 0, 0.3).');
    case 'border':
      return supports('border', v) ? null : t('Enter a border like 1px solid #ccc.');
    case 'font':
      return supports('font-family', v) ? null : t('Enter a font family.');
    default:
      return null;
  }
}

/**
 * Every problem that would block a save, by backend path. `kindOf` maps a variable name to its
 * catalogue kind (unknown names are checked as free text).
 */
export function docErrors(doc: ThemeDoc, kindOf: (name: string) => FieldKind | undefined = () => undefined): DocError[] {
  const errors: DocError[] = [];
  const checkVar = (path: string, name: string, value: unknown): void => {
    if (!THEME_VAR_RE.test(name) || FORBIDDEN_KEYS.has(name)) {
      errors.push({ path, message: t('Use letters, numbers, dashes and underscores for a variable name.') });
    } else if (!isScalar(value)) {
      errors.push({ path, message: t('This value must be text or a number.') });
    } else {
      const message = validateValue(kindOf(name) ?? 'text', value);
      if (message) errors.push({ path, message });
    }
  };
  for (const [k, v] of Object.entries(doc)) {
    if (k !== 'modes') {
      checkVar(`theme.${k}`, k, v);
    } else if (v !== undefined && !isRecord(v)) {
      errors.push({ path: 'theme.modes', message: t('Modes must hold a light and a dark block.') });
    } else if (v !== undefined) {
      for (const [mode, block] of Object.entries(v as Bag<unknown>)) {
        const base = `theme.modes.${mode}`;
        if (!MODES.includes(mode) || !isRecord(block)) errors.push({ path: base, message: t('A mode block must be light or dark and hold variables.') });
        else for (const [bk, bv] of Object.entries(block)) checkVar(`${base}.${bk}`, bk, bv);
      }
    }
  }
  return errors;
}

