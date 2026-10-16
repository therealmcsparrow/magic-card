import type { AnimationKind } from './model';

/*
 * Where each kind's own editor goes in the studio (contract: .superpowers/sdd/anim-studio/
 * editor-contract.md). The shell renders an editor by its tag once it is defined, so the editors
 * live in their own files (src/anim-studio/editors/<kind>-editor.ts, imported by the entry) and
 * the shell never imports them itself; until one is defined its slot shows a placeholder.
 *
 * Props: .doc .hass .library ({ [id]: doc }) .time (0-1, the scrub position) .disabled
 * Events: doc-change { doc, label, transient? } (a drag: transient moves, one final event = one
 * undo step), seek { time } (0-1).
 */

export interface KindEditorSlot {
  tag: string;
  /** panel: the wide panel under the stage; inspector: the settings column. */
  place: 'panel' | 'inspector';
  title: string;
}

export const KIND_EDITORS: Record<AnimationKind, KindEditorSlot> = {
  keyframes: { tag: 'mc-anim-keyframes-editor', place: 'panel', title: 'Timeline' },
  particles: { tag: 'mc-anim-particles-editor', place: 'inspector', title: 'Particles' },
  path: { tag: 'mc-anim-path-editor', place: 'inspector', title: 'Path' },
  sequence: { tag: 'mc-anim-sequence-editor', place: 'inspector', title: 'Steps' },
};

/** Drawn over the preview stage while a path document is open (gets .stageRect). */
export const PATH_OVERLAY_TAG = 'mc-anim-path-overlay';

/** Studio v2: the panel registry (layers, contextual inspector, stage tools, timeline). */
export * from './slots';

export const editorDefined = (tag: string): boolean => typeof customElements !== 'undefined' && !!customElements.get(tag);
