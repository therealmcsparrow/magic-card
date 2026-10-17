import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * button-card v7.0.1 (commit dfa304f). Its README documents no theme variables, so the own names are the
 * `--button-card-tooltip-*` ones read with var() in src/styles.ts. The 'follows' rows are HA variables that
 * file reads; they name variables the HA groups own (index.ts merges them as alsoUsedBy).
 */
const REF = 'https://github.com/custom-cards/button-card/blob/v7.0.1/src/styles.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: string, hint: string, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['button-card-tooltip-background-color', 'color', 'Tooltip background', 'Background of tooltips.', 'own'],
  ['button-card-tooltip-content-color', 'color', 'Tooltip text colour', 'Text colour of tooltips.', 'own'],
  ['button-card-tooltip-font-size', 'size', 'Tooltip text size', 'Font size of tooltips.', 'own'],
  ['button-card-tooltip-border-radius', 'size', 'Tooltip radius', 'Corner radius of tooltips.', 'own'],
  ['button-card-tooltip-padding', 'text', 'Tooltip padding', 'Space inside tooltips.', 'own'],
  ['button-card-tooltip-max-width', 'size', 'Tooltip maximum width', 'Widest a tooltip grows.', 'own'],
  ['ha-card-border-radius', 'size', 'Card radius', 'Radius of the ripple on the icon.', 'follows'],
  ['ha-card-box-shadow', 'shadow', 'Card shadow', 'Shadow of tooltips.', 'follows'],
  ['card-background-color', 'background', 'Card background', 'Background of the loading spinner.', 'follows'],
  ['primary-text-color', 'color', 'Primary text colour', 'Tooltip text colour fallback.', 'follows'],
  ['secondary-background-color', 'background', 'Secondary background', 'Tooltip background fallback.', 'follows'],
  ['state-icon-color', 'color', 'State icon colour', 'Icon colour when an entity is inactive.', 'follows'],
];

export const BUTTON_CARD_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([name, kind, label, hint, role]): CatalogueEntry => ({
    name,
    group: 'button-card',
    source: 'button-card',
    kind,
    label,
    hint,
    default: '',
    role,
    ref: REF,
    verified: VERIFIED,
  }),
);
