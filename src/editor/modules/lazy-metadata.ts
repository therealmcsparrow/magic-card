import { ModuleRegistry } from '../../modules/module-registry';
import type { MagicModuleMetadata } from '../../modules/module-types';
import { lm } from '../../i18n/labels/mark';

/**
 * Name, description, category and icon of the lazy modules. magic-card.js carries only each stub's type and
 * entity-scope rule; the module picker, the outline and the search read the rest, so it ships with the editor chunk.
 */
const LAZY_METADATA: Record<string, Omit<MagicModuleMetadata, 'type' | 'inherit'>> = {
  clock: { name: lm('Clock'), description: lm('Display current time and date'), category: 'advanced', icon: 'mdi:clock-outline' },
  image: { name: lm('Image'), description: lm('Display a static image or entity picture'), category: 'content', icon: 'mdi:image-outline' },
  'custom-card': { name: lm('Custom card'), description: lm('Embed any 3rd party Lovelace card'), category: 'advanced', icon: 'mdi:card-plus-outline' },
  forecast: { name: lm('Forecast'), description: lm('Display weather forecast data'), category: 'advanced', icon: 'mdi:calendar-week-outline' },
  'video-bg': { name: lm('Video background'), description: lm('Video playing behind the other modules of its column or layout'), category: 'advanced', icon: 'mdi:video-outline' },
  weather: { name: lm('Weather'), description: lm('Display weather entity information'), category: 'advanced', icon: 'mdi:weather-partly-cloudy' },
  camera: { name: lm('Camera'), description: lm('Display a camera entity stream'), category: 'content', icon: 'mdi:camera-outline' },
  graphs: { name: lm('Graph'), description: lm('Display entity history as a line graph'), category: 'content', icon: 'mdi:chart-line' },
  markdown: { name: lm('Markdown'), description: lm('Render markdown-formatted content'), category: 'content', icon: 'mdi:language-markdown' },
  dropdown: { name: lm('Dropdown'), description: lm('Select dropdown for choosing from a list of options'), category: 'controls', icon: 'mdi:form-dropdown' },
  gauge: { name: lm('Gauge'), description: lm('Arc gauge for displaying numeric sensor values'), category: 'controls', icon: 'mdi:speedometer' },
  light: { name: lm('Light'), description: lm('Light control with brightness, colour temperature, and colour options'), category: 'controls', icon: 'mdi:lightbulb-outline' },
  slider: { name: lm('Slider'), description: lm('Range slider for controlling numeric values'), category: 'controls', icon: 'mdi:tune-vertical' },
  spinbox: { name: lm('Spinbox'), description: lm('Numeric input with increment and decrement buttons'), category: 'controls', icon: 'mdi:numeric' },
  'slider-layout': { name: lm('Slider layout'), description: lm('Arrange child modules in a slider'), category: 'layout', icon: 'mdi:view-carousel-outline' },
  tabs: { name: lm('Tabs'), description: lm('Tabbed container for groups of modules'), category: 'layout', icon: 'mdi:tab' },
};

for (const type of Object.keys(LAZY_METADATA)) {
  const stub = ModuleRegistry.get(type as never);
  if (stub) Object.assign(stub.metadata, LAZY_METADATA[type]);
}
