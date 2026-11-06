import { fold } from '../../i18n/fold';
import { t as tl } from '../../i18n/labels';
import { ANIMATION_GROUPS, ANIMATION_PRESETS, GROUP_LABELS, getAnimationPreset } from '../../utils/animation-presets';
import { ANIMATION_CAPS, CUSTOM_PREFIX, SEQUENCEABLE_PRESETS, customRefId, isCustomRef, type AnimationDoc, type SequenceStep } from '../model';
import { t } from '../i18n';

// Pure helpers of the sequence editor (mc-anim-sequence-editor): what a step plays, how long it takes and where it sits
// in the cycle. The timing mirrors compile.ts (compileSchedule): a step starts `delay` s after the previous one ends
// and plays `duration × repeat`; a step that cannot play is skipped and takes no time.

/** The studio's library: documents by id. */
export type AnimationLibraryMap = Readonly<Record<string, AnimationDoc>>;

export type StepStatus = 'ok' | 'missing' | 'invalid';

export interface StepInfo {
  status: StepStatus;
  /** Display name: the preset's or document's name, else the raw reference. */
  name: string;
  /** What it is: 'Preset', 'Keyframes', 'Path'. */
  kind: string;
  /** s per play when the step sets no duration (undefined when it cannot play). */
  defaultDuration?: number;
  /** Why the step is skipped (status != ok). */
  problem?: string;
}

export interface TimelineEntry {
  index: number;
  status: StepStatus;
  /** s from the start of the cycle. */
  start: number;
  /** s per play (0 when skipped). */
  play: number;
  repeat: number;
  /** start + play × repeat */
  end: number;
}

export interface Timeline {
  entries: TimelineEntry[];
  /** s of one cycle. */
  total: number;
}

const r3 = (n: number): number => Math.round(n * 1000) / 1000;

/** A library document a sequence step may play: keyframes, or a path that moves the element / icon. */
export function sequenceableDoc(doc: AnimationDoc | undefined): boolean {
  return !!doc && (doc.kind === 'keyframes' || (doc.kind === 'path' && doc.path?.subject !== 'particles'));
}

/** Seconds of a CSS time ('0.6s', '600ms', '2'). */
export function cssSeconds(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return undefined;
  return /ms\s*$/i.test(v) ? n / 1000 : n;
}

/** What a step reference plays, and whether it can (selfId: the sequence's own id). */
export function stepInfo(animation: string, library: AnimationLibraryMap | undefined, selfId?: string): StepInfo {
  const ref = (animation ?? '').trim();
  if (!ref) return { status: 'invalid', name: t('anim-studio.sequence-utils.no-animation'), kind: '', problem: t('anim-studio.sequence-utils.pick-an-animation-for-this-step') };
  if (isCustomRef(ref)) {
    const id = customRefId(ref);
    if (selfId && id === selfId) return { status: 'invalid', name: id, kind: t('anim-studio.sequence-utils.sequence'), problem: t('anim-studio.sequence-utils.a-sequence-cannot-play-itself') };
    const doc = library?.[id];
    if (!doc) return { status: 'missing', name: id, kind: '', problem: t('anim-studio.sequence-utils.not-found-in-my-animations-this-step-is') };
    if (doc.kind === 'keyframes') return { status: 'ok', name: doc.name || id, kind: t('anim-studio.sequence-utils.keyframes'), defaultDuration: doc.duration };
    if (doc.kind === 'path') {
      return sequenceableDoc(doc)
        ? { status: 'ok', name: doc.name || id, kind: t('anim-studio.sequence-utils.path'), defaultDuration: doc.duration }
        : { status: 'invalid', name: doc.name || id, kind: t('anim-studio.sequence-utils.path'), problem: t('anim-studio.sequence-utils.particles-along-a-path-cannot-play-in-a') };
    }
    const kind = doc.kind === 'particles' ? t('anim-studio.sequence-utils.particles') : t('anim-studio.sequence-utils.sequence');
    return { status: 'invalid', name: doc.name || id, kind, problem: t('anim-studio.sequence-utils.kind-cannot-play-in-a-sequence-this-step', { kind }) };
  }
  const p = getAnimationPreset(ref);
  if (!p) return { status: 'missing', name: ref, kind: t('anim-studio.sequence-utils.preset'), problem: t('anim-studio.sequence-utils.unknown-preset-this-step-is-skipped') };
  if (!SEQUENCEABLE_PRESETS.has(p.id)) {
    return { status: 'invalid', name: tl(p.name), kind: t('anim-studio.sequence-utils.preset'), problem: t('anim-studio.sequence-utils.effects-with-their-own-layer-cannot-play') };
  }
  return { status: 'ok', name: tl(p.name), kind: t('anim-studio.sequence-utils.preset'), defaultDuration: cssSeconds(p.defaults.duration) };
}

