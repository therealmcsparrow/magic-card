import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { FieldKind } from '../../contracts/theme-catalogue';
import type { MarkedEntry } from '../model';

/**
 * Ultra Card v3.13.3 (commit 4cb4a6c). It documents no HA theme variables (its own `--uc-*` values are
 * internal and set per card), so the group lists the HA variables src/cards/ultra-card.ts reads with var()
 * (rule 4). These name variables the HA groups own (index.ts merges them as alsoUsedBy).
 */
const REF = 'https://github.com/WJDDesigns/Ultra-Card/blob/v3.13.3/src/cards/ultra-card.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageIndex, hint: MessageIndex];

const ROWS: Row[] = [
  ['primary-color', 'color', m('theme-editor.ultra-card.primary-colour'), m('theme-editor.ultra-card.accents-and-active-elements')],
  ['primary-text-color', 'color', m('theme-editor.ultra-card.primary-text-colour'), m('theme-editor.ultra-card.main-text')],
  ['secondary-text-color', 'color', m('theme-editor.ultra-card.secondary-text-colour'), m('theme-editor.ultra-card.muted-text')],
  ['divider-color', 'color', m('theme-editor.ultra-card.divider-colour'), m('theme-editor.ultra-card.borders-and-separators')],
  ['card-background-color', 'background', m('theme-editor.ultra-card.card-background'), m('theme-editor.ultra-card.card-surface')],
  ['ha-card-background', 'background', m('theme-editor.ultra-card.card-background-override'), m('theme-editor.ultra-card.takes-priority-over-the-card-background')],
  ['ha-card-border-radius', 'size', m('theme-editor.ultra-card.card-radius'), m('theme-editor.ultra-card.corner-radius-of-the-card')],
  ['ha-card-box-shadow', 'shadow', m('theme-editor.ultra-card.card-shadow'), m('theme-editor.ultra-card.shadow-of-the-card')],
  ['error-color', 'color', m('theme-editor.ultra-card.error-colour'), m('theme-editor.ultra-card.error-messages')],
];

export const ULTRA_CARD_ENTRIES: MarkedEntry[] = ROWS.map(
  ([name, kind, label, hint]): MarkedEntry => ({
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
