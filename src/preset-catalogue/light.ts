import { EASE, THEME, b, glow, group, k, motionDoc, particlesDoc } from './kit';
import { m } from './i18n';

/* Light & colour: slow breathing glow, opacity 0.6..1, no hard flashes, 2.4-4 s. Joins the built-in group. */

const L = THEME.light;

export const LIGHT = group('Light & colour', [
  {
    id: 'light-lamp-breathe',
    name: m('preset-catalogue.light.lamp-breathe'),
    icon: 'mdi:lightbulb-on',
    tags: ['lamp', 'bulb', 'breathe', 'glow', 'night light'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3.2,
        easing: EASE.soft,
        keyframes: [
          k(0, { scale: 1 }, { opacity: 0.6, filter: glow(2, L.glow) }),
          k(50, { scale: 1.04 }, { opacity: 1, filter: glow(12, L.glow) }),
          k(100, { scale: 1 }, { opacity: 0.6, filter: glow(2, L.glow) }),
        ],
      }),
  },
  {
    id: 'light-lamp-switch-on',
    name: m('preset-catalogue.light.lamp-switch-on'),
    icon: 'mdi:lamp',
    tags: ['lamp', 'switch', 'on', 'event', 'glow'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.4,
        keyframes: [
          k(0, { scale: 1 }, { opacity: 1, filter: glow(6, L.glow) }),
          // dip (anticipation), pop on with overshoot, settle; rest from 40 %
          k(8, { scale: 0.94 }, { opacity: 0.6, filter: glow(0, L.glow), easing: EASE.settle }),
          k(20, { scale: 1.1 }, { opacity: 1, filter: glow(14, L.glow) }),
          k(30, { scale: 0.98 }, { opacity: 1, filter: glow(9, L.glow) }),
          k(40, { scale: 1 }, { opacity: 1, filter: glow(6, L.glow) }),
          k(100, { scale: 1 }, { opacity: 1, filter: glow(6, L.glow) }),
        ],
      }),
  },
  {
    id: 'light-sunbeam-dust',
    name: m('preset-catalogue.light.sunbeam-dust'),
    icon: 'mdi:white-balance-sunny',
    tags: ['dust', 'motes', 'sunbeam', 'calm', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'wander',
        seed: 0xd0057e5,
        count: 16,
        size: [2, 4],
        colors: [L.glow, '#ffe082'],
        spread: 90,
        layer: 'front',
        shapes: [b('circle')],
        ranges: { speed: [2, 4], lifetime: [4, 4], opacity: [0.3, 0.7] },
        physics: { turbulence: { strength: 6, scale: 30 } },
      }),
  },
  {
    id: 'light-candlelight',
    name: m('preset-catalogue.light.candlelight'),
    icon: 'mdi:candle',
    tags: ['candle', 'warm', 'flicker', 'cosy', 'glow'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.8,
        target: 'element',
        easing: EASE.soft,
        keyframes: [
          k(0, undefined, { shadow: '0 0 14px 2px rgba(255,179,0,0.22)' }),
          k(23, undefined, { shadow: '0 0 20px 4px rgba(255,179,0,0.32)' }),
          k(41, undefined, { shadow: '0 0 12px 2px rgba(255,179,0,0.2)' }),
          k(67, undefined, { shadow: '0 0 22px 4px rgba(255,179,0,0.35)' }),
          k(88, undefined, { shadow: '0 0 15px 3px rgba(255,179,0,0.25)' }),
          k(100, undefined, { shadow: '0 0 14px 2px rgba(255,179,0,0.22)' }),
        ],
      }),
  },
  {
    id: 'light-sunrise-warm-up',
    name: m('preset-catalogue.light.sunrise-warm-up'),
    icon: 'mdi:weather-sunset-up',
    tags: ['sunrise', 'wake up', 'warm', 'colour', 'glow'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 4,
        easing: EASE.soft,
        direction: 'alternate',
        keyframes: [
          k(0, { scale: 1 }, { color: L.icon, filter: glow(3, L.glow) }),
          k(100, { scale: 1.06 }, { color: '#ffca28', filter: glow(12, L.glow) }),
        ],
      }),
  },
  {
    id: 'light-party-sparkle',
    name: m('preset-catalogue.light.party-sparkle'),
    icon: 'mdi:party-popper',
    tags: ['party', 'disco', 'sparkle', 'colour', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3,
        flow: 'explode',
        seed: 0xd15c0,
        count: 14,
        size: [4, 8],
        colors: ['#ff5252', '#ffca28', '#69f0ae', '#40c4ff', '#e040fb'],
        spread: 40,
        layer: 'front',
        shapes: [b('star', 2), b('spark', 2), b('square', 1)],
        ranges: { speed: [30, 50], spin: [60, 200], delay: [0, 3], lifetime: [1.2, 2], opacity: [0.8, 1] },
        physics: { drag: 0.8 },
      }),
  },
]);
