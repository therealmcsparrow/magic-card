import { css } from 'lit';

/*
 * The theme editor's own stylesheet. The chunk may not import src/css/editor-system.ts (contract
 * theme-editor 1.0.0: lit, contracts and this folder only), so this is a small copy of the parts it
 * needs, with the same token names. Colour comes only from Home Assistant theme variables.
 */
export const base = css`
  :host {
    --mc-accent: var(--primary-color, #03a9f4);
    --mc-accent-ink: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
    --mc-accent-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
    --mc-on-accent: #fff;
    --mc-accent-tint: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    --mc-surface: var(--card-background-color, #fff);
    --mc-surface-2: var(--secondary-background-color, #f2f3f5);
    --mc-ground: var(--primary-background-color, #fafafa);
    --mc-text: var(--primary-text-color, #212121);
    --mc-text-2: var(--secondary-text-color, #5f6368);
    --mc-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --mc-field-border: color-mix(in srgb, var(--primary-text-color, #212121) 40%, transparent);
    --mc-warn-ink: color-mix(in srgb, var(--warning-color, #ff9800) 45%, var(--primary-text-color, #212121));
    --mc-warn-tint: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    --mc-error-ink: color-mix(in srgb, var(--error-color, #db4437) 75%, var(--primary-text-color, #212121));
    --mc-error-tint: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
    --mc-error-fill: color-mix(in srgb, var(--error-color, #db4437) 75%, #000);
    --mc-success-ink: color-mix(in srgb, var(--success-color, #43a047) 55%, var(--primary-text-color, #212121));
    --mc-success-tint: color-mix(in srgb, var(--success-color, #43a047) 12%, transparent);
    --mc-shadow-float: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
    --mc-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
    --mc-radius: 8px;
    --mc-radius-lg: 12px;
    font-family: inherit;
    color: var(--mc-text);
    caret-color: var(--mc-accent);
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  [hidden] {
    display: none !important;
  }
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  .ico {
    width: 20px;
    height: 20px;
    fill: currentColor;
    flex: none;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  .mono {
    font-family: var(--mc-mono);
  }
  .help {
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
  }
  .help.error {
    color: var(--mc-error-ink);
    display: flex;
    gap: 6px;
    align-items: flex-start;
  }
  .help.error .ico {
    width: 16px;
    height: 16px;
    margin-top: 1px;
  }
  button {
    font: inherit;
    color: inherit;
  }
  :focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: 2px;
  }
  .seg :focus-visible {
    outline-offset: -2px;
  }

  /* buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 40px;
    padding: 0 16px;
    border-radius: var(--mc-radius);
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .btn[aria-disabled='true'],
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-primary {
    background: var(--mc-accent-fill);
    color: var(--mc-on-accent);
  }
  .btn-secondary {
    border-color: var(--mc-field-border);
    background: var(--mc-surface);
    color: var(--mc-text);
  }
  .btn-text {
    color: var(--mc-accent-ink);
    padding: 0 10px;
  }
  .btn-danger {
    background: var(--mc-error-fill);
    color: #fff;
  }
  .btn-sm {
    min-height: 32px;
    padding: 0 10px;
    font-size: 0.8125rem;
  }
  .btn:hover:not([aria-disabled='true']):not(:disabled) {
    filter: brightness(0.95);
  }
  .icon-btn {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--mc-radius);
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    padding: 0;
    color: var(--mc-text-2);
  }
  .icon-btn.sm {
    width: 32px;
    height: 32px;
  }
  .icon-btn:hover {
    background: var(--mc-surface-2);
  }
  @media (pointer: coarse) {
    .btn,
    .icon-btn {
      min-height: 44px;
    }
    .icon-btn {
      min-width: 44px;
    }
  }

  /* chips */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    border: 1px solid var(--mc-divider);
    font-size: 0.75rem;
    background: var(--mc-surface-2);
    color: var(--mc-text);
    white-space: nowrap;
  }
  .chip .ico {
    width: 14px;
    height: 14px;
  }
  .chip.is-warn {
    background: var(--mc-warn-tint);
    border-color: var(--mc-warn-ink);
    color: var(--mc-warn-ink);
  }
  .chip.is-accent {
    background: var(--mc-accent-tint);
    border-color: var(--mc-accent-ink);
    color: var(--mc-accent-ink);
  }
  button.chip {
    cursor: pointer;
    font: inherit;
    font-size: 0.75rem;
  }

  /* segmented control */
  .seg {
    display: inline-flex;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    overflow: hidden;
    background: var(--mc-surface);
  }
  .seg.full {
    display: flex;
    width: 100%;
  }
  .seg button {
    flex: 1 1 auto;
    min-height: 40px;
    padding: 0 14px;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--mc-text);
  }
  .seg button + button {
    border-left: 1px solid var(--mc-divider);
  }
  .seg button[aria-checked='true'],
  .seg button[aria-selected='true'] {
    background: var(--mc-accent-fill);
    color: var(--mc-on-accent);
    font-weight: 500;
  }
  @media (pointer: coarse) {
    .seg button {
      min-height: 44px;
    }
  }

  /* inputs */
  .input {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    font: inherit;
    font-size: 0.875rem;
  }
  .input::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  .input[aria-invalid='true'] {
    border-color: var(--mc-error-ink);
  }
  .input.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  label.lbl {
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .switch-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .switch-row input {
    width: 20px;
    height: 20px;
    accent-color: var(--mc-accent-fill);
  }

  /* callout */
  .callout {
    display: flex;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface-2);
  }
  .callout > .ico {
    margin-top: 1px;
  }
  .callout .body {
    flex: 1 1 auto;
    min-width: 0;
    display: grid;
    gap: 8px;
  }
  .callout .title {
    font-weight: 500;
  }
  .callout .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .callout.is-info {
    background: var(--mc-accent-tint);
    border-color: var(--mc-accent-ink);
  }
  .callout.is-warn {
    background: var(--mc-warn-tint);
    border-color: var(--mc-warn-ink);
  }
  .callout.is-error {
    background: var(--mc-error-tint);
    border-color: var(--mc-error-ink);
  }
  pre.code {
    margin: 0;
    padding: 10px 12px;
    border-radius: var(--mc-radius);
    background: var(--mc-surface-2);
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
    overflow: auto;
    white-space: pre;
    max-width: 100%;
  }

  /* dialogs */
  dialog {
    width: min(480px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
    overflow: auto;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  dialog .dlg {
    display: grid;
    gap: 16px;
    padding: 20px;
  }
  dialog h2 {
    font-size: 1.125rem;
    font-weight: 500;
  }
  dialog .foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }
  @media (max-width: 599px) {
    dialog .foot {
      position: sticky;
      bottom: 0;
      margin: 0 -20px -20px;
      padding: 12px 20px;
      background: var(--mc-surface);
      border-top: 1px solid var(--mc-divider);
    }
    dialog {
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      max-height: 100vh;
      border-radius: 0;
      margin: 0;
    }
  }

  .empty {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 32px 16px;
    text-align: center;
    color: var(--mc-text-2);
  }
  .empty .ico {
    width: 40px;
    height: 40px;
  }
  .empty h2 {
    font-size: 1.125rem;
    color: var(--mc-text);
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: min(560px, calc(100vw - 32px));
    padding: 10px 12px 10px 16px;
    border-radius: var(--mc-radius);
    background: var(--mc-text);
    color: var(--mc-surface);
    box-shadow: var(--mc-shadow-float);
    font-size: 0.875rem;
  }
  .toast button {
    color: inherit;
    border: 1px solid currentColor;
    background: transparent;
    border-radius: var(--mc-radius);
    min-height: 32px;
    padding: 0 10px;
    cursor: pointer;
  }

  .spin {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: transparent;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
