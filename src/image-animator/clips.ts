import {
  IMAGE_ANIM_DENY,
  IMAGE_ANIM_MAX_CLIPS,
  IMAGE_CLIP_DURATION_RANGE,
  IMAGE_CLIP_ID_RE,
  IMAGE_CLIP_ITERATIONS_RANGE,
  IMAGE_CLIP_NAME_MAX,
  type ClipPlay,
  type ImageAnimation,
  type ImageClip,
} from '../contracts/image-animation';
import type { ClipWhen } from '../anim-studio/model-v2-core';
import { writeMorph, type MorphWritten } from './morph/writer';

// Pure edits of the clips of an image animation: create, rename, delete, duplicate, order, what starts a clip, and its timing.

export type ClipsError = 'name-empty' | 'name-too-long' | 'name-taken' | 'name-denied' | 'limit' | 'not-found' | 'bad-play' | 'bad-timing' | 'direction-morph';
export type ClipsResult = { ok: true; anim: ImageAnimation; id: string } | { ok: false; error: ClipsError };

const ENTITY_RE = /^[a-z0-9_]{1,64}\.[a-z0-9_]{1,128}$/;
const ATTRIBUTE_RE = /^[A-Za-z0-9_]{1,64}$/;
const WHEN_TEXT_MAX = 64;
const WHEN_NUMBER_MAX = 1e9;
const ANIMATE_ATTRIBUTES = ['id', 'attributeName', 'values', 'dur', 'repeatCount', 'keyTimes', 'keySplines', 'calcMode', 'fill', 'begin'];

const fail = (error: ClipsError): ClipsResult => ({ ok: false, error });
const denied = (s: string): boolean => {
  const low = s.toLowerCase();
  return IMAGE_ANIM_DENY.some((bad) => low.includes(bad));
};

function checkName(anim: ImageAnimation, name: string, except?: string): { name: string } | ClipsError {
  const n = name.trim();
  if (!n) return 'name-empty';
  if ([...n].length > IMAGE_CLIP_NAME_MAX) return 'name-too-long';
  if (denied(n)) return 'name-denied';
  const key = n.toLowerCase();
  if (anim.clips.some((c) => c.id !== except && c.name.toLowerCase() === key)) return 'name-taken';
  return { name: n };
}

/** A slug of the name that no clip of the record has yet; at most 48 characters. */
function freshId(anim: ImageAnimation, name: string): string {
  const base =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40)
      .replace(/-+$/, '') || 'clip';
  const used = new Set(anim.clips.map((c) => c.id));
  let id = base;
  for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
  return IMAGE_CLIP_ID_RE.test(id) ? id : 'clip';
}

const clone = (anim: ImageAnimation | undefined): ImageAnimation => (anim ? structuredClone(anim) : { v: 1, clips: [] });

/** A new clip that always plays, with no tracks yet. */
export function createClip(anim: ImageAnimation | undefined, name: string): ClipsResult {
  const next = clone(anim);
  if (next.clips.length >= IMAGE_ANIM_MAX_CLIPS) return fail('limit');
  const checked = checkName(next, name);
  if (typeof checked === 'string') return fail(checked);
  const id = freshId(next, checked.name);
  next.clips.push({ id, name: checked.name, play: { on: 'always' }, duration: 2, easing: 'ease-in-out', iterations: 'infinite', tracks: [] });
  return { ok: true, anim: next, id };
}

export function renameClip(anim: ImageAnimation, id: string, name: string): ClipsResult {
  const next = clone(anim);
  const clip = next.clips.find((c) => c.id === id);
  if (!clip) return fail('not-found');
  const checked = checkName(next, name, id);
  if (typeof checked === 'string') return fail(checked);
  clip.name = checked.name;
  return { ok: true, anim: next, id };
}

/** Undefined when the last clip goes, so the record carries no animation. */
export function deleteClip(anim: ImageAnimation, id: string): ImageAnimation | undefined {
  const next = clone(anim);
  next.clips = next.clips.filter((c) => c.id !== id);
  return next.clips.length ? next : undefined;
}

/** A copy placed after its source. Morphs stay with the source: a path has one morph. */
export function duplicateClip(anim: ImageAnimation, id: string): ClipsResult {
  const next = clone(anim);
  const at = next.clips.findIndex((c) => c.id === id);
  if (at < 0) return fail('not-found');
  if (next.clips.length >= IMAGE_ANIM_MAX_CLIPS) return fail('limit');
  const source = next.clips[at];
  let name = '';
  for (let n = 2; !name; n += 1) {
    const suffix = ` ${n}`;
    const candidate = `${[...source.name].slice(0, IMAGE_CLIP_NAME_MAX - suffix.length).join('')}${suffix}`;
    if (typeof checkName(next, candidate) !== 'string') name = candidate;
  }
  const copy: ImageClip = { ...structuredClone(source), id: freshId(next, name), name };
  delete copy.morphs;
  next.clips.splice(at + 1, 0, copy);
  return { ok: true, anim: next, id: copy.id };
}

