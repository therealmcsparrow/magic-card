import type { AnimationDoc, AnimationKeyframe, KeyframeTransform, RigGroup, RigPart, RigShape, TargetRef, Track } from '../../anim-studio/model';
import type { IconStyleHints, LibraryEntry } from '../../contracts/icon-library';
import type { IconGeometry } from '../../icons/icon-source';
import { splitIcon, type SplitPiece } from '../../icons/icon-split';
import { anchorOf, piecesBox, type Anchor } from '../icon-doc';
import { mdiGeometry } from '../mdi-paths';
import { presetKeyframes } from '../part-presets';
import type { MessageId } from '../../contracts/i18n';
import { t as tn } from './i18n';

/*
 * The icon library's builder and motion helpers (module icon-library, contract 1.2.0). An entry is
 * a Spec: the icon (or own paths cut from it), named parts over its pieces, groups, shapes and the
 * tracks. build() turns it into a normal keyframes document with a rig; the studio edits it like
 * any other. The data lives in library.ts (the 2026.10.03 entries) and the category files next to
 * this one (the P4 entries from the brand artist's p4-spec.json).
 *
 * Lives in the studio bundle and the lazy icon animator chunk only, never in magic-card.js.
 */

// ── builder ──

export type Pivot = Anchor | [number, number];
export type PartDef = [name: MessageId, from: number[], pivot?: Pivot];
export type GroupDef = [name: MessageId, parts: string[], pivot?: Pivot];

/** A drawn shape of an entry: its name is an m() mark; `n` fills the {n} of a numbered name. */
export type SpecShape = Omit<RigShape, 'name'> & { name: MessageId; n?: number };

export interface Spec {
  id: string;
  /** An m() mark; the tile, the document and the search read it with tn() once the icon tables are ready. */
  name: MessageId;
  domain: string;
  icon: string;
  tags: string[];
  /** s per cycle. */
  duration: number;
  parts: Record<string, PartDef>;
  groups?: Record<string, GroupDef>;
  shapes?: SpecShape[];
  /** Own source paths (filled, 24 x 24) instead of the MDI icon: one piece per path. */
  own?: string[];
  tracks: (t: Tracks) => void;
}

export interface Tracks {
  /** A part preset's keyframes on a target (merged with keys already there, later wins per at). */
  preset(target: TargetRef, presetId: string, params?: Record<string, number>): void;
  /** Own keyframes (padded to 0 % and 100 % with the nearest key). */
  keys(target: TargetRef, keys: AnimationKeyframe[]): void;
  /** A motion path in viewBox units around the rest position. */
  path(target: TargetRef, d: string): void;
}

export const k = (at: number, v: Omit<AnimationKeyframe, 'at'> = {}): AnimationKeyframe => ({ at, ...v });
export const t = (at: number, transform: KeyframeTransform, v: Omit<AnimationKeyframe, 'at' | 'transform'> = {}): AnimationKeyframe => ({ at, transform, ...v });

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

export function build(spec: Spec): AnimationDoc {
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
    return { id, name: tn(name), from, ...(origin ? { origin } : {}) };
  });
  const groups: RigGroup[] = Object.entries(spec.groups ?? {}).map(([id, [name, members, pivot]]) => {
    const origin = pivotOf(
      members.flatMap((m) => spec.parts[m]?.[1] ?? []),
      pivot,
    );
    return { id, name: tn(name), parts: members, ...(origin ? { origin } : {}) };
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
    name: tn(spec.name),
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
      ...(spec.shapes?.length ? { shapes: spec.shapes.map(({ n, name, ...s }) => ({ ...s, name: tn(name, { n: n ?? 0 }) })) } : {}),
    },
    tracks,
  };
}

// ── motion helpers ──

