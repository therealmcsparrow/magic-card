import type { SavedThemePreset, SavedThemePresetInput } from './mcu-library';
import type { MessageIndex } from './i18n';

// Contract: theme editor host. Version 1.7.0. The chunk may import `src/i18n/` (runtime message copy and search fold),
// `src/ui-kit/` and `src/utils/google-fonts` (the Google fonts gate and lazy loader).

export const THEME_EDITOR_CONTRACT_VERSION = '1.7.0';
/**
 * (1.7.0) The entry ships with Magic Card Utils and loads from its static path; its chunks load from next to it, never
 * from the card's path. It feature-detects loadEditor and loadTransfer on window.MagicCard and fails cleanly without them.
 */
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

// ── backend adapter (the panel implements it on top of theme-files; 1.6.0 adds the theme-files 2.0.0 storage fields) ──

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
  | 'symlink'
  /** (1.5.0, theme-files 1.1.0) The file does not start with the editor's header: the editor did not write it. Copy it under a new name. */
  | 'not_own'
  /** (1.5.0, theme-files 1.1.0 only) The Theme files option of Magic Card Utils is off. theme-files 2.0.0 no longer sends it. */
  | 'writes_off';

/**
 * (1.6.0, theme-files 2.0.0) Where a theme stands in /config/themes. For a stored theme: no file yet (`none`), the
 * file Magic Card wrote matches (`current`) or is older (`outdated`), or a file Magic Card did not write has the name
 * (`foreign`: it can be saved but never published). For a file-only entry: Magic Card's own file (`current`) or a
 * read-only one (`foreign`).
 */
export type FolderState = 'none' | 'current' | 'outdated' | 'foreign';

export interface ThemeFileEntry {
  /** Theme name (the top-level key). For unreadable files: the file stem. */
  name: string;
  /** Path relative to /config, e.g. "themes/my_theme.yaml". */
  file: string;
  editable: boolean;
  reason?: ReadOnlyReason;
  has_modes: boolean;
  var_count: number;
  /** File modification time (seconds since epoch), for conflict checks on save. For a stored theme: the time of its last save. */
  mtime: number;
  /** (1.6.0, theme-files 2.0.0) True when Magic Card Utils keeps the theme in its storage. */
  stored?: boolean;
  /** (1.6.0, theme-files 2.0.0) Where the theme stands in /config/themes. */
  folder?: FolderState;
}

export interface ThemeList {
  include: IncludeStatus;
  files: ThemeFileEntry[];
  /** Every theme name HA has loaded right now (any source), sorted. */
  loaded: string[];
  /**
   * (1.5.0, theme-files 1.1.0) False while the Theme files option of Magic Card Utils is off: save and remove
   * answer `theme_files_off`. Absent from an older Magic Card Utils, which counts as true.
   */
  writes_enabled?: boolean;
  /**
   * (1.6.0, theme-files 2.0.0) True when themes are saved in Magic Card Utils storage: save needs neither the option
   * nor the include lines, and only `publish` writes /config/themes. Absent from an older Magic Card Utils, where every
   * save writes the file.
   */
  storage?: boolean;
}

export interface ThemeGetResult {
  name: string;
  file: string;
  editable: boolean;
  reason?: ReadOnlyReason;
  mtime: number;
  /** (1.6.0, theme-files 2.0.0) True for the stored copy; false when only the file was read. */
  stored?: boolean;
  /** (1.6.0, theme-files 2.0.0) Where the theme stands in /config/themes. */
  folder?: FolderState;
  theme: ThemeDoc;
}

export interface ThemeSaveRequest {
  name: string;
  theme: ThemeDoc;
  /** Must be true to replace an existing file (the editor sets it when editing that file). */
  overwrite?: boolean;
  /** The mtime the editor loaded; a different mtime on disk answers `conflict`. */
  base_mtime?: number;
  /** (1.6.0, theme-files 2.0.0) Also write /config/themes/<name>.yaml. Needs the folder option and the include lines. */
  publish?: boolean;
}

export interface ThemeSaveResult {
  name: string;
  file: string;
  mtime: number;
  /** True when HA's theme list holds `name` after reload_themes. */
  loaded: boolean;
  /** (1.6.0, theme-files 2.0.0) Always true: the theme is in Magic Card Utils storage. */
  stored?: boolean;
  /** (1.6.0, theme-files 2.0.0) True when this save wrote the file. */
  published?: boolean;
  /** (1.6.0, theme-files 2.0.0) Where the theme stands in /config/themes after the save. */
  folder?: FolderState;
}

