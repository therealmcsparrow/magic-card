// Batch 6 presets: motion, light, borders, background scenes and interaction. Same tokens as
// animation-keyframes.ts ($i intensity, $c colour); particles get --mc-anim-x / -phase / -k.

export const EXTRA_KEYFRAMES: Record<string, string> = {
  // ── Motion ──
  pendulum: `
    from { rotate: calc($i * -1deg); }
    to { rotate: calc($i * 1deg); }`,
  orbit: `
    0%, 100% { translate: calc($i * 1px) 0; }
    12.5% { translate: calc($i * 0.707px) calc($i * 0.707px); }
    25% { translate: 0 calc($i * 1px); }
    37.5% { translate: calc($i * -0.707px) calc($i * 0.707px); }
    50% { translate: calc($i * -1px) 0; }
    62.5% { translate: calc($i * -0.707px) calc($i * -0.707px); }
    75% { translate: 0 calc($i * -1px); }
    87.5% { translate: calc($i * 0.707px) calc($i * -0.707px); }`,
  'coin-spin': `
    from { rotate: y 0deg; }
    to { rotate: y calc($i * 1deg); }`,
  'rotate-3d': `
    from { rotate: 1 1 0 calc($i * -1deg); }
    to { rotate: 1 1 0 calc($i * 1deg); }`,
  'squash-stretch': `
    0%, 100% { scale: 1 1; translate: 0 0; }
    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); translate: 0 0; }
    45% { scale: calc(1 - $i / 200) calc(1 + $i / 150); translate: 0 calc($i * -0.8px); }
    70% { scale: 1 1; translate: 0 calc($i * -0.4px); }
    85% { scale: calc(1 + $i / 160) calc(1 - $i / 160); translate: 0 0; }`,
  wiggle: `
    0%, 40%, 100% { rotate: 0deg; }
    5% { rotate: calc($i * 1deg); }
    10% { rotate: calc($i * -1deg); }
    15% { rotate: calc($i * 0.8deg); }
    20% { rotate: calc($i * -0.6deg); }
    25% { rotate: calc($i * 0.4deg); }
    30% { rotate: calc($i * -0.2deg); }`,
  'shadow-lift': `
    0%, 100% { translate: 0 0; box-shadow: 0 1px 2px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2)); }
    50% { translate: 0 calc($i * -1px); box-shadow: 0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3)); }`,
  'shadow-lift-icon': `
    0%, 100% { translate: 0 0; filter: drop-shadow(0 1px 1px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2))); }
    50% { translate: 0 calc($i * -1px); filter: drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3))); }`,

  // ── Light & colour ──
  'holographic-shimmer': `
    from { translate: 0 0; filter: hue-rotate(0deg); }
    to { translate: -50% 0; filter: hue-rotate(360deg); }`,
  scanline: `
    from { translate: 0 -100%; }
    to { translate: 0 100cqh; }`,
  twinkle: `
    0%, 100% { scale: 0; rotate: 0deg; opacity: 0; }
    50% { scale: 1; rotate: 90deg; opacity: 1; }`,
  spotlight: `
    0%, 100% { translate: -30cqw -10cqh; }
    33% { translate: 25cqw 15cqh; }
    66% { translate: 10cqw -20cqh; }`,

  // ── Borders ──
  'neon-border': `
    0%, 100% {
      box-shadow: 0 0 0 1px $c, 0 0 calc($i * 0.6px) color-mix(in srgb, $c 70%, transparent),
        inset 0 0 calc($i * 0.5px) color-mix(in srgb, $c 45%, transparent);
    }
    50% {
      box-shadow: 0 0 0 1.5px $c, 0 0 calc($i * 1.4px) $c,
        inset 0 0 calc($i * 0.9px) color-mix(in srgb, $c 60%, transparent);
    }`,
  'neon-border-icon': `
    0%, 100% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.3px) color-mix(in srgb, $c 70%, transparent)); }
    50% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.7px) $c); }`,

  // ── Backgrounds ──
  'color-cycle-bg': `
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(360deg); }`,
  aurora: `
    0%, 100% { translate: -12% 0; rotate: -8deg; scale: 1 1; opacity: calc($i / 100); }
    50% { translate: 12% 6%; rotate: 6deg; scale: 1.15 0.85; opacity: calc($i / 160); }`,
  'lava-lamp': `
    0% { translate: 0 0; scale: 1 1; opacity: 0.9; }
    50% { translate: 6px -45cqh; scale: 1.25 0.85; }
    100% { translate: -4px -85cqh; scale: 0.85 1.15; opacity: 0.9; }`,
  'plasma-gradient': `
    0% { rotate: 0deg; scale: 1; }
    50% { rotate: 180deg; scale: 1.25; }
    100% { rotate: 360deg; scale: 1; }`,
  'gradient-flow': `
    from { translate: 0 0; }
    to { translate: -66.667% 0; }`,
  starfield: `
    0%, 100% { opacity: 0.15; scale: 0.6; }
    50% { opacity: 1; scale: 1; }`,
  'meteor-shower': `
    0% { translate: 0 0; opacity: 0; }
    6% { opacity: 1; }
    40%, 100% { translate: -60cqw 60cqh; opacity: 0; }`,
  bokeh: `
    0% { translate: 0 0; scale: 0.8; opacity: 0.15; }
    50% { opacity: 0.55; }
    100% { translate: 10px -16px; scale: 1.15; opacity: 0.25; }`,
  'matrix-rain': `
    0% { translate: 0 -100%; opacity: 0; }
    10% { opacity: 1; }
    100% { translate: 0 calc(100cqh + 100%); opacity: 0.6; }`,
  smoke: `
    0% { translate: 0 0; scale: 0.4; opacity: 0; }
    20% { opacity: 0.5; }
    100% { translate: 18px -90cqh; scale: 2.6; opacity: 0; }`,
  'clouds-drift': `
    from { translate: 0 0; opacity: 0.9; }
    to { translate: calc(100cqw + 100%) 0; opacity: 0.9; }`,
  'water-ripple': `
    0% { scale: 0.05; opacity: 0.9; }
    100% { scale: 1; opacity: 0; }`,
  fireworks: `
    0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1); opacity: 1; }
    70% { opacity: 1; }
    100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(0.3); opacity: 0; }`,

  // ── Interaction ──
  'tap-ripple': `
    0% { scale: 0; opacity: calc($i / 100); }
    100% { scale: 1; opacity: 0; }`,
  press: `
    0%, 100% { scale: 1; }
    40% { scale: calc(1 - $i / 100); }`,
};

