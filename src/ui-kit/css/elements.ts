import { css, CSSResult } from 'lit';

/*
 * Shadow-root styles of the three kit elements (contract ui-kit 1.0.0). They read tokens with fallbacks, because an
 * element can sit in a root that never loaded editorTokens (the elements add no :host token block of their own, so a
 * screen that overrides tokens on its :host keeps its look).
 */

const inherit = /* @__PURE__ */ css`
  :host {
    display: contents;
    font-family: var(--mc-font, inherit);
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

export const kitMenuElementCss: CSSResult = /* @__PURE__ */ css`
  ${inherit}
  .menu {
    position: fixed;
    inset: auto;
    z-index: 30;
    margin: 0;
    min-width: 240px;
    max-width: calc(100vw - 16px);
    padding: 4px;
    overflow-y: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius-lg, 12px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    box-shadow: var(--mc-shadow-float, 0 4px 16px rgba(0, 0, 0, 0.2));
    font-size: 0.875rem;
    line-height: 1.3;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 12px;
    min-height: var(--mc-hit, 40px);
    padding: 0 12px;
    border-radius: var(--mc-radius, 8px);
    cursor: pointer;
    outline: none;
  }
  .item:hover {
    background: var(--mc-surface-2, #f2f3f5);
  }
  .item:focus-visible {
    background: var(--mc-surface-2, #f2f3f5);
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: -2px;
  }
  .item.danger {
    color: var(--mc-error-ink, #b3261e);
  }
  .item[aria-disabled='true'] {
    opacity: 0.6;
    cursor: default;
  }
  .item[aria-disabled='true']:hover {
    background: transparent;
  }
  .glyph {
    display: inline-flex;
    color: var(--mc-text-2, #5f6368);
  }
  .label {
    flex: 1;
  }
  .item:has(.sub-line) {
    padding-block: 6px;
  }
  .sub-line {
    flex-basis: 100%;
    font-size: 0.75rem;
    color: var(--mc-text-2, #5f6368);
  }
  .keys,
  .why {
    font-size: 0.75rem;
    color: var(--mc-text-2, #5f6368);
  }
  .keys {
    font-family: var(--mc-mono, ui-monospace, monospace);
  }
  .why {
    display: none;
    flex-basis: 100%;
  }
  .item:focus .why {
    display: block;
  }
  .sep {
    height: 1px;
    margin: 4px 0;
    background: var(--mc-divider, rgba(0, 0, 0, 0.12));
  }
  @media (pointer: coarse) {
    .item {
      min-height: var(--mc-hit, 44px);
    }
    .keys {
      display: none;
    }
  }
`;

/* The window rules carry no ${} so the production build can minify them; the shared :host rule joins below. */
const windowCss = /* @__PURE__ */ css`
  dialog {
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius-xl, 16px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    box-shadow: var(--mc-shadow-dialog, 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1));
    width: min(480px, calc(100vw - 32px));
    max-height: min(80vh, 720px);
    overflow: hidden;
  }
  dialog[open] {
    display: flex;
  }
  dialog::backdrop {
    background: var(--mc-scrim, rgba(0, 0, 0, 0.38));
  }
  dialog.size-s {
    width: min(420px, calc(100vw - 32px));
  }
  dialog.size-m {
    width: min(480px, calc(100vw - 32px));
  }
  dialog.size-l {
    width: min(640px, calc(100vw - 32px));
  }
  dialog.size-xl {
    width: min(880px, calc(100vw - 32px));
  }
  .panel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: 100%;
    max-height: inherit;
  }
  dialog.placed .panel {
    height: 100%;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 12px 12px 20px;
    border-bottom: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
  }
  .title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }
  .tool {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius, 8px);
    background: transparent;
    color: var(--mc-text-2, #5f6368);
    cursor: pointer;
  }
  .tool:hover {
    background: var(--mc-surface-2, #f2f3f5);
    color: var(--mc-text, #212121);
  }
  .tool:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: 1px;
  }
  .tool:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background: transparent;
  }
  /* Placement. Once placed, the panel has an explicit size and the body scrolls. */
  .header.movable {
    padding-inline-start: 8px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .header.movable:active {
    cursor: grabbing;
  }
  .move {
    cursor: inherit;
    touch-action: none;
  }
  .resize {
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
    width: 32px;
    height: 32px;
    z-index: 1;
    cursor: nwse-resize;
    touch-action: none;
    border-radius: var(--mc-radius, 8px) 0 var(--mc-radius-xl, 16px) 0;
  }
  dialog.rtl .resize {
    cursor: nesw-resize;
    border-radius: 0 var(--mc-radius, 8px) 0 var(--mc-radius-xl, 16px);
  }
  dialog.rtl .resize svg {
    transform: scaleX(-1);
  }
  .panel.sizable .footer {
    padding-inline-end: 40px;
  }
  .panel.sizable:not(.has-footer) .body {
    padding-bottom: 36px;
  }
  .body {
    min-height: 0;
    padding: 16px 20px;
    overflow: auto;
    overscroll-behavior: contain;
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
  }
  .footer[hidden] {
    display: none;
  }
  /* Phones: a window is never full screen. It keeps its rounded corners and a margin; the sheet variant docks to the bottom edge. */
  @media (max-width: 599px) {
    dialog.sheet {
      width: 100vw;
      max-width: 100vw;
      margin: auto 0 0;
      max-height: 60vh;
      border-radius: var(--mc-radius-xl, 16px) var(--mc-radius-xl, 16px) 0 0;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
  }
  @media (pointer: coarse) {
    .tool {
      width: var(--mc-hit, 44px);
      height: var(--mc-hit, 44px);
    }
    .panel.sizable .footer {
      padding-inline-end: 52px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
    }
  }
`;

export const kitWindowElementCss: CSSResult = /* @__PURE__ */ css`${inherit}${windowCss}`;

export const kitPopoverElementCss: CSSResult = /* @__PURE__ */ css`
  ${inherit}
  .panel {
    position: fixed;
    inset: auto;
    z-index: 30;
    margin: 0;
    max-width: min(360px, calc(100vw - 16px));
    padding: 12px;
    overflow: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius-lg, 12px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    box-shadow: var(--mc-shadow-float, 0 4px 16px rgba(0, 0, 0, 0.2));
  }
`;

/*
 * ui-kit 1.1.0: disclosure row and the tile / chip groups. Same token-with-fallback rule as above.
 * The groups wrap at every width without media queries (auto-fill with a percentage floor), so 320 px and 200 %
 * zoom show two tiles or three chips per row and never scroll sideways (Chromium 85 has no container queries).
 */
export const kitDisclosureElementCss: CSSResult = /* @__PURE__ */ css`
  ${inherit}
  .head {
    margin: 0;
    font: inherit;
  }
  .btn {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 10px;
    width: 100%;
    min-height: var(--mc-hit, 40px);
    padding: 6px 4px;
    border: 0;
    border-radius: var(--mc-radius, 8px);
    background: transparent;
    color: var(--mc-text, #212121);
    font: inherit;
    font-weight: 600;
    text-align: start;
    cursor: pointer;
  }
  @media (hover: hover) {
    .btn:hover {
      background: var(--mc-surface-2, #f2f3f5);
    }
  }
  .btn:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: 2px;
  }
  .title {
    flex: 0 0 auto;
    max-width: 100%;
    overflow-wrap: anywhere;
  }
  .sum {
    flex: 1 1 8rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--mc-text-2, #5f6368);
    font-size: 0.8125rem;
    font-weight: 400;
  }
  .chev {
    flex: none;
    width: 20px;
    height: 20px;
    margin-inline-start: auto;
    color: var(--mc-text-2, #5f6368);
    transition: transform 0.15s ease-out;
  }
  [aria-expanded='true'] .chev {
    transform: rotate(180deg);
  }
  .body {
    display: grid;
    gap: 16px;
    padding: 4px 4px 12px;
  }
  .body[hidden] {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .chev {
      transition: none;
    }
  }
`;

export const kitChoiceGroupElementCss: CSSResult = /* @__PURE__ */ css`
  ${inherit}
  .group {
    display: grid;
    gap: 8px;
    padding: 2px;
  }
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(104px, 45%), 1fr));
    gap: 8px;
  }
  .chip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(88px, 30%), 1fr));
    gap: 8px;
  }
  .opt {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 4px;
    min-width: 0;
    min-height: 44px;
    padding: 8px 6px;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    font: inherit;
    font-size: 0.8125rem;
    line-height: 1.25;
    text-align: center;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  .chip-grid .opt {
    min-height: 88px;
  }
  @media (hover: hover) {
    .opt:hover {
      border-color: var(--mc-field-border, #8a8f98);
    }
  }
  .opt[aria-pressed='true'] {
    border-color: var(--mc-accent, #03a9f4);
    box-shadow: inset 0 0 0 1px var(--mc-accent, #03a9f4);
    background: var(--mc-accent-tint, #e6f4fb);
  }
  .opt:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: 2px;
  }
  .pv {
    display: grid;
    place-items: center;
    max-width: 100%;
  }
  .pv svg {
    max-width: 100%;
    height: auto;
  }
  .desc {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--mc-text-2, #5f6368);
  }
  @media (pointer: coarse) {
    .opt {
      min-height: var(--mc-hit, 44px);
    }
    .chip-grid .opt {
      min-height: 88px;
    }
  }
`;
