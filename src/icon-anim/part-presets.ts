import type { AnimationDoc, AnimationKeyframe, KeyframeTransform, Rig, TargetRef, Track } from '../anim-studio/model';
import { pathBox, type SplitPiece } from '../icons/icon-split';
import { anchorOf, piecesBox, type Anchor, type Box } from './icon-doc';

/*
 * Part presets (icon animator core): one click writes a ready motion on an icon part, group or
 * drawn shape as that target's track, with a few parameters (duration share and delay in % of the
 * cycle, intensity, direction). The result is a normal track, fully editable on the timeline.
 * Pure, no DOM; shared by the studio's icon mode and the Design tab's quick animator.
 *
 * A preset is a motion over a window of the cycle: it starts at `delay` % and takes `share` % of
 * the cycle; before the window the target rests as at the motion's start, after it as at its end
 * (a spin ends a whole turn on, the same look), so every preset loops seamlessly.
 */

export interface PartPresetParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** Unit shown with the label ('%': a share of the cycle). */
  unit?: string;
}

export interface PartPreset {
  id: string;
  name: string;
  params: PartPresetParam[];
  /** mdi icon of the preset's button. */
  icon?: string;
  /** Where the target should pivot (applied when the target has no pivot of its own and its box is known). */
  pivot?: Anchor;
  /** Draws the target (icon parts, groups and shapes only). */
  draws?: boolean;
  /** One line for the button's tooltip. */
  help?: string;
}

type Values = Omit<AnimationKeyframe, 'at'>;
interface GenKey {
  /** 0-1 across the preset's window. */
  t: number;
  k: Values;
}
interface Ctx {
  intensity: number;
  direction: 1 | -1;
}

const param = (id: string, label: string, min: number, max: number, step: number, def: number): PartPresetParam => ({ id, label, min, max, step, default: def });
const share = (def = 100): PartPresetParam => ({ ...param('share', 'Duration share', 10, 100, 5, def), unit: '%' });
const delay = (): PartPresetParam => ({ ...param('delay', 'Delay', 0, 90, 5, 0), unit: '%' });
const intensity = () => param('intensity', 'Intensity', 0.25, 3, 0.25, 1);
const direction = () => param('direction', 'Direction', -1, 1, 2, 1);
const MOTION = (def = 100) => [share(def), delay(), intensity(), direction()];

const r3 = (n: number): number => Math.round(n * 1000) / 1000 || 0;
const rot = (t: number, deg: number, easing = 'ease-in-out'): GenKey => ({ t, k: { transform: { rotate: r3(deg) }, easing } });
const tf = (t: number, transform: KeyframeTransform, extra: Values = {}, easing = 'ease-in-out'): GenKey => {
  const out: KeyframeTransform = {};
  for (const [k, v] of Object.entries(transform)) (out as Record<string, number>)[k] = r3(v as number);
  return { t, k: { transform: out, ...extra, easing } };
};

interface Def extends PartPreset {
  gen: (c: Ctx) => GenKey[];
}

/** Rotations of a damped oscillation: [t, share of the amplitude]. */
const damped = (steps: Array<[number, number]>, amp: number): GenKey[] => steps.map(([t, f]) => rot(t, amp * f));

