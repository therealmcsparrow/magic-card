import { css, unsafeCSS } from 'lit';

/** Inline style properties that form a stacking context, matched as a declaration start. */
const STACKING_PROPS = [
  'filter:',
  'backdrop-filter:',
  '-webkit-backdrop-filter:',
  'opacity:',
  'transform:',
  'translate:',
  'scale:',
  'rotate:',
  'isolation:',
  'mix-blend-mode:',
  'clip-path:',
  '-webkit-clip-path:',
  'mask',
  '-webkit-mask',
  'will-change:',
  'contain:',
  'perspective:',
];
const STACKING_STYLE = unsafeCSS(
  STACKING_PROPS.flatMap((p) => [`[style^='${p}']`, `[style*='; ${p}']`, `[style*=';${p}']`]).join(', '),
);

/**
 * Card side of flow lines (cards with `data-mc-flows`): the content is the overlay's stacking
 * context, module wrappers sit at z-index 1, the front layer and labels at 2. Containers that
 * form their own stacking context are lifted to z-index 1 so the back layer stays behind them.
 */
export const flowsCardStyles = css`
  .mc-card-content[data-mc-flows] {
    position: relative;
    isolation: isolate;
  }
  .mc-card-content[data-mc-flows]
    :is(.mc-row, .mc-column):is(
      [data-mc-anim],
      [data-mc-anim-fx],
      [data-mc-value-bg],
      ${STACKING_STYLE},
      :has(> .mc-module-wrapper > .mc-video-bg--media)
    ) {
    position: relative;
    z-index: 1;
  }
  /* no specificity: the video-bg wrapper's own position / z-index (css.ts) still win */
  :where(.mc-card-content[data-mc-flows]) .mc-module-wrapper {
    position: relative;
    z-index: 1;
  }
  /* a shaped element's shadow wrapper is a stacking context (filter): lifted like a wrapper; a
     shaped row / column (clip-path) like the containers above */
  :where(.mc-card-content[data-mc-flows]) .mc-shape-shadow,
  .mc-card-content[data-mc-flows] :is(.mc-row, .mc-column)[data-mc-shape] {
    position: relative;
    z-index: 1;
  }
`;

/** `<mc-flows>` (src/card/mc-flows.ts). */
export const flowsOverlayStyles = css`
  :host {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  svg.back {
    z-index: 0;
  }
  svg.front,
  .labels {
    z-index: 2;
  }
  /* flow-look HTML layers (icon shapes): one per z level, same box as the SVGs; labels stay on top */
  div.html {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }
  div.html.back {
    z-index: 0;
  }
  div.html.front {
    z-index: 2;
  }
  .labels {
    position: absolute;
    inset: 0;
  }
  path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  /* while dots move the line is their track (same colour, lighter): the dots stay visible on it */
  .flow[data-dots] .line {
    stroke-opacity: var(--mc-flow-track-opacity, 0.55);
  }
  :host([dark]) .flow[data-dots] .line {
    stroke-opacity: var(--mc-flow-track-opacity, 0.4);
  }
  /* the animation-name and its keyframes (translate along the line: a compositor animation) are set per flow */
  .dot,
  .glow {
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .dash {
    stroke-linecap: butt;
    animation-name: mc-flow-dash;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes mc-flow-dash {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: var(--mc-flow-shift);
    }
  }
  .glow {
    opacity: 0.3;
  }
  /* studio canvas: the selected flow (editor accent halo under its line) */
  .sel {
    stroke: var(--primary-color, #03a9f4);
    stroke-opacity: 0.35;
  }
  /* off-screen (shared IntersectionObserver, src/icons/offscreen.ts): nothing moves */
  svg[offscreen] .dot,
  svg[offscreen] .glow,
  svg[offscreen] .dash,
  :host([page-hidden]) .dot,
  :host([page-hidden]) .glow,
  :host([page-hidden]) .dash {
    animation-play-state: paused;
  }
  .label {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 1px 8px;
    border-radius: 999px;
    border: 1px solid var(--mc-flow-color);
    background: var(--mc-flow-label-bg, var(--ha-card-background, var(--card-background-color, #fff)));
    color: var(--primary-text-color);
    font: inherit;
    font-size: var(--ha-font-size-xs, 11px);
    line-height: 16px;
    font-weight: 500;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  @media (prefers-reduced-motion: reduce) {
    .dot,
    .glow,
    .dash {
      animation: none;
    }
  }
`;
