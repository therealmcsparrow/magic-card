import type { SavedThemePreset, SavedThemePresetInput } from './mcu-library';
import type { MessageId } from './i18n';

/*
 * Contract: theme editor host. Version 1.2.0.
 *
 * The chunk rule below allows `src/i18n/` (the runtime copy of this entry and the search fold; i18n contract 1.0.0). The editor speaks en-GB, en-US
 * and nl: namespace 'theme-editor' (tables in the entry) and 'theme-presets' (tables in the preset chunk), the language
 * comes from `hass` (`lang` on the host follows it). `ThemePreset.name` / `blurb` / `note` are MessageId (see below) and
 * theme-catalogue labels are MessageId too. The element API, the events and the backend adapter do not change.
 *
 * The editor is built on the ui-kit Module (ui-kit 1.0.0). The chunk rule below allows exactly two further sources:
 * `src/ui-kit/` and, from Core, `editorTokens` of `src/css/editor-system.ts` (tokens only). The entry compiles its own
 * copy of the kit parts it imports and calls defineUiKit() once; it may therefore also define the kit's `mc-ui-*`
 * elements, guarded (the kit's own rule). The editor keeps its fixed accent as an override of the accent tokens on
 * :host. Dialogs are <mc-ui-window variant="sheet">: a bottom sheet on phones, never full screen;
 * transient messages are <mc-ui-toast>; glyphs are the kit's MDI set. No change to the backend adapter,
 * the element API or the events. The panel's major-1 check passes.
 *
 * Optional ThemeBackend.presets (My theme presets, mcu-library 1.0.0), "Save as my preset", the
 * "My presets" picker group (theme-presets 1.2.0), and export / import through the transfer
 * chunk (preset-transfer 1.0.0) reached via window.MagicCard (no new import() in this entry).
 *
 * Implementation: module `theme-editor` (src/theme-editor/, webpack entry
 * dist/magic-card-theme-editor.js). Consumer: the Magic Card Utils panel's "Themes" tab
 * (magic-card-utils: custom_components/magic_card_utils/www/magic_card_utils_panel.js).
 * Backend it talks to (through the panel's adapter only): Contract theme-files 1.0.0
 * (magic-card-utils: custom_components/magic_card_utils/themes_contract.py) and the
 * theme_presets commands of mcu-library 1.0.0 (library_contract.py).
 *
 * Loading (same pattern as the animation studio entry):
 * - The entry is an ES module: load it with import() or <script type="module">, never a classic script.
 * - The panel resolves magic-card.js from `lovelace/resources`, loads it (_ensureMagicCard), then
 *   imports THEME_EDITOR_FILE from the same directory with the same query string.
 * - The entry defines THEME_EDITOR_TAG and its own `mcte-*` / `mc-theme-trial-bar` elements only,
 *   guarded by customElements.get. It never defines mc-color-picker / mc-unit-field: it asks
 *   magic-card.js for the editor chunk with `window.MagicCard.loadEditor()` (module-editor 1.0.0)
 *   and uses those elements by tag.
 * - Chunk rule: src/theme-editor/ has no runtime import outside src/theme-editor/, `lit`, `src/ui-kit/`, `src/i18n/` and
 *   `editorTokens` from src/css/editor-system.ts (plus `lit`; types from src/contracts/ are fine). Exactly one dynamic import(): the preset chunk, which
 *   holds the preset library and the create dialog's picker (THEME_PRESETS_CHUNK_FILE, section
 *   "theme presets" below). Its public path is set by src/theme-editor/public-path.ts,
 *   the entry's first import. magic-card.js is untouched (+0 B).
 *   The panel still imports one file; it never loads the preset chunk itself.
 * - (1.1.0) Export / import: after loadEditor() resolves true, `window.MagicCard.loadTransfer()`
 *   (module-editor 1.1.0) resolves the transfer chunk (preset-transfer 1.0.0); the editor uses its
 *   functions and <mc-transfer-panel> by tag, host 'theme-editor', kinds ['theme']. This is not an
 *   import() of this entry, so the one-import() rule holds and the entry bundles no YAML parser.
 *   When loadTransfer is missing (an older magic-card.js next to a newer entry cannot happen: same
 *   build) or rejects, Export / Import show the load error with "Try again".
 * - Version check: the panel reads `customElements.get(THEME_EDITOR_TAG).contractVersion` and
 *   accepts major 1. A missing file or element means "update Magic Card to 2026.10.06 or newer".
 *
 * (1.1.0) My theme presets:
 * - "Save as my preset" (editor view, next to Save; enabled when backend.presets exists): a dialog
 *   with name (seeded from the theme name), optional description (the blurb) and author; saves
 *   { id: slug of the name made unique against the list, name, description?, author?, doc } where
 *   doc is a deep copy of the draft ThemeDoc as it is (unsaved edits included, key order kept).
 *   Creating a theme from that preset yields a deep-equal ThemeDoc.
 * - The create dialog lists them first under "My presets" (picker group 'mine'), then the
 *   built-in groups. Each My preset has a "More" menu in the entry: Rename, Export, Delete
 *   (confirm). Built-in presets get Export too.
 * - Without backend.presets (older Magic Card Utils): no "My presets" group, "Save as my preset"
 *   hidden; Export still works; Import then opens a single theme item as a new unsaved theme
 *   ("Create from file") and refuses lists with "Update Magic Card Utils to keep theme presets".
 * - Import (with presets): every valid item is saved as a My preset after the clash choice; a
 *   single item also offers "Open as new theme". Imported values with external references and
 *   card-mod-* keys are KEPT and listed in the import warning (preset-transfer 1.0.0).
 *   The editor runs docErrors on an imported doc before it opens it, as for any doc.
 * - "Copy as HA theme" (Export menu): haThemeYaml(name, doc) to the clipboard.
 */

