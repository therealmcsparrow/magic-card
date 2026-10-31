// Whether a design wants the `anim` chunk (needs(config)). Plain code, no imports; the config
// walk calls it on every object, including `hover`, conditional designs and appearance rules.

/** A design with an animation: a non-empty `animations` list, or the legacy single key `animation_preset` (v0.0.14). */
export const hasAnimations = (node: unknown): boolean => {
  const d = node as { animations?: unknown; animation_preset?: unknown } | null;
  return !!d && typeof d === 'object' && ((Array.isArray(d.animations) && d.animations.length > 0) || (typeof d.animation_preset === 'string' && d.animation_preset.trim() !== ''));
};
