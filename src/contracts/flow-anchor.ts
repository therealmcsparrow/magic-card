import type { FlowSide } from '../types';

/*
 * Contract: flow anchors. Version 1.1.0 (Architect-owned). ADR 0039. Task flow-anchors-polish.
 *
 * A flow end attaches to the module's main visual (its icon, picture or dial) by default, and to
 * the module's box only when the YAML says `box` or the module has no main visual (CEO Brief Gate
 * 2026-10-20).
 *
 * ── 1.1.0 (CEO Ship Gate 2026-10-20): the default depends on the look ──
 * When from_anchor / to_anchor is NOT set (or unknown), a flow with a WIDE look defaults to `box`;
 * a thin look keeps `icon`. Wide = isWideFlowLook(flow): line_style tube, cable, neon or zigzag,
 * or a swarm: `spacing_mode: random`, `size_variation` above 0, or `shape_alternate` set (Lead
 * decision, Fix round 1). `electric`, `spacing` and `motion` do not count, and neither does a swarm
 * key at its default value, an unknown `shape_alternate` value (only the shape list counts) or a
 * swarm key on a flow with no travelling shapes (`motion: pulse`, or no shapes: `dots` 0 without a spacing). The rule reads the flow's YAML keys, so a preset that sets a wide look is wide, and
 * removing the look removes the rule. An explicit `icon` or `box` always wins. The editor shows the
 * effective default in "Attach to"; it writes `icon` only when that differs from the look default
 * and removes the key when the pick equals the look default. Everything below is unchanged.
 *
 * The predicate lives in its own file, src/contracts/flow-anchor-wide.ts (isWideFlowLook), so that it
 * stays out of magic-card.js: the flow-look chunk calls it and puts the result in FlowLookResolved.wide.
 *
 * Providers: every module type in FLOW_ANCHOR_TYPES (marks its main visual in the
 * DOM, see "DOM seam"). Consumer: the flows Module (src/utils/flow.ts resolver, src/card/mc-flows.ts
 * overlay, both in magic-card.js) and the card editor's Flows tab (lazy editor chunk).
 *
 * ── YAML (flat keys on a flow, next to from_side / to_side; both optional) ──
 *   from_anchor: icon | box     to_anchor: icon | box
 * Unset = `icon` for a thin look, `box` for a wide look (1.1.0; the editor writes `icon` only to
 * override a wide look). `box` = the module's outer box,
 * exactly as before 2026.10.11-beta.4 (pixel-identical: a config with `box` on both ends of every
 * flow renders as at base eab1c7b). Any other value is treated as the look default (`icon` thin, `box` wide), the same
 * rule as from_side (an unknown side is `auto`), and is kept in YAML untouched.
 * `icon` on a module without a main visual, or whose visual is hidden, missing, zero-sized or
 * clipped away, falls back to the box silently (no error, no hint at runtime).
 *
 * ── Resolver (src/utils/flow.ts, magic-card.js) ──
 * ResolvedFlow gains `fromBox?: true` and `toBox?: true`, set when the key is exactly 'box', or
 * when it is not exactly 'icon' and the look is wide (1.1.0)
 * (absent otherwise, so ResolvedFlow JSON and sameFlows() stay small). FlowResolvedAnchors below.
 *
 * ── DOM seam (providers; one marker per module, rendered inside its .mc-module-wrapper) ──
 * A module's main visual is the first element matching FLOW_END_SELECTOR inside the wrapper whose
 * nearest `.mc-module-wrapper` ancestor is that wrapper (a nested module's visual never counts;
 * same rule as the particles icon collider, magic-card.ts _syncParticles). Two markers:
 *  - `.mc-anim-icon`: the existing main-icon hook (icon, button, info, light, weather). Unchanged;
 *    rendered only while the icon is shown, so a hidden icon falls back to the box by itself.
 *  - `data-mc-flow-end` (boolean attribute, no value): modules without an icon hook mark their
 *    main visual with it: image on `div.mc-image`, camera on `div.mc-camera` (camera-module.ts
 *    placeholder and camera-view.ts), gauge on its dial `<svg>` (all three gauge styles).
 * The marker never changes styling, animation targeting or accessibility. A new module opts in by
 * rendering one of the two markers and adding its type to FLOW_ANCHOR_TYPES (minor bump).
 *
 * ── Measuring (mc-flows measure(); never per frame) ──
 * For every drawn end module with a main visual V and measured wrapper box B (layoutBox(), content
 * px, already clipped), with k = B.w / wrapper.offsetWidth (layout px -> content px):
 *  1. HTML element V: its layout offset inside the wrapper's border box, summed along the
 *     offsetParent chain (offsetLeft / offsetTop of each element plus clientLeft / clientTop of each
 *     offsetParent below the wrapper, plus the wrapper's clientLeft / clientTop) until the chain
 *     reaches the wrapper (the wrapper is positioned on a card with flows, flows-css.ts). Size =
 *     offsetWidth / offsetHeight. Rect = { B.x + ox * k, B.y + oy * k, w * k, h * k }. Transforms on
 *     V, on the wrapper (tap scale, module animations) and in between never enter offsets, so an
 *     animated icon (spin, bounce, Living rig, tap scale) gives a still line end (AC5).
 *     The chain ends before the wrapper (offsetParent null, display: contents, fixed): fall back to B.
 *  2. SVG root V (no offsetParent: gauge dial, weather's animated icon): centre from the screen box
 *     relative to the wrapper's screen box, divided by the wrapper's screen scale
 *     (wrapper.getBoundingClientRect().width / offsetWidth; cancels tap scale), size from
 *     clientWidth / clientHeight (fallback: screen size / that scale). Rotations and scales of V
 *     about its centre (the default transform-origin) do not move the centre; a translating
 *     animation on V itself (weather icon with an icon-target bounce) can leave the end off by its
 *     travel until the next measure. Accepted and documented; never jitters (no per-frame read).
 *  3. Rect = intersect(that, B). Empty, or zero width / height: no anchor rect (box used).
 * Anchor rects have no `shape` (AC4: an icon-anchored end of a shaped module sits on the icon box).
 * mc-flows keeps them in a second map keyed by module id beside the box map, includes them in the
 * change key (re-render only when one changed), and adds each V to its ResizeObserver set so an
 * icon that resizes by layout moves the line in the same frame (AC6). Existing triggers (content and
 * wrapper resizes, MutationObserver, scroll / transitionend / animationend) are unchanged.
 *
 * ── Drawing ──
 * End rect = box when `fromBox` / `toBox`, else the anchor rect when there is one, else the box.
 * anchorSides, spreadAnchors and flowPath take the end rects unchanged (sides, `auto`, spreading and
 * ANCHOR_OFFSET apply to the icon box, AC4); spreadAnchors groups by end key (`id` for a box end,
 * `id` plus a suffix for an anchor end) so icon-anchored and box-anchored ends spread separately.
 * Layers, reduced motion, pause, caps and arrival effects follow from the geometry and are untouched
 * (AC7, AC8). A module with its own opaque background covers a `layer: back` line up to its icon,
 * caps included: docs say "use layer: front" (AC7).
 *
 * ── Label obstacles (brief AC9) ──
 * placeLabel() is unchanged. Its obstacle list per render = every measured module box, except that
 * a module which is the icon-anchored end of any drawn flow contributes its anchor rect instead of
 * its box; labels already placed are still added as they are placed. So a label may sit over the
 * empty part of an end module's box (the gap between two icons in a row) but never over an icon,
 * picture or dial, nor over any module that is not an icon-anchored end. Known trade-off: such a
 * label can cover that module's own text (a button name beside its icon); `label_position: side`
 * or `box` anchors avoid it. Card-wide (not per flow) to keep the code small.
 *
 * ── Editor (card-editor chunk, Flows tab, Connection group) ──
 * Under each endpoint picker, while the picked module's type is in FLOW_ANCHOR_TYPES: a labelled
 * native select "Attach to" (id flow-<i>-from-anchor / -to-anchor, same _keyField / _select pattern
 * as From side), options "Icon or picture" (value icon, the default, removes the key) and
 * "Module box" (writes `box`). An unknown value shows as "Icon or picture" and is not rewritten
 * until the user picks. One help line under the pair, aria-describedby from both selects:
 * "Icon or picture ends the line at the module's icon, picture or dial. Module box ends it at the
 * module's edge." Other module types: no control, no help line. Opening and saving a flow without
 * changes leaves YAML unchanged (AC11). Strings: en-GB ids in the card-editor namespace, en-US and
 * nl tables complete (check-i18n --ci). Keyboard and 200 % zoom as the existing selects.
 */

