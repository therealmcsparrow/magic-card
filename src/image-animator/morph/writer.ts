import {
  IMAGE_ANIM_DENY,
  IMAGE_ANIM_MAX_MORPHS,
  IMAGE_CLIP_DURATION_RANGE,
  IMAGE_CLIP_ITERATIONS_RANGE,
  IMAGE_MORPH_MAX_FRAMES,
  IMAGE_MORPH_MIN_FRAMES,
  MORPH_EASING_RE,
  MORPH_PATH_DATA_RE,
  type ImageAnimation,
  type ImageMorph,
  type ImageMorphFrame,
} from '../../contracts/image-animation';
import { MORPH_DUR_RE, MORPH_NUMBER_LIST_RE, MORPH_REPEAT_RE } from '../../contracts/svg-safety';
import { IMAGE_ID_RE } from '../../contracts/svg-image';
import { morphCss } from '../../image-anim/morph-css';
import { pathStructure } from '../../svg-safety/image-values';
import { defaultClip } from '../tracks';
import { resample } from './resample';

// Writes one morph twice: the frames for the record (which the viewer turns into CSS `d` keyframes) and the `<animate>`
// that goes into the drawing. Both come from the same resampled frames, so the two engines agree.

const SVG_NS = 'http://www.w3.org/2000/svg';
const LINEAR_SPLINE = '0 0 1 1';
const GENERATED_PREFIX = 'mc-morph-';

export interface MorphInput {
  /** Id of the `<path>` that changes. */
  target: string;
  /** Id for the `<animate>` element. */
  smil: string;
  frames: readonly ImageMorphFrame[];
  /** s per iteration, as the clip. */
  duration: number;
  iterations: 'infinite' | number;
  delay?: number;
}

export interface MorphWritten {
  morph: ImageMorph;
  /** The CSS copy: `@keyframes` and the rule, scoped to the key "morph". */
  css: string;
  /** The SMIL copy as text. */
  smil: string;
  /** The same attributes, for writing the element with DOM calls. */
  attributes: Record<string, string>;
}

const num = (n: number, places = 4): string => String(+n.toFixed(places));

/** The four control numbers of a `cubic-bezier(...)` easing as keySpline text; linear gives the straight line. */
function spline(easing: string | undefined): string {
  if (easing === undefined) return LINEAR_SPLINE;
  if (!MORPH_EASING_RE.test(easing)) throw new Error('A morph eases linearly or with a cubic-bezier');
  if (easing === 'linear') return LINEAR_SPLINE;
  return easing
    .slice(easing.indexOf('(') + 1, -1)
    .split(',')
    .map((s) => num(Number(s), 6))
    .join(' ');
}

function checkFrames(frames: readonly ImageMorphFrame[]): void {
  if (frames.length < IMAGE_MORPH_MIN_FRAMES || frames.length > IMAGE_MORPH_MAX_FRAMES) throw new Error('A morph needs 2 to 32 frames');
  frames.forEach((f, i) => {
    if (typeof f.at !== 'number' || !Number.isFinite(f.at)) throw new Error('A frame needs a position');
    if (i === 0 ? f.at !== 0 : f.at <= frames[i - 1].at) throw new Error('Frames must rise from 0');
    if (i === frames.length - 1 && f.at !== 100) throw new Error('The last frame is at 100');
    if (f.easing !== undefined && !MORPH_EASING_RE.test(f.easing)) throw new Error('A morph eases linearly or with a cubic-bezier');
  });
}

function checkTiming(duration: number, iterations: 'infinite' | number): void {
  const [dMin, dMax] = IMAGE_CLIP_DURATION_RANGE;
  const [iMin, iMax] = IMAGE_CLIP_ITERATIONS_RANGE;
  if (!(duration >= dMin && duration <= dMax)) throw new Error('The duration is out of range');
  if (iterations !== 'infinite' && !(iterations >= iMin && iterations <= iMax)) throw new Error('The iteration count is out of range');
}

