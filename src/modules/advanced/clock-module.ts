import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ClockModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderTextField } from '../../utils/form-utils';

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

  createDefault(): ClockModuleConfig {
    return {
      id: generateId('clock'),
      type: 'clock',
      format_12h: false,
      show_seconds: false,
      show_date: true,
      date_format: 'short',
    };
  }

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as ClockModuleConfig;
    const now = new Date();

    const timeOpts: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: c.format_12h ?? false,
    };
    if (c.show_seconds) timeOpts.second = '2-digit';

    const timeStr = now.toLocaleTimeString(undefined, timeOpts);
    const dateStr = c.show_date
      ? now.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      : '';

    return html`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${timeStr}</span>
        ${c.show_date ? html`<span class="mc-clock-date">${dateStr}</span>` : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as ClockModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderToggleField('12-Hour Format', c.format_12h, (v) => onChange({ ...c, format_12h: v }))}
        ${renderToggleField('Show Seconds', c.show_seconds, (v) => onChange({ ...c, show_seconds: v }))}
        ${renderToggleField('Show Date', c.show_date, (v) => onChange({ ...c, show_date: v }))}
        ${renderTextField('Date Format', c.date_format, (v) => onChange({ ...c, date_format: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new ClockModule());
