import type { HomeAssistant, FlowConfig, SliderModuleConfig } from '../types';
import type { FlowBudget, FlowLookConfig } from './flow-look';
import type { SliderLookConfig } from './slider-look';

/*
 * Contract: look editors. Version 1.0.0 (Architect-owned). ADR 0037. Task flow-slider-styles.
 * Design: .company/work/flow-slider-styles/03-ui-ux-designer.md, delta 12-ui-ux-designer.md.
 * r2 2026-10-19 (designer round 1 request R4, folded into 1.0.0 in place per ADR 0020, nothing
 * built yet): manual activation, picture chips, 20 s toast, inline Undo, undoable Reset look,
 * settings count, tier notices from the budget.
 *
 * Seam: the card-editor Module (lazy chunk magic-card-editor.js) hosts two sub-views it never
 * imports: the Look group of each flow block (mc-flows-editor) and the Look block of the slider
 * editor (sliderEditor.general). The look-editor Module (lazy chunk magic-card-look-editor.js,
 * entry src/look-editor/chunk.ts) defines both elements, the preset data (P1 flow presets, slider
 * presets, their static preview SVGs and descriptions) and the tile SVGs. The runtime renderers
 * (flow-look, slider-look chunks) are never imported by it and it is never imported by them.
 *
 * ── Loader (in the editor chunk, src/editor/look-editor-loader.ts) ──
 * `loadLookEditor(): Promise<boolean>`: the editor-loader pattern (memoised while pending; false on
 * failure and retried on the next call, so "Try again" works). The entry exports `BUILD` and
 * `install()` (defines the two tags) and has no side effects at evaluation; the loader checks
 * BUILD through sameBuild() before install() (lazy-module 1.1.0 rules). The literal import has
 * webpackChunkName "look-editor"; nothing else imports src/look-editor/**.
 *
 * ── Host rules (card-editor) ──
 * - Flows: each block body becomes Connection / Look / Value and route / Label / Visibility
 *   (designer 12, 6.5). Everything outside Look stays in the editor chunk. Look renders
 *   <mc-flow-look-editor> once loadLookEditor() is true; while pending a skeleton with the text
 *   "Loading line styles..." (aria-busy); on failure a status line with Try again AND today's
 *   fields for the existing keys (Colour, Idle colour, Width, Glow, Scale width, Dots, Dot size),
 *   so nothing that is editable today becomes uneditable.
 * - Slider: sliderEditor.general renders today's fields unchanged, then a Look block with
 *   <mc-slider-look-editor> (same pending / failure handling; failure shows only the status line).
 *   ModuleEditor 1.1.0 is unchanged (no new tab).
 * - The inspector keeps the open state of disclosure sections per flow key / module id, and the
 *   one-level Undo snapshot per flow key / module id, for the session; never written to YAML.
 * - The host passes the studio canvas' mc-flows `budget` when it has one (flows tier notices).
 *
 * ── Element rules (look-editor) ──
 * 1. Round trip (AC3): nothing is written on mount or on open; chips and tiles are derived from
 *    the keys. Every change emits one `onChange` with the whole next object.
 * 2. Writes only FLOW_LOOK_KEYS + FLOW_LOOK_EXISTING_KEYS (flows) and SLIDER_LOOK_KEYS +
 *    SLIDER_LOOK_EXISTING_KEYS + show_value (slider, value display sync). A value equal to the
 *    default removes the key (tiles Solid / Standard, handle Line); every field has a reset
 *    (fieldReset) that removes its key. Hidden fields keep their keys.
 * 3. Presets and Reset look: one onChange each. A preset removes every look key plus the preset's
 *    listed existing keys, then writes the preset's values (the Water preset writes
 *    tube_fill_value only when the flow has an entity). No preset key is stored. Status text, not
 *    a chip: the matching preset name, else "Your own look, started from {name}" (nearest preset,
 *    at least half its keys equal), else "Your own look"; no look keys: "Default look". Reset look
 *    removes every look key (flows: never Connection / Value and route / Label / Visibility;
 *    slider: never entity / attribute / min / max / step / direction / show_value).
 * 4. (r2) Undo, one level, two routes: <mc-ui-toast> with duration 20000 ms and the text
 *    "{name} look applied. {n} settings changed. Undo" / "Look reset. {n} settings removed. Undo"
 *    (n = keys written plus keys removed), and a persistent "Undo {name} look" / "Undo reset"
 *    button in the Look header, kept until the next edit of a look field or until the editor
 *    closes. Undo restores the previous object in one onChange.
 * 5. Colour mode and spacing mode switches write color_mode / spacing_mode and keep the other
 *    mode's keys (flow-look 1.0.0 precedence); an info line names the kept, unused keys.
 * 6. Shared controls come from ui-kit 1.1.0 (revision 5, additive), not Core:
 *    <mc-ui-disclosure>; <mc-ui-tile-group> and <mc-ui-chip-group> with MANUAL activation (r2):
 *    buttons with aria-pressed in role=group, roving tabindex, Left / Right / Home / End move focus
 *    only, Space / Enter / click select; chips carry an aria-hidden preview SVG and the name as
 *    text, and a description line for the focused or selected chip; they wrap at every width.
 *    <mc-ui-toast> (existing `duration`) additionally pauses on pointerdown within it.
 *    Small segmented controls (_seg) keep select-on-arrow.
 * 7. i18n: namespace 'look-editor' (i18n 1.0.0, additive namespace): en-GB ids, en-US and nl
 *    tables inside this chunk; I18N_RELEASE_STRICT applies.
 * 8. Notices from `budget` (FlowBudget, flows): the 40-element notice when drawn < requested; the
 *    tier notices when its quality is lite ("4 or more glowing or tube lines...") or minimal
 *    ("7 or more..."). No budget, no notice.
 * 9. Tile and chip previews are static inline SVG (never animated).
 */

