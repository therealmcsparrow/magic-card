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

/** Bar-wide colours: key, property, token. */
const COLOURS: ReadonlyArray<readonly [string, string, string]> = [['tab_bar_background', '--mc-tb-bg', 'bar-bg']];

/** Bar-wide lengths: key, property, token, most lengths, largest number, whether a percentage is allowed */
const LENGTHS: ReadonlyArray<readonly [string, string, string, number, number, boolean]> = [
  ['tab_bar_border_width', '--mc-tb-bw', 'bar-border', 4, 32, false],
  ['tab_bar_padding', '--mc-tb-pad', 'bar-pad', 4, 256, true],
  ['tab_gap', '--mc-tb-gap', 'gap', 1, 256, true],
];

type Kind = 'colour' | 'sides' | 'bw' | 'bs' | 'radius' | 'pad' | 'size' | 'isize' | 'weight' | 'transform' | 'family' | 'spacing' | 'shadow' | 'opacity';

/**
 * Every per-tab key, valid in the base design and in each state: key, grammar, property suffix (--mc-tt-<s> for the
 * base, --mc-t{h,a,d}-<s> for a state), base token, state token (`{h,a,d}-<token>`).
 */
export const TAB_FIELDS: ReadonlyArray<readonly [string, Kind, string, string, string]> = [
  ['tab_color', 'colour', 'c', 'color', 'color'],
  ['tab_background', 'colour', 'bg', 'bg', 'bg'],
  ['tab_border_color', 'sides', 'bc', 'border', 'border'],
  ['tab_border_width', 'bw', 'bw', 'border', 'bw'],
  ['tab_border_style', 'bs', 'bs', 'border', 'bs'],
  ['tab_radius', 'radius', 'r', 'radius', 'radius'],
  ['tab_padding', 'pad', 'pad', 'pad', 'pad'],
  ['tab_font_family', 'family', 'ff', 'family', 'family'],
  ['tab_font_size', 'size', 'fs', 'size', 'size'],
  ['tab_font_weight', 'weight', 'fw', 'weight', 'weight'],
  ['tab_text_transform', 'transform', 'tt', 'transform', 'transform'],
  ['tab_letter_spacing', 'spacing', 'ls', 'spacing', 'spacing'],
  ['tab_icon_color', 'colour', 'ic', 'icon-color', 'icon-color'],
  ['tab_icon_size', 'isize', 'is', 'icon-size', 'icon-size'],
  ['tab_shadow', 'shadow', 'sh', 'shadow', 'shadow'],
  ['tab_opacity', 'opacity', 'o', 'opacity', 'opacity'],
];

/** The design object that holds each state, and its prefix: --mc-t{a,h,d}-*, tokens a-*, h-*, d-*. */
const STATES: ReadonlyArray<readonly [string, string]> = [
  ['hover', 'h'],
  ['tab_active', 'a'],
  ['tab_disabled', 'd'],
];
const WEIGHT = /^(?:normal|bold|[1-9]00)$/;
// The border-style words (safe-css has the same list; a second user there would add a function to the card bundle).
const BORDER_STYLE = /^(?:none|hidden|solid|dashed|dotted|double|groove|ridge|inset|outset)$/;
const TRANSFORM = /^(?:none|uppercase|lowercase|capitalize)$/;

/** Read as aliases of tab_active.tab_color, .tab_background and .tab_border_color (the border is the fill for Pills). */
const LEGACY = ['tab_active_color', 'tab_active_background', 'tab_indicator_color'] as const;

const FAMILY = /^(?:[\w -]+|"[\w -]+"|'[\w -]+')$/;
const FAMILY_MAX = 128;
const SHADOW_MAX = 128;
/** Border sides or corners, and the longest list of colours or style words. */
const SIDES = 4;
const SIDES_MAX = 256;
const SHADOW_LAYERS = 2;

/** Keyword keys: the word is the token suffix; the first word of each list is the default and adds no token. */
const CHOICES: ReadonlyArray<readonly [string, string, readonly string[]]> = [
  ['tab_bar_position', '', ['top', 'bottom']],
  ['tab_align', 'align-', ['start', 'center', 'end', 'stretch']],
  ['tab_icon_position', 'icon-', ['left', 'right', 'above', 'below']],
  ['tab_animation', 'anim-', ['none', 'fade', 'slide']],
];

/** The keys whose value is not CSS: animation entries and icon effects (tabs-anim.ts, tabs-view.ts). */
const EXTRA_KEYS = ['tab_animations', 'tab_icon_fx'] as const;

/** The flat design keys this file reads (the old active and indicator keys are in LEGACY_TAB_KEYS). */
export const TAB_KEYS: readonly string[] = [
  ...COLOURS.map((c) => c[0]),
  'tab_bar_border_color',
  'tab_disabled_tabs',
  ...LENGTHS.map((c) => c[0]),
  ...TAB_FIELDS.map((c) => c[0]),
  ...CHOICES.map((c) => c[0]),
  ...EXTRA_KEYS,
];

/** The keys of a tab state object: every per-tab key. */
export const TAB_STATE_KEYS: readonly string[] = [...TAB_FIELDS.map((k) => k[0]), ...EXTRA_KEYS];
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

const SIGNED = /^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|em|rem)?$/;

/** One signed length in px, em or rem (a bare number is px), at most `px` px or `rel` em / rem; rebuilt from the number. */
function signed(t: string, px: number, rel: number): string | undefined {
  const m = t.length <= 16 ? SIGNED.exec(t) : null;
  if (!m) return undefined;
  const n = Number(m[1]);
  const unit = m[2] ?? 'px';
  return Math.abs(n) <= (unit === 'px' ? px : rel) ? `${n}${unit}` : undefined;
}