const DEFS: Def[] = [
  {
    id: 'swing',
    name: 'Swing',
    icon: 'mdi:metronome',
    pivot: 'top',
    help: 'Swings from its top, settling back',
    params: MOTION(),
    gen: ({ intensity: i, direction: d }) =>
      damped(
        [
          [0, 0],
          [0.15, 1],
          [0.4, -0.8],
          [0.6, 0.5],
          [0.8, -0.25],
          [1, 0],
        ],
        14 * i * d,
      ),
  },
  {
    id: 'ring',
    name: 'Ring',
    icon: 'mdi:bell-ring-outline',
    pivot: 'top',
    help: 'Rings like a bell: quick swings that die down',
    params: MOTION(70),
    gen: ({ intensity: i, direction: d }) =>
      damped(
        [
          [0, 0],
          [0.08, 1],
          [0.18, -0.95],
          [0.28, 0.85],
          [0.38, -0.72],
          [0.48, 0.58],
          [0.58, -0.44],
          [0.68, 0.3],
          [0.78, -0.16],
          [0.88, 0.06],
          [1, 0],
        ],
        16 * i * d,
      ),
  },
  {
    id: 'spin',
    name: 'Spin',
    icon: 'mdi:rotate-right',
    pivot: 'center',
    help: 'Turns round at a steady speed (whole turns per cycle, so it loops seamlessly)',
    params: [share(), delay(), param('intensity', 'Turns', 1, 5, 1, 1), direction()],
    gen: ({ intensity: i, direction: d }) => [rot(0, 0, 'linear'), rot(1, 360 * Math.max(1, Math.round(i)) * d, 'linear')],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    icon: 'mdi:heart-pulse',
    pivot: 'center',
    help: 'Grows and shrinks back (direction -1 shrinks)',
    params: MOTION(),
    gen: ({ intensity: i, direction: d }) => [tf(0, { scale: 1 }), tf(0.5, { scale: 1 + 0.15 * i * d }), tf(1, { scale: 1 })],
  },
  {
    id: 'bounce',
    name: 'Bounce',
    icon: 'mdi:debug-step-over',
    pivot: 'bottom',
    help: 'Squashes, jumps and lands',
    params: MOTION(),
    gen: ({ intensity: i, direction: d }) => {
      const h = -3 * i * d;
      return [
        tf(0, { y: 0, scale_x: 1, scale_y: 1 }, {}, 'ease-out'),
        tf(0.12, { y: 0, scale_x: 1.08, scale_y: 0.9 }, {}, 'ease-out'),
        tf(0.45, { y: h, scale_x: 0.96, scale_y: 1.06 }, {}, 'ease-in'),
        tf(0.75, { y: 0, scale_x: 1.06, scale_y: 0.92 }, {}, 'ease-out'),
        tf(0.88, { y: 0, scale_x: 0.98, scale_y: 1.02 }),
        tf(1, { y: 0, scale_x: 1, scale_y: 1 }),
      ];
    },
  },
  {
    id: 'shake',
    name: 'Shake',
    icon: 'mdi:vibrate',
    help: 'Shakes from side to side',
    params: MOTION(60),
    gen: ({ intensity: i, direction: d }) => {
      const a = 1.2 * i * d;
      return [0, -1, 1, -1, 1, -0.6, 0.6, -0.3, 0.3, 0].map((f, n, all) => tf(n / (all.length - 1), { x: a * f }));
    },
  },
  {
    id: 'wobble',
    name: 'Wobble',
    icon: 'mdi:rotate-3d-variant',
    pivot: 'bottom',
    help: 'Rocks on its base',
    params: MOTION(),
    gen: ({ intensity: i, direction: d }) =>
      damped(
        [
          [0, 0],
          [0.15, -1],
          [0.3, 0.75],
          [0.45, -0.5],
          [0.6, 0.3],
          [0.75, -0.15],
          [1, 0],
        ],
        8 * i * d,
      ),
  },
  {
    id: 'blink',
    name: 'Blink',
    icon: 'mdi:eye-outline',
    help: 'Blinks twice',
    params: [share(), delay(), intensity()],
    gen: ({ intensity: i }) => {
      const lo = r3(Math.max(0, 1 - 0.9 * i));
      return [1, lo, 1, lo, 1, 1].map((o, n) => ({ t: [0, 0.1, 0.2, 0.3, 0.4, 1][n], k: { opacity: o, easing: 'linear' } }));
    },
  },
  {
    id: 'fade',
    name: 'Fade',
    icon: 'mdi:circle-opacity',
    help: 'Fades out and back in',
    params: [share(), delay(), intensity()],
    gen: ({ intensity: i }) => {
      const lo = r3(Math.max(0, 1 - 0.8 * i));
      return [
        { t: 0, k: { opacity: 1, easing: 'ease-in-out' } },
        { t: 0.5, k: { opacity: lo, easing: 'ease-in-out' } },
        { t: 1, k: { opacity: 1, easing: 'ease-in-out' } },
      ];
    },
  },
  ...(
    [
      ['slide-up', 'Slide up', 'mdi:arrow-up', 'y', -1],
      ['slide-down', 'Slide down', 'mdi:arrow-down', 'y', 1],
      ['slide-left', 'Slide left', 'mdi:arrow-left', 'x', -1],
      ['slide-right', 'Slide right', 'mdi:arrow-right', 'x', 1],
    ] as const
  ).map(
    ([id, name, icon, axis, sign]): Def => ({
      id,
      name,
      icon,
      help: `Moves ${id.slice(6)} and back`,
      params: MOTION(),
      gen: ({ intensity: i, direction: d }) => {
        const v = 3 * i * d * sign;
        return [tf(0, { [axis]: 0 }), tf(0.4, { [axis]: v }), tf(0.6, { [axis]: v }), tf(1, { [axis]: 0 })];
      },
    }),
  ),
  {
    id: 'draw-on',
    name: 'Draw on',
    icon: 'mdi:draw',
    draws: true,
    help: 'Draws its outline, then fills (direction -1 draws it off)',
    params: [share(60), delay(), direction()],
    gen: ({ direction: d }) => [
      { t: 0, k: { draw: d > 0 ? 0 : 1, easing: 'ease-in-out' } },
      { t: 1, k: { draw: d > 0 ? 1 : 0, easing: 'ease-in-out' } },
    ],
  },
  {
    id: 'draw-loop',
    name: 'Draw loop',
    icon: 'mdi:draw-pen',
    draws: true,
    help: 'Draws on, holds, and draws off again',
    params: [share(), delay()],
    gen: () => [
      { t: 0, k: { draw: 0, easing: 'ease-in-out' } },
      { t: 0.45, k: { draw: 1, easing: 'ease-in-out' } },
      { t: 0.7, k: { draw: 1, easing: 'ease-in-out' } },
      { t: 1, k: { draw: 0, easing: 'ease-in-out' } },
    ],
  },
  {
    id: 'pop',
    name: 'Pop',
    icon: 'mdi:star-four-points-outline',
    pivot: 'center',
    help: 'Pops in from nothing with an overshoot',
    params: [share(50), delay(), intensity()],
    gen: ({ intensity: i }) => [
      tf(0, { scale: 0 }, { opacity: 0 }, 'ease-out'),
      tf(0.6, { scale: 1 + 0.2 * i }, { opacity: 1 }, 'ease-in-out'),
      tf(1, { scale: 1 }, { opacity: 1 }),
    ],
  },
  {
    id: 'float',
    name: 'Float',
    icon: 'mdi:waves-arrow-up',
    help: 'Drifts up and down',
    params: MOTION(),
    gen: ({ intensity: i, direction: d }) => [tf(0, { y: 0 }), tf(0.5, { y: -1.5 * i * d }), tf(1, { y: 0 })],
  },
  {
    id: 'flicker',
    name: 'Flicker',
    icon: 'mdi:fire',
    pivot: 'bottom',
    help: 'Flickers like a flame',
    params: [share(), delay(), intensity()],
    gen: ({ intensity: i }) =>
      (
        [
          [0, 1, 1, 0],
          [0.12, 1.08, 0.85, 2],
          [0.25, 0.96, 1, -1.5],
          [0.4, 1.1, 0.9, 1],
          [0.55, 0.97, 1, -2],
          [0.7, 1.06, 0.85, 1.5],
          [0.85, 0.98, 1, -0.5],
          [1, 1, 1, 0],
        ] as const
      ).map(([t, sy, o, sk]) => tf(t, { scale_y: 1 + (sy - 1) * i, skew_x: sk * i }, { opacity: r3(1 - (1 - o) * Math.min(i, 1)) })),
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: 'mdi:wifi',
    pivot: 'center',
    help: 'Lights up one part after another (on a group or several parts)',
    params: MOTION(),
    gen: ({ intensity: i }) => {
      const lo = r3(Math.max(0, 1 - 0.7 * Math.min(i, 1.4)));
      const s = r3(1 - 0.08 * i);
      return [tf(0, { scale: s }, { opacity: lo }), tf(0.35, { scale: 1 + 0.04 * i }, { opacity: 1 }), tf(0.7, { scale: s }, { opacity: lo }), tf(1, { scale: s }, { opacity: lo })];
    },
  },
];

