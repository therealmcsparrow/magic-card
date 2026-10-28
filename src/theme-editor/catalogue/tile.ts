import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { FieldKind } from '../../contracts/theme-catalogue';
import type { MarkedEntry } from '../model';

/**
 * Tile card: home-assistant/frontend tag 20260930.4 (commit 26690e0). The `--ha-tile-*` names are documented
 * as @cssprop in src/components/tile/ha-tile-icon.ts and ha-tile-info.ts. The tile colour itself follows
 * the HA state colours (ha group), so nothing else is listed here.
 */
const BASE = 'https://github.com/home-assistant/frontend/blob/20260930.4/src/components/tile/';
const VERIFIED = '2026-10-17';

type Row = [file: string, name: string, kind: FieldKind, label: MessageIndex, def: string, hint: MessageIndex];

const ROWS: Row[] = [
  ['ha-tile-icon.ts', 'ha-tile-icon-border-radius', 'size', m('theme-editor.tile.icon-radius'), 'var(--ha-border-radius-pill)', m('theme-editor.tile.corner-radius-of-the-tile-icon')],
  ['ha-tile-info.ts', 'ha-tile-info-gap', 'size', m('theme-editor.tile.text-gap'), '0', m('theme-editor.tile.vertical-gap-between-primary-and')],
  ['ha-tile-info.ts', 'ha-tile-info-min-height', 'size', m('theme-editor.tile.text-block-minimum-height'), 'auto', m('theme-editor.tile.reserves-room-for-a-missing-secondary')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-min-height', 'size', m('theme-editor.tile.primary-text-minimum-height'), 'auto', m('theme-editor.tile.keeps-tiles-that-never-wrap-level-with')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-size', 'size', m('theme-editor.tile.primary-text-size'), 'var(--ha-font-size-m)', m('theme-editor.tile.font-size-of-the-primary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-font-weight', 'text', m('theme-editor.tile.primary-text-weight'), 'var(--ha-font-weight-medium)', m('theme-editor.tile.font-weight-of-the-primary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-line-height', 'size', m('theme-editor.tile.primary-line-height'), 'var(--ha-line-height-normal)', m('theme-editor.tile.line-height-of-the-primary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-letter-spacing', 'size', m('theme-editor.tile.primary-letter-spacing'), '0.1px', m('theme-editor.tile.letter-spacing-of-the-primary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-primary-color', 'color', m('theme-editor.tile.primary-text-colour'), 'var(--primary-text-color)', m('theme-editor.tile.colour-of-the-primary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-size', 'size', m('theme-editor.tile.secondary-text-size'), 'var(--ha-font-size-s)', m('theme-editor.tile.font-size-of-the-secondary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-font-weight', 'text', m('theme-editor.tile.secondary-text-weight'), 'var(--ha-font-weight-normal)', m('theme-editor.tile.font-weight-of-the-secondary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-line-height', 'size', m('theme-editor.tile.secondary-line-height'), 'var(--ha-line-height-condensed)', m('theme-editor.tile.line-height-of-the-secondary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-letter-spacing', 'size', m('theme-editor.tile.secondary-letter-spacing'), '0.4px', m('theme-editor.tile.letter-spacing-of-the-secondary-text')],
  ['ha-tile-info.ts', 'ha-tile-info-secondary-color', 'color', m('theme-editor.tile.secondary-text-colour'), 'var(--primary-text-color)', m('theme-editor.tile.colour-of-the-secondary-text')],
];

export const TILE_ENTRIES: MarkedEntry[] = ROWS.map(
  ([file, name, kind, label, def, hint]): MarkedEntry => ({
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
