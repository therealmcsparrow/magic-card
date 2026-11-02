import { toCubicSubpaths } from '../path/core';
import { SVG_MAX_BYTES, sanitizeSvg } from '../icons/svg-sanitize';
import { ANIMATION_PRESETS, EASINGS } from '../utils/animation-presets';
import type { AnimationDirection } from '../types';
import { EASING_LANE_IDS, type Binding, type Clip, type EasingLaneId, type Rig, type Track } from './model-v2-core';
import type { MirrorFlag } from '../contracts/icon-library';
import type { ParticlesSim } from '../contracts/particles-v2';
import { animHooks, useParticlesValidator } from '../utils/anim-hooks';
import { CUSTOM_PREFIX, customRefId, isCustomRef } from '../utils/custom-ref';

export * from './model-v2-core';

// Custom animation documents: what the studio edits, the integration stores and cards reference as `custom:<id>`. Pure,
// apart from the SVG sanitiser parser. Stored JSON is the normalised validateAnimationDoc output. Units: seconds, px,
// degrees, `at` in % of the cycle, opacity 0-1.

export type AnimationKind = 'keyframes' | 'particles' | 'path' | 'sequence';
export const ANIMATION_KINDS: AnimationKind[] = ['keyframes', 'particles', 'path', 'sequence'];

export interface KeyframeTransform {
  /** px */
  x?: number;
  y?: number;
  scale?: number;
  /** Per axis, multiplied with `scale` (squash & stretch). */
  scale_x?: number;
  scale_y?: number;
  /** deg */
  rotate?: number;
  /** Rotation axis [x, y, z] for 3D turns (flip: [0, 1, 0]); default the z axis. */
  axis?: [number, number, number];
  /** deg */
  skew_x?: number;
  skew_y?: number;
}

export interface AnimationKeyframe {
  /** % of the cycle, 0-100. */
  at: number;
  transform?: KeyframeTransform;
  /** 0-1 */
  opacity?: number;
  /** CSS colour; `var(--mc-anim-c)` is the animation colour (entry colour > design > entity > theme). */
  color?: string;
  /** CSS colour or gradient. */
  background?: string;
  /** box-shadow value. */
  shadow?: string;
  /** filter list (drop-shadow, brightness, hue-rotate...); `blur` is added to it. */
  filter?: string;
  /** px */
  blur?: number;
  /** border-radius, px */
  radius?: number;
  /** Easing from this keyframe to the next (EASINGS id or cubic-bezier() / steps()). */
  easing?: string;
  /** v2: stroke reveal 0-1 (icon parts, groups and shapes only; pathLength=1 dash technique). */
  draw?: number;
  /** v2: stroke colour (icon parts and shapes). */
  stroke?: string;
  /** v2: per-lane easing from this keyframe to the next, overriding `easing` for that lane. */
  easings?: Partial<Record<EasingLaneId, string>>;
}

export type ParticleShape = { icon: string } | { emoji: string } | { svg: string };
export type ParticleDirection = 'fall' | 'rise' | 'drift' | 'burst' | 'orbit' | 'spiral';
export const PARTICLE_DIRECTIONS: ParticleDirection[] = ['fall', 'rise', 'drift', 'burst', 'orbit', 'spiral'];

export interface ParticlesSpec {
  /**
   * A built-in particle / ring / scene preset whose look this document keeps ("Customise a preset"
   * on an fx preset): only `intensity`, the colour and the timing are then used, the generic
   * fields below are ignored until the preset is detached (removed).
   */
  preset?: string;
  /** The preset's own parameter (particle count, ring width, density...). */
  intensity?: number;
  /** What each particle is; none: a round dot in the particle colour. */
  shape?: ParticleShape;
  count: number;
  direction: ParticleDirection;
  /** Multiplies the speed (the cycle is duration / speed). */
  speed: number;
  /** [min, max] px. */
  size: [number, number];
  /** Particle colours, taken in turn; empty: the animation colour. */
  colors: string[];
  /** deg per cycle. */
  spin: number;
  /** Fade in and out. */
  fade: boolean;
  /** % of the width particles start across (fall / rise), the radius in % (burst / orbit / spiral). */
  spread: number;
  /** -1..1: pulls particles down (positive) or up; accelerates falls. */
  gravity: number;
  layer: 'back' | 'front';
  /**
   * v2 (particles-v2 contract): the simulation. Without it the spec is v1 and compiles as before;
   * with it the fields above stay the v1 fallback. Kept as stored until the particles chunk checks it.
   */
  sim?: ParticlesSim;
}

