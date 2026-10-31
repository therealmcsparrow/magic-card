import type { AnchorKind } from './path-model';
import type { Outline } from '../utils/shape-path';

/**
 * Contract: custom shape. Version 1.0.0. Config schema of `shape: custom` and the runtime corner / anchor builder. */

export const CUSTOM_SHAPE_CONTRACT_VERSION = '1.0.0';
export const CUSTOM_SHAPE_CONTRACT_REVISION = 5;
export const MAX_SHAPE_POINTS = 64;
export const CUSTOM_SHAPE_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
/** Editor W6: a text line sample farther than this outside the outline counts as cut (px). */
export const CUT_TOLERANCE_PX = 2;
/** Lowest Chromium the card (and the polygon fallback) is promised for: build target ES2021. */
export const MIN_CHROMIUM = 85;
/** The builder's lazy chunk. Its CAPS entry is its measured size + 5 %, rounded up to 1 KiB. */
export const CUSTOM_SHAPE_CHUNK = 'magic-card-shape-custom.js';
/** Hard ceiling of that chunk (B). More than this means shape-path.ts was copied into it. */
export const CUSTOM_SHAPE_CHUNK_CEILING = 5_120;
/** Reference page, 120 shaped elements, 4x CPU throttle: shape main-thread time on first render (ms). */
export const SHAPE_FIRST_RENDER_BUDGET_MS = 50;

export type CornerType = 'round' | 'squircle' | 'bevel' | 'scoop' | 'notch' | 'square';
export const CORNER_TYPES: readonly CornerType[] = ['round', 'squircle', 'bevel', 'scoop', 'notch', 'square'];
export type CornerKey = 'tl' | 'tr' | 'br' | 'bl';

/** px number, '16', '16px' or '25%' (of the shorter side). */
export type ShapeLength = number | string;

/** Long form, or a type only, or a size only. */
export type CornerSpec = CornerType | ShapeLength | { type?: CornerType; size?: ShapeLength };

/** number = px from left/top; '<n>', '<n>px', '<p>%', '<p>%+<n>', '<p>%-<n>'. */
export type AnchoredCoord = number | string;

export interface AnchoredPoint {
  x: AnchoredCoord;
  y: AnchoredCoord;
  /** Handle offsets in px from the resolved anchor. */
  in?: [number, number];
  out?: [number, number];
  kind?: AnchorKind;
}

export type ShapePadding = ShapeLength | { top?: ShapeLength; right?: ShapeLength; bottom?: ShapeLength; left?: ShapeLength };

/** The `shape: custom` fields of ShapeOptions (types.ts adds them as optional keys). */
export interface CustomShapeOptions {
  corner?: ShapeLength;
  corner_type?: CornerType;
  corners?: Partial<Record<CornerKey, CornerSpec>>;
  smoothing?: number | string;
  points?: AnchoredPoint[];
  /** Corner mode: optional override. Free path mode: the only inset (the editor always writes it, px per side). */
  padding?: ShapePadding;
  ref?: string;
}

/** What mc-shape hands resolveCustomShape (built per card from its config and the provider). */
export interface ShapeLookup {
  /** undefined until the provider is ready, and for unknown ids. */
  library(id: string): CustomShapeOptions | undefined;
  inline(id: string): CustomShapeOptions | undefined;
}

/** Card level (types.ts MagicCardConfig): saved-shape copies by id, used when the library lacks one. */
export type CustomShapesConfig = Record<string, CustomShapeOptions>;

/**
 * Sync surface in magic-card.js (src/utils/shape-ref.ts):
 * - resolveCustomShape(opts, lookup?) (pure; returns the same object when there is no ref, so the
 *   shapePath memo key stays stable) and mergeShapeOptions(base, over).
 */
export interface CustomShapeRuntime {
  resolveCustomShape(opts: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions;
  mergeShapeOptions(base: CustomShapeOptions, over: CustomShapeOptions): CustomShapeOptions;
}

/**
 * The lazy chunk's module (src/utils/shape-custom.ts, dist/magic-card-shape-custom.js), loaded only
 * by src/utils/shape-custom-loader.ts, which keeps its buildCustom as the builder shape-path reads.
 * buildCustom(w, h, opts, off = 0): the outline and content inset of a w x h box; off > 0 = the
 * shape moved off px inward in the same box (rings, inner border). Pure, no DOM, no padding input.
 */
export interface CustomShapeChunk {
  buildCustom(w: number, h: number, opts: CustomShapeOptions, off?: number): Outline;
}

/** Magic-card.js side of the loader (src/utils/shape-custom-loader.ts). */
export interface CustomShapeLoader {
  /** Loads the chunk once and registers the builder; false (and one warning) when it cannot load. */
  loadCustomShapes(): Promise<boolean>;
  /** The builder is registered (never starts a load). */
  customShapesReady(): boolean;
}
