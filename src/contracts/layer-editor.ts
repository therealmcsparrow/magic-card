import type { CardModule, HomeAssistant } from '../types';
import type { BackgroundLayerConfig } from './bg-stack';
import type { LayerAnchor } from './layer-placement';
import type { LayerGroupContext } from './module-editor';

/** Contract: layer editor panels. Version 1.0.0. */

export const LAYER_EDITOR_CONTRACT = '1.0.0';
export const LAYER_EDITOR_CONTRACT_REVISION = 2;

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

/** The five elements install() defines. */
export const LAYER_EDITOR_TAGS = ['mc-layer-design', 'mc-layer-groups', 'mc-bg-layers', 'mc-layers-sheet', 'mc-anchor-grid'] as const;
export const LAYER_EDITOR_I18N_NAMESPACE = 'layer-editor';
