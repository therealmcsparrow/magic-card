import { osc, SPIN, te, t, type Spec } from './build';

/*
 * P4 entries, animals and weather (brand artist's p4-spec.json, Living rigs): organic follow-through,
 * nothing loops faster than 0.5 s. Animals use the pseudo-domain `animal` (their HA domain stays in
 * the tags). Checked on the parts sheet: in MDI's bee-flower piece 0 is the bee and piece 1 the flower.
 */

export const NATURE: Spec[] = [
  {
    id: 'cat',
    name: 'Cat',
    domain: 'animal',
    icon: 'mdi:cat',
    tags: ['animal', 'pet', 'cat', 'kitten', 'sensor'],
    duration: 3,
    parts: { cat: ['Cat', [0], 'bottom'] },
    tracks: (x) => x.keys('part:cat', osc({ rotate: 5, scale_y: [-0.03, 25] })),
  },
  {
    id: 'dog-side',
    name: 'Dog barking',
    domain: 'animal',
    icon: 'mdi:dog-side',
    tags: ['animal', 'pet', 'dog', 'bark', 'binary_sensor'],
    duration: 2,
    parts: { head: ['Head', [0], 'bottom-left'], body: ['Body', [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:head', [te(0, { rotate: 0 }), te(8, { rotate: -8 }), te(16, { rotate: 0 }), te(24, { rotate: -8 }), t(32, { rotate: 0 })]);
      x.keys('part:body', [te(0, { scale_y: 1 }), te(10, { scale_y: 0.97 }), te(18, { scale_y: 1 }), te(26, { scale_y: 0.97 }), t(34, { scale_y: 1 })]);
    },
  },
  {
    id: 'duck',
    name: 'Duck',
    domain: 'animal',
    icon: 'mdi:duck',
    tags: ['animal', 'duck', 'bird', 'pond', 'bath', 'sensor'],
    duration: 2.4,
    parts: { duck: ['Duck', [0], 'bottom'] },
    tracks: (x) => x.keys('part:duck', osc({ y: 0.6, rotate: [4, 25] })),
  },
  {
    id: 'turtle',
    name: 'Turtle',
    domain: 'animal',
    icon: 'mdi:turtle',
    tags: ['animal', 'turtle', 'tortoise', 'pet', 'slow', 'sensor'],
    duration: 1.6,
    parts: { head: ['Head', [0], 'bottom'], leg_fr: ['Front right leg', [1], 'left'], leg_fl: ['Front left leg', [2], 'right'], shell: ['Shell', [3]], leg_bl: ['Back left leg', [4], 'top-right'], leg_br: ['Back right leg', [5], 'top-left'] },
    // diagonal pairs paddle together
    tracks: (x) => {
      x.keys('part:leg_fr', osc({ rotate: 12 }));
      x.keys('part:leg_bl', osc({ rotate: 12 }));
      x.keys('part:leg_fl', osc({ rotate: -12 }));
      x.keys('part:leg_br', osc({ rotate: -12 }));
      x.keys('part:head', osc({ y: 0.3 }, { cycles: 2 }));
    },
  },
  {
    id: 'snail',
    name: 'Snail',
    domain: 'animal',
    icon: 'mdi:snail',
    tags: ['animal', 'snail', 'garden', 'slow', 'sensor'],
    duration: 4,
    parts: { snail: ['Snail', [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:snail', [te(0, { scale_x: 1, x: 0 }), te(40, { scale_x: 1.05, x: 0 }), te(70, { scale_x: 1, x: 0.5 }), t(100, { scale_x: 1, x: 0 })]),
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    domain: 'animal',
    icon: 'mdi:butterfly',
    tags: ['animal', 'butterfly', 'insect', 'garden', 'spring', 'sensor'],
    duration: 0.8,
    parts: { body: ['Body', [0]], wing_l: ['Left wing', [1], 'right'], wing_r: ['Right wing', [2], 'left'] },
    groups: { butterfly: ['Butterfly', ['body', 'wing_l', 'wing_r'], 'center'] },
    tracks: (x) => {
      const flap = [te(0, { scale_x: 1 }), te(50, { scale_x: 0.35 }), t(100, { scale_x: 1 })];
      x.keys('part:wing_l', flap);
      x.keys('part:wing_r', flap);
      x.keys('group:butterfly', osc({ y: [0.5, 25] }));
    },
  },
  {
    id: 'ladybug',
    name: 'Ladybug',
    domain: 'animal',
    icon: 'mdi:ladybug',
    tags: ['animal', 'ladybug', 'ladybird', 'insect', 'garden', 'sensor'],
    duration: 3,
    parts: { head: ['Head', [0]], shell_r: ['Right wing case', [1], 'top-left'], shell_l: ['Left wing case', [2], 'top-right'] },
    tracks: (x) =>
      ([['shell_r', -1], ['shell_l', 1]] as const).forEach(([p, s]) => x.keys(`part:${p}`, [te(0, { rotate: 0 }), te(15, { rotate: 0 }), te(30, { rotate: 18 * s }), te(60, { rotate: 18 * s }), t(75, { rotate: 0 })])),
  },
  {
    id: 'jellyfish',
    name: 'Jellyfish',
    domain: 'animal',
    icon: 'mdi:jellyfish',
    tags: ['animal', 'jellyfish', 'sea', 'aquarium', 'sensor'],
    duration: 3,
    parts: { jellyfish: ['Jellyfish', [0], 'top'] },
    tracks: (x) => x.keys('part:jellyfish', [te(0, { y: 0, scale_y: 1 }), t(15, { y: 0, scale_y: 0.9 }, { easing: 'ease-out' }), te(30, { y: -1.2, scale_y: 1.05 }), te(45, { y: -1.2, scale_y: 1 }), t(100, { y: 0, scale_y: 1 })]),
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    domain: 'animal',
    icon: 'mdi:dolphin',
    tags: ['animal', 'dolphin', 'sea', 'pool', 'swim', 'sensor'],
    duration: 3,
    parts: { dolphin: ['Dolphin', [0], 'center'] },
    // a leap forward over an arc, then a swim back under the water line; the body tilts with it
    tracks: (x) => {
      x.path('part:dolphin', 'M0 0 Q1 -3 2 0 Q1 1 0 0');
      x.keys('part:dolphin', [te(0, { rotate: -10 }), te(25, { rotate: 0 }), te(50, { rotate: 12 }), te(75, { rotate: 0 }), t(100, { rotate: -10 })]);
    },
  },
  {
    id: 'penguin',
    name: 'Penguin',
    domain: 'animal',
    icon: 'mdi:penguin',
    tags: ['animal', 'penguin', 'bird', 'cold', 'winter', 'sensor'],
    duration: 1,
    parts: { penguin: ['Penguin', [0], 'bottom'] },
    tracks: (x) => x.keys('part:penguin', [te(0, { rotate: 0, y: 0 }), te(25, { rotate: 6, y: -0.3 }), te(50, { rotate: 0, y: 0 }), te(75, { rotate: -6, y: -0.3 }), t(100, { rotate: 0, y: 0 })]),
  },
  {
    id: 'bee-flower',
    name: 'Bee and flower',
    domain: 'animal',
    icon: 'mdi:bee-flower',
    tags: ['animal', 'bee', 'flower', 'garden', 'pollen', 'sensor'],
    duration: 3,
    parts: { flower: ['Flower', [1], 'bottom'], bee: ['Bee', [0], 'center'] },
    tracks: (x) => {
      x.path('part:bee', 'M0 0 C 0.75 -1 1.5 -1 1.5 0 S 0.75 1 0 0 S -1.5 1 -1.5 0 S -0.75 -1 0 0');
      x.keys('part:bee', osc({ rotate: 6 }, { cycles: 2 }));
      x.keys('part:flower', osc({ rotate: 3 }));
    },
  },
  // ── weather ──
  {
    id: 'tornado',
    name: 'Tornado',
    domain: 'weather',
    icon: 'mdi:weather-tornado',
    tags: ['weather', 'tornado', 'storm', 'wind', 'twister'],
    duration: 1.6,
    parts: { band_1: ['Band 1', [0]], band_2: ['Band 2', [1]], band_3: ['Band 3', [2]], band_4: ['Band 4', [3]], band_5: ['Band 5', [4]] },
    // a wave down the funnel: each band 10 % later than the one above
    tracks: (x) => [1, 2, 3, 4, 5].forEach((n) => x.keys(`part:band_${n}`, osc({ x: [1, (n - 1) * 10] }))),
  },
  {
    id: 'hurricane',
    name: 'Hurricane',
    domain: 'weather',
    icon: 'mdi:weather-hurricane',
    tags: ['weather', 'hurricane', 'storm', 'cyclone', 'wind'],
    duration: 2.4,
    parts: { storm: ['Hurricane', [0], [12, 12]] },
    tracks: (x) => x.keys('part:storm', SPIN(-1)),
  },
];
