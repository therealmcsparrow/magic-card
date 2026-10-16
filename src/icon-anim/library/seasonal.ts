import { presetKeyframes } from '../part-presets';
import { dim, osc, te, t, type Spec } from './build';
import { BAT, SKULL, STRING_LIGHTS } from './rigs';

/*
 * P4 entries, themes Christmas, Halloween and Valentine (brand artist's p4-spec.json, Living rigs).
 * Entries the spec gives the catch-all `sensor` domain use the pseudo-domain `seasonal` (sensor
 * stays in their tags); lights, weather and binary sensors keep their domain.
 * Christmas: gentle sway and staggered twinkle. Halloween: slow float broken by one quick move.
 * Valentine: lub-dub beats and soft floats.
 */

const GOLD = '#ffd54f';
const bauble = (n: number, d: string) => ({ id: `bauble_${n}`, name: `Bauble ${n}`, d, fill: GOLD, layer: 'over' as const, origin: [12, 21] as [number, number] });

export const SEASONAL: Spec[] = [
  // ── christmas ──
  {
    id: 'christmas-tree',
    name: 'Christmas tree',
    domain: 'light',
    icon: 'mdi:pine-tree',
    tags: ['christmas', 'seasonal', 'tree', 'xmas', 'lights'],
    duration: 2.6,
    parts: { tree: ['Tree', [0], 'bottom'] },
    shapes: [
      bauble(1, 'M8.1 11.6a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0 -1.8 0Z'),
      bauble(2, 'M13.7 10.8a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0 -1.8 0Z'),
      bauble(3, 'M6.5 16.4a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0 -1.8 0Z'),
      bauble(4, 'M11.1 15.2a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0 -1.8 0Z'),
      bauble(5, 'M15.5 16.6a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0 -1.8 0Z'),
    ],
    tracks: (x) => {
      x.keys('part:tree', osc({ rotate: 1.5 }));
      // the baubles sway with the tree (same pivot, the tree's foot) and twinkle in turn
      for (let i = 1; i <= 5; i++) {
        x.keys(`shape:bauble_${i}`, osc({ rotate: 1.5 }));
        x.keys(`shape:bauble_${i}`, dim((i - 1) * 12, 40));
      }
    },
  },
  {
    id: 'string-lights',
    name: 'String lights',
    domain: 'light',
    icon: 'mdi:string-lights',
    tags: ['christmas', 'seasonal', 'lights', 'fairy', 'garland', 'party'],
    duration: 2.4,
    own: STRING_LIGHTS,
    parts: { wire: ['Wire', [0]], bulb_1: ['Left bulb', [1], [5.5, 8]], bulb_2: ['Middle bulb', [2], [12, 9]], bulb_3: ['Right bulb', [3], [18.5, 8]] },
    tracks: (x) =>
      ['bulb_1', 'bulb_2', 'bulb_3'].forEach((p, i) => {
        x.keys(`part:${p}`, osc({ rotate: [6, i * 8] }));
        x.keys(`part:${p}`, dim(i * 33, 34));
      }),
  },
  {
    id: 'gift',
    name: 'Gift',
    domain: 'seasonal',
    icon: 'mdi:gift',
    tags: ['christmas', 'seasonal', 'gift', 'present', 'birthday', 'sensor'],
    duration: 2.4,
    parts: { lid: ['Lid', [0], 'bottom-left'], box: ['Box', [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:lid', [t(0, { y: 0, rotate: 0 }, { easing: 'ease-out' }), t(15, { y: -1.5, rotate: -6 }, { easing: 'ease-in' }), t(30, { y: 0, rotate: 0 }, { easing: 'ease-out' }), te(36, { y: -0.3, rotate: 0 }), t(42, { y: 0, rotate: 0 })]);
      x.keys('part:box', [te(0, { scale_y: 1 }), te(30, { scale_y: 1 }), te(34, { scale_y: 0.94 }), t(42, { scale_y: 1 })]);
    },
  },
  {
    id: 'candy-cane',
    name: 'Candy cane',
    domain: 'seasonal',
    icon: 'mdi:candycane',
    tags: ['christmas', 'seasonal', 'candy', 'sweet', 'sensor'],
    duration: 2.4,
    parts: { seg_1: ['Hook end', [0]], seg_2: ['Top', [1]], seg_3: ['Bend', [2]], seg_4: ['Stem', [3]], seg_5: ['Foot', [4]] },
    groups: { cane: ['Candy cane', ['seg_1', 'seg_2', 'seg_3', 'seg_4', 'seg_5'], [16, 22]] },
    tracks: (x) => {
      x.keys('group:cane', osc({ rotate: 6 }));
      for (let i = 1; i <= 5; i++) x.keys(`part:seg_${i}`, dim((i - 1) * 12, 40, 0.5));
    },
  },
  {
    id: 'snowman',
    name: 'Snowman',
    domain: 'weather',
    icon: 'mdi:snowman',
    tags: ['christmas', 'seasonal', 'snow', 'winter'],
    duration: 3,
    parts: { snowman: ['Snowman', [0], 'bottom'] },
    tracks: (x) => x.keys('part:snowman', osc({ rotate: 4, scale_y: [0.03, 25] })),
  },
  {
    id: 'ornament',
    name: 'Ornament',
    domain: 'light',
    icon: 'mdi:ornament',
    tags: ['christmas', 'seasonal', 'bauble', 'decoration'],
    duration: 2.4,
    parts: { ornament: ['Ornament', [0], [12, 1]] },
    tracks: (x) => x.keys('part:ornament', osc({ rotate: 10 })),
  },
  {
    id: 'twinkle-star',
    name: 'Twinkling star',
    domain: 'light',
    icon: 'mdi:star-four-points',
    tags: ['christmas', 'seasonal', 'star', 'twinkle', 'sparkle'],
    duration: 2,
    parts: { star: ['Star', [0], 'center'] },
    tracks: (x) => x.keys('part:star', [te(0, { scale: 0.85, rotate: 0 }), te(50, { scale: 1.1, rotate: 45 }), t(100, { scale: 0.85, rotate: 0 })]),
  },
  {
    id: 'firework',
    name: 'Firework',
    domain: 'seasonal',
    icon: 'mdi:firework',
    tags: ['christmas', 'seasonal', 'new year', 'rocket', 'party', 'sensor'],
    duration: 2,
    // MDI's firework is a rocket (body and nose cone): it trembles, launches and comes back in
    parts: { body: ['Rocket', [0]], nose: ['Nose cone', [1]] },
    groups: { rocket: ['Rocket', ['body', 'nose'], 'center'] },
    tracks: (x) =>
      x.keys('group:rocket', [
        te(0, { x: 0, y: 0 }, { opacity: 1 }),
        te(6, { x: -0.2, y: 0 }, { opacity: 1 }),
        te(12, { x: 0.2, y: 0 }, { opacity: 1 }),
        t(18, { x: 0, y: 0 }, { opacity: 1, easing: 'ease-in' }),
        t(42, { x: 2, y: -2 }, { opacity: 0 }),
        t(43, { x: -1, y: 1 }, { opacity: 0, easing: 'ease-out' }),
        t(60, { x: 0, y: 0 }, { opacity: 1 }),
      ]),
  },
  {
    id: 'party-popper',
    name: 'Party popper',
    domain: 'seasonal',
    icon: 'mdi:party-popper',
    tags: ['christmas', 'seasonal', 'party', 'celebration', 'new year', 'sensor'],
    duration: 2.4,
    parts: { streamer_1: ['Streamer 1', [0]], streamer_2: ['Streamer 2', [1]], streamer_3: ['Streamer 3', [2]], cone: ['Popper', [3], 'bottom-left'], streamer_4: ['Streamer 4', [4]] },
    tracks: (x) => {
      x.keys('part:cone', [te(0, { rotate: 0 }), t(10, { rotate: 0 }, { easing: 'ease-out' }), te(16, { rotate: -6 }), t(35, { rotate: 0 })]);
      const out: Array<[string, number, number]> = [
        ['streamer_1', 0.3, -0.9],
        ['streamer_2', -0.3, -0.8],
        ['streamer_3', 0.9, -0.4],
        ['streamer_4', 0.9, 0.3],
      ];
      for (const [p, dx, dy] of out) x.keys(`part:${p}`, [te(0, { x: 0, y: 0, scale: 1 }), t(12, { x: 0, y: 0, scale: 1 }, { easing: 'ease-out' }), te(24, { x: dx, y: dy, scale: 1.1 }), t(45, { x: 0, y: 0, scale: 1 })]);
    },
  },
  {
    id: 'jingle-bell',
    name: 'Jingle bell',
    domain: 'binary_sensor',
    icon: 'mdi:bell-outline',
    tags: ['christmas', 'seasonal', 'bell', 'jingle', 'doorbell'],
    duration: 2,
    parts: { clapper: ['Clapper', [0], 'top'], bell: ['Bell', [1]] },
    groups: { bell_all: ['Bell', ['bell', 'clapper'], [12, 2]] },
    tracks: (x) => {
      x.keys('group:bell_all', presetKeyframes('ring', { share: 40 }));
      x.keys('part:clapper', presetKeyframes('ring', { share: 40, delay: 4, intensity: 0.6, direction: -1 }));
    },
  },
  {
    id: 'shooting-star',
    name: 'Shooting star',
    domain: 'weather',
    icon: 'mdi:star-shooting',
    tags: ['christmas', 'seasonal', 'star', 'night', 'wish'],
    duration: 2,
    parts: { star: ['Star', [0], 'center'], trail_1: ['Trail 1', [1], 'right'], trail_2: ['Trail 2', [2], 'right'], trail_3: ['Trail 3', [3], 'right'] },
    tracks: (x) => {
      x.keys('part:star', [te(0, { x: 0, y: 0 }), te(50, { x: 1.5, y: -1.5 }), t(100, { x: 0, y: 0 })]);
      // the trails ride along with the star and stretch behind it
      ['trail_1', 'trail_2', 'trail_3'].forEach((p, i) => x.keys(`part:${p}`, [te(0, { x: 0, y: 0, scale_x: 0.8 }), te(50, { x: 1.5, y: -1.5, scale_x: 1.2 - i * 0.05 }), t(100, { x: 0, y: 0, scale_x: 0.8 })]));
    },
  },
  // ── halloween ──
  {
    id: 'jack-o-lantern',
    name: "Jack-o'-lantern",
    domain: 'light',
    icon: 'mdi:halloween',
    tags: ['halloween', 'seasonal', 'pumpkin', 'lantern', 'spooky'],
    duration: 1.6,
    parts: { pumpkin: ['Pumpkin', [0], 'bottom'] },
    tracks: (x) =>
      x.keys('part:pumpkin', [te(0, { scale: 1 }, { opacity: 1 }), te(23, { scale: 1.02 }, { opacity: 0.8 }), te(41, { scale: 1 }, { opacity: 0.95 }), te(67, { scale: 1.03 }, { opacity: 0.75 }), te(88, { scale: 1.01 }, { opacity: 0.9 }), t(100, { scale: 1 }, { opacity: 1 })]),
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    domain: 'seasonal',
    icon: 'mdi:pumpkin',
    tags: ['halloween', 'seasonal', 'autumn', 'fall', 'sensor'],
    duration: 2.4,
    parts: { pumpkin: ['Pumpkin', [0], 'bottom'] },
    tracks: (x) => x.preset('part:pumpkin', 'bounce', { intensity: 0.35, share: 60 }),
  },
  {
    id: 'ghost',
    name: 'Ghost',
    domain: 'binary_sensor',
    icon: 'mdi:ghost',
    tags: ['halloween', 'seasonal', 'ghost', 'spooky', 'boo'],
    duration: 3,
    parts: { ghost: ['Ghost', [0], 'top'] },
    tracks: (x) =>
      x.keys('part:ghost', [te(0, { y: 0, skew_x: 3 }, { opacity: 1 }), te(25, { y: -1.2, skew_x: 0 }, { opacity: 0.85 }), te(50, { y: 0, skew_x: -3 }, { opacity: 0.7 }), te(75, { y: 1.2, skew_x: 0 }, { opacity: 0.85 }), t(100, { y: 0, skew_x: 3 }, { opacity: 1 })]),
  },
  {
    id: 'skull',
    name: 'Skull',
    domain: 'seasonal',
    icon: 'mdi:skull',
    tags: ['halloween', 'seasonal', 'skull', 'spooky', 'sensor'],
    duration: 2.4,
    own: SKULL,
    parts: { cranium: ['Skull', [0]], jaw: ['Jaw', [1], [12, 19]] },
    tracks: (x) =>
      x.keys('part:jaw', [te(0, { y: 0, scale_y: 1 }), te(8, { y: 1.2, scale_y: 1 }), te(16, { y: 0, scale_y: 1 }), te(24, { y: 1.2, scale_y: 1 }), te(32, { y: 0, scale_y: 0.94 }), t(40, { y: 0, scale_y: 1 })]),
  },
  {
    id: 'spider',
    name: 'Spider',
    domain: 'binary_sensor',
    icon: 'mdi:spider',
    tags: ['halloween', 'seasonal', 'spider', 'spooky', 'insect'],
    duration: 3.2,
    parts: { spider: ['Spider', [0], 'top'] },
    // the thread hangs from the top edge and stretches as the spider drops (2.5 + 1.5 units)
    shapes: [{ id: 'thread', name: 'Thread', d: 'M11.5 0H12.5V2.5H11.5Z', fill: 'currentColor', layer: 'under', origin: [12, 0] }],
    tracks: (x) => {
      x.keys('part:spider', [te(0, { y: 0 }), te(35, { y: 1.5 }), te(55, { y: 1.5 }), t(90, { y: 0 })]);
      x.keys('shape:thread', [te(0, { scale_y: 1 }), te(35, { scale_y: 1.6 }), te(55, { scale_y: 1.6 }), t(90, { scale_y: 1 })]);
    },
  },
  {
    id: 'bat',
    name: 'Bat',
    domain: 'binary_sensor',
    icon: 'mdi:bat',
    tags: ['halloween', 'seasonal', 'bat', 'night', 'spooky'],
    duration: 0.5,
    own: BAT,
    parts: { body: ['Body', [0]], wing_l: ['Left wing', [1], [10.5, 12.5]], wing_r: ['Right wing', [2], [13.5, 12.5]] },
    groups: { bat: ['Bat', ['body', 'wing_l', 'wing_r'], 'center'] },
    tracks: (x) => {
      const flap = (s: number) => [te(0, { rotate: 3 * s }), te(25, { rotate: 18 * s }), te(75, { rotate: -12 * s }), t(100, { rotate: 3 * s })];
      x.keys('part:wing_l', flap(1));
      x.keys('part:wing_r', flap(-1));
      x.keys('group:bat', osc({ y: [0.6, 25] }));
    },
  },
  {
    id: 'cauldron',
    name: 'Cauldron',
    domain: 'seasonal',
    icon: 'mdi:pot-mix',
    tags: ['halloween', 'seasonal', 'cauldron', 'potion', 'cooking', 'sensor'],
    duration: 2.4,
    parts: { spoon: ['Spoon', [0], 'bottom-left'], pot: ['Pot', [1]] },
    tracks: (x) => {
      x.path('part:spoon', 'M0 0 A0.8 0.8 0 1 0 1.6 0 A0.8 0.8 0 1 0 0 0');
      x.keys('part:spoon', osc({ rotate: 8 }));
    },
  },
  {
    id: 'gravestone',
    name: 'Gravestone',
    domain: 'seasonal',
    icon: 'mdi:grave-stone',
    tags: ['halloween', 'seasonal', 'grave', 'spooky', 'sensor'],
    duration: 3,
    parts: { stone: ['Stone', [0], 'bottom'], ground: ['Ground', [1]] },
    tracks: (x) => x.preset('part:stone', 'wobble', { share: 50, intensity: 0.375 }),
  },
  {
    id: 'owl',
    name: 'Owl',
    domain: 'binary_sensor',
    icon: 'mdi:owl',
    tags: ['halloween', 'seasonal', 'owl', 'night', 'bird'],
    duration: 3.2,
    parts: { body: ['Owl', [0], 'bottom'], eye_r: ['Right eye', [1], 'center'], eye_l: ['Left eye', [2], 'center'] },
    groups: { owl: ['Owl', ['body', 'eye_r', 'eye_l'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:owl', osc({ rotate: 5 }));
      const blink = [te(0, { scale_y: 1 }), te(88, { scale_y: 1 }), te(91, { scale_y: 0.1 }), t(94, { scale_y: 1 })];
      x.keys('part:eye_r', blink);
      x.keys('part:eye_l', blink);
    },
  },
  {
    id: 'wizard-hat',
    name: 'Wizard hat',
    domain: 'seasonal',
    icon: 'mdi:wizard-hat',
    tags: ['halloween', 'seasonal', 'wizard', 'magic', 'sensor'],
    duration: 2.8,
    parts: { brim: ['Brim', [0]], hat: ['Hat', [1], 'bottom'] },
    tracks: (x) => x.keys('part:hat', osc({ skew_x: 6 })),
  },
  {
    id: 'magic-staff',
    name: 'Magic staff',
    domain: 'seasonal',
    icon: 'mdi:magic-staff',
    tags: ['halloween', 'seasonal', 'magic', 'wand', 'sparkle', 'sensor'],
    duration: 2.4,
    // piece 0 is the staff's orb (not a sparkle): it waves with the staff
    parts: { orb: ['Orb', [0], 'center'], staff: ['Staff', [1]], sparkle_2: ['Sparkle 2', [2], 'center'], sparkle_3: ['Sparkle 3', [3], 'center'], sparkle_4: ['Sparkle 4', [4], 'center'] },
    groups: { wand: ['Staff and orb', ['staff', 'orb'], [2.5, 21.5]] },
    tracks: (x) => {
      x.keys('group:wand', osc({ rotate: 4 }));
      ['sparkle_2', 'sparkle_3', 'sparkle_4'].forEach((p, i) => {
        const at = i * 25;
        x.keys(`part:${p}`, [te(at, { scale: 1 }, { opacity: 1 }), te(at + 15, { scale: 0.6 }, { opacity: 0.4 }), t(at + 30, { scale: 1 }, { opacity: 1 })]);
      });
    },
  },
  // ── valentine ──
  {
    id: 'heart-beat',
    name: 'Beating heart',
    domain: 'sensor',
    icon: 'mdi:heart',
    tags: ['valentine', 'seasonal', 'heart', 'love', 'health', 'pulse'],
    duration: 1.2,
    parts: { heart: ['Heart', [0], 'center'] },
    tracks: (x) => x.keys('part:heart', [t(0, { scale: 1 }, { easing: 'ease-out' }), t(10, { scale: 1.15 }, { easing: 'ease-in' }), t(22, { scale: 1 }, { easing: 'ease-out' }), t(32, { scale: 1.1 }, { easing: 'ease-in' }), t(46, { scale: 1 })]),
  },
  {
    id: 'hearts-floating',
    name: 'Floating hearts',
    domain: 'seasonal',
    icon: 'mdi:heart-multiple',
    tags: ['valentine', 'seasonal', 'hearts', 'love', 'sensor'],
    duration: 3,
    parts: { big: ['Big heart', [0], 'center'], small: ['Small heart', [1], 'center'] },
    tracks: (x) => {
      x.keys('part:big', osc({ y: [0.75, 0], rotate: [6, 25] }));
      x.keys('part:small', osc({ y: [0.75, 50], rotate: [6, 75] }));
    },
  },
  {
    id: 'heart-broken',
    name: 'Broken heart',
    domain: 'seasonal',
    icon: 'mdi:heart-broken',
    tags: ['valentine', 'seasonal', 'heart', 'broken', 'sensor'],
    duration: 2.4,
    parts: { half_l: ['Left half', [0], 'bottom'], half_r: ['Right half', [1], 'bottom'] },
    tracks: (x) =>
      ([['half_l', -1], ['half_r', 1]] as const).forEach(([p, s]) =>
        x.keys(`part:${p}`, [te(0, { rotate: 0, x: 0 }), te(15, { rotate: 0, x: 0 }), te(35, { rotate: 8 * s, x: 0.6 * s }), te(60, { rotate: 8 * s, x: 0.6 * s }), t(80, { rotate: 0, x: 0 })]),
      ),
  },
  {
    id: 'ring',
    name: 'Ring',
    domain: 'seasonal',
    icon: 'mdi:ring',
    tags: ['valentine', 'seasonal', 'ring', 'wedding', 'diamond', 'sensor'],
    duration: 2,
    parts: { gem: ['Gem', [0], 'center'], band: ['Band', [1]] },
    tracks: (x) => x.keys('part:gem', [te(0, { scale: 1, rotate: 0 }), te(25, { scale: 1.12, rotate: 8 }), te(50, { scale: 1, rotate: 0 }), te(75, { scale: 1.12, rotate: -8 }), t(100, { scale: 1, rotate: 0 })]),
  },
  {
    id: 'tulip',
    name: 'Tulip',
    domain: 'seasonal',
    icon: 'mdi:flower-tulip',
    tags: ['valentine', 'seasonal', 'flower', 'spring', 'garden', 'sensor'],
    duration: 3,
    parts: { leaf_l: ['Left leaf', [0], 'bottom-right'], leaf_r: ['Right leaf', [1], 'bottom-left'], bloom: ['Bloom', [2], 'bottom'] },
    tracks: (x) => {
      x.keys('part:bloom', osc({ rotate: 6 }));
      x.keys('part:leaf_l', osc({ rotate: [3, 10] }));
      x.keys('part:leaf_r', osc({ rotate: [3, 10] }));
    },
  },
  {
    id: 'hand-heart',
    name: 'Hand with heart',
    domain: 'seasonal',
    icon: 'mdi:hand-heart',
    tags: ['valentine', 'seasonal', 'heart', 'love', 'care', 'sensor'],
    duration: 1.6,
    parts: { hand: ['Hand', [0]], heart: ['Heart', [1], 'center'], cuff: ['Cuff', [2]] },
    tracks: (x) =>
      x.keys('part:heart', [t(0, { y: 0, scale: 1 }, { easing: 'ease-out' }), t(10, { y: -0.3, scale: 1.12 }, { easing: 'ease-in' }), t(20, { y: -0.4, scale: 1 }, { easing: 'ease-out' }), t(30, { y: -0.6, scale: 1.08 }, { easing: 'ease-in' }), te(45, { y: -0.8, scale: 1 }), t(80, { y: 0, scale: 1 })]),
  },
  {
    id: 'cupcake',
    name: 'Cupcake',
    domain: 'seasonal',
    icon: 'mdi:cupcake',
    tags: ['valentine', 'seasonal', 'cake', 'birthday', 'sweet', 'sensor'],
    duration: 2,
    parts: { cherry: ['Cherry', [0], 'bottom'], frosting: ['Frosting', [1], 'bottom'], wrap_1: ['Wrapper 1', [2]], wrap_2: ['Wrapper 2', [3]], wrap_3: ['Wrapper 3', [4]] },
    tracks: (x) => {
      x.keys('part:cherry', [te(0, { y: 0, scale_y: 1 }), t(10, { y: 0, scale_y: 0.9 }, { easing: 'ease-out' }), t(25, { y: -1, scale_y: 1.05 }, { easing: 'ease-in' }), te(40, { y: 0, scale_y: 0.9 }), t(50, { y: 0, scale_y: 1 })]);
      x.keys('part:frosting', [te(0, { scale_y: 1 }), te(40, { scale_y: 1 }), te(45, { scale_y: 0.95 }), t(55, { scale_y: 1 })]);
    },
  },
  {
    id: 'balloon',
    name: 'Balloon',
    domain: 'seasonal',
    icon: 'mdi:balloon',
    tags: ['valentine', 'seasonal', 'balloon', 'party', 'birthday', 'sensor'],
    duration: 3.2,
    parts: { balloon: ['Balloon', [0], 'bottom'] },
    tracks: (x) => x.keys('part:balloon', osc({ y: 1, rotate: [4, 25] })),
  },
];
