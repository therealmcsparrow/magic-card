import type { AnimationDoc, AnimationKeyframe, KeyframeTransform, TargetRef, Track } from '../model';
import { safeCssValue } from '../model';
import { EASINGS } from '../../utils/animation-presets';
import type { MessageIndex as LabelId } from '../../contracts/i18n';
import { t as tl } from '../../i18n/labels';
import { m, t, type MessageId } from '../i18n';

// Pure, copy-on-write helpers of the keyframe timeline editor and its key inspector. A lane is one property; a key is {
// lane, at } and lane `*` is the whole keyframe. Moving a lane key splits it off its keyframe and merges it at the new
// time. Per target a timeline key is { target, lane, at } (TKey); top-level `keyframes` move `doc.target`, `doc.tracks`
// hold the other targets, `easings[lane]` overrides `easing`.

export type LaneId =
  | 'x'
  | 'y'
  | 'scale'
  | 'scale_x'
  | 'scale_y'
  | 'rotate'
  | 'skew'
  | 'opacity'
  | 'color'
  | 'background'
  | 'shadow'
  | 'blur'
  | 'radius'
  | 'filter'
  // v2: icon parts, groups and drawn shapes only (RIG_LANES)
  | 'draw'
  | 'stroke';

/** A lane, or `*` for the whole keyframe. */
export type KeyLane = LaneId | '*';

export interface LaneDef {
  id: LaneId;
  /** An m() mark; read it through laneLabel(). */
  label: MessageId;
  group: 'Transform' | 'Appearance';
  icon: string;
  /** What the lane holds: numbers (interpolated), or a CSS value (held until the next key). */
  kind: 'number' | 'css';
  /** The fragment a new key gets when the lane has no key to sample. */
  def: Fragment;
  /** Only on icon parts, groups and shapes (rig targets). */
  rig?: boolean;
}

/** The part of a keyframe one lane owns (rotate carries its axis, skew both axes). */
export interface Fragment {
  transform?: KeyframeTransform;
  opacity?: number;
  color?: string;
  background?: string;
  shadow?: string;
  filter?: string;
  blur?: number;
  radius?: number;
  /** v2, rig targets: stroke reveal 0-1. */
  draw?: number;
  /** v2, rig targets: stroke colour. */
  stroke?: string;
}

export const ANIM_COLOR = 'var(--mc-anim-c)';

/** The card lanes (every target has them). */
export const LANES: LaneDef[] = [
  { id: 'x', label: m('anim-studio.keyframes-utils.move-x'), group: 'Transform', icon: 'mdi:arrow-left-right', kind: 'number', def: { transform: { x: 0 } } },
  { id: 'y', label: m('anim-studio.keyframes-utils.move-y'), group: 'Transform', icon: 'mdi:arrow-up-down', kind: 'number', def: { transform: { y: 0 } } },
  { id: 'scale', label: m('anim-studio.keyframes-utils.scale'), group: 'Transform', icon: 'mdi:resize', kind: 'number', def: { transform: { scale: 1 } } },
  { id: 'scale_x', label: m('anim-studio.keyframes-utils.scale-x'), group: 'Transform', icon: 'mdi:arrow-expand-horizontal', kind: 'number', def: { transform: { scale_x: 1 } } },
  { id: 'scale_y', label: m('anim-studio.keyframes-utils.scale-y'), group: 'Transform', icon: 'mdi:arrow-expand-vertical', kind: 'number', def: { transform: { scale_y: 1 } } },
  { id: 'rotate', label: m('anim-studio.keyframes-utils.rotate'), group: 'Transform', icon: 'mdi:rotate-right', kind: 'number', def: { transform: { rotate: 0 } } },
  { id: 'skew', label: m('anim-studio.keyframes-utils.skew'), group: 'Transform', icon: 'mdi:vector-polygon', kind: 'number', def: { transform: { skew_x: 0, skew_y: 0 } } },
  { id: 'opacity', label: m('anim-studio.keyframes-utils.opacity'), group: 'Appearance', icon: 'mdi:circle-opacity', kind: 'number', def: { opacity: 1 } },
  { id: 'color', label: m('anim-studio.keyframes-utils.colour'), group: 'Appearance', icon: 'mdi:format-color-text', kind: 'css', def: { color: ANIM_COLOR } },
  {
    id: 'background',
    label: m('anim-studio.keyframes-utils.background'),
    group: 'Appearance',
    icon: 'mdi:format-color-fill',
    kind: 'css',
    def: { background: `color-mix(in srgb, ${ANIM_COLOR} 20%, transparent)` },
  },
  { id: 'shadow', label: m('anim-studio.keyframes-utils.shadow-and-glow'), group: 'Appearance', icon: 'mdi:box-shadow', kind: 'css', def: { shadow: `0 0 16px 2px ${ANIM_COLOR}` } },
  { id: 'blur', label: m('anim-studio.keyframes-utils.blur'), group: 'Appearance', icon: 'mdi:blur', kind: 'number', def: { blur: 0 } },
  { id: 'radius', label: m('anim-studio.keyframes-utils.corner-radius'), group: 'Appearance', icon: 'mdi:rounded-corner', kind: 'number', def: { radius: 0 } },
  { id: 'filter', label: m('anim-studio.keyframes-utils.filter'), group: 'Appearance', icon: 'mdi:auto-fix', kind: 'css', def: { filter: 'brightness(1.2)' } },
];
/** Lanes of icon parts, groups and drawn shapes only (LANES stay the card lanes). */
export const RIG_LANES: LaneDef[] = [
  { id: 'draw', label: m('anim-studio.keyframes-utils.draw-on'), group: 'Appearance', icon: 'mdi:draw', kind: 'number', def: { draw: 1 }, rig: true },
  { id: 'stroke', label: m('anim-studio.keyframes-utils.stroke-colour'), group: 'Appearance', icon: 'mdi:border-color', kind: 'css', def: { stroke: ANIM_COLOR }, rig: true },
];
/** Every lane a keyframe may hold. */
export const ALL_LANES: LaneDef[] = [...LANES, ...RIG_LANES];
export const LANE_BY_ID = Object.fromEntries(ALL_LANES.map((l) => [l.id, l])) as Record<LaneId, LaneDef>;

/** A piece of the icon rig (part, group, shape): it also has the rig lanes. */
/** Below this width (px) the timeline shows a keyframe list instead of lanes. */
export const TIMELINE_NARROW = 480;
export const isRigRef = (t: string | undefined): boolean => !!t && /^(part|group|shape):/.test(t);
/** The lanes a target can animate. */
/** A lane's name in the current language. */
export const laneLabel = (lane: LaneId): string => t(LANE_BY_ID[lane].label);

