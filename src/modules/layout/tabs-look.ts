import { cssLengths, safeColor, str, unitOpacity } from '../../utils/safe-css';

/*
 * The tab_ design keys of a tabs module as custom properties plus `data-mc-tab` tokens. Every value
 * is checked against its own grammar and rebuilt from the parsed parts; the tokens are constants of this file,
 * never text from the config. tabs-styles.ts holds the rules that read them.
 */

export interface TabLook {
  /** Custom properties for the `.mc-tabs` element (only the keys that passed). */
  vars: Record<string, string>;
  /** Tokens for its `data-mc-tab` attribute. */
  tokens: string[];
}

const COLOURS: ReadonlyArray<readonly [string, string, string]> = [
  ['tab_bar_background', '--mc-tb-bg', 'bar-bg'],
  ['tab_bar_border_color', '--mc-tb-bc', 'bar-border'],
  ['tab_color', '--mc-tt-c', 'color'],
  ['tab_background', '--mc-tt-bg', 'bg'],
  ['tab_border_color', '--mc-tt-bc', 'border'],
];

/** key, property, token, most lengths, largest number, whether a percentage is allowed */
const LENGTHS: ReadonlyArray<readonly [string, string, string, number, number, boolean]> = [
  ['tab_bar_border_width', '--mc-tb-bw', 'bar-border', 1, 32, false],
  ['tab_bar_padding', '--mc-tb-pad', 'bar-pad', 4, 256, true],
  ['tab_gap', '--mc-tb-gap', 'gap', 1, 256, true],
  ['tab_border_width', '--mc-tt-bw', 'border', 1, 32, false],
  ['tab_radius', '--mc-tt-r', 'radius', 4, 999, true],
  ['tab_padding', '--mc-tt-pad', 'pad', 4, 256, true],
  ['tab_font_size', '--mc-tt-fs', 'size', 1, 512, true],
  ['tab_icon_size', '--mc-tt-is', 'icon-size', 1, 256, false],
];

/** key, accepted words, property, token */
const WORDS: ReadonlyArray<readonly [string, RegExp, string, string]> = [
  ['tab_font_weight', /^(?:normal|bold|[1-9]00)$/, '--mc-tt-fw', 'weight'],
  ['tab_text_transform', /^(?:none|uppercase|lowercase|capitalize)$/, '--mc-tt-tt', 'transform'],
];

/** The keys of one tab state (tab_active, tab_disabled, design.hover): key, property suffix, token suffix. */
const STATE_KEYS: ReadonlyArray<readonly [string, string, string]> = [
  ['tab_color', 'c', 'color'],
  ['tab_background', 'bg', 'bg'],
  ['tab_border_color', 'bc', 'border'],
  ['tab_font_weight', 'fw', 'weight'],
  ['tab_opacity', 'o', 'opacity'],
];
/** The design object that holds each state, and its prefix: --mc-t{a,h,d}-*, tokens a-*, h-*, d-*. */
const STATES: ReadonlyArray<readonly [string, string]> = [
  ['hover', 'h'],
  ['tab_active', 'a'],
  ['tab_disabled', 'd'],
];
const WEIGHT = /^(?:normal|bold|[1-9]00)$/;

/** Read as aliases of tab_active.tab_color, .tab_background and .tab_border_color (the border is the fill for Pills). */
const LEGACY = ['tab_active_color', 'tab_active_background', 'tab_indicator_color'] as const;

const FAMILY = /^(?:[\w -]+|"[\w -]+"|'[\w -]+')$/;
const FAMILY_MAX = 128;

/** Keyword keys: the word is the token suffix; the first word of each list is the default and adds no token. */
const CHOICES: ReadonlyArray<readonly [string, string, readonly string[]]> = [
  ['tab_bar_position', '', ['top', 'bottom']],
  ['tab_align', 'align-', ['start', 'center', 'end', 'stretch']],
  ['tab_icon_position', 'icon-', ['left', 'right', 'above', 'below']],
  ['tab_animation', 'anim-', ['none', 'fade', 'slide']],
];

