import { EASE, THEME, b, glow, group, k, motionDoc, particlesDoc } from './kit';

/* Fire & heat: irregular flicker (unequal key spacing 0/23/41/67/88), pivot at the flame base, 1.0-1.6 s. */

const F = THEME.fire;
const EMBERS = [F.glow, '#ff7043', F.icon];

export const FIRE = group('Fire & heat', [
  {
    id: 'fire-hearth-flicker',
    name: 'Hearth flicker',
    icon: 'mdi:fire',
    tags: ['flame', 'fireplace', 'flicker', 'glow', 'heat'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 1.3,
        origin: '50% 100%',
        easing: EASE.soft,
        keyframes: [
          k(0, { scale_x: 1, scale_y: 1, skew_x: 0, rotate: 0 }, { color: F.icon, filter: glow(4, F.glow) }),
          k(23, { scale_x: 0.96, scale_y: 1.08, skew_x: -4, rotate: -2 }, { color: F.icon, filter: glow(8, F.glow) }),
          k(41, { scale_x: 1.03, scale_y: 0.93, skew_x: 3, rotate: 1 }, { color: F.icon, filter: glow(5, F.glow) }),
          k(67, { scale_x: 0.97, scale_y: 1.1, skew_x: -2, rotate: 2 }, { color: F.icon, filter: glow(9, F.glow) }),
          k(88, { scale_x: 1.02, scale_y: 0.95, skew_x: 4, rotate: -1 }, { color: F.icon, filter: glow(5, F.glow) }),
          k(100, { scale_x: 1, scale_y: 1, skew_x: 0, rotate: 0 }, { color: F.icon, filter: glow(4, F.glow) }),
        ],
      }),
  },
  {
    id: 'fire-heating-up',
    name: 'Heating up',
    icon: 'mdi:thermometer-high',
    tags: ['thermostat', 'radiator', 'boiler', 'heat', 'temperature'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.4,
        origin: '50% 100%',
        keyframes: [
          k(0, { y: 0, scale_y: 1 }, { filter: glow(0, F.glow) }),
          // anticipation: a small squash down
          k(12, { y: 1, scale_y: 0.92 }, { filter: glow(0, F.glow), easing: EASE.settle }),
          // rise with overshoot, the glow peaks
          k(30, { y: -3, scale_y: 1.1 }, { filter: glow(10, F.glow), easing: EASE.std }),
          k(42, { y: 0.5, scale_y: 0.97 }, { filter: glow(7, F.glow) }),
          k(52, { y: 0, scale_y: 1 }, { filter: glow(5, F.glow) }),
          // rest for the last 40 %, the glow fades out
          k(100, { y: 0, scale_y: 1 }, { filter: glow(0, F.glow) }),
        ],
      }),
  },
  {
    id: 'fire-rising-embers',
    name: 'Rising embers',
    icon: 'mdi:campfire',
    tags: ['embers', 'sparks', 'campfire', 'fireplace', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3,
        flow: 'rise',
        seed: 0x1f2e3d4c,
        count: 18,
        size: [2, 5],
        colors: EMBERS,
        spread: 70,
        shapes: [b('spark', 2), b('circle', 3)],
        ranges: { speed: [12, 24], spin: [0, 90], delay: [0, 3], lifetime: [1.8, 3], opacity: [0.6, 1] },
        physics: { gravity: { angle: 180, strength: 4 }, drag: 0.4, turbulence: { strength: 35, scale: 18 } },
      }),
  },
  {
    id: 'fire-licking-flames',
    name: 'Licking flames',
    icon: 'mdi:fire-circle',
    tags: ['flame', 'fire', 'burner', 'stove', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 1.6,
        flow: 'rise',
        seed: 0x5eed0f1a,
        count: 24,
        size: [8, 16],
        colors: [F.glow, '#ff7043', F.icon],
        spread: 45,
        shapes: [b('triangle', 1), b('circle', 2)],
        ranges: { speed: [25, 40], delay: [0, 1.6], lifetime: [0.6, 1.1], opacity: [0.5, 0.9] },
        physics: { gravity: { angle: 180, strength: 20 }, drag: 1.2, turbulence: { strength: 50, scale: 12 } },
      }),
  },
  {
    id: 'fire-chimney-smoke',
    name: 'Chimney smoke',
    icon: 'mdi:home-roof',
    tags: ['smoke', 'chimney', 'stove', 'wood burner', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'rise',
        seed: 0x00c0ffee,
        count: 12,
        size: [10, 24],
        colors: ['#9e9e9e', '#bdbdbd', '#757575'],
        spread: 20,
        shapes: [b('circle')],
        ranges: { speed: [8, 14], delay: [0, 4], lifetime: [2.5, 3.5], opacity: [0.15, 0.35] },
        // a light wind leans the plume to the right
        physics: { gravity: { angle: 215, strength: 6 }, drag: 0.3, turbulence: { strength: 25, scale: 30 } },
      }),
  },
  {
    id: 'fire-sparkler',
    name: 'Sparkler',
    icon: 'mdi:shimmer',
    tags: ['sparks', 'sparkler', 'welding', 'bounce', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2,
        flow: 'fountain',
        seed: 0x0badcafe,
        count: 16,
        size: [2, 4],
        colors: ['#fff3c4', F.glow, '#ff7043'],
        spread: 30,
        layer: 'front',
        shapes: [b('spark', 3), b('circle', 1)],
        ranges: { speed: [140, 180], delay: [0, 2], lifetime: [1, 1.2], opacity: [0.8, 1] },
        physics: { bounce: 0.3 },
        colliders: { floor: true },
        // each spark that lands splits into tiny bits
        children: { trigger: 'collision', count: 3, size: [1, 2], speed: [10, 25], lifetime: [0.2, 0.4], cone: 140 },
      }),
  },
]);
