import type { CustomShapeOptions } from './custom-shape';
import type { SavedIconInput } from './mcu-library';

/*
 * Contract: SVG editor and shape editor hosts. Version 1.0.0 (Architect-owned). ADR 0016.
 *
 * Two lazy chunks of the magic-card entry, each loaded by the card-editor chunk (never by
 * magic-card.js, which gains 0 B from them):
 * - module `svg-editor`, src/svg-editor/, chunk SVG_EDITOR_CHUNK_FILE, element SVG_EDITOR_TAG.
 * - module `shape-editor`, src/shape-editor/, chunk SHAPE_EDITOR_CHUNK_FILE, element SHAPE_EDITOR_TAG.
 * Both import() the path-canvas chunk (path-canvas 1.0.0) when they open and take the editor-only
 * path-model parts (edit, tidy, draw) from its exports (one copy rule, path-canvas.ts). Modules
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
 * ── <mc-svg-editor> ──
 * Opened by the module icon editor ("Draw or edit icon") as a full-screen dialog.
 * Properties: hass; source: SvgEditorSource; libraryAvailable: boolean (icons_list answered);
 * savedId?: string (editing a library icon). Exactly one artboard, viewBox default 0 0 24 24.
 * Save path, always: the document is serialised, passed through sanitizeSvg, tidied (path-model
 * tidy) and checked against SVG_MAX_BYTES; a sanitiser error or the size cap blocks the save with
 * the reason. The markup in the event is the sanitiser's output, never the editor's own string.
 * Pasted / imported SVG goes through sanitizeSvg before it reaches the document, and the editor
 * lists what was dropped (customSvgWarning text).
 * Events (bubbling, composed):
 * - `mc-svg-save` detail SvgSaveDetail. The host writes the module: target 'module' ->
 *   { icon: 'svg', svg }; target 'library' -> the editor has already called icons_save
 *   (mcu-library 1.0.0) and the host writes { icon: 'mcu:<id>' }, plus custom_icons[id] = svg when
 *   keepCopy.
 * - `mc-svg-close` detail { dirty: boolean } after the user confirmed leaving unsaved work.
 * Start from an icon uses icon-source resolveIconGeometry (Home Assistant's icon DB through the
 * probe, or an installed pack): no MDI data is bundled.
 *
 * ── <mc-shape-studio> ──
 * Opened from the shape picker (design panel) by the "Custom" tile or "Edit as custom".
 * Properties: hass; value: ShapeEditorValue; customShapes: the card's custom_shapes;
 * libraryAvailable. Every value has a labelled field (number + unit, corner type select, link
 * toggles); canvas handles mirror the fields. Free path mode uses <mc-path-canvas> with maxPaths 1
 * and a constrain hook that keeps each point's anchoring (custom-shape 1.0.0).
 * Previews: three boxes (120 x 120, 360 x 120, 720 x 200) drawn with the runtime shapePath, so the
 * preview is the renderer, plus the real card behind the editor as today.
 * Events:
 * - `mc-shape-change` detail ShapeChangeDetail; `commit` false during drags. The host applies it
 *   through design-panel's ShapePatch (extended with custom_shapes) and pushes one history step
 *   per commit.
 */

export const SVG_EDITOR_CONTRACT_VERSION = '1.0.0';
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

export interface ShapeChangeDetail {
  value: ShapeEditorValue;
  /** Inline copies to merge into the card's custom_shapes (set when `ref` is written). */
  customShapes?: Record<string, CustomShapeOptions>;
  commit: boolean;
  label: string;
}
