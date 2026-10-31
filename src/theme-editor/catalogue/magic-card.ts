import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { FieldKind } from '../../contracts/theme-catalogue';
import type { CatalogueEntry } from '../../contracts/theme-catalogue';

/**
 * What a theme can change on a Magic Card: the HA variables the card reads with var() ('follows' rows),
 * and --mc-* names read but never declared on :host (today --mc-slider-background).
 */

type Row = [name: string, kind: FieldKind, label: MessageIndex, hint: MessageIndex, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['mc-slider-background', 'background', m('theme-editor.magic-card.slider-track'), m('theme-editor.magic-card.track-behind-the-fill-a-slider-with-its'), 'own'],
  ['primary-color', 'color', m('theme-editor.magic-card.primary-colour'), m('theme-editor.magic-card.buttons-bars-and-accents'), 'follows'],
  ['card-background-color', 'background', m('theme-editor.magic-card.card-background'), m('theme-editor.magic-card.card-surface-and-flow-labels'), 'follows'],
  ['ha-card-background', 'background', m('theme-editor.magic-card.card-background-override'), m('theme-editor.magic-card.wins-over-the-card-background'), 'follows'],
  ['primary-text-color', 'color', m('theme-editor.magic-card.primary-text'), m('theme-editor.magic-card.main-text'), 'follows'],
  ['secondary-text-color', 'color', m('theme-editor.magic-card.secondary-text'), m('theme-editor.magic-card.captions-and-hints'), 'follows'],
  ['divider-color', 'color', m('theme-editor.magic-card.divider-colour'), m('theme-editor.magic-card.borders-and-bar-tracks'), 'follows'],
  ['text-primary-color', 'color', m('theme-editor.magic-card.text-on-primary-colour'), m('theme-editor.magic-card.button-text'), 'follows'],
  ['success-color', 'color', m('theme-editor.magic-card.success-colour'), m('theme-editor.magic-card.the-save-button-in-the-popup'), 'follows'],
  ['error-color', 'color', m('theme-editor.magic-card.error-colour'), m('theme-editor.magic-card.cancel-and-error-text-in-the-popup'), 'follows'],
  ['disabled-color', 'color', m('theme-editor.magic-card.disabled-colour'), m('theme-editor.magic-card.empty-slider-track'), 'follows'],
  ['state-light-active-color', 'color', m('theme-editor.magic-card.light-on-colour'), m('theme-editor.magic-card.the-light-slider'), 'follows'],
  ['ha-card-border-radius', 'size', m('theme-editor.magic-card.card-corner-radius'), m('theme-editor.magic-card.card-and-popup-rounding'), 'follows'],
  ['ha-card-border-width', 'size', m('theme-editor.magic-card.card-border-width'), m('theme-editor.magic-card.card-border'), 'follows'],
  ['ha-card-border-color', 'color', m('theme-editor.magic-card.card-border-colour'), m('theme-editor.magic-card.card-border'), 'follows'],
  ['ha-card-box-shadow', 'shadow', m('theme-editor.magic-card.card-shadow'), m('theme-editor.magic-card.shadow-under-the-card'), 'follows'],
];

export const MAGIC_CARD_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([name, kind, label, hint, role]): CatalogueEntry => ({
    name,
    group: 'magic-card',
    source: 'magic-card',
    kind,
    label,
    hint,
    default: '',
    role,
  }),
);
