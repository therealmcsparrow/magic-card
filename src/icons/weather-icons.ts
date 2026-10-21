import { css } from 'lit';

/* Card styles for the animated weather icons (the modules-extra chunk adopts them); the SVG templates are in weather-icon-svg.ts. */

/** Card styles for the animated weather icons (sized like ha-icon through --mdc-icon-size). */
export const weatherIconStyles = css`
  svg.mc-wx {
    display: inline-block;
    flex: none;
    width: var(--mdc-icon-size, 24px);
    height: var(--mdc-icon-size, 24px);
    overflow: visible;
    vertical-align: middle;
  }
  .mc-wx .wx-rays {
    transform-box: fill-box;
    transform-origin: center;
    animation: mc-wx-spin 20s linear infinite;
  }
  .mc-wx .wx-cloud {
    animation: mc-wx-drift 6s ease-in-out infinite alternate;
  }
  .mc-wx .wx-cloud-back {
    animation-delay: -3s;
    animation-direction: alternate-reverse;
  }
  .mc-wx .wx-drop {
    animation: mc-wx-rain 0.9s linear infinite;
  }
  .mc-wx .wx-flake {
    animation: mc-wx-snow 2.4s linear infinite;
  }
  .mc-wx .wx-hail {
    animation: mc-wx-hail 0.7s cubic-bezier(0.5, 0, 1, 1) infinite;
  }
  .mc-wx .wx-bolt {
    animation: mc-wx-flash 4s linear infinite;
  }
  .mc-wx .wx-fog {
    animation: mc-wx-fog 4s ease-in-out infinite alternate;
  }
  .mc-wx .wx-wind {
    stroke-dasharray: 82 18;
    animation: mc-wx-wind 2.4s linear infinite;
  }
  .mc-wx .wx-star {
    transform-box: fill-box;
    transform-origin: center;
    animation: mc-wx-twinkle 3s ease-in-out infinite;
  }
  .mc-wx .wx-alert {
    animation: mc-wx-alert 2s ease-in-out infinite;
  }
  @keyframes mc-wx-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes mc-wx-drift {
    from { transform: translateX(-2px); }
    to { transform: translateX(2px); }
  }
  @keyframes mc-wx-rain {
    from { transform: translateY(-5px); opacity: 0; }
    30% { opacity: 1; }
    to { transform: translateY(9px); opacity: 0; }
  }
  @keyframes mc-wx-snow {
    0% { transform: translate(0, -5px); opacity: 0; }
    25% { transform: translate(1.5px, -1px); opacity: 1; }
    50% { transform: translate(-1.5px, 3px); }
    75% { transform: translate(1.5px, 7px); opacity: 1; }
    100% { transform: translate(0, 11px); opacity: 0; }
  }
  @keyframes mc-wx-hail {
    from { transform: translateY(-4px); opacity: 0; }
    20% { opacity: 1; }
    to { transform: translateY(12px); opacity: 0.2; }
  }
  @keyframes mc-wx-flash {
    0%, 84%, 90%, 100% { opacity: 1; }
    86%, 92% { opacity: 0.15; }
  }
  @keyframes mc-wx-fog {
    from { transform: translateX(-3px); }
    to { transform: translateX(3px); }
  }
  @keyframes mc-wx-wind {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes mc-wx-twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.6); }
  }
  @keyframes mc-wx-alert {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  /* Off-screen (shared IntersectionObserver): every animation pauses. */
  .mc-wx[offscreen] * {
    animation-play-state: paused;
  }
  /* Reduced motion: the still frame (drops, flakes and lines where they are drawn). */
  @media (prefers-reduced-motion: reduce) {
    .mc-wx * {
      animation: none !important;
    }
  }
`;
