import { configHas } from '../utils/config-walk';

// The svg-icon chunk's predicate: a card needs the chunk when it holds an icon <ha-icon> cannot draw
// (library icon, `icon_fx`, own SVG, or a reference that is not a plain MDI id). No imports but the config walk.

/** The keys that hold an icon reference on a module, tab or button. */
export const ICON_REF_KEYS: readonly string[] = ['icon', 'icon_on', 'icon_off'];

/** A Material Design Icon id, the only reference <ha-icon> draws without the chunk (tools/plain-keys.json icon_keys.plain_pattern). */
export const PLAIN_MDI_ICON = /^mdi:[a-z0-9][a-z0-9-]*$/;

/** Keys whose presence alone needs the chunk. */
export const SVG_ICON_KEYS: readonly string[] = ['custom_icons', 'icon_fx', 'svg'];

/** One config object needs the chunk. */
export const hasSvgIcon = (n: Record<string, unknown>): boolean =>
  SVG_ICON_KEYS.some((k) => n[k] !== undefined && n[k] !== null) || ICON_REF_KEYS.some((k) => typeof n[k] === 'string' && n[k] !== '' && !PLAIN_MDI_ICON.test(n[k] as string));

/** The card config needs the svg-icon chunk (pure, total, config only). */
export const wantsSvgIcon = (config: unknown): boolean => configHas(config, hasSvgIcon);
