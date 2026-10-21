/*
 * What magic-card.js needs at run time to decide whether a design wants the `decor` chunk (lazy-module 1.4.0
 * needs(config)). Plain code, no imports. The config walk (src/utils/config-walk.ts) calls it on every object of the
 * card: the card, rows, columns, modules, `hover`, every `conditional[].design` and the first 32 `conditional_appearance`
 * rules. tests/decor-chunk.test.ts compares the preset list with the preset table.
 */

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
