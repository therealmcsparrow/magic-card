import { m, type MessageIndex } from '../i18n';

export type Opt = { value: string; label: MessageIndex };

export const DEVICE_LABEL: Record<string, MessageIndex> = {
  spin: m('card-editor.icon-fx-options.spin'), glow: m('card-editor.icon-fx-options.glow'), flame: m('card-editor.icon-fx-options.flame'), drum: m('card-editor.icon-fx-options.drum'), swing: m('card-editor.icon-fx-options.swing'), pulse: m('card-editor.icon-fx-options.pulse'), snow: m('card-editor.icon-fx-options.snow'), shake: m('card-editor.icon-fx-options.shake'), eq: m('card-editor.icon-fx-options.equalizer'),
};

/** The Device animation choices of an icon (Off, Auto, then each device). */
export const DEVICES: Opt[] = [
  { value: 'off', label: m('card-editor.icon-fx-options.off') },
  { value: 'auto', label: m('card-editor.icon-fx-options.auto') },
  ...Object.entries(DEVICE_LABEL).map(([value, label]) => ({ value, label })),
];

/** The Line draw choices of an icon. */
export const DRAWS: Opt[] = [
  { value: 'off', label: m('card-editor.icon-fx-options.off') },
  { value: 'load', label: m('card-editor.icon-fx-options.on-load') },
  { value: 'change', label: m('card-editor.icon-fx-options.on-change') },
  { value: 'loop', label: m('card-editor.icon-fx-options.loop') },
];
