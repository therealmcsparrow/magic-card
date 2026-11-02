// Remote assets for the forum shot: finds addresses outside the Home Assistant origin in a card config, hass data and theme values, and removes them before anything mounts.
import { configGoogleFonts } from '../utils/google-fonts';

/** Config keys whose string value names font families. */
export const FONT_KEYS: ReadonlySet<string> = new Set(['font_family', 'tab_font_family', 'label_font_family']);
export const MAX_NODES = 50_000;
export const MAX_DEPTH = 24;
export const MAX_STRING = 1_000_000;
/** Reported in place of a host when a limit was hit: the value could not be judged, so it counts as remote. */
export const LIMIT = 'limit';
/** Reported for a card with a `custom-card` module at any depth: a third-party card makes requests nothing here can scrub. Holds a space, so it is never a host. */
export const CUSTOM_CARD = 'custom-card module';

/** Schemes a browser fetches from a network host. Others (mailto:, data:, blob:) never reach another server from a picture. */
const FETCH_SCHEMES = new Set(['http', 'https', 'ws', 'wss', 'ftp']);
// XML namespace names inside inline SVG (the card's icon documents carry them); they name a vocabulary and are never fetched.
const XML_NAMESPACE = /^http:\/\/www\.w3\.org\/(?:2000\/svg|1999\/xlink|1999\/xhtml)$/;
// Only a string holding one of these can form an address (`&` for character references, `\` for CSS escapes and backslash slashes).
const MAY_HOLD_ADDRESS = /[:/\\&]/;
// Where one address ends inside a decoded text.
const SUB_TOKEN = /[\s"'`()<>[\]{}=,;|^*]+/;
// Where one address ends inside the raw text (`;` stays: it ends character references).
const RAW_TOKEN = /([ "'`()<>=,]+)/;

const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  colon: ':',
  sol: '/',
  bsol: '\\',
  period: '.',
  Tab: '\t',
  NewLine: '\n',
  lpar: '(',
  rpar: ')',
  comma: ',',
  semi: ';',
  num: '#',
  percnt: '%',
  equals: '=',
  quest: '?',
  excl: '!',
  commat: '@',
  lowbar: '_',
};

const codePoint = (n: number): string => (n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : '�');

/** HTML character references the way a browser reads them (a missing semicolon allowed); repeated so `&amp;#104;` is seen too. */
export function decodeEntities(text: string): string {
  let cur = text;
  for (let i = 0; i < 3 && cur.includes('&'); i++) {
    const next = cur.replace(/&(?:#(\d{1,8})|#[xX]([0-9a-fA-F]{1,6})|([A-Za-z][A-Za-z0-9]*));?/g, (m, dec?: string, hex?: string, name?: string) => {
      if (dec) return codePoint(parseInt(dec, 10));
      if (hex) return codePoint(parseInt(hex, 16));
      return name && name in NAMED ? NAMED[name] : m;
    });
    if (next === cur) break;
    cur = next;
  }
  return cur;
}

/** CSS escapes (`\68`, `\68 `, `\/`) resolved. */
function cssUnescape(text: string): string {
  return text.replace(/\\(?:([0-9a-fA-F]{1,6})[ \t\n\r\f]?|([^\n\r\f0-9a-fA-F]))/g, (_m, hex?: string, ch?: string) => (hex ? codePoint(parseInt(hex, 16)) : (ch ?? '')));
}

/** The readings of one text a consumer may take: references decoded, CSS escapes resolved, tabs and line breaks dropped or read as spaces. */
function readings(text: string): Set<string> {
  const decoded = decodeEntities(text);
  const out = new Set<string>();
  const add = (s: string) => {
    out.add(s.replace(/[\t\n\r]/g, ''));
    out.add(s.replace(/[\t\n\r]/g, ' '));
  };
  add(decoded);
  if (decoded.includes('\\')) add(cssUnescape(decoded));
  return out;
}

const other = (origin: string) => (origin.startsWith('https:') ? 'http://mc-other.invalid' : 'https://mc-other.invalid');

/** `s` without the control characters and spaces the URL parser strips from both ends. */
function trimControl(s: string): string {
  let a = 0;
  let b = s.length;
  while (a < b && s.charCodeAt(a) <= 0x20) a++;
  while (b > a && s.charCodeAt(b - 1) <= 0x20) b--;
  return s.slice(a, b);
}

/** The host of the address that leaves the origin, or `undefined` when the token stays on it. An unparsable address counts as remote. */
function remoteHost(token: string, origin: string): string | undefined {
  const t = trimControl(token.replace(/\\/g, '/'));
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(t);
  if (scheme) {
    if (!FETCH_SCHEMES.has(scheme[1].toLowerCase()) || XML_NAMESPACE.test(t)) return undefined;
  } else if (!/^\/{2,}[^/]/.test(t)) {
    return undefined;
  }
  try {
    const here = new URL(t, origin);
    if (here.origin !== origin) return here.host;
    // A form that reads differently under another base (`https:host`) is judged under it as well.
    const alt = other(origin);
    const there = new URL(t, alt);
    if (there.origin !== new URL(alt).origin && there.origin !== origin) return there.host;
    return undefined;
  } catch {
    return 'unknown';
  }
}

/** Hosts of every address in `text` that is not on `origin`; stops at the first when `all` is false. */
function remoteHosts(text: string, origin: string, all: boolean): string[] {
  if (text.length > MAX_STRING) return [LIMIT];
  if (!MAY_HOLD_ADDRESS.test(text)) return [];
  const found: string[] = [];
  for (const reading of readings(text)) {
    for (const token of reading.split(SUB_TOKEN)) {
      if (!token) continue;
      const host = remoteHost(token, origin);
      if (host === undefined) continue;
      found.push(host);
      if (!all) return found;
    }
  }
  return found;
}

/**
 * True when any address in `text` (read the way the browser's URL parser reads it, after character references and CSS escapes
 * are resolved, with `\` as `/`) leaves `origin`, cannot be parsed, or the text is over the size limit.
 */
export function hasRemote(text: string, origin: string): boolean {
  return remoteHosts(text, origin, false).length > 0;
}

/**
 * The cross-origin hosts every string of the config names (nested modules included), then each Google font family the
 * config uses. A string, depth or node limit adds `limit`; a number, boolean or null past the depth limit holds no address and adds nothing.
 * Empty when the card makes no outside request.
 */
export function findRemoteAssets(config: unknown, origin: string): string[] {
  const out: string[] = [];
  const add = (v: string) => out.includes(v) || out.push(v);
  let nodes = 0;
  const walk = (v: unknown, depth: number): void => {
    if (++nodes > MAX_NODES || (depth > MAX_DEPTH && (typeof v === 'string' || (v && typeof v === 'object')))) {
      add(LIMIT);
      return;
    }
    if (typeof v === 'string') {
      for (const host of remoteHosts(v, origin, true)) add(host);
    } else if (Array.isArray(v)) {
      for (const x of v) walk(x, depth + 1);
    } else if (v && typeof v === 'object') {
      if ((v as { type?: unknown }).type === 'custom-card') add(CUSTOM_CARD);
      for (const x of Object.values(v)) walk(x, depth + 1);
    }
  };
  walk(config, 0);
  if (config && typeof config === 'object') for (const f of configGoogleFonts(config)) add(f);
  return out;
}

// A string the card may read: no markup, no escapes, no `//`, no `url(`, no `scheme:`.
const flatten = (text: string): string => text.replace(/[\t\n\r]/g, '');
const MARKUP_OR_ADDRESS = /[<&\\]|\/\/|url\(/i;
// A letter-run before `:` is a scheme when it can fetch, or when the `:` is not followed by a space (`Status: ok` stays).
const SCHEME_FORM = /(?<![A-Za-z0-9+.-])([A-Za-z][A-Za-z0-9+.-]*):/g;
const FETCHING = new Set(['http', 'https', 'ftp', 'ws', 'wss', 'blob', 'data', 'filesystem', 'javascript']);

function hasSchemeForm(text: string): boolean {
  const flat = flatten(text);
  for (const m of flat.matchAll(SCHEME_FORM)) {
    const end = (m.index ?? 0) + m[0].length;
    if (FETCHING.has(m[1].toLowerCase())) return true;
    if (end < flat.length && !/\s/.test(flat[end])) return true;
  }
  return false;
}

/** True for a text that holds an address, a scheme or an escape for one; markup alone and size limits are not. */
function addressLike(text: string): boolean {
  return /[\\&]|\/\/|url\(/i.test(flatten(text)) || hasSchemeForm(text);
}
// One plain path on the page's own origin, or one raster picture inline; nothing else may carry an address.
const PLAIN_PATH = /^\/(?!\/)(?!.*\/\/)[A-Za-z0-9_\-.~%+,=@/?#]*$/;
const RASTER_DATA = /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp);base64,[A-Za-z0-9+/]*={0,2}$/i;
// Icon names (`mdi:lightbulb`) read like a scheme but name no address.
const ICON_NAME = /^(?:mdi|hass|phu|fas|far|fab):[a-z0-9_-]+$/i;

/** True when `text` may reach the card: it holds no markup and no address, or it is wholly one plain same-origin path or raster data image. */
export function keepsText(text: string): boolean {
  if (text.length > MAX_STRING) return false;
  if (PLAIN_PATH.test(text) || RASTER_DATA.test(text) || ICON_NAME.test(text)) return true;
  if (MARKUP_OR_ADDRESS.test(flatten(text))) return false;
  return !hasSchemeForm(text);
}

/** True when `text` fails the allow-list and looks like an address, so the picture swapped something from another server. */
export function blankedAddress(text: string): boolean {
  return !keepsText(text) && addressLike(text);
}

/** `text` when it passes the allow-list, else ''; `onRemove` is told when it was blanked. `origin` is the page's own. */
export function scrubText(text: string, _origin: string, onRemove?: () => void): string {
  if (keepsText(text)) return text;
  if (blankedAddress(text)) onRemove?.();
  return '';
}

/** `text` without the addresses that leave `origin`, part by part; for the safety net, which works on markup. */
function stripRemote(text: string, origin: string): string {
  if (text.length > MAX_STRING) return '';
  if (!hasRemote(text, origin)) return text;
  const parts = text.split(RAW_TOKEN);
  const cleaned = parts.map((p, i) => (i % 2 === 0 && hasRemote(p, origin) ? '' : p)).join('');
  return hasRemote(cleaned, origin) ? '' : cleaned;
}

interface Budget {
  nodes: number;
}

const isPlain = (v: object): boolean => {
  const proto = Object.getPrototypeOf(v) as unknown;
  return proto === Object.prototype || proto === null;
};

function scrubWalk<T>(value: T, origin: string, onRemove: (() => void) | undefined, depth: number, budget: Budget): T {
  if (++budget.nodes > MAX_NODES || depth > MAX_DEPTH) {
    if (value === undefined || value === null || typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value !== 'string' || addressLike(value)) onRemove?.();
    return '' as T;
  }
  if (typeof value === 'string') return scrubText(value, origin, onRemove) as T;
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((x) => {
      const y = scrubWalk(x, origin, onRemove, depth + 1, budget);
      if (y !== x) changed = true;
      return y;
    });
    return (changed ? next : value) as T;
  }
  if (value && typeof value === 'object' && isPlain(value)) {
    const src = value as Record<string, unknown>;
    let next: Record<string, unknown> | undefined;
    for (const k of Object.keys(src)) {
      const y = scrubWalk(src[k], origin, onRemove, depth + 1, budget);
      if (y !== src[k]) (next ??= { ...src })[k] = y;
    }
    return (next ?? value) as T;
  }
  return value;
}

/**
 * A copy of `value` whose strings (arrays and plain objects walked) have lost their off-origin addresses; unchanged parts are shared.
 * What lies past the depth or node limit is replaced by '' and reported, never passed on.
 */
export function scrubValue<T>(value: T, origin: string, onRemove?: () => void): T {
  return scrubWalk(value, origin, onRemove, 0, { nodes: 0 });
}

type Fn = (...args: unknown[]) => unknown;
interface ConnectionLike {
  subscribeMessage?: (cb: (m: unknown) => void, msg: Record<string, unknown>, ...rest: unknown[]) => unknown;
  sendMessagePromise?: Fn;
}
type HassLike = Record<string, unknown> & { states?: Record<string, { state?: unknown; attributes?: Record<string, unknown> }>; connection?: ConnectionLike };

// Static tables the card does not display and that hold thousands of strings.
const UNSCRUBBED = new Set(['auth', 'connection', 'states', 'resources', 'translationMetadata', 'services', 'panels', 'localize']);
// hass methods whose results reach the card.
const WRAPPED_CALLS = ['callWS', 'callApi', 'callService'];

const mapResult = (result: unknown, fn: (v: unknown) => unknown): unknown => (result && typeof (result as Promise<unknown>).then === 'function' ? (result as Promise<unknown>).then(fn) : fn(result));

/**
 * The hass copy the forum shot hands its card: state attributes, themes, config, every call result and every subscription result lose
 * their off-origin addresses before the card sees them, so the browser never requests them. `auth` is not copied.
 * `removed()` says whether anything was dropped. `renameText`, when given, rewrites every string in a call or subscription result (a template family),
 * and `renameFont` the value of each font key in it.
 */
export function scrubHass<H extends object>(
  hass: H,
  origin: string,
  renameText?: (text: string) => string,
  renameFont?: (value: string) => string,
): { hass: H; removed: () => boolean } {
  let removed = false;
  const mark = () => {
    removed = true;
  };
  const clean = <V>(v: V): V => scrubValue(v, origin, mark);
  const renamed = (v: unknown, depth = 0): unknown => {
    if (typeof v === 'string') return renameText ? renameText(v) : v;
    if ((!renameText && !renameFont) || !v || typeof v !== 'object' || depth > MAX_DEPTH) return v;
    if (Array.isArray(v)) return v.map((x) => renamed(x, depth + 1));
    if (!isPlain(v)) return v;
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, renameFont && typeof x === 'string' && FONT_KEYS.has(k) ? renameFont(renameText ? renameText(x) : x) : renamed(x, depth + 1)]),
    );
  };
  const result = (v: unknown): unknown => renamed(clean(v));
  const src = hass as HassLike;
  const copy: Record<string, unknown> = {};
  for (const k of Object.keys(src)) if (k !== 'auth') copy[k] = UNSCRUBBED.has(k) || typeof src[k] === 'function' ? src[k] : clean(src[k]);
  if (src.states) {
    const states: Record<string, unknown> = {};
    for (const id of Object.keys(src.states)) {
      const s = src.states[id];
      const attributes = s?.attributes ? clean(s.attributes) : s?.attributes;
      const state = typeof s?.state === 'string' ? clean(s.state) : s?.state;
      states[id] = attributes === s?.attributes && state === s?.state ? s : { ...s, state, attributes };
    }
    copy.states = states;
  }
  for (const name of WRAPPED_CALLS) {
    const fn = src[name];
    if (typeof fn === 'function') copy[name] = (...args: unknown[]) => mapResult((fn as Fn).apply(hass, args), result);
  }
  const conn = src.connection;
  if (conn && typeof conn === 'object') {
    copy.connection = new Proxy(conn, {
      get(target, prop) {
        const value = Reflect.get(target, prop, target) as unknown;
        if (typeof value !== 'function') return value;
        if (prop === 'subscribeMessage') {
          return (cb: (m: unknown) => void, msg: Record<string, unknown>, ...rest: unknown[]) =>
            (value as Fn).call(target, (m: unknown) => cb(result(m)), msg, ...rest);
        }
        if (prop === 'sendMessagePromise') return (...args: unknown[]) => mapResult((value as Fn).apply(target, args), result);
        return (value as Fn).bind(target);
      },
    });
  }
  return { hass: copy as H, removed: () => removed };
}

