import { THEME_CATALOGUE_CONTRACT_VERSION } from '../../contracts/theme-catalogue';
import type { CatalogueEntry, CatalogueGroup, CatalogueGroupId, CatalogueSource, FieldKind, ThemeCatalogue } from '../../contracts/theme-catalogue';
import { m } from '../i18n';
import { HA_ENTRIES } from './ha';
import { MAGIC_CARD_ENTRIES } from './magic-card';
import { TILE_ENTRIES } from './tile';
import { MUSHROOM_ENTRIES } from './mushroom';
import { BUBBLE_CARD_ENTRIES } from './bubble-card';
import { ULTRA_CARD_ENTRIES } from './ultra-card';
import { BUTTON_CARD_ENTRIES } from './button-card';

/*
 * The theme variable catalogue (Contract theme-catalogue 1.0.0): one file per source, merged here.
 * A source lists HA variables it reads as rows with role 'follows'. Rule 1 allows one entry per
 * name, so a 'follows' row is not kept as an entry: the owner (the HA entry, or the first source
 * that lists a name HA does not) gets the source in `alsoUsedBy`, and the source's group shows it
 * through groupEntries().
 */

export const CATALOGUE_GROUPS: CatalogueGroup[] = [
  { id: 'primary', label: m('theme-editor.catalogue.primary-and-accent') },
  { id: 'backgrounds', label: m('theme-editor.catalogue.backgrounds-and-cards') },
  { id: 'text', label: m('theme-editor.catalogue.text') },
  { id: 'states', label: m('theme-editor.catalogue.states-and-alerts') },
  { id: 'sizes', label: m('theme-editor.catalogue.sizes-and-radii') },
  { id: 'chrome', label: m('theme-editor.catalogue.header-and-sidebar') },
  { id: 'magic-card', label: m('theme-editor.catalogue.magic-card'), previewTag: 'magic-card' },
  { id: 'tile', label: m('theme-editor.catalogue.tile-card'), previewTag: 'hui-tile-card' },
  { id: 'mushroom', label: m('theme-editor.catalogue.mushroom'), previewTag: 'mushroom-entity-card', resourcePattern: /mushroom/i },
  { id: 'bubble-card', label: m('theme-editor.catalogue.bubble-card'), previewTag: 'bubble-card', resourcePattern: /bubble-card/i },
  { id: 'ultra-card', label: m('theme-editor.catalogue.ultra-card'), previewTag: 'ultra-card', resourcePattern: /ultra-card/i },
  { id: 'button-card', label: m('theme-editor.catalogue.button-card'), previewTag: 'button-card', resourcePattern: /button-card/i },
  { id: 'other', label: m('theme-editor.catalogue.other') },
];

const RAW: CatalogueEntry[] = [
  ...HA_ENTRIES,
  ...MAGIC_CARD_ENTRIES,
  ...TILE_ENTRIES,
  ...MUSHROOM_ENTRIES,
  ...BUBBLE_CARD_ENTRIES,
  ...ULTRA_CARD_ENTRIES,
  ...BUTTON_CARD_ENTRIES,
];

/** Merge 'follows' rows into their owners (see the header). The inputs are not changed. */
export function mergeEntries(raw: readonly CatalogueEntry[]): CatalogueEntry[] {
  const owners: CatalogueEntry[] = raw.filter((e) => e.role !== 'follows').map((e) => ({ ...e }));
  for (const f of raw) {
    if (f.role !== 'follows') continue;
    let owner = owners.find((e) => e.name === f.name);
    if (!owner) {
      owner = { ...f, role: 'own' };
      owners.push(owner);
      continue;
    }
    if (owner.source !== f.source && !owner.alsoUsedBy?.includes(f.source)) owner.alsoUsedBy = [...(owner.alsoUsedBy ?? []), f.source];
  }
  return owners;
}

export const CATALOGUE: ThemeCatalogue = {
  version: THEME_CATALOGUE_CONTRACT_VERSION,
  groups: CATALOGUE_GROUPS,
  entries: mergeEntries(RAW),
};

const BY_NAME = new Map(CATALOGUE.entries.map((e) => [e.name, e]));

export const entryByName = (name: string): CatalogueEntry | undefined => BY_NAME.get(name);

/** The field kind of a variable name; undefined for names the catalogue does not know (they are "Other"). */
export const kindOf = (name: string): FieldKind | undefined => BY_NAME.get(name)?.kind;

/** Group id -> the source that "follows" rows of that group are attributed to (card groups only). */
const SOURCE_OF_GROUP: Partial<Record<CatalogueGroupId, CatalogueSource>> = {
  'magic-card': 'magic-card',
  tile: 'tile',
  mushroom: 'mushroom',
  'bubble-card': 'bubble-card',
  'ultra-card': 'ultra-card',
  'button-card': 'button-card',
};

export interface GroupRow {
  entry: CatalogueEntry;
  /** True when the group's card reads a variable another group owns (shown after the card's own). */
  follows: boolean;
}

/** What a group shows: its own entries first, then (card groups) the variables its card follows. */
export function groupEntries(id: CatalogueGroupId): GroupRow[] {
  const own = CATALOGUE.entries.filter((e) => e.group === id).map((entry) => ({ entry, follows: false }));
  const source = SOURCE_OF_GROUP[id];
  if (!source) return own;
  const followed = CATALOGUE.entries.filter((e) => e.group !== id && e.alsoUsedBy?.includes(source)).map((entry) => ({ entry, follows: true }));
  return [...own, ...followed];
}
