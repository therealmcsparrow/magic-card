/*
 * What magic-card.js needs at run time to decide whether a config wants the seasonal chunk (lazy-module 1.4.0
 * needs(config)), so the card entry need not carry the animation preset table (ADR 0043; plan S1a.3 step 1). Plain data,
 * no imports. tests/seasonal-needs-drift.test.ts compares it with the preset table.
 */

/** Ids of the animation presets that draw a seasonal scene: every scene name that has a preset, plus `weather` and `daynight`. */
export const SEASONAL_PRESET_IDS: readonly string[] = [
  'winter', 'spring', 'summer', 'autumn', 'christmas', 'new_year', 'valentine', 'easter', 'halloween',
  'weather', 'daynight',
  'snow', 'rain', 'storm', 'sun', 'clouds', 'fog', 'wind', 'night', 'dusk',
];
