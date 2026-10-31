// Module i18n runtime: locale pick, compact tables and the ICU-subset formatter. One copy per
// entry; tables are three '|'-joined strings (en-GB, en-US, nl) indexed by the id the loader writes.
import type { I18nFor, I18nForLazy, Locale, LocaleHassLike, ResolveLocale, RichArgs } from '../contracts/i18n';
import { formatNumber } from '../utils/locale-format';

const NAMES: readonly Locale[] = ['en-GB', 'en-US', 'nl'];
let loc = 0;
let hs: LocaleHassLike | undefined;
const seen: Record<string, 1> = {};
// eslint-disable-next-line no-console
const dbg = (m: string) => (seen[m] ||= (console.debug('[i18n] ' + m), 1));
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

const fmt = (s: string, a: RichArgs, h?: number): unknown[] =>
  s
    .split(TOP)
    .flatMap((x, i) => {
      if (!(i & 1)) return h === undefined ? x : x.replace(/#/g, nf(h));
      const m = /^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(x);
      if (!m) throw 0;
      const v = a[m[1]] as never;
      if (v === undefined) dbg('missing ' + m[1]);
      if (!m[2]) return typeof v == 'object' ? [v] : v === undefined ? '' : typeof v == 'number' ? nf(v) : v;
      const br = m[3].split(BRANCH); // keys at even indexes, branch text after each
      const pl = m[2] == 'plural';
      const sv = pl ? Math.round(+v * 10) / 10 : v; // the number as nf() shows it
      const find = (k: string) => br[br.findIndex((y, j) => !(j & 1) && y.trim() == k) + 1 || -1];
      const pick = find('=' + sv) ?? find(pl ? new Intl.PluralRules(NAMES[loc]).select(sv) : String(v)) ?? find('other');
      if (pick === undefined) throw 0;
      return fmt(pick, a, pl ? sv : undefined);
    })
    .filter(String);

type Tables = Parameters<I18nFor>[1];

const core = (ns: Parameters<I18nFor>[0], tb: () => Tables | undefined) => {
  const rows: string[][] = [];
  const row = (l: number) => (rows[l] ||= (tb() as Tables)[l].split('|'));
  /** Message i in locale l; an empty cell of en-US or nl gives the en-GB text. */
  const look = (i: number, l = loc) => (tb() ? (row(l)[i] || row(0)[i]) ?? '' : (dbg('not ready ' + ns), ''));
  const make = (i: number, a: RichArgs = {}): unknown[] => {
    try {
      return fmt(look(i), a);
    } catch {
      dbg('malformed ' + i);
      return [look(i, 0)];
    }
  };
  return {
    ns,
    locale: () => NAMES[loc],
    t: (i: number, a?: RichArgs) => make(i, a).join(''),
    tx: (i: number, a: RichArgs) => make(i, a),
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
