import type { AnimationKind } from './model';
import { m, type MessageId } from './i18n';

// Where each kind editor goes in the studio. The shell renders an editor by its tag once defined, so editors live in
// editors/<kind>-editor.ts. Props: .doc .hass .library .time .disabled. Events: doc-change { doc, label, transient? } (a
// drag sends transient moves, then one final event) and seek { time }.

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
