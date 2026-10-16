import { getAnimationPreset, type AnimationPreset } from '../../utils/animation-presets';
import { entityColorCss, parseEntityColor } from '../../utils/entity-color';
import { sanitizeSvg } from '../../icons/svg-sanitize';
import { ANIMATION_CAPS, DEFAULT_PARTICLES, PARTICLE_DIRECTIONS, safeCssValue, type AnimationDoc, type ParticleDirection, type ParticleShape, type ParticlesSpec } from '../model';
import {
  BUILTIN_SHAPES,
  DEFAULT_GEOMETRY,
  FALLBACK_DIRECTION,
  PARTICLES_ENGINE,
  PARTICLES_V2_CAPS,
  type BuiltinShape,
  type ParticleColliders,
  type ParticleFlow,
  type ParticleMode,
  type ParticlesModule,
  type ParticlesSim,
  type ParticlesSpecV2,
  type Range,
  type SubEmitter,
  type WeightedShape,
} from '../../contracts/particles-v2';
import { buildColliders, hasColliders } from '../../particles/colliders';

/*
 * Pure helpers of the particle designer (particles-editor.ts): the shape source, colour values
 * (entity colour <-> stored CSS), patches that keep a document valid, and "Convert to custom
 * particles" for a document based on a built-in fx preset.
 */

export type ShapeSource = 'dot' | 'icon' | 'emoji' | 'svg';
export const SHAPE_SOURCES: Array<{ id: ShapeSource; label: string; icon: string }> = [
  { id: 'dot', label: 'Dot', icon: 'mdi:circle-medium' },
  { id: 'icon', label: 'Icon', icon: 'mdi:star-outline' },
  { id: 'emoji', label: 'Emoji', icon: 'mdi:emoticon-outline' },
  { id: 'svg', label: 'SVG', icon: 'mdi:svg' },
];

export const shapeSource = (shape: ParticleShape | undefined): ShapeSource =>
  !shape ? 'dot' : 'icon' in shape ? 'icon' : 'emoji' in shape ? 'emoji' : 'svg';

/** A small set of common particle emoji (the field takes any up to 8 characters). */
export const COMMON_EMOJI = ['❤️', '💖', '⭐', '✨', '❄️', '💧', '🔥', '🍂', '🌸', '🎉', '🎈', '🫧', '☁️', '⚡', '🌙', '🦋'];

/** A starter for "Own SVG": a five-pointed star. */
export const STARTER_SVG = '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>';

/** What each source starts with when the document has nothing of it yet. */
export const SHAPE_DEFAULTS: Record<Exclude<ShapeSource, 'dot'>, ParticleShape> = {
  icon: { icon: 'mdi:star' },
  emoji: { emoji: '✨' },
  svg: { svg: STARTER_SVG },
};

export const DIRECTION_LABELS: Record<ParticleDirection, string> = {
  fall: 'Fall',
  rise: 'Rise',
  drift: 'Drift',
  burst: 'Burst',
  orbit: 'Orbit',
  spiral: 'Spiral',
};

/** What Spread means for a direction (a width across, or a radius). */
export const spreadLabel = (d: ParticleDirection): string => (d === 'fall' || d === 'rise' ? 'Spread across' : d === 'drift' ? 'Spread down' : 'Radius');

const ICON_RE = /^[a-z0-9_-]+:[a-z0-9_-]+$/i;
export const validIcon = (v: string): boolean => ICON_RE.test(v.trim());

