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

type Row = [name: string, kind: FieldKind, label: string, hint: string, role: 'own' | 'follows'];

const ROWS: Row[] = [
  ['mc-slider-background', 'background', 'Slider track', 'Track behind the fill. A slider with its own track colour keeps it.', 'own'],
  ['primary-color', 'color', 'Primary colour', 'Buttons, bars and accents.', 'follows'],
  ['card-background-color', 'background', 'Card background', 'Card surface and flow labels.', 'follows'],
  ['ha-card-background', 'background', 'Card background override', 'Wins over the card background.', 'follows'],
  ['primary-text-color', 'color', 'Primary text', 'Main text.', 'follows'],
  ['secondary-text-color', 'color', 'Secondary text', 'Captions and hints.', 'follows'],
  ['divider-color', 'color', 'Divider colour', 'Borders and bar tracks.', 'follows'],
  ['text-primary-color', 'color', 'Text on primary colour', 'Button text.', 'follows'],
  ['success-color', 'color', 'Success colour', 'The save button in the popup.', 'follows'],
  ['error-color', 'color', 'Error colour', 'Cancel and error text in the popup.', 'follows'],
  ['disabled-color', 'color', 'Disabled colour', 'Empty slider track.', 'follows'],
  ['state-light-active-color', 'color', 'Light on colour', 'The light slider.', 'follows'],
  ['ha-card-border-radius', 'size', 'Card corner radius', 'Card and popup rounding.', 'follows'],
  ['ha-card-border-width', 'size', 'Card border width', 'Card border.', 'follows'],
  ['ha-card-border-color', 'color', 'Card border colour', 'Card border.', 'follows'],
  ['ha-card-box-shadow', 'shadow', 'Card shadow', 'Shadow under the card.', 'follows'],
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
