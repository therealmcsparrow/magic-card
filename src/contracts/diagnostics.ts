// Contract: diagnostics. Version 1.0.0 (DIAGNOSTICS_CONTRACT). A read-only snapshot of the facts the setup block prints
// (setup-block 1.0.0). The field list below is the schema and the privacy allow-list in one: a fact with no field here never
// reaches the block. It has no write operation. Provider: src/diagnostics/snapshot.ts, a pure function (no DOM, no i18n, no
// timers). Consumer: the card editor's Copy my setup button (src/editor/setup-copy/), which builds the SnapshotInput from the page.

export const DIAGNOSTICS_CONTRACT = '1.0.0';

/** Config keys whose string values are the looks, printed as `key=value`. Read at any depth of the card config. */
export const LOOK_KEYS = ['line_style', 'theme', 'track_style'] as const;
export type LookKey = (typeof LOOK_KEYS)[number];

/** Config keys whose string values are the fonts, printed as written. Read at any depth of the card config. */
export const FONT_KEYS = ['font_family', 'label_font_family', 'tab_font_family'] as const;
export type FontKey = (typeof FONT_KEYS)[number];

/** Nodes the config walk visits at most (objects and arrays together); the rest of a larger config is not read. */
export const CONFIG_WALK_BUDGET = 5000;

/**
 * Version text that may be printed: the card's VERSION and the Utils version. Anything else (longer, spaces, other
 * characters, not a string) counts as missing, so free text from a provider can never reach the block.
 */
export const VERSION_RE = /^[0-9A-Za-z][0-9A-Za-z.+-]{0,31}$/;

/** The Utils provider API this Contract reads (mcu-library PROVIDER_API_VERSION). Another value counts as an unknown provider. */
export const UTILS_PROVIDER_API = 1;

/** A chunk as the page sees it. pending: needed but not installed yet; other-release: the chunk came from another build. */
export type ChunkState = 'loaded' | 'pending' | 'failed' | 'other-release';

export interface ChunkEntry {
  readonly name: string;
  readonly state: ChunkState;
}

export interface LookEntry {
  readonly key: LookKey;
  readonly name: string;
}

/** installed false: no `window.magicCardUtils`. version null: installed, but the version is missing, invalid or the provider API is unknown. */
export type UtilsInfo = { readonly installed: false } | { readonly installed: true; readonly version: string | null };

export interface SetupSnapshot {
  /** VERSION of this magic-card.js, or null when it fails VERSION_RE. */
  readonly card: string | null;
  readonly utils: UtilsInfo;
  /** One entry per distinct key and name, sorted by `key=name` in code-unit order. */
  readonly looks: readonly LookEntry[];
  /** Distinct names, sorted in code-unit order. */
  readonly fonts: readonly string[];
  /** Card chunks this config needs at first paint, sorted by name. */
  readonly firstPaint: readonly ChunkEntry[];
  /** On-demand chunks this page has installed or failed (never pending ones), sorted by name. */
  readonly onClick: readonly ChunkEntry[];
  /** window.isSecureContext: secure or not-secure; null when the page did not say. */
  readonly transport: 'secure' | 'not-secure' | null;
}

/** The allow-list: every SetupSnapshot key, in block order. A contract test fails when a snapshot carries any other key. */
export const SNAPSHOT_FIELDS = ['card', 'utils', 'looks', 'fonts', 'firstPaint', 'onClick', 'transport'] as const satisfies readonly (keyof SetupSnapshot)[];

/** What the editor hands the pure builder, read from the live page at click time. */
export interface SnapshotInput {
  /** The card config being edited. */
  readonly config: unknown;
  /** VERSION from src/version.ts. */
  readonly cardVersion: unknown;
  /** `window.magicCardUtils` as found (undefined when absent). Only `apiVersion` and `settings.version` are read. */
  readonly utils: unknown;
  /** The needs table (lazy-module LAZY_FEATURES), as chunk name -> check. */
  readonly needs: Readonly<Record<string, (config: unknown) => boolean>>;
  /** Names of the on-demand chunks (lazy-module OnDemandChunkName) the page has. */
  readonly onDemand: readonly string[];
  /** State of one chunk on this page; idle when it is neither installed nor failed. */
  chunkState(name: string): ChunkState | 'idle';
  /** window.isSecureContext. */
  readonly secure: boolean | undefined;
}

/**
 * Rules of the provider. It never throws: a getter or check that throws counts as missing for that value only.
 * - card: cardVersion when it is a string that passes VERSION_RE, else null.
 * - utils: utils not an object -> installed false. An object whose apiVersion is not UTILS_PROVIDER_API -> version null. Else
 *   settings.version when it passes VERSION_RE, else null.
 * - looks and fonts: walk the config (objects and arrays, at most CONFIG_WALK_BUDGET nodes); for each own LOOK_KEYS or FONT_KEYS
 *   key with a string value, replace every character in U+0000-U+001F and U+007F-U+009F with one space, trim, drop empty
 *   results, then de-duplicate and sort. Names are otherwise kept exactly as written.
 * - firstPaint: every needs entry whose check returns true; idle maps to pending.
 * - onClick: every onDemand name whose state is not idle.
 * - transport: secure true -> secure, false -> not-secure, else null.
 * No other value of the config, the page, hass or Utils is read: entity ids, URLs, host names, dashboard, user and area names
 * have no field.
 */
export type BuildSnapshot = (input: SnapshotInput) => SetupSnapshot;
