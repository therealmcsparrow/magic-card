import type { AnimationDoc } from '../anim-studio/model';
import type { AnimationGroup } from '../utils/animation-presets';

/**
 * Contract: preset catalogue and preset tiles. Version 1.1.0. Implementation: module `preset-catalogue`
 * (src/preset-catalogue/, lazy chunk dist/magic-card-preset-catalogue.js, webpackChunkName "preset-catalogue" in
 * both loaders). Never part of magic-card.js or the studio entry.
 */

export const PRESET_CATALOGUE_CONTRACT_VERSION = '1.1.0';

/** New groups; 'Light & colour' is the existing built-in group (light presets join it). */
export type CatalogueGroup = 'Fire & heat' | 'Cleaning' | 'Christmas' | 'Halloween' | 'Valentine' | 'Home automation' | 'Light & colour';
export const CATALOGUE_GROUPS: CatalogueGroup[] = ['Fire & heat', 'Cleaning', 'Christmas', 'Halloween', 'Valentine', 'Home automation', 'Light & colour'];

export interface CataloguePreset {
  /** Unique across built-in preset ids and the catalogue; [a-z0-9-], at most 60 characters (the cat- prefix fits the 64 id cap). Never renamed once shipped. */
  id: string;
  name: string;
  group: CatalogueGroup;
  /** Extra search words. */
  tags: string[];
  /** Tile stays still until hover / focus (P1-3): heavy scenes, live particles. */
  heavy?: boolean;
  /** A suggested icon for the tile's mini card (default: the studio's preview icon). */
  icon?: string;
  /**
   * The document (exactly one). Must pass validateAnimationDoc strictly, and its particles `sim`
   * must pass validateSim strictly; tests enforce both for every entry. Its `id` is a template id:
   * the consumer replaces it (studio: uniqueId(presetDocId(entry.id), taken); card editor:
   * catalogueDocId(entry.id)).
   */
  build(): AnimationDoc;
}

/** The chunk's public surface (src/preset-catalogue/index.ts). Both loaders resolve to this. */
export interface PresetCatalogueModule {
  version: typeof PRESET_CATALOGUE_CONTRACT_VERSION;
  CATALOGUE: CataloguePreset[];
}

// ── card editor (1.1.0) ──

/** Inline document ids of catalogue picks in a card. Reserved: no other writer uses this prefix. */
export const CATALOGUE_DOC_PREFIX = 'cat-';
export const catalogueDocId = (entryId: string): string => `${CATALOGUE_DOC_PREFIX}${entryId}`;

/**
 * Card editor loader (src/editor/components/preset-catalogue-loader.ts, in magic-card.js, keep it
 * tiny): one shared promise; resolves undefined on failure (console.warn, retried on the next call).
 */
export type LoadCatalogue = () => Promise<PresetCatalogueModule | undefined>;

/**
 * Dropdown rules (animation-list.ts): - Options: value `custom:cat-<entry id>`, label entry.name; an entry of
 * 'Light & colour' joins the built-in optgroup, the others form one optgroup per CatalogueGroup after the built-in
 * groups.
 */
export const CATALOGUE_DROPDOWN_RULES_VERSION = '1.0.0';

// ── tiles (studio-internal Contract between the dialog and the tile grid) ──

/** What one tile shows: a built-in preset (through docFromPreset) or a catalogue preset. */
export type PresetTileSource =
  | { kind: 'builtin'; id: string; name: string; group: AnimationGroup; tap: boolean; heavy: boolean }
  | { kind: 'catalogue'; entry: CataloguePreset };

/**
 * <mc-preset-grid> emits `preset-pick` (bubbling, composed) with this detail on click, Enter or
 * Space. The dialog does exactly what the old chip did: builtin -> docFromPreset; catalogue ->
 * entry.build() with a unique id. The grid never writes anything itself.
 */
export interface PresetPickDetail {
  source: PresetTileSource;
}

/** Tile rules (P1-1..P1-4): play only while on screen; `tap` and `heavy` tiles still until hover or focus; prefers-reduced-motion: all still; live particle docs preview their bake. */
export const PRESET_TILE_RULES_VERSION = '1.0.0';