export const lanesFor = (target: TargetRef | string | undefined): LaneDef[] => (isRigRef(target) ? ALL_LANES : LANES);

/**
 * Lanes written to one CSS property share its per-lane easing (compile.ts PROPERTY_LANES: the
 * first override of a property wins), so the timeline sets them together.
 */
export const EASING_GROUPS: LaneId[][] = [
  ['x', 'y'],
  ['scale', 'scale_x', 'scale_y'],
  ['filter', 'blur'],
];
export const easingGroup = (lane: LaneId): LaneId[] => EASING_GROUPS.find((g) => g.includes(lane)) ?? [lane];

/** Transform fields per lane. */
const T_FIELDS: Partial<Record<LaneId, Array<keyof KeyframeTransform>>> = {
  x: ['x'],
  y: ['y'],
  scale: ['scale'],
  scale_x: ['scale_x'],
  scale_y: ['scale_y'],
  rotate: ['rotate', 'axis'],
  skew: ['skew_x', 'skew_y'],
};

export function laneHas(k: AnimationKeyframe, lane: KeyLane): boolean {
  if (lane === '*') return true;
  const t = T_FIELDS[lane];
  if (t) return lane === 'rotate' ? k.transform?.rotate !== undefined : t.some((f) => k.transform?.[f] !== undefined);
  return (k as unknown as Record<string, unknown>)[lane] !== undefined;
}

/** True when a keyframe sets nothing (only `at` / `easing` / `easings`). */
export const isEmptyKeyframe = (k: AnimationKeyframe): boolean => ALL_LANES.every((l) => !laneHas(k, l.id));

/** The lane's part of a keyframe (deep copy). */
export function fragmentOf(k: AnimationKeyframe, lane: LaneId): Fragment {
  const t = T_FIELDS[lane];
  if (t) {
    const out: KeyframeTransform = {};
    for (const f of t) {
      const v = k.transform?.[f];
      if (v !== undefined) (out as Record<string, unknown>)[f] = Array.isArray(v) ? [...v] : v;
    }
    return { transform: out };
  }
  const v = (k as unknown as Record<string, unknown>)[lane];
  return v === undefined ? {} : ({ [lane]: v } as Fragment);
}

/** All lane parts of a keyframe (no at / easing). */
export function fragmentsOf(k: AnimationKeyframe): Fragment {
  return ALL_LANES.reduce<Fragment>((acc, l) => (laneHas(k, l.id) ? mergeFragment(acc, fragmentOf(k, l.id)) : acc), {});
}

/** `k` with `f` merged in (f wins). */
export function mergeFragment<T extends Fragment>(k: T, f: Fragment): T {
  const out = { ...k } as T;
  for (const [key, v] of Object.entries(f)) {
    if (key === 'transform') out.transform = { ...(k.transform ?? {}), ...(v as KeyframeTransform) };
    else (out as Record<string, unknown>)[key] = v;
  }
  if (out.transform && !Object.keys(out.transform).length) delete out.transform;
  return out;
}

/** `k` without the lane's part (and its per-lane easing). */
export function stripLane(k: AnimationKeyframe, lane: LaneId): AnimationKeyframe {
  const out: AnimationKeyframe = { ...k };
  if (out.easings && out.easings[lane] !== undefined) {
    const e = { ...out.easings };
    delete e[lane];
    if (Object.keys(e).length) out.easings = e;
    else delete out.easings;
  }
  const t = T_FIELDS[lane];
  if (t) {
    if (out.transform) {
      const tr = { ...out.transform };
      for (const f of t) delete tr[f];
      if (Object.keys(tr).length) out.transform = tr;
      else delete out.transform;
    }
  } else delete (out as unknown as Record<string, unknown>)[lane];
  return out;
}

/** Lanes that have at least one key, in lane order. */
export const usedLanes = (kfs: AnimationKeyframe[]): LaneId[] => ALL_LANES.filter((l) => kfs.some((k) => laneHas(k, l.id))).map((l) => l.id);

export interface Key {
  lane: KeyLane;
  at: number;
}
export const keyId = (k: Key): string => `${k.lane}@${k.at}`;
export function parseKeyId(id: string): Key {
  const i = id.lastIndexOf('@');
  return { lane: id.slice(0, i) as KeyLane, at: Number(id.slice(i + 1)) };
}

/** Sorted distinct times where the lane has a key. */
export function laneTimes(kfs: AnimationKeyframe[], lane: KeyLane): number[] {
  return [...new Set(kfs.filter((k) => laneHas(k, lane)).map((k) => k.at))].sort((a, b) => a - b);
}

/** Every key of every lane (and the summary lane). */
export function allKeys(kfs: AnimationKeyframe[]): Key[] {
  const out: Key[] = laneTimes(kfs, '*').map((at) => ({ lane: '*', at }));
  for (const l of usedLanes(kfs)) for (const at of laneTimes(kfs, l)) out.push({ lane: l, at });
  return out;
}

export const keyExists = (kfs: AnimationKeyframe[], k: Key): boolean => kfs.some((f) => f.at === k.at && laneHas(f, k.lane));

/** The lane's value at a key (the last keyframe at that time wins, as in the compiled CSS). */
export function keyFragment(kfs: AnimationKeyframe[], lane: LaneId, at: number): Fragment {
  return kfs.filter((k) => k.at === at && laneHas(k, lane)).reduce<Fragment>((acc, k) => mergeFragment(acc, fragmentOf(k, lane)), {});
}

/** The easing that leaves time `at` (the last keyframe there that sets one). */
export function keyEasing(kfs: AnimationKeyframe[], at: number): string | undefined {
  let e: string | undefined;
  for (const k of kfs) if (k.at === at && k.easing) e = k.easing;
  return e;
}

/** The lane's own easing override that leaves time `at` (`easings[lane]`), if any. */
export function laneEasingOverride(kfs: AnimationKeyframe[], lane: LaneId, at: number): string | undefined {
  let e: string | undefined;
  for (const k of kfs) if (k.at === at && k.easings?.[lane]) e = k.easings[lane];
  return e;
}

/** The easing the lane uses after time `at`: its override, else the keyframe's easing. */
export const laneEasing = (kfs: AnimationKeyframe[], lane: LaneId, at: number): string | undefined => laneEasingOverride(kfs, lane, at) ?? keyEasing(kfs, at);

/**
 * Set (or with undefined remove) the lane's easing override at `at`, for every lane of its CSS
 * property (easingGroup), on the keyframes there that hold one of them (else the last one there).
 */
