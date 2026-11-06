import { css, type CSSResult } from 'lit';
import { editorTokens } from './editor-system';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { editorLegacy } from '../ui-kit/css/legacy';
import { rtlSheet } from '../ui-kit/css/rtl';

/** The card editor's stylesheet stack: Core's tokens, the ui-kit primitives and the legacy mc-* sheet. */

/** The chosen segment: bold, with a 3 px accent underline, so it does not rest on a faint fill and a hue alone (WCAG 1.4.1, 1.4.11). */
const segChosen = css`
  :host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}
`;

export const editorSystem: CSSResult[] = [editorTokens, editorPrimitives, editorLegacy, segChosen, rtlSheet];
