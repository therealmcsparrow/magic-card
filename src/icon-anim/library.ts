import type { LibraryEntry } from '../contracts/icon-library';
import { entryOf, fillIn, flame, flash, fold, k, rise, fall, rollUp, SPIN, swingBelow, t, type Spec } from './library/build';
import { presetKeyframes } from './part-presets';
import { CCTV_HEAD_BODY, CCTV_HEAD_HOOD, CCTV_MOUNT } from './library/rigs';
import { FIRE_AND_CLEANING } from './library/fire-cleaning';
import { SEASONAL } from './library/seasonal';
import { HOME } from './library/home';
import { LIGHTS } from './library/lights';
import { NATURE } from './library/nature';
import { STYLE_HINTS } from './library/style-hints';
import { m } from './library/i18n';
import { fold as foldText } from '../i18n/fold';

// The animated icon library (contract icon-library): ready animations for the icons of most Home Assistant domains plus
// pseudo-domain categories, each a keyframes document with a rig. This file holds the first entries; the rest live in library/.
// Studio bundle and lazy icon animator chunk only, never magic-card.js.

export type { LibraryEntry } from '../contracts/icon-library';
export { padKeys, svgOf } from './library/build';
export { RELEASE_NOTES, isNewInRelease, type ReleaseNotes } from './library/release-notes';

// ── the library ──

const LOCK_BODY = 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H18Z M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z';
const LOCK_SHACKLE = 'M7,8V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6V8Z';

/** The clappers hang from the bell mouth (y 18), 3 units above their own top edge (y 21). */
const CLAPPER_DROP = 3;

