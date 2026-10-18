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

/*
 * The animated icon library (icon animator core, contract icon-library 1.2.0): ready animations for
 * the icons of most Home Assistant domains, plus pseudo-domain categories (animal, seasonal, maker,
 * household) for icons no domain fits. Each entry builds a normal keyframes document with a rig and
 * one track per moving part; the studio edits it like any other document. The rig's source is the
 * icon's own geometry embedded as SVG (`rig.svg`, the bundled MDI path of mdi-paths.ts), and the
 * parts name pieces of that SVG: a card plays it through the rig runtime without resolving any
 * icon, so a dashboard never depends on Home Assistant's MDI version for the piece numbering. Icons
 * whose moving piece MDI draws in one outline with the rest (the lock's shackle, the cctv head)
 * embed paths cut from the MDI path instead (`own`, see library/rigs.ts).
 *
 * This file holds the 2026.10.03 entries; the P4 entries (brand artist's p4-spec.json) live in the
 * category files under library/, the builder and motion helpers in library/build.ts.
 * Lives in the studio bundle and the lazy icon animator chunk only, never in magic-card.js.
 */

export type { LibraryEntry } from '../contracts/icon-library';
export { padKeys, svgOf } from './library/build';

// ── the library ──

const LOCK_BODY = 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H18Z M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z';
const LOCK_SHACKLE = 'M7,8V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6V8Z';

/** The clappers hang from the bell mouth (y 18), 3 units above their own top edge (y 21). */
const CLAPPER_DROP = 3;

