// Which library icons flip in a right-to-left layout; ids not listed are not set yet.
import type { MirrorFlag } from '../../contracts/icon-library';

export const ICON_MIRROR: Readonly<Record<string, MirrorFlag>> = {
  car: 'mirror',
  'electric-car': 'mirror',
  'robot-vacuum-side': 'mirror',
  walking: 'mirror',
  'dog-side': 'mirror',
  snail: 'mirror',
  clock: 'keep',
  'alarm-clock': 'keep',
  hourglass: 'keep',
  timer: 'keep',
  play: 'keep',
  'music-note': 'keep',
  headphones: 'keep',
  snowflake: 'keep',
  sunny: 'keep',
  'bulb-glow': 'keep',
  'power-button': 'keep',
  'home-assistant': 'keep',
  gauge: 'keep',
  thermometer: 'keep',
};
