import type { HomeAssistant } from '../types';
import { wrapText } from '../i18n/pseudo-hook';

/** Dates, times and numbers formatted the way Home Assistant's frontend does, from hass.locale. */

type LocaleHass = Pick<HomeAssistant, 'language' | 'locale' | 'config'> | undefined;

/** BCP 47 language for dates and names (profile language, then hass.language, then the browser). */
export function localeLanguage(hass: LocaleHass): string | undefined {
  return hass?.locale?.language || hass?.language || undefined;
}

/** Like HA's useAmPm: the profile's time format, or what the language / system uses. */
export function uses12h(hass: LocaleHass): boolean {
  const format = hass?.locale?.time_format;
  if (format === '12') return true;
  if (format === '24') return false;
  const lang = format === 'system' ? undefined : localeLanguage(hass);
  try {
    return new Date('January 1, 2023 22:00:00').toLocaleString(lang).includes('10');
  } catch {
    return false;
  }
}

/** The time zone HA would show times in: the server's when the profile asks for it, else the browser's. */
export function localeTimeZone(hass: LocaleHass): string | undefined {
  if (hass?.locale?.time_zone !== 'server') return undefined;
  const tz = hass.config?.time_zone;
  if (!tz) return undefined;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return undefined;
  }
}

/** Locale for numbers, like HA's getNumberFormatOptions / numberFormatToLocale. */
export function numberLocale(hass: LocaleHass): string | undefined {
  switch (hass?.locale?.number_format) {
    case 'comma_decimal':
      return 'en-US';
    case 'decimal_comma':
      return 'de';
    case 'space_comma':
      return 'fr';
    case 'system':
      return undefined;
    default:
      return localeLanguage(hass);
  }
}

/** A number in the user's number format (at most `maxDecimals` decimals). */
export function formatNumber(hass: LocaleHass, value: number, maxDecimals = 1): string {
  const opts: Intl.NumberFormatOptions = { maximumFractionDigits: maxDecimals };
  if (hass?.locale?.number_format === 'none') opts.useGrouping = false;
  let out: string;
  try {
    out = new Intl.NumberFormat(numberLocale(hass), opts).format(value);
  } catch {
    out = String(value);
  }
  return wrapText(out, 'num');
}

/** Intl.DateTimeFormat that falls back to the browser locale on an unknown language tag. */
export function dateTimeFormat(hass: LocaleHass, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const timeZone = localeTimeZone(hass);
  const opts = timeZone ? { ...options, timeZone } : options;
  try {
    return new Intl.DateTimeFormat(localeLanguage(hass), opts);
  } catch {
    return new Intl.DateTimeFormat(undefined, opts);
  }
}
