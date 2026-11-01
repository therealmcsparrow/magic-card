import { css, CSSResult } from 'lit';
import { kitRow } from './rows';
import { kitSlider } from './slider';

// Kit parts that the card editor does not have, derived from its tokens; not in editorSystem, a screen adds them with `kitCss`.

/**
 * The geometry and motion tokens the kit owns (contract KIT_SCOPED_TOKENS). Declared on :host like editorTokens, no
 * colours, so a screen can still override them on its own :host. First in kitCss. Elements and parts that can sit
 * in a root without this part read them with the same literal as fallback.
 */
export const kitTokens: CSSResult = /* @__PURE__ */ css`
  :host {
    --mc-hit-sm: 32px;
    --mc-hit-xs: 24px;
    --mc-radius-tag: 6px;
    --mc-radius-seg: 10px;
    --mc-radius-xl: 16px;
    --mc-ease: 0.15s ease-out;
    --mc-shadow-dialog: 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  @media (pointer: coarse) {
    :host {
      --mc-hit-sm: 44px;
      --mc-hit-xs: 44px;
    }
  }
`;

export const kitButtonExtras: CSSResult = /* @__PURE__ */ css`
  svg.gl {
    display: block;
    flex: none;
  }
  .btn-danger {
    background: var(--mc-error-fill);
    color: var(--mc-on-accent);
  }
  .btn-danger:hover {
    box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
  }
  .btn-danger:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
  .btn[aria-pressed='true'] {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
    border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
  }
  .icon-btn[aria-pressed='true'] {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }
  /* unavailable for now, still focusable; the reason is visible text next to it */
  .btn[aria-disabled='true'],
  .icon-btn[aria-disabled='true'] {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
  /* in-row button: 24 square, borderless (list and tree rows) */
  .icon-btn.xs {
    width: var(--mc-hit-xs, 24px);
    height: var(--mc-hit-xs, 24px);
    border-radius: var(--mc-radius-tag, 6px);
    gap: 0;
    --mdc-icon-size: 16px;
  }
  @media (pointer: coarse) {
    .icon-btn.xs {
      width: var(--mc-hit, 44px);
      height: var(--mc-hit, 44px);
    }
  }
`;

export const kitChipExtras: CSSResult = /* @__PURE__ */ css`
  .chip.is-error {
    color: var(--mc-error-ink);
    border-color: color-mix(in srgb, var(--mc-error-ink) 40%, transparent);
    background: var(--mc-error-tint);
  }
`;

export const kitNotice: CSSResult = /* @__PURE__ */ css`
  .notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    font-size: 0.8125rem;
    color: var(--mc-text);
  }
  .notice > .gl,
  .notice > ha-icon {
    flex: none;
    --mdc-icon-size: 20px;
  }
  .notice .body {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 6px;
  }
  .notice .body p {
    margin: 0;
  }
  .notice .body strong {
    font-weight: 500;
  }
  .notice .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .notice.info {
    background: var(--mc-accent-tint);
    border-color: color-mix(in srgb, var(--mc-accent) 35%, transparent);
  }
  .notice.info > .gl,
  .notice.info > ha-icon {
    color: var(--mc-accent-ink);
  }
  .notice.success {
    background: var(--mc-success-tint);
    border-color: color-mix(in srgb, var(--mc-success-ink) 35%, transparent);
  }
  .notice.success > .gl,
  .notice.success > ha-icon {
    color: var(--mc-success-ink);
  }
  .notice.warn {
    background: var(--mc-warn-tint);
    border-color: color-mix(in srgb, var(--mc-warn-ink) 35%, transparent);
  }
  .notice.warn > .gl,
  .notice.warn > ha-icon {
    color: var(--mc-warn-ink);
  }
  .notice.error {
    background: var(--mc-error-tint);
    border-color: color-mix(in srgb, var(--mc-error-ink) 35%, transparent);
  }
  .notice.error > .gl,
  .notice.error > ha-icon {
    color: var(--mc-error-ink);
  }
`;

