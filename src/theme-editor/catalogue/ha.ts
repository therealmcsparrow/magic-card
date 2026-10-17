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

type Row = [name: string, group: CatalogueGroupId, kind: FieldKind, label: string, def: string, hint: string, file: string];

const CG = 'src/resources/theme/color/color.globals.ts';
const HC = 'src/components/ha-card.ts';
const CO = 'src/resources/theme/core.globals.ts';
const TY = 'src/resources/theme/typography.globals.ts';
const MA = 'src/resources/theme/main.globals.ts';

const ROWS: Row[] = [
  ['primary-color', 'primary', 'color', 'Primary colour', '#009ac7', 'Buttons, toggles, active icons and links.', CG],
  ['dark-primary-color', 'primary', 'color', 'Primary colour, dark shade', '#0288d1', 'Pressed and darker primary accents.', CG],
  ['light-primary-color', 'primary', 'color', 'Primary colour, light shade', '#b3e5fc', 'Light tints of the primary colour.', CG],
  ['accent-color', 'primary', 'color', 'Accent colour', '#ff9800', 'Secondary accent used by a few controls.', CG],
  ['text-primary-color', 'primary', 'color', 'Text on primary colour', '#ffffff', 'Text and icons drawn on the primary colour.', CG],
  ['primary-background-color', 'backgrounds', 'color', 'Page background', '#fafafa', 'Behind everything, including the dashboard.', CG],
  ['secondary-background-color', 'backgrounds', 'color', 'Secondary background', '#e5e5e5', 'Quiet panels, input fills and list stripes.', CG],
  ['card-background-color', 'backgrounds', 'background', 'Card background', '#ffffff', 'Cards, dialogs and menus. Takes a gradient.', CG],
  ['ha-card-background', 'backgrounds', 'background', 'Card background override', '', 'Wins over the card background for cards only. Takes a gradient.', HC],
  ['lovelace-background', 'backgrounds', 'background', 'Dashboard background', '', 'The background of a dashboard view. Takes a gradient or an image.', 'src/panels/lovelace/views/hui-view-background.ts'],
  ['ha-card-border-radius', 'backgrounds', 'size', 'Card corner radius', 'var(--ha-border-radius-lg)', 'Rounding of every card.', HC],
  ['ha-card-border-width', 'backgrounds', 'size', 'Card border width', '1px', 'Width of the card border.', HC],
  ['ha-card-border-color', 'backgrounds', 'color', 'Card border colour', 'var(--divider-color, #e0e0e0)', 'Colour of the card border.', HC],
  ['ha-card-box-shadow', 'backgrounds', 'shadow', 'Card shadow', 'none', 'Shadow under every card.', HC],
  ['ha-card-backdrop-filter', 'backgrounds', 'text', 'Card backdrop filter', 'none', 'A blur behind translucent cards, like blur(10px).', HC],
  ['divider-color', 'backgrounds', 'color', 'Divider colour', 'rgba(0, 0, 0, 0.12)', 'Lines between rows and around inputs.', CG],
  ['outline-color', 'backgrounds', 'color', 'Outline colour', 'rgba(0, 0, 0, 0.12)', 'Outlines of buttons and chips.', CG],
  ['shadow-color', 'backgrounds', 'color', 'Shadow colour', 'rgba(0, 0, 0, 0.16)', 'The colour HA shades shadows with.', CG],
  ['primary-text-color', 'text', 'color', 'Primary text', '#212121', 'Main text and icons.', CG],
  ['secondary-text-color', 'text', 'color', 'Secondary text', '#727272', 'Captions, hints and secondary lines.', CG],
  ['disabled-text-color', 'text', 'color', 'Disabled text', '#bdbdbd', 'Text of disabled and unavailable things.', CG],
  ['text-light-primary-color', 'text', 'color', 'Text on light surfaces', '#212121', 'Dark text used where the surface stays light.', CG],
  ['ha-card-header-color', 'text', 'color', 'Card title colour', 'var(--primary-text-color)', 'Colour of card titles.', HC],
  ['ha-card-header-font-size', 'text', 'size', 'Card title size', 'var(--ha-font-size-2xl)', 'Font size of card titles.', HC],
  ['ha-card-header-font-family', 'text', 'font', 'Card title font', 'inherit', 'Font family of card titles.', HC],
  ['ha-font-family-body', 'text', 'font', 'Body font', 'Roboto, Noto, sans-serif', 'The font for most text.', TY],
  ['ha-font-family-heading', 'text', 'font', 'Heading font', 'var(--ha-font-family-body)', 'The font for headings.', TY],
  ['error-color', 'states', 'color', 'Error colour', '#db4437', 'Errors, delete buttons and critical states.', CG],
  ['warning-color', 'states', 'color', 'Warning colour', '#ffa600', 'Warnings and caution states.', CG],
  ['success-color', 'states', 'color', 'Success colour', '#43a047', 'Success messages and confirmed states.', CG],
  ['info-color', 'states', 'color', 'Info colour', '#039be5', 'Information banners and notes.', CG],
  ['disabled-color', 'states', 'color', 'Disabled colour', '#bdbdbd', 'Disabled controls and empty slider tracks.', CG],
  ['state-icon-color', 'states', 'color', 'Icon colour', '#44739e', 'Entity icons that have no state colour.', CG],
  ['state-active-color', 'states', 'color', 'Active state colour', 'var(--amber-color)', 'Icons of things that are on or open.', CG],
  ['state-inactive-color', 'states', 'color', 'Inactive state colour', 'var(--grey-color)', 'Icons of things that are off or closed.', CG],
  ['state-unavailable-color', 'states', 'color', 'Unavailable state colour', 'var(--state-icon-unavailable-color, var(--disabled-text-color))', 'Icons of unavailable entities.', CG],
  ['state-light-active-color', 'states', 'color', 'Light on colour', 'var(--amber-color)', 'Icons of lights that are on.', CG],
  ['state-switch-active-color', 'states', 'color', 'Switch on colour', 'var(--amber-color)', 'Icons of switches that are on.', CG],
  ['state-fan-active-color', 'states', 'color', 'Fan on colour', 'var(--cyan-color)', 'Icons of fans that are on.', CG],
  ['state-cover-active-color', 'states', 'color', 'Cover open colour', 'var(--purple-color)', 'Icons of covers that are open.', CG],
  ['state-lock-locked-color', 'states', 'color', 'Locked colour', 'var(--green-color)', 'Icons of locks that are locked.', CG],
  ['state-lock-unlocked-color', 'states', 'color', 'Unlocked colour', 'var(--red-color)', 'Icons of locks that are unlocked.', CG],
  ['state-climate-heat-color', 'states', 'color', 'Heating colour', 'var(--deep-orange-color)', 'Climate icons that are heating.', CG],
  ['state-climate-cool-color', 'states', 'color', 'Cooling colour', 'var(--blue-color)', 'Climate icons that are cooling.', CG],
  ['state-media_player-active-color', 'states', 'color', 'Media player active colour', 'var(--light-blue-color)', 'Icons of media players that are playing.', CG],
  ['state-person-home-color', 'states', 'color', 'Person at home colour', 'var(--green-color)', 'Person icons while home.', CG],
  ['state-binary_sensor-active-color', 'states', 'color', 'Binary sensor active colour', 'var(--amber-color)', 'Binary sensors that are on.', CG],
  ['state-alarm_control_panel-triggered-color', 'states', 'color', 'Alarm triggered colour', 'var(--red-color)', 'Alarm icons while triggered.', CG],
  ['ha-border-radius-sm', 'sizes', 'size', 'Small radius', '4px', 'HA small corner radius.', CO],
  ['ha-border-radius-md', 'sizes', 'size', 'Medium radius', '8px', 'HA medium corner radius.', CO],
  ['ha-border-radius-lg', 'sizes', 'size', 'Large radius', '12px', 'HA large corner radius. Cards use it by default.', CO],
  ['ha-border-radius-xl', 'sizes', 'size', 'Extra large radius', '16px', 'HA extra large corner radius.', CO],
  ['ha-font-size-scale', 'sizes', 'number', 'Font size scale', '1', 'Multiplies every HA font size. 1 keeps them.', TY],
  ['ha-font-size-s', 'sizes', 'size', 'Small font size', 'calc(12px * var(--ha-font-size-scale))', 'Captions and secondary lines.', TY],
  ['ha-font-size-m', 'sizes', 'size', 'Medium font size', 'calc(14px * var(--ha-font-size-scale))', 'Body text.', TY],
  ['ha-font-size-l', 'sizes', 'size', 'Large font size', 'calc(16px * var(--ha-font-size-scale))', 'Larger body text.', TY],
  ['ha-font-size-xl', 'sizes', 'size', 'Extra large font size', 'calc(20px * var(--ha-font-size-scale))', 'Section titles.', TY],
  ['ha-font-size-2xl', 'sizes', 'size', 'Heading font size', 'calc(24px * var(--ha-font-size-scale))', 'Card titles.', TY],
  ['header-height', 'sizes', 'size', 'Header height', '56px', 'Height of the top bar.', MA],
  ['app-header-background-color', 'chrome', 'color', 'Header background', 'var(--sidebar-background-color)', 'The top bar of every page.', CG],
  ['app-header-text-color', 'chrome', 'color', 'Header text', 'var(--sidebar-text-color)', 'Text and icons in the top bar.', CG],
  ['app-header-border-bottom', 'chrome', 'border', 'Header bottom border', '', 'A line under the top bar, like 1px solid #ccc.', 'src/components/ha-top-app-bar-fixed.ts'],
  ['app-header-edit-background-color', 'chrome', 'color', 'Header background while editing', '', 'The top bar in dashboard edit mode.', 'src/panels/lovelace/hui-root.ts'],
  ['app-header-edit-text-color', 'chrome', 'color', 'Header text while editing', '', 'Text in the top bar in dashboard edit mode.', 'src/panels/lovelace/hui-root.ts'],
  ['sidebar-background-color', 'chrome', 'color', 'Sidebar background', 'var(--card-background-color)', 'The sidebar.', CG],
  ['sidebar-text-color', 'chrome', 'color', 'Sidebar text', 'var(--primary-text-color)', 'Item names in the sidebar.', CG],
  ['sidebar-icon-color', 'chrome', 'color', 'Sidebar icons', 'rgba(var(--rgb-primary-text-color), 0.6)', 'Icons in the sidebar.', CG],
  ['sidebar-selected-text-color', 'chrome', 'color', 'Sidebar selected text', 'var(--primary-color)', 'The active sidebar item name.', CG],
  ['sidebar-selected-icon-color', 'chrome', 'color', 'Sidebar selected icon', 'var(--primary-color)', 'The active sidebar item icon.', CG],
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
