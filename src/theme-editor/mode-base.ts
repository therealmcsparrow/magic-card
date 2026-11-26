import type { ThemeMode } from '../contracts/theme-editor';
import { HA_DARK_DEFAULTS } from '../contracts/ha-dark-defaults';
import { hexToRgb } from './model';

// HA's base values for a mode: what the preview and the trial reset a key to.

/**
 * The value a key goes back to. Dark mode: the dark table, and for `rgb-<base>` the triplet of the dark
 * default of `<base>` (HA derives it the same way). Then the stylesheet's light value, then `initial`.
 */
export function modeDefault(key: string, mode: ThemeMode, lightDefaults: Record<string, string>): string {
  if (mode === 'dark') {
    const dark = HA_DARK_DEFAULTS[key] ?? (key.startsWith('rgb-') ? hexToRgb(HA_DARK_DEFAULTS[key.slice(4)] ?? '') : undefined);
    if (dark) return dark;
  }
  return lightDefaults[key] || 'initial';
}

/** The keys a mode's base covers: the page theme's keys, and in dark mode every key of the dark table too. */
export function baseKeys(mode: ThemeMode, pageKeys: string[]): string[] {
  if (mode !== 'dark') return pageKeys;
  return [...new Set([...pageKeys, ...Object.keys(HA_DARK_DEFAULTS)])];
}
