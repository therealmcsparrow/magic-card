import type { HomeAssistant, SeasonalConfig, SeasonalHoliday, SeasonalScenePick, SeasonalSceneSetting, SeasonalSetting } from '../types';
import { localeTimeZone } from './locale-format';
import { dayNightScene, weatherScene } from './seasonal-state';

export { dayNightScene, TWILIGHT, WEATHER, weatherScene } from './seasonal-state';

/** Seasonal scenes: which scene a card shows now, from its `seasonal` config, the date and hass. Pure. */

/** A scene the layer can draw (src/utils/seasonal-scenes.ts). Weather and day/night resolve to one of the last nine. */
export type SceneId =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'christmas'
  | 'new_year'
  | 'valentine'
  | 'easter'
  | 'halloween'
  | 'snow'
  | 'rain'
  | 'storm'
  | 'sun'
  | 'clouds'
  | 'fog'
  | 'wind'
  | 'night'
  | 'dusk';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type Hemisphere = 'north' | 'south';

export interface ResolvedSeasonal {
  scenes: SceneId[];
  layer: 'back' | 'front';
  /** 0..1 */
  intensity: number;
  decorations: boolean;
}

export interface MonthDay {
  month: number;
  day: number;
}

export interface DayRange {
  start: MonthDay;
  end: MonthDay;
}

export const SEASONAL_PICKS: readonly SeasonalScenePick[] = [
  'winter',
  'spring',
  'summer',
  'autumn',
  'christmas',
  'new_year',
  'valentine',
  'easter',
  'halloween',
  'weather',
  'daynight',
];

/** Default holiday ranges (easter: computed). */
export const DEFAULT_CALENDAR: Record<SeasonalHoliday, string> = {
  christmas: '12-01..12-26',
  new_year: '12-31..01-01',
  valentine: '02-14..02-14',
  easter: 'auto',
  halloween: '10-24..10-31',
};

/** Checked in this order: the first matching range wins (new year inside a long christmas range). */
const HOLIDAY_ORDER: SeasonalHoliday[] = ['new_year', 'christmas', 'valentine', 'easter', 'halloween'];

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function parseDay(s: string): MonthDay | undefined {
  const m = /^(\d\d)-(\d\d)$/.exec(s.trim());
  if (!m) return undefined;
  const month = Number(m[1]);
  const day = Number(m[2]);
  if (month < 1 || month > 12 || day < 1 || day > DAYS_IN_MONTH[month - 1]) return undefined;
  return { month, day };
}

/** `MM-DD..MM-DD` (inclusive; the start may be after the end: the range wraps the year end) or one `MM-DD`. */
export function parseRange(src: string | undefined): DayRange | undefined {
  if (typeof src !== 'string') return undefined;
  const parts = src.split('..');
  if (parts.length > 2) return undefined;
  const start = parseDay(parts[0]);
  const end = parts.length === 2 ? parseDay(parts[1]) : start;
  return start && end ? { start, end } : undefined;
}

const key = (md: MonthDay) => md.month * 100 + md.day;

function inRange(date: Date, r: DayRange): boolean {
  const k = key({ month: date.getMonth() + 1, day: date.getDate() });
  const a = key(r.start);
  const b = key(r.end);
  return a <= b ? k >= a && k <= b : k >= a || k <= b;
}

/** Western (Gregorian) Easter Sunday of `year`, local midnight (anonymous Gregorian computus). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Palm Sunday (Easter -7) .. Easter Monday (+1) of the date's year. */
function easterRange(year: number): DayRange {
  const e = easterSunday(year);
  const at = (off: number): MonthDay => {
    const x = new Date(e.getFullYear(), e.getMonth(), e.getDate() + off);
    return { month: x.getMonth() + 1, day: x.getDate() };
  };
  return { start: at(-7), end: at(1) };
}

