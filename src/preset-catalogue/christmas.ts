import { EASE, THEME, b, glow, group, ic, k, motionDoc, particlesDoc } from './kit';

/* Christmas: gentle sway and twinkle, ease-in-out, 2-3.2 s; bells jingle 0.8 s then rest. */

const X = THEME.christmas;

export const CHRISTMAS = group('Christmas', [
  {
    id: 'xmas-snow-settle',
    name: 'Snow that settles',
    icon: 'mdi:snowflake',
    tags: ['snow', 'winter', 'snowflakes', 'floor', 'settle', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 8,
        flow: 'fall',
        seed: 0x5e771e5,
        count: 28,
        size: [3, 7],
        colors: ['#ffffff', '#e3f2fd'],
        spread: 100,
        shapes: [b('circle', 4), ic('mdi:snowflake', 1)],
        ranges: { speed: [10, 18], spin: [0, 40], delay: [0, 8], lifetime: [6, 7.5], opacity: [0.7, 1] },
        // terminal speed about 25 %/s, a soft sway, and the flakes lie where they land for 2-3 s
        physics: { gravity: { angle: 0, strength: 20 }, drag: 0.8, turbulence: { strength: 14, scale: 25 }, bounce: 0 },
        colliders: { floor: true },
      }),
  },
  {
    id: 'xmas-new-year-fireworks',
    name: 'New Year fireworks',
    icon: 'mdi:firework',
    tags: ['fireworks', 'new year', 'celebration', 'party', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3.2,
        flow: 'rise',
        seed: 0xf1e2d3c4,
        count: 5,
        size: [3, 4],
        colors: [X.glow, X.icon, X.alt, '#80deea', '#ffffff'],
        spread: 60,
        fade: false,
        layer: 'front',
        shapes: [b('spark')],
        // rockets slow down as they climb, then burst at the top
        ranges: { speed: [105, 135], delay: [0, 3.2], lifetime: [1.1, 1.3], opacity: [0.9, 1] },
        physics: { drag: 1.3 },
        children: {
          trigger: 'death',
          count: 8,
          shapes: [b('spark', 2), b('star', 1)],
          size: [3, 5],
          speed: [25, 45],
          lifetime: [0.8, 1.3],
          opacity: [0.8, 1],
          spin: [0, 180],
          cone: 360,
          physics: { gravity: { angle: 0, strength: 30 }, drag: 1.5 },
        },
      }),
  },
  {
    id: 'xmas-jingle-bell',
    name: 'Jingle bell',
    icon: 'mdi:bell-ring',
    tags: ['bell', 'jingle', 'ring', 'christmas', 'notification'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.4,
        origin: '50% 0%',
        keyframes: [
          k(0, { rotate: 0 }),
          k(5, { rotate: -4 }, { easing: EASE.settle }),
          k(11, { rotate: 16 }),
          k(17, { rotate: -12 }),
          k(23, { rotate: 8 }),
          k(28, { rotate: -4 }),
          k(33, { rotate: 0 }),
          // rest for the rest of the cycle
          k(100, { rotate: 0 }),
        ],
      }),
  },
  {
    id: 'xmas-bauble-sway',
    name: 'Bauble sway',
    icon: 'mdi:ornament',
    tags: ['bauble', 'ornament', 'tree', 'sway', 'christmas'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3,
        origin: '50% 0%',
        easing: EASE.soft,
        keyframes: [
          k(0, { rotate: -8 }, { filter: glow(3, X.glow) }),
          k(50, { rotate: 8 }, { filter: glow(8, X.glow) }),
          k(100, { rotate: -8 }, { filter: glow(3, X.glow) }),
        ],
      }),
  },
  {
    id: 'xmas-present-hop',
    name: 'Present hop',
    icon: 'mdi:gift',
    tags: ['gift', 'present', 'hop', 'surprise', 'christmas'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.4,
        origin: '50% 100%',
        keyframes: [
          k(0, { y: 0, scale_x: 1, scale_y: 1, rotate: 0 }),
          // squash, stretch up, tilt at the top, land squashed, overshoot, settle
          k(10, { y: 0, scale_x: 1.08, scale_y: 0.88, rotate: 0 }, { easing: EASE.std }),
          k(22, { y: -8, scale_x: 0.94, scale_y: 1.1, rotate: -3 }, { easing: 'ease-out' }),
          k(32, { y: -10, scale_x: 1, scale_y: 1, rotate: -6 }, { easing: EASE.in }),
          k(44, { y: 0, scale_x: 1.08, scale_y: 0.9, rotate: 0 }, { easing: EASE.settle }),
          k(52, { y: 0, scale_x: 0.98, scale_y: 1.04, rotate: 0 }),
          k(60, { y: 0, scale_x: 1, scale_y: 1, rotate: 0 }),
          k(100, { y: 0, scale_x: 1, scale_y: 1, rotate: 0 }),
        ],
      }),
  },
  {
    id: 'xmas-golden-star-shower',
    name: 'Golden star shower',
    icon: 'mdi:star-shooting',
    tags: ['stars', 'gold', 'christmas', 'shower', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 3.2,
        flow: 'zigzag',
        seed: 0x057a2500,
        count: 14,
        size: [5, 10],
        colors: [X.glow, '#ffecb3', '#ffffff'],
        spread: 90,
        shapes: [b('star', 3), b('spark', 1)],
        ranges: { speed: [18, 28], spin: [40, 140], delay: [0, 3.2], lifetime: [2.4, 3.2], opacity: [0.7, 1] },
      }),
  },
  {
    id: 'xmas-fairy-lights',
    name: 'Fairy light glow',
    icon: 'mdi:string-lights',
    tags: ['lights', 'fairy lights', 'tree', 'glow', 'christmas'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3,
        easing: EASE.soft,
        keyframes: [
          k(0, { scale: 1 }, { filter: glow(6, X.icon) }),
          k(33, { scale: 1.04 }, { filter: glow(8, X.alt) }),
          k(66, { scale: 1 }, { filter: glow(9, X.glow) }),
          k(100, { scale: 1 }, { filter: glow(6, X.icon) }),
        ],
      }),
  },
]);
