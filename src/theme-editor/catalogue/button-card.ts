import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * button-card v7.0.1 (commit dfa304f). Its README documents no theme variables, so the own names are the
 * `--button-card-tooltip-*` ones read with var() in src/styles.ts. The 'follows' rows are HA variables that
 * file reads; they name variables the HA groups own (index.ts merges them as alsoUsedBy).
 */
const REF = 'https://github.com/custom-cards/button-card/blob/v7.0.1/src/styles.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageId, hint: MessageId, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['button-card-tooltip-background-color', 'color', m('Tooltip background'), m('Background of tooltips.'), 'own'],
  ['button-card-tooltip-content-color', 'color', m('Tooltip text colour'), m('Text colour of tooltips.'), 'own'],
  ['button-card-tooltip-font-size', 'size', m('Tooltip text size'), m('Font size of tooltips.'), 'own'],
  ['button-card-tooltip-border-radius', 'size', m('Tooltip radius'), m('Corner radius of tooltips.'), 'own'],
  ['button-card-tooltip-padding', 'text', m('Tooltip padding'), m('Space inside tooltips.'), 'own'],
  ['button-card-tooltip-max-width', 'size', m('Tooltip maximum width'), m('Widest a tooltip grows.'), 'own'],
  ['ha-card-border-radius', 'size', m('Card radius'), m('Radius of the ripple on the icon.'), 'follows'],
  ['ha-card-box-shadow', 'shadow', m('Card shadow'), m('Shadow of tooltips.'), 'follows'],
  ['card-background-color', 'background', m('Card background'), m('Background of the loading spinner.'), 'follows'],
  ['primary-text-color', 'color', m('Primary text colour'), m('Tooltip text colour fallback.'), 'follows'],
  ['secondary-background-color', 'background', m('Secondary background'), m('Tooltip background fallback.'), 'follows'],
  ['state-icon-color', 'color', m('State icon colour'), m('Icon colour when an entity is inactive.'), 'follows'],
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