/** The presets, in button order. */
export const PART_PRESETS: PartPreset[] = DEFS.map(({ gen: _gen, ...p }) => p);

const byId = new Map(DEFS.map((d) => [d.id, d]));
export const partPreset = (id: string): PartPreset | undefined => PART_PRESETS.find((p) => p.id === id);

/** Every parameter of the preset, from `params` (clamped to its range) or its default. */
export function presetParams(presetId: string, params: Record<string, number> = {}): Record<string, number> {
  const def = byId.get(presetId);
  const out: Record<string, number> = {};
  for (const p of def?.params ?? []) {
    const v = params[p.id];
    out[p.id] = typeof v === 'number' && Number.isFinite(v) ? Math.min(p.max, Math.max(p.min, v)) : p.default;
  }
  return out;
}

const rAt = (n: number): number => Math.round(n * 100) / 100;

/** Keys placed in the window [start, end] % of the cycle, at rest before and after it. */
function place(keys: GenKey[], start: number, end: number): AnimationKeyframe[] {
  const span = end - start;
  const rest = (k: Values): Values => {
    const c = { ...k };
    delete c.easing;
    return c;
  };
  const out: AnimationKeyframe[] = [];
  const push = (k: AnimationKeyframe) => {
    const i = out.findIndex((x) => x.at === k.at);
    if (i >= 0) out[i] = { ...out[i], ...k };
    else out.push(k);
  };
  if (start > 0) push({ at: 0, ...rest(keys[0].k) });
  for (const g of keys) push({ at: rAt(start + g.t * span), ...g.k });
  if (end < 100) push({ at: 100, ...rest(keys[keys.length - 1].k) });
  return out.sort((a, b) => a.at - b.at);
}

