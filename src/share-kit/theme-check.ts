import { MIN_TEXT_CONTRAST, TEXT_PAIRS } from '../contracts/theme-safety';
import type { ContrastReport, PairContrast, TextPairId } from '../contracts/theme-safety';
import type { ThemeDoc, ThemeMode } from '../contracts/theme-editor';
import { blend, contrastRatio, parseColor } from '../theme-safety/contrast';
import type { Rgb, Rgba } from '../theme-safety/contrast';
import { locale, t } from './i18n';
import { themeValue } from './strict';

// Contrast check of an imported theme: each text pair in light and dark, resolved on a hidden probe after the strict check.

const MODES: readonly ThemeMode[] = ['light', 'dark'];
const MAX_VAR_DEPTH = 4;
const VAR_RE = /var\(\s*--([A-Za-z0-9_-]+)\s*(?:,[^()]*)?\)/g;

/** Home Assistant's own values for the tokens of TEXT_PAIRS, used when a theme value cannot be resolved. */
const HA_DEFAULTS: Record<ThemeMode, Readonly<Record<string, string>>> = {
  light: { 'primary-text-color': '#212121', 'card-background-color': '#ffffff', 'primary-background-color': '#fafafa', 'secondary-text-color': '#727272', 'text-primary-color': '#ffffff', 'primary-color': '#03a9f4', 'mc-text': '#212121', 'mc-card-bg': '#ffffff' },
  dark: { 'primary-text-color': '#e1e1e1', 'card-background-color': '#1c1c1c', 'primary-background-color': '#111111', 'secondary-text-color': '#9b9b9b', 'text-primary-color': '#ffffff', 'primary-color': '#03a9f4', 'mc-text': '#e1e1e1', 'mc-card-bg': '#1c1c1c' },
};

/** The theme's own value for a token in a mode: the mode block first, then the base. */
function raw(doc: ThemeDoc, mode: ThemeMode, name: string): string | undefined {
  const v = doc.modes?.[mode]?.[name] ?? doc[name];
  return typeof v === 'string' || typeof v === 'number' ? String(v) : undefined;
}

/** `value` with var(--token) of the theme's own tokens swapped for their values; other var() are left for the probe. */
function inlineVars(doc: ThemeDoc, mode: ThemeMode, value: string, depth = 0): string {
  if (depth >= MAX_VAR_DEPTH) return value;
  return value.replace(VAR_RE, (all, name: string) => {
    const own = raw(doc, mode, name);
    return own === undefined ? all : inlineVars(doc, mode, own, depth + 1);
  });
}

/** A colour the probe computes for `value`; undefined when the browser rejects it. Only the `color` property is ever set. */
function computed(probe: HTMLElement, value: string): Rgba | undefined {
  probe.style.removeProperty('color');
  probe.style.setProperty('color', value);
  const ok = probe.style.getPropertyValue('color') !== '';
  const c = ok ? parseColor(getComputedStyle(probe).color) : undefined;
  probe.style.removeProperty('color');
  return c;
}

interface Resolved {
  color: Rgba;
  fallback: boolean;
}

function resolve(doc: ThemeDoc, mode: ThemeMode, name: string, probe: HTMLElement): Resolved {
  const own = raw(doc, mode, name);
  if (own !== undefined) {
    const value = inlineVars(doc, mode, own);
    const color = themeValue(name, value).verdict === 'kept' ? computed(probe, value) : undefined;
    if (color) return { color, fallback: false };
  }
  return { color: parseColor(HA_DEFAULTS[mode][name])!, fallback: true };
}

const BASE: Record<ThemeMode, Rgb> = { light: { r: 255, g: 255, b: 255 }, dark: { r: 28, g: 28, b: 28 } };

/** Every TEXT_PAIRS pair in light and dark. A pair passes at MIN_TEXT_CONTRAST or above, or when both tokens are Home Assistant's own (not the theme's doing). */
export function checkTheme(doc: ThemeDoc, probe: HTMLElement): ContrastReport {
  const pairs: PairContrast[] = [];
  for (const pair of TEXT_PAIRS) {
    for (const mode of MODES) {
      if (pair.optional && (raw(doc, mode, pair.text) === undefined || raw(doc, mode, pair.background) === undefined)) continue;
      const text = resolve(doc, mode, pair.text, probe);
      const bg = resolve(doc, mode, pair.background, probe);
      const under = blend(bg.color, BASE[mode]);
      const ratio = contrastRatio(blend(text.color, under), under);
      pairs.push({ pair: pair.id, mode, ratio, pass: ratio >= MIN_TEXT_CONTRAST || (text.fallback && bg.fallback), fallback: text.fallback || bg.fallback });
    }
  }
  return { pairs, pass: pairs.every((p) => p.pass) };
}

const pairName = (id: TextPairId): string =>
  ({
    'primary-on-card': t('share-kit.theme-check.main-text-on-the-card-background'),
    'primary-on-page': t('share-kit.theme-check.main-text-on-the-page-background'),
    'secondary-on-card': t('share-kit.theme-check.secondary-text-on-the-card-background'),
    'on-primary': t('share-kit.theme-check.text-on-the-primary-colour'),
    'mc-text-on-card': t('share-kit.theme-check.magic-card-text-on-the-magic-card-background'),
  })[id];

const modeName = (mode: ThemeMode): string => (mode === 'light' ? t('share-kit.theme-check.light') : t('share-kit.theme-check.dark'));

const num = (n: number): string => n.toLocaleString(locale(), { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** The heading above the warnings. */
export const contrastHeading = (): string => t('share-kit.theme-check.low-contrast-heading');

/** One line per failing pair: the pair, the mode and the ratio (rounded down, so a near miss never reads as 4.5). */
export const contrastWarnings = (report: ContrastReport): string[] =>
  report.pairs
    .filter((p) => !p.pass)
    .map((p) => t('share-kit.theme-check.pair-in-mode', { pair: pairName(p.pair), mode: modeName(p.mode), ratio: num(Math.floor(p.ratio * 100) / 100), min: num(MIN_TEXT_CONTRAST) }));
