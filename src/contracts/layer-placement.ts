import type { TemplateResult } from 'lit';
import type { CardModule } from '../types';

/*
 * Contract: layer placement (background and overlay modules). Version 1.0.0 revision 3
 * (Architect-owned). ADR 0038. Task background-layers (brief 01-product-manager.md, design
 * 03-ui-ux-designer.md + round-1 delta 11-ui-ux-designer.md, spikes 04 (S1) and 05 (S2)).
 * r2 (2026-10-19, folded into 1.0.0): overlay click-through default follows its actions; scrim fade
 * shape; card key `layers_low_power`; floor-safe CSS (no `inset` shorthand); ha-card isolation per
 * spike S2; blend scope; streaming backgrounds pause; blur max 24 px and the performance rules (S1).
 * r3 (2026-10-20, CEO size ruling; folded into 1.0.0, nothing released): the placement logic and the
 * layer CSS leave magic-card.js for the lazy 'layers' chunk behind a slot (section "Runtime slot and
 * first render"); magic-card.js keeps only the detector, the slot, two CSS rules and the render hook.
 *
 * Seam: the layer-placement Module has two halves.
 * - magic-card.js (sync): src/layers/layer-slot.ts: the LayerSlot, isLayered(), hasLayers() (the
 *   config walk for prefetch and gating, childSlots included) and LAYER_SYNC_CSS (two rules, below).
 * - 'layers' chunk (lazy-module 1.2.0 r2): src/layers/placement.ts (resolveLayer, arrange, scanFills,
 *   scrimCss) and src/layers/layer-css.ts (every other rule of this contract, as a string), both
 *   handed to the slot by the chunk's install() as one LayerRuntime. Nothing in magic-card.js, the
 *   editor chunk or the studio imports these two files.
 * The render pipeline (Core, src/card/magic-card.ts) and the layout modules (horizontal, vertical,
 * tabs, through src/modules/render-module.ts layoutChildren()) call slot.get()?.arrange(); they decide
 * DOM order, wrapper attributes and inline style from its result. No new Core item.
 *
 * ── YAML (module level, any module type; NOT inside `design`) ──
 * UI labels (CEO 2026-10-19): flow = "Normal", background = "Behind others", overlay = "On top".
 * Keys never follow label changes.
 *   placement: flow | background | overlay      absent = flow (video-bg exception below)
 *   layer:                                      read only when placement is background / overlay
 *     fill: container | row | card              background only; default container. row / card only
 *                                               for a module directly in a card grid column (or a row
 *                                               module column); anywhere else it reads as container.
 *     anchor: top-left | top | top-right | left | center | right | bottom-left | bottom | bottom-right
 *                                               overlay only; default top-left (editor writes it)
 *     offset_x, offset_y: CSS length, px or %   overlay only; default 0. On an edge axis the value is
 *                                               clamped to >= 0 (the editor shows an error instead of
 *                                               clamping). On a centred axis (top/center/bottom for x,
 *                                               left/center/right for y) it is signed: + right / down.
 *     opacity: 0-100 (%)                        default 100
 *     blur: 0-24 (px)                           default 0 (S1). Above BLUR_LIGHT_MAX (12) counts as
 *                                               heavy in the editor's cost meter.
 *     blend: normal | multiply | screen | overlay | darken | lighten | soft-light   default normal
 *     click_through: boolean                    default: background true; overlay false when the
 *                                               module has runnable actions, true when it has none
 *     scrim:                                    absent = no scrim ("Darken behind text")
 *       style: dim | bottom | top | left | right   dim = flat; others = fade from that edge (below)
 *       color: CSS colour or `card` (card background colour); default black
 *       strength: 0-90 (%)                      default 60
 * Card level:
 *   layers_low_power: boolean                   default false. On: every layered module and every
 *                                               background_layers entry of this card drops blur,
 *                                               blend (normal) and pan / zoom (rests at the start
 *                                               framing); pictures, opacity and scrims stay.
 *                                               Output: `data-mc-low-power` on .mc-card-content.
 * Values outside a range are clamped; unknown enum values fall back to the default. `placement` and
 * `layer` are not DesignConfig keys: conditional design rules and the Hover view never change them.
 * Configs without these keys render exactly as before (golden run, AC "pixel for pixel").
 *
 * video-bg (CEO Q1): without a `placement` key it keeps today's behaviour and today's CSS (css.ts
 * `.mc-video-bg--media` rules, in magic-card.js): behind its siblings when it has any, a normal block
 * when alone. Those legacy selectors gain `:not([data-mc-placement])` so an explicit placement (any
 * value) takes the path below instead. The editor shows no segment selected plus "Automatic".
 *
 * ── Runtime slot and first render (r3) ──
 * - isLayered(m) (sync): `placement` is 'background' or 'overlay'. hasLayers(modules): any isLayered
 *   at any depth. A render "meets layers" when some container it renders has an isLayered child.
 * - Prefetch: MagicCard.setConfig and the template merge load the 'layers' chunk when
 *   hasLayers(config) or `background_layers` is non-empty; a render that meets layers with the chunk
 *   not loaded starts the load and adds requestUpdate to chunk.whenReady (once per card).
 * - Slot filled (chunk installed): everything in this contract applies. The card renders the
 *   runtime's CSS once into its shadow root as `<style data-mc-layer-css>` (first child of ha-card,
 *   also in the pop-up surface) while it meets layers or has background_layers.
 * - Slot empty, chunk loading (first render, usually one frame): containers render their children in
 *   config order with no arrange; each isLayered wrapper gets `data-mc-layer-pending` and no other
 *   layer attribute; fill row / card modules stay in their column. LAYER_SYNC_CSS rule 1 makes a
 *   pending wrapper absolute and invisible, so it takes no space and nothing flashes; in-flow siblings
 *   are laid out where they will stay. Containers whose children are all pending collapse for that
 *   frame (they come back through the in-flow fallback once the chunk lands).
 * - Slot empty, chunk failed: no `data-mc-layer-pending`; layered modules render in flow as plain
 *   modules for the rest of the page visit (the lazyChunk warning is the only report).
 * - Editor and studio: the same; the editor chunk reads slot.get() (src/layers/layer-slot.ts) when it
 *   needs arrange() and shows the in-flow order while it is empty.
 *
 * ── LAYER_SYNC_CSS (magic-card.js, part of magicCardStyles; nothing else of this contract) ──
 *   1 .mc-module-wrapper[data-mc-layer-pending] { position: absolute; visibility: hidden; }
 *   2 .mc-card-content[data-mc-clip] { position: relative; }   set when the card sets `overflow`
 *     (FINDINGS #12 for cards without layers; layered cards get the same from the chunk CSS).
 *
 * ── Scrim shape ──
 * scrimCss(): dim = flat colour at `strength`. Edge styles = linear-gradient from that edge: colour
 * at `strength` from 0 % to 35 % (SCRIM_HOLD), then linear to fully transparent at 100 % (the
 * opposite edge). A colour with alpha: strength multiplies the colour's own alpha. `card` =
 * var(--ha-card-background, var(--card-background-color, #fff)) with the strength applied as the
 * scrim element's opacity (no color-mix(), Chromium 85 floor).
 *
 * ── Measuring (Q-UX3) ──
 * Fill and anchor offsets are measured from the container's padding box (its outer edge inside
 * any border); the container's padding is ignored.
 *
 * ── In-flow fallback ──
 * A container whose visible children are all background / overlay renders them in flow (as if
 * placement were flow), so it never collapses to zero height. Visible = the same predicate the
 * render uses (display conditions; in edit mode hidden modules still count). fill row / card: when
 * the row / card has no visible in-flow module at all, the module renders in flow in its column.
 *
 * ── Stacking (bottom to top). Final order; supersedes the brief's guess ──
 * ha-card (theme colour, the clip box) is outside the blend group, see "Blend scope".
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
 *  11 stale badge host .mc-bg-badge (z 3, bg-stack 1.0.0)                        new
 *  12 pause button (z 6, last child of ha-card, card-pause 1.0.0)                new
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
 * ── Blend scope (spike S2) ──
 * Every stacking context is an isolated blend group. A layer's blend mixes with what is painted
 * before it inside its nearest stacking context: for card-level layers that is the card content's
 * own `background` / `background_image` and the layers behind it; for a background module, its
 * container's own background, value background and the backgrounds behind it. The HA theme colour
 * painted by ha-card is outside the group, so a card without its own `background` blends with
 * transparent (the layer looks normal). Editor hint when a blend is picked and nothing opaque is
 * behind it: "Add a colour at the back to blend with." <mc-bg-stack> and background wrappers are
 * never isolated themselves (that would cut them off from step 1).
 *
 * ── DOM order inside a container (= keyboard focus order) ──
 *   1 overlays anchored top-left, top, top-right (in that order, ties: config order)
 *   2 in-flow modules (config order)
 *   3 overlays anchored left, center, right, bottom-left, bottom, bottom-right
 *   4 (column / row / card only) the container's value background and animation fx, as today
 *   5 background modules (config order)
 * Absolute children take no grid / flex slot and no gap, so the order changes no layout.
 * data-mc-path keeps the config index (studio selection, structure tree unchanged).
 * Layout modules render through layoutChildren(children, hass, slot); order 4 does not apply there
 * (their value background sits on the layout's wrapper, outside the container).
 *
 * ── CSS floor: Chromium 85 has no `inset` shorthand (87+). Every rule of this Module and of bg-stack
 * writes top / right / bottom / left. Existing `inset:` uses elsewhere are not changed here.
 *
 * ── Performance rules (spike S1; also binding for bg-stack) ──
 * - `filter` (blur) sits on a wrapper that is never animated (.mc-layer-media here, the layer box
 *   in bg-stack). Never animate filter, inset / top / right / bottom / left or background-position.
 * - Motion on layers is a transform animation on the innermost image / media element only.
 * - Off screen, page hidden or card paused: animations get animation-play-state paused and every
 *   timer of the layer (camera refresh, idle check) is cleared, not just hidden; restarted on return.
 *
 * ── Wrapper output (all on .mc-module-wrapper; slot filled) ──
 *   data-mc-placement="background" | "overlay"
 *   data-mc-anchor="<anchor>" (overlay)
 *   data-mc-pass (present when click-through is on)
 *   style: --mc-layer-x, --mc-layer-y (overlay), opacity, mix-blend-mode, z-index (overlay rank)
 * Background: position absolute, top / right / bottom / left 0, overflow hidden, border-radius
 *   inherit, margin 0. blur > 0 or scrim: the module content is wrapped in
 *   <div class="mc-layer-media"> (each side calc(-3 * blur), filter blur; the S2 bleed) and
 *   followed by <div class="mc-layer-scrim"> (each side 0, background from scrimCss()); the
 *   wrapper's overflow hidden clips both (no blur fringe).
 * Overlay: position absolute, no transform (module animations own transform). Edge axis:
 *   left / right / top / bottom = offset, max-width / max-height calc(100% - offset). Centred axis:
 *   left 0, right 0 (top 0, bottom 0), margin auto, width / height fit-content (-webkit-fit-content
 *   first for Safari), and the signed offset added to left and subtracted from right.
 *   The overlay never leaves the container.
 * Low power (`[data-mc-low-power]` on the card content): filter none on .mc-layer-media,
 *   mix-blend-mode normal on layered wrappers. Scrims and opacity stay.
 * Unsupported mix-blend-mode or filter: the layer paints unblended / unblurred, never hidden.
 *
 * ── Clip box and FINDINGS #12 (spike S2) ──
 * ha-card gets `data-mc-layers` when the card has a non-empty background_layers or meets layers:
 * overflow hidden (already) and isolation isolate (chunk CSS); its border-radius or shape clip-path is
 * the clip. .mc-card-content gets position relative when it has `data-mc-layers` (chunk CSS) or the
 * card sets `overflow` (`data-mc-clip`, LAYER_SYNC_CSS rule 2). Escalation only if real-device QA
 * (Safari 16.4) shows a leak, one rung at a time: (1) clip-path inset(0 round <radius>) on
 * <mc-bg-stack> / the background wrapper; (2) -webkit-mask-image on ha-card; (3) transform
 * translateZ(0). None ships pre-emptively.
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
 *   editor's hit test ignores click_through (designer 03 section 6, 11 H). Press and hold on the
 *   canvas opens the "Layers here" sheet only when two or more layers share the point; with one it
 *   opens the item menu as before (T6 decision, accepted).
 *
 * ── Streaming backgrounds (Q-R3) ──
 * A camera module or video-bg that renders as a background (explicit placement, or video-bg's
 * implicit one) decodes no frames while off screen, page hidden or card paused (shared offscreen
 * observer, card-pause 1.0.0), and resumes on return. Owned by the modules-extra views (camera,
 * video-bg); they read `data-mc-placement` or the legacy video-bg state from their wrapper. In flow,
 * camera and video-bg behave as today.
 *
 * ── Flows seam (shared with task flow-slider-styles; both rely on this, neither edits the other's files) ──
 * - A container with `data-mc-layers` is a stacking context. In a flows card it is lifted to z 1 like
 *   every other isolated container (rule in the chunk's layer CSS, not in flows-css.ts): flows
 *   `layer: back` (SVG and HTML layer) pass under such a container (same as video-bg and value
 *   backgrounds today); flows `layer: front` and labels draw over every background module and
 *   overlay. Recorded on the flows side in flow-look.ts. While the chunk is loading, pending wrappers
 *   are invisible, so flows draw as if they were absent for that frame.
 * - fill: card background modules and the card's background_layers sit under both flow layers.
 * - The flows Module keeps its z levels (back 0, front 2, labels 2); layer-placement never sets a
 *   z-index >= 2 outside an isolated container, except the stale badge host (z 3, card content).
 * - Flow anchors (`from` / `to` module ids) on a background or overlay module are measured from the
 *   wrapper's box like any module (flow geometry reads boxes, not DOM order).
 *
 * ── Size ──
 * magic-card.js keeps layer-slot.ts, LAYER_SYNC_CSS, the render hook, the bg-stack tag / host / badge
 * host and prefetch. Cap 496,640 B for both runs (CEO 2026-10-20). The 'layers' chunk ceiling is
 * 24 KiB (lazy-module 1.2.0 r2).
 */

