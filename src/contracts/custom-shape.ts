import type { AnchorKind } from './path-model';

/*
 * Contract: custom shape. Version 1.0.0 (Architect-owned). ADR 0017, ADR 0018.
 *
 * Config schema of `shape: custom` and the runtime corner / anchor builder that turns it into an
 * outline at the element's measured size.
 *
 * Implementation (runtime, magic-card.js): module `shape-runtime`
 * - src/utils/shape-custom.ts: resolveCustomShape() and buildCustom(); called by shape-path.ts for
 *   kind 'custom' (KINDS gains 'custom', types.ts ShapeKind gains 'custom', ShapeOptions gains the
 *   fields below). Uses path-model core only. Budget: see ADR 0019 (at most 2,560 B in magic-card.js).
 * - mc-shape.ts passes the element's shape_options through resolveCustomShape() with the card's
 *   ShapeLookup before calling shapePath. Everything downstream (clip, polygon fallback, border
 *   stroke, border length mask, focus ring, ring via shapeRingPath / shapeInsetPath, drop shadow
 *   wrapper, value background, flows via shapePoint, seasonal decorations) is unchanged: it reads
 *   the outline, not the options.
 * Editor: module `shape-editor` (lazy chunk) writes this schema; it never writes px paths.
 *
 * ── YAML (card `shape_options`, or `design.shape_options` on modules, rows, columns) ──
 *
 *   shape: custom
 *   shape_options:
 *     corner: 16             # every corner's size (existing key; px number, '16px' or '25%')
 *     corner_type: round     # every corner's type (default round)
 *     corners:               # per-corner overrides; any subset of tl, tr, br, bl
 *       tl: { type: bevel, size: 24 }
 *       br: notch            # short form: type only
 *       tr: 12               # short form: size only
 *     smoothing: 0.6         # squircle corners only, 0..1 (existing key)
 *     ref: ticket-left       # saved shape (mcu-library 1.0.0 / card custom_shapes)
 *     padding: 12            # content inset override: a length or {top, right, bottom, left}
 *
 *   Free path mode (replaces the corners when `points` is present):
 *     shape_options:
 *       points:
 *         - { x: 0, y: 0 }
 *         - { x: '100%-24', y: 0, kind: corner }
 *         - { x: '100%', y: 24 }
 *         - { x: '100%', y: '100%', in: [0, -8], out: [-8, 0], kind: symmetric }
 *         - { x: 0, y: '100%' }
 *
 * Rules:
 * - Lengths (corner, size, padding) follow parseShapeLength: px, or % of the element's shorter side.
 * - Coord: a number = px from the left / top edge; a string '<n>', '<n>px', '<p>%', '<p>%+<n>' or
 *   '<p>%-<n>' = p % of the width / height plus n px ('100%-24' = 24 px from the right / bottom).
 *   Resolved px are clamped to 0..w, 0..h. Handles `in` / `out` are px offsets from their resolved
 *   anchor (they do not stretch), then clamped into the box. So corners and notches keep their px
 *   size and only edges stretch (anchored, 9-slice behaviour).
 * - Points: 3 to MAX_SHAPE_POINTS, one closed subpath, clockwise or not (the builder normalises to
 *   clockwise). A self-intersecting outline is drawn as given (the editor warns).
 * - Corner clamp (as CSS border-radius): f = min(1, side / (size_a + size_b)) over the four sides;
 *   every corner size is multiplied by the same f. The outline never self-intersects in corner mode.
 * - Corner geometry, size s on both legs: square = the box corner; round = circular arc radius s;
 *   squircle = the squircle preset's corner at size s and `smoothing` (same function, so "Edit as
 *   custom" of a squircle matches); bevel = straight cut; scoop = concave quarter circle centred on
 *   the box corner; notch = concave square step to (s, s). Note: the PRESET named `notch` is a bevel
 *   (cut corners); "Edit as custom" maps it to corner_type bevel.
 * - Content inset (no inset ever shrinks as h grows, so content-sized elements do not oscillate):
 *   corner mode, per corner on both its sides: square 0, round 0.293 s, squircle the preset's
 *   formula, bevel 0.5 s, scoop 0.707 s, notch s; a side's inset is the larger of its two corners.
 *   Free path mode: per side, the largest inward px distance of points whose coordinate on that axis
 *   is anchored to that edge (0 % + n for top/left, 100 % - n for bottom/right), % parts measured on
 *   the shorter side. `padding` replaces the computed inset on the sides it names. Content then
 *   sits at max(inset, pad) as today.
 * - Inset outline (rings, inner border): corner mode = the same corners in the box shrunk by `off`
 *   with sizes adjusted (round/squircle s - off, bevel s - (2 - sqrt 2) off, scoop/notch s + off),
 *   within 1 px of a true offset. Free path mode = points resolved in the shrunk box (approximate).
 * - Unknown keys and invalid values are ignored one by one (a bad corner falls back to the shared
 *   corner / corner_type; fewer than 3 valid points falls back to corner mode). `shape: none` resets.
 * - No animation for custom shapes in 1.0.0 (`animate` is ignored). Unshaped elements pay nothing:
 *   no code in shape-custom.ts runs unless the kind is 'custom'.
 *
 * ── ref resolution (resolveCustomShape) ──
 * - base = lookup.library(ref) ?? lookup.inline(ref) (whole item, not merged with each other).
 *   library = mcu-library provider (window.magicCardUtils.shapes, mcu-library 1.0.0);
 *   inline = the card's `custom_shapes[ref]` (MagicCardConfig.custom_shapes, card level, shared by
 *   every element of the card; template-merged like custom_animations).
 * - result = base with the local options on top; `corners` merge per corner key; `points` and
 *   `padding` replace as a whole; `ref` itself is dropped. Same rule for template + local
 *   shape_options (template-merge.ts): only an overridden corner changes.
 * - ref unresolved: the local options alone (corner mode defaults when they hold nothing). When the
 *   provider fires `mcu-library-changed` for shapes, mc-shape re-resolves (one listener per page,
 *   added only when some element uses `ref`).
 * - The editor always writes an inline copy into `custom_shapes` when it sets `ref` (shapes are a
 *   few hundred bytes), so first paint never waits for the library and shared YAML keeps working.
 */

export const CUSTOM_SHAPE_CONTRACT_VERSION = '1.0.0';
export const MAX_SHAPE_POINTS = 64;
export const CUSTOM_SHAPE_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;

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
  padding?: ShapePadding;
  ref?: string;
}

/** What mc-shape hands resolveCustomShape (built per card from its config and the provider). */
export interface ShapeLookup {
  library(id: string): CustomShapeOptions | undefined;
  inline(id: string): CustomShapeOptions | undefined;
}

/** Card level (types.ts MagicCardConfig): saved-shape copies by id, used when the library lacks one. */
export type CustomShapesConfig = Record<string, CustomShapeOptions>;

/**
 * Runtime surface (src/utils/shape-custom.ts):
 * - resolveCustomShape(opts: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions
 *   (pure; returns the same object when nothing changes, so the shapePath memo key stays stable).
 * - buildCustom(w, h, opts, pad?) / buildCustomInset(w, h, opts, off): the Outline + inset that
 *   shape-path.ts already uses for presets (private type there).
 */
export interface CustomShapeRuntime {
  resolveCustomShape(opts: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions;
}
