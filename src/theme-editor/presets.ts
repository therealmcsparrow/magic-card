import type { ThemeDoc } from '../contracts/theme-editor';

/*
 * The five starter themes (design spec section 10, with the round 1 notes). Each one holds both
 * modes. Colours are the designer's values; everything else stays unset and falls back to Home
 * Assistant's defaults. Text on card is 4.5 to 1 or better in every mode (tests/theme-editor-ui).
 */

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  /** An extra line on the card (cost or behaviour the user should know before picking it). */
  note?: string;
  doc: ThemeDoc;
}

interface Mode {
  'primary-color': string;
  'accent-color': string;
  'primary-background-color': string;
  'card-background-color': string;
  'primary-text-color': string;
  'secondary-text-color': string;
  'divider-color': string;
  [extra: string]: string;
}

/*
 * Text on the primary colour (filled buttons, app header) and the four state colours are set in every
 * mode, so they hold 4.5 to 1 against the primary and the card (tests/theme-editor-fix1).
 */
const STATES_LIGHT = { 'error-color': '#b3261e', 'warning-color': '#8a4b00', 'info-color': '#0b66a8', 'success-color': '#1b6e2f' };
const STATES_DARK = { 'error-color': '#ff8a80', 'warning-color': '#ffb74d', 'info-color': '#64b5f6', 'success-color': '#81c784' };

const mode = (m: string[], dark = false): Mode => ({
  'primary-color': m[0],
  'accent-color': m[1],
  'primary-background-color': m[2],
  'card-background-color': m[3],
  'primary-text-color': m[4],
  'secondary-text-color': m[5],
  'divider-color': m[6],
  'text-primary-color': dark ? '#000000' : '#ffffff',
  'app-header-text-color': dark ? '#000000' : '#ffffff',
  ...(dark ? STATES_DARK : STATES_LIGHT),
});

const FROST_LIGHT = 'linear-gradient(135deg, #dfe9f7, #f3e8f8)';
const FROST_DARK = 'linear-gradient(135deg, #0f1b33, #2a1740)';

export const PRESETS: Preset[] = [
  {
    id: 'paper',
    name: 'Paper',
    blurb: 'Clean light with a calm blue.',
    doc: {
      'ha-card-border-radius': '16px',
      modes: {
        light: mode(['#1d5fd1', '#c2410c', '#f5f6f8', '#ffffff', '#1b1f24', '#5a626c', '#e1e4e8']),
        dark: mode(['#7aa7ff', '#ff9d66', '#14171c', '#1d2128', '#eceff3', '#a2a9b3', '#2c323b'], true),
      },
    },
  },
  {
    id: 'midnight-oled',
    name: 'Midnight OLED',
    blurb: 'Pure black for wall tablets.',
    note: 'Pure black in dark mode only. Keep the screen in dark mode.',
    doc: {
      'ha-card-border-radius': '16px',
      modes: {
        dark: mode(['#4cc2ff', '#ffb454', '#000000', '#0b0b0d', '#f2f2f2', '#9a9aa2', '#1f1f24'], true),
        light: mode(['#0a6fb5', '#b45309', '#f4f4f6', '#ffffff', '#111111', '#55555d', '#dcdce0']),
      },
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    blurb: 'Warm paper and terracotta.',
    doc: {
      'ha-card-border-radius': '16px',
      modes: {
        light: mode(['#b93a0b', '#0f766e', '#faf5ee', '#fffdf9', '#2b2118', '#6b5a4a', '#eadfce']),
        dark: mode(['#fb923c', '#5eead4', '#1c1511', '#261d17', '#f6ebdd', '#bfa98f', '#3a2d23'], true),
      },
    },
  },
  {
    id: 'contrast',
    name: 'Contrast',
    blurb: 'High contrast, strong edges.',
    doc: {
      'ha-card-border-radius': '16px',
      modes: {
        light: mode(['#0000cc', '#b00020', '#ffffff', '#ffffff', '#000000', '#2b2b2b', '#000000']),
        dark: mode(['#ffe500', '#00e5ff', '#000000', '#000000', '#ffffff', '#e6e6e6', '#ffffff'], true),
      },
    },
  },
  {
    id: 'frost',
    name: 'Frost',
    blurb: 'Glass: blurred, translucent cards on a soft gradient.',
    note: 'Uses blur and transparency. Can be slow on old tablets.',
    doc: {
      'ha-card-border-radius': '16px',
      'ha-card-backdrop-filter': 'blur(12px)',
      modes: {
        light: {
          ...mode(['#2a58b5', '#a23b8c', '#dfe9f7', 'rgba(255, 255, 255, 0.65)', '#1a2233', '#4a566b', 'rgba(26, 34, 51, 0.14)']),
          'lovelace-background': FROST_LIGHT,
        },
        dark: {
          ...mode(['#8fb4ff', '#f0a3e0', '#0f1b33', 'rgba(255, 255, 255, 0.08)', '#eef2fb', '#aab4c8', 'rgba(255, 255, 255, 0.14)'], true),
          'lovelace-background': FROST_DARK,
        },
      },
    },
  },
];

export const presetById = (id: string): Preset | undefined => PRESETS.find((p) => p.id === id);
