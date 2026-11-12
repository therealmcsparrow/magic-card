// Which font addresses a card config names, and whether the card can be picked. Reads nothing from the network.
import type { ForumShotLockReason } from '../contracts/forum-shot';
import { googleFontsAllowed, googleFontsChunk } from '../utils/google-fonts';
import type { FontPlan, PreparedFace } from './font-fetch';
import { CUSTOM_CARD, FONT_KEYS, LIMIT, MAX_DEPTH, MAX_NODES, MAX_STRING, decodeEntities, findRemoteAssets } from './remote';

/** A stylesheet host and the font hosts it may send fonts to without the config naming them. */
export const FONT_HOST_PAIRS: Readonly<Record<string, readonly string[]>> = { 'fonts.googleapis.com': ['fonts.gstatic.com'] };
/** Most font hosts a card may name before it is locked: a longer list is no disclosure. */
export const MAX_FONT_HOSTS = 8;
const MAX_ADDRESS = 2048;
const GOOGLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const PRIVATE_SUFFIXES = ['localhost', 'local', 'internal', 'intranet', 'private', 'corp', 'home', 'lan', 'localdomain', 'arpa'];
// ASCII letters, digits and `- . _ ~ : / ? # @ ! $ & + , ; = %`; anything else (space, quote, bracket, backslash, `*`, braces) cannot be judged.
const ADDRESS_CHARS = /^[A-Za-z0-9\-._~:/?#@!$&+,;=%]*$/;

export interface CardClass {
  /** Why the card cannot be picked; null when it can. */
  lock: ForumShotLockReason | null;
  /** Full lower-case hosts a Download contacts for fonts; empty on a locked card. */
  fontHosts: string[];
}

type Verdict = { kind: 'host'; host: string } | { kind: 'outside' } | { kind: 'cannot' };
const CANNOT: Verdict = { kind: 'cannot' };
const OUTSIDE: Verdict = { kind: 'outside' };

type FontLib = typeof import('../google-fonts/loader');
let lib: FontLib | undefined;

/** Loads the shared `google-fonts` chunk (the catalogue and the loader) once; resolves with nothing while Magic Card Utils does not allow Google Fonts, and the name helpers below read nothing until then. */
export async function loadGoogleFontsLib(): Promise<FontLib | undefined> {
  if (!googleFontsAllowed()) return undefined;
  return (lib ??= await googleFontsChunk());
}

/** The Google families a card config uses, as the catalogue names them; none while Magic Card Utils does not allow Google Fonts. */
export async function configGoogleFamilies(config: object): Promise<string[]> {
  const fonts = await loadGoogleFontsLib();
  return fonts ? (await fonts.resolveGoogleFonts(fonts.configFontCandidates(config))).map((f) => f.name) : [];
}

/** The catalogue name of the family a font-family part (or a one-family value) names; undefined for a local font, a generic, or while Google Fonts are not allowed. */
function googleNameOf(part: string): string | undefined {
  const candidate = lib?.fontCandidates(part)[0];
  return candidate && googleFontsAllowed() ? lib?.findFamily(candidate)?.name : undefined;
}

/** Every Google family in a font-family value, in order. */
function googleNamesIn(value: string): string[] {
  return [...new Set(value.split(',').map(googleNameOf).filter((n): n is string => !!n))];
}

export function isPublicHost(host: string): boolean {
  if (host.length > 253) return false;
  const labels = host.split('.');
  if (labels.length < 2) return false;
  if (!labels.every((l) => l.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(l))) return false;
  const last = labels[labels.length - 1];
  if (!/^[a-z]+$/.test(last) && !last.startsWith('xn--')) return false;
  return !PRIVATE_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));
}

