import { m, type MessageId } from '../i18n';

export type Opt = { value: string; label: MessageId };

export const DEVICE_LABEL: Record<string, MessageId> = {
  spin: m('Spin'), glow: m('Glow'), flame: m('Flame'), drum: m('Drum'), swing: m('Swing'), pulse: m('Pulse'), snow: m('Snow'), shake: m('Shake'), eq: m('Equalizer'),
};

/** The Device animation choices of an icon (Off, Auto, then each device). */
export const DEVICES: Opt[] = [
  { value: 'off', label: m('Off') },
  { value: 'auto', label: m('Auto') },
  ...Object.entries(DEVICE_LABEL).map(([value, label]) => ({ value, label })),
];

/** The Line draw choices of an icon. */
export const DRAWS: Opt[] = [
  { value: 'off', label: m('Off') },
  { value: 'load', label: m('On load') },
  { value: 'change', label: m('On change') },
  { value: 'loop', label: m('Loop') },
];
