import { css, unsafeCSS, type CSSResult } from 'lit';

/**
 * Right-to-left rules, selected on the `dir` attribute that DirectionController reflects on the host (:dir() is
 * above the browser floor). Glyphs marked 'mirror' flip; code fields keep reading left to right.
 */
export const rtlSheet: CSSResult = css`
  :host([dir='rtl']) .gl[data-dir='mirror'] {
    transform: scaleX(-1);
  }
  :host .mono,
  :host textarea.mono,
  :host input.mono,
  :host code,
  :host pre {
    direction: ltr;
    unicode-bidi: isolate;
  }
`;

export type InlineSideProp = 'margin' | 'padding' | 'inset';

/**
 * Declarations for one inline pair that lay out left to right in Chromium 85 and 86 (which lack the two-value logical
 * shorthands) and mirror elsewhere: the physical sides first, the logical shorthand after them in the same rule.
 * `start` and `end` are CSS values.
 */
export function inlineSides(prop: InlineSideProp, start: string, end: string): CSSResult {
  const [a, b] = prop === 'inset' ? ['left', 'right'] : [`${prop}-left`, `${prop}-right`];
  const logical = prop === 'inset' ? 'inset-inline' : `${prop}-inline`;
  return unsafeCSS(`${a}:${start};${b}:${end};${logical}:${start} ${end};`);
}
