import { t as tl } from '../../i18n/labels';
import { ANIMATION_GROUPS, ANIMATION_PRESETS, GROUP_LABELS, getAnimationPreset } from '../../utils/animation-presets';
import { CUSTOM_PREFIX, SEQUENCEABLE_PRESETS, customRefId, isCustomRef, type AnimationDoc } from '../model';
import type { Clip, ClipWhen } from '../model-v2-core';
import { sequenceableDoc } from './sequence-utils';
import { t, m, type MessageId } from '../i18n';

/*
 * Pure helpers of the States panel (editors/states-panel.ts): clip conditions as a kind plus a
 * value, the animations a clip may play, and list edits. Clips play list animations only
 * (keyframes and path documents, motion presets); a document that has states of its own is left
 * out (no recursion: the card would skip that clip).
 */

export const CLIPS_MAX = 12;

export type WhenKind = 'state' | 'state_not' | 'entity_on' | 'entity_off' | 'above' | 'below';

export const WHEN_KINDS: Array<{ id: WhenKind; label: MessageId }> = [
  { id: 'state', label: m('anim-studio.states-utils.state-is') },
  { id: 'state_not', label: m('anim-studio.states-utils.state-is-not') },
  { id: 'entity_on', label: m('anim-studio.states-utils.entity-is-on') },
  { id: 'entity_off', label: m('anim-studio.states-utils.entity-is-off') },
  { id: 'above', label: m('anim-studio.states-utils.value-above') },
  { id: 'below', label: m('anim-studio.states-utils.value-below') },
];

export const TRANSITIONS: Array<{ id: NonNullable<Clip['transition']>; label: MessageId; hint: MessageId }> = [
  { id: 'cut', label: m('anim-studio.states-utils.cut'), hint: m('anim-studio.states-utils.switch-at-once') },
  { id: 'crossfade', label: m('anim-studio.states-utils.crossfade'), hint: m('anim-studio.states-utils.fade-out-and-back-in-0-2-s') },
  { id: 'finish', label: m('anim-studio.states-utils.finish-cycle'), hint: m('anim-studio.states-utils.let-the-current-cycle-end-first') },
];

export function whenKind(w: ClipWhen): WhenKind {
  if ('state' in w) return 'state';
  if ('state_not' in w) return 'state_not';
  if ('entity_on' in w) return w.entity_on ? 'entity_on' : 'entity_off';
  return 'above' in w ? 'above' : 'below';
}

/** The condition's value as text ('' for entity on / off). */
export function whenValue(w: ClipWhen): string {
  if ('state' in w) return w.state;
  if ('state_not' in w) return w.state_not;
  if ('above' in w) return String(w.above);
  if ('below' in w) return String(w.below);
  return '';
}

/** A condition of `kind`, keeping the value of `prev` where it fits. */
export function whenOf(kind: WhenKind, value: string): ClipWhen {
  const n = Number(value);
  const num = value.trim() !== '' && Number.isFinite(n) ? n : 0;
  const text = value.trim() || 'on';
  switch (kind) {
    case 'state':
      return { state: text };
    case 'state_not':
      return { state_not: text };
    case 'entity_on':
      return { entity_on: true };
    case 'entity_off':
      return { entity_on: false };
    case 'above':
      return { above: num };
    case 'below':
      return { below: num };
  }
}

export interface ClipOption {
  value: string;
  label: string;
}
export interface ClipOptionGroup {
  label: string;
  items: ClipOption[];
}

/** Library documents as a list (the host passes a map by id, a Map or a list). */
export function libraryList(library: unknown): AnimationDoc[] {
  if (!library || typeof library !== 'object') return [];
  const values = library instanceof Map ? [...library.values()] : Array.isArray(library) ? library : Object.values(library);
  return values.filter((d): d is AnimationDoc => !!d && typeof d === 'object' && typeof (d as AnimationDoc).id === 'string');
}

