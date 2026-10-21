import type { AnimationDoc, LaneId } from '../anim-studio/model';

/*
 * Contract: animated icon library. Version 1.2.1.
 *
 * Exports (src/icon-anim/library.ts): LibraryEntry, ICON_LIBRARY, LIBRARY_DOMAINS, libraryFor,
 * searchLibrary. `domain` may also be one of LIBRARY_CATEGORIES for icons without a Home Assistant
 * domain, and every entry must pass the split rules below. Every entry plays in three Styles
 * (Quiet, Living, Glow), all derived from its one Living rig by styleDoc(), plus the card-entry
 * fields that record a library pick. The Style text below describes the derivation (hero choice,
 * spins, accents, card-aware colours, the styleDoc options, the hand-edit rule). library.ts
 * re-exports LibraryEntry from here.
 *
 * Implementation: module `icon-library` (src/icon-anim/library.ts and its data files, the style
 * derivation in src/icon-anim/style.ts). Placement is unchanged: the studio's lazy chunk
 * magic-card-icon-library.js and the card editor's lazy chunk magic-card-icon-animator.js. Never
 * magic-card.js: a card stores the derived document inline and plays it like any other.
 * Consumers: the animated icon grid (the icon picker's Animated icons tab, the only place the
 * Style control lives) and the studio's icon start (Living only).
 */

export const ICON_LIBRARY_CONTRACT_VERSION = '1.2.1';

/** Pseudo-domains for icons no Home Assistant domain fits (the filter shows them like domains). */
export const LIBRARY_CATEGORIES = ['animal', 'seasonal', 'transport', 'maker', 'workplace', 'household'] as const;
export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

/** Quiet = direction A, Living = direction B (the rig as drawn), Glow = direction C. */
export const ICON_STYLES = ['quiet', 'living', 'glow'] as const;
export type IconStyle = (typeof ICON_STYLES)[number];
export const DEFAULT_ICON_STYLE: IconStyle = 'living';

/** Optional per-entry hints for the derivation. Without them the defaults below apply. */
export interface IconStyleHints {
  /** Quiet: the one target and lane that keep moving (default: chosen as described at styleDoc). */
  quiet?: { part?: string; lane?: Extract<LaneId, 'rotate' | 'x' | 'y' | 'scale' | 'opacity'> };
  /**
   * Glow: `parts` = the accent list (part or group ids, `shape:<id>` for a drawn shape): the parts
   * that carry light, fire, heat, energy, signal or magic. They take the glow colour; halos go on
   * some of them (see styleDoc). `color` = the theme's glow colour on dark cards (default
   * GLOW_FALLBACK); its light-card partner comes from the brand artist's theme_on_light table.
   */
  glow?: { parts?: string[]; color?: string };
}

export interface LibraryEntry {
  /** Unique, [a-z0-9-]. Never renamed once shipped (cards store it in `library_icon`). */
  id: string;
  /** Search name shown on the tile. */
  name: string;
  /** Home Assistant domain the entry suits first, or a LibraryCategory. Others go in `tags`. */
  domain: string;
  icon: string;
  tags: string[];
  /** The Living rig: a keyframes document with a rig; validateAnimationDoc strict must pass. */
  build(): AnimationDoc;
  /** 1.2.0: derivation hints (brand artist supplies them in p4-spec.json where the default looks wrong). */
  styles?: IconStyleHints;
}

