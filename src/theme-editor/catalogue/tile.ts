import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Tile card: home-assistant/frontend tag 20260930.4 (commit 26690e0). The `--ha-tile-*` names are documented
 * as @cssprop in src/components/tile/ha-tile-icon.ts and ha-tile-info.ts. The tile colour itself follows
 * the HA state colours (ha group), so nothing else is listed here.
 */
const BASE = 'https://github.com/home-assistant/frontend/blob/20260930.4/src/components/tile/';
const VERIFIED = '2026-10-17';

type Row = [file: string, name: string, kind: FieldKind, label: string, def: string, hint: string];

const ROWS: Row[] = [
  ['ha-tile-icon.ts', 'ha-tile-icon-border-radius', 'size', 'Icon radius', 'var(--ha-border-radius-pill)', 'Corner radius of the tile icon.'],
  ['ha-tile-info.ts', 'ha-tile-info-gap', 'size', 'Text gap', '0', 'Vertical gap between primary and secondary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-min-height', 'size', 'Text block minimum height', 'auto', 'Reserves room for a missing secondary line.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-min-height', 'size', 'Primary text minimum height', 'auto', 'Keeps tiles that never wrap level with ones that do.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-size', 'size', 'Primary text size', 'var(--ha-font-size-m)', 'Font size of the primary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-weight', 'text', 'Primary text weight', 'var(--ha-font-weight-medium)', 'Font weight of the primary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-line-height', 'size', 'Primary line height', 'var(--ha-line-height-normal)', 'Line height of the primary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-letter-spacing', 'size', 'Primary letter spacing', '0.1px', 'Letter spacing of the primary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-primary-color', 'color', 'Primary text colour', 'var(--primary-text-color)', 'Colour of the primary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-size', 'size', 'Secondary text size', 'var(--ha-font-size-s)', 'Font size of the secondary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-weight', 'text', 'Secondary text weight', 'var(--ha-font-weight-normal)', 'Font weight of the secondary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-line-height', 'size', 'Secondary line height', 'var(--ha-line-height-condensed)', 'Line height of the secondary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-letter-spacing', 'size', 'Secondary letter spacing', '0.4px', 'Letter spacing of the secondary text.'],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-color', 'color', 'Secondary text colour', 'var(--primary-text-color)', 'Colour of the secondary text.'],
];

export const TILE_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([file, name, kind, label, def, hint]): CatalogueEntry => ({
    name,
    group: 'tile',
    source: 'tile',
    kind,
    label,
    hint,
    default: def,
    role: 'own',
    ref: BASE + file,
    verified: VERIFIED,
  }),
);
