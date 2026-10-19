import type { TemplateResult } from 'lit';
import type { CardModule } from '../types';

/*
 * Contract: layer placement (background and overlay modules). Version 1.0.0 (Architect-owned).
 * ADR 0038. Task background-layers (brief 01-product-manager.md, design 03-ui-ux-designer.md).
 *
 * Seam: the layer-placement Module (src/layers/placement.ts + src/layers/layer-css.ts, in
 * magic-card.js, pure, no lit import in placement.ts) reads the two module keys below and tells the
 * render pipeline (Core, src/card/magic-card.ts) and the layout modules (horizontal, vertical, tabs,
 * row module columns, through src/modules/render-module.ts renderChildren()) in which DOM order to
 * render a container's children, which attributes and inline style each wrapper gets, and which
 * children are hoisted to the row or the card. Core gains one hook (arrange + hoist), no new Core item.
 *
 * ── YAML (module level, any module type; NOT inside `design`) ──
 *   placement: flow | background | overlay      absent = flow (video-bg exception below)
 *   layer:                                      read only when placement is background / overlay
 *     fill: container | row | card              background only; default container. row / card only
 *                                               for a module directly in a card grid column (or a row
 *                                               module column); anywhere else it reads as container.
 *     anchor: top-left | top | top-right | left | center | right | bottom-left | bottom | bottom-right
 *                                               overlay only; default top-left (editor writes it)
 *     offset_x, offset_y: CSS length, px or %   overlay only; default 0. On an edge axis the value is
 *                                               clamped to >= 0 (inward from that edge). On a centred
 *                                               axis (top/center/bottom for x, left/center/right for y)
 *                                               it is signed: + moves right / down.
 *     opacity: 0-100 (%)                        default 100
 *     blur: 0-40 (px)                           default 0
 *     blend: normal | multiply | screen | overlay | darken | lighten | soft-light   default normal
 *     click_through: boolean                    default true for background, false for overlay
 *     scrim:                                    absent = no scrim
 *       style: dim | bottom | top | left | right   dim = flat; others = gradient from that edge
 *       color: CSS colour or `card` (card background colour); default black
 *       strength: 0-90 (%)                      default 60
 * Values outside a range are clamped; unknown enum values fall back to the default. Keys are not part
 * of DesignConfig: conditional design rules and the Hover view never change placement or layer.
 * Configs without `placement` render exactly as before (golden run, AC "pixel for pixel").
 *
 * video-bg (CEO Q1): without a `placement` key it keeps today's behaviour and today's CSS (css.ts
 * `.mc-video-bg--media` rules): a background when it has a sibling, a normal block when alone. Those
 * legacy selectors gain `:not([data-mc-placement])` so an explicit placement (any value) takes the
 * path below instead. The editor shows the implicit state as Background (with siblings) or In flow.
 *
 * ── Measuring (designer Q-UX3: yes) ──
 * Fill and anchor offsets are measured from the container's padding box, i.e. its outer edge inside
 * any border; the container's padding is ignored (absolute positioning, inset 0).
 *
 * ── In-flow fallback ──
 * A container whose visible children are all background / overlay renders them in flow (as if
 * placement were flow), so it never collapses to zero height. Visible = the same predicate the
 * render uses (display conditions; in edit mode hidden modules still count). fill row / card: when
 * the row / card has no visible in-flow module at all, the module renders in flow in its column.
 *
 * ── Stacking (bottom to top). Final order; supersedes the brief's guess ──
 * Card content (.mc-card-content, isolated when it has layers, seasonal, value bg or flows):
 *   1 content's own CSS background (`background`, `background_image`)            unchanged
 *   2 card `background_layers`, back to front (<mc-bg-stack>, z -1, first child)  bg-stack 1.0.0
 *   3 seasonal back (z -1)                                                       unchanged
 *   4 card animation fx (z -1)                                                   unchanged
 *   5 card value background (z -1)                                               unchanged
 *   6 fill: card background modules (z -1, rendered after 5)                     new
 *   7 flows `layer: back` (z 0, flows cards only)                                flows Module
 *   8 rows and their content (auto; module wrappers z 1 in a flows card)         unchanged
 *   9 seasonal front (auto, after the rows)                                      unchanged
 *  10 flows `layer: front` and flow labels (z 2)                                 flows Module
 * Note: today seasonal back paints under the card value background (DOM order at equal z); the
 * brief's "value bg < seasonal back" is not what ships today, so the shipped order is kept.
 * Inside a container with layers (column, row for fill: row, .mc-horizontal, .mc-vertical,
 * .mc-tabs-content; `data-mc-layers`, position relative, isolation isolate):
 *   a container's own CSS background                                           unchanged
 *   b its value background and animation fx (z -1)                             unchanged
 *   c background modules (z -1, DOM after b; later in config = in front)       new
 *   d in-flow modules (auto)                                                   unchanged
 *   e overlays (z-index 2 + rank, rank = config index among the container's overlays, max 40)
 *   f a wrapper with :focus-within (position relative, z-index 50): its focus ring is never covered
 * Shapes, rings and border fx of the container keep their current z (above a to e).
 *
 * ── DOM order inside a container (= keyboard focus order) ──
 *   1 overlays anchored top-left, top, top-right (in that order, ties: config order)
 *   2 in-flow modules (config order)
 *   3 overlays anchored left, center, right, bottom-left, bottom, bottom-right
 *   4 (column / row / card only) the container's value background and animation fx, as today
 *   5 background modules (config order)
 * Absolute children take no grid / flex slot and no gap, so the order changes no layout.
 * data-mc-path keeps the config index (studio selection, structure tree unchanged).
 * Layout modules render through renderChildren(children, hass, slot); order 4 does not apply there
 * (their value background sits on the layout's wrapper, outside the container).
 *
 * ── Wrapper output (all on .mc-module-wrapper) ──
 *   data-mc-placement="background" | "overlay"
 *   data-mc-anchor="<anchor>" (overlay)
 *   data-mc-pass (present when click-through is on)
 *   style: --mc-layer-x, --mc-layer-y (overlay), opacity, mix-blend-mode, z-index (overlay rank)
 * Background: position absolute, inset 0, overflow hidden, border-radius inherit, margin 0.
 *   blur > 0 or scrim: the module content is wrapped in <div class="mc-layer-media"> (inset
 *   calc(-2 * blur), filter blur) and followed by <div class="mc-layer-scrim"> (inset 0,
 *   background from scrimCss()); the wrapper's overflow hidden clips both (no blur fringe).
 * Overlay: position absolute, no transform (module animations own transform). Edge axis:
 *   left/right/top/bottom = offset, max-width / max-height calc(100% - offset). Centred axis:
 *   left 0, right 0 (top 0, bottom 0), margin auto, width / height fit-content, and the signed
 *   offset added to left and subtracted from right. The overlay never leaves the container.
 * Unsupported mix-blend-mode or filter: the layer paints unblended / unblurred, never hidden.
 *
 * ── Pointer and focus ──
 * click_through on: pointer-events none on the wrapper; the module's actions are dropped (no role,
 *   no tabindex, no handlers), taps reach what is under it (siblings, the container's own actions).
 *   Background with click-through on, or without runnable actions: `inert` is set on the wrapper
 *   where the browser has it (Chromium 102, Safari 15.5, Firefox 112); on Chromium 85-101 inner
 *   focusables of such a background stay in the tab order (documented degradation). aria-hidden is
 *   never set: the content keeps its text alternative.
 * click_through off: the module keeps its own actions; a background with actions is a button, last
 *   in focus order (DOM order 5).
 * Edit mode (studio canvas): every layered wrapper keeps pointer events so it can be selected; the
 *   editor's hit test ignores click_through (designer section 6).
 *
 * ── Flows seam (shared with task flow-slider-styles; both rely on this, neither edits the other's files) ──
 * - A container with `data-mc-layers` is a stacking context. In a flows card it is lifted to z 1 like
 *   every other isolated container (rule in src/layers/layer-css.ts, not in flows-css.ts):
 *   flows `layer: back` pass under such a container (same as video-bg and value backgrounds today),
 *   flows `layer: front` and labels draw over every background module and overlay.
 * - fill: card background modules and the card's background_layers sit under both flow layers.
 * - The flows Module keeps its z levels (back 0, front 2, labels 2, html layers 0 / 2 per flow-look
 *   1.0.0); layer-placement never sets a z-index >= 2 outside an isolated container.
 * - Flow anchors (`from` / `to` module ids) on a background or overlay module are measured from the
 *   wrapper's box like any module (flow geometry reads boxes, not DOM order).
 *
 * ── FINDINGS #12 ──
 * .mc-card-content gets position relative when it has `data-mc-layers` or the card sets `overflow`,
 * so ha-card's own clip (overflow hidden, border-radius, or the shape's clip-path) contains every
 * absolute layer. Spike S2 checks the Safari 16.4 / Chromium 85 radius clip with blend and blur.
 *
 * ── Size ──
 * magic-card.js budget for this Module plus the bg-stack sync part: <= 2,560 B (shared headroom with
 * flow-slider-styles; Lead reconciles at the Plan Gate).
 */

