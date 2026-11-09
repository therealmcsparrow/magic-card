import type { AnimationKeyframe } from '../anim-studio/model';
import { presetKeyframes } from '../anim-studio/from-preset';
import {
  IMAGE_ANIM_DENY,
  IMAGE_CLIP_MAX_TRACKS,
  IMAGE_TRACK_MAX_KEYFRAMES,
  MORPH_PATH_DATA_RE,
  type ImageAnimation,
  type ImageClip,
  type ImageTrack,
} from '../contracts/image-animation';
import { t } from './i18n';
import { elementOf, type ImageTarget } from './targets';

// Pure edits of an image's animation: an effect on a target becomes keyframes in the one track of that target in a clip.

export type EffectKind = 'transform' | 'opacity' | 'colour' | 'filter' | 'stroke-draw' | 'motion-path' | 'preset';
export const EFFECT_KINDS: readonly EffectKind[] = ['transform', 'opacity', 'colour', 'filter', 'stroke-draw', 'motion-path', 'preset'];

export interface EffectOptions {
  /** The clip to edit; default the first clip, or a new clip "Idle" that always plays. */
  clipId?: string;
  presetId?: string;
  /** Path data for a motion path. */
  path?: string;
}

export type Availability = Record<EffectKind, { ok: boolean; reason?: 'no-stroke' }>;

/** The clip a first effect lands in: it always plays. */
export const defaultClip = (): ImageClip => ({ id: 'idle', name: t('image-animator.tracks.idle'), play: { on: 'always' }, duration: 2, easing: 'ease-in-out', iterations: 'infinite', tracks: [] });

const KEYFRAMES: Record<Exclude<EffectKind, 'motion-path' | 'preset'>, AnimationKeyframe[]> = {
  transform: [{ at: 0, transform: { rotate: 0, scale: 1 } }, { at: 50, transform: { rotate: 12, scale: 1.1 } }, { at: 100, transform: { rotate: 0, scale: 1 } }],
  opacity: [{ at: 0, opacity: 1 }, { at: 50, opacity: 0.3 }, { at: 100, opacity: 1 }],
  colour: [{ at: 0, color: '#e53935' }, { at: 50, color: '#fdd835' }, { at: 100, color: '#e53935' }],
  filter: [{ at: 0, filter: 'brightness(1)' }, { at: 50, filter: 'brightness(1.6)' }, { at: 100, filter: 'brightness(1)' }],
  'stroke-draw': [{ at: 0, draw: 0 }, { at: 70, draw: 1 }, { at: 100, draw: 1 }],
};

/** Keyframes of the same `at` are merged, the rest are inserted in order; more than the keyframe cap is refused. */
function mergeKeyframes(into: AnimationKeyframe[], add: readonly AnimationKeyframe[]): AnimationKeyframe[] {
  const out = into.map((k) => ({ ...k }));
  for (const k of add) {
    const same = out.find((o) => o.at === k.at);
    if (same) Object.assign(same, structuredClone(k));
    else out.push(structuredClone(k));
  }
  out.sort((a, b) => a.at - b.at);
  if (out.length > IMAGE_TRACK_MAX_KEYFRAMES) throw new Error('Too many keyframes in one track');
  return out;
}

const strings = (v: unknown, out: string[] = []): string[] => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
};

function checkedPath(path: string | undefined): string {
  const d = path?.trim().replace(/\s+/g, ' ');
  if (!d || !MORPH_PATH_DATA_RE.test(d)) throw new Error('A motion path needs path data');
  return d;
}

/**
 * The animation with one more effect on `target`. A target has one track per clip, so a second effect merges into it.
 * Throws for an unknown clip or preset, a bad path, or a new target past the track cap. The input is never changed.
 */
export function addEffect(anim: ImageAnimation | undefined, target: ImageTarget, kind: EffectKind, options: EffectOptions = {}): ImageAnimation {
  const next: ImageAnimation = anim ? structuredClone(anim) : { v: 1, clips: [] };
  if (!next.clips.length) next.clips.push(defaultClip());
  const clip = options.clipId === undefined ? next.clips[0] : next.clips.find((c) => c.id === options.clipId);
  if (!clip) throw new Error(`No clip ${options.clipId}`);

  let frames: AnimationKeyframe[];
  let path: string | undefined;
  if (kind === 'preset') {
    if (!options.presetId) throw new Error('A preset needs an id');
    frames = presetKeyframes(options.presetId);
  } else if (kind === 'motion-path') {
    path = checkedPath(options.path);
    frames = [{ at: 0 }, { at: 100 }];
  } else {
    frames = KEYFRAMES[kind];
  }
  if (!frames.length) throw new Error('This effect has no keyframes');

  let track = clip.tracks.find((t) => t.target === target.ref);
  if (!track) {
    if (clip.tracks.length >= IMAGE_CLIP_MAX_TRACKS) throw new Error('This clip already has the most tracks it can hold');
    track = { target: target.ref, keyframes: [] } satisfies ImageTrack;
    clip.tracks.push(track);
  }
  track.keyframes = mergeKeyframes(track.keyframes, frames);
  if (path !== undefined) track.path = { d: path };

  for (const s of strings(frames)) {
    const low = s.toLowerCase();
    if (IMAGE_ANIM_DENY.some((bad) => low.includes(bad))) throw new Error('This effect holds text the animation cannot store');
  }
  return next;
}

const strokeOf = (e: Element): boolean => {
  const s = e.getAttribute('stroke') ?? /(?:^|;)\s*stroke\s*:\s*([^;]+)/.exec(e.getAttribute('style') ?? '')?.[1];
  return !!s && s.trim() !== 'none';
};

/** Which effects the target can take. The outline can only be drawn where something has a stroke. */
export function effectAvailability(svg: SVGSVGElement, target: ImageTarget): Availability {
  const out = Object.fromEntries(EFFECT_KINDS.map((k) => [k, { ok: true }])) as Availability;
  const el = elementOf(svg, target);
  let stroked = !el;
  if (el) {
    stroked = strokeOf(el) || Array.from(el.querySelectorAll('*')).some(strokeOf);
    for (let p = el.parentElement; p && !stroked; p = p.parentElement) stroked = strokeOf(p);
  }
  if (!stroked) out['stroke-draw'] = { ok: false, reason: 'no-stroke' };
  return out;
}