export const THEME_EDITOR_CONTRACT_VERSION = '1.2.0';
export const THEME_EDITOR_FILE = 'magic-card-theme-editor.js';
export const THEME_EDITOR_TAG = 'magic-card-theme-editor';
export const THEME_TRIAL_BAR_TAG = 'mc-theme-trial-bar';

// ── theme document (what HA reads from a theme file, one theme) ──

/** A theme variable value as HA accepts it (HA turns numbers into strings). */
export type ThemeValue = string | number;
export type ThemeMode = 'light' | 'dark';

/**
 * One theme: variable name (no leading `--`) -> value, plus the optional `modes` block.
 * Key order is the file's order and is kept on save. Unknown keys (card-mod-*, anything not in the
 * catalogue) are kept as they are.
 */
export interface ThemeDoc {
  [variable: string]: ThemeValue | ThemeModes | undefined;
  modes?: ThemeModes;
}
export interface ThemeModes {
  light?: Record<string, ThemeValue>;
  dark?: Record<string, ThemeValue>;
}

// ── backend adapter (the panel implements it on top of theme-files 1.0.0) ──

export type IncludeState = 'ok' | 'missing' | 'inline' | 'other_layout' | 'unknown';

export interface IncludeStatus {
  state: IncludeState;
  /** True when /config/themes exists. */
  dir_exists: boolean;
  /** The exact lines to add to configuration.yaml (shown when state is not 'ok'). */
  hint: string;
}

export type ReadOnlyReason =
  | 'subfolder'
  | 'multiple_themes'
  | 'name_mismatch'
  | 'invalid_name'
  | 'yaml_tags'
  | 'parse_error'
  | 'too_large'
  | 'symlink';

export interface ThemeFileEntry {
  /** Theme name (the top-level key). For unreadable files: the file stem. */
  name: string;
  /** Path relative to /config, e.g. "themes/my_theme.yaml". */
  file: string;
  editable: boolean;
  reason?: ReadOnlyReason;
  has_modes: boolean;
  var_count: number;
  /** File modification time (seconds since epoch), for conflict checks on save. */
  mtime: number;
}

export interface ThemeList {
  include: IncludeStatus;
  files: ThemeFileEntry[];
  /** Every theme name HA has loaded right now (any source), sorted. */
  loaded: string[];
}

export interface ThemeGetResult {
  name: string;
  file: string;
  editable: boolean;
  reason?: ReadOnlyReason;
  mtime: number;
  theme: ThemeDoc;
}

export interface ThemeSaveRequest {
  name: string;
  theme: ThemeDoc;
  /** Must be true to replace an existing file (the editor sets it when editing that file). */
  overwrite?: boolean;
  /** The mtime the editor loaded; a different mtime on disk answers `conflict`. */
  base_mtime?: number;
}