/** List order is the priority of state clips. */
export function moveClip(anim: ImageAnimation, id: string, delta: -1 | 1): ImageAnimation {
  const next = clone(anim);
  const from = next.clips.findIndex((c) => c.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= next.clips.length) return next;
  const [clip] = next.clips.splice(from, 1);
  next.clips.splice(to, 0, clip);
  return next;
}

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= WHEN_NUMBER_MAX;
const text = (s: unknown): s is string => typeof s === 'string' && s.length <= WHEN_TEXT_MAX && !denied(s);

function checkedWhen(w: unknown): ClipWhen | undefined {
  if (!w || typeof w !== 'object') return undefined;
  const o = w as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length !== 1) return undefined;
  const k = keys[0];
  if ((k === 'state' || k === 'state_not') && text(o[k])) return { [k]: o[k] } as ClipWhen;
  if (k === 'entity_on' && typeof o[k] === 'boolean') return { entity_on: o[k] };
  if ((k === 'above' || k === 'below') && finite(o[k])) return { [k]: o[k] } as ClipWhen;
  return undefined;
}

function checkedPlay(play: unknown): ClipPlay | undefined {
  if (!play || typeof play !== 'object') return undefined;
  const p = play as Record<string, unknown>;
  if (p.on === 'always' || p.on === 'hover' || p.on === 'tap') return { on: p.on };
  if (p.on !== 'state') return undefined;
  if (typeof p.entity !== 'string' || !ENTITY_RE.test(p.entity)) return undefined;
  const when = checkedWhen(p.when);
  if (!when) return undefined;
  const out: ClipPlay = { on: 'state', entity: p.entity, when };
  if (p.attribute !== undefined) {
    if (typeof p.attribute !== 'string' || !ATTRIBUTE_RE.test(p.attribute)) return undefined;
    out.attribute = p.attribute;
  }
  return out;
}

/** Binds a clip to what starts it; a state binding needs a well-formed entity id, attribute and condition. */
export function setClipPlay(anim: ImageAnimation, id: string, play: ClipPlay): ClipsResult {
  const next = clone(anim);
  const clip = next.clips.find((c) => c.id === id);
  if (!clip) return fail('not-found');
  const checked = checkedPlay(play);
  if (!checked) return fail('bad-play');
  clip.play = checked;
  return { ok: true, anim: next, id };
}

/** The condition a state clip waits for, from the kind chosen in the list (state, state_not, on, off, above, below) and the text typed; undefined when it does not parse. */
export function parseWhen(kind: string, value: string): ClipWhen | undefined {
  const v = value.trim();
  if (kind === 'on' || kind === 'off') return { entity_on: kind === 'on' };
  if (kind === 'state' || kind === 'state_not') return checkedWhen({ [kind]: v });
  if ((kind === 'above' || kind === 'below') && v !== '') return checkedWhen({ [kind]: Number(v) });
  return undefined;
}

export interface ClipTiming {
  duration?: number;
  iterations?: 'infinite' | number;
  direction?: NonNullable<ImageClip['direction']>;
}

function writeAnimate(svg: SVGSVGElement, smil: string, attributes: Record<string, string>): void {
  const el = Array.from(svg.querySelectorAll('animate')).find((e) => e.getAttribute('id') === smil);
  if (!el) return;
  for (const name of ANIMATE_ATTRIBUTES) if (!(name in attributes)) el.removeAttribute(name);
  for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
}

/**
 * Changes the duration, iterations or direction of a clip. The morphs of the clip are written again so their
 * `<animate>` elements in the drawing follow; nothing changes when any step refuses. A clip with a morph plays forwards only.
 */
export function setClipTiming(anim: ImageAnimation, svg: SVGSVGElement | undefined, id: string, timing: ClipTiming): ClipsResult {
  const next = clone(anim);
  const clip = next.clips.find((c) => c.id === id);
  if (!clip) return fail('not-found');
  const direction = timing.direction ?? clip.direction;
  if (clip.morphs?.length && direction !== undefined && direction !== 'normal') return fail('direction-morph');
  const duration = timing.duration ?? clip.duration;
  const iterations = timing.iterations ?? clip.iterations;
  const [dMin, dMax] = IMAGE_CLIP_DURATION_RANGE;
  const [iMin, iMax] = IMAGE_CLIP_ITERATIONS_RANGE;
  if (!(typeof duration === 'number' && duration >= dMin && duration <= dMax)) return fail('bad-timing');
  if (iterations !== 'infinite' && !(typeof iterations === 'number' && iterations >= iMin && iterations <= iMax)) return fail('bad-timing');
  const written: MorphWritten[] = [];
  try {
    for (const m of clip.morphs ?? []) written.push(writeMorph({ target: m.target, smil: m.smil, frames: m.frames, duration, iterations, delay: clip.delay }));
  } catch {
    return fail('bad-timing');
  }
  clip.duration = duration;
  clip.iterations = iterations;
  if (timing.direction !== undefined) clip.direction = timing.direction;
  if (written.length) clip.morphs = written.map((w) => w.morph);
  if (svg) for (const w of written) writeAnimate(svg, w.morph.smil, w.attributes);
  return { ok: true, anim: next, id };
}
