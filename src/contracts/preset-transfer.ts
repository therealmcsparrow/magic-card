import type { AnimationDoc } from '../anim-studio/model';
import type { CustomShapeOptions } from './custom-shape';
import type { ThemeDoc } from './theme-editor';

/*
 * Contract: preset files (export / import) and the transfer chunk. Version 1.0.0 (Architect-owned).
 * ADR 0022. Epic C of svg-and-shape-editors (brief addendum 21-product-manager.md, CEO 2026-10-18).
 *
 * ── Envelope (the file format; public once released, semver from then on) ──
 * One file holds one kind and one or more items. YAML or JSON, same object:
 *   magic_card_export: "1.0"       format marker + "major.minor" (TRANSFER_FORMAT)
 *   kind: animation | theme | shape | icon
 *   generator: "Magic Card 2026.10.11"   optional, informative only, never read back
 *   items:
 *     - id: sunrise                 LIBRARY_ID_RE (animations: ANIMATION_ID_RE, the same pattern)
 *       name: Sunrise               1..80 chars after trim
 *       author: Ruben               optional, 1..AUTHOR_MAX_CHARS
 *       description: ...            optional, 1..DESCRIPTION_MAX_CHARS
 *       keywords: [sun, morning]    optional, icons only (<= 10 words of 1..32 chars)
 *       data: { ... }               per kind, below
 * Writing: always `items` (a list, even for one item), keys in the order above, YAML through
 * toYaml (noRefs: no anchors or aliases are ever written), JSON with 2-space indent. No timestamps,
 * no user ids, no hostnames (nothing personal goes into a file except the optional author the user
 * types).
 * Reading: `items` (list) or `item` (one object). Major > TRANSFER_MAJOR -> refused, nothing saved,
 * message names the file's version ("This file needs a newer Magic Card (format 2.x)"). Same major,
 * higher minor -> read; unknown keys dropped and listed. Unknown `kind` -> refused with the kind
 * named. More than MAX_IMPORT_ITEMS items -> refused.
 *
 * Per-kind `data` (item id and name are authoritative; copies of them inside data are overwritten):
 * - animation: an AnimationDoc without id and name. Read with validateAnimationDoc (strict, as the
 *   studio's import) plus validateSim for particles; an invalid item is refused whole and listed,
 *   the rest import. Built-in preset ids (ANIMATION_PRESETS) are never exported (everyone has
 *   them); catalogue animations are documents and export like any other. A sequence exported from
 *   the studio or the library takes the `custom:` documents its steps use along (listed in the
 *   export summary). On import, ids renamed by a clash are followed in sequence steps; a step
 *   naming a custom id that is in neither the file nor the target is a warning, not an error.
 *   author / description are not stored for animations (AnimationDoc is Core and has no such
 *   fields); the summary says so. Re-export writes neither.
 * - theme: a ThemeDoc (flat vars and/or modes.light / modes.dark). description doubles as the
 *   picker blurb. Rules: every key matches THEME_VAR_RE or is `modes`; `modes` holds only light /
 *   dark objects; values are strings of at most THEME_VALUE_MAX_CHARS or finite numbers (booleans,
 *   null, objects and lists are dropped and listed); compact JSON <= THEME_PRESET_MAX_BYTES. The
 *   theme editor runs its own docErrors on the result before it saves or opens it (the transfer
 *   chunk never imports src/theme-editor/**).
 *   CEO 2026-10-18: values that reference another host (EXTERNAL_REF_RE) and card-mod-* keys
 *   (CARD_MOD_KEY_RE, in the flat part or a mode) are KEPT, not stripped. The import summary
 *   shows a warning that lists every such variable (with mode) and every host name, BEFORE the
 *   user confirms; the confirm button reads "Import anyway" while that warning is shown. Values
 *   with a path on the sharer's own Home Assistant (url(/local/...)) get an info line ("may not
 *   exist on your system"). Nothing in the import path fetches anything.
 * - shape: Omit<CustomShapeOptions, 'ref'>, keys in SHAPE_KEYS only (others dropped and listed),
 *   points <= MAX_SHAPE_POINTS, compact JSON <= SHAPE_MAX_BYTES (mcu-library). Value checks are
 *   the custom-shape normaliser's (invalid values dropped one by one and listed).
 * - icon: { svg, path?, secondary_path?, view_box? }. svg goes through sanitizeSvg; everything it
 *   removes (script, <use>, external href, event attributes, unknown elements) is listed as a
 *   warning (the PM rule: icons are stripped, unlike themes). svg <= ICON_MAX_BYTES after
 *   sanitising. path / secondary_path must match the mcu-library path pattern, else dropped and
 *   listed; view_box four finite numbers, else taken from the sanitised svg. A missing or dropped
 *   path is saved as '' with the note "Open it in the SVG editor and save to show it in Home
 *   Assistant's own cards" (the HA form is computed by the SVG editor, not by this chunk).
 *
 * ── Other inputs read (C5) ──
 * Detection order on the parsed value: (1) object with `magic_card_export` -> envelope; (2) the
 * studio's 2026.10.x export: a list of AnimationDocs, one AnimationDoc, an id-keyed map of them, or
 * a card config with `custom_animations` -> kind animation (ids and names from the docs); (3) text
 * whose first element is <svg (after an optional XML prolog / comments; or a .svg file name) ->
 * kind icon, one item, id = slug of the file name (or "icon"), name = file name; (4) a plain Home
 * Assistant theme file: a top-level map whose values are all objects of theme variables
 * (THEME_VAR_RE keys or `modes`) -> kind theme, one item per top-level key (id = slug, name =
 * key). Anything else: "This is not a Magic Card preset file."
 * A host passes the kinds it accepts (HOST_KINDS); another kind is refused with where to import it
 * ("Theme files are imported in Magic Card Utils > Themes").
 *
 * ── Safe parsing (untrusted input, C6) ──
 * 1. Files over MAX_IMPORT_BYTES are refused before reading (File.size); pasted text over
 *    MAX_IMPORT_CHARS is refused before parsing.
 * 2. Trimmed text starting with { or [ -> JSON.parse first; on a JSON error, YAML below.
 * 3. YAML: js-yaml load (one document; a second document is an error) with SAFE_YAML_SCHEMA =
 *    CORE_SCHEMA only: no merge key `<<`, no timestamps, no binary, no custom tags (any !tag is a
 *    parse error); duplicate keys are an error. Never src/utils/yaml-utils fromYaml (it adds the
 *    merge tag). Parser exceptions (RangeError from deep nesting included) -> "Not valid YAML".
 * 4. Bounded copy: the parsed value is walked once into a fresh JSON-only value. Every object,
 *    list and scalar visit counts, and a shared object (a YAML alias) counts again at every place
 *    it is used, so alias expansion is measured, not trusted. Refused when visits exceed
 *    MAX_IMPORT_NODES, depth exceeds MAX_IMPORT_DEPTH, re-visits of shared objects exceed
 *    MAX_YAML_ALIASES, or summed string length exceeds MAX_IMPORT_EXPANDED_CHARS. Keys __proto__,
 *    constructor and prototype are dropped; non-finite numbers are refused. The walk stops at the
 *    first limit hit (it never builds the expanded value).
 * 5. Only the copy reaches the per-kind validators. Budget: steps 1-4 refuse a 2 MB file or a
 *    10,000-alias bomb in under IMPORT_REFUSE_MS on desktop Chrome with 4x CPU throttle, and a
 *    valid 1 MB file parses without a long task over 200 ms on the same setup (QA measures).
 *
 * ── Clashes and targets ──
 * Target per host: with Magic Card Utils, the library store of the kind (mcu-library 1.0.0 r3;
 * animations through the existing animation commands). Without it (card editor, shape editor, SVG
 * editor only): animation / shape / icon items become inline copies on the card being edited
 * (custom_animations / custom_shapes / custom_icons[id]); themes need Magic Card Utils anyway.
 * An item whose id exists in the target is a clash. When any item clashes, the summary lists them
 * and asks once: "Replace" (overwrite, no base_updated_at) or "Keep both" (the imported ones get
 * uniqueId(id): id-2, id-3, ...). Cancel saves nothing. A library cap that is reached imports what
 * fits and lists the rest.
 *
 * ── Export ──
 * From: the library view (selected items of one kind), the animation studio (selected docs), the
 * theme editor (the open theme, a built-in preset or a My preset), the shape editor (the shape)
 * and the SVG editor (the icon). Format choice YAML (default) or JSON; "Download" (Blob + a[download],
 * object URL revoked) and "Copy" (clipboard; fallback: a selected read-only text area). Copy is
 * always offered (companion apps may block downloads). File name: magic-card-<kind>-<id>.<ext>
 * for one item, magic-card-<kind>s-<n>.<ext> for more.
 * Themes also get "Copy as HA theme": `<name>:` + the ThemeDoc as YAML, nothing else.
 * Round trip: export as YAML or JSON then import -> deep-equal items (ids kept, or renamed only by
 * Keep both). The contract test runs it for all four kinds and both formats.
 *
 * ── The transfer chunk (where the code lives) ──
 * One lazy chunk, webpackChunkName TRANSFER_CHUNK -> dist/TRANSFER_CHUNK_FILE, imported only by
 * src/editor/transfer-loader.ts in the card-editor chunk. Every host reaches it through the
 * magic-card.js runtime, so js-yaml, validateAnimationDoc, sanitizeSvg and the custom-shape
 * normaliser come from the parents (magic-card.js + magic-card-editor.js) and are never copied:
 * - card editor, shape editor, SVG editor: loadTransfer() from transfer-loader.ts.
 * - theme editor and animation studio entries: await window.MagicCard.loadEditor(), then
 *   window.MagicCard.loadTransfer() (module-editor 1.1.0, set by the editor chunk). Neither entry
 *   gets a new import(): the theme editor's one-import() rule stays.
 * magic-card.js grows 0 B (no runtime parsing of preset files; CEO 2026-10-18 option a: no theme
 * copy in cards). Dashboards that open no editor never fetch the chunk.
 * Loader rules (as presets/loader.ts): memoised while pending and once loaded; rejects on import
 * failure, after LOAD_TIMEOUT_MS, or when TRANSFER_CONTRACT_VERSION is not major 1; a rejection
 * clears the memo so "Try again" retries.
 * Size: CAPS entry = measured + 5 %, rounded up to 1 KiB; hard ceiling TRANSFER_CHUNK_CEILING. Over
 * the ceiling means a parent module got copied in (check js-yaml first) or the library view grew:
 * report, do not raise.
 *
 * ── Accessibility (WCAG 2.2 AA, our bar) ──
 * The file control is a real <input type=file> behind a labelled button ("Choose a file"), accept
 * ".yaml,.yml,.json,.svg" (per host); the paste box is a labelled <textarea>; "Read" runs the
 * parse. The summary sits in a role=status live region (polite) and its heading takes focus;
 * refusals use role=alert. The clash choice is a radio group. Everything works by keyboard alone,
 * no drag, and reflows at 320 CSS px (200 % zoom). Escape closes the transfer panel (the hosts'
 * existing Escape guards apply).
 */

