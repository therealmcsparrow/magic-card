import { css, unsafeCSS } from 'lit';

/**
 * Storm flashes never stack: an element whose seasonal layer flashes carries `data-mc-flash`; a
 * layer inside another flashing element, or after a flashing sibling layer, skips its flash.
 */
export const NESTED_FLASH_SELECTOR = '[data-mc-flash] [data-mc-flash] > mc-seasonal';
export const SIBLING_FLASH_SELECTOR = 'mc-seasonal[flash] ~ mc-seasonal';

/**
 * Card side of seasonal scenes: the card's layer and decorations sit inside its content
 * (`data-mc-seasonal`), seasonal animation presets inside their element (`data-mc-anim-fx`). Both
 * paint over the element's background and under its content (z-index -1 in the element's own
 * stacking context); a front layer paints over the content. None of them takes pointer events.
 */
export const seasonalCardStyles = css`
  [data-mc-seasonal] {
    position: relative;
    isolation: isolate;
  }
  /* the content fills the card (a sections cell, a card height), its corners follow the card's */
  ha-card:has(> .mc-card-content[data-mc-seasonal]) {
    display: flex;
    flex-direction: column;
  }
  .mc-card-content[data-mc-seasonal] {
    flex: 1 1 auto;
    border-radius: inherit;
  }
  .mc-popup-body > .mc-card-content[data-mc-seasonal] {
    border-radius: 0;
  }
  /* absolute from the first paint: before the chunk defines them they are empty flex items, and their gaps moved the content */
  mc-seasonal,
  mc-seasonal-deco {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  mc-seasonal[layer='front'] {
    z-index: auto;
  }
  ${unsafeCSS(NESTED_FLASH_SELECTOR)},
  ${unsafeCSS(SIBLING_FLASH_SELECTOR)} {
    --mc-sn-flash: none;
  }
`;
