import type { CustomShapeOptions } from './custom-shape';
import type { ThemeDoc } from './theme-editor';

/*
 * Contract: Magic Card Utils library of saved icons, shapes and theme presets, plus the shared
 * library view over the existing animation store. Version 1.0.0.
 * Python side of record: magic-card-utils custom_components/magic_card_utils/library_contract.py
 * (same version; this file mirrors it).
 *
 * Icons, shapes and theme presets carry an optional author / description. Theme presets have their
 * own store and commands; preset files: preset-transfer 1.0.0. The animation store joins the library
 * view with no migration. The panel has a "Library" tab and an "Editors" tab and hosts the SVG editor
 * and shape editor without a card (section "Editors in the panel", section "Panel adapter shapes").
 * The provider reads shapes lazily. `ready` covers the subscription only; the first
 * shapes.get / shapes.ids sends shapes_list once per page; until that answer lands they answer
 * undefined / [], then the provider fires `mcu-library-changed` { kind: 'shapes', ids: [] }.
 * PROVIDER_API_VERSION stays 1 and MCU_LIBRARY_CONTRACT_REVISION stays 4, as on the Python side
 * (MCU tests pin 4).
 *
 * Two parts:
 * 1. WebSocket commands (MCU backend module `library`, library.py). Storage: HA Store
 *    `magic_card_utils.icons`, `magic_card_utils.shapes` and `magic_card_utils.theme_presets`
 *    (one JSON object each, keyed by id).
 * 2. A frontend provider (MCU module `library-provider`, www/magic_card_utils_library.js) that
 *    MCU registers on EVERY Home Assistant page with frontend.add_extra_js_url. It registers the
 *    icons with Home Assistant (window.customIcons[ICON_PREFIX]) and exposes shapes to cards
 *    (window.magicCardUtils). Magic Card never calls the library commands from magic-card.js; it
 *    only reads the provider. Only the editors (lazy chunks) call the commands. Theme presets are
 *    never on the provider (cards do not use them).
 * 3. The panel (MCU module `panel`, www/magic_card_utils_panel.js): Library and Editors tabs
 *    hosting Magic Card's editors (below).
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
 *   magic_card_utils/theme_presets_list   {} -> { theme_presets: SavedThemePreset[] } (full items)
 *   magic_card_utils/theme_presets_save   { theme_preset: SavedThemePresetInput, base_updated_at? }
 *                                                 -> { theme_preset: SavedThemePreset }
 *   magic_card_utils/theme_presets_delete { theme_preset_id } -> {}      (unknown id: success)
 *   magic_card_utils/subscribe_library {}       -> events LibraryEvent (any authenticated user; no initial state)
 * `icon_id` / `shape_id` / `theme_preset_id`, never `id` (that is the WebSocket message id).
 * Save = create or replace by id. base_updated_at given and different on the server -> `conflict`.
 * Server sets created_at (kept on replace) and updated_at (ISO 8601 UTC).
 *
 * Server validation (defence in depth; the card sanitises every SVG again with sanitizeSvg before
 * use, which stays the one security boundary):
 * - id matches LIBRARY_ID_RE; name 1..80 chars after trim; keywords at most 10 words of 1..32 chars.
 * - author (optional) 1..AUTHOR_MAX_CHARS, description (optional) 1..DESCRIPTION_MAX_CHARS,
 *   after trim, on icons, shapes and theme presets. Not on IconSummary.
 * - icons: svg is a string of at most ICON_MAX_BYTES UTF-8 bytes, starts with "<svg", and every
 *   element name is in the sanitiser's allowlist (svg g path circle ellipse rect line polyline
 *   polygon defs linearGradient radialGradient stop clipPath mask title); no attribute named on*,
 *   style, href or xlink:href; no "javascript:", "<!ENTITY", "<!DOCTYPE" or "<?" anywhere; url()
 *   only as url(#id). path / secondary_path match ^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\- \n]*$ and are at
 *   most ICON_MAX_BYTES each; view_box is four finite numbers. Nested <g> (svg-editor, up to
 *   4 levels) passes these rules unchanged; the server does not count depth.
 * - shapes: `shape` is an object of at most SHAPE_MAX_BYTES compact JSON, with only the
 *   CustomShapeOptions keys (minus `ref`); points at most 64. Deeper value checks are the card's job
 *   (it ignores invalid values one by one).
 * - theme presets: `doc` is an object of at most THEME_PRESET_MAX_BYTES compact JSON; every
 *   key matches THEME_VAR_RE or is "modes"; modes holds only "light" / "dark" objects with
 *   THEME_VAR_RE keys; every value is a string of at most THEME_VALUE_MAX_CHARS or a finite number
 *   (not a bool). External references and card-mod-* keys are ACCEPTED (kept with
 *   a warning shown by the importing editor); the server neither strips nor flags them. Contrast
 *   and required variables are not checked (a preset is a starting point; the theme editor runs
 *   docErrors when it opens one).
 * - At most MAX_ICONS icons, MAX_SHAPES shapes and MAX_THEME_PRESETS theme presets; a new id
 *   beyond that -> `library_full`.
 * Errors: invalid_format (with errors: [{path, message}]), not_found, conflict, library_full,
 * not_loaded, save_failed; non-admin writers get HA's `unauthorized`.
 *
 * ── Animations: the existing store, one library view ──
 * My animations stay where they are: MCU animations.py, Store `magic_card_utils.animations`,
 * commands get_animations / subscribe_animations / save_animation / delete_animation (contract
 * in src/services/animation-library.ts, unchanged). No data migration and no new command: ids and
 * `preset: custom:<id>` refs keep working. The library view (preset-transfer 1.0.0,
 * <mc-library-view>) lists them next to icons and shapes from two sources: animationLibrary (the
 * page's shared AnimationLibrary) and the commands above. Rename = save_animation with the same id
 * and a new name; delete = delete_animation. Animation docs carry no author / description.
 *
 * ── 2. Frontend provider (window surface) ──
 * Load and connection (verified on HA core 2026.10.2: the extra module is import()ed by an inline
 * script, not ordered against HA's core.js):
 * - ESM, the whole body in try/catch, no DOM writes, no innerHTML, under PROVIDER_MAX_BYTES
 *   unminified. Safe mode skips extra modules: cards then use their kept copies (below).
 * - Synchronously at load: window.customIcons = window.customIcons || {}; then set
 *   window.customIcons[ICON_PREFIX]. NEVER replace window.customIcons (HA keeps an existing object
 *   and wraps it in a Proxy; replacing it drops other integrations' icon sets). Also set
 *   window.magicCardUtils at once; its methods and `ready` await the connection.
 * - Connection: window.hassConnection (a Promise of { auth, conn } set by HA's core.js) may not exist
 *   yet. Check at once, then poll every CONNECTION_POLL_MS with one timer, give up after
 *   CONNECTION_WAIT_MS (then getIcon answers the blank icon and `ready` resolves with an empty
 *   library). Await it and use conn.sendMessagePromise / subscribeMessage. Never call or set
 *   window.hassConnectionReady (HA's own hook).
 * - window.customIcons[ICON_PREFIX] = { getIcon(name), getIconList() } (Home Assistant's current
 *   custom icon API). getIcon resolves { path, secondaryPath?, viewBox, mc_svg } for a saved icon.
 *   For an unknown name, and on any error, it resolves BLANK_ICON ({ path: '', viewBox: '0 0 24 24' },
 *   no mc_svg) and never rejects. Magic Card treats a result without mc_svg and with an empty path
 *   as "not found". getIconList() resolves the live [{ name, keywords }] each call.
 * - Home Assistant draws { path, secondaryPath } only: one fill path in currentColor and one at
 *   reduced opacity. So in HA's own cards and pickers a saved icon is a single-colour silhouette;
 *   strokes, colours and gradients show only in Magic Card (mc_svg). Docs say so.
 * - HA's icon picker reads getIconList once per page load and caches it: an icon saved in the
 *   editor appears in HA's picker after a page reload (Magic Card's own picker refreshes at once).
 *   Docs say so.
 * - window.magicCardUtils = { apiVersion: PROVIDER_API_VERSION, ready: Promise<void>,
 *   shapes: { get(id): CustomShapeOptions | undefined, ids(): string[] } }. Shapes load lazily:
 *   `ready` covers the subscription only. The first shapes.get or shapes.ids sends shapes_list once per
 *   page; until that answer lands, get answers undefined and ids []. When it lands the provider fires
 *   `mcu-library-changed` { kind: 'shapes', ids: [] }, and cards re-render from the library (mc-shape
 *   listens to it). A failed lazy load is not retried until the page reloads; cards keep their inline
 *   copy. A page with no card that uses a shape ref never downloads the shapes.
 * - After the first load and after every library change it dispatches on window:
 *   `iconset-registered` (Magic Card's icon-source already re-checks pending refs on it) and
 *   `mcu-library-changed` with detail { kind: 'icons' | 'shapes', ids: string[] } (ids changed or
 *   deleted; [] = everything may have changed). theme_presets events are ignored by the
 *   provider (no window event for them).
 * - Icons are fetched lazily: the list once (names only), getIcon fetches the item on first use
 *   (batched per animation frame into one icons_get), cached for the page.
 * - Verified on the web frontend. Companion apps (iOS, Android) and ingress iframes are not
 *   verified.
 *
 * ── Saved icon `path` (what HA draws) ──
 * The SVG editor computes `path` and `secondary_path` on save: every filled, non-accent shape in
 * `path`, accent shapes in `secondary_path`, closed stroked shapes as their filled area, open
 * stroked lines left out (no stroke expansion in 1.0.0). HA fills with the default nonzero rule,
 * so subpaths of an evenodd shape that sit inside an odd number of others are written with
 * reversed winding (holes stay holes). The editor previews this "In Home Assistant" form at 24 px
 * next to the full icon and shows W11 when `path` is empty or loses more than half of the
 * drawing's filled area. An imported icon without a valid path is saved with path '' and
 * the import summary says to open and save it in the SVG editor. Unchanged by Dual-tone
 * (svg-editor): Accent = secondary_path; the editor's preview strip shows both forms. A user who
 * wants open strokes in HA's form converts them first with Outline stroke (path-tools 1.0.0).
 *
 * ── How cards reference saved items ──
 * - Icon: `icon: mcu:<id>` wherever an icon string goes (Magic Card modules, and any other card
 *   through Home Assistant's own picker). In Magic Card renderIcon sends every `mcu:` icon to
 *   <mc-svg-icon> (as for `icon: svg`), with or without effects, so Magic Card always draws the full
 *   icon and never HA's silhouette. Resolution order (icon-source.ts):
 *   1. provider getIcon: mc_svg -> registerSvgGeometry geometry (full fidelity); else a non-empty
 *      path.
 *   2. the card's `custom_icons[<id>]` (inline sanitised markup), used when 1 has no provider yet,
 *      or the provider answered the blank icon.
 *   3. otherwise the module's default icon (fallbackIcon), or the entity's icon when the module has
 *      an entity. Never <ha-icon> with the mcu: name, never blank.
 *   The same never-blank rule covers `icon: svg` whose markup the sanitiser rejects:
 *   <mc-svg-icon> draws the module's default or entity icon instead of BROKEN_ICON. The editor
 *   shows a notice; the runtime is silent. Both together cost at most 768 B.
 *   `mcu-library-changed` (icons) drops the cached geometry of the listed mcu: refs and
 *   re-resolves them (listeners notified as today).
 * - Shape: `shape: custom` + `shape_options.ref: <id>` (custom-shape 1.0.0), with an inline copy
 *   the editor always writes to the card's `custom_shapes[<id>]`.
 * - Animation: `preset: custom:<id>` as today. Library first, then the card's
 *   `custom_animations[<id>]` (animation-library.ts inlineAnimations, unchanged: magic-card.js
 *   +0 B).
 * - Theme: none. Cards keep `theme: <HA theme name>`; a theme preset is
 *   a starting point in the theme editor, never referenced by a card, never copied into one.
 * - A ref is a live link for icons and animations too (same rule as custom-shape: the library wins
 *   once loaded, the kept copy only covers a missing provider, store or item). So an icon or
 *   shape edited in the panel shows on every card that references it after a reload (kept copies in
 *   cards are refreshed the next time that card's editor saves; they only cover a missing library).
 *
 * ── Kept copies (`custom_icons`, `custom_shapes`, `custom_animations`) ──
 * - "Keep a copy in this card" for icons defaults ON when the sanitised markup is at most
 *   KEEP_COPY_DEFAULT_MAX_BYTES (UTF-8), OFF above. For a picked My animation it defaults ON
 *   when the doc's compact JSON is at most KEEP_COPY_ANIMATION_DEFAULT_MAX_BYTES, OFF above
 *   (rigs and particles get large). The editor shows the size; the user can switch it either
 *   way. Shapes always keep a copy. Export / copy of a card always writes the copies.
 * - Pruning, on every save of the card editor: an entry of custom_icons, custom_shapes or
 *   custom_animations is removed only when (a) no module of the card uses it (for animations:
 *   neither a module's preset nor a step of another kept animation), AND (b) its id is in the
 *   loaded library of that kind (it is a copy). Entries whose id is not in the library are the
 *   card's own (hand-written YAML, imports without Magic Card Utils) and are never pruned. With
 *   the library not loaded or not installed, nothing is pruned.
 * - Template-linked cards: `custom_icons` is template-merged like `custom_animations` (the card's
 *   entry wins per id; TEMPLATE_CARD_KEYS gains it).
 *
 * ── Without Magic Card Utils ──
 * - The SVG editor saves into the module as today (`icon: svg` + inline `svg:`), no new config and
 *   no runtime change. "Save to library" is disabled with the hint to install Magic Card Utils.
 * - The shape editor writes `shape: custom` with the options inline; "Save as shape" is disabled
 *   the same way. An existing `ref` still renders from `custom_shapes`.
 * - A card with `icon: mcu:<id>` renders from `custom_icons` when present, else the default icon.
 * - Imports in the card editor, shape editor and SVG editor go to the card's custom_*
 *   copies (preset-transfer 1.0.0). Theme presets need Magic Card Utils (the theme editor lives
 *   in its panel).
 * - Detection: the editor calls icons_list; `unknown_command` means not installed (cached per page,
 *   as AnimationLibrary does). Cards never call commands, so there is nothing to detect at render.
 *   The theme editor detects theme presets through ThemeBackend.presets (theme-editor 1.1.0):
 *   absent = an older Magic Card Utils.
 *
 * ── 3. Editors in the panel ──
 * - Tabs: MCU_PANEL_TABS; "Library" and "Editors" come after "Themes". Both lead to the same editor
 *   shell (below).
 * - Loading, no card and no new Magic Card file (the Themes tab pattern): the panel's
 *   _ensureMagicCard() (magic-card.js from lovelace/resources, imported once), then
 *   `await window.MagicCard.loadEditor()` (the card-editor chunk), then on first use
 *   window.MagicCard.loadSvgEditor() / loadShapeEditor() (svg-editor 1.0.0 loaders) and, for the Library
 *   tab, window.MagicCard.loadTransfer() (preset-transfer 1.0.0). Fetched: magic-card.js (the panel
 *   already loads it), magic-card-editor.js, the editor chunk, and on use the path-canvas, booleans,
 *   path-tools and transfer chunks, all from the folder magic-card.js came from. No card element, no
 *   dashboard, no request to another host. magic-card.js and magic-card-editor.js grow 0 B.
 * - Version gate: Magic Card not found -> "Install Magic Card to draw icons and shapes here." Loaders
 *   missing, or customElements.get(tag).contractRevision below SVG_EDITOR_MCU_MIN_REVISION (svg-editor
 *   contract) -> "Drawing icons and shapes here needs Magic Card <version> or newer. Update Magic Card." with
 *   <version> = the panel constant MIN_MAGIC_CARD_FOR_EDITORS (the Magic Card release
 *   that ships the panel editors). Nothing else loads; the tabs stay usable for the message and the Library list.
 * - Shell: one panel method _openEditor({ kind: 'icon' | 'shape', id?, opener }) for both tabs. It hides
 *   the tab bar and the tab content and mounts the element in a host that fills the panel's content area
 *   under the toolbar: icon -> <mc-svg-editor host="mcu"> with hass, source ({ kind: 'blank' } or
 *   { kind: 'library', id }), savedId, libraryAvailable true; shape -> <mc-shape-studio host="mcu"> with
 *   hass, value (the shapes_list item's `shape` as { shape: 'custom', shape_options }, or unset for New),
 *   customShapes {}, libraryAvailable true. hass is kept current. The panel focuses the element. On
 *   mc-svg-save / mc-shape-save it refreshes its lists. On mc-svg-close / mc-shape-close it removes the
 *   element, shows the tab again and returns focus to the opener (or the row's replacement found by
 *   data-focus-key).
 * - Library tab: <mc-library-view> (preset-transfer 1.0.0) with context 'mcu-panel', hass and
 *   presets (the same adapter object as the Themes tab). It lists icons, shapes, animations and theme
 *   presets from Magic Card Utils only (no "This card" source); search, rename, delete, export and import
 *   as in the card editor. "New icon" / "New shape" in its header and "Edit" on icon and shape rows fire
 *   `mc-library-open` { kind, id? }; the panel calls _openEditor.
 * - Editors tab (the panel's own markup, no Magic Card code): buttons "New icon" and "New shape", then
 *   "Recent icons" and "Recent shapes" with the MCU_RECENT_ITEMS most recently updated items of each
 *   (icons_list / shapes_list, by updated_at), each with "Edit", and "See all in Library" (switches tab).
 *   Empty lists say "Nothing saved yet."
 * - Accessibility: the new tabs join the existing tablist (roving tabindex, arrow keys); every control
 *   is a real button of at least 24 x 24 CSS px; the shell's focus rules above; works at 200 % zoom.
 * - Won't: editing card YAML from the panel. Later: deep links to an editor, duplicate from library,
 *   folders / tags.
 *
 * ── Event name ──
 * LIBRARY_CHANGED_EVENT lives in src/contracts/mcu-library.needs.ts, the only file of this contract
 * magic-card.js imports; this file re-exports it.
 *
 * ── Panel adapter shapes ──
 * ThemeBackend.presets (theme-editor 1.1.0 ThemePresetStore) is the shape of record: list() resolves
 * SavedThemePreset[] (the array), save() resolves the SavedThemePreset, remove() resolves undefined. The
 * MCU panel adapter (_createPresetBackend) changes to match; an older adapter answered { theme_presets } and
 * { theme_preset }. Magic Card's readers (theme-editor.ts _loadMine and
 * library-view.ts) keep accepting both shapes (tolerant reader, 0 B change), to be simplified in a later
 * cleanup once no MCU build with the old adapter is in use.
 */

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
  /** Home Assistant form: every filled, non-accent shape in one path (see "Saved icon path"). */
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
