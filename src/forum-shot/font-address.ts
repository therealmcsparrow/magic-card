// Which font addresses a card config names, and whether the card can be picked. Reads nothing from the network.
import type { ForumShotLockReason } from '../contracts/forum-shot';
import { configGoogleFonts } from '../utils/google-fonts';
import { CUSTOM_CARD, LIMIT, MAX_DEPTH, MAX_NODES, MAX_STRING, decodeEntities, findRemoteAssets } from './remote';

/** A stylesheet host and the font hosts it may send fonts to without the config naming them. */
export const FONT_HOST_PAIRS: Readonly<Record<string, readonly string[]>> = { 'fonts.googleapis.com': ['fonts.gstatic.com'] };
/** Most font hosts a card may name before it is locked: a longer list is no disclosure. */
export const MAX_FONT_HOSTS = 8;
const MAX_ADDRESS = 2048;
// Roboto is the Home Assistant font and loads nothing.
const SYSTEM_FAMILY = 'Roboto';
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
}

const FAILED: CssRead = { fail: true, hosts: [], outside: false, cannot: false, rest: '' };

/** Judges the plain font forms of a `css` text (`@import`, and `src` of a top-level `@font-face`); every other address stays in `rest`. */
function readCss(css: string, origin: string): CssRead {
  const lexed = tokenise(css);
  if (!lexed) return FAILED;
  const { toks, starts } = lexed;
  const len = toks.length;
  const hosts = new Set<string>();
  const cuts: [number, number][] = [];
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
      if (t.name === 'import' && toks[q].k === 'semi') importForm(p, q);
      else if (t.name === 'font-face' && toks[q].k === 'open' && toks.slice(p + 1, q).every((x) => x.k === 'ws')) fontFace(q);
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
  return { fail: false, hosts: [...hosts], outside, cannot, rest: parts.join(' ') };
}

/** Whether a card can be picked and which hosts a Download would contact for its fonts. Makes no request. */
export function classifyCard(config: unknown, origin: string): CardClass {
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
      for (const [k, x] of Object.entries(v)) out[k] = k === 'css' && typeof x === 'string' ? cssRest(x) : rewrite(x, depth + 1);
      return out;
    }
    return v;
  };
  const stripped = rewrite(config, 0);
  const families = config && typeof config === 'object' ? configGoogleFonts(config) : [];
  const remote = findRemoteAssets(stripped, origin).filter((r) => !families.includes(r));
  if (families.some((f) => f !== SYSTEM_FAMILY)) GOOGLE_HOSTS.forEach((h) => hosts.add(h));
  for (const h of [...hosts]) FONT_HOST_PAIRS[h]?.forEach((x) => hosts.add(x));

  let lock: ForumShotLockReason | null = null;
  if (remote.includes(CUSTOM_CARD)) lock = 'custom_card';
  else if (remote.includes(LIMIT) || hosts.size > MAX_FONT_HOSTS) lock = 'limit';
  else if (remote.length || outside) lock = 'outside_address';
  else if (cannot) lock = 'cannot_judge';
  return { lock, fontHosts: lock ? [] : [...hosts] };
}
