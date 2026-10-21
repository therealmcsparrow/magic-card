import { css, CSSResult } from 'lit';

/*
 * Rows (contract ui-kit 1.0.0): the list and tree row. 40 px fine / 44 px coarse through
 * --mc-hit. Trailing buttons are the borderless 24 px `.icon-btn.xs` (kitButtonExtras). Level indent is the --lvl
 * custom property the helper sets (0 = top level), 16 px a step.
 */
export const kitRow: CSSResult = /* @__PURE__ */ css`
  .rows {
    display: grid;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    min-height: var(--mc-hit, 40px);
    padding: 2px 4px 2px calc(8px + var(--lvl, 0) * 16px);
    border-radius: var(--mc-radius, 8px);
    color: var(--mc-text);
    font-size: 0.875rem;
    transition: background-color var(--mc-ease, 0.15s ease-out);
  }
  .row:hover {
    background: var(--mc-surface-2);
  }
  .row.selected,
  .row[aria-selected='true'] {
    background: var(--mc-accent-tint);
  }
  .row .grip,
  .row > .gl,
  .row > ha-icon {
    flex: none;
    display: inline-flex;
    color: var(--mc-text-2);
    --mdc-icon-size: 18px;
  }
  .row .grip {
    cursor: grab;
  }
  .row .name {
    flex: 1 1 120px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  .row .name small {
    display: block;
    font-family: var(--mc-mono);
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .row .input {
    flex: 1 1 140px;
    width: auto;
    min-width: 0;
  }
  .row .acts {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: auto;
  }
  .row .help {
    flex: 1 1 100%;
  }
`;