/** Rises from below and fades away (steam, heat, mist), starting at `at` %, over `span` %. */
export const rise = (at: number, span = 60, dy = -3): AnimationKeyframe[] =>
  padKeys([
    t(at, { y: 1 }, { opacity: 0, easing: 'ease-out' }),
    t(at + span * 0.4, { y: -0.4 }, { opacity: 1, easing: 'ease-in' }),
    t(at + span, { y: dy }, { opacity: 0 }),
  ]);

/** Falls `dy` units from its place and fades out (drops), starting at `at` % over `span` %. */
export const fall = (at: number, span = 50, dy = 3, from = -1.5): AnimationKeyframe[] =>
  padKeys([
    t(at, { y: from }, { opacity: 0, easing: 'ease-in' }),
    t(at + span * 0.2, { y: from + (dy - from) * 0.12 }, { opacity: 1, easing: 'ease-in' }),
    t(at + span * 0.85, { y: dy * 0.85 }, { opacity: 1, easing: 'ease-out' }),
    t(at + span, { y: dy }, { opacity: 0 }),
  ]);

/** Fades in at `at` %, stays until `out` %, fades out by 100 % (a bar of a filling level). */
export const fillIn = (at: number, out = 85): AnimationKeyframe[] => [k(0, { opacity: 0.15 }), k(at, { opacity: 0.15, easing: 'ease-out' }), k(at + 8, { opacity: 1 }), k(out, { opacity: 1, easing: 'ease-in' }), k(100, { opacity: 0.15 })];

