import { ModuleRegistry } from '../../modules/module-registry';
import type { MagicModuleMetadata } from '../../modules/module-types';
import { lm } from '../../i18n/labels/mark';

// Name, description, category and icon of the lazy modules, shipped with the editor chunk.
const LAZY_METADATA: Record<string, Omit<MagicModuleMetadata, 'type' | 'inherit'>> = {
  clock: { name: lm('labels.lazy-metadata.clock'), description: lm('labels.lazy-metadata.display-current-time-and-date'), category: 'advanced', icon: 'mdi:clock-outline' },
  image: { name: lm('labels.lazy-metadata.image'), description: lm('labels.lazy-metadata.display-a-static-image-or-entity-picture'), category: 'content', icon: 'mdi:image-outline' },
  'custom-card': { name: lm('labels.lazy-metadata.custom-card'), description: lm('labels.lazy-metadata.embed-any-3rd-party-lovelace-card'), category: 'advanced', icon: 'mdi:card-plus-outline' },
  forecast: { name: lm('labels.lazy-metadata.forecast'), description: lm('labels.lazy-metadata.display-weather-forecast-data'), category: 'advanced', icon: 'mdi:calendar-week-outline' },
  'video-bg': { name: lm('labels.lazy-metadata.video-background'), description: lm('labels.lazy-metadata.video-playing-behind-the-other-modules'), category: 'advanced', icon: 'mdi:video-outline' },
  weather: { name: lm('labels.lazy-metadata.weather'), description: lm('labels.lazy-metadata.display-weather-entity-information'), category: 'advanced', icon: 'mdi:weather-partly-cloudy' },
  camera: { name: lm('labels.lazy-metadata.camera'), description: lm('labels.lazy-metadata.display-a-camera-entity-stream'), category: 'content', icon: 'mdi:camera-outline' },
  graphs: { name: lm('labels.lazy-metadata.graph'), description: lm('labels.lazy-metadata.display-entity-history-as-a-line-graph'), category: 'content', icon: 'mdi:chart-line' },
  markdown: { name: lm('labels.lazy-metadata.markdown'), description: lm('labels.lazy-metadata.render-markdown-formatted-content'), category: 'content', icon: 'mdi:language-markdown' },
  dropdown: { name: lm('labels.lazy-metadata.dropdown'), description: lm('labels.lazy-metadata.select-dropdown-for-choosing-from-a-list'), category: 'controls', icon: 'mdi:form-dropdown' },
  gauge: { name: lm('labels.lazy-metadata.gauge'), description: lm('labels.lazy-metadata.arc-gauge-for-displaying-numeric-sensor'), category: 'controls', icon: 'mdi:speedometer' },
  light: { name: lm('labels.lazy-metadata.light'), description: lm('labels.lazy-metadata.light-control-with-brightness-colour'), category: 'controls', icon: 'mdi:lightbulb-outline' },
  slider: { name: lm('labels.lazy-metadata.slider'), description: lm('labels.lazy-metadata.range-slider-for-controlling-numeric'), category: 'controls', icon: 'mdi:tune-vertical' },
  spinbox: { name: lm('labels.lazy-metadata.spinbox'), description: lm('labels.lazy-metadata.numeric-input-with-increment-and'), category: 'controls', icon: 'mdi:numeric' },
  'slider-layout': { name: lm('labels.lazy-metadata.slider-layout'), description: lm('labels.lazy-metadata.arrange-child-modules-in-a-slider'), category: 'layout', icon: 'mdi:view-carousel-outline' },
  tabs: { name: lm('labels.lazy-metadata.tabs'), description: lm('labels.lazy-metadata.tabbed-container-for-groups-of-modules'), category: 'layout', icon: 'mdi:tab' },
};

for (const type of Object.keys(LAZY_METADATA)) {
  const stub = ModuleRegistry.get(type as never);
  if (stub) Object.assign(stub.metadata, LAZY_METADATA[type]);
}
