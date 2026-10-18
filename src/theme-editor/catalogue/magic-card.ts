import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/**
 * What a theme can change on a Magic Card (ADR 0013). The card sets its own --mc-* tokens on :host
 * (src/css/tokens.ts), so a theme cannot reach those. It does reach:
 * - the HA variables the card reads with var() ('follows' rows below: the HA groups own the entry,
 *   index.ts lists Magic Card in its alsoUsedBy), and
 * - --mc-* names the card reads with var() but never declares on :host: today --mc-slider-background
 *   (css.ts), which a slider only overrides inline when its own track colour is set.
 * A test keeps this honest: every name here is read somewhere in src/, and no mc-* entry is declared
 * in tokens.ts.
 */

type Row = [name: string, kind: FieldKind, label: MessageId, hint: MessageId, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['mc-slider-background', 'background', m('Slider track'), m('Track behind the fill. A slider with its own track colour keeps it.'), 'own'],
  ['primary-color', 'color', m('Primary colour'), m('Buttons, bars and accents.'), 'follows'],
  ['card-background-color', 'background', m('Card background'), m('Card surface and flow labels.'), 'follows'],
  ['ha-card-background', 'background', m('Card background override'), m('Wins over the card background.'), 'follows'],
  ['primary-text-color', 'color', m('Primary text'), m('Main text.'), 'follows'],
  ['secondary-text-color', 'color', m('Secondary text'), m('Captions and hints.'), 'follows'],
  ['divider-color', 'color', m('Divider colour'), m('Borders and bar tracks.'), 'follows'],
  ['text-primary-color', 'color', m('Text on primary colour'), m('Button text.'), 'follows'],
  ['success-color', 'color', m('Success colour'), m('The save button in the popup.'), 'follows'],
  ['error-color', 'color', m('Error colour'), m('Cancel and error text in the popup.'), 'follows'],
  ['disabled-color', 'color', m('Disabled colour'), m('Empty slider track.'), 'follows'],
  ['state-light-active-color', 'color', m('Light on colour'), m('The light slider.'), 'follows'],
  ['ha-card-border-radius', 'size', m('Card corner radius'), m('Card and popup rounding.'), 'follows'],
  ['ha-card-border-width', 'size', m('Card border width'), m('Card border.'), 'follows'],
  ['ha-card-border-color', 'color', m('Card border colour'), m('Card border.'), 'follows'],
  ['ha-card-box-shadow', 'shadow', m('Card shadow'), m('Shadow under the card.'), 'follows'],
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
