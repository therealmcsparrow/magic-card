import type { HomeAssistant, FlowConfig, SliderModuleConfig } from '../types';
import type { FlowBudget, FlowLookConfig } from './flow-look';
import type { SliderLookConfig } from './slider-look';

/*
 * Contract: look editors. Version 1.0.0 (Architect-owned). ADR 0037. Task flow-slider-styles.
 * Design: .company/work/flow-slider-styles/03-ui-ux-designer.md (sections 1, 2, 4, 5).
 *
 * Seam: the card-editor Module (lazy chunk magic-card-editor.js) hosts two sub-views it never
 * imports: the Look group of each flow block (mc-flows-editor) and the Look block of the slider
 * editor (sliderEditor.general). The look-editor Module (lazy chunk magic-card-look-editor.js,
 * entry src/look-editor/chunk.ts) defines both elements, the preset data (P1 flow presets, slider
 * presets) and the tile SVGs. The runtime renderers (flow-look, slider-look chunks) are never
 * imported by it and it is never imported by them.
 *
 * ── Loader (in the editor chunk, src/editor/look-editor-loader.ts) ──
 * `loadLookEditor(): Promise<boolean>`: the editor-loader pattern (memoised while pending; false on
 * failure and retried on the next call, so the designer's "Try again" button works). The entry
 * exports `BUILD` and `install()` (defines the two tags) and has no side effects at evaluation;
 * the loader checks BUILD through sameBuild() before install() (lazy-module 1.1.0 rules).
 * The literal import has webpackChunkName "look-editor"; nothing else imports src/look-editor/**.
 *
 * ── Host rules (card-editor) ──
 * - Flows: each block body becomes Connection (open) / Look / Label / Visibility (designer 1.1).
 *   Connection, Label and Visibility stay in the editor chunk. Look renders <mc-flow-look-editor>
 *   once loadLookEditor() is true; while pending a skeleton (aria-busy); on failure a status line
 *   with Try again AND today's fields for the existing keys (Colour, Idle colour, Width, Glow,
 *   Scale width, Dots, Dot size), so nothing that is editable today becomes uneditable.
 * - Slider: sliderEditor.general renders today's fields unchanged, then a Look block with
 *   <mc-slider-look-editor> (same pending / failure handling; failure shows only the status line).
 *   ModuleEditor 1.1.0 is unchanged (no new tab).
 * - The inspector keeps the open state of disclosure sections per flow key / module id for the
 *   session (like `expanded`); it is never written to YAML.
 *
 * ── Element rules (look-editor) ──
 * 1. Round trip (AC3): nothing is written on mount or on open; chips and tiles are derived from
 *    the keys. Every change emits one `onChange` with the whole next object.
 * 2. Writes only FLOW_LOOK_KEYS + FLOW_LOOK_EXISTING_KEYS (flows) and SLIDER_LOOK_KEYS +
 *    SLIDER_LOOK_EXISTING_KEYS + show_value (slider, value display sync). A value equal to the
 *    default removes the key (tiles Solid / Standard, thumb Line); every field has a reset
 *    (fieldReset) that removes its key. Hidden fields keep their keys (designer principle 4).
 * 3. Presets: applying one removes every look key plus the preset's listed existing keys, then
 *    writes the preset's values, in one onChange, followed by an Undo toast (<mc-ui-toast>, 6 s).
 *    No preset key is stored; the active chip is the preset whose values equal the object's (else
 *    "Custom" when any look key is set, else "Default look"). "Reset look" removes every look key
 *    (flows: never Connection / Label / Visibility; slider: never entity / attribute / min / max /
 *    step / direction / show_value).
 * 4. Colour mode and spacing mode switches write color_mode / spacing_mode and keep the other
 *    mode's keys (flow-look 1.0.0 precedence).
 * 5. Shared controls come from ui-kit 1.1.0 (revision 5, additive): <mc-ui-disclosure>,
 *    <mc-ui-tile-group>, <mc-ui-chip-group>, plus the existing colour picker, icon picker,
 *    color-ranges-field and shape field. They are ui-kit Module elements, not Core.
 * 6. i18n: namespace 'look-editor' (i18n 1.0.0, additive namespace): en-GB ids, en-US and nl
 *    tables inside this chunk; I18N_RELEASE_STRICT applies.
 * 7. Card-limit notice (AC8): the flow element reads `budget` (FlowBudget) when the host passes it
 *    (the studio canvas' mc-flows); no budget, no notice.
 * 8. Tile previews are static inline SVG (never animated).
 */

export const LOOK_EDITOR_CONTRACT = '1.0.0';

export const FLOW_LOOK_EDITOR_TAG = 'mc-flow-look-editor';
export const SLIDER_LOOK_EDITOR_TAG = 'mc-slider-look-editor';

/** Existing flow keys the Look group edits (and presets may write) besides FLOW_LOOK_KEYS. */
export const FLOW_LOOK_EXISTING_KEYS: readonly (keyof FlowConfig)[] = [
  'color', 'idle_color', 'width', 'scale_width', 'glow', 'dots', 'dot_size',
];
/** Existing slider keys the Look block may write besides SLIDER_LOOK_KEYS (presets). */
export const SLIDER_LOOK_EXISTING_KEYS: readonly (keyof SliderModuleConfig)[] = ['slider_color', 'track_color'];

export type FlowPresetId = 'energy' | 'water' | 'data' | 'heat' | 'neon';
export type SliderPresetId = 'minimal' | 'material' | 'neon' | 'glass' | 'big-fill';

export interface LookPreset<Id extends string, Keys> {
  id: Id;
  /** en-GB message id (look-editor namespace). */
  label: string;
  values: Keys;
}
export type FlowPreset = LookPreset<FlowPresetId, FlowLookConfig & Partial<Pick<FlowConfig, 'color' | 'width' | 'glow' | 'dots' | 'dot_size'>>>;
/** big-fill sets live: true (CEO 2026-10-19). */
export type SliderPreset = LookPreset<SliderPresetId, SliderLookConfig & Partial<Pick<SliderModuleConfig, 'slider_color' | 'track_color'>>>;

/** <mc-flow-look-editor> properties. */
export interface FlowLookEditorElement extends HTMLElement {
  flow: FlowConfig;
  hass?: HomeAssistant;
  /** The flow's key on the card (flowKeys); used for the budget lookup and section state. */
  flowKey: string;
  budget?: FlowBudget;
  /** Open sections (inspector-owned) and their toggle. */
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  onChange?: (next: FlowConfig) => void;
}

/** <mc-slider-look-editor> properties. */
export interface SliderLookEditorElement extends HTMLElement {
  config: SliderModuleConfig;
  hass?: HomeAssistant;
  /** Template id for not_synced marking (same as the other module fields). */
  template?: string;
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  onChange?: (next: SliderModuleConfig) => void;
}
