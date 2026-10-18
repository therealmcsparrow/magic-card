import type { MessageId } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueEntry, CatalogueGroupId, FieldKind } from '../../contracts/theme-catalogue';

/**
 * Home Assistant's own theme variables: the ones a theme commonly sets, checked against
 * home-assistant/frontend tag 20260930.4 (`ref` is the file that declares or reads the variable;
 * defaults are HA's light-mode values). Gradient (`background` kind) only where HA paints the
 * variable with the `background` shorthand: card-background-color, ha-card-background and
 * lovelace-background. The header and sidebar backgrounds use `background-color`, so they stay colours.
 */
const BASE = 'https://github.com/home-assistant/frontend/blob/20260930.4/';
const VERIFIED = '2026-10-17';

type Row = [name: string, group: CatalogueGroupId, kind: FieldKind, label: MessageId, def: string, hint: MessageId, file: string];

const CG = 'src/resources/theme/color/color.globals.ts';
const HC = 'src/components/ha-card.ts';
const CO = 'src/resources/theme/core.globals.ts';
const TY = 'src/resources/theme/typography.globals.ts';
const MA = 'src/resources/theme/main.globals.ts';

const ROWS: Row[] = [
  ['primary-color', 'primary', 'color', m('Primary colour'), '#009ac7', m('Buttons, toggles, active icons and links.'), CG],
  ['dark-primary-color', 'primary', 'color', m('Primary colour, dark shade'), '#0288d1', m('Pressed and darker primary accents.'), CG],
  ['light-primary-color', 'primary', 'color', m('Primary colour, light shade'), '#b3e5fc', m('Light tints of the primary colour.'), CG],
  ['accent-color', 'primary', 'color', m('Accent colour'), '#ff9800', m('Secondary accent used by a few controls.'), CG],
  ['text-primary-color', 'primary', 'color', m('Text on primary colour'), '#ffffff', m('Text and icons drawn on the primary colour.'), CG],
  ['primary-background-color', 'backgrounds', 'color', m('Page background'), '#fafafa', m('Behind everything, including the dashboard.'), CG],
  ['secondary-background-color', 'backgrounds', 'color', m('Secondary background'), '#e5e5e5', m('Quiet panels, input fills and list stripes.'), CG],
  ['card-background-color', 'backgrounds', 'background', m('Card background'), '#ffffff', m('Cards, dialogs and menus. Takes a gradient.'), CG],
  ['ha-card-background', 'backgrounds', 'background', m('Card background override'), '', m('Wins over the card background for cards only. Takes a gradient.'), HC],
  ['lovelace-background', 'backgrounds', 'background', m('Dashboard background'), '', m('The background of a dashboard view. Takes a gradient or an image.'), 'src/panels/lovelace/views/hui-view-background.ts'],
  ['ha-card-border-radius', 'backgrounds', 'size', m('Card corner radius'), 'var(--ha-border-radius-lg)', m('Rounding of every card.'), HC],
  ['ha-card-border-width', 'backgrounds', 'size', m('Card border width'), '1px', m('Width of the card border.'), HC],
  ['ha-card-border-color', 'backgrounds', 'color', m('Card border colour'), 'var(--divider-color, #e0e0e0)', m('Colour of the card border.'), HC],
  ['ha-card-box-shadow', 'backgrounds', 'shadow', m('Card shadow'), 'none', m('Shadow under every card.'), HC],
  ['ha-card-backdrop-filter', 'backgrounds', 'text', m('Card backdrop filter'), 'none', m('A blur behind translucent cards, like blur(10px).'), HC],
  ['divider-color', 'backgrounds', 'color', m('Divider colour'), 'rgba(0, 0, 0, 0.12)', m('Lines between rows and around inputs.'), CG],
  ['outline-color', 'backgrounds', 'color', m('Outline colour'), 'rgba(0, 0, 0, 0.12)', m('Outlines of buttons and chips.'), CG],
  ['shadow-color', 'backgrounds', 'color', m('Shadow colour'), 'rgba(0, 0, 0, 0.16)', m('The colour HA shades shadows with.'), CG],
  ['primary-text-color', 'text', 'color', m('Primary text'), '#212121', m('Main text and icons.'), CG],
  ['secondary-text-color', 'text', 'color', m('Secondary text'), '#727272', m('Captions, hints and secondary lines.'), CG],
  ['disabled-text-color', 'text', 'color', m('Disabled text'), '#bdbdbd', m('Text of disabled and unavailable things.'), CG],
  ['text-light-primary-color', 'text', 'color', m('Text on light surfaces'), '#212121', m('Dark text used where the surface stays light.'), CG],
  ['ha-card-header-color', 'text', 'color', m('Card title colour'), 'var(--primary-text-color)', m('Colour of card titles.'), HC],
  ['ha-card-header-font-size', 'text', 'size', m('Card title size'), 'var(--ha-font-size-2xl)', m('Font size of card titles.'), HC],
  ['ha-card-header-font-family', 'text', 'font', m('Card title font'), 'inherit', m('Font family of card titles.'), HC],
  ['ha-font-family-body', 'text', 'font', m('Body font'), 'Roboto, Noto, sans-serif', m('The font for most text.'), TY],
  ['ha-font-family-heading', 'text', 'font', m('Heading font'), 'var(--ha-font-family-body)', m('The font for headings.'), TY],
  ['error-color', 'states', 'color', m('Error colour'), '#db4437', m('Errors, delete buttons and critical states.'), CG],
  ['warning-color', 'states', 'color', m('Warning colour'), '#ffa600', m('Warnings and caution states.'), CG],
  ['success-color', 'states', 'color', m('Success colour'), '#43a047', m('Success messages and confirmed states.'), CG],
  ['info-color', 'states', 'color', m('Info colour'), '#039be5', m('Information banners and notes.'), CG],
  ['disabled-color', 'states', 'color', m('Disabled colour'), '#bdbdbd', m('Disabled controls and empty slider tracks.'), CG],
  ['state-icon-color', 'states', 'color', m('Icon colour'), '#44739e', m('Entity icons that have no state colour.'), CG],
  ['state-active-color', 'states', 'color', m('Active state colour'), 'var(--amber-color)', m('Icons of things that are on or open.'), CG],
  ['state-inactive-color', 'states', 'color', m('Inactive state colour'), 'var(--grey-color)', m('Icons of things that are off or closed.'), CG],
  ['state-unavailable-color', 'states', 'color', m('Unavailable state colour'), 'var(--state-icon-unavailable-color, var(--disabled-text-color))', m('Icons of unavailable entities.'), CG],
  ['state-light-active-color', 'states', 'color', m('Light on colour'), 'var(--amber-color)', m('Icons of lights that are on.'), CG],
  ['state-switch-active-color', 'states', 'color', m('Switch on colour'), 'var(--amber-color)', m('Icons of switches that are on.'), CG],
  ['state-fan-active-color', 'states', 'color', m('Fan on colour'), 'var(--cyan-color)', m('Icons of fans that are on.'), CG],
  ['state-cover-active-color', 'states', 'color', m('Cover open colour'), 'var(--purple-color)', m('Icons of covers that are open.'), CG],
  ['state-lock-locked-color', 'states', 'color', m('Locked colour'), 'var(--green-color)', m('Icons of locks that are locked.'), CG],
  ['state-lock-unlocked-color', 'states', 'color', m('Unlocked colour'), 'var(--red-color)', m('Icons of locks that are unlocked.'), CG],
  ['state-climate-heat-color', 'states', 'color', m('Heating colour'), 'var(--deep-orange-color)', m('Climate icons that are heating.'), CG],
  ['state-climate-cool-color', 'states', 'color', m('Cooling colour'), 'var(--blue-color)', m('Climate icons that are cooling.'), CG],
  ['state-media_player-active-color', 'states', 'color', m('Media player active colour'), 'var(--light-blue-color)', m('Icons of media players that are playing.'), CG],
  ['state-person-home-color', 'states', 'color', m('Person at home colour'), 'var(--green-color)', m('Person icons while home.'), CG],
  ['state-binary_sensor-active-color', 'states', 'color', m('Binary sensor active colour'), 'var(--amber-color)', m('Binary sensors that are on.'), CG],
  ['state-alarm_control_panel-triggered-color', 'states', 'color', m('Alarm triggered colour'), 'var(--red-color)', m('Alarm icons while triggered.'), CG],
  ['ha-border-radius-sm', 'sizes', 'size', m('Small radius'), '4px', m('HA small corner radius.'), CO],
  ['ha-border-radius-md', 'sizes', 'size', m('Medium radius'), '8px', m('HA medium corner radius.'), CO],
  ['ha-border-radius-lg', 'sizes', 'size', m('Large radius'), '12px', m('HA large corner radius. Cards use it by default.'), CO],
  ['ha-border-radius-xl', 'sizes', 'size', m('Extra large radius'), '16px', m('HA extra large corner radius.'), CO],
  ['ha-font-size-scale', 'sizes', 'number', m('Font size scale'), '1', m('Multiplies every HA font size. 1 keeps them.'), TY],
  ['ha-font-size-s', 'sizes', 'size', m('Small font size'), 'calc(12px * var(--ha-font-size-scale))', m('Captions and secondary lines.'), TY],
  ['ha-font-size-m', 'sizes', 'size', m('Medium font size'), 'calc(14px * var(--ha-font-size-scale))', m('Body text.'), TY],
  ['ha-font-size-l', 'sizes', 'size', m('Large font size'), 'calc(16px * var(--ha-font-size-scale))', m('Larger body text.'), TY],
  ['ha-font-size-xl', 'sizes', 'size', m('Extra large font size'), 'calc(20px * var(--ha-font-size-scale))', m('Section titles.'), TY],
  ['ha-font-size-2xl', 'sizes', 'size', m('Heading font size'), 'calc(24px * var(--ha-font-size-scale))', m('Card titles.'), TY],
  ['header-height', 'sizes', 'size', m('Header height'), '56px', m('Height of the top bar.'), MA],
  ['app-header-background-color', 'chrome', 'color', m('Header background'), 'var(--sidebar-background-color)', m('The top bar of every page.'), CG],
  ['app-header-text-color', 'chrome', 'color', m('Header text'), 'var(--sidebar-text-color)', m('Text and icons in the top bar.'), CG],
  ['app-header-border-bottom', 'chrome', 'border', m('Header bottom border'), '', m('A line under the top bar, like 1px solid #ccc.'), 'src/components/ha-top-app-bar-fixed.ts'],
  ['app-header-edit-background-color', 'chrome', 'color', m('Header background while editing'), '', m('The top bar in dashboard edit mode.'), 'src/panels/lovelace/hui-root.ts'],
  ['app-header-edit-text-color', 'chrome', 'color', m('Header text while editing'), '', m('Text in the top bar in dashboard edit mode.'), 'src/panels/lovelace/hui-root.ts'],
  ['sidebar-background-color', 'chrome', 'color', m('Sidebar background'), 'var(--card-background-color)', m('The sidebar.'), CG],
  ['sidebar-text-color', 'chrome', 'color', m('Sidebar text'), 'var(--primary-text-color)', m('Item names in the sidebar.'), CG],
  ['sidebar-icon-color', 'chrome', 'color', m('Sidebar icons'), 'rgba(var(--rgb-primary-text-color), 0.6)', m('Icons in the sidebar.'), CG],
  ['sidebar-selected-text-color', 'chrome', 'color', m('Sidebar selected text'), 'var(--primary-color)', m('The active sidebar item name.'), CG],
  ['sidebar-selected-icon-color', 'chrome', 'color', m('Sidebar selected icon'), 'var(--primary-color)', m('The active sidebar item icon.'), CG],
];

export const HA_ENTRIES: CatalogueEntry[] = ROWS.map(
  ([name, group, kind, label, def, hint, file]): CatalogueEntry => ({
    name,
    group,
    source: 'ha',
    kind,
    label,
    hint,
    default: def,
    role: 'own',
    ref: BASE + file,
    verified: VERIFIED,
  }),
);
