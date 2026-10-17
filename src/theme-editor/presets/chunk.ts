/*
 * Root of the lazy preset chunk (magic-card-theme-presets.js, ADR 0014): the data and the picker
 * that shows it. Only presets/loader.ts imports this file.
 */
export { THEME_PRESET_LIBRARY } from './library';
export { renderPicker, pickerStyles } from './picker';
export type { PickerView, PickerEvents } from './picker';