/** The flat design keys this file reads (the old active and indicator keys are in LEGACY_TAB_KEYS). */
export const TAB_KEYS: readonly string[] = [
  ...COLOURS.map((c) => c[0]),
  'tab_opacity',
  'tab_disabled_tabs',
  ...LENGTHS.map((c) => c[0]),
  ...WORDS.map((c) => c[0]),
  ...CHOICES.map((c) => c[0]),
  'tab_font_family',
];

/** The keys of a tab state object. */
export const TAB_STATE_KEYS: readonly string[] = STATE_KEYS.map((k) => k[0]);
export const LEGACY_TAB_KEYS: readonly string[] = LEGACY;

const word = (v: unknown): string => (typeof v === 'number' && Number.isFinite(v) ? String(v) : str(v)?.toLowerCase() ?? '');

/** A colour the browser also accepts as a colour (where it can tell), never one with a function outside the allow-list. */
function colour(v: unknown): string | undefined {
  const c = safeColor(v);
  return c && (typeof CSS === 'undefined' || typeof CSS.supports !== 'function' || CSS.supports('color', c)) ? c : undefined;
}

function length(v: unknown, most: number, max: number, pct: boolean): string | undefined {
  const s = cssLengths(v, most);
  return s && s.split(' ').every((t) => parseFloat(t) <= max && (pct || !t.endsWith('%'))) ? s : undefined;
}

const plain = (v: unknown): Record<string, unknown> | undefined => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined);

/**
 * `phase`: the active tab's index, so a switch alternates the animation name and restarts it.
 * `style`: the tab style, for the Pills reading of the old indicator colour.
 */
export function tabLook(design: unknown, phase = 0, style = 'default'): TabLook {
  const vars: Record<string, string> = {};
  const tokens = new Set<string>();
  const d = plain(design) ?? {};
  const put = (prop: string, value: string, token: string): void => {
    vars[prop] = value;
    tokens.add(token);
  };
  for (const [key, prop, token] of COLOURS) {
    const c = colour(d[key]);
    if (c) put(prop, c, token);
  }
  for (const [key, prop, token, most, max, pct] of LENGTHS) {
    const l = length(d[key], most, max, pct);
    if (l) put(prop, l, token);
  }
  for (const [key, re, prop, token] of WORDS) {
    const w = word(d[key]);
    if (re.test(w)) put(prop, w, token);
  }
  const family = str(d.tab_font_family);
  const names = family && family.length <= FAMILY_MAX ? family.split(',').map((n) => n.trim()) : [];
  if (names.length && names.every((n) => FAMILY.test(n))) put('--mc-tt-ff', names.join(', '), 'family');
  for (const [key, prefix, words] of CHOICES) {
    const w = word(d[key]);
    if (w !== words[0] && words.includes(w)) tokens.add(prefix + w);
  }
  const o = unitOpacity(d.tab_opacity);
  if (o !== undefined) put('--mc-tt-o', String(o), 'opacity');
  for (const [obj, p] of STATES) {
    const st = { ...plain(d[obj]) };
    if (obj === 'tab_active') {
      // the new keys win; an old key fills in only what is not set
      const ind = colour(d.tab_indicator_color);
      const pill = style === 'pills';
      st.tab_color = colour(st.tab_color) ?? colour(d.tab_active_color);
      st.tab_background = colour(st.tab_background) ?? colour(d.tab_active_background) ?? (pill ? ind : undefined);
      st.tab_border_color = colour(st.tab_border_color) ?? (pill ? undefined : ind);
    }
    for (const [key, suffix, token] of STATE_KEYS) {
      let v: string | undefined;
      if (key === 'tab_opacity') {
        const n = unitOpacity(st[key]);
        v = n === undefined ? undefined : String(n);
      } else if (key === 'tab_font_weight') {
        const w = word(st[key]);
        v = WEIGHT.test(w) ? w : undefined;
      } else v = colour(st[key]);
      if (v) put(`--mc-t${p}-${suffix}`, v, `${p}-${token}`);
    }
  }
  for (const kind of ['fade', 'slide']) if (tokens.has(`anim-${kind}`)) vars['--mc-tt-an'] = `mc-tabs-${kind}-${phase & 1}`;
  if (tokens.has('icon-right') || tokens.has('icon-above') || tokens.has('icon-below')) tokens.add('icon-flex');
  return { vars, tokens: [...tokens] };
}
