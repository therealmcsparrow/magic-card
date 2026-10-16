import { css, CSSResult, unsafeCSS } from 'lit';

/* ================================================================== */
/*  STUDIO EDITOR DESIGN SYSTEM                                        */
/*  One shared stylesheet for every editor component:                  */
/*    static styles = [editorSystem, css`...own small css...`]         */
/*  Colors come only from HA theme variables (with fallbacks).         */
/* ================================================================== */

export const editorTokens: CSSResult = css`
  :host {
    --mc-accent: var(--primary-color, #03a9f4);
    --mc-accent-ink: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
    /* filled accent surfaces (primary button, checked switch): darkened so white text/knob stays >= 4.5:1 in both themes */
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
    --mc-success: var(--success-color, #43a047);
    /*
     * Selection colour per level (canvas frame, handles, name tag, hover; layers + inspector tile).
     * stroke: frame/hover border; fill: name tag behind white text (mixed toward black, >= 4.5:1);
     * ink: text/icons on Surface or on the 12% tint (>= 4.5:1 light + dark); tint: selected-row wash.
     */
    --mc-sel-module: var(--mc-accent);
    --mc-sel-module-fill: var(--mc-accent-fill);
    --mc-sel-module-ink: var(--mc-accent-ink);
    --mc-sel-module-tint: var(--mc-accent-tint);
    --mc-sel-col: color-mix(in srgb, var(--success-color, #43a047) 85%, var(--primary-text-color, #212121));
    --mc-sel-col-fill: color-mix(in srgb, var(--success-color, #43a047) 70%, #000);
    --mc-sel-col-ink: color-mix(in srgb, var(--success-color, #43a047) 60%, var(--primary-text-color, #212121));
    --mc-sel-col-tint: color-mix(in srgb, var(--success-color, #43a047) 12%, transparent);
    --mc-sel-row: color-mix(in srgb, var(--warning-color, #ff9800) 70%, var(--primary-text-color, #212121));
    --mc-sel-row-fill: color-mix(in srgb, var(--warning-color, #ff9800) 55%, #000);
    --mc-sel-row-ink: var(--mc-warn-ink);
    --mc-sel-row-tint: var(--mc-warn-tint);
    --mc-sel-card: var(--mc-text-2);
    --mc-sel-card-fill: color-mix(in srgb, var(--secondary-text-color, #5f6368) 70%, #000);
    --mc-sel-card-ink: color-mix(in srgb, var(--secondary-text-color, #5f6368) 60%, var(--primary-text-color, #212121));
    --mc-sel-card-tint: color-mix(in srgb, var(--secondary-text-color, #5f6368) 12%, transparent);
    --mc-canvas: color-mix(in srgb, var(--primary-text-color, #212121) 6%, var(--primary-background-color, #fafafa));
    --mc-canvas-dot: color-mix(in srgb, var(--primary-text-color, #212121) 16%, transparent);
    --mc-shadow-float: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
    --mc-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
    --mc-radius: 8px;
    --mc-radius-lg: 12px;
    font-family: inherit;
    color: var(--mc-text);
    caret-color: var(--mc-accent);
  }
`;

