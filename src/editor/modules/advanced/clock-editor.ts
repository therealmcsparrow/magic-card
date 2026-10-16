import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ClockModuleConfig } from '../../../types';
import { renderToggleField, renderTextField, renderSelectField, renderFieldHint } from '../../../utils/form-utils';
import { uses12h } from '../../../utils/locale-format';
import { ISO, dateFormatOf, formatClockDate, isPreset } from '../../../modules/advanced/clock-module';
import { buildSyncContext } from '../base-editor';

const CUSTOM_DEFAULT = 'ddd D MMM YYYY';

/**
 * Clocks whose editor is in custom pattern mode. Only the date format select switches modes: a
 * pattern being typed may be empty or spell a preset name for a moment without the field going away.
 */
const customPatternIds = new Set<string>();

export const clockEditor: ModuleEditor = {
  type: 'clock',
  tabs: ['general', 'conditions', 'design'],
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
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
  },
};
