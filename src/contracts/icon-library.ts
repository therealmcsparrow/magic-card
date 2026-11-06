import type { AnimationDoc, LaneId } from '../anim-studio/model';

/** Contract: animated icon library. Version 1.4.0. Exports (src/icon-anim/library.ts): LibraryEntry, ICON_LIBRARY,
 * LIBRARY_DOMAINS, libraryFor, searchLibrary, RELEASE_NOTES, isNewInRelease, ReleaseNotes, ICON_MIRROR, mirrorBadge. `domain` may also be a LIBRARY_CATEGORIES value. */

export const ICON_LIBRARY_CONTRACT_VERSION = '1.4.0';

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

/** Whether the icon flips in a right-to-left layout (mirror) or stays as drawn (keep). */
export type MirrorFlag = 'mirror' | 'keep';

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
  /** 1.4.0: absent means not set yet; the studio shows it as Not set. */
  mirror?: MirrorFlag;
}

/**
 * styleDoc(entry, style, opts?): pure, deterministic, in src/icon-anim/style.ts. `opts.id` is the document id
 * (default entry.id), `opts.color` the user's glow colour (the animation entry's Color, read when the user picks).
 * 'living' returns entry.build() with that id.
 */
export const QUIET_LANE_ORDER = ['rotate', 'y', 'x', 'scale', 'opacity'] as const;
export const QUIET = { amplitude: 0.35, slowdown: 1.25, maxRotate: 6, maxTranslate: 0.75, scale: [0.96, 1.04] } as const;
export const GLOW = { stroke: 1.5, opacity: [0.35, 0.7] } as const;
export const GLOW_CAPS = { halos: 2 } as const;
export const GLOW_FALLBACK = '#ffb300';

/**
 * What a library pick writes on the card (types.ts AnimationConfig, the module's icon entry: `anim-icon-N` or the
 * quick entry).
 */
export interface LibraryPickFields {
  library_icon?: string;
  icon_style?: Exclude<IconStyle, 'living'>;
}

/**
 * Split rules (P4-2 and the audit), enforced by one test over every entry: 1. Every rig part names at least one
 * piece, and no two parts share a piece. 2. In an entry with two or more parts, no part's pieces cover the whole
 * icon (its box differs from the icon's box), so a moving part never drags the rest along (the cctv flaw). 3.
 */
export const ICON_SPLIT_RULES_VERSION = '1.0.0';
