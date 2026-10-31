import { blink2, emit, flame, k, osc, rise, te, t, type Spec } from './build';
import { m } from './i18n';

// Library entries, themes fire and cleaning. Piece indices are splitIcon's on @mdi/js 7.4.47; the `verify` entries were
// checked on the parts sheet. Fire: irregular flicker from the flame base, never more than 6 deg. Cleaning: glide, not bounce.

export const FIRE_AND_CLEANING: Spec[] = [
  // ── fire ──
  {
    id: 'campfire',
    name: m('icon-library.fire-cleaning.campfire'),
    domain: 'sensor',
    icon: 'mdi:campfire',
    tags: ['fire', 'campfire', 'outdoor', 'heat', 'flame'],
    duration: 1.3,
    parts: { logs: [m('icon-library.fire-cleaning.logs'), [0]], flame: [m('icon-library.fire-cleaning.flame'), [1], 'bottom'] },
    tracks: (x) => x.keys('part:flame', flame(1)),
  },
  {
    id: 'candle',
    name: m('icon-library.fire-cleaning.candle'),
    domain: 'light',
    icon: 'mdi:candle',
    tags: ['fire', 'candle', 'flame', 'light', 'cosy'],
    duration: 1.6,
    parts: { flame: [m('icon-library.fire-cleaning.flame'), [0], 'bottom'], candle: [m('icon-library.fire-cleaning.candle'), [1]] },
    tracks: (x) =>
      x.keys('part:flame', [te(0, { rotate: 0, scale_y: 1 }), te(23, { rotate: 4, scale_y: 1.06 }), te(41, { rotate: -2, scale_y: 0.94 }), te(67, { rotate: -5, scale_y: 1.04 }), te(88, { rotate: 2, scale_y: 0.92 }), t(100, { rotate: 0, scale_y: 1 })]),
  },
  {
    id: 'fire-alert',
    name: m('icon-library.fire-cleaning.fire-alert'),
    domain: 'binary_sensor',
    icon: 'mdi:fire-alert',
    tags: ['fire', 'alert', 'smoke', 'alarm', 'safety'],
    duration: 1.4,
    parts: { flame: [m('icon-library.fire-cleaning.flame'), [0], 'bottom'], mark: [m('icon-library.fire-cleaning.exclamation'), [1]], dot: [m('icon-library.fire-cleaning.dot'), [2]] },
    groups: { alert: [m('icon-library.fire-cleaning.exclamation-mark'), ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('part:flame', flame(1.2));
      x.keys('group:alert', blink2(0, 15));
    },
  },
  {
    id: 'fire-extinguisher',
    name: m('icon-library.fire-cleaning.fire-extinguisher'),
    domain: 'binary_sensor',
    icon: 'mdi:fire-extinguisher',
    tags: ['fire', 'extinguisher', 'safety'],
    duration: 2,
    parts: { body: [m('icon-library.fire-cleaning.extinguisher'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:body', [te(0, { rotate: 0 }), te(8, { rotate: 3 }), te(16, { rotate: -3 }), te(24, { rotate: 3 }), te(32, { rotate: -2 }), t(40, { rotate: 0 })]),
  },
  {
    id: 'grill',
    name: m('icon-library.fire-cleaning.grill'),
    domain: 'household',
    icon: 'mdi:grill',
    tags: ['fire', 'grill', 'barbecue', 'bbq', 'smoke', 'sensor'],
    duration: 2.4,
    parts: { smoke_1: [m('icon-library.fire-cleaning.smoke-1'), [0], 'bottom'], smoke_2: [m('icon-library.fire-cleaning.smoke-2'), [1], 'bottom'], smoke_3: [m('icon-library.fire-cleaning.smoke-3'), [2], 'bottom'], grill: [m('icon-library.fire-cleaning.grill'), [3]] },
    tracks: (x) => ['smoke_1', 'smoke_2', 'smoke_3'].forEach((p, i) => x.keys(`part:${p}`, rise(i * 20, 60, -1.5))),
  },
  {
    id: 'fire-ring',
    name: m('icon-library.fire-cleaning.fire-ring'),
    domain: 'sensor',
    icon: 'mdi:fire-circle',
    tags: ['fire', 'flame', 'heat', 'burner'],
    duration: 1.2,
    parts: { flame: [m('icon-library.fire-cleaning.inner-flame'), [0], 'bottom'], ring: [m('icon-library.fire-cleaning.ring'), [1]] },
    tracks: (x) => x.keys('part:flame', flame(1)),
  },
  {
    id: 'torch',
    name: m('icon-library.fire-cleaning.torch'),
    domain: 'light',
    icon: 'mdi:torch',
    tags: ['fire', 'torch', 'flame', 'light'],
    duration: 1.1,
    parts: { flame: [m('icon-library.fire-cleaning.flame'), [0], 'bottom'], handle: [m('icon-library.fire-cleaning.handle'), [1]] },
    tracks: (x) => x.keys('part:flame', flame(1.2)),
  },
  {
    id: 'fire-sprinkler',
    name: m('icon-library.fire-cleaning.fire-sprinkler'),
    domain: 'switch',
    icon: 'mdi:sprinkler-fire',
    tags: ['fire', 'sprinkler', 'water', 'safety', 'valve'],
    duration: 1.2,
    parts: { head: [m('icon-library.fire-cleaning.sprinkler'), [9, 10]], row_1: [m('icon-library.fire-cleaning.top-drops'), [3, 6]], row_2: [m('icon-library.fire-cleaning.middle-drops'), [2, 5, 8]], row_3: [m('icon-library.fire-cleaning.bottom-drops'), [0, 1, 4, 7]] },
    tracks: (x) => ['row_1', 'row_2', 'row_3'].forEach((p, i) => x.keys(`part:${p}`, emit(i * 12, { y: 1.5 }, 30, 20))),
  },
  // ── cleaning ──
  {
    id: 'vacuum',
    name: m('icon-library.fire-cleaning.vacuum-cleaner'),
    domain: 'vacuum',
    icon: 'mdi:vacuum',
    tags: ['cleaning', 'vacuum', 'hoover'],
    duration: 1.8,
    // the wand is fused to the body, so the whole vacuum rocks around the handle
    parts: { body: [m('icon-library.fire-cleaning.vacuum'), [0]], wheel: [m('icon-library.fire-cleaning.wheel'), [1]] },
    groups: { all: [m('icon-library.fire-cleaning.vacuum'), ['body', 'wheel'], [20, 4]] },
    tracks: (x) => x.keys('group:all', osc({ rotate: 4 })),
  },
  {
    id: 'robot-vacuum-side',
    name: m('icon-library.fire-cleaning.robot-vacuum-side-view'),
    domain: 'vacuum',
    icon: 'mdi:robot-vacuum-variant',
    tags: ['cleaning', 'vacuum', 'robot', 'roomba'],
    duration: 2,
    parts: { lid: [m('icon-library.fire-cleaning.lid'), [0]], sensor: [m('icon-library.fire-cleaning.sensor'), [1]], body: [m('icon-library.fire-cleaning.body'), [2]], button: [m('icon-library.fire-cleaning.button'), [3], 'center'] },
    // lid, body and what sits on them bob as one shell, so nothing tears apart
    groups: { shell: [m('icon-library.fire-cleaning.shell'), ['lid', 'body', 'sensor', 'button'], 'center'] },
    tracks: (x) => {
      x.keys('group:shell', osc({ y: 0.3 }));
      x.keys('part:sensor', blink2(10, 15));
      x.keys('part:button', [te(0, { scale: 1 }), te(50, { scale: 0.9 }), te(75, { scale: 1.05 }), t(100, { scale: 1 })]);
    },
  },
  {
    id: 'broom',
    name: m('icon-library.fire-cleaning.broom'),
    domain: 'household',
    icon: 'mdi:broom',
    tags: ['cleaning', 'broom', 'sweep', 'vacuum'],
    duration: 1.6,
    parts: { handle: [m('icon-library.fire-cleaning.handle'), [0]], bristles: [m('icon-library.fire-cleaning.bristles'), [1], 'top-right'] },
    groups: { broom: [m('icon-library.fire-cleaning.broom'), ['handle', 'bristles'], [20.5, 3.5]] },
    tracks: (x) => {
      x.keys('group:broom', osc({ rotate: 10 }));
      x.keys('part:bristles', osc({ skew_x: [6, 10] }));
    },
  },
  {
    id: 'spray-bottle',
    name: m('icon-library.fire-cleaning.spray-bottle'),
    domain: 'household',
    icon: 'mdi:spray-bottle',
    tags: ['cleaning', 'spray', 'bottle', 'switch'],
    duration: 2,
    parts: { head: [m('icon-library.fire-cleaning.trigger-head'), [0]], tip: [m('icon-library.fire-cleaning.nozzle'), [1]], bottle: [m('icon-library.fire-cleaning.bottle'), [2], 'bottom'] },
    groups: { trigger: [m('icon-library.fire-cleaning.trigger'), ['head', 'tip'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:trigger', [te(0, { scale_y: 1 }), te(8, { scale_y: 0.94 }), te(16, { scale_y: 1 }), te(24, { scale_y: 0.94 }), t(32, { scale_y: 1 })]);
      x.keys('part:bottle', [te(0, { y: 0 }), te(8, { y: 0.2 }), te(16, { y: 0 }), te(24, { y: 0.2 }), t(32, { y: 0 })]);
    },
  },
  {
    id: 'spray-can',
    name: m('icon-library.fire-cleaning.spray-can'),
    domain: 'household',
    icon: 'mdi:spray',
    tags: ['cleaning', 'spray', 'aerosol', 'switch'],
    duration: 1.6,
    parts: { mist_1: [m('icon-library.fire-cleaning.mist-1'), [0]], mist_2: [m('icon-library.fire-cleaning.mist-2'), [1]], mist_3: [m('icon-library.fire-cleaning.mist-3'), [2]], mist_4: [m('icon-library.fire-cleaning.mist-4'), [3]], mist_5: [m('icon-library.fire-cleaning.mist-5'), [4]], mist_6: [m('icon-library.fire-cleaning.mist-6'), [5]], can: [m('icon-library.fire-cleaning.can'), [6], 'bottom'] },
    // nearest the nozzle first
    tracks: (x) => [0, 10, 10, 20, 20, 20].forEach((at, i) => x.keys(`part:mist_${i + 1}`, emit(at, { x: -1 }, 35, 20))),
  },
  {
    id: 'iron',
    name: m('icon-library.fire-cleaning.iron'),
    domain: 'household',
    icon: 'mdi:iron',
    tags: ['cleaning', 'iron', 'laundry', 'switch'],
    duration: 2,
    parts: { iron: [m('icon-library.fire-cleaning.iron'), [0], 'bottom'] },
    tracks: (x) => x.keys('part:iron', osc({ x: 1.5, rotate: [2, 25] })),
  },
  {
    id: 'hand-wash',
    name: m('icon-library.fire-cleaning.hand-wash'),
    domain: 'household',
    icon: 'mdi:hand-wash',
    tags: ['cleaning', 'hands', 'soap', 'hygiene', 'sensor'],
    duration: 1.6,
    parts: { sparkle: [m('icon-library.fire-cleaning.sparkle'), [0], 'center'], pump: [m('icon-library.fire-cleaning.soap-pump'), [1]], cuff: [m('icon-library.fire-cleaning.cuff'), [2]], hands: [m('icon-library.fire-cleaning.hands'), [3]], drop: [m('icon-library.fire-cleaning.drop'), [4]] },
    tracks: (x) => {
      x.keys('part:drop', emit(0, { y: 1.5 }, 40, 25));
      x.keys('part:hands', osc({ x: 0.5 }, { cycles: 2 }));
      x.keys('part:sparkle', [te(0, { scale: 1 }, { opacity: 1 }), te(30, { scale: 1 }, { opacity: 1 }), te(45, { scale: 0.6 }, { opacity: 0.5 }), t(60, { scale: 1 }, { opacity: 1 })]);
    },
  },
  {
    id: 'sparkle-clean',
    name: m('icon-library.fire-cleaning.sparkling-clean'),
    domain: 'vacuum',
    icon: 'mdi:shimmer',
    tags: ['cleaning', 'sparkle', 'shine', 'clean', 'magic'],
    duration: 1.4,
    parts: { big: [m('icon-library.fire-cleaning.big-sparkle'), [0], 'center'], mid: [m('icon-library.fire-cleaning.sparkle'), [1], 'center'], small: [m('icon-library.fire-cleaning.small-sparkle'), [2], 'center'] },
    tracks: (x) =>
      ['big', 'mid', 'small'].forEach((p, i) => {
        const at = i * 33;
        x.keys(`part:${p}`, [te(at, { scale: 1, rotate: 0 }), te(at + 17, { scale: 0.6, rotate: 15 }), t(at + 34, { scale: 1, rotate: 0 })]);
      }),
  },
  {
    id: 'washing-alert',
    name: m('icon-library.fire-cleaning.washing-machine-alert'),
    domain: 'sensor',
    icon: 'mdi:washing-machine-alert',
    tags: ['cleaning', 'washing_machine', 'laundry', 'alert', 'done'],
    duration: 1.2,
    parts: { window: [m('icon-library.fire-cleaning.door-window'), [0], 'center'], body: [m('icon-library.fire-cleaning.machine'), [1], 'bottom'], dot: [m('icon-library.fire-cleaning.dot'), [2]], mark: [m('icon-library.fire-cleaning.exclamation'), [3]] },
    groups: { machine: [m('icon-library.fire-cleaning.machine'), ['body', 'window'], 'bottom'], alert: [m('icon-library.fire-cleaning.exclamation-mark'), ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('group:machine', osc({ x: 0.3 }, { cycles: 4 }));
      x.keys('group:alert', [k(0, { opacity: 1, easing: 'ease-in-out' }), k(25, { opacity: 0.35, easing: 'ease-in-out' }), k(50, { opacity: 1 })]);
    },
  },
  {
    id: 'air-filter',
    name: m('icon-library.fire-cleaning.air-filter'),
    domain: 'fan',
    icon: 'mdi:air-filter',
    tags: ['cleaning', 'air', 'filter', 'purifier'],
    duration: 1.8,
    parts: { frame: [m('icon-library.fire-cleaning.filter'), [0]], air_t: [m('icon-library.fire-cleaning.air-top'), [1]], air_b: [m('icon-library.fire-cleaning.air-bottom'), [2]] },
    tracks: (x) => {
      x.keys('part:air_t', emit(0, { x: 1 }, 40, 20));
      x.keys('part:air_b', emit(20, { x: 1 }, 40, 20));
    },
  },
];
