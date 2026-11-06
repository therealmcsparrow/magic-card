// Module i18n runtime: locale pick, compact tables and the ICU-subset formatter. One copy per
// entry; tables are three '|'-joined strings (en-GB, en-US, nl) indexed by the id the loader writes.
import type { I18nFor, I18nForLazy, Locale, LocaleHassLike, ResolveLocale, RichArgs } from '../contracts/i18n';
import { formatNumber } from '../utils/locale-format';
import { dbg, hasWrap, listenForWrap, wrapText } from './pseudo-hook';

const NAMES: readonly Locale[] = ['en-GB', 'en-US', 'nl'];
let loc = 0;
let hs: LocaleHassLike | undefined;
const nf = (n: number) => formatNumber(hs as never, n);

export const resolveLocale: ResolveLocale = (l) => {
  const m = /^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((l || '').toLowerCase());
  return m ? (m[1] == 'nl' ? 'nl' : m[3] ? 'en-GB' : 'en-US') : 'en-GB';
};

export const setI18nLocale = (hass: LocaleHassLike | undefined): Locale => {
  hs = hass;
  const l = resolveLocale(hass?.locale?.language || hass?.language || globalThis.navigator?.language);
  loc = NAMES.indexOf(l);
  return l;
};

/** Splits a message into literal text (even entries) and the bodies of its {...} (odd entries); one level of nested braces per regexp. */
const TOP = /\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/;
const BRANCH = /\{((?:[^{}]|\{[^{}]*\})*)\}/;

const RTL = /^(ar|he|iw|fa|ur|ps|sd|ug|yi|dv|ckb)\b/i;
const STRONG = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

/** Message s in locale `tag`; string arguments are isolated with U+2068/U+2069 under an rtl tag, a wrap, or rtl text. */
export const fmtIn = (tag: string, s: string, a: RichArgs, h?: number): unknown[] =>
  s
    .split(TOP)
    .flatMap((x, i) => {
      if (!(i & 1)) return h === undefined ? x : x.replace(/#/g, nf(h));
      const m = /^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(x);
      if (!m) throw 0;
      const v = a[m[1]] as never;
      if (v === undefined) dbg('missing ' + m[1]);
      if (!m[2]) return typeof v == 'object' ? [v] : v === undefined ? '' : typeof v == 'number' ? nf(v) : RTL.test(tag) || hasWrap() || STRONG.test(v) ? '\u2068' + v + '\u2069' : v;
      const br = m[3].split(BRANCH); // keys at even indexes, branch text after each
      const pl = m[2] == 'plural';
      const sv = pl ? Math.round(+v * 10) / 10 : v; // the number as nf() shows it
      const find = (k: string) => br[br.findIndex((y, j) => !(j & 1) && y.trim() == k) + 1 || -1];
      const pick = find('=' + sv) ?? find(pl ? new Intl.PluralRules(tag).select(sv) : String(v)) ?? find('other');
      if (pick === undefined) throw 0;
      return fmtIn(tag, pick, a, pl ? sv : undefined);
    })
    .filter(String);

type Tables = Parameters<I18nFor>[1];

const core = (ns: Parameters<I18nFor>[0], tb: () => Tables | undefined) => {
  listenForWrap();
  const rows: string[][] = [];
  const row = (l: number) => (rows[l] ||= (tb() as Tables)[l].split('|'));
  /** Message i in locale l; an empty cell of en-US or nl gives the en-GB text. */
  const look = (i: number, l = loc) => (tb() ? (row(l)[i] || row(0)[i]) ?? '' : (dbg('not ready ' + ns), ''));
  const make = (i: number, a: RichArgs = {}): unknown[] => {
    try {
      return fmtIn(NAMES[loc], look(i), a);
    } catch {
      dbg('malformed ' + i);
      return [look(i, 0)];
    }
  };
  return {
    ns,
    locale: () => NAMES[loc],
    t: (i: number, a?: RichArgs) => wrapText(make(i, a).join(''), 'msg'),
    tx: (i: number, a: RichArgs) => make(i, a).map((x) => (typeof x == 'string' ? wrapText(x, 'msg') : x)),
    en: (i: number) => look(i, 0),
    m: (i: number) => i,
  };
};

export const i18nFor: I18nFor = (ns, tb) => core(ns, () => tb);

/** A namespace whose tables sit in a lazy chunk: nothing renders before ready() resolves (Rule 3). */
export const i18nForLazy: I18nForLazy = (ns, load) => {
  let tb: Tables | undefined;
  let p: Promise<boolean> | undefined;
  return {
    ...core(ns, () => tb),
    ready: () => (p ||= load().then((x) => ((tb = x.default), true), () => ((p = undefined), false))),
  };
};
