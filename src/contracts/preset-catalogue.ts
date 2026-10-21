import type { AnimationDoc } from '../anim-studio/model';
import type { AnimationGroup } from '../utils/animation-presets';

/*
 * Contract: preset catalogue and preset tiles. Version 1.1.0.
 *
 * Implementation: module `preset-catalogue` (src/preset-catalogue/, lazy chunk
 * dist/magic-card-preset-catalogue.js, webpackChunkName "preset-catalogue" in both loaders).
 * Never part of magic-card.js or the studio entry.
 * Consumers:
 * - the studio's preset tile grid (module `preset-tiles`, src/anim-studio/preset-grid.ts), loaded
 *   via src/anim-studio/preset-catalogue-loader.ts when the "Customise a preset" dialog opens;
 * - 1.1.0: the card editor's Animations preset dropdown (src/editor/components/animation-list.ts),
 *   loaded via src/editor/components/preset-catalogue-loader.ts when the list connects (editor
 *   only; dashboards never load it).
 *
 * A catalogue preset is a ready animation document, not a new built-in preset id.
 * - Studio pick: copies the document into My animations under uniqueId(presetDocId(entry.id)),
 *   cards play it as `preset: custom:<id>` (needs the Magic Card Utils integration).
 * - Card editor pick (1.1.0): stores the document inline in the card's `custom_animations` under
 *   catalogueDocId(entry.id) and the entry plays `preset: custom:cat-<entry id>`. Works without the
 *   integration; dashboards resolve it through the existing inline path (and the particles chunk
 *   for docs with `sim`). Later catalogue changes do not reach cards already holding a copy.
 *
 * Chunk rule (1.1.0): the chunk is loaded by both bundles, so src/preset-catalogue/ imports types
 * only (plus its own files). No runtime import of model.ts, from-preset.ts or anything else either
 * bundle holds: such a module would be copied into the chunk or stop being scope-hoisted into
 * magic-card.js. dist/ holds exactly one magic-card-preset-catalogue.js.
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
 * Dropdown rules (animation-list.ts):
 * - Options: value `custom:cat-<entry id>`, label entry.name; an entry of 'Light & colour' joins the
 *   built-in optgroup, the others form one optgroup per CatalogueGroup after the built-in groups.
 *   Until the chunk resolves (or if it fails) only built-ins and My animations show; a stored
 *   `custom:cat-*` value shows its id as the label meanwhile, never "(not found)".
 * - Picking an option the entry does not already play calls applyCataloguePick (icon-animator
 *   chunk, loader.ts host pattern): build(), id = catalogueDocId, validate strict (v2 + sim), write
 *   the module's list (its own undo step), then upsert the inline document folded into that step.
 *   One card holds one copy per catalogue entry, shared by every entry playing it; an existing
 *   inline `cat-<id>` copy is kept as is. On a template-linked card the module's animations get
 *   not_synced like pickAnimatedIcon. Outside the card editor (no card state) nothing is written.
 * - The entry's fields (colour, strength, timing) take their defaults from the stored inline copy,
 *   else entry.build() (memoised per id).
 * - Orphans: an inline `cat-*` document no entry references any more is pruned like `quick-*`
 *   (quick-model pruned(); editor-state's followIcons trigger also matches `custom:cat-`, in the
 *   previous or the next config).
 * Library lookup still wins over inline for the same id (magic-card.ts _customLookup, unchanged).
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