/** An emoji field value the model accepts (up to 8 characters, no markup characters). */
export function emojiError(v: string): string | undefined {
  const s = v.trim();
  if (!s) return 'Enter an emoji or a symbol.';
  if ([...s].length > 8) return 'Use up to 8 characters.';
  if (/[<>&"'\\{};]/.test(s)) return 'These characters are not allowed: < > & " \' \\ { } ;';
  return undefined;
}

/** The sanitiser's verdict on an own SVG (undefined when it can be used). */
export function svgError(v: string): string | undefined {
  if (!v.trim()) return 'Paste the markup of an <svg>.';
  if (!/<svg[\s>]/i.test(v)) return 'No <svg> element found.';
  const r = sanitizeSvg(v);
  if (r.error) return r.error;
  if (!r.paths.length && !r.strokes.length && !r.accentPaths.length) return 'The SVG draws nothing.';
  return undefined;
}

// ── colours ──

/** The stored CSS of an entity colour (`var(--mc-entity-color, currentColor)`, or mixed down). */
const ENTITY_FULL = entityColorCss('entity')!;
const ENTITY_MIX_RE = /^color-mix\(in srgb, var\(--mc-entity-color, currentColor\) (\d+(?:\.\d+)?)%, transparent\)$/;

/** A colour picker value as the document stores it: `entity` / `entity N%` become CSS. Undefined: not allowed. */
export function toDocColor(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (parseEntityColor(v)) return entityColorCss(v);
  return safeCssValue(v, 'color');
}

/** A stored colour as the colour picker shows it (the entity colour back to `entity` / `entity N%`). */
export function fromDocColor(css: string): string {
  if (css === ENTITY_FULL) return 'entity';
  const m = ENTITY_MIX_RE.exec(css);
  return m ? `entity ${m[1]}%` : css;
}

export const isEntityDocColor = (css: string): boolean => fromDocColor(css).startsWith('entity');

// ── patches ──

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));
const round = (n: number, step: number): number => +(Math.round(n / step) * step).toFixed(4);

/** Field limits (the model's validation ranges), with the step the fields use. */
export const LIMITS = {
  count: { min: 1, max: ANIMATION_CAPS.particles, step: 1 },
  speed: { min: 0.1, max: 10, step: 0.1 },
  size: { min: 1, max: 200, step: 1 },
  spin: { min: -3600, max: 3600, step: 15 },
  spread: { min: 0, max: 100, step: 5 },
  gravity: { min: -1, max: 1, step: 0.1 },
} as const;

/** A number for `key` within its limits (count whole); undefined when not a number. */
export function limitNumber(key: keyof typeof LIMITS, raw: unknown): number | undefined {
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? parseFloat(raw) : NaN;
  if (!Number.isFinite(n)) return undefined;
  const l = LIMITS[key];
  const v = clamp(n, l.min, l.max);
  return key === 'count' ? Math.round(v) : key === 'gravity' || key === 'speed' ? round(v, 0.01) : +v.toFixed(2);
}

/** The size range after editing one end: the other end follows so min ≤ max. */
export function sizeRange(size: [number, number], end: 0 | 1, value: number): [number, number] {
  const v = clamp(value, LIMITS.size.min, LIMITS.size.max);
  return end === 0 ? [v, Math.max(v, size[1])] : [Math.min(size[0], v), v];
}

/** A copy of the document with `patch` applied to its particles (never mutates `doc`). */
export function patchParticles(doc: AnimationDoc, patch: Partial<ParticlesSpec>): AnimationDoc {
  const p = { ...(doc.particles ?? DEFAULT_PARTICLES), ...patch };
  for (const k of Object.keys(p) as Array<keyof ParticlesSpec>) if (p[k] === undefined) delete p[k];
  return { ...doc, particles: p };
}

/** A copy with the shape set (undefined: a dot). */
export function withShape(doc: AnimationDoc, shape: ParticleShape | undefined): AnimationDoc {
  const next = patchParticles(doc, {});
  if (shape) next.particles!.shape = shape;
  else delete next.particles!.shape;
  return next;
}

// ── preset-based documents ──

/** The preset of a document based on one (particles.preset), when it exists. */
export const basePreset = (doc: AnimationDoc): AnimationPreset | undefined => (doc.particles?.preset ? getAnimationPreset(doc.particles.preset) : undefined);

/** What a preset's kind of layer is called (for the preset view's chip). */
export function presetKind(p: AnimationPreset): string {
  if (p.ring) return 'Ring preset';
  if (p.seasonal) return 'Seasonal scene';
  return p.particles === 'count' ? 'Particle preset' : 'Scene preset';
}