export function setLaneEasing(kfs: AnimationKeyframe[], lane: LaneId, at: number, easing: string | undefined): AnimationKeyframe[] {
  const group = easingGroup(lane);
  const holders = kfs.map((k, i) => (k.at === at && group.some((l) => laneHas(k, l)) ? i : -1)).filter((i) => i >= 0);
  if (!holders.length) return kfs;
  return kfs.map((k, i) => {
    if (k.at !== at) return k;
    const e: NonNullable<AnimationKeyframe['easings']> = { ...(k.easings ?? {}) };
    for (const l of group) delete e[l];
    if (easing && holders.includes(i)) for (const l of group) if (laneHas(k, l)) e[l] = easing;
    const out = { ...k };
    if (Object.keys(e).length) out.easings = e;
    else delete out.easings;
    return out;
  });
}

const sortKfs = (kfs: AnimationKeyframe[]): AnimationKeyframe[] =>
  kfs
    .map((k, i) => [k, i] as const)
    .sort((a, b) => a[0].at - b[0].at || a[1] - b[1])
    .map(([k]) => k);
const clampAt = (n: number): number => Math.min(100, Math.max(0, Math.round(n * 100) / 100));

type Easings = AnimationKeyframe['easings'];

/** Merge `f` (and per-lane easings) into the keyframe at `at` (the last one there), or add a keyframe. */
function placeFragment(kfs: AnimationKeyframe[], at: number, f: Fragment, easing?: string, easings?: Easings): AnimationKeyframe[] {
  const e = easings && Object.keys(easings).length ? { ...easings } : undefined;
  const idx = kfs.map((k) => k.at).lastIndexOf(at);
  if (idx < 0) return [...kfs, { at, ...mergeFragment({}, f), ...(easing ? { easing } : {}), ...(e ? { easings: e } : {}) }];
  const out = [...kfs];
  out[idx] = mergeFragment(out[idx], f);
  if (easing && !out[idx].easing) out[idx] = { ...out[idx], easing };
  if (e) out[idx] = { ...out[idx], easings: { ...(out[idx].easings ?? {}), ...e } };
  return out;
}

/** Remove lane `lane` at `at`; keyframes left empty by it are removed. */
function removeKey(kfs: AnimationKeyframe[], k: Key): AnimationKeyframe[] {
  if (k.lane === '*') return kfs.filter((f) => f.at !== k.at);
  const lane = k.lane;
  return kfs.flatMap((f) => {
    if (f.at !== k.at || !laneHas(f, lane)) return [f];
    const s = stripLane(f, lane);
    return isEmptyKeyframe(s) ? [] : [s];
  });
}

interface Lifted {
  key: Key;
  frag: Fragment;
  easing?: string;
  easings?: Easings;
}