export interface PathSpec {
  /** SVG path data. Coordinates are the offset from the element's rest position. */
  d: string;
  /** percent: in % of the moving element's own size (the fx layer's for particles); px: pixels. */
  units: 'percent' | 'px';
  /** Turn the subject along the path's direction. */
  follow_rotation: boolean;
  subject: 'element' | 'icon' | 'particles';
  /** subject particles: what moves along the path (count spaced evenly). */
  particles?: Pick<ParticlesSpec, 'shape' | 'count' | 'size' | 'colors'>;
}

export interface SequenceStep {
  /** A motion preset id or `custom:<id>` of a keyframes / path document. */
  animation: string;
  /** s after the previous step ends. */
  delay: number;
  /** s per play; default the animation's own duration. */
  duration?: number;
  /** Plays of this step (1 = once). */
  repeat: number;
}

export interface AnimationDoc {
  /** Stable id, referenced as `preset: custom:<id>`. */
  id: string;
  name: string;
  kind: AnimationKind;
  /** s per cycle (sequences: unused, the steps set the length). */
  duration: number;
  easing: string;
  iterations: 'infinite' | number;
  direction?: AnimationDirection;
  /** What it moves when the card entry does not say: the element or the module's icon. */
  target: 'element' | 'icon';
  /** transform-origin */
  origin: string;
  version: 1;
  keyframes?: AnimationKeyframe[];
  particles?: ParticlesSpec;
  path?: PathSpec;
  steps?: SequenceStep[];
  /** Sequences: start again after the last step. */
  loop?: boolean;
  /** Sequences: run on the element's children one after another (a row's columns, a column's modules). */
  stagger?: { children: boolean; delay: number };
  /** v2 (keyframes): the icon split into parts, groups and drawn shapes. */
  rig?: Rig;
  /** v2 (keyframes): keyframes per target (card parts, icon parts); `keyframes` stays the element / icon track. */
  tracks?: Track[];
  /** v2 (any kind): what plays per entity state. */
  clips?: Clip[];
  /** v2 (keyframes): entity values driving target properties. */
  bindings?: Binding[];
  /** An icon document: `mirror` flips the icon under a right-to-left direction, `keep` never does; absent means unset. */
  mirror?: MirrorFlag;
}

/** Size caps (the integration enforces the same). */
export const ANIMATION_CAPS = {
  /** Animations in the library. */
  docs: 200,
  /** UTF-8 bytes of one document's JSON. */
  bytes: 64 * 1024,
  keyframes: 40,
  particles: 60,
  steps: 20,
  colors: 12,
  pathLength: 8192,
  name: 80,
  /** A CSS value (colour, shadow, filter, background). */
  css: 600,
} as const;

export const ANIMATION_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
// the `custom:<id>` helpers are plain code the entry needs: src/utils/custom-ref.ts
export { CUSTOM_PREFIX, customRefId, isCustomRef };

export const DEFAULT_PARTICLES: ParticlesSpec = {
  count: 12,
  direction: 'fall',
  speed: 1,
  size: [6, 12],
  colors: [],
  spin: 0,
  fade: true,
  spread: 100,
  gravity: 0,
  layer: 'back',
};

/** A new document of `kind` with its defaults (a keyframes doc gets a gentle pulse to start from). */
export function newAnimationDoc(kind: AnimationKind, id: string, name = 'New animation'): AnimationDoc {
  const base: AnimationDoc = { id, name, kind, duration: 2, easing: 'ease-in-out', iterations: 'infinite', target: 'element', origin: 'center', version: 1 };
  switch (kind) {
    case 'keyframes':
      return { ...base, keyframes: [{ at: 0, transform: { scale: 1 } }, { at: 50, transform: { scale: 1.1 } }, { at: 100, transform: { scale: 1 } }] };
    case 'particles':
      return { ...base, duration: 4, easing: 'linear', particles: { ...DEFAULT_PARTICLES, size: [...DEFAULT_PARTICLES.size], colors: [] } };
    case 'path':
      return { ...base, duration: 3, easing: 'linear', path: { d: 'M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0', units: 'px', follow_rotation: false, subject: 'element' } };
    case 'sequence':
      return { ...base, steps: [{ animation: 'pop', delay: 0, repeat: 1 }, { animation: 'wiggle', delay: 0.2, repeat: 1 }], loop: true, stagger: { children: false, delay: 0.15 } };
  }
}