/** The verdict on one address written in a plain font form. */
function judgeAddress(addr: string, origin: string): Verdict {
  if (addr.length > MAX_ADDRESS || !ADDRESS_CHARS.test(addr) || /%(?![0-9A-Fa-f]{2})/.test(addr) || decodeEntities(addr) !== addr) return CANNOT;
  const scheme = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(addr)?.[1].toLowerCase();
  if (scheme === 'data' || scheme === 'blob') return CANNOT;
  if (scheme === undefined && !addr.startsWith('//')) return CANNOT;
  if (scheme === undefined || addr.startsWith('://', scheme.length)) {
    try {
      if (new URL(addr, origin).origin === origin) return CANNOT;
    } catch {
      return OUTSIDE;
    }
  }
  if (!/^https:\/\//i.test(addr)) return OUTSIDE;
  let url: URL;
  try {
    url = new URL(addr);
  } catch {
    return OUTSIDE;
  }
  const authority = addr.slice(8).split(/[/?#]/, 1)[0].toLowerCase();
  const written = authority.endsWith(':443') ? authority.slice(0, -4) : authority;
  if (url.username || url.password || written !== url.hostname || !isPublicHost(url.hostname)) return OUTSIDE;
  return { kind: 'host', host: url.hostname };
}

type Kind = 'ws' | 'comment' | 'str' | 'url' | 'word' | 'at' | 'func' | 'open' | 'close' | 'semi' | 'paren' | 'unparen' | 'delim';
interface Tok {
  k: Kind;
  /** Lower-case name of a word, at-keyword or function. */
  name?: string;
  /** Range of the address inside a string or a `url()`. */
  a?: number;
  b?: number;
  /** A `url()` that holds the address alone. */
  plain?: boolean;
}

const WS = /[ \t\n\r\f]/;
const HEX = /[0-9a-fA-F]/;
const NAME = /[A-Za-z0-9_\-\u0080-￿]/;

/** CSS tokens of `css`, or null when a comment, string, `url(` or block is left open or a closing brace has no opening one. */
function tokenise(css: string): { toks: Tok[]; starts: number[] } | null {
  const n = css.length;
  const toks: Tok[] = [];
  const starts: number[] = [];
  const push = (at: number, t: Tok) => {
    toks.push(t);
    starts.push(at);
  };
  const str = (from: number): number => {
    const quote = css[from];
    for (let j = from + 1; j < n; j++) {
      const c = css[j];
      if (c === '\\') {
        if (j + 1 >= n) return -1;
        j++;
      } else if (c === '\n' || c === '\r' || c === '\f') return -1;
      else if (c === quote) return j + 1;
    }
    return -1;
  };
  const word = (from: number): { end: number; esc: boolean } => {
    let j = from;
    let esc = false;
    while (j < n) {
      const c = css[j];
      if (c === '\\') {
        esc = true;
        j++;
        if (j >= n) break;
        if (HEX.test(css[j])) {
          for (let h = 0; h < 6 && j < n && HEX.test(css[j]); h++) j++;
          if (j < n && WS.test(css[j])) j++;
        } else j++;
      } else if (NAME.test(c)) j++;
      else break;
    }
    return { end: j, esc };
  };
  const skipWs = (from: number): number => {
    let j = from;
    while (j < n && WS.test(css[j])) j++;
    return j;
  };
  /** The `url(` argument starting at `from`; `plain` when it is the address alone. */
  const readUrl = (from: number): { end: number; a: number; b: number; plain: boolean } | null => {
    const j = skipWs(from);
    if (css[j] === '"' || css[j] === "'") {
      const e = str(j);
      if (e < 0) return null;
      let k = skipWs(e);
      if (css[k] === ')') return { end: k + 1, a: j + 1, b: e - 1, plain: true };
      while (k < n && css[k] !== ')') {
        if (css[k] === '"' || css[k] === "'") {
          const e2 = str(k);
          if (e2 < 0) return null;
          k = e2;
        } else k += css[k] === '\\' ? 2 : 1;
      }
      return k >= n ? null : { end: k + 1, a: 0, b: 0, plain: false };
    }
    let k = j;
    while (k < n && css[k] !== ')') k += css[k] === '\\' ? 2 : 1;
    if (k >= n) return null;
    let b = k;
    while (b > j && WS.test(css[b - 1])) b--;
    return { end: k + 1, a: j, b, plain: true };
  };

  let i = 0;
  let depth = 0;
  while (i < n) {
    const c = css[i];
    if (WS.test(c)) {
      const e = skipWs(i);
      push(i, { k: 'ws' });
      i = e;
    } else if (c === '/' && css[i + 1] === '*') {
      const e = css.indexOf('*/', i + 2);
      if (e < 0) return null;
      push(i, { k: 'comment' });
      i = e + 2;
    } else if (c === '"' || c === "'") {
      const e = str(i);
      if (e < 0) return null;
      push(i, { k: 'str', a: i + 1, b: e - 1 });
      i = e;
    } else if (c === '{') {
      depth++;
      push(i, { k: 'open' });
      i++;
    } else if (c === '}') {
      if (!depth) return null;
      depth--;
      push(i, { k: 'close' });
      i++;
    } else if (c === ';') {
      push(i, { k: 'semi' });
      i++;
    } else if (c === '@' && word(i + 1).end > i + 1) {
      const w = word(i + 1);
      if (w.esc) return null;
      push(i, { k: 'at', name: css.slice(i + 1, w.end).toLowerCase() });
      i = w.end;
    } else if (c === '\\' || NAME.test(c)) {
      const w = word(i);
      const name = css.slice(i, w.end).toLowerCase();
      if (css[w.end] !== '(') {
        push(i, { k: 'word', name });
        i = w.end;
      } else if (w.esc) {
        return null;
      } else if (name === 'url') {
        const r = readUrl(w.end + 1);
        if (!r) return null;
        push(i, { k: 'url', a: r.a, b: r.b, plain: r.plain });
        i = r.end;
      } else {
        push(i, { k: 'func', name });
        i = w.end + 1;
      }
    } else {
      push(i, { k: c === '(' ? 'paren' : c === ')' ? 'unparen' : 'delim' });
      i++;
    }
  }
  return depth ? null : { toks, starts };
}

interface CssRead {
  fail: boolean;
  hosts: string[];
  outside: boolean;
  cannot: boolean;
  /** The text without the plain addresses that were judged, as parts joined by a space, for the scan of every other address. */
  rest: string;
  /** The judged `@import` addresses, and the text of each top-level `@font-face` rule. */
  imports: string[];
  faces: string[];
  /** The text without any top-level `@import` and `@font-face` rule. */
  pure: string;
}

const FAILED: CssRead = { fail: true, hosts: [], outside: false, cannot: false, rest: '', imports: [], faces: [], pure: '' };

/** Judges the plain font forms of a `css` text (`@import`, and `src` of a top-level `@font-face`); every other address stays in `rest`. */
function readCss(css: string, origin: string): CssRead {
  const lexed = tokenise(css);
  if (!lexed) return FAILED;
  const { toks, starts } = lexed;
  const len = toks.length;
  const hosts = new Set<string>();
  const cuts: [number, number][] = [];
  const drops: [number, number][] = [];
  const imports: string[] = [];
  const faces: string[] = [];
  let outside = false;
  let cannot = false;
  const judge = (a: number, b: number) => {
    const v = judgeAddress(css.slice(a, b), origin);
    cuts.push([a, b]);
    if (v.kind === 'host') hosts.add(v.host);
    else if (v.kind === 'outside') outside = true;
    else cannot = true;
  };
  const skipBlock = (from: number): number => {
    let d = 0;
    for (let p = from; p < len; p++) {
      if (toks[p].k === 'open') d++;
      else if (toks[p].k === 'close' && --d === 0) return p + 1;
    }
    return len;
  };
  /** `@import` at token `at`, closed by the `;` at `end`: plain when only the address and media words follow. */
  const importForm = (at: number, end: number) => {
    let j = at + 1;
    while (j < end && toks[j].k === 'ws') j++;
    const t = toks[j];
    if (!t || (t.k !== 'str' && !(t.k === 'url' && t.plain))) return;
    for (let k = j + 1; k < end; k++) {
      const m = toks[k];
      if (m.k !== 'ws' && m.k !== 'word' && !(m.k === 'delim' && css[starts[k]] === ',')) return;
    }
    judge(t.a as number, t.b as number);
    imports.push(css.slice(t.a, t.b));
  };
  /** The `src` descriptor of the `@font-face` block opened at token `open`. */
  const fontFace = (open: number) => {
    let depth = 1;
    let declStart = true;
    let inSrc = false;
    let parens = 0;
    for (let p = open + 1; p < len && depth > 0; p++) {
      const t = toks[p];
      if (t.k === 'open') depth++;
      else if (t.k === 'close') depth--;
      else if (depth !== 1) continue;
      else if (t.k === 'semi') {
        declStart = true;
        inSrc = false;
        parens = 0;
      } else if (declStart) {
        if (t.k === 'ws') continue;
        declStart = false;
        if (t.k === 'word' && t.name === 'src') {
          let m = p + 1;
          while (m < len && toks[m].k === 'ws') m++;
          if (m < len && toks[m].k === 'delim' && css[starts[m]] === ':') {
            inSrc = true;
            p = m;
          }
        }
      } else if (inSrc) {
        if (t.k === 'func' || t.k === 'paren') parens++;
        else if (t.k === 'unparen') parens = Math.max(0, parens - 1);
        else if (t.k === 'url' && t.plain && parens === 0) judge(t.a as number, t.b as number);
      }
    }
  };

  let p = 0;
  while (p < len) {
    const t = toks[p];
    if (t.k === 'ws' || t.k === 'comment' || t.k === 'semi') {
      p++;
      continue;
    }
    let q = p + 1;
    while (q < len && toks[q].k !== 'semi' && toks[q].k !== 'open') q++;
    if (t.k === 'at') {
      if (q >= len) return FAILED;
      if (t.name === 'import' && toks[q].k === 'semi') {
        importForm(p, q);
        drops.push([starts[p], starts[q] + 1]);
      } else if (t.name === 'font-face' && toks[q].k === 'open' && toks.slice(p + 1, q).every((x) => x.k === 'ws')) {
        fontFace(q);
        const end = starts[skipBlock(q) - 1] + 1;
        faces.push(css.slice(starts[p], end));
        drops.push([starts[p], end]);
      }
    }
    p = q >= len ? q : toks[q].k === 'semi' ? q + 1 : skipBlock(q);
  }

  const parts: string[] = [];
  let from = 0;
  for (const [a, b] of cuts) {
    parts.push(css.slice(from, a));
    from = b;
  }
  parts.push(css.slice(from));
  // Comments go too: a space where a rule was removed must not turn the comments around it into a slash pair the source did not hold.
  const gone = [...drops];
  toks.forEach((t, k) => {
    if (t.k === 'comment') gone.push([starts[k], k + 1 < len ? starts[k + 1] : css.length]);
  });
  gone.sort((x, y) => x[0] - y[0]);
  const kept: string[] = [];
  from = 0;
  for (const [a, b] of gone) {
    if (a < from) continue;
    kept.push(css.slice(from, a));
    from = b;
  }
  kept.push(css.slice(from));
  return { fail: false, hosts: [...hosts], outside, cannot, rest: parts.join(' '), imports, faces, pure: kept.join(' ') };
}

/** Whether a card can be picked and which hosts a Download would contact for its fonts. Makes no request. */
export async function classifyCard(config: unknown, origin: string): Promise<CardClass> {
  const hosts = new Set<string>();
  let outside = false;
  let cannot = false;
  const cssRest = (css: string): string => {
    if (css.length > MAX_STRING) return css;
    const r = readCss(css, origin);
    if (r.fail) {
      cannot = true;
      return '';
    }
    r.hosts.forEach((h) => hosts.add(h));
    outside ||= r.outside;
    cannot ||= r.cannot;
    return r.rest;
  };
  let nodes = 0;
  const rewrite = (v: unknown, depth: number): unknown => {
    if (++nodes > MAX_NODES || depth > MAX_DEPTH) return v;
    if (Array.isArray(v)) return v.map((x) => rewrite(x, depth + 1));
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) {
        if (k === '__proto__') cannot = true;
        else out[k] = k === 'css' && typeof x === 'string' ? cssRest(x) : rewrite(x, depth + 1);
      }
      return out;
    }
    return v;
  };
  const stripped = rewrite(config, 0);
  const families = config && typeof config === 'object' ? await configGoogleFamilies(config) : [];
  const remote = findRemoteAssets(stripped, origin);
  if (families.length) GOOGLE_HOSTS.forEach((h) => hosts.add(h));
  for (const h of [...hosts]) FONT_HOST_PAIRS[h]?.forEach((x) => hosts.add(x));

  let lock: ForumShotLockReason | null = null;
  if (remote.includes(CUSTOM_CARD)) lock = 'custom_card';
  else if (remote.includes(LIMIT) || hosts.size > MAX_FONT_HOSTS) lock = 'limit';
  else if (remote.length || outside) lock = 'outside_address';
  else if (cannot) lock = 'cannot_judge';
  return { lock, fontHosts: lock ? [] : [...hosts] };
}

/** The name a Google family goes by on the mounted copy, so the card's own loader finds nothing to request. */
export const aliasOf = (family: string): string => `mc-shot-${family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

// The card's own loader reads a font-family value up to `;` (src/utils/google-fonts.ts), so a family after a `}` is loaded and must be renamed too.
const LOADER_FONT_FAMILY = /(font-family\s*:\s*)([^;]+)/gi;

/** One loader value: its reading up to a `}`, then the rest, where a later `font-family` (minified css) is a value of its own. */
function mapValue(v: string, fn: (value: string) => string): string {
  let out = '';
  let cur = v;
  for (;;) {
    const brace = cur.indexOf('}');
    if (brace < 0) return out + fn(cur);
    const tail = cur.slice(brace);
    const next = /(font-family\s*:\s*)/i.exec(tail);
    if (!next) return out + fn(cur.slice(0, brace)) + fn(tail);
    out += fn(cur.slice(0, brace)) + fn(tail.slice(0, next.index)) + next[1];
    cur = tail.slice(next.index + next[1].length);
  }
}

/** Every `font-family` value of `css` the way the loader reads it; `fn` returns the new value. */
function mapFontFamilies(css: string, fn: (value: string) => string): string {
  return css.replace(LOADER_FONT_FAMILY, (_m, head: string, v: string) => head + mapValue(v, fn));
}

/** `value` with each listed Google family swapped for its alias when `has` accepts it (Roboto excepted). */
export function aliasFamilies(value: string, has: (lower: string) => boolean): string {
  return value
    .split(',')
    .map((part) => {
      const f = googleNameOf(part);
      return f && has(f.toLowerCase()) ? ` "${aliasOf(f)}"` : part;
    })
    .join(',')
    .replace(/^ /, '');
}

/** A text from a template result with every Google family under its alias, so the card's own loader requests none; `onMissing` is called for a family no face was prepared for. */
export function aliasInText(text: string, prepared: ReadonlySet<string>, onMissing: () => void): string {
  return mapFontFamilies(text, (v) => {
    for (const f of googleNamesIn(v)) if (!prepared.has(f.toLowerCase())) onMissing();
    return aliasFamilies(v, () => true);
  });
}

/** The value of a font key from a template result with every Google family under its alias, so the card's own loader requests none; `onMissing` is called for a family no face was prepared for. */
export function aliasFontValue(value: string, prepared: ReadonlySet<string>, onMissing: () => void): string {
  for (const f of googleNamesIn(value)) if (!prepared.has(f.toLowerCase())) onMissing();
  return aliasFamilies(value, () => true);
}

export interface CardKit {
  lock: CardClass['lock'];
  /** What a Download must fetch; no sheets means no request at all. */
  plan: FontPlan;
  /** The config the card mounts on: font addresses gone, Google families under their aliases. */
  mount: Record<string, unknown>;
  /** Lower-case real family to alias, for each Google family in use. */
  aliases: Map<string, string>;
}

/** Judges a freshly read config and builds what a Download needs for its fonts. Makes no request. */
export async function prepareCard(config: Record<string, unknown>, origin: string): Promise<CardKit> {
  const { lock, fontHosts } = await classifyCard(config, origin);
  const imports: string[] = [];
  const faces: string[] = [];
  const aliases = new Map<string, string>();
  const fonts = await loadGoogleFontsLib();
  const resolved = fonts ? await fonts.resolveGoogleFonts(fonts.configFontCandidates(config)) : [];
  for (const f of resolved) aliases.set(f.name.toLowerCase(), aliasOf(f.name));
  const hasAlias = (lower: string) => aliases.has(lower);
  const mountCss = (css: string): string => {
    const r = css.length > MAX_STRING ? null : readCss(css, origin);
    if (!r) return css;
    if (r.fail) return mapFontFamilies(css, (v) => aliasFamilies(v, hasAlias));
    imports.push(...r.imports);
    faces.push(...r.faces);
    return mapFontFamilies(r.pure, (v) => aliasFamilies(v, hasAlias));
  };
  let nodes = 0;
  const rewrite = (v: unknown, depth: number): unknown => {
    if (++nodes > MAX_NODES || depth > MAX_DEPTH) return v;
    if (Array.isArray(v)) return v.map((x) => rewrite(x, depth + 1));
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) {
        if (k === '__proto__') continue;
        if (typeof x === 'string' && k === 'css') out[k] = mountCss(x);
        else if (typeof x === 'string' && FONT_KEYS.has(k)) out[k] = aliasFamilies(x, hasAlias);
        else out[k] = rewrite(x, depth + 1);
      }
      return out;
    }
    return v;
  };
  const mount = rewrite(config, 0) as Record<string, unknown>;
  const sheets = [
    ...imports.map((url) => ({ url })),
    ...faces.map((css) => ({ css })),
    ...resolved.map((f) => ({ url: (fonts as FontLib).googleFontUrl(f) })),
  ];
  return { lock, plan: { fontHosts, sheets: lock ? [] : sheets }, mount, aliases };
}

const SAFE_DATA = /^data:[a-z0-9/+.-]+;base64,[A-Za-z0-9+/=]*$/;
const SAFE_RANGE = /^[Uu+0-9A-Fa-f?,\s-]+$/;
const SAFE_TOKEN = /^[A-Za-z0-9 .%-]+$/;
const cssName = (v: string): string => v.replace(/[^A-Za-z0-9 _.-]/g, '');

/** `@font-face` rules for the prepared faces, built from checked values only: each face under its real name and, for a Google family, under its alias. Null when any value is not safe to write. */
export function faceRules(faces: readonly PreparedFace[], aliases: ReadonlyMap<string, string>): string | null {
  let out = '';
  for (const f of faces) {
    if (!SAFE_DATA.test(f.dataUrl) || (f.unicodeRange && !SAFE_RANGE.test(f.unicodeRange))) return null;
    let tail = `src:url("${f.dataUrl}");`;
    for (const [prop, v] of [['font-weight', f.weight], ['font-style', f.style], ['font-stretch', f.stretch]] as const) {
      if (!v) continue;
      if (!SAFE_TOKEN.test(v)) return null;
      tail += `${prop}:${v};`;
    }
    if (f.unicodeRange) tail += `unicode-range:${f.unicodeRange};`;
    const names = [cssName(f.family)];
    const alias = aliases.get(f.family.toLowerCase());
    if (alias) names.push(alias);
    for (const n of names) out += `@font-face{font-family:"${n}";${tail}}`;
  }
  return out;
}