export const FLOW_ANCHOR_CONTRACT = '1.1.0';

/** YAML values of from_anchor / to_anchor. Unset (and anything unknown) = the look default (1.1.0). */
export type FlowAnchor = 'icon' | 'box';

export interface FlowAnchorConfig {
  /** Where the line attaches at the `from` module; unset = the look default (icon for a thin look, box for a wide one). */
  from_anchor?: FlowAnchor;
  /** Same for the `to` module. */
  to_anchor?: FlowAnchor;
}

/** Fields resolveFlow() adds to ResolvedFlow; present only when the end attaches to the box (YAML 'box', or the look default of a wide look). */
export interface FlowResolvedAnchors {
  fromBox?: true;
  toBox?: true;
}

/** The two main-visual markers (DOM seam). magic-card.js inlines this string once (mc-flows). */
export const FLOW_END_SELECTOR = '.mc-anim-icon,[data-mc-flow-end]';

/** Marker attribute for modules without an `.mc-anim-icon` hook. */
export const FLOW_END_ATTR = 'data-mc-flow-end';

/**
 * Module types that render a main visual (editor: "Attach to" is shown only for these; the
 * runtime never reads this list, it finds the marker). Editor-only import: keep it out of magic-card.js.
 */
export const FLOW_ANCHOR_TYPES: readonly string[] = ['icon', 'button', 'info', 'light', 'weather', 'image', 'camera', 'gauge'];

/** For reference: sides are still taken on the end rect (box or anchor). */
export type FlowAnchorSide = FlowSide | 'auto';
