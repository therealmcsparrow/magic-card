import { decodeCssEscapes } from '../contracts/preset-transfer';
import { CSS_BREAKOUT_MARKERS, CSS_PAINT_PROPERTIES, PAINT_DATA_URL_RE, PAINT_LOCAL_PATH_RE,CSS_PROPERTY_RE, PLACEHOLDER_ID_RE, SHARED_CARD_TYPE, STRICT_ANY_TYPES, THEME_KEY_TYPES } from '../contracts/share-kit';
import type { CardKeyLists, CardReadResult, CssCheck, ImportNotice, SharedAction, SharedCardConfig, SharedTemplate, ShareKitHelpers, StrictRuleId, StrictType, ValueRefusal } from '../contracts/share-kit';
import type { TransferItem, TransferKind, TransferNote } from '../contracts/preset-transfer';
import { splitDeclarations } from '../utils/css-utils';
import { t } from './i18n';
import { markerIn, scanMarkers, strictValue, urlAllowed, urlLike, urlsOk } from './strict';

// Reads a shared card: card and module keys, design values by key, free-form css per declaration, actions, other-host
// URLs and inline SVG. Also lists the actions, templates and placeholders of items about to be saved. Nothing runs.

type Raw = Record<string, unknown>;
const DROP = Symbol('drop');
const MAX_DEPTH = 60;
const ACTION_KEYS: ReadonlySet<string> = new Set(['tap_action', 'hold_action', 'double_tap_action']);
/** Fields declared plain text: shown as written, never read as a style or an address. `content` has its own picture check. */
const PLAIN_KEYS: ReadonlySet<string> = new Set(['text', 'label', 'prefix', 'suffix', 'name', 'secondary_info', 'options', 'editor_name', 'date_format', 'card_config_yaml', 'title', 'description']);
const FETCH_FN_RE = /(?:^|[^a-z0-9_-])(?:-webkit-)?(?:image-set|image|cross-fade|src|element|paint)\s*\(/i;
const HTML_MEDIA_RE = /<\s*(?:img|picture|source|video|audio|object|embed|iframe|link|style|image|use|input|meta|base)\b[^>]*>?/gi;
const MD_DEFINITION_RE = /^[ ]{0,3}\[[^\]]+\]:[ \t]*<?([^\s>]+)>?.*$/gm;
const MD_IMAGE_RE = /!\[[^\]]*\](?:\(\s*<?([^)\s>]*)>?[^)]*\)|\[[^\]]*\])?/g;
const DESIGN_KEYS: ReadonlySet<string> = new Set(['design', 'hover', 'custom_animations', 'custom_shapes']);
const TEMPLATE_RE = /\{\{|\{%|\{#/;
const TEMPLATE_SPAN_RE = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g;
/** The only exact form of picture a shared text may hold: a local or raster data: source and an optional plain alt. */
const IMG_RE = /^<img src="([^"&<>]*)"(?: alt="[\w .,'-]*")?\s?\/?>$/i;
/** Keys read as a template whose result is shown as text or picked as an icon or entity, never put into a style. */
const TEMPLATE_KEYS: ReadonlySet<string> = new Set(['entity', 'icon', 'value', 'template']);
const ENTITY_COLOUR_RE = /^entity(?: \d{1,3}%)?$/;
const FUNCTION_RE = /([a-z][a-z0-9-]*)\s*\(/gi;
const PLACEHOLDER_SCAN_RE = /(?<![a-z0-9_])[a-z][a-z0-9_]*\.mc_placeholder_[1-9][0-9]*(?![a-z0-9_])/g;
/** Functions a free-form css value may use besides the colour and calc() forms of the strict types. */
const CSS_FUNCTIONS: ReadonlySet<string> = new Set(
  'translate translatex translatey translatez translate3d rotate rotatex rotatey rotatez rotate3d scale scalex scaley scalez scale3d skew skewx skewy matrix matrix3d perspective blur brightness contrast grayscale hue-rotate invert opacity saturate sepia drop-shadow repeat minmax fit-content cubic-bezier steps var calc min max clamp rgb rgba hsl hsla hwb lab lch oklab oklch color color-mix light-dark linear-gradient radial-gradient conic-gradient repeating-linear-gradient repeating-radial-gradient repeating-conic-gradient'.split(' '),
);

const hasOwn = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const rawAt = (path: string, key: string | number): string => (typeof key === 'number' ? `${path}[${key}]` : `${path}.${key}`);
/** True when `s` holds a control character; tab, line feed and carriage return are allowed when `layout` is set. */
const hasControl = (s: string, layout: boolean): boolean => [...s].some((ch) => (ch < ' ' && !(layout && '\t\n\r'.includes(ch))) || ch === '\u007f');
const nameOf = (path: string): string => path.slice(path.lastIndexOf('.') + 1);

/** Hosts a value names: the part after `://` or a leading `//`, lower-case, each once. */
function hostsIn(s: string): string[] {
  return [...new Set([...s.matchAll(/(?:\b(?:https?|wss?|ftp):(?!\/)|\/\/)(?:[^\s/@)"'\\]*@)?(\[[0-9a-f:]+\]|[^\s/:?#)"'\\,;]+)/gi)].map((m) => m[1].toLowerCase()))];
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
  if (!/^[\w\s(),.%#+*/-]+$/.test(s) || s.length > 512 || s.includes('/*') || s.includes('*/')) return false;
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')' && --depth < 0) return false;
  }
  const names = [...s.matchAll(FUNCTION_RE)].map((m) => m[1].toLowerCase());
  return depth === 0 && names.length === (s.match(/\(/g)?.length ?? 0) && names.every((n) => CSS_FUNCTIONS.has(n));
}

/** Every function of `s` is on the allow-list of colour, gradient, transform and filter functions and none holds a quote. */
function functionsOk(s: string): boolean {
  const names = [...s.matchAll(FUNCTION_RE)].map((m) => m[1].toLowerCase());
  const open = s.match(/\(/g)?.length ?? 0;
  return names.length === open && names.every((n) => CSS_FUNCTIONS.has(n)) && (open === 0 || !/["'`]/.test(s));
}

/** `content` without its pictures: an image whose address is not on this origin or a raster data: image is removed. */
function stripPictures(v: string): { text: string; gone: string[] } {
  const gone: string[] = [];
  const safe: string[] = [];
  const keep = (m: string): string => `\uE000${safe.push(m) - 1}\uE001`;
  let text = v.replace(/[\uE000\uE001]/g, '');
  for (let pass = 0; pass < 4; pass++) {
    const before = text;
    text = text
      .replace(MD_IMAGE_RE, (m, dest: string | undefined) => (dest !== undefined && !TEMPLATE_RE.test(dest) && !dest.includes('&') && urlAllowed(dest) ? keep(m) : (gone.push(m), '')))
      .replace(MD_DEFINITION_RE, (m, dest: string) => (!dest.includes('&') && urlAllowed(dest) ? m : (gone.push(m), '')))
      .replace(HTML_MEDIA_RE, (m) => {
        const src = IMG_RE.exec(m)?.[1];
        return src !== undefined && (PAINT_LOCAL_PATH_RE.test(src) || PAINT_DATA_URL_RE.test(src)) ? keep(m) : (gone.push(m), '');
      })
      .replace(/url\s*\(\s*(?:"[^"]*"|'[^']*'|[^"'()\s]*)\s*\)/gi, (m) => (urlsOk(m) ? keep(m) : (gone.push(m), '')));
    if (text === before) break;
  }
  text = text.replace(/!\[/g, '[').replace(/\uE000(\d+)\uE001/g, (_, i: string) => safe[+i]);
  return { text, gone };
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
    if (/^card-mod-/i.test(name)) {
      notes.push(dropped(item, `${path}.${name}`, 'strict.card-mod', t('share-kit.card.path-is-a-card-mod-style-so-it-was-left-out', { path: `${path}.${name}`, rule: 'strict.card-mod' })));
      return;
    }
    if (!CSS_PROPERTY_RE.test(name)) {
      notes.push(dropped(item, `${path}[${i}]`, 'strict.css', t('share-kit.card.a-style-line-in-path-was-left-out-because-its-name', { path: `${path}[${i}]`, rule: 'strict.css' })));
      return;
    }
    const rule = THEME_KEY_TYPES.find((r) => r.match.test(name));
    const paint = CSS_PAINT_PROPERTIES.includes(name);
    const types: StrictType[] = [...(rule?.types ?? STRICT_ANY_TYPES).filter((ty) => ty !== 'paint-image'), 'keyword', ...(paint ? (['paint-image'] as const) : [])];
    const v = value && !rule && !/url\s*\(/i.test(value) && functional(value) ? { verdict: 'kept' as const } : strictValue(value, types);
    if (v.verdict === 'kept') kept.push(decl);
    else {
      const hosts = hostsIn(value);
      const rule = hosts.length ? 'strict.host' : 'strict.css';
      notes.push(dropped(item, `${path}.${name}`, rule, hosts.length ? t('share-kit.card.path-points-to-another-website-so-it-was-left-out', { path: `${path}.${name}`, rule }) : t('share-kit.card.path-was-left-out-because-its-value-is-not-allowed', { path: `${path}.${name}`, rule }), hosts));
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
  /** Above 0 inside an action, whose strings are service data and links the action check already judged. */
  loose: number;
}

const refuse = (c: Ctx, path: string): typeof DROP => {
  c.refusal ??= { item: c.item, path, rule: 'strict.marker' };
  return DROP;
};

const drop = (c: Ctx, path: string, rule: StrictRuleId, hosts?: string[]): typeof DROP => {
  c.notes.push(dropped(c.item, path, rule, rule === 'strict.host' ? t('share-kit.card.path-points-to-another-website-so-it-was-left-out', { path, rule }) : t('share-kit.card.path-was-left-out-because-its-value-is-not-allowed', { path, rule }), hosts));
  return DROP;
};

/** Own entry of a lookup table; a key such as `toString` or `__proto__` of a file finds nothing. */
const typesOf = (c: Ctx, key: string): readonly StrictType[] | undefined => (hasOwn(c.lists.designTypes, key) ? c.lists.designTypes[key] : undefined);

/** An action: kept as written unless its link or path is not a web link or a path on this dashboard. */
function readAction(a: Raw, path: string, c: Ctx, depth: number): unknown {
  const nav = a.navigation_path;
  const bad = (a.action === 'url' && !linkOk(a.url_path)) || (nav !== undefined && (!linkOk(nav) || /^\s*\/\//.test(String(nav))));
  if (bad) {
    c.notes.push(dropped(c.item, path, 'strict.action-url', t('share-kit.card.the-action-in-path-was-left-out-because-its-web-address', { path, rule: 'strict.action-url' })));
    return DROP;
  }
  c.loose++;
  try {
    return walkObject(a, path, c, false, depth);
  } finally {
    c.loose--;
  }
}

/** A module: its type must be known and only its own keys and the common module keys are kept. */
function readModule(m: unknown, path: string, c: Ctx, depth: number): unknown {
  const type = isObj(m) ? m.type : undefined;
  const own = typeof type === 'string' && hasOwn(c.lists.moduleKeys, type) ? c.lists.moduleKeys[type] : undefined;
  if (!isObj(m) || !own) {
    c.notes.push(c.helpers.note('dropped_key', c.item, path, t('share-kit.card.path-is-a-module-of-an-unknown-type-so-it-was', { path, rule: 'strict.module' })));
    return DROP;
  }
  const allowed = new Set([...own, ...c.lists.commonModuleKeys]);
  const out: Raw = {};
  for (const [k, v] of Object.entries(m)) {
    const at = rawAt(path, k);
    if (!allowed.has(k)) {
      c.notes.push(c.helpers.note('dropped_key', c.item, at, t('share-kit.card.path-is-not-a-card-setting-so-it-was-left-out', { path: at, rule: 'strict.key' })));
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
    if (/^card-mod-/i.test(k)) {
      c.notes.push(dropped(c.item, rawAt(path, k), 'strict.card-mod', t('share-kit.card.path-is-a-card-mod-style-so-it-was-left-out', { path: rawAt(path, k), rule: 'strict.card-mod' })));
      continue;
    }
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
    const types = typesOf(c, key);
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
  const base = key.endsWith('[]') ? key.slice(0, -2) : key;
  if (base === 'content') return readContent(v, path, c);
  const types = typesOf(c, key);
  if (types) {
    if (types.includes('colour') && ENTITY_COLOUR_RE.test(v.trim())) return v;
    if (types.includes('paint-image') && urlLike(v)) return urlAllowed(v) ? kept(v, path, c) : drop(c, path, 'strict.host', hostsIn(v));
    const r = strictValue(v, types);
    if (r.verdict === 'refused') return refuse(c, path);
    if (r.verdict === 'dropped') return drop(c, path, r.rule, hostsIn(v));
    return kept(v, path, c);
  }
  if (PLAIN_KEYS.has(base) || c.loose > 0) return v;
  if (urlLike(v)) return urlAllowed(v) ? kept(v, path, c) : drop(c, path, 'strict.host', hostsIn(v));
  const d = decodeCssEscapes(v);
  if ((design || !(TEMPLATE_KEYS.has(base) && TEMPLATE_RE.test(v))) && markerIn(d)) return refuse(c, path);
  if (FETCH_FN_RE.test(d) || !urlsOk(d) || hostsIn(d).length) return drop(c, path, 'strict.host', hostsIn(d));
  if (design && !functionsOk(v)) return drop(c, path, 'strict.any');
  return kept(v, path, c);
}

/** A kept value; a /local/ file in it is listed because it may not exist on the importer's system. */
function kept(v: string, path: string, c: Ctx): string {
  if (/(?:^\s*|url\(\s*["']?)\/local\//i.test(v)) c.notes.push(c.helpers.note('local_path', c.item, path, t('share-kit.card.name-uses-a-file-on-the-sharer-s-home-assistant', { name: nameOf(path) })));
  return v;
}

/** Markdown or HTML `content`: pictures that load from another website, or that cannot be told apart from one, are removed and listed. */
function readContent(v: string, path: string, c: Ctx): string {
  let plain = v;
  const cut = (m: string): string => (c.notes.push(dropped(c.item, path, 'strict.any', t('share-kit.card.a-template-in-path-was-left-out-because-shared-text', { path, rule: 'strict.any', text: m.slice(0, 80) }))), '');
  while (TEMPLATE_RE.test(plain)) plain = plain.replace(TEMPLATE_SPAN_RE, cut).replace(/\{[{%#][\s\S]*/, cut);
  const r = stripPictures(plain);
  if (r.gone.length) c.notes.push(dropped(c.item, path, 'strict.host', t('share-kit.card.a-picture-in-path-was-left-out-because-it-may', { path, rule: 'strict.host' }), [...new Set(r.gone.flatMap(hostsIn))]));
  return r.text;
}

/** One card item: type, keys, design values, css, actions, URL hosts and inline SVG. */
export function readCardWith(helpers: ShareKitHelpers): (item: number, data: unknown, lists: CardKeyLists) => CardReadResult {
  return (item, data, lists) => {
    if (!isObj(data) || data.type !== SHARED_CARD_TYPE) return { ok: false, notes: [helpers.note('invalid_item', item, 'data', t('share-kit.card.this-is-not-a-magic-card-card'))] };
    const c: Ctx = { item, lists, helpers, notes: [], loose: 0 };
    try {
      const out: Raw = {};
      const keys = new Set(lists.cardKeys);
      for (const [k, v] of Object.entries(data)) {
        if (!keys.has(k)) {
          c.notes.push(helpers.note('dropped_key', item, `data.${k}`, t('share-kit.card.path-is-not-a-card-setting-so-it-was-left-out', { path: `data.${k}`, rule: 'strict.key' })));
          continue;
        }
        const r = walk(v, k, `data.${k}`, c, false, 0);
        if (c.refusal) return { ok: false, notes: c.notes, refusal: c.refusal };
        if (r !== DROP) out[k] = r;
      }
      return { ok: true, data: out as unknown as SharedCardConfig, notes: c.notes };
    } catch {
      return { ok: false, notes: c.notes, refusal: { item, path: 'data', rule: 'strict.any' } };
    }
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
      out.actions.push({ item, path, action: v.action, ...(typeof (v.perform_action ?? v.service) === 'string' ? { service: (v.perform_action ?? v.service) as string } : {}), targets: [...new Set(targets)], ...(host ? { host } : {}) });
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