export const TRANSFER_CONTRACT_VERSION = '1.0.0';
/** File format marker value written by this version. */
export const TRANSFER_FORMAT = '1.0';
export const TRANSFER_MAJOR = 1;
export const TRANSFER_MARKER_KEY = 'magic_card_export';

export const TRANSFER_CHUNK = 'transfer';
export const TRANSFER_CHUNK_FILE = 'magic-card-transfer.js';
/** Hard ceiling of the transfer chunk (codec, safe parse, validators, transfer panel, library view). */
export const TRANSFER_CHUNK_CEILING = 28 * 1024;
export const LOAD_TIMEOUT_MS = 8000;

export const MAX_IMPORT_BYTES = 1024 * 1024;
export const MAX_IMPORT_CHARS = 1024 * 1024;
export const MAX_IMPORT_NODES = 100_000;
export const MAX_IMPORT_DEPTH = 64;
export const MAX_YAML_ALIASES = 256;
export const MAX_IMPORT_EXPANDED_CHARS = 2 * 1024 * 1024;
export const MAX_IMPORT_ITEMS = 200;
export const IMPORT_REFUSE_MS = 1000;

export const AUTHOR_MAX_CHARS = 80;
export const DESCRIPTION_MAX_CHARS = 280;
export const THEME_VALUE_MAX_CHARS = 1024;
/** Same number as mcu-library THEME_PRESET_MAX_BYTES. */
export const THEME_PRESET_MAX_BYTES = 32 * 1024;