/** The closest custom look of the built-in particle presets (the rest fall back to dots that fall). */
const PRESET_LOOKS: Record<string, Partial<ParticlesSpec>> = {
  'snow-fall': { direction: 'fall', size: [4, 8], colors: ['#ffffff'], spin: 0 },
  'rain-fall': { direction: 'fall', size: [2, 4], speed: 2, colors: ['#90caf9'], gravity: 0.6, fade: false },
  bubbles: { direction: 'rise', size: [6, 14], colors: [] },
  'steam-rise': { direction: 'rise', size: [10, 18], spread: 60 },
  confetti: { direction: 'fall', size: [5, 9], spin: 360, colors: ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ec4899'] },
  'falling-leaves': { direction: 'fall', shape: { icon: 'mdi:leaf' }, size: [10, 16], spin: 180, colors: ['#f97316', '#eab308', '#a16207'] },
  fireflies: { direction: 'drift', size: [3, 6], colors: ['#fde047'] },
  twinkle: { direction: 'drift', shape: { emoji: '✨' }, size: [8, 14], layer: 'front', speed: 0.5 },
  'orbit-dots': { direction: 'orbit', size: [6, 8], spread: 70, fade: false },
  starfield: { direction: 'fall', size: [2, 4], colors: ['#ffffff'], speed: 1.5 },
  'meteor-shower': { direction: 'fall', size: [3, 5], gravity: 0.6, colors: ['#ffffff'] },
  bokeh: { direction: 'drift', size: [16, 32], speed: 0.4 },
  smoke: { direction: 'rise', size: [16, 28], spread: 70, speed: 0.6 },
  'clouds-drift': { direction: 'drift', shape: { icon: 'mdi:cloud' }, size: [24, 40], colors: ['#ffffff'], speed: 0.3 },
  fireworks: { direction: 'burst', size: [4, 6], spread: 80, colors: ['#ef4444', '#eab308', '#3b82f6'] },
  'ripple-rings': { direction: 'burst', size: [8, 12], spread: 90 },
  'water-ripple': { direction: 'burst', size: [8, 12], spread: 90 },
  'wind-lines': { direction: 'drift', size: [3, 5], speed: 1.5 },
  drip: { direction: 'fall', size: [4, 7], gravity: 0.8, colors: ['#4fc3f7'] },
};

/**
 * "Convert to custom particles": the document without its preset, its particles set to the
 * closest custom look of that preset (count from the preset's particle count). Timing, colour
 * and everything outside `particles` stay.
 */
export function convertPresetParticles(doc: AnimationDoc): AnimationDoc {
  const p = doc.particles ?? DEFAULT_PARTICLES;
  const preset = basePreset(doc);
  const look = (preset && PRESET_LOOKS[preset.id]) ?? {};
  const n = preset?.particles === 'count' ? (p.intensity ?? preset.defaults.intensity) : undefined;
  const count = n !== undefined && Number.isFinite(n) ? clamp(Math.round(n), 1, ANIMATION_CAPS.particles) : DEFAULT_PARTICLES.count;
  const { preset: _preset, intensity: _intensity, ...rest } = p;
  void _preset;
  void _intensity;
  const out: ParticlesSpec = { ...DEFAULT_PARTICLES, ...rest, ...look, count, size: [...(look.size ?? rest.size ?? DEFAULT_PARTICLES.size)] as [number, number], colors: [...(look.colors ?? rest.colors ?? [])] };
  if (!out.shape) delete out.shape;
  return { ...doc, particles: out };
}

/** The intensity a preset-based document plays (its own, else the preset's default). */
export const presetIntensity = (doc: AnimationDoc, p: AnimationPreset): number => doc.particles?.intensity ?? p.defaults.intensity;

/** A copy with the preset's intensity set (undefined: the preset's default), clamped to its range. */
export function withPresetIntensity(doc: AnimationDoc, p: AnimationPreset, value: number | undefined): AnimationDoc {
  if (value === undefined || !Number.isFinite(value)) return patchParticles(doc, { intensity: undefined });
  return patchParticles(doc, { intensity: clamp(value, p.intensity.min, p.intensity.max) });
}

/** A short summary of a custom particles document ("12 dots fall, 6-12 px"). */
export function particlesSummary(p: ParticlesSpec): string {
  const what = !p.shape ? (p.count === 1 ? 'dot' : 'dots') : 'icon' in p.shape ? (p.count === 1 ? 'icon' : 'icons') : 'emoji' in p.shape ? p.shape.emoji : p.count === 1 ? 'shape' : 'shapes';
  const size = p.size[0] === p.size[1] ? `${p.size[0]} px` : `${p.size[0]}–${p.size[1]} px`;
  return `${p.count} ${what} · ${DIRECTION_LABELS[p.direction].toLowerCase()} · ${size}`;
}

// ── particles v2 (contract src/contracts/particles-v2.ts) ──

/*
 * The editor shows every document as a v2 simulation: a 2026.10.03 (v1) document is read through
 * simFromV1 and opens unchanged as a Baked loop. An edit a v1 document can hold (a v1 flow, one
 * icon / emoji / SVG / dot, one spin value, gravity straight down or up) still writes the v1
 * fields only. The first edit it can't hold adds `sim` (mode baked, the editor's seed) and from
 * then on the v1 fields are kept as the fallback an older card plays (direction, shape, gravity,
 * spin). Count, size, colours, fade, spread, layer and the loop speed stay shared v1 fields.
 */

/** All 13 flows in the order of the flow grid. */
export const FLOWS: ParticleFlow[] = ['fall', 'rise', 'drift', 'burst', 'orbit', 'spiral', 'fountain', 'explode', 'wave', 'vortex', 'zigzag', 'rain', 'wander'];

export const FLOW_LABELS: Record<ParticleFlow, string> = {
  ...DIRECTION_LABELS,
  fountain: 'Fountain',
  explode: 'Explode and fall',
  wave: 'Wave',
  vortex: 'Swirl',
  zigzag: 'Zigzag',
  rain: 'Rain',
  wander: 'Fireflies',
};

const V1_FLOWS = new Set<string>(PARTICLE_DIRECTIONS);
const isV1Flow = (f: ParticleFlow): f is ParticleDirection => V1_FLOWS.has(f);
/** Flows whose spread is a radius around the centre. */
const RADIAL = new Set<ParticleFlow>(['burst', 'orbit', 'spiral', 'explode', 'vortex']);

/** What Spread means for a flow. */
export const flowSpreadLabel = (f: ParticleFlow): string => (RADIAL.has(f) ? 'Radius' : f === 'drift' || f === 'wave' || f === 'wander' ? 'Spread down' : 'Spread across');

export type ShapeKind = BuiltinShape | Exclude<ShapeSource, 'dot'>;
/** The 11 tiles of the shape grid (built-ins first; Streak is the contract's `line`). */
export const SHAPE_KINDS: Array<{ id: ShapeKind; label: string; icon?: string }> = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'star', label: 'Star' },
  { id: 'heart', label: 'Heart' },
  { id: 'ring', label: 'Ring' },
  { id: 'line', label: 'Streak' },
  { id: 'spark', label: 'Spark' },
  { id: 'icon', label: 'Icon', icon: 'mdi:star-outline' },
  { id: 'emoji', label: 'Emoji', icon: 'mdi:emoticon-outline' },
  { id: 'svg', label: 'SVG', icon: 'mdi:svg' },
];
const BUILTIN = new Set<string>(BUILTIN_SHAPES);
export const isBuiltinKind = (k: ShapeKind): k is BuiltinShape => BUILTIN.has(k);
export const shapeKind = (s: WeightedShape['shape']): ShapeKind => ('builtin' in s ? s.builtin : (shapeSource(s) as Exclude<ShapeSource, 'dot'>));
export const shapeLabel = (s: WeightedShape['shape']): string => SHAPE_KINDS.find((k) => k.id === shapeKind(s))?.label ?? 'Shape';

