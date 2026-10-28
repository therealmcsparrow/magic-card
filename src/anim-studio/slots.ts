import type { HomeAssistant } from '../types';
import type { MessageId } from './i18n';
import type { AnimationDoc, TargetRef } from './model';
import type { PreviewTile } from './tiles';

/*
 * Studio v2 slot contract: the shell (studio.ts) renders panels by tag in four places, chosen by
 * the document and the current selection. Feature tracks register their panels from their own
 * files with registerPanel(); the shell never imports a panel itself (the studio entry imports the
 * panel files), so a track adds a panel without touching studio.ts.
 *
 * Places: layers (left column: targets, parts, shapes), inspector (right column, contextual),
 * stage-tool (drawn on the preview stage; PanelSpec.dock picks where), timeline (under the stage).
 *
 * Every panel element receives these properties (StudioPanelProps):
 *   .doc .hass .library .time .disabled .selection .tile .stage
 * and may emit (bubbling, composed):
 *   doc-change { doc, label, transient? }   a drag sends transient moves, then one final event (one undo step)
 *   seek { time }                            0-1, the scrub position
 *   selection-change { selection }           a new StudioSelection
 *   preview-change { state?, value?, attributes? }  the preview's simulated entity (state switcher,
 *                                            value slider); the shell feeds it to the preview card
 */

export interface StudioSelection {
  kind: 'none' | 'keys' | 'target' | 'tool';
  /**
   * kind keys: the selected keys (`lane` is a timeline lane id or '*', `at` in % of the cycle; `id`
   * an optional stable key id, e.g. `lane@at`).
   */
  keys?: { target: TargetRef; lane: string; at: number; id?: string }[];
  /** kind target (and the keys' target): the primary selected target. */
  target?: TargetRef;
  /** Multi-select: every selected target (`target` is the primary one, included here). */
  targets?: TargetRef[];
  /** kind tool: the active stage tool (draw tools: pen, line, rect, ellipse, freehand, erase...). */
  tool?: string;
}

export const NO_SELECTION: StudioSelection = { kind: 'none' };

/** Properties the shell sets on every panel element. */
export interface StudioPanelProps {
  doc: AnimationDoc;
  hass?: HomeAssistant;
  /** The host's library ({ [id]: doc }). */
  library?: unknown;
  /** 0-1, the scrub position. */
  time: number;
  disabled: boolean;
  selection: StudioSelection;
  tile: PreviewTile;
  stage?: StageInfo;
}

/** The preview stage's geometry, for stage tools and overlays. */
export interface StageInfo {
  /** Unscaled size of the stage area, px. */
  rect: { width: number; height: number };
  /**
   * Scale the preview card is drawn at (fit to the area; screen px = card px x scale, from the
   * stage frame's top left). Stage tools sit inside the scaled frame: they divide pointer offsets by
   * it and must counter-scale handles, hit areas and strokes by 1 / scale so touch targets stay
   * >= 24 screen px. Tools in the `canvas` slot sit outside the scale and use `screen` instead.
   */
  scale: number;
  /** The moving element (or the selected target) in stage px. */
  subject?: { x: number; y: number; width: number; height: number };
  /** The icon's viewBox [x, y, w, h] when the subject is an icon rig. */
  viewBox?: [number, number, number, number];
  /** The card as drawn (scale and zoom offset included), CSS px from the top-left of the canvas slot. */
  screen?: { left: number; top: number; width: number; height: number };
}

/** `preview-change`: the preview's simulated entity. */
export interface PreviewChangeDetail {
  state?: string;
  value?: number;
  attributes?: Record<string, unknown>;
}

export interface DocChangeDetail {
  doc: AnimationDoc;
  /** Undo step label (sentence case). */
  label: string;
  /** A drag in progress: no undo step yet. */
  transient?: boolean;
}
export interface SeekDetail {
  time: number;
}
export interface SelectionChangeDetail {
  selection: StudioSelection;
}

export interface PanelSpec {
  /** Custom element tag of the panel. */
  tag: string;
  place: 'layers' | 'inspector' | 'stage-tool' | 'timeline';
  /** Shown for this document and selection. */
  when: (doc: AnimationDoc, sel: StudioSelection) => boolean;
  /** Section title (sentence case), an m() mark that the studio resolves with t(). */
  title: MessageId;
  /** Lower first; equal orders keep their registration order. */
  order: number;
  /**
   * stage-tool only: where the shell puts it. `overlay` (default): over the preview card, scaled with it,
   * filling the card (inset 0, card px). `top` / `bottom`: a bar above / below the canvas, unscaled, that
   * never covers the card (toolbars, the preview-entity capsule). `canvas`: over the whole card area, outside
   * the card's scale and zoom (inset 0, unscaled CSS px), for a tool that reads the pointer from
   * getBoundingClientRect(), such as the path canvas in overlay mode; it places its drawing from `stage.screen`.
   * The slot and the element have pointer-events none, so presses reach the card unless the tool turns them
   * on for its own targets; while a tool is in this slot the area has touch-action none.
   */
  dock?: 'overlay' | 'top' | 'bottom' | 'canvas';
}

/** The registered panels (registration order). */
export const PANELS: PanelSpec[] = [];

/** Register a panel; registering the same tag for the same place again replaces it. */
export function registerPanel(p: PanelSpec): void {
  const i = PANELS.findIndex((x) => x.tag === p.tag && x.place === p.place);
  if (i >= 0) PANELS[i] = p;
  else PANELS.push(p);
}

/** The panels of a place for this document and selection, by order (a `when` that throws hides its panel). */
export function panelsFor(place: PanelSpec['place'], doc: AnimationDoc, sel: StudioSelection): PanelSpec[] {
  return PANELS.map((p, i) => ({ p, i }))
    .filter(({ p }) => {
      if (p.place !== place) return false;
      try {
        return p.when(doc, sel);
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.p.order - b.p.order || a.i - b.i)
    .map(({ p }) => p);
}