/** Splits at depth 0 on a comma or on whitespace, so a colour function keeps its own commas and spaces. */
function splitTop(s: string, sep: ',' | ' '): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i <= s.length; i++) {
    const ch = s[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (i === s.length || (depth === 0 && (sep === ',' ? ch === ',' : /\s/.test(ch)))) {
      const part = s.slice(from, i).trim();
      if (part) out.push(part);
      from = i + 1;
    }
  }
  return out;
}

/** `none`, or one or two layers of `[inset] x y [blur [spread]] [colour]`; rebuilt from the parsed parts. */
function shadow(v: unknown): string | undefined {
  const s = str(v);
  if (!s || s.length > SHADOW_MAX) return undefined;
  if (s.toLowerCase() === 'none') return 'none';
  const layers = splitTop(s, ',');
  if (!layers.length || layers.length > SHADOW_LAYERS) return undefined;
  const out: string[] = [];
  for (const layer of layers) {
    let inset = false;
    let paint: string | undefined;
    const lens: string[] = [];
    for (const tok of splitTop(layer, ' ')) {
      if (tok.toLowerCase() === 'inset') {
        if (inset) return undefined;
        inset = true;
        continue;
      }
      const l = signed(tok, 256, 16);
      if (l !== undefined) {
        lens.push(l);
        continue;
      }
      if (paint) return undefined;
      paint = colour(tok);
      if (!paint) return undefined;
    }
    // x and y are needed; the blur cannot be negative
    if (lens.length < 2 || lens.length > 4 || (lens[2] !== undefined && parseFloat(lens[2]) < 0)) return undefined;
    out.push([inset ? 'inset' : '', ...lens, paint ?? ''].filter(Boolean).join(' '));
  }
  return out.join(', ');
}

/** One to four colours, one per side in CSS order; one colour is read exactly as any other colour. */
function colours(v: unknown): string | undefined {
  const s = str(v);
  if (!s || s.length > SIDES_MAX) return undefined;
  const parts = splitTop(s, ' ');
  if (parts.length === 1) return colour(s);
  if (parts.length > SIDES) return undefined;
  const out = parts.map(colour);
  return out.every(Boolean) ? out.join(' ') : undefined;
}

/** One to four border-style words, one per side in CSS order. */
function styles(v: unknown): string | undefined {
  const s = str(v)?.toLowerCase();
  if (!s || s.length > SIDES_MAX) return undefined;
  const parts = s.split(/\s+/);
  return parts.length <= SIDES && parts.every((w) => BORDER_STYLE.test(w)) ? parts.join(' ') : undefined;
}

/** One value of one per-tab key, checked against its grammar; undefined when it fails. */
function parse(kind: Kind, v: unknown): string | undefined {
  switch (kind) {
    case 'colour':
      return colour(v);
    case 'bw':
      return length(v, 4, 32, false);
    case 'sides':
      return colours(v);
    case 'bs':
      return styles(v);
    case 'radius':
      return length(v, 4, 999, true);
    case 'pad':
      return length(v, 4, 256, true);
    case 'size':
      return length(v, 1, 512, true);
    case 'isize':
      return length(v, 1, 256, false);
    case 'weight': {
      const w = word(v);
      return WEIGHT.test(w) ? w : undefined;
    }
    case 'transform': {
      const w = word(v);
      return TRANSFORM.test(w) ? w : undefined;
    }
    case 'family': {
      const family = str(v);
      const names = family && family.length <= FAMILY_MAX ? family.split(',').map((n) => n.trim()) : [];
      return names.length && names.every((n) => FAMILY.test(n)) ? names.join(', ') : undefined;
    }
    case 'spacing': {
      const w = word(v);
      return w === 'normal' ? w : typeof v === 'number' || typeof v === 'string' ? signed(typeof v === 'number' ? String(v) : v.trim(), 32, 2) : undefined;
    }
    case 'shadow':
      return shadow(v);
    case 'opacity': {
      const n = unitOpacity(v);
      return n === undefined ? undefined : String(n);
    }
  }
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
  const barBorder = colours(d.tab_bar_border_color);
  if (barBorder) put('--mc-tb-bc', barBorder, 'bar-border');
  for (const [key, prop, token, most, max, pct] of LENGTHS) {
    const l = length(d[key], most, max, pct);
    if (l) put(prop, l, token);
  }
  for (const [key, kind, suffix, token] of TAB_FIELDS) {
    const v = parse(kind, d[key]);
    if (v) put(`--mc-tt-${suffix}`, v, token);
  }
  for (const [key, prefix, words] of CHOICES) {
    const w = word(d[key]);
    if (w !== words[0] && words.includes(w)) tokens.add(prefix + w);
  }
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
    for (const [key, kind, suffix, , token] of TAB_FIELDS) {
      const v = parse(kind, st[key]);
      if (v) put(`--mc-t${p}-${suffix}`, v, `${p}-${token}`);
    }
  }
  for (const kind of ['fade', 'slide']) if (tokens.has(`anim-${kind}`)) vars['--mc-tt-an'] = `mc-tabs-${kind}-${phase & 1}`;
  if (tokens.has('icon-right') || tokens.has('icon-above') || tokens.has('icon-below')) tokens.add('icon-flex');
  return { vars, tokens: [...tokens] };
}