/** Shapes per mix in the editor (the contract allows PARTICLES_V2_CAPS.shapes). */
export const MAX_SHAPES = Math.min(4, PARTICLES_V2_CAPS.shapes);

/**
 * The 0-1 sliders of Physics and what 1 means in contract units: gravity and turbulence in % per
 * s^2, drag in 1/s. Turbulence writes a fixed feature size.
 */
export const PHYSICS_SCALE = { gravity: 200, drag: 3, turbulence: 150 } as const;
export const TURBULENCE_SCALE = 25;

/** Limits of the v2 number fields (spin in deg per loop, speed in % per s, times in s, opacity in %). */
export const V2_LIMITS = {
  pspeed: { min: 0, max: 500, step: 5 },
  spin: { min: -3600, max: 3600, step: 15 },
  delay: { min: 0, max: 60, step: 0.1 },
  lifetime: { min: 0.1, max: 60, step: 0.1 },
  opacity: { min: 0, max: 100, step: 5 },
  seed: { min: 0, max: 0xffffffff, step: 1 },
  weight: { min: 1, max: 10, step: 1 },
  childCount: { min: 1, max: PARTICLES_V2_CAPS.childrenPerParent, step: 1 },
  childSize: { min: 1, max: 200, step: 1 },
  childLife: { min: 0.1, max: 10, step: 0.1 },
  angle: { min: 0, max: 359, step: 1 },
  wind: { min: -60, max: 60, step: 5 },
  unit: { min: 0, max: 1, step: 0.05 },
} as const;
export type V2LimitKey = keyof typeof V2_LIMITS;
const WHOLE = new Set<V2LimitKey>(['seed', 'weight', 'childCount', 'childSize', 'angle', 'opacity', 'spin', 'wind']);

