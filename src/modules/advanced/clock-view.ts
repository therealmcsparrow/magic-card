import { html, TemplateResult, nothing } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HomeAssistant, ClockModuleConfig } from '../../types';
import { tickingText } from '../../utils/ticking-text';
import { formatClockDate, formatClockTime } from './clock-format';

export class ClockView implements ModuleView {
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
}