/** Quick flashes (lightning) in the first `span` %. */
export const flash = (at = 0, color?: string): AnimationKeyframe[] => {
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
export const FLAME = ['#ff6d00', '#ffab00'];
export const flame = (intensity: number, delay = 0, share = 100): AnimationKeyframe[] =>
  presetKeyframes('flicker', { intensity, delay, share }).map((x, i, all) => ({ ...x, color: FLAME[i === all.length - 1 ? 0 : i % 2] }));

/** Open, hold, close (garage door slats, shutters): `y` moves up to `to`, fading out; `order` staggers. */
export const rollUp = (dy: number, order: number): AnimationKeyframe[] => [
  t(0, { y: 0 }, { opacity: 1 }),
  t(8 + order * 5, { y: 0 }, { opacity: 1, easing: 'ease-in-out' }),
  t(34 + order * 5, { y: dy }, { opacity: 0 }),
  t(66 - order * 5, { y: dy }, { opacity: 0, easing: 'ease-in-out' }),
  t(92 - order * 5, { y: 0 }, { opacity: 1 }),
  t(100, { y: 0 }, { opacity: 1 }),
];

/** A swing on an axis (doors, curtains): scale_x closes to `to` and back. */
export const fold = (to: number, extra: KeyframeTransform = {}): AnimationKeyframe[] => [
  t(0, { scale_x: 1 }),
  t(12, { scale_x: 1 }, { easing: 'ease-in-out' }),
  t(42, { scale_x: to, ...extra }),
  t(62, { scale_x: to, ...extra }, { easing: 'ease-in-out' }),
  t(90, { scale_x: 1 }),
  t(100, { scale_x: 1 }),
];

export const SPIN = (n = 1) => [t(0, { rotate: 0 }, { easing: 'linear' }), t(100, { rotate: 360 * n })];

/** The library entry of a spec (a fresh document per build(), so editing one never changes the library), with its Style hints. */
export const entryOf = (s: Spec, styles?: IconStyleHints): LibraryEntry => ({
  id: s.id,
  // the tile name in the current language (a getter: the tables are lazy, a language change applies at once)
  get name() {
    return tn(s.name);
  },
  domain: s.domain,
  icon: s.icon,
  tags: s.tags,
  build: () => build(s),
  ...(styles ? { styles } : {}),
});

const r3 = (v: number): number => Math.round(v * 1000) / 1000;
type Channel = Exclude<keyof KeyframeTransform, 'axis'>;
const REST = (ch: Channel): number => (ch.startsWith('scale') ? 1 : 0);

/**
 * A seamless sine oscillation of one or more channels around their rest value: `{ rotate: 6 }`, or
 * `{ y: [0.6, 25] }` for an amplitude with a lag in % of the cycle (wings, followers). Without lags
 * the keys sit on the peaks with ease-in-out; with lags they are sampled every 1/12 cycle (linear).
 * `cycles` whole oscillations per cycle; `extra` adds opacity / colour to every key.
 */
export function osc(chs: Partial<Record<Channel, number | [amp: number, lag: number]>>, o: { cycles?: number; extra?: Omit<AnimationKeyframe, 'at' | 'transform'> } = {}): AnimationKeyframe[] {
  const cycles = o.cycles ?? 1;
  const list = Object.entries(chs).map(([ch, v]) => [ch as Channel, ...(Array.isArray(v) ? v : [v, 0])] as const);
  const lagged = list.some(([, , lag]) => lag);
  const n = (lagged ? 12 : 4) * cycles;
  return Array.from({ length: n + 1 }, (_, i) => {
    const at = r3((i * 100) / n);
    const transform: KeyframeTransform = {};
    for (const [ch, amp, lag] of list) transform[ch] = r3(REST(ch) + amp * Math.sin(2 * Math.PI * ((cycles * at) / 100 - lag / 100)));
    return t(at, transform, { ...o.extra, ...(i < n ? { easing: lagged ? 'linear' : 'ease-in-out' } : {}) });
  });
}

/**
 * Rotation keys of a part turned around a joint `dy` units above its own top edge, rewritten to turn
 * around that edge plus the matching translate (split rule 3: a rotating part's pivot lies on its
 * own box). Same picture: a point at the edge moves by R(θ)·(0, dy) - (0, dy).
 */
export const swingBelow = (keys: AnimationKeyframe[], dy: number): AnimationKeyframe[] =>
  keys.map((x) => {
    const a = ((x.transform?.rotate ?? 0) * Math.PI) / 180;
    return { ...x, transform: { ...x.transform, x: r3(-dy * Math.sin(a)), y: r3(dy * Math.cos(a) - dy) } };
  });

/** A key eased into the next one (ease-in-out unless `v.easing` says otherwise). */
export const te = (at: number, transform: KeyframeTransform, v: Omit<AnimationKeyframe, 'at' | 'transform'> = {}): AnimationKeyframe => t(at, transform, { easing: 'ease-in-out', ...v });

/** Dims to `lo` and back to full over [at, at + span] %: full at rest, so a held pose shows the whole icon. */
export const dim = (at: number, span = 40, lo = 0.35): AnimationKeyframe[] =>
  padKeys([k(at, { opacity: 1, easing: 'ease-in-out' }), k(at + span / 2, { opacity: lo, easing: 'ease-in-out' }), k(at + span, { opacity: 1 })]);

/** Two blinks from `at` %, `step` % apart per change (keep step x duration >= 0.17 s: at most 3 flashes a second), then on. */
export const blink2 = (at = 0, step = 12, lo = 0.35): AnimationKeyframe[] =>
  padKeys([0, 1, 2, 3, 4].map((i) => k(at + i * step, { opacity: i % 2 ? lo : 1, easing: 'ease-in-out' })));

/**
 * An emitter (drops, puffs, mist): sits at its drawn place, at `at` % moves by `move` over `span` %
 * fading out, then fades back in at its place over `back` %. Visible at rest; needs at + span + back <= 100.
 */
export function emit(at: number, move: KeyframeTransform, span = 30, back = 15): AnimationKeyframe[] {
  const rest: KeyframeTransform = {};
  for (const ch of Object.keys(move) as Channel[]) rest[ch] = REST(ch);
  return padKeys([
    t(at, rest, { opacity: 1, easing: 'ease-in' }),
    t(at + span, move, { opacity: 0 }),
    t(at + span + 1, rest, { opacity: 0, easing: 'ease-out' }),
    t(at + span + back, rest, { opacity: 1 }),
  ]);
}