// ── validation ──

export interface FieldError {
  /** Field path, e.g. `keyframes[2].transform.rotate`. */
  path: string;
  message: string;
}

export type ValidationResult = { ok: true; doc: AnimationDoc; errors: [] } | { ok: false; doc?: undefined; errors: FieldError[] };

const COLOR_FNS = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'var', 'light-dark', 'calc', 'min', 'max', 'clamp'];
const GRADIENT_FNS = ['linear-gradient', 'radial-gradient', 'conic-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient'];
const FILTER_FNS = ['blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'];
const CSS_FNS = {
  color: new Set(COLOR_FNS),
  background: new Set([...COLOR_FNS, ...GRADIENT_FNS]),
  shadow: new Set(COLOR_FNS),
  filter: new Set([...COLOR_FNS, ...FILTER_FNS]),
};

/**
 * A CSS value safe inside a generated rule: only `fns` may be called (never url() or image
 * functions), var() reads custom properties only, no quotes, comments, `;`, braces or escapes.
 */
export function safeCssValue(v: unknown, kind: keyof typeof CSS_FNS): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s || s.length > ANIMATION_CAPS.css || !/^[#\w\s(),.%+*/-]+$/.test(s) || s.includes('/*') || s.includes('*/')) return undefined;
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')' && --depth < 0) return undefined;
  }
  if (depth !== 0) return undefined;
  const opens = s.match(/\(/g)?.length ?? 0;
  const fns = [...s.matchAll(/([a-z-]+)\s*\(/gi)];
  if (fns.length !== opens || fns.some((m) => !CSS_FNS[kind].has(m[1].toLowerCase()))) return undefined;
  if ([...s.matchAll(/var\(\s*([^,)\s]*)/gi)].some((m) => !/^--[\w-]+$/.test(m[1]))) return undefined;
  return s;
}

/** A transform-origin: keywords, lengths and percentages. */
export const ORIGIN_RE = /^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/;
export const PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/;
export const ICON_RE = /^[a-z0-9_-]+:[a-z0-9_-]+$/i;
const DIRECTIONS: AnimationDirection[] = ['normal', 'reverse', 'alternate', 'alternate-reverse'];

/** An easing id from EASINGS or a cubic-bezier() / steps() function. */
export function validEasing(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const s = v.trim();
  return (
    EASINGS.some((e) => e.id === s) ||
    /^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(s) ||
    /^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(s)
  );
}

/** Motion presets (no particle layer): what a sequence step may play. */
export const SEQUENCEABLE_PRESETS = new Set(ANIMATION_PRESETS.filter((p) => !p.channels.includes('fx')).map((p) => p.id));
const FX_PRESETS = new Set(ANIMATION_PRESETS.filter((p) => p.channels.includes('fx')).map((p) => p.id));

const utf8Bytes = (s: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length);

/** Collects field errors while reading a raw document (shared with model-v2's validators). */
export class Checker {
  errors: FieldError[] = [];
  err(path: string, message: string): undefined {
    this.errors.push({ path, message });
    return undefined;
  }
  /** A number (or numeric string) within [min, max]; `def` when missing. */
  num(o: Record<string, unknown>, key: string, path: string, min: number, max: number, def?: number, int = false): number | undefined {
    const raw = o[key];
    if (raw === undefined || raw === null || raw === '') return def === undefined ? undefined : def;
    const n = typeof raw === 'string' ? Number(raw) : raw;
    if (typeof n !== 'number' || !Number.isFinite(n)) return this.err(path, 'Must be a number.');
    if (int && !Number.isInteger(n)) return this.err(path, 'Must be a whole number.');
    if (n < min || n > max) return this.err(path, `Must be between ${min} and ${max}.`);
    return n;
  }
  bool(o: Record<string, unknown>, key: string, path: string, def: boolean): boolean {
    const v = o[key];
    if (v === undefined || v === null) return def;
    if (typeof v !== 'boolean') return this.err(path, 'Must be true or false.') ?? def;
    return v;
  }
  oneOf<T extends string>(o: Record<string, unknown>, key: string, path: string, options: readonly T[], def?: T): T | undefined {
    const v = o[key];
    if (v === undefined || v === null || v === '') return def;
    if (!options.includes(v as T)) return this.err(path, `Must be one of: ${options.join(', ')}.`);
    return v as T;
  }
  css(o: Record<string, unknown>, key: string, path: string, kind: keyof typeof CSS_FNS): string | undefined {
    const v = o[key];
    if (v === undefined || v === null || v === '') return undefined;
    return safeCssValue(v, kind) ?? this.err(path, kind === 'color' ? 'Not a valid colour.' : `Not an allowed ${kind} value.`);
  }
  obj(v: unknown, path: string): Record<string, unknown> | undefined {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return this.err(path, 'Must be an object.');
    return v as Record<string, unknown>;
  }
  list(v: unknown, path: string, max: number, min = 0): unknown[] | undefined {
    if (!Array.isArray(v)) return this.err(path, 'Must be a list.');
    if (v.length < min) return this.err(path, min === 1 ? 'Needs at least one entry.' : `Needs at least ${min} entries.`);
    if (v.length > max) return this.err(path, `At most ${max} entries.`);
    return v;
  }
}

function checkTransform(c: Checker, raw: unknown, path: string): KeyframeTransform | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const out: KeyframeTransform = {};
  const set = (k: keyof KeyframeTransform, min: number, max: number) => {
    const n = c.num(o, k, `${path}.${k}`, min, max);
    if (n !== undefined) (out as Record<string, number>)[k] = n;
  };
  set('x', -10000, 10000);
  set('y', -10000, 10000);
  set('scale', 0, 100);
  set('scale_x', -100, 100);
  set('scale_y', -100, 100);
  set('rotate', -36000, 36000);
  set('skew_x', -89, 89);
  set('skew_y', -89, 89);
  if (o.axis !== undefined) {
    const a = o.axis;
    if (!Array.isArray(a) || a.length !== 3 || a.some((n) => typeof n !== 'number' || !Number.isFinite(n)) || a.every((n) => n === 0)) {
      c.err(`${path}.axis`, 'Must be three numbers [x, y, z], not all 0.');
    } else out.axis = [a[0], a[1], a[2]];
  }
  return out;
}

