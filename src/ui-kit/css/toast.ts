import { css, CSSResult } from 'lit';

// `.toast`: inverse chip, bottom centre; used by <mc-ui-toast> and, as CSS only, by the MCU panel. Not in `kitCss`.
export const kitToast: CSSResult = /* @__PURE__ */ css`
  .toast {
    position: fixed;
    inset: auto;
    left: 50%;
    bottom: calc(var(--mc-toast-offset, 16px) + env(safe-area-inset-bottom, 0px));
    transform: translateX(-50%);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    width: max-content;
    max-width: min(520px, calc(100vw - 32px));
    padding: 10px 10px 10px 16px;
    border: 0;
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-text);
    color: var(--mc-surface);
    box-shadow: var(--mc-shadow-float);
    font-size: 0.8125rem;
    line-height: 1.4;
    overflow: visible;
  }
  .toast .text {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .toast .action {
    flex: none;
    min-height: var(--mc-hit-xs, 24px);
    padding: 0 10px;
    border: 1px solid currentColor;
    border-radius: var(--mc-radius, 8px);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  @media (hover: hover) {
    .toast .action:hover {
      background: color-mix(in srgb, currentColor 14%, transparent);
    }
  }
  .toast .action:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  @media (pointer: coarse) {
    .toast .action {
      min-height: var(--mc-hit-sm, 44px);
    }
  }
`;