export const LAYER_PLACEMENT_CONTRACT = '1.0.0';
export const LAYER_PLACEMENT_CONTRACT_REVISION = 3;

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
/** (S1) Blur range for module layers and image layers; above BLUR_LIGHT_MAX is "heavy". */
export const BLUR_MAX = 24;
export const BLUR_LIGHT_MAX = 12;
/** Scrim fade: full strength over this share of the length from the edge. */
export const SCRIM_HOLD = 0.35;
export const SCRIM_DEFAULT_STRENGTH = 60;
/** (r3) Attribute on an isLayered wrapper while the layers chunk is loading. */
export const LAYER_PENDING_ATTRIBUTE = 'data-mc-layer-pending';

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

/** Card key; MagicCardConfig gains it in src/types.ts. */
export interface LayersLowPowerKey {
  layers_low_power?: boolean;
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
  /** The child has runnable actions (hasRunnableActions with its effective entity): overlay default. */
  hasActions: (child: CardModule) => boolean;
  /** row / card fill allowed here (a card grid column or a row module column). */
  canHoist: boolean;
  /** For the in-flow fallback of hoisted modules: the row / card has another visible in-flow module. */
  rowHasFlow?: boolean;
  cardHasFlow?: boolean;
}

/** (r3) What the 'layers' chunk hands the slot (src/layers/placement.ts + layer-css.ts). */
export interface LayerRuntime {
  resolveLayer(mod: CardModule, opts: { canHoist: boolean; overlayRank: number; hasActions: boolean }): ResolvedLayer | undefined;
  arrange(children: readonly CardModule[], opts: ArrangeOptions): Arranged;
  /** Direct children of the lists: any visible in-flow module, any row fill, any card fill. */
  scanFills(lists: ReadonlyArray<readonly CardModule[] | undefined>, hidden: (c: CardModule) => boolean): { flow: boolean; row: boolean; card: boolean };
  /** CSS background of a scrim (shape above); `card` resolved to the card colour variable chain. */
  scrimCss(scrim: ScrimConfig): string;
  /** Every rule of this contract except LAYER_SYNC_CSS, as plain CSS text (no `inset`, no color-mix()). */
  readonly css: string;
}

/** (r3) src/layers/layer-slot.ts (magic-card.js): set once by the chunk's install(). */
export interface LayerSlot {
  provide(r: LayerRuntime): void;
  get(): LayerRuntime | undefined;
}

/** (r3) Sync helpers in src/layers/layer-slot.ts (magic-card.js). */
export interface LayerSyncApi {
  isLayered(mod: CardModule | undefined): boolean;
  /** Any module at any depth isLayered (prefetch and gating). */
  hasLayers(modules: readonly CardModule[]): boolean;
}

/** src/modules/render-module.ts: what layout modules call instead of mapping renderChildModule. */
export type LayoutChildren = (children: readonly CardModule[], hass: unknown, slot?: number) => { layered: boolean; content: TemplateResult };
/** The same, content only. */
export type RenderChildren = (children: readonly CardModule[], hass: unknown, slot?: number) => TemplateResult;
