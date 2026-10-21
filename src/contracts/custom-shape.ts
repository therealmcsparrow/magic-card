import type { AnchorKind } from './path-model';
import type { Outline } from '../utils/shape-path';

/*
 * Contract: custom shape. Version 1.0.0.
 *
 * Config schema of `shape: custom` and the runtime corner / anchor builder that turns it into an
 * outline at the element's measured size.
 *
 * Implementation (runtime), module `shape-runtime`, split in two:
 * - magic-card.js (sync, Core-adjacent glue, at most 2,560 B net):
 *   - src/utils/shape-ref.ts: resolveCustomShape() and mergeShapeOptions() (moved out of
 *     shape-custom.ts; template-merge.ts and shape-resolve.ts import them from here).
 *   - src/utils/shape-path.ts: KINDS has 'custom'; the shared helpers the builder imports
 *     (cornerArc, cornerCentres, dedupeSegs, translate, clamp, p, parseShapeLength, SHAPE_DEFAULTS);
 *     toPath, flatten, the memo and everything after the Outline. It holds the builder in a slot:
 *     useCustomBuilder(fn) sets it and clears the memo; build / buildInset of kind 'custom' return
 *     undefined while the slot is empty (and that undefined is never memoised).
 *   - src/utils/shape-custom-loader.ts (Core lazy-loader list, particles-loader.ts pattern):
 *     loadCustomShapes(): Promise<boolean> loads the chunk once, calls useCustomBuilder, resolves
 *     false and warns once when the load fails (no retry until reload); customShapesReady(): boolean.
 *   - src/card/shape-resolve.ts resolveShape(): for 'custom' without the builder it starts the load and returns
 *     undefined, so the element is drawn exactly as `shape: none` (no clip, no inset vars, no
 *     mc-shape, rectangle rings, flows on the box). The <mc-shape> element itself is in the `decor` chunk. It never paints a half-shaped state.
 *   - magic-card.ts: starts the load in setConfig when the raw config text contains
 *     `"shape":"custom"` (so a cached chunk usually lands before the first paint), and when any
 *     resolveShape call reported a pending custom shape; when the load resolves true and the card
 *     is connected it calls requestUpdate() once (particles pattern).
 * - dist/magic-card-shape-custom.js (lazy chunk, webpackChunkName "shape-custom"):
 *   src/utils/shape-custom.ts exports buildCustom() only (CustomShapeChunk below). It imports the
 *   shape-path helpers, which webpack takes from magic-card.js (splitChunks: false, available
 *   modules are not copied): the chunk must not contain shape-path.ts. Nothing else imports
 *   shape-custom.ts statically; the editors (card editor preview, shape editor) await
 *   loadCustomShapes() and re-render, so there is one copy of the builder.
 * Editor: module `shape-editor` (lazy chunk) writes this schema; it never writes px paths.
 * Everything downstream of the Outline (clip, polygon fallback, border stroke, border length mask,
 * focus ring, ring via shapeRingPath / shapeInsetPath, drop shadow wrapper, value background, flows
 * via shapePoint, seasonal decorations) is unchanged and stays in magic-card.js.
 *
 * ── First paint ──
 * - Cold page, first card with `shape: custom`: the card paints unshaped (as `shape: none`) until
 *   the chunk lands, then re-renders once shaped. The clip is written in that render and the inset
 *   vars one frame later, the same two-step settle every preset already has. The content can move
 *   by the shape's inset once; that is the accepted cost. No hidden state, no
 *   preset approximation (both need builder code in magic-card.js or risk a blank card).
 * - Warm page (chunk in memory, or registered by an editor chunk): resolveShape returns the shape
 *   on the first render; no unshaped frame.
 * - Load failure (offline, a stale dist): the element stays unshaped for the page's life; never
 *   blank, one console warning.
 * - Chromium 85-87: webpack's own chunk loader (script tag, public path from src/index.ts) works
 *   there; the chunk is ES2021 like the rest. The polygon fallback lives in magic-card.js and reads
 *   the path string, so it needs nothing from the chunk; the pending state is unshaped there too.
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
 * - Corner sizes: a corner that names a type but has no size anywhere gets 16 px; with neither
 *   `corner` nor `corner_type` the shared size is 0 (square), so `corners: { br: notch }` changes
 *   only br.
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
 *   padding). No inset ever shrinks as h grows, so content-sized elements do not oscillate. A
 *   custom shape's outline and inset never depend on pad (one memo entry per size).
 *   Corner mode (the no-cut promise holds here): per corner on both its sides: square 0,
 *     round 0.293 s, squircle 1 - 0.5^(1/n) s (the curve's 45 degree point), bevel 0.5 s, scoop
 *     0.707 s, notch s; a side's inset is the larger of its two corners. `padding` replaces the
 *     computed inset on the sides it names.
 *   Free path mode: the runtime derives nothing from the points. The inset is `padding` on the
 *     sides it names and 0 on the others. Deriving it from coordinates cut text in 5 of 22
 *     shapes and over-padded a folder tab to a 36 px text column.
 *     The shape editor ALWAYS writes `padding` for a free path: px per side, whole px rounded up,
 *     from an inscribed-rectangle solver run at the editor's "Edit at" size (weighs width over
 *     height; sides without a feature give 0: ticket notches, folder tab and bottom-left speech tail
 *     are the unit-test fixtures). The editor shows it as "Space for text";
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
 *   plain rectangle). `shape: none` resets. A shape is never the reason a card is blank.
 * - No animation for custom shapes in 1.0.0 (`animate` is ignored). Unshaped elements and preset
 *   shapes pay nothing: the chunk is never requested unless some element's kind is 'custom'.
 *
 * ── Pop-ups inside a shaped element ──
 * clip-path clips every painted descendant. Pop-ups therefore must not paint inside the element:
 * - Today every pop-up escapes the clip: the dropdown and light-effect modules use a native
 *   <select> (its open list is a browser / OS widget outside page painting), and the card pop-up
 *   is a native modal <dialog> in the top layer.
 * - Rule for any future module: a pop-up (menu, list, tooltip, picker) renders in the top layer
 *   (native control, <dialog> with showModal, or the popover attribute), never as an absolutely
 *   positioned child.
 * - So there is no runtime fix and no "no clip while open" mode. The editor's W7 is narrowed to
 *   what really clips: focus rings and hover / press scale of content touching the cut edge. A
 *   dropdown inside a shaped card opens correctly in Chrome desktop, Android WebView and iPad Safari.
 *
 * ── Performance budget (shaped elements) ──
 * Reference page: dev/shape-perf.html, 30 cards, each with a custom-shaped card plus 3 custom-shaped
 * modules (120 shaped elements, half of them free paths), Chrome with 4x CPU throttling:
 * - One ResizeObserver for all of them (the existing shared one, src/card/size-watch.ts watchSize); no
 *   per-element observer, no MutationObserver, no timers.
 * - Idle: zero animation-frame callbacks and zero timers from shape code over 10 s.
 * - First render: shape main-thread time for all 120 together <= SHAPE_FIRST_RENDER_BUDGET_MS, and
 *   no long task over 50 ms caused by shape code. A resize settles within 2 layout passes per
 *   element (converged in <= 2 rounds in 264 of 264 runs).
 * - How it is measured: scripts/t2-shape-perf.mjs, the dev bundle (readable names),
 *   CPU profile sampled at 200 us, median of 5 runs, from navigation until the page settles (both
 *   the unshaped render and the shaped re-render after the chunk lands). Shape time = the samples
 *   whose stack contains any of resolveShape, resolveCustomShape, shapePath, shapeInsetPath,
 *   shapeRingPath, shapePoint, shapeClip or the loader's then-callback, each sample counted once.
 *   That INCLUDES the shared outline code (memo key, build, toPath, flatten, polygon fallback): it is
 *   what the user waits for, and the presets meet it on the same page (33-40 ms). It EXCLUDES
 *   layout and style work (borderBoxSize, getComputedStyle, style writes), the chunk's fetch, parse
 *   and evaluation, and Lit rendering. The same script reports the preset page as a control.
 * - The Node micro-benchmark (tests/shape-custom-perf.test.ts, 120 x 4 builds <= 12.5 ms at 1x)
 *   stays as the regression guard in CI-less runs; it does not replace the page measure.
 * - buildCustom results are memoised per (w, h, off, resolved options) in shape-path's memo.
 * - A provider `mcu-library-changed` event for shapes re-renders every card that has looked up a
 *   ref (one listener per such card, removed on disconnect; no id filter: a library save is rare).
 * Lowest supported engine: Chromium 85 / Android System WebView 85 (the build targets ES2021, see
 * tsconfig). clip-path path() is used where CSS.supports says so (Chromium 88+); older engines get
 * the polygon fallback, which custom shapes share with the presets (only cut edges become facets).
 *
 * ── ref resolution (resolveCustomShape, magic-card.js) ──
 * - base = lookup.library(ref) ?? lookup.inline(ref) (whole item, not merged with each other).
 *   library = mcu-library provider (window.magicCardUtils.shapes, mcu-library 1.0.0); it answers
 *   undefined until the provider is ready and for unknown ids, so first paint is the inline copy
 *   and never waits. inline = the card's `custom_shapes[ref]` (MagicCardConfig.custom_shapes, card
 *   level, shared by every element of the card).
 * - Resolution runs whether or not the chunk has loaded (it is sync and in magic-card.js); only
 *   the build waits for the chunk.
 * - A `ref` is a live link (the user chose `Use`; the UI says it "changes every card that uses
 *   it"): once the provider holds the item, the library version wins, and a library save
 *   re-renders the cards that use it. `Use as copy` / `Customise a copy` write options inline
 *   without `ref`, so they never change unprompted. Deleting or losing the library item never
 *   changes the card: the inline copy takes over.
 * - Fallback chain: library item -> inline copy -> the local options alone -> corner
 *   mode defaults (square). The editor shows a notice; the runtime is silent.
 * - result = base with the local options on top; `corners` merge per corner key; `points` and
 *   `padding` replace as a whole; `ref` itself is dropped. Same rule for template + local
 *   shape_options (template-merge.ts, only when both sides are `shape: custom`): only an overridden
 *   corner changes.
 * - The editor always writes an inline copy into `custom_shapes` when it sets `ref` (shapes are a
 *   few hundred bytes), refreshes the copies of the card's refs from the library whenever it opens
 *   the card, and on every save removes `custom_shapes` entries that no element of the card uses.
 * - Template-linked cards: `custom_shapes` is template-merged like `custom_animations` (the card's
 *   entry wins per id; TEMPLATE_CARD_KEYS gains it).
 */

export const CUSTOM_SHAPE_CONTRACT_VERSION = '1.0.0';
export const CUSTOM_SHAPE_CONTRACT_REVISION = 4;
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
 * by src/utils/shape-custom-loader.ts and handed to shape-path's useCustomBuilder().
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
