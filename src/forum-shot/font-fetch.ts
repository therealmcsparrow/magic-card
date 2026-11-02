// The one place the forum shot asks an outside address for anything: card font stylesheets and font files.
import { FONT_HOST_PAIRS, isPublicHost } from './font-address';

export const STYLESHEET_BYTES = 1_000_000;
export const FONT_FILE_BYTES = 5_242_880;
export const RUN_BYTES = 25_165_824;
export const FETCH_MS = 8000;
export const MAX_REQUESTS = 128;
export const MAX_PARALLEL = 6;
const MAX_ADDRESS = 2048;
const MAX_FAMILY = 64;
const MAX_UNICODE_RANGE = 4096;

/** Options on every request: nothing the browser holds for the user goes along, and a redirect is a failure. */
export const REQUEST_OPTIONS = {
  credentials: 'omit',
  referrerPolicy: 'no-referrer',
  mode: 'cors',
  redirect: 'error',
  cache: 'no-store',
} as const;

/** The part of a Response this file reads. */
export interface FontResponse {
  status: number;
  type: string;
  redirected: boolean;
  headers: { get(name: string): string | null };
  body?: { getReader(): { read(): Promise<{ done: boolean; value?: Uint8Array }>; cancel(): Promise<void> | void } } | null;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface FontSeams {
  fetch(url: string, init: typeof REQUEST_OPTIONS & { signal: AbortSignal }): Promise<FontResponse>;
  /** True when the browser's own font loader accepts the bytes. */
  loadFace(face: { family: string; weight?: string; style?: string; stretch?: string; unicodeRange?: string; bytes: Uint8Array }): Promise<boolean>;
}

export const defaultSeams: FontSeams = {
  fetch: (url, init) => fetch(url, init) as unknown as Promise<FontResponse>,
  async loadFace(face) {
    try {
      const desc: Record<string, string> = {};
      if (face.weight) desc.weight = face.weight;
      if (face.style) desc.style = face.style;
      if (face.stretch) desc.stretch = face.stretch;
      if (face.unicodeRange) desc.unicodeRange = face.unicodeRange;
      await new FontFace(face.family, face.bytes.slice().buffer, desc).load();
      return true;
    } catch {
      return false;
    }
  },
};

/** What a Download needs fonts for: the hosts the panel named and the stylesheets (fetched, or already in hand as `css`). */
export interface FontPlan {
  fontHosts: readonly string[];
  sheets: ReadonlyArray<{ url?: string; css?: string }>;
}

export interface PreparedFace {
  family: string;
  weight?: string;
  style?: string;
  stretch?: string;
  unicodeRange?: string;
  /** The address the bytes came from. */
  url: string;
  mime: string;
  bytes: Uint8Array;
  dataUrl: string;
}

export type FontResult = { ok: true; faces: PreparedFace[] } | { ok: false; code: 'font_unavailable'; reason: string };

class Fail extends Error {}
const fail = (reason: string): never => {
  throw new Fail(reason);
};

interface Run {
  hosts: Set<string>;
  seams: FontSeams;
  requests: number;
  bytes: number;
  controllers: Set<AbortController>;
  failed: boolean;
}

interface Draft {
  family: string;
  weight?: string;
  style?: string;
  stretch?: string;
  unicodeRange?: string;
  url: string;
}

/** Comments out, strings kept whole; a backslash, an unterminated comment or a broken string stops the run. */
function clean(css: string): string {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '\\') fail('backslash in stylesheet');
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end < 0) fail('unterminated comment');
      out += ' ';
      i = end + 2;
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c) {
        if (css[j] === '\n' || css[j] === '\r' || css[j] === '\f') fail('broken string');
        j++;
      }
      if (j >= css.length) fail('unterminated string');
      out += css.slice(i, j + 1);
      i = j + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

function skipString(s: string, i: number): number {
  const q = s[i];
  let j = i + 1;
  while (j < s.length && s[j] !== q) j++;
  return j;
}

