import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { CardModule, HomeAssistant, WeatherModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';

export const isNight = (hass: HomeAssistant | undefined): boolean => hass?.states?.['sun.sun']?.state === 'below_horizon';

/**
 * Current weather of a weather entity (the view is in the modules-extra chunk): condition icon,
 * temperature, translated condition and optionally the daily forecast.
 */
class WeatherModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'weather',
    get name() {
      return t('Weather');
    },
    description: 'Display weather entity information',
    category: 'advanced',
    icon: 'mdi:weather-partly-cloudy',
  };

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

  /** The weather box with a minimum height, so the layout does not move when the view arrives. */
  placeholder(_config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-weather" style="min-height: 48px"></div>`;
  }
}

ModuleRegistry.registerLazy(new WeatherModule(), lazyChunks['modules-extra']);
