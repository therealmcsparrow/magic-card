/*
 * Contract: theme variable catalogue. Version 1.1.0.
 *
 * Implementation: src/theme-editor/catalogue/ (one file per source: ha.ts, magic-card.ts, tile.ts,
 * mushroom.ts, bubble-card.ts, ultra-card.ts, button-card.ts; index.ts exports CATALOGUE).
 * Consumer: the theme editor's field groups, value checks and preview (same module).
 *
 * Rules (tests in tests/theme-catalogue.contract.test.ts enforce them):
 * 1. `name` is the theme key without `--`, unique across the whole catalogue (one entry per name;
 *    a variable several cards read lives in the group that owns it and lists the others in `alsoUsedBy`).
 * 2. Third-party entries (source != 'ha' and != 'magic-card') ship only with `ref` (a URL to the
 *    upstream doc or source file at a tag or commit) and `verified` (ISO date). Names nobody could
 *    verify are left out; there is no "probably" entry.
 * 3. Magic Card entries list only variables a theme can reach: HA variables the card
 *    follows, and `--mc-*` names the card reads with var() but never declares on :host
 *    (src/css/tokens.ts) or inline. A test fails when a `magic-card` entry named `mc-*` is declared
 *    in tokens.ts.
 * 4. A group is never empty. When a card documents no own theme variables, its group lists the HA
 *    variables it reads (kind 'follows'), each verified like rule 2.
 * 5. Variables a theme sets that are not in the catalogue are kept and shown in "Other" (raw row).
 *
 * Text: `label` and `hint` of an entry and the `label` of a group are MessageId, not string. The catalogue marks each text with m() (namespace 'theme-editor',
 * src/theme-editor/i18n); the editor renders it with t(). In a test or a plain build m() returns the British
 * text, so `entry.label` is still that string there. A custom variable (group Other) has no catalogue entry and
 * is shown by its name.
 */

import type { MessageId } from './i18n';

export const THEME_CATALOGUE_CONTRACT_VERSION = '1.1.0';

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
 * Field kind: decides the input and the value check.
 * - color: colour or var(); check CSS.supports('color', v) (var() always passes).
 * - background: colour or gradient (gradient strings or any CSS image); CSS.supports('background', v).
 *   The only kind that offers the Gradient switch (mc-color-picker gradient="css").
 * - size: a length (px, rem, em, %, vw, calc()); CSS.supports('width', v).
 * - number: a plain number (opacity, weight, line height); finite number.
 * - rgb: an "r, g, b" triplet (0-255 each), as Mushroom's --mush-rgb-* use.
 * - shadow: CSS.supports('box-shadow', v).
 * - border: CSS.supports('border', v).
 * - font: free text, CSS.supports('font-family', v).
 * - text: anything non-empty (no check beyond length); also the raw row.
 */
export type FieldKind = 'color' | 'background' | 'size' | 'number' | 'rgb' | 'shadow' | 'border' | 'font' | 'text';

export interface CatalogueEntry {
  /** Theme key without `--`, e.g. 'primary-color', 'mush-spacing'. */
  name: string;
  group: CatalogueGroupId;
  source: CatalogueSource;
  kind: FieldKind;
  /** Sentence-case label, e.g. 'Primary colour' (an m() id; render with t()). */
  label: MessageId;
  /** One short line: what it changes (an m() id; render with t()). */
  hint?: MessageId;
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
  label: MessageId;
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
