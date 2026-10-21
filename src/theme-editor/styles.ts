import { css } from 'lit';
import type { CSSResult } from 'lit';
import { editorTokens } from '../css/editor-system';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { kitButtonExtras, kitChipExtras, kitCheck, kitNotice, kitTokens } from '../ui-kit/css/extras';

/*
 * The theme editor's stylesheet (contract theme-editor 1.2.0, ui-kit 1.0.0). The base is the kit: Core's
 * `editorTokens`, the card editor's primitives and the kit parts this screen uses, so buttons, fields, chips, the
 * segmented control and notices look exactly as they do in the card editor. What stays here: the fixed accent (a token
 * override, below) and a few layout rules the kit has no part for. Colour comes only from Home Assistant theme variables.
 */

/*
 * The editor's own accent: fixed, so it never follows HA's or the draft's primary colour. It overrides the
 * accent tokens of `editorTokens` directly on :host; --mc-focus and the selection colours derive from --mc-accent.
 */
export const themeAccent: CSSResult = css`
  :host {
    --mc-accent: #0276ab;
    --mc-accent-ink: color-mix(in srgb, #0276ab 60%, var(--primary-text-color, #212121));
    --mc-accent-fill: #0276ab;
    --mc-accent-tint: color-mix(in srgb, #0276ab 12%, transparent);
  }
`;

const local: CSSResult = css`
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  .help {
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .help.error {
    display: flex;
    gap: 6px;
    align-items: flex-start;
  }
  .help.error .gl {
    margin-top: 1px;
  }
  a.btn {
    text-decoration: none;
  }
  /* what goes into an <mc-ui-window>: the body is a grid, the footer's buttons join the window's own footer row */
  .dlg {
    display: grid;
    gap: 16px;
  }
  .dlg-form,
  .foot {
    display: contents;
  }
  .notice .title {
    font-weight: 500;
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
  /* the kit's selected segment is a raised pill; forced colours drop shadows and tints, so it needs a system colour */
  @media (forced-colors: active) {
    .seg button:is([aria-checked='true'], [aria-selected='true']) {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
    }
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
`;

export const base: CSSResult[] = [editorTokens, editorPrimitives, kitTokens, kitButtonExtras, kitChipExtras, kitNotice, kitCheck, themeAccent, local];
