import { unsafeCSS } from 'lit';
import { TAB_FIELDS } from './tabs-look';

/*
 * Rules for the tab_ design keys (tabs-look.ts). Each one is gated on a token of `data-mc-tab`, so a tabs module
 * without those keys matches none of them. [data-style] is always set on .mc-tabs; it lifts the selectors to the
 * specificity of the style variants in the card sheet, which this sheet follows. The sheet is built from constants
 * only, no config text reaches it.
 */

// Child combinators: a tabs module nested in a tab never takes the look of the one around it.
const BAR = '>.mc-tabs-header';
const TAB = `${BAR}>.mc-tab-button`;
const ACTIVE = `${TAB}.active`;
const CONTENT = '>.mc-tabs-content';
const DIRECT = `${TAB}:not(.active)`;
const DISABLED = `${TAB}[aria-disabled='true']`;
const HOVERED = `${TAB}:hover:not(.active):not([aria-disabled='true'])`;
/** The studio sets this on one tab to show the Hover look without a pointer. */
const FORCED = `${TAB}[data-mc-force='hover']:not(.active):not([aria-disabled='true'])`;
/** The studio sets this on one tab to show the Disabled look; the tab's own aria-disabled is never written. */
const FORCED_OFF = `${TAB}[data-mc-force='disabled']:not(.active)`;
/** The icon element of a tab: <ha-icon>, or <mc-svg-icon> when it draws effects or an own icon. */
const ICONS = (sel: string): string[] => [`${sel} ha-icon`, `${sel} mc-svg-icon`];

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
  ['bar-border', BAR, 'border-style:solid;border-width:var(--mc-tb-bw,1px);border-color:var(--mc-tb-bc,var(--mc-border))'],
  ['color', DIRECT, 'color:var(--mc-tt-c)'],
  ['bg', DIRECT, 'background:var(--mc-tt-bg)'],
  ['border', TAB, 'border-style:var(--mc-tt-bs,solid);border-width:var(--mc-tt-bw,1px);border-color:var(--mc-tt-bc,var(--mc-border))'],
];

const TAIL: ReadonlyArray<readonly [string, string, string]> = [
  ['opacity', TAB, 'opacity:var(--mc-tt-o)'],
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
  ['spacing', TAB, 'letter-spacing:var(--mc-tt-ls)'],
  ['shadow', TAB, 'box-shadow:var(--mc-tt-sh)'],
  ['anim-fade', CONTENT, 'animation:var(--mc-tt-an) .2s ease-out'],
  ['anim-slide', CONTENT, 'animation:var(--mc-tt-an) .2s ease-out'],
];

const gated = (rules: ReadonlyArray<readonly [string, string, string]>): string =>
  rules.map(([token, tail, decl]) => `.mc-tabs[data-style][data-mc-tab~='${token}']${tail}{${decl}}`).join('');
/** One rule on several selectors, each gated on the same token. */
const gatedAll = (token: string, selectors: string[], decl: string): string =>
  `${selectors.map((sel) => `.mc-tabs[data-style][data-mc-tab~='${token}']${sel}`).join(',')}{${decl}}`;
const ICON_RULES = gatedAll('icon-size', ICONS(TAB), '--mdc-icon-size:var(--mc-tt-is)') + gatedAll('icon-color', ICONS(TAB), 'color:var(--mc-tt-ic)');
const variants = VARIANTS.map(([sel, tail, decl]) => `.mc-tabs${sel}${tail}{${decl}}`).join('');

// The line of the active tab is its own border (tab_active.tab_border_color); a tab border that is set is the same on every side.
const BORDER_EDGE = `.mc-tabs[data-style='underline'][data-mc-tab~='bar-border']${BAR}{border-width:var(--mc-tb-bw,2px)}`;

/** What each field of TAB_FIELDS sets on a state (`p`: h, a or d); `icon` ones go on the tab's icon element. */
const STATE_DECLS: Record<string, (p: string) => string> = {
  c: (p) => `color:var(--mc-t${p}-c)`,
  bg: (p) => `background:var(--mc-t${p}-bg)`,
  bc: (p) => `border-color:var(--mc-t${p}-bc)`,
  // a width needs a style to show; the base look's style, else solid
  bw: (p) => `border-width:var(--mc-t${p}-bw);border-style:var(--mc-t${p}-bs,var(--mc-tt-bs,solid))`,
  bs: (p) => `border-style:var(--mc-t${p}-bs)`,
  r: (p) => `border-radius:var(--mc-t${p}-r)`,
  pad: (p) => `padding:var(--mc-t${p}-pad);min-width:24px;min-height:24px`,
  ff: (p) => `font-family:var(--mc-t${p}-ff)`,
  fs: (p) => `font-size:var(--mc-t${p}-fs)`,
  fw: (p) => `font-weight:var(--mc-t${p}-fw)`,
  tt: (p) => `text-transform:var(--mc-t${p}-tt)`,
  ls: (p) => `letter-spacing:var(--mc-t${p}-ls)`,
  ic: (p) => `color:var(--mc-t${p}-ic)`,
  is: (p) => `--mdc-icon-size:var(--mc-t${p}-is)`,
  sh: (p) => `box-shadow:var(--mc-t${p}-sh)`,
  o: (p) => `opacity:var(--mc-t${p}-o)`,
};
const ON_ICON = new Set(['ic', 'is']);

/** The look of one tab state, one rule per token; the state's `name` is h, a or d. */
const stateRules = (selector: string, p: string, name: string): string =>
  TAB_FIELDS.map(([, , suffix, , token]) =>
    gatedAll(`${name}-${token}`, ON_ICON.has(suffix) ? ICONS(selector) : [selector], STATE_DECLS[suffix](p)),
  ).join('');

