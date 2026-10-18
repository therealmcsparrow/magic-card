/*
 * Module i18n (contract src/contracts/i18n.ts 1.0.0 r2, ADR 0032 r2): locale pick, compact tables and the
 * ICU-subset formatter. Lives in magic-card.js (<= I18N_RUNTIME_MAX_BYTES minified); every lazy chunk below
 * it reuses this module. Messages come from per-namespace tables: three newline-joined strings (en-GB,
 * en-US, nl), entry i of each is message i. Ids are numbers after tools/i18n-loader.cjs; without the loader
 * (vitest, plain JS) the British text is looked up in the en-GB table.
 */
import type { I18nFor, Locale, LocaleHassLike, ResolveLocale, RichArgs } from '../contracts/i18n';
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
      const find = (k: string) => br[br.findIndex((y, j) => !(j & 1) && y.trim() == k) + 1 || -1];
      const pick = find('=' + v) ?? find(pl ? new Intl.PluralRules(NAMES[loc]).select(+v) : String(v)) ?? find('other');
      if (pick === undefined) throw 0;
      return fmt(pick, a, pl ? +v : undefined);
    })
    .filter(String);

export const i18nFor: I18nFor = (ns, tb) => {
  const rows: string[][] = [];
  const row = (l: number) => (rows[l] ||= tb[l].split('\n'));
  let ix: Map<string, number> | undefined;
  /** Message text for id in locale l: that locale, else en-GB (context prefix stripped there). */
  const look = (id: string | number, c = '', l = loc) => {
    const i = typeof id == 'number' ? id : ((ix ||= new Map(row(0).map((s, k) => [s, k]))).get(c ? c + '|' + id : id) ?? -1);
    if (i < 0) return dbg('unknown ' + id), String(id);
    return (l && row(l)[i]) || (row(0)[i] ?? '').slice(c ? c.length + 1 : 0);
  };
  const make = (id: string | number, a: RichArgs = {}, c?: string): unknown[] => {
    try {
      return fmt(look(id, c), a);
    } catch {
      dbg('malformed ' + id);
      return [look(id, c, 0)];
    }
  };
  return {
    ns,
    locale: () => NAMES[loc],
    t: (id, a) => make(id, a).join(''),
    tc: (c, id, a) => make(id, a, c).join(''),
    tx: (id, a) => make(id, a),
    m: (id) => id,
  };
};
