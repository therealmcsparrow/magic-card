import { dim, k, padKeys, SPIN, te, t, type Spec } from './build';
import { LASER_CUTTER, LASER_SPARK, PRINTER_3D, WIND_TURBINE } from './rigs';
import { m } from './i18n';

/*
 * P4 entries, theme home (brand artist's p4-spec.json, Living rigs): machines move mechanically
 * (linear spins and travel), events use anticipation and overshoot and rest for the last 40 %.
 * The maker machines use the pseudo-domain `maker`. Checked on the parts sheet: MDI's mailbox has
 * no separate flag (piece 1 is the letter slot), the bed's piece 1 is the sleeper's head and the
 * stove's pieces 0 and 5 are the oven window's glow marks.
 */

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Linear ping-pong of x through `stops` (units), keyed by distance so the speed stays constant. */
function travel(stops: number[]): ReturnType<typeof t>[] {
  const total = stops.slice(1).reduce((s, v, i) => s + Math.abs(v - stops[i]), 0);
  let run = 0;
  return stops.map((v, i) => {
    if (i) run += Math.abs(v - stops[i - 1]);
    return t(r2((run / total) * 100), { x: v }, { easing: 'linear' });
  });
}

export const HOME: Spec[] = [
  {
    id: 'mailbox',
    name: m('icon-library.home.mail-arrived'),
    domain: 'binary_sensor',
    icon: 'mdi:mailbox',
    tags: ['home', 'mail', 'post', 'letter', 'mailbox'],
    duration: 3,
    parts: { box: [m('icon-library.home.mailbox'), [0]], slot: [m('icon-library.home.letter-slot'), [1]] },
    groups: { mailbox: [m('icon-library.home.mailbox'), ['box', 'slot'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:mailbox', [te(0, { y: 0, scale_y: 1 }), t(8, { y: 0, scale_y: 0.94 }, { easing: 'ease-out' }), t(18, { y: -0.6, scale_y: 1.03 }, { easing: 'ease-in' }), te(28, { y: 0, scale_y: 0.97 }), t(36, { y: 0, scale_y: 1 })]);
      x.keys('part:slot', padKeys([k(20, { opacity: 1, easing: 'ease-in-out' }), k(30, { opacity: 0.35, easing: 'ease-in-out' }), k(40, { opacity: 1, easing: 'ease-in-out' }), k(50, { opacity: 0.35, easing: 'ease-in-out' }), k(60, { opacity: 1 })]));
    },
  },
  {
    id: 'parcel',
    name: m('icon-library.home.parcel-delivered'),
    domain: 'binary_sensor',
    icon: 'mdi:package-variant-closed',
    tags: ['home', 'parcel', 'package', 'delivery', 'post'],
    duration: 2.4,
    parts: { parcel: [m('icon-library.home.parcel'), [0], 'bottom'] },
    // sits at rest, fades away, then drops in and lands with a squash
    tracks: (x) =>
      x.keys('part:parcel', [
        te(0, { y: 0, scale_y: 1 }, { opacity: 1 }),
        t(55, { y: 0, scale_y: 1 }, { opacity: 1, easing: 'ease-in' }),
        t(65, { y: 0, scale_y: 1 }, { opacity: 0 }),
        t(66, { y: -2.5, scale_y: 1 }, { opacity: 0, easing: 'ease-in' }),
        t(84, { y: 0, scale_y: 1 }, { opacity: 1, easing: 'ease-out' }),
        te(88, { y: 0, scale_y: 0.9 }, { opacity: 1 }),
        te(94, { y: 0, scale_y: 1.03 }, { opacity: 1 }),
        t(100, { y: 0, scale_y: 1 }, { opacity: 1 }),
      ]),
  },
  {
    id: 'wind-turbine',
    name: m('icon-library.home.wind-turbine'),
    domain: 'sensor',
    icon: 'mdi:wind-turbine',
    tags: ['home', 'energy', 'wind', 'power', 'renewable'],
    duration: 1.8,
    own: WIND_TURBINE,
    parts: { tower: [m('icon-library.home.tower'), [0]], hub: [m('icon-library.home.hub'), [1]], blade_t: [m('icon-library.home.top-blade'), [2]], blade_l: [m('icon-library.home.left-blade'), [3]], blade_r: [m('icon-library.home.right-blade'), [4]] },
    groups: { rotor: [m('icon-library.home.rotor'), ['hub', 'blade_t', 'blade_l', 'blade_r'], [12, 9]] },
    tracks: (x) => x.keys('group:rotor', SPIN()),
  },
  {
    id: 'server',
    name: m('icon-library.home.server'),
    domain: 'sensor',
    icon: 'mdi:server',
    tags: ['home', 'server', 'network', 'nas', 'computer'],
    duration: 1.5,
    parts: { unit_1: [m('icon-library.home.top-unit'), [0]], unit_2: [m('icon-library.home.middle-unit'), [1]], unit_3: [m('icon-library.home.bottom-unit'), [2]] },
    tracks: (x) => ['unit_1', 'unit_2', 'unit_3'].forEach((p, i) => x.keys(`part:${p}`, dim(i * 30, 20, 0.6))),
  },
  {
    id: 'access-point',
    name: m('icon-library.home.access-point'),
    domain: 'device_tracker',
    icon: 'mdi:access-point',
    tags: ['home', 'wifi', 'network', 'signal', 'wireless'],
    duration: 1.8,
    parts: { wave_ol: [m('icon-library.home.outer-left-wave'), [0]], wave_or: [m('icon-library.home.outer-right-wave'), [1]], wave_il: [m('icon-library.home.inner-left-wave'), [2]], wave_ir: [m('icon-library.home.inner-right-wave'), [3]], dot: [m('icon-library.home.antenna'), [4], 'center'] },
    groups: { outer: [m('icon-library.home.outer-waves'), ['wave_ol', 'wave_or']], inner: [m('icon-library.home.inner-waves'), ['wave_il', 'wave_ir']] },
    tracks: (x) => {
      x.keys('group:inner', dim(0, 50));
      x.keys('group:outer', dim(20, 50));
    },
  },
  {
    id: 'garage-open',
    name: m('icon-library.home.garage-opening'),
    domain: 'cover',
    icon: 'mdi:garage-open-variant',
    tags: ['home', 'garage', 'door', 'cover', 'open'],
    duration: 3,
    parts: { garage: [m('icon-library.home.garage'), [0]], door: [m('icon-library.home.door'), [1]] },
    tracks: (x) => x.keys('part:door', [te(0, { y: 0 }), te(15, { y: 0 }), te(45, { y: -2 }), te(65, { y: -2 }), t(88, { y: 0.2 }, { easing: 'ease-out' }), t(94, { y: 0 })]),
  },
  {
    id: 'toaster',
    name: m('icon-library.home.toaster'),
    domain: 'switch',
    icon: 'mdi:toaster',
    tags: ['home', 'kitchen', 'toast', 'breakfast', 'appliance'],
    duration: 3,
    parts: { body: [m('icon-library.home.toaster'), [0], 'bottom'], toast: [m('icon-library.home.toast'), [1]] },
    tracks: (x) => {
      x.keys('part:toast', [te(0, { y: 0 }), t(10, { y: 0 }, { easing: 'ease-out' }), t(22, { y: -2.5 }, { easing: 'ease-in-out' }), te(30, { y: -2.2 }), t(45, { y: -2.2 }, { easing: 'ease-in' }), t(58, { y: 0 })]);
      x.keys('part:body', [te(0, { scale_y: 1 }), te(8, { scale_y: 1 }), te(11, { scale_y: 0.96 }), t(16, { scale_y: 1 })]);
    },
  },
  {
    id: 'stove',
    name: m('icon-library.home.stove'),
    domain: 'climate',
    icon: 'mdi:stove',
    tags: ['home', 'kitchen', 'oven', 'cooking', 'heat'],
    duration: 2.4,
    parts: { burner_l: [m('icon-library.home.left-oven-glow'), [0]], body: [m('icon-library.home.stove'), [1]], knob_1: [m('icon-library.home.knob-1'), [2], 'center'], knob_2: [m('icon-library.home.knob-2'), [3], 'center'], knob_3: [m('icon-library.home.knob-3'), [4], 'center'], burner_r: [m('icon-library.home.right-oven-glow'), [5]] },
    tracks: (x) => {
      x.keys('part:burner_l', dim(0, 100, 0.6));
      x.keys('part:burner_r', [k(0, { opacity: 0.6, easing: 'ease-in-out' }), k(50, { opacity: 1, easing: 'ease-in-out' }), k(100, { opacity: 0.6 })]);
    },
  },
  {
    id: 'bed-sleep',
    name: m('icon-library.home.sleeping'),
    domain: 'input_boolean',
    icon: 'mdi:bed',
    tags: ['home', 'bed', 'sleep', 'night', 'bedroom'],
    duration: 4,
    parts: { bed: [m('icon-library.home.bed'), [0]], head: [m('icon-library.home.head'), [1], 'bottom'] },
    tracks: (x) => x.keys('part:head', [te(0, { scale: 1 }), te(50, { scale: 1.05 }), t(100, { scale: 1 })]),
  },
  {
    id: 'light-switch',
    name: m('icon-library.home.light-switch'),
    domain: 'switch',
    icon: 'mdi:light-switch',
    tags: ['home', 'switch', 'light', 'toggle', 'wall'],
    duration: 2.4,
    parts: { toggle: [m('icon-library.home.toggle'), [0], 'center'], plate: [m('icon-library.home.plate'), [1]] },
    tracks: (x) => x.keys('part:toggle', [te(0, { scale_y: 1 }), te(10, { scale_y: 1 }), te(25, { scale_y: -1.05 }), te(30, { scale_y: -1 }), te(55, { scale_y: -1 }), te(70, { scale_y: 1.05 }), t(75, { scale_y: 1 })]),
  },
  {
    id: 'water-leak',
    name: m('icon-library.home.water-leak'),
    domain: 'binary_sensor',
    icon: 'mdi:pipe-leak',
    tags: ['home', 'leak', 'water', 'moisture', 'pipe'],
    duration: 1.6,
    parts: { pipe_l: [m('icon-library.home.left-pipe'), [0]], pipe_r: [m('icon-library.home.right-pipe'), [1]], drip: [m('icon-library.home.drip'), [2], 'top'] },
    tracks: (x) =>
      x.keys('part:drip', [
        te(0, { y: 0, scale_y: 1 }, { opacity: 1 }),
        t(20, { y: 0, scale_y: 1.2 }, { opacity: 1, easing: 'ease-in' }),
        t(45, { y: 2, scale_y: 1 }, { opacity: 0 }),
        t(46, { y: 0, scale_y: 0.2 }, { opacity: 0, easing: 'ease-out' }),
        t(70, { y: 0, scale_y: 1 }, { opacity: 1 }),
      ]),
  },
  {
    id: 'home-assistant',
    name: m('icon-library.home.home-assistant'),
    domain: 'sensor',
    icon: 'mdi:home-assistant',
    tags: ['home', 'home assistant', 'hass', 'smart home', 'house'],
    duration: 2.4,
    parts: { house: [m('icon-library.home.house'), [0]], node_l: [m('icon-library.home.left-node'), [1], 'center'], node_r: [m('icon-library.home.right-node'), [2], 'center'], node_t: [m('icon-library.home.top-node'), [3], 'center'] },
    // data flows left, top, right
    tracks: (x) =>
      ([['node_l', 0], ['node_t', 25], ['node_r', 50]] as const).forEach(([p, at]) => x.keys(`part:${p}`, [te(at, { scale: 1 }), te(at + 12, { scale: 1.4 }), t(at + 25, { scale: 1 })])),
  },
  {
    id: 'printer-3d',
    name: m('icon-library.home.3d-printer'),
    domain: 'maker',
    icon: 'mdi:printer-3d',
    tags: ['home', 'maker', '3d', 'printer', 'print', 'sensor'],
    duration: 6,
    own: PRINTER_3D,
    parts: { frame: [m('icon-library.home.frame'), [0]], bed: [m('icon-library.home.bed'), [1]], print: [m('icon-library.home.print'), [2], [12, 17]], rail: [m('icon-library.home.rail'), [3]], head: [m('icon-library.home.print-head'), [4]] },
    groups: { toolhead: [m('icon-library.home.toolhead'), ['rail', 'head'], [12, 11]] },
    tracks: (x) => {
      // layer passes: four sweeps there and back at a constant speed
      x.keys('part:head', travel([0, 3.5, -2, 3.5, -2, 3.5, -2, 3.5, 0]));
      // the finished print fades away, the toolhead homes down and the print grows layer by layer
      x.keys('part:print', [t(0, { scale_y: 1 }, { opacity: 1, easing: 'ease-in' }), t(4, { scale_y: 1 }, { opacity: 0 }), t(5, { scale_y: 0.15 }, { opacity: 0, easing: 'ease-out' }), t(8, { scale_y: 0.2 }, { opacity: 1, easing: 'linear' }), t(100, { scale_y: 1 }, { opacity: 1 })]);
      x.keys('group:toolhead', [t(0, { y: 0 }, { easing: 'ease-in-out' }), t(5, { y: 2.5 }, { easing: 'linear' }), t(8, { y: 2.4 }, { easing: 'linear' }), t(100, { y: 0 })]);
    },
  },
  {
    id: 'laser-cutter',
    name: m('icon-library.home.laser-cutter'),
    domain: 'maker',
    icon: 'mdi:laser-pointer',
    tags: ['home', 'maker', 'laser', 'cutter', 'engraver', 'sensor'],
    duration: 3,
    own: LASER_CUTTER,
    parts: { body: [m('icon-library.home.case'), [0]], lid: [m('icon-library.home.lid'), [1], [3, 5]], rail: [m('icon-library.home.rail'), [2]], material: [m('icon-library.home.material'), [3]], head: [m('icon-library.home.laser-head'), [4]], beam: [m('icon-library.home.beam'), [5], 'top'] },
    groups: { cut: [m('icon-library.home.cutting-head'), ['head', 'beam'], [10.5, 12]] },
    shapes: [{ id: 'spark', name: m('icon-library.home.spark'), d: LASER_SPARK, fill: '#ffca28', layer: 'over', origin: [10.5, 15.25] }],
    tracks: (x) => {
      const along = (at: number) => r2(at <= 50 ? (at / 50) * 6 : ((100 - at) / 50) * 6);
      x.keys('group:cut', [t(0, { x: 0 }, { easing: 'linear' }), t(50, { x: 6 }, { easing: 'linear' }), t(100, { x: 0 })]);
      // the spark rides with the head (same travel) and pulses; the beam flickers twice a second
      x.keys(
        'shape:spark',
        Array.from({ length: 13 }, (_, i) => {
          const at = r2((i * 100) / 12);
          return t(at, { x: along(at), scale: i % 2 ? 1.2 : 0.6 }, { easing: 'linear' });
        }),
      );
      x.keys('part:beam', Array.from({ length: 13 }, (_, i) => k(r2((i * 100) / 12), { opacity: i % 2 ? 0.35 : 1, easing: 'linear' })));
    },
  },
  {
    id: 'printer-3d-nozzle',
    name: m('icon-library.home.3d-printer-nozzle'),
    domain: 'maker',
    icon: 'mdi:printer-3d-nozzle',
    tags: ['home', 'maker', '3d', 'printer', 'nozzle', 'extruder', 'sensor'],
    duration: 1,
    parts: { nozzle: [m('icon-library.home.nozzle'), [0], 'bottom'], filament: [m('icon-library.home.filament'), [1]] },
    tracks: (x) => x.keys('part:nozzle', [te(0, { y: 0 }), te(30, { y: 0.4 }), te(60, { y: 0 }), t(100, { y: 0 })]),
  },
];

