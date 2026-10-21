/*
 * Rings & sweeps and Scenes: keyframes and particle / layer styles. Same tokens as
 * animation-keyframes.ts ($i intensity, $c colour). Particles get --mc-anim-x (%), --mc-anim-phase
 * (0-1, pseudo-random) and --mc-anim-k (index / count, for even spacing) from the card.
 */

import { SHARED_SCENE_KEYFRAMES } from './scene-keyframes';

/** Delay by index instead of phase: evenly spaced rings / orbits / dots. */
const BY_INDEX = 'animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));';

export const SCENE_KEYFRAMES: Record<string, string> = {
  // ── Rings & sweeps ──
  ping: `
    0% { scale: 0.15; opacity: 1; }
    80%, 100% { scale: 1; opacity: 0; }`,
  'ripple-rings': `
    0% { scale: 0.1; opacity: 1; }
    100% { scale: 1; opacity: 0; }`,
  'radar-sweep': `
    from { rotate: 0deg; }
    to { rotate: 360deg; }`,
  'conic-border-spin': `
    from { rotate: 0deg; }
    to { rotate: 360deg; }`,
  'breathing-border': `
    0%, 100% { box-shadow: inset 0 0 0 calc($i * 1px) color-mix(in srgb, $c 30%, transparent), 0 0 0 0 transparent; }
    50% { box-shadow: inset 0 0 0 calc($i * 1px) $c, 0 0 calc($i * 4px) color-mix(in srgb, $c 35%, transparent); }`,
  'breathing-border-icon': `
    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.5px) color-mix(in srgb, $c 40%, transparent)); }
    50% { filter: drop-shadow(0 0 calc($i * 1.5px) $c); }`,

  // ── Scenes ──
  fireflies: `
    0% { translate: 0 0; opacity: 0; }
    20% { opacity: 1; }
    40% { translate: 10px -8px; }
    60% { opacity: 0.3; }
    75% { translate: -6px -14px; opacity: 1; }
    100% { translate: 4px -22px; opacity: 0; }`,
  confetti: `
    0% { translate: 0 0; rotate: 0deg; opacity: 1; }
    25% { translate: 8px 25cqh; rotate: 160deg; }
    50% { translate: -6px 50cqh; rotate: 300deg; }
    75% { translate: 6px 75cqh; rotate: 420deg; }
    100% { translate: 0 calc(100cqh + 14px); rotate: 540deg; opacity: 1; }`,
  'falling-leaves': `
    0% { translate: 0 0; rotate: 0deg; opacity: 0; }
    10% { opacity: 1; }
    30% { translate: 14px 30cqh; rotate: 60deg; }
    55% { translate: -8px 55cqh; rotate: -20deg; }
    80% { translate: 12px 80cqh; rotate: 80deg; }
    100% { translate: 0 calc(100cqh + 16px); rotate: 20deg; opacity: 0.8; }`,
  lightning: SHARED_SCENE_KEYFRAMES.lightning,
  'ocean-waves': `
    from { translate: 0 0; }
    to { translate: -40px 0; }`,
  'sun-rays': `
    from { rotate: 0deg; }
    to { rotate: 360deg; }`,
  'heat-shimmer': `
    0%, 100% { translate: 0 0; filter: blur(0); }
    25% { translate: calc($i * 0.5px) calc($i * -0.5px); filter: blur(calc($i * 0.3px)); }
    50% { translate: calc($i * -0.5px) 0; filter: blur(0); }
    75% { translate: 0 calc($i * 0.5px); filter: blur(calc($i * 0.2px)); }`,
  'wind-lines': SHARED_SCENE_KEYFRAMES['wind-lines'],
  drip: `
    0% { translate: 0 0; scale: 0.4 0.2; opacity: 0; }
    15% { scale: 1 1; opacity: 1; }
    35% { translate: 0 2px; scale: 0.9 1.25; }
    45% { translate: 0 4px; scale: 1 1; }
    100% { translate: 0 calc(100cqh + 12px); scale: 0.9 1.3; opacity: 0.7; }`,
  'equalizer-bars': `
    0% { scale: 1 0.15; }
    30% { scale: 1 0.8; }
    60% { scale: 1 0.35; }
    100% { scale: 1 1; }`,
  'charging-stripes': `
    from { translate: 0 0; }
    to { translate: 28.2843px 0; }`,
  'orbit-dots': `
    from { rotate: 0deg; }
    to { rotate: 360deg; }`,
  'typing-dots': `
    0%, 60%, 100% { translate: 0 0; opacity: 0.35; }
    30% { translate: 0 calc($i * -1px); opacity: 1; }`,
};

