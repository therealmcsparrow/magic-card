import type {
  AnimationDoc,
  AnimationKeyframe,
  KeyframeTransform,
  RigShape,
  TargetRef,
  Track,
} from '../anim-studio/model';
import {
  GLOW,
  GLOW_CAPS,
  GLOW_FALLBACK,
  QUIET,
  QUIET_LANE_ORDER,
  type IconStyle,
  type IconStyleHints,
  type LibraryEntry,
} from '../contracts/icon-library';
import { pathBox, splitIcon, unionBox, type SplitPiece } from '../icons/icon-split';
import { GLOW_ON_LIGHT, GLOW_SHAPES } from './library/style-hints';
import { t } from './i18n';
import { t as tn } from './library/i18n';

/*
 * Icon Styles (module icon-library, contract icon-library 1.2.1, ADR 0006): every library entry
 * plays as Quiet, Living or Glow, all derived from its one Living rig when the user picks it in the
 * card editor. The card stores the result inline and plays it like any other document, so neither
 * magic-card.js nor the runtime chunk knows about Styles. Pure and deterministic.
 *
 * Quiet (the brand artist's direction A, p4-spec.json `styles.quiet`): one hero track keeps one
 * lane. Hero: hints.quiet.part, else a spin, else the target with the largest peak displacement in
 * icon units (a flip ranks last; within 10 % the larger box wins, so a group beats its members).
 * Lane: hints.quiet.lane, else the hero's largest channel. Offsets shrink by
 * f = min(QUIET.amplitude, 0.3 units / peak) and are clamped to QUIET; opacity becomes 0.7..1. A spin
 * keeps turning at half speed. Every other track, the colour, draw and path lanes and the top-level
 * keyframes go: the rest holds its drawn pose. Duration: max(x QUIET.slowdown, 1.6 s); keys keep
 * their place, eased ease-in-out (linear keys stay linear: sampled curves and spins), and so is the
 * document.
 *
 * Glow (direction C, `styles.glow`): Living plus a lit accent layer, no filter or blur anywhere.
 * - Accent targets (hints.glow.parts: part or group ids, `shape:<id>` for drawn shapes) take the
 *   glow colour: a constant colour lane on their track (a target with its own colour keys keeps
 *   them), a shape its fill.
 * - Halos: at most GLOW_CAPS.halos stroked copies of an accent target's outline, RigShape
 *   `glow-<id>` under the parts, whose track copies the motion of the target (or of its group when
 *   the target itself holds still) and pulses opacity GLOW.opacity[0] -> [1] -> [0]. The largest
 *   accent gets one; a second only when the entry has two accents of similar size. Without accent
 *   parts the first part with a track gets the halo.
 * - Glow-only shapes (GLOW_SHAPES: the jack-o'-lantern's face light) are added lit, moving with
 *   their part.
 * - Colour (fixed when picked, CEO ruling): the entry's Color field (a plain colour), else the theme
 *   pair, else GLOW_FALLBACK's. Light or dark is the card background's brightness, read by CSS
 *   relative colour from the theme's card background variables (cardSwitch), so it follows Home
 *   Assistant's dark mode and a theme change without any card code. On light cards the colour is
 *   the darker one and halos are transparent.
 */

const SPEC_PEAK = 0.3;
const MIN_DURATION = 1.6;
const TRACK_CAP = 24; // model-v2 V2_CAPS.tracks
const PATH_CAP = 8192; // ANIMATION_CAPS.pathLength

type Box = [number, number, number, number];
type Channel =
  | 'x'
  | 'y'
  | 'rotate'
  | 'scale'
  | 'scale_x'
  | 'scale_y'
  | 'skew_x'
  | 'skew_y'
  | 'opacity'
  | 'draw'
  | 'color';
const TRANSFORM_CHANNELS: Channel[] = [
  'rotate',
  'y',
  'x',
  'scale',
  'scale_x',
  'scale_y',
  'skew_x',
  'skew_y',
];
/** Lanes that only time the icon (no movement), in the order they may lead when nothing moves. */
const TIMING_CHANNELS: Channel[] = ['opacity', 'draw'];
const r3 = (n: number): number => Math.round(n * 1000) / 1000;
const restOf = (ch: Channel): number =>
  ch === 'x' || ch === 'y' || ch === 'rotate' || ch.startsWith('skew') ? 0 : 1;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const centre = (b: Box): [number, number] => [b[0] + b[2] / 2, b[1] + b[3] / 2];
