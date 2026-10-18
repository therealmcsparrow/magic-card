import type { AnimationDoc } from '../anim-studio/model';
import type { CompiledEmitterSlots } from './particles-v2';

/*
 * Contract: studio layers. Revision 1 (2026-10-18, epic F, brief 61 with the CEO's answers of
 * 2026-10-18; ADR 0029). Architect-owned. Not released, so later revisions are made in place (ADR 0020).
 * Amended in place 2026-10-18 (Plan Gate: placement per emitter, ADR 0028 revision): section 1, the
 * particles move rule.
 * Amended in place 2026-10-18 (spike F-S2, 65-spike-frontend-f-s2.md; ADR 0029 revision): section 3,
 * how hide reaches the preview. Hides of rows that are drawn (parts, groups, shapes, card parts,
 * emitters, children) are a stage-only stylesheet (StageHide), not a change to the preview document.
 * The preview document (ApplyLayerView) now carries only lane and step hides. Reason: a document
 * opacity override fails for finite iterations, reduced motion, a clip other than `self` and the
 * clip crossfade, and rewriting the document to hide an emitter costs 173-364 ms median at 4x CPU
 * (budget 150 ms); the stage rule measured 14-16 ms median and passed every case.
 *
 * Extends the studio v2 slot contract (src/anim-studio/slots.ts) for panels registered with
 * `place: 'layers'`. Provided by the studio shell (src/anim-studio/studio.ts) and
 * src/anim-studio/layer-view.ts (plus src/anim-studio/stage-hide.ts, new); used by every layers panel:
 * Card parts (targets-layers.ts), Icon parts (parts-layers.ts), Shapes over / under the icon
 * (draw-layers.ts), Particle layers (particles-layers.ts, new), Path layers and Sequence steps
 * (path-layers.ts, sequence-layers.ts, new). Everything here lives in the studio chunk
 * (dist/magic-card-animation-studio.js); magic-card.js and the particles chunk never import it.
 *
 * 1. Order. A list that is a paint stack shows the top-most row first. Move up (button "Move up
 *    (drawn on top)", Alt+ArrowUp) = drawn later; Move down = drawn earlier. The storage order of
 *    the document never changes for display (rig.parts, rig.shapes, sim.emitters stay paint order,
 *    bottom first). Lists that are not paint stacks say so in their heading text: Card parts,
 *    keyframe tracks (properties combine, no order, not movable), Sequence steps (play order, first
 *    step first; Move up = earlier).
 *    Keyframes column, top to bottom: Shapes over the icon, Icon parts, Shapes under the icon, Card
 *    parts (LAYERS_ORDER). A shape moved down past the last "over" row becomes "under" (and back).
 *    Each move is one undo step.
 *    Particle layers list, top to bottom: the emitters in front of the content (top-most first), the
 *    fixed Card content row, the emitters behind it (top-most first). One emitter moved past the Card
 *    content row changes only that emitter's placement (particles-v2 1.2.0: ParticleEmitter.layer;
 *    for the primary ParticlesSpec.layer, with the extras' `layer` rewritten so they stay where they
 *    are). Within one side, moves reorder sim.emitters as before.
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
 *    - Solo is scoped to its list: when a list has soloed rows, its other hideable rows are hidden.
 *      A lane solo hides every other lane of every target. Solo is resolved first into a set of
 *      hidden keys ("effective hidden"); everything below acts on that set.
 *    - While any row is hidden or soloed the stage shows a chip "Preview hides N layers" with a
 *      "Show all" button (clears hidden and solo, keeps locks).
 *    - Lock: the row stays selectable from the list (its values show read-only); it cannot be picked
 *      on the stage, moved, renamed, deleted or edited, and keys of a locked lane or of a locked
 *      target cannot be added, moved or deleted. Inspectors show "Locked" and disable their fields.
 *    - Which toggles a row has: LAYER_TOGGLES. Rows without a toggle render no button for it.
 *
 *    3a. Drawn rows: the stage sheet (StageHide, src/anim-studio/stage-hide.ts, pure). Rows `target:`
 *      (except element), `part:`, `group:`, `shape:`, `emitter:`, `children:`. The preview card gets
 *      the UNCHANGED document; the shell adds CSS rules `opacity:0!important` (an important
 *      declaration beats CSS animations, Web Animations incl. the clip crossfade, bindings' inline
 *      styles and live particle frames) in two places of the preview card only, never on a
 *      dashboard card:
 *      - icon sheet, adopted into the rig icon's shadow root next to the rig's own sheet (the rig
 *        swaps only its own sheet, so a re-render keeps this one; F-L0 tests it):
 *        part `[data-p="<id>"]`, group `[data-g="<id>"]`, shape `[data-s="<id>"]`.
 *      - card sheet, adopted into the preview card's shadow root:
 *        name / state / icon `[data-mc-part="<target>"]`, scoped to the animated wrapper's own parts
 *        the way src/anim-runtime/targets.ts scopes them (not a nested module's parts);
 *        background `.mc-module-wrapper{background:none!important}` (the wrapper's own background)
 *        plus `[data-mc-gen-bg]{opacity:0!important}` (the generated layer while a background track plays);
 *        emitter / children: `.mc-anim-fx[data-fx^="<base><o>-g"]>i:nth-child(n+<a>):nth-child(-n+<b>)`
 *        where <base> is CompiledParticlesV2.name without its `-g<key>` suffix, <o> is `o` for
 *        part 1 and empty for part 0, and a..b (1-based, inclusive) come from
 *        CompiledParticlesV2.emitterSlots (particles-v2 1.2.0): emitter = first+1 .. first+parents+children,
 *        children = first+parents+1 .. first+parents+children (no rule when children is 0).
 *      The selectors above (data-p, data-g, data-s, data-mc-part, data-mc-gen-bg, .mc-module-wrapper,
 *      .mc-anim-fx, data-fx names, slot order) become a studio-facing surface of the runtime: a
 *      change to any of them is a change to this contract (guard test tests/stage-hide.test.ts, F-L0).
 *      element: no hide (the whole card would vanish). The `data-s` rule is only ever put in the
 *      icon sheet (particle slots use `data-s` for built-in shapes in the card's shadow root).
 *      Emitter slot ranges do not depend on geometry (the pool is the same at every geometry), so
 *      the shell computes them once per document change by compiling the particles spec at
 *      `{ aspect: 0 }` (no bake), not per frame.
 *    3b. Rows that only a document can express: the preview document (ApplyLayerView, pure, same
 *      input same output, returns `doc` itself when no lane or step is effectively hidden):
 *      lane: that property is removed from every key of that target (including clips' tracks); its
 *        bindings are dropped; the target rests at its base value.
 *      step: removed from the preview's steps.
 *      ApplyLayerView never changes opacity to hide a row. If a later revision brings a document
 *      opacity override back, it must also add keys at 0 % and 100 % when the track lacks them (a
 *      track with keys at 30 / 70 % shows its rest value outside them), and still cannot cover
 *      finite iterations, reduced motion or a clip other than `self`.
 *    3c. path / subject / content / pshape: no hide.
 *    - Stage tools, inspectors, timeline, save and export always get the real `doc`.
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
 *    shell's live region (a move past Card content: "<name> moved in front of the content" / "behind
 *    the content"). Targets >= 24 x 24 px; focus 2 px accent outline; reduced motion: no row
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
