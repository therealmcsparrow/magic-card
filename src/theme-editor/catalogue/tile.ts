import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Tile card: home-assistant/frontend tag 20260930.4 (commit 26690e0). The `--ha-tile-*` names are documented
 * as @cssprop in src/components/tile/ha-tile-icon.ts and ha-tile-info.ts. The tile colour itself follows
 * the HA state colours (ha group), so nothing else is listed here.
 */
const BASE = 'https://github.com/home-assistant/frontend/blob/20260930.4/src/components/tile/';
const VERIFIED = '2026-10-17';

type Row = [file: string, name: string, kind: FieldKind, label: MessageId, def: string, hint: MessageId];

const ROWS: Row[] = [
  ['ha-tile-icon.ts', 'ha-tile-icon-border-radius', 'size', m('Icon radius'), 'var(--ha-border-radius-pill)', m('Corner radius of the tile icon.')],
  ['ha-tile-info.ts', 'ha-tile-info-gap', 'size', m('Text gap'), '0', m('Vertical gap between primary and secondary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-min-height', 'size', m('Text block minimum height'), 'auto', m('Reserves room for a missing secondary line.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-min-height', 'size', m('Primary text minimum height'), 'auto', m('Keeps tiles that never wrap level with ones that do.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-size', 'size', m('Primary text size'), 'var(--ha-font-size-m)', m('Font size of the primary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-weight', 'text', m('Primary text weight'), 'var(--ha-font-weight-medium)', m('Font weight of the primary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-line-height', 'size', m('Primary line height'), 'var(--ha-line-height-normal)', m('Line height of the primary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-letter-spacing', 'size', m('Primary letter spacing'), '0.1px', m('Letter spacing of the primary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-color', 'color', m('Primary text colour'), 'var(--primary-text-color)', m('Colour of the primary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-size', 'size', m('Secondary text size'), 'var(--ha-font-size-s)', m('Font size of the secondary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-weight', 'text', m('Secondary text weight'), 'var(--ha-font-weight-normal)', m('Font weight of the secondary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-line-height', 'size', m('Secondary line height'), 'var(--ha-line-height-condensed)', m('Line height of the secondary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-letter-spacing', 'size', m('Secondary letter spacing'), '0.4px', m('Letter spacing of the secondary text.')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-color', 'color', m('Secondary text colour'), 'var(--primary-text-color)', m('Colour of the secondary text.')],
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