/** The per-lane easings at time `at` (merged, later keyframes win), only of `lanes` when given. */
function easingsAt(kfs: AnimationKeyframe[], at: number, lanes?: LaneId[]): Easings {
  const out: NonNullable<Easings> = {};
  for (const k of kfs) {
    if (k.at !== at || !k.easings) continue;
    for (const [l, v] of Object.entries(k.easings)) if (v !== undefined && (!lanes || lanes.includes(l as LaneId))) out[l as LaneId] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function lift(kfs: AnimationKeyframe[], k: Key): Lifted | undefined {
  if (!keyExists(kfs, k)) return undefined;
  if (k.lane === '*') {
    const at = kfs.filter((f) => f.at === k.at);
    return {
      key: k,
      frag: at.reduce<Fragment>((acc, f) => mergeFragment(acc, fragmentsOf(f)), {}),
      easing: keyEasing(kfs, k.at),
      easings: easingsAt(kfs, k.at),
    };
  }
  // a lane key takes the keyframe easing along only when it is the keyframe's only part; its own lane easing always
  const host = kfs.filter((f) => f.at === k.at);
  const alone = host.every((f) => ALL_LANES.every((l) => l.id === k.lane || !laneHas(f, l.id)));
  return { key: k, frag: keyFragment(kfs, k.lane, k.at), easing: alone ? keyEasing(kfs, k.at) : undefined, easings: easingsAt(kfs, k.at, [k.lane]) };
}

/** Remove selection keys that are covered by a selected `*` key at the same time. */
function normaliseSel(sel: Key[]): Key[] {
  const whole = new Set(sel.filter((k) => k.lane === '*').map((k) => k.at));
  const seen = new Set<string>();
  return sel.filter((k) => {
    const id = keyId(k);
    if (seen.has(id) || (k.lane !== '*' && whole.has(k.at))) return false;
    seen.add(id);
    return true;
  });
}

/** The delta clamped so every selected key stays within 0-100. */
export function clampDelta(sel: Array<{ at: number }>, delta: number): number {
  if (!sel.length) return 0;
  const min = Math.min(...sel.map((k) => k.at));
  const max = Math.max(...sel.map((k) => k.at));
  return Math.min(100 - max, Math.max(-min, delta));
}

export interface EditResult {
  keyframes: AnimationKeyframe[];
  /** The edited keys at their new place. */
  selection: Key[];
}

/**
 * Move (or with `duplicate`, copy) the selected keys by `delta` % of the cycle. Lane keys leave
 * their keyframe and merge into the keyframe at the new time; `*` keys move whole keyframes.
 */
export function moveKeys(kfs: AnimationKeyframe[], sel: Key[], delta: number, duplicate = false): EditResult {
  const keys = normaliseSel(sel).filter((k) => keyExists(kfs, k));
  const d = clampDelta(keys, delta);
  if (!keys.length || (d === 0 && !duplicate)) return { keyframes: kfs, selection: keys };
  const lifted = keys.map((k) => lift(kfs, k)!).filter(Boolean);
  let out = kfs;
  if (!duplicate) for (const l of lifted) out = removeKey(out, l.key);
  const selection: Key[] = [];
  // whole keyframes first, so lane keys merged at the same time win over a moved keyframe's copy
  for (const l of [...lifted].sort((a, b) => (a.key.lane === '*' ? 0 : 1) - (b.key.lane === '*' ? 0 : 1))) {
    const at = clampAt(l.key.at + d);
    out = placeFragment(out, at, l.frag, l.easing, l.easings);
    selection.push({ lane: l.key.lane, at });
  }
  return { keyframes: sortKfs(out), selection };
}

/** Delete the selected keys (keyframes left empty go too). */
export function deleteKeys(kfs: AnimationKeyframe[], sel: Key[]): AnimationKeyframe[] {
  let out = kfs;
  for (const k of normaliseSel(sel)) out = removeKey(out, k);
  return out;
}

// ── sampling ──

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** A numeric fragment between two others (fields missing on one side hold the other's value). */
function lerpFragment(a: Fragment, b: Fragment, t: number): Fragment {
  const out: Fragment = {};
  const nums = ['opacity', 'blur', 'radius', 'draw'] as const;
  for (const n of nums) {
    const va = a[n];
    const vb = b[n];
    if (va !== undefined || vb !== undefined) out[n] = lerp(va ?? vb!, vb ?? va!, t);
  }
  if (a.transform || b.transform) {
    const ta = a.transform ?? {};
    const tb = b.transform ?? {};
    const tr: KeyframeTransform = {};
    for (const f of ['x', 'y', 'scale', 'scale_x', 'scale_y', 'rotate', 'skew_x', 'skew_y'] as const) {
      const va = ta[f];
      const vb = tb[f];
      if (va !== undefined || vb !== undefined) tr[f] = lerp(va ?? vb!, vb ?? va!, t);
    }
    const axis = ta.axis ?? tb.axis;
    if (axis) tr.axis = [...axis];
    out.transform = tr;
  }
  for (const s of ['color', 'background', 'shadow', 'filter', 'stroke'] as const) {
    const v = t < 1 ? (a[s] ?? b[s]) : (b[s] ?? a[s]);
    if (v !== undefined) out[s] = v;
  }
  return out;
}

const round = (n: number, d = 4): number => Math.round(n * 10 ** d) / 10 ** d;
function roundFragment(f: Fragment): Fragment {
  const out: Fragment = { ...f };
  for (const n of ['opacity', 'blur', 'radius', 'draw'] as const) if (out[n] !== undefined) out[n] = round(out[n]!, n === 'opacity' || n === 'draw' ? 3 : 2);
  if (out.transform) {
    const t = { ...out.transform };
    for (const [k, v] of Object.entries(t)) if (typeof v === 'number') (t as Record<string, number>)[k] = round(v, k.startsWith('scale') ? 3 : 2);
    out.transform = t;
  }
  return out;
}

/**
 * The lane's value at time `at` (0-100): the key there, else interpolated between the keys around
 * it with the easing that leaves the earlier key for this lane (`docEasing` when it has none);
 * before the first and after the last key the nearest key holds. undefined when the lane has no key.
 */
export function sampleLane(kfs: AnimationKeyframe[], lane: LaneId, at: number, docEasing = 'ease'): Fragment | undefined {
  const times = laneTimes(kfs, lane);
  if (!times.length) return undefined;
  if (times.includes(at)) return keyFragment(kfs, lane, at);
  const next = times.find((t) => t > at);
  const prev = [...times].reverse().find((t) => t < at);
  if (prev === undefined) return keyFragment(kfs, lane, next!);
  if (next === undefined) return keyFragment(kfs, lane, prev);
  const p = (at - prev) / (next - prev);
  const e = easingProgress(laneEasing(kfs, lane, prev) ?? docEasing, p);
  return roundFragment(lerpFragment(keyFragment(kfs, lane, prev), keyFragment(kfs, lane, next), e));
}

/** Add a key to `lane` at `at` with the lane's current value there (its default when empty). */
export function addKey(kfs: AnimationKeyframe[], lane: LaneId, at: number, docEasing?: string): EditResult {
  const t = clampAt(at);
  const frag = sampleLane(kfs, lane, t, docEasing) ?? LANE_BY_ID[lane].def;
  return { keyframes: sortKfs(placeFragment(kfs, t, frag)), selection: [{ lane, at: t }] };
}

/** A keyframe at `at` with every used lane's current value (the summary lane's add). */
export function addWholeKey(kfs: AnimationKeyframe[], at: number, docEasing?: string): EditResult {
  const t = clampAt(at);
  let out = kfs;
  for (const l of usedLanes(kfs)) out = placeFragment(out, t, sampleLane(kfs, l, t, docEasing)!);
  if (!kfs.some((k) => k.at === t) && out === kfs) out = [...kfs, { at: t }];
  return { keyframes: sortKfs(out), selection: [{ lane: '*', at: t }] };
}

/** Replace the lane's value at `at` (every keyframe there that sets it); easings stay. */
export function setKeyFragment(kfs: AnimationKeyframe[], lane: LaneId, at: number, frag: Fragment): AnimationKeyframe[] {
  let done = false;
  const out = kfs.map((k) => {
    if (k.at !== at || !laneHas(k, lane)) return k;
    done = true;
    const next = mergeFragment(stripLane(k, lane), frag);
    return k.easings ? { ...next, easings: k.easings } : next;
  });
  return done ? out : sortKfs(placeFragment(kfs, at, frag));
}

/** Set (or with undefined remove) the easing that leaves time `at`. */
export function setKeyEasing(kfs: AnimationKeyframe[], at: number, easing: string | undefined): AnimationKeyframe[] {
  return kfs.map((k) => {
    if (k.at !== at) return k;
    const out = { ...k };
    if (easing) out.easing = easing;
    else delete out.easing;
    return out;
  });
}

// ── clipboard ──

export interface KeyClip {
  items: Array<{ lane: KeyLane; dt: number; frag: Fragment; easing?: string; easings?: Easings; target?: TargetRef }>;
}

export function copyKeys(kfs: AnimationKeyframe[], sel: Key[]): KeyClip | undefined {
  const keys = normaliseSel(sel).filter((k) => keyExists(kfs, k));
  if (!keys.length) return undefined;
  const min = Math.min(...keys.map((k) => k.at));
  return {
    items: keys.map((k) => {
      const l = lift(kfs, k)!;
      return { lane: k.lane, dt: k.at - min, frag: structuredCloneSafe(l.frag), easing: l.easing, ...(l.easings ? { easings: { ...l.easings } } : {}) };
    }),
  };
}

const structuredCloneSafe = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** Paste a clip with its first key at `at` (later keys keep their spacing, capped at 100%). */
export function pasteKeys(kfs: AnimationKeyframe[], clip: KeyClip, at: number): EditResult {
  let out = kfs;
  const selection: Key[] = [];
  const ordered = [...clip.items].sort((a, b) => (a.lane === '*' ? 0 : 1) - (b.lane === '*' ? 0 : 1));
  for (const it of ordered) {
    const t = clampAt(at + it.dt);
    out = placeFragment(out, t, structuredCloneSafe(it.frag), it.easing, it.easings);
    selection.push({ lane: it.lane, at: t });
  }
  return { keyframes: sortKfs(out), selection };
}

/** The copied keys, shared by every timeline and key inspector on the page. */
let sharedClip: KeyClip | undefined;
const clipListeners = new Set<() => void>();
export const keyClipboard = (): KeyClip | undefined => sharedClip;
export function setKeyClipboard(clip: KeyClip | undefined): void {
  sharedClip = clip;
  for (const cb of clipListeners) cb();
}
/** Called on every clipboard change; returns the unsubscribe. */
export function onKeyClipboard(cb: () => void): () => void {
  clipListeners.add(cb);
  return () => clipListeners.delete(cb);
}

// ── lane value mapping (paste into another lane) ──

/** The one number a numeric lane holds (skew: x). */
function laneNumber(lane: LaneId, f: Fragment): number | undefined {
  const t = f.transform ?? {};
  switch (lane) {
    case 'x':
    case 'y':
    case 'scale':
    case 'scale_x':
    case 'scale_y':
    case 'rotate':
      return t[lane];
    case 'skew':
      return t.skew_x;
    default: {
      const v = (f as Record<string, unknown>)[lane];
      return typeof v === 'number' ? v : undefined;
    }
  }
}

const NUMBER_SET: Partial<Record<LaneId, (n: number) => Fragment>> = {
  x: (n) => ({ transform: { x: n } }),
  y: (n) => ({ transform: { y: n } }),
  scale: (n) => ({ transform: { scale: n } }),
  scale_x: (n) => ({ transform: { scale_x: n } }),
  scale_y: (n) => ({ transform: { scale_y: n } }),
  rotate: (n) => ({ transform: { rotate: n } }),
  skew: (n) => ({ transform: { skew_x: n, skew_y: 0 } }),
  opacity: (n) => ({ opacity: Math.min(1, Math.max(0, n)) }),
  blur: (n) => ({ blur: Math.max(0, n) }),
  radius: (n) => ({ radius: Math.max(0, n) }),
  draw: (n) => ({ draw: Math.min(1, Math.max(0, n)) }),
};
const COLOR_LANES: LaneId[] = ['color', 'background', 'stroke'];

/**
 * A lane's value as another lane's (paste into a different lane): numbers carry over between
 * numeric lanes of the same family (moves, scales, 0-1 values, px), colours between colour lanes;
 * undefined when the lanes do not mix.
 */
export function retargetFragment(from: LaneId, to: LaneId, f: Fragment): Fragment | undefined {
  if (from === to) return structuredCloneSafe(f);
  const family = (l: LaneId) =>
    ['x', 'y'].includes(l)
      ? 'move'
      : ['scale', 'scale_x', 'scale_y'].includes(l)
        ? 'scale'
        : ['opacity', 'draw'].includes(l)
          ? 'unit'
          : ['blur', 'radius'].includes(l)
            ? 'px'
            : l;
  if (NUMBER_SET[from] && NUMBER_SET[to] && family(from) === family(to)) {
    const n = laneNumber(from, f);
    return n === undefined ? undefined : NUMBER_SET[to]!(n);
  }
  if (COLOR_LANES.includes(from) && COLOR_LANES.includes(to)) {
    const v = (f as Record<string, unknown>)[from];
    return typeof v === 'string' ? ({ [to]: v } as Fragment) : undefined;
  }
  return undefined;
}

// ── targets (v2 tracks) ──

/** Card-part targets by name (rig pieces are named in the rig). */
const TARGET_INFO: Record<string, { label: MessageId; icon: string }> = {
  element: { label: m('anim-studio.keyframes-utils.element'), icon: 'mdi:card-outline' },
  icon: { label: m('anim-studio.keyframes-utils.icon'), icon: 'mdi:emoticon-outline' },
  name: { label: m('anim-studio.keyframes-utils.name'), icon: 'mdi:format-text' },
  state: { label: m('anim-studio.keyframes-utils.state'), icon: 'mdi:information-outline' },
  background: { label: m('anim-studio.keyframes-utils.background'), icon: 'mdi:texture-box' },
};

/** A target's name: card parts by label, rig pieces by their rig name (else the id). */
export function targetLabel(doc: AnimationDoc, ref: TargetRef | string): string {
  if (TARGET_INFO[ref]) return t(TARGET_INFO[ref].label);
  const m = /^(part|group|shape):(.+)$/.exec(ref);
  if (!m) return ref;
  const list = m[1] === 'part' ? doc.rig?.parts : m[1] === 'group' ? doc.rig?.groups : doc.rig?.shapes;
  return list?.find((x) => x.id === m[2])?.name ?? m[2];
}

/** A target's icon. */
export const targetIcon = (ref: string): string =>
  TARGET_INFO[ref]?.icon ?? (ref.startsWith('group:') ? 'mdi:group' : ref.startsWith('shape:') ? 'mdi:vector-square' : 'mdi:puzzle-outline');

/** A timeline key: a lane key of one target's keyframes. */
export interface TKey extends Key {
  target: TargetRef;
}

/** The target the document's own keyframes move. */
export const mainTarget = (doc: AnimationDoc): TargetRef => (doc.target === 'icon' ? 'icon' : 'element');

export interface TimelineTrack {
  target: TargetRef;
  keyframes: AnimationKeyframe[];
  /** The document's own keyframes (doc.keyframes). */
  main: boolean;
}

/**
 * The document's keyframe sets by target: the main track first (always, even without keyframes),
 * then doc.tracks in order (a track on the main target is shadowed by the main keyframes).
 */
export function timelineTracks(doc: AnimationDoc): TimelineTrack[] {
  const main = mainTarget(doc);
  const out: TimelineTrack[] = [{ target: main, keyframes: doc.keyframes ?? [], main: true }];
  for (const t of doc.tracks ?? []) if (!out.some((x) => x.target === t.target)) out.push({ target: t.target, keyframes: t.keyframes ?? [], main: false });
  return out;
}

/** The keyframes of a target (none: []). */
export function trackKeyframes(doc: AnimationDoc, target: TargetRef): AnimationKeyframe[] {
  if (target === mainTarget(doc)) return doc.keyframes ?? [];
  return doc.tracks?.find((t) => t.target === target)?.keyframes ?? [];
}

/**
 * The document with `kfs` as the target's keyframes: the main keyframes, an existing track, or a
 * new track. A track left without keyframes (and no path or origin) is removed; `tracks` goes when
 * it ends up empty.
 */
export function withTrackKeyframes(doc: AnimationDoc, target: TargetRef, kfs: AnimationKeyframe[]): AnimationDoc {
  if (target === mainTarget(doc)) return { ...doc, keyframes: kfs };
  const tracks = [...(doc.tracks ?? [])];
  const i = tracks.findIndex((t) => t.target === target);
  if (i >= 0) {
    const t: Track = { ...tracks[i], keyframes: kfs };
    if (!kfs.length && !t.path && !t.origin) tracks.splice(i, 1);
    else tracks[i] = t;
  } else if (kfs.length) tracks.push({ target, keyframes: kfs });
  const out = { ...doc } as AnimationDoc;
  if (tracks.length) out.tracks = tracks;
  else delete out.tracks;
  return out;
}

/** A timeline key's id: `lane@at` on the main track, `<target>/lane@at` on the others. */
export const tkeyId = (k: TKey, main: TargetRef): string => (k.target === main ? keyId(k) : `${k.target}/${keyId(k)}`);
export function parseTKeyId(id: string, main: TargetRef): TKey {
  const slash = id.indexOf('/');
  const target = (slash >= 0 ? id.slice(0, slash) : main) as TargetRef;
  return { target, ...parseKeyId(slash >= 0 ? id.slice(slash + 1) : id) };
}

export const tkeyExists = (doc: AnimationDoc, k: TKey): boolean => keyExists(trackKeyframes(doc, k.target), k);

/** Keys grouped by target, in first-seen order. */
function byTarget(sel: TKey[]): Map<TargetRef, Key[]> {
  const m = new Map<TargetRef, Key[]>();
  for (const k of sel) {
    const list = m.get(k.target) ?? [];
    list.push({ lane: k.lane, at: k.at });
    m.set(k.target, list);
  }
  return m;
}

export interface DocEdit {
  doc: AnimationDoc;
  selection: TKey[];
}

/** Move (or duplicate) keys across targets by one delta, clamped for the whole selection (relative timing kept). */
export function moveTargetKeys(doc: AnimationDoc, sel: TKey[], delta: number, duplicate = false): DocEdit {
  const keys = sel.filter((k) => tkeyExists(doc, k));
  const d = clampDelta(keys, delta);
  if (!keys.length || (d === 0 && !duplicate)) return { doc, selection: keys };
  let out = doc;
  const selection: TKey[] = [];
  for (const [target, list] of byTarget(keys)) {
    const r = moveKeys(trackKeyframes(out, target), list, d, duplicate);
    out = withTrackKeyframes(out, target, r.keyframes);
    selection.push(...r.selection.map((k) => ({ ...k, target })));
  }
  return { doc: out, selection };
}

export function deleteTargetKeys(doc: AnimationDoc, sel: TKey[]): AnimationDoc {
  let out = doc;
  for (const [target, list] of byTarget(sel)) out = withTrackKeyframes(out, target, deleteKeys(trackKeyframes(out, target), list));
  return out;
}

/** Copy keys of one or more targets (times relative to the earliest key of the whole selection). */
export function copyTargetKeys(doc: AnimationDoc, sel: TKey[]): KeyClip | undefined {
  const keys = sel.filter((k) => tkeyExists(doc, k));
  if (!keys.length) return undefined;
  const min = Math.min(...keys.map((k) => k.at));
  const items: KeyClip['items'] = [];
  for (const [target, list] of byTarget(keys)) {
    const c = copyKeys(trackKeyframes(doc, target), list);
    const lmin = Math.min(...list.map((k) => k.at));
    for (const it of c?.items ?? []) items.push({ ...it, dt: it.dt + lmin - min, target });
  }
  return { items };
}

/**
 * Paste a clip at `at`. Without `dest`, keys go back to their own targets (the main target for a
 * clip from an older timeline). `dest.target`: every key goes to that target, lanes by name. When
 * the clip holds one lane and `dest.lane` is another, values map into it (retargetFragment);
 * lanes the target cannot animate are skipped (`skipped` counts them).
 */
export function pasteTargetKeys(doc: AnimationDoc, clip: KeyClip, at: number, dest: { target?: TargetRef; lane?: LaneId } = {}): DocEdit & { skipped: number } {
  const main = mainTarget(doc);
  const lanes = new Set(clip.items.map((i) => i.lane));
  const remap = dest.lane && lanes.size === 1 && !lanes.has('*') && !lanes.has(dest.lane) ? { from: [...lanes][0] as LaneId, to: dest.lane } : undefined;
  const groups = new Map<TargetRef, KeyClip['items']>();
  let skipped = 0;
  for (const it of clip.items) {
    const target = dest.target ?? it.target ?? main;
    let item = it;
    if (remap) {
      const frag = retargetFragment(remap.from, remap.to, it.frag);
      if (!frag) {
        skipped++;
        continue;
      }
      item = { ...it, lane: remap.to, frag, easings: it.easings?.[remap.from] ? { [remap.to]: it.easings[remap.from] } : undefined };
    }
    if (item.lane !== '*' && !lanesFor(target).some((l) => l.id === item.lane)) {
      skipped++;
      continue;
    }
    // a whole keyframe pasted onto a card target loses the rig-only lanes
    if (item.lane === '*' && !isRigRef(target) && (item.frag.draw !== undefined || item.frag.stroke !== undefined)) {
      const frag = { ...item.frag };
      delete frag.draw;
      delete frag.stroke;
      item = { ...item, frag };
    }
    const list = groups.get(target) ?? [];
    list.push(item);
    groups.set(target, list);
  }
  let out = doc;
  const selection: TKey[] = [];
  for (const [target, items] of groups) {
    const r = pasteKeys(trackKeyframes(out, target), { items }, at);
    out = withTrackKeyframes(out, target, r.keyframes);
    selection.push(...r.selection.map((k) => ({ ...k, target })));
  }
  return { doc: out, selection, skipped };
}

// ── snapping and zoom ──

export type SnapGrid = 'pct1' | 'pct5' | 's01' | 'fps30';
export const SNAP_GRIDS: Array<{ id: SnapGrid; label: MessageId }> = [
  { id: 'pct1', label: m('anim-studio.keyframes-utils.1-percent') },
  { id: 'pct5', label: m('anim-studio.keyframes-utils.5-percent') },
  { id: 's01', label: m('anim-studio.keyframes-utils.tenth-of-a-second') },
  { id: 'fps30', label: m('anim-studio.keyframes-utils.30-fps') },
];

/** The grid step in % of a `duration` s cycle. */
export function gridStep(grid: SnapGrid, duration: number): number {
  const d = duration > 0 ? duration : 1;
  switch (grid) {
    case 'pct5':
      return 5;
    case 's01':
      return (0.1 / d) * 100;
    case 'fps30':
      return (1 / 30 / d) * 100;
    default:
      return 1;
  }
}

/**
 * A dragged time snapped: `free` (snapping off, or Shift held) rounds to 0.1%; else the nearest of
 * `targets` (other keys, the playhead) within `threshold` %, else the grid. Always within 0-100.
 */
export function snapTime(raw: number, opts: { free?: boolean; grid: SnapGrid; duration: number; targets?: number[]; threshold?: number }): number {
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  if (opts.free) return clamp(Math.round(raw * 10) / 10);
  let best: number | undefined;
  for (const t of opts.targets ?? [])
    if (Math.abs(t - raw) <= (opts.threshold ?? 0) && (best === undefined || Math.abs(t - raw) < Math.abs(best - raw))) best = t;
  if (best !== undefined) return clamp(best);
  const step = gridStep(opts.grid, opts.duration);
  return clamp(Math.round(Math.round(raw / step) * step * 100) / 100);
}

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 10;
/** The zoom buttons' steps (1 = 100%). */
export const ZOOM_STEPS = [1, 1.5, 2, 3, 4, 6, 8, 10];
export const clampZoom = (z: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100));
/** The next zoom step in a direction. */
export function zoomStep(z: number, dir: 1 | -1): number {
  if (dir > 0) return ZOOM_STEPS.find((s) => s > z + 0.001) ?? ZOOM_MAX;
  return [...ZOOM_STEPS].reverse().find((s) => s < z - 0.001) ?? ZOOM_MIN;
}

export interface RulerTicks {
  /** Labelled ticks, % of the cycle. */
  major: number[];
  minor: number[];
  label: (at: number) => string;
}

const NICE = [1, 2, 2.5, 5];
/** The smallest nice step (1, 2, 2.5, 5 x 10^n) that is at least `min`. */
function niceStep(min: number): number {
  const p = 10 ** Math.floor(Math.log10(min));
  for (const m of [...NICE, 10]) if (m * p >= min - 1e-9) return m * p;
  return 10 * p;
}

/**
 * Ruler ticks for a track `pxPerPct` px per % wide: labels at least ~64 px apart, in % of the cycle
 * or in seconds of a `duration` s cycle, with 4-5 minor ticks between labels.
 */
export function rulerTicks(pxPerPct: number, duration: number, unit: 'pct' | 's'): RulerTicks {
  const ppp = pxPerPct > 0 ? pxPerPct : 6;
  const d = duration > 0 ? duration : 1;
  const minPct = 64 / ppp;
  const fmtN = (n: number) => String(Math.round(n * 1000) / 1000);
  let stepPct: number;
  let label: (at: number) => string;
  if (unit === 's') {
    const stepS = niceStep((minPct / 100) * d);
    stepPct = (stepS / d) * 100;
    label = (at) => `${fmtN((at / 100) * d)} s`;
  } else {
    stepPct = Math.min(50, niceStep(minPct));
    label = (at) => `${fmtN(at)}%`;
  }
  const minorDiv = Math.abs(stepPct / niceStep(stepPct / 5) - 5) < 0.01 ? 5 : 4;
  const minorStep = stepPct / minorDiv;
  const major: number[] = [];
  const minor: number[] = [];
  for (let i = 0; i * minorStep <= 100 + 1e-6 && i < 2000; i++) {
    const at = Math.round(i * minorStep * 1000) / 1000;
    if (i % minorDiv === 0) major.push(at);
    else minor.push(at);
  }
  return { major, minor, label };
}

// ── easing ──

export type Bezier = [number, number, number, number];

/** Named curves of the CSS keywords. */
const KEYWORD_BEZIER: Record<string, Bezier> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

/** The curve of an easing (EASINGS id, keyword or cubic-bezier()); undefined for steps() / unknown. */
export function bezierOf(easing: string | undefined): Bezier | undefined {
  if (!easing) return undefined;
  const s = easing.trim();
  const css = EASINGS.find((e) => e.id === s)?.css ?? s;
  if (KEYWORD_BEZIER[css]) return [...KEYWORD_BEZIER[css]] as Bezier;
  const m = css.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);
  if (!m) return undefined;
  const b = m.slice(1).map(Number) as Bezier;
  return b.every(Number.isFinite) ? b : undefined;
}

/** Easing presets of the curve editor: the EASINGS ids with their curves. */
export const BEZIER_PRESETS: Array<{ id: string; label: LabelId; bezier: Bezier }> = EASINGS.map((e) => ({ id: e.id, label: e.label, bezier: bezierOf(e.id)! }));

const r2 = (n: number): number => Math.round(n * 100) / 100;
/** x is kept within 0-1 (CSS requires it), y within -1..2. */
export function clampBezier(b: Bezier): Bezier {
  const cx = (n: number) => r2(Math.min(1, Math.max(0, n)));
  const cy = (n: number) => r2(Math.min(2, Math.max(-1, n)));
  return [cx(b[0]), cy(b[1]), cx(b[2]), cy(b[3])];
}

/** How a curve is written: a preset id when it is one, else cubic-bezier(). */
export function easingFromBezier(b: Bezier): string {
  const c = clampBezier(b);
  const preset = BEZIER_PRESETS.find((p) => p.bezier.every((v, i) => Math.abs(v - c[i]) < 0.005));
  return preset ? preset.id : `cubic-bezier(${c.join(', ')})`;
}

/** Eased progress of a cubic-bezier at linear progress `p` (steps() and unknown: linear). */
export function easingProgress(easing: string | undefined, p: number): number {
  const steps = easing?.match(/^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+)\s*)?\)$/);
  if (steps) {
    const n = Math.max(1, Number(steps[1]));
    const start = steps[2] === 'start' || steps[2] === 'jump-start';
    return Math.min(1, (start ? Math.ceil(p * n) : Math.floor(p * n)) / n);
  }
  const b = bezierOf(easing) ?? [0, 0, 1, 1];
  return bezierY(b, p);
}

