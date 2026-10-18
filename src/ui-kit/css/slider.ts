import { css, CSSResult } from 'lit';

/*
 * .slider-row (contract ui-kit 1.0.0): label, range, number field, unit. Extracted from the card editor's gradient
 * angle row, which is the reference look: the label keeps 48 px, the range takes the rest (120 px minimum, then the
 * row wraps), the number field is 64 px. Below 240 px of container width the parts stack.
 */
export const kitSlider: CSSResult = /* @__PURE__ */ css`
  .slider-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }
  .slider-row > label {
    flex: 0 0 auto;
    min-width: 48px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text);
  }
  .slider-row > input[type='range'] {
    flex: 1 1 120px;
    min-width: 0;
  }
  .slider-row > .input {
    flex: 0 0 64px;
    width: 64px;
    min-width: 0;
  }
  @container (max-width: 239px) {
    .slider-row {
      flex-direction: column;
      align-items: stretch;
    }
    .slider-row > .input {
      flex-basis: auto;
      width: 100%;
    }
  }
`;