const SPECS: Spec[] = [
  // ── light ──
  {
    id: 'bulb-glow',
    name: m('icon-library.library.bulb-glow'),
    domain: 'light',
    icon: 'mdi:lightbulb-on',
    tags: ['light', 'lamp', 'bulb', 'on'],
    duration: 2,
    parts: { bulb: [m('icon-library.library.bulb'), [0], 'center'], base: [m('icon-library.library.base'), [1]], ray_l: [m('icon-library.library.ray-left'), [3]], ray_tl: [m('icon-library.library.ray-top-left'), [5]], ray_t: [m('icon-library.library.ray-top'), [4]], ray_tr: [m('icon-library.library.ray-top-right'), [6]], ray_r: [m('icon-library.library.ray-right'), [2]] },
    groups: { rays: [m('icon-library.library.rays'), ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'], [12, 11]] },
    tracks: (x) => {
      x.preset('part:bulb', 'pulse', { intensity: 0.35 });
      x.keys('group:rays', [t(0, { scale: 0.9 }), t(50, { scale: 1.12 }), t(100, { scale: 0.9 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [k(0, { opacity: 0.35 }), k(10 + i * 8, { opacity: 0.35, easing: 'ease-out' }), k(30 + i * 8, { opacity: 1, easing: 'ease-in' }), k(60 + i * 8, { opacity: 0.35 })]));
    },
  },
  {
    id: 'ceiling-light',
    name: m('icon-library.library.ceiling-light'),
    domain: 'light',
    icon: 'mdi:ceiling-light',
    tags: ['light', 'pendant', 'lamp'],
    duration: 3,
    parts: { shade: [m('icon-library.library.shade'), [0]], bulb: [m('icon-library.library.bulb'), [1], 'center'] },
    groups: { pendant: [m('icon-library.library.pendant'), ['shade', 'bulb'], [12, 4]] },
    tracks: (x) => {
      x.preset('group:pendant', 'swing', { intensity: 0.3 });
      x.preset('part:bulb', 'pulse', { intensity: 1 });
      x.keys('part:bulb', [k(0, { opacity: 0.55 }), k(50, { opacity: 1 }), k(100, { opacity: 0.55 })]);
    },
  },
  {
    id: 'table-lamp',
    name: m('icon-library.library.table-lamp-switching-on'),
    domain: 'light',
    icon: 'mdi:lamp',
    tags: ['light', 'lamp', 'switch'],
    duration: 3,
    parts: { shade: [m('icon-library.library.shade'), [0], 'bottom'], foot: [m('icon-library.library.foot'), [1]] },
    tracks: (x) => {
      x.keys('part:shade', [k(0, { opacity: 0.25, easing: 'linear' }), k(6, { opacity: 1, easing: 'linear' }), k(10, { opacity: 0.45, easing: 'linear' }), k(15, { opacity: 1 }), k(90, { opacity: 1, easing: 'ease-in' }), k(100, { opacity: 0.25 })]);
      x.keys('part:shade', [t(15, { scale: 1 }), t(22, { scale: 1.05 }), t(32, { scale: 1 })]);
    },
  },
  {
    id: 'led-strip',
    name: m('icon-library.library.led-strip-colour-chase'),
    domain: 'light',
    icon: 'mdi:led-strip-variant',
    tags: ['light', 'led', 'rgb', 'colour'],
    duration: 3,
    parts: { top: [m('icon-library.library.top-strip'), [0]], middle: [m('icon-library.library.middle-strip'), [2]], bottom: [m('icon-library.library.bottom-strip'), [1]] },
    tracks: (x) => {
      const HUES = ['#ff1744', '#ffea00', '#00e676', '#2979ff', '#d500f9'];
      ['top', 'middle', 'bottom'].forEach((p, i) =>
        x.keys(
          `part:${p}`,
          [...HUES, HUES[0]].map((_, j) => k(j * 20, { color: HUES[(j + i) % HUES.length], easing: 'linear' })),
        ),
      );
    },
  },
  {
    id: 'light-group',
    name: m('icon-library.library.light-group'),
    domain: 'light',
    icon: 'mdi:lightbulb-group',
    tags: ['light', 'group', 'bulbs'],
    duration: 1.8,
    parts: { left: [m('icon-library.library.left-bulb'), [3], 'center'], centre: [m('icon-library.library.centre-bulb'), [0], 'center'], right: [m('icon-library.library.right-bulb'), [5], 'center'], bases: [m('icon-library.library.bases'), [2, 1, 4]] },
    tracks: (x) => {
      ['left', 'centre', 'right'].forEach((p, i) => x.keys(`part:${p}`, presetKeyframes('wave', { share: 60, delay: i * 20 })));
    },
  },
  // ── switch, power ──
  {
    id: 'switch-toggle',
    name: m('icon-library.library.switch-toggle'),
    domain: 'switch',
    icon: 'mdi:toggle-switch-outline',
    tags: ['switch', 'input_boolean', 'toggle'],
    duration: 2.4,
    parts: { track: [m('icon-library.library.track'), [0]], knob: [m('icon-library.library.knob'), [1], 'center'] },
    tracks: (x) =>
      x.keys('part:knob', [
        t(0, { x: 0, scale_x: 1 }),
        t(30, { x: 0, scale_x: 1 }, { easing: 'ease-in-out' }),
        t(40, { x: -5, scale_x: 1.3 }, { easing: 'ease-in-out' }),
        t(50, { x: -10, scale_x: 1 }),
        t(80, { x: -10, scale_x: 1 }, { easing: 'ease-in-out' }),
        t(90, { x: -5, scale_x: 1.3 }, { easing: 'ease-in-out' }),
        t(100, { x: 0, scale_x: 1 }),
      ]),
  },
  {
    id: 'power-button',
    name: m('icon-library.library.power-button'),
    domain: 'switch',
    icon: 'mdi:power',
    tags: ['switch', 'power', 'button', 'on'],
    duration: 2.4,
    parts: { ring: [m('icon-library.library.ring'), [0], 'center'], line: [m('icon-library.library.line'), [1], 'bottom'] },
    tracks: (x) => {
      x.preset('part:ring', 'draw-loop', { share: 100 });
      x.keys('part:line', [t(0, { y: 0 }), t(8, { y: -1.2 }, { easing: 'ease-in' }), t(18, { y: 0 }, { easing: 'ease-out' }), t(24, { y: -0.3 }), t(30, { y: 0 })]);
    },
  },
  {
    id: 'plug-in',
    name: m('icon-library.library.plug-in'),
    domain: 'switch',
    icon: 'mdi:power-plug',
    tags: ['switch', 'outlet', 'plug', 'socket', 'power'],
    duration: 2.4,
    parts: { plug: [m('icon-library.library.plug'), [0], 'center'] },
    tracks: (x) =>
      x.keys('part:plug', [
        t(0, { y: 3 }, { opacity: 0.55 }),
        t(10, { y: 3 }, { opacity: 0.55, easing: 'ease-in' }),
        t(35, { y: 0 }, { opacity: 1, easing: 'ease-out' }),
        t(40, { y: 0.4 }, { opacity: 1 }),
        t(46, { y: 0 }, { opacity: 1 }),
        t(80, { y: 0 }, { opacity: 1, easing: 'ease-in-out' }),
        t(100, { y: 3 }, { opacity: 0.55 }),
      ]),
  },
  // ── fan ──
  {
    id: 'fan-spin',
    name: m('icon-library.library.fan-spin'),
    domain: 'fan',
    icon: 'mdi:fan',
    tags: ['fan', 'ventilation', 'spin'],
    duration: 1.2,
    parts: { blades: [m('icon-library.library.blades'), [0], [12, 12]] },
    tracks: (x) => x.keys('part:blades', SPIN()),
  },
  {
    id: 'ceiling-fan',
    name: m('icon-library.library.ceiling-fan-with-light'),
    domain: 'fan',
    icon: 'mdi:ceiling-fan-light',
    tags: ['fan', 'ceiling', 'light'],
    duration: 1.2,
    parts: { rod: [m('icon-library.library.rod'), [0]], blade_l: [m('icon-library.library.left-blade'), [1]], blade_r: [m('icon-library.library.right-blade'), [2]], hub: [m('icon-library.library.hub'), [3]], ray_m: [m('icon-library.library.middle-ray'), [4]], ray_r: [m('icon-library.library.right-ray'), [5]], ray_l: [m('icon-library.library.left-ray'), [6]] },
    groups: { blades: [m('icon-library.library.blades'), ['blade_l', 'blade_r'], [12, 13.5]], rays: [m('icon-library.library.light-rays'), ['ray_m', 'ray_r', 'ray_l'], [12, 18]] },
    tracks: (x) => {
      x.keys('group:blades', [
        t(0, { scale_x: 1 }, { easing: 'ease-in' }),
        t(25, { scale_x: 0 }, { easing: 'ease-out' }),
        t(50, { scale_x: -1 }, { easing: 'ease-in' }),
        t(75, { scale_x: 0 }, { easing: 'ease-out' }),
        t(100, { scale_x: 1 }),
      ]);
      x.keys('group:rays', [k(0, { opacity: 0.5 }), k(50, { opacity: 1 }), k(100, { opacity: 0.5 })]);
    },
  },
  {
    id: 'air-purifier',
    name: m('icon-library.library.air-purifier'),
    domain: 'fan',
    icon: 'mdi:air-purifier',
    tags: ['fan', 'air', 'purifier', 'humidifier'],
    duration: 2.4,
    parts: { dial: [m('icon-library.library.dial'), [0], 'center'], body: [m('icon-library.library.body'), [1]], air_t: [m('icon-library.library.air-top'), [2]], air_b: [m('icon-library.library.air-bottom'), [3]] },
    tracks: (x) => {
      x.preset('part:air_t', 'draw-loop');
      x.preset('part:air_b', 'draw-loop', { delay: 15, share: 85 });
      x.preset('part:dial', 'pulse', { intensity: 0.4 });
    },
  },
  // ── climate ──
  {
    id: 'flame',
    name: m('icon-library.library.flame'),
    domain: 'climate',
    icon: 'mdi:fire',
    tags: ['climate', 'heat', 'heating', 'thermostat', 'fire', 'water_heater'],
    duration: 1.2,
    parts: { flame: [m('icon-library.library.flame'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:flame', flame(1.2)),
  },
  {
    id: 'fireplace',
    name: m('icon-library.library.fireplace'),
    domain: 'climate',
    icon: 'mdi:fireplace',
    tags: ['climate', 'heat', 'fire', 'stove'],
    duration: 1.4,
    parts: { floor: [m('icon-library.library.hearth'), [0]], mantel: [m('icon-library.library.mantel'), [1]], outer: [m('icon-library.library.outer-flame'), [2], 'bottom'], inner: [m('icon-library.library.inner-flame'), [3], 'bottom'] },
    tracks: (x) => {
      x.keys('part:outer', presetKeyframes('flicker', { intensity: 0.7 }));
      x.keys('part:inner', flame(1.4, 10, 90));
    },
  },
  {
    id: 'snowflake',
    name: m('icon-library.library.snowflake'),
    domain: 'climate',
    icon: 'mdi:snowflake',
    tags: ['climate', 'cool', 'cooling', 'frost', 'freezer', 'weather'],
    duration: 6,
    parts: { flake: [m('icon-library.library.snowflake'), [0], [12, 12]] },
    tracks: (x) => x.keys('part:flake', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]),
  },
  {
    id: 'air-conditioner',
    name: m('icon-library.library.air-conditioner'),
    domain: 'climate',
    icon: 'mdi:air-conditioner',
    tags: ['climate', 'cool', 'ac', 'fan'],
    duration: 1.5,
    parts: { fan: [m('icon-library.library.fan'), [0], 'center'], a: [m('icon-library.library.a'), [1]], slash: [m('icon-library.library.slash'), [2]], c: [m('icon-library.library.c'), [3]] },
    tracks: (x) => x.keys('part:fan', SPIN()),
  },
  {
    id: 'radiator',
    name: m('icon-library.library.radiator-heat'),
    domain: 'climate',
    icon: 'mdi:radiator',
    tags: ['climate', 'heat', 'heating', 'heater', 'radiator'],
    duration: 2.4,
    parts: { wave_l: [m('icon-library.library.left-wave'), [0]], wave_m: [m('icon-library.library.middle-wave'), [1]], wave_r: [m('icon-library.library.right-wave'), [2]], body: [m('icon-library.library.radiator'), [3]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, rise(i * 18, 62, -2.5))),
  },
  {
    id: 'heat-haze',
    name: m('icon-library.library.heat-haze'),
    domain: 'sensor',
    icon: 'mdi:heat-wave',
    tags: ['sensor', 'temperature', 'heat', 'hot', 'climate'],
    duration: 2.4,
    parts: { wave_l: [m('icon-library.library.left-wave'), [0]], wave_m: [m('icon-library.library.middle-wave'), [1]], wave_r: [m('icon-library.library.right-wave'), [2]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, [t(0, { y: 0.8 }, { opacity: 0.35 }), t(15 + i * 15, { y: 0.8 }, { opacity: 0.35, easing: 'ease-in-out' }), t(45 + i * 15, { y: -0.8 }, { opacity: 1, easing: 'ease-in-out' }), t(75 + i * 8, { y: 0.8 }, { opacity: 0.35 })])),
  },
  {
    id: 'thermometer',
    name: m('icon-library.library.thermometer'),
    domain: 'sensor',
    icon: 'mdi:thermometer-lines',
    tags: ['sensor', 'temperature', 'climate', 'thermostat'],
    duration: 2.4,
    parts: {
      tube: [m('icon-library.library.thermometer'), [8], 'bottom'],
      l1: [m('icon-library.library.mark-1'), [7]],
      r1: [m('icon-library.library.mark-2'), [3]],
      l2: [m('icon-library.library.mark-3'), [6]],
      r2: [m('icon-library.library.mark-4'), [2]],
      l3: [m('icon-library.library.mark-5'), [5]],
      r3: [m('icon-library.library.mark-6'), [1]],
      l4: [m('icon-library.library.mark-7'), [4]],
      r4: [m('icon-library.library.mark-8'), [0]],
    },
    tracks: (x) => {
      x.keys('part:tube', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.04 }), t(100, { scale_y: 1 })]);
      ['l1', 'r1', 'l2', 'r2', 'l3', 'r3', 'l4', 'r4'].forEach((m, i) => x.keys(`part:${m}`, fillIn(4 + Math.floor(i / 2) * 14, 80)));
    },
  },
  {
    id: 'humidity',
    name: m('icon-library.library.humidity-drop'),
    domain: 'sensor',
    icon: 'mdi:water-percent',
    tags: ['sensor', 'humidity', 'moisture', 'humidifier'],
    duration: 2.2,
    parts: { drop: [m('icon-library.library.drop'), [0], 'bottom'] },
    tracks: (x) =>
      x.keys('part:drop', [
        t(0, { y: 0, scale_x: 1, scale_y: 1 }),
        t(40, { y: -1.2, scale_x: 0.95, scale_y: 1.05 }, { easing: 'ease-in' }),
        t(70, { y: 0, scale_x: 1.07, scale_y: 0.93 }, { easing: 'ease-out' }),
        t(85, { y: 0, scale_x: 0.98, scale_y: 1.02 }),
        t(100, { y: 0, scale_x: 1, scale_y: 1 }),
      ]),
  },
  {
    id: 'humidifier',
    name: m('icon-library.library.humidifier-mist'),
    domain: 'humidifier',
    icon: 'mdi:air-humidifier',
    tags: ['humidifier', 'dehumidifier', 'humidity', 'mist'],
    duration: 2,
    parts: { dial: [m('icon-library.library.dial'), [0]], body: [m('icon-library.library.body'), [1]], drop: [m('icon-library.library.drop'), [2], 'center'] },
    tracks: (x) => x.keys('part:drop', rise(0, 80, -3)),
  },
  {
    id: 'outdoor-temperature',
    name: m('icon-library.library.outdoor-temperature'),
    domain: 'sensor',
    icon: 'mdi:sun-thermometer',
    tags: ['sensor', 'temperature', 'weather', 'sun', 'outdoor'],
    duration: 8,
    parts: { ray_t: [m('icon-library.library.ray-top'), [0]], ray_l: [m('icon-library.library.ray-left'), [2]], ray_bl: [m('icon-library.library.ray-bottom-left'), [4]], ray_b: [m('icon-library.library.ray-bottom'), [5]], sun: [m('icon-library.library.sun'), [3], 'center'], thermo: [m('icon-library.library.thermometer'), [1], 'bottom'] },
    groups: { rays: [m('icon-library.library.rays'), ['ray_t', 'ray_l', 'ray_bl', 'ray_b'], [10, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: -20 }), t(50, { rotate: 20 }), t(100, { rotate: -20 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
      x.keys('part:thermo', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.05 }), t(100, { scale_y: 1 })]);
    },
  },
  // ── cover ──
  {
    id: 'garage-door',
    name: m('icon-library.library.garage-door'),
    domain: 'cover',
    icon: 'mdi:garage-variant',
    tags: ['cover', 'garage', 'door', 'binary_sensor'],
    duration: 4,
    parts: { house: [m('icon-library.library.garage'), [0]], slat_t: [m('icon-library.library.top-slat'), [1]], slat_m: [m('icon-library.library.middle-slat'), [3]], slat_b: [m('icon-library.library.bottom-slat'), [2]] },
    tracks: (x) => {
      x.keys('part:slat_t', rollUp(-2.5, 0));
      x.keys('part:slat_m', rollUp(-5.5, 1));
      x.keys('part:slat_b', rollUp(-8.5, 2));
    },
  },
  {
    id: 'roller-shutter',
    name: m('icon-library.library.roller-shutter'),
    domain: 'cover',
    icon: 'mdi:window-shutter',
    tags: ['cover', 'shutter', 'blind', 'window'],
    duration: 4,
    parts: { frame: [m('icon-library.library.frame'), [0]], s1: [m('icon-library.library.slat-1'), [1]], s2: [m('icon-library.library.slat-2'), [2]], s3: [m('icon-library.library.slat-3'), [3]], s4: [m('icon-library.library.slat-4'), [4]] },
    tracks: (x) => ['s1', 's2', 's3', 's4'].forEach((s, i) => x.keys(`part:${s}`, rollUp(-(2 + i * 3), i))),
  },
  {
    id: 'curtains',
    name: m('icon-library.library.curtains'),
    domain: 'cover',
    icon: 'mdi:curtains',
    tags: ['cover', 'curtain', 'window'],
    duration: 4,
    parts: { rod: [m('icon-library.library.rod'), [0]], left: [m('icon-library.library.left-curtain'), [1], 'top-left'], right: [m('icon-library.library.right-curtain'), [2], 'top-right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.45));
      x.keys('part:right', fold(0.45));
    },
  },
  {
    id: 'gate',
    name: m('icon-library.library.gate'),
    domain: 'cover',
    icon: 'mdi:gate-open',
    tags: ['cover', 'gate', 'binary_sensor'],
    duration: 4,
    parts: { left: [m('icon-library.library.left-leaf'), [0], 'left'], right: [m('icon-library.library.right-leaf'), [1], 'right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.4, { skew_y: -10 }));
      x.keys('part:right', fold(0.4, { skew_y: 10 }));
    },
  },
  {
    id: 'door',
    name: m('icon-library.library.door-opening'),
    domain: 'binary_sensor',
    icon: 'mdi:door',
    tags: ['binary_sensor', 'door', 'opening', 'cover'],
    duration: 3,
    parts: { leaf: [m('icon-library.library.door'), [0]], knob: [m('icon-library.library.knob'), [1]] },
    groups: { door: [m('icon-library.library.door-leaf'), ['leaf', 'knob'], 'left'] },
    tracks: (x) => x.keys('group:door', fold(0.5, { skew_y: -8 })),
  },
  {
    id: 'fridge',
    name: m('icon-library.library.fridge-door'),
    domain: 'binary_sensor',
    icon: 'mdi:fridge',
    tags: ['binary_sensor', 'fridge', 'freezer', 'door', 'appliance'],
    duration: 3,
    parts: { top: [m('icon-library.library.freezer-door'), [0], 'left'], bottom: [m('icon-library.library.fridge-door'), [1]] },
    tracks: (x) => x.keys('part:top', fold(0.55, { skew_y: -8 })),
  },
  // ── lock ──
  {
    id: 'lock',
    name: m('icon-library.library.lock'),
    domain: 'lock',
    icon: 'mdi:lock',
    tags: ['lock', 'door', 'security'],
    duration: 2.4,
    own: [LOCK_BODY, LOCK_SHACKLE],
    parts: { body: [m('icon-library.library.body'), [0], 'bottom'], shackle: [m('icon-library.library.shackle'), [1]] },
    tracks: (x) => {
      x.keys('part:shackle', [
        t(0, { y: -2.5 }),
        t(28, { y: -2.5 }, { easing: 'ease-in' }),
        t(40, { y: 0 }, { easing: 'ease-out' }),
        t(45, { y: -0.6 }, { easing: 'ease-in' }),
        t(50, { y: 0 }),
        t(80, { y: 0 }, { easing: 'ease-in-out' }),
        t(100, { y: -2.5 }),
      ]);
      x.keys('part:body', [t(0, { x: 0, rotate: 0 }), t(40, { x: 0, rotate: 0 }), t(43, { x: 0.4, rotate: 2 }), t(47, { x: -0.4, rotate: -2 }), t(51, { x: 0.2, rotate: 1 }), t(55, { x: 0, rotate: 0 })]);
    },
  },
  // ── media ──
  {
    id: 'speaker',
    name: m('icon-library.library.speaker'),
    domain: 'media_player',
    icon: 'mdi:speaker-wireless',
    tags: ['media_player', 'speaker', 'music', 'sound'],
    duration: 1.2,
    parts: { wave_o: [m('icon-library.library.outer-wave'), [0]], wave_i: [m('icon-library.library.inner-wave'), [1]], body: [m('icon-library.library.speaker'), [2]], cone: [m('icon-library.library.cone'), [3], 'center'] },
    tracks: (x) => {
      x.keys('part:cone', [t(0, { scale: 1 }), t(10, { scale: 1.22 }, { easing: 'ease-out' }), t(28, { scale: 1 }), t(50, { scale: 1.14 }, { easing: 'ease-out' }), t(68, { scale: 1 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'volume',
    name: m('icon-library.library.volume'),
    domain: 'media_player',
    icon: 'mdi:volume-high',
    tags: ['media_player', 'volume', 'sound', 'speaker'],
    duration: 1.4,
    parts: { wave_o: [m('icon-library.library.outer-wave'), [0]], wave_i: [m('icon-library.library.inner-wave'), [1]], speaker: [m('icon-library.library.speaker'), [2], 'right'] },
    tracks: (x) => {
      x.preset('part:speaker', 'pulse', { intensity: 0.4 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 22 }));
    },
  },
  {
    id: 'tv',
    name: m('icon-library.library.tv-on'),
    domain: 'media_player',
    icon: 'mdi:television-classic',
    tags: ['media_player', 'tv', 'television'],
    duration: 2.4,
    parts: { tv: [m('icon-library.library.television'), [0], 'bottom'] },
    tracks: (x) =>
      x.keys('part:tv', [
        t(0, { scale_x: 1, scale_y: 1 }, { opacity: 0.4 }),
        t(8, { scale_x: 1.08, scale_y: 0.2 }, { opacity: 1, easing: 'ease-out' }),
        t(18, { scale_x: 1, scale_y: 1 }, { opacity: 1 }),
        t(85, { scale_x: 1, scale_y: 1 }, { opacity: 1, easing: 'ease-in' }),
        t(100, { scale_x: 1, scale_y: 1 }, { opacity: 0.4 }),
      ]),
  },
  {
    id: 'music-note',
    name: m('icon-library.library.music-note-dance'),
    domain: 'media_player',
    icon: 'mdi:music-note',
    tags: ['media_player', 'music', 'playing'],
    duration: 1.2,
    parts: { note: [m('icon-library.library.note'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:note', [t(0, { rotate: -10, y: 0 }), t(25, { rotate: 0, y: -1.5 }), t(50, { rotate: 10, y: 0 }), t(75, { rotate: 0, y: -1.5 }), t(100, { rotate: -10, y: 0 })]),
  },
  {
    id: 'play',
    name: m('icon-library.library.play'),
    domain: 'media_player',
    icon: 'mdi:play-circle',
    tags: ['media_player', 'play', 'playing'],
    duration: 1.6,
    parts: { button: [m('icon-library.library.button'), [0], 'center'] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(15, { scale: 0.88 }, { easing: 'ease-out' }), t(35, { scale: 1.08 }), t(55, { scale: 1 })]),
  },
  {
    id: 'headphones',
    name: m('icon-library.library.headphones'),
    domain: 'media_player',
    icon: 'mdi:headphones',
    tags: ['media_player', 'music', 'headphones'],
    duration: 1,
    parts: { phones: [m('icon-library.library.headphones'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:phones', [t(0, { y: 0, rotate: -4 }), t(25, { y: -1, rotate: 0 }), t(50, { y: 0, rotate: 4 }), t(75, { y: -1, rotate: 0 }), t(100, { y: 0, rotate: -4 })]),
  },
  // ── vacuum, mower ──
  {
    id: 'robot-vacuum',
    name: m('icon-library.library.robot-vacuum'),
    domain: 'vacuum',
    icon: 'mdi:robot-vacuum',
    tags: ['vacuum', 'cleaning', 'robot'],
    duration: 4,
    parts: { sensor: [m('icon-library.library.sensor'), [0], 'center'], body: [m('icon-library.library.body'), [1]], brush: [m('icon-library.library.brush'), [2], 'center'] },
    groups: { robot: [m('icon-library.library.robot'), ['sensor', 'body', 'brush'], 'center'] },
    tracks: (x) => {
      x.keys('group:robot', [t(0, { x: -2, rotate: 0 }), t(40, { x: 2, rotate: 0 }), t(50, { x: 2, rotate: 12 }), t(90, { x: -2, rotate: 12 }), t(100, { x: -2, rotate: 0 })]);
      x.keys('part:brush', SPIN(2));
      x.preset('part:sensor', 'blink', { share: 40, delay: 50 });
    },
  },
  {
    id: 'robot-mower',
    name: m('icon-library.library.robot-mower'),
    domain: 'lawn_mower',
    icon: 'mdi:robot-mower',
    tags: ['lawn_mower', 'mower', 'garden', 'robot'],
    duration: 6,
    parts: { mower: [m('icon-library.library.mower'), [0], 'bottom'] },
    tracks: (x) =>
      x.keys('part:mower', [
        t(0, { x: -2.5, y: 0, scale_x: 1 }),
        t(12, { x: -1.2, y: -0.3, scale_x: 1 }),
        t(24, { x: 0, y: 0, scale_x: 1 }),
        t(36, { x: 1.2, y: -0.3, scale_x: 1 }),
        t(46, { x: 2.5, y: 0, scale_x: 1 }),
        t(50, { x: 2.5, y: 0, scale_x: -1 }),
        t(62, { x: 1.2, y: -0.3, scale_x: -1 }),
        t(74, { x: 0, y: 0, scale_x: -1 }),
        t(86, { x: -1.2, y: -0.3, scale_x: -1 }),
        t(96, { x: -2.5, y: 0, scale_x: -1 }),
        t(100, { x: -2.5, y: 0, scale_x: 1 }),
      ]),
  },
  // ── appliances ──
  {
    id: 'washing-machine',
    name: m('icon-library.library.washing-machine'),
    domain: 'sensor',
    icon: 'mdi:washing-machine',
    tags: ['sensor', 'washer', 'washing', 'laundry', 'appliance', 'switch'],
    duration: 1.5,
    parts: { drum: [m('icon-library.library.drum'), [0], 'center'], body: [m('icon-library.library.machine'), [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:drum', SPIN());
      x.keys('part:body', presetKeyframes('shake', { intensity: 0.15, share: 100 }));
    },
  },
  {
    id: 'dryer',
    name: m('icon-library.library.tumble-dryer'),
    domain: 'sensor',
    icon: 'mdi:tumble-dryer',
    tags: ['sensor', 'dryer', 'laundry', 'appliance', 'switch'],
    duration: 2,
    parts: { body: [m('icon-library.library.dryer'), [0]], wave_l: [m('icon-library.library.left-wave'), [1]], wave_r: [m('icon-library.library.right-wave'), [2]] },
    groups: { drum: [m('icon-library.library.drum'), ['wave_l', 'wave_r'], [12, 14]] },
    tracks: (x) => x.keys('group:drum', SPIN()),
  },
  {
    id: 'dishwasher',
    name: m('icon-library.library.dishwasher'),
    domain: 'sensor',
    icon: 'mdi:dishwasher',
    tags: ['sensor', 'dishwasher', 'appliance', 'switch'],
    duration: 1.6,
    parts: { body: [m('icon-library.library.dishwasher'), [0]], drop: [m('icon-library.library.drop'), [1], 'bottom'] },
    tracks: (x) => x.preset('part:drop', 'bounce', { intensity: 0.5 }),
  },
  {
    id: 'coffee-maker',
    name: m('icon-library.library.coffee-maker'),
    domain: 'switch',
    icon: 'mdi:coffee-maker',
    tags: ['switch', 'coffee', 'kitchen', 'appliance'],
    duration: 1.2,
    parts: { machine: [m('icon-library.library.machine'), [0]], drop: [m('icon-library.library.drop'), [1], 'center'] },
    tracks: (x) => x.keys('part:drop', fall(0, 70, 4, 0)),
  },
  {
    id: 'kettle',
    name: m('icon-library.library.kettle-boiling'),
    domain: 'switch',
    icon: 'mdi:kettle-steam',
    tags: ['switch', 'kettle', 'kitchen', 'steam', 'appliance'],
    duration: 2,
    parts: { kettle: [m('icon-library.library.kettle'), [0], 'bottom'], steam_r: [m('icon-library.library.right-steam'), [1]], steam_l: [m('icon-library.library.left-steam'), [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(30, 60));
      x.keys('part:kettle', presetKeyframes('shake', { intensity: 0.12 }));
    },
  },
  {
    id: 'cooking-pot',
    name: m('icon-library.library.cooking-pot'),
    domain: 'sensor',
    icon: 'mdi:pot-steam',
    tags: ['sensor', 'cooking', 'kitchen', 'steam'],
    duration: 2.2,
    parts: { pot: [m('icon-library.library.pot'), [0]], steam_l: [m('icon-library.library.left-steam'), [1]], steam_r: [m('icon-library.library.right-steam'), [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(32, 60));
    },
  },
  {
    id: 'oven',
    name: m('icon-library.library.oven-heating'),
    domain: 'switch',
    icon: 'mdi:toaster-oven',
    tags: ['switch', 'oven', 'kitchen', 'appliance', 'heat'],
    duration: 2,
    parts: { body: [m('icon-library.library.oven'), [0]], glow: [m('icon-library.library.heating-element'), [1], 'center'] },
    tracks: (x) => x.keys('part:glow', [k(0, { color: '#ff6d00', opacity: 0.6 }), k(50, { color: '#ffab40', opacity: 1 }), k(100, { color: '#ff6d00', opacity: 0.6 })]),
  },
  {
    id: 'printer',
    name: m('icon-library.library.printer'),
    domain: 'sensor',
    icon: 'mdi:printer',
    tags: ['sensor', 'printer', 'printing'],
    duration: 2,
    parts: { paper: [m('icon-library.library.paper'), [0], 'center'], body: [m('icon-library.library.printer'), [1]] },
    tracks: (x) => x.keys('part:paper', [t(0, { y: -1.5 }, { opacity: 0 }), t(20, { y: -1.5 }, { opacity: 1, easing: 'linear' }), t(75, { y: 1.2 }, { opacity: 1 }), t(88, { y: 1.6 }, { opacity: 0 })]),
  },
  // ── battery, energy ──
  {
    id: 'battery-charging',
    name: m('icon-library.library.battery-charging'),
    domain: 'sensor',
    icon: 'mdi:battery-charging-high',
    tags: ['sensor', 'battery', 'charging', 'binary_sensor', 'ev'],
    duration: 2.5,
    parts: { shell: [m('icon-library.library.battery'), [0]], bar_1: [m('icon-library.library.bar-1'), [1]], bar_2: [m('icon-library.library.bar-2'), [3]], bar_3: [m('icon-library.library.bar-3'), [2]], bolt: [m('icon-library.library.bolt'), [4], 'center'] },
    tracks: (x) => {
      ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20)));
      x.keys('part:bolt', [t(0, { scale: 1 }, { color: '#ffc107' }), t(50, { scale: 1.12 }, { color: '#ffe082' }), t(100, { scale: 1 }, { color: '#ffc107' })]);
    },
  },
  {
    id: 'battery-level',
    name: m('icon-library.library.battery-level'),
    domain: 'sensor',
    icon: 'mdi:battery-high',
    tags: ['sensor', 'battery'],
    duration: 2.5,
    parts: { shell: [m('icon-library.library.battery'), [0]], bar_1: [m('icon-library.library.bar-1'), [1]], bar_2: [m('icon-library.library.bar-2'), [3]], bar_3: [m('icon-library.library.bar-3'), [2]] },
    tracks: (x) => ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20))),
  },
  {
    id: 'energy-bolt',
    name: m('icon-library.library.energy'),
    domain: 'sensor',
    icon: 'mdi:lightning-bolt',
    tags: ['sensor', 'energy', 'power', 'electricity'],
    duration: 2,
    parts: { bolt: [m('icon-library.library.bolt'), [0], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:bolt', [t(0, { scale: 1 }), t(8, { scale: 1.12 }), t(30, { scale: 1 })]);
    },
  },
  {
    id: 'solar-power',
    name: m('icon-library.library.solar-power'),
    domain: 'sensor',
    icon: 'mdi:solar-power',
    tags: ['sensor', 'solar', 'energy', 'sun', 'pv'],
    duration: 2.4,
    parts: { sun: [m('icon-library.library.sun'), [3], 'top-left'], ray_1: [m('icon-library.library.ray-1'), [0]], ray_2: [m('icon-library.library.ray-2'), [1]], ray_3: [m('icon-library.library.ray-3'), [2]], panel: [m('icon-library.library.panel'), [4], 'center'] },
    tracks: (x) => {
      x.preset('part:sun', 'pulse', { intensity: 0.5 });
      ['ray_1', 'ray_2', 'ray_3'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 55, delay: i * 15 })));
      x.keys('part:panel', [k(0, { opacity: 0.7 }), k(55, { opacity: 0.7, easing: 'ease-out' }), k(70, { opacity: 1, color: '#ffc107' }), k(100, { opacity: 0.7 })]);
    },
  },
  {
    id: 'electric-car',
    name: m('icon-library.library.electric-car-charging'),
    domain: 'sensor',
    icon: 'mdi:car-electric',
    tags: ['sensor', 'ev', 'car', 'charging', 'device_tracker'],
    duration: 2,
    parts: { car: [m('icon-library.library.car'), [0], 'bottom'], plug: [m('icon-library.library.charge'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:plug', [t(0, { x: -1 }, { opacity: 0.3 }), t(50, { x: 1 }, { opacity: 1 }), t(100, { x: -1 }, { opacity: 0.3 })]);
      x.preset('part:car', 'pulse', { intensity: 0.15 });
    },
  },
  {
    id: 'energy-meter',
    name: m('icon-library.library.energy-meter'),
    domain: 'sensor',
    icon: 'mdi:meter-electric-outline',
    tags: ['sensor', 'energy', 'meter', 'power'],
    duration: 1.6,
    parts: { meter: [m('icon-library.library.meter'), [0]], display: [m('icon-library.library.display'), [1]], bolt: [m('icon-library.library.bolt'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:display', [k(0, { opacity: 1 }), k(50, { opacity: 0.4 }), k(100, { opacity: 1 })]);
    },
  },
  // ── water ──
  {
    id: 'water-drop',
    name: m('icon-library.library.water-drop'),
    domain: 'binary_sensor',
    icon: 'mdi:water',
    tags: ['binary_sensor', 'water', 'leak', 'moisture', 'sensor'],
    duration: 1.8,
    parts: { drop: [m('icon-library.library.drop'), [0], 'bottom'] },
    tracks: (x) =>
      x.keys('part:drop', [
        t(0, { y: -3, scale_x: 0.8, scale_y: 0.8 }, { opacity: 0 }),
        t(12, { y: -3, scale_x: 0.85, scale_y: 0.85 }, { opacity: 1, easing: 'ease-in' }),
        t(50, { y: 0, scale_x: 0.95, scale_y: 1.05 }, { opacity: 1, easing: 'ease-out' }),
        t(58, { y: 0, scale_x: 1.25, scale_y: 0.72 }, { opacity: 1 }),
        t(68, { y: 0, scale_x: 0.96, scale_y: 1.05 }, { opacity: 1 }),
        t(76, { y: 0, scale_x: 1, scale_y: 1 }, { opacity: 1, easing: 'ease-in' }),
        t(100, { y: 0, scale_x: 1, scale_y: 1 }, { opacity: 0 }),
      ]),
  },
  {
    id: 'water-pump',
    name: m('icon-library.library.water-pump'),
    domain: 'switch',
    icon: 'mdi:water-pump',
    tags: ['switch', 'pump', 'water', 'valve'],
    duration: 1.2,
    parts: { drop: [m('icon-library.library.drop'), [0], 'center'], pump: [m('icon-library.library.pump'), [1]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 2.5, -1.5)),
  },
  {
    id: 'faucet',
    name: m('icon-library.library.faucet'),
    domain: 'valve',
    icon: 'mdi:faucet',
    tags: ['valve', 'water', 'tap', 'switch'],
    duration: 1.2,
    parts: { drop: [m('icon-library.library.drop'), [0], 'center'], tap: [m('icon-library.library.tap'), [1]], handle: [m('icon-library.library.handle'), [2]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 4, -1.5)),
  },
  {
    id: 'shower',
    name: m('icon-library.library.shower'),
    domain: 'switch',
    icon: 'mdi:shower-head',
    tags: ['switch', 'shower', 'water', 'bathroom'],
    duration: 1,
    parts: {
      head: [m('icon-library.library.head'), [13]],
      bar: [m('icon-library.library.bar'), [12]],
      d1: [m('icon-library.library.drop-1'), [9]],
      d2: [m('icon-library.library.drop-2'), [10]],
      d3: [m('icon-library.library.drop-3'), [11]],
      d4: [m('icon-library.library.drop-4'), [5]],
      d5: [m('icon-library.library.drop-5'), [6]],
      d6: [m('icon-library.library.drop-6'), [7]],
      d7: [m('icon-library.library.drop-7'), [8]],
      d8: [m('icon-library.library.drop-8'), [4]],
      d9: [m('icon-library.library.drop-9'), [3]],
      d10: [m('icon-library.library.drop-10'), [2]],
      d11: [m('icon-library.library.drop-11'), [1]],
      d12: [m('icon-library.library.drop-12'), [0]],
    },
    tracks: (x) => {
      const offsets = [0, 34, 67, 17, 50, 84, 8, 25, 75, 42, 92, 58];
      offsets.forEach((o, i) => {
        const at = o % 50;
        x.keys(`part:d${i + 1}`, fall(at, 50, 2, -1));
      });
    },
  },
  {
    id: 'sprinkler',
    name: m('icon-library.library.sprinkler'),
    domain: 'valve',
    icon: 'mdi:sprinkler-variant',
    tags: ['valve', 'switch', 'irrigation', 'garden', 'water'],
    duration: 1.4,
    parts: {
      stand: [m('icon-library.library.stand'), [0]],
      head: [m('icon-library.library.head'), [13], 'bottom'],
      l1: [m('icon-library.library.left-drop-1'), [1]],
      l2: [m('icon-library.library.left-drop-2'), [2]],
      l3: [m('icon-library.library.left-drop-3'), [3]],
      l4: [m('icon-library.library.left-drop-4'), [5]],
      l5: [m('icon-library.library.left-drop-5'), [6]],
      l6: [m('icon-library.library.left-drop-6'), [4]],
      r1: [m('icon-library.library.right-drop-1'), [11]],
      r2: [m('icon-library.library.right-drop-2'), [12]],
      r3: [m('icon-library.library.right-drop-3'), [7]],
      r4: [m('icon-library.library.right-drop-4'), [9]],
      r5: [m('icon-library.library.right-drop-5'), [8]],
      r6: [m('icon-library.library.right-drop-6'), [10]],
    },
    tracks: (x) => {
      const ring = [0, 1, 1, 2, 2, 2];
      for (const side of ['l', 'r'])
        ring.forEach((r, i) => x.keys(`part:${side}${i + 1}`, [k(0, { opacity: 0.15 }), k(r * 18, { opacity: 0.15, easing: 'ease-out' }), k(r * 18 + 20, { opacity: 1, easing: 'ease-in' }), k(r * 18 + 50, { opacity: 0.15 })]));
      x.keys('part:head', [t(0, { rotate: -6 }), t(50, { rotate: 6 }), t(100, { rotate: -6 })]);
    },
  },
  {
    id: 'valve',
    name: m('icon-library.library.valve'),
    domain: 'valve',
    icon: 'mdi:valve',
    tags: ['valve', 'water', 'gas', 'pipe'],
    duration: 3,
    parts: { pipe_l: [m('icon-library.library.left-pipe'), [0]], pipe_r: [m('icon-library.library.right-pipe'), [1]], handle: [m('icon-library.library.handle'), [2], [12, 12]] },
    tracks: (x) =>
      x.keys('part:handle', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: 90 }), t(60, { rotate: 90 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'pool',
    name: m('icon-library.library.pool'),
    domain: 'switch',
    icon: 'mdi:pool',
    tags: ['switch', 'pool', 'water', 'pump', 'sensor'],
    duration: 2.5,
    parts: { ladder: [m('icon-library.library.ladder'), [0]], water: [m('icon-library.library.water'), [1], 'center'] },
    tracks: (x) => x.keys('part:water', [t(0, { x: 0, y: 0 }), t(25, { x: -1, y: -0.3 }), t(50, { x: 0, y: 0 }), t(75, { x: 1, y: -0.3 }), t(100, { x: 0, y: 0 })]),
  },
  {
    id: 'watering-can',
    name: m('icon-library.library.watering'),
    domain: 'plant',
    icon: 'mdi:watering-can',
    tags: ['plant', 'garden', 'irrigation', 'water', 'valve'],
    duration: 3,
    parts: { can: [m('icon-library.library.watering-can'), [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:can', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(35, { rotate: 18 }), t(45, { rotate: 15 }), t(55, { rotate: 18 }), t(65, { rotate: 15 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 })]),
  },
  // ── security ──
  {
    id: 'doorbell-ring',
    name: m('icon-library.library.doorbell-ring'),
    domain: 'event',
    icon: 'mdi:bell-ring',
    tags: ['event', 'binary_sensor', 'doorbell', 'bell', 'notification', 'ring'],
    duration: 1.8,
    parts: { body: [m('icon-library.library.bell'), [0]], clapper: [m('icon-library.library.clapper'), [1], 'top'], wave_r: [m('icon-library.library.right-wave'), [2]], wave_l: [m('icon-library.library.left-wave'), [3]] },
    groups: { bell: [m('icon-library.library.bell-and-clapper'), ['body', 'clapper'], [12, 2]], waves: [m('icon-library.library.sound-waves'), ['wave_r', 'wave_l']] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70, intensity: 1 });
      x.keys('part:clapper', swingBelow(presetKeyframes('ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 }), CLAPPER_DROP));
      x.preset('group:waves', 'draw-loop', { share: 80, delay: 5 });
    },
  },
  {
    id: 'notification',
    name: m('icon-library.library.notification'),
    domain: 'event',
    icon: 'mdi:bell-alert',
    tags: ['event', 'notification', 'alert', 'bell', 'update'],
    duration: 1.8,
    parts: { mark: [m('icon-library.library.exclamation'), [0]], dot: [m('icon-library.library.dot'), [1]], body: [m('icon-library.library.bell'), [2]], clapper: [m('icon-library.library.clapper'), [3], 'top'] },
    groups: { bell: [m('icon-library.library.bell-and-clapper'), ['body', 'clapper'], [12, 2]], alert: [m('icon-library.library.exclamation-mark'), ['mark', 'dot'], 'center'] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70 });
      x.keys('part:clapper', swingBelow(presetKeyframes('ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 }), CLAPPER_DROP));
      x.preset('group:alert', 'blink', { share: 60, delay: 30 });
    },
  },
  {
    id: 'alarm-light',
    name: m('icon-library.library.alarm-light'),
    domain: 'siren',
    icon: 'mdi:alarm-light',
    tags: ['siren', 'alarm_control_panel', 'alarm', 'security', 'triggered'],
    duration: 1,
    parts: { light: [m('icon-library.library.light'), [6], 'bottom'], base: [m('icon-library.library.base'), [5]], ray_l: [m('icon-library.library.ray-left'), [3]], ray_tl: [m('icon-library.library.ray-top-left'), [0]], ray_t: [m('icon-library.library.ray-top'), [1]], ray_tr: [m('icon-library.library.ray-top-right'), [2]], ray_r: [m('icon-library.library.ray-right'), [4]] },
    tracks: (x) => {
      x.keys('part:light', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.05 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) =>
        x.keys(`part:${r}`, i % 2 ? [k(0, { opacity: 0.15, easing: 'steps(1, end)' }), k(50, { opacity: 1, easing: 'steps(1, end)' }), k(100, { opacity: 0.15 })] : [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.15, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]),
      );
    },
  },
  {
    id: 'smoke-alarm',
    name: m('icon-library.library.smoke-alarm'),
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector-alert',
    tags: ['binary_sensor', 'smoke', 'co', 'carbon_monoxide', 'alarm', 'safety'],
    duration: 1,
    parts: { body: [m('icon-library.library.detector'), [0]], centre: [m('icon-library.library.centre'), [1], 'center'], mark: [m('icon-library.library.exclamation'), [2]], dot: [m('icon-library.library.dot'), [3]] },
    groups: { alert: [m('icon-library.library.exclamation-mark'), ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('part:centre', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.15 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      x.keys('group:alert', [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.1, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]);
    },
  },
  {
    id: 'smoke-detector',
    name: m('icon-library.library.smoke-detector-standby'),
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector',
    tags: ['binary_sensor', 'smoke', 'safety', 'ok'],
    duration: 3,
    parts: { body: [m('icon-library.library.detector'), [0]], centre: [m('icon-library.library.centre'), [1], 'center'] },
    tracks: (x) =>
      x.keys('part:centre', [
        t(0, { scale: 1 }, { color: 'currentColor' }),
        t(4, { scale: 0.9 }, { color: '#4caf50' }),
        t(12, { scale: 0.9 }, { color: '#4caf50' }),
        t(18, { scale: 1 }, { color: 'currentColor' }),
      ]),
  },
  {
    id: 'alarm-clock',
    name: m('icon-library.library.alarm-clock'),
    domain: 'sensor',
    icon: 'mdi:alarm',
    tags: ['sensor', 'alarm', 'clock', 'timer', 'time', 'wake'],
    duration: 1.4,
    parts: { clock: [m('icon-library.library.clock'), [0]], hands: [m('icon-library.library.hands'), [1]], bell_l: [m('icon-library.library.left-bell'), [2], 'center'], bell_r: [m('icon-library.library.right-bell'), [3], 'center'] },
    groups: { alarm: [m('icon-library.library.alarm-clock'), ['clock', 'hands', 'bell_l', 'bell_r'], [12, 22]] },
    tracks: (x) => {
      x.preset('group:alarm', 'ring', { share: 70, intensity: 0.5 });
      x.keys('part:bell_l', [t(0, { y: 0 }), t(10, { y: -0.6 }), t(20, { y: 0 }), t(30, { y: -0.6 }), t(40, { y: 0 }), t(50, { y: -0.6 }), t(60, { y: 0 })]);
      x.keys('part:bell_r', [t(0, { y: 0 }), t(5, { y: 0 }), t(15, { y: -0.6 }), t(25, { y: 0 }), t(35, { y: -0.6 }), t(45, { y: 0 }), t(55, { y: -0.6 }), t(65, { y: 0 })]);
    },
  },
  {
    id: 'alert',
    name: m('icon-library.library.alert'),
    domain: 'binary_sensor',
    icon: 'mdi:alert',
    tags: ['binary_sensor', 'alert', 'problem', 'warning', 'update'],
    duration: 1.2,
    parts: { sign: [m('icon-library.library.sign'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:sign', [t(0, { scale: 1 }, { opacity: 1 }), t(15, { scale: 1.12 }, { opacity: 1 }), t(30, { scale: 1 }, { opacity: 0.55 }), t(45, { scale: 1.08 }, { opacity: 1 }), t(60, { scale: 1 }, { opacity: 1 })]),
  },
  {
    id: 'security-armed',
    name: m('icon-library.library.security-armed'),
    domain: 'alarm_control_panel',
    icon: 'mdi:shield-home',
    tags: ['alarm_control_panel', 'security', 'armed', 'shield'],
    duration: 2.4,
    parts: { shield: [m('icon-library.library.shield'), [0], 'center'] },
    tracks: (x) => x.keys('part:shield', [t(0, { scale: 1 }, { opacity: 0.85 }), t(50, { scale: 1.07 }, { opacity: 1 }), t(100, { scale: 1 }, { opacity: 0.85 })]),
  },
  {
    id: 'cctv',
    name: m('icon-library.library.security-camera'),
    domain: 'camera',
    icon: 'mdi:cctv',
    tags: ['camera', 'cctv', 'security', 'surveillance'],
    duration: 5,
    // P4-2: MDI draws the camera, its arm and the wall bracket in one outline, so the rig is cut
    // (library/rigs.ts): the mount stays still, the head (body and hood) pans around the joint.
    own: [CCTV_MOUNT, CCTV_HEAD_BODY, CCTV_HEAD_HOOD],
    parts: { mount: [m('icon-library.library.mount'), [0]], head: [m('icon-library.library.camera-head'), [1, 2], [16, 13]] },
    tracks: (x) => x.keys('part:head', [t(0, { rotate: 0 }), t(10, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: -12 }), t(55, { rotate: -12 }, { easing: 'ease-in-out' }), t(85, { rotate: 8 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'camera-snapshot',
    name: m('icon-library.library.camera-snapshot'),
    domain: 'camera',
    icon: 'mdi:camera',
    tags: ['camera', 'snapshot', 'photo'],
    duration: 2,
    parts: { body: [m('icon-library.library.camera'), [0], 'center'], lens: [m('icon-library.library.lens'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:lens', [t(0, { scale: 1 }), t(10, { scale: 0.6 }, { easing: 'ease-out' }), t(25, { scale: 1.1 }), t(40, { scale: 1 })]);
      x.keys('part:body', [t(0, { scale: 1 }), t(10, { scale: 0.96 }), t(25, { scale: 1 })]);
    },
  },
  {
    id: 'motion',
    name: m('icon-library.library.motion-detected'),
    domain: 'binary_sensor',
    icon: 'mdi:motion-sensor',
    tags: ['binary_sensor', 'motion', 'occupancy', 'presence', 'movement'],
    duration: 1.5,
    parts: { head: [m('icon-library.library.head'), [0]], wave_o: [m('icon-library.library.outer-wave'), [1]], wave_m: [m('icon-library.library.middle-wave'), [2]], wave_i: [m('icon-library.library.inner-wave'), [3]], body: [m('icon-library.library.person'), [4]] },
    groups: { person: [m('icon-library.library.person'), ['head', 'body'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:person', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.6, rotate: 2 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.6, rotate: 2 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 55 }));
      x.keys('part:wave_m', presetKeyframes('wave', { share: 55, delay: 15 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 55, delay: 30 }));
    },
  },
  {
    id: 'walking',
    name: m('icon-library.library.walking'),
    domain: 'person',
    icon: 'mdi:walk',
    tags: ['person', 'device_tracker', 'presence', 'motion', 'away'],
    duration: 1,
    parts: { body: [m('icon-library.library.body'), [0]], head: [m('icon-library.library.head'), [1]] },
    groups: { walker: [m('icon-library.library.walker'), ['body', 'head'], 'bottom'] },
    tracks: (x) => x.keys('group:walker', [t(0, { y: 0, rotate: -2 }), t(25, { y: -0.7, rotate: 0 }), t(50, { y: 0, rotate: 2 }), t(75, { y: -0.7, rotate: 0 }), t(100, { y: 0, rotate: -2 })]),
  },
  {
    id: 'person-home',
    name: m('icon-library.library.person-home'),
    domain: 'person',
    icon: 'mdi:account',
    tags: ['person', 'device_tracker', 'presence', 'home', 'user'],
    duration: 2.4,
    parts: { head: [m('icon-library.library.head'), [0], 'bottom'], body: [m('icon-library.library.body'), [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { y: 0, rotate: 0 }), t(30, { y: -0.6, rotate: -6 }), t(60, { y: 0, rotate: 4 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:body', [t(0, { scale_y: 1 }), t(30, { scale_y: 1.04 }), t(60, { scale_y: 1 })]);
    },
  },
  {
    id: 'doorbell-press',
    name: m('icon-library.library.doorbell-press'),
    domain: 'button',
    icon: 'mdi:doorbell',
    tags: ['button', 'doorbell', 'event', 'press'],
    duration: 2,
    parts: { button: [m('icon-library.library.button'), [0], 'center'], panel: [m('icon-library.library.panel'), [1]] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(8, { scale: 0.7 }, { easing: 'ease-out', color: '#03a9f4' }), t(20, { scale: 1.08 }), t(32, { scale: 1 })]),
  },
  // ── weather ──
  {
    id: 'sunny',
    name: m('icon-library.library.sunny'),
    domain: 'weather',
    icon: 'mdi:weather-sunny',
    tags: ['weather', 'sun', 'sunny', 'clear', 'day'],
    duration: 6,
    parts: { sun: [m('icon-library.library.sun'), [0], 'center'], ray_t: [m('icon-library.library.ray-top'), [1]], ray_tl: [m('icon-library.library.ray-top-left'), [2]], ray_bl: [m('icon-library.library.ray-bottom-left'), [3]], ray_tr: [m('icon-library.library.ray-top-right'), [4]], ray_br: [m('icon-library.library.ray-bottom-right'), [5]], ray_b: [m('icon-library.library.ray-bottom'), [6]] },
    groups: { rays: [m('icon-library.library.rays'), ['ray_t', 'ray_tl', 'ray_bl', 'ray_tr', 'ray_br', 'ray_b'], [12, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
    },
  },
  {
    id: 'cloudy',
    name: m('icon-library.library.cloudy'),
    domain: 'weather',
    icon: 'mdi:weather-cloudy',
    tags: ['weather', 'cloud', 'cloudy', 'overcast'],
    duration: 4,
    parts: { cloud: [m('icon-library.library.cloud'), [0]] },
    tracks: (x) => x.keys('part:cloud', [t(0, { x: 0 }), t(25, { x: 1.2 }), t(75, { x: -1.2 }), t(100, { x: 0 })]),
  },
  {
    id: 'pouring',
    name: m('icon-library.library.pouring-rain'),
    domain: 'weather',
    icon: 'mdi:weather-pouring',
    tags: ['weather', 'rain', 'rainy', 'pouring', 'storm'],
    duration: 1,
    parts: { drop_l: [m('icon-library.library.left-drop'), [0]], drop_m: [m('icon-library.library.middle-drop'), [1]], drop_r: [m('icon-library.library.right-drop'), [2]], cloud: [m('icon-library.library.cloud'), [3]] },
    tracks: (x) => {
      x.keys('part:drop_l', fall(0, 70, 2.5, -1.5));
      x.keys('part:drop_m', fall(30, 70, 2.5, -1.5));
      x.keys('part:drop_r', fall(15, 70, 2.5, -1.5));
    },
  },
  {
    id: 'rainy',
    name: m('icon-library.library.rain'),
    domain: 'weather',
    icon: 'mdi:weather-rainy',
    tags: ['weather', 'rain', 'rainy', 'drizzle'],
    duration: 1.6,
    parts: { cloud: [m('icon-library.library.cloud'), [0]], drop: [m('icon-library.library.drop'), [1]] },
    tracks: (x) => {
      x.keys('part:drop', fall(0, 80, 2, -2));
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.5 }), t(100, { x: 0 })]);
    },
  },
  {
    id: 'snowy',
    name: m('icon-library.library.snow'),
    domain: 'weather',
    icon: 'mdi:weather-snowy',
    tags: ['weather', 'snow', 'snowy', 'winter'],
    duration: 2.6,
    parts: { cloud: [m('icon-library.library.cloud'), [0]], flake: [m('icon-library.library.snowflake'), [1], 'center'] },
    tracks: (x) => x.keys('part:flake', fall(0, 90, 1.5, -2.5).map((f, i) => ({ ...f, transform: { ...f.transform, rotate: [0, 0, 30, 80, 90, 90][i] ?? 90 } }))),
  },
  {
    id: 'heavy-snow',
    name: m('icon-library.library.heavy-snow'),
    domain: 'weather',
    icon: 'mdi:weather-snowy-heavy',
    tags: ['weather', 'snow', 'snowy', 'blizzard', 'winter'],
    duration: 2.4,
    parts: { flake_l: [m('icon-library.library.left-flake'), [0], 'center'], cloud: [m('icon-library.library.cloud'), [1]], flake_r: [m('icon-library.library.right-flake'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:flake_l', [t(0, { y: -1.5, rotate: 0 }, { opacity: 0 }), t(15, { y: -1, rotate: 15 }, { opacity: 1 }), t(80, { y: 1.5, rotate: 90 }, { opacity: 1 }), t(100, { y: 2, rotate: 110 }, { opacity: 0 })]);
      x.keys('part:flake_r', [t(0, { y: -0.5, rotate: 40 }, { opacity: 1 }), t(30, { y: 1, rotate: 80 }, { opacity: 0 }), t(45, { y: -2, rotate: 0 }, { opacity: 0 }), t(60, { y: -1.5, rotate: 10 }, { opacity: 1 }), t(100, { y: -0.5, rotate: 40 }, { opacity: 1 })]);
    },
  },
  {
    id: 'thunderstorm',
    name: m('icon-library.library.thunderstorm'),
    domain: 'weather',
    icon: 'mdi:weather-lightning',
    tags: ['weather', 'lightning', 'storm', 'thunder'],
    duration: 2.2,
    parts: { cloud: [m('icon-library.library.cloud'), [0]], bolt: [m('icon-library.library.bolt'), [1], 'top'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(10, '#ffd600'));
      x.keys('part:cloud', [t(0, { x: 0 }), t(10, { x: 0 }), t(13, { x: 0.3 }), t(16, { x: -0.3 }), t(19, { x: 0.2 }), t(22, { x: 0 })]);
    },
  },
  {
    id: 'storm-rain',
    name: m('icon-library.library.storm-with-rain'),
    domain: 'weather',
    icon: 'mdi:weather-lightning-rainy',
    tags: ['weather', 'lightning', 'rain', 'storm'],
    duration: 2,
    parts: { cloud: [m('icon-library.library.cloud'), [0]], bolt: [m('icon-library.library.bolt'), [1], 'top'], drop: [m('icon-library.library.drop'), [2]] },
    tracks: (x) => {
      x.keys('part:bolt', flash(5, '#ffd600'));
      x.keys('part:drop', fall(20, 60, 2, -1.5));
    },
  },
  {
    id: 'fog',
    name: m('icon-library.library.fog'),
    domain: 'weather',
    icon: 'mdi:weather-fog',
    tags: ['weather', 'fog', 'mist', 'haze'],
    duration: 4,
    parts: { line_1: [m('icon-library.library.fog-line-1'), [0]], line_2: [m('icon-library.library.fog-line-2'), [1]], cloud: [m('icon-library.library.cloud'), [2]], line_3: [m('icon-library.library.fog-line-3'), [3]], line_4: [m('icon-library.library.fog-line-4'), [4]] },
    tracks: (x) => {
      const drift = (d: number) => [t(0, { x: 0 }, { opacity: 1 }), t(50, { x: d }, { opacity: 0.5 }), t(100, { x: 0 }, { opacity: 1 })];
      x.keys('part:line_1', drift(1.5));
      x.keys('part:line_2', drift(-1.2));
      x.keys('part:line_3', drift(1.2));
      x.keys('part:line_4', drift(-1.5));
    },
  },
  {
    id: 'windy',
    name: m('icon-library.library.windy'),
    domain: 'weather',
    icon: 'mdi:weather-windy',
    tags: ['weather', 'wind', 'windy', 'breeze'],
    duration: 3,
    parts: { gust_t: [m('icon-library.library.top-gust'), [0]], gust_m: [m('icon-library.library.middle-gust'), [1]], gust_b: [m('icon-library.library.bottom-gust'), [2]] },
    tracks: (x) => {
      x.preset('part:gust_m', 'draw-loop', { share: 80 });
      x.preset('part:gust_t', 'draw-loop', { share: 80, delay: 10 });
      x.preset('part:gust_b', 'draw-loop', { share: 80, delay: 20 });
    },
  },
  {
    id: 'clear-night',
    name: m('icon-library.library.clear-night'),
    domain: 'weather',
    icon: 'mdi:weather-night',
    tags: ['weather', 'night', 'moon', 'clear', 'stars'],
    duration: 3,
    parts: { star_l: [m('icon-library.library.big-star'), [0], 'center'], star_r: [m('icon-library.library.small-star'), [1], 'center'], moon: [m('icon-library.library.moon'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:moon', [t(0, { rotate: -4 }), t(50, { rotate: 4 }), t(100, { rotate: -4 })]);
      x.keys('part:star_l', [t(0, { scale: 1 }, { opacity: 1 }), t(20, { scale: 0.6 }, { opacity: 0.4 }), t(40, { scale: 1 }, { opacity: 1 })]);
      x.keys('part:star_r', [t(0, { scale: 1 }, { opacity: 1 }), t(50, { scale: 1 }, { opacity: 1 }), t(70, { scale: 0.5 }, { opacity: 0.3 }), t(90, { scale: 1 }, { opacity: 1 })]);
    },
  },
  {
    id: 'partly-cloudy',
    name: m('icon-library.library.partly-cloudy'),
    domain: 'weather',
    icon: 'mdi:weather-partly-cloudy',
    tags: ['weather', 'partlycloudy', 'cloud', 'sun'],
    duration: 4,
    parts: { cloud: [m('icon-library.library.sun-and-cloud'), [0]], ray_t: [m('icon-library.library.ray-top'), [1]], ray_tl: [m('icon-library.library.ray-top-left'), [2]], ray_r: [m('icon-library.library.ray-right'), [3]], ray_l: [m('icon-library.library.ray-left'), [4]] },
    tracks: (x) => {
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.8 }), t(100, { x: 0 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 60, delay: i * 12 })));
    },
  },
  {
    id: 'hail',
    name: m('icon-library.library.hail'),
    domain: 'weather',
    icon: 'mdi:weather-hail',
    tags: ['weather', 'hail', 'storm'],
    duration: 1.4,
    parts: { cloud: [m('icon-library.library.cloud'), [0]], ball_1: [m('icon-library.library.hailstone-1'), [3], 'center'], ball_2: [m('icon-library.library.hailstone-2'), [2], 'center'], ball_3: [m('icon-library.library.hailstone-3'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:ball_1', fall(0, 60, 2, -1.5));
      x.keys('part:ball_2', fall(25, 60, 2, -1.5));
      x.keys('part:ball_3', fall(12, 60, 1.5, -1.5));
    },
  },
  {
    id: 'sunset',
    name: m('icon-library.library.sunset'),
    domain: 'sun',
    icon: 'mdi:weather-sunset',
    tags: ['sun', 'weather', 'sunset', 'sunrise', 'evening'],
    duration: 3,
    parts: { sun: [m('icon-library.library.sun'), [0]], line_1: [m('icon-library.library.horizon-1'), [1]], line_2: [m('icon-library.library.horizon-2'), [2]], ray_t: [m('icon-library.library.ray-top'), [3]], ray_l: [m('icon-library.library.ray-left'), [4]], ray_r: [m('icon-library.library.ray-right'), [5]] },
    tracks: (x) => ['ray_l', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [t(0, { y: 0 }, { opacity: 1 }), t(15 + i * 10, { y: 0 }, { opacity: 1, easing: 'ease-in' }), t(45 + i * 10, { y: 1 }, { opacity: 0.1 }), t(70, { y: 1 }, { opacity: 0.1, easing: 'ease-out' }), t(95, { y: 0 }, { opacity: 1 })])),
  },
  // ── network, phones, time ──
  {
    id: 'wifi',
    name: m('icon-library.library.wi-fi'),
    domain: 'binary_sensor',
    icon: 'mdi:wifi',
    tags: ['binary_sensor', 'connectivity', 'wifi', 'network', 'signal'],
    duration: 1.6,
    parts: { dot: [m('icon-library.library.dot'), [0]], arc_m: [m('icon-library.library.middle-arc'), [2]], arc_t: [m('icon-library.library.top-arc'), [1]] },
    groups: { signal: [m('icon-library.library.signal'), ['dot', 'arc_m', 'arc_t']] },
    tracks: (x) => ['dot', 'arc_m', 'arc_t'].forEach((p, i) => x.keys(`part:${p}`, [k(0, { opacity: 0.25 }), k(i * 20, { opacity: 0.25, easing: 'ease-out' }), k(i * 20 + 15, { opacity: 1 }), k(75, { opacity: 1, easing: 'ease-in' }), k(95, { opacity: 0.25 })])),
  },
  {
    id: 'router',
    name: m('icon-library.library.router'),
    domain: 'binary_sensor',
    icon: 'mdi:router-wireless',
    tags: ['binary_sensor', 'connectivity', 'router', 'network', 'internet'],
    duration: 1.6,
    parts: { wave_o: [m('icon-library.library.outer-wave'), [0]], wave_i: [m('icon-library.library.inner-wave'), [1]], router: [m('icon-library.library.router'), [2]] },
    tracks: (x) => {
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'phone-signal',
    name: m('icon-library.library.phone-signal'),
    domain: 'device_tracker',
    icon: 'mdi:cellphone-wireless',
    tags: ['device_tracker', 'phone', 'mobile', 'connectivity'],
    duration: 1.6,
    parts: { wave_o: [m('icon-library.library.outer-wave'), [0]], wave_i: [m('icon-library.library.inner-wave'), [1]], dot: [m('icon-library.library.dot'), [2], 'center'], phone: [m('icon-library.library.phone'), [3]] },
    tracks: (x) => {
      x.preset('part:dot', 'pulse', { intensity: 0.8, share: 40 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60, delay: 10 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 30 }));
    },
  },
  {
    id: 'phone-ringing',
    name: m('icon-library.library.phone-ringing'),
    domain: 'event',
    icon: 'mdi:phone-ring',
    tags: ['event', 'phone', 'call', 'ringing'],
    duration: 1.2,
    parts: { handset: [m('icon-library.library.handset'), [0], 'center'], wave_r: [m('icon-library.library.right-wave'), [1]], wave_t: [m('icon-library.library.top-wave'), [2]], wave_l: [m('icon-library.library.left-wave'), [3]] },
    tracks: (x) => {
      x.preset('part:handset', 'ring', { share: 60, intensity: 0.5 });
      ['wave_l', 'wave_t', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, presetKeyframes('wave', { share: 50, delay: i * 12 })));
    },
  },
  {
    id: 'phone-vibrate',
    name: m('icon-library.library.phone-vibrate'),
    domain: 'device_tracker',
    icon: 'mdi:cellphone',
    tags: ['device_tracker', 'phone', 'mobile', 'notification'],
    duration: 1.4,
    parts: { phone: [m('icon-library.library.phone'), [0], 'center'] },
    tracks: (x) => x.keys('part:phone', [0, 4, 8, 12, 16, 20, 24, 28, 32, 50, 54, 58, 62, 66, 70, 74, 78, 82].map((at, i, all) => t(at, { rotate: i === 0 || i === 8 || i === 9 || i === all.length - 1 ? 0 : i % 2 ? 4 : -4 }, { easing: 'linear' }))),
  },
  {
    id: 'clock',
    name: m('icon-library.library.clock'),
    domain: 'sensor',
    icon: 'mdi:clock-outline',
    tags: ['sensor', 'time', 'clock', 'timer', 'schedule'],
    duration: 4,
    parts: { face: [m('icon-library.library.face'), [0]], hands: [m('icon-library.library.hands'), [1], [12, 12]] },
    tracks: (x) => x.keys('part:hands', SPIN()),
  },
  {
    id: 'hourglass',
    name: m('icon-library.library.hourglass'),
    domain: 'timer',
    icon: 'mdi:timer-sand',
    tags: ['timer', 'time', 'waiting', 'countdown'],
    duration: 3,
    parts: { glass: [m('icon-library.library.hourglass'), [0], [12, 12]], sand: [m('icon-library.library.sand'), [1], 'bottom'] },
    tracks: (x) => {
      // the sand drains, hides while the glass turns over (the glass alone is symmetric: 180° looks
      // like 0°, so the loop has no jump) and is back at the top for the next cycle
      x.keys('part:sand', [
        t(0, { scale_y: 1 }, { opacity: 1, easing: 'linear' }),
        t(68, { scale_y: 0.1 }, { opacity: 1 }),
        t(72, { scale_y: 0.1 }, { opacity: 0 }),
        t(95, { scale_y: 1 }, { opacity: 0 }),
        t(100, { scale_y: 1 }, { opacity: 1 }),
      ]);
      x.keys('part:glass', [t(0, { rotate: 0 }), t(72, { rotate: 0 }, { easing: 'ease-in-out' }), t(95, { rotate: 180 }), t(100, { rotate: 180 })]);
    },
  },
  {
    id: 'timer',
    name: m('icon-library.library.timer'),
    domain: 'timer',
    icon: 'mdi:timer-outline',
    tags: ['timer', 'time', 'countdown', 'stopwatch'],
    duration: 3,
    parts: { face: [m('icon-library.library.face'), [0]], hand: [m('icon-library.library.hand'), [1], [12, 13]], button: [m('icon-library.library.button'), [2]] },
    tracks: (x) => {
      x.keys('part:hand', SPIN());
      x.keys('part:button', [t(0, { y: 0 }), t(4, { y: 0.6 }), t(10, { y: 0 })]);
    },
  },
  {
    id: 'car',
    name: m('icon-library.library.car-driving'),
    domain: 'device_tracker',
    icon: 'mdi:car',
    tags: ['device_tracker', 'car', 'vehicle', 'driving', 'away'],
    duration: 0.8,
    parts: { car: [m('icon-library.library.car'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:car', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.4, rotate: -1 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.3, rotate: 1 }), t(100, { y: 0, rotate: 0 })]),
  },
  // ── home, garden, pets ──
  {
    id: 'trash',
    name: m('icon-library.library.trash-day'),
    domain: 'calendar',
    icon: 'mdi:trash-can',
    tags: ['calendar', 'sensor', 'trash', 'garbage', 'waste', 'bin'],
    duration: 2,
    parts: { bin: [m('icon-library.library.bin'), [0], 'bottom'] },
    tracks: (x) => x.preset('part:bin', 'wobble', { share: 60, intensity: 1 }),
  },
  {
    id: 'plant',
    name: m('icon-library.library.plant'),
    domain: 'plant',
    icon: 'mdi:sprout',
    tags: ['plant', 'garden', 'moisture', 'sensor'],
    duration: 3,
    parts: { soil: [m('icon-library.library.soil'), [0]], sprout: [m('icon-library.library.sprout'), [1], [12, 17]] },
    tracks: (x) => x.keys('part:sprout', [t(0, { rotate: -5 }), t(50, { rotate: 5 }), t(100, { rotate: -5 })]),
  },
  {
    id: 'flower',
    name: m('icon-library.library.flower'),
    domain: 'plant',
    icon: 'mdi:flower',
    tags: ['plant', 'garden', 'flower', 'spring'],
    duration: 3,
    parts: { leaf_l: [m('icon-library.library.left-leaf'), [0], 'top-right'], head: [m('icon-library.library.flower'), [1], 'bottom'], leaf_r: [m('icon-library.library.right-leaf'), [2], 'top-left'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { rotate: -6 }), t(50, { rotate: 6 }), t(100, { rotate: -6 })]);
      x.keys('part:leaf_l', [t(0, { rotate: 0 }), t(50, { rotate: -6 }), t(100, { rotate: 0 })]);
      x.keys('part:leaf_r', [t(0, { rotate: 0 }), t(50, { rotate: 6 }), t(100, { rotate: 0 })]);
    },
  },
  {
    id: 'leaf',
    name: m('icon-library.library.leaf-in-the-wind'),
    domain: 'sensor',
    icon: 'mdi:leaf',
    tags: ['sensor', 'eco', 'energy', 'nature', 'plant'],
    duration: 3,
    parts: { leaf: [m('icon-library.library.leaf'), [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:leaf', [t(0, { rotate: 0, y: 0 }), t(30, { rotate: -8, y: -0.6 }), t(60, { rotate: 4, y: 0.2 }), t(100, { rotate: 0, y: 0 })]),
  },
  {
    id: 'paw',
    name: m('icon-library.library.pet'),
    domain: 'sensor',
    icon: 'mdi:paw',
    tags: ['sensor', 'pet', 'dog', 'cat', 'feeder', 'presence'],
    duration: 1.6,
    parts: { toe_1: [m('icon-library.library.toe-1'), [2], 'center'], toe_2: [m('icon-library.library.toe-2'), [0], 'center'], toe_3: [m('icon-library.library.toe-3'), [1], 'center'], toe_4: [m('icon-library.library.toe-4'), [3], 'center'], pad: [m('icon-library.library.pad'), [4], 'center'] },
    tracks: (x) => {
      ['toe_1', 'toe_2', 'toe_3', 'toe_4'].forEach((p, i) => x.keys(`part:${p}`, [t(0, { scale: 1 }), t(i * 10, { scale: 1 }, { easing: 'ease-out' }), t(i * 10 + 10, { scale: 1.25 }, { easing: 'ease-in' }), t(i * 10 + 22, { scale: 1 })]));
      x.keys('part:pad', [t(0, { scale: 1 }), t(50, { scale: 1 }), t(60, { scale: 1.08 }), t(72, { scale: 1 })]);
    },
  },
  {
    id: 'dog',
    name: m('icon-library.library.dog'),
    domain: 'sensor',
    icon: 'mdi:dog',
    tags: ['sensor', 'pet', 'dog', 'presence'],
    duration: 2,
    parts: { dog: [m('icon-library.library.dog'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:dog', [t(0, { rotate: 0 }), t(20, { rotate: -10 }), t(45, { rotate: -10 }, { easing: 'ease-in-out' }), t(65, { rotate: 0 })]),
  },
  {
    id: 'bee',
    name: m('icon-library.library.bee'),
    domain: 'sensor',
    icon: 'mdi:bee',
    tags: ['sensor', 'garden', 'nature', 'pollen'],
    duration: 3,
    parts: { bee: [m('icon-library.library.bee'), [0], 'center'] },
    tracks: (x) => {
      x.path('part:bee', 'M0 0 C 1.5 -2 3 -2 3 0 S 1.5 2 0 0 S -3 2 -3 0 S -1.5 -2 0 0');
      x.keys('part:bee', [t(0, { rotate: -8 }, { easing: 'linear' }), t(25, { rotate: 8 }, { easing: 'linear' }), t(50, { rotate: -8 }, { easing: 'linear' }), t(75, { rotate: 8 }, { easing: 'linear' }), t(100, { rotate: -8 })]);
    },
  },
  {
    id: 'bird',
    name: m('icon-library.library.bird'),
    domain: 'sensor',
    icon: 'mdi:bird',
    tags: ['sensor', 'garden', 'nature', 'bird'],
    duration: 1.6,
    parts: { bird: [m('icon-library.library.bird'), [0], 'center'] },
    tracks: (x) => x.keys('part:bird', [t(0, { y: 0, rotate: 0 }), t(30, { y: -1.4, rotate: -6 }), t(60, { y: 0.3, rotate: 3 }), t(100, { y: 0, rotate: 0 })]),
  },
  {
    id: 'fish',
    name: m('icon-library.library.fish'),
    domain: 'sensor',
    icon: 'mdi:fish',
    tags: ['sensor', 'aquarium', 'pet', 'water'],
    duration: 2,
    parts: { fish: [m('icon-library.library.fish'), [0], 'center'] },
    tracks: (x) => x.keys('part:fish', [t(0, { x: 0, y: 0, rotate: 0 }), t(25, { x: 0.8, y: -0.4, rotate: -6 }), t(50, { x: 0, y: 0, rotate: 0 }), t(75, { x: -0.8, y: 0.4, rotate: 6 }), t(100, { x: 0, y: 0, rotate: 0 })]),
  },
  {
    id: 'heartbeat',
    name: m('icon-library.library.heartbeat'),
    domain: 'sensor',
    icon: 'mdi:heart-pulse',
    tags: ['sensor', 'health', 'heart', 'pulse', 'fitness'],
    duration: 1.2,
    parts: { top: [m('icon-library.library.heart-top'), [0]], bottom: [m('icon-library.library.heart-and-pulse'), [1]] },
    groups: { heart: [m('icon-library.library.heart'), ['top', 'bottom'], 'center'] },
    tracks: (x) => x.keys('group:heart', [t(0, { scale: 1 }, { easing: 'ease-out' }), t(10, { scale: 1.15 }, { easing: 'ease-in' }), t(22, { scale: 1 }, { easing: 'ease-out' }), t(32, { scale: 1.1 }, { easing: 'ease-in' }), t(48, { scale: 1 })]),
  },
  {
    id: 'home',
    name: m('icon-library.library.home'),
    domain: 'zone',
    icon: 'mdi:home',
    tags: ['zone', 'person', 'home', 'presence', 'house'],
    duration: 2.4,
    parts: { house: [m('icon-library.library.house'), [0], 'bottom'] },
    tracks: (x) => x.preset('part:house', 'bounce', { intensity: 0.4, share: 50 }),
  },
  {
    id: 'gauge',
    name: m('icon-library.library.gauge'),
    domain: 'sensor',
    icon: 'mdi:gauge',
    tags: ['sensor', 'gauge', 'speed', 'pressure', 'level'],
    duration: 3,
    parts: { dial: [m('icon-library.library.dial'), [0]], needle: [m('icon-library.library.needle'), [1], [11, 14]], tick_t: [m('icon-library.library.top-tick'), [2]], tick_l: [m('icon-library.library.left-tick'), [3]], tick_r: [m('icon-library.library.right-tick'), [4]] },
    tracks: (x) => x.keys('part:needle', [t(0, { rotate: -70 }, { easing: 'ease-out' }), t(40, { rotate: 10 }, { easing: 'ease-in-out' }), t(55, { rotate: -5 }), t(70, { rotate: 5 }, { easing: 'ease-in-out' }), t(100, { rotate: -70 })]),
  },
];

/** The library: ready icon animations for the icons of most Home Assistant domains. */
export const ICON_LIBRARY: LibraryEntry[] = [...SPECS, ...LIGHTS, ...HOME, ...FIRE_AND_CLEANING, ...SEASONAL, ...NATURE].map((s) => entryOf(s, STYLE_HINTS[s.id]));

/** The library's domains, in first-seen order. */
export const LIBRARY_DOMAINS: string[] = [...new Set(ICON_LIBRARY.map((e) => e.domain))];

const words = (icon: string): string[] => icon.slice(icon.indexOf(':') + 1).split('-');

/**
 * Entries for a domain (`light`), an entity id (`light.kitchen`: its domain) or an icon id
 * (`mdi:bell-ring`): the entries of that very icon first, then those whose icon shares its first
 * word (`mdi:lightbulb-outline` → the bulb), then the entries of the domain or tagged with it.
 */
export function libraryFor(domainOrIcon: string): LibraryEntry[] {
  const q = (domainOrIcon ?? '').trim().toLowerCase();
  if (!q) return [];
  const out: LibraryEntry[] = [];
  const add = (list: LibraryEntry[]) => list.forEach((e) => !out.includes(e) && out.push(e));
  if (q.includes(':')) {
    add(ICON_LIBRARY.filter((e) => e.icon === q));
    const first = words(q)[0];
    add(ICON_LIBRARY.filter((e) => words(e.icon)[0] === first || e.tags.includes(first)));
    return out;
  }
  const domain = q.includes('.') ? q.slice(0, q.indexOf('.')) : q;
  add(ICON_LIBRARY.filter((e) => e.domain === domain));
  add(ICON_LIBRARY.filter((e) => e.tags.includes(domain)));
  return out;
}

/** Entries matching a search (name, id, icon, domain and tags, every word). */
export function searchLibrary(query: string, domain?: string): LibraryEntry[] {
  const terms = foldText(query ?? '').split(/\s+/).filter(Boolean);
  return ICON_LIBRARY.filter((e) => {
    if (domain && e.domain !== domain && !e.tags.includes(domain)) return false;
    const hay = foldText(`${e.name} ${e.id} ${e.icon} ${e.domain} ${e.tags.join(' ')}`);
    return terms.every((w) => hay.includes(w));
  });
}