/** A number for a v2 field within its limits (whole where the field is); undefined when not a number. Angles wrap. */
export function limitV2(key: V2LimitKey, raw: unknown): number | undefined {
  let n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? parseFloat(raw) : NaN;
  if (!Number.isFinite(n)) return undefined;
  if (key === 'angle') n = ((Math.round(n) % 360) + 360) % 360;
  const l = V2_LIMITS[key];
  const v = clamp(n, l.min, l.max);
  return WHOLE.has(key) ? Math.round(v) : round(v, 0.01);
}

/** A From > To pair is swapped, not refused. */
export const orderRange = (r: Range): Range => (r[0] > r[1] ? [r[1], r[0]] : [r[0], r[1]]);

/** s of one loop (doc.duration / speed), as the bake uses it. */
export const periodOf = (doc: AnimationDoc): number => doc.duration / (doc.particles?.speed || 1);

/** A new uint32 seed, never the previous one. */
export function newSeed(prev?: number, rand: () => number = Math.random): number {
  for (let i = 0; i < 8; i++) {
    const s = Math.floor(rand() * 0x100000000) >>> 0;
    if (s !== prev) return s;
  }
  return ((prev ?? 0) + 1) >>> 0;
}

const r2 = (n: number): number => +n.toFixed(2);

/** The simulation a v1 document plays as (what the editor shows it as; the first v2 edit writes it). */
export function simFromV1(doc: AnimationDoc, seed: number): ParticlesSim {
  const p = doc.particles ?? DEFAULT_PARTICLES;
  const period = periodOf(doc);
  const base = r2((RADIAL.has(p.direction) ? Math.max(10, p.spread) : 100) / period);
  const spin = r2(p.spin / period);
  return {
    engine: PARTICLES_ENGINE,
    mode: 'baked',
    seed: seed >>> 0,
    flow: p.direction,
    shapes: p.shape ? [{ shape: p.shape, weight: 1 }] : [],
    ranges: { speed: [base, base], spin: [spin, spin], delay: [0, r2(period)], lifetime: [r2(period), r2(period)], opacity: [1, 1] },
    physics: {
      gravity: { angle: p.gravity < 0 ? 180 : 0, strength: r2(Math.abs(p.gravity) * PHYSICS_SCALE.gravity) },
      drag: 0,
      turbulence: { strength: 0, scale: TURBULENCE_SCALE },
      bounce: 0.5,
    },
    colliders: { floor: false, ceiling: false, left: false, right: false, content: 'none' },
  };
}

/** The simulation the editor shows: the stored one, else the v1 document read as one. */
export const viewSim = (doc: AnimationDoc, seed: number): ParticlesSim => doc.particles?.sim ?? simFromV1(doc, seed);

/** The document stores `sim` (a v2 document). */
export const isV2 = (doc: AnimationDoc): boolean => !!doc.particles?.sim;

/** The vertical share of a gravity as the v1 -1..1 value (down positive). */
function v1Gravity(g: ParticlesSim['physics']['gravity']): number {
  const v = (g.strength / PHYSICS_SCALE.gravity) * Math.cos((g.angle * Math.PI) / 180);
  return clamp(Math.round(v * 100) / 100, -1, 1) || 0;
}