/** Every element under `root`, entering open shadow roots. */
export function deepElements(root: ParentNode, limit = MAX_NODES): Element[] {
  const out: Element[] = [];
  const visit = (node: ParentNode): void => {
    for (const el of Array.from(node.querySelectorAll('*'))) {
      if (out.length >= limit) return;
      out.push(el);
      if (el.shadowRoot) visit(el.shadowRoot);
    }
  };
  visit(root);
  return out;
}

const CSS_URL = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
const URL_ATTRS = ['src', 'srcset', 'imagesrcset', 'href', 'xlink:href', 'poster', 'data', 'action', 'formaction', 'background', 'ping', 'cite', 'longdesc'];

/** Safety net after rendering: strips addresses outside `origin` that still reached the DOM. Returns whether it removed any; it should never find one. */
export function sweepRemote(root: ParentNode, origin: string): boolean {
  let removed = false;
  const elements = deepElements(root);
  if (elements.length >= MAX_NODES) removed = true;
  for (const el of elements) {
    for (const attr of URL_ATTRS) {
      const v = el.getAttribute(attr);
      if (v && hasRemote(v, origin)) {
        el.removeAttribute(attr);
        removed = true;
      }
    }
    const style = el.getAttribute('style');
    if (style && hasRemote(style, origin)) {
      const next = stripRemote(style.replace(CSS_URL, (m, _q, u: string) => (hasRemote(u, origin) ? 'none' : m)), origin);
      el.setAttribute('style', next);
      removed = true;
    }
    if (el.localName === 'style' && el.textContent && hasRemote(el.textContent, origin)) {
      el.textContent = stripRemote(el.textContent, origin);
      removed = true;
    }
  }
  return removed;
}