/** One keyframe; `allowDraw`: the target is an icon part, group or shape (draw-on). */
export function checkKeyframe(c: Checker, raw: unknown, path: string, allowDraw = false, lenient = false): AnimationKeyframe | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const at = c.num(o, 'at', `${path}.at`, 0, 100);
  if (o.at === undefined) c.err(`${path}.at`, 'Required.');
  const k: AnimationKeyframe = { at: at ?? 0 };
  if (o.transform !== undefined) {
    const t = checkTransform(c, o.transform, `${path}.transform`);
    if (t && Object.keys(t).length) k.transform = t;
  }
  const opacity = c.num(o, 'opacity', `${path}.opacity`, 0, 1);
  if (opacity !== undefined) k.opacity = opacity;
  const color = c.css(o, 'color', `${path}.color`, 'color');
  if (color) k.color = color;
  const background = c.css(o, 'background', `${path}.background`, 'background');
  if (background) k.background = background;
  const shadow = c.css(o, 'shadow', `${path}.shadow`, 'shadow');
  if (shadow) k.shadow = shadow;
  const filter = c.css(o, 'filter', `${path}.filter`, 'filter');
  if (filter) k.filter = filter;
  const blur = c.num(o, 'blur', `${path}.blur`, 0, 200);
  if (blur !== undefined) k.blur = blur;
  const radius = c.num(o, 'radius', `${path}.radius`, 0, 1000);
  if (radius !== undefined) k.radius = radius;
  if (o.easing !== undefined && o.easing !== '') {
    if (validEasing(o.easing)) k.easing = (o.easing as string).trim();
    else c.err(`${path}.easing`, 'Not a valid easing.');
  }
  // v2 fields; lenient (the card): a bad draw / stroke / lane easing is dropped, not reported
  const v2c = lenient ? new Checker() : c;
  const stroke = v2c.css(o, 'stroke', `${path}.stroke`, 'color');
  if (stroke) k.stroke = stroke;
  if (o.draw !== undefined && o.draw !== null && o.draw !== '') {
    if (!allowDraw) v2c.err(`${path}.draw`, 'Draw-on is only for icon parts and shapes.');
    else {
      const draw = v2c.num(o, 'draw', `${path}.draw`, 0, 1);
      if (draw !== undefined) k.draw = draw;
    }
  }
  if (o.easings !== undefined && o.easings !== null) {
    const e = v2c.obj(o.easings, `${path}.easings`);
    const easings: Partial<Record<EasingLaneId, string>> = {};
    for (const [lane, v] of Object.entries(e ?? {})) {
      if (!(EASING_LANE_IDS as readonly string[]).includes(lane)) v2c.err(`${path}.easings.${lane}`, 'Not a timeline lane.');
      else if (!validEasing(v)) v2c.err(`${path}.easings.${lane}`, 'Not a valid easing.');
      else easings[lane as EasingLaneId] = (v as string).trim();
    }
    if (Object.keys(easings).length) k.easings = easings;
  }
  return k;
}

