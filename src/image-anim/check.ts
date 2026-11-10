import {
  IMAGE_ANIMATION_RECORD_VERSION,
  IMAGE_ANIM_DENY,
  IMAGE_ANIM_MAX_CLIPS,
  IMAGE_ANIM_MAX_MORPHS,
  IMAGE_ANIM_MAX_STRING_CHARS,
  IMAGE_ANIM_WS,
  IMAGE_CLIP_DELAY_MAX,
  IMAGE_CLIP_DURATION_RANGE,
  IMAGE_CLIP_ID_RE,
  IMAGE_CLIP_ITERATIONS_RANGE,
  IMAGE_CLIP_MAX_TRACKS,
  IMAGE_CLIP_NAME_MAX,
  IMAGE_MORPH_MAX_FRAMES,
  IMAGE_MORPH_MIN_FRAMES,
  IMAGE_TRACK_MAX_KEYFRAMES,
  MORPH_EASING_RE,
  type ClipPlay,
  type ImageAnimation,
  type ImageClip,
  type ImageMorph,
  type ImageTrack,
} from '../contracts/image-animation';
import { IMAGE_ID_RE, IMAGE_MAX_BYTES } from '../contracts/svg-image';
import { EASING_LANE_IDS, type ClipWhen } from '../anim-studio/model-v2-core';
import type { AnimationKeyframe, KeyframeTransform } from '../anim-studio/model';
import { pathStructure, trimAnimWs } from '../contracts/svg-path-text';

// Checks the animation of a library image record on allow-lists, field by field; a record with any miss is dropped whole.

type Dict = Record<string, unknown>;
class Miss extends Error {}

