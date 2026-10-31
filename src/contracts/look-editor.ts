import type { HomeAssistant, FlowConfig, SliderModuleConfig } from '../types';
import type { FlowBudget, FlowLookConfig } from './flow-look';
import type { SliderLookConfig } from './slider-look';
import type { MessageIndex } from './i18n';

/**
 * Contract: look editors. Version 1.1.0. Covers manual activation, picture chips, 20 s toast, inline Undo,
 * undoable Reset look, settings count, tier notices from the budget.
 */

export const LOOK_EDITOR_CONTRACT = '1.1.0';
export const LOOK_EDITOR_CONTRACT_REVISION = 5;

export const FLOW_LOOK_EDITOR_TAG = 'mc-flow-look-editor';
export const SLIDER_LOOK_EDITOR_TAG = 'mc-slider-look-editor';

/** Undo toast duration (ms). */
export const LOOK_UNDO_TOAST_MS = 20_000;

/** Existing flow keys the Look group edits (presets may write, Reset look removes) besides FLOW_LOOK_KEYS. */
export const FLOW_LOOK_EXISTING_KEYS: readonly (keyof FlowConfig)[] = [
  'color', 'idle_color', 'width', 'scale_width', 'glow', 'dots', 'dot_size',
];
/** Existing slider keys the Look block may write (presets) and Reset look removes, besides SLIDER_LOOK_KEYS. */
export const SLIDER_LOOK_EXISTING_KEYS: readonly (keyof SliderModuleConfig)[] = ['slider_color', 'track_color'];

export type FlowPresetId = 'energy' | 'water' | 'data' | 'heat' | 'neon';
export type SliderPresetId = 'minimal' | 'material' | 'neon' | 'glass' | 'big-fill';

export interface LookPreset<Id extends string, Keys> {
  id: Id;
  /** en-GB message id (look-editor namespace): an m() mark, read with t(). */
  label: MessageIndex;
  /** en-GB message id of the one-line description ("Blue tube with drops and a rising level."), an m() mark. */
  description: MessageIndex;
  /** Static 72 x 56 preview SVG markup in the preset's own colours (aria-hidden). */
  preview: string;
  values: Keys;
}
export type FlowPreset = LookPreset<FlowPresetId, FlowLookConfig & Partial<Pick<FlowConfig, 'color' | 'width' | 'glow' | 'dots' | 'dot_size'>>>;
/** big-fill sets live: true; minimal writes value_position: beside. */
export type SliderPreset = LookPreset<SliderPresetId, SliderLookConfig & Partial<Pick<SliderModuleConfig, 'slider_color' | 'track_color'>>>;

/** <mc-flow-look-editor> properties. */
export interface FlowLookEditorElement extends HTMLElement {
  flow: FlowConfig;
  hass?: HomeAssistant;
  /** The flow's key on the card (flowKeys); used for the budget lookup and section state. */
  flowKey: string;
  /** Optional CSS colour the swatch of an 'entity' colour shows (the host resolves the flow's entity, else the From module's). */
  entityColor?: string;
  /** Requested / drawn / quality per flow key (quality = the card's tier). */
  budget?: FlowBudget;
  /** Open sections (rule 10; inspector-owned) and their toggle. */
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  /** The object before the last preset / reset (inspector-owned); shows the inline Undo. */
  undo?: FlowConfig;
  onUndoChange?: (snapshot: FlowConfig | undefined) => void;
  onChange?: (next: FlowConfig) => void;
}

/** <mc-slider-look-editor> properties. */
export interface SliderLookEditorElement extends HTMLElement {
  config: SliderModuleConfig;
  hass?: HomeAssistant;
  /** Template id for not_synced marking (same as the other module fields). */
  template?: string;
  /** Optional: the entity the slider controls (host-resolved: template or source entity); falls back to config.entity. */
  entity?: string;
  /** Open sections (rule 10; inspector-owned) and their toggle. */
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  /** The object before the last preset / reset (inspector-owned); shows the inline Undo. */
  undo?: SliderModuleConfig;
  onUndoChange?: (snapshot: SliderModuleConfig | undefined) => void;
  onChange?: (next: SliderModuleConfig) => void;
}
