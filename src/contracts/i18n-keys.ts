/*
 * Contract: i18n-keys. Version 1.1.0. Extends i18n (src/contracts/i18n.ts 2.0.0) with domain keys; the text-id path is gone
 * (see "Text ids" below). Types and tool constants only: src/ imports types,
 * tools read the constants (the file has only type imports, which transpiling drops, so tools transpile and run
 * it like the i18n contract).
 *
 * ── Keys ──
 * A message is named by its place in the UI: t('card-editor.design.background.label'), not by its English.
 * KEY_PATTERN: the namespace, then two to five lower-case kebab segments joined by dots. The prefix is the
 * namespace of the i18n module the call imports (key prefix = namespace). Literal keys only: no variables, no
 * template strings, no joining. A key has one meaning and is never reused for another; two places with the same
 * English get two keys. Keys never reach dist: tools/i18n-loader.cjs rewrites each call to its table index.
 *
 * ── Source files, per namespace folder src/<folder>/i18n/ (Magic Card Utils: <mcu>/i18n/) ──
 * en-GB.json  SourceCatalogueV2: key -> { text, note, max, vars? }. The only place English is written.
 *             note: where the text shows and what it does, for translators (required, NOTE_MIN_CHARS or more).
 *             max: the longest text the place can hold, in characters (required). en-GB, en-US and nl must fit.
 *             vars: one description per ICU argument; its names equal the message's arguments (required when the
 *             text has arguments, absent otherwise).
 *             The length of a text is counted on its longest rendering: each plural or select is replaced by its
 *             longest branch, arguments as written.
 * en-US.json  TranslationCatalogue, generated from en-GB by the word list and tools/i18n/en-US-exceptions.json;
 *             every hash is the current en-GB hash. Never edited by hand. The exceptions stay keyed by the en-GB
 *             text they were reviewed for, so an English edit orphans its exception and the check fails (D4).
 * nl.json     TranslationCatalogue, written by the localizer.
 * A message in these files is the runtime's ICU subset: at most three brace levels (TOP in src/i18n/runtime.ts), so a select over a
 * plural with an argument in a branch is written as one key per select value; every plural and select has an
 * `other` branch; a plural branch is `=N` or one of the CLDR cardinal categories of its locale (Node's
 * Intl.PluralRules); no apostrophe stands before `{`, `}` or `#` (the runtime has no apostrophe quoting).
 * Every file is sorted by key, two-space JSON, LF, final newline (stable diffs; English stays visible in PRs).
 *
 * ── Source hash and stale translations ──
 * sourceHash(text) = the first SOURCE_HASH_CHARS lower-case hex characters of SHA-256 over the UTF-8 bytes of the
 * NFC form of the en-GB text. Each nl entry stores the hash of the English it was made from. An entry is stale
 * when its hash differs from sourceHash(current en-GB) and i18n/waivers.json holds no Waiver for that key and that
 * current hash. Stale fails the release check (check-i18n --strict and release.yml); the build still ships the
 * stored text, so users keep the old translation until it is confirmed, also for a change of meaning.
 * A Waiver confirms every locale of a key for one English revision; it is for typo and punctuation edits only,
 * with a reason. Confirming a translation rewrites its hash; the waiver can then be dropped.
 *
 * ── Renames ──
 * tools/i18n-rename.mjs <from> <to>: moves the en-GB, en-US and nl entries, their hashes and waivers, rewrites the
 * literal at every call site, and appends a Rename to i18n/renames.json. Across namespaces is allowed (a control
 * moved to another screen). renames.json is read by tools only (history for the exchange files); no src file and
 * no webpack rule may read it.
 *
 * ── Compiled tables (messages.gen.ts, unchanged shape: three '|' joined strings, en-GB, en-US, nl) ──
 * Order: by en-GB text, then key. Keys whose en-GB, en-US and nl texts are all equal share one entry (one index).
 * From i18n 2.0.0, a shipped en-US or nl cell equal to its en-GB cell is written empty; the runtime shows en-GB for
 * an empty cell, which is the same text. Source catalogues stay complete.
 *
 * ── Types (generated, git-ignored src/<folder>/i18n/keys.gen.ts) ──
 * `export interface Keys { 'ns.place.item': ArgsOf<message> }` with the English as the doc comment of each key, so
 * an editor shows it on hover (the dev preview). index.ts exports typed t / tx / m over Keys: an unknown key or a
 * missing or extra argument fails tsc (npm run typecheck, on the source before the loader). The loader's numeric
 * ids type-check through the MessageIndex overload, which check-i18n allows only in loader output (D1).
 *
 * ── Text ids ──
 * From i18n 2.0.0 the text-id path, tc() and the legacy count are gone. The runtime takes table indices only; vitest
 * runs the same rewrite as webpack (tools/i18n/vite-plugin.mjs) and tests render a key through tools/i18n/test-msg.ts.
 * A call whose first argument is not a literal key of its namespace is a check error (D1) and a build error.
 * Magic Card Utils has no build step: its generated mc-i18n-panel.js holds the key -> index map and exports t, tx and
 * locale already bound, so the panel calls tr('mcu-panel.place.item') and the shared runtime stays index-only.
 *
 * ── Exchange files (tools/i18n-flat.mjs, Weblate and Crowdin) ──
 * One flat file per locale under i18n/flat/ (card and Magic Card Utils namespaces together), ARB JSON (EXCHANGE_FORMAT):
 *   "@@locale": locale
 *   "<key>": the text in that locale (ICU message, plural branches included)
 *   "@<key>": { description: note, one "{name}: <vars description>" per argument (sorted), then "Max <max> characters.",
 *              source_text: English (translations only), "x-max-length": max, "x-source-hash": hash of the English,
 *              "x-stale": true when stale (translations only), "x-plural": the plural categories the message uses,
 *              "x-aliases": old keys from renames.json }. No placeholders object: argument notes live in description.
 * Keys from renames.json appear only in x-aliases, never as entries. `import` writes nl.json (and the en-US
 * exceptions) back; export then import of unchanged files gives byte-identical source files. `--check` exits 1 when
 * a committed exchange file differs from a fresh export. No dist file is read or written. Imported files are
 * untrusted: size-capped, keys checked against KEY_PATTERN and en-GB.json, no prototype keys, texts through D6.
 * Incoming "@<key>" objects (placeholders and x- values included) and "@@" names other than "@@locale" are ignored, not validated; import rebuilds them from en-GB.
 *
 * ── Error cases ──
 * key does not match KEY_PATTERN or its prefix is not the namespace -> check-i18n error (D1) and build error
 * | key not in en-GB.json -> build error (loader) and tsc error | en-GB entry without note or max, or vars not
 * matching the arguments -> check error (D8) | any locale text longer than max -> check error (D8) | stale entry
 * without a waiver -> release check error (D9) | waiver for an unknown key, an old hash or with an empty reason
 * -> check error (D9) | rename onto an existing key -> the rename tool refuses and writes nothing | a text-id
 * call -> check error (D1) and build error | message nested deeper than three brace levels, with an apostrophe before `{`, `}` or `#`, or with a plural
 * branch its locale does not have -> check error (D6) | exchange
 * file stale -> i18n-flat --check exit 1 | import of an unknown key or of a text that breaks D6 -> import refuses
 * and writes nothing.
 */

