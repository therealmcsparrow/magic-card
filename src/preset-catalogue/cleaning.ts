import { EASE, THEME, b, group, k, motionDoc, particlesDoc } from './kit';
import { m } from './i18n';

/* Cleaning: purposeful back and forth, glide rather than bounce, sparkles staggered, 1.6-2.4 s. */

const C = THEME.cleaning;
const FOAM = [C.glow, '#ffffff', '#b2ebf2'];

export const CLEANING = group('Cleaning', [
  {
    id: 'clean-soap-bubbles-pop',
    name: m('preset-catalogue.cleaning.soap-bubbles-that-pop'),
    icon: 'mdi:chart-bubble',
    tags: ['bubbles', 'soap', 'washing', 'pop', 'droplets', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'rise',
        seed: 0x50a9b0b5,
        count: 12,
        size: [8, 16],
        colors: FOAM,
        spread: 80,
        shapes: [b('ring', 3), b('circle', 1)],
        ranges: { speed: [12, 20], delay: [0, 4], lifetime: [2.5, 3.5], opacity: [0.5, 0.9] },
        physics: { turbulence: { strength: 25, scale: 20 } },
        // each bubble pops into a few falling droplets
        children: {
          trigger: 'death',
          count: 4,
          shapes: [b('circle')],
          size: [2, 3],
          speed: [15, 30],
          lifetime: [0.3, 0.5],
          opacity: [0.6, 0.9],
          cone: 360,
          physics: { gravity: { angle: 0, strength: 80 }, turbulence: { strength: 0, scale: 20 } },
        },
      }),
  },
  {
    id: 'clean-fresh-sparkle',
    name: m('preset-catalogue.cleaning.fresh-sparkle'),
    icon: 'mdi:shimmer',
    tags: ['sparkle', 'clean', 'shine', 'done', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2.4,
        flow: 'wander',
        seed: 0x0005a1e5,
        count: 9,
        size: [5, 10],
        colors: [C.glow, '#ffffff', C.icon],
        spread: 80,
        layer: 'front',
        shapes: [b('star', 2), b('spark', 3)],
        ranges: { speed: [2, 5], spin: [30, 90], lifetime: [2.4, 2.4], opacity: [0.5, 1] },
      }),
  },
  {
    id: 'clean-robot-vacuum-glide',
    name: m('preset-catalogue.cleaning.robot-vacuum-glide'),
    icon: 'mdi:robot-vacuum',
    tags: ['vacuum', 'robot', 'cleaning', 'running', 'roomba'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.4,
        keyframes: [
          k(0, { x: -4, rotate: 0 }),
          // lean back before setting off
          k(8, { x: -5, rotate: -4 }, { easing: EASE.std }),
          k(42, { x: 4, rotate: 2 }, { easing: EASE.settle }),
          k(50, { x: 4, rotate: 0 }),
          k(58, { x: 5, rotate: 4 }, { easing: EASE.std }),
          k(92, { x: -4, rotate: -2 }, { easing: EASE.settle }),
          k(100, { x: -4, rotate: 0 }),
        ],
      }),
  },
  {
    id: 'clean-washer-spin-cycle',
    name: m('preset-catalogue.cleaning.washer-spin-cycle'),
    icon: 'mdi:washing-machine',
    tags: ['washing machine', 'laundry', 'spin', 'rumble', 'running'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 1.6,
        origin: '50% 100%',
        easing: EASE.soft,
        keyframes: [
          k(0, { x: 0, y: 0, rotate: 0 }),
          k(10, { x: -1, y: -0.5, rotate: -1.5 }),
          k(20, { x: 1, y: 0, rotate: 1.5 }),
          k(30, { x: -1, y: -0.5, rotate: -1 }),
          k(40, { x: 1, y: 0, rotate: 1 }),
          k(50, { x: 0, y: 0, rotate: 0 }),
          k(60, { x: -0.5, y: -0.5, rotate: -1 }),
          k(70, { x: 0.5, y: 0, rotate: 1 }),
          k(80, { x: -1, y: -0.5, rotate: -1.5 }),
          k(90, { x: 1, y: 0, rotate: 1.5 }),
          k(100, { x: 0, y: 0, rotate: 0 }),
        ],
      }),
  },
  {
    id: 'clean-dishwasher-steam',
    name: m('preset-catalogue.cleaning.dishwasher-steam'),
    icon: 'mdi:dishwasher',
    tags: ['steam', 'dishwasher', 'drying', 'hot', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3.2,
        flow: 'rise',
        seed: 0x057ea111,
        count: 10,
        size: [10, 20],
        colors: ['#ffffff', C.glow],
        spread: 50,
        shapes: [b('circle')],
        ranges: { speed: [18, 28], delay: [0, 3.2], lifetime: [2, 3], opacity: [0.15, 0.35] },
        physics: { drag: 0.2, turbulence: { strength: 20, scale: 25 } },
      }),
  },
  {
    id: 'clean-spray-mist',
    name: m('preset-catalogue.cleaning.spray-mist'),
    icon: 'mdi:spray-bottle',
    tags: ['spray', 'mist', 'cleaning', 'humidifier', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 1.8,
        flow: 'drift',
        seed: 0x00fa1ade,
        count: 20,
        size: [2, 5],
        colors: [C.glow, '#e0f7fa'],
        spread: 30,
        layer: 'front',
        shapes: [b('circle')],
        ranges: { speed: [150, 240], delay: [0, 1.8], lifetime: [0.8, 1.4], opacity: [0.3, 0.7] },
        // the jet slows down and drifts apart
        physics: { drag: 1.6, turbulence: { strength: 20, scale: 15 } },
      }),
  },
  {
    id: 'clean-wipe-clean',
    name: m('preset-catalogue.cleaning.wipe-clean'),
    icon: 'mdi:broom',
    tags: ['broom', 'mop', 'wipe', 'sweep', 'cleaning'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2,
        origin: '50% 100%',
        keyframes: [
          k(0, { rotate: 0 }),
          // gather, swing with overshoot, settle; then back the other way
          k(10, { rotate: -4 }, { easing: EASE.settle }),
          k(35, { rotate: 14 }),
          k(45, { rotate: 11 }, { easing: EASE.std }),
          k(60, { rotate: 14 }, { easing: EASE.settle }),
          k(80, { rotate: -12 }),
          k(90, { rotate: -9 }, { easing: EASE.std }),
          k(100, { rotate: 0 }),
        ],
      }),
  },
]);
