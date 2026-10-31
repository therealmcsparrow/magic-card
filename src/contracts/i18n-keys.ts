// Contract: i18n-keys. Version 1.1.0. Extends i18n (src/contracts/i18n.ts 2.0.0) with domain keys; text is
// addressed by key only.

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
