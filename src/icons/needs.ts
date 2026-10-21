import { configHas } from '../utils/config-walk';

/*
 * The svg-icon chunk's predicate (lazy-module 1.4.0 "needs(config)", tools/plain-keys.json `icon_keys`,
 * `features.card.custom_icons`, `features.module_keys`). A predicate file: no imports but the config walk.
 *
 * A card needs the chunk when it holds anything <ha-icon> cannot draw: a saved library icon (`custom_icons`), an icon
 * effect (`icon_fx`), an own SVG (`svg`), or an icon reference that is not a plain Material Design Icon (`mcu:`,
 * `svg`, another set). An icon that is a plain MDI id stays on <ha-icon>: zero chunk requests.
 */

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
