import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ClockModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderTextField, renderSelectField, renderFieldHint } from '../../utils/form-utils';
import { dateTimeFormat, localeLanguage, localeTimeZone, uses12h } from '../../utils/locale-format';
import { tickingText } from '../../utils/ticking-text';

/** Date format presets; any other value is a pattern (see formatDatePattern). */
const DATE_PRESETS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { weekday: 'short', month: 'short', day: 'numeric' },
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  numeric: { year: 'numeric', month: 'numeric', day: 'numeric' },
};
const ISO = 'iso';
const CUSTOM_DEFAULT = 'ddd D MMM YYYY';

/** A preset name (own keys only: 'constructor' is a pattern, not a preset). */
const isPreset = (f: string): boolean => Object.prototype.hasOwnProperty.call(DATE_PRESETS, f);

/**
 * Clocks whose editor is in custom pattern mode. Only the date format select switches modes: a
 * pattern being typed may be empty or spell a preset name for a moment without the field going away.
 */
const customPatternIds = new Set<string>();

/**
 * A formatter for the user's language with Unicode extensions (Gregorian calendar, Latin digits),
 * in the user's time zone; the plain extensions when the language tag does not take them.
 */
function gregorianFormat(hass: HomeAssistant | undefined, ext: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const timeZone = localeTimeZone(hass);
  const opts = timeZone ? { ...options, timeZone } : options;
  const lang = localeLanguage(hass) ?? new Intl.DateTimeFormat().resolvedOptions().locale;
  try {
    return new Intl.DateTimeFormat(`${lang.split('-u-')[0]}-u-${ext}`, opts);
  } catch {
    return new Intl.DateTimeFormat(`en-u-${ext}`, opts);
  }
}

/**
 * Date parts in the user's time zone. Pattern tokens are Gregorian (YYYY-MM-DD): numbers in Latin
 * digits whatever the language's own numbering system or calendar (fa: Persian digits and calendar,
 * th: Buddhist year), month and weekday names in the user's language.
 */