export interface ThemeSaveResult {
  name: string;
  file: string;
  mtime: number;
  /** True when HA's theme list holds `name` after reload_themes. */
  loaded: boolean;
}

/** Error codes (theme-files 1.0.0; 1.1.0 adds mcu-library's library_full). The adapter rejects with an Error carrying `code` and optional `errors`. */
export type ThemeErrorCode =
  | 'invalid_format'
  | 'not_found'
  | 'name_taken'
  | 'not_editable'
  | 'conflict'
  | 'themes_not_included'
  | 'too_large'
  | 'save_failed'
  | 'read_failed'
  | 'library_full'
  | 'unauthorized';

export interface ThemeBackendError extends Error {
  code: ThemeErrorCode | string;
  /** Field errors for invalid_format: path like "name", "theme.primary-color", "theme.modes.dark". */
  errors?: Array<{ path: string; message: string }>;
}

/** My theme presets, on mcu-library 1.0.0 theme_presets_* commands. */
export interface ThemePresetStore {
  list(): Promise<SavedThemePreset[]>;
  save(preset: SavedThemePresetInput, baseUpdatedAt?: string): Promise<SavedThemePreset>;
  remove(id: string): Promise<void>;
}

export interface ThemeBackend {
  list(): Promise<ThemeList>;
  get(name: string): Promise<ThemeGetResult>;
  save(req: ThemeSaveRequest): Promise<ThemeSaveResult>;
  remove(name: string): Promise<void>;
  /** (1.1.0) Present when Magic Card Utils stores theme presets; absent on older versions. */
  presets?: ThemePresetStore;
}

// ── element surface ──

/**
 * <magic-card-theme-editor> properties set by the panel:
 * - hass: the panel's hass (kept up to date on every change).
 * - narrow: the panel's narrow flag.
 * - backend: ThemeBackend (set before or right after connecting; the editor waits for it).
 * - selectedName: theme to open on connect (deep link `?theme=<name>`), or null.
 * The panel keeps one element across tab switches (attach/detach like the studio).
 *
 * Events (bubbling, composed):
 * - `mc-theme-select` detail { name: string | null }: the open theme changed; the panel mirrors it
 *   into `?theme=` with history.replaceState.
 *
 * Static: `contractVersion = THEME_EDITOR_CONTRACT_VERSION`.
 */
export interface ThemeEditorElement extends HTMLElement {
  hass: unknown;
  narrow: boolean;
  backend: ThemeBackend | undefined;
  selectedName: string | null;
}

/** Deep link query key and its pattern (theme-files name rule). */
export const THEME_QUERY_KEY = 'theme';
export const THEME_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;

// ── preview isolation and trial (rules the module implements; contract tests check them) ──

/**
 * resolveTheme(doc, mode): { ...doc without `modes`, ...doc.modes?.[mode] }. A mode block never
 * leaks into the other mode. Flat themes (no `modes`) resolve the same in both modes.
 *
 * deriveRgb(vars): for every resolved key whose value is a hex colour (#rgb, #rrggbb) and where
 * `rgb-<key>` is not set, add `rgb-<key>` = "r, g, b" (as HA's theme loader does).
 *
 * Preview isolation: the preview root sets every resolved variable inline with
 * style.setProperty('--' + key, String(value)). Keys the page's active theme sets but the edited
 * theme does not are reset on the preview root to HA's default value (read once from the document
 * stylesheets' `html` / `:root` rules), or `initial` when no default is known. Nothing is written
 * outside the editor's shadow root while previewing.
 *
 * Trial ("Try on dashboards", tab-local): one <style id="mc-theme-trial"> in
 * document.head with a single `html {}` rule whose declarations are set with
 * rule.style.setProperty(name, value, 'important') (never string-built CSS). Removed by Revert, by
 * Discard, by a successful save, or a page reload; never persisted. While it is active the
 * <mc-theme-trial-bar> sits in document.body with "Back to theme editor" and "Revert".
 */
export const PREVIEW_RULES_VERSION = '1.0.0';
export const TRIAL_STYLE_ID = 'mc-theme-trial';

// ── theme presets (Contract theme-presets 1.2.0) ──

