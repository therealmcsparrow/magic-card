import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, ForecastModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { localize } from '../../localize/localize';
import { lazyChunks } from '../../utils/lazy-chunks';

/** No entity yet, or the forecast has not arrived: the "Day 1..N / --°" skeleton. */
export function forecastSkeleton(count: number): TemplateResult {
  return html`
    <div class="mc-module mc-forecast">
      ${Array.from({ length: count }).map(
        (_, i) => html`
          <div class="mc-forecast-item">
            <span class="mc-forecast-label">${localize('forecast.day').replace('{n}', String(i + 1))}</span>
            <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
            <span class="mc-forecast-temp">--°</span>
          </div>
        `,
      )}
    </div>
  `;
}

class ForecastModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'forecast',
    name: 'Forecast',
    description: 'Display weather forecast data',
    category: 'advanced',
    icon: 'mdi:calendar-week-outline',
  };

  createDefault(): ForecastModuleConfig {
    return {
      id: generateId('forecast'),
      type: 'forecast',
      forecast_type: 'daily',
      num_forecasts: 5,
      show_temperature: true,
      show_precipitation: true,
      show_wind: false,
      animated_icons: true,
    };
  }

  placeholder(config: CardModule): TemplateResult {
    const count = Math.max(1, Math.round((config as ForecastModuleConfig).num_forecasts || 5));
    return forecastSkeleton(count);
  }
}

ModuleRegistry.registerLazy(new ForecastModule(), lazyChunks['modules-extra']);
