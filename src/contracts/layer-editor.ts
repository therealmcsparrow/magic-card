import type { CardModule, HomeAssistant } from '../types';
import type { BackgroundLayerConfig } from './bg-stack';
import type { LayerAnchor } from './layer-placement';
import type { LayerGroupContext } from './module-editor';

/*
 * Contract: layer editor panels. Version 1.0.0 (Architect-owned). ADR 0038. CEO size ruling
 * 2026-10-20: the Placement / Layer groups and the Card backdrop group leave magic-card-editor.js for
 * the editor-side lazy chunk 'layer-editor' (lazy-module 1.2.0 r2, magic-card-layer-editor.js).
 * Builder proposal: 16-frontend-engineer-t6-t7.md.
 *
 * ── Seam ──
 * The editor chunk (host) keeps the light parts and renders the panels by tag only:
 *   stays in magic-card-editor.js: placement-model (light half), bg-layers-model (light half),
 *   layers-at, layers-here, canvas-layers, layer-actions, tree-chip, anchor-names, bg-status,
 *   layer-measure, checks, layer-design.ts (tag helper), the loader, and the edits in the inspector,
 *   outline, item menu and canvas; plus the types below.
 *   moves to the chunk (entry src/editor/layers/chunk.ts): layer-groups (mc-layer-groups,
 *   mc-layer-design), layer-styles, tokens, controls, cost, looks, bg-layers (mc-bg-layers),
 *   bg-layer-editor, mc-anchor-grid, layers-sheet (mc-layers-sheet), the heavy halves of the two models.
 * The host never imports a chunk file; the chunk may import host light files and magic-card.js
 * modules (they resolve to the already loaded chunks, not copies; the ceiling catches a copy).
 *
 * ── Loading ──
 * src/editor/layers/layer-editor-loader.ts: `loadLayerEditor(): Promise<boolean>` through lazyChunk()
 * with `import(/* webpackChunkName: "layer-editor" *\/ './chunk')`; BUILD check, install() defines
 * every element of this chunk (customElements.define guarded by `customElements.get`, no
 * @customElement at module level, lazy-module "Chunk entries"). The three define-imports
 * (registry.ts, card-settings.ts, studio-canvas.ts) become calls to loadLayerEditor(); prefetch when
 * the studio or the card editor opens. Elements upgrade in place when it lands.
 * While loading: the host renders the tags (unknown elements show nothing) and, in their place, one
 * line "Loading layer settings…" (card-editor namespace). On failure (no retry until reload, like
 * every lazyChunk): "Layer settings could not load. Reload the page." The YAML tab keeps working.
 * The canvas press-and-hold sheet falls back to the item menu until the chunk is ready.
 *
 * ── Elements (tags, properties, events); unchanged from the T6 / T7 build ──
 * <mc-layer-design>  .config CardModule, .hass, .onChange (m) => void, .ctx LayerEditorContext;
 *                    slot: the rest of the design tab. Wraps <mc-layer-groups> (same properties).
 *   events (bubbles, composed): `mc-layer-move` { to: LayerMoveTo }, `mc-layers-low-power` (no detail).
 * <mc-bg-layers>     .layers BackgroundLayerConfig[], .hass, .onWrite (list) => void, .rule RuleView,
 *                    .onRule (act: 'start' | 'reset') => void, .lowPower boolean,
 *                    .onLowPower () => void, .cardEntity string. It reads layer status from the host's
 *                    bg-status store (light, editor chunk), not from events.
 * <mc-layers-sheet>  .items SheetItem[], .x number, .y number; events `pick` { key }, `close`.
 * <mc-anchor-grid>   .value LayerAnchor, label, show-name; event `change` { value }.
 *
 * ── i18n ──
 * Namespace `layer-editor` (tools/i18n/config.json and I18N_MODULES, en-GB ids, en-US and nl tables),
 * bundled into this chunk, I18N_RELEASE_STRICT applies. Strings of the light host parts (tree chips,
 * float bar, canvas announcements, bg-status sentences, the loading and failure lines) stay in
 * `card-editor`. A string used on both sides lives in `card-editor`.
 *
 * ── Builder rules carried over ──
 * Marco 12 N1 (3:1 control boundary, non-colour on/off and selected cue, token sampler test); no
 * `inset` shorthand; British UI text through t() / m().
 *
 * ── Gradients (T6 / T7 note, settled) ──
 * `to <side>` heads are read as angles everywhere a backdrop gradient is parsed (bg-stack values and
 * the gradient editor through one helper, gradientHeadAngle() in src/utils/gradient.ts): to top 0deg,
 * to right 90deg, to bottom 180deg, to left 270deg; corners (to top right ...) 45 / 135 / 225 /
 * 315deg (an approximation on non-square cards, stated in the docs). parseGradient() itself is not
 * changed, so other users of it render as today. Looks, docs and gallery write degrees.
 *
 * ── Size ──
 * Ceiling 114,688 B (lazy-module EDITOR_LAZY_CHUNK_CEILINGS); cap = measured + 5 % at the ratchet.
 * magic-card-editor.js (hosts only) about 868 KB, set at the final ratchet from the measured size.
 */

export const LAYER_EDITOR_CONTRACT = '1.0.0';

export type LayerMoveTo = 'front' | 'forward' | 'backward' | 'back';

/** Rule view of the Card backdrop group (moves from bg-layers.ts into this contract). */
export interface RuleView {
  /** The rule sets its own `background_layers`. */
  own: boolean;
}

/** One row of the "Layers here" sheet (moves from layers-sheet.ts into this contract). */
export interface SheetItem {
  /** data-mc-path of a module, or `backdrop:<index>` for a card backdrop layer. */
  key: string;
  name: string;
  /** "Behind others", "On top", "Card backdrop, layer 2" ... */
  detail: string;
  current?: boolean;
}

/** What the inspector passes as `.ctx` (placement-model.ts keeps its own alias of this type). */
export interface LayerEditorContext extends LayerGroupContext {
  /** data-mc-path of the module (the canvas wrapper). */
  path: string;
  name: string;
  /** In-flow siblings that have an action: the overlap check compares the overlay with these. */
  others: Array<{ path: string; name: string }>;
}

export interface LayerDesignProps {
  config: CardModule;
  hass?: HomeAssistant;
  onChange: (m: CardModule) => void;
  ctx?: LayerEditorContext;
}

export interface BgLayersProps {
  layers?: BackgroundLayerConfig[];
  hass?: HomeAssistant;
  onWrite: (list: BackgroundLayerConfig[]) => void;
  rule?: RuleView;
  onRule?: (act: 'start' | 'reset') => void;
  lowPower: boolean;
  onLowPower?: () => void;
  cardEntity?: string;
}

export interface AnchorGridProps {
  value?: LayerAnchor;
  label: string;
  showName: boolean;
}

export const LAYER_EDITOR_TAGS = ['mc-layer-design', 'mc-layer-groups', 'mc-bg-layers', 'mc-bg-layer-editor', 'mc-layers-sheet', 'mc-anchor-grid'] as const;
export const LAYER_EDITOR_I18N_NAMESPACE = 'layer-editor';
