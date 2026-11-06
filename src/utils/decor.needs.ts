// Whether a design wants the `decor` chunk (needs(config)). Plain code, no imports; the config
// walk calls it on every object of the card.

/** Ids of the animation presets drawn as a ring along the outline (the `ring` field of the preset table). */
export const RING_PRESET_IDS: readonly string[] = ['border-snake', 'power-flow', 'marching-ants'];

/**
 * A design with a ring, an outline shape or a value background, or an animation whose preset is a ring preset (an
 * entry of `animations`, or the legacy single key `animation_preset`).
 */
export const wantsDecor = (node: unknown): boolean => {
  const d = node as { ring?: unknown; shape?: unknown; value_background?: unknown; animations?: unknown; animation_preset?: unknown } | null;
  if (!d || typeof d !== 'object') return false;
  if ((d.ring && typeof d.ring === 'object') || (typeof d.shape === 'string' && d.shape !== '') || (d.value_background && typeof d.value_background === 'object')) return true;
  if (typeof d.animation_preset === 'string' && RING_PRESET_IDS.includes(d.animation_preset.trim())) return true;
  return Array.isArray(d.animations) && d.animations.some((a) => typeof (a as { preset?: unknown } | null)?.preset === 'string' && RING_PRESET_IDS.includes((a as { preset: string }).preset));
};
