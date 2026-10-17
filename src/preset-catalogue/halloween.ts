import { EASE, THEME, b, glow, group, ic, k, motionDoc, particlesDoc } from './kit';

/* Halloween: slow float broken by one quick move (jaw chatter, a dart, a drop), 2.4-3.6 s. */

const H = THEME.halloween;

export const HALLOWEEN = group('Halloween', [
  {
    id: 'halloween-bat-flight',
    name: 'Bat flight',
    icon: 'mdi:bat',
    tags: ['bats', 'night', 'spooky', 'flying', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 4,
        flow: 'wander',
        seed: 0x0ba7ba75,
        count: 6,
        size: [12, 20],
        colors: [H.alt, '#6a1b9a'],
        spread: 80,
        shapes: [ic('mdi:bat')],
        ranges: { speed: [15, 30], lifetime: [4, 4], opacity: [0.8, 1] },
        physics: { turbulence: { strength: 40, scale: 30 } },
      }),
  },
  {
    id: 'halloween-ghost-float',
    name: 'Ghost float',
    icon: 'mdi:ghost',
    tags: ['ghost', 'float', 'spooky', 'boo'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3.6,
        easing: EASE.soft,
        keyframes: [
          k(0, { x: 0, y: 0 }, { opacity: 0.85 }),
          k(30, { x: 0, y: -4 }, { opacity: 1 }),
          k(56, { x: 0, y: -2 }, { opacity: 1, easing: EASE.std }),
          // the one quick move: a dart to the side, back with a small overshoot
          k(60, { x: 4, y: -2 }, { opacity: 1, easing: EASE.settle }),
          k(68, { x: 0, y: -2 }, { opacity: 1 }),
          k(85, { x: 0, y: 0 }, { opacity: 0.7 }),
          k(100, { x: 0, y: 0 }, { opacity: 0.85 }),
        ],
      }),
  },
  {
    id: 'halloween-jack-o-lantern-glow',
    name: "Jack-o'-lantern glow",
    icon: 'mdi:halloween',
    tags: ['pumpkin', 'lantern', 'candle', 'glow', 'halloween'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.6,
        easing: EASE.soft,
        keyframes: [
          k(0, { scale: 1 }, { color: H.icon, filter: glow(5, '#ff9800') }),
          k(23, { scale: 1.03 }, { color: H.icon, filter: glow(10, '#ffb300') }),
          k(41, { scale: 1 }, { color: H.icon, filter: glow(6, '#ff9800') }),
          k(67, { scale: 1.02 }, { color: H.icon, filter: glow(11, '#ffb300') }),
          k(88, { scale: 1 }, { color: H.icon, filter: glow(7, '#ff9800') }),
          k(100, { scale: 1 }, { color: H.icon, filter: glow(5, '#ff9800') }),
        ],
      }),
  },
  {
    id: 'halloween-creeping-fog',
    name: 'Creeping fog',
    icon: 'mdi:weather-fog',
    tags: ['fog', 'mist', 'spooky', 'night', 'particles'],
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 8,
        flow: 'drift',
        seed: 0x00f09f09,
        count: 10,
        size: [30, 60],
        colors: [H.alt, '#9e9e9e'],
        spread: 40,
        shapes: [b('circle')],
        ranges: { speed: [22, 30], delay: [0, 8], lifetime: [6, 8], opacity: [0.08, 0.2] },
        // it creeps across and sinks slowly (no floor collider: a landed particle stops sliding)
        physics: { gravity: { angle: 0, strength: 1.5 }, turbulence: { strength: 8, scale: 40 } },
      }),
  },
  {
    id: 'halloween-bubbling-cauldron',
    name: 'Bubbling cauldron',
    icon: 'mdi:pot-mix',
    tags: ['cauldron', 'potion', 'witch', 'bubbles', 'pop', 'particles'],
    heavy: true,
    doc: (id, name) =>
      particlesDoc(id, name, {
        duration: 2.8,
        flow: 'rise',
        seed: 0xca1d2017,
        count: 10,
        size: [6, 12],
        colors: [H.glow, '#76ff03', H.alt],
        spread: 25,
        shapes: [b('ring', 2), b('circle', 1)],
        ranges: { speed: [16, 26], delay: [0, 2.8], lifetime: [1.4, 2], opacity: [0.6, 0.95] },
        physics: { turbulence: { strength: 18, scale: 15 } },
        children: {
          trigger: 'death',
          count: 4,
          shapes: [b('circle')],
          size: [2, 3],
          speed: [12, 24],
          lifetime: [0.3, 0.5],
          cone: 360,
          physics: { gravity: { angle: 0, strength: 70 }, turbulence: { strength: 0, scale: 20 } },
        },
      }),
  },
  {
    id: 'halloween-spider-drop',
    name: 'Spider drop',
    icon: 'mdi:spider',
    tags: ['spider', 'drop', 'web', 'spooky', 'halloween'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 3.6,
        origin: '50% 0%',
        keyframes: [
          k(0, { y: 0, rotate: 0, scale_y: 1 }),
          k(8, { y: -1, rotate: 0, scale_y: 0.96 }, { easing: EASE.in }),
          // the drop, a bounce on the thread, settle
          k(20, { y: 8, rotate: 0, scale_y: 1.06 }, { easing: 'ease-out' }),
          k(26, { y: 5, rotate: 0, scale_y: 1 }, { easing: 'ease-in-out' }),
          k(31, { y: 7.5, rotate: 0, scale_y: 1 }),
          k(36, { y: 7, rotate: 0, scale_y: 1 }, { easing: EASE.soft }),
          k(46, { y: 7, rotate: 5, scale_y: 1 }, { easing: EASE.soft }),
          k(56, { y: 7, rotate: -5, scale_y: 1 }, { easing: EASE.soft }),
          k(62, { y: 7, rotate: 0, scale_y: 1 }, { easing: EASE.std }),
          // climb back up
          k(86, { y: 0, rotate: 0, scale_y: 1 }),
          k(100, { y: 0, rotate: 0, scale_y: 1 }),
        ],
      }),
  },
  {
    id: 'halloween-skull-chatter',
    name: 'Skull chatter',
    icon: 'mdi:skull',
    tags: ['skull', 'chatter', 'jaw', 'spooky', 'halloween'],
    doc: (id, name) =>
      motionDoc(id, name, {
        duration: 2.8,
        origin: '50% 80%',
        keyframes: [
          k(0, { y: 0, rotate: 0 }),
          k(5, { y: 0, rotate: -3 }),
          k(9, { y: -1, rotate: 3 }),
          k(13, { y: 0, rotate: -3 }),
          k(17, { y: -1, rotate: 3 }),
          k(21, { y: 0, rotate: 0 }, { easing: EASE.soft }),
          // then a slow float
          k(60, { y: -2, rotate: 0 }, { easing: EASE.soft }),
          k(100, { y: 0, rotate: 0 }),
        ],
      }),
  },
]);