const NORTH: Season[] = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
const FLIP: Record<Season, Season> = { winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring' };

/** Meteorological season (Dec-Feb winter in the north), flipped for the south. */
export function seasonFor(date: Date, hemisphere: Hemisphere = 'north'): Season {
  const s = NORTH[date.getMonth()];
  return hemisphere === 'south' ? FLIP[s] : s;
}

/** The holiday whose range holds `date`, if any. */
function holidayFor(date: Date, calendar: SeasonalConfig['calendar']): SeasonalHoliday | undefined {
  for (const h of HOLIDAY_ORDER) {
    const v = calendar?.[h];
    if (v === false || (typeof v === 'string' && v.trim().toLowerCase() === 'off')) continue;
    const src = typeof v === 'string' && v.trim().toLowerCase() !== 'auto' && parseRange(v) ? v : DEFAULT_CALENDAR[h];
    const r = src === 'auto' ? (h === 'easter' ? easterRange(date.getFullYear()) : undefined) : parseRange(src);
    if (r && inRange(date, r)) return h;
  }
  return undefined;
}

/** `hemisphere` in any case / spacing (default north). */
export function hemisphereOf(v: unknown): Hemisphere {
  return typeof v === 'string' && v.trim().toLowerCase() === 'south' ? 'south' : 'north';
}

/** What auto shows on `date` by the calendar alone (a holiday, else the season). */
export function autoScene(date: Date, cfg: Pick<SeasonalConfig, 'hemisphere' | 'calendar'> = {}): SceneId {
  return holidayFor(date, cfg.calendar) ?? seasonFor(date, hemisphereOf(cfg.hemisphere));
}

type ZoneHass = Pick<HomeAssistant, 'language' | 'locale' | 'config'> | undefined;

/** Wall clock of `now` in `timeZone`. */
function zoneParts(now: Date, timeZone: string): { y: number; mo: number; d: number; h: number; mi: number; s: number } | undefined {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).formatToParts(now);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const out = { y: get('year'), mo: get('month'), d: get('day'), h: get('hour') % 24, mi: get('minute'), s: get('second') };
    return Object.values(out).every(Number.isFinite) ? out : undefined;
  } catch {
    return undefined;
  }
}

/**
 * `now` as the date the calendar goes by: when the profile shows times in the server's zone
 * (hass.locale.time_zone `server`), a local Date with that zone's wall clock (year, month, day,
 * time); else `now` itself (the browser's day).
 */
export function zonedDay(now: Date, hass?: ZoneHass): Date {
  const tz = localeTimeZone(hass);
  const p = tz ? zoneParts(now, tz) : undefined;
  return p ? new Date(p.y, p.mo - 1, p.d, p.h, p.mi, p.s, now.getMilliseconds()) : now;
}

/**
 * The next midnight after `now` (the auto scene's date changes there): local, or the server zone's
 * when the profile uses it (around a DST change it can be an hour off; the timer re-checks).
 */
export function nextMidnight(now: Date, hass?: ZoneHass): Date {
  const tz = localeTimeZone(hass);
  const p = tz ? zoneParts(now, tz) : undefined;
  if (!p) return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const into = ((p.h * 60 + p.mi) * 60 + p.s) * 1000 + now.getMilliseconds();
  return new Date(now.getTime() + 86_400_000 - into);
}

const PICKS = new Set<string>(SEASONAL_PICKS);

/** `seasonal` as an object (a scene name is short for `{ scene }`, `true` for auto). */
export function normalizeSeasonal(cfg: SeasonalSetting | undefined): SeasonalConfig | undefined {
  if (cfg === undefined || cfg === null || cfg === false) return undefined;
  if (cfg === true) return {};
  if (typeof cfg === 'string') return { scene: cfg };
  return typeof cfg === 'object' && !Array.isArray(cfg) ? cfg : undefined;
}

/** `combine` as a list of strings, whatever was written (one name, a list, junk). */
export function combineList(cfg: Pick<SeasonalConfig, 'combine'> | undefined): SeasonalSceneSetting[] {
  const c: unknown = cfg?.combine;
  const list: unknown[] = Array.isArray(c) ? c : typeof c === 'string' ? [c] : [];
  return list.filter((v): v is SeasonalSceneSetting => typeof v === 'string' && v.trim() !== '');
}

