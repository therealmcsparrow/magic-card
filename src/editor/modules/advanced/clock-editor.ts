import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ClockModuleConfig } from '../../../types';
import { renderToggleField, renderTextField, renderSelectField, renderFieldHint } from '../../../utils/form-utils';
import { uses12h } from '../../../utils/locale-format';
import { ISO, dateFormatOf, formatClockDate, isPreset } from '../../../modules/advanced/clock-format';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

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
        ${renderSelectField(t('card-editor.clock-editor.time-format'), timeFormat, [
          { label: t('card-editor.clock-editor.automatic-format-from-your-profile', { format: uses12h(hass) ? t('card-editor.clock-editor.12-hour') : t('card-editor.clock-editor.24-hour') }), value: 'auto' },
          { label: t('card-editor.clock-editor.12-hour'), value: '12' },
          { label: t('card-editor.clock-editor.24-hour'), value: '24' },
        ], (v) => {
          const next = { ...c };
          if (v === 'auto') delete next.format_12h;
          else next.format_12h = v === '12';
          onChange(next);
        }, 'format_12h', syncCtx)}
        ${renderToggleField(t('card-editor.clock-editor.show-seconds'), c.show_seconds, (v) => onChange({ ...c, show_seconds: v }), 'show_seconds', syncCtx)}
        ${renderToggleField(t('card-editor.clock-editor.show-date'), c.show_date !== false, (v) => onChange({ ...c, show_date: v }), 'show_date', syncCtx)}
        ${c.show_date !== false
          ? html`
            ${renderSelectField(t('card-editor.clock-editor.date-format'), custom ? 'custom' : dateFormat, [
              { label: t('card-editor.clock-editor.short-example', { example: sample('short') }), value: 'short' },
              { label: t('card-editor.clock-editor.medium-example', { example: sample('medium') }), value: 'medium' },
              { label: t('card-editor.clock-editor.long-example', { example: sample('long') }), value: 'long' },
              { label: t('card-editor.clock-editor.numeric-example', { example: sample('numeric') }), value: 'numeric' },
              { label: t('card-editor.clock-editor.iso-example', { example: sample(ISO) }), value: ISO },
              { label: t('card-editor.clock-editor.custom-pattern'), value: 'custom' },
            ], (v) => {
              if (v === 'custom') customPatternIds.add(c.id);
              else customPatternIds.delete(c.id);
              onChange({ ...c, date_format: v === 'custom' ? CUSTOM_DEFAULT : v });
            }, 'date_format', syncCtx)}
            ${custom
              ? html`
                ${renderTextField(t('card-editor.clock-editor.date-pattern'), c.date_format, (v) => {
                  customPatternIds.add(c.id);
                  onChange({ ...c, date_format: v });
                }, 'date_format', syncCtx, { mono: true })}
                ${renderFieldHint(t('card-editor.clock-editor.yyyy-year-mmmm-mmm-month-name-mm-m-month'))}
              `
              : nothing}
          `
          : nothing}
      </div>
    `;
  },
};
