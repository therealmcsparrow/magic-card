import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Bubble Card v3.4.2 (commit 91a5c77). The first ten names are the "Global CSS variables" table in README.md;
 * the rest are read with var() in the source file named in each row.
 */
const BASE = 'https://github.com/Clooos/Bubble-Card/blob/v3.4.2/';
const README = `${BASE}README.md`;
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageId, hint: MessageId, ref: string];

const ROWS: Row[] = [
  ['bubble-border-radius', 'size', m('Corner radius'), m('Radius for every Bubble element.'), README],
  ['bubble-main-background-color', 'background', m('Main background'), m('Main background of every Bubble element.'), README],
  ['bubble-secondary-background-color', 'background', m('Secondary background'), m('Secondary background of every Bubble element.'), README],
  ['bubble-accent-color', 'color', m('Accent colour'), m('Accent for active states and sliders.'), README],
  ['bubble-icon-border-radius', 'size', m('Icon radius'), m('Corner radius of icons.'), README],
  ['bubble-icon-background-color', 'background', m('Icon background'), m('Background behind icons.'), README],
  ['bubble-sub-button-border-radius', 'size', m('Sub-button radius'), m('Corner radius of sub-buttons.'), README],
  ['bubble-sub-button-background-color', 'background', m('Sub-button background'), m('Background of sub-buttons.'), README],
  ['bubble-box-shadow', 'shadow', m('Shadow'), m('Box shadow of Bubble cards.'), README],
  ['bubble-border', 'border', m('Border'), m('Border of Bubble cards.'), README],
  ['bubble-button-main-background-color', 'background', m('Button card background'), m('Main background of button cards.'), `${BASE}src/cards/button/styles.css`],
  ['bubble-button-border-radius', 'size', m('Button card radius'), m('Corner radius of button cards.'), `${BASE}src/cards/button/styles.css`],
  ['bubble-light-color', 'color', m('Light colour'), m('Fill colour for light sliders.'), `${BASE}src/components/slider/styles.css`],
  ['bubble-pop-up-background-color', 'background', m('Pop-up background'), m('Background of pop-ups.'), `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-pop-up-border-radius', 'size', m('Pop-up radius'), m('Corner radius of pop-ups.'), `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-backdrop-background-color', 'color', m('Pop-up backdrop colour'), m('Colour of the dimmed area behind a pop-up.'), `${BASE}src/cards/pop-up/backdrop.css`],
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
