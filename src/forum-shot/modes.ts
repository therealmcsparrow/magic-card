// Light and dark frames: a wrapper carrying HA's dark defaults and the active theme's variables, set one property at a time.
import { HA_DARK_DEFAULTS } from '../contracts/ha-dark-defaults';
import type { ForumShotMode } from '../contracts/forum-shot';

/** HA's default light values for the variables cards read most; a light frame needs them because the page itself may be dark. */
const LIGHT_DEFAULTS: Readonly<Record<string, string>> = {
  'primary-background-color': '#fafafa',
  'card-background-color': '#ffffff',
  'secondary-background-color': '#e5e5e5',
  'clear-background-color': '#ffffff',
  'primary-text-color': '#212121',
  'secondary-text-color': '#727272',
  'disabled-text-color': '#bdbdbd',
  'divider-color': 'rgba(0, 0, 0, 0.12)',
  'outline-color': 'rgba(0, 0, 0, 0.12)',
  'outline-hover-color': 'rgba(0, 0, 0, 0.24)',
  'shadow-color': 'rgba(0, 0, 0, 0.16)',
};

const NAME = /^[a-z][a-z0-9-]{0,80}$/i;
const MAX_VALUE = 500;

interface ThemesLike {
  themes?: { theme?: string; themes?: Record<string, unknown> };
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Adds each string value under a valid variable name to `out`; other entries are dropped. */
function take(out: Record<string, string>, src: unknown): void {
  if (!isRecord(src)) return;
  for (const [key, value] of Object.entries(src)) {
    if (typeof value === 'string' && value.length <= MAX_VALUE && NAME.test(key)) out[key] = value;
  }
}

/** The variables (names without `--`) one mode of a frame sets: HA's defaults for the mode (the dark table from its Contract), then the active theme, then its `modes` block. */
export function themeVars(hass: unknown, mode: ForumShotMode): Record<string, string> {
  const out: Record<string, string> = {};
  take(out, mode === 'dark' ? HA_DARK_DEFAULTS : LIGHT_DEFAULTS);
  const themes = (hass as ThemesLike | undefined)?.themes;
  const name = themes?.theme;
  const theme = name && name !== 'default' ? themes?.themes?.[name] : undefined;
  if (isRecord(theme)) {
    const { modes, ...base } = theme;
    take(out, base);
    if (isRecord(modes)) take(out, modes[mode]);
  }
  return out;
}

/** A box (display: contents) that carries the mode's variables for the card inside it; the caller attaches and removes it. */
export function modeWrapper(hass: unknown, mode: ForumShotMode): HTMLElement {
  const wrap = document.createElement('div');
  wrap.style.display = 'contents';
  wrap.style.setProperty('color-scheme', mode);
  for (const [key, value] of Object.entries(themeVars(hass, mode))) wrap.style.setProperty(`--${key}`, value);
  return wrap;
}
