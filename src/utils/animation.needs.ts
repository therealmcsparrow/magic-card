/*
 * What magic-card.js needs at run time to decide whether a design wants the `anim` chunk (lazy-module 1.4.0
 * needs(config)). Plain code, no imports (ADR 0043). The config walk (src/utils/config-walk.ts) calls it on every
 * object of the card: the card, rows, columns, modules, `hover`, every `conditional[].design` and the first 32
 * `conditional_appearance` rules, so a design that only plays after a state change still loads the chunk.
 */

/** A design with an animation: a non-empty `animations` list, or the legacy single key `animation_preset` (v0.0.14). */
export const hasAnimations = (node: unknown): boolean => {
  const d = node as { animations?: unknown; animation_preset?: unknown } | null;
  return !!d && typeof d === 'object' && ((Array.isArray(d.animations) && d.animations.length > 0) || (typeof d.animation_preset === 'string' && d.animation_preset.trim() !== ''));
};