export const kitTile: CSSResult = /* @__PURE__ */ css`
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));
    gap: 8px;
    padding: 2px;
  }
  .tile {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 4px;
    min-width: 0;
    padding: 8px 6px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    font-size: 0.8125rem;
    text-align: center;
    transition: border-color 0.15s ease-out, background-color 0.15s ease-out;
  }
  .tile:hover {
    border-color: color-mix(in srgb, var(--mc-accent) 60%, transparent);
  }
  .tile[aria-pressed='true'],
  .tile[aria-checked='true'] {
    border-color: var(--mc-accent);
    background: var(--mc-accent-tint);
  }
  .tile .thumb {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 6px;
    background: var(--mc-canvas);
    overflow: hidden;
  }
  .tile .meta {
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .tile.glyph-only {
    min-height: 56px;
    align-content: center;
  }
`;

export const kitCheck: CSSResult = /* @__PURE__ */ css`
  .check {
    appearance: none;
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    border: 2px solid var(--mc-field-border);
    border-radius: 5px;
    background: var(--mc-surface);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
  }
  .check:checked,
  .check:indeterminate {
    border-color: var(--mc-accent-fill);
    background: var(--mc-accent-fill);
  }
  .check:checked::after {
    content: '';
    width: 10px;
    height: 5px;
    border: solid var(--mc-on-accent);
    border-width: 0 0 2px 2px;
    transform: translateY(-1px) rotate(-45deg);
  }
  .check:indeterminate::after {
    content: '';
    width: 10px;
    height: 2px;
    background: var(--mc-on-accent);
  }
  .check:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const kitToolbar: CSSResult = /* @__PURE__ */ css`
  .toolbar {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-seg, 10px);
    background: var(--mc-surface);
    box-shadow: var(--mc-shadow-float);
  }
  .toolbar [role='separator'] {
    align-self: stretch;
    width: 1px;
    margin: 4px;
    background: var(--mc-divider);
  }
  /* vertical tool rail: 56 wide, one column of icon buttons, a horizontal rule for a divider */
  .rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 56px;
    padding: 8px 0;
    background: var(--mc-surface);
    border-right: 1px solid var(--mc-divider);
    border-inline-width: 0 1px;
    border-inline-style: solid;
    border-inline-color: var(--mc-divider);
    overflow-y: auto;
  }
  .rail [role='separator'][aria-orientation='horizontal'] {
    width: 24px;
    height: 1px;
    margin: 4px 0;
    background: var(--mc-divider);
  }
  /* an icon button on the float toolbar and the rail is borderless; the pressed tool shows the accent tint */
  .toolbar .icon-btn,
  .rail .icon-btn {
    border-radius: var(--mc-radius);
  }
  .toolbar .icon-btn.sm {
    width: var(--mc-hit-sm, 32px);
    height: var(--mc-hit-sm, 32px);
  }
  .toolbar .btn-sm {
    border-color: transparent;
    background: transparent;
  }
  .toolbar .btn-sm:hover {
    background: var(--mc-surface-2);
  }
  @media (max-width: 799px) {
    .rail {
      flex-direction: row;
      width: auto;
      border-right: 0;
      border-inline: 0;
      border-bottom: 1px solid var(--mc-divider);
      padding: 0 8px;
      overflow-x: auto;
    }
    .rail [role='separator'][aria-orientation='horizontal'] {
      width: 1px;
      height: 24px;
      margin: 0 4px;
    }
  }
`;

/** Full-screen layer header: 56 high, Surface, Divider under it. */
export const kitTopbar: CSSResult = /* @__PURE__ */ css`
  .topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    min-height: 56px;
    padding: 8px 16px;
    background: var(--mc-surface);
    border-bottom: 1px solid var(--mc-divider);
    position: relative;
    z-index: 6;
  }
  .topbar .title {
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  .topbar .name {
    width: 180px;
    max-width: 40vw;
    min-width: 0;
  }
  .topbar .spacer {
    flex: 1;
  }
`;

/** Panel headings: plain (.group-head in editorPrimitives) and the collapsible head that wraps .sector-btn. */
export const kitSectionHead: CSSResult = /* @__PURE__ */ css`
  .sector-head {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }
  .sector-head > .sector-btn {
    border-radius: var(--mc-radius-lg);
    font-size: 0.875rem;
  }
  .group-head h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    flex: 1;
  }
`;

/** Every part the card editor lacks. A screen: static styles = [editorTokens, editorPrimitives, kitCss, own layout css]. */
export const kitCss: CSSResult[] = [kitTokens, kitButtonExtras, kitChipExtras, kitNotice, kitTile, kitCheck, kitToolbar, kitTopbar, kitSectionHead, kitRow, kitSlider];
