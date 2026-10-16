import { css } from 'lit';

/**
 * Card side of shapes (src/card/mc-shape.ts): a shaped element (`data-mc-shape`) is the positioning
 * box of its mc-shape layer and sized as a border box; its own inset vars start at 0 (a shaped row's values must not reach a
 * shaped module inside it before that one is measured). A shaped element with a box-shadow sits in
 * a `.mc-shape-shadow` wrapper drawing the shadow as a drop-shadow (a clip-path would cut it off).
 */
export const shapeCardStyles = css`
  [data-mc-shape] {
    position: relative;
    /* sizes (width, min-height ...) are the shape's own: the inset padding grows inward, not the box
       (the inset scales with the box; outward it would feed back into a taller, wider-cut shape) */
    box-sizing: border-box;
    --mc-shape-it: 0px;
    --mc-shape-ir: 0px;
    --mc-shape-ib: 0px;
    --mc-shape-il: 0px;
  }
  .mc-shape-shadow {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .mc-shape-shadow > * {
    flex: 1 1 auto;
  }
  /* the card: the wrapper takes ha-card's place (full height in a grid / sections cell) */
  .mc-shape-shadow.mc-card-shadow {
    height: 100%;
  }
`;

/** <mc-shape>: the border stroke layer over the shaped element's border box. */
export const shapeLayerStyles = css`
  :host {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
  }
  svg {
    position: absolute;
    overflow: visible;
  }
  path {
    fill: none;
  }
`;

/**
 * Card side of value backgrounds (src/card/mc-value-bg.ts): the element with one (`data-mc-value-bg`)
 * is the layer's positioning box and an isolated stacking context, so the layer (z-index -1) paints
 * over the element's own background and under its content. The card's layer sits in the card
 * content, which then fills ha-card (a grid / sections cell taller than the rows).
 */
export const valueBgCardStyles = css`
  [data-mc-value-bg] {
    position: relative;
    isolation: isolate;
  }
  ha-card:has(> .mc-card-content[data-mc-value-bg]) {
    display: flex;
    flex-direction: column;
  }
  .mc-card-content[data-mc-value-bg] {
    flex: 1 1 auto;
  }
`;
