import { CSS_BREAKOUT_MARKERS, CSS_PAINT_PROPERTIES, CSS_PROPERTY_RE, PAINT_DATA_URL_RE, PAINT_LOCAL_PATH_RE, PLACEHOLDER_ID_RE, SHARED_CARD_TYPE, STRICT_ANY_TYPES, THEME_KEY_TYPES } from '../contracts/share-kit';
import type { CardKeyLists, CardReadResult, CssCheck, ImportNotice, SharedAction, SharedCardConfig, SharedTemplate, ShareKitHelpers, StrictRuleId, StrictType, ValueRefusal } from '../contracts/share-kit';
import type { TransferItem, TransferKind, TransferNote } from '../contracts/preset-transfer';
import { splitDeclarations } from '../utils/css-utils';
import { t } from './i18n';
import { markerIn, scanMarkers, strictValue } from './strict';

// Reads a shared card: card and module keys, design values by key, free-form css per declaration, actions, other-host
// URLs and inline SVG. Also lists the actions, templates and placeholders of items about to be saved. Nothing runs.

type Raw = Record<string, unknown>;
const DROP = Symbol('drop');
const MAX_DEPTH = 60;
const ACTION_KEYS: ReadonlySet<string> = new Set(['tap_action', 'hold_action', 'double_tap_action']);
const URL_KEYS: ReadonlySet<string> = new Set(['image', 'entity_picture', 'picture', 'src', 'url']);
const DESIGN_KEYS: ReadonlySet<string> = new Set(['design', 'hover', 'custom_animations', 'custom_shapes']);
const TEMPLATE_RE = /\{\{|\{%|\{#/;
const ENTITY_COLOUR_RE = /^entity(?: \d{1,3}%)?$/;
const FUNCTION_RE = /([a-z][a-z0-9-]*)\s*\(/gi;
const PLACEHOLDER_SCAN_RE = /(?<![a-z0-9_])[a-z][a-z0-9_]*\.mc_placeholder_[1-9][0-9]*(?![a-z0-9_])/g;
/** Functions a free-form css value may use besides the colour and calc() forms of the strict types. */
const CSS_FUNCTIONS: ReadonlySet<string> = new Set(
  'translate translatex translatey translatez translate3d rotate rotatex rotatey rotatez rotate3d scale scalex scaley scalez scale3d skew skewx skewy matrix matrix3d perspective blur brightness contrast grayscale hue-rotate invert opacity saturate sepia drop-shadow repeat minmax fit-content cubic-bezier steps var calc min max clamp rgb rgba hsl hsla hwb lab lch oklab oklch color color-mix light-dark linear-gradient radial-gradient conic-gradient repeating-linear-gradient repeating-radial-gradient repeating-conic-gradient'.split(' '),
);

const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const rawAt = (path: string, key: string | number): string => (typeof key === 'number' ? `${path}[${key}]` : `${path}.${key}`);
/** True when `s` holds a control character; tab, line feed and carriage return are allowed when `layout` is set. */
const hasControl = (s: string, layout: boolean): boolean => [...s].some((ch) => (ch < ' ' && !(layout && '\t\n\r'.includes(ch))) || ch === '\u007f');
const nameOf = (path: string): string => path.slice(path.lastIndexOf('.') + 1);

/** Hosts a value names: the part after `://` or a leading `//`, lower-case, each once. */
function hostsIn(s: string): string[] {
  return [...new Set([...s.matchAll(/(?:\b(?:https?|wss?|ftp):(?!\/)|\/\/)(?:[^\s/@)"'\\]*@)?(\[[0-9a-f:]+\]|[^\s/:?#)"'\\,;]+)/gi)].map((m) => m[1].toLowerCase()))];
}

/** Every `url(...)` of `s` names a sanitised data: image or a /local/ file; a string without url() passes. */
function urlsOk(s: string): boolean {
  const open = (s.match(/url\s*\(/gi) ?? []).length;
  const args = [...s.matchAll(/url\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)/gi)].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
  return args.length === open && args.every((a) => PAINT_DATA_URL_RE.test(a) || PAINT_LOCAL_PATH_RE.test(a));
}

/** The value of a url action or navigation path is a web link, or a path on this dashboard; any other scheme is not. */
function linkOk(v: unknown): boolean {
  if (typeof v !== 'string' || hasControl(v, false)) return false;
  try {
    const u = new URL(v.trim(), 'http://relative.invalid');
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** A free-form css value: words, numbers, commas and known functions only (no url(), quotes or punctuation). */
function functional(s: string): boolean {
  if (!/^[\w\s(),.%#+*/-]+$/.test(s) || s.length > 512) return false;
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')' && --depth < 0) return false;
  }
  const names = [...s.matchAll(FUNCTION_RE)].map((m) => m[1].toLowerCase());
  return depth === 0 && names.length === (s.match(/\(/g)?.length ?? 0) && names.every((n) => CSS_FUNCTIONS.has(n));
}

const dropped = (item: number, path: string, rule: StrictRuleId, message: string, hosts?: string[]): TransferNote => ({
  code: 'dropped_value',
  item,
  path,
  message,
  rule,
  ...(hosts?.length ? { hosts } : {}),
});

/** `css` split into declarations and checked one by one; a break-out marker refuses the whole file. */
export function checkCss(item: number, path: string, css: string): CssCheck {
  const low = css.toLowerCase();
  if (CSS_BREAKOUT_MARKERS.some((m) => low.includes(m)) || hasControl(css, true)) return { ok: false, refusal: { item, path, rule: 'strict.marker' } };
  const notes: TransferNote[] = [];
  const kept: string[] = [];
  splitDeclarations(css).forEach((decl, i) => {
    const colon = decl.indexOf(':');
    const name = colon < 0 ? '' : decl.slice(0, colon).trim();
    const value = colon < 0 ? '' : decl.slice(colon + 1).replace(/\s*!important\s*$/i, '').trim();
    if (!CSS_PROPERTY_RE.test(name)) {
      notes.push(dropped(item, `${path}[${i}]`, 'strict.css', t('share-kit.card.a-style-line-was-left-out-because-its-name-is')));
      return;
    }
    const rule = THEME_KEY_TYPES.find((r) => r.match.test(name));
    const paint = CSS_PAINT_PROPERTIES.includes(name);
    const types: StrictType[] = [...(rule?.types ?? STRICT_ANY_TYPES).filter((ty) => ty !== 'paint-image'), 'keyword', ...(paint ? (['paint-image'] as const) : [])];
    const v = value && !rule && !/url\s*\(/i.test(value) && functional(value) ? { verdict: 'kept' as const } : strictValue(value, types);
    if (v.verdict === 'kept') kept.push(decl);
    else {
      const hosts = hostsIn(value);
      notes.push(dropped(item, `${path}.${name}`, hosts.length ? 'strict.host' : 'strict.css', t('share-kit.card.name-was-left-out-because-its-value-is-not-allowed', { name, rule: hosts.length ? 'strict.host' : 'strict.css' }), hosts));
    }
  });
  return { ok: true, css: kept.join('; '), notes };
}

interface Ctx {
  item: number;
  lists: CardKeyLists;
  helpers: ShareKitHelpers;
  notes: TransferNote[];
  refusal?: ValueRefusal;
}

const refuse = (c: Ctx, path: string): typeof DROP => {
  c.refusal ??= { item: c.item, path, rule: 'strict.marker' };
  return DROP;
};

const drop = (c: Ctx, path: string, rule: StrictRuleId, hosts?: string[]): typeof DROP => {
  c.notes.push(dropped(c.item, path, rule, rule === 'strict.host' ? t('share-kit.card.name-points-to-another-website-so-it-was-left', { name: nameOf(path), rule }) : t('share-kit.card.name-was-left-out-because-its-value-is-not-allowed', { name: nameOf(path), rule }), hosts));
  return DROP;
};

/** An action: kept as written unless its link or path is not a web link or a path on this dashboard. */
function readAction(a: Raw, path: string, c: Ctx, depth: number): unknown {
  const nav = a.navigation_path;
  const bad = (a.action === 'url' && !linkOk(a.url_path)) || (nav !== undefined && (!linkOk(nav) || /^\s*\/\//.test(String(nav))));
  if (bad) {
    c.notes.push(dropped(c.item, path, 'strict.action-url', t('share-kit.card.an-action-was-left-out-because-its-web-address-is', { rule: 'strict.action-url' })));
    return DROP;
  }
  return walkObject(a, path, c, false, depth);
}

/** A module: its type must be known and only its own keys and the common module keys are kept. */
function readModule(m: unknown, path: string, c: Ctx, depth: number): unknown {
  const type = isObj(m) ? m.type : undefined;
  const own = typeof type === 'string' && Object.prototype.hasOwnProperty.call(c.lists.moduleKeys, type) ? c.lists.moduleKeys[type] : undefined;
  if (!isObj(m) || !own) {
    c.notes.push(c.helpers.note('dropped_key', c.item, path, t('share-kit.card.a-module-of-an-unknown-type-was-left-out')));
    return DROP;
  }
  const allowed = new Set([...own, ...c.lists.commonModuleKeys]);
  const out: Raw = {};
  for (const [k, v] of Object.entries(m)) {
    const at = rawAt(path, k);
    if (!allowed.has(k)) {
      c.notes.push(c.helpers.note('dropped_key', c.item, at, t('share-kit.card.key-is-not-a-card-setting-so-it-was-left', { key: k })));
      continue;
    }
    const r = walk(v, k, at, c, false, depth + 1);
    if (r !== DROP) out[k] = r;
  }
  return out;
}

function walkObject(o: Raw, path: string, c: Ctx, design: boolean, depth: number): Raw {
  const out: Raw = {};
  for (const [k, v] of Object.entries(o)) {
    if (c.refusal) break;
    const r = walk(v, k, rawAt(path, k), c, design || DESIGN_KEYS.has(k), depth + 1, path);
    if (r !== DROP) out[k] = r;
  }
  return out;
}

/** A value of the card: kept (possibly cleaned), or DROP. A refusal is recorded in `c.refusal`. */
function walk(v: unknown, key: string, path: string, c: Ctx, design: boolean, depth: number, parentPath = ''): unknown {
  if (c.refusal) return DROP;
  if (depth > MAX_DEPTH) return refuse(c, path);
  if (design || DESIGN_KEYS.has(key)) design = true;
  if (ACTION_KEYS.has(key) && isObj(v)) return readAction(v, path, c, depth);
  if (key === 'modules' && Array.isArray(v)) return v.map((m, i) => readModule(m, rawAt(path, i), c, depth + 1)).filter((m) => m !== DROP);
  if (typeof v === 'string') return walkString(v, key, path, c, design, parentPath);
  if (typeof v === 'number') {
    const types = c.lists.designTypes[key];
    return types && !types.includes('number') ? drop(c, path, `strict.${types[0]}`) : v;
  }
  if (Array.isArray(v)) {
    if (design && key !== 'modules') {
      const hit = scanMarkers(c.item, path, v);
      if (hit && (c.refusal = hit)) return DROP;
    }
    return v.map((e, i) => walk(e, `${key}[]`, rawAt(path, i), c, design, depth + 1, path)).filter((e) => e !== DROP);
  }
  if (isObj(v)) {
    if (design && DESIGN_KEYS.has(key) && (key === 'custom_animations' || key === 'custom_shapes')) {
      const hit = scanMarkers(c.item, path, v);
      if (hit) {
        c.refusal = hit;
        return DROP;
      }
    }
    return walkObject(v, path, c, design, depth);
  }
  return v;
}

function walkString(v: string, key: string, path: string, c: Ctx, design: boolean, parentPath: string): unknown {
  if (key === 'css') {
    const r = checkCss(c.item, path, v);
    if (!r.ok) {
      c.refusal = r.refusal;
      return DROP;
    }
    c.notes.push(...r.notes);
    return r.css;
  }
  if (key === 'svg' || parentPath.endsWith('custom_icons')) {
    const r = c.helpers.sanitizeIcon(c.item, path, v);
    c.notes.push(...r.notes);
    return r.svg ?? drop(c, path, 'strict.any');
  }
  const types = c.lists.designTypes[key];
  if (types) {
    if (types.includes('colour') && ENTITY_COLOUR_RE.test(v.trim())) return v;
    const r = strictValue(v, types);
    if (r.verdict === 'refused') return refuse(c, path);
    if (r.verdict === 'dropped') return drop(c, path, r.rule, hostsIn(v));
    if (/url\(\s*["']?\/local\//i.test(v)) c.notes.push(c.helpers.note('local_path', c.item, path, t('share-kit.card.name-uses-a-file-on-the-sharer-s-home-assistant', { name: nameOf(path) })));
    return v;
  }
  if (design && markerIn(v)) return refuse(c, path);
  if (URL_KEYS.has(key) && /^\s*(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(v)) return drop(c, path, 'strict.host', hostsIn(v));
  if (/url\s*\(/i.test(v) && !urlsOk(v)) return drop(c, path, 'strict.host', hostsIn(v));
  return v;
}

/** One card item: type, keys, design values, css, actions, URL hosts and inline SVG. */
export function readCardWith(helpers: ShareKitHelpers): (item: number, data: unknown, lists: CardKeyLists) => CardReadResult {
  return (item, data, lists) => {
    if (!isObj(data) || data.type !== SHARED_CARD_TYPE) return { ok: false, notes: [helpers.note('invalid_item', item, 'data', t('share-kit.card.this-is-not-a-magic-card-card'))] };
    const c: Ctx = { item, lists, helpers, notes: [] };
    const out: Raw = {};
    const keys = new Set(lists.cardKeys);
    for (const [k, v] of Object.entries(data)) {
      if (!keys.has(k)) {
        c.notes.push(helpers.note('dropped_key', item, `data.${k}`, t('share-kit.card.key-is-not-a-card-setting-so-it-was-left', { key: k })));
        continue;
      }
      const r = walk(v, k, `data.${k}`, c, false, 0);
      if (c.refusal) return { ok: false, notes: c.notes, refusal: c.refusal };
      if (r !== DROP) out[k] = r;
    }
    return { ok: true, data: out as unknown as SharedCardConfig, notes: c.notes };
  };
}

const targetsOf = (v: unknown, out: string[], depth = 0): void => {
  if (depth > 8 || v === null || typeof v !== 'object') return;
  for (const [k, e] of Object.entries(v)) {
    if (k === 'entity' || k === 'entity_id') for (const s of Array.isArray(e) ? e : [e]) if (typeof s === 'string') out.push(s);
    targetsOf(e, out, depth + 1);
  }
};

/** Actions and templates of one kept value, in document order. */
function listIn(v: unknown, item: number, path: string, key: string, out: { actions: SharedAction[]; templates: SharedTemplate[]; found: string[] }, depth = 0): void {
  if (depth > MAX_DEPTH) return;
  if (typeof v === 'string') {
    if (TEMPLATE_RE.test(v)) out.templates.push({ item, path, text: v });
    out.found.push(...(v.match(PLACEHOLDER_SCAN_RE) ?? []));
  } else if (Array.isArray(v)) v.forEach((e, i) => listIn(e, item, rawAt(path, i), key, out, depth + 1));
  else if (isObj(v)) {
    if (ACTION_KEYS.has(key) && typeof v.action === 'string' && v.action !== 'none') {
      const targets: string[] = [];
      targetsOf(v, targets);
      const host = v.action === 'url' && typeof v.url_path === 'string' ? hostsIn(v.url_path)[0] : undefined;
      out.actions.push({ item, path, action: v.action, ...(typeof v.service === 'string' ? { service: v.service } : {}), targets: [...new Set(targets)], ...(host ? { host } : {}) });
    }
    for (const [k, e] of Object.entries(v)) listIn(e, item, rawAt(path, k), k, out, depth + 1);
  }
}

/** What the import notice lists for `items`: placeholders of every kind, actions and templates of a card. */
export function importNoticeOf<K extends TransferKind>(kind: K, items: readonly TransferItem<K>[]): ImportNotice {
  const out = { actions: [] as SharedAction[], templates: [] as SharedTemplate[], found: [] as string[] };
  items.forEach((it, i) => listIn(it.data, i, 'data', '', out));
  const placeholders = [...new Set(out.found)].map((id) => ({ id, domain: PLACEHOLDER_ID_RE.exec(id)![1] }));
  return kind === 'card' ? { placeholders, actions: out.actions, templates: out.templates } : { placeholders, actions: [], templates: [] };
}