/** `.mc-anim-fx[data-fx="<id>"] > i<extra>` for keys "<id>" / "<id>|<extra>". */
export const EXTRA_FX_STYLES: Record<string, string> = {
  // ── Light & colour ──
  // a 4x wide layer of two 2x tiles slides one tile to the left (was background-position: a repaint per frame)
  'holographic-shimmer': `
    left: 0; top: 0; width: 400%; height: 100%; opacity: calc($i / 100);
    background: linear-gradient(115deg, transparent 20%, color-mix(in srgb, $c 55%, #ff80ab) 35%,
      color-mix(in srgb, $c 55%, #80d8ff) 50%, color-mix(in srgb, $c 55%, #ccff90) 65%, transparent 80%) 0 0 / 50% 100% repeat-x;`,
  scanline: `
    left: 0; top: 0; width: 100%; height: 14%; opacity: calc($i / 100);
    background: linear-gradient(transparent, color-mix(in srgb, $c 45%, transparent) 70%, $c 96%, transparent);`,
  twinkle: `
    top: calc(8% + var(--mc-anim-phase) * 80%); width: 10px; height: 10px; margin: -5px 0 0 -5px; background: $c;
    clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);`,
  spotlight: `
    left: 50%; top: 50%; width: 70cqmin; aspect-ratio: 1; margin: -35cqmin 0 0 -35cqmin; opacity: calc($i / 100);
    border-radius: 50%; background: radial-gradient(circle, $c, transparent 65%);`,

  // ── Backgrounds ──
  'color-cycle-bg': `left: 0; top: 0; width: 100%; height: 100%; opacity: calc($i / 100); background: $c;`,
  // soft bands of overlapping elliptical gradients (no blur filter: it was redrawn every frame)
  aurora: `
    left: -25%; top: calc(-10% + var(--mc-anim-k) * 40%); width: 150%; height: 55%;
    background: radial-gradient(ellipse 30% 50% at 32% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent),
      radial-gradient(ellipse 30% 50% at 62% 50%, color-mix(in srgb, $c 50%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 50%, #00e5ff) 45%, transparent) 45%, transparent);`,
  'aurora|:nth-child(2)': `
    animation-duration: calc(var(--mc-fx-dur) * 1.4); animation-direction: reverse;
    background: radial-gradient(ellipse 30% 50% at 37% 50%, color-mix(in srgb, $c 50%, #76ff03), color-mix(in srgb, color-mix(in srgb, $c 50%, #76ff03) 45%, transparent) 45%, transparent),
      radial-gradient(ellipse 30% 50% at 68% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent);`,
  'aurora|:nth-child(3)': `
    animation-duration: calc(var(--mc-fx-dur) * 0.8);
    background: radial-gradient(ellipse 38% 50% at 42% 50%, color-mix(in srgb, $c 50%, #e040fb), color-mix(in srgb, color-mix(in srgb, $c 50%, #e040fb) 45%, transparent) 45%, transparent);`,
  'lava-lamp': `
    bottom: -12%; width: calc(14cqmin + var(--mc-anim-phase) * 16cqmin); aspect-ratio: 1; margin-left: -10cqmin; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, color-mix(in srgb, $c 55%, #fff), $c 70%); filter: blur(2px);`,
  // soft falloff in the gradients themselves (no blur filter over a card-sized rotating layer)
  'plasma-gradient': `
    left: 50%; top: 50%; width: 160cqmax; aspect-ratio: 1; margin: -80cqmax 0 0 -80cqmax; opacity: calc($i / 100);
    background: radial-gradient(circle at 30% 30%, $c, color-mix(in srgb, $c 55%, transparent) 22%, color-mix(in srgb, $c 15%, transparent) 38%, transparent 52%),
      radial-gradient(circle at 70% 40%, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 15%, transparent) 38%, transparent 52%),
      radial-gradient(circle at 45% 75%, color-mix(in srgb, $c 40%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 15%, transparent) 38%, transparent 52%);`,
  // a 3x wide layer slides two widths (was background-position: a repaint per frame)
  'gradient-flow': `
    left: 0; top: 0; width: 300%; height: 100%; opacity: calc($i / 100);
    background: linear-gradient(110deg, $c, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, $c 40%, #00e5ff), $c);`,
  starfield: `
    top: calc(6% + var(--mc-anim-phase) * 86%); width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; border-radius: 50%;
    background: $c; box-shadow: 0 0 4px 1px color-mix(in srgb, $c 60%, transparent);`,
  'starfield|:nth-child(3n)': `width: 2px; height: 2px;`,
  'meteor-shower': `
    top: calc(-10% + var(--mc-anim-phase) * 30%); left: calc(30% + var(--mc-anim-x) * 0.8); width: 22%; height: 2px;
    rotate: -45deg; transform-origin: 0 50%; border-radius: 2px; background: linear-gradient(90deg, $c, transparent);`,
  bokeh: `
    top: calc(10% + var(--mc-anim-phase) * 75%); width: calc(10cqmin + var(--mc-anim-k) * 18cqmin); aspect-ratio: 1;
    margin: -10cqmin 0 0 -10cqmin; border-radius: 50%; filter: blur(1px);
    background: radial-gradient(circle, color-mix(in srgb, $c 70%, transparent), color-mix(in srgb, $c 25%, transparent) 60%, transparent 72%);`,
  'matrix-rain': `
    top: 0; width: 2px; height: calc(20% + var(--mc-anim-phase) * 25%); border-radius: 1px;
    background: linear-gradient(transparent, color-mix(in srgb, $c 60%, transparent) 70%, $c);`,
  'matrix-rain|:nth-child(odd)': `
    width: 3px; background: repeating-linear-gradient(transparent 0 3px, $c 3px 6px);
    -webkit-mask: linear-gradient(transparent, #000); mask: linear-gradient(transparent, #000);`,
  smoke: `
    bottom: -20px; width: 26px; height: 26px; margin-left: -13px; border-radius: 50%;
    background: color-mix(in srgb, $c 70%, #9e9e9e); filter: blur(8px);`,
  'clouds-drift': `
    left: -40%; top: calc(5% + var(--mc-anim-phase) * 55%); width: 38%; aspect-ratio: 2.4; filter: blur(1.5px);
    background: radial-gradient(ellipse 35% 45% at 30% 60%, $c 60%, transparent 62%),
      radial-gradient(ellipse 30% 55% at 55% 45%, $c 60%, transparent 62%),
      radial-gradient(ellipse 28% 40% at 75% 62%, $c 60%, transparent 62%);`,
  'water-ripple': `
    top: calc(25% + var(--mc-anim-phase) * 50%); width: 60cqmin; aspect-ratio: 2.2; margin: -13.6cqmin 0 0 -30cqmin;
    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;
    box-shadow: 0 0 0 3px color-mix(in srgb, $c 25%, transparent);`,
  fireworks: `
    left: 50%; top: 45%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;
    background: $c; box-shadow: 0 0 6px 1px $c; animation-delay: var(--mc-fx-delay, 0s);`,
  'fireworks|:nth-child(even)': `background: color-mix(in srgb, $c 50%, #ffeb3b); box-shadow: 0 0 6px 1px color-mix(in srgb, $c 50%, #ffeb3b);`,

  // ── Interaction ──
  'tap-ripple': `
    left: var(--mc-tap-x, 50%); top: var(--mc-tap-y, 50%); width: 290cqmax; aspect-ratio: 1; margin: -145cqmax 0 0 -145cqmax;
    border-radius: 50%; background: radial-gradient(circle, $c 0, color-mix(in srgb, $c 55%, transparent) 40%, transparent 70%);`,
};
