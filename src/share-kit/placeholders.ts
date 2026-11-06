// Entity placeholders for every export: entity ids in fields, templates and free text become
// `<domain>.mc_placeholder_<n>`, numbered in first-occurrence order, so a shared file names none of the sender's entities.

import { ENTITY_DOMAINS, ENTITY_ID_RE, NOT_ENTITY_OBJECT_IDS, PLACEHOLDER_PREFIX } from '../contracts/share-kit';
import type { EntityPlaceholder, PlaceholderExport } from '../contracts/share-kit';
import type { TransferItem, TransferKind } from '../contracts/preset-transfer';

const MAX_DEPTH = 100;
const KNOWN_DOMAINS: ReadonlySet<string> = new Set(ENTITY_DOMAINS);
const SKIPPED_OBJECT_IDS: ReadonlySet<string> = new Set(NOT_ENTITY_OBJECT_IDS);
/** Keys whose string values (or strings inside their arrays) are entity ids. */
const ENTITY_KEYS: ReadonlySet<string> = new Set(['entity', 'entity_id', 'entities']);
/** Domains that are also ordinary words; in free text they count only when seen in an entity field or shaped like an id. */
const WORD_DOMAINS: ReadonlySet<string> = new Set(['text', 'time', 'number', 'date', 'datetime', 'event', 'image', 'update', 'select', 'button', 'group', 'zone', 'remote', 'scene', 'schedule', 'calendar']);
/** Keys that hold a service name (`light.turn_on`), which has the shape of an entity id but names no entity. */
const SERVICE_KEYS: ReadonlySet<string> = new Set(['perform_action', 'service']);
const TOKEN_RE = /(?<![a-z0-9_])([a-z][a-z0-9_]*)\.([a-z0-9_]+)/g;
const ID_SHAPE_RE = /[_0-9]/;
/** Query parameters that carry a secret; the value is dropped. */
const SECRET_PARAM_RE = /([?&](?:token|access_token|signature|authSig|api_key)=)[^&#\s"'<>)]*/gi;
/** A camera proxy path: the camera becomes a placeholder entity. */
const CAMERA_PROXY_RE = /(\/api\/camera_proxy(?:_stream)?\/)([a-z][a-z0-9_]*\.[a-z0-9_]+)/g;
/** An absolute web address up to its path: scheme, credentials, host and port. */
const ORIGIN_RE = /\bhttps?:\/\/([^\s"'<>)/?#]*)/gi;
const ORIGIN_PLACEHOLDER = 'https://example.invalid';
/** Namespace addresses inline SVG needs; they name no host of the sender's. */
const NAMESPACE_HOSTS: ReadonlySet<string> = new Set(['www.w3.org']);

interface Pass {
  seen: Set<string>;
  byId: Map<string, string>;
  list: EntityPlaceholder[];
  hosts: Set<string>;
}

/** What the pass took out besides entity ids; the host list is for the export notice. */
export type PlaceholderResult<K extends TransferKind> = PlaceholderExport<K> & { removedHosts: string[] };

/** Collects the domain of every id written in an entity field, so those domains are scanned for in free text. */
function seeDomains(v: unknown, inEntityKey: boolean, depth: number, seen: Set<string>): void {
  if (depth > MAX_DEPTH) throw new Error('share-kit: item is nested too deeply to share');
  if (typeof v === 'string') {
    if (inEntityKey && ENTITY_ID_RE.test(v)) seen.add(v.slice(0, v.indexOf('.')));
  } else if (Array.isArray(v)) {
    for (const e of v) seeDomains(e, inEntityKey, depth + 1, seen);
  } else if (v && typeof v === 'object') {
    for (const [k, e] of Object.entries(v)) seeDomains(e, ENTITY_KEYS.has(k), depth + 1, seen);
  }
}

/** The placeholder for `id`, created on first use. */
function place(id: string, pass: Pass): string {
  let p = pass.byId.get(id);
  if (!p) {
    const domain = id.slice(0, id.indexOf('.'));
    p = `${domain}.${PLACEHOLDER_PREFIX}${pass.list.length + 1}`;
    pass.byId.set(id, p);
    pass.list.push({ id: p, domain });
  }
  return p;
}

/** [start, end) of every `url(` up to its closing bracket; ids inside are links, not entities. */
function urlRanges(s: string): [number, number][] {
  const low = s.toLowerCase();
  const out: [number, number][] = [];
  for (let at = low.indexOf('url('); at >= 0; ) {
    const close = low.indexOf(')', at);
    const end = close < 0 ? s.length : close;
    out.push([at, end]);
    at = close < 0 ? -1 : low.indexOf('url(', end);
  }
  return out;
}

/** True when the token at [start, end) counts as an entity id in free text. */
function isEntity(s: string, start: number, end: number, domain: string, object: string, pass: Pass): boolean {
  if (/[a-z0-9_/-]/.test(s[start - 1] ?? '') || s[end] === '/') return false;
  if (SKIPPED_OBJECT_IDS.has(object) || object.startsWith(PLACEHOLDER_PREFIX)) return false;
  if (!KNOWN_DOMAINS.has(domain) && !pass.seen.has(domain)) return false;
  if (!WORD_DOMAINS.has(domain) || pass.seen.has(domain) || ID_SHAPE_RE.test(object)) return true;
  const q = s[start - 1];
  return (q === "'" || q === '"') && s[end] === q;
}

/** `s` without secret query values, camera proxy cameras, or the origin of an absolute web address. */
function scrubUrls(s: string, pass: Pass): string {
  if (!s.includes('=') && !s.includes('://') && !s.includes('camera_proxy')) return s;
  return s
    .replace(SECRET_PARAM_RE, '$1')
    .replace(CAMERA_PROXY_RE, (_m, head: string, id: string) => head + place(id, pass))
    .replace(ORIGIN_RE, (m, authority: string) => {
      const host = authority.slice(authority.lastIndexOf('@') + 1);
      if (NAMESPACE_HOSTS.has(host.toLowerCase())) return m;
      if (host) pass.hosts.add(host);
      return ORIGIN_PLACEHOLDER;
    });
}

/** `s` with every whole entity id replaced; the object id is read to its end, so light.kitchen_2 never splits. */
function scan(input: string, pass: Pass): string {
  const s = scrubUrls(input, pass);
  if (!s.includes('.')) return s;
  const urls = urlRanges(s);
  let out = '';
  let from = 0;
  let u = 0;
  TOKEN_RE.lastIndex = 0;
  for (let m = TOKEN_RE.exec(s); m; m = TOKEN_RE.exec(s)) {
    const [token, domain, object] = m;
    const end = m.index + token.length;
    while (u < urls.length && urls[u][1] <= m.index) u++;
    const inUrl = u < urls.length && urls[u][0] <= m.index;
    if (!inUrl && isEntity(s, m.index, end, domain, object, pass)) {
      out += s.slice(from, m.index) + place(token, pass);
      from = end;
    } else {
      // an id may follow a dotted prefix (states.light.kitchen), so look again from the object part
      TOKEN_RE.lastIndex = m.index + domain.length + 1;
    }
  }
  return out + s.slice(from);
}

/** A fresh copy of `v` with entity ids replaced; ids in an entity field are replaced whole, other strings are scanned. */
function copy(v: unknown, inEntityKey: boolean, depth: number, pass: Pass, key = ''): unknown {
  if (depth > MAX_DEPTH) throw new Error('share-kit: item is nested too deeply to share');
  if (typeof v === 'string') {
    if (SERVICE_KEYS.has(key)) return v;
    if (inEntityKey && ENTITY_ID_RE.test(v) && !v.slice(v.indexOf('.') + 1).startsWith(PLACEHOLDER_PREFIX)) return place(v, pass);
    return scan(v, pass);
  }
  if (Array.isArray(v)) return v.map((e) => copy(e, inEntityKey, depth + 1, pass));
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, e] of Object.entries(v)) {
      const base = scan(k, pass);
      let name = base;
      for (let n = 2; Object.prototype.hasOwnProperty.call(out, name); n++) name = `${base}_${n}`;
      Object.defineProperty(out, name, { value: copy(e, ENTITY_KEYS.has(k), depth + 1, pass, k), enumerable: true, writable: true, configurable: true });
    }
    return out;
  }
  return v;
}

/** Items with their entity ids replaced, the header list, and the map back (placeholder to id) that is never written. */
export function toPlaceholders<K extends TransferKind>(_kind: K, items: readonly TransferItem<K>[]): PlaceholderResult<K> {
  const pass: Pass = { seen: new Set(), byId: new Map(), list: [], hosts: new Set() };
  for (const it of items) seeDomains(it, false, 0, pass.seen);
  const out = items.map((it) => copy(it, false, 0, pass) as TransferItem<K>);
  return { items: out, placeholders: pass.list, originals: Object.fromEntries([...pass.byId].map(([id, p]) => [p, id])), removedHosts: [...pass.hosts] };
}
