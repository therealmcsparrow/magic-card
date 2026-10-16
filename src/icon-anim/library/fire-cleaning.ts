import { blink2, emit, flame, k, osc, rise, te, t, type Spec } from './build';

/*
 * P4 entries, themes fire and cleaning (brand artist's p4-spec.json, direction B: Living rigs).
 * Piece indices are splitIcon's on @mdi/js 7.4.47; the `verify` entries were checked on the parts
 * sheet (hand-wash: piece 0 is a sparkle and piece 1 the soap pump; vacuum: piece 1 is the wheel).
 * Fire: irregular flicker from the flame base, never more than 6 deg. Cleaning: glide, not bounce.
 */

export const FIRE_AND_CLEANING: Spec[] = [
  // ── fire ──
  {
    id: 'campfire',
    name: 'Campfire',
    domain: 'sensor',
    icon: 'mdi:campfire',
    tags: ['fire', 'campfire', 'outdoor', 'heat', 'flame'],
    duration: 1.3,
    parts: { logs: ['Logs', [0]], flame: ['Flame', [1], 'bottom'] },
    tracks: (x) => x.keys('part:flame', flame(1)),
  },
  {
    id: 'candle',
    name: 'Candle',
    domain: 'light',
    icon: 'mdi:candle',
    tags: ['fire', 'candle', 'flame', 'light', 'cosy'],
    duration: 1.6,
    parts: { flame: ['Flame', [0], 'bottom'], candle: ['Candle', [1]] },
    tracks: (x) =>
      x.keys('part:flame', [te(0, { rotate: 0, scale_y: 1 }), te(23, { rotate: 4, scale_y: 1.06 }), te(41, { rotate: -2, scale_y: 0.94 }), te(67, { rotate: -5, scale_y: 1.04 }), te(88, { rotate: 2, scale_y: 0.92 }), t(100, { rotate: 0, scale_y: 1 })]),
  },
  {
    id: 'fire-alert',
    name: 'Fire alert',
    domain: 'binary_sensor',
    icon: 'mdi:fire-alert',
    tags: ['fire', 'alert', 'smoke', 'alarm', 'safety'],
    duration: 1.4,
    parts: { flame: ['Flame', [0], 'bottom'], mark: ['Exclamation', [1]], dot: ['Dot', [2]] },
    groups: { alert: ['Exclamation mark', ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('part:flame', flame(1.2));
      x.keys('group:alert', blink2(0, 15));
    },
  },
  {
    id: 'fire-extinguisher',
    name: 'Fire extinguisher',
    domain: 'binary_sensor',
    icon: 'mdi:fire-extinguisher',
    tags: ['fire', 'extinguisher', 'safety'],
    duration: 2,
    parts: { body: ['Extinguisher', [0], 'bottom'] },
    tracks: (x) => x.keys('part:body', [te(0, { rotate: 0 }), te(8, { rotate: 3 }), te(16, { rotate: -3 }), te(24, { rotate: 3 }), te(32, { rotate: -2 }), t(40, { rotate: 0 })]),
  },
  {
    id: 'grill',
    name: 'Grill',
    domain: 'household',
    icon: 'mdi:grill',
    tags: ['fire', 'grill', 'barbecue', 'bbq', 'smoke', 'sensor'],
    duration: 2.4,
    parts: { smoke_1: ['Smoke 1', [0], 'bottom'], smoke_2: ['Smoke 2', [1], 'bottom'], smoke_3: ['Smoke 3', [2], 'bottom'], grill: ['Grill', [3]] },
    tracks: (x) => ['smoke_1', 'smoke_2', 'smoke_3'].forEach((p, i) => x.keys(`part:${p}`, rise(i * 20, 60, -1.5))),
  },
  {
    id: 'fire-ring',
    name: 'Fire ring',
    domain: 'sensor',
    icon: 'mdi:fire-circle',
    tags: ['fire', 'flame', 'heat', 'burner'],
    duration: 1.2,
    parts: { flame: ['Inner flame', [0], 'bottom'], ring: ['Ring', [1]] },
    tracks: (x) => x.keys('part:flame', flame(1)),
  },
  {
    id: 'torch',
    name: 'Torch',
    domain: 'light',
    icon: 'mdi:torch',
    tags: ['fire', 'torch', 'flame', 'light'],
    duration: 1.1,
    parts: { flame: ['Flame', [0], 'bottom'], handle: ['Handle', [1]] },
    tracks: (x) => x.keys('part:flame', flame(1.2)),
  },
  {
    id: 'fire-sprinkler',
    name: 'Fire sprinkler',
    domain: 'switch',
    icon: 'mdi:sprinkler-fire',
    tags: ['fire', 'sprinkler', 'water', 'safety', 'valve'],
    duration: 1.2,
    parts: { head: ['Sprinkler', [9, 10]], row_1: ['Top drops', [3, 6]], row_2: ['Middle drops', [2, 5, 8]], row_3: ['Bottom drops', [0, 1, 4, 7]] },
    tracks: (x) => ['row_1', 'row_2', 'row_3'].forEach((p, i) => x.keys(`part:${p}`, emit(i * 12, { y: 1.5 }, 30, 20))),
  },
  // ── cleaning ──
  {
    id: 'vacuum',
    name: 'Vacuum cleaner',
    domain: 'vacuum',
    icon: 'mdi:vacuum',
    tags: ['cleaning', 'vacuum', 'hoover'],
    duration: 1.8,
    // the wand is fused to the body, so the whole vacuum rocks around the handle
    parts: { body: ['Vacuum', [0]], wheel: ['Wheel', [1]] },
    groups: { all: ['Vacuum', ['body', 'wheel'], [20, 4]] },
    tracks: (x) => x.keys('group:all', osc({ rotate: 4 })),
  },
  {
    id: 'robot-vacuum-side',
    name: 'Robot vacuum side view',
    domain: 'vacuum',
    icon: 'mdi:robot-vacuum-variant',
    tags: ['cleaning', 'vacuum', 'robot', 'roomba'],
    duration: 2,
    parts: { lid: ['Lid', [0]], sensor: ['Sensor', [1]], body: ['Body', [2]], button: ['Button', [3], 'center'] },
    // lid, body and what sits on them bob as one shell, so nothing tears apart
    groups: { shell: ['Shell', ['lid', 'body', 'sensor', 'button'], 'center'] },
    tracks: (x) => {
      x.keys('group:shell', osc({ y: 0.3 }));
      x.keys('part:sensor', blink2(10, 15));
      x.keys('part:button', [te(0, { scale: 1 }), te(50, { scale: 0.9 }), te(75, { scale: 1.05 }), t(100, { scale: 1 })]);
    },
  },
  {
    id: 'broom',
    name: 'Broom',
    domain: 'household',
    icon: 'mdi:broom',
    tags: ['cleaning', 'broom', 'sweep', 'vacuum'],
    duration: 1.6,
    parts: { handle: ['Handle', [0]], bristles: ['Bristles', [1], 'top-right'] },
    groups: { broom: ['Broom', ['handle', 'bristles'], [20.5, 3.5]] },
    tracks: (x) => {
      x.keys('group:broom', osc({ rotate: 10 }));
      x.keys('part:bristles', osc({ skew_x: [6, 10] }));
    },
  },
  {
    id: 'spray-bottle',
    name: 'Spray bottle',
    domain: 'household',
    icon: 'mdi:spray-bottle',
    tags: ['cleaning', 'spray', 'bottle', 'switch'],
    duration: 2,
    parts: { head: ['Trigger head', [0]], tip: ['Nozzle', [1]], bottle: ['Bottle', [2], 'bottom'] },
    groups: { trigger: ['Trigger', ['head', 'tip'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:trigger', [te(0, { scale_y: 1 }), te(8, { scale_y: 0.94 }), te(16, { scale_y: 1 }), te(24, { scale_y: 0.94 }), t(32, { scale_y: 1 })]);
      x.keys('part:bottle', [te(0, { y: 0 }), te(8, { y: 0.2 }), te(16, { y: 0 }), te(24, { y: 0.2 }), t(32, { y: 0 })]);
    },
  },
  {
    id: 'spray-can',
    name: 'Spray can',
    domain: 'household',
    icon: 'mdi:spray',
    tags: ['cleaning', 'spray', 'aerosol', 'switch'],
    duration: 1.6,
    parts: { mist_1: ['Mist 1', [0]], mist_2: ['Mist 2', [1]], mist_3: ['Mist 3', [2]], mist_4: ['Mist 4', [3]], mist_5: ['Mist 5', [4]], mist_6: ['Mist 6', [5]], can: ['Can', [6], 'bottom'] },
    // nearest the nozzle first
    tracks: (x) => [0, 10, 10, 20, 20, 20].forEach((at, i) => x.keys(`part:mist_${i + 1}`, emit(at, { x: -1 }, 35, 20))),
  },
  {
    id: 'iron',
    name: 'Iron',
    domain: 'household',
    icon: 'mdi:iron',
    tags: ['cleaning', 'iron', 'laundry', 'switch'],
    duration: 2,
    parts: { iron: ['Iron', [0], 'bottom'] },
    tracks: (x) => x.keys('part:iron', osc({ x: 1.5, rotate: [2, 25] })),
  },
  {
    id: 'hand-wash',
    name: 'Hand wash',
    domain: 'household',
    icon: 'mdi:hand-wash',
    tags: ['cleaning', 'hands', 'soap', 'hygiene', 'sensor'],
    duration: 1.6,
    parts: { sparkle: ['Sparkle', [0], 'center'], pump: ['Soap pump', [1]], cuff: ['Cuff', [2]], hands: ['Hands', [3]], drop: ['Drop', [4]] },
    tracks: (x) => {
      x.keys('part:drop', emit(0, { y: 1.5 }, 40, 25));
      x.keys('part:hands', osc({ x: 0.5 }, { cycles: 2 }));
      x.keys('part:sparkle', [te(0, { scale: 1 }, { opacity: 1 }), te(30, { scale: 1 }, { opacity: 1 }), te(45, { scale: 0.6 }, { opacity: 0.5 }), t(60, { scale: 1 }, { opacity: 1 })]);
    },
  },
  {
    id: 'sparkle-clean',
    name: 'Sparkling clean',
    domain: 'vacuum',
    icon: 'mdi:shimmer',
    tags: ['cleaning', 'sparkle', 'shine', 'clean', 'magic'],
    duration: 1.4,
    parts: { big: ['Big sparkle', [0], 'center'], mid: ['Sparkle', [1], 'center'], small: ['Small sparkle', [2], 'center'] },
    tracks: (x) =>
      ['big', 'mid', 'small'].forEach((p, i) => {
        const at = i * 33;
        x.keys(`part:${p}`, [te(at, { scale: 1, rotate: 0 }), te(at + 17, { scale: 0.6, rotate: 15 }), t(at + 34, { scale: 1, rotate: 0 })]);
      }),
  },
  {
    id: 'washing-alert',
    name: 'Washing machine alert',
    domain: 'sensor',
    icon: 'mdi:washing-machine-alert',
    tags: ['cleaning', 'washing_machine', 'laundry', 'alert', 'done'],
    duration: 1.2,
    parts: { window: ['Door window', [0], 'center'], body: ['Machine', [1], 'bottom'], dot: ['Dot', [2]], mark: ['Exclamation', [3]] },
    groups: { machine: ['Machine', ['body', 'window'], 'bottom'], alert: ['Exclamation mark', ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('group:machine', osc({ x: 0.3 }, { cycles: 4 }));
      x.keys('group:alert', [k(0, { opacity: 1, easing: 'ease-in-out' }), k(25, { opacity: 0.35, easing: 'ease-in-out' }), k(50, { opacity: 1 })]);
    },
  },
  {
    id: 'air-filter',
    name: 'Air filter',
    domain: 'fan',
    icon: 'mdi:air-filter',
    tags: ['cleaning', 'air', 'filter', 'purifier'],
    duration: 1.8,
    parts: { frame: ['Filter', [0]], air_t: ['Air top', [1]], air_b: ['Air bottom', [2]] },
    tracks: (x) => {
      x.keys('part:air_t', emit(0, { x: 1 }, 40, 20));
      x.keys('part:air_b', emit(20, { x: 1 }, 40, 20));
    },
  },
];