function checkShape(c: Checker, raw: unknown, path: string): ParticleShape | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const keys = (['icon', 'emoji', 'svg'] as const).filter((k) => o[k] !== undefined && o[k] !== '');
  if (keys.length !== 1) return c.err(path, 'Set one of icon, emoji or svg.');
  const k = keys[0];
  const v = o[k];
  if (typeof v !== 'string') return c.err(`${path}.${k}`, 'Must be text.');
  if (k === 'icon') return ICON_RE.test(v.trim()) ? { icon: v.trim() } : c.err(`${path}.icon`, 'Must be an icon id like mdi:star.');
  if (k === 'emoji') {
    const s = v.trim();
    return s && [...s].length <= 8 && !/[<>&"'\\{};]/.test(s) ? { emoji: s } : c.err(`${path}.emoji`, 'Must be up to 8 characters (an emoji or a symbol).');
  }
  if (utf8Bytes(v) > SVG_MAX_BYTES) return c.err(`${path}.svg`, 'The SVG is larger than 32 KB.');
  if (!/<svg[\s>]/i.test(v)) return c.err(`${path}.svg`, 'No <svg> element found.');
  // with a DOM (browser, studio): the sanitiser's own verdict
  if (typeof DOMParser !== 'undefined') {
    const r = sanitizeSvg(v);
    if (r.error) return c.err(`${path}.svg`, r.error);
  }
  return { svg: v };
}

function checkParticleLook(c: Checker, o: Record<string, unknown>, path: string, def: ParticlesSpec): Pick<ParticlesSpec, 'shape' | 'count' | 'size' | 'colors'> {
  const count = c.num(o, 'count', `${path}.count`, 1, ANIMATION_CAPS.particles, def.count, true) ?? def.count;
  let size: [number, number] = [...def.size];
  if (o.size !== undefined) {
    const s = o.size;
    if (typeof s === 'number' && s > 0 && s <= 200) size = [s, s];
    else if (Array.isArray(s) && s.length === 2 && s.every((n) => typeof n === 'number' && n > 0 && n <= 200) && s[0] <= s[1]) size = [s[0], s[1]];
    else c.err(`${path}.size`, 'Must be [min, max] px between 1 and 200, min ≤ max.');
  }
  const colors: string[] = [];
  if (o.colors !== undefined) {
    const list = c.list(o.colors, `${path}.colors`, ANIMATION_CAPS.colors);
    list?.forEach((x, i) => {
      const v = safeCssValue(x, 'color');
      if (v) colors.push(v);
      else c.err(`${path}.colors[${i}]`, 'Not a valid colour.');
    });
  }
  const shape = o.shape !== undefined && o.shape !== null ? checkShape(c, o.shape, `${path}.shape`) : undefined;
  return { ...(shape ? { shape } : {}), count, size, colors };
}