const SCRIPT_URL_RE = /(?:java|vb)script:/i;
const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const;
const ENTITY_RE = /^[a-z0-9_]{1,64}\.[a-z0-9_]{1,128}$/;
const ATTRIBUTE_RE = /^[A-Za-z0-9_]{1,64}$/;
const EASING_WORD_RE = /^[a-z][a-z0-9-]{0,31}$/;
const NUM = String.raw`-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)`;
const WS = IMAGE_ANIM_WS;
const REGEX_INPUT_MAX = 64;
const ENTITY_INPUT_MAX = 193;
const EASING_BEZIER_RE = new RegExp(String.raw`^cubic-bezier\(${WS}*${NUM}${WS}*(?:,${WS}*${NUM}${WS}*){3}\)$`);
const EASING_STEPS_RE = new RegExp(String.raw`^steps\(${WS}*[0-9]{1,3}${WS}*(?:,${WS}*(?:start|end|jump-start|jump-end|jump-none|jump-both)${WS}*)?\)$`);
const ORIGIN_TOKEN = String.raw`(?:left|right|top|bottom|center|${NUM}(?:px|%|em|rem)?)`;
const ORIGIN_RE = new RegExp(String.raw`^${ORIGIN_TOKEN}(?:${WS}+${ORIGIN_TOKEN}){0,2}$`);
const CSS_RE = /^[A-Za-z0-9_ \t\n\r\f.,%#()+/-]+$/;
const TRANSFORM_RANGES: Record<keyof Omit<KeyframeTransform, 'axis'>, [number, number]> = {
  x: [-10000, 10000], y: [-10000, 10000], scale: [0, 100], scale_x: [-100, 100], scale_y: [-100, 100], rotate: [-36000, 36000], skew_x: [-89, 89], skew_y: [-89, 89],
};
const CSS_KEYS = ['color', 'background', 'shadow', 'filter', 'stroke'] as const;
const NUMBER_KEYS: Record<string, [number, number]> = { blur: [0, 200], radius: [0, 1000], draw: [0, 1] };

const own = (o: Dict, key: string): unknown => (Object.prototype.hasOwnProperty.call(o, key) ? o[key] : undefined);

function dict(v: unknown): Dict {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new Miss();
  return v as Dict;
}

function list(v: unknown, min: number, max: number): unknown[] {
  if (!Array.isArray(v) || v.length < min || v.length > max) throw new Miss();
  return v;
}

/** True when `v` holds more than `max` code points; an astral character counts once, as Utils counts it. */
function overCap(v: string, max: number): boolean {
  if (v.length <= max) return false;
  return v.length > 2 * max || Array.from(v).length > max;
}

/** Text of at most `max` code points that holds none of the deny strings or a script URL scheme, in any case. */
function text(v: unknown, max = IMAGE_ANIM_MAX_STRING_CHARS): string {
  if (typeof v !== 'string' || overCap(v, max)) throw new Miss();
  const low = v.toLowerCase();
  if (SCRIPT_URL_RE.test(low) || IMAGE_ANIM_DENY.some((t) => low.includes(t))) throw new Miss();
  return v;
}

function matching(v: unknown, re: RegExp, cap = REGEX_INPUT_MAX): string {
  const s = text(v, cap);
  if (!re.test(s)) throw new Miss();
  return s;
}

function num(v: unknown, min: number, max: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw new Miss();
  return v;
}

function easing(v: unknown): string {
  const s = trimAnimWs(text(v, REGEX_INPUT_MAX));
  if (!EASING_WORD_RE.test(s) && !EASING_BEZIER_RE.test(s) && !EASING_STEPS_RE.test(s)) throw new Miss();
  return s;
}

function when(v: unknown): ClipWhen {
  const o = dict(v);
  const keys = ['state', 'state_not', 'entity_on', 'above', 'below'].filter((k) => own(o, k) !== undefined);
  if (keys.length !== 1) throw new Miss();
  const k = keys[0];
  const x = own(o, k);
  if (k === 'state' || k === 'state_not') return { [k]: text(x, 64) } as ClipWhen;
  if (k === 'entity_on') {
    if (typeof x !== 'boolean') throw new Miss();
    return { entity_on: x };
  }
  return { [k]: num(x, -1e9, 1e9) } as ClipWhen;
}

function play(v: unknown): ClipPlay {
  const o = dict(v);
  const on = own(o, 'on');
  if (on === 'always' || on === 'hover' || on === 'tap') return { on };
  if (on !== 'state') throw new Miss();
  const out: ClipPlay = { on: 'state', entity: matching(own(o, 'entity'), ENTITY_RE, ENTITY_INPUT_MAX), when: when(own(o, 'when')) };
  const attribute = own(o, 'attribute');
  if (attribute !== undefined) out.attribute = matching(attribute, ATTRIBUTE_RE);
  return out;
}

function keyframe(v: unknown): AnimationKeyframe {
  const o = dict(v);
  const k: AnimationKeyframe = { at: num(own(o, 'at'), 0, 100) };
  const opacity = own(o, 'opacity');
  if (opacity !== undefined) k.opacity = num(opacity, 0, 1);
  const t = own(o, 'transform');
  if (t !== undefined) {
    const src = dict(t);
    const out: KeyframeTransform = {};
    for (const [name, [lo, hi]] of Object.entries(TRANSFORM_RANGES)) {
      const x = own(src, name);
      if (x !== undefined) out[name as keyof typeof TRANSFORM_RANGES] = num(x, lo, hi);
    }
    const axis = own(src, 'axis');
    if (axis !== undefined) {
      const a = list(axis, 3, 3).map((n) => num(n, -1e6, 1e6));
      if (a.every((n) => n === 0)) throw new Miss();
      out.axis = [a[0], a[1], a[2]];
    }
    k.transform = out;
  }
  for (const name of CSS_KEYS) {
    const x = own(o, name);
    if (x !== undefined) {
      const s = text(x);
      if (!CSS_RE.test(s) || s.includes('//') || s.includes('/*')) throw new Miss();
      k[name] = s;
    }
  }
  for (const [name, [lo, hi]] of Object.entries(NUMBER_KEYS)) {
    const x = own(o, name);
    if (x !== undefined) k[name as 'blur' | 'radius' | 'draw'] = num(x, lo, hi);
  }
  if (own(o, 'easing') !== undefined) k.easing = easing(own(o, 'easing'));
  const lanes = own(o, 'easings');
  if (lanes !== undefined) {
    const src = dict(lanes);
    const out: NonNullable<AnimationKeyframe['easings']> = {};
    for (const lane of EASING_LANE_IDS) if (own(src, lane) !== undefined) out[lane] = easing(own(src, lane));
    k.easings = out;
  }
  return k;
}

function track(v: unknown, svgIds: ReadonlySet<string>, seen: Set<string>): ImageTrack {
  const o = dict(v);
  const raw = text(own(o, 'target'));
  const part = raw.startsWith('part:') ? raw.slice(5) : undefined;
  if (raw !== 'element' && !(part !== undefined && IMAGE_ID_RE.test(part) && svgIds.has(part))) throw new Miss();
  if (seen.has(raw)) throw new Miss();
  seen.add(raw);
  const out: ImageTrack = { target: raw as ImageTrack['target'], keyframes: list(own(o, 'keyframes'), 1, IMAGE_TRACK_MAX_KEYFRAMES).map(keyframe) };
  if (own(o, 'origin') !== undefined) out.origin = matching(own(o, 'origin'), ORIGIN_RE);
  const path = own(o, 'path');
  if (path !== undefined) {
    const p = dict(path);
    const d = own(p, 'd');
    if (typeof d !== 'string' || d.length > IMAGE_MAX_BYTES || !pathStructure(d)) throw new Miss();
    out.path = { d };
    const follow = own(p, 'follow_rotation');
    if (follow !== undefined) {
      if (typeof follow !== 'boolean') throw new Miss();
      out.path.follow_rotation = follow;
    }
  }
  return out;
}

function morph(v: unknown, svgIds: ReadonlySet<string>, targets: Set<string>, smils: Set<string>): ImageMorph {
  const o = dict(v);
  const target = matching(own(o, 'target'), IMAGE_ID_RE);
  const smil = matching(own(o, 'smil'), IMAGE_ID_RE);
  if (!svgIds.has(target) || targets.has(target) || smils.has(smil)) throw new Miss();
  targets.add(target);
  smils.add(smil);
  let shape: string | undefined;
  let last = -1;
  const frames = list(own(o, 'frames'), IMAGE_MORPH_MIN_FRAMES, IMAGE_MORPH_MAX_FRAMES).map((f, i, all) => {
    const fo = dict(f);
    const at = num(own(fo, 'at'), 0, 100);
    if (at <= last || (i === 0 && at !== 0) || (i === all.length - 1 && at !== 100)) throw new Miss();
    last = at;
    const d = own(fo, 'd');
    const s = typeof d === 'string' && d.length <= IMAGE_MAX_BYTES ? pathStructure(d) : undefined;
    if (!s || (shape !== undefined && s !== shape)) throw new Miss();
    shape = s;
    const frame: ImageMorph['frames'][number] = { at, d: d as string };
    if (own(fo, 'easing') !== undefined) frame.easing = matching(own(fo, 'easing'), MORPH_EASING_RE);
    return frame;
  });
  return { target, smil, frames };
}

function clip(v: unknown, svgIds: ReadonlySet<string>, targets: Set<string>, smils: Set<string>): ImageClip {
  const o = dict(v);
  const name = text(own(o, 'name'), IMAGE_CLIP_NAME_MAX);
  if (!trimAnimWs(name).length) throw new Miss();
  const rawMorphs = own(o, 'morphs');
  const direction = own(o, 'direction');
  if (direction !== undefined && !(DIRECTIONS as readonly unknown[]).includes(direction)) throw new Miss();
  const iterations = own(o, 'iterations');
  const seen = new Set<string>();
  const out: ImageClip = {
    id: matching(own(o, 'id'), IMAGE_CLIP_ID_RE),
    name,
    play: play(own(o, 'play')),
    duration: num(own(o, 'duration'), IMAGE_CLIP_DURATION_RANGE[0], IMAGE_CLIP_DURATION_RANGE[1]),
    easing: easing(own(o, 'easing')),
    iterations: iterations === 'infinite' ? iterations : num(iterations, IMAGE_CLIP_ITERATIONS_RANGE[0], IMAGE_CLIP_ITERATIONS_RANGE[1]),
    tracks: list(own(o, 'tracks'), 0, IMAGE_CLIP_MAX_TRACKS).map((t) => track(t, svgIds, seen)),
  };
  if (own(o, 'delay') !== undefined) out.delay = num(own(o, 'delay'), 0, IMAGE_CLIP_DELAY_MAX);
  if (direction !== undefined) out.direction = direction as ImageClip['direction'];
  if (rawMorphs !== undefined) {
    out.morphs = list(rawMorphs, 0, IMAGE_ANIM_MAX_MORPHS).map((m) => morph(m, svgIds, targets, smils));
    if (out.morphs.length && direction !== undefined && direction !== 'normal') throw new Miss();
  }
  return out;
}

/**
 * The record's animation reduced to the fields the contract names, or undefined when any field misses its allow-list or
 * holds a deny string. `svgIds` are the ids of the sanitised drawing; every morph and track target must be one of them.
 */
export function checkImageAnimation(value: unknown, svgIds: ReadonlySet<string>): ImageAnimation | undefined {
  try {
    const o = dict(value);
    if (own(o, 'v') !== IMAGE_ANIMATION_RECORD_VERSION) return undefined;
    const targets = new Set<string>();
    const smils = new Set<string>();
    const clips = list(own(o, 'clips'), 1, IMAGE_ANIM_MAX_CLIPS).map((c) => clip(c, svgIds, targets, smils));
    if (new Set(clips.map((c) => c.id)).size !== clips.length || targets.size > IMAGE_ANIM_MAX_MORPHS) return undefined;
    return { v: IMAGE_ANIMATION_RECORD_VERSION, clips };
  } catch (e) {
    if (e instanceof Miss) return undefined;
    throw e;
  }
}
