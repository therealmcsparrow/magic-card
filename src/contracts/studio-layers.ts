import type { AnimationDoc } from '../anim-studio/model';

/*
 * Contract: studio layers. Revision 1 (2026-10-18, epic F, brief 61 with the CEO's answers of
 * 2026-10-18; ADR 0029). Architect-owned. Not released, so later revisions are made in place (ADR 0020).
 *
 * Extends the studio v2 slot contract (src/anim-studio/slots.ts) for panels registered with
 * `place: 'layers'`. Provided by the studio shell (src/anim-studio/studio.ts) and
 * src/anim-studio/layer-view.ts; used by every layers panel: Card parts (targets-layers.ts), Icon
 * parts (parts-layers.ts), Shapes over / under the icon (draw-layers.ts), Particle layers
 * (particles-layers.ts, new), Path layers and Sequence steps (path-layers.ts, sequence-layers.ts, new).
 * Everything here lives in the studio chunk (dist/magic-card-animation-studio.js); magic-card.js
 * and the particles chunk never import it.
 *
 * 1. Order. A list that is a paint stack shows the top-most row first. Move up (button "Move up
 *    (drawn on top)", Alt+ArrowUp) = drawn later; Move down = drawn earlier. The storage order of
 *    the document never changes for display (rig.parts, rig.shapes, sim.emitters stay paint order,
 *    bottom first). Lists that are not paint stacks say so in their heading text: Card parts,
 *    keyframe tracks (properties combine, no order, not movable), Sequence steps (play order, first
 *    step first; Move up = earlier).
 *    Keyframes column, top to bottom: Shapes over the icon, Icon parts, Shapes under the icon, Card
 *    parts (LAYERS_ORDER). A shape moved down past the last "over" row becomes "under" (and back); a
 *    particles block moved past the Card content row flips ParticlesSpec.layer. Each move is one undo step.
 *
 * 2. Rows (LayerKey, stable across reorders):
 *    `target:<TargetRef>`        element, icon, name, state, background (Card parts)
 *    `part:<id>` `group:<id>`    icon parts and groups
 *    `shape:<id>`                drawn shapes
 *    `lane:<TargetRef>|<lane>`   a keyframe track = one animated property (EasingLaneId / LANES id) of a
 *                                target, listed indented under that target's row (disclosure, closed by
 *                                default, LayerView.open); shows the key count
 *    `emitter:<id>`              a particle emitter (primary: sim.id, or 'main' while the doc has one emitter)
 *    `children:<id>`             the child particles of that emitter (row present iff children are on)
 *    `pshape:<id>|<n>`           shape n of an emitter's mix (children: `pshape:<id>/c|<n>`); select only
 *    `content`                   the fixed Card content reference row of a particles doc (not hideable)
 *    `path` `subject`            path doc: the motion path and what moves along it
 *    `step:<n>`                  sequence step n (the panel remaps keys of the LayerView on a move)
 *
 * 3. Hide / solo / lock (CEO Q3: all lists, preview only, never saved).
 *    - The view is studio state per document id for the session (cleared when the studio closes or
 *      the page reloads). It is never in the document, the undo history, the dirty flag, YAML, the
 *      saved JSON, transfer files or exports. Keys of rows that no longer exist are pruned.
 *    - The shell renders the preview card from applyLayerView(doc, view); stage tools, inspectors,
 *      timeline, save and export get `doc`. While any row is hidden or soloed the stage shows a chip
 *      "Preview hides N layers" with a "Show all" button (clears hidden and solo, keeps locks).
 *    - Solo is scoped to its list: when a list has soloed rows, its other hideable rows are hidden.
 *      A lane solo hides every other lane of every target.
 *    - Lock: the row stays selectable from the list (its values show read-only); it cannot be picked
 *      on the stage, moved, renamed, deleted or edited, and keys of a locked lane or of a locked
 *      target cannot be added, moved or deleted. Inspectors show "Locked" and disable their fields.
 *    - Which toggles a row has: LAYER_TOGGLES. Rows without a toggle render no button for it.
 *    - What hide does in the preview document (applyLayerView, pure, same input same output):
 *      part / group / shape / name / state / background / icon: its opacity is 0 at every key of its
 *        track (a track at 0 and 100 is added when it has none); bindings and clips that write its
 *        opacity are dropped for it. element: no hide (the whole card would vanish).
 *      lane: that property is removed from every key of that target (including clips' tracks); its
 *        bindings are dropped; the target rests at its base value.
 *      emitter: ranges.opacity and its children's ranges.opacity become [0, 0] (seeds unchanged, so
 *        the other emitters keep their exact motion; particles-v2 1.2.0). children: only the children's.
 *      step: removed from the preview's steps.
 *      path / subject / content / pshape: no hide.
 *
 * 4. Density (CEO Q1: the narrow view shows the full list). Below RAIL_BELOW (1000 px) the column
 *    no longer collapses to icons by default: it renders every layers panel with density 'compact'
 *    (one-line rows: icon, name truncated with the full name as title and accessible name, state
 *    glyphs for hidden / solo / locked, and one "Layer actions" menu button holding Move up / down,
 *    Hide, Solo, Lock). The icons-only rail stays as an explicit user choice ("Collapse layers",
 *    stored as today in the layers preference). Wide view: density 'full' (buttons inline).
 *
 * 5. Keyboard and access (WCAG 2.2 AA, brief AC8-AC10). Each panel is a list with an accessible
 *    name; rows are buttons with aria-pressed (selected). Up / Down move between rows across the
 *    column's lists, Home / End jump, Enter / Space select (opens and scrolls to the matching editor
 *    section), Right / Left open / close a disclosure, Alt+ArrowUp / Down move, and with a row focused
 *    H hide, S solo, L lock (aria-keyshortcuts on the row). Toggle buttons have aria-pressed and the
 *    labels "Hide in preview", "Solo in preview", "Lock". Moves and toggles are announced through the
 *    shell's live region. Targets >= 24 x 24 px; focus 2 px accent outline; reduced motion: no row
 *    transitions.
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

/** The document the preview card renders (src/anim-studio/layer-view.ts). Pure; returns `doc` itself when nothing is hidden or soloed. */
export type ApplyLayerView = (doc: AnimationDoc, view: LayerView) => AnimationDoc;

/** Whether a key is locked, directly or through its target (a lane of a locked target, a member of a locked group). */
export type IsLocked = (doc: AnimationDoc, view: LayerView, key: LayerKey) => boolean;
