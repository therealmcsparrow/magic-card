// Remote assets for the forum shot: finds off-origin URLs and Google fonts in a card config and strips them from the hass copy.
import { configGoogleFonts } from '../utils/google-fonts';

const MAX_NODES = 50_000;
const MAX_DEPTH = 24;
const MAX_STRING = 1_000_000;
// Absolute (http, https) or protocol-relative URL with a dotted host; stops at quotes, brackets and spaces.
const URL_IN_TEXT = /https?:\/\/[^\s"'()<>\\]+|(?<![\w:./-])\/\/(?:[a-z0-9-]+\.)+[a-z0-9-]+[^\s"'()<>\\]*/gi;

/** True when `value` is an absolute or protocol-relative URL whose origin is not `origin`. */
export function isOffOrigin(value: string, origin: string): boolean {
  try {
    const u = new URL(value, origin);
    return (u.protocol === 'http:' || u.protocol === 'https:') && u.origin !== origin;
  } catch {
    return false;
  }
}

// XML namespace names inside inline SVG (the card's icon documents carry them); they name a vocabulary and are never fetched.
const XML_NAMESPACE = /^http:\/\/www\.w3\.org\/(?:2000\/svg|1999\/xlink|1999\/xhtml)$/;

/** Every off-origin URL inside one string. */
function urlsIn(text: string, origin: string): string[] {
  if (text.length > MAX_STRING) return [];
  return (text.match(URL_IN_TEXT) ?? []).filter((u) => !XML_NAMESPACE.test(u) && isOffOrigin(u, origin));
}

/**
 * The cross-origin hosts every string of the config names (nested modules included), then each Google font family the
 * config uses. Empty when the card makes no outside request.
 */
export function findRemoteAssets(config: unknown, origin: string): string[] {
  const out: string[] = [];
  const add = (v: string) => out.includes(v) || out.push(v);
  let nodes = 0;
  const walk = (v: unknown, depth: number): void => {
    if (++nodes > MAX_NODES || depth > MAX_DEPTH) return;
    if (typeof v === 'string') {
      for (const u of urlsIn(v, origin)) add(new URL(u, origin).host);
    } else if (Array.isArray(v)) {
      for (const x of v) walk(x, depth + 1);
    } else if (v && typeof v === 'object') {
      for (const x of Object.values(v)) walk(x, depth + 1);
    }
  };
  walk(config, 0);
  if (config && typeof config === 'object') for (const f of configGoogleFonts(config)) add(f);
  return out;
}

/** `text` with every off-origin URL removed; `onRemove` is told when one was. */
export function scrubText(text: string, origin: string, onRemove?: () => void): string {
  if (text.length > MAX_STRING || !text.includes('//')) return text;
  return text.replace(URL_IN_TEXT, (u) => {
    if (!isOffOrigin(u, origin)) return u;
    onRemove?.();
    return '';
  });
}

/** A copy of `value` whose strings (arrays and objects walked) have lost their off-origin URLs; unchanged parts are shared. */
export function scrubValue<T>(value: T, origin: string, onRemove?: () => void, depth = 0): T {
  if (depth > MAX_DEPTH) return value;
  if (typeof value === 'string') return scrubText(value, origin, onRemove) as T;
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((x) => {
      const y = scrubValue(x, origin, onRemove, depth + 1);
      if (y !== x) changed = true;
      return y;
    });
    return (changed ? next : value) as T;
  }
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>;
    let next: Record<string, unknown> | undefined;
    for (const k of Object.keys(src)) {
      const y = scrubValue(src[k], origin, onRemove, depth + 1);
      if (y !== src[k]) (next ??= { ...src })[k] = y;
    }
    return (next ?? value) as T;
  }
  return value;
}

interface ConnectionLike {
  subscribeMessage?: (cb: (m: unknown) => void, msg: Record<string, unknown>, ...rest: unknown[]) => unknown;
}
type HassLike = Record<string, unknown> & { states?: Record<string, { attributes?: Record<string, unknown> }>; connection?: ConnectionLike };

/**
 * The hass copy the forum shot hands its card: state attributes and every subscription result lose their off-origin URLs
 * before the card sees them, so the browser never requests them. `auth` is not copied. `removed()` says whether anything was dropped.
 */
export function scrubHass<H extends object>(hass: H, origin: string): { hass: H; removed: () => boolean } {
  let removed = false;
  const mark = () => {
    removed = true;
  };
  const src = hass as HassLike;
  const copy: Record<string, unknown> = {};
  for (const k of Object.keys(src)) if (k !== 'auth') copy[k] = src[k];
  if (src.states) {
    const states: Record<string, unknown> = {};
    for (const id of Object.keys(src.states)) {
      const s = src.states[id];
      const attributes = s?.attributes ? scrubValue(s.attributes, origin, mark) : s?.attributes;
      states[id] = attributes === s?.attributes ? s : { ...s, attributes };
    }
    copy.states = states;
  }
  const conn = src.connection;
  if (conn && typeof conn.subscribeMessage === 'function') {
    const wrapped = Object.create(conn) as ConnectionLike;
    wrapped.subscribeMessage = (cb, msg, ...rest) => conn.subscribeMessage!.call(conn, (m: unknown) => cb(scrubValue(m, origin, mark)), msg, ...rest);
    copy.connection = wrapped;
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

/** Second layer: strips off-origin pictures that reached the rendered DOM. Returns whether it removed any. */
export function sweepRemote(root: ParentNode, origin: string): boolean {
  let removed = false;
  for (const el of deepElements(root)) {
    for (const attr of ['src', 'srcset', 'href', 'xlink:href', 'poster']) {
      const v = el.getAttribute(attr);
      if (v && urlsIn(v, origin).length) {
        el.removeAttribute(attr);
        removed = true;
      }
    }
    const style = el.getAttribute('style');
    if (style && style.includes('url(')) {
      const next = style.replace(CSS_URL, (m, _q, u: string) => (isOffOrigin(u, origin) ? 'none' : m));
      if (next !== style) {
        el.setAttribute('style', next);
        removed = true;
      }
    }
  }
  return removed;
}