/**
 * A theme value that makes the browser contact another host: an absolute or protocol-relative URL
 * anywhere in the value (url(), image-set(), @import or a bare string). data: and url(#id) do not
 * match. Matching values are kept and listed (CEO 2026-10-18).
 */
export const EXTERNAL_REF_RE = /(?:\b[a-z][a-z0-9+.-]*:\/\/|(?:^|[\s,("'])\/\/[^\s/)"'])/i;
/** A value with a path on the sharer's own Home Assistant (info line only). */
export const LOCAL_PATH_RE = /url\(\s*["']?\/(?!\/)/i;
export const CARD_MOD_KEY_RE = /^card-mod-/i;

export type TransferKind = 'animation' | 'theme' | 'shape' | 'icon';
export type TransferFormat = 'yaml' | 'json';
export type TransferHost = 'card-editor' | 'shape-editor' | 'svg-editor' | 'animation-studio' | 'theme-editor';

/** Kinds each host accepts on import (and offers on export). */
export const HOST_KINDS: Readonly<Record<TransferHost, readonly TransferKind[]>> = {
  'card-editor': ['animation', 'shape', 'icon'],
  'shape-editor': ['shape'],
  'svg-editor': ['icon'],
  'animation-studio': ['animation'],
  'theme-editor': ['theme'],
};

export interface IconData {
  svg: string;
  path?: string;
  secondary_path?: string;
  view_box?: string;
}

export interface TransferDataByKind {
  animation: Omit<AnimationDoc, 'id' | 'name'>;
  theme: ThemeDoc;
  shape: Omit<CustomShapeOptions, 'ref'>;
  icon: IconData;
}

export interface TransferItem<K extends TransferKind = TransferKind> {
  id: string;
  name: string;
  author?: string;
  description?: string;
  /** Icons only. */
  keywords?: string[];
  data: TransferDataByKind[K];
}

export interface TransferEnvelope<K extends TransferKind = TransferKind> {
  magic_card_export: string;
  kind: K;
  generator?: string;
  items: TransferItem<K>[];
}

/** Where the parsed value came from (C5). */
export type TransferSource = 'envelope' | 'studio-list' | 'svg' | 'ha-theme';

export type TransferNoteCode =
  | 'dropped_key'
  | 'dropped_value'
  | 'invalid_item'
  | 'svg_removed'
  | 'path_missing'
  | 'external_ref'
  | 'card_mod'
  | 'local_path'
  | 'missing_step_ref'
  | 'not_stored'
  | 'over_cap';

export interface TransferNote {
  code: TransferNoteCode;
  /** Item index in the file (-1: the file). */
  item: number;
  /** Field path, e.g. "data.modes.dark.lovelace-background". */
  path: string;
  message: string;
  /** external_ref: the host names found. */
  hosts?: string[];
}

export type TransferRefusal =
  | 'too_large'
  | 'not_parseable'
  | 'limits'
  | 'newer_format'
  | 'unknown_kind'
  | 'wrong_kind'
  | 'not_a_preset_file'
  | 'too_many_items'
  | 'no_valid_items';

export type ParseResult<K extends TransferKind = TransferKind> =
  | { ok: true; kind: K; source: TransferSource; items: TransferItem<K>[]; notes: TransferNote[] }
  | { ok: false; refusal: TransferRefusal; message: string };

export type ClashChoice = 'replace' | 'keep-both';

/** What window.MagicCard.loadTransfer() / loadTransfer() resolves to. */
export interface TransferChunk {
  version: typeof TRANSFER_CONTRACT_VERSION | string;
  /** Pure and synchronous: steps 1-5 above plus per-kind validation. */
  parseTransfer(text: string, opts: { accept: readonly TransferKind[]; fileName?: string }): ParseResult;
  serialiseTransfer<K extends TransferKind>(kind: K, items: TransferItem<K>[], format: TransferFormat): string;
  /** "Copy as HA theme". */
  haThemeYaml(name: string, doc: ThemeDoc): string;
  /** Ids after the clash choice; sequence steps follow renamed animation ids. */
  resolveClashes<K extends TransferKind>(items: TransferItem<K>[], taken: (id: string) => boolean, choice: ClashChoice): TransferItem<K>[];
  /** Custom element tags the chunk defines (customElements.get guarded). */
  tags: { panel: 'mc-transfer-panel'; library: 'mc-library-view' };
}

/**
 * <mc-transfer-panel> (all hosts): properties `host: TransferHost`, `mode: 'import' | 'export'`,
 * `exportItems?: { kind, items }`, `taken(kind, id): boolean`, `hasLibrary: boolean`.
 * Events (bubbling, composed): `mc-transfer-import` detail { kind, items, choice } after the user
 * confirms (the host saves; the panel never writes); `mc-transfer-close`.
 * <mc-library-view> (card editor): kinds animation / shape / icon, sources "Magic Card Utils"
 * (animations from animationLibrary + the existing animation commands, icons and shapes from the
 * mcu-library commands) and "This card" (the card's custom_* copies). List, search (name,
 * keywords), rename, delete (with confirm), export, import. Rename and delete need admin (the
 * commands say so); non-admin users see the list read-only.
 */