/** Where each step sits in one cycle (as the player schedules it). */
export function sequenceTimeline(steps: readonly SequenceStep[] | undefined, library: AnimationLibraryMap | undefined, selfId?: string): Timeline {
  const entries: TimelineEntry[] = [];
  let cursor = 0;
  (steps ?? []).forEach((s, index) => {
    const info = stepInfo(s.animation, library, selfId);
    const play = info.status === 'ok' ? (s.duration ?? info.defaultDuration ?? 0) : 0;
    const repeat = Math.max(1, Math.round(s.repeat || 1));
    if (!play) {
      entries.push({ index, status: info.status === 'ok' ? 'invalid' : info.status, start: r3(cursor), play: 0, repeat, end: r3(cursor) });
      return;
    }
    const start = cursor + Math.max(0, s.delay || 0);
    const end = start + play * repeat;
    entries.push({ index, status: 'ok', start: r3(start), play: r3(play), repeat, end: r3(end) });
    cursor = end;
  });
  return { entries, total: r3(cursor) };
}

/** The step playing at `time` (0-1 of the cycle), or -1 (a delay, or nothing plays). */
export function activeStep(timeline: Timeline, time: number): number {
  if (!timeline.total) return -1;
  const t = Math.min(1, Math.max(0, time)) * timeline.total;
  const hit = timeline.entries.find((e) => e.play > 0 && t >= e.start && (t < e.end || (t === e.end && e.end === timeline.total)));
  return hit ? hit.index : -1;
}

/** `list` with the item at `from` moved to `to` (a new array; out of range = a copy). */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const out = [...list];
  if (from < 0 || from >= out.length || to < 0 || to >= out.length || from === to) return out;
  const [it] = out.splice(from, 1);
  out.splice(to, 0, it);
  return out;
}

/** A short "1.2 s" (trailing zeros dropped). */
export function formatSeconds(s: number): string {
  return `${r3(s).toFixed(2).replace(/\.?0+$/, '')} s`;
}

/** A step's one-line summary: "after 0.2 s · 0.6 s × 2". */
export function stepSummary(step: SequenceStep, info: StepInfo): string {
  const parts: string[] = [];
  if (step.delay > 0) parts.push(t('anim-studio.sequence-utils.after-seconds', { seconds: formatSeconds(step.delay) }));
  const dur = step.duration ?? info.defaultDuration;
  if (dur !== undefined) parts.push(formatSeconds(dur));
  if (step.repeat > 1) parts.push(`× ${step.repeat}`);
  return parts.join(' · ');
}

export interface PickerItem {
  /** The step's `animation` value. */
  value: string;
  name: string;
  /** 'Keyframes' / 'Path' for library documents. */
  kind?: string;
  icon: string;
  /** "0.6 s" */
  duration?: number;
}

export interface PickerGroup {
  label: string;
  items: PickerItem[];
}

const KIND_ICON: Record<string, string> = { keyframes: 'mdi:chart-bell-curve-cumulative', path: 'mdi:vector-curve' };

/**
 * The step picker: "My animations" (the library's keyframes and element / icon paths, not the
 * sequence itself), then the motion presets by group. `query` filters by name, id and group.
 */
export function stepPickerGroups(library: AnimationLibraryMap | undefined, selfId?: string, query = ''): PickerGroup[] {
  const q = fold(query.trim());
  const hit = (...s: Array<string | undefined>) => !q || s.some((x) => x && fold(x).includes(q));
  const groups: PickerGroup[] = [];
  const mine = Object.values(library ?? {})
    .filter((d) => d.id !== selfId && sequenceableDoc(d))
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
    .filter((d) => hit(d.name, d.id, t('anim-studio.sequence-utils.my-animations'), d.kind))
    .map<PickerItem>((d) => ({ value: CUSTOM_PREFIX + d.id, name: d.name || d.id, kind: d.kind === 'path' ? t('anim-studio.sequence-utils.path') : t('anim-studio.sequence-utils.keyframes'), icon: KIND_ICON[d.kind], duration: d.duration }));
  if (mine.length) groups.push({ label: t('anim-studio.sequence-utils.my-animations-2'), items: mine });
  for (const g of ANIMATION_GROUPS) {
    const items = ANIMATION_PRESETS.filter((p) => p.group === g && SEQUENCEABLE_PRESETS.has(p.id) && hit(tl(p.name), p.id, g, tl(GROUP_LABELS[g]))).map<PickerItem>((p) => ({
      value: p.id,
      name: tl(p.name),
      icon: 'mdi:motion-play-outline',
      duration: cssSeconds(p.defaults.duration),
    }));
    if (items.length) groups.push({ label: tl(GROUP_LABELS[g]), items });
  }
  return groups;
}

/** Room for another step. */
export const canAddStep = (steps: readonly SequenceStep[] | undefined): boolean => (steps?.length ?? 0) < ANIMATION_CAPS.steps;