function weatherOf(cfg: SeasonalConfig, hass: HomeAssistant | undefined): SceneId | undefined {
  return cfg.weather_entity ? weatherScene(hass?.states?.[cfg.weather_entity]?.state) : undefined;
}

function sunOf(hass: HomeAssistant | undefined): SceneId | undefined {
  const sun = hass?.states?.['sun.sun'];
  const el = sun?.attributes?.elevation;
  return dayNightScene(sun?.state, typeof el === 'number' ? el : typeof el === 'string' && el.trim() !== '' ? Number(el) : undefined);
}

/** One scene setting as a drawable scene (undefined: nothing right now / none / unknown). */
function sceneOf(setting: unknown, cfg: SeasonalConfig, now: Date, hass: HomeAssistant | undefined): SceneId | undefined {
  const s = setting === undefined ? 'auto' : setting;
  if (s === 'auto') return autoScene(now, cfg);
  if (typeof s !== 'string' || !PICKS.has(s)) return undefined;
  if (s === 'weather') return weatherOf(cfg, hass);
  if (s === 'daynight') return sunOf(hass);
  return s as SceneId;
}

/** 0..1 from `'50%'`, `50` or a fraction `0.5` (a number in (0, 1] without `%`); default 0.5. */
export function parseIntensity(v: unknown): number {
  const pct = typeof v === 'string' && v.includes('%');
  let n = typeof v === 'number' ? v : typeof v === 'string' && /^\s*-?\d*\.?\d+\s*%?\s*$/.test(v) ? parseFloat(v) : NaN;
  if (!Number.isFinite(n)) return 0.5;
  if (!pct && n > 0 && n <= 1) n *= 100;
  return Math.round(Math.min(100, Math.max(0, n))) / 100;
}

/**
 * The scenes to draw now, with the layer settings; undefined when nothing shows (no config, the
 * off switch is off, or every scene resolves to nothing).
 */
export function resolveSeasonal(
  input: SeasonalSetting | undefined,
  now: Date,
  hass?: HomeAssistant,
  opts: { localDay?: boolean } = {},
): ResolvedSeasonal | undefined {
  const cfg = normalizeSeasonal(input);
  // the calendar day in the zone the profile uses (a preview date already is one: localDay)
  if (!opts.localDay) now = zonedDay(now, hass);
  if (!cfg) return undefined;
  if (cfg.entity && hass?.states?.[cfg.entity]?.state === 'off') return undefined;
  const scenes: SceneId[] = [];
  const add = (s: SceneId | undefined) => {
    if (s && !scenes.includes(s)) scenes.push(s);
  };
  add(sceneOf(cfg.scene, cfg, now, hass));
  for (const c of combineList(cfg)) add(sceneOf(c, cfg, now, hass));
  if (!scenes.length) return undefined;
  return {
    scenes,
    layer: cfg.layer === 'front' ? 'front' : 'back',
    intensity: parseIntensity(cfg.intensity),
    decorations: cfg.decorations !== false,
  };
}

/** Entities the scene depends on (re-resolve when one of them changes): off switch, weather, sun.sun. */
export function seasonalEntities(input: SeasonalSetting | undefined): string[] {
  const cfg = normalizeSeasonal(input);
  if (!cfg) return [];
  const settings = seasonalSettings(cfg);
  const out: string[] = [];
  if (cfg.entity) out.push(cfg.entity);
  if (cfg.weather_entity && settings.includes('weather')) out.push(cfg.weather_entity);
  if (settings.includes('daynight')) out.push('sun.sun');
  return out;
}

/** The scene settings of a config: its scene (default auto) and the combined ones. */
export function seasonalSettings(cfg: SeasonalConfig): SeasonalSceneSetting[] {
  return [cfg.scene ?? 'auto', ...combineList(cfg)];
}