/**
 * The preset chunk: every editor preset (25 original, 20 inspired, 12 genre: 57 in all) and the
 * create dialog's picker live in one lazy webpack chunk of the theme editor entry,
 * webpackChunkName THEME_PRESETS_CHUNK, emitted as dist/THEME_PRESETS_CHUNK_FILE (served with
 * `?v=<contenthash>`, next to the entry). The entry holds no preset data and no picker markup or
 * styles.
 *
 * The loader accepts any major 1. Group 'genre' ("Sci-fi & fantasy"
 * in the UI) and the optional `tags` field exist. Every preset keeps its id, name, blurb, note,
 * group, credit and resolved doc (deep-equal), whatever the source encoding.
 *
 * Group 'mine' ("My presets") comes first in the picker when the
 * user has any. Its items are SavedThemePresets mapped by the entry to ThemePreset (id, name,
 * blurb = description ?? '', group 'mine', doc) and handed to the picker in PickerView; the
 * built-in library never contains 'mine' (data rule) and its 57 presets are unchanged. Search
 * covers My presets by name and blurb. Swatch rule for 'mine': a swatch value that matches
 * EXTERNAL_REF_RE (preset-transfer 1.0.0) is never put into a style; the swatch falls back to
 * primary-background-color, then to no background, so opening the picker never contacts another
 * host. My presets get no contrast or data-rule check (they are the user's own).
 *
 * Provider: src/theme-editor/presets/chunk.ts, the chunk root. Its export surface is:
 * - `THEME_PRESET_LIBRARY: ThemePresetLibrary`, re-exported from presets/library.ts. library.ts has
 *   no runtime import at all (`import type` only), so Node can load it with type stripping
 *   (tools/theme-example-shots.mjs, the gallery script). It exports the resolved objects below,
 *   never the packed source form.
 * - `renderPicker`, `pickerStatus`, `pickerSelection` and `pickerStyles` (with the types PickerView and PickerEvents),
 *   re-exported from presets/picker.ts: a template function, the text for the dialog's status
 *   region, and a stylesheet; no custom element. The picker sits in the chunk because the entry has
 *   a byte cap and nothing of it is needed before the dialog opens.
 * The picker exports are internal to the theme-editor Module: loader and chunk ship from the same
 * build (the content hash ties them), so their shape is not versioned and may change with the
 * entry. Only THEME_PRESET_LIBRARY is checked at load time.
 * The chunk shares lit, icons.ts and <mcte-mode-switch> with the entry; it never bundles its own
 * lit copy and never defines a custom element.
 *
 * Consumer: src/theme-editor/presets/loader.ts, the module's only import(). loadPresetLibrary()
 * resolves to the chunk module (type PresetChunk). It starts on the first open of the create
 * dialog (never when the panel or editor opens) and is memoised while pending and once loaded. It
 * rejects when the import fails, when it has not settled after 8 s, or when
 * THEME_PRESET_LIBRARY.version is not major 1 or `presets` is not a non-empty array; every
 * rejection clears the memo so "Try again" calls import() again.
 * Retry: browsers cache a failed native import() per URL, so every import() call after the first
 * rewrites the chunk URL (`&r=<n>` appended to the `?v=` query through webpack's chunk-URL
 * function). webpack reads that URL only when it starts a new request, and it keeps the chunk's
 * in-flight request until that request fails. So:
 * - after a load error, Try again requests the chunk under a new URL;
 * - after the 8 s timeout, the stalled request is still in flight and webpack returns it again:
 *   Try again sends no new request, waits on the same one, and either gets the chunk when it
 *   arrives or times out again 8 s later.
 * The failure message says "If it keeps failing, reload the page"; a reload is the way out of a
 * request that never ends. Outside a webpack build (tests) no URL is rewritten.
 *
 * Picker (1.1.0): Show offers All, Original, Inspired by, Sci-fi & fantasy (ThemePresetGroupInfo
 * order, kept in the picker's GROUPS, each with its count); headings follow the same order and
 * labels. Search matches name, blurb, inspiredBy.name, tags and the group's search word
 * (ThemePresetGroupInfo.search). (1.2.0) "My presets" (search word "my") comes before Original in
 * Show and in the headings, and only when the list is not empty.
 *
 * Data rules (tests/theme-presets.contract.test.ts):
 * - `id` matches /^[a-z0-9]+(-[a-z0-9]+)*$/ and is unique; `name` is unique (case-insensitive).
 *   The 5 starter ids stay: paper, midnight-oled, ember, contrast, frost (group 'original', same
 *   values as 2026.10.06). All 45 presets of 1.0.0 stay as 2026.10.08 shipped them (fixture).
 *   Ids are never renamed; a rename needs an alias and a CHANGELOG line.
 * - `group` 'inspired' requires `inspiredBy`; 'original' and 'genre' must not have it. (1.2.0)
 *   No built-in preset has group 'mine'.
 * - `group` 'genre' requires `tags` whose first word is 'sci-fi' or 'fantasy'. No preset names a
 *   franchise or an in-universe term: id, name, blurb, note, tags and keywords (when a preset or
 *   its source file carries them) hold no term from the blocked list
 *   (tests/fixtures/franchise-blocked-terms.json; its `match` field is the
 *   rule of record). The check is word-level: field and term are lowercased and split into words
 *   on /[^a-z0-9]+/. A term hits when its words appear consecutively in the field's words, the
 *   last one matching as a prefix (dune hits dunes), or when the term's words joined (bladerunner)
 *   equal or prefix one field word. It is not a substring check: "strong" (tron) and "visit hours"
 *   (sith) pass. It runs over every preset, not only genre ones. (The rule covers built-ins only;
 *   users' own presets and imported files are their content.)
 * - `tags`: lowercase words split by single spaces, at most 40 characters.
 * - `doc` is a ThemeDoc with modes.light and modes.dark. Each mode sets primary-color,
 *   accent-color, primary-background-color, card-background-color, primary-text-color,
 *   secondary-text-color, divider-color, text-primary-color, app-header-text-color, error-color,
 *   warning-color, info-color, success-color. Other keys are free (lovelace-background,
 *   ha-card-border-radius, ha-card-backdrop-filter, ...). The model's docErrors(doc) is empty.
 * - Contrast >= 4.5:1 in every mode: primary and secondary text on the card (translucent cards
 *   over every gradient stop) and on primary-background-color; text-primary-color and
 *   app-header-text-color on primary-color; the four state colours and accent-color on the card.
 * - Order in `presets` is display order within a group; groups are contiguous, in
 *   ThemePresetGroupInfo order (original, inspired, genre).
 */
