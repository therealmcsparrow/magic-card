import type { AnimationKind } from './model';
import { m, type MessageId } from './i18n';

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
  title: MessageId;
}

export const KIND_EDITORS: Record<AnimationKind, KindEditorSlot> = {
  keyframes: { tag: 'mc-anim-keyframes-editor', place: 'panel', title: m('anim-studio.editor-slots.timeline') },
  particles: { tag: 'mc-anim-particles-editor', place: 'inspector', title: m('anim-studio.editor-slots.particles') },
  path: { tag: 'mc-anim-path-editor', place: 'inspector', title: m('anim-studio.editor-slots.path') },
  sequence: { tag: 'mc-anim-sequence-editor', place: 'inspector', title: m('anim-studio.editor-slots.steps') },
};

/** The motion path editor in the stage's canvas slot while a path document is open (gets .stage). */
export const PATH_HOST_TAG = 'mc-anim-path-host';

/** Studio v2: the panel registry (layers, contextual inspector, stage tools, timeline). */
export * from './slots';

export const editorDefined = (tag: string): boolean => typeof customElements !== 'undefined' && !!customElements.get(tag);
