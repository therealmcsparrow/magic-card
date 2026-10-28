import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { FieldKind } from '../../contracts/theme-catalogue';
import type { MarkedEntry } from '../model';

/**
 * Bubble Card v3.4.2 (commit 91a5c77). The first ten names are the "Global CSS variables" table in README.md;
 * the rest are read with var() in the source file named in each row.
 */
const BASE = 'https://github.com/Clooos/Bubble-Card/blob/v3.4.2/';
const README = `${BASE}README.md`;
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: MessageIndex, hint: MessageIndex, ref: string];

const ROWS: Row[] = [
  ['bubble-border-radius', 'size', m('theme-editor.bubble-card.corner-radius'), m('theme-editor.bubble-card.radius-for-every-bubble-element'), README],
  ['bubble-main-background-color', 'background', m('theme-editor.bubble-card.main-background'), m('theme-editor.bubble-card.main-background-of-every-bubble-element'), README],
  ['bubble-secondary-background-color', 'background', m('theme-editor.bubble-card.secondary-background'), m('theme-editor.bubble-card.secondary-background-of-every-bubble'), README],
  ['bubble-accent-color', 'color', m('theme-editor.bubble-card.accent-colour'), m('theme-editor.bubble-card.accent-for-active-states-and-sliders'), README],
  ['bubble-icon-border-radius', 'size', m('theme-editor.bubble-card.icon-radius'), m('theme-editor.bubble-card.corner-radius-of-icons'), README],
  ['bubble-icon-background-color', 'background', m('theme-editor.bubble-card.icon-background'), m('theme-editor.bubble-card.background-behind-icons'), README],
  ['bubble-sub-button-border-radius', 'size', m('theme-editor.bubble-card.sub-button-radius'), m('theme-editor.bubble-card.corner-radius-of-sub-buttons'), README],
  ['bubble-sub-button-background-color', 'background', m('theme-editor.bubble-card.sub-button-background'), m('theme-editor.bubble-card.background-of-sub-buttons'), README],
  ['bubble-box-shadow', 'shadow', m('theme-editor.bubble-card.shadow'), m('theme-editor.bubble-card.box-shadow-of-bubble-cards'), README],
  ['bubble-border', 'border', m('theme-editor.bubble-card.border'), m('theme-editor.bubble-card.border-of-bubble-cards'), README],
  ['bubble-button-main-background-color', 'background', m('theme-editor.bubble-card.button-card-background'), m('theme-editor.bubble-card.main-background-of-button-cards'), `${BASE}src/cards/button/styles.css`],
  ['bubble-button-border-radius', 'size', m('theme-editor.bubble-card.button-card-radius'), m('theme-editor.bubble-card.corner-radius-of-button-cards'), `${BASE}src/cards/button/styles.css`],
  ['bubble-light-color', 'color', m('theme-editor.bubble-card.light-colour'), m('theme-editor.bubble-card.fill-colour-for-light-sliders'), `${BASE}src/components/slider/styles.css`],
  ['bubble-pop-up-background-color', 'background', m('theme-editor.bubble-card.pop-up-background'), m('theme-editor.bubble-card.background-of-pop-ups'), `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-pop-up-border-radius', 'size', m('theme-editor.bubble-card.pop-up-radius'), m('theme-editor.bubble-card.corner-radius-of-pop-ups'), `${BASE}src/cards/pop-up/styles.css`],
  ['bubble-backdrop-background-color', 'color', m('theme-editor.bubble-card.pop-up-backdrop-colour'), m('theme-editor.bubble-card.colour-of-the-dimmed-area-behind-a-pop'), `${BASE}src/cards/pop-up/backdrop.css`],
];

export const BUBBLE_CARD_ENTRIES: MarkedEntry[] = ROWS.map(
  ([name, kind, label, hint, ref]): MarkedEntry => ({
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
