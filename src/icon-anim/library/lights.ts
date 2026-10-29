import { dim, k, osc, te, t, type Spec } from './build';
import { m } from './i18n';

/*
 * P4 entries, theme light (brand artist's p4-spec.json, Living rigs): slow breathing glow,
 * opacity 0.6..1, rays stagger outward, no hard flashes. Checked on the parts sheet: spotlight
 * piece 3 is the lamp's front (lens), the chandelier sways as a whole from its canopy, and the
 * pendant's bulb hangs under the right lamp, so they swing as one.
 */

export const LIGHTS: Spec[] = [
  {
    id: 'desk-lamp',
    name: m('icon-library.lights.desk-lamp'),
    domain: 'light',
    icon: 'mdi:desk-lamp',
    tags: ['light', 'lamp', 'desk', 'study', 'office'],
    duration: 3,
    parts: { lamp: [m('icon-library.lights.lamp'), [0]], glow: [m('icon-library.lights.light'), [1], 'center'] },
    tracks: (x) => x.keys('part:glow', dim(0, 100, 0.6)),
  },
  {
    id: 'floor-lamp',
    name: m('icon-library.lights.floor-lamp'),
    domain: 'light',
    icon: 'mdi:floor-lamp',
    tags: ['light', 'lamp', 'floor', 'living room'],
    duration: 3.2,
    parts: { shade: [m('icon-library.lights.shade'), [0], 'bottom'], stand: [m('icon-library.lights.stand'), [1]] },
    tracks: (x) => x.keys('part:shade', [te(0, { scale: 1.03 }, { opacity: 1 }), te(50, { scale: 1 }, { opacity: 0.7 }), t(100, { scale: 1.03 }, { opacity: 1 })]),
  },
  {
    id: 'lava-lamp',
    name: m('icon-library.lights.lava-lamp'),
    domain: 'light',
    icon: 'mdi:lava-lamp',
    tags: ['light', 'lamp', 'lava', 'retro', 'mood'],
    duration: 4,
    parts: { glass: [m('icon-library.lights.lava'), [0], 'bottom'], base: [m('icon-library.lights.base'), [1]] },
    tracks: (x) => x.keys('part:glass', osc({ scale_x: -0.04, scale_y: 0.04 })),
  },
  {
    id: 'spotlight',
    name: m('icon-library.lights.spotlight'),
    domain: 'light',
    icon: 'mdi:spotlight-beam',
    tags: ['light', 'spotlight', 'beam', 'stage', 'garden'],
    duration: 2.4,
    parts: { beam_1: [m('icon-library.lights.beam-edge-1'), [0]], beam_2: [m('icon-library.lights.beam-edge-2'), [1]], lamp: [m('icon-library.lights.lamp'), [2]], beam: [m('icon-library.lights.lamp-front'), [3]] },
    // from the lamp outward: the lens, then both beam edges
    tracks: (x) => {
      x.keys('part:beam', dim(0, 50, 0.5));
      x.keys('part:beam_1', dim(15, 50, 0.5));
      x.keys('part:beam_2', dim(15, 50, 0.5));
    },
  },
  {
    id: 'chandelier',
    name: m('icon-library.lights.chandelier'),
    domain: 'light',
    icon: 'mdi:chandelier',
    tags: ['light', 'chandelier', 'ceiling', 'dining'],
    duration: 3.2,
    parts: { bulb_m: [m('icon-library.lights.middle-light'), [0], 'center'], canopy: [m('icon-library.lights.canopy'), [1]], bulb_l: [m('icon-library.lights.left-light'), [2], 'center'], bulb_r: [m('icon-library.lights.right-light'), [3], 'center'], arms: [m('icon-library.lights.arms'), [4]] },
    groups: { fixture: [m('icon-library.lights.chandelier'), ['canopy', 'bulb_m', 'bulb_l', 'bulb_r', 'arms'], [12, 2]] },
    tracks: (x) => {
      x.keys('group:fixture', osc({ rotate: 2 }));
      ([['bulb_l', 0], ['bulb_m', 20], ['bulb_r', 40]] as const).forEach(([p, at]) => x.keys(`part:${p}`, dim(at, 40, 0.6)));
    },
  },
  {
    id: 'night-light',
    name: m('icon-library.lights.night-light'),
    domain: 'light',
    icon: 'mdi:lightbulb-night',
    tags: ['light', 'night', 'moon', 'nursery', 'sleep'],
    duration: 3.6,
    parts: { base: [m('icon-library.lights.base'), [0]], bulb: [m('icon-library.lights.bulb'), [1]], star: [m('icon-library.lights.star'), [2], 'center'], moon: [m('icon-library.lights.moon'), [3], 'center'] },
    tracks: (x) => {
      x.keys('part:moon', osc({ rotate: 8 }));
      x.keys('part:star', [te(0, { scale: 1 }, { opacity: 1 }), te(30, { scale: 1 }, { opacity: 1 }), te(45, { scale: 0.7 }, { opacity: 0.5 }), t(60, { scale: 1 }, { opacity: 1 })]);
      x.keys('part:bulb', dim(0, 100, 0.7));
    },
  },
  {
    id: 'bulb-rays',
    name: m('icon-library.lights.bulb-shining'),
    domain: 'light',
    icon: 'mdi:lightbulb-on-outline',
    tags: ['light', 'bulb', 'lamp', 'idea', 'on'],
    duration: 2.4,
    parts: { ray_r: [m('icon-library.lights.ray-right'), [0]], ray_l: [m('icon-library.lights.ray-left'), [1]], ray_t: [m('icon-library.lights.ray-top'), [2]], ray_tl: [m('icon-library.lights.ray-top-left'), [3]], ray_tr: [m('icon-library.lights.ray-top-right'), [4]], bulb: [m('icon-library.lights.bulb'), [5], 'center'], base: [m('icon-library.lights.base'), [6]] },
    tracks: (x) =>
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((p, i) => {
        const at = i * 10;
        x.keys(`part:${p}`, [te(at, { scale: 1 }, { opacity: 1 }), te(at + 20, { scale: 0.7 }, { opacity: 0.5 }), t(at + 40, { scale: 1 }, { opacity: 1 })]);
      }),
  },
  {
    id: 'track-light',
    name: m('icon-library.lights.track-light'),
    domain: 'light',
    icon: 'mdi:track-light',
    tags: ['light', 'track', 'spot', 'ceiling'],
    duration: 2.4,
    parts: { light: [m('icon-library.lights.light'), [0]], ray_1: [m('icon-library.lights.ray-1'), [1]], ray_2: [m('icon-library.lights.ray-2'), [2]], ray_3: [m('icon-library.lights.ray-3'), [3]] },
    tracks: (x) => ['ray_1', 'ray_2', 'ray_3'].forEach((p, i) => x.keys(`part:${p}`, dim(i * 15, 50))),
  },
  {
    id: 'pendant-lights',
    name: m('icon-library.lights.pendant-lights'),
    domain: 'light',
    icon: 'mdi:ceiling-light-multiple',
    tags: ['light', 'pendant', 'ceiling', 'kitchen', 'dining'],
    duration: 3,
    parts: { lamp_r: [m('icon-library.lights.right-lamp'), [0], 'top'], bulb: [m('icon-library.lights.bulb'), [1]], lamp_l: [m('icon-library.lights.left-lamp'), [2], 'top'] },
    groups: { right: [m('icon-library.lights.right-lamp-and-bulb'), ['lamp_r', 'bulb'], 'top'] },
    tracks: (x) => {
      x.keys('group:right', osc({ rotate: 4 }));
      x.keys('part:lamp_l', osc({ rotate: -4 }));
      x.keys('part:bulb', [k(0, { opacity: 1, easing: 'ease-in-out' }), k(50, { opacity: 0.6, easing: 'ease-in-out' }), k(100, { opacity: 1 })]);
    },
  },
];
