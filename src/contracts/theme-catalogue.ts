// Contract: theme variable catalogue. Version 1.2.0. Implementation: src/theme-editor/catalogue/ (one file per
// source: ha.ts, magic-card.ts, tile.ts, mushroom.ts, bubble-card.ts, ultra-card.ts, button-card.ts; index.ts
// exports CATALOGUE). Consumer: the theme editor's field groups, value checks and preview (same module).

import type { MessageIndex } from './i18n';

export const THEME_CATALOGUE_CONTRACT_VERSION = '1.2.0';

export type CatalogueSource = 'ha' | 'magic-card' | 'tile' | 'mushroom' | 'bubble-card' | 'ultra-card' | 'button-card';

/** HA groups first, then one group per card source. */
export type CatalogueGroupId =
  | 'primary'      // Primary and accent
  | 'backgrounds'  // Backgrounds and cards
  | 'text'         // Text
  | 'states'       // States and alerts
  | 'sizes'        // Sizes and radii
  | 'chrome'       // Header and sidebar
  | 'other'        // Other (raw rows, unknown keys)
  | 'magic-card'
  | 'tile'
  | 'mushroom'
  | 'bubble-card'
  | 'ultra-card'
  | 'button-card';

/**
 * Field kind: decides the input and the value check. - color: colour or var(); check CSS.supports('color', v)
 * (var() always passes). - background: colour or gradient (gradient strings or any CSS image);
 * CSS.supports('background', v).
 */
export type FieldKind = 'color' | 'background' | 'size' | 'number' | 'rgb' | 'shadow' | 'border' | 'font' | 'text';

export interface CatalogueEntry {
  /** Theme key without `--`, e.g. 'primary-color', 'mush-spacing'. */
  name: string;
  group: CatalogueGroupId;
  source: CatalogueSource;
  kind: FieldKind;
  /** Sentence-case label, e.g. 'Primary colour' (an m() id; render with t()). */
  label: MessageIndex;
  /** One short line: what it changes (an m() id; render with t()). */
  hint?: MessageIndex;
  /** HA's (or the card's) default, for placeholders and the Reset button; '' when it has none. */
  default?: string;
  /** 'own': the source defines it. 'follows': an HA variable this card reads (rule 4). */
  role?: 'own' | 'follows';
  /** Other sources that also read this variable (labels in the field's hint). */
  alsoUsedBy?: CatalogueSource[];
  /** Required for third-party sources: upstream doc or source URL at a tag/commit. */
  ref?: string;
  /** Required for third-party sources: ISO date the name was checked against `ref`. */
  verified?: string;
}

export interface CatalogueGroup {
  id: CatalogueGroupId;
  label: MessageIndex;
  /** For card groups: the custom element that must be defined for a live preview (else "preview not available"). */
  previewTag?: string;
  /** For card groups: dashboard resource URL pattern the preview may load on request. */
  resourcePattern?: RegExp;
}

export interface ThemeCatalogue {
  version: typeof THEME_CATALOGUE_CONTRACT_VERSION;
  groups: CatalogueGroup[];
  entries: CatalogueEntry[];
}

/** Variable name rule for raw rows and keys sent to the backend (theme-files 1.0.0). */
export const THEME_VAR_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/;
