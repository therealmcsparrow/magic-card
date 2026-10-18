import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Ultra Card v3.13.3 (commit 4cb4a6c). It documents no HA theme variables (its own `--uc-*` values are
 * internal and set per card), so the group lists the HA variables src/cards/ultra-card.ts reads with var()
 * (rule 4). These name variables the HA groups own (index.ts merges them as alsoUsedBy).
 */
const REF = 'https://github.com/WJDDesigns/Ultra-Card/blob/v3.13.3/src/cards/ultra-card.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageId, hint: MessageId];

const ROWS: Row[] = [
  ['primary-color', 'color', m('Primary colour'), m('Accents and active elements.')],
  ['primary-text-color', 'color', m('Primary text colour'), m('Main text.')],
  ['secondary-text-color', 'color', m('Secondary text colour'), m('Muted text.')],
  ['divider-color', 'color', m('Divider colour'), m('Borders and separators.')],
  ['card-background-color', 'background', m('Card background'), m('Card surface.')],
  ['ha-card-background', 'background', m('Card background override'), m('Takes priority over the card background.')],
  ['ha-card-border-radius', 'size', m('Card radius'), m('Corner radius of the card.')],
  ['ha-card-box-shadow', 'shadow', m('Card shadow'), m('Shadow of the card.')],
  ['error-color', 'color', m('Error colour'), m('Error messages.')],
];

export const ULTRA_CARD_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([name, kind, label, hint]): CatalogueEntry => ({
    name,
    group: 'ultra-card',
    source: 'ultra-card',
    kind,
    label,
    hint,
    default: '',
    role: 'follows',
    ref: REF,
    verified: VERIFIED,
  }),
);