export const LAYER_PLACEMENT_CONTRACT = '1.0.0';

export type Placement = 'flow' | 'background' | 'overlay';
export type LayerAnchor =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';
export type LayerFill = 'container' | 'row' | 'card';
export type LayerBlend = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'soft-light';
export type ScrimStyle = 'dim' | 'bottom' | 'top' | 'left' | 'right';

export const LAYER_ANCHORS: readonly LayerAnchor[] = [
  'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right',
];
/** Overlays with these anchors come before the in-flow modules in DOM / focus order. */
export const LEADING_ANCHORS: readonly LayerAnchor[] = ['top-left', 'top', 'top-right'];
export const LAYER_BLENDS: readonly LayerBlend[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light'];
export const MAX_OVERLAY_RANK = 40;

export interface ScrimConfig {
  style?: ScrimStyle;
  /** CSS colour, or `card` for the card background colour. */
  color?: string;
  /** 0-90 %. */
  strength?: number;
}

export interface LayerConfig {
  fill?: LayerFill;
  anchor?: LayerAnchor;
  offset_x?: string;
  offset_y?: string;
  opacity?: number;
  blur?: number;
  blend?: LayerBlend;
  click_through?: boolean;
  scrim?: ScrimConfig;
}

/** The two keys every module may carry (CardModule gains them in src/types.ts). */
export interface LayeredModuleKeys {
  placement?: Placement;
  layer?: LayerConfig;
}

/** A layered module after defaults and clamping. */
export interface ResolvedLayer {
  placement: 'background' | 'overlay';
  /** Effective fill (container when row / card is not allowed at this depth). */
  fill: LayerFill;
  anchor: LayerAnchor;
  clickThrough: boolean;
  /** Wrapper attributes (data-mc-placement, data-mc-anchor, data-mc-pass). */
  attrs: Record<string, string>;
  /** Wrapper inline style, appended after the design style. */
  style: string;
  /** Content goes inside .mc-layer-media (blur) and a .mc-layer-scrim follows. */
  media: boolean;
  /** CSS background for .mc-layer-scrim; undefined without a scrim. */
  scrim?: string;
}

export interface ArrangedChild<T = CardModule> {
  child: T;
  /** Config index (editor path). */
  index: number;
  /** undefined: in flow. */
  layer?: ResolvedLayer;
}

/** A container's children in DOM order (sections above). */
export interface Arranged<T = CardModule> {
  /** DOM order 1 to 3. */
  front: ArrangedChild<T>[];
  /** DOM order 5 (after the container's value background and animation fx). */
  backgrounds: ArrangedChild<T>[];
  /** fill: row / card modules found in this container; the caller hands them to the row / card. */
  hoisted: ArrangedChild<T>[];
  /** The container needs data-mc-layers. */
  layered: boolean;
}

export interface ArrangeOptions {
  /** Same predicate the render uses to leave a child out. */
  hidden: (child: CardModule) => boolean;
  /** row / card fill allowed here (a card grid column or a row module column). */
  canHoist: boolean;
  /** For the in-flow fallback of hoisted modules: the row / card has another visible in-flow module. */
  rowHasFlow?: boolean;
  cardHasFlow?: boolean;
}

/** src/layers/placement.ts provides these (pure, synchronous). */
export interface LayerPlacementApi {
  /** undefined: in flow (no placement, placement flow, video-bg legacy, or the in-flow fallback). */
  resolveLayer(mod: CardModule, opts: { canHoist: boolean; overlayRank: number }): ResolvedLayer | undefined;
  arrange(children: readonly CardModule[], opts: ArrangeOptions): Arranged;
  /** CSS background of a scrim, `card` resolved to var(--ha-card-background, var(--card-background-color)). */
  scrimCss(scrim: ScrimConfig): string;
  /** Any module in the config has a placement (prefetch / CSS gating). */
  hasLayers(modules: readonly CardModule[]): boolean;
}

/** src/modules/render-module.ts: what layout modules call instead of mapping renderChildModule. */
export type RenderChildren = (children: readonly CardModule[], hass: unknown, slot?: number) => TemplateResult;
