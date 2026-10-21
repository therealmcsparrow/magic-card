import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { CardModule, HomeAssistant, WeatherModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { weatherMinHeight } from '../lazy-heights';

export const isNight = (hass: HomeAssistant | undefined): boolean => hass?.states?.['sun.sun']?.state === 'below_horizon';

/**
 * Current weather of a weather entity (the view is in the modules-extra chunk): condition icon,
 * temperature, translated condition and optionally the daily forecast.
 */
class WeatherModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'weather', inherit: ['weather'] };

  createDefault(): WeatherModuleConfig {
    return {
      id: generateId('weather'),
      type: 'weather',
      show_temperature: true,
      show_condition: true,
      show_forecast: false,
      forecast_days: 5,
      animated_icons: true,
    };
  }

  /** The night icon reads sun.sun, so the card re-renders when the sun sets or rises. */
  getDependencies(config: CardModule): ModuleDependencies {
    return config.entity ? { entities: ['sun.sun'] } : {};
  }

  /** The weather box with the height it will have (icon and temperature row, plus the forecast), so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-weather" style="min-height: ${weatherMinHeight(config as WeatherModuleConfig)}px"></div>`;
  }
}

ModuleRegistry.registerLazy(new WeatherModule(), lazyChunks['modules-extra']);
