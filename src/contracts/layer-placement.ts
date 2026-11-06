import type { TemplateResult } from 'lit';
import type { CardModule } from '../types';

/** Contract: layer placement (background and overlay modules). Version 1.0.0. Card key `layers_low_power`; floor-safe CSS
 * (no `inset` shorthand); streaming backgrounds pause; blur max 24 px. */

export const LAYER_PLACEMENT_CONTRACT = '1.0.0';
export const LAYER_PLACEMENT_CONTRACT_REVISION = 4;

export type Placement = 'flow' | 'background' | 'overlay';
export type LayerAnchor =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';
export type LayerFill = 'container' | 'row' | 'card';
export type LayerBlend = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'soft-light';
export type ScrimStyle = 'dim' | 'bottom' | 'top' | 'left' | 'right';

export { LAYER_ANCHORS, LEADING_ANCHORS, LAYER_BLENDS, MAX_OVERLAY_RANK, BLUR_MAX, SCRIM_HOLD, SCRIM_DEFAULT_STRENGTH } from './layer-placement.needs';
/** Above this blur an image is "heavy" in the editor's cost meter. */
export const BLUR_LIGHT_MAX = 12;

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

/** A container's children in DOM order. */
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

/** What the 'layers' chunk hands the slot (src/layers/placement.ts + layer-css.ts). */
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

/** src/layers/layer-slot.ts (magic-card.js): set once by the chunk's install(). */
export interface LayerSlot {
  provide(r: LayerRuntime): void;
  get(): LayerRuntime | undefined;
}

/** Sync helpers in src/layers/layer-slot.ts (magic-card.js). */
export interface LayerSyncApi {
  isLayered(mod: CardModule | undefined): boolean;
  /** Any module at any depth isLayered (prefetch and gating). */
  hasLayers(modules: readonly CardModule[]): boolean;
}

/** src/modules/render-module.ts: what layout modules call instead of mapping renderChildModule. */
export type LayoutChildren = (children: readonly CardModule[], hass: unknown, slot?: number) => { layered: boolean; content: TemplateResult };
/** The same, content only. */
export type RenderChildren = (children: readonly CardModule[], hass: unknown, slot?: number) => TemplateResult;