/** A library document a clip can play: a list animation without states of its own. */
export const clipPlayable = (doc: AnimationDoc | undefined, selfId?: string): boolean =>
  !!doc && doc.id !== selfId && sequenceableDoc(doc) && !(Array.isArray(doc.clips) && doc.clips.length > 0);

/** What a clip may play, grouped for the picker. */
export function clipOptions(library: unknown, selfId?: string): ClipOptionGroup[] {
  const groups: ClipOptionGroup[] = [
    {
      label: t('anim-studio.states-utils.this-animation'),
      items: [
        { value: 'self', label: t('anim-studio.states-utils.own-timeline') },
        { value: 'none', label: t('anim-studio.states-utils.nothing-stop') },
      ],
    },
  ];
  const mine = libraryList(library)
    .filter((d) => clipPlayable(d, selfId))
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
    .map((d) => ({ value: CUSTOM_PREFIX + d.id, label: d.name || d.id }));
  if (mine.length) groups.push({ label: t('anim-studio.states-utils.my-animations'), items: mine });
  for (const g of ANIMATION_GROUPS) {
    const items = ANIMATION_PRESETS.filter((p) => p.group === g && SEQUENCEABLE_PRESETS.has(p.id)).map((p) => ({ value: p.id, label: tl(p.name) }));
    if (items.length) groups.push({ label: tl(GROUP_LABELS[g]), items });
  }
  return groups;
}

/** A clip animation's display name. */
export function clipAnimationLabel(animation: string, library: unknown, selfId?: string): string {
  if (animation === 'self') return t('anim-studio.states-utils.own-timeline');
  if (animation === 'none') return t('anim-studio.states-utils.nothing');
  if (isCustomRef(animation)) {
    const id = customRefId(animation);
    const doc = libraryList(library).find((d) => d.id === id);
    return doc ? doc.name || doc.id : id === selfId ? t('anim-studio.states-utils.own-timeline') : t('anim-studio.states-utils.id-not-found', { id });
  }
  const known = getAnimationPreset(animation)?.name;
  return known !== undefined ? tl(known) : t('anim-studio.states-utils.animation-unknown', { animation });
}

/** Why a clip plays nothing in the card, if it does not. */
export function clipProblem(clip: Clip, library: unknown, selfId?: string): string | undefined {
  if (!isCustomRef(clip.animation)) {
    if (clip.animation === 'self' || clip.animation === 'none') return undefined;
    if (!getAnimationPreset(clip.animation)) return t('anim-studio.states-utils.unknown-preset-plays-nothing');
    return SEQUENCEABLE_PRESETS.has(clip.animation) ? undefined : t('anim-studio.states-utils.effect-presets-cannot-play-as-a-state');
  }
  const id = customRefId(clip.animation);
  if (id === selfId) return t('anim-studio.states-utils.use-own-timeline-to-play-this-animation');
  const doc = libraryList(library).find((d) => d.id === id);
  if (!doc) return t('anim-studio.states-utils.not-in-your-animations-plays-nothing');
  if (Array.isArray(doc.clips) && doc.clips.length) return t('anim-studio.states-utils.that-animation-has-states-of-its-own-the');
  if (!sequenceableDoc(doc)) return t('anim-studio.states-utils.particle-and-sequence-animations-cannot');
  return undefined;
}

/** A new clip: on first, then off, then a value condition. */
export function newClip(clips: readonly Clip[]): Clip {
  const used = new Set(clips.map((c) => ('state' in c.when ? c.when.state : '')));
  if (used.has('on') && used.has('off')) return { when: { above: 50 }, animation: 'self', transition: 'crossfade' };
  const state = used.has('on') ? 'off' : 'on';
  return { when: { state }, animation: state === 'off' ? 'none' : 'self', transition: 'crossfade' };
}

export const canAddClip = (clips: readonly Clip[] | undefined): boolean => (clips?.length ?? 0) < CLIPS_MAX;

/** The list with item `from` moved to `to`. */
export function moveClip<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return [...list];
  const out = [...list];
  const [x] = out.splice(from, 1);
  out.splice(to, 0, x);
  return out;
}