/**
 * styleDoc(entry, style, opts?): pure, deterministic, in src/icon-anim/style.ts. `opts.id` is the
 * document id (default entry.id), `opts.color` the user's glow colour (the animation entry's Color,
 * read when the user picks). 'living' returns entry.build() with that id. The result must pass
 * validateAnimationDoc strict and stay under ANIMATION_CAPS (one test runs every entry x style).
 *
 * Quiet (derived from Living; the brand artist's p4-spec.json `styles.quiet`):
 * - Only one track keeps moving and keeps one lane. Hero: hints.quiet.part, else a spin (a rotate
 *   track turning whole turns), else the target with the largest peak displacement in icon units
 *   (flips rank last; within 10 % the larger box wins, so a group beats its members). Lane:
 *   hints.quiet.lane, else the hero's largest channel (ties: QUIET_LANE_ORDER, then scale_x/y and
 *   skew). Nothing moving: the deepest opacity, then draw, change; only colour: the first colour track.
 * - Every other track, the top-level keyframes, clips and bindings are dropped. Shapes stay, still.
 * - Offsets scale by min(QUIET.amplitude, 0.3 units / peak) around the rest value, clamped to
 *   QUIET (skew like rotate); opacity and draw become 0.7 + 0.3 x value. A spin is not scaled: it
 *   keeps its whole turns at half speed (duration x 2).
 * - duration max(x QUIET.slowdown, 1.6 s); the document and every key ease 'ease-in-out', except
 *   linear keys (spins, sampled curves), which stay linear; every key keeps its place.
 *
 * Glow (derived from Living; `styles.glow`):
 * - Living's motion as is. Accent targets (hints.glow.parts) take the glow colour as `fill`
 *   (shapes) or as a constant colour lane on their track (a target with its own colour keys, such
 *   as flames, keeps them).
 * - Halos: at most GLOW_CAPS.halos RigShapes `glow-<target id>`, layer 'under', d = the target's
 *   geometry (its subpaths cut from the icon), fill 'none', stroke = the halo colour (below),
 *   stroke_width GLOW.stroke, linecap 'round', origin = the target's pivot. The largest accent
 *   part or group gets one; a second only when there are exactly two accents of similar size
 *   (half the area or more). No accent part: the first part with a track.
 * - A track on `shape:glow-<id>` copies the motion of the target (its transform and draw keys and
 *   path; a part that holds still in a moving group copies the group, with the group's pivot) and
 *   adds an opacity lane GLOW.opacity[0] -> [1] -> [0] over the cycle.
 * - Glow-only shapes (the jack-o'-lantern's face light) are added in the glow colour, under the
 *   parts, moving and fading with their part.
 * - Colour, fixed when picked: opts.color (a plain #hex or rgb() colour), else the theme pair, else
 *   GLOW_FALLBACK's pair. Light or dark is the card background's brightness, read in CSS with a
 *   relative colour (`rgb(from <background> ...)`) from --mc-glow-bg (set by the editor's tiles),
 *   else --ha-card-background, else --card-background-color: the variables Home Assistant's light
 *   and dark mode set, so no card code runs and a theme change applies at once. Dark card: the
 *   glow colour, halo in it. Light card (brightness above about 0.6): the darker colour (the
 *   theme_on_light partner, or 70 % of the user's colour) and transparent halos. A browser
 *   without relative colours draws no halo and no accent colour: Glow then looks like Living.
 * - No CSS filter or blur anywhere (tablet CPU).
 * - Not built (they need code on the dashboard): a radial bloom, glow only while the entity is active, and the 2:1 contrast step.
 * - Reduced motion: the card's existing rule holds the rest pose; the halo stays at GLOW.opacity[0].
 */
export const QUIET_LANE_ORDER = ['rotate', 'y', 'x', 'scale', 'opacity'] as const;
export const QUIET = { amplitude: 0.35, slowdown: 1.25, maxRotate: 6, maxTranslate: 0.75, scale: [0.96, 1.04] } as const;
export const GLOW = { stroke: 1.5, opacity: [0.35, 0.7] } as const;
export const GLOW_CAPS = { halos: 2 } as const;
export const GLOW_FALLBACK = '#ffb300';

/**
 * What a library pick writes on the card (types.ts AnimationConfig, the module's icon entry:
 * `anim-icon-N` or the quick entry). Editor metadata only: the card renderer ignores both fields
 * and plays the inline derived document (`custom_animations`, id `quick-icon-*`), so dashboards and
 * cards without the Magic Card Utils integration need nothing new.
 * - `library_icon`: the entry id the inline document was derived from. currentIconPick reads it
 *   first and falls back to the old name match for 2026.10.03 configs.
 * - `icon_style`: 'quiet' | 'glow'; absent means 'living' (so existing configs mean Living).
 * Changing the Style (icon picker, Animated icons tab) rebuilds the inline document in place (same
 * id) from library_icon. The entry counts as a library pick only while its stored document equals
 * styleDoc(entry, icon_style ?? 'living', { id }) (ignoring `name` and the picked glow colour). A
 * document edited by hand (YAML, the animation studio) is the user's own: no tile is marked and the
 * Style switch does not rebuild it, it follows the module's icon like any own animation, and the
 * editor removes both fields when it next writes that module (an icon follow or a new pick).
 */
export interface LibraryPickFields {
  library_icon?: string;
  icon_style?: Exclude<IconStyle, 'living'>;
}

/**
 * Split rules (P4-2 and the audit), enforced by one test over every entry:
 * 1. Every rig part names at least one piece, and no two parts share a piece.
 * 2. In an entry with two or more parts, no part's pieces cover the whole icon (its box differs
 *    from the icon's box), so a moving part never drags the rest along (the cctv flaw).
 * 3. A part whose track rotates has its pivot inside or on the edge of its own pieces' box.
 * 4. Where MDI draws the moving piece in one outline with the rest (cctv, the lock's shackle), the
 *    entry uses `own` paths cut from the MDI path so the moving piece is its own element.
 */
export const ICON_SPLIT_RULES_VERSION = '1.0.0';