const valueOf = (k: AnimationKeyframe, ch: Channel): number | undefined =>
  ch === 'opacity'
    ? k.opacity
    : ch === 'draw'
      ? k.draw
      : ch === 'color'
        ? undefined
        : k.transform?.[ch];

/** The rig's geometry by target: outline path data, box and pivot (as the runtime computes them). */
function geometryOf(doc: AnimationDoc) {
  const rig = doc.rig;
  const paths = [...(rig?.svg ?? '').matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
  const pieces: SplitPiece[] = paths.length ? splitIcon({ paths, viewBox: '0 0 24 24' }) : [];
  const parts = new Map((rig?.parts ?? []).map((p) => [p.id, p]));
  const groups = new Map((rig?.groups ?? []).map((g) => [g.id, g]));
  const shapes = new Map((rig?.shapes ?? []).map((s) => [s.id, s]));
  const fromOf = (ref: TargetRef): number[] => {
    const [kind, id] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
    if (kind === 'part') return parts.get(id)?.from ?? [];
    if (kind === 'group')
      return (groups.get(id)?.parts ?? []).flatMap((p) => parts.get(p)?.from ?? []);
    return [];
  };
  const box = (ref: TargetRef): Box | undefined => {
    if (ref.startsWith('shape:')) {
      const s = shapes.get(ref.slice(6));
      return s ? pathBox(s.d) : undefined;
    }
    return unionBox(
      fromOf(ref)
        .map((i) => pieces[i]?.bbox)
        .filter((b): b is Box => !!b),
    );
  };
  const origin = (ref: TargetRef): [number, number] | undefined => {
    const id = ref.slice(ref.indexOf(':') + 1);
    const set = ref.startsWith('part:')
      ? parts.get(id)?.origin
      : ref.startsWith('group:')
        ? groups.get(id)?.origin
        : shapes.get(id)?.origin;
    const b = box(ref);
    return set ?? (b ? centre(b) : undefined);
  };
  const outline = (ref: TargetRef): string =>
    fromOf(ref)
      .map((i) => pieces[i]?.d)
      .filter(Boolean)
      .join(' ');
  /** The ref of an id from a hint: a part, else a group, else a drawn shape (`shape:` kept). */
  const refOf = (id: string): TargetRef | undefined => {
    if (/^(part|group|shape):/.test(id))
      return (box(id as TargetRef) ? id : undefined) as TargetRef | undefined;
    return parts.has(id)
      ? `part:${id}`
      : groups.has(id)
        ? `group:${id}`
        : shapes.has(id)
          ? `shape:${id}`
          : undefined;
  };
  /** The group a part moves with (the first that holds it). */
  const groupOf = (partId: string): TargetRef | undefined => {
    for (const g of groups.values()) if (g.parts.includes(partId)) return `group:${g.id}`;
    return undefined;
  };
  return { box, origin, outline, refOf, groupOf };
}
type Geometry = ReturnType<typeof geometryOf>;

// structuredClone is Chromium 98; the floor is 85 (tools/check-es-syntax.mjs). An animation document is plain data: objects, arrays, numbers, strings, booleans.
const deepCopy = <T>(v: T): T =>
  Array.isArray(v) ? (v.map(deepCopy) as T) : v !== null && typeof v === 'object' ? (Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepCopy(x)])) as T) : v;
const clone = (doc: AnimationDoc): AnimationDoc => deepCopy(doc);

/** styleDoc options: the document id (default the entry's) and the user's glow colour (the entry's Color). */
export interface StyleOptions {
  id?: string;
  color?: string;
}

/** The derived document of a library entry in a Style. */
export function styleDoc(
  entry: LibraryEntry,
  style: IconStyle,
  opts: StyleOptions = {},
): AnimationDoc {
  const living = { ...entry.build(), id: opts.id ?? entry.id };
  if (style === 'quiet') return quietDoc(living, entry.styles);
  if (style === 'glow') return glowDoc(living, entry.id, entry.styles, opts.color);
  return living;
}

// ── Quiet ──

