import type { CustomShapeOptions } from './custom-shape';
import type { ThemeDoc } from './theme-editor';

/** Contract: Magic Card Utils library of saved icons, shapes and theme presets. Version 1.0.0. Mirrors magic-card-utils
 * custom_components/magic_card_utils/library_contract.py (same version). */

export const MCU_LIBRARY_CONTRACT_VERSION = '1.0.0';
export const MCU_LIBRARY_CONTRACT_REVISION = 4;
export const PROVIDER_API_VERSION = 1;
export const ICON_PREFIX = 'mcu';
export const LIBRARY_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
export const ICON_MAX_BYTES = 32 * 1024;
export const SHAPE_MAX_BYTES = 8 * 1024;
export const MAX_ICONS = 500;
export const MAX_SHAPES = 200;
/** */
export const MAX_THEME_PRESETS = 100;
/** Compact JSON of one theme preset's doc. */
export const THEME_PRESET_MAX_BYTES = 32 * 1024;
/** One theme variable's string value. */
export const THEME_VALUE_MAX_CHARS = 1024;
/** */
export const AUTHOR_MAX_CHARS = 80;
/** */
export const DESCRIPTION_MAX_CHARS = 280;
/** Provider script size cap, unminified (it loads on every HA page). */
export const PROVIDER_MAX_BYTES = 6 * 1024;
export const CONNECTION_POLL_MS = 50;
export const CONNECTION_WAIT_MS = 30_000;
/** "Keep a copy in this card" is on by default up to this sanitised markup size. */
export const KEEP_COPY_DEFAULT_MAX_BYTES = 2 * 1024;
/** Same rule for a picked My animation (compact JSON of the doc). */
export const KEEP_COPY_ANIMATION_DEFAULT_MAX_BYTES = 8 * 1024;
/** Panel tabs, in order. */
export const MCU_PANEL_TABS = ['templates', 'animations', 'themes', 'library', 'editors'] as const;
/** Items per "Recent" list in the Editors tab. */
export const MCU_RECENT_ITEMS = 8;

export const CMD = {
  iconsList: 'magic_card_utils/icons_list',
  iconsGet: 'magic_card_utils/icons_get',
  iconsSave: 'magic_card_utils/icons_save',
  iconsDelete: 'magic_card_utils/icons_delete',
  shapesList: 'magic_card_utils/shapes_list',
  shapesSave: 'magic_card_utils/shapes_save',
  shapesDelete: 'magic_card_utils/shapes_delete',
  themePresetsList: 'magic_card_utils/theme_presets_list',
  themePresetsSave: 'magic_card_utils/theme_presets_save',
  themePresetsDelete: 'magic_card_utils/theme_presets_delete',
  subscribe: 'magic_card_utils/subscribe_library',
} as const;

/** Optional credit and text, on icons, shapes and theme presets. */
export interface ItemMeta {
  author?: string;
  description?: string;
}

export interface IconSummary {
  id: string;
  name: string;
  keywords?: string[];
  updated_at: string;
}

export interface SavedIconInput extends ItemMeta {
  id: string;
  name: string;
  keywords?: string[];
  /** Sanitised markup from the SVG editor (sanitizeSvg output, viewBox included). */
  svg: string;
  /** Home Assistant form: every filled, non-accent shape in one path. */
  path: string;
  /** Accent shapes in one path (Home Assistant draws it at reduced opacity). */
  secondary_path?: string;
  view_box: string;
}

export interface SavedIcon extends SavedIconInput {
  created_at: string;
  updated_at: string;
}

export interface SavedShapeInput extends ItemMeta {
  id: string;
  name: string;
  /** Without `ref`. Free paths carry the editor's computed `padding` (custom-shape 1.0.0). */
  shape: Omit<CustomShapeOptions, 'ref'>;
}

export interface SavedShape extends SavedShapeInput {
  created_at: string;
  updated_at: string;
}

/** A My theme preset. description is the picker blurb. */
export interface SavedThemePresetInput extends ItemMeta {
  id: string;
  name: string;
  doc: ThemeDoc;
}

export interface SavedThemePreset extends SavedThemePresetInput {
  created_at: string;
  updated_at: string;
}

export type LibraryKind = 'icons' | 'shapes' | 'theme_presets';

export type LibraryEvent =
  | { action: 'saved'; kind: 'icons'; icon: IconSummary }
  | { action: 'saved'; kind: 'shapes'; shape: SavedShape }
  | { action: 'saved'; kind: 'theme_presets'; theme_preset: SavedThemePreset }
  | { action: 'deleted'; kind: LibraryKind; id: string };

export type LibraryErrorCode = 'invalid_format' | 'not_found' | 'conflict' | 'library_full' | 'not_loaded' | 'save_failed' | 'unauthorized';

/** Card level (types.ts MagicCardConfig): sanitised icon markup by saved-icon id. */
export type CustomIconsConfig = Record<string, string>;

/** window.customIcons[ICON_PREFIX].getIcon result. */
export interface ProviderIcon {
  path: string;
  secondaryPath?: string;
  viewBox: string;
  /** Absent in BLANK_ICON (unknown name or error). */
  mc_svg?: string;
}

/** What getIcon resolves for an unknown name or on any error. */
export const BLANK_ICON: Readonly<ProviderIcon> = Object.freeze({ path: '', viewBox: '0 0 24 24' });

export interface MagicCardUtilsWindow {
  apiVersion: number;
  /** Resolves once the library subscription is up; shapes load lazily on first get / ids. */
  ready: Promise<void>;
  /** get: undefined and ids: [] until the lazy shapes_list lands (then mcu-library-changed, kind shapes). */
  shapes: { get(id: string): CustomShapeOptions | undefined; ids(): string[] };
}

export interface LibraryChangedDetail {
  kind: 'icons' | 'shapes';
  ids: string[];
}
// The event name lives in mcu-library.needs.ts, which magic-card.js imports; re-exported unchanged.
export { LIBRARY_CHANGED_EVENT } from './mcu-library.needs';
