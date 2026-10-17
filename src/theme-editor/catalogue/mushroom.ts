import type { CatalogueEntry, FieldKind } from '../../contracts/theme-catalogue';

/** Mushroom v5.2.3 (commit d8a90ff): every name is read with var() in src/utils/theme.ts. */
const REF = 'https://github.com/piitaya/lovelace-mushroom/blob/v5.2.3/src/utils/theme.ts';
const VERIFIED = '2026-10-17';

type Row = [name: string, kind: FieldKind, label: string, def: string, hint?: string];

const OWN: Row[] = [
  ['mush-spacing', 'size', 'Card spacing', '10px', 'Gap between the parts of a card.'],
  ['mush-card-primary-font-size', 'size', 'Primary text size', '14px'],
  ['mush-card-secondary-font-size', 'size', 'Secondary text size', '12px'],
  ['mush-card-primary-font-weight', 'text', 'Primary text weight', '500'],
  ['mush-card-secondary-font-weight', 'text', 'Secondary text weight', '400'],
  ['mush-card-primary-line-height', 'size', 'Primary line height', '20px'],
  ['mush-card-secondary-line-height', 'size', 'Secondary line height', '16px'],
  ['mush-card-primary-letter-spacing', 'size', 'Primary letter spacing', '0.1px'],
  ['mush-card-secondary-letter-spacing', 'size', 'Secondary letter spacing', '0.4px'],
  ['mush-card-primary-color', 'color', 'Primary text colour', 'var(--primary-text-color)'],
  ['mush-card-secondary-color', 'color', 'Secondary text colour', 'var(--primary-text-color)'],
  ['mush-title-padding', 'text', 'Title padding', '24px 12px 8px'],
  ['mush-title-spacing', 'size', 'Title spacing', '8px'],
  ['mush-title-font-size', 'size', 'Title size', '24px'],
  ['mush-title-font-weight', 'text', 'Title weight', 'normal'],
  ['mush-title-line-height', 'size', 'Title line height', '32px'],
  ['mush-title-letter-spacing', 'size', 'Title letter spacing', '-0.288px'],
  ['mush-title-color', 'color', 'Title colour', 'var(--primary-text-color)'],
  ['mush-subtitle-font-size', 'size', 'Subtitle size', '16px'],
  ['mush-subtitle-font-weight', 'text', 'Subtitle weight', 'normal'],
  ['mush-subtitle-line-height', 'size', 'Subtitle line height', '24px'],
  ['mush-subtitle-letter-spacing', 'size', 'Subtitle letter spacing', '0px'],
  ['mush-subtitle-color', 'color', 'Subtitle colour', 'var(--secondary-text-color)'],
  ['mush-icon-size', 'size', 'Icon size', '36px'],
  ['mush-icon-symbol-size', 'size', 'Icon symbol size', '0.667em'],
  ['mush-icon-border-radius', 'size', 'Icon radius', '50%'],
  ['mush-badge-size', 'size', 'Badge size', '16px'],
  ['mush-badge-icon-size', 'size', 'Badge icon size', '0.75em'],
  ['mush-badge-border-radius', 'size', 'Badge radius', '50%'],
  ['mush-control-height', 'size', 'Control height', '42px'],
  ['mush-control-border-radius', 'size', 'Control radius', '12px'],
  ['mush-control-button-ratio', 'number', 'Control button ratio', '1', 'Button width as a multiple of its height.'],
  ['mush-control-icon-size', 'size', 'Control icon size', '0.5em'],
  ['mush-control-spacing', 'size', 'Control spacing', '12px'],
  ['mush-slider-threshold', 'number', 'Slider threshold', '', 'Movement before a slider reacts.'],
  ['mush-input-number-debounce', 'number', 'Number input debounce', '', 'Delay in milliseconds.'],
  ['mush-layout-align', 'text', 'Layout alignment', 'center'],
  ['mush-chip-spacing', 'size', 'Chip spacing', '8px'],
  ['mush-chip-padding', 'text', 'Chip padding', '0 0.25em'],
  ['mush-chip-height', 'size', 'Chip height', '36px'],
  ['mush-chip-border-radius', 'size', 'Chip radius', '19px'],
  ['mush-chip-border-width', 'size', 'Chip border width', 'var(--ha-card-border-width, 1px)'],
  ['mush-chip-border-color', 'color', 'Chip border colour', 'var(--ha-card-border-color, var(--divider-color))'],
  ['mush-chip-box-shadow', 'shadow', 'Chip shadow', 'var(--ha-card-box-shadow, none)'],
  ['mush-chip-font-size', 'size', 'Chip text size', '0.3em'],
  ['mush-chip-font-weight', 'text', 'Chip text weight', 'bold'],
  ['mush-chip-icon-size', 'size', 'Chip icon size', '0.5em'],
  ['mush-chip-avatar-padding', 'size', 'Chip avatar padding', '0.1em'],
  ['mush-chip-avatar-border-radius', 'size', 'Chip avatar radius', '50%'],
  ['mush-chip-background', 'background', 'Chip background', 'var(--ha-card-background, var(--card-background-color, white))'],
];

/** Colour triplets ("r, g, b"): Mushroom mixes them with its own opacity. Suffix after `mush-rgb-`. */
const RGB = [
  'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime',
  'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'light-grey', 'grey', 'dark-grey', 'blue-grey', 'black', 'white',
  'disabled', 'info', 'success', 'warning', 'danger',
  'state-vacuum', 'state-fan', 'state-light', 'state-entity', 'state-media-player', 'state-lock', 'state-number',
  'state-humidifier', 'state-person-home', 'state-person-not-home', 'state-person-zone', 'state-person-unknown',
  'state-cover-open', 'state-cover-closed', 'state-lock-locked', 'state-lock-unlocked', 'state-lock-pending',
  'state-update-on', 'state-alarm-armed', 'state-alarm-disarmed', 'state-alarm-triggered',
  'state-climate-auto', 'state-climate-cool', 'state-climate-dry', 'state-climate-fan-only', 'state-climate-heat',
  'state-climate-heat-cool', 'state-climate-idle', 'state-climate-off', 'update-off', 'update-installing',
];

function rgbLabel(suffix: string): string {
  const words = suffix.replace(/^state-/, '').replace(/-/g, ' ');
  const text = `${suffix.startsWith('state-') ? `${words} state` : words} (RGB)`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const MUSHROOM_ENTRIES: CatalogueEntry[] = [
  ...OWN.map(
    ([name, kind, label, def, hint]): CatalogueEntry => ({
      name,
      group: 'mushroom',
      source: 'mushroom',
      kind,
      label,
      default: def,
      role: 'own',
      ref: REF,
      verified: VERIFIED,
      ...(hint ? { hint } : {}),
    }),
  ),
  ...RGB.map(
    (s): CatalogueEntry => ({
      name: `mush-rgb-${s}`,
      group: 'mushroom',
      source: 'mushroom',
      kind: 'rgb',
      label: rgbLabel(s),
      default: '',
      hint: 'Three numbers, 0 to 255, like 244, 67, 54.',
      role: 'own',
      ref: REF,
      verified: VERIFIED,
    }),
  ),
];
