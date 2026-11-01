import type { HassEntity, HomeAssistant } from '../types';

// Time helpers of the status chunk: the viewer's time format and the age of an entity.

/** Epoch ms of an entity's last report (last_reported, else last_updated); undefined when missing or unreadable. */
export function lastReport(entity: HassEntity | undefined): number | undefined {
  if (!entity) return undefined;
  const raw = entity.last_reported ?? entity.last_updated;
  const ms = typeof raw === 'string' ? Date.parse(raw) : NaN;
  return Number.isFinite(ms) ? ms : undefined;
}

/** Time only on the same day, short date plus time otherwise, in hass.locale (language, 12/24 h, server time zone). */
export function formatWhen(ms: number, hass: HomeAssistant, now: number = Date.now()): string {
  const loc = hass.locale;
  const lang = loc?.language || hass.language || undefined;
  const zone = loc?.time_zone === 'server' ? hass.config?.time_zone : undefined;
  const hourCycle = loc?.time_format === '12' ? 'h12' : loc?.time_format === '24' ? 'h23' : undefined;
  const fmt = (o: Intl.DateTimeFormatOptions, at: number): string => {
    try {
      return new Intl.DateTimeFormat(lang, { ...o, timeZone: zone }).format(at);
    } catch {
      return new Intl.DateTimeFormat(undefined, o).format(at);
    }
  };
  const day: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const clock: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hourCycle };
  if (fmt(day, ms) === fmt(day, now)) return fmt(clock, ms);
  return fmt({ day: 'numeric', month: 'short', ...clock }, ms);
}
