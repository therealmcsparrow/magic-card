import { osc, SPIN, te, t, type Spec } from './build';
import { m } from './i18n';

/*
 * P4 entries, animals and weather (brand artist's p4-spec.json, Living rigs): organic follow-through,
 * nothing loops faster than 0.5 s. Animals use the pseudo-domain `animal` (their HA domain stays in
 * the tags). Checked on the parts sheet: in MDI's bee-flower piece 0 is the bee and piece 1 the flower.
 */

export const NATURE: Spec[] = [
  {
    id: 'cat',
    name: m('icon-library.nature.cat'),
    domain: 'animal',
    icon: 'mdi:cat',
    tags: ['animal', 'pet', 'cat', 'kitten', 'sensor'],
    duration: 3,
    parts: { cat: [m('icon-library.nature.cat'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:cat', osc({ rotate: 5, scale_y: [-0.03, 25] })),
  },
  {
    id: 'dog-side',
    name: m('icon-library.nature.dog-barking'),
    domain: 'animal',
    icon: 'mdi:dog-side',
    tags: ['animal', 'pet', 'dog', 'bark', 'binary_sensor'],
    duration: 2,
    parts: { head: [m('icon-library.nature.head'), [0], 'bottom-left'], body: [m('icon-library.nature.body'), [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:head', [te(0, { rotate: 0 }), te(8, { rotate: -8 }), te(16, { rotate: 0 }), te(24, { rotate: -8 }), t(32, { rotate: 0 })]);
      x.keys('part:body', [te(0, { scale_y: 1 }), te(10, { scale_y: 0.97 }), te(18, { scale_y: 1 }), te(26, { scale_y: 0.97 }), t(34, { scale_y: 1 })]);
    },
  },
  {
    id: 'duck',
    name: m('icon-library.nature.duck'),
    domain: 'animal',
    icon: 'mdi:duck',
    tags: ['animal', 'duck', 'bird', 'pond', 'bath', 'sensor'],
    duration: 2.4,
    parts: { duck: [m('icon-library.nature.duck'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:duck', osc({ y: 0.6, rotate: [4, 25] })),
  },
  {
    id: 'turtle',
    name: m('icon-library.nature.turtle'),
    domain: 'animal',
    icon: 'mdi:turtle',
    tags: ['animal', 'turtle', 'tortoise', 'pet', 'slow', 'sensor'],
    duration: 1.6,
    parts: { head: [m('icon-library.nature.head'), [0], 'bottom'], leg_fr: [m('icon-library.nature.front-right-leg'), [1], 'left'], leg_fl: [m('icon-library.nature.front-left-leg'), [2], 'right'], shell: [m('icon-library.nature.shell'), [3]], leg_bl: [m('icon-library.nature.back-left-leg'), [4], 'top-right'], leg_br: [m('icon-library.nature.back-right-leg'), [5], 'top-left'] },
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
    name: m('icon-library.nature.snail'),
    domain: 'animal',
    icon: 'mdi:snail',
    tags: ['animal', 'snail', 'garden', 'slow', 'sensor'],
    duration: 4,
    parts: { snail: [m('icon-library.nature.snail'), [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:snail', [te(0, { scale_x: 1, x: 0 }), te(40, { scale_x: 1.05, x: 0 }), te(70, { scale_x: 1, x: 0.5 }), t(100, { scale_x: 1, x: 0 })]),
  },
  {
    id: 'butterfly',
    name: m('icon-library.nature.butterfly'),
    domain: 'animal',
    icon: 'mdi:butterfly',
    tags: ['animal', 'butterfly', 'insect', 'garden', 'spring', 'sensor'],
    duration: 0.8,
    parts: { body: [m('icon-library.nature.body'), [0]], wing_l: [m('icon-library.nature.left-wing'), [1], 'right'], wing_r: [m('icon-library.nature.right-wing'), [2], 'left'] },
    groups: { butterfly: [m('icon-library.nature.butterfly'), ['body', 'wing_l', 'wing_r'], 'center'] },
    tracks: (x) => {
      const flap = [te(0, { scale_x: 1 }), te(50, { scale_x: 0.35 }), t(100, { scale_x: 1 })];
      x.keys('part:wing_l', flap);
      x.keys('part:wing_r', flap);
      x.keys('group:butterfly', osc({ y: [0.5, 25] }));
    },
  },
  {
    id: 'ladybug',
    name: m('icon-library.nature.ladybug'),
    domain: 'animal',
    icon: 'mdi:ladybug',
    tags: ['animal', 'ladybug', 'ladybird', 'insect', 'garden', 'sensor'],
    duration: 3,
    parts: { head: [m('icon-library.nature.head'), [0]], shell_r: [m('icon-library.nature.right-wing-case'), [1], 'top-left'], shell_l: [m('icon-library.nature.left-wing-case'), [2], 'top-right'] },
    tracks: (x) =>
      ([['shell_r', -1], ['shell_l', 1]] as const).forEach(([p, s]) => x.keys(`part:${p}`, [te(0, { rotate: 0 }), te(15, { rotate: 0 }), te(30, { rotate: 18 * s }), te(60, { rotate: 18 * s }), t(75, { rotate: 0 })])),
  },
  {
    id: 'jellyfish',
    name: m('icon-library.nature.jellyfish'),
    domain: 'animal',
    icon: 'mdi:jellyfish',
    tags: ['animal', 'jellyfish', 'sea', 'aquarium', 'sensor'],
    duration: 3,
    parts: { jellyfish: [m('icon-library.nature.jellyfish'), [0], 'top'] },
    tracks: (x) => x.keys('part:jellyfish', [te(0, { y: 0, scale_y: 1 }), t(15, { y: 0, scale_y: 0.9 }, { easing: 'ease-out' }), te(30, { y: -1.2, scale_y: 1.05 }), te(45, { y: -1.2, scale_y: 1 }), t(100, { y: 0, scale_y: 1 })]),
  },
  {
    id: 'dolphin',
    name: m('icon-library.nature.dolphin'),
    domain: 'animal',
    icon: 'mdi:dolphin',
    tags: ['animal', 'dolphin', 'sea', 'pool', 'swim', 'sensor'],
    duration: 3,
    parts: { dolphin: [m('icon-library.nature.dolphin'), [0], 'center'] },
    // a leap forward over an arc, then a swim back under the water line; the body tilts with it
    tracks: (x) => {
      x.path('part:dolphin', 'M0 0 Q1 -3 2 0 Q1 1 0 0');
      x.keys('part:dolphin', [te(0, { rotate: -10 }), te(25, { rotate: 0 }), te(50, { rotate: 12 }), te(75, { rotate: 0 }), t(100, { rotate: -10 })]);
    },
  },
  {
    id: 'penguin',
    name: m('icon-library.nature.penguin'),
    domain: 'animal',
    icon: 'mdi:penguin',
    tags: ['animal', 'penguin', 'bird', 'cold', 'winter', 'sensor'],
    duration: 1,
    parts: { penguin: [m('icon-library.nature.penguin'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:penguin', [te(0, { rotate: 0, y: 0 }), te(25, { rotate: 6, y: -0.3 }), te(50, { rotate: 0, y: 0 }), te(75, { rotate: -6, y: -0.3 }), t(100, { rotate: 0, y: 0 })]),
  },
  {
    id: 'bee-flower',
    name: m('icon-library.nature.bee-and-flower'),
    domain: 'animal',
    icon: 'mdi:bee-flower',
    tags: ['animal', 'bee', 'flower', 'garden', 'pollen', 'sensor'],
    duration: 3,
    parts: { flower: [m('icon-library.nature.flower'), [1], 'bottom'], bee: [m('icon-library.nature.bee'), [0], 'center'] },
    tracks: (x) => {
      x.path('part:bee', 'M0 0 C 0.75 -1 1.5 -1 1.5 0 S 0.75 1 0 0 S -1.5 1 -1.5 0 S -0.75 -1 0 0');
      x.keys('part:bee', osc({ rotate: 6 }, { cycles: 2 }));
      x.keys('part:flower', osc({ rotate: 3 }));
    },
  },
  // ── weather ──
  {
    id: 'tornado',
    name: m('icon-library.nature.tornado'),
    domain: 'weather',
    icon: 'mdi:weather-tornado',
    tags: ['weather', 'tornado', 'storm', 'wind', 'twister'],
    duration: 1.6,
    parts: { band_1: [m('icon-library.nature.band-1'), [0]], band_2: [m('icon-library.nature.band-2'), [1]], band_3: [m('icon-library.nature.band-3'), [2]], band_4: [m('icon-library.nature.band-4'), [3]], band_5: [m('icon-library.nature.band-5'), [4]] },
    // a wave down the funnel: each band 10 % later than the one above
    tracks: (x) => [1, 2, 3, 4, 5].forEach((n) => x.keys(`part:band_${n}`, osc({ x: [1, (n - 1) * 10] }))),
  },
  {
    id: 'hurricane',
    name: m('icon-library.nature.hurricane'),
    domain: 'weather',
    icon: 'mdi:weather-hurricane',
    tags: ['weather', 'hurricane', 'storm', 'cyclone', 'wind'],
    duration: 2.4,
    parts: { storm: [m('icon-library.nature.hurricane'), [0], [12, 12]] },
    tracks: (x) => x.keys('part:storm', SPIN(-1)),
  },
];
