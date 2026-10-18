import type { AnchorKind } from './path-model';

/*
 * Contract: custom shape. Version 1.0.0 (Architect-owned). ADR 0017, ADR 0018, ADR 0020.
 * Revision 2 (2026-10-18, before any implementation, ADR 0020): free-path content inset after
 * spike S2 (runtime fallback 0, editor writes `padding`, no-cut is warn-only for free paths);
 * ref resolution order spelled out (first paint, never blank); pop-ups and the shaped-element
 * performance budget; card-level copies are pruned and template-merged.
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
 *     padding: 12            # content inset: a length or {top, right, bottom, left}
 *
 *   Free path mode (replaces the corners when `points` is present):
 *     shape_options:
 *       points:
 *         - { x: 0, y: 0 }
 *         - { x: '100%-24', y: 0, kind: corner }
 *         - { x: '100%', y: 24 }
 *         - { x: '100%', y: '100%', in: [0, -8], out: [-8, 0], kind: symmetric }
 *         - { x: 0, y: '100%' }
 *       padding: { top: 0, right: 24, bottom: 0, left: 0 }   # written by the editor (see Content inset)
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
 *
 * - Content inset. Content sits at max(inset, pad) per side, as today (pad = the element's own
 *   padding). No inset ever shrinks as h grows, so content-sized elements do not oscillate.
 *   Corner mode (the no-cut promise holds here): per corner on both its sides: square 0,
 *     round 0.293 s, squircle the preset's formula, bevel 0.5 s, scoop 0.707 s, notch s; a side's
 *     inset is the larger of its two corners. `padding` replaces the computed inset on the sides
 *     it names.
 *   Free path mode: the runtime derives nothing from the points. The inset is `padding` on the
 *     sides it names and 0 on the others. Spike S2: deriving it from coordinates cut text in 5 of 22
 *     shapes and over-padded a folder tab to a 36 px text column.
 *     The shape editor ALWAYS writes `padding` for a free path: px per side, whole px rounded up,
 *     from an inscribed-rectangle solver run at the editor's "Edit at" size (weighs width over
 *     height; sides without a feature give 0: ticket notches, folder tab and bottom-left speech tail
 *     are the unit-test fixtures from spike/s2/page.js). The editor shows it as "Space for text";
 *     the user may raise a side ("Extra space", only raises). When the points change the editor
 *     recomputes: new side = max(new solver value, old stored value if it differed from the old
 *     solver value, else 0), so a user's raise survives an edit.
 *     `padding` is optional in YAML (hand-written shapes): without it the inset is 0.
 *     The editor writes px only for free paths. A hand-written % padding resolves on the shorter
 *     side like every length (it may settle at a different height from a cold or a warm start; the
 *     editor converts it to px when it opens the shape).
 *     There is no `%` edge anchor and no "% parts on the shorter side" rule (removed: unreachable).
 *   No-cut is NOT promised for free paths in 1.0.0. Curved or pointed outlines (leaf, shield, lens)
 *     have no size-independent inset: the editor previews the real content at the three preview
 *     sizes and the "Edit at" size and shows W6 when a text line lies more than CUT_TOLERANCE_PX
 *     outside the outline; the user raises "Space for text" or sets a min height. The runtime never
 *     measures content.
 * - Inset outline (rings, inner border): corner mode = the same corners in the box shrunk by `off`
 *   with sizes adjusted (round/squircle s - off, bevel s - (2 - sqrt 2) off, scoop/notch s + off),
 *   within 1 px of a true offset. Free path mode = points resolved in the shrunk box (approximate).
 * - Unknown keys and invalid values are ignored one by one (a bad corner falls back to the shared
 *   corner / corner_type, then square; fewer than 3 valid points falls back to corner mode, then the
 *   plain rectangle). `shape: none` resets. A shape is never the reason a card is blank (design R1,
 *   R2).
 * - No animation for custom shapes in 1.0.0 (`animate` is ignored). Unshaped elements pay nothing:
 *   no code in shape-custom.ts runs unless the kind is 'custom'.
 *
 * ── Pop-ups inside a shaped element ──
 * clip-path clips every painted descendant. Pop-ups therefore must not paint inside the element:
 * - Today every pop-up escapes the clip: the dropdown and light-effect modules use a native
 *   <select> (its open list is a browser / OS widget outside page painting), and the card pop-up
 *   is a native modal <dialog> in the top layer.
 * - Rule for any future module: a pop-up (menu, list, tooltip, picker) renders in the top layer
 *   (native control, <dialog> with showModal, or the popover attribute), never as an absolutely
 *   positioned child. Code review checks this.
 * - So there is no runtime fix and no "no clip while open" mode. The editor's W7 is narrowed to
 *   what really clips: focus rings and hover / press scale of content touching the cut edge. T2's
 *   proof opens a dropdown inside a shaped card in Chrome desktop, Android WebView and iPad Safari.
 *
 * ── Performance budget (shaped elements) ──
 * Reference page: 30 cards, each with a custom-shaped card plus 3 custom-shaped modules (120 shaped
 * elements, half of them free paths), Chrome with 4x CPU throttling:
 * - One ResizeObserver for all of them (the existing shared one, mc-ring.ts watchSize); no
 *   per-element observer, no MutationObserver, no timers.
 * - Idle: zero animation-frame callbacks and zero timers from shape code over 10 s.
 * - First render: shape resolve + build + clip write for all 120 together <= 50 ms of main-thread
 *   time, and no long task over 50 ms caused by shape code. A resize settles within 2 layout passes
 *   per element (S2: converged in <= 2 rounds in 264 of 264 runs).
 * - buildCustom is memoised per (w, h, resolved options); a provider change event re-resolves only
 *   the elements whose `ref` is listed in the event.
 * Lowest supported engine: Chromium 85 / Android System WebView 85 (the build targets ES2021, see
 * tsconfig). clip-path path() is used where CSS.supports says so (Chromium 88+); older engines get
 * the polygon fallback, which custom shapes share with the presets (only cut edges become facets).
 *
 * ── ref resolution (resolveCustomShape) ──
 * - base = lookup.library(ref) ?? lookup.inline(ref) (whole item, not merged with each other).
 *   library = mcu-library provider (window.magicCardUtils.shapes, mcu-library 1.0.0); it answers
 *   undefined until the provider is ready and for unknown ids, so first paint is the inline copy
 *   and never waits. inline = the card's `custom_shapes[ref]` (MagicCardConfig.custom_shapes, card
 *   level, shared by every element of the card).
 * - A `ref` is a live link (the user chose `Use`; the UI says it "changes every card that uses
 *   it"): once the provider holds the item, the library version wins, and a library save
 *   re-resolves the elements that use it. `Use as copy` / `Customise a copy` write options inline
 *   without `ref`, so they never change unprompted. Deleting or losing the library item never
 *   changes the card: the inline copy takes over.
 * - Fallback chain (design R5): library item -> inline copy -> the local options alone -> corner
 *   mode defaults (square). The editor shows the R5 notice; the runtime is silent.
 * - result = base with the local options on top; `corners` merge per corner key; `points` and
 *   `padding` replace as a whole; `ref` itself is dropped. Same rule for template + local
 *   shape_options (template-merge.ts): only an overridden corner changes.
 * - When the provider fires `mcu-library-changed` for shapes, mc-shape re-resolves (one listener per
 *   page, added only when some element uses `ref`).
 * - The editor always writes an inline copy into `custom_shapes` when it sets `ref` (shapes are a
 *   few hundred bytes), refreshes the copies of the card's refs from the library whenever it opens
 *   the card, and on every save removes `custom_shapes` entries that no element of the card uses.
 * - Template-linked cards: `custom_shapes` is template-merged like `custom_animations` (the card's
 *   entry wins per id; TEMPLATE_CARD_KEYS gains it).
 */

export const CUSTOM_SHAPE_CONTRACT_VERSION = '1.0.0';
export const CUSTOM_SHAPE_CONTRACT_REVISION = 2;
export const MAX_SHAPE_POINTS = 64;
export const CUSTOM_SHAPE_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
/** Editor W6: a text line sample farther than this outside the outline counts as cut (px). */
export const CUT_TOLERANCE_PX = 2;
/** Lowest Chromium the card (and the polygon fallback) is promised for: build target ES2021. */
export const MIN_CHROMIUM = 85;

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
 * Runtime surface (src/utils/shape-custom.ts):
 * - resolveCustomShape(opts: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions
 *   (pure; returns the same object when nothing changes, so the shapePath memo key stays stable).
 * - buildCustom(w, h, opts, pad?) / buildCustomInset(w, h, opts, off): the Outline + inset that
 *   shape-path.ts already uses for presets (private type there).
 */
export interface CustomShapeRuntime {
  resolveCustomShape(opts: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions;
}
