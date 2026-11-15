// parseLook: look text to a parsed look or a fixed refusal code (contract look-grammar 2.1.0). Pure TS, no DOM.
// Every key is judged by LOOK_KEY_TABLES and every string by the value grammar; the result is built only from accepted keys.

import {
  LOOK_ANIMATION_TRIGGERS,
  LOOK_ARRAY_MAX_ITEMS,
  LOOK_CARD_KEYS,
  LOOK_CSS_FUNCTIONS,
  LOOK_CSS_MAX_CHARS,
  LOOK_CSS_PROPERTY_DENY,
  LOOK_CSS_PROPERTY_RE,
  LOOK_DROPPED_KEYS,
  LOOK_DROPPED_KEY_SUFFIX,
  LOOK_ENTITY_ID_RE,
  LOOK_FONT_KEYS,
  LOOK_GRAMMAR,
  LOOK_MAX_BYTES,
  LOOK_MAX_DEPTH,
  LOOK_MODULE_COMMON_KEYS,
  LOOK_MODULE_KEYS,
  LOOK_MODULE_TYPES,
  LOOK_PRESET_ID_RE,
  LOOK_VALUE_CHARSET,
  LOOK_VALUE_MAX_CHARS,
  LOOK_VAR_RE,
  type LookDoc,
  type LookDrop,
  type LookKeyRule,
  type LookModuleType,
  type LookParseCode,
  type LookParseResult,
  type LookTableName,
} from '../contracts/look-grammar';
import { LOOK_KEY_TABLES, readCssDeclarations, readFontFamily } from './grammar';

type Plain = Record<string, unknown>;
type Table = Readonly<Record<string, LookKeyRule>>;

/** Thrown inside the walk, caught in parseLook. */
interface Refusal {
  code: LookParseCode;
  path: string;
}