/** `.mc-anim-fx[data-fx="<id>"] > i<extra>` for keys "<id>" / "<id>|<extra>". */
export const SCENE_FX_STYLES: Record<string, string> = {
  // ── Rings & sweeps ──
  ping: `
    left: 50%; top: 50%; width: calc($i * 1cqmin); aspect-ratio: 1; translate: -50% -50%;
    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;`,
  'ripple-rings': `
    left: 50%; top: 50%; width: 110cqmin; aspect-ratio: 1; translate: -50% -50%;
    border: 1.5px solid $c; border-radius: 50%; box-sizing: border-box; ${BY_INDEX}`,
  'radar-sweep': `
    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; opacity: 1;
    background: conic-gradient(from 0deg, transparent 0deg calc(360deg - $i * 1deg),
      $c 360deg);`,
  'conic-border-spin': `
    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;
    background: conic-gradient(from 0deg, transparent 0% 55%, $c 80%, transparent 100%);`,

  // ── Scenes ──
  fireflies: `
    top: calc(12% + var(--mc-anim-phase) * 72%); width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;
    background: $c; box-shadow: 0 0 6px 2px $c;`,
  confetti: `top: -10px; width: 6px; height: 10px; border-radius: 1px; background: $c;`,
  'confetti|:nth-child(3n + 2)': `background: color-mix(in srgb, $c 40%, #ffeb3b);`,
  'confetti|:nth-child(3n)': `width: 8px; height: 6px; background: color-mix(in srgb, $c 40%, #e91e63);`,
  'falling-leaves': `
    top: -14px; width: 10px; height: 10px; border-radius: 0 80% 0 80%;
    background: $c;`,
  'falling-leaves|:nth-child(even)': `background: color-mix(in srgb, $c 75%, #7cb342);`,
  lightning: `
    left: 50%; top: 0; width: 32cqmin; height: 100%; translate: -50% 0;
    background: color-mix(in srgb, $c 40%, #fff);
    clip-path: polygon(58% 0, 22% 56%, 46% 56%, 32% 100%, 80% 40%, 56% 40%, 72% 0);`,
  'ocean-waves': `
    left: 0; bottom: 0; width: calc(100% + 40px); height: calc($i * 1%); opacity: 1;
    background: radial-gradient(22px 12px at 20px 0, transparent 98%, color-mix(in srgb, $c 45%, transparent) 100%) 0 0 / 40px 100% repeat-x;`,
  'ocean-waves|:nth-child(2)': `
    height: calc($i * 0.75%); animation-direction: reverse; animation-duration: calc(var(--mc-fx-dur) * 1.5);
    background: radial-gradient(22px 10px at 20px 0, transparent 98%, color-mix(in srgb, $c 70%, transparent) 100%) 0 0 / 40px 100% repeat-x;`,
  'ocean-waves|:nth-child(3)': `
    height: calc($i * 0.5%); animation-duration: calc(var(--mc-fx-dur) * 0.7);
    background: radial-gradient(22px 8px at 20px 0, transparent 98%, $c 100%) 0 0 / 40px 100% repeat-x;`,
  'sun-rays': `
    left: 50%; top: 50%; width: 170cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;
    background: repeating-conic-gradient(from 0deg, $c 0deg calc($i * 1deg),
      transparent calc($i * 1deg) calc($i * 3deg));
    mask: radial-gradient(closest-side, #000 15%, transparent 70%);`,
  'wind-lines': `
    left: -35%; top: calc(10% + var(--mc-anim-phase) * 80%); width: 35%; height: 2px; border-radius: 2px;
    background: linear-gradient(90deg, transparent, $c);`,
  drip: `
    top: -4px; width: 6px; height: 9px; margin-left: -3px; transform-origin: 50% 0;
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; background: $c;`,
  'equalizer-bars': `
    left: calc(10% + var(--mc-anim-k) * 80%); bottom: 0; width: max(3px, 5%); height: 70%; opacity: 1;
    border-radius: 2px 2px 0 0; transform-origin: 50% 100%; background: $c;`,
  'charging-stripes': `
    top: 0; bottom: 0; left: -28.2843px; width: calc(100% + 28.2843px); opacity: 1;
    background: repeating-linear-gradient(-45deg, color-mix(in srgb, $c calc($i * 1%), transparent) 0 10px, transparent 10px 20px);`,
  'orbit-dots': `
    left: 50%; top: calc(50% - 38cqmin); width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; opacity: 1;
    background: $c; transform-origin: 3px calc(3px + 38cqmin); ${BY_INDEX}`,
  'typing-dots': `
    left: calc(50% - 12px + var(--mc-anim-k) * 36px); top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px;
    border-radius: 50%; background: $c;
    animation-delay: calc(var(--mc-fx-delay, 0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur, 1s) * 0.5);`,
};

/** `.mc-anim-fx[data-fx="<id>"]` (the layer itself). */
export const SCENE_LAYER_STYLES: Record<string, string> = {
  // only the ring of the padding shows: a spinning gradient border, over a faint full border
  'conic-border-spin': `
    padding: calc($i * 1px); box-sizing: border-box;
    background: color-mix(in srgb, $c 18%, transparent);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);`,
};
