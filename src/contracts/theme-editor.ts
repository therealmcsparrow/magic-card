/*
 * Contract: theme editor host. Version 1.0.0 (Architect-owned).
 *
 * Implementation: module `theme-editor` (src/theme-editor/, webpack entry
 * dist/magic-card-theme-editor.js). Consumer: the Magic Card Utils panel's "Themes" tab
 * (magic-card-utils: custom_components/magic_card_utils/www/magic_card_utils_panel.js).
 * Backend it talks to (through the panel's adapter only): Contract theme-files 1.0.0
 * (magic-card-utils: custom_components/magic_card_utils/themes_contract.py).
 *
 * Loading (same pattern as the animation studio entry):
 * - The panel resolves magic-card.js from `lovelace/resources`, loads it (_ensureMagicCard), then
 *   imports THEME_EDITOR_FILE from the same directory with the same query string.
 * - The entry defines THEME_EDITOR_TAG and its own `mcte-*` / `mc-theme-trial-bar` elements only,
 *   guarded by customElements.get. It never defines mc-color-picker / mc-unit-field: it asks
 *   magic-card.js for the editor chunk with `window.MagicCard.loadEditor()` (module-editor 1.0.0)
 *   and uses those elements by tag.
 * - Chunk rule: src/theme-editor/ has no runtime import outside src/theme-editor/ and `lit`
 *   (types from src/contracts/ are fine) and no dynamic import(): the entry is one file, there is
 *   no public path to set, and magic-card.js is untouched (+0 B).
 * - Version check: the panel reads `customElements.get(THEME_EDITOR_TAG).contractVersion` and
 *   accepts major 1. A missing file or element means "update Magic Card to 2026.10.06 or newer".
 */

export const THEME_EDITOR_CONTRACT_VERSION = '1.0.0';
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

/** Error codes (theme-files 1.0.0). The adapter rejects with an Error carrying `code` and optional `errors`. */
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
  | 'unauthorized';

export interface ThemeBackendError extends Error {
  code: ThemeErrorCode | string;
  /** Field errors for invalid_format: path like "name", "theme.primary-color", "theme.modes.dark". */
  errors?: Array<{ path: string; message: string }>;
}

export interface ThemeBackend {
  list(): Promise<ThemeList>;
  get(name: string): Promise<ThemeGetResult>;
  save(req: ThemeSaveRequest): Promise<ThemeSaveResult>;
  remove(name: string): Promise<void>;
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
 * Trial ("Try on dashboards", tab-local, ADR 0012): one <style id="mc-theme-trial"> in
 * document.head with a single `html {}` rule whose declarations are set with
 * rule.style.setProperty(name, value, 'important') (never string-built CSS). Removed by Revert, by
 * Discard, by a successful save, or a page reload; never persisted. While it is active the
 * <mc-theme-trial-bar> sits in document.body with "Back to theme editor" and "Revert".
 */
export const PREVIEW_RULES_VERSION = '1.0.0';
export const TRIAL_STYLE_ID = 'mc-theme-trial';