/** (1.6.0) Options for ThemeBackend.remove. */
export interface ThemeRemoveOptions {
  /** theme-files 2.0.0: also delete /config/themes/<name>.yaml (Magic Card's own file only; needs the folder option). */
  file?: boolean;
}

/** Error codes (theme-files 1.0.0; 1.1.0 adds mcu-library's library_full; theme-files 1.1.0 adds theme_files_off). The adapter rejects with an Error carrying `code` and optional `errors`. */
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
  | 'theme_files_off'
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
  /** theme-files 2.0.0: removes the stored theme, and the file with `opts.file`. Older Utils: removes the file. */
  remove(name: string, opts?: ThemeRemoveOptions): Promise<void>;
  /** (1.1.0) Present when Magic Card Utils stores theme presets; absent on older versions. */
  presets?: ThemePresetStore;
}

// ── element surface ──

/**
 * <magic-card-theme-editor> properties set by the panel: - hass: the panel's hass (kept up to date on every
 * change). - narrow: the panel's narrow flag. - backend: ThemeBackend (set before or right after connecting; the
 * editor waits for it). - selectedName: theme to open on connect (deep link `?theme=<name>`), or null.
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
 * resolveTheme(doc, mode): { ...doc without `modes`, ...doc.modes?.[mode] }; a mode block never leaks into the
 * other mode. The preview resolves the draft over HA's base for its mode (light: page defaults; dark:
 * HA_DARK_DEFAULTS), sets `color-scheme` and gives sample cards a hass whose `themes.darkMode` follows it.
 * A theme without `modes` is previewed on the base of the live profile mode, read on every render (1.2.0).
 */
export const PREVIEW_RULES_VERSION = '1.2.0';
export const TRIAL_STYLE_ID = 'mc-theme-trial';

// ── theme presets (Contract theme-presets 1.2.0) ──

/**
 * The preset chunk: every editor preset (25 original, 20 inspired, 12 genre: 57 in all) and the create dialog's
 * picker live in one lazy webpack chunk of the theme editor entry, webpackChunkName THEME_PRESETS_CHUNK, emitted
 * as dist/THEME_PRESETS_CHUNK_FILE (with the content hash in its file name, next to the entry).
 */
export const THEME_PRESETS_VERSION = '1.2.0';
export const THEME_PRESETS_CHUNK = 'theme-presets';
export const THEME_PRESETS_CHUNK_FILE = 'magic-card-theme-presets.js';

export type ThemePresetGroup = 'mine' | 'original' | 'inspired' | 'genre';

/**
 * Group order, Show labels, headings and search words. Type-level here; the picker keeps its own copy of the
 * values (src/contracts/ is types plus constants and the chunk must not pull in more). (1.2.0) mine: "My presets"
 * / search "my"; original: "Original" / search "original"; inspired: "Inspired by" / "inspired by"; genre:
 * "Sci-fi & fantasy" / "genre".
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

export interface BuiltInThemePreset {
  id: string;
  /** Display name and the seed of the new theme's file name: an m() mark (namespace 'theme-presets'); render it with t() (the chunk's presetTitle()). */
  name: MessageIndex;
  /** One short line under the name (an m() mark). */
  blurb: MessageIndex;
  /** Optional extra line (cost or behaviour to know before picking it); an m() mark. */
  note?: MessageIndex;
  group: Exclude<ThemePresetGroup, 'mine'>;
  inspiredBy?: ThemePresetCredit;
  /** 1.1.0: extra search words, lowercase, space separated. Required for 'genre' (first word sci-fi or fantasy). Never shown, never a franchise term. */
  tags?: string;
  doc: ThemeDoc;
}

/** 1.3.0: a My preset as a picker item. `name` and `blurb` are the user's own text, never a message mark: do not pass them to t(). */
export interface OwnThemePreset {
  id: string;
  name: string;
  blurb: string;
  group: 'mine';
  note?: undefined;
  inspiredBy?: undefined;
  tags?: undefined;
  doc: ThemeDoc;
}

export type ThemePreset = BuiltInThemePreset | OwnThemePreset;

export interface ThemePresetLibrary {
  /** THEME_PRESETS_VERSION of the chunk that was built. */
  version: string;
  presets: readonly BuiltInThemePreset[];
}