export const THEME_PRESETS_VERSION = '1.2.0';
export const THEME_PRESETS_CHUNK = 'theme-presets';
export const THEME_PRESETS_CHUNK_FILE = 'magic-card-theme-presets.js';

export type ThemePresetGroup = 'mine' | 'original' | 'inspired' | 'genre';

/**
 * Group order, Show labels, headings and search words. Type-level here; the picker keeps its own
 * copy of the values (src/contracts/ is types plus constants and the chunk must not pull in more).
 * (1.2.0) mine: "My presets" / search "my"; original: "Original" / search "original"; inspired:
 * "Inspired by" / "inspired by"; genre: "Sci-fi & fantasy" / "genre" (the words sci-fi and fantasy
 * come from each preset's tags, so "fantasy" finds only the fantasy ones).
 */
export interface ThemePresetGroupInfo {
  id: ThemePresetGroup;
  label: string;
  search: string;
}

/** Credit for a palette-inspired preset. Values are our own, tuned for contrast; the name credits the source. */
export interface ThemePresetCredit {
  /** Palette name as its authors write it, e.g. "Nord", "Catppuccin Mocha". */
  name: string;
  /** Palette authors, e.g. "Arctic Ice Studio". Shown in the docs gallery. */
  author?: string;
  /** Palette home page (https only). Docs gallery link; the editor shows plain text, no link. */
  url?: string;
}

export interface ThemePreset {
  id: string;
  /** Display name and the seed of the new theme's file name. A built-in preset holds an m() id (namespace 'theme-presets): render it with t() (the chunk's presetTitle()). A My preset (group 'mine') holds the user's own text. */
  name: MessageId;
  /** One short line under the name (an m() id for a built-in preset, the user's text for a My preset). */
  blurb: MessageId;
  /** Optional extra line (cost or behaviour to know before picking it); an m() id. */
  note?: MessageId;
  group: ThemePresetGroup;
  inspiredBy?: ThemePresetCredit;
  /** 1.1.0: extra search words, lowercase, space separated. Required for 'genre' (first word sci-fi or fantasy). Never shown, never a franchise term. */
  tags?: string;
  doc: ThemeDoc;
}

export interface ThemePresetLibrary {
  /** THEME_PRESETS_VERSION of the chunk that was built. */
  version: string;
  presets: readonly ThemePreset[];
}
