import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Ultra Card v3.13.3 (commit 4cb4a6c). It documents no HA theme variables (its own `--uc-*` values are
 * internal and set per card), so the group lists the HA variables src/cards/ultra-card.ts reads with var()
 * (rule 4). These name variables the HA groups own (index.ts merges them as alsoUsedBy).
 */
const REF = 'https://github.com/WJDDesigns/Ultra-Card/blob/v3.13.3/src/cards/ultra-card.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: string, hint: string];

const ROWS: Row[] = [
  ['primary-color', 'color', 'Primary colour', 'Accents and active elements.'],
  ['primary-text-color', 'color', 'Primary text colour', 'Main text.'],
  ['secondary-text-color', 'color', 'Secondary text colour', 'Muted text.'],
  ['divider-color', 'color', 'Divider colour', 'Borders and separators.'],
  ['card-background-color', 'background', 'Card background', 'Card surface.'],
  ['ha-card-background', 'background', 'Card background override', 'Takes priority over the card background.'],
  ['ha-card-border-radius', 'size', 'Card radius', 'Corner radius of the card.'],
  ['ha-card-box-shadow', 'shadow', 'Card shadow', 'Shadow of the card.'],
  ['error-color', 'color', 'Error colour', 'Error messages.'],
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