/** The curve's y at x (Newton, bisection fallback). */
export function bezierY([x1, y1, x2, y2]: Bezier, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = (t: number) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t ** 2 * (1 - t) + t ** 3;
  const cy = (t: number) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t ** 2 * (1 - t) + t ** 3;
  const dx = (t: number) => 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t ** 2;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const e = cx(t) - x;
    if (Math.abs(e) < 1e-6) return cy(t);
    const d = dx(t);
    if (Math.abs(d) < 1e-6) break;
    t -= e / d;
  }
  let lo = 0;
  let hi = 1;
  t = x;
  for (let i = 0; i < 40; i++) {
    const v = cx(t);
    if (Math.abs(v - x) < 1e-6) break;
    if (v < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return cy(t);
}

// ── values ──

/** The colour picker's entity value <-> the animation colour token. */
const MIX_RE = /^color-mix\(in srgb, var\(--mc-anim-c\) (\d+(?:\.\d+)?)%, transparent\)$/;
export function colorToPicker(v: string | undefined): string {
  if (!v) return '';
  const s = v.trim();
  if (/^var\(\s*--mc-anim-c\s*\)$/.test(s)) return 'entity';
  const m = s.match(MIX_RE);
  return m ? `entity ${m[1]}%` : s;
}
export function colorFromPicker(v: string): string {
  const m = v.trim().match(/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/i);
  if (!m) return v.trim();
  return m[1] === undefined || Number(m[1]) >= 100 ? ANIM_COLOR : `color-mix(in srgb, ${ANIM_COLOR} ${Number(m[1])}%, transparent)`;
}

export interface ShadowParts {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}
/** One plain box-shadow: `x y [blur [spread]] colour`, lengths in px; undefined when not that shape. */
export function parseShadow(v: string | undefined): ShadowParts | undefined {
  if (!v) return undefined;
  const s = v.trim();
  const m = s.match(/^(-?\d*\.?\d+)(?:px)?\s+(-?\d*\.?\d+)(?:px)?(?:\s+(\d*\.?\d+)(?:px)?)?(?:\s+(-?\d*\.?\d+)(?:px)?)?\s+(.+)$/);
  if (!m || /,(?![^(]*\))/.test(m[5])) return undefined;
  return { x: Number(m[1]), y: Number(m[2]), blur: Number(m[3] ?? 0), spread: Number(m[4] ?? 0), color: m[5].trim() };
}
export const formatShadow = (p: ShadowParts): string => `${p.x}px ${p.y}px ${p.blur}px ${p.spread}px ${p.color}`;

export const SHADOW_PRESETS = [
  { id: 'glow', label: m('anim-studio.keyframes-utils.glow'), value: `0px 0px 16px 2px ${ANIM_COLOR}` },
  { id: 'drop', label: m('anim-studio.keyframes-utils.drop-shadow'), value: '0px 6px 16px 0px rgba(0, 0, 0, 0.3)' },
  { id: 'lift', label: m('anim-studio.keyframes-utils.lift'), value: '0px 14px 28px -6px rgba(0, 0, 0, 0.35)' },
  { id: 'none', label: m('anim-studio.keyframes-utils.none'), value: 'none' },
];
export const FILTER_PRESETS = [
  { id: 'bright', label: m('anim-studio.keyframes-utils.brighten'), value: 'brightness(1.3)' },
  { id: 'hue', label: m('anim-studio.keyframes-utils.hue-shift'), value: 'hue-rotate(90deg)' },
  { id: 'gray', label: m('anim-studio.keyframes-utils.greyscale'), value: 'grayscale(1)' },
  { id: 'glow', label: m('anim-studio.keyframes-utils.glow'), value: `drop-shadow(0 0 6px ${ANIM_COLOR})` },
  { id: 'none', label: m('anim-studio.keyframes-utils.none'), value: 'none' },
];

export const validCss = (v: string, kind: 'color' | 'background' | 'shadow' | 'filter'): boolean =>
  v.trim() === 'none' ? kind === 'shadow' || kind === 'filter' : safeCssValue(v, kind) !== undefined;

// ── origin ──

export const ORIGIN_RE = /^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/;
export const ORIGIN_GRID = ['top left', 'top', 'top right', 'left', 'center', 'right', 'bottom left', 'bottom', 'bottom right'];
/** What each origin cell is called (aria-label and title), in ORIGIN_GRID order. */
export const ORIGIN_NAMES: MessageId[] = [m('anim-studio.keyframes-utils.top-left'), m('anim-studio.keyframes-utils.top'), m('anim-studio.keyframes-utils.top-right'), m('anim-studio.keyframes-utils.left'), m('anim-studio.keyframes-utils.centre'), m('anim-studio.keyframes-utils.right'), m('anim-studio.keyframes-utils.bottom-left'), m('anim-studio.keyframes-utils.bottom'), m('anim-studio.keyframes-utils.bottom-right')];

/** The 3x3 grid cell (0-8) of an origin keyword value; -1 for anything else (lengths, 3D). */
export function originCell(v: string | undefined): number {
  const words = (v ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 4;
  if (words.length > 2) return -1;
  let x: number | undefined;
  let y: number | undefined;
  for (const w of words) {
    if (w === 'left' || w === 'right') {
      if (x !== undefined) return -1;
      x = w === 'left' ? 0 : 2;
    } else if (w === 'top' || w === 'bottom') {
      if (y !== undefined) return -1;
      y = w === 'top' ? 0 : 2;
    } else if (w !== 'center') return -1;
  }
  return (y ?? 1) * 3 + (x ?? 1);
}

// ── text ──

const fmt = (n: number, d = 2): string => String(round(n, d));
/** A short readout of a lane's value (lane heads, list rows, aria). */
export function fragmentText(lane: LaneId, f: Fragment | undefined): string {
  if (!f) return '';
  const tf = f.transform ?? {};
  switch (lane) {
    case 'x':
      return tf.x === undefined ? '' : `${fmt(tf.x, 1)} px`;
    case 'y':
      return tf.y === undefined ? '' : `${fmt(tf.y, 1)} px`;
    case 'scale':
    case 'scale_x':
    case 'scale_y': {
      const v = tf[lane];
      return v === undefined ? '' : `${fmt(v * 100, 1)}%`;
    }
    case 'rotate':
      return tf.rotate === undefined ? '' : `${fmt(tf.rotate, 1)}°`;
    case 'skew':
      return `${fmt(tf.skew_x ?? 0, 1)}° ${fmt(tf.skew_y ?? 0, 1)}°`;
    case 'opacity':
      return f.opacity === undefined ? '' : `${fmt(f.opacity * 100, 0)}%`;
    case 'blur':
      return f.blur === undefined ? '' : `${fmt(f.blur, 1)} px`;
    case 'radius':
      return f.radius === undefined ? '' : `${fmt(f.radius, 1)} px`;
    case 'draw':
      return f.draw === undefined ? '' : `${fmt(f.draw * 100, 0)}%`;
    default: {
      const v = f[lane];
      if (v === undefined) return '';
      return colorToPicker(v).startsWith('entity') ? t('anim-studio.keyframes-utils.animation-colour') : v;
    }
  }
}

export const easingLabel = (e: string | undefined): string => {
  const known = e ? EASINGS.find((x) => x.id === e)?.label : undefined;
  return known !== undefined ? tl(known) : e ? (e.startsWith('steps') ? t('anim-studio.keyframes-utils.steps') : t('anim-studio.keyframes-utils.custom-curve')) : t('anim-studio.keyframes-utils.default');
};
