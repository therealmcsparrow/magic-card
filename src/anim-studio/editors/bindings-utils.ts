import type { AnimationDoc, AnimationKeyframe } from '../model';
import type { BindProperty, Binding, TargetRef } from '../model-v2-core';
import { m, t, type MessageId } from '../i18n';

/*
 * Pure helpers of the value bindings panel (editors/bindings-panel.ts): the bindable properties
 * with their units and default output ranges, and list edits on the document's bindings (all
 * targets share one list of at most 8).
 */

export const BINDINGS_MAX = 8;

export interface BindPropertyInfo {
  id: BindProperty;
  label: MessageId;
  /** Unit of the output numbers (shown in the field labels). */
  unit: string;
  /** Output when the property is picked. */
  output: [number, number] | [string, string];
  step: number;
  /** Only for icon parts, groups and shapes. */
  rigOnly?: boolean;
  hint: MessageId;
}

export const BIND_PROPERTY_INFO: BindPropertyInfo[] = [
  { id: 'rotate_speed', label: m('Rotation speed'), unit: '°/s', output: [0, 720], step: 10, hint: m('Spins continuously, faster as the value rises (a fan).') },
  { id: 'rotate', label: m('Rotation'), unit: '°', output: [0, 180], step: 5, hint: m('Turns to an angle (a needle or a dial).') },
  { id: 'x', label: m('Move X'), unit: 'px', output: [0, 12], step: 1, hint: m('Moves sideways.') },
  { id: 'y', label: m('Move Y'), unit: 'px', output: [0, -12], step: 1, hint: m('Moves up or down.') },
  { id: 'scale', label: m('Scale'), unit: '×', output: [0.8, 1.2], step: 0.05, hint: m('Grows with the value.') },
  { id: 'opacity', label: m('Opacity'), unit: '0-1', output: [0.3, 1], step: 0.05, hint: m('Fades in with the value.') },
  { id: 'draw', label: m('Draw'), unit: '0-1', output: [0, 1], step: 0.05, rigOnly: true, hint: m('Draws the line on (a battery or level).') },
  { id: 'color_mix', label: m('Colour mix'), unit: '', output: ['#9e9e9e', '#ffb300'], step: 1, hint: m('Blends from the first colour to the second.') },
  { id: 'speed', label: m('Playback speed'), unit: '×', output: [0.25, 2], step: 0.05, hint: m('Plays this animation faster or slower.') },
];

export const bindInfo = (p: BindProperty): BindPropertyInfo => BIND_PROPERTY_INFO.find((x) => x.id === p) ?? BIND_PROPERTY_INFO[0];

const isRigTarget = (t: TargetRef | string): boolean => /^(part|group|shape):/.test(t);

/** Properties a target can bind (draw only on rig pieces). */
export const propertiesFor = (target: TargetRef): BindPropertyInfo[] => BIND_PROPERTY_INFO.filter((p) => !p.rigOnly || isRigTarget(target));

/** The document's bindings (with their index) on one target. */
export function bindingsOf(doc: AnimationDoc | undefined, target: TargetRef | undefined): Array<{ b: Binding; index: number }> {
  if (!target || !Array.isArray(doc?.bindings)) return [];
  return doc!.bindings.map((b, index) => ({ b, index })).filter((x) => x.b.target === target);
}

export const canAddBinding = (doc: AnimationDoc | undefined): boolean => (doc?.bindings?.length ?? 0) < BINDINGS_MAX;

/** A new binding on `target`: rotation speed from 0..100 % for the icon, else the first property. */
export function newBinding(target: TargetRef, property?: BindProperty): Binding {
  const info = property ? bindInfo(property) : propertiesFor(target)[0];
  return { target, property: info.id, input: { min: 0, max: 100 }, output: [...info.output] as Binding['output'], smoothing: 0.4 };
}

/** The binding with another property: the new property's default output (numbers vs colours differ). */
export function withProperty(b: Binding, property: BindProperty): Binding {
  if (b.property === property) return b;
  return { ...b, property, output: [...bindInfo(property).output] as Binding['output'] };
}

/** The document with its bindings replaced (the field removed when empty). */
export function withBindings(doc: AnimationDoc, bindings: Binding[]): AnimationDoc {
  const next = { ...doc };
  if (bindings.length) next.bindings = bindings;
  else delete next.bindings;
  return next;
}

/** Why a binding cannot be saved as it is, if so. */
export function bindingProblem(b: Binding): string | undefined {
  if (b.input.min === b.input.max) return t('Min and max must differ.');
  if (b.input.attribute !== undefined && b.input.attribute !== '' && !ATTRIBUTE_RE.test(b.input.attribute)) return t('Attribute names use letters, digits, _ . and -.');
  return undefined;
}

export const ATTRIBUTE_RE = /^[a-z0-9_][a-z0-9_.-]{0,63}$/i;

/**
 * A bound property is a static value under the target's own animation: where the animation
 * animates the same CSS property, the animation wins while it plays. rotate / x / y / scale write
 * `transform` and add to the animation's rotate / translate / scale, so they only lose to a skew
 * lane (which animates `transform` too). The note for the panel, or undefined.
 */
export function laneConflict(doc: AnimationDoc | undefined, b: Binding): string | undefined {
  if (!doc) return undefined;
  const keys = b.target === 'element' || b.target === 'icon' ? doc.keyframes : doc.tracks?.find((t) => t.target === b.target)?.keyframes;
  if (!keys?.length) return undefined;
  const list = keys;
  const has = (f: (k: AnimationKeyframe) => unknown) => list.some((k) => f(k) !== undefined);
  switch (b.property) {
    case 'opacity':
      return has((k) => k.opacity) ? t('The timeline also animates the opacity here: while it plays, its opacity wins over this binding.') : undefined;
    case 'draw':
      return has((k) => k.draw) ? t('The timeline also animates the draw here: while it plays, it wins over this binding.') : undefined;
    case 'color_mix': {
      const lane = b.target === 'background' ? has((k) => k.background) : has((k) => k.color);
      return lane ? t('The timeline also animates this colour: while it plays, its colour wins over this binding.') : undefined;
    }
    case 'rotate':
    case 'x':
    case 'y':
    case 'scale':
      return has((k) => k.transform?.skew_x ?? k.transform?.skew_y) ? t('The timeline skews this target: while it plays, the skew replaces this binding’s movement.') : undefined;
    default:
      return undefined;
  }
}
