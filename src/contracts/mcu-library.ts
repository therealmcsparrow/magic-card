import type { CustomShapeOptions } from './custom-shape';

/*
 * Contract: Magic Card Utils library of saved icons and shapes. Version 1.0.0 (Architect-owned).
 * ADR 0018. Python side of record: magic-card-utils
 * custom_components/magic_card_utils/library_contract.py (same version; this file mirrors it).
 *
 * Two parts:
 * 1. WebSocket commands (MCU backend module `library`, library.py). Storage: HA Store
 *    `magic_card_utils.icons` and `magic_card_utils.shapes` (one JSON object each, keyed by id).
 * 2. A frontend provider (MCU module `library-provider`, www/magic_card_utils_library.js) that
 *    MCU registers on EVERY Home Assistant page with frontend.add_extra_js_url. It registers the
 *    icons with Home Assistant (window.customIcons[ICON_PREFIX]) and exposes shapes to cards
 *    (window.magicCardUtils). Magic Card never calls the library commands from magic-card.js; it
 *    only reads the provider. Only the editors (lazy chunks) call the commands.
 *
 * ── 1. WebSocket commands ──
 * Reads: any authenticated user (cards render for non-admin users). Writes: admin only.
 *   magic_card_utils/icons_list   {}            -> { icons: IconSummary[] }
 *   magic_card_utils/icons_get    { ids: [] }   -> { icons: SavedIcon[] }      (unknown ids left out; at most 100 ids)
 *   magic_card_utils/icons_save   { icon: SavedIconInput, base_updated_at? } -> { icon: SavedIcon }
 *   magic_card_utils/icons_delete { icon_id }   -> {}                          (unknown id: success)
 *   magic_card_utils/shapes_list  {}            -> { shapes: SavedShape[] }    (shapes are small: full items)
 *   magic_card_utils/shapes_save  { shape: SavedShapeInput, base_updated_at? } -> { shape: SavedShape }
 *   magic_card_utils/shapes_delete { shape_id } -> {}
 *   magic_card_utils/subscribe_library {}       -> events LibraryEvent (any authenticated user; no initial state)
 * `icon_id` / `shape_id`, never `id` (that is the WebSocket message id).
 * Save = create or replace by id. base_updated_at given and different on the server -> `conflict`.
 * Server sets created_at (kept on replace) and updated_at (ISO 8601 UTC).
 *
 * Server validation (defence in depth; the card sanitises every SVG again with sanitizeSvg before
 * use, which stays the one security boundary):
 * - id matches LIBRARY_ID_RE; name 1..80 chars after trim; keywords at most 10 words of 1..32 chars.
 * - icons: svg is a string of at most ICON_MAX_BYTES UTF-8 bytes, starts with "<svg", and every
 *   element name is in the sanitiser's allowlist (svg g path circle ellipse rect line polyline
 *   polygon defs linearGradient radialGradient stop clipPath mask title); no attribute named on*,
 *   style, href or xlink:href; no "javascript:", "<!ENTITY", "<!DOCTYPE" or "<?" anywhere; url()
 *   only as url(#id). path / secondary_path match ^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\- \n]*$ and are at
 *   most ICON_MAX_BYTES each; view_box is four finite numbers.
 * - shapes: `shape` is an object of at most SHAPE_MAX_BYTES compact JSON, with only the
 *   CustomShapeOptions keys (minus `ref`); points at most 64. Deeper value checks are the card's job
 *   (it ignores invalid values one by one).
 * - At most MAX_ICONS icons and MAX_SHAPES shapes; a new id beyond that -> `library_full`.
 * Errors: invalid_format (with errors: [{path, message}]), not_found, conflict, library_full,
 * not_loaded, save_failed; non-admin writers get HA's `unauthorized`.
 *
 * ── 2. Frontend provider (window surface) ──
 * - window.customIcons[ICON_PREFIX] = { getIcon(name), getIconList() } (Home Assistant's current
 *   custom icon API). getIcon resolves { path, secondaryPath?, viewBox, mc_svg } for a saved icon,
 *   undefined for an unknown name. Home Assistant draws path / secondaryPath; Magic Card reads
 *   mc_svg (the full sanitised markup: strokes, accent, evenodd) through registerSvgGeometry.
 *   getIconList() resolves [{ name, keywords }] for Home Assistant's icon picker.
 * - window.magicCardUtils = { apiVersion: PROVIDER_API_VERSION, ready: Promise<void>,
 *   shapes: { get(id): CustomShapeOptions | undefined, ids(): string[] } }.
 * - After the first load and after every library change it dispatches on window:
 *   `iconset-registered` (Magic Card's icon-source already re-checks pending refs on it) and
 *   `mcu-library-changed` with detail { kind: 'icons' | 'shapes', ids: string[] } (ids changed or
 *   deleted; [] = everything may have changed).
 * - Icons are fetched lazily: the list once (names only), getIcon fetches the item on first use
 *   (batched per animation frame into one icons_get), cached for the page.
 *
 * ── How cards reference saved items ──
 * - Icon: `icon: mcu:<id>` wherever an icon string goes (Magic Card modules, and any other card
 *   through Home Assistant's own picker). Magic Card resolution order (icon-source.ts):
 *   1. provider getIcon: mc_svg -> registerSvgGeometry geometry (full fidelity); else path.
 *   2. the card's `custom_icons[<id>]` (inline sanitised markup), used when 1 has no provider
 *      or the provider answered undefined for the id.
 *   3. otherwise the usual fallback (<ha-icon>, which shows nothing for an unknown mcu: ref).
 *   `mcu-library-changed` (icons) drops the cached geometry of the listed mcu: refs and
 *   re-resolves them (listeners notified as today).
 * - Shape: `shape: custom` + `shape_options.ref: <id>` (custom-shape 1.0.0), with an inline copy
 *   the editor always writes to the card's `custom_shapes[<id>]`.
 *
 * ── Without Magic Card Utils ──
 * - The SVG editor saves into the module as today (`icon: svg` + inline `svg:`), no new config and
 *   no runtime change. "Save to library" is disabled with the hint to install Magic Card Utils.
 * - The shape editor writes `shape: custom` with the options inline; "Save as shape" is disabled
 *   the same way. An existing `ref` still renders from `custom_shapes`.
 * - A card with `icon: mcu:<id>` renders from `custom_icons` when present. The card editor writes
 *   `custom_icons` copies when the user exports / copies a card (as custom_animations today) or
 *   ticks "Keep a copy in this card" (default off: an icon may be 32 KB).
 * - Detection: the editor calls icons_list; `unknown_command` means not installed (cached per page,
 *   as AnimationLibrary does). Cards never call commands, so there is nothing to detect at render.
 */

