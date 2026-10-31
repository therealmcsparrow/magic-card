import type { DesignConfig } from '../types';
import { configHas } from './config-walk';
import { cssLengths, safeColor, str } from './safe-css';

/** The button part design keys (icon, label, state text) as custom properties on the module wrapper. */

const GAP = 'var(--mc-bi-gap,var(--mc-gap-sm))';
/** Icon grid lines (row start / column start / row end / column end) and which margin holds the gap to the label: top, bottom, inline start, inline end. */
const ICON = new Map([
  ['left', ['2/1/4/2', 3]],
  ['right', ['2/4/4/5', 2]],
  ['above', ['1/2/2/4', 1]],
  ['below', ['4/2/5/4', 0]],
]);
const ALIGN = new Set(['start', 'center', 'end']);
/** Length keys: key, custom property, whether a percentage is allowed. */
const LENGTHS: Array<[string, string, boolean?]> = [
  ['icon_gap', '--mc-bi-gap'],
  ['icon_size', '--mc-button-icon-size'],
  ['label_font_size', '--mc-bl-fs', true],
  ['state_font_size', '--mc-bs-fs', true],
];
/** Word keys: key, the words allowed, custom property. */
const WORDS: Array<[string, RegExp, string]> = [
  ['label_font_weight', /^(?:normal|bold|lighter|bolder|[1-9]00)$/, '--mc-bl-fw'],
  ['label_text_transform', /^(?:none|uppercase|lowercase|capitalize)$/, '--mc-bl-tt'],
];
const COLOURS: Array<[string, string]> = [['icon_color', '--mc-bi-c'], ['label_color', '--mc-bl-c'], ['state_color', '--mc-bs-c'], ['icon_background', '--mc-bi-bg']];
const FAMILY = /^(?:[\w -]+|"[\w -]+"|'[\w -]+')$/;

const word = (v: unknown): string => (typeof v === 'number' ? String(v) : str(v)) ?? '';

/** The custom property declarations of the part keys that are set to something valid. */
export function buttonPartDecls(r: Record<string, unknown>): string[] {
  const out: string[] = [];
  const pos = ICON.get(word(r.icon_position));
  const across = word(r.content_align);
  const down = word(r.content_vertical_align);
  const state = word(r.state_position);
  if (pos || ALIGN.has(across) || ALIGN.has(down) || state === 'beside' || state === 'below') {
    const [area, side] = pos ?? ICON.get('left')!;
    out.push('--mc-bi-d:inline-grid', '--mc-bi-g0:0', '--mc-bl-a:2/2', `--mc-bi-ac:${ALIGN.has(down) ? down : 'center'}`, `--mc-bi-ji:${ALIGN.has(across) ? across : 'center'}`);
    if (ALIGN.has(across)) out.push(`--mc-bi-jc:${across}`);
    out.push(`--mc-bs-a:${state === 'below' ? '3/2' : '2/3'}`, `--mc-bs-mt:${state === 'below' ? '2px' : '0'}`, `--mc-bs-ms:${state === 'below' ? '0' : GAP}`, `--mc-bi-ia:${area}`);
    ['t', 'b', 's', 'e'].forEach((k, i) => out.push(`--mc-bi-m${k}:${i === side ? GAP : '0'}`));
  }
  for (const [key, prop, pct] of LENGTHS) {
    const v = cssLengths(r[key], 1);
    if (v && (pct || !v.includes('%'))) out.push(`${prop}:${v}`);
  }
  const overflow = word(r.label_overflow);
  if (overflow === 'truncate') out.push('--mc-bl-ws:nowrap', '--mc-bl-ov:hidden', '--mc-bl-to:ellipsis', '--mc-bi-mw:0', '--mc-bl-mxw:100%', '--mc-bi-fs:0');
  else if (overflow === 'wrap') out.push('--mc-bl-ws:normal');
  for (const [key, prop] of COLOURS) {
    const c = safeColor(r[key]);
    if (!c) continue;
    out.push(`${prop}:${c}`);
    if (key === 'icon_color') out.push('--icon-primary-color:currentColor');
    if (key === 'icon_background') out.push('--mc-bi-pad:calc(var(--mc-button-icon-size) *.3)', `--mc-bi-br:${word(r.icon_background_shape) === 'rounded' ? '25%' : '50%'}`);
  }
  for (const [key, re, prop] of WORDS) {
    const w = word(r[key]);
    if (re.test(w)) out.push(`${prop}:${w}`);
  }
  // a font family list of plain or quoted names, rebuilt from its parts
  const family = str(r.label_font_family);
  const names = family && family.length <= 128 ? family.split(',').map((n) => n.trim()) : [];
  if (names.length && names.every((n) => FAMILY.test(n))) out.push(`--mc-bl-ff:${names.join(', ')}`);
  return out;
}

/** The design truncates the label in its base, its hover or any conditional rule (the button then carries a title). */
export const truncates = (design: Partial<DesignConfig> | undefined): boolean => configHas(design, (n) => n.label_overflow === 'truncate');
