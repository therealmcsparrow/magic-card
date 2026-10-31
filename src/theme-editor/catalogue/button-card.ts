import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { FieldKind } from '../../contracts/theme-catalogue';
import type { CatalogueEntry } from '../../contracts/theme-catalogue';

// button-card v7.0.1 (commit dfa304f): its own `--button-card-tooltip-*` names and the HA variables it follows.
const REF = 'https://github.com/custom-cards/button-card/blob/v7.0.1/src/styles.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageIndex, hint: MessageIndex, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['button-card-tooltip-background-color', 'color', m('theme-editor.button-card.tooltip-background'), m('theme-editor.button-card.background-of-tooltips'), 'own'],
  ['button-card-tooltip-content-color', 'color', m('theme-editor.button-card.tooltip-text-colour'), m('theme-editor.button-card.text-colour-of-tooltips'), 'own'],
  ['button-card-tooltip-font-size', 'size', m('theme-editor.button-card.tooltip-text-size'), m('theme-editor.button-card.font-size-of-tooltips'), 'own'],
  ['button-card-tooltip-border-radius', 'size', m('theme-editor.button-card.tooltip-radius'), m('theme-editor.button-card.corner-radius-of-tooltips'), 'own'],
  ['button-card-tooltip-padding', 'text', m('theme-editor.button-card.tooltip-padding'), m('theme-editor.button-card.space-inside-tooltips'), 'own'],
  ['button-card-tooltip-max-width', 'size', m('theme-editor.button-card.tooltip-maximum-width'), m('theme-editor.button-card.widest-a-tooltip-grows'), 'own'],
  ['ha-card-border-radius', 'size', m('theme-editor.button-card.card-radius'), m('theme-editor.button-card.radius-of-the-ripple-on-the-icon'), 'follows'],
  ['ha-card-box-shadow', 'shadow', m('theme-editor.button-card.card-shadow'), m('theme-editor.button-card.shadow-of-tooltips'), 'follows'],
  ['card-background-color', 'background', m('theme-editor.button-card.card-background'), m('theme-editor.button-card.background-of-the-loading-spinner'), 'follows'],
  ['primary-text-color', 'color', m('theme-editor.button-card.primary-text-colour'), m('theme-editor.button-card.tooltip-text-colour-fallback'), 'follows'],
  ['secondary-background-color', 'background', m('theme-editor.button-card.secondary-background'), m('theme-editor.button-card.tooltip-background-fallback'), 'follows'],
  ['state-icon-color', 'color', m('theme-editor.button-card.state-icon-colour'), m('theme-editor.button-card.icon-colour-when-an-entity-is-inactive'), 'follows'],
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
