import { getAnimationPreset, type AnimationPreset } from '../../utils/animation-presets';
import { entityColorCss, parseEntityColor } from '../../utils/entity-color';
import { sanitizeSvg } from '../../icons/svg-sanitize';
import { ANIMATION_CAPS, DEFAULT_PARTICLES, safeCssValue, type AnimationDoc, type ParticleDirection, type ParticleShape, type ParticlesSpec } from '../model';

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