/** Splits at `sep` outside strings and parentheses. */
function splitTop(s: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") i = skipString(s, i);
    else if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === sep && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts;
}

interface TopRule {
  prelude: string;
  body: string | null;
}

function topRules(css: string): TopRule[] {
  const rules: TopRule[] = [];
  let i = 0;
  while (i < css.length) {
    let depth = 0;
    let stop = -1;
    for (let j = i; j < css.length; j++) {
      const c = css[j];
      if (c === '"' || c === "'") j = skipString(css, j);
      else if (c === '(') depth++;
      else if (c === ')') depth = Math.max(0, depth - 1);
      else if ((c === '{' || c === ';') && depth === 0) {
        stop = j;
        break;
      }
    }
    const prelude = css.slice(i, stop < 0 ? css.length : stop).trim();
    if (stop < 0) {
      if (prelude) fail('unterminated statement');
      break;
    }
    if (css[stop] === ';') {
      rules.push({ prelude, body: null });
      i = stop + 1;
      continue;
    }
    let level = 1;
    let k = stop + 1;
    for (; k < css.length && level > 0; k++) {
      const c = css[k];
      if (c === '"' || c === "'") k = skipString(css, k);
      else if (c === '{') level++;
      else if (c === '}') level--;
    }
    if (level > 0) fail('unterminated block');
    rules.push({ prelude, body: css.slice(stop + 1, k - 1) });
    i = k;
  }
  return rules;
}

const IDENT = '[A-Za-z0-9_-]+';
const UNQUOTED_FAMILY = new RegExp(`^${IDENT}( ${IDENT})*$`);
function family(v: string): string | null {
  const quoted = /^(["'])([A-Za-z0-9 _.-]+)\1$/.exec(v);
  const name = (quoted ? quoted[2] : v).replace(/\s+/g, ' ').trim();
  if (!name || name.length > MAX_FAMILY) return null;
  if (!quoted && !UNQUOTED_FAMILY.test(name)) return null;
  return name;
}
const norm = (v: string) => v.replace(/\s+/g, ' ').trim();
const WEIGHT = /^(normal|bold|\d{1,4})( \d{1,4})?$/;
const STYLE = /^(normal|italic|oblique( -?\d{1,3}(\.\d+)?deg)?)$/;
const STRETCH = /^(normal|(ultra-|extra-|semi-)?(condensed|expanded)|\d{1,3}(\.\d+)?%( \d{1,3}(\.\d+)?%)?)$/;
const RANGE = /^U\+[0-9A-Fa-f?]{1,6}(-[0-9A-Fa-f]{1,6})?(,U\+[0-9A-Fa-f?]{1,6}(-[0-9A-Fa-f]{1,6})?)*$/;
const URL_FN = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s"'()]+))\s*\)(?:\s*format\(\s*(?:"([^"]*)"|'([^']*)'|([^\s"'()]+))\s*\))?$/i;
const USABLE_HINTS = new Set(['woff2', 'woff', 'opentype', 'truetype']);

/** The first usable `url()` of a `src` list; undefined when the list has none; null when it is outside the grammar. */
function firstSource(v: string): string | undefined | null {
  for (const raw of splitTop(v, ',')) {
    const entry = norm(raw);
    if (/^local\([^()]*\)$/i.test(entry)) continue;
    const m = URL_FN.exec(entry);
    if (!m) return null;
    const hint = m[4] ?? m[5] ?? m[6];
    if (hint !== undefined && !USABLE_HINTS.has(hint.toLowerCase())) continue;
    return m[1] ?? m[2] ?? m[3] ?? '';
  }
  return undefined;
}

