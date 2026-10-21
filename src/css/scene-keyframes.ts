/**
 * Keyframe bodies the `lightning` and `wind-lines` animation presets share with the seasonal scenes
 * (the storm flash and the wind gusts). $i is the intensity; each user replaces it.
 */
export const SHARED_SCENE_KEYFRAMES = {
  lightning: `
    0%, 89%, 100% { opacity: 0; }
    90% { opacity: calc($i / 100); }
    91.5% { opacity: 0.15; }
    93% { opacity: calc($i / 100); }
    96% { opacity: 0; }`,
  'wind-lines': `
    0% { translate: 0 0; opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 0.8; }
    100% { translate: calc(100cqw + 100%) 0; opacity: 0; }`,
} as const;