// A disabled tab is dimmed and shows no pointer or press movement, with or without a tab_ key; tab_disabled.tab_opacity replaces the dimming.
const DIM = `.mc-tabs[data-style]${DISABLED}{opacity:.5;cursor:default;transform:none}.mc-tabs[data-style]${FORCED_OFF}{opacity:.5;cursor:default;transform:none}`;
// Hover only where there is a pointer.
// Its animations (tabs-anim.ts) play on top of the tab's own list; the leaked lists of the module around are reset.
const ANIM_RESET = `.mc-tabs[data-style][data-mc-tab~='tab-anim']${TAB}{--mc-anim-m:none;--mc-anim-i:none;--mc-anim-n:none}`;
const HOVER_ANIM =
  gatedAll('h-anim', [HOVERED], 'animation:var(--mc-anim-m,none),var(--mc-th-anim-m,none);transform-origin:var(--mc-th-anim-om,center)') +
  gatedAll('h-anim-i', [`${HOVERED} .mc-anim-icon`], 'display:inline-block;animation:var(--mc-anim-i,none),var(--mc-th-anim-i,none);transform-origin:var(--mc-th-anim-oi,center)') +
  gatedAll('h-anim-n', [`${HOVERED} [data-mc-part='name']`], 'display:inline-block;animation:var(--mc-anim-n,none),var(--mc-th-anim-n,none);transform-origin:var(--mc-th-anim-on,center)');
// A visitor who asks for less motion gets none of it.
const HOVER = `${ANIM_RESET}@media (hover:hover){${stateRules(HOVERED, 'h', 'h')}}${stateRules(FORCED, 'h', 'h')}@media (hover:hover) and (prefers-reduced-motion:no-preference){${HOVER_ANIM}}`;
// The keyboard focus ring follows the active tab's border, then its text, then the tab border colour.
const FOCUS = `.mc-tabs[data-style]${TAB}:focus-visible{outline-color:var(--mc-ta-fc,var(--mc-ta-bc,var(--mc-ta-c,var(--mc-tt-fc,var(--mc-tt-bc,var(--mc-primary))))))}`;

// A tab switch flips the animation name (-0 / -1, set by the view), which restarts it without rebuilding the panel.
const KEYFRAMES = [0, 1]
  .map((n) => `@keyframes mc-tabs-fade-${n}{from{opacity:0}}@keyframes mc-tabs-slide-${n}{from{opacity:0;transform:translateX(12px)}}`)
  .join('');

// Every variable a rule reads would otherwise reach a nested tabs module through inheritance.
const NESTED_VARS = [
  '--mc-tb-bw', '--mc-tb-bc', '--mc-tb-bg', '--mc-tb-pad', '--mc-tb-gap',
  '--mc-tt-an', '--mc-tt-fc', '--mc-th-fc', '--mc-ta-fc', '--mc-td-fc',
  ...['tt', 'th', 'ta', 'td'].flatMap((p) => TAB_FIELDS.map((f) => `--mc-${p}-${f[2]}`)),
  ...['m', 'i', 'n', 'om', 'oi', 'on'].map((k) => `--mc-th-anim-${k}`),
];
const NESTED = `.mc-tabs[data-mc-tab] .mc-tabs{${NESTED_VARS.map((v) => `${v}:initial`).join(';')}}`;

const MOTION =
  KEYFRAMES +
  `@media (prefers-reduced-motion:reduce){.mc-tabs[data-style][data-mc-tab]${CONTENT}{animation:none}}`;

// The Typography keys of the design sit on the tab bar (tabTypeStyle); the tab button inherits them.
// The underline style's weights (card sheet) give way to tab_font_weight, then to a font weight of the design.
const UNDERLINE = (sel: string, weight: number): string =>
  `.mc-tabs[data-style='underline'][data-mc-tab~='type']${sel}{font-weight:var(--mc-tt-fw,var(--mc-design-font-weight,${weight}))}`;
const TYPE =
  gated([
    [
      'type',
      TAB,
      'font:inherit;text-transform:inherit;letter-spacing:inherit;text-align:inherit;word-spacing:inherit;text-indent:inherit;text-shadow:inherit;text-decoration:inherit;text-overflow:inherit',
    ],
  ]) +
  UNDERLINE(TAB, 500) +
  UNDERLINE(ACTIVE, 700);

// A gradient colour of the design (--mc-text-paint on the tab bar) paints the tab labels, as it paints the text of other modules.
// The tab buttons paint the gradient themselves, so a tab_ bar background stays under them. The active pill has a background of its own and keeps the plain text colour.
const PAINT =
  '@supports (-webkit-background-clip:text){.mc-tabs-header[style*=--mc-text-paint] .mc-tab-button{background-image:var(--mc-text-paint);-webkit-background-clip:text;-webkit-text-fill-color:transparent}' +
  '[data-style=pills] .mc-tab-button.active{-webkit-text-fill-color:currentcolor}}';

// The order matters: equal specificity, the later rule wins. Base, then hover, active, disabled.
export const tabsStyles = unsafeCSS(
  gated(RULES) + variants + gated(MORE) + BORDER_EDGE + TYPE + gated(TAIL) + ICON_RULES + DIM + HOVER + stateRules(ACTIVE, 'a', 'a') + stateRules(DISABLED, 'd', 'd') + stateRules(FORCED_OFF, 'd', 'd') + FOCUS + NESTED + MOTION + PAINT,
);