/** One `@font-face` body as a draft with an unresolved source, or null when any value is outside its grammar. */
function faceDraft(body: string): (Omit<Draft, 'url'> & { src: string }) | null {
  const d: Record<string, string> = Object.create(null);
  for (const decl of splitTop(body, ';')) {
    if (!decl.trim()) continue;
    const at = decl.indexOf(':');
    if (at < 0) return null;
    d[decl.slice(0, at).trim().toLowerCase()] = decl.slice(at + 1).trim();
  }
  if (d['font-family'] === undefined || d.src === undefined) return null;
  const fam = family(d['font-family']);
  if (!fam) return null;
  const out: Omit<Draft, 'url'> & { src: string } = { family: fam, src: '' };
  const checks: Array<[string, RegExp, 'weight' | 'style' | 'stretch']> = [
    ['font-weight', WEIGHT, 'weight'],
    ['font-style', STYLE, 'style'],
    ['font-stretch', STRETCH, 'stretch'],
  ];
  for (const [prop, re, key] of checks) {
    if (d[prop] === undefined) continue;
    const v = norm(d[prop]);
    if (!re.test(v)) return null;
    out[key] = v;
  }
  if (d['unicode-range'] !== undefined) {
    const v = norm(d['unicode-range']).replace(/\s*,\s*/g, ',');
    if (v.length > MAX_UNICODE_RANGE || !RANGE.test(v)) return null;
    out.unicodeRange = v;
  }
  const src = firstSource(d.src);
  if (!src) return null;
  out.src = src;
  return out;
}

/** Every address must be explicit https on the default port, public, and a host the panel named. */
function judge(raw: string, base: string | undefined, run: Run): string {
  if (raw.length > MAX_ADDRESS) fail('address too long');
  let u: URL;
  try {
    u = new URL(raw, base);
  } catch {
    return fail('address cannot be read');
  }
  if (u.protocol !== 'https:' || u.port || u.username || u.password) fail('address is not plain https');
  const host = u.hostname.toLowerCase();
  if (!isPublicHost(host)) fail('host is not public');
  if (!run.hosts.has(host)) fail('host was not named');
  u.hash = '';
  return u.href;
}

function drafts(css: string, base: string | undefined, run: Run): Draft[] {
  const faces: Draft[] = [];
  for (const rule of topRules(clean(css))) {
    if (/^@import\b/i.test(rule.prelude)) fail('nested import');
    if (rule.body === null || !/^@font-face$/i.test(norm(rule.prelude))) continue;
    const d = faceDraft(rule.body);
    if (!d) continue;
    const { src, ...rest } = d;
    faces.push({ ...rest, url: judge(src, base, run) });
  }
  return faces;
}

const SIGNATURES: Array<[number[], string]> = [
  [[0x77, 0x4f, 0x46, 0x32], 'font/woff2'],
  [[0x77, 0x4f, 0x46, 0x46], 'font/woff'],
  [[0x4f, 0x54, 0x54, 0x4f], 'font/otf'],
  [[0x74, 0x72, 0x75, 0x65], 'font/ttf'],
  [[0x74, 0x74, 0x63, 0x66], 'font/collection'],
  [[0x00, 0x01, 0x00, 0x00], 'font/ttf'],
];
function sniff(bytes: Uint8Array): string | null {
  for (const [sig, mime] of SIGNATURES) if (bytes.length >= 4 && sig.every((b, i) => bytes[i] === b)) return mime;
  return null;
}
const mediaType = (r: FontResponse) => (r.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
const FONT_TYPE = /^(font\/[a-z0-9.+-]+|application\/(x-)?font-[a-z0-9.+-]+|application\/octet-stream|binary\/octet-stream)$/;

async function readBody(res: FontResponse, limit: number, run: Run): Promise<Uint8Array> {
  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > limit) fail('declared length over the limit');
  const chunks: Uint8Array[] = [];
  let total = 0;
  const take = (c: Uint8Array) => {
    total += c.length;
    run.bytes += c.length;
    if (total > limit || run.bytes > RUN_BYTES) fail('over the byte limit');
    chunks.push(c);
  };
  const reader = res.body?.getReader();
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      try {
        take(value as Uint8Array);
      } catch (e) {
        await reader.cancel();
        throw e;
      }
    }
  } else {
    take(new Uint8Array(await res.arrayBuffer()));
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}