export const LOOK_EDITOR_CONTRACT = '1.0.0';
export const LOOK_EDITOR_CONTRACT_REVISION = 2;

export const FLOW_LOOK_EDITOR_TAG = 'mc-flow-look-editor';
export const SLIDER_LOOK_EDITOR_TAG = 'mc-slider-look-editor';

/** (r2) Undo toast duration (ms). */
export const LOOK_UNDO_TOAST_MS = 20_000;

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
  /** (r2) en-GB message id of the one-line description ("Blue tube with drops and a rising level."). */
  description: string;
  /** (r2) Static 72 x 56 preview SVG markup in the preset's own colours (aria-hidden). */
  preview: string;
  values: Keys;
}
export type FlowPreset = LookPreset<FlowPresetId, FlowLookConfig & Partial<Pick<FlowConfig, 'color' | 'width' | 'glow' | 'dots' | 'dot_size'>>>;
/** big-fill sets live: true (CEO 2026-10-19); minimal writes value_position: beside. */
export type SliderPreset = LookPreset<SliderPresetId, SliderLookConfig & Partial<Pick<SliderModuleConfig, 'slider_color' | 'track_color'>>>;

/** <mc-flow-look-editor> properties. */
export interface FlowLookEditorElement extends HTMLElement {
  flow: FlowConfig;
  hass?: HomeAssistant;
  /** The flow's key on the card (flowKeys); used for the budget lookup and section state. */
  flowKey: string;
  /** Requested / drawn / quality per flow key (quality = the card's tier). */
  budget?: FlowBudget;
  /** Open sections (inspector-owned) and their toggle. */
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  /** (r2) The object before the last preset / reset (inspector-owned); shows the inline Undo. */
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
  open: ReadonlySet<string>;
  onToggle?: (section: string) => void;
  /** (r2) The object before the last preset / reset (inspector-owned); shows the inline Undo. */
  undo?: SliderModuleConfig;
  onUndoChange?: (snapshot: SliderModuleConfig | undefined) => void;
  onChange?: (next: SliderModuleConfig) => void;
}
