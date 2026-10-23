import { unsafeCSS } from 'lit';

/*
 * Rules for the tab_ design keys (tabs-look.ts). Each one is gated on a token of `data-mc-tab`, so a tabs module
 * without those keys matches none of them. [data-style] is always set on .mc-tabs; it lifts the selectors to the
 * specificity of the style variants in the card sheet, which this sheet follows. The sheet is built from constants
 * only, no config text reaches it.
 */

const BAR = ' .mc-tabs-header';
const TAB = ' .mc-tab-button';
const ACTIVE = `${TAB}.active`;
const ICON = `${TAB} ha-icon,.mc-tabs[data-style][data-mc-tab~='icon-size']${TAB} mc-svg-icon`;
const CONTENT = ' .mc-tabs-content';
const DIRECT = `${TAB}:not(.active)`;

/** Rules gated on one token: [token, descendant selector, declarations]. */
const RULES: ReadonlyArray<readonly [string, string, string]> = [
  ['bar-bg', BAR, 'background:var(--mc-tb-bg)'],
  ['bar-pad', BAR, 'padding:var(--mc-tb-pad)'],
  ['gap', BAR, 'gap:var(--mc-tb-gap)'],
  ['align-center', BAR, 'justify-content:center'],
  ['align-end', BAR, 'justify-content:flex-end'],
  ['align-stretch', TAB, 'flex:1 1 auto'],
  ['bottom', BAR, 'margin-top:var(--mc-gap-sm);margin-bottom:0;border-bottom:none;border-top:1px solid var(--mc-border)'],
];

/** Same shape, written out where the selector is not just a token: the pills / underline variants. */
const VARIANTS: ReadonlyArray<readonly [string, string, string]> = [
  ["[data-style='pills'][data-mc-tab~='bottom']", BAR, 'border-top:none'],
  ["[data-style='underline'][data-mc-tab~='bottom']", BAR, 'border-top-width:2px'],
];

const MORE: ReadonlyArray<readonly [string, string, string]> = [
  ['bar-border', BAR, 'border:var(--mc-tb-bw,1px) solid var(--mc-tb-bc,var(--mc-border))'],
  ['color', DIRECT, 'color:var(--mc-tt-c)'],
  ['bg', DIRECT, 'background:var(--mc-tt-bg)'],
  ['border', TAB, 'border:var(--mc-tt-bw,1px) solid var(--mc-tt-bc,var(--mc-border))'],
];

const TAIL: ReadonlyArray<readonly [string, string, string]> = [
  ['indicator', ACTIVE, 'border-bottom-color:var(--mc-tt-ind)'],
  ['active-color', ACTIVE, 'color:var(--mc-tt-ac)'],
  ['active-bg', ACTIVE, 'background:var(--mc-tt-abg)'],
  ['radius', TAB, 'border-radius:var(--mc-tt-r)'],
  ['pad', TAB, 'padding:var(--mc-tt-pad);min-width:24px;min-height:24px'],
  ['family', TAB, 'font-family:var(--mc-tt-ff)'],
  ['size', TAB, 'font-size:var(--mc-tt-fs)'],
  ['weight', TAB, 'font-weight:var(--mc-tt-fw)'],
  ['transform', TAB, 'text-transform:var(--mc-tt-tt)'],
  ['icon-flex', TAB, 'display:inline-flex;align-items:center;justify-content:center;gap:var(--mc-gap-xs)'],
  ['icon-right', TAB, 'flex-direction:row-reverse'],
  ['icon-above', TAB, 'flex-direction:column'],
  ['icon-below', TAB, 'flex-direction:column-reverse'],
  ['icon-size', ICON, '--mdc-icon-size:var(--mc-tt-is)'],
  ['anim-fade', CONTENT, 'animation:mc-tabs-fade .2s ease-out'],
  ['anim-slide', CONTENT, 'animation:mc-tabs-slide .2s ease-out'],
];

const gated = (rules: ReadonlyArray<readonly [string, string, string]>): string =>
  rules.map(([token, tail, decl]) => `.mc-tabs[data-style][data-mc-tab~='${token}']${tail}{${decl}}`).join('');
const variants = VARIANTS.map(([sel, tail, decl]) => `.mc-tabs${sel}${tail}{${decl}}`).join('');

// Pills and underline keep their own bottom line and indicator when every tab has a border.
const BORDER_EDGE =
  `.mc-tabs[data-style='underline'][data-mc-tab~='bar-border']${BAR}{border-width:var(--mc-tb-bw,2px)}` +
  `.mc-tabs[data-style='default'][data-mc-tab~='border']${TAB},.mc-tabs[data-style='underline'][data-mc-tab~='border']${TAB}{border-bottom:2px solid transparent}` +
  `.mc-tabs[data-style='underline'][data-mc-tab~='border']${TAB}{border-bottom-width:3px}` +
  `.mc-tabs[data-style='default'][data-mc-tab~='border']${ACTIVE},.mc-tabs[data-style='underline'][data-mc-tab~='border']${ACTIVE}{border-bottom-color:var(--mc-primary)}`;

const PILL_FILL = `.mc-tabs[data-style='pills'][data-mc-tab~='indicator']${ACTIVE}{background:var(--mc-tt-ind)}`;

const MOTION =
  '@keyframes mc-tabs-fade{from{opacity:0}}' +
  '@keyframes mc-tabs-slide{from{opacity:0;transform:translateX(12px)}}' +
  `@media (prefers-reduced-motion:reduce){.mc-tabs[data-style][data-mc-tab]${CONTENT}{animation:none}}`;

// The order matters: equal specificity, the later rule wins.
export const tabsStyles = unsafeCSS(gated(RULES) + variants + gated(MORE) + BORDER_EDGE + gated(TAIL.slice(0, 1)) + PILL_FILL + gated(TAIL.slice(1)) + MOTION);