function checkParticles(c: Checker, raw: unknown, path: string, lenient: boolean): ParticlesSpec | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const d = DEFAULT_PARTICLES;
  const out: ParticlesSpec = {
    ...checkParticleLook(c, o, path, d),
    direction: c.oneOf(o, 'direction', `${path}.direction`, PARTICLE_DIRECTIONS, d.direction) ?? d.direction,
    speed: c.num(o, 'speed', `${path}.speed`, 0.1, 10, d.speed) ?? d.speed,
    spin: c.num(o, 'spin', `${path}.spin`, -3600, 3600, d.spin) ?? d.spin,
    fade: c.bool(o, 'fade', `${path}.fade`, d.fade),
    spread: c.num(o, 'spread', `${path}.spread`, 0, 100, d.spread) ?? d.spread,
    gravity: c.num(o, 'gravity', `${path}.gravity`, -1, 1, d.gravity) ?? d.gravity,
    layer: c.oneOf(o, 'layer', `${path}.layer`, ['back', 'front'] as const, d.layer) ?? d.layer,
  };
  if (o.preset !== undefined && o.preset !== '') {
    if (typeof o.preset === 'string' && FX_PRESETS.has(o.preset)) out.preset = o.preset;
    else c.err(`${path}.preset`, 'Must be a particle, ring or scene preset.');
    const n = c.num(o, 'intensity', `${path}.intensity`, -100000, 100000);
    if (n !== undefined) out.intensity = n;
  }
  // v2 `sim`: as stored without the particles validator (the card before its chunk); else checked
  // (strict: errors fail the doc; lenient: the cleaned sim, or none so the v1 fallback plays)
  if (o.sim !== undefined && o.sim !== null && (lenient ? new Checker() : c).obj(o.sim, `${path}.sim`)) {
    if (!animHooks.simValidator) out.sim = o.sim as ParticlesSim;
    else {
      const r = animHooks.simValidator(o.sim, lenient ? 'lenient' : 'strict', { count: out.count, layer: out.layer });
      if (!lenient) c.errors.push(...r.errors);
      if (r.sim && (lenient || !r.errors.length)) out.sim = r.sim;
    }
  }
  return out;
}

/** Checks a raw `particles.sim` (particles-v2 ParticlesModule.validateSim; error paths `particles.sim.*`). */
export type ParticlesValidator = (raw: unknown, mode: 'strict' | 'lenient', spec?: { count: number; layer: 'back' | 'front' }) => { sim?: ParticlesSim; errors: FieldError[] };

// the slot lives in the entry (src/utils/anim-hooks.ts); the name stays available here
export { useParticlesValidator };

/** The document plays a v2 simulation, which only the particles chunk can compile (a preset-based doc ignores `sim`). */
export const docNeedsParticles = (doc: AnimationDoc): boolean => doc.kind === 'particles' && !!doc.particles?.sim && !doc.particles.preset;

function checkPath(c: Checker, raw: unknown, path: string): PathSpec | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  let d = '';
  if (typeof o.d !== 'string' || !o.d.trim()) c.err(`${path}.d`, 'Required.');
  else if (o.d.length > ANIMATION_CAPS.pathLength) c.err(`${path}.d`, `At most ${ANIMATION_CAPS.pathLength} characters.`);
  else if (!PATH_RE.test(o.d) || !/^\s*[Mm]/.test(o.d)) c.err(`${path}.d`, 'Not valid path data (it must start with M).');
  else if (!toCubicSubpaths(o.d).some((s) => s.length)) c.err(`${path}.d`, 'The path draws nothing.');
  else d = o.d.trim().replace(/\s+/g, ' ');
  const out: PathSpec = {
    d,
    units: c.oneOf(o, 'units', `${path}.units`, ['percent', 'px'] as const, 'px') ?? 'px',
    follow_rotation: c.bool(o, 'follow_rotation', `${path}.follow_rotation`, false),
    subject: c.oneOf(o, 'subject', `${path}.subject`, ['element', 'icon', 'particles'] as const, 'element') ?? 'element',
  };
  if (o.particles !== undefined && o.particles !== null) {
    const p = c.obj(o.particles, `${path}.particles`);
    if (p) out.particles = checkParticleLook(c, p, `${path}.particles`, { ...DEFAULT_PARTICLES, count: 3 });
  }
  return out;
}