const SPECS: Spec[] = [
  // ── light ──
  {
    id: 'bulb-glow',
    name: m('Bulb glow'),
    domain: 'light',
    icon: 'mdi:lightbulb-on',
    tags: ['light', 'lamp', 'bulb', 'on'],
    duration: 2,
    parts: { bulb: [m('Bulb'), [0], 'center'], base: [m('Base'), [1]], ray_l: [m('Ray left'), [3]], ray_tl: [m('Ray top left'), [5]], ray_t: [m('Ray top'), [4]], ray_tr: [m('Ray top right'), [6]], ray_r: [m('Ray right'), [2]] },
    groups: { rays: [m('Rays'), ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'], [12, 11]] },
    tracks: (x) => {
      x.preset('part:bulb', 'pulse', { intensity: 0.35 });
      x.keys('group:rays', [t(0, { scale: 0.9 }), t(50, { scale: 1.12 }), t(100, { scale: 0.9 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [k(0, { opacity: 0.35 }), k(10 + i * 8, { opacity: 0.35, easing: 'ease-out' }), k(30 + i * 8, { opacity: 1, easing: 'ease-in' }), k(60 + i * 8, { opacity: 0.35 })]));
    },
  },
  {
    id: 'ceiling-light',
    name: m('Ceiling light'),
    domain: 'light',
    icon: 'mdi:ceiling-light',
    tags: ['light', 'pendant', 'lamp'],
    duration: 3,
    parts: { shade: [m('Shade'), [0]], bulb: [m('Bulb'), [1], 'center'] },
    groups: { pendant: [m('Pendant'), ['shade', 'bulb'], [12, 4]] },
    tracks: (x) => {
      x.preset('group:pendant', 'swing', { intensity: 0.3 });
      x.preset('part:bulb', 'pulse', { intensity: 1 });
      x.keys('part:bulb', [k(0, { opacity: 0.55 }), k(50, { opacity: 1 }), k(100, { opacity: 0.55 })]);
    },
  },
  {
    id: 'table-lamp',
    name: m('Table lamp switching on'),
    domain: 'light',
    icon: 'mdi:lamp',
    tags: ['light', 'lamp', 'switch'],
    duration: 3,
    parts: { shade: [m('Shade'), [0], 'bottom'], foot: [m('Foot'), [1]] },
    tracks: (x) => {
      x.keys('part:shade', [k(0, { opacity: 0.25, easing: 'linear' }), k(6, { opacity: 1, easing: 'linear' }), k(10, { opacity: 0.45, easing: 'linear' }), k(15, { opacity: 1 }), k(90, { opacity: 1, easing: 'ease-in' }), k(100, { opacity: 0.25 })]);
      x.keys('part:shade', [t(15, { scale: 1 }), t(22, { scale: 1.05 }), t(32, { scale: 1 })]);
    },
  },
  {
    id: 'led-strip',
    name: m('LED strip colour chase'),
    domain: 'light',
    icon: 'mdi:led-strip-variant',
    tags: ['light', 'led', 'rgb', 'colour'],
    duration: 3,
    parts: { top: [m('Top strip'), [0]], middle: [m('Middle strip'), [2]], bottom: [m('Bottom strip'), [1]] },
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
    name: m('Light group'),
    domain: 'light',
    icon: 'mdi:lightbulb-group',
    tags: ['light', 'group', 'bulbs'],
    duration: 1.8,
    parts: { left: [m('Left bulb'), [3], 'center'], centre: [m('Centre bulb'), [0], 'center'], right: [m('Right bulb'), [5], 'center'], bases: [m('Bases'), [2, 1, 4]] },
    tracks: (x) => {
      ['left', 'centre', 'right'].forEach((p, i) => x.keys(`part:${p}`, presetKeyframes('wave', { share: 60, delay: i * 20 })));
    },
  },
  // ── switch, power ──
  {
    id: 'switch-toggle',
    name: m('Switch toggle'),
    domain: 'switch',
    icon: 'mdi:toggle-switch-outline',
    tags: ['switch', 'input_boolean', 'toggle'],
    duration: 2.4,
    parts: { track: [m('Track'), [0]], knob: [m('Knob'), [1], 'center'] },
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
    name: m('Power button'),
    domain: 'switch',
    icon: 'mdi:power',
    tags: ['switch', 'power', 'button', 'on'],
    duration: 2.4,
    parts: { ring: [m('Ring'), [0], 'center'], line: [m('Line'), [1], 'bottom'] },
    tracks: (x) => {
      x.preset('part:ring', 'draw-loop', { share: 100 });
      x.keys('part:line', [t(0, { y: 0 }), t(8, { y: -1.2 }, { easing: 'ease-in' }), t(18, { y: 0 }, { easing: 'ease-out' }), t(24, { y: -0.3 }), t(30, { y: 0 })]);
    },
  },
  {
    id: 'plug-in',
    name: m('Plug in'),
    domain: 'switch',
    icon: 'mdi:power-plug',
    tags: ['switch', 'outlet', 'plug', 'socket', 'power'],
    duration: 2.4,
    parts: { plug: [m('Plug'), [0], 'center'] },
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
    name: m('Fan spin'),
    domain: 'fan',
    icon: 'mdi:fan',
    tags: ['fan', 'ventilation', 'spin'],
    duration: 1.2,
    parts: { blades: [m('Blades'), [0], [12, 12]] },
    tracks: (x) => x.keys('part:blades', SPIN()),
  },
  {
    id: 'ceiling-fan',
    name: m('Ceiling fan with light'),
    domain: 'fan',
    icon: 'mdi:ceiling-fan-light',
    tags: ['fan', 'ceiling', 'light'],
    duration: 1.2,
    parts: { rod: [m('Rod'), [0]], blade_l: [m('Left blade'), [1]], blade_r: [m('Right blade'), [2]], hub: [m('Hub'), [3]], ray_m: [m('Middle ray'), [4]], ray_r: [m('Right ray'), [5]], ray_l: [m('Left ray'), [6]] },
    groups: { blades: [m('Blades'), ['blade_l', 'blade_r'], [12, 13.5]], rays: [m('Light rays'), ['ray_m', 'ray_r', 'ray_l'], [12, 18]] },
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
    name: m('Air purifier'),
    domain: 'fan',
    icon: 'mdi:air-purifier',
    tags: ['fan', 'air', 'purifier', 'humidifier'],
    duration: 2.4,
    parts: { dial: [m('Dial'), [0], 'center'], body: [m('Body'), [1]], air_t: [m('Air top'), [2]], air_b: [m('Air bottom'), [3]] },
    tracks: (x) => {
      x.preset('part:air_t', 'draw-loop');
      x.preset('part:air_b', 'draw-loop', { delay: 15, share: 85 });
      x.preset('part:dial', 'pulse', { intensity: 0.4 });
    },
  },
  // ── climate ──
  {
    id: 'flame',
    name: m('Flame'),
    domain: 'climate',
    icon: 'mdi:fire',
    tags: ['climate', 'heat', 'heating', 'thermostat', 'fire', 'water_heater'],
    duration: 1.2,
    parts: { flame: [m('Flame'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:flame', flame(1.2)),
  },
  {
    id: 'fireplace',
    name: m('Fireplace'),
    domain: 'climate',
    icon: 'mdi:fireplace',
    tags: ['climate', 'heat', 'fire', 'stove'],
    duration: 1.4,
    parts: { floor: [m('Hearth'), [0]], mantel: [m('Mantel'), [1]], outer: [m('Outer flame'), [2], 'bottom'], inner: [m('Inner flame'), [3], 'bottom'] },
    tracks: (x) => {
      x.keys('part:outer', presetKeyframes('flicker', { intensity: 0.7 }));
      x.keys('part:inner', flame(1.4, 10, 90));
    },
  },
  {
    id: 'snowflake',
    name: m('Snowflake'),
    domain: 'climate',
    icon: 'mdi:snowflake',
    tags: ['climate', 'cool', 'cooling', 'frost', 'freezer', 'weather'],
    duration: 6,
    parts: { flake: [m('Snowflake'), [0], [12, 12]] },
    tracks: (x) => x.keys('part:flake', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]),
  },
  {
    id: 'air-conditioner',
    name: m('Air conditioner'),
    domain: 'climate',
    icon: 'mdi:air-conditioner',
    tags: ['climate', 'cool', 'ac', 'fan'],
    duration: 1.5,
    parts: { fan: [m('Fan'), [0], 'center'], a: [m('A'), [1]], slash: [m('Slash'), [2]], c: [m('C'), [3]] },
    tracks: (x) => x.keys('part:fan', SPIN()),
  },
  {
    id: 'radiator',
    name: m('Radiator heat'),
    domain: 'climate',
    icon: 'mdi:radiator',
    tags: ['climate', 'heat', 'heating', 'heater', 'radiator'],
    duration: 2.4,
    parts: { wave_l: [m('Left wave'), [0]], wave_m: [m('Middle wave'), [1]], wave_r: [m('Right wave'), [2]], body: [m('Radiator'), [3]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, rise(i * 18, 62, -2.5))),
  },
  {
    id: 'heat-haze',
    name: m('Heat haze'),
    domain: 'sensor',
    icon: 'mdi:heat-wave',
    tags: ['sensor', 'temperature', 'heat', 'hot', 'climate'],
    duration: 2.4,
    parts: { wave_l: [m('Left wave'), [0]], wave_m: [m('Middle wave'), [1]], wave_r: [m('Right wave'), [2]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, [t(0, { y: 0.8 }, { opacity: 0.35 }), t(15 + i * 15, { y: 0.8 }, { opacity: 0.35, easing: 'ease-in-out' }), t(45 + i * 15, { y: -0.8 }, { opacity: 1, easing: 'ease-in-out' }), t(75 + i * 8, { y: 0.8 }, { opacity: 0.35 })])),
  },
  {
    id: 'thermometer',
    name: m('Thermometer'),
    domain: 'sensor',
    icon: 'mdi:thermometer-lines',
    tags: ['sensor', 'temperature', 'climate', 'thermostat'],
    duration: 2.4,
    parts: {
      tube: [m('Thermometer'), [8], 'bottom'],
      l1: [m('Mark 1'), [7]],
      r1: [m('Mark 2'), [3]],
      l2: [m('Mark 3'), [6]],
      r2: [m('Mark 4'), [2]],
      l3: [m('Mark 5'), [5]],
      r3: [m('Mark 6'), [1]],
      l4: [m('Mark 7'), [4]],
      r4: [m('Mark 8'), [0]],
    },
    tracks: (x) => {
      x.keys('part:tube', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.04 }), t(100, { scale_y: 1 })]);
      ['l1', 'r1', 'l2', 'r2', 'l3', 'r3', 'l4', 'r4'].forEach((m, i) => x.keys(`part:${m}`, fillIn(4 + Math.floor(i / 2) * 14, 80)));
    },
  },
  {
    id: 'humidity',
    name: m('Humidity drop'),
    domain: 'sensor',
    icon: 'mdi:water-percent',
    tags: ['sensor', 'humidity', 'moisture', 'humidifier'],
    duration: 2.2,
    parts: { drop: [m('Drop'), [0], 'bottom'] },
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
    name: m('Humidifier mist'),
    domain: 'humidifier',
    icon: 'mdi:air-humidifier',
    tags: ['humidifier', 'dehumidifier', 'humidity', 'mist'],
    duration: 2,
    parts: { dial: [m('Dial'), [0]], body: [m('Body'), [1]], drop: [m('Drop'), [2], 'center'] },
    tracks: (x) => x.keys('part:drop', rise(0, 80, -3)),
  },
  {
    id: 'outdoor-temperature',
    name: m('Outdoor temperature'),
    domain: 'sensor',
    icon: 'mdi:sun-thermometer',
    tags: ['sensor', 'temperature', 'weather', 'sun', 'outdoor'],
    duration: 8,
    parts: { ray_t: [m('Ray top'), [0]], ray_l: [m('Ray left'), [2]], ray_bl: [m('Ray bottom left'), [4]], ray_b: [m('Ray bottom'), [5]], sun: [m('Sun'), [3], 'center'], thermo: [m('Thermometer'), [1], 'bottom'] },
    groups: { rays: [m('Rays'), ['ray_t', 'ray_l', 'ray_bl', 'ray_b'], [10, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: -20 }), t(50, { rotate: 20 }), t(100, { rotate: -20 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
      x.keys('part:thermo', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.05 }), t(100, { scale_y: 1 })]);
    },
  },
  // ── cover ──
  {
    id: 'garage-door',
    name: m('Garage door'),
    domain: 'cover',
    icon: 'mdi:garage-variant',
    tags: ['cover', 'garage', 'door', 'binary_sensor'],
    duration: 4,
    parts: { house: [m('Garage'), [0]], slat_t: [m('Top slat'), [1]], slat_m: [m('Middle slat'), [3]], slat_b: [m('Bottom slat'), [2]] },
    tracks: (x) => {
      x.keys('part:slat_t', rollUp(-2.5, 0));
      x.keys('part:slat_m', rollUp(-5.5, 1));
      x.keys('part:slat_b', rollUp(-8.5, 2));
    },
  },
  {
    id: 'roller-shutter',
    name: m('Roller shutter'),
    domain: 'cover',
    icon: 'mdi:window-shutter',
    tags: ['cover', 'shutter', 'blind', 'window'],
    duration: 4,
    parts: { frame: [m('Frame'), [0]], s1: [m('Slat 1'), [1]], s2: [m('Slat 2'), [2]], s3: [m('Slat 3'), [3]], s4: [m('Slat 4'), [4]] },
    tracks: (x) => ['s1', 's2', 's3', 's4'].forEach((s, i) => x.keys(`part:${s}`, rollUp(-(2 + i * 3), i))),
  },
  {
    id: 'curtains',
    name: m('Curtains'),
    domain: 'cover',
    icon: 'mdi:curtains',
    tags: ['cover', 'curtain', 'window'],
    duration: 4,
    parts: { rod: [m('Rod'), [0]], left: [m('Left curtain'), [1], 'top-left'], right: [m('Right curtain'), [2], 'top-right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.45));
      x.keys('part:right', fold(0.45));
    },
  },
  {
    id: 'gate',
    name: m('Gate'),
    domain: 'cover',
    icon: 'mdi:gate-open',
    tags: ['cover', 'gate', 'binary_sensor'],
    duration: 4,
    parts: { left: [m('Left leaf'), [0], 'left'], right: [m('Right leaf'), [1], 'right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.4, { skew_y: -10 }));
      x.keys('part:right', fold(0.4, { skew_y: 10 }));
    },
  },
  {
    id: 'door',
    name: m('Door opening'),
    domain: 'binary_sensor',
    icon: 'mdi:door',
    tags: ['binary_sensor', 'door', 'opening', 'cover'],
    duration: 3,
    parts: { leaf: [m('Door'), [0]], knob: [m('Knob'), [1]] },
    groups: { door: [m('Door leaf'), ['leaf', 'knob'], 'left'] },
    tracks: (x) => x.keys('group:door', fold(0.5, { skew_y: -8 })),
  },
  {
    id: 'fridge',
    name: m('Fridge door'),
    domain: 'binary_sensor',
    icon: 'mdi:fridge',
    tags: ['binary_sensor', 'fridge', 'freezer', 'door', 'appliance'],
    duration: 3,
    parts: { top: [m('Freezer door'), [0], 'left'], bottom: [m('Fridge door'), [1]] },
    tracks: (x) => x.keys('part:top', fold(0.55, { skew_y: -8 })),
  },
  // ── lock ──
  {
    id: 'lock',
    name: m('Lock'),
    domain: 'lock',
    icon: 'mdi:lock',
    tags: ['lock', 'door', 'security'],
    duration: 2.4,
    own: [LOCK_BODY, LOCK_SHACKLE],
    parts: { body: [m('Body'), [0], 'bottom'], shackle: [m('Shackle'), [1]] },
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
    name: m('Speaker'),
    domain: 'media_player',
    icon: 'mdi:speaker-wireless',
    tags: ['media_player', 'speaker', 'music', 'sound'],
    duration: 1.2,
    parts: { wave_o: [m('Outer wave'), [0]], wave_i: [m('Inner wave'), [1]], body: [m('Speaker'), [2]], cone: [m('Cone'), [3], 'center'] },
    tracks: (x) => {
      x.keys('part:cone', [t(0, { scale: 1 }), t(10, { scale: 1.22 }, { easing: 'ease-out' }), t(28, { scale: 1 }), t(50, { scale: 1.14 }, { easing: 'ease-out' }), t(68, { scale: 1 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'volume',
    name: m('Volume'),
    domain: 'media_player',
    icon: 'mdi:volume-high',
    tags: ['media_player', 'volume', 'sound', 'speaker'],
    duration: 1.4,
    parts: { wave_o: [m('Outer wave'), [0]], wave_i: [m('Inner wave'), [1]], speaker: [m('Speaker'), [2], 'right'] },
    tracks: (x) => {
      x.preset('part:speaker', 'pulse', { intensity: 0.4 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 22 }));
    },
  },
  {
    id: 'tv',
    name: m('TV on'),
    domain: 'media_player',
    icon: 'mdi:television-classic',
    tags: ['media_player', 'tv', 'television'],
    duration: 2.4,
    parts: { tv: [m('Television'), [0], 'bottom'] },
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
    name: m('Music note dance'),
    domain: 'media_player',
    icon: 'mdi:music-note',
    tags: ['media_player', 'music', 'playing'],
    duration: 1.2,
    parts: { note: [m('Note'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:note', [t(0, { rotate: -10, y: 0 }), t(25, { rotate: 0, y: -1.5 }), t(50, { rotate: 10, y: 0 }), t(75, { rotate: 0, y: -1.5 }), t(100, { rotate: -10, y: 0 })]),
  },
  {
    id: 'play',
    name: m('Play'),
    domain: 'media_player',
    icon: 'mdi:play-circle',
    tags: ['media_player', 'play', 'playing'],
    duration: 1.6,
    parts: { button: [m('Button'), [0], 'center'] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(15, { scale: 0.88 }, { easing: 'ease-out' }), t(35, { scale: 1.08 }), t(55, { scale: 1 })]),
  },
  {
    id: 'headphones',
    name: m('Headphones'),
    domain: 'media_player',
    icon: 'mdi:headphones',
    tags: ['media_player', 'music', 'headphones'],
    duration: 1,
    parts: { phones: [m('Headphones'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:phones', [t(0, { y: 0, rotate: -4 }), t(25, { y: -1, rotate: 0 }), t(50, { y: 0, rotate: 4 }), t(75, { y: -1, rotate: 0 }), t(100, { y: 0, rotate: -4 })]),
  },
  // ── vacuum, mower ──
  {
    id: 'robot-vacuum',
    name: m('Robot vacuum'),
    domain: 'vacuum',
    icon: 'mdi:robot-vacuum',
    tags: ['vacuum', 'cleaning', 'robot'],
    duration: 4,
    parts: { sensor: [m('Sensor'), [0], 'center'], body: [m('Body'), [1]], brush: [m('Brush'), [2], 'center'] },
    groups: { robot: [m('Robot'), ['sensor', 'body', 'brush'], 'center'] },
    tracks: (x) => {
      x.keys('group:robot', [t(0, { x: -2, rotate: 0 }), t(40, { x: 2, rotate: 0 }), t(50, { x: 2, rotate: 12 }), t(90, { x: -2, rotate: 12 }), t(100, { x: -2, rotate: 0 })]);
      x.keys('part:brush', SPIN(2));
      x.preset('part:sensor', 'blink', { share: 40, delay: 50 });
    },
  },
  {
    id: 'robot-mower',
    name: m('Robot mower'),
    domain: 'lawn_mower',
    icon: 'mdi:robot-mower',
    tags: ['lawn_mower', 'mower', 'garden', 'robot'],
    duration: 6,
    parts: { mower: [m('Mower'), [0], 'bottom'] },
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
    name: m('Washing machine'),
    domain: 'sensor',
    icon: 'mdi:washing-machine',
    tags: ['sensor', 'washer', 'washing', 'laundry', 'appliance', 'switch'],
    duration: 1.5,
    parts: { drum: [m('Drum'), [0], 'center'], body: [m('Machine'), [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:drum', SPIN());
      x.keys('part:body', presetKeyframes('shake', { intensity: 0.15, share: 100 }));
    },
  },
  {
    id: 'dryer',
    name: m('Tumble dryer'),
    domain: 'sensor',
    icon: 'mdi:tumble-dryer',
    tags: ['sensor', 'dryer', 'laundry', 'appliance', 'switch'],
    duration: 2,
    parts: { body: [m('Dryer'), [0]], wave_l: [m('Left wave'), [1]], wave_r: [m('Right wave'), [2]] },
    groups: { drum: [m('Drum'), ['wave_l', 'wave_r'], [12, 14]] },
    tracks: (x) => x.keys('group:drum', SPIN()),
  },
  {
    id: 'dishwasher',
    name: m('Dishwasher'),
    domain: 'sensor',
    icon: 'mdi:dishwasher',
    tags: ['sensor', 'dishwasher', 'appliance', 'switch'],
    duration: 1.6,
    parts: { body: [m('Dishwasher'), [0]], drop: [m('Drop'), [1], 'bottom'] },
    tracks: (x) => x.preset('part:drop', 'bounce', { intensity: 0.5 }),
  },
  {
    id: 'coffee-maker',
    name: m('Coffee maker'),
    domain: 'switch',
    icon: 'mdi:coffee-maker',
    tags: ['switch', 'coffee', 'kitchen', 'appliance'],
    duration: 1.2,
    parts: { machine: [m('Machine'), [0]], drop: [m('Drop'), [1], 'center'] },
    tracks: (x) => x.keys('part:drop', fall(0, 70, 4, 0)),
  },
  {
    id: 'kettle',
    name: m('Kettle boiling'),
    domain: 'switch',
    icon: 'mdi:kettle-steam',
    tags: ['switch', 'kettle', 'kitchen', 'steam', 'appliance'],
    duration: 2,
    parts: { kettle: [m('Kettle'), [0], 'bottom'], steam_r: [m('Right steam'), [1]], steam_l: [m('Left steam'), [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(30, 60));
      x.keys('part:kettle', presetKeyframes('shake', { intensity: 0.12 }));
    },
  },
  {
    id: 'cooking-pot',
    name: m('Cooking pot'),
    domain: 'sensor',
    icon: 'mdi:pot-steam',
    tags: ['sensor', 'cooking', 'kitchen', 'steam'],
    duration: 2.2,
    parts: { pot: [m('Pot'), [0]], steam_l: [m('Left steam'), [1]], steam_r: [m('Right steam'), [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(32, 60));
    },
  },
  {
    id: 'oven',
    name: m('Oven heating'),
    domain: 'switch',
    icon: 'mdi:toaster-oven',
    tags: ['switch', 'oven', 'kitchen', 'appliance', 'heat'],
    duration: 2,
    parts: { body: [m('Oven'), [0]], glow: [m('Heating element'), [1], 'center'] },
    tracks: (x) => x.keys('part:glow', [k(0, { color: '#ff6d00', opacity: 0.6 }), k(50, { color: '#ffab40', opacity: 1 }), k(100, { color: '#ff6d00', opacity: 0.6 })]),
  },
  {
    id: 'printer',
    name: m('Printer'),
    domain: 'sensor',
    icon: 'mdi:printer',
    tags: ['sensor', 'printer', 'printing'],
    duration: 2,
    parts: { paper: [m('Paper'), [0], 'center'], body: [m('Printer'), [1]] },
    tracks: (x) => x.keys('part:paper', [t(0, { y: -1.5 }, { opacity: 0 }), t(20, { y: -1.5 }, { opacity: 1, easing: 'linear' }), t(75, { y: 1.2 }, { opacity: 1 }), t(88, { y: 1.6 }, { opacity: 0 })]),
  },
  // ── battery, energy ──
  {
    id: 'battery-charging',
    name: m('Battery charging'),
    domain: 'sensor',
    icon: 'mdi:battery-charging-high',
    tags: ['sensor', 'battery', 'charging', 'binary_sensor', 'ev'],
    duration: 2.5,
    parts: { shell: [m('Battery'), [0]], bar_1: [m('Bar 1'), [1]], bar_2: [m('Bar 2'), [3]], bar_3: [m('Bar 3'), [2]], bolt: [m('Bolt'), [4], 'center'] },
    tracks: (x) => {
      ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20)));
      x.keys('part:bolt', [t(0, { scale: 1 }, { color: '#ffc107' }), t(50, { scale: 1.12 }, { color: '#ffe082' }), t(100, { scale: 1 }, { color: '#ffc107' })]);
    },
  },
  {
    id: 'battery-level',
    name: m('Battery level'),
    domain: 'sensor',
    icon: 'mdi:battery-high',
    tags: ['sensor', 'battery'],
    duration: 2.5,
    parts: { shell: [m('Battery'), [0]], bar_1: [m('Bar 1'), [1]], bar_2: [m('Bar 2'), [3]], bar_3: [m('Bar 3'), [2]] },
    tracks: (x) => ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20))),
  },
  {
    id: 'energy-bolt',
    name: m('Energy'),
    domain: 'sensor',
    icon: 'mdi:lightning-bolt',
    tags: ['sensor', 'energy', 'power', 'electricity'],
    duration: 2,
    parts: { bolt: [m('Bolt'), [0], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:bolt', [t(0, { scale: 1 }), t(8, { scale: 1.12 }), t(30, { scale: 1 })]);
    },
  },
  {
    id: 'solar-power',
    name: m('Solar power'),
    domain: 'sensor',
    icon: 'mdi:solar-power',
    tags: ['sensor', 'solar', 'energy', 'sun', 'pv'],
    duration: 2.4,
    parts: { sun: [m('Sun'), [3], 'top-left'], ray_1: [m('Ray 1'), [0]], ray_2: [m('Ray 2'), [1]], ray_3: [m('Ray 3'), [2]], panel: [m('Panel'), [4], 'center'] },
    tracks: (x) => {
      x.preset('part:sun', 'pulse', { intensity: 0.5 });
      ['ray_1', 'ray_2', 'ray_3'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 55, delay: i * 15 })));
      x.keys('part:panel', [k(0, { opacity: 0.7 }), k(55, { opacity: 0.7, easing: 'ease-out' }), k(70, { opacity: 1, color: '#ffc107' }), k(100, { opacity: 0.7 })]);
    },
  },
  {
    id: 'electric-car',
    name: m('Electric car charging'),
    domain: 'sensor',
    icon: 'mdi:car-electric',
    tags: ['sensor', 'ev', 'car', 'charging', 'device_tracker'],
    duration: 2,
    parts: { car: [m('Car'), [0], 'bottom'], plug: [m('Charge'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:plug', [t(0, { x: -1 }, { opacity: 0.3 }), t(50, { x: 1 }, { opacity: 1 }), t(100, { x: -1 }, { opacity: 0.3 })]);
      x.preset('part:car', 'pulse', { intensity: 0.15 });
    },
  },
  {
    id: 'energy-meter',
    name: m('Energy meter'),
    domain: 'sensor',
    icon: 'mdi:meter-electric-outline',
    tags: ['sensor', 'energy', 'meter', 'power'],
    duration: 1.6,
    parts: { meter: [m('Meter'), [0]], display: [m('Display'), [1]], bolt: [m('Bolt'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:display', [k(0, { opacity: 1 }), k(50, { opacity: 0.4 }), k(100, { opacity: 1 })]);
    },
  },
  // ── water ──
  {
    id: 'water-drop',
    name: m('Water drop'),
    domain: 'binary_sensor',
    icon: 'mdi:water',
    tags: ['binary_sensor', 'water', 'leak', 'moisture', 'sensor'],
    duration: 1.8,
    parts: { drop: [m('Drop'), [0], 'bottom'] },
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
    name: m('Water pump'),
    domain: 'switch',
    icon: 'mdi:water-pump',
    tags: ['switch', 'pump', 'water', 'valve'],
    duration: 1.2,
    parts: { drop: [m('Drop'), [0], 'center'], pump: [m('Pump'), [1]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 2.5, -1.5)),
  },
  {
    id: 'faucet',
    name: m('Faucet'),
    domain: 'valve',
    icon: 'mdi:faucet',
    tags: ['valve', 'water', 'tap', 'switch'],
    duration: 1.2,
    parts: { drop: [m('Drop'), [0], 'center'], tap: [m('Tap'), [1]], handle: [m('Handle'), [2]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 4, -1.5)),
  },
  {
    id: 'shower',
    name: m('Shower'),
    domain: 'switch',
    icon: 'mdi:shower-head',
    tags: ['switch', 'shower', 'water', 'bathroom'],
    duration: 1,
    parts: {
      head: [m('Head'), [13]],
      bar: [m('Bar'), [12]],
      d1: [m('Drop 1'), [9]],
      d2: [m('Drop 2'), [10]],
      d3: [m('Drop 3'), [11]],
      d4: [m('Drop 4'), [5]],
      d5: [m('Drop 5'), [6]],
      d6: [m('Drop 6'), [7]],
      d7: [m('Drop 7'), [8]],
      d8: [m('Drop 8'), [4]],
      d9: [m('Drop 9'), [3]],
      d10: [m('Drop 10'), [2]],
      d11: [m('Drop 11'), [1]],
      d12: [m('Drop 12'), [0]],
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
    name: m('Sprinkler'),
    domain: 'valve',
    icon: 'mdi:sprinkler-variant',
    tags: ['valve', 'switch', 'irrigation', 'garden', 'water'],
    duration: 1.4,
    parts: {
      stand: [m('Stand'), [0]],
      head: [m('Head'), [13], 'bottom'],
      l1: [m('Left drop 1'), [1]],
      l2: [m('Left drop 2'), [2]],
      l3: [m('Left drop 3'), [3]],
      l4: [m('Left drop 4'), [5]],
      l5: [m('Left drop 5'), [6]],
      l6: [m('Left drop 6'), [4]],
      r1: [m('Right drop 1'), [11]],
      r2: [m('Right drop 2'), [12]],
      r3: [m('Right drop 3'), [7]],
      r4: [m('Right drop 4'), [9]],
      r5: [m('Right drop 5'), [8]],
      r6: [m('Right drop 6'), [10]],
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
    name: m('Valve'),
    domain: 'valve',
    icon: 'mdi:valve',
    tags: ['valve', 'water', 'gas', 'pipe'],
    duration: 3,
    parts: { pipe_l: [m('Left pipe'), [0]], pipe_r: [m('Right pipe'), [1]], handle: [m('Handle'), [2], [12, 12]] },
    tracks: (x) =>
      x.keys('part:handle', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: 90 }), t(60, { rotate: 90 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'pool',
    name: m('Pool'),
    domain: 'switch',
    icon: 'mdi:pool',
    tags: ['switch', 'pool', 'water', 'pump', 'sensor'],
    duration: 2.5,
    parts: { ladder: [m('Ladder'), [0]], water: [m('Water'), [1], 'center'] },
    tracks: (x) => x.keys('part:water', [t(0, { x: 0, y: 0 }), t(25, { x: -1, y: -0.3 }), t(50, { x: 0, y: 0 }), t(75, { x: 1, y: -0.3 }), t(100, { x: 0, y: 0 })]),
  },
  {
    id: 'watering-can',
    name: m('Watering'),
    domain: 'plant',
    icon: 'mdi:watering-can',
    tags: ['plant', 'garden', 'irrigation', 'water', 'valve'],
    duration: 3,
    parts: { can: [m('Watering can'), [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:can', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(35, { rotate: 18 }), t(45, { rotate: 15 }), t(55, { rotate: 18 }), t(65, { rotate: 15 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 })]),
  },
  // ── security ──
  {
    id: 'doorbell-ring',
    name: m('Doorbell ring'),
    domain: 'event',
    icon: 'mdi:bell-ring',
    tags: ['event', 'binary_sensor', 'doorbell', 'bell', 'notification', 'ring'],
    duration: 1.8,
    parts: { body: [m('Bell'), [0]], clapper: [m('Clapper'), [1], 'top'], wave_r: [m('Right wave'), [2]], wave_l: [m('Left wave'), [3]] },
    groups: { bell: [m('Bell and clapper'), ['body', 'clapper'], [12, 2]], waves: [m('Sound waves'), ['wave_r', 'wave_l']] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70, intensity: 1 });
      x.keys('part:clapper', swingBelow(presetKeyframes('ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 }), CLAPPER_DROP));
      x.preset('group:waves', 'draw-loop', { share: 80, delay: 5 });
    },
  },
  {
    id: 'notification',
    name: m('Notification'),
    domain: 'event',
    icon: 'mdi:bell-alert',
    tags: ['event', 'notification', 'alert', 'bell', 'update'],
    duration: 1.8,
    parts: { mark: [m('Exclamation'), [0]], dot: [m('Dot'), [1]], body: [m('Bell'), [2]], clapper: [m('Clapper'), [3], 'top'] },
    groups: { bell: [m('Bell and clapper'), ['body', 'clapper'], [12, 2]], alert: [m('Exclamation mark'), ['mark', 'dot'], 'center'] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70 });
      x.keys('part:clapper', swingBelow(presetKeyframes('ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 }), CLAPPER_DROP));
      x.preset('group:alert', 'blink', { share: 60, delay: 30 });
    },
  },
  {
    id: 'alarm-light',
    name: m('Alarm light'),
    domain: 'siren',
    icon: 'mdi:alarm-light',
    tags: ['siren', 'alarm_control_panel', 'alarm', 'security', 'triggered'],
    duration: 1,
    parts: { light: [m('Light'), [6], 'bottom'], base: [m('Base'), [5]], ray_l: [m('Ray left'), [3]], ray_tl: [m('Ray top left'), [0]], ray_t: [m('Ray top'), [1]], ray_tr: [m('Ray top right'), [2]], ray_r: [m('Ray right'), [4]] },
    tracks: (x) => {
      x.keys('part:light', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.05 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) =>
        x.keys(`part:${r}`, i % 2 ? [k(0, { opacity: 0.15, easing: 'steps(1, end)' }), k(50, { opacity: 1, easing: 'steps(1, end)' }), k(100, { opacity: 0.15 })] : [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.15, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]),
      );
    },
  },
  {
    id: 'smoke-alarm',
    name: m('Smoke alarm'),
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector-alert',
    tags: ['binary_sensor', 'smoke', 'co', 'carbon_monoxide', 'alarm', 'safety'],
    duration: 1,
    parts: { body: [m('Detector'), [0]], centre: [m('Centre'), [1], 'center'], mark: [m('Exclamation'), [2]], dot: [m('Dot'), [3]] },
    groups: { alert: [m('Exclamation mark'), ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('part:centre', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.15 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      x.keys('group:alert', [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.1, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]);
    },
  },
  {
    id: 'smoke-detector',
    name: m('Smoke detector standby'),
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector',
    tags: ['binary_sensor', 'smoke', 'safety', 'ok'],
    duration: 3,
    parts: { body: [m('Detector'), [0]], centre: [m('Centre'), [1], 'center'] },
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
    name: m('Alarm clock'),
    domain: 'sensor',
    icon: 'mdi:alarm',
    tags: ['sensor', 'alarm', 'clock', 'timer', 'time', 'wake'],
    duration: 1.4,
    parts: { clock: [m('Clock'), [0]], hands: [m('Hands'), [1]], bell_l: [m('Left bell'), [2], 'center'], bell_r: [m('Right bell'), [3], 'center'] },
    groups: { alarm: [m('Alarm clock'), ['clock', 'hands', 'bell_l', 'bell_r'], [12, 22]] },
    tracks: (x) => {
      x.preset('group:alarm', 'ring', { share: 70, intensity: 0.5 });
      x.keys('part:bell_l', [t(0, { y: 0 }), t(10, { y: -0.6 }), t(20, { y: 0 }), t(30, { y: -0.6 }), t(40, { y: 0 }), t(50, { y: -0.6 }), t(60, { y: 0 })]);
      x.keys('part:bell_r', [t(0, { y: 0 }), t(5, { y: 0 }), t(15, { y: -0.6 }), t(25, { y: 0 }), t(35, { y: -0.6 }), t(45, { y: 0 }), t(55, { y: -0.6 }), t(65, { y: 0 })]);
    },
  },
  {
    id: 'alert',
    name: m('Alert'),
    domain: 'binary_sensor',
    icon: 'mdi:alert',
    tags: ['binary_sensor', 'alert', 'problem', 'warning', 'update'],
    duration: 1.2,
    parts: { sign: [m('Sign'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:sign', [t(0, { scale: 1 }, { opacity: 1 }), t(15, { scale: 1.12 }, { opacity: 1 }), t(30, { scale: 1 }, { opacity: 0.55 }), t(45, { scale: 1.08 }, { opacity: 1 }), t(60, { scale: 1 }, { opacity: 1 })]),
  },
  {
    id: 'security-armed',
    name: m('Security armed'),
    domain: 'alarm_control_panel',
    icon: 'mdi:shield-home',
    tags: ['alarm_control_panel', 'security', 'armed', 'shield'],
    duration: 2.4,
    parts: { shield: [m('Shield'), [0], 'center'] },
    tracks: (x) => x.keys('part:shield', [t(0, { scale: 1 }, { opacity: 0.85 }), t(50, { scale: 1.07 }, { opacity: 1 }), t(100, { scale: 1 }, { opacity: 0.85 })]),
  },
  {
    id: 'cctv',
    name: m('Security camera'),
    domain: 'camera',
    icon: 'mdi:cctv',
    tags: ['camera', 'cctv', 'security', 'surveillance'],
    duration: 5,
    // P4-2: MDI draws the camera, its arm and the wall bracket in one outline, so the rig is cut
    // (library/rigs.ts): the mount stays still, the head (body and hood) pans around the joint.
    own: [CCTV_MOUNT, CCTV_HEAD_BODY, CCTV_HEAD_HOOD],
    parts: { mount: [m('Mount'), [0]], head: [m('Camera head'), [1, 2], [16, 13]] },
    tracks: (x) => x.keys('part:head', [t(0, { rotate: 0 }), t(10, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: -12 }), t(55, { rotate: -12 }, { easing: 'ease-in-out' }), t(85, { rotate: 8 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'camera-snapshot',
    name: m('Camera snapshot'),
    domain: 'camera',
    icon: 'mdi:camera',
    tags: ['camera', 'snapshot', 'photo'],
    duration: 2,
    parts: { body: [m('Camera'), [0], 'center'], lens: [m('Lens'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:lens', [t(0, { scale: 1 }), t(10, { scale: 0.6 }, { easing: 'ease-out' }), t(25, { scale: 1.1 }), t(40, { scale: 1 })]);
      x.keys('part:body', [t(0, { scale: 1 }), t(10, { scale: 0.96 }), t(25, { scale: 1 })]);
    },
  },
  {
    id: 'motion',
    name: m('Motion detected'),
    domain: 'binary_sensor',
    icon: 'mdi:motion-sensor',
    tags: ['binary_sensor', 'motion', 'occupancy', 'presence', 'movement'],
    duration: 1.5,
    parts: { head: [m('Head'), [0]], wave_o: [m('Outer wave'), [1]], wave_m: [m('Middle wave'), [2]], wave_i: [m('Inner wave'), [3]], body: [m('Person'), [4]] },
    groups: { person: [m('Person'), ['head', 'body'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:person', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.6, rotate: 2 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.6, rotate: 2 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 55 }));
      x.keys('part:wave_m', presetKeyframes('wave', { share: 55, delay: 15 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 55, delay: 30 }));
    },
  },
  {
    id: 'walking',
    name: m('Walking'),
    domain: 'person',
    icon: 'mdi:walk',
    tags: ['person', 'device_tracker', 'presence', 'motion', 'away'],
    duration: 1,
    parts: { body: [m('Body'), [0]], head: [m('Head'), [1]] },
    groups: { walker: [m('Walker'), ['body', 'head'], 'bottom'] },
    tracks: (x) => x.keys('group:walker', [t(0, { y: 0, rotate: -2 }), t(25, { y: -0.7, rotate: 0 }), t(50, { y: 0, rotate: 2 }), t(75, { y: -0.7, rotate: 0 }), t(100, { y: 0, rotate: -2 })]),
  },
  {
    id: 'person-home',
    name: m('Person home'),
    domain: 'person',
    icon: 'mdi:account',
    tags: ['person', 'device_tracker', 'presence', 'home', 'user'],
    duration: 2.4,
    parts: { head: [m('Head'), [0], 'bottom'], body: [m('Body'), [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { y: 0, rotate: 0 }), t(30, { y: -0.6, rotate: -6 }), t(60, { y: 0, rotate: 4 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:body', [t(0, { scale_y: 1 }), t(30, { scale_y: 1.04 }), t(60, { scale_y: 1 })]);
    },
  },
  {
    id: 'doorbell-press',
    name: m('Doorbell press'),
    domain: 'button',
    icon: 'mdi:doorbell',
    tags: ['button', 'doorbell', 'event', 'press'],
    duration: 2,
    parts: { button: [m('Button'), [0], 'center'], panel: [m('Panel'), [1]] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(8, { scale: 0.7 }, { easing: 'ease-out', color: '#03a9f4' }), t(20, { scale: 1.08 }), t(32, { scale: 1 })]),
  },
  // ── weather ──
  {
    id: 'sunny',
    name: m('Sunny'),
    domain: 'weather',
    icon: 'mdi:weather-sunny',
    tags: ['weather', 'sun', 'sunny', 'clear', 'day'],
    duration: 6,
    parts: { sun: [m('Sun'), [0], 'center'], ray_t: [m('Ray top'), [1]], ray_tl: [m('Ray top left'), [2]], ray_bl: [m('Ray bottom left'), [3]], ray_tr: [m('Ray top right'), [4]], ray_br: [m('Ray bottom right'), [5]], ray_b: [m('Ray bottom'), [6]] },
    groups: { rays: [m('Rays'), ['ray_t', 'ray_tl', 'ray_bl', 'ray_tr', 'ray_br', 'ray_b'], [12, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
    },
  },
  {
    id: 'cloudy',
    name: m('Cloudy'),
    domain: 'weather',
    icon: 'mdi:weather-cloudy',
    tags: ['weather', 'cloud', 'cloudy', 'overcast'],
    duration: 4,
    parts: { cloud: [m('Cloud'), [0]] },
    tracks: (x) => x.keys('part:cloud', [t(0, { x: 0 }), t(25, { x: 1.2 }), t(75, { x: -1.2 }), t(100, { x: 0 })]),
  },
  {
    id: 'pouring',
    name: m('Pouring rain'),
    domain: 'weather',
    icon: 'mdi:weather-pouring',
    tags: ['weather', 'rain', 'rainy', 'pouring', 'storm'],
    duration: 1,
    parts: { drop_l: [m('Left drop'), [0]], drop_m: [m('Middle drop'), [1]], drop_r: [m('Right drop'), [2]], cloud: [m('Cloud'), [3]] },
    tracks: (x) => {
      x.keys('part:drop_l', fall(0, 70, 2.5, -1.5));
      x.keys('part:drop_m', fall(30, 70, 2.5, -1.5));
      x.keys('part:drop_r', fall(15, 70, 2.5, -1.5));
    },
  },
  {
    id: 'rainy',
    name: m('Rain'),
    domain: 'weather',
    icon: 'mdi:weather-rainy',
    tags: ['weather', 'rain', 'rainy', 'drizzle'],
    duration: 1.6,
    parts: { cloud: [m('Cloud'), [0]], drop: [m('Drop'), [1]] },
    tracks: (x) => {
      x.keys('part:drop', fall(0, 80, 2, -2));
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.5 }), t(100, { x: 0 })]);
    },
  },
  {
    id: 'snowy',
    name: m('Snow'),
    domain: 'weather',
    icon: 'mdi:weather-snowy',
    tags: ['weather', 'snow', 'snowy', 'winter'],
    duration: 2.6,
    parts: { cloud: [m('Cloud'), [0]], flake: [m('Snowflake'), [1], 'center'] },
    tracks: (x) => x.keys('part:flake', fall(0, 90, 1.5, -2.5).map((f, i) => ({ ...f, transform: { ...f.transform, rotate: [0, 0, 30, 80, 90, 90][i] ?? 90 } }))),
  },
  {
    id: 'heavy-snow',
    name: m('Heavy snow'),
    domain: 'weather',
    icon: 'mdi:weather-snowy-heavy',
    tags: ['weather', 'snow', 'snowy', 'blizzard', 'winter'],
    duration: 2.4,
    parts: { flake_l: [m('Left flake'), [0], 'center'], cloud: [m('Cloud'), [1]], flake_r: [m('Right flake'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:flake_l', [t(0, { y: -1.5, rotate: 0 }, { opacity: 0 }), t(15, { y: -1, rotate: 15 }, { opacity: 1 }), t(80, { y: 1.5, rotate: 90 }, { opacity: 1 }), t(100, { y: 2, rotate: 110 }, { opacity: 0 })]);
      x.keys('part:flake_r', [t(0, { y: -0.5, rotate: 40 }, { opacity: 1 }), t(30, { y: 1, rotate: 80 }, { opacity: 0 }), t(45, { y: -2, rotate: 0 }, { opacity: 0 }), t(60, { y: -1.5, rotate: 10 }, { opacity: 1 }), t(100, { y: -0.5, rotate: 40 }, { opacity: 1 })]);
    },
  },
  {
    id: 'thunderstorm',
    name: m('Thunderstorm'),
    domain: 'weather',
    icon: 'mdi:weather-lightning',
    tags: ['weather', 'lightning', 'storm', 'thunder'],
    duration: 2.2,
    parts: { cloud: [m('Cloud'), [0]], bolt: [m('Bolt'), [1], 'top'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(10, '#ffd600'));
      x.keys('part:cloud', [t(0, { x: 0 }), t(10, { x: 0 }), t(13, { x: 0.3 }), t(16, { x: -0.3 }), t(19, { x: 0.2 }), t(22, { x: 0 })]);
    },
  },
  {
    id: 'storm-rain',
    name: m('Storm with rain'),
    domain: 'weather',
    icon: 'mdi:weather-lightning-rainy',
    tags: ['weather', 'lightning', 'rain', 'storm'],
    duration: 2,
    parts: { cloud: [m('Cloud'), [0]], bolt: [m('Bolt'), [1], 'top'], drop: [m('Drop'), [2]] },
    tracks: (x) => {
      x.keys('part:bolt', flash(5, '#ffd600'));
      x.keys('part:drop', fall(20, 60, 2, -1.5));
    },
  },
  {
    id: 'fog',
    name: m('Fog'),
    domain: 'weather',
    icon: 'mdi:weather-fog',
    tags: ['weather', 'fog', 'mist', 'haze'],
    duration: 4,
    parts: { line_1: [m('Fog line 1'), [0]], line_2: [m('Fog line 2'), [1]], cloud: [m('Cloud'), [2]], line_3: [m('Fog line 3'), [3]], line_4: [m('Fog line 4'), [4]] },
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
    name: m('Windy'),
    domain: 'weather',
    icon: 'mdi:weather-windy',
    tags: ['weather', 'wind', 'windy', 'breeze'],
    duration: 3,
    parts: { gust_t: [m('Top gust'), [0]], gust_m: [m('Middle gust'), [1]], gust_b: [m('Bottom gust'), [2]] },
    tracks: (x) => {
      x.preset('part:gust_m', 'draw-loop', { share: 80 });
      x.preset('part:gust_t', 'draw-loop', { share: 80, delay: 10 });
      x.preset('part:gust_b', 'draw-loop', { share: 80, delay: 20 });
    },
  },
  {
    id: 'clear-night',
    name: m('Clear night'),
    domain: 'weather',
    icon: 'mdi:weather-night',
    tags: ['weather', 'night', 'moon', 'clear', 'stars'],
    duration: 3,
    parts: { star_l: [m('Big star'), [0], 'center'], star_r: [m('Small star'), [1], 'center'], moon: [m('Moon'), [2], 'center'] },
    tracks: (x) => {
      x.keys('part:moon', [t(0, { rotate: -4 }), t(50, { rotate: 4 }), t(100, { rotate: -4 })]);
      x.keys('part:star_l', [t(0, { scale: 1 }, { opacity: 1 }), t(20, { scale: 0.6 }, { opacity: 0.4 }), t(40, { scale: 1 }, { opacity: 1 })]);
      x.keys('part:star_r', [t(0, { scale: 1 }, { opacity: 1 }), t(50, { scale: 1 }, { opacity: 1 }), t(70, { scale: 0.5 }, { opacity: 0.3 }), t(90, { scale: 1 }, { opacity: 1 })]);
    },
  },
  {
    id: 'partly-cloudy',
    name: m('Partly cloudy'),
    domain: 'weather',
    icon: 'mdi:weather-partly-cloudy',
    tags: ['weather', 'partlycloudy', 'cloud', 'sun'],
    duration: 4,
    parts: { cloud: [m('Sun and cloud'), [0]], ray_t: [m('Ray top'), [1]], ray_tl: [m('Ray top left'), [2]], ray_r: [m('Ray right'), [3]], ray_l: [m('Ray left'), [4]] },
    tracks: (x) => {
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.8 }), t(100, { x: 0 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 60, delay: i * 12 })));
    },
  },
  {
    id: 'hail',
    name: m('Hail'),
    domain: 'weather',
    icon: 'mdi:weather-hail',
    tags: ['weather', 'hail', 'storm'],
    duration: 1.4,
    parts: { cloud: [m('Cloud'), [0]], ball_1: [m('Hailstone 1'), [3], 'center'], ball_2: [m('Hailstone 2'), [2], 'center'], ball_3: [m('Hailstone 3'), [1], 'center'] },
    tracks: (x) => {
      x.keys('part:ball_1', fall(0, 60, 2, -1.5));
      x.keys('part:ball_2', fall(25, 60, 2, -1.5));
      x.keys('part:ball_3', fall(12, 60, 1.5, -1.5));
    },
  },
  {
    id: 'sunset',
    name: m('Sunset'),
    domain: 'sun',
    icon: 'mdi:weather-sunset',
    tags: ['sun', 'weather', 'sunset', 'sunrise', 'evening'],
    duration: 3,
    parts: { sun: [m('Sun'), [0]], line_1: [m('Horizon 1'), [1]], line_2: [m('Horizon 2'), [2]], ray_t: [m('Ray top'), [3]], ray_l: [m('Ray left'), [4]], ray_r: [m('Ray right'), [5]] },
    tracks: (x) => ['ray_l', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [t(0, { y: 0 }, { opacity: 1 }), t(15 + i * 10, { y: 0 }, { opacity: 1, easing: 'ease-in' }), t(45 + i * 10, { y: 1 }, { opacity: 0.1 }), t(70, { y: 1 }, { opacity: 0.1, easing: 'ease-out' }), t(95, { y: 0 }, { opacity: 1 })])),
  },
  // ── network, phones, time ──
  {
    id: 'wifi',
    name: m('Wi-Fi'),
    domain: 'binary_sensor',
    icon: 'mdi:wifi',
    tags: ['binary_sensor', 'connectivity', 'wifi', 'network', 'signal'],
    duration: 1.6,
    parts: { dot: [m('Dot'), [0]], arc_m: [m('Middle arc'), [2]], arc_t: [m('Top arc'), [1]] },
    groups: { signal: [m('Signal'), ['dot', 'arc_m', 'arc_t']] },
    tracks: (x) => ['dot', 'arc_m', 'arc_t'].forEach((p, i) => x.keys(`part:${p}`, [k(0, { opacity: 0.25 }), k(i * 20, { opacity: 0.25, easing: 'ease-out' }), k(i * 20 + 15, { opacity: 1 }), k(75, { opacity: 1, easing: 'ease-in' }), k(95, { opacity: 0.25 })])),
  },
  {
    id: 'router',
    name: m('Router'),
    domain: 'binary_sensor',
    icon: 'mdi:router-wireless',
    tags: ['binary_sensor', 'connectivity', 'router', 'network', 'internet'],
    duration: 1.6,
    parts: { wave_o: [m('Outer wave'), [0]], wave_i: [m('Inner wave'), [1]], router: [m('Router'), [2]] },
    tracks: (x) => {
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'phone-signal',
    name: m('Phone signal'),
    domain: 'device_tracker',
    icon: 'mdi:cellphone-wireless',
    tags: ['device_tracker', 'phone', 'mobile', 'connectivity'],
    duration: 1.6,
    parts: { wave_o: [m('Outer wave'), [0]], wave_i: [m('Inner wave'), [1]], dot: [m('Dot'), [2], 'center'], phone: [m('Phone'), [3]] },
    tracks: (x) => {
      x.preset('part:dot', 'pulse', { intensity: 0.8, share: 40 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60, delay: 10 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 30 }));
    },
  },
  {
    id: 'phone-ringing',
    name: m('Phone ringing'),
    domain: 'event',
    icon: 'mdi:phone-ring',
    tags: ['event', 'phone', 'call', 'ringing'],
    duration: 1.2,
    parts: { handset: [m('Handset'), [0], 'center'], wave_r: [m('Right wave'), [1]], wave_t: [m('Top wave'), [2]], wave_l: [m('Left wave'), [3]] },
    tracks: (x) => {
      x.preset('part:handset', 'ring', { share: 60, intensity: 0.5 });
      ['wave_l', 'wave_t', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, presetKeyframes('wave', { share: 50, delay: i * 12 })));
    },
  },
  {
    id: 'phone-vibrate',
    name: m('Phone vibrate'),
    domain: 'device_tracker',
    icon: 'mdi:cellphone',
    tags: ['device_tracker', 'phone', 'mobile', 'notification'],
    duration: 1.4,
    parts: { phone: [m('Phone'), [0], 'center'] },
    tracks: (x) => x.keys('part:phone', [0, 4, 8, 12, 16, 20, 24, 28, 32, 50, 54, 58, 62, 66, 70, 74, 78, 82].map((at, i, all) => t(at, { rotate: i === 0 || i === 8 || i === 9 || i === all.length - 1 ? 0 : i % 2 ? 4 : -4 }, { easing: 'linear' }))),
  },
  {
    id: 'clock',
    name: m('Clock'),
    domain: 'sensor',
    icon: 'mdi:clock-outline',
    tags: ['sensor', 'time', 'clock', 'timer', 'schedule'],
    duration: 4,
    parts: { face: [m('Face'), [0]], hands: [m('Hands'), [1], [12, 12]] },
    tracks: (x) => x.keys('part:hands', SPIN()),
  },
  {
    id: 'hourglass',
    name: m('Hourglass'),
    domain: 'timer',
    icon: 'mdi:timer-sand',
    tags: ['timer', 'time', 'waiting', 'countdown'],
    duration: 3,
    parts: { glass: [m('Hourglass'), [0], [12, 12]], sand: [m('Sand'), [1], 'bottom'] },
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
    name: m('Timer'),
    domain: 'timer',
    icon: 'mdi:timer-outline',
    tags: ['timer', 'time', 'countdown', 'stopwatch'],
    duration: 3,
    parts: { face: [m('Face'), [0]], hand: [m('Hand'), [1], [12, 13]], button: [m('Button'), [2]] },
    tracks: (x) => {
      x.keys('part:hand', SPIN());
      x.keys('part:button', [t(0, { y: 0 }), t(4, { y: 0.6 }), t(10, { y: 0 })]);
    },
  },
  {
    id: 'car',
    name: m('Car driving'),
    domain: 'device_tracker',
    icon: 'mdi:car',
    tags: ['device_tracker', 'car', 'vehicle', 'driving', 'away'],
    duration: 0.8,
    parts: { car: [m('Car'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:car', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.4, rotate: -1 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.3, rotate: 1 }), t(100, { y: 0, rotate: 0 })]),
  },
  // ── home, garden, pets ──
  {
    id: 'trash',
    name: m('Trash day'),
    domain: 'calendar',
    icon: 'mdi:trash-can',
    tags: ['calendar', 'sensor', 'trash', 'garbage', 'waste', 'bin'],
    duration: 2,
    parts: { bin: [m('Bin'), [0], 'bottom'] },
    tracks: (x) => x.preset('part:bin', 'wobble', { share: 60, intensity: 1 }),
  },
  {
    id: 'plant',
    name: m('Plant'),
    domain: 'plant',
    icon: 'mdi:sprout',
    tags: ['plant', 'garden', 'moisture', 'sensor'],
    duration: 3,
    parts: { soil: [m('Soil'), [0]], sprout: [m('Sprout'), [1], [12, 17]] },
    tracks: (x) => x.keys('part:sprout', [t(0, { rotate: -5 }), t(50, { rotate: 5 }), t(100, { rotate: -5 })]),
  },
  {
    id: 'flower',
    name: m('Flower'),
    domain: 'plant',
    icon: 'mdi:flower',
    tags: ['plant', 'garden', 'flower', 'spring'],
    duration: 3,
    parts: { leaf_l: [m('Left leaf'), [0], 'top-right'], head: [m('Flower'), [1], 'bottom'], leaf_r: [m('Right leaf'), [2], 'top-left'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { rotate: -6 }), t(50, { rotate: 6 }), t(100, { rotate: -6 })]);
      x.keys('part:leaf_l', [t(0, { rotate: 0 }), t(50, { rotate: -6 }), t(100, { rotate: 0 })]);
      x.keys('part:leaf_r', [t(0, { rotate: 0 }), t(50, { rotate: 6 }), t(100, { rotate: 0 })]);
    },
  },
  {
    id: 'leaf',
    name: m('Leaf in the wind'),
    domain: 'sensor',
    icon: 'mdi:leaf',
    tags: ['sensor', 'eco', 'energy', 'nature', 'plant'],
    duration: 3,
    parts: { leaf: [m('Leaf'), [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:leaf', [t(0, { rotate: 0, y: 0 }), t(30, { rotate: -8, y: -0.6 }), t(60, { rotate: 4, y: 0.2 }), t(100, { rotate: 0, y: 0 })]),
  },
  {
    id: 'paw',
    name: m('Pet'),
    domain: 'sensor',
    icon: 'mdi:paw',
    tags: ['sensor', 'pet', 'dog', 'cat', 'feeder', 'presence'],
    duration: 1.6,
    parts: { toe_1: [m('Toe 1'), [2], 'center'], toe_2: [m('Toe 2'), [0], 'center'], toe_3: [m('Toe 3'), [1], 'center'], toe_4: [m('Toe 4'), [3], 'center'], pad: [m('Pad'), [4], 'center'] },
    tracks: (x) => {
      ['toe_1', 'toe_2', 'toe_3', 'toe_4'].forEach((p, i) => x.keys(`part:${p}`, [t(0, { scale: 1 }), t(i * 10, { scale: 1 }, { easing: 'ease-out' }), t(i * 10 + 10, { scale: 1.25 }, { easing: 'ease-in' }), t(i * 10 + 22, { scale: 1 })]));
      x.keys('part:pad', [t(0, { scale: 1 }), t(50, { scale: 1 }), t(60, { scale: 1.08 }), t(72, { scale: 1 })]);
    },
  },
  {
    id: 'dog',
    name: m('Dog'),
    domain: 'sensor',
    icon: 'mdi:dog',
    tags: ['sensor', 'pet', 'dog', 'presence'],
    duration: 2,
    parts: { dog: [m('Dog'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:dog', [t(0, { rotate: 0 }), t(20, { rotate: -10 }), t(45, { rotate: -10 }, { easing: 'ease-in-out' }), t(65, { rotate: 0 })]),
  },
  {
    id: 'bee',
    name: m('Bee'),
    domain: 'sensor',
    icon: 'mdi:bee',
    tags: ['sensor', 'garden', 'nature', 'pollen'],
    duration: 3,
    parts: { bee: [m('Bee'), [0], 'center'] },
    tracks: (x) => {
      x.path('part:bee', 'M0 0 C 1.5 -2 3 -2 3 0 S 1.5 2 0 0 S -3 2 -3 0 S -1.5 -2 0 0');
      x.keys('part:bee', [t(0, { rotate: -8 }, { easing: 'linear' }), t(25, { rotate: 8 }, { easing: 'linear' }), t(50, { rotate: -8 }, { easing: 'linear' }), t(75, { rotate: 8 }, { easing: 'linear' }), t(100, { rotate: -8 })]);
    },
  },
  {
    id: 'bird',
    name: m('Bird'),
    domain: 'sensor',
    icon: 'mdi:bird',
    tags: ['sensor', 'garden', 'nature', 'bird'],
    duration: 1.6,
    parts: { bird: [m('Bird'), [0], 'center'] },
    tracks: (x) => x.keys('part:bird', [t(0, { y: 0, rotate: 0 }), t(30, { y: -1.4, rotate: -6 }), t(60, { y: 0.3, rotate: 3 }), t(100, { y: 0, rotate: 0 })]),
  },
  {
    id: 'fish',
    name: m('Fish'),
    domain: 'sensor',
    icon: 'mdi:fish',
    tags: ['sensor', 'aquarium', 'pet', 'water'],
    duration: 2,
    parts: { fish: [m('Fish'), [0], 'center'] },
    tracks: (x) => x.keys('part:fish', [t(0, { x: 0, y: 0, rotate: 0 }), t(25, { x: 0.8, y: -0.4, rotate: -6 }), t(50, { x: 0, y: 0, rotate: 0 }), t(75, { x: -0.8, y: 0.4, rotate: 6 }), t(100, { x: 0, y: 0, rotate: 0 })]),
  },
  {
    id: 'heartbeat',
    name: m('Heartbeat'),
    domain: 'sensor',
    icon: 'mdi:heart-pulse',
    tags: ['sensor', 'health', 'heart', 'pulse', 'fitness'],
    duration: 1.2,
    parts: { top: [m('Heart top'), [0]], bottom: [m('Heart and pulse'), [1]] },
    groups: { heart: [m('Heart'), ['top', 'bottom'], 'center'] },
    tracks: (x) => x.keys('group:heart', [t(0, { scale: 1 }, { easing: 'ease-out' }), t(10, { scale: 1.15 }, { easing: 'ease-in' }), t(22, { scale: 1 }, { easing: 'ease-out' }), t(32, { scale: 1.1 }, { easing: 'ease-in' }), t(48, { scale: 1 })]),
  },
  {
    id: 'home',
    name: m('Home'),
    domain: 'zone',
    icon: 'mdi:home',
    tags: ['zone', 'person', 'home', 'presence', 'house'],
    duration: 2.4,
    parts: { house: [m('House'), [0], 'bottom'] },
    tracks: (x) => x.preset('part:house', 'bounce', { intensity: 0.4, share: 50 }),
  },
  {
    id: 'gauge',
    name: m('Gauge'),
    domain: 'sensor',
    icon: 'mdi:gauge',
    tags: ['sensor', 'gauge', 'speed', 'pressure', 'level'],
    duration: 3,
    parts: { dial: [m('Dial'), [0]], needle: [m('Needle'), [1], [11, 14]], tick_t: [m('Top tick'), [2]], tick_l: [m('Left tick'), [3]], tick_r: [m('Right tick'), [4]] },
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