/**
 * The keyframes of a preset with these parameters (share and delay in % of the cycle), as a
 * track's keyframes; [] for an unknown preset.
 */
export function presetKeyframes(presetId: string, params: Record<string, number> = {}): AnimationKeyframe[] {
  const p = presetParams(presetId, params);
  const start = p.delay ?? 0;
  return windowKeys(presetId, p, start, Math.min(100, start + (p.share ?? 100)));
}

/** A preset's keys placed in the window [start, end] % (parameters already checked). */
function windowKeys(presetId: string, p: Record<string, number>, start: number, end: number): AnimationKeyframe[] {
  const def = byId.get(presetId);
  if (!def) return [];
  const keys = def.gen({ intensity: p.intensity ?? 1, direction: (p.direction ?? 1) < 0 ? -1 : 1 });
  return place(keys, start, Math.max(end, start + 1));
}

/**
 * Windows of a wave over `n` targets: each plays 60 % of the preset's window, one after another,
 * the whole stagger rescaled to fit the window (never cut at 100 %).
 */
export function waveWindows(params: Record<string, number>, n: number): Array<[number, number]> {
  const p = presetParams('wave', params);
  const start = p.delay;
  const span = Math.max(1, Math.min(p.share, 100 - start));
  const each = n > 1 ? span * 0.6 : span;
  const step = n > 1 ? (span - each) / (n - 1) : 0;
  return Array.from({ length: n }, (_, i) => [start + i * step, start + i * step + each]);
}

const TRACK_CAP = 24;
const isRig = (ref: string): boolean => /^(part|group|shape):/.test(ref);
const idOf = (ref: string): string => ref.slice(ref.indexOf(':') + 1);

function exists(rig: Rig | undefined, ref: string): boolean {
  const id = idOf(ref);
  if (ref.startsWith('part:')) return !!rig?.parts.some((p) => p.id === id);
  if (ref.startsWith('group:')) return !!rig?.groups?.some((g) => g.id === id);
  if (ref.startsWith('shape:')) return !!rig?.shapes?.some((s) => s.id === id);
  return ['element', 'icon', 'name', 'state', 'background'].includes(ref);
}

/** Write (replace) the keyframes of a target's track; path and origin stay. undefined when the track cap is reached. */
function setTrack(doc: AnimationDoc, ref: TargetRef, keyframes: AnimationKeyframe[]): AnimationDoc | undefined {
  const tracks = [...(doc.tracks ?? [])];
  const i = tracks.findIndex((t) => t.target === ref);
  if (i < 0 && tracks.length >= TRACK_CAP) return undefined;
  const next: Track = i >= 0 ? { ...tracks[i], keyframes } : { target: ref, keyframes };
  if (i >= 0) tracks[i] = next;
  else tracks.push(next);
  return { ...doc, tracks };
}

/** The box of a target from the split pieces (shapes: their own path). */
function targetBox(doc: AnimationDoc, ref: string, pieces: SplitPiece[]): Box | undefined {
  const rig = doc.rig;
  const id = idOf(ref);
  if (ref.startsWith('shape:')) {
    const s = rig?.shapes?.find((x) => x.id === id);
    return s ? pathBox(s.d) : undefined;
  }
  const parts = ref.startsWith('group:') ? (rig?.groups?.find((g) => g.id === id)?.parts ?? []) : [id];
  return piecesBox(
    pieces,
    parts.flatMap((p) => rig?.parts.find((x) => x.id === p)?.from ?? []),
  );
}

