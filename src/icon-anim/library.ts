import type { AnimationDoc, AnimationKeyframe, KeyframeTransform, RigGroup, RigPart, RigShape, TargetRef, Track } from '../anim-studio/model';
import type { IconGeometry } from '../icons/icon-source';
import { splitIcon, type SplitPiece } from '../icons/icon-split';
import { anchorOf, piecesBox, type Anchor } from './icon-doc';
import { mdiGeometry } from './mdi-paths';
import { presetKeyframes } from './part-presets';

/*
 * The animated icon library (icon animator core): ready animations for the icons of most Home
 * Assistant domains. Each entry builds a normal keyframes document with a rig and one track per
 * moving part; the studio edits it like any other document. The rig's source is the icon's own
 * geometry embedded as SVG (`rig.svg`, the bundled MDI path of mdi-paths.ts), and the parts name
 * pieces of that SVG: a card plays it through the rig runtime without resolving any icon, so a
 * dashboard never depends on Home Assistant's MDI version for the piece numbering. A few icons whose
 * moving piece MDI draws in one outline with the rest (the lock's shackle) embed paths cut from the
 * MDI path instead (`own`).
 *
 * Lives in the studio bundle and the lazy icon animator chunk only, never in magic-card.js.
 */

export interface LibraryEntry {
  id: string;
  name: string;
  /** Home Assistant domain the entry suits first (others are in `tags`). */
  domain: string;
  icon: string;
  tags: string[];
  build(): AnimationDoc;
}

// ── builder ──

type Pivot = Anchor | [number, number];
type PartDef = [name: string, from: number[], pivot?: Pivot];
type GroupDef = [name: string, parts: string[], pivot?: Pivot];

interface Spec {
  id: string;
  name: string;
  domain: string;
  icon: string;
  tags: string[];
  /** s per cycle. */
  duration: number;
  parts: Record<string, PartDef>;
  groups?: Record<string, GroupDef>;
  shapes?: RigShape[];
  /** Own source paths (filled, 24 x 24) instead of the MDI icon: one piece per path. */
  own?: string[];
  tracks: (t: Tracks) => void;
}

interface Tracks {
  /** A part preset's keyframes on a target (merged with keys already there, later wins per at). */
  preset(target: TargetRef, presetId: string, params?: Record<string, number>): void;
  /** Own keyframes (padded to 0 % and 100 % with the nearest key). */
  keys(target: TargetRef, keys: AnimationKeyframe[]): void;
  /** A motion path in viewBox units around the rest position. */
  path(target: TargetRef, d: string): void;
}

const k = (at: number, v: Omit<AnimationKeyframe, 'at'> = {}): AnimationKeyframe => ({ at, ...v });
const t = (at: number, transform: KeyframeTransform, v: Omit<AnimationKeyframe, 'at' | 'transform'> = {}): AnimationKeyframe => ({ at, transform, ...v });

/** Sorted keys with copies (no easing) of the first and last key at 0 % and 100 % when missing. */
export function padKeys(keys: AnimationKeyframe[]): AnimationKeyframe[] {
  const out = [...keys].sort((a, b) => a.at - b.at);
  const bare = (x: AnimationKeyframe, at: number): AnimationKeyframe => {
    const c = { ...x, at };
    delete c.easing;
    delete c.easings;
    return c;
  };
  if (out.length && out[0].at > 0) out.unshift(bare(out[0], 0));
  if (out.length && out[out.length - 1].at < 100) out.push(bare(out[out.length - 1], 100));
  return out;
}

