import { css, unsafeCSS } from 'lit';
import { SCENE_KEYFRAMES } from '../css/animation-scenes';

/*
 * Styles of <mc-seasonal>: the particle motions (CSS keyframes only), the particle artwork and the
 * ambient layers. Every particle is a `.p` box centred on (--x, --y) with --s (size), --d / --dl
 * (duration / delay), --c / --c2 (colours), --o (opacity), --dx (drift), --sw (sway), --r (rotation),
 * --wx / --wy (wander). Falling, rising and crossing particles move with `translate` in container
 * units (cqw / cqh of the layer); the inner artwork sways / tumbles / flaps with `transform`.
 * Static (reduced motion) and off-screen (paused) states are host attributes.
 */

/** The existing scene keyframes, reused: the storm flash (at a fixed brightness) and the wind gusts. */
const reuse = (name: string, from: string, intensity: number) =>
  `@keyframes ${name} {${SCENE_KEYFRAMES[from].replace(/\$i/g, String(intensity))}}`;

/** The still composition of reduced motion, every selector under `pre`. */
const still = (pre: string) => `
  ${pre}.p, ${pre}.p *, ${pre}.a { animation: none !important; }
  ${pre}.p { top: var(--y) !important; left: var(--x) !important; translate: none !important; }
  ${pre}.m-fall > *, ${pre}.m-tumble > *, ${pre}.m-blow > * { rotate: var(--r); }
  ${pre}.a-shimmer, ${pre}.a-flash, ${pre}.a-bolt { display: none; }
  ${pre}.m-burst { opacity: calc(var(--o) * 0.7); }
`;

