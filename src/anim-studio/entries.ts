import type { AnimationConfig, AnimationDirection, DesignConfig } from '../types';
import { ANIMATION_PRESETS, DEFAULT_STRENGTH, EASINGS, getAnimationPreset, hasStrength, type AnimationPreset } from '../utils/animation-presets';
import { str } from '../utils/safe-css';
import { isCustomRef } from '../utils/custom-ref';

// The entries of a design's `animations` list: reading them (with the legacy single keys), the preset values an entry
// starts from, and the small value readers the resolve shares. Lives in the lazy `anim` chunk with src/anim-studio/resolve.ts.

/** Module types that render an icon hook (`.mc-anim-icon`), so Target = Icon makes sense. */
export const ANIMATION_ICON_MODULES = ['icon', 'button', 'light', 'weather'];

/** Single-animation keys of v0.0.14, read by readAnimations and removed when the list is edited. */
export const LEGACY_ANIMATION_KEYS = [
  'animation_preset',
  'animation_target',
  'animation_speed',
  'animation_trigger',
  'animation_state',
  'animation_color',
] as const;

const LEGACY_SPEEDS: Record<string, number> = { slow: 1.6, normal: 1, fast: 0.6 };
export const DIRECTIONS: AnimationDirection[] = ['normal', 'reverse', 'alternate', 'alternate-reverse'];

// ── values ──

/** Seconds of a CSS time (for scaling legacy speeds). */
export const seconds = (t: string): number => (t.endsWith('ms') ? parseFloat(t) / 1000 : parseFloat(t));

/** An easing id from EASINGS or a raw cubic-bezier() / steps() function. */
export function cssEasing(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  const named = EASINGS.find((e) => e.id === s);
  if (named) return named.css;
  if (/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(s)) return s;
  if (/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(s)) return s;
  return undefined;
}

export function iterations(v: unknown): string | undefined {
  if (v === 'infinite') return 'infinite';
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? String(+n.toFixed(2)) : undefined;
}

export function intensity(p: AnimationPreset, v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) return p.defaults.intensity;
  return Math.min(p.intensity.max, Math.max(p.intensity.min, n));
}

// ── entries ──

/** Strength 0-100 (%), or undefined when not a number. */
export function strength(v: unknown): number | undefined {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : undefined;
}

type PresetFields = Pick<AnimationConfig, 'duration' | 'delay' | 'easing' | 'iterations' | 'direction' | 'intensity' | 'strength'>;

/** The preset's values for the editable fields (Strength only for presets that paint a colour). */
export function presetFields(p: AnimationPreset): PresetFields {
  // a seasonal scene has its own timing: only its density
  if (p.seasonal) return { intensity: p.defaults.intensity };
  const { duration, delay, easing, iterations, direction, intensity } = p.defaults;
  return { duration, delay, easing, iterations, direction, intensity, ...(hasStrength(p) ? { strength: DEFAULT_STRENGTH } : {}) };
}

/** A new entry with the preset's values written out, so the editor shows and edits them. */
/** A new entry; in an icon module (`auto`) its target stays unset, so a rotation spins the icon (spinsIcon). */
export function newAnimation(presetId: string, id: string, auto = false): AnimationConfig {
  const p = getAnimationPreset(presetId) ?? ANIMATION_PRESETS[0];
  return { id, preset: p.id, ...(auto ? {} : { target: 'module' as const }), trigger: p.trigger ?? 'always', ...presetFields(p) };
}

/**
 * Switch preset: every timing / intensity value becomes the new preset's; target, play, state and
 * colour stay (a preset made for taps, Tap ripple / Press, switches Play to On tap).
 */
export function applyPreset(entry: AnimationConfig, presetId: string): AnimationConfig {
  if (isCustomRef(presetId)) return customPreset(entry, presetId);
  const p = getAnimationPreset(presetId);
  if (!p) return { ...entry, preset: presetId };
  const { strength: _drop, ...rest } = entry;
  void _drop;
  // a seasonal scene has its own timing: the old preset's timing goes
  if (p.seasonal) for (const k of ['duration', 'delay', 'easing', 'iterations', 'direction'] as const) delete rest[k];
  else delete rest.decorations;
  return { ...rest, preset: p.id, ...presetFields(p), ...(p.trigger ? { trigger: p.trigger } : {}) };
}

/** Fields a `custom:` entry leaves to its document (its timing, target and amplitude). */
const CUSTOM_DOC_FIELDS = ['duration', 'delay', 'easing', 'iterations', 'direction', 'intensity', 'strength', 'decorations', 'target'] as const;

/**
 * Switch to (or reset) an animation from the library: the document's own values apply, so the entry
 * keeps only play, state and colour. Target is left unset: the document says element or icon.
 */
function customPreset(entry: AnimationConfig, presetId: string): AnimationConfig {
  const next = { ...entry, preset: presetId } as Record<string, unknown>;
  for (const k of CUSTOM_DOC_FIELDS) delete next[k];
  // a tap-only preset switched Play to On tap; a custom animation starts from Always again
  if (next.trigger === 'tap' && getAnimationPreset(entry.preset)?.trigger === 'tap') next.trigger = 'always';
  return next as unknown as AnimationConfig;
}

export const resetToPreset = (entry: AnimationConfig): AnimationConfig => applyPreset(entry, entry.preset);

/**
 * The design's animations. `animations` wins; otherwise the legacy single keys become one entry
 * (id "legacy") with the preset's values, its duration scaled by the old speed.
 */
export function readAnimations(design: DesignConfig | undefined): AnimationConfig[] {
  if (!design) return [];
  if (Array.isArray(design.animations)) {
    return design.animations
      .filter((x): x is AnimationConfig => !!x && typeof x === 'object' && !!str((x as AnimationConfig).preset))
      .map((x, i) => (str(x.id) ? x : { ...x, id: `anim-${i}` }));
  }
  const presetId = str(design.animation_preset);
  if (!presetId) return [];
  const p = getAnimationPreset(presetId);
  const entry: AnimationConfig = { id: 'legacy', preset: presetId };
  if (design.animation_target) entry.target = design.animation_target;
  if (design.animation_trigger) entry.trigger = design.animation_trigger;
  if (design.animation_state) entry.state = design.animation_state;
  if (design.animation_color) entry.color = design.animation_color;
  if (!p) return [entry];
  const fields = presetFields(p);
  const speed = LEGACY_SPEEDS[design.animation_speed || 'normal'] ?? 1;
  return [{ ...entry, ...fields, duration: `${+(seconds(fields.duration!) * speed).toFixed(3)}s` }];
}

/** Design updates for an edited list: the list (or nothing) and the legacy keys removed. */
export function animationsUpdate(list: AnimationConfig[]): Record<string, unknown> {
  const out: Record<string, unknown> = { animations: list.length ? list : undefined };
  for (const k of LEGACY_ANIMATION_KEYS) out[k] = undefined;
  return out;
}

export const onIcon = (e: AnimationConfig, allowIcon: boolean) => allowIcon && e.target === 'icon';
/**
 * In an icon module an entry without a target that rotates plays on the icon: the module's wrapper is as wide as its
 * column, so turning it swings a left-aligned icon round the wrapper's centre.
 */
export const spinsIcon = (e: AnimationConfig, p: AnimationPreset | undefined) => !e.target && !!p?.channels.includes('rotate');
/** The entry plays on the button label (rows and columns have none: their entries play on the module). */
export const onLabel = (e: AnimationConfig, allowIcon: boolean) => allowIcon && e.target === 'label';