export const MCU_LIBRARY_CONTRACT_VERSION = '1.0.0';
export const PROVIDER_API_VERSION = 1;
export const ICON_PREFIX = 'mcu';
export const LIBRARY_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
export const ICON_MAX_BYTES = 32 * 1024;
export const SHAPE_MAX_BYTES = 8 * 1024;
export const MAX_ICONS = 500;
export const MAX_SHAPES = 200;

export const CMD = {
  iconsList: 'magic_card_utils/icons_list',
  iconsGet: 'magic_card_utils/icons_get',
  iconsSave: 'magic_card_utils/icons_save',
  iconsDelete: 'magic_card_utils/icons_delete',
  shapesList: 'magic_card_utils/shapes_list',
  shapesSave: 'magic_card_utils/shapes_save',
  shapesDelete: 'magic_card_utils/shapes_delete',
  subscribe: 'magic_card_utils/subscribe_library',
} as const;

export interface IconSummary {
  id: string;
  name: string;
  keywords?: string[];
  updated_at: string;
}

export interface SavedIconInput {
  id: string;
  name: string;
  keywords?: string[];
  /** Sanitised markup from the SVG editor (sanitizeSvg output, viewBox included). */
  svg: string;
  /** Home Assistant form: every filled, non-accent shape in one path. */
  path: string;
  /** Accent shapes in one path (Home Assistant draws it at half opacity). */
  secondary_path?: string;
  view_box: string;
}

export interface SavedIcon extends SavedIconInput {
  created_at: string;
  updated_at: string;
}

export interface SavedShapeInput {
  id: string;
  name: string;
  /** Without `ref`. */
  shape: Omit<CustomShapeOptions, 'ref'>;
}

export interface SavedShape extends SavedShapeInput {
  created_at: string;
  updated_at: string;
}

export type LibraryEvent =
  | { action: 'saved'; kind: 'icons'; icon: IconSummary }
  | { action: 'saved'; kind: 'shapes'; shape: SavedShape }
  | { action: 'deleted'; kind: 'icons' | 'shapes'; id: string };

export type LibraryErrorCode = 'invalid_format' | 'not_found' | 'conflict' | 'library_full' | 'not_loaded' | 'save_failed' | 'unauthorized';

/** Card level (types.ts MagicCardConfig): sanitised icon markup by saved-icon id. */
export type CustomIconsConfig = Record<string, string>;

/** window.customIcons[ICON_PREFIX].getIcon result. */
export interface ProviderIcon {
  path: string;
  secondaryPath?: string;
  viewBox: string;
  mc_svg: string;
}

export interface MagicCardUtilsWindow {
  apiVersion: number;
  ready: Promise<void>;
  shapes: { get(id: string): CustomShapeOptions | undefined; ids(): string[] };
}

export interface LibraryChangedDetail {
  kind: 'icons' | 'shapes';
  ids: string[];
}
export const LIBRARY_CHANGED_EVENT = 'mcu-library-changed';