interface Lane {
  track: Track;
  ch: Channel;
  /** Peak displacement in icon units (opacity: its depth 0..1). */
  peak: number;
  spin: boolean;
  flip: boolean;
}

/** Peak displacement of a channel in icon units (p4-spec styles.quiet step 1). */
function lanePeak(track: Track, ch: Channel, geo: Geometry): Lane | undefined {
  const vals = track.keyframes
    .map((k) => valueOf(k, ch))
    .filter((v): v is number => typeof v === 'number');
  if (!vals.length) return undefined;
  const rest = restOf(ch);
  const dev = Math.max(...vals.map((v) => Math.abs(v - rest)));
  if (dev < 1e-6) return undefined;
  if (ch === 'opacity' || ch === 'draw') return { track, ch, peak: dev, spin: false, flip: false };
  const b = geo.box(track.target);
  const o = geo.origin(track.target);
  let rx = 12;
  let ry = 12;
  if (b && o) {
    rx = Math.max(Math.abs(b[0] - o[0]), Math.abs(b[0] + b[2] - o[0]));
    ry = Math.max(Math.abs(b[1] - o[1]), Math.abs(b[1] + b[3] - o[1]));
  }
  const r = Math.hypot(rx, ry);
  const spin =
    ch === 'rotate' &&
    Math.abs(vals[vals.length - 1] - vals[0]) >= 360 &&
    Math.abs(vals[vals.length - 1] - vals[0]) % 360 === 0;
  const flip = ch.startsWith('scale')
    ? vals.some((v) => v <= 0)
    : track.keyframes.some((k) => !!k.transform?.axis);
  const peak =
    ch === 'rotate'
      ? ((dev * Math.PI) / 180) * r
      : ch === 'skew_x' || ch === 'skew_y'
        ? Math.abs(Math.tan((dev * Math.PI) / 180)) * (ch === 'skew_x' ? ry : rx)
        : ch === 'x' || ch === 'y'
          ? dev
          : dev * (ch === 'scale_x' ? rx : ch === 'scale_y' ? ry : r);
  return { track, ch, peak, spin, flip };
}

/** The hero lane (p4-spec styles.quiet steps 2, 3 and 5). */
function heroLane(
  doc: AnimationDoc,
  geo: Geometry,
  hints: IconStyleHints | undefined,
): Lane | undefined {
  const tracks = (doc.tracks ?? []).filter((t) => /^(part|group|shape):/.test(t.target));
  const lanesOf = (t: Track, chs: Channel[]) =>
    chs.map((ch) => lanePeak(t, ch, geo)).filter((l): l is Lane => !!l);
  const rank = (a: Lane, b: Lane): number => {
    if (a.spin !== b.spin) return a.spin ? -1 : 1;
    if (a.flip !== b.flip) return a.flip ? 1 : -1;
    const big = Math.max(a.peak, b.peak);
    if (Math.abs(a.peak - b.peak) > big * 0.1) return b.peak - a.peak;
    const area = (l: Lane) => {
      const bx = geo.box(l.track.target);
      return bx ? bx[2] * bx[3] : 0;
    };
    return (
      area(b) - area(a) ||
      QUIET_LANE_ORDER.indexOf(a.ch as never) - QUIET_LANE_ORDER.indexOf(b.ch as never)
    );
  };
  const want = hints?.quiet?.part ? geo.refOf(hints.quiet.part) : undefined;
  const pool = want ? tracks.filter((t) => t.target === want) : tracks;
  const lane = hints?.quiet?.lane as Channel | undefined;
  const chs = lane ? [lane] : TRANSFORM_CHANNELS;
  const moving = pool.flatMap((t) => lanesOf(t, chs)).sort(rank);
  if (moving.length) return moving[0];
  // nothing moves: the deepest opacity (then draw) change times the icon (blinks, fades, gusts)
  for (const ch of TIMING_CHANNELS) {
    const fades = pool.flatMap((t) => lanesOf(t, [ch])).sort((a, b) => b.peak - a.peak);
    if (fades.length) return fades[0];
  }
  // only colour changes (a colour chase): the first one keeps its colours
  const tinted = pool.find((t) => t.keyframes.some((k) => k.color));
  if (tinted) return { track: tinted, ch: 'color', peak: 0, spin: false, flip: false };
  return want ? heroLane(doc, geo, undefined) : undefined;
}