/** A copy with `sim` stored and the v1 fallback fields that follow it (FALLBACK_DIRECTION, first own shape, gravity, spin). */
export function withSim(doc: AnimationDoc, sim: ParticlesSim): AnimationDoc {
  const own = sim.shapes.find((s) => !('builtin' in s.shape))?.shape as ParticleShape | undefined;
  const spin = clamp(Math.round(sim.ranges.spin[1] * periodOf(doc)), LIMITS.spin.min, LIMITS.spin.max);
  const next = patchParticles(doc, { sim, direction: FALLBACK_DIRECTION[sim.flow], gravity: v1Gravity(sim.physics.gravity), spin });
  if (own) next.particles!.shape = own;
  else delete next.particles!.shape;
  return next;
}

/** A v2-only edit: `fn` gets the shown simulation (a v1 document's with `seed`) and its result is stored. */
export const editSim = (doc: AnimationDoc, seed: number, fn: (sim: ParticlesSim) => ParticlesSim): AnimationDoc => withSim(doc, fn(viewSim(doc, seed)));

export function setFlow(doc: AnimationDoc, seed: number, flow: ParticleFlow): AnimationDoc {
  if (!isV2(doc) && isV1Flow(flow)) return patchParticles(doc, { direction: flow });
  return editSim(doc, seed, (s) => ({ ...s, flow }));
}

/** The shape mix as chips (an empty mix is one Circle chip). */
export const shownShapes = (sim: ParticlesSim): WeightedShape[] => (sim.shapes.length ? sim.shapes : [{ shape: { builtin: 'circle' }, weight: 1 }]);

/** A new shape mix. One dot (Circle) or one icon / emoji / SVG on a v1 document stays v1 `shape`. */
export function setShapes(doc: AnimationDoc, seed: number, shapes: WeightedShape[]): AnimationDoc {
  const one = shapes.length === 1 ? shapes[0].shape : undefined;
  if (!isV2(doc) && (!shapes.length || (one && (!('builtin' in one) || one.builtin === 'circle')))) {
    return withShape(doc, one && !('builtin' in one) ? one : undefined);
  }
  return editSim(doc, seed, (s) => ({ ...s, shapes: shapes.map((w) => ({ shape: w.shape, weight: w.weight })) }));
}

/** Spin From / To in deg per loop (one value on a v1 document stays v1 `spin`). */
export function setSpin(doc: AnimationDoc, seed: number, perLoop: Range): AnimationDoc {
  const r = orderRange(perLoop);
  if (!isV2(doc) && r[0] === r[1]) return patchParticles(doc, { spin: r[0] });
  const period = periodOf(doc);
  return editSim(doc, seed, (s) => ({ ...s, ranges: { ...s.ranges, spin: [r2(r[0] / period), r2(r[1] / period)] } }));
}

/** Spin in deg per loop, as the fields show it. */
export function spinPerLoop(doc: AnimationDoc, sim: ParticlesSim): Range {
  if (!isV2(doc)) {
    const s = doc.particles?.spin ?? 0;
    return [s, s];
  }
  const period = periodOf(doc);
  return [Math.round(sim.ranges.spin[0] * period), Math.round(sim.ranges.spin[1] * period)];
}

/** Gravity from the 0-1 slider and a direction (0 down, 90 left, 180 up, 270 right). Straight down or up stays v1 `gravity`. */
export function setGravity(doc: AnimationDoc, seed: number, angle: number, unit: number): AnimationDoc {
  const u = r2(clamp(unit, 0, 1));
  if (!isV2(doc) && (angle === 0 || (angle === 180 && u > 0))) return patchParticles(doc, { gravity: angle === 180 ? -u : u });
  return editSim(doc, seed, (s) => ({ ...s, physics: { ...s.physics, gravity: { angle, strength: r2(u * PHYSICS_SCALE.gravity) } } }));
}

/** Mode Baked loop / Live simulation (Baked on a v1 document changes nothing). */
export function setMode(doc: AnimationDoc, seed: number, mode: ParticleMode): AnimationDoc {
  if (viewSim(doc, seed).mode === mode) return doc;
  return editSim(doc, seed, (s) => ({ ...s, mode }));
}

