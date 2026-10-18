import type { CustomShapeOptions } from './custom-shape';
import type { ShapeOptions } from '../types';
import type { SavedIconInput } from './mcu-library';

/*
 * Contract: SVG editor and shape editor hosts. Version 1.0.0 (Architect-owned). ADR 0016, ADR 0020.
 * Revision 2 (2026-10-18, before any implementation): Escape and the Home Assistant dialog; what
 * really happens to a module whose icon becomes the user's own (checked in the code); keepCopy
 * default; linked cards; "This icon" animations follow own and saved icons; shape studio writes
 * free-path `padding`.
 *
 * Two lazy chunks of the magic-card entry, each loaded by the card-editor chunk (never by
 * magic-card.js, which gains 0 B from them):
 * - module `svg-editor`, src/svg-editor/, chunk SVG_EDITOR_CHUNK_FILE, element SVG_EDITOR_TAG.
 * - module `shape-editor`, src/shape-editor/, chunk SHAPE_EDITOR_CHUNK_FILE, element SHAPE_EDITOR_TAG.
 * Both import() the path-canvas chunk (path-canvas 1.0.0) when they open and take the editor-only
 * path-model parts (edit, tidy) from its exports (one copy rule, path-canvas.ts). Revision 2026-10-18: the draw tools (src/path/draw.ts) are no longer in that chunk; this chunk imports src/path/draw.ts itself (CEO decision, ADR 0019). The shape editor never imports it. Modules
 * already in magic-card.js (src/path/core.ts, src/icons/svg-sanitize.ts, src/icons/icon-source.ts,
 * src/utils/shape-path.ts) are imported normally; webpack does not copy modules a parent chunk
 * already holds. The animation studio entry imports the same src/path/ files (shared source, its
 * own bundle). Neither editor chunk imports src/anim-studio/** (import scan test).
 *
 * Loaders (window contract, additive, apiVersion stays 1; set by the card-editor chunk when it
 * loads, so magic-card.js does not grow):
 * - window.MagicCard.loadSvgEditor(): Promise<boolean>
 * - window.MagicCard.loadShapeEditor(): Promise<boolean>
 * Memoised; false on failure and retried on the next call (chunk URL rewritten, as the theme
 * presets loader does); 8 s timeout. The Magic Card Utils panel may later call loadEditor() then
 * loadSvgEditor() to host the SVG editor in a "Library" tab (not in 1.0.0 scope).
 *
 * ── Shell rules (both hosts) ──
 * - Escape never closes an editor and never reaches Home Assistant's card dialog. Order: end a
 *   gesture, then close an open overlay or popover, then clear the selection, then nothing (one-time
 *   hint, design 01 section 1). Mechanism, all three:
 *   1. a keydown listener on the layer root (the host element) that, for Escape, calls
 *      preventDefault() and stopPropagation() after the inner handlers ran (the same pattern
 *      module-selector.ts uses inside HA's dialog today). A cancelled keydown also stops a native
 *      <dialog>'s close request.
 *   2. while open, a `cancel` listener on every ancestor native <dialog> (walk getRootNode().host
 *      upwards) that calls preventDefault(), removed on close (covers HA dialogs built on <dialog>).
 *   3. focus stays inside the layer while it is open (modal-like layer, design 06), so Escape is
 *      always dispatched from inside it.
 *   Proof (T8, T11): HA 2026.10.2 card editor dialog (the S1 Docker image), focus on canvas, rail,
 *   field and overlay, in Chrome, Firefox and Safari: the dialog stays open.
 * - Focus returns to the opener, or its replacement by `data-focus-key` (design 01 section 1).
 *
 * ── <mc-svg-editor> ──
 * Opened by the module icon editor ("Draw an icon", "Customise this icon", "Edit icon") as a
 * full-screen layer.
 * Properties: hass; source: SvgEditorSource; libraryAvailable: boolean (icons_list answered);
 * savedId?: string (editing a library icon); module?: SvgEditorModuleFacts (for the notice).
 * Exactly one artboard, viewBox default 0 0 24 24.
 * Save path, always: the document is serialised, passed through sanitizeSvg, tidied (path-model
 * tidy) and checked against SVG_MAX_BYTES; a sanitiser error or the size cap blocks the save with
 * the reason. The markup in the event is the sanitiser's output, never the editor's own string.
 * Pasted / imported SVG goes through sanitizeSvg before it reaches the document, and the editor
 * lists what was dropped (customSvgWarning text). A subpath over MAX_ANCHORS imports and stays
 * editable; adding to it is refused (W10, path-canvas mc-path-limit).
 * Library saves also compute `path` / `secondary_path` (mcu-library 1.0.0 "Saved icon path"), show
 * the "In Home Assistant" 24 px preview and W11.
 * Events (bubbling, composed):
 * - `mc-svg-save` detail SvgSaveDetail. The host writes the module: target 'module' ->
 *   { icon: 'svg', svg }; target 'library' -> the editor has already called icons_save
 *   (mcu-library 1.0.0) and the host writes { icon: 'mcu:<id>' }, plus custom_icons[id] = svg when
 *   keepCopy. keepCopy's initial value: on when the markup is at most KEEP_COPY_DEFAULT_MAX_BYTES,
 *   else off (mcu-library 1.0.0); the size is shown next to the switch.
 * - `mc-svg-close` detail { dirty: boolean } after the user confirmed leaving unsaved work.
 * Start from an icon uses icon-source resolveIconGeometry (Home Assistant's icon DB through the
 * probe, or an installed pack): no MDI data is bundled.
 *
 * What changes when a module's icon becomes `icon: svg` or `icon: mcu:<id>` (facts from
 * render-icon.ts, mc-svg-icon.ts, follow-icon.ts, template-merge.ts; the notice in design 01
 * section 2b shows only the lines that apply, from SvgEditorModuleFacts):
 * - icon_fx keeps working: colours (incl. accent / secondary), fill, draw, morph and device motion.
 *   Own and saved icons are always drawn by <mc-svg-icon>. There is no "Glow" icon_fx key (Glow is
 *   an animated-icon Style); the notice must not name it.
 * - State icons (icon_on / icon_off) win over the drawing whenever they match the state (unchanged
 *   order in mc-svg-icon: rig, state icon, own icon, entity icon).
 * - An animated icon PICKED from the library (a library animation entry): it draws its own copy of
 *   the old icon, so the card editor removes that entry after the settled icon change, as it does
 *   for any icon change today (follow-icon.ts). Done therefore removes it; the notice says so
 *   before Done ("The animated icon you picked is removed: it draws mdi:lightbulb. Animate your
 *   drawing with This icon.").
 * - A "This icon" animation (quick document): it follows the new icon. Today follow-icon.ts treats
 *   `icon: svg` like a cleared icon and leaves the rig on the old shape (the rig would keep drawing
 *   mdi:lightbulb over the drawing). Fix in T11: explicitIcon/followIcons treat `svg` (geometry from
 *   the module's `svg` through svgGeometry) and `mcu:<id>` (through icon-source) as followable
 *   icons, re-split by piece index and embed rig.svg, as for any other icon change.
 * - Templates: Magic Card has no icon template. On a template-linked card, `icon` and `svg` are
 *   synced content keys: Done writes them as this card's override (not_synced icon and svg, the
 *   same path as any icon edit on a linked card); the template keeps its icon. Notice: "This card
 *   is linked to a template. Your drawing is used on this card only."
 * - Nothing else in the module is changed by Done.
 *
 * ── <mc-shape-studio> ──
 * Opened from the shape picker (design panel) by the "Custom" tile, "Edit as custom" or "Edit shape".
 * Properties: hass; value: ShapeEditorValue; customShapes: the card's custom_shapes;
 * libraryAvailable. Every value has a labelled field; canvas handles mirror the fields. Free path
 * mode uses <mc-path-canvas> with maxPaths 1 and a constrain hook that keeps each point's anchoring
 * (custom-shape 1.0.0). In free path mode the studio always writes `padding` (px per side, from its
 * inscribed-rectangle solver at the "Edit at" size, raised by "Extra space") and shows W6 when
 * content is cut at a preview size (custom-shape 1.0.0 Content inset).
 * Previews: three boxes (120 x 120, 360 x 120, 720 x 200) drawn with the runtime shapePath, so the
 * preview is the renderer, plus the real card behind the editor as today.
 * Events:
 * - `mc-shape-change` detail ShapeChangeDetail; `commit` false during drags. The host applies it
 *   through design-panel's ShapePatch (extended with custom_shapes) and pushes one history step
 *   per commit.
 * - `mc-shape-close` detail ShapeCloseDetail, from Done and from Back to card editor. The change
 *   events already applied everything (the card behind the editor is live), so there is nothing to
 *   confirm on leaving; the host closes the layer and returns focus to the opener.
 * Additive in T7 (2026-10-18, for the Architect to confirm): the properties `preset` ("Edit as custom":
 * the preset's `shape` and `shape_options`; the studio converts it, `Notch` becomes Bevel, `Ticket`,
 * `Wave` and `Blob` get a notice) and `label` (the target, "Living room tile"), and the event above.
 * Done after "Edit as custom" with no edit still sends one `mc-shape-change` so the card turns custom.
 * Recorded by the card editor (T8 / T11, 2026-10-18): the card editor uses all three as written (it sets
 * `preset` and `label`, writes on `mc-shape-change` with `commit` true, closes on `mc-shape-close`).
 *
 * Host rules found in the live check (HA 2026.10.2, src/editor/custom/layer.ts, T8 / T11):
 * - The layer is a modal <dialog> on <body> (top layer), not a child of the form: HA's card dialog
 *   transforms and clips, and the form re-renders on every committed change. The editors' ancestor
 *   <dialog> walk therefore finds none; the host covers Escape itself.
 * - HA's card dialog is a wa-dialog that also closes on a keydown that reaches its document-level key
 *   handling, not only on the browser's cancel. The editors' layer-root handler stops Escape only while
 *   focus is inside their shadow DOM; with focus on the editor element, the dialog or the page it did
 *   not, and the card dialog closed. The host stops Escape on the dialog (bubble) and on the window
 *   (capture, targets outside the layer), ignores `cancel`, and focuses the editor element on open.
 * - The entry button must stay enabled while the chunk loads (a disabled button drops focus, and focus
 *   returns to the opener, or its `data-focus-key` replacement).
 */