function quietDoc(doc: AnimationDoc, hints: IconStyleHints | undefined): AnimationDoc {
  const out = clone(doc);
  const geo = geometryOf(out);
  const hero = heroLane(out, geo, hints);
  out.keyframes = [{ at: 0, opacity: 1 }];
  // no overshoot left anywhere: keys without their own easing use the document's
  out.easing = 'ease-in-out';
  delete out.bindings;
  delete out.clips;
  out.duration = r3(Math.max(out.duration * QUIET.slowdown, MIN_DURATION));
  if (!hero) {
    out.tracks = [];
    return out;
  }
  const { ch, spin } = hero;
  const f = hero.peak > 0 ? Math.min(QUIET.amplitude, SPEC_PEAK / hero.peak) : QUIET.amplitude;
  const rest = restOf(ch);
  const quietValue = (v: number): number => {
    if (ch === 'opacity' || ch === 'draw') return r3(clamp(0.7 + 0.3 * v, 0.7, 1));
    if (spin) return v;
    const s = rest + (v - rest) * f;
    if (ch === 'rotate' || ch.startsWith('skew'))
      return r3(clamp(s, -QUIET.maxRotate, QUIET.maxRotate));
    if (ch === 'x' || ch === 'y') return r3(clamp(s, -QUIET.maxTranslate, QUIET.maxTranslate));
    return r3(clamp(s, QUIET.scale[0], QUIET.scale[1]));
  };
  const keys: AnimationKeyframe[] = [];
  for (const k of hero.track.keyframes) {
    if (ch === 'color') {
      if (!k.color) continue;
      keys.push({ at: k.at, color: k.color, ...(k.easing ? { easing: k.easing } : {}) });
      continue;
    }
    const v = valueOf(k, ch);
    if (typeof v !== 'number') continue;
    const key: AnimationKeyframe = { at: k.at };
    if (ch === 'opacity') key.opacity = quietValue(v);
    else if (ch === 'draw') key.draw = quietValue(v);
    else key.transform = { [ch]: quietValue(v) } as KeyframeTransform;
    if (k.easing) key.easing = k.easing === 'linear' ? 'linear' : 'ease-in-out';
    keys.push(key);
  }
  // the cycle starts and ends at a key (the lane may have been sparse)
  if (keys.length && keys[0].at > 0) keys.unshift({ ...keys[0], at: 0 });
  if (keys.length && keys[keys.length - 1].at < 100)
    keys.push({ ...keys[keys.length - 1], at: 100 });
  const last = keys[keys.length - 1];
  if (last) delete last.easing;
  const track: Track = { target: hero.track.target, keyframes: keys };
  if (hero.track.origin) track.origin = hero.track.origin;
  out.tracks = [track];
  if (spin) out.duration = r3(doc.duration * 2);
  return out;
}

// ── Glow ──

type Rgb = [number, number, number];

/** A custom property that, when set, stands in for the card background (the editor's tiles set it). */
export const GLOW_BG_VAR = '--mc-glow-bg';

/** A #rgb / #rrggbb / rgb() colour as channels 0..255; undefined for anything else (names, var()). */
export function parseRgb(c: string | undefined): Rgb | undefined {
  const v = (c ?? '').trim().toLowerCase();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
  }
  m =
    /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/.exec(
      v,
    );
  return m ? ([1, 2, 3].map((i) => Math.min(255, Math.round(Number(m![i])))) as Rgb) : undefined;
}

/**
 * How light the card is, 0 (dark) to 1 (light), from the card background's channels in a relative
 * colour: the sRGB-weighted brightness of GLOW_BG_VAR, else --ha-card-background, else
 * --card-background-color (what Home Assistant's light and dark mode set), with a narrow ramp
 * around 152 of 255 (a relative luminance of about 0.4: the brand artist's light-card line).
 */
// (r*.2126 + g*.7152 + b*.0722 - 152) / 16, written without a bare bracket (safeCssValue allows
// function brackets only)
const LIGHTNESS = 'clamp(0, r * 0.0133 + g * 0.0447 + b * 0.0045 - 9.5, 1)';
const BG = `var(${GLOW_BG_VAR},var(--ha-card-background,var(--card-background-color,#fff)))`;

