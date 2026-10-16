/*
 * Keyframes and particle styles of the animation presets (src/utils/animation-presets.ts).
 * Tokens, replaced per preset by src/css/animations.ts:
 *   $i  the entry's intensity (unitless number; multiply by 1deg / 1px / 1%)
 *   $c  the animation colour (entry colour > design colour > entity colour > theme accent); in
 *       keyframes it is scaled by the entry's Strength, particle layers fade by it as a whole.
 *       The peak of every effect paints the full colour; dimmer is the user's Strength choice.
 * Motion uses the individual transform properties (rotate / translate / scale) so presets of
 * different channels compose on one element. Only transform / opacity / filter / box-shadow are
 * animated, never layout.
 */

/** `@keyframes mc-anim-<key>` bodies; `<id>-icon` is the icon variant of a glow preset. */
export const KEYFRAMES: Record<string, string> = {
  // ── Glow & pulse ──
  breathe: `
    0%, 100% { scale: 1; opacity: 1; }
    50% { scale: calc(1 + $i / 100); opacity: 0.78; }`,
  'glow-pulse': `
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    50% { box-shadow: 0 0 calc($i * 1px) calc($i * 0.19px) $c; }`,
  'glow-pulse-icon': `
    0%, 100% { filter: drop-shadow(0 0 0 transparent); }
    50% { filter: drop-shadow(0 0 calc($i * 0.375px) $c); }`,
  'halo-ripple': `
    0% { box-shadow: 0 0 0 0 $c; }
    100% { box-shadow: 0 0 0 calc($i * 1px) transparent; }`,
  'halo-ripple-icon': `
    0% { filter: drop-shadow(0 0 0 $c); }
    100% { filter: drop-shadow(0 0 calc($i * 0.7px) transparent); }`,
  aura: `
    0%, 100% {
      box-shadow: 0 0 calc($i * 0.42px) calc($i * 0.04px) color-mix(in srgb, $c 60%, transparent),
        inset 0 0 calc($i * 0.42px) color-mix(in srgb, $c 24%, transparent);
    }
    50% {
      box-shadow: 0 0 calc($i * 1px) calc($i * 0.25px) $c,
        inset 0 0 calc($i * 0.75px) color-mix(in srgb, $c 48%, transparent);
    }`,
  'aura-icon': `
    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.125px) color-mix(in srgb, $c 50%, transparent)); }
    50% { filter: drop-shadow(0 0 calc($i * 0.42px) $c); }`,
  heartbeat: `
    0%, 70%, 100% { scale: 1; }
    14% { scale: calc(1 + $i / 100); }
    28% { scale: 1; }
    42% { scale: calc(1 + $i / 150); }`,

  // ── Motion ──
  spin: `
    from { rotate: 0deg; }
    to { rotate: calc($i * 1deg); }`,
  'fast-spin': `
    from { rotate: 0deg; }
    to { rotate: calc($i * 1deg); }`,
  sway: `
    0%, 100% { rotate: calc($i * -1deg); }
    50% { rotate: calc($i * 1deg); }`,
  wobble: `
    0%, 100% { translate: 0 0; rotate: 0deg; }
    15% { translate: calc($i * -1px) 0; rotate: calc($i * -0.66deg); }
    30% { translate: calc($i * 0.83px) 0; rotate: calc($i * 0.5deg); }
    45% { translate: calc($i * -0.66px) 0; rotate: calc($i * -0.33deg); }
    60% { translate: calc($i * 0.33px) 0; rotate: calc($i * 0.17deg); }
    75% { translate: calc($i * -0.17px) 0; rotate: calc($i * -0.08deg); }`,
  'shake-alert': `
    0%, 50%, 100% { translate: 0 0; }
    5%, 15%, 25%, 35%, 45% { translate: calc($i * -1px) 0; }
    10%, 20%, 30%, 40% { translate: calc($i * 1px) 0; }`,
  rumble: `
    0%, 100% { translate: 0 0; }
    25% { translate: calc($i * 1px) calc($i * -1px); }
    50% { translate: calc($i * -1px) calc($i * 1px); }
    75% { translate: calc($i * 1px) calc($i * 1px); }`,
  float: `
    0%, 100% { translate: 0 0; }
    50% { translate: 0 calc($i * -1px); }`,

  // ── Weather & device ──
  'flame-flicker': `
    0%, 100% { scale: 1 1; rotate: 0deg; filter: drop-shadow(0 0 2px $c) brightness(1); }
    25% { scale: calc(1 - $i * 0.004) calc(1 + $i / 100); rotate: calc($i * 0.3deg); filter: drop-shadow(0 -1px 6px $c) brightness(1.15); }
    50% { scale: calc(1 + $i * 0.004) calc(1 - $i * 0.006); rotate: calc($i * -0.2deg); filter: drop-shadow(0 0 3px $c) brightness(0.95); }
    75% { scale: calc(1 - $i * 0.002) calc(1 + $i * 0.008); rotate: calc($i * -0.4deg); filter: drop-shadow(0 -1px 5px $c) brightness(1.1); }`,
  'steam-rise': `
    0% { translate: 0 0; scale: 0.5; opacity: 0; }
    25% { opacity: 1; }
    100% { translate: 0 -100cqh; scale: 1.7; opacity: 0; }`,
  bubbles: `
    0% { translate: 0 0; opacity: 0; }
    10% { opacity: 1; }
    50% { translate: 4px -55cqh; }
    90% { opacity: 0.8; }
    100% { translate: -3px calc(-100cqh - 12px); opacity: 0; }`,
  'snow-fall': `
    0% { translate: 0 0; opacity: 0; }
    10% { opacity: 1; }
    50% { translate: 6px 50cqh; }
    100% { translate: -2px calc(100cqh + 12px); opacity: 0.7; }`,
  'rain-fall': `
    0% { translate: 0 0; opacity: 0; }
    10% { opacity: 1; }
    100% { translate: 0 calc(100cqh + 24px); opacity: 0.6; }`,
  'liquid-wave': `
    from { rotate: 0deg; }
    to { rotate: 360deg; }`,
  'storm-flash': `
    0%, 88%, 100% { opacity: 0; }
    90% { opacity: calc($i / 100); }
    91.5% { opacity: 0.1; }
    93.5% { opacity: calc($i / 125); }
    96% { opacity: 0; }`,

  // ── Light & colour ──
  'shine-sweep': `
    0% { translate: -100% 0; }
    60%, 100% { translate: 100cqw 0; }`,
  blink: `
    0%, 45%, 100% { opacity: 1; }
    50%, 95% { opacity: calc(1 - $i / 100); }`,
  'neon-flicker': `
    0%, 17%, 23%, 26%, 52%, 58%, 100% { opacity: 1; filter: drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1); }
    20%, 25%, 55% { opacity: 0.45; filter: drop-shadow(0 0 0 transparent) brightness(0.8); }
    24% { opacity: 0.8; filter: drop-shadow(0 0 calc($i * 0.4px) $c) brightness(1); }`,
  'rainbow-hue': `
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(calc($i * 1deg)); }`,
  glitch: `
    0%, 86%, 100% { translate: 0 0; filter: none; }
    88% { translate: calc($i * -1px) 0; filter: drop-shadow(calc($i * 0.7px) 0 0 $c) drop-shadow(calc($i * -0.7px) 0 0 color-mix(in srgb, $c 35%, #00e5ff)); }
    90% { translate: calc($i * 1px) calc($i * 0.3px); filter: drop-shadow(calc($i * -0.7px) 0 0 $c) hue-rotate(40deg); }
    92% { translate: calc($i * -0.5px) 0; filter: drop-shadow(calc($i * 0.4px) 0 0 color-mix(in srgb, $c 35%, #ff1744)); }
    94% { translate: 0 0; filter: none; }`,
  'fade-pulse': `
    0%, 100% { opacity: 1; }
    50% { opacity: calc(1 - $i / 100); }`,

  // ── Playful: a short move in the first part of the cycle, then a rest ──
  bounce: `
    0%, 20%, 53%, 100% { translate: 0 0; scale: 1 1; }
    40%, 43% { translate: 0 calc($i * -1px); scale: 0.96 1.06; }
    70% { translate: 0 calc($i * -0.5px); scale: 0.98 1.03; }
    80% { translate: 0 0; scale: 1.04 0.96; }
    90% { translate: 0 calc($i * -0.12px); scale: 1 1; }`,
  jello: `
    0%, 10%, 60%, 100% { scale: 1 1; }
    18% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }
    26% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }
    34% { scale: calc(1 + $i / 200) calc(1 - $i / 200); }
    42% { scale: calc(1 - $i / 400) calc(1 + $i / 400); }
    50% { scale: calc(1 + $i / 800) calc(1 - $i / 800); }`,
  'rubber-band': `
    0%, 55%, 100% { scale: 1 1; }
    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }
    20% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }
    25% { scale: calc(1 + $i / 160) calc(1 - $i / 160); }
    33% { scale: calc(1 - $i / 500) calc(1 + $i / 500); }
    42% { scale: calc(1 + $i / 500) calc(1 - $i / 500); }`,
  tada: `
    0%, 50%, 100% { scale: 1; rotate: 0deg; }
    5%, 10% { scale: 0.9; rotate: calc($i * -1deg); }
    15%, 25%, 35%, 45% { scale: 1.1; rotate: calc($i * 1deg); }
    20%, 30%, 40% { scale: 1.1; rotate: calc($i * -1deg); }`,
  swing: `
    0%, 60%, 100% { rotate: 0deg; }
    12% { rotate: calc($i * 1deg); }
    24% { rotate: calc($i * -0.66deg); }
    36% { rotate: calc($i * 0.33deg); }
    48% { rotate: calc($i * -0.2deg); }`,
  flip: `
    0%, 10% { rotate: y 0deg; }
    60%, 100% { rotate: y calc($i * 1deg); }`,
  pop: `
    0%, 40%, 100% { scale: 1; }
    10% { scale: calc(1 + $i / 100); }
    20% { scale: calc(1 - $i / 400); }
    30% { scale: calc(1 + $i / 600); }`,
  'head-shake': `
    0%, 50%, 100% { translate: 0 0; rotate: 0deg; }
    6.5% { translate: calc($i * -1px) 0; rotate: calc($i * -1deg); }
    18.5% { translate: calc($i * 0.8px) 0; rotate: calc($i * 0.8deg); }
    31.5% { translate: calc($i * -0.5px) 0; rotate: calc($i * -0.5deg); }
    43.5% { translate: calc($i * 0.3px) 0; rotate: calc($i * 0.3deg); }`,
};