export const editorPrimitives: CSSResult = css`
  /* ---------------------------------------------------------------- base */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  ::selection {
    background: var(--mc-accent-tint);
    color: var(--mc-text);
  }
  /* ------------------------------------------------- selection level */
  /* Sets --k / --k-fill / --k-ink / --k-tint to one level's selection colours. */
  .k-module {
    --k: var(--mc-sel-module);
    --k-fill: var(--mc-sel-module-fill);
    --k-ink: var(--mc-sel-module-ink);
    --k-tint: var(--mc-sel-module-tint);
  }
  .k-column {
    --k: var(--mc-sel-col);
    --k-fill: var(--mc-sel-col-fill);
    --k-ink: var(--mc-sel-col-ink);
    --k-tint: var(--mc-sel-col-tint);
  }
  .k-row {
    --k: var(--mc-sel-row);
    --k-fill: var(--mc-sel-row-fill);
    --k-ink: var(--mc-sel-row-ink);
    --k-tint: var(--mc-sel-row-tint);
  }
  .k-card {
    --k: var(--mc-sel-card);
    --k-fill: var(--mc-sel-card-fill);
    --k-ink: var(--mc-sel-card-ink);
    --k-tint: var(--mc-sel-card-tint);
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--mc-field-border) transparent;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--mc-divider);
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--mc-field-border);
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
  }
  :focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: 2px;
  }
  .mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  [hidden] {
    display: none !important;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ------------------------------------------------- the ONE tab / segmented style */
  .seg {
    display: inline-flex;
    align-items: stretch;
    gap: 2px;
    padding: 3px;
    background: var(--mc-surface-2);
    border: 1px solid var(--mc-divider);
    border-radius: 10px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .seg::-webkit-scrollbar {
    display: none;
  }
  .seg.full {
    display: flex;
    width: 100%;
  }
  .seg.full > button {
    flex: 1 0 auto;
    justify-content: center;
  }
  .seg > button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 10px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    white-space: nowrap;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text-2);
    transition: background-color 0.15s ease-out, color 0.15s ease-out;
  }
  .seg > button ha-icon {
    --mdc-icon-size: 18px;
  }
  .seg > button:hover {
    color: var(--mc-text);
    background: color-mix(in srgb, var(--mc-surface) 55%, transparent);
  }
  .seg > button[aria-selected='true'],
  .seg > button[aria-checked='true'],
  .seg > button.active {
    background: var(--mc-surface);
    color: var(--mc-accent-ink);
    box-shadow: 0 0 0 1px var(--mc-divider), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  .seg > button:focus-visible {
    outline-offset: -2px;
  }

  /* a row's columns as bars at their share of the row (Layers tree, layout picker) */
  .layout-glyph {
    display: inline-grid;
    gap: 2px;
    width: 28px;
    height: 14px;
    flex: none;
  }
  .layout-glyph i {
    display: block;
    min-width: 2px;
    border-radius: 2px;
    background: currentColor;
    opacity: 0.45;
  }
  .seg > button[aria-checked='true'] .layout-glyph i {
    opacity: 0.85;
  }

  /* ------------------------------------------------- the ONE chip style */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 9999px;
    border: 1px solid var(--mc-divider);
    background: var(--mc-surface);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    color: var(--mc-text-2);
    white-space: nowrap;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
  }
  button.chip {
    min-height: 28px;
  }
  button.chip:hover {
    border-color: var(--mc-field-border);
    color: var(--mc-text);
  }
  .chip.is-accent {
    color: var(--mc-accent-ink);
    border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
    background: var(--mc-accent-tint);
  }
  .chip.is-warn {
    color: var(--mc-warn-ink);
    border-color: color-mix(in srgb, var(--mc-warn-ink) 40%, transparent);
    background: var(--mc-warn-tint);
  }
  .chip.is-count {
    min-height: 20px;
    padding: 0 8px;
  }

  /* ------------------------------------------------- the ONE button hierarchy */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 16px;
    border-radius: var(--mc-radius);
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out;
  }
  .btn ha-icon {
    --mdc-icon-size: 18px;
  }
  .btn-primary {
    background: var(--mc-accent-fill);
    color: var(--mc-on-accent);
  }
  .btn-primary:hover {
    box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
  }
  .btn-primary:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
  .btn-secondary {
    background: var(--mc-surface);
    border-color: var(--mc-field-border);
    color: var(--mc-text);
  }
  .btn-secondary:hover {
    background: var(--mc-surface-2);
  }
  .btn-text {
    background: transparent;
    color: var(--mc-accent-ink);
    padding: 0 12px;
  }
  .btn-text:hover {
    background: var(--mc-accent-tint);
  }
  .btn-sm {
    min-height: 32px;
    padding: 0 12px;
    font-size: 0.8125rem;
  }
  .btn:disabled,
  .icon-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
  .icon-btn {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius);
    background: transparent;
    color: var(--mc-text-2);
    --mdc-icon-size: 20px;
  }
  .icon-btn:hover:not(:disabled) {
    background: var(--mc-surface-2);
    color: var(--mc-text);
  }
  .icon-btn.sm {
    width: 32px;
    height: 32px;
    --mdc-icon-size: 18px;
  }
  .icon-btn.danger:hover:not(:disabled) {
    color: var(--mc-error-ink);
  }

  /* ------------------------------------------------- fields */
  .field {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .field-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 24px;
  }
  .field-head label,
  .field-head .lbl {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text);
    flex: 1;
    min-width: 0;
  }
  /* reset of a set field (field-reset.ts): a 32px icon button that does not grow the 24px head */
  .field-reset {
    margin: -4px -6px -4px 0;
  }
  .help {
    margin: 0;
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .help.error {
    color: var(--mc-error-ink);
  }
  .help.lead {
    font-size: 0.875rem;
  }
  .input {
    width: 100%;
    min-height: 40px;
    margin: 0;
    padding: 8px 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.4;
    transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
  }
  .input::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  .input:hover {
    border-color: var(--mc-text-2);
  }
  .input:focus {
    outline: none;
    border-color: var(--mc-accent);
    box-shadow: 0 0 0 1px var(--mc-accent);
  }
  .input:disabled {
    background: var(--mc-surface-2);
    color: var(--mc-text-2);
    cursor: not-allowed;
  }
  textarea.input {
    resize: vertical;
    min-height: 88px;
    line-height: 1.5;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  .input.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  .with-icon {
    position: relative;
  }
  .with-icon > ha-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    --mdc-icon-size: 18px;
    color: var(--mc-text-2);
    pointer-events: none;
  }
  .with-icon > .input {
    padding-left: 40px;
  }
  /* a small icon button inside the right edge of a field (browse entities / icons) */
  .with-action > .input {
    padding-right: 44px;
  }
  .with-icon > .field-action {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
  }
  .with-icon + .entity-meta {
    margin: 6px 0 0;
  }
  .select {
    position: relative;
    display: block;
    min-width: 0;
  }
  .select select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  .select > ha-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--mc-text-2);
    --mdc-icon-size: 18px;
  }
  .unit {
    display: flex;
    min-width: 0;
  }
  .unit > .input {
    flex: 1 1 auto;
    min-width: 7ch;
    border-radius: var(--mc-radius) 0 0 var(--mc-radius);
  }
  .unit > .select {
    flex: none;
    width: 76px;
  }
  .unit > .select select {
    border-radius: 0 var(--mc-radius) var(--mc-radius) 0;
    margin-left: -1px;
    padding-left: 10px;
  }
  .unit > .input:focus,
  .unit > .select select:focus {
    position: relative;
    z-index: 1;
  }
  .color {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }
  .color .input {
    flex: 1;
    min-width: 0;
  }
  .swatch {
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: none;
    cursor: pointer;
  }
  .box-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
  }
  .box-side {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  .box-side-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
    --mdc-icon-size: 16px;
  }
  .box-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .box-foot .select {
    width: 96px;
  }
  .switch-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
  }
  .switch-row .txt {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .switch-row .txt .help {
    margin-top: 2px;
    font-weight: 400;
  }
  .switch {
    position: relative;
    flex: none;
    width: 40px;
    height: 24px;
    border-radius: 9999px;
    border: 0;
    padding: 0;
    background: var(--mc-field-border);
    transition: background-color 0.15s ease-out;
  }
  .switch::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s ease-out;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .switch[aria-checked='true'] {
    background: var(--mc-accent-fill);
  }
  .switch[aria-checked='true']::after {
    transform: translateX(16px);
  }
  .switch:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .sync {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 24px;
    padding: 0 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--mc-text-2);
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    --mdc-icon-size: 16px;
  }
  .sync:hover {
    background: var(--mc-surface-2);
    color: var(--mc-text);
  }
  .sync.is-over {
    color: var(--mc-warn-ink);
  }
  .sync.is-over:hover {
    background: var(--mc-warn-tint);
    color: var(--mc-warn-ink);
  }
  .entity-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .entity-meta .dot,
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mc-success);
    flex: none;
  }

  /* ------------------------------------------------- groups, conditions, layout */
  .group {
    display: grid;
    gap: 16px;
  }
  .group + .group {
    padding-top: 20px;
    border-top: 1px solid var(--mc-divider);
  }
  .group-head {
    display: flex;
    align-items: center;
    gap: 8px;
    --mdc-icon-size: 18px;
  }
  .group-head > ha-icon {
    color: var(--mc-text-2);
  }
  .group-head h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    flex: 1;
  }
  .cond {
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    padding: 12px;
    display: grid;
    gap: 12px;
  }
  .cond-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cond-head .n {
    font-size: 0.8125rem;
    font-weight: 500;
    flex: 1;
    min-width: 0;
  }
  .cond-head .n .sub {
    color: var(--mc-text-2);
    font-weight: 400;
  }
  /* repeatable items of a module field (colour ranges): condition cards in a 12px-gap list */
  .range-list {
    display: grid;
    gap: 12px;
  }
  .two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
    gap: 16px 12px;
  }
  .empty {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: 8px;
    padding: 24px 16px;
    border: 1px dashed var(--mc-divider);
    border-radius: var(--mc-radius-lg);
  }
  .empty > ha-icon {
    --mdc-icon-size: 28px;
    color: var(--mc-text-2);
  }
  .empty strong {
    font-weight: 500;
  }
  .empty p {
    margin: 0;
    color: var(--mc-text-2);
    font-size: 0.8125rem;
    max-width: 32ch;
  }
  .sectors {
    display: grid;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    overflow: hidden;
  }
  .sector + .sector {
    border-top: 1px solid var(--mc-divider);
  }
  .sector-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 8px 12px;
    border: 0;
    background: transparent;
    text-align: left;
  }
  .sector-btn:hover {
    background: var(--mc-surface-2);
  }
  .sector-btn:focus-visible {
    outline-offset: -2px;
  }
  .sector-btn > ha-icon:first-child {
    --mdc-icon-size: 18px;
    color: var(--mc-text-2);
  }
  .sector-btn .nm {
    flex: 1;
    min-width: 0;
    font-weight: 500;
  }
  .sector-btn .chev {
    --mdc-icon-size: 20px;
    color: var(--mc-text-2);
    transition: transform 0.15s ease-out;
  }
  .sector-btn[aria-expanded='true'] .chev {
    transform: rotate(180deg);
  }
  .sector-body {
    padding: 4px 12px 16px;
    display: grid;
    gap: 16px;
  }
  .no-results {
    color: var(--mc-text-2);
    font-size: 0.8125rem;
    padding: 12px;
  }

  /* ------------------------------------------------- menu */
  .menu {
    position: absolute;
    z-index: 30;
    min-width: 240px;
    padding: 6px;
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface);
    border: 1px solid var(--mc-divider);
    box-shadow: var(--mc-shadow-float);
    display: grid;
  }
  /* Shown in the top layer (MenuPopover): undo the UA popover box; top/left come from the trigger rect. */
  .menu[popover] {
    position: fixed;
    inset: auto;
    margin: 0;
    color: var(--mc-text);
    overflow: auto;
    overscroll-behavior: contain;
    box-sizing: border-box;
  }
  .menu button {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--mc-radius);
    background: transparent;
    text-align: left;
  }
  .menu button:hover,
  .menu button:focus-visible {
    background: var(--mc-surface-2);
    outline: none;
  }
  .menu button ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-2);
  }
  .menu .menu-note {
    font-size: 0.75rem;
    color: var(--mc-text-2);
    padding: 6px 12px 8px;
  }
  .menu hr {
    border: 0;
    border-top: 1px solid var(--mc-divider);
    margin: 4px 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
    }
  }
`;