const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const isPlain = (v: unknown): v is Plain => typeof v === 'object' && v !== null && !Array.isArray(v);
const refuse = (code: LookParseCode, path: string): never => {
  throw { code, path } as Refusal;
};
const esc = (key: string): string => key.replace(/~/g, '~0').replace(/\//g, '~1');

const DROPPED = new Set<string>(LOOK_DROPPED_KEYS);
const TABLES = LOOK_KEY_TABLES as unknown as Record<LookTableName, Table>;
const FUNCTIONS = new Set<string>(LOOK_CSS_FUNCTIONS);
const FONT_KEYS = new Set<string>(LOOK_FONT_KEYS);
const TRIGGERS = new Set<string>(LOOK_ANIMATION_TRIGGERS);
const CSS_DENY = new Set<string>(LOOK_CSS_PROPERTY_DENY);
const NAME_CHAR = /[A-Za-z0-9_-]/;

/** Length of the text in UTF-8 bytes, stopping once it is over the limit. */
const utf8Length = (s: string): number => {
  let n = 0;
  for (let i = 0; i < s.length && n <= LOOK_MAX_BYTES; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length && (s.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
      n += 4;
      i++;
    } else n += 3;
  }
  return n;
};

/** Depth and array limits over the whole parsed tree, dropped keys included. */
const checkLimits = (v: unknown, depth: number, path: string): void => {
  if (Array.isArray(v)) {
    if (depth > LOOK_MAX_DEPTH || v.length > LOOK_ARRAY_MAX_ITEMS) refuse('too_large', path);
    for (let i = 0; i < v.length; i++) checkLimits(v[i], depth + 1, path + '/' + i);
  } else if (isPlain(v)) {
    if (depth > LOOK_MAX_DEPTH) refuse('too_large', path);
    for (const k of Object.keys(v)) checkLimits(v[k], depth + 1, path + '/' + esc(k));
  }
};

/** The value grammar for one string; false when it is not safe. */
const safeValue = (s: string): boolean => {
  if (s.length > LOOK_VALUE_MAX_CHARS || !LOOK_VALUE_CHARSET.test(s)) return false;
  if (s.indexOf('//') >= 0 || s.indexOf('/*') >= 0) return false;
  for (let i = s.indexOf('('); i >= 0; i = s.indexOf('(', i + 1)) {
    let start = i;
    while (start > 0 && NAME_CHAR.test(s.charAt(start - 1))) start--;
    const name = s.slice(start, i).toLowerCase();
    if (name === '') continue;
    if (!FUNCTIONS.has(name)) return false;
    if (name === 'var') {
      const end = s.indexOf(')', i);
      if (end < 0 || !LOOK_VAR_RE.test(s.slice(start, end + 1))) return false;
    }
  }
  return true;
};

const safeFont = (s: string): boolean => s.length <= LOOK_VALUE_MAX_CHARS && readFontFamily(s) !== null;

/** A `css` declaration list under the property deny-list. */
const safeCss = (s: string): boolean => {
  if (s.length > LOOK_CSS_MAX_CHARS || /[{}@\\<]/.test(s) || s.indexOf('/*') >= 0) return false;
  const declarations = readCssDeclarations(s);
  if (!declarations) return false;
  for (const d of declarations) {
    if (!LOOK_CSS_PROPERTY_RE.test(d.property) || CSS_DENY.has(d.property) || d.value === '') return false;
    if (d.property === 'font-family' ? !safeFont(d.value) : !safeValue(d.value)) return false;
  }
  return true;
};

interface Walk {
  dropped: LookDrop[];
}

const dropAt = (w: Walk, path: string): void => {
  w.dropped.push({ path });
};

/** A scalar under a `value` rule: the accepted value, or undefined when an entity id drops the key. */
const scalar = (key: string, v: unknown, path: string, table: LookTableName): string | number | boolean | undefined => {
  if (typeof v === 'string') {
    if (LOOK_ENTITY_ID_RE.test(v)) return undefined;
    if (table === 'AnimationConfig' && key === 'preset') return v;
    const ok = key === 'css' ? safeCss(v) : FONT_KEYS.has(key) ? safeFont(v) : safeValue(v);
    if (!ok) refuse('unsafe_value', path);
    return v;
  }
  if ((key === 'css' || FONT_KEYS.has(key)) && v !== null) return refuse('bad_type', path);
  if (typeof v === 'number') return Number.isFinite(v) ? v : refuse('bad_type', path);
  if (typeof v === 'boolean') return v;
  return refuse('bad_type', path);
};

/** An animation entry is dropped whole when its trigger is not allowed or its preset is missing or not a library id. */
const animationEntryDropped = (item: Plain): boolean => {
  if (has(item, 'trigger') && item.trigger !== undefined && (typeof item.trigger !== 'string' || !TRIGGERS.has(item.trigger))) return true;
  return typeof item.preset !== 'string' || !LOOK_PRESET_ID_RE.test(item.preset);
};

const walkArray = (rule: LookTableName | 'value', key: string, items: unknown[], path: string, w: Walk, table: LookTableName): unknown[] | undefined => {
  const out: unknown[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const p = path + '/' + i;
    if (item === null) {
      dropAt(w, p);
      continue;
    }
    if (rule === 'value') {
      const s = scalar(key, item, p, table);
      if (s === undefined) {
        dropAt(w, path);
        return undefined;
      }
      out.push(s);
      continue;
    }
    if (!isPlain(item)) return refuse('bad_type', p);
    if (rule === 'AnimationConfig' && animationEntryDropped(item)) {
      dropAt(w, p);
      continue;
    }
    const o = walkObject(rule, item, p, null, w);
    if (o) out.push(o);
  }
  return out.length > 0 ? out : undefined;
};

/** Walks one object with a table; `only` limits the keys of a module target. Returns undefined when nothing is left. */
const walkObject = (name: LookTableName, src: Plain, path: string, only: readonly string[] | null, w: Walk): Plain | undefined => {
  const table = TABLES[name];
  const out: Plain = {};
  let kept = 0;
  for (const key of Object.keys(src)) {
    const p = path + '/' + esc(key);
    const v = src[key];
    const rule: LookKeyRule = has(table, key) ? table[key] : 'drop';
    if (
      rule === 'drop' ||
      v === null ||
      DROPPED.has(key) ||
      key.slice(-LOOK_DROPPED_KEY_SUFFIX.length) === LOOK_DROPPED_KEY_SUFFIX ||
      (only !== null && only.indexOf(key) < 0)
    ) {
      dropAt(w, p);
      continue;
    }
    let accepted: unknown;
    if (rule === 'value') {
      accepted = scalar(key, v, p, name);
    } else if ('array' in rule) {
      if (!Array.isArray(v)) return refuse('bad_type', p);
      accepted = walkArray(rule.array, key, v, p, w, name);
    } else if (isPlain(v)) {
      accepted = walkObject(rule.object, v, p, null, w);
    } else if ('value' in rule) {
      accepted = scalar(key, v, p, name);
    } else {
      return refuse('bad_type', p);
    }
    if (accepted === undefined) {
      // an entity id drops its key; an object or array emptied by drops leaves no pointer of its own
      if (typeof v === 'string') dropAt(w, p);
      continue;
    }
    out[key] = accepted;
    kept++;
  }
  return kept > 0 ? out : undefined;
};

const moduleKeys = (target: LookModuleType | '*'): readonly string[] => {
  if (target === '*') return LOOK_MODULE_COMMON_KEYS;
  const own = (LOOK_MODULE_KEYS as Partial<Record<LookModuleType, readonly string[]>>)[target];
  return own ? [...LOOK_MODULE_COMMON_KEYS, ...own] : LOOK_MODULE_COMMON_KEYS;
};

const isTarget = (name: string): name is LookModuleType | '*' => name === '*' || (LOOK_MODULE_TYPES as readonly string[]).indexOf(name) >= 0;

export const parseLook = (text: string): LookParseResult => {
  try {
    if (typeof text !== 'string') return { ok: false, code: 'json', path: '' };
    if (utf8Length(text) > LOOK_MAX_BYTES) return { ok: false, code: 'too_large', path: '' };
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, code: 'json', path: '' };
    }
    checkLimits(parsed, 1, '');
    if (!isPlain(parsed)) return refuse('not_object', '');
    const g = parsed.grammar;
    if (typeof g !== 'number' || !Number.isInteger(g) || g < 1 || g > LOOK_GRAMMAR) return refuse('grammar_unsupported', '/grammar');
    const w: Walk = { dropped: [] };
    const look: LookDoc = { grammar: LOOK_GRAMMAR };
    for (const k of Object.keys(parsed)) if (k !== 'grammar' && k !== 'card' && k !== 'modules') dropAt(w, '/' + esc(k));

    if (has(parsed, 'card')) {
      if (!isPlain(parsed.card)) return refuse('not_object', '/card');
      const card = walkObject('CardLook', parsed.card, '/card', LOOK_CARD_KEYS, w);
      if (card) look.card = card;
    }
    if (has(parsed, 'modules')) {
      const mods = parsed.modules;
      if (!isPlain(mods)) return refuse('not_object', '/modules');
      const targets: NonNullable<LookDoc['modules']> = {};
      for (const name of Object.keys(mods)) {
        const p = '/modules/' + esc(name);
        if (!isTarget(name)) return refuse('unknown_target', p);
        const t = mods[name];
        if (!isPlain(t)) return refuse('not_object', p);
        const body = walkObject('ModuleLook', t, p, moduleKeys(name), w);
        if (body) targets[name] = body;
      }
      if (Object.keys(targets).length > 0) look.modules = targets;
    }
    if (!look.card && !look.modules) return { ok: false, code: 'empty', path: '' };
    return { ok: true, look, dropped: w.dropped };
  } catch (e) {
    if (isPlain(e) && typeof e.code === 'string' && typeof e.path === 'string') return { ok: false, code: e.code as LookParseCode, path: e.path };
    return { ok: false, code: 'json', path: '' };
  }
};