/** Shuffle: a new seed (and with it new random paths). */
export const shuffleSeed = (doc: AnimationDoc, seed: number, rand?: () => number): AnimationDoc => editSim(doc, seed, (s) => ({ ...s, seed: newSeed(s.seed, rand) }));

/** "About 75% of particles": the share of chip `i`, rounded to 5 %. */
export function shapeShare(shapes: WeightedShape[], i: number): number {
  const sum = shapes.reduce((a, s) => a + s.weight, 0);
  return sum > 0 ? Math.round(((shapes[i]?.weight ?? 0) / sum) * 20) * 5 : 0;
}

/** The built-in shape "Add shape" offers next (one not in the mix yet). */
export function nextShape(shapes: WeightedShape[]): WeightedShape['shape'] {
  const used = new Set(shapes.map((s) => shapeKind(s.shape)));
  const b = (['star', 'heart', 'circle', 'spark', 'square', 'triangle', 'ring', 'line'] as BuiltinShape[]).find((k) => !used.has(k)) ?? 'circle';
  return { builtin: b };
}

/** Rain's "Wind angle" (deg, -60 left to 60 right) as read from the gravity direction (0 down, 270 right). */
export function windOf(angle: number): number {
  const a = angle > 180 ? angle - 360 : angle;
  return clamp(-a, V2_LIMITS.wind.min, V2_LIMITS.wind.max) || 0;
}

/**
 * Wind angle for Rain (Lead ruling: particles-v2 1.0.0 has no wind field, so it writes the gravity
 * direction and rain falls slanted). Without gravity it also sets half strength, else nothing would slant.
 */
export function setWind(doc: AnimationDoc, seed: number, wind: number): AnimationDoc {
  const g = viewSim(doc, seed).physics.gravity;
  const w = clamp(Math.round(wind), V2_LIMITS.wind.min, V2_LIMITS.wind.max);
  const unit = g.strength > 0 ? g.strength / PHYSICS_SCALE.gravity : 0.5;
  return setGravity(doc, seed, (360 - w) % 360, unit);
}

/** Some collider is on (the simulator's own test; the content box counts as measured). */
export const anyCollider = (c: ParticleColliders): boolean => hasColliders(buildColliders(c, { aspect: 1, content: { x: 0, y: 0, w: 100, h: 100 } }, 100, 100));

/** "Spawn child particles" turned on: sparks that burst out where they spawn. */
export function defaultChildren(sim: ParticlesSim): SubEmitter {
  return {
    trigger: anyCollider(sim.colliders) ? 'collision' : 'death',
    count: 6,
    shapes: [{ shape: { builtin: 'spark' }, weight: 1 }],
    size: [2, 4],
    colors: [],
    ranges: { speed: [30, 60], lifetime: [0.6, 0.6], opacity: [1, 1], spin: [0, 0] },
    cone: 360,
    inherit: 0.2,
  };
}

// ── summaries ──

export const COMPASS: Array<{ angle: number; name: string; icon: string }> = [
  { angle: 0, name: 'down', icon: 'mdi:arrow-down' },
  { angle: 45, name: 'down-left', icon: 'mdi:arrow-bottom-left' },
  { angle: 90, name: 'left', icon: 'mdi:arrow-left' },
  { angle: 135, name: 'up-left', icon: 'mdi:arrow-top-left' },
  { angle: 180, name: 'up', icon: 'mdi:arrow-up' },
  { angle: 225, name: 'up-right', icon: 'mdi:arrow-top-right' },
  { angle: 270, name: 'right', icon: 'mdi:arrow-right' },
  { angle: 315, name: 'down-right', icon: 'mdi:arrow-bottom-right' },
];
export const compassName = (angle: number): string => COMPASS.find((c) => c.angle === angle)?.name ?? `at ${angle}°`;

const fmt = (n: number): string => String(+n.toFixed(2));
const span = (r: Range, unit = ''): string => (r[0] === r[1] ? `${fmt(r[0])}${unit}` : `${fmt(r[0])} to ${fmt(r[1])}${unit}`);

export function variationSummary(doc: AnimationDoc, sim: ParticlesSim): string {
  return `Seed ${sim.seed} · spin ${span(spinPerLoop(doc, sim), '°')}`;
}