import type { MessageIndex, RichArgs } from './i18n';

export const I18N_KEYS_CONTRACT_VERSION = '1.1.0';

/** Namespace, then two to five kebab segments. The prefix check against the namespace is separate. */
export const KEY_PATTERN = /^[a-z][a-z0-9-]*(\.[a-z0-9]+(-[a-z0-9]+)*){2,5}$/;
export const KEY_MAX_CHARS = 96;
export const SOURCE_HASH_CHARS = 8;
export const NOTE_MIN_CHARS = 12;
export const EXCHANGE_FORMAT = 'arb';
export const EXCHANGE_DIR = 'i18n/flat';
export const EXCHANGE_MAX_BYTES = 4_194_304;
export const WAIVERS_FILE = 'i18n/waivers.json';
export const RENAMES_FILE = 'i18n/renames.json';

/** 'card-editor.design.background.label' */
export type MessageKey = string;
export type SourceHash = string;

export interface SourceEntry {
  text: string;
  note: string;
  max: number;
  vars?: Readonly<Record<string, string>>;
}
/** en-GB.json */
export type SourceCatalogueV2 = Readonly<Record<MessageKey, SourceEntry>>;

export interface TranslationEntry {
  text: string;
  hash: SourceHash;
}
/** en-US.json, nl.json */
export type TranslationCatalogue = Readonly<Record<MessageKey, TranslationEntry>>;

export interface Waiver {
  key: MessageKey;
  /** sourceHash of the en-GB text this waiver confirms. */
  hash: SourceHash;
  reason: string;
}
export interface Rename {
  from: MessageKey;
  to: MessageKey;
}

/** The "@<key>" attributes of an exchange entry. */
export interface ExchangeMeta {
  description: string;
  source_text?: string;
  'x-max-length': number;
  'x-source-hash': SourceHash;
  'x-stale'?: boolean;
  'x-plural'?: readonly string[];
  'x-aliases'?: readonly MessageKey[];
}

/** Argument object of a message: plain and select arguments are string | number, plural arguments number. */
export type KeyArgs = Readonly<Record<string, string | number>>;

/** What a namespace's index.ts exports over its generated Keys interface. */
export interface KeyedI18n<Keys extends { [K in keyof Keys]: KeyArgs }> {
  t<K extends keyof Keys & string>(key: K, ...args: keyof Keys[K] extends never ? [] : [Keys[K]]): string;
  tx<K extends keyof Keys & string>(key: K, args: Record<keyof Keys[K], unknown>): unknown[];
  m<K extends keyof Keys & string>(key: K): K;
  locale(): 'en-GB' | 'en-US' | 'nl';
}

/**
 * What a namespace's index.ts exports: KeyedI18n with the MessageIndex overloads the loader's output needs, and an
 * m() that checks its key and is typed as the table index the build turns the call into.
 * Write `i18nFor('<ns>', tables) as unknown as KeyedNamespace<Keys>`.
 */
export type KeyedNamespace<Keys extends { [K in keyof Keys]: KeyArgs }> = Pick<KeyedI18n<Keys>, 'locale'> & {
  t: KeyedI18n<Keys>['t'] & ((id: MessageIndex, args?: RichArgs) => string);
  tx: KeyedI18n<Keys>['tx'] & ((id: MessageIndex, args: RichArgs) => unknown[]);
  m: <K extends keyof Keys & string>(key: K) => MessageIndex;
};
