import { EASE, THEME, b, glow, group, k, motionDoc, particlesDoc } from './kit';
import { m } from './i18n';

/* Valentine: lub-dub beat (keys 0, 14, 28, 42 then rest) with soft overshoot, 1.1-1.3 s beats, 3 s floats. */

const V = THEME.valentine;
const PINKS = [V.icon, V.glow, '#f48fb1'];

export const VALENTINE = group('Valentine', [
  {
    id: 'valentine-lub-dub',
    name: m('preset-catalogue.valentine.lub-dub-heartbeat'),
    icon: 'mdi:heart',
    tags: ['heart', 'beat', 'pulse', 'love', 'valentine'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 1.2,
        keyframes: [
          k(0, { scale: 1 }, { filter: glow(2, V.glow), easing: EASE.settle }),
          k(14, { scale: 1.14 }, { filter: glow(9, V.glow), easing: EASE.std }),
          k(28, { scale: 0.98 }, { filter: glow(3, V.glow), easing: EASE.settle }),
          k(42, { scale: 1.1 }, { filter: glow(7, V.glow), easing: EASE.std }),
          k(56, { scale: 1 }, { filter: glow(2, V.glow) }),
          k(100, { scale: 1 }, { filter: glow(2, V.glow) }),
        ],
      }),
  },
  {
    id: 'valentine-floating-hearts',
    name: m('preset-catalogue.valentine.floating-hearts'),
    icon: 'mdi:heart-multiple',
    tags: ['hearts', 'love', 'float', 'valentine', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3,
        flow: 'rise',
        seed: 0x10e10e,
        count: 12,
        size: [8, 16],
        colors: PINKS,
        spread: 85,
        shapes: [b('heart')],
        ranges: { speed: [18, 28], spin: [0, 20], delay: [0, 3], lifetime: [2.5, 3], opacity: [0.6, 1] },
        physics: { turbulence: { strength: 20, scale: 25 } },
      }),
  },
  {
    id: 'valentine-heart-burst',
    name: m('preset-catalogue.valentine.heart-burst'),
    icon: 'mdi:heart-flash',
    tags: ['hearts', 'burst', 'love', 'celebrate', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2.4,
        flow: 'burst',
        seed: 0xb0057e,
        count: 14,
        size: [6, 12],
        colors: PINKS,
        spread: 30,
        layer: 'front',
        shapes: [b('heart', 3), b('circle', 1)],
        // all at once, out fast, slowed by the air; the last 40 % is calm
        ranges: { speed: [40, 60], spin: [0, 120], delay: [0, 0.05], lifetime: [0.8, 1.3], opacity: [0.8, 1] },
        physics: { drag: 2.2 },
      }),
  },
  {
    id: 'valentine-falling-petals',
    name: m('preset-catalogue.valentine.falling-petals'),
    icon: 'mdi:flower-tulip',
    tags: ['petals', 'roses', 'flowers', 'love', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'zigzag',
        seed: 0x9e7a1500,
        count: 14,
        size: [6, 10],
        colors: [V.icon, '#f8bbd0', V.glow],
        spread: 95,
        shapes: [b('heart', 2), b('circle', 1)],
        ranges: { speed: [22, 30], spin: [40, 120], delay: [0, 4], lifetime: [3, 4], opacity: [0.6, 0.95] },
      }),
  },
  {
    id: 'valentine-blush-glow',
    name: m('preset-catalogue.valentine.blush-glow'),
    icon: 'mdi:heart-outline',
    tags: ['glow', 'blush', 'pink', 'soft', 'valentine'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3,
        target: 'element',
        easing: EASE.soft,
        keyframes: [
          k(0, undefined, { shadow: '0 0 0 0 rgba(255,138,128,0)' }),
          k(50, undefined, { shadow: '0 0 22px 4px rgba(255,138,128,0.35)' }),
          k(100, undefined, { shadow: '0 0 0 0 rgba(255,138,128,0)' }),
        ],
      }),
  },
  {
    id: 'valentine-cupid-sparkle',
    name: m('preset-catalogue.valentine.cupid-sparkle'),
    icon: 'mdi:heart-plus',
    tags: ['sparkle', 'hearts', 'twinkle', 'love', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3,
        flow: 'wander',
        seed: 0xc0b1d,
        count: 10,
        size: [4, 9],
        colors: [V.glow, '#ffffff', V.icon],
        spread: 85,
        layer: 'front',
        shapes: [b('spark', 2), b('heart', 1)],
        ranges: { speed: [3, 6], spin: [20, 60], lifetime: [3, 3], opacity: [0.5, 1] },
      }),
  },
]);
