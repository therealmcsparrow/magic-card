import type { AnimationDoc } from '../anim-studio/model';
import type { CompiledEmitterSlots } from './particles-v2';

/**
 * Contract: studio layers. Section 1 holds the particles move rule (placement per emitter). Section 3 says how
 * hide reaches the preview. Hides of rows that are drawn (parts, groups, shapes, card parts, emitters, children)
 * are a stage-only stylesheet (StageHide), not a change to the preview document.
 */

export const STUDIO_LAYERS_REVISION = 1;

/** Section order of a keyframes document's layers column (panel `order` values follow it). */
export const LAYERS_ORDER = ['mc-anim-shapes-layers', 'mc-anim-parts-layers', 'mc-anim-shapes-under-layers', 'mc-anim-targets-layers'] as const;

export type LayerKey = string;

export type LayerToggle = 'hide' | 'solo' | 'lock';

/** Row kind (the LayerKey prefix) -> the toggles it offers. */
export const LAYER_TOGGLES: Record<string, readonly LayerToggle[]> = {
  target: ['hide', 'solo', 'lock'],
  part: ['hide', 'solo', 'lock'],
  group: ['hide', 'solo', 'lock'],
  shape: ['hide', 'solo', 'lock'],
  lane: ['hide', 'solo', 'lock'],
  emitter: ['hide', 'solo', 'lock'],
  children: ['hide', 'solo', 'lock'],
  pshape: [],
  content: [],
  path: ['lock'],
  subject: ['lock'],
  step: ['hide', 'solo', 'lock'],
};

/** Row kinds hidden through the stage sheet (section 3a); every other hideable kind goes through ApplyLayerView (3b). */
export const STAGE_HIDE_KINDS = ['target', 'part', 'group', 'shape', 'emitter', 'children'] as const;

/** Preview-only state of one document's layers (never saved). */
export interface LayerView {
  hidden: LayerKey[];
  solo: LayerKey[];
  locked: LayerKey[];
  /** Open disclosures (target rows showing their lanes, emitter rows showing their shapes). */
  open: LayerKey[];
}

export const EMPTY_LAYER_VIEW: LayerView = { hidden: [], solo: [], locked: [], open: [] };

export type LayersDensity = 'full' | 'compact';

/** Extra properties the shell sets on `place: 'layers'` panels (besides StudioPanelProps), and `layerView` on inspector, stage-tool and timeline panels too (lock). */
export interface StudioLayersProps {
  layerView: LayerView;
  density: LayersDensity;
}

/** `layer-view-change` (bubbling, composed): the panel's new view; the shell stores it and re-renders the preview. Not an undo step. */
export interface LayerViewChangeDetail {
  view: LayerView;
  /** Live-region text, e.g. "Rain hidden in the preview". */
  announce?: string;
}

/** The document the preview card renders (src/anim-studio/layer-view.ts). Pure; lanes and steps only (section 3b); returns `doc` itself when no lane or step is hidden. */
export type ApplyLayerView = (doc: AnimationDoc, view: LayerView) => AnimationDoc;

/** What the particles compiler reports for the document being previewed (section 3a); missing for documents without a v2 sim. */
export interface StageParticles {
  /** CompiledParticlesV2.name without its `-g<key>` suffix. */
  base: string;
  /** CompiledParticlesV2.emitterSlots. */
  emitterSlots: CompiledEmitterSlots[];
  /** LayerKey id per emitter index (index 0 = primary: sim.id or 'main'; then sim.emitters[i].id). */
  ids: string[];
}

/** The stage-only hide rules (src/anim-studio/stage-hide.ts, section 3a). Pure; empty strings when nothing drawn is hidden. */
export type StageHide = (doc: AnimationDoc, view: LayerView, particles?: StageParticles) => { icon: string; card: string };

/** Whether a key is locked, directly or through its target (a lane of a locked target, a member of a locked group). */
export type IsLocked = (doc: AnimationDoc, view: LayerView, key: LayerKey) => boolean;