function checkSteps(c: Checker, raw: unknown, path: string, selfId: string): SequenceStep[] {
  const list = c.list(raw, path, ANIMATION_CAPS.steps, 1);
  if (!list) return [];
  const out: SequenceStep[] = [];
  list.forEach((s, i) => {
    const p = `${path}[${i}]`;
    const o = c.obj(s, p);
    if (!o) return;
    const a = typeof o.animation === 'string' ? o.animation.trim() : '';
    if (!a) c.err(`${p}.animation`, 'Required.');
    else if (isCustomRef(a)) {
      if (customRefId(a) === selfId) c.err(`${p}.animation`, 'A sequence cannot play itself.');
      else if (!ANIMATION_ID_RE.test(customRefId(a))) c.err(`${p}.animation`, 'Not a valid animation id.');
    } else if (!SEQUENCEABLE_PRESETS.has(a)) c.err(`${p}.animation`, 'Must be a motion preset or a custom keyframes / path animation.');
    const step: SequenceStep = {
      animation: a,
      delay: c.num(o, 'delay', `${p}.delay`, 0, 600, 0) ?? 0,
      repeat: c.num(o, 'repeat', `${p}.repeat`, 1, 100, 1, true) ?? 1,
    };
    const dur = c.num(o, 'duration', `${p}.duration`, 0.05, 600);
    if (dur !== undefined) step.duration = dur;
    out.push(step);
  });
  return out;
}

const V2_FIELDS = ['rig', 'tracks', 'clips', 'bindings'] as const;

/** Checks the v2 fields of a raw document (model-v2.ts validateV2, registered when that file loads). */
export type V2Validator = (input: Record<string, unknown>, c: Checker) => Pick<AnimationDoc, 'rig' | 'tracks' | 'clips' | 'bindings'>;
let v2Validator: V2Validator | undefined;

/** Turn on v2 field checking in validateAnimationDoc (model-v2.ts calls this when it loads). */
export function useV2Validator(fn: V2Validator | undefined): void {
  v2Validator = fn;
}

export interface ValidateOptions {
  /**
   * strict (default): any invalid v2 entry fails the document. lenient (card): invalid v2 entries are dropped one by one.
   * Without the v2 validators loaded, v2 fields are kept as stored.
   */
  v2?: 'strict' | 'lenient';
}

/**
 * Check and normalise a stored / imported document. Errors carry field paths
 * (`keyframes[2].transform.rotate`) for the studio and the integration's error replies.
 */