/*
 * Legacy class mapping: module editors (30 files) still emit mc-* classes.
 * These rules give them exactly the primitives' look without touching module files.
 * LEGACY_INPUT carries enough specificity (0,5,1) to win over the old editor sheets
 * that may still be loaded in the same shadow root during the transition.
 */
const LEGACY_INPUT = unsafeCSS(
  ':is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea)' +
    ":not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])",
);

export const editorLegacy: CSSResult = css`
  .mc-tab-content {
    display: grid;
    gap: 16px;
  }
  .mc-field {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .mc-field-label,
  .mc-field > label,
  .mc-input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 24px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text);
    text-transform: none;
    letter-spacing: normal;
  }
  .mc-field-hint,
  .mc-mode-help {
    font-size: 0.75rem;
    font-style: normal;
    color: var(--mc-text-2);
  }

  /* inputs: identical to .input */
  ${LEGACY_INPUT},
  .mc-input-field.mc-input-field {
    width: 100%;
    min-height: 40px;
    margin: 0;
    padding: 8px 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    outline: none;
    box-shadow: none;
    transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
  }
  ${LEGACY_INPUT}::placeholder,
  .mc-input-field.mc-input-field::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  ${LEGACY_INPUT}:hover,
  .mc-input-field.mc-input-field:hover {
    border-color: var(--mc-text-2);
  }
  ${LEGACY_INPUT}:focus,
  .mc-input-field.mc-input-field:focus {
    outline: none;
    border-color: var(--mc-accent);
    box-shadow: 0 0 0 1px var(--mc-accent);
  }
  ${LEGACY_INPUT}:disabled {
    background: var(--mc-surface-2);
    color: var(--mc-text-2);
    cursor: not-allowed;
  }
  ${LEGACY_INPUT}.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  /* selects: .select look (bare selects get the chevron as a background image) */
  ${LEGACY_INPUT}:is(select):not([multiple]):not([size]) {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  ${LEGACY_INPUT}:is(select):not(.input):not([multiple]):not([size]) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px 18px;
  }
  /* textareas: textarea.input */
  ${LEGACY_INPUT}:is(textarea) {
    resize: vertical;
    min-height: 88px;
    line-height: 1.5;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }

  /* sections = .group */
  .mc-section {
    display: grid;
    gap: 16px;
  }
  .mc-section + .mc-section {
    padding-top: 20px;
    border-top: 1px solid var(--mc-divider);
  }
  .mc-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--mc-text);
  }

  /* buttons = .btn hierarchy */
  .mc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 16px;
    border-radius: var(--mc-radius);
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    filter: none;
    transform: none;
    transition: background-color 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out;
    --mdc-icon-size: 18px;
  }
  .mc-btn-primary {
    background: var(--mc-accent-fill);
    border-color: transparent;
    color: var(--mc-on-accent);
  }
  .mc-btn-primary:hover {
    filter: none;
    box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
  }
  .mc-btn-primary:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
  .mc-btn-secondary {
    background: var(--mc-surface);
    border: 1px solid var(--mc-field-border);
    color: var(--mc-text);
  }
  .mc-btn-secondary:hover {
    background: var(--mc-surface-2);
  }
  .mc-btn-small {
    min-height: 32px;
    padding: 0 12px;
    font-size: 0.8125rem;
  }
  .mc-btn-icon {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius);
    background: transparent;
    color: var(--mc-text-2);
    --mdc-icon-size: 18px;
  }
  .mc-btn-icon:hover:not(:disabled) {
    background: var(--mc-surface-2);
    color: var(--mc-text);
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):active {
    opacity: 1;
    transform: none;
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: 2px;
  }

  /* conditions = .cond */
  .mc-conditions-list {
    display: grid;
    gap: 12px;
    margin: 0;
  }
  .mc-condition-item {
    position: relative;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    padding: 12px;
    display: grid;
    gap: 12px;
  }

  /* tabs = .seg (full width) */
  .mc-tabs-header {
    display: flex;
    width: 100%;
    align-items: stretch;
    gap: 2px;
    padding: 3px;
    margin: 0;
    background: var(--mc-surface-2);
    border: 1px solid var(--mc-divider);
    border-radius: 10px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .mc-tab-button {
    flex: 1 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 10px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    white-space: nowrap;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text-2);
    box-shadow: none;
    transition: background-color 0.15s ease-out, color 0.15s ease-out;
    --mdc-icon-size: 18px;
  }
  .mc-tab-button:hover {
    color: var(--mc-text);
    background: color-mix(in srgb, var(--mc-surface) 55%, transparent);
  }
  .mc-tab-button.active,
  .mc-tab-button[aria-selected='true'] {
    background: var(--mc-surface);
    color: var(--mc-accent-ink);
    box-shadow: 0 0 0 1px var(--mc-divider), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  .mc-tab-button:focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: -2px;
  }
`;

export const editorSystem: CSSResult[] = [editorTokens, editorPrimitives, editorLegacy];
