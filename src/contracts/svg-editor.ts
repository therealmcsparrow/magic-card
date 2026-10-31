import type { CustomShapeOptions } from './custom-shape';
import type { ShapeOptions } from '../types';
import type { SavedIconInput, SavedShape } from './mcu-library';
import type { SavedImageInput } from './mcu-library-images';
import type { BooleanOp } from './path-booleans';
import type { IntakePolicy } from './svg-intake';

/**
 * Contract: svg editor. Version 1.2.0 (SVG_EDITOR_CONTRACT_VERSION), element revision 7
 * (SVG_EDITOR_CONTRACT_REVISION). SVG editor and shape editor hosts.
 */

export const SVG_EDITOR_CONTRACT_VERSION = '1.2.0';
/** Revision number of <mc-svg-editor> (static contractRevision); the Magic Card Utils panel checks it against SVG_EDITOR_MCU_MIN_REVISION. */
export const SVG_EDITOR_CONTRACT_REVISION = 7;
export const SVG_EDITOR_TAG = 'mc-svg-editor';
/**
 * Elements of the card editor chunk (module-editor contract) that the SVG editor uses by tag, never by import:
 * `mc-icon-picker` in Start from > An icon (props `hass`, `value`, `label`; event `value-changed` { value }).
 * Defined once loadEditor() resolved; without it the editor shows a plain name field.
 */
export const SVG_EDITOR_EXTERNAL_TAGS: readonly string[] = ['mc-icon-picker'];
export const SVG_EDITOR_CHUNK = 'svg-editor';
export const SVG_EDITOR_CHUNK_FILE = 'magic-card-svg-editor.js';
export const SHAPE_EDITOR_TAG = 'mc-shape-studio';
export const SHAPE_EDITOR_CHUNK = 'shape-editor';
export const SHAPE_EDITOR_CHUNK_FILE = 'magic-card-shape-editor.js';

/** Grid size choices in viewBox units (24 x 24 artboard). */
export const SVG_GRID_STEPS: readonly number[] = [0.5, 1, 2, 3, 4];
export const SVG_GRID_DEFAULT = 1;
export const SVG_GRID_MIN = 0.1;
export const SVG_GRID_MAX = 12;
/** Boolean ops each editor offers. */
export const SVG_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];
export const SHAPE_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect'];
/** What Align is relative to, and the safe-area inset at 24 x 24. */
export const SVG_ALIGN_TARGETS = ['selection', 'canvas', 'safe'] as const;
export const SVG_SAFE_INSET = 2;

/** Who hosts the editors. */
export const SVG_EDITOR_HOSTS = ['card', 'mcu'] as const;
/** The lowest element contractRevision the Magic Card Utils panel accepts. */
export const SVG_EDITOR_MCU_MIN_REVISION = 5;
/** Group nesting cap. A top-level group is level 1. */
export const MAX_GROUP_DEPTH = 4;
/** A layer drag starts after this many CSS px; edge auto-scroll zone. */
export const DRAG_START_PX = 4;
export const DRAG_EDGE_PX = 32;
/** How Home Assistant draws secondary_path (preview strip). */
export const HA_SECONDARY_OPACITY = 0.5;
/** Neutral preview colours in the MCU host (HA's default state icon and accent colours). */
export const MCU_PREVIEW_MAIN = '#44739e';
export const MCU_PREVIEW_ACCENT = '#ff9800';

/** The shape editor's top-level mode switch. */
export type ShapeEditorMode = 'corners' | 'free';
export type SvgAlignTarget = (typeof SVG_ALIGN_TARGETS)[number];
export type SvgAlignEdge = 'left' | 'centre' | 'right' | 'top' | 'middle' | 'bottom';
export type SvgArrange = 'front' | 'forward' | 'backward' | 'back';
export type SvgEditorHost = (typeof SVG_EDITOR_HOSTS)[number];

/** A place in the layer tree. parent null = top level; index in tree order, top = 0. */
export interface TreePlace {
  parent: string | null;
  index: number;
}

export type SvgEditorSource =
  | { kind: 'blank' }
  | { kind: 'icon'; icon: string }
  | { kind: 'svg'; svg: string }
  | { kind: 'library'; id: string }
  /** Image mode (image-editor 1.0.0). No size: the canvas-size step opens first. */
  | { kind: 'image-blank'; width?: number; height?: number }
  /** A library image. */
  | { kind: 'image'; id: string }
  /** A file opened as a new image. */
  | { kind: 'image-svg'; svg: string };

/** What the host tells the editor about the module, for the notice. */
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
  target: 'module' | 'library' | 'image-library';
  /** sanitizeSvg output; for target 'image-library' the sanitised image markup. */
  svg: string;
  /** target 'library': the stored item (as the server returned it). target 'image-library': what was sent to images_save. */
  saved?: SavedIconInput | SavedImageInput;
  /** target 'library': also keep an inline copy in the card (custom_icons). */
  keepCopy?: boolean;
}

export type SvgSaveTarget = SvgSaveDetail['target'];

/** Section "Profiles": which profile the source kind picks. */
export type EditorProfileName = 'icon' | 'image';
/** One place in the shared top bar (section "Profiles"). */
export type TopBarSlot = 'back' | 'title' | 'start' | 'name' | 'undo-redo' | 'size' | 'canvas' | 'reference' | 'transfer' | 'more' | 'save' | 'done' | 'shortcuts' | 'preview';
/** One entry of the shared start window (section "Profiles"). */
export type StartEntry = 'blank' | 'icon' | 'canvas-size' | 'paste' | 'open-file' | 'library' | 'import';

/** What one profile sets. No such object exists at run time: the shell follows it in fixed code order (section "Profiles"). */
export interface EditorProfile {
  readonly name: EditorProfileName;
  readonly topBar: readonly TopBarSlot[];
  /** The bar of a read-only drawing; absent: the profile never opens read-only. */
  readonly readOnlyTopBar?: readonly TopBarSlot[];
  readonly start: readonly StartEntry[];
  /** Open file goes through readFile(file, intake). */
  readonly intake: IntakePolicy;
  /** Paste goes through refuseText(text, pasteMaxChars). */
  readonly pasteMaxChars: number;
  readonly saveTargets: readonly SvgSaveTarget[];
}

/** Top bar order, left to right (DOM, visual and Tab order). */
export const ICON_TOP_BAR: readonly TopBarSlot[] = ['back', 'title', 'start', 'name', 'undo-redo', 'size', 'transfer', 'save', 'done', 'shortcuts'];
export const IMAGE_TOP_BAR: readonly TopBarSlot[] = ['back', 'title', 'start', 'name', 'undo-redo', 'canvas', 'reference', 'transfer', 'more', 'save', 'shortcuts'];
export const IMAGE_READONLY_TOP_BAR: readonly TopBarSlot[] = ['back', 'title', 'name', 'transfer'];
/** Start window tiles in order (DOM, visual and Tab order); 'import' is the button under them. */
export const ICON_START: readonly StartEntry[] = ['blank', 'icon', 'paste', 'open-file', 'library', 'import'];
export const IMAGE_START: readonly StartEntry[] = ['canvas-size', 'paste', 'open-file'];

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

/** Host 'mcu': the stored item as the server returned it. */
export interface ShapeSaveDetail {
  saved: SavedShape;
}

export interface ShapeChangeDetail {
  value: ShapeEditorValue;
  /** Inline copies to merge into the card's custom_shapes (set when `ref` is written). */
  customShapes?: Record<string, CustomShapeOptions>;
  commit: boolean;
  label: string;
}
