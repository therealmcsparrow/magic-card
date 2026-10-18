import { EASE, THEME, b, group, k, motionDoc, particlesDoc } from './kit';
import { m } from './i18n';

/* Home automation: machines move linearly (1.2-2 s); events anticipate and overshoot, act in the first 60 %, rest the last 40 % (3 s). */

const HM = THEME.home;
const WATER = [HM.icon, '#64b5f6', '#bbdefb'];

export const HOME = group('Home automation', [
  {
    id: 'home-leak-drip-splash',
    name: m('Leak drip & splash'),
    icon: 'mdi:water-alert',
    tags: ['leak', 'water', 'drip', 'splash', 'alarm', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2.4,
        flow: 'fall',
        seed: 0x1ea4d21f,
        count: 3,
        size: [4, 6],
        colors: WATER,
        spread: 8,
        shapes: [b('circle')],
        // drops fall from the top, hit the floor and splash
        ranges: { speed: [0, 4], delay: [0, 2.4], lifetime: [1.35, 1.45], opacity: [0.85, 1] },
        physics: { gravity: { angle: 0, strength: 120 }, bounce: 0.05 },
        colliders: { floor: true },
        children: {
          trigger: 'collision',
          count: 5,
          shapes: [b('circle')],
          size: [2, 3],
          speed: [20, 40],
          lifetime: [0.35, 0.6],
          opacity: [0.7, 1],
          cone: 110,
          physics: { gravity: { angle: 0, strength: 150 }, bounce: 0 },
        },
      }),
  },
  {
    id: 'home-fan-running',
    name: m('Fan running'),
    icon: 'mdi:fan',
    tags: ['fan', 'ventilation', 'spin', 'cooling', 'running'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 1.2,
        easing: EASE.linear,
        keyframes: [k(0, { rotate: 0 }), k(100, { rotate: 360 })],
      }),
  },
  {
    id: 'home-doorbell-ring',
    name: m('Doorbell ring'),
    icon: 'mdi:doorbell',
    tags: ['doorbell', 'ring', 'visitor', 'event', 'notification'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3,
        origin: '50% 20%',
        keyframes: [
          k(0, { rotate: 0, scale: 1 }),
          k(6, { rotate: -3, scale: 0.96 }, { easing: EASE.settle }),
          k(12, { rotate: 12, scale: 1.06 }),
          k(18, { rotate: -10, scale: 1.06 }),
          k(24, { rotate: 8, scale: 1.04 }),
          k(30, { rotate: -6, scale: 1.02 }),
          k(36, { rotate: 3, scale: 1 }),
          k(42, { rotate: 0, scale: 1 }),
          k(100, { rotate: 0, scale: 1 }),
        ],
      }),
  },
  {
    id: 'home-motion-detected',
    name: m('Motion detected'),
    icon: 'mdi:motion-sensor',
    tags: ['motion', 'presence', 'sensor', 'alert', 'blink'],
    doc: (id, name) =>
      motionDoc(id, name, {
        // two soft blinks in 0.8 s (2.5 per second, under the 3 per second cap), then rest
        duration: 2,
        easing: EASE.soft,
        keyframes: [
          k(0, { scale: 1 }, { opacity: 1 }),
          k(10, { scale: 0.96 }, { opacity: 0.35 }),
          k(20, { scale: 1.06 }, { opacity: 1 }),
          k(30, { scale: 0.97 }, { opacity: 0.35 }),
          k(40, { scale: 1 }, { opacity: 1 }),
          k(100, { scale: 1 }, { opacity: 1 }),
        ],
      }),
  },
  {
    id: 'home-mail-arrived',
    name: m('Mail arrived'),
    icon: 'mdi:mailbox-up',
    tags: ['mail', 'post', 'letterbox', 'parcel', 'event'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3,
        origin: '50% 100%',
        keyframes: [
          k(0, { y: 0, rotate: 0, scale_y: 1 }),
          k(8, { y: 1, rotate: 0, scale_y: 0.92 }, { easing: EASE.std }),
          k(18, { y: -6, rotate: -8, scale_y: 1.06 }, { easing: EASE.in }),
          k(28, { y: 0, rotate: 4, scale_y: 0.95 }, { easing: EASE.settle }),
          k(36, { y: 0, rotate: -2, scale_y: 1 }),
          k(44, { y: 0, rotate: 0, scale_y: 1 }),
          k(100, { y: 0, rotate: 0, scale_y: 1 }),
        ],
      }),
  },
  {
    id: 'home-energy-flow',
    name: m('Energy flow'),
    icon: 'mdi:lightning-bolt',
    tags: ['energy', 'power', 'solar', 'electricity', 'flow', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'wave',
        seed: 0x00e1ec7a,
        count: 10,
        size: [3, 6],
        colors: [HM.glow, '#ffe082'],
        spread: 30,
        shapes: [b('spark', 1), b('circle', 2)],
        ranges: { speed: [50, 60], delay: [0, 4], lifetime: [3.6, 4], opacity: [0.7, 1] },
      }),
  },
  {
    id: 'home-garden-sprinkler',
    name: m('Garden sprinkler'),
    icon: 'mdi:sprinkler-variant',
    tags: ['sprinkler', 'irrigation', 'garden', 'water', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2,
        flow: 'fountain',
        seed: 0x5291c1e7,
        count: 20,
        size: [2, 4],
        colors: WATER,
        spread: 40,
        shapes: [b('circle')],
        ranges: { speed: [120, 160], delay: [0, 2], lifetime: [1.1, 1.4], opacity: [0.6, 0.95] },
        physics: { bounce: 0.2 },
        colliders: { floor: true },
      }),
  },
]);