export const SVG_EDITOR_CONTRACT_VERSION = '1.0.0';
export const SVG_EDITOR_CONTRACT_REVISION = 2;
export const SVG_EDITOR_TAG = 'mc-svg-editor';
export const SVG_EDITOR_CHUNK = 'svg-editor';
export const SVG_EDITOR_CHUNK_FILE = 'magic-card-svg-editor.js';
export const SHAPE_EDITOR_TAG = 'mc-shape-studio';
export const SHAPE_EDITOR_CHUNK = 'shape-editor';
export const SHAPE_EDITOR_CHUNK_FILE = 'magic-card-shape-editor.js';

export type SvgEditorSource =
  | { kind: 'blank' }
  | { kind: 'icon'; icon: string }
  | { kind: 'svg'; svg: string }
  | { kind: 'library'; id: string };

/** What the host tells the editor about the module, for the notice (design 01 section 2b). */
export interface SvgEditorModuleFacts {
  /** The icon before, e.g. 'mdi:lightbulb' ('' = the entity's or type's icon). */
  icon: string;
  hasStateIcons: boolean;
  /** A library animation entry that Done will remove. */
  pickedAnimation: boolean;
  /** A "This icon" animation that will follow the drawing. */
  followsIcon: boolean;
  /** The card is linked to a template. */
  linked: boolean;
}

export interface SvgSaveDetail {
  target: 'module' | 'library';
  /** sanitizeSvg output. */
  svg: string;
  /** target 'library': the stored item (as the server returned it). */
  saved?: SavedIconInput;
  /** target 'library': also keep an inline copy in the card (custom_icons). */
  keepCopy?: boolean;
}

export interface ShapeEditorValue {
  shape: 'custom';
  shape_options: CustomShapeOptions;
}

/** "Edit as custom": the preset the studio starts from. */
export interface ShapeEditorPreset {
  shape: string;
  shape_options?: ShapeOptions;
}

export interface ShapeCloseDetail {
  done: boolean;
}

export interface ShapeChangeDetail {
  value: ShapeEditorValue;
  /** Inline copies to merge into the card's custom_shapes (set when `ref` is written). */
  customShapes?: Record<string, CustomShapeOptions>;
  commit: boolean;
  label: string;
}