async function request(url: string, kind: 'css' | 'font', run: Run): Promise<Uint8Array> {
  if (run.failed) fail('run stopped');
  if (++run.requests > MAX_REQUESTS) fail('too many requests');
  const ctl = new AbortController();
  run.controllers.add(ctl);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      ctl.abort();
      reject(new Fail('timed out'));
    }, FETCH_MS);
  });
  const work = (async () => {
    const res = await run.seams.fetch(url, { ...REQUEST_OPTIONS, signal: ctl.signal });
    if (res.status !== 200 || res.type !== 'cors' || res.redirected) fail('not a plain 200 answer');
    const type = mediaType(res);
    if (kind === 'css' ? type !== 'text/css' : !FONT_TYPE.test(type)) fail('wrong content type');
    return readBody(res, kind === 'css' ? STYLESHEET_BYTES : FONT_FILE_BYTES, run);
  })();
  work.catch(() => undefined);
  try {
    return await Promise.race([work, timeout]);
  } catch (e) {
    throw e instanceof Fail ? e : new Fail('fetch failed');
  } finally {
    clearTimeout(timer);
    run.controllers.delete(ctl);
  }
}

function toBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

interface FontFile {
  mime: string;
  bytes: Uint8Array;
  dataUrl: string;
}

async function fetchFile(url: string, run: Run): Promise<FontFile> {
  const bytes = await request(url, 'font', run);
  const mime = sniff(bytes);
  if (!mime) return fail('bytes are not a font');
  return { mime, bytes, dataUrl: `data:${mime};base64,${toBase64(bytes)}` };
}

async function prepareFace(d: Draft, file: FontFile, run: Run): Promise<PreparedFace> {
  const face: PreparedFace = { ...d, ...file };
  if (!(await run.seams.loadFace(face))) fail('the browser cannot load the font');
  return face;
}

async function pool<T, R>(items: T[], work: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const at = next++;
      out[at] = await work(items[at]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(MAX_PARALLEL, items.length) }, lane));
  return out;
}

/** Fetches the plan's stylesheets and fonts under the rules; any failure gives `font_unavailable` and no faces. */
export async function prepareFonts(plan: FontPlan, seams: FontSeams = defaultSeams): Promise<FontResult> {
  const hosts = new Set<string>();
  for (const h of plan.fontHosts) {
    const host = h.toLowerCase();
    hosts.add(host);
    for (const p of FONT_HOST_PAIRS[host] ?? []) hosts.add(p);
  }
  const run: Run = { hosts, seams, requests: 0, bytes: 0, controllers: new Set(), failed: false };
  try {
    const found: Draft[] = [];
    for (const sheet of plan.sheets) {
      let own: Draft[];
      if (sheet.css !== undefined) {
        own = drafts(sheet.css, sheet.url, run);
      } else {
        const url = judge(sheet.url ?? '', undefined, run);
        const bytes = await request(url, 'css', run);
        own = drafts(new TextDecoder('utf-8', { fatal: true }).decode(bytes), url, run);
      }
      if (own.length === 0) fail('no font faces');
      found.push(...own);
    }
    if (found.length === 0) fail('no font faces');
    const urls = [...new Set(found.map((d) => d.url))];
    if (urls.length > MAX_REQUESTS) fail('too many font faces');
    const files = new Map<string, FontFile>();
    await pool(urls, async (url) => {
      files.set(url, await fetchFile(url, run));
    });
    return { ok: true, faces: await pool(found, (d) => prepareFace(d, files.get(d.url) as FontFile, run)) };
  } catch (e) {
    run.failed = true;
    for (const c of run.controllers) c.abort();
    return { ok: false, code: 'font_unavailable', reason: e instanceof Fail ? e.message : 'unexpected failure' };
  }
}