/** Particle styles: `.mc-anim-fx[data-fx="<id>"] > i { ... }` (plus extra selectors after a `|`). */
export const FX_STYLES: Record<string, string> = {
  'steam-rise': `
    bottom: -12px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%;
    background: $c; filter: blur(5px);`,
  bubbles: `
    bottom: -10px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%;
    border: 1.5px solid $c;
    background: color-mix(in srgb, $c 22%, transparent);`,
  'bubbles|:nth-child(even)': `width: 5px; height: 5px;`,
  'snow-fall': `
    top: -8px; width: 5px; height: 5px; border-radius: 50%;
    background: $c;`,
  'rain-fall': `
    top: -18px; width: 2px; height: 14px; border-radius: 1px;
    background: linear-gradient(transparent, $c);`,
  'liquid-wave': `
    left: -50%; top: calc(100% - $i * 1%); width: 200%; aspect-ratio: 1; border-radius: 42%;
    background: color-mix(in srgb, $c 50%, transparent); opacity: 1;`,
  'liquid-wave|:nth-child(2)': `
    top: calc(100% - $i * 0.9%); border-radius: 38%;
    background: $c; animation-direction: reverse;`,
  'storm-flash': `inset: 0; background: color-mix(in srgb, $c 35%, rgba(255, 255, 255, 0.55));`,
  'shine-sweep': `
    top: 0; bottom: 0; left: 0; width: 45%; opacity: 1;
    background: linear-gradient(100deg, transparent 0%,
      color-mix(in srgb, var(--mca-shine-sweep-c, #fff) calc($i * 1%), transparent) 50%, transparent 100%);`,
};