function dateParts(date: Date, hass: HomeAssistant | undefined) {
  const parts: Record<string, string> = {};
  const fmt = gregorianFormat(hass, 'ca-gregory-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  const name = (opts: Intl.DateTimeFormatOptions) => gregorianFormat(hass, 'ca-gregory', opts).format(date);
  const num = (s: string | undefined) => String(Number(s) || 0);
  return {
    year: num(parts.year),
    month: num(parts.month),
    day: num(parts.day),
    weekdayLong: () => name({ weekday: 'long' }),
    weekdayShort: () => name({ weekday: 'short' }),
    monthLong: () => name({ month: 'long' }),
    monthShort: () => name({ month: 'short' }),
  };
}

/**
 * A date pattern: YYYY / YY year, MMMM / MMM month name, MM / M month number, DD / D day,
 * dddd / ddd weekday name. Text in [brackets] is kept as is.
 */
export function formatDatePattern(date: Date, pattern: string, hass?: HomeAssistant): string {
  const d = dateParts(date, hass);
  const pad = (s: string) => s.padStart(2, '0');
  return pattern.replace(PATTERN_TOKENS, (token, literal: string | undefined) => {
    if (literal !== undefined) return literal;
    switch (token) {
      case 'YYYY': return d.year;
      case 'YY': return d.year.slice(-2);
      case 'MMMM': return d.monthLong();
      case 'MMM': return d.monthShort();
      case 'MM': return pad(d.month);
      case 'M': return d.month;
      case 'dddd': return d.weekdayLong();
      case 'ddd': return d.weekdayShort();
      case 'DD': return pad(d.day);
      default: return d.day;
    }
  });
}

const PATTERN_TOKENS = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g;

/**
 * A stored `date_format` as the clock uses it: empty is `short`, the old `full` is `long`, a value
 * without any token or [text] (an old preset name, a typo) is `short` instead of shown literally.
 */
function dateFormatOf(format: string | undefined): string {
  const f = (format ?? '').trim();
  if (f === 'full') return 'long';
  if (isPreset(f) || f === ISO) return f;
  return f.search(PATTERN_TOKENS) === -1 ? 'short' : f;
}

/** The clock's date line for a `date_format` (preset, `iso` or pattern; default `short`). */
export function formatClockDate(date: Date, format: string | undefined, hass?: HomeAssistant): string {
  const f = dateFormatOf(format);
  if (isPreset(f)) return dateTimeFormat(hass, DATE_PRESETS[f]).format(date);
  if (f === ISO) return formatDatePattern(date, 'YYYY-MM-DD', hass);
  return formatDatePattern(date, f, hass);
}

/** The clock's time: 12 / 24 hour from `format_12h`, else from the user's profile. */
export function formatClockTime(date: Date, c: Pick<ClockModuleConfig, 'format_12h' | 'show_seconds'>, hass?: HomeAssistant): string {
  const h12 = c.format_12h ?? uses12h(hass);
  const opts: Intl.DateTimeFormatOptions = {
    hour: h12 ? 'numeric' : '2-digit',
    minute: '2-digit',
    hourCycle: h12 ? 'h12' : 'h23',
  };
  if (c.show_seconds) opts.second = '2-digit';
  return dateTimeFormat(hass, opts).format(date);
}

class ClockModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'clock',
    name: 'Clock',
    description: 'Display current time and date',
    category: 'advanced',
    icon: 'mdi:clock-outline',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  // No format_12h: a new clock follows the user's profile (12 / 24 hour).
  createDefault(): ClockModuleConfig {
    return {
      id: generateId('clock'),
      type: 'clock',
      show_seconds: false,
      show_date: true,
      date_format: 'short',
    };
  }

  /**
   * The time and date tick themselves (every second with seconds, otherwise on the minute): only
   * their text changes, the card does not re-render for the clock.
   */
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ClockModuleConfig;
    const every = c.show_seconds ? 1000 : 60_000;
    return html`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${tickingText(() => formatClockTime(new Date(), c, hass), every)}</span>
        ${c.show_date !== false ? html`<span class="mc-clock-date">${tickingText(() => formatClockDate(new Date(), c.date_format, hass), 60_000)}</span>` : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as ClockModuleConfig;
    const timeFormat = c.format_12h === undefined ? 'auto' : c.format_12h ? '12' : '24';
    const dateFormat = dateFormatOf(c.date_format);
    const custom = customPatternIds.has(c.id) || !(isPreset(dateFormat) || dateFormat === ISO);
    const now = new Date();
    const sample = (f: string) => formatClockDate(now, f, hass);
    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Time format', timeFormat, [
          { label: `Automatic (${uses12h(hass) ? '12-hour' : '24-hour'}, from your profile)`, value: 'auto' },
          { label: '12-hour', value: '12' },
          { label: '24-hour', value: '24' },
        ], (v) => {
          const next = { ...c };
          if (v === 'auto') delete next.format_12h;
          else next.format_12h = v === '12';
          onChange(next);
        }, 'format_12h', syncCtx)}
        ${renderToggleField('Show seconds', c.show_seconds, (v) => onChange({ ...c, show_seconds: v }), 'show_seconds', syncCtx)}
        ${renderToggleField('Show date', c.show_date !== false, (v) => onChange({ ...c, show_date: v }), 'show_date', syncCtx)}
        ${c.show_date !== false
          ? html`
            ${renderSelectField('Date format', custom ? 'custom' : dateFormat, [
              { label: `Short (${sample('short')})`, value: 'short' },
              { label: `Medium (${sample('medium')})`, value: 'medium' },
              { label: `Long (${sample('long')})`, value: 'long' },
              { label: `Numeric (${sample('numeric')})`, value: 'numeric' },
              { label: `ISO (${sample(ISO)})`, value: ISO },
              { label: 'Custom pattern', value: 'custom' },
            ], (v) => {
              if (v === 'custom') customPatternIds.add(c.id);
              else customPatternIds.delete(c.id);
              onChange({ ...c, date_format: v === 'custom' ? CUSTOM_DEFAULT : v });
            }, 'date_format', syncCtx)}
            ${custom
              ? html`
                ${renderTextField('Date pattern', c.date_format, (v) => {
                  customPatternIds.add(c.id);
                  onChange({ ...c, date_format: v });
                }, 'date_format', syncCtx, { mono: true })}
                ${renderFieldHint('YYYY year, MMMM / MMM month name, MM / M month, DD / D day, dddd / ddd weekday. Text in [brackets] is kept as is.')}
              `
              : nothing}
          `
          : nothing}
      </div>
    `;
  }
}

ModuleRegistry.register(new ClockModule());