export const seasonalStyles = css`
  :host {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
    overflow: hidden;
    border-radius: inherit;
    contain: layout paint style;
    --mc-sn-mist: color-mix(in srgb, var(--primary-text-color, #3c4043) 22%, transparent);
    --mc-sn-wind: color-mix(in srgb, var(--primary-text-color, #3c4043) 42%, transparent);
    --mc-sn-bat: color-mix(in srgb, var(--primary-text-color, #212121) 58%, #3d2457);
    /* pale blue on light cards, near white on dark ones */
    --mc-sn-snow: color-mix(in srgb, var(--primary-text-color, #212121) 18%, #bcd6f5);
    --mc-sn-snow-edge: color-mix(in srgb, var(--mc-sn-snow) 70%, #4f86c9);
    --mc-sn-cloud: color-mix(in srgb, var(--primary-text-color, #3c4043) 15%, transparent);
    --mc-sn-ghost-violet: color-mix(in srgb, #8466d8 26%, transparent);
    --mc-sn-ghost-green: color-mix(in srgb, #5fbf72 18%, transparent);
  }
  .layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    container-type: size;
  }
  .defs {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* ── Particles ── */
  .p {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--s);
    height: var(--s);
    margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
    color: var(--c);
    opacity: var(--o);
    animation-duration: var(--d);
    animation-delay: var(--dl);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  .p > svg,
  .p > b {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* fall / tumble: from just above the layer to just below it */
  .m-fall,
  .m-tumble,
  .m-rain,
  .m-drizzle {
    top: 0;
    margin-top: calc(var(--s) * -1);
    animation-name: mc-sn-fall;
  }
  @keyframes mc-sn-fall {
    from {
      translate: 0 0;
    }
    to {
      translate: var(--dx) calc(100cqh + var(--s) * 2);
    }
  }
  .m-fall > * {
    animation: mc-sn-sway calc(var(--d) * 0.32) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-sway {
    from {
      transform: translateX(calc(var(--sw) * -1)) rotate(calc(var(--r) - 25deg));
    }
    to {
      transform: translateX(var(--sw)) rotate(calc(var(--r) + 25deg));
    }
  }
  .m-tumble > * {
    animation: mc-sn-tumble calc(var(--d) * 0.42) ease-in-out var(--dl) infinite alternate;
  }
  .k-confetti > * {
    animation-duration: calc(var(--d) * 0.16);
  }
  @keyframes mc-sn-tumble {
    from {
      transform: translateX(calc(var(--sw) * -1)) rotate(var(--r)) rotateX(0deg) rotateY(0deg);
    }
    to {
      transform: translateX(var(--sw)) rotate(calc(var(--r) + 140deg)) rotateX(150deg) rotateY(50deg);
    }
  }

  /* rain: fast slanted streaks; drizzle: a streak now and then */
  .m-rain,
  .m-drizzle {
    width: 2px;
    margin-left: -1px;
    rotate: 12deg;
    animation-name: mc-sn-rain;
  }
  .m-drizzle {
    animation-name: mc-sn-drizzle;
  }
  /* each drop element carries three streaks (density without more elements) */
  .m-rain {
    width: 40px;
    height: calc(var(--s) * 2.2);
    margin-left: -20px;
  }
  .k-raindrop > b {
    --streak: linear-gradient(to bottom, transparent, var(--c));
    background:
      var(--streak) 2px 0 / 1.6px 46% no-repeat,
      var(--streak) 19px 100% / 1.4px 40% no-repeat,
      var(--streak) 35px 38% / 1.8px 48% no-repeat;
  }
  .m-drizzle > b {
    border-radius: 1px;
    background: linear-gradient(to bottom, transparent, var(--c));
  }
  @keyframes mc-sn-rain {
    from {
      translate: 0 0;
    }
    to {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
    }
  }
  @keyframes mc-sn-drizzle {
    0% {
      translate: 0 0;
      opacity: 0;
    }
    1% {
      opacity: var(--o);
    }
    10% {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
      opacity: var(--o);
    }
    10.01%,
    100% {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
      opacity: 0;
    }
  }

  /* rise: from below up through the layer, fading at both ends */
  .m-rise {
    top: 100%;
    margin-top: 0;
    animation-name: mc-sn-rise;
  }
  .m-rise > * {
    animation: mc-sn-sway calc(var(--d) * 0.3) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-rise {
    0% {
      translate: 0 0;
      opacity: 0;
    }
    12%,
    72% {
      opacity: var(--o);
    }
    100% {
      translate: var(--dx) calc(-100cqh - var(--s) * 2);
      opacity: 0;
    }
  }

  /* flutter / firefly: wander around a spot */
  .m-flutter,
  .m-firefly {
    animation-name: mc-sn-wander;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  @keyframes mc-sn-wander {
    0% {
      translate: 0 0;
    }
    25% {
      translate: var(--wx) calc(var(--wy) * -0.6);
    }
    50% {
      translate: calc(var(--wx) * -0.4) calc(var(--wy) * -1);
    }
    75% {
      translate: calc(var(--wx) * -1) calc(var(--wy) * 0.3);
    }
    100% {
      translate: calc(var(--wx) * 0.3) var(--wy);
    }
  }
  .k-butterfly > svg {
    rotate: var(--r);
  }
  .k-butterfly .wings {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    animation: mc-sn-flap 0.3s ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-flap {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0.16);
    }
  }
  .k-mote > b,
  .k-firefly > b {
    border-radius: 50%;
    animation: mc-sn-blink calc(var(--d) * 0.22) ease-in-out var(--dl) infinite alternate;
  }
  .k-mote > b {
    background: radial-gradient(circle, #fffbe6 0 22%, var(--c) 42%, transparent 72%);
  }
  .k-firefly > b {
    background: radial-gradient(
      circle,
      #fffff0 0 13%,
      var(--c) 24%,
      color-mix(in srgb, var(--c) 40%, transparent) 40%,
      transparent 70%
    );
  }
  @keyframes mc-sn-blink {
    from {
      opacity: 0.12;
    }
    to {
      opacity: 1;
    }
  }

  /* fly: bats across the layer (rev: the other way) with a swoop */
  .m-fly {
    left: 0;
    height: calc(var(--s) / 2);
    margin: calc(var(--s) / -4) 0 0 calc(var(--s) * -1);
    animation-name: mc-sn-across;
  }
  .m-fly.rev {
    animation-direction: reverse;
  }
  .m-fly > svg {
    animation: mc-sn-swoop calc(var(--d) * 0.25) ease-in-out var(--dl) infinite alternate;
  }
  .m-fly.rev > svg {
    scale: -1 1;
  }
  @keyframes mc-sn-swoop {
    from {
      transform: translateY(calc(var(--sw) * -1)) rotate(-6deg);
    }
    to {
      transform: translateY(var(--sw)) rotate(6deg);
    }
  }
  .k-bat .wings {
    transform-box: fill-box;
    transform-origin: 50% 72%;
    animation: mc-sn-batflap 0.22s ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-batflap {
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(-0.45);
    }
  }

  /* across: slow crossing (clouds); blow: leaves on the wind */
  .m-across {
    left: 0;
    height: calc(var(--s) * 0.53);
    margin: calc(var(--s) * -0.265) 0 0 calc(var(--s) * -1);
    animation-name: mc-sn-across;
  }
  @keyframes mc-sn-across {
    from {
      translate: 0 0;
    }
    to {
      translate: calc(100cqw + var(--s) * 2) 0;
    }
  }
  .m-blow {
    left: 0;
    margin-left: calc(var(--s) * -1);
    animation-name: mc-sn-blow;
    animation-timing-function: cubic-bezier(0.4, 0.1, 0.7, 0.9);
  }
  .m-blow > * {
    animation: mc-sn-tumble calc(var(--d) * 0.2) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-blow {
    0% {
      translate: 0 0;
    }
    35% {
      translate: 34cqw -14px;
    }
    65% {
      translate: 66cqw 12px;
    }
    100% {
      translate: calc(100cqw + var(--s) * 2) -8px;
    }
  }

  /* gust: wind lines (the Scenes preset's keyframes) */
  .m-gust {
    left: 0;
    height: calc(var(--s) * 0.2);
    margin: calc(var(--s) * -0.1) 0 0 calc(var(--s) * -1);
    opacity: 1;
    animation-name: mc-sn-gust;
  }
  .m-gust > svg {
    opacity: var(--o);
  }
  ${unsafeCSS(reuse('mc-sn-gust', 'wind-lines', 0))}

  /* twinkle: in place */
  .m-twinkle {
    animation-name: mc-sn-twinkle;
    animation-timing-function: ease-in-out;
  }
  .m-twinkle > svg {
    rotate: var(--r);
  }
  @keyframes mc-sn-twinkle {
    0%,
    100% {
      opacity: calc(var(--o) * 0.25);
      scale: 0.55;
    }
    50% {
      opacity: var(--o);
      scale: 1;
    }
  }

  /* burst: fireworks open, hang, fade */
  .m-burst {
    animation-name: mc-sn-burst;
    animation-timing-function: cubic-bezier(0.15, 0.75, 0.35, 1);
  }
  .m-burst > svg {
    filter: drop-shadow(0 0 2.5px color-mix(in srgb, var(--c) 70%, transparent));
  }
  @keyframes mc-sn-burst {
    0% {
      scale: 0.06;
      opacity: 0;
      translate: 0 0;
    }
    4% {
      opacity: 1;
    }
    36% {
      scale: 1;
      opacity: 1;
    }
    56%,
    100% {
      scale: 1.07;
      opacity: 0;
      translate: 0 8px;
    }
  }

  /* bob: eggs rocking in place */
  .m-bob {
    width: calc(var(--s) * 0.8);
    margin-left: calc(var(--s) * -0.4);
    transform-origin: 50% 100%;
    animation-name: mc-sn-bob;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  @keyframes mc-sn-bob {
    from {
      translate: 0 0;
      rotate: calc(var(--r) - 8deg);
    }
    to {
      translate: 0 -5px;
      rotate: calc(var(--r) + 8deg);
    }
  }

  /* drift: fog banks swaying side to side */
  .m-drift {
    height: calc(var(--s) * 0.34);
    margin: calc(var(--s) * -0.17) 0 0 calc(var(--s) * -0.5);
    animation-name: mc-sn-drift;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  .k-fogband > b {
    border-radius: 50%;
    background: radial-gradient(closest-side, var(--c) 0, color-mix(in srgb, var(--c) 55%, transparent) 50%, transparent 100%);
  }
  @keyframes mc-sn-drift {
    from {
      translate: calc(var(--wx) * -1) 0;
    }
    to {
      translate: var(--wx) calc(var(--wy) * -0.3);
    }
  }

  /* ── Artwork ── */
  .k-snowdot > b {
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--mc-sn-snow) 55%, #fff) 0 30%,
      var(--mc-sn-snow) 48%,
      color-mix(in srgb, var(--mc-sn-snow) 35%, transparent) 62%,
      transparent 72%
    );
  }
  .flake path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .flake .edge {
    stroke: var(--mc-sn-snow-edge);
    stroke-width: 2.7;
    fill: var(--mc-sn-snow-edge);
    opacity: 0.35;
  }
  .flake .core {
    stroke: currentColor;
    stroke-width: 1.2;
    fill: currentColor;
  }
  .flake .hub {
    fill: currentColor;
  }

  .leaf .fill {
    fill: currentColor;
  }
  .leaf .shade {
    fill: #000;
    opacity: 0.13;
  }
  .leaf .vein {
    fill: none;
    stroke: rgba(70, 24, 0, 0.42);
    stroke-width: 0.7;
    stroke-linecap: round;
  }
  .leaf .stem {
    stroke: color-mix(in srgb, currentColor 55%, #4a2a10);
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  .petal .fill,
  .blossom .fill {
    fill: currentColor;
    stroke: #e0789f;
    stroke-width: 0.6;
    stroke-opacity: 0.75;
  }
  .petal .light {
    fill: #fff;
    opacity: 0.45;
  }
  .petal .blush {
    fill: #e64980;
    opacity: 0.3;
  }
  .blossom .stamen {
    stroke: #d6336c;
    stroke-width: 0.6;
    opacity: 0.7;
  }
  .blossom .pollen {
    fill: #fcc419;
  }
  .blossom .heart {
    fill: #f06595;
  }

  .butterfly .wing {
    fill: currentColor;
    stroke: #2b2118;
    stroke-width: 0.9;
    stroke-linejoin: round;
  }
  .butterfly .wing-in {
    fill: var(--c2);
    opacity: 0.85;
  }
  .butterfly .dot {
    fill: #fff;
  }
  .butterfly .body {
    fill: #2b2118;
  }
  .butterfly .feeler {
    fill: none;
    stroke: #2b2118;
    stroke-width: 0.7;
    stroke-linecap: round;
  }

  .bat {
    fill: currentColor;
  }
  .bat .eye {
    fill: #ffd43b;
  }

  .heart .fill {
    fill: currentColor;
  }
  .heart.outline .fill {
    fill: color-mix(in srgb, currentColor 18%, transparent);
    stroke: currentColor;
    stroke-width: 2;
  }
  .heart .shine {
    fill: none;
    stroke: #fff;
    stroke-width: 1.2;
    stroke-linecap: round;
    opacity: 0.75;
  }
  .heart.outline .shine {
    display: none;
  }

  .egg .fill {
    fill: currentColor;
  }
  .egg .pat-line {
    fill: none;
    stroke: var(--c2);
    stroke-width: 1.8;
    stroke-linejoin: round;
  }
  .egg .pat-thin {
    fill: none;
    stroke: var(--c2);
    stroke-width: 0.9;
    opacity: 0.7;
  }
  .egg .pat-dot,
  .egg .pat-band {
    fill: var(--c2);
    opacity: 0.85;
  }
  .egg .pat-band2 {
    fill: #fff;
    opacity: 0.75;
  }
  .egg .shade {
    fill: #000;
    opacity: 0.07;
  }
  .egg .shine {
    fill: #fff;
    opacity: 0.6;
  }
  .egg .edge {
    fill: none;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-width: 0.7;
  }

  .firework .bloom {
    fill: currentColor;
    opacity: 0.12;
  }
  .firework .ray {
    fill: currentColor;
  }
  .firework .spark {
    fill: var(--c2);
    stroke: currentColor;
    stroke-width: 0.4;
  }
  .firework .tip {
    fill: var(--c2);
    stroke: currentColor;
    stroke-width: 0.7;
  }
  .firework .core {
    fill: #fff;
    opacity: 0.9;
  }

  .k-confetti > b {
    height: 48%;
    margin-top: 26%;
    border-radius: 1px;
    background: currentColor;
  }
  .k-confetti > b.round {
    width: 66%;
    height: 66%;
    margin: 17%;
    border-radius: 50%;
  }
  .ribbon path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
  }

  .star .glow,
  .sparkle .glow {
    fill: currentColor;
    opacity: 0.22;
  }
  .star .fill {
    fill: currentColor;
    stroke: color-mix(in srgb, currentColor 50%, #8a5a00);
    stroke-width: 0.8;
    stroke-linejoin: round;
  }
  .star .shine {
    stroke: #fff;
    stroke-width: 1;
    stroke-linecap: round;
    opacity: 0.8;
  }
  .sparkle .fill {
    fill: currentColor;
    stroke: color-mix(in srgb, currentColor 55%, #6b5d1f);
    stroke-width: 0.5;
  }
  .sparkle .core {
    fill: #fff;
  }

  .cloud .fill {
    fill: currentColor;
  }
  .cloud .lit {
    fill: #fff;
    opacity: 0.1;
  }
  .windline path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  /* ── Ambient layers ── */
  .a {
    position: absolute;
    pointer-events: none;
  }
  .a-sun {
    top: -110px;
    right: -110px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 228, 140, 0.8) 0,
      rgba(255, 204, 92, 0.42) 20%,
      rgba(255, 183, 77, 0.16) 44%,
      transparent 68%
    );
    animation: mc-sn-breathe 7s ease-in-out infinite alternate;
  }
  .a-rays {
    top: -280px;
    right: -280px;
    width: 680px;
    height: 680px;
    border-radius: 50%;
    background: repeating-conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 206, 96, 0.16) 4deg,
      transparent 9deg 16deg
    );
    -webkit-mask: radial-gradient(closest-side, #000 10%, rgba(0, 0, 0, 0.45) 34%, transparent 66%);
    mask: radial-gradient(closest-side, #000 10%, rgba(0, 0, 0, 0.45) 34%, transparent 66%);
    animation: mc-sn-spin 120s linear infinite;
  }
  .a-shimmer {
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    margin-left: -40%;
    background: linear-gradient(105deg, transparent 15%, rgba(255, 214, 120, 0.12) 50%, transparent 85%);
    animation: mc-sn-sweep 11s ease-in-out infinite;
  }
  .a-dusk {
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(255, 112, 67, 0.4) 0,
      rgba(255, 167, 38, 0.24) 24%,
      rgba(236, 64, 122, 0.12) 50%,
      rgba(126, 87, 194, 0.07) 72%,
      transparent 92%
    );
    animation: mc-sn-glow 12s ease-in-out infinite alternate;
  }
  .a-dusk-sun {
    left: 14%;
    bottom: -70px;
    width: 220px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 214, 140, 0.85), rgba(255, 138, 101, 0.38) 52%, transparent);
    animation: mc-sn-breathe 9s ease-in-out infinite alternate;
  }
  .a-gloom {
    inset: 0;
    background: linear-gradient(to bottom, rgba(38, 50, 72, 0.22), rgba(38, 50, 72, 0.06) 55%, transparent 85%);
  }
  .a-sky {
    inset: 0;
    background: linear-gradient(to bottom, rgba(30, 42, 100, 0.16), rgba(30, 42, 100, 0.04) 60%, transparent 90%);
  }
  /* --mc-sn-flash: none (set by the card on a nested / sibling layer) or [noflash] skip the lightning */
  .a-flash,
  .a-bolt {
    display: var(--mc-sn-flash, block);
  }
  :host([noflash]) .a-flash,
  :host([noflash]) .a-bolt {
    display: none;
  }
  .a-flash {
    inset: 0;
    background: #eef6ff;
    opacity: 0;
    animation: mc-sn-lightning 7s linear infinite;
  }
  .a-bolt {
    left: 64%;
    top: 0;
    width: max(40px, 26cqmin);
    height: 100%;
    translate: -50% 0;
    opacity: 0;
    background: linear-gradient(#fff, #cfe3ff);
    clip-path: polygon(58% 0, 22% 56%, 46% 56%, 32% 100%, 80% 40%, 56% 40%, 72% 0);
    animation: mc-sn-lightning 7s linear infinite;
    animation-delay: -0.02s;
  }
  .a-flash.f2 {
    animation-delay: -3.5s;
  }
  .a-bolt.b2 {
    left: 24%;
    width: max(30px, 18cqmin);
    height: 80%;
    scale: -1 1;
    animation-delay: -3.52s;
  }
  ${unsafeCSS(reuse('mc-sn-lightning', 'lightning', 60))}
  .a-moon {
    top: 12%;
    right: 7%;
    width: 38px;
    height: 38px;
    animation: mc-sn-breathe 8s ease-in-out infinite alternate;
  }
  .a-moon > svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .moon .halo {
    fill: #fff3bf;
    opacity: 0.16;
  }
  .moon .fill {
    fill: #fff4c8;
    stroke: rgba(150, 120, 30, 0.45);
    stroke-width: 0.8;
  }
  .moon .crater {
    fill: rgba(170, 140, 60, 0.25);
  }
  @keyframes mc-sn-breathe {
    from {
      opacity: 0.72;
      scale: 0.96;
    }
    to {
      opacity: 1;
      scale: 1.04;
    }
  }
  @keyframes mc-sn-glow {
    from {
      opacity: 0.75;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes mc-sn-spin {
    to {
      rotate: 360deg;
    }
  }
  @keyframes mc-sn-sweep {
    0% {
      translate: 0 0;
    }
    55%,
    100% {
      translate: calc(100cqw + 100%) 0;
    }
  }

  /* off-screen (shared IntersectionObserver, src/icons/offscreen.ts): nothing moves */
  :host([offscreen]) .p,
  :host([offscreen]) .p *,
  :host([offscreen]) .a {
    animation-play-state: paused !important;
  }
  /* reduced motion: a still composition */
  ${unsafeCSS(still(':host([static]) '))}
  @media (prefers-reduced-motion: reduce) {
    ${unsafeCSS(still(''))}
  }
`;
