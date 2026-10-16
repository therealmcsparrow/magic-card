import type { AnimationDoc, LaneId } from '../anim-studio/model';

/*
 * Contract: animated icon library. Version 1.2.0 (Architect-owned).
 *
 * 1.0.0 is what shipped in 2026.10.03 (src/icon-anim/library.ts LibraryEntry, ICON_LIBRARY,
 * LIBRARY_DOMAINS, libraryFor, searchLibrary). 1.1.0 is additive: `domain` may also be one of
 * LIBRARY_CATEGORIES for icons without a Home Assistant domain, and every entry must pass the
 * split rules below. 1.2.0 is additive: every entry plays in three Styles (Quiet, Living, Glow),
 * all derived from its one Living rig by styleDoc() (ADR 0006), plus the card-entry fields that
 * record a library pick. library.ts re-exports LibraryEntry from here.
 *
 * Implementation: module `icon-library` (src/icon-anim/library.ts and its data files, the style
 * derivation in src/icon-anim/style.ts). Placement is unchanged: the studio's lazy chunk
 * magic-card-icon-library.js and the card editor's lazy chunk magic-card-icon-animator.js. Never
 * magic-card.js: a card stores the derived document inline and plays it like any other.
 * Consumers: the icon animator (Animate icon), the animated icon grid (icon picker tab), the
 * studio's icon start (Living only in this run).
 */

export const ICON_LIBRARY_CONTRACT_VERSION = '1.2.0';

/** Pseudo-domains for icons no Home Assistant domain fits (the filter shows them like domains). */
export const LIBRARY_CATEGORIES = ['animal', 'seasonal', 'transport', 'maker', 'workplace', 'household'] as const;
export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

/** Quiet = direction A, Living = direction B (the rig as drawn), Glow = direction C. */
export const ICON_STYLES = ['quiet', 'living', 'glow'] as const;
export type IconStyle = (typeof ICON_STYLES)[number];
export const DEFAULT_ICON_STYLE: IconStyle = 'living';

/** Optional per-entry hints for the derivation. Without them the defaults below apply. */
export interface IconStyleHints {
  /** Quiet: the one part and lane that keep moving (default: the first part track, its first lane in QUIET_LANE_ORDER). */
  quiet?: { part?: string; lane?: Extract<LaneId, 'rotate' | 'x' | 'y' | 'scale' | 'opacity'> };
  /**
   * Glow: up to GLOW_CAPS.halos part ids that get a halo (default: the first part with a track),
   * and the glow colour (default: the theme glow of the entry's category, else GLOW_FALLBACK).
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
 * styleDoc(entry, style): pure, deterministic, in src/icon-anim/style.ts. 'living' returns
 * entry.build() unchanged. The result must pass validateAnimationDoc strict and stay under
 * ANIMATION_CAPS (one test runs every entry x every style).
 *
 * Quiet (derived from Living):
 * - Only one track keeps moving (hints.quiet.part, else the first part track); every other part,
 *   group and shape track and the top-level keyframes are dropped. Shapes stay, still.
 * - That track keeps one lane (hints.quiet.lane, else the first of QUIET_LANE_ORDER it animates);
 *   its offsets are scaled by QUIET.amplitude around the rest value and clamped to QUIET caps.
 * - duration x QUIET.slowdown; easing 'ease-in-out' per keyframe; event rests (last 40 %) kept.
 *
 * Glow (derived from Living):
 * - Living as is, plus one halo RigShape per glow part (at most GLOW_CAPS.halos), id
 *   `glow-<part id>`, layer 'under', d = the part's geometry (its own path, or its subpaths cut from
 *   the icon), fill 'none', stroke = glow colour, stroke_width GLOW.stroke, linecap 'round',
 *   origin = the part's origin.
 * - A track on `shape:glow-<part id>` copies the part's transform keyframes (so the halo moves with
 *   it) and adds an opacity lane GLOW.opacity[0] -> [1] -> [0] over the cycle.
 * - No CSS filter or blur anywhere (tablet CPU; the brand artist's objection to direction C).
 * - An existing accent RigShape (baubles, laser spark) takes the glow colour as fill.
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
 * Changing the Style rebuilds the inline document in place (same id) from library_icon. Animate
 * icon's Apply after a manual edit removes both fields: the document is now the user's own and the
 * Style control hides for it.
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