/** A colour that is `dark` on a dark card and `light` on a light one ([r, g, b, alpha]). */
export function cardSwitch(dark: [...Rgb, number], light: [...Rgb, number]): string {
  const ch = (i: number): string => {
    const d = dark[i];
    const k = Math.round((light[i] - d) * 1000) / 1000;
    // CSS needs whitespace around + and - in math functions (else `255-245` is two numbers)
    return k ? `calc(${d} ${k < 0 ? '-' : '+'} ${Math.abs(k)} * ${LIGHTNESS})` : String(d);
  };
  return `rgb(from ${BG} ${ch(0)} ${ch(1)} ${ch(2)} / ${ch(3)})`;
}

/**
 * The glow colours, fixed when picked: the user's colour (the entry's Color, when it is a plain
 * colour) on dark cards and 70 % of it towards black on light ones, else the theme pair (the hint's
 * glow colour and its theme_on_light colour), else GLOW_FALLBACK's pair. Accents and glow shapes
 * take `fill`; the halo stroke is the dark colour on dark cards and transparent on light ones.
 */
function glowPaint(
  hint: string | undefined,
  user: string | undefined,
): { fill: string; halo: string } {
  const own = parseRgb(user);
  const theme = (hint ?? GLOW_FALLBACK).toLowerCase();
  const dark = own ?? parseRgb(theme) ?? (parseRgb(GLOW_FALLBACK) as Rgb);
  const light = own
    ? (own.map((v) => Math.round(v * 0.7)) as Rgb)
    : (parseRgb(GLOW_ON_LIGHT[theme]) ?? (dark.map((v) => Math.round(v * 0.7)) as Rgb));
  return {
    fill: cardSwitch([...dark, 1], [...light, 1]),
    halo: cardSwitch([...dark, 1], [...dark, 0]),
  };
}

/** Glow paint values (fill and halo) in a document: they differ only by the colour picked. */
export const isGlowPaint = (v: unknown): boolean =>
  typeof v === 'string' && v.startsWith(`rgb(from ${BG} `);

const hasTransform = (t: Track | undefined): boolean =>
  !!t &&
  (!!t.path ||
    t.keyframes.some(
      (k) => (k.transform && Object.keys(k.transform).length) || k.draw !== undefined,
    ));

/** A constant colour lane on a target (its own colour keys win). */
function light(out: AnimationDoc, ref: TargetRef, color: string): void {
  const tracks = (out.tracks ??= []);
  const tr = tracks.find((t) => t.target === ref);
  if (tr?.keyframes.some((k) => k.color)) return;
  if (!tr) {
    if (tracks.length >= TRACK_CAP) return;
    tracks.push({
      target: ref,
      keyframes: [
        { at: 0, color },
        { at: 100, color },
      ],
    });
    return;
  }
  const first = tr.keyframes.find((k) => k.at === 0);
  const last = tr.keyframes.find((k) => k.at === 100);
  if (first) first.color = color;
  else tr.keyframes.unshift({ at: 0, color });
  if (last) last.color = color;
  else tr.keyframes.push({ at: 100, color });
}

/** A track on `shape:<id>` copying `src`'s motion (transform and draw keys, path), plus `opacity` keys. */
function followTrack(
  id: string,
  src: Track | undefined,
  opacity: Array<[number, number]>,
  withOpacity = false,
): Track {
  const byAt = new Map<number, AnimationKeyframe>();
  for (const k of src?.keyframes ?? []) {
    const own = k.transform && Object.keys(k.transform).length;
    if (!own && k.draw === undefined && !(withOpacity && k.opacity !== undefined)) continue;
    const key: AnimationKeyframe = { at: k.at };
    if (own) key.transform = { ...k.transform };
    // a stroked shape draws on like its part
    if (k.draw !== undefined) key.draw = k.draw;
    if (withOpacity && k.opacity !== undefined) key.opacity = k.opacity;
    if (k.easing) key.easing = k.easing;
    byAt.set(k.at, key);
  }
  for (const [at, o] of opacity) byAt.set(at, { ...(byAt.get(at) ?? { at }), opacity: o });
  const keyframes = [...byAt.values()].sort((a, b) => a.at - b.at);
  const tr: Track = { target: `shape:${id}`, keyframes };
  if (src?.path) tr.path = { ...src.path };
  return tr;
}

