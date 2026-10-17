import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Bubble Card v3.4.2 (commit 91a5c77). The first ten names are the "Global CSS variables" table in README.md;
 * the rest are read with var() in the source file named in each row.
 */
const BASE = 'https://github.com/Clooos/Bubble-Card/blob/v3.4.2/';
const README = `${BASE}README.md`;
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: string, hint: string, ref: string];

const ROWS: Row[] = [
  ['bubble-border-radius', 'size', 'Corner radius', 'Radius for every Bubble element.', README],
  ['bubble-main-background-color', 'background', 'Main background', 'Main background of every Bubble element.', README],
  ['bubble-secondary-background-color', 'background', 'Secondary background', 'Secondary background of every Bubble element.', README],
  ['bubble-accent-color', 'color', 'Accent colour', 'Accent for active states and sliders.', README],
  ['bubble-icon-border-radius', 'size', 'Icon radius', 'Corner radius of icons.', README],
  ['bubble-icon-background-color', 'background', 'Icon background', 'Background behind icons.', README],
  ['bubble-sub-button-border-radius', 'size', 'Sub-button radius', 'Corner radius of sub-buttons.', README],
  ['bubble-sub-button-background-color', 'background', 'Sub-button background', 'Background of sub-buttons.', README],
  ['bubble-box-shadow', 'shadow', 'Shadow', 'Box shadow of Bubble cards.', README],
  ['bubble-border', 'border', 'Border', 'Border of Bubble cards.', README],
  ['bubble-button-main-background-color', 'background', 'Button card background', 'Main background of button cards.', `${BASE}src/cards/button/styles.css`],
  ['bubble-button-border-radius', 'size', 'Button card radius', 'Corner radius of button cards.', `${BASE}src/cards/button/styles.css`],
  ['bubble-light-color', 'color', 'Light colour', 'Fill colour for light sliders.', `${BASE}src/components/slider/styles.css`],
  ['bubble-pop-up-background-color', 'background', 'Pop-up background', 'Background of pop-ups.', `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-pop-up-border-radius', 'size', 'Pop-up radius', 'Corner radius of pop-ups.', `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-backdrop-background-color', 'color', 'Pop-up backdrop colour', 'Colour of the dimmed area behind a pop-up.', `${BASE}src/cards/pop-up/backdrop.css`],
];

export const BUBBLE_CARD_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([name, kind, label, hint, ref]): CatalogueEntry => ({
    name,
    group: 'bubble-card',
    source: 'bubble-card',
    kind,
    label,
    hint,
    default: '',
    role: 'own',
    ref,
    verified: VERIFIED,
  }),
);