export function physicsSummary(sim: ParticlesSim): string {
  const { gravity, drag, turbulence } = sim.physics;
  const g = gravity.strength / PHYSICS_SCALE.gravity;
  const parts = [g > 0 ? `Gravity ${g.toFixed(1)} ${compassName(gravity.angle)}` : 'No gravity'];
  if (drag > 0) parts.push(`drag ${fmt(drag / PHYSICS_SCALE.drag)}`);
  if (turbulence.strength > 0) parts.push(`turbulence ${fmt(turbulence.strength / PHYSICS_SCALE.turbulence)}`);
  return parts.join(', ');
}

export type ColliderId = Exclude<keyof ParticleColliders, 'content'> | 'content';
export const COLLIDERS: Array<{ id: ColliderId; label: string }> = [
  { id: 'floor', label: 'Floor' },
  { id: 'ceiling', label: 'Ceiling' },
  { id: 'left', label: 'Left edge' },
  { id: 'right', label: 'Right edge' },
  { id: 'content', label: 'Content box' },
];
export const colliderOn = (c: ParticleColliders, id: ColliderId): boolean => (id === 'content' ? c.content !== 'none' : c[id]);

export function collisionsSummary(sim: ParticlesSim): string {
  const on = COLLIDERS.filter((k) => colliderOn(sim.colliders, k.id)).map((k) => k.label);
  return on.length ? `${on.join(', ')}, bounce ${fmt(sim.physics.bounce)}` : 'Off';
}

const triggerText = (s: SubEmitter): string => (s.trigger === 'collision' ? 'on collision' : s.trigger === 'death' ? 'at end of life' : `after ${fmt(s.at ?? 0)} s`);

export function childrenSummary(sim: ParticlesSim): string {
  const c = sim.children;
  if (!c) return 'Off';
  const first = c.shapes[0]?.shape ?? { builtin: 'circle' as const };
  const k = shapeKind(first);
  const one = k === 'svg' ? 'SVG shape' : k === 'emoji' ? 'emoji' : shapeLabel(first).toLowerCase();
  const many = k === 'svg' ? 'SVG shapes' : k === 'emoji' ? 'emoji' : `${one}s`;
  return `${c.count} ${c.count === 1 ? one : many} ${triggerText(c)}`;
}

// ── the particles module in the studio ──

let studioParticles: ParticlesModule | undefined;

/**
 * The studio registers the particles module (src/particles/index.ts) here once it exists (T2.3):
 * the editor then shows bake stats, runs Live in its preview and offers the animated SVG export.
 * Without it the preview plays the v1 fallback.
 */
export function useStudioParticles(m: ParticlesModule | undefined): void {
  studioParticles = m;
}
export const getStudioParticles = (): ParticlesModule | undefined => studioParticles;

/** The v2 spec a document bakes as (a v1 document read as one); undefined for a preset-based or non-particles document. */
export function bakeSpec(doc: AnimationDoc, seed = 0): ParticlesSpecV2 | undefined {
  const p = doc.kind === 'particles' ? doc.particles : undefined;
  if (!p || p.preset) return undefined;
  return { ...p, sim: p.sim ?? simFromV1(doc, seed) };
}

/** The animated SVG export of a particles document: its baked loop (Live documents export their bake, P2-6). */
export function bakedParticlesSvg(doc: AnimationDoc): { svg: string; warnings: string[] } {
  const m = studioParticles;
  if (!m) return { svg: '', warnings: ['The particle engine is not loaded yet.'] };
  const spec = bakeSpec(doc);
  if (!spec) return { svg: '', warnings: ['Convert the preset to custom particles to export it.'] };
  const loop = m.bake({ spec, period: periodOf(doc), geometry: DEFAULT_GEOMETRY });
  const warnings: string[] = [];
  if (spec.sim.mode === 'live') warnings.push('Live simulation exports as its baked loop.');
  if (loop.stats.capped) warnings.push('The loop hit the size limit, so the file shows fewer particles.');
  const w = 200;
  return { svg: m.bakedSvg(loop, { width: w, height: Math.round(w / DEFAULT_GEOMETRY.aspect) }), warnings };
}
