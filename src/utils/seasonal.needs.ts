/*
 * What magic-card.js needs at run time about seasonal scenes without loading the seasonal chunk (proj.M11, M14), so the
 * card entry need not carry the animation preset table or the scene tables (ADR 0043; plan S1a.3 step 1, S1a.4). Plain
 * data and pure functions of the card config: no imports, no hass, no date, no DOM, no chunk state.
 * tests/seasonal-needs-drift.test.ts compares the preset list with the preset table; tests/seasonal-split.test.ts the inset table with the scene table.
 *
 * The inset table is the layout reserve. A scene with border decorations (icicles, lights, a pumpkin, a vine) needs the
 * content to keep a band clear of the edge. The card renders before the chunk is there, so the band cannot wait for the
 * resolved scene (that depends on the date, the weather entity and the off switch). It comes from the config: the widest
 * band any scene the config can show would need, so the box is the same before and after the chunk lands.
 */

/** Ids of the animation presets that draw a seasonal scene: every scene name that has a preset, plus `weather` and `daynight`. */
export const SEASONAL_PRESET_IDS: readonly string[] = [
  'winter', 'spring', 'summer', 'autumn', 'christmas', 'new_year', 'valentine', 'easter', 'halloween',
  'weather', 'daynight',
  'snow', 'rain', 'storm', 'sun', 'clouds', 'fog', 'wind', 'night', 'dusk',
];

/** px per side: top, right, bottom, left. */
export type Inset = readonly [number, number, number, number];

/**
 * The band each scene's decorations keep clear (the scenes without an entry have none). Derived from
 * src/utils/seasonal-deco-insets.ts (decoInsets) and the scene table (sceneDecorations); a test compares them.
 */
export const SCENE_INSETS: Readonly<Partial<Record<string, Inset>>> = {
  winter: [20, 0, 0, 0],
  spring: [0, 0, 18, 20],
  christmas: [20, 20, 20, 20],
  halloween: [0, 0, 30, 0],
};

/** Holidays whose scene has decorations; `calendar.<holiday>: off` removes it from what `auto` can show. */
const DECORATED_HOLIDAYS = ['christmas', 'halloween'] as const;

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);
const isOff = (v: unknown): boolean => v === false || (typeof v === 'string' && v.trim().toLowerCase() === 'off');

/** Per side maximum of two bands. */
function widest(a: Inset | undefined, b: Inset | undefined): Inset | undefined {
  if (!a || !b) return a ?? b;
  return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

/** The band the card's `seasonal` setting can ask for: the widest of its scene (default auto) and its `combine` scenes. */
export function seasonalSettingInsets(setting: unknown): Inset | undefined {
  if (setting === undefined || setting === null || setting === false) return undefined;
  const cfg: Obj | undefined = setting === true ? {} : typeof setting === 'string' ? { scene: setting } : isObj(setting) ? setting : undefined;
  if (!cfg || cfg.decorations === false) return undefined;
  const combine = Array.isArray(cfg.combine) ? cfg.combine : typeof cfg.combine === 'string' ? [cfg.combine] : [];
  const calendar = isObj(cfg.calendar) ? cfg.calendar : {};
  let out: Inset | undefined;
  for (const s of [cfg.scene === undefined ? 'auto' : cfg.scene, ...combine]) {
    if (s === 'auto') {
      // the seasons come round every year; a holiday only while its calendar entry is on
      out = widest(out, widest(SCENE_INSETS.winter, SCENE_INSETS.spring));
      for (const h of DECORATED_HOLIDAYS) if (!isOff(calendar[h])) out = widest(out, SCENE_INSETS[h]);
    } else if (typeof s === 'string') out = widest(out, SCENE_INSETS[s]);
  }
  return out;
}

/** The band the seasonal presets in a design's `animations` (or its legacy `animation_preset`) can ask for. */
export function animationInsets(design: unknown): Inset | undefined {
  if (!isObj(design)) return undefined;
  let out: Inset | undefined;
  if (Array.isArray(design.animations)) {
    for (const e of design.animations) if (isObj(e) && e.decorations !== false) out = widest(out, SCENE_INSETS[str(e.preset) ?? '']);
  } else {
    out = SCENE_INSETS[str(design.animation_preset) ?? ''];
  }
  return out;
}

/**
 * Padding (px per side) an element keeps so its seasonal decorations never cover the content, from config alone:
 * the widest of its design's seasonal presets and (the card) its `seasonal` setting. Undefined: nothing to keep.
 */
export function seasonalInsets(design: unknown, seasonal?: unknown): number[] | undefined {
  const band = widest(animationInsets(design), seasonalSettingInsets(seasonal));
  return band && band.some((v) => v > 0) ? [...band] : undefined;
}
