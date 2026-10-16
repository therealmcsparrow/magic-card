import { css, unsafeCSS } from 'lit';

/**
 * Inline style properties that form a stacking context, matched as a declaration start (start of the
 * style, or after `;` / `; `) so `text-transform`, `filter: grayscale()`, `background-size: contain`
 * or a custom property never match. Entries without a colon are prefixes (`mask-image`...).
 */
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
 * Card side of flow lines (only on a card with flows, `data-mc-flows` on the card content): the
 * content is the overlay's positioning box and its own stacking context, and module wrappers sit
 * at z-index 1 so the back layer (z-index 0) runs behind module content but over row / column
 * backgrounds; the front layer and labels sit at z-index 2.
 *
 * A row or column that forms its own stacking context (particle layers, a video background,
 * animations, filters, opacity, transforms...) would hold its wrappers' z-index inside it and paint as
 * a whole at level 0, under the back layer: those containers are lifted to z-index 1 themselves
 * (their background then covers the lines; plain containers keep the lines above theirs).
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
  .dot,
  .glow {
    offset-rotate: 0deg;
    animation-name: mc-flow-dot;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .dash {
    stroke-linecap: butt;
    animation-name: mc-flow-dash;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes mc-flow-dot {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
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
  svg[offscreen] .dash {
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