function glowDoc(
  doc: AnimationDoc,
  entryId: string,
  hints: IconStyleHints | undefined,
  user: string | undefined,
): AnimationDoc {
  const out = clone(doc);
  const rig = out.rig;
  if (!rig) return out;
  const geo = geometryOf(out);
  const paint = glowPaint(hints?.glow?.color, user);
  const trackOf = (ref: TargetRef | undefined) =>
    ref ? out.tracks?.find((t) => t.target === ref) : undefined;
  const accents = [
    ...new Set(
      (hints?.glow?.parts ?? []).map((id) => geo.refOf(id)).filter((r): r is TargetRef => !!r),
    ),
  ];
  const shapes = (rig.shapes ??= []);

  // the lit accents
  for (const ref of accents) {
    if (ref.startsWith('shape:')) {
      const s = shapes.find((x) => x.id === ref.slice(6));
      if (s) s.fill = paint.fill;
    } else light(out, ref, paint.fill);
  }

  // halos: the largest accent; a second one only for a pair of similar accents
  const area = (ref: TargetRef) => {
    const b = geo.box(ref);
    return b ? b[2] * b[3] : 0;
  };
  const solid = accents.filter((r) => !r.startsWith('shape:')).sort((a, b) => area(b) - area(a));
  let lit = solid.slice(0, 1);
  if (solid.length === 2 && area(solid[1]) >= area(solid[0]) * 0.5)
    lit = solid.slice(0, GLOW_CAPS.halos);
  if (!lit.length) {
    const first =
      (out.tracks ?? []).find((t) => t.target.startsWith('part:') && hasTransform(t)) ??
      (out.tracks ?? []).find((t) => t.target.startsWith('part:'));
    const ref =
      (first?.target as TargetRef | undefined) ??
      (rig.parts[0] ? (`part:${rig.parts[0].id}` as TargetRef) : undefined);
    if (ref) lit = [ref];
  }
  const pulse: Array<[number, number]> = [
    [0, GLOW.opacity[0]],
    [50, GLOW.opacity[1]],
    [100, GLOW.opacity[0]],
  ];
  const added: Track[] = [];
  const addedShapes: RigShape[] = [];
  for (const ref of lit) {
    const d = geo.outline(ref);
    const id = `glow-${ref.slice(ref.indexOf(':') + 1)}`.slice(0, 32);
    if (
      !d ||
      d.length > PATH_CAP ||
      shapes.some((s) => s.id === id) ||
      (out.tracks?.length ?? 0) + added.length >= TRACK_CAP
    )
      continue;
    // the halo moves like its target; a part that holds still inside a moving group moves with the group
    let src = trackOf(ref);
    let pivot = geo.origin(ref);
    if (!hasTransform(src) && ref.startsWith('part:')) {
      const g = geo.groupOf(ref.slice(5));
      if (g && hasTransform(trackOf(g))) {
        src = trackOf(g);
        pivot = geo.origin(g);
      }
    }
    addedShapes.push({
      id,
      name: t('Glow halo'),
      d,
      fill: 'none',
      stroke: paint.halo,
      stroke_width: GLOW.stroke,
      linecap: 'round',
      layer: 'under',
      ...(pivot ? { origin: pivot } : {}),
    });
    added.push(followTrack(id, hasTransform(src) ? src : undefined, pulse));
  }

  // Glow-only shapes (lit, under the parts, moving and fading with their part)
  const extra: RigShape[] = [];
  for (const g of GLOW_SHAPES[entryId] ?? []) {
    const { with: follow, ...shape } = g;
    const src = trackOf(follow as TargetRef);
    if (
      shapes.some((s) => s.id === shape.id) ||
      (src && (out.tracks?.length ?? 0) + added.length >= TRACK_CAP)
    )
      continue;
    const pivot = geo.origin(follow as TargetRef);
    extra.push({ ...shape, name: tn(shape.name), fill: paint.fill, ...(pivot ? { origin: pivot } : {}) });
    if (src) added.push(followTrack(shape.id, src, [], true));
  }

  shapes.push(...addedShapes, ...extra);
  (out.tracks ??= []).push(...added);
  return out;
}
