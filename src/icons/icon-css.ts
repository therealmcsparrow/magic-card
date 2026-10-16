import { css } from 'lit';

/**
 * <mc-svg-icon> base styles: sized like <ha-icon> (`--mdc-icon-size`), so module CSS that sizes
 * icons keeps working. Effects animate transform / opacity / filter only; reduced motion stops them
 * and keeps the state (fill level, colours).
 */
export const iconBaseStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--mdc-icon-size, 24px);
    height: var(--mdc-icon-size, 24px);
    vertical-align: middle;
    line-height: 0;
  }
  svg[part='svg'] {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  /* Like ha-svg-icon: HA's icon colour variables first, then the module's colour. */
  .primary {
    fill: var(--icon-primary-color, currentColor);
  }
  .secondary {
    fill: var(--icon-secondary-color, currentColor);
    opacity: var(--icon-secondary-opactity, 0.5);
  }
  /* Fallback icons inherit the host's --mdc-icon-size (the host is sized by it too). */
  ha-icon,
  ha-state-icon {
    display: inline-flex;
  }
  ha-state-icon[hidden] {
    display: none;
  }
  .secondary.duo {
    opacity: 1;
  }
  /*
   * Own SVG: painted styles (gradient, value, duotone, empty colour) paint the filled shapes (mc-f) and
   * the strokes (mc-s) apart, so stroke icons keep their outline; mc-accent parts take the second
   * colour when one is set.
   */
  .own.painted .mc-f {
    fill: var(--mc-own-fill);
  }
  .own.painted .mc-s {
    stroke: var(--mc-own-stroke);
  }
  .own.accented .mc-accent.mc-f,
  .own.accented .mc-accent .mc-f {
    fill: var(--mc-icon-accent);
  }
  .own.accented .mc-accent.mc-s,
  .own.accented .mc-accent .mc-s {
    stroke: var(--mc-icon-accent);
  }
  .body.dim {
    opacity: 0.5;
  }
  /* Liquid fill: the level moves with a transform, the wave scrolls by one period per cycle. */
  .liquid {
    transition: transform 0.8s ease-in-out;
  }
  .wave {
    animation: mc-icon-wave 2.4s linear infinite;
  }
  @keyframes mc-icon-wave {
    to {
      transform: translateX(var(--mc-wave-dx, -24px));
    }
  }

  /*
   * Device animations. Spin / shake / pulse / drum move the whole <svg> (a compositable transform
   * around its box centre); the others animate a group around a pivot on the viewBox, set inline in
   * user units. Filters stay still: glow breathes the opacity of a blurred copy, flame's shadow sits
   * on a still wrapper.
   */
  .dev {
    transform-box: view-box;
    animation-duration: var(--mc-icon-speed, 1.5s);
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  .dev-spin {
    animation-name: mc-icon-spin;
    animation-timing-function: linear;
  }
  .glow-copy {
    fill: var(--mc-icon-glow-color, currentColor);
    opacity: calc(0.7 * var(--mc-icon-intensity, 1));
    animation: mc-icon-glow var(--mc-icon-speed, 2.4s) ease-in-out infinite;
  }
  .flame-glow {
    filter: drop-shadow(0 0 1px var(--mc-icon-glow-color, #ff6d00));
  }
  .dev-flame {
    animation-name: mc-icon-flame;
  }
  .dev-drum {
    animation-name: mc-icon-drum;
  }
  .dev-swing {
    animation-name: mc-icon-swing;
  }
  .dev-swing.dev-static {
    animation: none;
    transform: scaleX(calc(1 - 0.3 * var(--mc-icon-intensity, 1))) skewY(calc(-12deg * var(--mc-icon-intensity, 1)));
  }
  .dev-shake {
    animation-name: mc-icon-shake;
    animation-timing-function: linear;
  }
  .dev-pulse {
    animation-name: mc-icon-pulse;
  }
  .dev-eq {
    animation-name: mc-icon-eq;
  }
  .ring {
    fill: none;
    stroke: var(--mc-icon-glow-color, currentColor);
    transform-box: fill-box;
    transform-origin: center;
    opacity: 0.5;
    animation: mc-icon-ring var(--mc-icon-speed, 1.5s) ease-out infinite;
  }
  .snow circle {
    fill: var(--mc-icon-glow-color, var(--state-climate-cool-color, #2196f3));
    stroke: var(--card-background-color, #fff);
    stroke-width: 0.6px;
    opacity: 0.85;
    animation: mc-icon-snow var(--mc-icon-speed, 2.4s) linear infinite;
  }
  @keyframes mc-icon-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes mc-icon-glow {
    0%, 100% { opacity: calc(0.4 * var(--mc-icon-intensity, 1)); }
    50% { opacity: var(--mc-icon-intensity, 1); }
  }
  @keyframes mc-icon-flame {
    0%, 100% { transform: scale(1, 1); }
    20% { transform: scale(1.02, 0.94); }
    45% { transform: scale(0.98, 1.05); }
    70% { transform: scale(1.01, 0.97); }
    85% { transform: scale(0.99, 1.03); }
  }
  @keyframes mc-icon-drum {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-7deg) translateY(-1.7%); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(7deg) translateY(-1.7%); }
  }
  @keyframes mc-icon-swing {
    0%, 100% { transform: none; }
    50% { transform: scaleX(calc(1 - 0.35 * var(--mc-icon-intensity, 1))) skewY(calc(-12deg * var(--mc-icon-intensity, 1))); }
  }
  @keyframes mc-icon-shake {
    0%, 50%, 100% { transform: translateX(0); }
    10%, 30% { transform: translateX(-5.8%) rotate(-4deg); }
    20%, 40% { transform: translateX(5.8%) rotate(4deg); }
  }
  @keyframes mc-icon-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes mc-icon-eq {
    0%, 100% { transform: scale(1, 1); }
    20% { transform: scale(1.03, 1.1); }
    40% { transform: scale(1, 0.95); }
    60% { transform: scale(1.02, 1.07); }
    80% { transform: scale(1, 0.98); }
  }
  @keyframes mc-icon-ring {
    from { transform: scale(0.75); opacity: 0.9; }
    to { transform: scale(1.05); opacity: 0; }
  }
  @keyframes mc-icon-snow {
    from { transform: translateY(calc(var(--mc-snow-dy, 5px) * -1)); opacity: 0; }
    25% { opacity: 0.9; }
    to { transform: translateY(var(--mc-snow-dy, 5px)); opacity: 0; }
  }

  /*
   * Line-draw: the outline traced with a pathLength=1 dash, then the filled icon fades in under it
   * while the stroke fades out. Loop: draw, hold, erase (three durations per cycle).
   */
  .draw path {
    stroke: var(--icon-primary-color, currentColor);
    stroke-dasharray: 1 1;
  }
  .mc-draw .draw path {
    animation: mc-icon-draw var(--mc-draw-dur, 1.2s) ease-in-out both;
  }
  .mc-draw .body {
    animation: mc-icon-draw-fill var(--mc-draw-dur, 1.2s) ease-in both;
  }
  .mc-draw-loop .draw path {
    animation: mc-icon-draw-loop calc(var(--mc-draw-dur, 1.2s) * 3) ease-in-out infinite;
  }
  .mc-draw-loop .body {
    animation: mc-icon-draw-loop-fill calc(var(--mc-draw-dur, 1.2s) * 3) ease-in-out infinite;
  }
  @keyframes mc-icon-draw {
    0% { stroke-dashoffset: 1; opacity: 1; }
    60% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes mc-icon-draw-fill {
    0%, 50% { opacity: 0; }
  }
  @keyframes mc-icon-draw-loop {
    0% { stroke-dashoffset: 1; }
    33%, 67% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1; }
  }
  @keyframes mc-icon-draw-loop-fill {
    0%, 25%, 75%, 100% { opacity: 0; }
    35%, 62% { opacity: 1; }
  }
  /* Morph fallback (shapes that can't be matched): cross-fade, the new shape scales 0.85 -> 1. */
  .xfade-in {
    transform-box: view-box;
    transform-origin: center;
    animation: mc-icon-xfade-in 0.25s ease-out both;
  }
  .xfade-out {
    animation: mc-icon-xfade-out 0.25s ease-out both;
  }
  @keyframes mc-icon-xfade-in {
    from { opacity: 0; transform: scale(0.85); }
  }
  @keyframes mc-icon-xfade-out {
    to { opacity: 0; }
  }
  /* Morph: the target's secondary paths / own markup fade in over the 400 ms tween. */
  .morph-in {
    animation: mc-icon-fade-in 0.4s ease-in-out both;
  }
  @keyframes mc-icon-fade-in {
    from { opacity: 0; }
  }

  /* Off-screen (shared IntersectionObserver): looping animations pause. */
  :host([offscreen]) svg,
  :host([offscreen]) svg * {
    animation-play-state: paused;
  }

  /* Reduced motion: nothing moves; glow, the open-door pose, ring and flakes stay as a still frame. */
  @media (prefers-reduced-motion: reduce) {
    .liquid {
      transition: none;
    }
    .wave,
    .dev,
    .glow-copy,
    .ring,
    .snow circle,
    .draw path,
    .mc-draw .body,
    .mc-draw-loop .body,
    .xfade-in,
    .xfade-out,
    .morph-in {
      animation: none;
    }
    .draw {
      display: none;
    }
  }
`;