/** Both copies of a morph. Throws for a frame set the contract would refuse; nothing is changed. */
export function writeMorph(input: MorphInput): MorphWritten {
  const { target, smil, duration, iterations } = input;
  if (!IMAGE_ID_RE.test(target) || !IMAGE_ID_RE.test(smil)) throw new Error('A morph needs ids');
  checkFrames(input.frames);
  checkTiming(duration, iterations);
  const at = input.frames.map((f) => +f.at.toFixed(2));
  if (at.some((x, i) => i > 0 && x <= at[i - 1])) throw new Error('Frames are too close together');
  const shapes = resample(input.frames.map((f) => f.d));
  const last = input.frames.length - 1;
  const frames: ImageMorphFrame[] = input.frames.map((f, i) => (i < last && f.easing !== undefined ? { at: at[i], d: shapes[i], easing: f.easing } : { at: at[i], d: shapes[i] }));
  const structure = pathStructure(frames[0].d);
  if (!structure || frames.some((f) => !MORPH_PATH_DATA_RE.test(f.d) || pathStructure(f.d) !== structure)) throw new Error('The frames do not share one structure');

  const morph: ImageMorph = { target, smil, frames };
  const splines = frames.slice(0, last).map((f) => spline(f.easing));
  const eased = splines.some((s) => s !== LINEAR_SPLINE);
  const attributes: Record<string, string> = {
    id: smil,
    attributeName: 'd',
    values: frames.map((f) => f.d).join(';'),
    dur: `${num(duration)}s`,
    repeatCount: iterations === 'infinite' ? 'indefinite' : num(iterations),
    keyTimes: at.map((x) => num(x / 100)).join(';'),
    begin: 'indefinite',
  };
  if (eased) {
    attributes.calcMode = 'spline';
    attributes.keySplines = splines.join(';');
  }
  if (iterations !== 'infinite') attributes.fill = 'freeze';
  if (!MORPH_DUR_RE.test(attributes.dur) || !MORPH_REPEAT_RE.test(attributes.repeatCount)) throw new Error('The timing cannot be written');
  if (!MORPH_NUMBER_LIST_RE.test(attributes.keyTimes) || (attributes.keySplines && !MORPH_NUMBER_LIST_RE.test(attributes.keySplines))) throw new Error('The timing cannot be written');
  const texts = [target, smil, ...frames.flatMap((f) => [f.d, f.easing ?? ''])];
  if (texts.some((s) => IMAGE_ANIM_DENY.some((bad) => s.toLowerCase().includes(bad)) || /["&]/.test(s))) throw new Error('A morph cannot hold this text');

  const css = morphCss([morph], { duration, delay: input.delay, iterations }, 'morph');
  if (!css) throw new Error('The morph cannot be written');
  const text = `<animate ${Object.entries(attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')}/>`;
  return { morph, css, smil: text, attributes };
}

export interface MorphRequest {
  /** The `<path>` that changes; its id is already in the drawing. */
  path: Element;
  /** The path data it changes into. */
  into: string;
  /** Go back to the first shape at the end. */
  back: boolean;
  /** The clip that gets the morph; the first clip when left out. */
  clipId?: string;
}

const idsOf = (svg: SVGSVGElement): Set<string> => new Set(Array.from(svg.querySelectorAll('[id]'), (e) => e.getAttribute('id') ?? ''));

/**
 * The animation with a morph on the path, in the chosen clip (the first by default), plus the `<animate>` written into the drawing. A path has
 * one morph: a second replaces the first. Throws before anything changes when the frames or the clip cannot hold one.
 */
export function addMorph(anim: ImageAnimation | undefined, svg: SVGSVGElement, req: MorphRequest): ImageAnimation {
  const target = req.path.getAttribute('id') ?? '';
  const from = req.path.getAttribute('d') ?? '';
  const next: ImageAnimation = anim ? structuredClone(anim) : { v: 1, clips: [] };
  if (!next.clips.length) next.clips.push(defaultClip());
  const clip = next.clips.find((c) => c.id === req.clipId) ?? next.clips[0];
  if (clip.direction !== undefined && clip.direction !== 'normal') throw new Error('A clip with a morph plays forwards only');
  let smil: string | undefined;
  for (const c of next.clips) {
    const old = c.morphs?.find((m) => m.target === target);
    if (!old) continue;
    smil = old.smil;
    c.morphs = c.morphs?.filter((m) => m !== old);
    if (!c.morphs?.length) delete c.morphs;
  }
  const used = new Set([...idsOf(svg), ...next.clips.flatMap((c) => (c.morphs ?? []).map((m) => m.smil))]);
  if (!smil) {
    let n = 1;
    while (used.has(`${GENERATED_PREFIX}${n}`)) n += 1;
    smil = `${GENERATED_PREFIX}${n}`;
  }
  const frames: ImageMorphFrame[] = req.back ? [{ at: 0, d: from }, { at: 50, d: req.into }, { at: 100, d: from }] : [{ at: 0, d: from }, { at: 100, d: req.into }];
  const written = writeMorph({ target, smil, frames, duration: clip.duration, iterations: clip.iterations, delay: clip.delay });
  const morphs = next.clips.flatMap((c) => c.morphs ?? []);
  if (morphs.length >= IMAGE_ANIM_MAX_MORPHS) throw new Error('This image already has the most morphs it can hold');
  (clip.morphs ??= []).push(written.morph);

  for (const child of Array.from(req.path.children)) if (child.localName === 'animate') child.remove();
  const el = req.path.ownerDocument.createElementNS(SVG_NS, 'animate');
  for (const [k, v] of Object.entries(written.attributes)) el.setAttribute(k, v);
  req.path.append(el);
  return next;
}