export function validateAnimationDoc(input: unknown, opts: ValidateOptions = {}): ValidationResult {
  const c = new Checker();
  const o = c.obj(input, '');
  if (!o) return { ok: false, errors: c.errors };
  let json: string;
  try {
    json = JSON.stringify(o);
  } catch {
    return { ok: false, errors: [{ path: '', message: 'Not serialisable.' }] };
  }
  if (utf8Bytes(json) > ANIMATION_CAPS.bytes) return { ok: false, errors: [{ path: '', message: `The animation is larger than ${ANIMATION_CAPS.bytes / 1024} KB.` }] };

  const id = typeof o.id === 'string' ? o.id.trim() : '';
  if (!ANIMATION_ID_RE.test(id)) c.err('id', 'Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).');
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  if (!name) c.err('name', 'Required.');
  else if (name.length > ANIMATION_CAPS.name) c.err('name', `At most ${ANIMATION_CAPS.name} characters.`);
  if (o.version !== undefined && o.version !== 1) c.err('version', 'Unsupported version (expected 1).');
  const kind = c.oneOf(o, 'kind', 'kind', ANIMATION_KINDS);
  if (!o.kind) c.err('kind', 'Required.');

  const doc: AnimationDoc = {
    id,
    name,
    kind: kind ?? 'keyframes',
    duration: c.num(o, 'duration', 'duration', 0.05, 600, 1) ?? 1,
    easing: 'ease-in-out',
    iterations: 'infinite',
    target: c.oneOf(o, 'target', 'target', ['element', 'icon'] as const, 'element') ?? 'element',
    origin: 'center',
    version: 1,
  };
  if (o.easing !== undefined && o.easing !== '') {
    if (validEasing(o.easing)) doc.easing = (o.easing as string).trim();
    else c.err('easing', 'Not a valid easing.');
  }
  if (o.iterations !== undefined && o.iterations !== 'infinite') {
    const n = c.num(o, 'iterations', 'iterations', 0.01, 1000);
    if (n !== undefined) doc.iterations = n;
  }
  const direction = c.oneOf(o, 'direction', 'direction', DIRECTIONS);
  if (direction && direction !== 'normal') doc.direction = direction;
  if (Object.prototype.hasOwnProperty.call(o, 'mirror')) {
    if (o.mirror === 'mirror' || o.mirror === 'keep') doc.mirror = o.mirror;
    else c.err('mirror', 'Use mirror or keep.');
  }
  if (o.origin !== undefined && o.origin !== '') {
    if (typeof o.origin === 'string' && ORIGIN_RE.test(o.origin.trim())) doc.origin = o.origin.trim();
    else c.err('origin', 'Use keywords, lengths or percentages, e.g. "50% 100%".');
  }

  switch (kind) {
    case 'keyframes': {
      // a document animating only its tracks (card parts, icon parts) may have no element keyframes
      const tracksOnly = Array.isArray(o.tracks) && o.tracks.length > 0;
      const list =
        o.keyframes === undefined ? (tracksOnly ? [] : c.err('keyframes', 'Required.')) : c.list(o.keyframes, 'keyframes', ANIMATION_CAPS.keyframes, tracksOnly ? 0 : 1);
      const lenient = opts.v2 === 'lenient';
      const frames = (list ?? []).map((k, i) => checkKeyframe(c, k, `keyframes[${i}]`, false, lenient)).filter((k): k is AnimationKeyframe => !!k);
      doc.keyframes = frames.sort((a, b) => a.at - b.at);
      break;
    }
    case 'particles':
      if (o.particles === undefined) c.err('particles', 'Required.');
      else doc.particles = checkParticles(c, o.particles, 'particles', opts.v2 === 'lenient');
      break;
    case 'path':
      if (o.path === undefined) c.err('path', 'Required.');
      else doc.path = checkPath(c, o.path, 'path');
      break;
    case 'sequence': {
      doc.steps = o.steps === undefined ? (c.err('steps', 'Required.'), []) : checkSteps(c, o.steps, 'steps', id);
      doc.loop = c.bool(o, 'loop', 'loop', true);
      const st = o.stagger === undefined || o.stagger === null ? {} : c.obj(o.stagger, 'stagger');
      if (st) doc.stagger = { children: c.bool(st, 'children', 'stagger.children', false), delay: c.num(st, 'delay', 'stagger.delay', 0, 10, 0.1) ?? 0.1 };
      break;
    }
  }
  if (kind) {
    if (!v2Validator) {
      // card bundle without the v2 validators: keep the fields as stored, the runtime chunk checks them
      for (const k of V2_FIELDS) if (o[k] !== undefined && o[k] !== null && (k === 'clips' || kind === 'keyframes')) (doc as unknown as Record<string, unknown>)[k] = o[k];
    } else if (opts.v2 === 'lenient') Object.assign(doc, v2Validator(o, new Checker()));
    else Object.assign(doc, v2Validator(o, c));
  }
  return c.errors.length ? { ok: false, errors: c.errors } : { ok: true, doc, errors: [] };
}

/**
 * A list (or an id-keyed map) of documents (the library, or a card's `custom_animations`): the valid ones by id, plus
 * the errors (path prefixed with the index). Over the cap, the rest is dropped; a repeated id
 * keeps the first.
 */
export function validateAnimationLibrary(input: unknown, opts: ValidateOptions = {}): { docs: Map<string, AnimationDoc>; errors: FieldError[] } {
  const docs = new Map<string, AnimationDoc>();
  const errors: FieldError[] = [];
  // an id-keyed map: an entry without an id takes its key (when that is a valid id)
  const list = Array.isArray(input)
    ? input
    : input && typeof input === 'object'
      ? Object.entries(input as Record<string, unknown>).map(([k, d]) => (d && typeof d === 'object' && !('id' in d) && ANIMATION_ID_RE.test(k) ? { id: k, ...d } : d))
      : [];
  list.forEach((raw, i) => {
    if (docs.size >= ANIMATION_CAPS.docs) {
      if (docs.size === ANIMATION_CAPS.docs && i === ANIMATION_CAPS.docs) errors.push({ path: `[${i}]`, message: `At most ${ANIMATION_CAPS.docs} animations.` });
      return;
    }
    const r = validateAnimationDoc(raw, opts);
    if (!r.ok) {
      errors.push(...r.errors.map((e) => ({ path: `[${i}]${e.path ? `.${e.path}` : ''}`, message: e.message })));
      return;
    }
    if (docs.has(r.doc.id)) errors.push({ path: `[${i}].id`, message: `Duplicate id "${r.doc.id}".` });
    else docs.set(r.doc.id, r.doc);
  });
  return { docs, errors };
}