/**
 * The preset's pivot as the target's track origin (viewBox px; a track origin wins over the part's
 * own pivot), written on every apply so each preset turns about its own point (Swing from the top,
 * Spin about the centre). The part's pivot stays the user's. Without pieces (or for a preset with no
 * pivot) the track keeps its origin.
 */
function withTrackOrigin(doc: AnimationDoc, ref: string, anchor: Anchor | undefined, pieces: SplitPiece[] | undefined): AnimationDoc {
  if (!anchor || !pieces || !doc.rig || !isRig(ref)) return doc;
  const box = targetBox(doc, ref, pieces);
  if (!box) return doc;
  const [x, y] = anchorOf(box, anchor);
  const origin = `${x}px ${y}px`;
  return { ...doc, tracks: (doc.tracks ?? []).map((t) => (t.target === ref ? { ...t, origin } : t)) };
}

export interface ApplyPresetOptions {
  /** The source icon's split pieces: lets the preset set the target's pivot (swing from the top...). */
  pieces?: SplitPiece[];
}

/**
 * Apply a part preset to a target: its track's keyframes become the preset's (its path stays) and,
 * given the pieces, its track origin the preset's pivot. `wave` on a group writes one staggered track per member part instead (the group's own
 * track goes). Draw presets apply to icon parts, groups and shapes only. The document comes back
 * unchanged for an unknown preset or target, or when the 24-track cap is reached.
 */
export function applyPartPreset(doc: AnimationDoc, target: TargetRef, presetId: string, params?: Record<string, number>, opts: ApplyPresetOptions = {}): AnimationDoc {
  const def = byId.get(presetId);
  if (!def || doc.kind !== 'keyframes' || !exists(doc.rig, target)) return doc;
  if (def.draws && !isRig(target)) return doc;
  const p = presetParams(presetId, params);

  if (presetId === 'wave' && target.startsWith('group:')) {
    let members = doc.rig?.groups?.find((g) => g.id === idOf(target))?.parts ?? [];
    if (p.direction < 0) members = [...members].reverse();
    const out: AnimationDoc = { ...doc, tracks: (doc.tracks ?? []).filter((t) => t.target !== target) };
    if (!out.tracks!.length) delete out.tracks;
    return staggerWave(out, members.map((m) => `part:${m}` as TargetRef), p, opts);
  }

  const next = setTrack(doc, target, presetKeyframes(presetId, p));
  return next ? withTrackOrigin(next, target, def.pivot, opts.pieces) : doc;
}

/** Wave tracks on targets in order, staggered by waveWindows. */
function staggerWave(doc: AnimationDoc, targets: TargetRef[], p: Record<string, number>, opts: ApplyPresetOptions): AnimationDoc {
  const pivot = byId.get('wave')!.pivot;
  return waveWindows(p, targets.length).reduce((d, [start, end], i) => {
    const next = setTrack(d, targets[i], windowKeys('wave', p, start, end));
    return next ? withTrackOrigin(next, targets[i], pivot, opts.pieces) : d;
  }, doc);
}

/**
 * Apply a preset to several targets (a multi-selection). `wave` staggers them in the given order
 * like the members of a group; every other preset plays the same on each.
 */
export function applyPartPresetMany(doc: AnimationDoc, targets: TargetRef[], presetId: string, params?: Record<string, number>, opts: ApplyPresetOptions = {}): AnimationDoc {
  if (targets.length < 2 || presetId !== 'wave') return targets.reduce((d, t) => applyPartPreset(d, t, presetId, params, opts), doc);
  const p = presetParams(presetId, params);
  const list = (p.direction < 0 ? [...targets].reverse() : targets).filter((t) => exists(doc.rig, t));
  return staggerWave(doc, list, p, opts);
}

/** Remove a target's motion (its track's keyframes); its motion path stays. */
export function clearPartMotion(doc: AnimationDoc, target: TargetRef): AnimationDoc {
  const tracks = (doc.tracks ?? []).flatMap((t) => (t.target !== target ? [t] : t.path ? [{ ...t, keyframes: [] }] : []));
  const out: AnimationDoc = { ...doc, tracks };
  if (!tracks.length) delete out.tracks;
  return out;
}