/** The embedded source: filled paths in the 24 x 24 MDI viewBox (one element each). */
export const svgOf = (paths: string[]): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${paths.map((d) => `<path d="${d}"/>`).join('')}</svg>`;

function build(spec: Spec): AnimationDoc {
  const geometry: IconGeometry | undefined = spec.own ? { paths: spec.own, viewBox: '0 0 24 24' } : mdiGeometry(spec.icon);
  const source = spec.own ?? geometry?.paths ?? [];
  const pieces: SplitPiece[] = geometry ? splitIcon(geometry) : [];
  const pivotOf = (from: number[], p: Pivot | undefined): [number, number] | undefined => {
    if (Array.isArray(p)) return p;
    const box = p ? piecesBox(pieces, from) : undefined;
    return box ? anchorOf(box, p) : undefined;
  };
  const parts: RigPart[] = Object.entries(spec.parts).map(([id, [name, from, pivot]]) => {
    const origin = pivotOf(from, pivot);
    return { id, name, from, ...(origin ? { origin } : {}) };
  });
  const groups: RigGroup[] = Object.entries(spec.groups ?? {}).map(([id, [name, members, pivot]]) => {
    const origin = pivotOf(
      members.flatMap((m) => spec.parts[m]?.[1] ?? []),
      pivot,
    );
    return { id, name, parts: members, ...(origin ? { origin } : {}) };
  });
  const tracks: Track[] = [];
  const trackOf = (target: TargetRef): Track => {
    let tr = tracks.find((x) => x.target === target);
    if (!tr) tracks.push((tr = { target, keyframes: [] }));
    return tr;
  };
  const merge = (target: TargetRef, keys: AnimationKeyframe[]) => {
    const tr = trackOf(target);
    const byAt = new Map(tr.keyframes.map((x) => [x.at, x]));
    for (const x of keys) byAt.set(x.at, { ...byAt.get(x.at), ...x });
    tr.keyframes = padKeys([...byAt.values()]);
  };
  spec.tracks({
    preset: (target, id, params) => merge(target, presetKeyframes(id, params)),
    keys: (target, keys) => merge(target, keys),
    path: (target, d) => {
      trackOf(target).path = { d };
    },
  });
  return {
    id: spec.id,
    name: spec.name,
    kind: 'keyframes',
    duration: spec.duration,
    easing: 'ease-in-out',
    iterations: 'infinite',
    target: 'icon',
    origin: 'center',
    version: 1,
    // the parts' tracks carry the motion: one still key keeps the element track valid and empty
    keyframes: [k(0, { opacity: 1 })],
    rig: {
      svg: svgOf(source),
      parts,
      ...(groups.length ? { groups } : {}),
      ...(spec.shapes?.length ? { shapes: spec.shapes } : {}),
    },
    tracks,
  };
}

// ── motion helpers ──

/** Rises from below and fades away (steam, heat, mist), starting at `at` %, over `span` %. */
const rise = (at: number, span = 60, dy = -3): AnimationKeyframe[] =>
  padKeys([
    t(at, { y: 1 }, { opacity: 0, easing: 'ease-out' }),
    t(at + span * 0.4, { y: -0.4 }, { opacity: 1, easing: 'ease-in' }),
    t(at + span, { y: dy }, { opacity: 0 }),
  ]);

/** Falls `dy` units from its place and fades out (drops), starting at `at` % over `span` %. */
const fall = (at: number, span = 50, dy = 3, from = -1.5): AnimationKeyframe[] =>
  padKeys([
    t(at, { y: from }, { opacity: 0, easing: 'ease-in' }),
    t(at + span * 0.2, { y: from + (dy - from) * 0.12 }, { opacity: 1, easing: 'ease-in' }),
    t(at + span * 0.85, { y: dy * 0.85 }, { opacity: 1, easing: 'ease-out' }),
    t(at + span, { y: dy }, { opacity: 0 }),
  ]);

/** Fades in at `at` %, stays until `out` %, fades out by 100 % (a bar of a filling level). */
const fillIn = (at: number, out = 85): AnimationKeyframe[] => [k(0, { opacity: 0.15 }), k(at, { opacity: 0.15, easing: 'ease-out' }), k(at + 8, { opacity: 1 }), k(out, { opacity: 1, easing: 'ease-in' }), k(100, { opacity: 0.15 })];

/** Quick flashes (lightning) in the first `span` %. */
const flash = (at = 0, color?: string): AnimationKeyframe[] => {
  const c = color ? { color } : {};
  return padKeys([
    k(at, { opacity: 1, ...c, easing: 'linear' }),
    k(at + 6, { opacity: 0.15, easing: 'linear' }),
    k(at + 10, { opacity: 1, ...c, easing: 'linear' }),
    k(at + 16, { opacity: 0.2, easing: 'linear' }),
    k(at + 20, { opacity: 1, ...c, easing: 'linear' }),
  ]);
};

/** Flame colours, alternating per key. */
const FLAME = ['#ff6d00', '#ffab00'];
const flame = (intensity: number, delay = 0, share = 100): AnimationKeyframe[] =>
  presetKeyframes('flicker', { intensity, delay, share }).map((x, i, all) => ({ ...x, color: FLAME[i === all.length - 1 ? 0 : i % 2] }));

/** Open, hold, close (garage door slats, shutters): `y` moves up to `to`, fading out; `order` staggers. */
const rollUp = (dy: number, order: number): AnimationKeyframe[] => [
  t(0, { y: 0 }, { opacity: 1 }),
  t(8 + order * 5, { y: 0 }, { opacity: 1, easing: 'ease-in-out' }),
  t(34 + order * 5, { y: dy }, { opacity: 0 }),
  t(66 - order * 5, { y: dy }, { opacity: 0, easing: 'ease-in-out' }),
  t(92 - order * 5, { y: 0 }, { opacity: 1 }),
  t(100, { y: 0 }, { opacity: 1 }),
];

/** A swing on an axis (doors, curtains): scale_x closes to `to` and back. */
const fold = (to: number, extra: KeyframeTransform = {}): AnimationKeyframe[] => [
  t(0, { scale_x: 1 }),
  t(12, { scale_x: 1 }, { easing: 'ease-in-out' }),
  t(42, { scale_x: to, ...extra }),
  t(62, { scale_x: to, ...extra }, { easing: 'ease-in-out' }),
  t(90, { scale_x: 1 }),
  t(100, { scale_x: 1 }),
];

const SPIN = (n = 1) => [t(0, { rotate: 0 }, { easing: 'linear' }), t(100, { rotate: 360 * n })];

// ── the library ──

const LOCK_BODY = 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H18Z M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z';
const LOCK_SHACKLE = 'M7,8V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6V8Z';

const SPECS: Spec[] = [
  // ── light ──
  {
    id: 'bulb-glow',
    name: 'Bulb glow',
    domain: 'light',
    icon: 'mdi:lightbulb-on',
    tags: ['light', 'lamp', 'bulb', 'on'],
    duration: 2,
    parts: { bulb: ['Bulb', [0], 'center'], base: ['Base', [1]], ray_l: ['Ray left', [3]], ray_tl: ['Ray top left', [5]], ray_t: ['Ray top', [4]], ray_tr: ['Ray top right', [6]], ray_r: ['Ray right', [2]] },
    groups: { rays: ['Rays', ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'], [12, 11]] },
    tracks: (x) => {
      x.preset('part:bulb', 'pulse', { intensity: 0.35 });
      x.keys('group:rays', [t(0, { scale: 0.9 }), t(50, { scale: 1.12 }), t(100, { scale: 0.9 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [k(0, { opacity: 0.35 }), k(10 + i * 8, { opacity: 0.35, easing: 'ease-out' }), k(30 + i * 8, { opacity: 1, easing: 'ease-in' }), k(60 + i * 8, { opacity: 0.35 })]));
    },
  },
  {
    id: 'ceiling-light',
    name: 'Ceiling light',
    domain: 'light',
    icon: 'mdi:ceiling-light',
    tags: ['light', 'pendant', 'lamp'],
    duration: 3,
    parts: { shade: ['Shade', [0]], bulb: ['Bulb', [1], 'center'] },
    groups: { pendant: ['Pendant', ['shade', 'bulb'], [12, 4]] },
    tracks: (x) => {
      x.preset('group:pendant', 'swing', { intensity: 0.3 });
      x.preset('part:bulb', 'pulse', { intensity: 1 });
      x.keys('part:bulb', [k(0, { opacity: 0.55 }), k(50, { opacity: 1 }), k(100, { opacity: 0.55 })]);
    },
  },
  {
    id: 'table-lamp',
    name: 'Table lamp switching on',
    domain: 'light',
    icon: 'mdi:lamp',
    tags: ['light', 'lamp', 'switch'],
    duration: 3,
    parts: { shade: ['Shade', [0], 'bottom'], foot: ['Foot', [1]] },
    tracks: (x) => {
      x.keys('part:shade', [k(0, { opacity: 0.25, easing: 'linear' }), k(6, { opacity: 1, easing: 'linear' }), k(10, { opacity: 0.45, easing: 'linear' }), k(15, { opacity: 1 }), k(90, { opacity: 1, easing: 'ease-in' }), k(100, { opacity: 0.25 })]);
      x.keys('part:shade', [t(15, { scale: 1 }), t(22, { scale: 1.05 }), t(32, { scale: 1 })]);
    },
  },
  {
    id: 'led-strip',
    name: 'LED strip colour chase',
    domain: 'light',
    icon: 'mdi:led-strip-variant',
    tags: ['light', 'led', 'rgb', 'colour'],
    duration: 3,
    parts: { top: ['Top strip', [0]], middle: ['Middle strip', [2]], bottom: ['Bottom strip', [1]] },
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
    name: 'Light group',
    domain: 'light',
    icon: 'mdi:lightbulb-group',
    tags: ['light', 'group', 'bulbs'],
    duration: 1.8,
    parts: { left: ['Left bulb', [3], 'center'], centre: ['Centre bulb', [0], 'center'], right: ['Right bulb', [5], 'center'], bases: ['Bases', [2, 1, 4]] },
    tracks: (x) => {
      ['left', 'centre', 'right'].forEach((p, i) => x.keys(`part:${p}`, presetKeyframes('wave', { share: 60, delay: i * 20 })));
    },
  },
  // ── switch, power ──
  {
    id: 'switch-toggle',
    name: 'Switch toggle',
    domain: 'switch',
    icon: 'mdi:toggle-switch-outline',
    tags: ['switch', 'input_boolean', 'toggle'],
    duration: 2.4,
    parts: { track: ['Track', [0]], knob: ['Knob', [1], 'center'] },
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
    name: 'Power button',
    domain: 'switch',
    icon: 'mdi:power',
    tags: ['switch', 'power', 'button', 'on'],
    duration: 2.4,
    parts: { ring: ['Ring', [0], 'center'], line: ['Line', [1], 'bottom'] },
    tracks: (x) => {
      x.preset('part:ring', 'draw-loop', { share: 100 });
      x.keys('part:line', [t(0, { y: 0 }), t(8, { y: -1.2 }, { easing: 'ease-in' }), t(18, { y: 0 }, { easing: 'ease-out' }), t(24, { y: -0.3 }), t(30, { y: 0 })]);
    },
  },
  {
    id: 'plug-in',
    name: 'Plug in',
    domain: 'switch',
    icon: 'mdi:power-plug',
    tags: ['switch', 'outlet', 'plug', 'socket', 'power'],
    duration: 2.4,
    parts: { plug: ['Plug', [0], 'center'] },
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
    name: 'Fan spin',
    domain: 'fan',
    icon: 'mdi:fan',
    tags: ['fan', 'ventilation', 'spin'],
    duration: 1.2,
    parts: { blades: ['Blades', [0], [12, 12]] },
    tracks: (x) => x.keys('part:blades', SPIN()),
  },
  {
    id: 'ceiling-fan',
    name: 'Ceiling fan with light',
    domain: 'fan',
    icon: 'mdi:ceiling-fan-light',
    tags: ['fan', 'ceiling', 'light'],
    duration: 1.2,
    parts: { rod: ['Rod', [0]], blade_l: ['Left blade', [1]], blade_r: ['Right blade', [2]], hub: ['Hub', [3]], ray_m: ['Middle ray', [4]], ray_r: ['Right ray', [5]], ray_l: ['Left ray', [6]] },
    groups: { blades: ['Blades', ['blade_l', 'blade_r'], [12, 13.5]], rays: ['Light rays', ['ray_m', 'ray_r', 'ray_l'], [12, 18]] },
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
    name: 'Air purifier',
    domain: 'fan',
    icon: 'mdi:air-purifier',
    tags: ['fan', 'air', 'purifier', 'humidifier'],
    duration: 2.4,
    parts: { dial: ['Dial', [0], 'center'], body: ['Body', [1]], air_t: ['Air top', [2]], air_b: ['Air bottom', [3]] },
    tracks: (x) => {
      x.preset('part:air_t', 'draw-loop');
      x.preset('part:air_b', 'draw-loop', { delay: 15, share: 85 });
      x.preset('part:dial', 'pulse', { intensity: 0.4 });
    },
  },
  // ── climate ──
  {
    id: 'flame',
    name: 'Flame',
    domain: 'climate',
    icon: 'mdi:fire',
    tags: ['climate', 'heat', 'heating', 'thermostat', 'fire', 'water_heater'],
    duration: 1.2,
    parts: { flame: ['Flame', [0], 'bottom'] },
    tracks: (x) => x.keys('part:flame', flame(1.2)),
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    domain: 'climate',
    icon: 'mdi:fireplace',
    tags: ['climate', 'heat', 'fire', 'stove'],
    duration: 1.4,
    parts: { floor: ['Hearth', [0]], mantel: ['Mantel', [1]], outer: ['Outer flame', [2], 'bottom'], inner: ['Inner flame', [3], 'bottom'] },
    tracks: (x) => {
      x.keys('part:outer', presetKeyframes('flicker', { intensity: 0.7 }));
      x.keys('part:inner', flame(1.4, 10, 90));
    },
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    domain: 'climate',
    icon: 'mdi:snowflake',
    tags: ['climate', 'cool', 'cooling', 'frost', 'freezer', 'weather'],
    duration: 6,
    parts: { flake: ['Snowflake', [0], [12, 12]] },
    tracks: (x) => x.keys('part:flake', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]),
  },
  {
    id: 'air-conditioner',
    name: 'Air conditioner',
    domain: 'climate',
    icon: 'mdi:air-conditioner',
    tags: ['climate', 'cool', 'ac', 'fan'],
    duration: 1.5,
    parts: { fan: ['Fan', [0], 'center'], a: ['A', [1]], slash: ['Slash', [2]], c: ['C', [3]] },
    tracks: (x) => x.keys('part:fan', SPIN()),
  },
  {
    id: 'radiator',
    name: 'Radiator heat',
    domain: 'climate',
    icon: 'mdi:radiator',
    tags: ['climate', 'heat', 'heating', 'heater', 'radiator'],
    duration: 2.4,
    parts: { wave_l: ['Left wave', [0]], wave_m: ['Middle wave', [1]], wave_r: ['Right wave', [2]], body: ['Radiator', [3]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, rise(i * 18, 62, -2.5))),
  },
  {
    id: 'heat-haze',
    name: 'Heat haze',
    domain: 'sensor',
    icon: 'mdi:heat-wave',
    tags: ['sensor', 'temperature', 'heat', 'hot', 'climate'],
    duration: 2.4,
    parts: { wave_l: ['Left wave', [0]], wave_m: ['Middle wave', [1]], wave_r: ['Right wave', [2]] },
    tracks: (x) => ['wave_l', 'wave_m', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, [t(0, { y: 0.8 }, { opacity: 0.35 }), t(15 + i * 15, { y: 0.8 }, { opacity: 0.35, easing: 'ease-in-out' }), t(45 + i * 15, { y: -0.8 }, { opacity: 1, easing: 'ease-in-out' }), t(75 + i * 8, { y: 0.8 }, { opacity: 0.35 })])),
  },
  {
    id: 'thermometer',
    name: 'Thermometer',
    domain: 'sensor',
    icon: 'mdi:thermometer-lines',
    tags: ['sensor', 'temperature', 'climate', 'thermostat'],
    duration: 2.4,
    parts: {
      tube: ['Thermometer', [8], 'bottom'],
      l1: ['Mark 1', [7]],
      r1: ['Mark 2', [3]],
      l2: ['Mark 3', [6]],
      r2: ['Mark 4', [2]],
      l3: ['Mark 5', [5]],
      r3: ['Mark 6', [1]],
      l4: ['Mark 7', [4]],
      r4: ['Mark 8', [0]],
    },
    tracks: (x) => {
      x.keys('part:tube', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.04 }), t(100, { scale_y: 1 })]);
      ['l1', 'r1', 'l2', 'r2', 'l3', 'r3', 'l4', 'r4'].forEach((m, i) => x.keys(`part:${m}`, fillIn(4 + Math.floor(i / 2) * 14, 80)));
    },
  },
  {
    id: 'humidity',
    name: 'Humidity drop',
    domain: 'sensor',
    icon: 'mdi:water-percent',
    tags: ['sensor', 'humidity', 'moisture', 'humidifier'],
    duration: 2.2,
    parts: { drop: ['Drop', [0], 'bottom'] },
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
    name: 'Humidifier mist',
    domain: 'humidifier',
    icon: 'mdi:air-humidifier',
    tags: ['humidifier', 'dehumidifier', 'humidity', 'mist'],
    duration: 2,
    parts: { dial: ['Dial', [0]], body: ['Body', [1]], drop: ['Drop', [2], 'center'] },
    tracks: (x) => x.keys('part:drop', rise(0, 80, -3)),
  },
  {
    id: 'outdoor-temperature',
    name: 'Outdoor temperature',
    domain: 'sensor',
    icon: 'mdi:sun-thermometer',
    tags: ['sensor', 'temperature', 'weather', 'sun', 'outdoor'],
    duration: 8,
    parts: { ray_t: ['Ray top', [0]], ray_l: ['Ray left', [2]], ray_bl: ['Ray bottom left', [4]], ray_b: ['Ray bottom', [5]], sun: ['Sun', [3], 'center'], thermo: ['Thermometer', [1], 'bottom'] },
    groups: { rays: ['Rays', ['ray_t', 'ray_l', 'ray_bl', 'ray_b'], [10, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: -20 }), t(50, { rotate: 20 }), t(100, { rotate: -20 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
      x.keys('part:thermo', [t(0, { scale_y: 1 }), t(50, { scale_y: 1.05 }), t(100, { scale_y: 1 })]);
    },
  },
  // ── cover ──
  {
    id: 'garage-door',
    name: 'Garage door',
    domain: 'cover',
    icon: 'mdi:garage-variant',
    tags: ['cover', 'garage', 'door', 'binary_sensor'],
    duration: 4,
    parts: { house: ['Garage', [0]], slat_t: ['Top slat', [1]], slat_m: ['Middle slat', [3]], slat_b: ['Bottom slat', [2]] },
    tracks: (x) => {
      x.keys('part:slat_t', rollUp(-2.5, 0));
      x.keys('part:slat_m', rollUp(-5.5, 1));
      x.keys('part:slat_b', rollUp(-8.5, 2));
    },
  },
  {
    id: 'roller-shutter',
    name: 'Roller shutter',
    domain: 'cover',
    icon: 'mdi:window-shutter',
    tags: ['cover', 'shutter', 'blind', 'window'],
    duration: 4,
    parts: { frame: ['Frame', [0]], s1: ['Slat 1', [1]], s2: ['Slat 2', [2]], s3: ['Slat 3', [3]], s4: ['Slat 4', [4]] },
    tracks: (x) => ['s1', 's2', 's3', 's4'].forEach((s, i) => x.keys(`part:${s}`, rollUp(-(2 + i * 3), i))),
  },
  {
    id: 'curtains',
    name: 'Curtains',
    domain: 'cover',
    icon: 'mdi:curtains',
    tags: ['cover', 'curtain', 'window'],
    duration: 4,
    parts: { rod: ['Rod', [0]], left: ['Left curtain', [1], 'top-left'], right: ['Right curtain', [2], 'top-right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.45));
      x.keys('part:right', fold(0.45));
    },
  },
  {
    id: 'gate',
    name: 'Gate',
    domain: 'cover',
    icon: 'mdi:gate-open',
    tags: ['cover', 'gate', 'binary_sensor'],
    duration: 4,
    parts: { left: ['Left leaf', [0], 'left'], right: ['Right leaf', [1], 'right'] },
    tracks: (x) => {
      x.keys('part:left', fold(0.4, { skew_y: -10 }));
      x.keys('part:right', fold(0.4, { skew_y: 10 }));
    },
  },
  {
    id: 'door',
    name: 'Door opening',
    domain: 'binary_sensor',
    icon: 'mdi:door',
    tags: ['binary_sensor', 'door', 'opening', 'cover'],
    duration: 3,
    parts: { leaf: ['Door', [0]], knob: ['Knob', [1]] },
    groups: { door: ['Door leaf', ['leaf', 'knob'], 'left'] },
    tracks: (x) => x.keys('group:door', fold(0.5, { skew_y: -8 })),
  },
  {
    id: 'fridge',
    name: 'Fridge door',
    domain: 'binary_sensor',
    icon: 'mdi:fridge',
    tags: ['binary_sensor', 'fridge', 'freezer', 'door', 'appliance'],
    duration: 3,
    parts: { top: ['Freezer door', [0], 'left'], bottom: ['Fridge door', [1]] },
    tracks: (x) => x.keys('part:top', fold(0.55, { skew_y: -8 })),
  },
  // ── lock ──
  {
    id: 'lock',
    name: 'Lock',
    domain: 'lock',
    icon: 'mdi:lock',
    tags: ['lock', 'door', 'security'],
    duration: 2.4,
    own: [LOCK_BODY, LOCK_SHACKLE],
    parts: { body: ['Body', [0], 'bottom'], shackle: ['Shackle', [1]] },
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
    name: 'Speaker',
    domain: 'media_player',
    icon: 'mdi:speaker-wireless',
    tags: ['media_player', 'speaker', 'music', 'sound'],
    duration: 1.2,
    parts: { wave_o: ['Outer wave', [0]], wave_i: ['Inner wave', [1]], body: ['Speaker', [2]], cone: ['Cone', [3], 'center'] },
    tracks: (x) => {
      x.keys('part:cone', [t(0, { scale: 1 }), t(10, { scale: 1.22 }, { easing: 'ease-out' }), t(28, { scale: 1 }), t(50, { scale: 1.14 }, { easing: 'ease-out' }), t(68, { scale: 1 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'volume',
    name: 'Volume',
    domain: 'media_player',
    icon: 'mdi:volume-high',
    tags: ['media_player', 'volume', 'sound', 'speaker'],
    duration: 1.4,
    parts: { wave_o: ['Outer wave', [0]], wave_i: ['Inner wave', [1]], speaker: ['Speaker', [2], 'right'] },
    tracks: (x) => {
      x.preset('part:speaker', 'pulse', { intensity: 0.4 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 22 }));
    },
  },
  {
    id: 'tv',
    name: 'TV on',
    domain: 'media_player',
    icon: 'mdi:television-classic',
    tags: ['media_player', 'tv', 'television'],
    duration: 2.4,
    parts: { tv: ['Television', [0], 'bottom'] },
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
    name: 'Music note dance',
    domain: 'media_player',
    icon: 'mdi:music-note',
    tags: ['media_player', 'music', 'playing'],
    duration: 1.2,
    parts: { note: ['Note', [0], 'bottom'] },
    tracks: (x) => x.keys('part:note', [t(0, { rotate: -10, y: 0 }), t(25, { rotate: 0, y: -1.5 }), t(50, { rotate: 10, y: 0 }), t(75, { rotate: 0, y: -1.5 }), t(100, { rotate: -10, y: 0 })]),
  },
  {
    id: 'play',
    name: 'Play',
    domain: 'media_player',
    icon: 'mdi:play-circle',
    tags: ['media_player', 'play', 'playing'],
    duration: 1.6,
    parts: { button: ['Button', [0], 'center'] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(15, { scale: 0.88 }, { easing: 'ease-out' }), t(35, { scale: 1.08 }), t(55, { scale: 1 })]),
  },
  {
    id: 'headphones',
    name: 'Headphones',
    domain: 'media_player',
    icon: 'mdi:headphones',
    tags: ['media_player', 'music', 'headphones'],
    duration: 1,
    parts: { phones: ['Headphones', [0], 'bottom'] },
    tracks: (x) => x.keys('part:phones', [t(0, { y: 0, rotate: -4 }), t(25, { y: -1, rotate: 0 }), t(50, { y: 0, rotate: 4 }), t(75, { y: -1, rotate: 0 }), t(100, { y: 0, rotate: -4 })]),
  },
  // ── vacuum, mower ──
  {
    id: 'robot-vacuum',
    name: 'Robot vacuum',
    domain: 'vacuum',
    icon: 'mdi:robot-vacuum',
    tags: ['vacuum', 'cleaning', 'robot'],
    duration: 4,
    parts: { sensor: ['Sensor', [0], 'center'], body: ['Body', [1]], brush: ['Brush', [2], 'center'] },
    groups: { robot: ['Robot', ['sensor', 'body', 'brush'], 'center'] },
    tracks: (x) => {
      x.keys('group:robot', [t(0, { x: -2, rotate: 0 }), t(40, { x: 2, rotate: 0 }), t(50, { x: 2, rotate: 12 }), t(90, { x: -2, rotate: 12 }), t(100, { x: -2, rotate: 0 })]);
      x.keys('part:brush', SPIN(2));
      x.preset('part:sensor', 'blink', { share: 40, delay: 50 });
    },
  },
  {
    id: 'robot-mower',
    name: 'Robot mower',
    domain: 'lawn_mower',
    icon: 'mdi:robot-mower',
    tags: ['lawn_mower', 'mower', 'garden', 'robot'],
    duration: 6,
    parts: { mower: ['Mower', [0], 'bottom'] },
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
    name: 'Washing machine',
    domain: 'sensor',
    icon: 'mdi:washing-machine',
    tags: ['sensor', 'washer', 'washing', 'laundry', 'appliance', 'switch'],
    duration: 1.5,
    parts: { drum: ['Drum', [0], 'center'], body: ['Machine', [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:drum', SPIN());
      x.keys('part:body', presetKeyframes('shake', { intensity: 0.15, share: 100 }));
    },
  },
  {
    id: 'dryer',
    name: 'Tumble dryer',
    domain: 'sensor',
    icon: 'mdi:tumble-dryer',
    tags: ['sensor', 'dryer', 'laundry', 'appliance', 'switch'],
    duration: 2,
    parts: { body: ['Dryer', [0]], wave_l: ['Left wave', [1]], wave_r: ['Right wave', [2]] },
    groups: { drum: ['Drum', ['wave_l', 'wave_r'], [12, 14]] },
    tracks: (x) => x.keys('group:drum', SPIN()),
  },
  {
    id: 'dishwasher',
    name: 'Dishwasher',
    domain: 'sensor',
    icon: 'mdi:dishwasher',
    tags: ['sensor', 'dishwasher', 'appliance', 'switch'],
    duration: 1.6,
    parts: { body: ['Dishwasher', [0]], drop: ['Drop', [1], 'bottom'] },
    tracks: (x) => x.preset('part:drop', 'bounce', { intensity: 0.5 }),
  },
  {
    id: 'coffee-maker',
    name: 'Coffee maker',
    domain: 'switch',
    icon: 'mdi:coffee-maker',
    tags: ['switch', 'coffee', 'kitchen', 'appliance'],
    duration: 1.2,
    parts: { machine: ['Machine', [0]], drop: ['Drop', [1], 'center'] },
    tracks: (x) => x.keys('part:drop', fall(0, 70, 4, 0)),
  },
  {
    id: 'kettle',
    name: 'Kettle boiling',
    domain: 'switch',
    icon: 'mdi:kettle-steam',
    tags: ['switch', 'kettle', 'kitchen', 'steam', 'appliance'],
    duration: 2,
    parts: { kettle: ['Kettle', [0], 'bottom'], steam_r: ['Right steam', [1]], steam_l: ['Left steam', [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(30, 60));
      x.keys('part:kettle', presetKeyframes('shake', { intensity: 0.12 }));
    },
  },
  {
    id: 'cooking-pot',
    name: 'Cooking pot',
    domain: 'sensor',
    icon: 'mdi:pot-steam',
    tags: ['sensor', 'cooking', 'kitchen', 'steam'],
    duration: 2.2,
    parts: { pot: ['Pot', [0]], steam_l: ['Left steam', [1]], steam_r: ['Right steam', [2]] },
    tracks: (x) => {
      x.keys('part:steam_l', rise(0, 60));
      x.keys('part:steam_r', rise(32, 60));
    },
  },
  {
    id: 'oven',
    name: 'Oven heating',
    domain: 'switch',
    icon: 'mdi:toaster-oven',
    tags: ['switch', 'oven', 'kitchen', 'appliance', 'heat'],
    duration: 2,
    parts: { body: ['Oven', [0]], glow: ['Heating element', [1], 'center'] },
    tracks: (x) => x.keys('part:glow', [k(0, { color: '#ff6d00', opacity: 0.6 }), k(50, { color: '#ffab40', opacity: 1 }), k(100, { color: '#ff6d00', opacity: 0.6 })]),
  },
  {
    id: 'printer',
    name: 'Printer',
    domain: 'sensor',
    icon: 'mdi:printer',
    tags: ['sensor', 'printer', 'printing'],
    duration: 2,
    parts: { paper: ['Paper', [0], 'center'], body: ['Printer', [1]] },
    tracks: (x) => x.keys('part:paper', [t(0, { y: -1.5 }, { opacity: 0 }), t(20, { y: -1.5 }, { opacity: 1, easing: 'linear' }), t(75, { y: 1.2 }, { opacity: 1 }), t(88, { y: 1.6 }, { opacity: 0 })]),
  },
  // ── battery, energy ──
  {
    id: 'battery-charging',
    name: 'Battery charging',
    domain: 'sensor',
    icon: 'mdi:battery-charging-high',
    tags: ['sensor', 'battery', 'charging', 'binary_sensor', 'ev'],
    duration: 2.5,
    parts: { shell: ['Battery', [0]], bar_1: ['Bar 1', [1]], bar_2: ['Bar 2', [3]], bar_3: ['Bar 3', [2]], bolt: ['Bolt', [4], 'center'] },
    tracks: (x) => {
      ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20)));
      x.keys('part:bolt', [t(0, { scale: 1 }, { color: '#ffc107' }), t(50, { scale: 1.12 }, { color: '#ffe082' }), t(100, { scale: 1 }, { color: '#ffc107' })]);
    },
  },
  {
    id: 'battery-level',
    name: 'Battery level',
    domain: 'sensor',
    icon: 'mdi:battery-high',
    tags: ['sensor', 'battery'],
    duration: 2.5,
    parts: { shell: ['Battery', [0]], bar_1: ['Bar 1', [1]], bar_2: ['Bar 2', [3]], bar_3: ['Bar 3', [2]] },
    tracks: (x) => ['bar_1', 'bar_2', 'bar_3'].forEach((b, i) => x.keys(`part:${b}`, fillIn(10 + i * 20))),
  },
  {
    id: 'energy-bolt',
    name: 'Energy',
    domain: 'sensor',
    icon: 'mdi:lightning-bolt',
    tags: ['sensor', 'energy', 'power', 'electricity'],
    duration: 2,
    parts: { bolt: ['Bolt', [0], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:bolt', [t(0, { scale: 1 }), t(8, { scale: 1.12 }), t(30, { scale: 1 })]);
    },
  },
  {
    id: 'solar-power',
    name: 'Solar power',
    domain: 'sensor',
    icon: 'mdi:solar-power',
    tags: ['sensor', 'solar', 'energy', 'sun', 'pv'],
    duration: 2.4,
    parts: { sun: ['Sun', [3], 'top-left'], ray_1: ['Ray 1', [0]], ray_2: ['Ray 2', [1]], ray_3: ['Ray 3', [2]], panel: ['Panel', [4], 'center'] },
    tracks: (x) => {
      x.preset('part:sun', 'pulse', { intensity: 0.5 });
      ['ray_1', 'ray_2', 'ray_3'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 55, delay: i * 15 })));
      x.keys('part:panel', [k(0, { opacity: 0.7 }), k(55, { opacity: 0.7, easing: 'ease-out' }), k(70, { opacity: 1, color: '#ffc107' }), k(100, { opacity: 0.7 })]);
    },
  },
  {
    id: 'electric-car',
    name: 'Electric car charging',
    domain: 'sensor',
    icon: 'mdi:car-electric',
    tags: ['sensor', 'ev', 'car', 'charging', 'device_tracker'],
    duration: 2,
    parts: { car: ['Car', [0], 'bottom'], plug: ['Charge', [1], 'center'] },
    tracks: (x) => {
      x.keys('part:plug', [t(0, { x: -1 }, { opacity: 0.3 }), t(50, { x: 1 }, { opacity: 1 }), t(100, { x: -1 }, { opacity: 0.3 })]);
      x.preset('part:car', 'pulse', { intensity: 0.15 });
    },
  },
  {
    id: 'energy-meter',
    name: 'Energy meter',
    domain: 'sensor',
    icon: 'mdi:meter-electric-outline',
    tags: ['sensor', 'energy', 'meter', 'power'],
    duration: 1.6,
    parts: { meter: ['Meter', [0]], display: ['Display', [1]], bolt: ['Bolt', [2], 'center'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(0, '#ffc107'));
      x.keys('part:display', [k(0, { opacity: 1 }), k(50, { opacity: 0.4 }), k(100, { opacity: 1 })]);
    },
  },
  // ── water ──
  {
    id: 'water-drop',
    name: 'Water drop',
    domain: 'binary_sensor',
    icon: 'mdi:water',
    tags: ['binary_sensor', 'water', 'leak', 'moisture', 'sensor'],
    duration: 1.8,
    parts: { drop: ['Drop', [0], 'bottom'] },
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
    name: 'Water pump',
    domain: 'switch',
    icon: 'mdi:water-pump',
    tags: ['switch', 'pump', 'water', 'valve'],
    duration: 1.2,
    parts: { drop: ['Drop', [0], 'center'], pump: ['Pump', [1]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 2.5, -1.5)),
  },
  {
    id: 'faucet',
    name: 'Faucet',
    domain: 'valve',
    icon: 'mdi:faucet',
    tags: ['valve', 'water', 'tap', 'switch'],
    duration: 1.2,
    parts: { drop: ['Drop', [0], 'center'], tap: ['Tap', [1]], handle: ['Handle', [2]] },
    tracks: (x) => x.keys('part:drop', fall(0, 80, 4, -1.5)),
  },
  {
    id: 'shower',
    name: 'Shower',
    domain: 'switch',
    icon: 'mdi:shower-head',
    tags: ['switch', 'shower', 'water', 'bathroom'],
    duration: 1,
    parts: {
      head: ['Head', [13]],
      bar: ['Bar', [12]],
      d1: ['Drop 1', [9]],
      d2: ['Drop 2', [10]],
      d3: ['Drop 3', [11]],
      d4: ['Drop 4', [5]],
      d5: ['Drop 5', [6]],
      d6: ['Drop 6', [7]],
      d7: ['Drop 7', [8]],
      d8: ['Drop 8', [4]],
      d9: ['Drop 9', [3]],
      d10: ['Drop 10', [2]],
      d11: ['Drop 11', [1]],
      d12: ['Drop 12', [0]],
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
    name: 'Sprinkler',
    domain: 'valve',
    icon: 'mdi:sprinkler-variant',
    tags: ['valve', 'switch', 'irrigation', 'garden', 'water'],
    duration: 1.4,
    parts: {
      stand: ['Stand', [0]],
      head: ['Head', [13], 'bottom'],
      l1: ['Left drop 1', [1]],
      l2: ['Left drop 2', [2]],
      l3: ['Left drop 3', [3]],
      l4: ['Left drop 4', [5]],
      l5: ['Left drop 5', [6]],
      l6: ['Left drop 6', [4]],
      r1: ['Right drop 1', [11]],
      r2: ['Right drop 2', [12]],
      r3: ['Right drop 3', [7]],
      r4: ['Right drop 4', [9]],
      r5: ['Right drop 5', [8]],
      r6: ['Right drop 6', [10]],
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
    name: 'Valve',
    domain: 'valve',
    icon: 'mdi:valve',
    tags: ['valve', 'water', 'gas', 'pipe'],
    duration: 3,
    parts: { pipe_l: ['Left pipe', [0]], pipe_r: ['Right pipe', [1]], handle: ['Handle', [2], [12, 12]] },
    tracks: (x) =>
      x.keys('part:handle', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: 90 }), t(60, { rotate: 90 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'pool',
    name: 'Pool',
    domain: 'switch',
    icon: 'mdi:pool',
    tags: ['switch', 'pool', 'water', 'pump', 'sensor'],
    duration: 2.5,
    parts: { ladder: ['Ladder', [0]], water: ['Water', [1], 'center'] },
    tracks: (x) => x.keys('part:water', [t(0, { x: 0, y: 0 }), t(25, { x: -1, y: -0.3 }), t(50, { x: 0, y: 0 }), t(75, { x: 1, y: -0.3 }), t(100, { x: 0, y: 0 })]),
  },
  {
    id: 'watering-can',
    name: 'Watering',
    domain: 'plant',
    icon: 'mdi:watering-can',
    tags: ['plant', 'garden', 'irrigation', 'water', 'valve'],
    duration: 3,
    parts: { can: ['Watering can', [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:can', [t(0, { rotate: 0 }), t(15, { rotate: 0 }, { easing: 'ease-in-out' }), t(35, { rotate: 18 }), t(45, { rotate: 15 }), t(55, { rotate: 18 }), t(65, { rotate: 15 }, { easing: 'ease-in-out' }), t(85, { rotate: 0 })]),
  },
  // ── security ──
  {
    id: 'doorbell-ring',
    name: 'Doorbell ring',
    domain: 'event',
    icon: 'mdi:bell-ring',
    tags: ['event', 'binary_sensor', 'doorbell', 'bell', 'notification', 'ring'],
    duration: 1.8,
    parts: { body: ['Bell', [0]], clapper: ['Clapper', [1], [12, 18]], wave_r: ['Right wave', [2]], wave_l: ['Left wave', [3]] },
    groups: { bell: ['Bell and clapper', ['body', 'clapper'], [12, 2]], waves: ['Sound waves', ['wave_r', 'wave_l']] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70, intensity: 1 });
      x.preset('part:clapper', 'ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 });
      x.preset('group:waves', 'draw-loop', { share: 80, delay: 5 });
    },
  },
  {
    id: 'notification',
    name: 'Notification',
    domain: 'event',
    icon: 'mdi:bell-alert',
    tags: ['event', 'notification', 'alert', 'bell', 'update'],
    duration: 1.8,
    parts: { mark: ['Exclamation', [0]], dot: ['Dot', [1]], body: ['Bell', [2]], clapper: ['Clapper', [3], [12, 18]] },
    groups: { bell: ['Bell and clapper', ['body', 'clapper'], [12, 2]], alert: ['Exclamation mark', ['mark', 'dot'], 'center'] },
    tracks: (x) => {
      x.preset('group:bell', 'ring', { share: 70 });
      x.preset('part:clapper', 'ring', { share: 70, delay: 3, intensity: 1.3, direction: -1 });
      x.preset('group:alert', 'blink', { share: 60, delay: 30 });
    },
  },
  {
    id: 'alarm-light',
    name: 'Alarm light',
    domain: 'siren',
    icon: 'mdi:alarm-light',
    tags: ['siren', 'alarm_control_panel', 'alarm', 'security', 'triggered'],
    duration: 1,
    parts: { light: ['Light', [6], 'bottom'], base: ['Base', [5]], ray_l: ['Ray left', [3]], ray_tl: ['Ray top left', [0]], ray_t: ['Ray top', [1]], ray_tr: ['Ray top right', [2]], ray_r: ['Ray right', [4]] },
    tracks: (x) => {
      x.keys('part:light', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.05 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_tr', 'ray_r'].forEach((r, i) =>
        x.keys(`part:${r}`, i % 2 ? [k(0, { opacity: 0.15, easing: 'steps(1, end)' }), k(50, { opacity: 1, easing: 'steps(1, end)' }), k(100, { opacity: 0.15 })] : [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.15, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]),
      );
    },
  },
  {
    id: 'smoke-alarm',
    name: 'Smoke alarm',
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector-alert',
    tags: ['binary_sensor', 'smoke', 'co', 'carbon_monoxide', 'alarm', 'safety'],
    duration: 1,
    parts: { body: ['Detector', [0]], centre: ['Centre', [1], 'center'], mark: ['Exclamation', [2]], dot: ['Dot', [3]] },
    groups: { alert: ['Exclamation mark', ['mark', 'dot']] },
    tracks: (x) => {
      x.keys('part:centre', [t(0, { scale: 1 }, { color: '#f44336' }), t(50, { scale: 1.15 }, { color: '#ff8a80' }), t(100, { scale: 1 }, { color: '#f44336' })]);
      x.keys('group:alert', [k(0, { opacity: 1, easing: 'steps(1, end)' }), k(50, { opacity: 0.1, easing: 'steps(1, end)' }), k(100, { opacity: 1 })]);
    },
  },
  {
    id: 'smoke-detector',
    name: 'Smoke detector standby',
    domain: 'binary_sensor',
    icon: 'mdi:smoke-detector',
    tags: ['binary_sensor', 'smoke', 'safety', 'ok'],
    duration: 3,
    parts: { body: ['Detector', [0]], centre: ['Centre', [1], 'center'] },
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
    name: 'Alarm clock',
    domain: 'sensor',
    icon: 'mdi:alarm',
    tags: ['sensor', 'alarm', 'clock', 'timer', 'time', 'wake'],
    duration: 1.4,
    parts: { clock: ['Clock', [0]], hands: ['Hands', [1]], bell_l: ['Left bell', [2], 'center'], bell_r: ['Right bell', [3], 'center'] },
    groups: { alarm: ['Alarm clock', ['clock', 'hands', 'bell_l', 'bell_r'], [12, 22]] },
    tracks: (x) => {
      x.preset('group:alarm', 'ring', { share: 70, intensity: 0.5 });
      x.keys('part:bell_l', [t(0, { y: 0 }), t(10, { y: -0.6 }), t(20, { y: 0 }), t(30, { y: -0.6 }), t(40, { y: 0 }), t(50, { y: -0.6 }), t(60, { y: 0 })]);
      x.keys('part:bell_r', [t(0, { y: 0 }), t(5, { y: 0 }), t(15, { y: -0.6 }), t(25, { y: 0 }), t(35, { y: -0.6 }), t(45, { y: 0 }), t(55, { y: -0.6 }), t(65, { y: 0 })]);
    },
  },
  {
    id: 'alert',
    name: 'Alert',
    domain: 'binary_sensor',
    icon: 'mdi:alert',
    tags: ['binary_sensor', 'alert', 'problem', 'warning', 'update'],
    duration: 1.2,
    parts: { sign: ['Sign', [0], 'bottom'] },
    tracks: (x) => x.keys('part:sign', [t(0, { scale: 1 }, { opacity: 1 }), t(15, { scale: 1.12 }, { opacity: 1 }), t(30, { scale: 1 }, { opacity: 0.55 }), t(45, { scale: 1.08 }, { opacity: 1 }), t(60, { scale: 1 }, { opacity: 1 })]),
  },
  {
    id: 'security-armed',
    name: 'Security armed',
    domain: 'alarm_control_panel',
    icon: 'mdi:shield-home',
    tags: ['alarm_control_panel', 'security', 'armed', 'shield'],
    duration: 2.4,
    parts: { shield: ['Shield', [0], 'center'] },
    tracks: (x) => x.keys('part:shield', [t(0, { scale: 1 }, { opacity: 0.85 }), t(50, { scale: 1.07 }, { opacity: 1 }), t(100, { scale: 1 }, { opacity: 0.85 })]),
  },
  {
    id: 'cctv',
    name: 'Security camera',
    domain: 'camera',
    icon: 'mdi:cctv',
    tags: ['camera', 'cctv', 'security', 'surveillance'],
    duration: 5,
    parts: { mount: ['Mount', [0]], camera: ['Camera', [1], [9, 15]] },
    tracks: (x) => x.keys('part:camera', [t(0, { rotate: 0 }), t(10, { rotate: 0 }, { easing: 'ease-in-out' }), t(40, { rotate: -14 }), t(55, { rotate: -14 }, { easing: 'ease-in-out' }), t(85, { rotate: 6 }), t(100, { rotate: 0 })]),
  },
  {
    id: 'camera-snapshot',
    name: 'Camera snapshot',
    domain: 'camera',
    icon: 'mdi:camera',
    tags: ['camera', 'snapshot', 'photo'],
    duration: 2,
    parts: { body: ['Camera', [0], 'center'], lens: ['Lens', [1], 'center'] },
    tracks: (x) => {
      x.keys('part:lens', [t(0, { scale: 1 }), t(10, { scale: 0.6 }, { easing: 'ease-out' }), t(25, { scale: 1.1 }), t(40, { scale: 1 })]);
      x.keys('part:body', [t(0, { scale: 1 }), t(10, { scale: 0.96 }), t(25, { scale: 1 })]);
    },
  },
  {
    id: 'motion',
    name: 'Motion detected',
    domain: 'binary_sensor',
    icon: 'mdi:motion-sensor',
    tags: ['binary_sensor', 'motion', 'occupancy', 'presence', 'movement'],
    duration: 1.5,
    parts: { head: ['Head', [0]], wave_o: ['Outer wave', [1]], wave_m: ['Middle wave', [2]], wave_i: ['Inner wave', [3]], body: ['Person', [4]] },
    groups: { person: ['Person', ['head', 'body'], 'bottom'] },
    tracks: (x) => {
      x.keys('group:person', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.6, rotate: 2 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.6, rotate: 2 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:wave_i', presetKeyframes('wave', { share: 55 }));
      x.keys('part:wave_m', presetKeyframes('wave', { share: 55, delay: 15 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 55, delay: 30 }));
    },
  },
  {
    id: 'walking',
    name: 'Walking',
    domain: 'person',
    icon: 'mdi:walk',
    tags: ['person', 'device_tracker', 'presence', 'motion', 'away'],
    duration: 1,
    parts: { body: ['Body', [0]], head: ['Head', [1]] },
    groups: { walker: ['Walker', ['body', 'head'], 'bottom'] },
    tracks: (x) => x.keys('group:walker', [t(0, { y: 0, rotate: -2 }), t(25, { y: -0.7, rotate: 0 }), t(50, { y: 0, rotate: 2 }), t(75, { y: -0.7, rotate: 0 }), t(100, { y: 0, rotate: -2 })]),
  },
  {
    id: 'person-home',
    name: 'Person home',
    domain: 'person',
    icon: 'mdi:account',
    tags: ['person', 'device_tracker', 'presence', 'home', 'user'],
    duration: 2.4,
    parts: { head: ['Head', [0], 'bottom'], body: ['Body', [1], 'bottom'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { y: 0, rotate: 0 }), t(30, { y: -0.6, rotate: -6 }), t(60, { y: 0, rotate: 4 }), t(100, { y: 0, rotate: 0 })]);
      x.keys('part:body', [t(0, { scale_y: 1 }), t(30, { scale_y: 1.04 }), t(60, { scale_y: 1 })]);
    },
  },
  {
    id: 'doorbell-press',
    name: 'Doorbell press',
    domain: 'button',
    icon: 'mdi:doorbell',
    tags: ['button', 'doorbell', 'event', 'press'],
    duration: 2,
    parts: { button: ['Button', [0], 'center'], panel: ['Panel', [1]] },
    tracks: (x) => x.keys('part:button', [t(0, { scale: 1 }), t(8, { scale: 0.7 }, { easing: 'ease-out', color: '#03a9f4' }), t(20, { scale: 1.08 }), t(32, { scale: 1 })]),
  },
  // ── weather ──
  {
    id: 'sunny',
    name: 'Sunny',
    domain: 'weather',
    icon: 'mdi:weather-sunny',
    tags: ['weather', 'sun', 'sunny', 'clear', 'day'],
    duration: 6,
    parts: { sun: ['Sun', [0], 'center'], ray_t: ['Ray top', [1]], ray_tl: ['Ray top left', [2]], ray_bl: ['Ray bottom left', [3]], ray_tr: ['Ray top right', [4]], ray_br: ['Ray bottom right', [5]], ray_b: ['Ray bottom', [6]] },
    groups: { rays: ['Rays', ['ray_t', 'ray_tl', 'ray_bl', 'ray_tr', 'ray_br', 'ray_b'], [12, 12]] },
    tracks: (x) => {
      x.keys('group:rays', [t(0, { rotate: 0, scale: 1 }, { easing: 'linear' }), t(50, { rotate: 180, scale: 1.08 }, { easing: 'linear' }), t(100, { rotate: 360, scale: 1 })]);
      x.preset('part:sun', 'pulse', { intensity: 0.4 });
    },
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    domain: 'weather',
    icon: 'mdi:weather-cloudy',
    tags: ['weather', 'cloud', 'cloudy', 'overcast'],
    duration: 4,
    parts: { cloud: ['Cloud', [0]] },
    tracks: (x) => x.keys('part:cloud', [t(0, { x: 0 }), t(25, { x: 1.2 }), t(75, { x: -1.2 }), t(100, { x: 0 })]),
  },
  {
    id: 'pouring',
    name: 'Pouring rain',
    domain: 'weather',
    icon: 'mdi:weather-pouring',
    tags: ['weather', 'rain', 'rainy', 'pouring', 'storm'],
    duration: 1,
    parts: { drop_l: ['Left drop', [0]], drop_m: ['Middle drop', [1]], drop_r: ['Right drop', [2]], cloud: ['Cloud', [3]] },
    tracks: (x) => {
      x.keys('part:drop_l', fall(0, 70, 2.5, -1.5));
      x.keys('part:drop_m', fall(30, 70, 2.5, -1.5));
      x.keys('part:drop_r', fall(15, 70, 2.5, -1.5));
    },
  },
  {
    id: 'rainy',
    name: 'Rain',
    domain: 'weather',
    icon: 'mdi:weather-rainy',
    tags: ['weather', 'rain', 'rainy', 'drizzle'],
    duration: 1.6,
    parts: { cloud: ['Cloud', [0]], drop: ['Drop', [1]] },
    tracks: (x) => {
      x.keys('part:drop', fall(0, 80, 2, -2));
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.5 }), t(100, { x: 0 })]);
    },
  },
  {
    id: 'snowy',
    name: 'Snow',
    domain: 'weather',
    icon: 'mdi:weather-snowy',
    tags: ['weather', 'snow', 'snowy', 'winter'],
    duration: 2.6,
    parts: { cloud: ['Cloud', [0]], flake: ['Snowflake', [1], 'center'] },
    tracks: (x) => x.keys('part:flake', fall(0, 90, 1.5, -2.5).map((f, i) => ({ ...f, transform: { ...f.transform, rotate: [0, 0, 30, 80, 90, 90][i] ?? 90 } }))),
  },
  {
    id: 'heavy-snow',
    name: 'Heavy snow',
    domain: 'weather',
    icon: 'mdi:weather-snowy-heavy',
    tags: ['weather', 'snow', 'snowy', 'blizzard', 'winter'],
    duration: 2.4,
    parts: { flake_l: ['Left flake', [0], 'center'], cloud: ['Cloud', [1]], flake_r: ['Right flake', [2], 'center'] },
    tracks: (x) => {
      x.keys('part:flake_l', [t(0, { y: -1.5, rotate: 0 }, { opacity: 0 }), t(15, { y: -1, rotate: 15 }, { opacity: 1 }), t(80, { y: 1.5, rotate: 90 }, { opacity: 1 }), t(100, { y: 2, rotate: 110 }, { opacity: 0 })]);
      x.keys('part:flake_r', [t(0, { y: -0.5, rotate: 40 }, { opacity: 1 }), t(30, { y: 1, rotate: 80 }, { opacity: 0 }), t(45, { y: -2, rotate: 0 }, { opacity: 0 }), t(60, { y: -1.5, rotate: 10 }, { opacity: 1 }), t(100, { y: -0.5, rotate: 40 }, { opacity: 1 })]);
    },
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    domain: 'weather',
    icon: 'mdi:weather-lightning',
    tags: ['weather', 'lightning', 'storm', 'thunder'],
    duration: 2.2,
    parts: { cloud: ['Cloud', [0]], bolt: ['Bolt', [1], 'top'] },
    tracks: (x) => {
      x.keys('part:bolt', flash(10, '#ffd600'));
      x.keys('part:cloud', [t(0, { x: 0 }), t(10, { x: 0 }), t(13, { x: 0.3 }), t(16, { x: -0.3 }), t(19, { x: 0.2 }), t(22, { x: 0 })]);
    },
  },
  {
    id: 'storm-rain',
    name: 'Storm with rain',
    domain: 'weather',
    icon: 'mdi:weather-lightning-rainy',
    tags: ['weather', 'lightning', 'rain', 'storm'],
    duration: 2,
    parts: { cloud: ['Cloud', [0]], bolt: ['Bolt', [1], 'top'], drop: ['Drop', [2]] },
    tracks: (x) => {
      x.keys('part:bolt', flash(5, '#ffd600'));
      x.keys('part:drop', fall(20, 60, 2, -1.5));
    },
  },
  {
    id: 'fog',
    name: 'Fog',
    domain: 'weather',
    icon: 'mdi:weather-fog',
    tags: ['weather', 'fog', 'mist', 'haze'],
    duration: 4,
    parts: { line_1: ['Fog line 1', [0]], line_2: ['Fog line 2', [1]], cloud: ['Cloud', [2]], line_3: ['Fog line 3', [3]], line_4: ['Fog line 4', [4]] },
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
    name: 'Windy',
    domain: 'weather',
    icon: 'mdi:weather-windy',
    tags: ['weather', 'wind', 'windy', 'breeze'],
    duration: 3,
    parts: { gust_t: ['Top gust', [0]], gust_m: ['Middle gust', [1]], gust_b: ['Bottom gust', [2]] },
    tracks: (x) => {
      x.preset('part:gust_m', 'draw-loop', { share: 80 });
      x.preset('part:gust_t', 'draw-loop', { share: 80, delay: 10 });
      x.preset('part:gust_b', 'draw-loop', { share: 80, delay: 20 });
    },
  },
  {
    id: 'clear-night',
    name: 'Clear night',
    domain: 'weather',
    icon: 'mdi:weather-night',
    tags: ['weather', 'night', 'moon', 'clear', 'stars'],
    duration: 3,
    parts: { star_l: ['Big star', [0], 'center'], star_r: ['Small star', [1], 'center'], moon: ['Moon', [2], 'center'] },
    tracks: (x) => {
      x.keys('part:moon', [t(0, { rotate: -4 }), t(50, { rotate: 4 }), t(100, { rotate: -4 })]);
      x.keys('part:star_l', [t(0, { scale: 1 }, { opacity: 1 }), t(20, { scale: 0.6 }, { opacity: 0.4 }), t(40, { scale: 1 }, { opacity: 1 })]);
      x.keys('part:star_r', [t(0, { scale: 1 }, { opacity: 1 }), t(50, { scale: 1 }, { opacity: 1 }), t(70, { scale: 0.5 }, { opacity: 0.3 }), t(90, { scale: 1 }, { opacity: 1 })]);
    },
  },
  {
    id: 'partly-cloudy',
    name: 'Partly cloudy',
    domain: 'weather',
    icon: 'mdi:weather-partly-cloudy',
    tags: ['weather', 'partlycloudy', 'cloud', 'sun'],
    duration: 4,
    parts: { cloud: ['Sun and cloud', [0]], ray_t: ['Ray top', [1]], ray_tl: ['Ray top left', [2]], ray_r: ['Ray right', [3]], ray_l: ['Ray left', [4]] },
    tracks: (x) => {
      x.keys('part:cloud', [t(0, { x: 0 }), t(50, { x: 0.8 }), t(100, { x: 0 })]);
      ['ray_l', 'ray_tl', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, presetKeyframes('wave', { share: 60, delay: i * 12 })));
    },
  },
  {
    id: 'hail',
    name: 'Hail',
    domain: 'weather',
    icon: 'mdi:weather-hail',
    tags: ['weather', 'hail', 'storm'],
    duration: 1.4,
    parts: { cloud: ['Cloud', [0]], ball_1: ['Hailstone 1', [3], 'center'], ball_2: ['Hailstone 2', [2], 'center'], ball_3: ['Hailstone 3', [1], 'center'] },
    tracks: (x) => {
      x.keys('part:ball_1', fall(0, 60, 2, -1.5));
      x.keys('part:ball_2', fall(25, 60, 2, -1.5));
      x.keys('part:ball_3', fall(12, 60, 1.5, -1.5));
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    domain: 'sun',
    icon: 'mdi:weather-sunset',
    tags: ['sun', 'weather', 'sunset', 'sunrise', 'evening'],
    duration: 3,
    parts: { sun: ['Sun', [0]], line_1: ['Horizon 1', [1]], line_2: ['Horizon 2', [2]], ray_t: ['Ray top', [3]], ray_l: ['Ray left', [4]], ray_r: ['Ray right', [5]] },
    tracks: (x) => ['ray_l', 'ray_t', 'ray_r'].forEach((r, i) => x.keys(`part:${r}`, [t(0, { y: 0 }, { opacity: 1 }), t(15 + i * 10, { y: 0 }, { opacity: 1, easing: 'ease-in' }), t(45 + i * 10, { y: 1 }, { opacity: 0.1 }), t(70, { y: 1 }, { opacity: 0.1, easing: 'ease-out' }), t(95, { y: 0 }, { opacity: 1 })])),
  },
  // ── network, phones, time ──
  {
    id: 'wifi',
    name: 'Wi-Fi',
    domain: 'binary_sensor',
    icon: 'mdi:wifi',
    tags: ['binary_sensor', 'connectivity', 'wifi', 'network', 'signal'],
    duration: 1.6,
    parts: { dot: ['Dot', [0]], arc_m: ['Middle arc', [2]], arc_t: ['Top arc', [1]] },
    groups: { signal: ['Signal', ['dot', 'arc_m', 'arc_t']] },
    tracks: (x) => ['dot', 'arc_m', 'arc_t'].forEach((p, i) => x.keys(`part:${p}`, [k(0, { opacity: 0.25 }), k(i * 20, { opacity: 0.25, easing: 'ease-out' }), k(i * 20 + 15, { opacity: 1 }), k(75, { opacity: 1, easing: 'ease-in' }), k(95, { opacity: 0.25 })])),
  },
  {
    id: 'router',
    name: 'Router',
    domain: 'binary_sensor',
    icon: 'mdi:router-wireless',
    tags: ['binary_sensor', 'connectivity', 'router', 'network', 'internet'],
    duration: 1.6,
    parts: { wave_o: ['Outer wave', [0]], wave_i: ['Inner wave', [1]], router: ['Router', [2]] },
    tracks: (x) => {
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 20 }));
    },
  },
  {
    id: 'phone-signal',
    name: 'Phone signal',
    domain: 'device_tracker',
    icon: 'mdi:cellphone-wireless',
    tags: ['device_tracker', 'phone', 'mobile', 'connectivity'],
    duration: 1.6,
    parts: { wave_o: ['Outer wave', [0]], wave_i: ['Inner wave', [1]], dot: ['Dot', [2], 'center'], phone: ['Phone', [3]] },
    tracks: (x) => {
      x.preset('part:dot', 'pulse', { intensity: 0.8, share: 40 });
      x.keys('part:wave_i', presetKeyframes('wave', { share: 60, delay: 10 }));
      x.keys('part:wave_o', presetKeyframes('wave', { share: 60, delay: 30 }));
    },
  },
  {
    id: 'phone-ringing',
    name: 'Phone ringing',
    domain: 'event',
    icon: 'mdi:phone-ring',
    tags: ['event', 'phone', 'call', 'ringing'],
    duration: 1.2,
    parts: { handset: ['Handset', [0], 'center'], wave_r: ['Right wave', [1]], wave_t: ['Top wave', [2]], wave_l: ['Left wave', [3]] },
    tracks: (x) => {
      x.preset('part:handset', 'ring', { share: 60, intensity: 0.5 });
      ['wave_l', 'wave_t', 'wave_r'].forEach((w, i) => x.keys(`part:${w}`, presetKeyframes('wave', { share: 50, delay: i * 12 })));
    },
  },
  {
    id: 'phone-vibrate',
    name: 'Phone vibrate',
    domain: 'device_tracker',
    icon: 'mdi:cellphone',
    tags: ['device_tracker', 'phone', 'mobile', 'notification'],
    duration: 1.4,
    parts: { phone: ['Phone', [0], 'center'] },
    tracks: (x) => x.keys('part:phone', [0, 4, 8, 12, 16, 20, 24, 28, 32, 50, 54, 58, 62, 66, 70, 74, 78, 82].map((at, i, all) => t(at, { rotate: i === 0 || i === 8 || i === 9 || i === all.length - 1 ? 0 : i % 2 ? 4 : -4 }, { easing: 'linear' }))),
  },
  {
    id: 'clock',
    name: 'Clock',
    domain: 'sensor',
    icon: 'mdi:clock-outline',
    tags: ['sensor', 'time', 'clock', 'timer', 'schedule'],
    duration: 4,
    parts: { face: ['Face', [0]], hands: ['Hands', [1], [12, 12]] },
    tracks: (x) => x.keys('part:hands', SPIN()),
  },
  {
    id: 'hourglass',
    name: 'Hourglass',
    domain: 'timer',
    icon: 'mdi:timer-sand',
    tags: ['timer', 'time', 'waiting', 'countdown'],
    duration: 3,
    parts: { glass: ['Hourglass', [0], [12, 12]], sand: ['Sand', [1], 'bottom'] },
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
    name: 'Timer',
    domain: 'timer',
    icon: 'mdi:timer-outline',
    tags: ['timer', 'time', 'countdown', 'stopwatch'],
    duration: 3,
    parts: { face: ['Face', [0]], hand: ['Hand', [1], [12, 13]], button: ['Button', [2]] },
    tracks: (x) => {
      x.keys('part:hand', SPIN());
      x.keys('part:button', [t(0, { y: 0 }), t(4, { y: 0.6 }), t(10, { y: 0 })]);
    },
  },
  {
    id: 'car',
    name: 'Car driving',
    domain: 'device_tracker',
    icon: 'mdi:car',
    tags: ['device_tracker', 'car', 'vehicle', 'driving', 'away'],
    duration: 0.8,
    parts: { car: ['Car', [0], 'bottom'] },
    tracks: (x) => x.keys('part:car', [t(0, { y: 0, rotate: 0 }), t(25, { y: -0.4, rotate: -1 }), t(50, { y: 0, rotate: 0 }), t(75, { y: -0.3, rotate: 1 }), t(100, { y: 0, rotate: 0 })]),
  },
  // ── home, garden, pets ──
  {
    id: 'trash',
    name: 'Trash day',
    domain: 'calendar',
    icon: 'mdi:trash-can',
    tags: ['calendar', 'sensor', 'trash', 'garbage', 'waste', 'bin'],
    duration: 2,
    parts: { bin: ['Bin', [0], 'bottom'] },
    tracks: (x) => x.preset('part:bin', 'wobble', { share: 60, intensity: 1 }),
  },
  {
    id: 'plant',
    name: 'Plant',
    domain: 'plant',
    icon: 'mdi:sprout',
    tags: ['plant', 'garden', 'moisture', 'sensor'],
    duration: 3,
    parts: { soil: ['Soil', [0]], sprout: ['Sprout', [1], [12, 17]] },
    tracks: (x) => x.keys('part:sprout', [t(0, { rotate: -5 }), t(50, { rotate: 5 }), t(100, { rotate: -5 })]),
  },
  {
    id: 'flower',
    name: 'Flower',
    domain: 'plant',
    icon: 'mdi:flower',
    tags: ['plant', 'garden', 'flower', 'spring'],
    duration: 3,
    parts: { leaf_l: ['Left leaf', [0], 'top-right'], head: ['Flower', [1], 'bottom'], leaf_r: ['Right leaf', [2], 'top-left'] },
    tracks: (x) => {
      x.keys('part:head', [t(0, { rotate: -6 }), t(50, { rotate: 6 }), t(100, { rotate: -6 })]);
      x.keys('part:leaf_l', [t(0, { rotate: 0 }), t(50, { rotate: -6 }), t(100, { rotate: 0 })]);
      x.keys('part:leaf_r', [t(0, { rotate: 0 }), t(50, { rotate: 6 }), t(100, { rotate: 0 })]);
    },
  },
  {
    id: 'leaf',
    name: 'Leaf in the wind',
    domain: 'sensor',
    icon: 'mdi:leaf',
    tags: ['sensor', 'eco', 'energy', 'nature', 'plant'],
    duration: 3,
    parts: { leaf: ['Leaf', [0], 'bottom-left'] },
    tracks: (x) => x.keys('part:leaf', [t(0, { rotate: 0, y: 0 }), t(30, { rotate: -8, y: -0.6 }), t(60, { rotate: 4, y: 0.2 }), t(100, { rotate: 0, y: 0 })]),
  },
  {
    id: 'paw',
    name: 'Pet',
    domain: 'sensor',
    icon: 'mdi:paw',
    tags: ['sensor', 'pet', 'dog', 'cat', 'feeder', 'presence'],
    duration: 1.6,
    parts: { toe_1: ['Toe 1', [2], 'center'], toe_2: ['Toe 2', [0], 'center'], toe_3: ['Toe 3', [1], 'center'], toe_4: ['Toe 4', [3], 'center'], pad: ['Pad', [4], 'center'] },
    tracks: (x) => {
      ['toe_1', 'toe_2', 'toe_3', 'toe_4'].forEach((p, i) => x.keys(`part:${p}`, [t(0, { scale: 1 }), t(i * 10, { scale: 1 }, { easing: 'ease-out' }), t(i * 10 + 10, { scale: 1.25 }, { easing: 'ease-in' }), t(i * 10 + 22, { scale: 1 })]));
      x.keys('part:pad', [t(0, { scale: 1 }), t(50, { scale: 1 }), t(60, { scale: 1.08 }), t(72, { scale: 1 })]);
    },
  },
  {
    id: 'dog',
    name: 'Dog',
    domain: 'sensor',
    icon: 'mdi:dog',
    tags: ['sensor', 'pet', 'dog', 'presence'],
    duration: 2,
    parts: { dog: ['Dog', [0], 'bottom'] },
    tracks: (x) => x.keys('part:dog', [t(0, { rotate: 0 }), t(20, { rotate: -10 }), t(45, { rotate: -10 }, { easing: 'ease-in-out' }), t(65, { rotate: 0 })]),
  },
  {
    id: 'bee',
    name: 'Bee',
    domain: 'sensor',
    icon: 'mdi:bee',
    tags: ['sensor', 'garden', 'nature', 'pollen'],
    duration: 3,
    parts: { bee: ['Bee', [0], 'center'] },
    tracks: (x) => {
      x.path('part:bee', 'M0 0 C 1.5 -2 3 -2 3 0 S 1.5 2 0 0 S -3 2 -3 0 S -1.5 -2 0 0');
      x.keys('part:bee', [t(0, { rotate: -8 }, { easing: 'linear' }), t(25, { rotate: 8 }, { easing: 'linear' }), t(50, { rotate: -8 }, { easing: 'linear' }), t(75, { rotate: 8 }, { easing: 'linear' }), t(100, { rotate: -8 })]);
    },
  },
  {
    id: 'bird',
    name: 'Bird',
    domain: 'sensor',
    icon: 'mdi:bird',
    tags: ['sensor', 'garden', 'nature', 'bird'],
    duration: 1.6,
    parts: { bird: ['Bird', [0], 'center'] },
    tracks: (x) => x.keys('part:bird', [t(0, { y: 0, rotate: 0 }), t(30, { y: -1.4, rotate: -6 }), t(60, { y: 0.3, rotate: 3 }), t(100, { y: 0, rotate: 0 })]),
  },
  {
    id: 'fish',
    name: 'Fish',
    domain: 'sensor',
    icon: 'mdi:fish',
    tags: ['sensor', 'aquarium', 'pet', 'water'],
    duration: 2,
    parts: { fish: ['Fish', [0], 'center'] },
    tracks: (x) => x.keys('part:fish', [t(0, { x: 0, y: 0, rotate: 0 }), t(25, { x: 0.8, y: -0.4, rotate: -6 }), t(50, { x: 0, y: 0, rotate: 0 }), t(75, { x: -0.8, y: 0.4, rotate: 6 }), t(100, { x: 0, y: 0, rotate: 0 })]),
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    domain: 'sensor',
    icon: 'mdi:heart-pulse',
    tags: ['sensor', 'health', 'heart', 'pulse', 'fitness'],
    duration: 1.2,
    parts: { top: ['Heart top', [0]], bottom: ['Heart and pulse', [1]] },
    groups: { heart: ['Heart', ['top', 'bottom'], 'center'] },
    tracks: (x) => x.keys('group:heart', [t(0, { scale: 1 }, { easing: 'ease-out' }), t(10, { scale: 1.15 }, { easing: 'ease-in' }), t(22, { scale: 1 }, { easing: 'ease-out' }), t(32, { scale: 1.1 }, { easing: 'ease-in' }), t(48, { scale: 1 })]),
  },
  {
    id: 'home',
    name: 'Home',
    domain: 'zone',
    icon: 'mdi:home',
    tags: ['zone', 'person', 'home', 'presence', 'house'],
    duration: 2.4,
    parts: { house: ['House', [0], 'bottom'] },
    tracks: (x) => x.preset('part:house', 'bounce', { intensity: 0.4, share: 50 }),
  },
  {
    id: 'gauge',
    name: 'Gauge',
    domain: 'sensor',
    icon: 'mdi:gauge',
    tags: ['sensor', 'gauge', 'speed', 'pressure', 'level'],
    duration: 3,
    parts: { dial: ['Dial', [0]], needle: ['Needle', [1], [11, 14]], tick_t: ['Top tick', [2]], tick_l: ['Left tick', [3]], tick_r: ['Right tick', [4]] },
    tracks: (x) => x.keys('part:needle', [t(0, { rotate: -70 }, { easing: 'ease-out' }), t(40, { rotate: 10 }, { easing: 'ease-in-out' }), t(55, { rotate: -5 }), t(70, { rotate: 5 }, { easing: 'ease-in-out' }), t(100, { rotate: -70 })]),
  },
];

/** The library: ready icon animations for the icons of most Home Assistant domains. */
export const ICON_LIBRARY: LibraryEntry[] = SPECS.map((s) => ({
  id: s.id,
  name: s.name,
  domain: s.domain,
  icon: s.icon,
  tags: s.tags,
  build: () => build(s),
}));

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
  const terms = (query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  return ICON_LIBRARY.filter((e) => {
    if (domain && e.domain !== domain && !e.tags.includes(domain)) return false;
    const hay = `${e.name} ${e.id} ${e.icon} ${e.domain} ${e.tags.join(' ')}`.toLowerCase();
    return terms.every((w) => hay.includes(w));
  });
}
