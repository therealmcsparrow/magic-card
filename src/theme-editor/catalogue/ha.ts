import type { MessageIndex } from '../../contracts/i18n';
import { m } from '../i18n';
import type { CatalogueGroupId, FieldKind } from '../../contracts/theme-catalogue';
import type { CatalogueEntry } from '../../contracts/theme-catalogue';

/**
 * Home Assistant's own theme variables: the ones a theme commonly sets, checked against
 * home-assistant/frontend tag 20260930.4 (`ref` is the file that declares or reads the variable;
 * defaults are HA's light-mode values). Gradient (`background` kind) only where HA paints the
 * variable with the `background` shorthand: card-background-color, ha-card-background and
 * lovelace-background. The header and sidebar backgrounds use `background-color`, so they stay colours.
 */
const BASE = 'https://github.com/home-assistant/frontend/blob/20260930.4/';
const VERIFIED = '2026-10-17';

type Row = [name: string, group: CatalogueGroupId, kind: FieldKind, label: MessageIndex, def: string, hint: MessageIndex, file: string];

const CG = 'src/resources/theme/color/color.globals.ts';
const HC = 'src/components/ha-card.ts';
const CO = 'src/resources/theme/core.globals.ts';
const TY = 'src/resources/theme/typography.globals.ts';
const MA = 'src/resources/theme/main.globals.ts';

const ROWS: Row[] = [
  ['primary-color', 'primary', 'color', m('theme-editor.ha.primary-colour'), '#009ac7', m('theme-editor.ha.buttons-toggles-active-icons-and-links'), CG],
  ['dark-primary-color', 'primary', 'color', m('theme-editor.ha.primary-colour-dark-shade'), '#0288d1', m('theme-editor.ha.pressed-and-darker-primary-accents'), CG],
  ['light-primary-color', 'primary', 'color', m('theme-editor.ha.primary-colour-light-shade'), '#b3e5fc', m('theme-editor.ha.light-tints-of-the-primary-colour'), CG],
  ['accent-color', 'primary', 'color', m('theme-editor.ha.accent-colour'), '#ff9800', m('theme-editor.ha.secondary-accent-used-by-a-few-controls'), CG],
  ['text-primary-color', 'primary', 'color', m('theme-editor.ha.text-on-primary-colour'), '#ffffff', m('theme-editor.ha.text-and-icons-drawn-on-the-primary'), CG],
  ['primary-background-color', 'backgrounds', 'color', m('theme-editor.ha.page-background'), '#fafafa', m('theme-editor.ha.behind-everything-including-the'), CG],
  ['secondary-background-color', 'backgrounds', 'color', m('theme-editor.ha.secondary-background'), '#e5e5e5', m('theme-editor.ha.quiet-panels-input-fills-and-list'), CG],
  ['card-background-color', 'backgrounds', 'background', m('theme-editor.ha.card-background'), '#ffffff', m('theme-editor.ha.cards-dialogs-and-menus-takes-a-gradient'), CG],
  ['ha-card-background', 'backgrounds', 'background', m('theme-editor.ha.card-background-override'), '', m('theme-editor.ha.wins-over-the-card-background-for-cards'), HC],
  ['lovelace-background', 'backgrounds', 'background', m('theme-editor.ha.dashboard-background'), '', m('theme-editor.ha.the-background-of-a-dashboard-view-takes'), 'src/panels/lovelace/views/hui-view-background.ts'],
  ['ha-card-border-radius', 'backgrounds', 'size', m('theme-editor.ha.card-corner-radius'), 'var(--ha-border-radius-lg)', m('theme-editor.ha.rounding-of-every-card'), HC],
  ['ha-card-border-width', 'backgrounds', 'size', m('theme-editor.ha.card-border-width'), '1px', m('theme-editor.ha.width-of-the-card-border'), HC],
  ['ha-card-border-color', 'backgrounds', 'color', m('theme-editor.ha.card-border-colour'), 'var(--divider-color, #e0e0e0)', m('theme-editor.ha.colour-of-the-card-border'), HC],
  ['ha-card-box-shadow', 'backgrounds', 'shadow', m('theme-editor.ha.card-shadow'), 'none', m('theme-editor.ha.shadow-under-every-card'), HC],
  ['ha-card-backdrop-filter', 'backgrounds', 'text', m('theme-editor.ha.card-backdrop-filter'), 'none', m('theme-editor.ha.a-blur-behind-translucent-cards-like'), HC],
  ['divider-color', 'backgrounds', 'color', m('theme-editor.ha.divider-colour'), 'rgba(0, 0, 0, 0.12)', m('theme-editor.ha.lines-between-rows-and-around-inputs'), CG],
  ['outline-color', 'backgrounds', 'color', m('theme-editor.ha.outline-colour'), 'rgba(0, 0, 0, 0.12)', m('theme-editor.ha.outlines-of-buttons-and-chips'), CG],
  ['shadow-color', 'backgrounds', 'color', m('theme-editor.ha.shadow-colour'), 'rgba(0, 0, 0, 0.16)', m('theme-editor.ha.the-colour-ha-shades-shadows-with'), CG],
  ['primary-text-color', 'text', 'color', m('theme-editor.ha.primary-text'), '#212121', m('theme-editor.ha.main-text-and-icons'), CG],
  ['secondary-text-color', 'text', 'color', m('theme-editor.ha.secondary-text'), '#727272', m('theme-editor.ha.captions-hints-and-secondary-lines'), CG],
  ['disabled-text-color', 'text', 'color', m('theme-editor.ha.disabled-text'), '#bdbdbd', m('theme-editor.ha.text-of-disabled-and-unavailable-things'), CG],
  ['text-light-primary-color', 'text', 'color', m('theme-editor.ha.text-on-light-surfaces'), '#212121', m('theme-editor.ha.dark-text-used-where-the-surface-stays'), CG],
  ['ha-card-header-color', 'text', 'color', m('theme-editor.ha.card-title-colour'), 'var(--primary-text-color)', m('theme-editor.ha.colour-of-card-titles'), HC],
  ['ha-card-header-font-size', 'text', 'size', m('theme-editor.ha.card-title-size'), 'var(--ha-font-size-2xl)', m('theme-editor.ha.font-size-of-card-titles'), HC],
  ['ha-card-header-font-family', 'text', 'font', m('theme-editor.ha.card-title-font'), 'inherit', m('theme-editor.ha.font-family-of-card-titles'), HC],
  ['ha-font-family-body', 'text', 'font', m('theme-editor.ha.body-font'), 'Roboto, Noto, sans-serif', m('theme-editor.ha.the-font-for-most-text'), TY],
  ['ha-font-family-heading', 'text', 'font', m('theme-editor.ha.heading-font'), 'var(--ha-font-family-body)', m('theme-editor.ha.the-font-for-headings'), TY],
  ['error-color', 'states', 'color', m('theme-editor.ha.error-colour'), '#db4437', m('theme-editor.ha.errors-delete-buttons-and-critical'), CG],
  ['warning-color', 'states', 'color', m('theme-editor.ha.warning-colour'), '#ffa600', m('theme-editor.ha.warnings-and-caution-states'), CG],
  ['success-color', 'states', 'color', m('theme-editor.ha.success-colour'), '#43a047', m('theme-editor.ha.success-messages-and-confirmed-states'), CG],
  ['info-color', 'states', 'color', m('theme-editor.ha.info-colour'), '#039be5', m('theme-editor.ha.information-banners-and-notes'), CG],
  ['disabled-color', 'states', 'color', m('theme-editor.ha.disabled-colour'), '#bdbdbd', m('theme-editor.ha.disabled-controls-and-empty-slider'), CG],
  ['state-icon-color', 'states', 'color', m('theme-editor.ha.icon-colour'), '#44739e', m('theme-editor.ha.entity-icons-that-have-no-state-colour'), CG],
  ['state-active-color', 'states', 'color', m('theme-editor.ha.active-state-colour'), 'var(--amber-color)', m('theme-editor.ha.icons-of-things-that-are-on-or-open'), CG],
  ['state-inactive-color', 'states', 'color', m('theme-editor.ha.inactive-state-colour'), 'var(--grey-color)', m('theme-editor.ha.icons-of-things-that-are-off-or-closed'), CG],
  ['state-unavailable-color', 'states', 'color', m('theme-editor.ha.unavailable-state-colour'), 'var(--state-icon-unavailable-color, var(--disabled-text-color))', m('theme-editor.ha.icons-of-unavailable-entities'), CG],
  ['state-light-active-color', 'states', 'color', m('theme-editor.ha.light-on-colour'), 'var(--amber-color)', m('theme-editor.ha.icons-of-lights-that-are-on'), CG],
  ['state-switch-active-color', 'states', 'color', m('theme-editor.ha.switch-on-colour'), 'var(--amber-color)', m('theme-editor.ha.icons-of-switches-that-are-on'), CG],
  ['state-fan-active-color', 'states', 'color', m('theme-editor.ha.fan-on-colour'), 'var(--cyan-color)', m('theme-editor.ha.icons-of-fans-that-are-on'), CG],
  ['state-cover-active-color', 'states', 'color', m('theme-editor.ha.cover-open-colour'), 'var(--purple-color)', m('theme-editor.ha.icons-of-covers-that-are-open'), CG],
  ['state-lock-locked-color', 'states', 'color', m('theme-editor.ha.locked-colour'), 'var(--green-color)', m('theme-editor.ha.icons-of-locks-that-are-locked'), CG],
  ['state-lock-unlocked-color', 'states', 'color', m('theme-editor.ha.unlocked-colour'), 'var(--red-color)', m('theme-editor.ha.icons-of-locks-that-are-unlocked'), CG],
  ['state-climate-heat-color', 'states', 'color', m('theme-editor.ha.heating-colour'), 'var(--deep-orange-color)', m('theme-editor.ha.climate-icons-that-are-heating'), CG],
  ['state-climate-cool-color', 'states', 'color', m('theme-editor.ha.cooling-colour'), 'var(--blue-color)', m('theme-editor.ha.climate-icons-that-are-cooling'), CG],
  ['state-media_player-active-color', 'states', 'color', m('theme-editor.ha.media-player-active-colour'), 'var(--light-blue-color)', m('theme-editor.ha.icons-of-media-players-that-are-playing'), CG],
  ['state-person-home-color', 'states', 'color', m('theme-editor.ha.person-at-home-colour'), 'var(--green-color)', m('theme-editor.ha.person-icons-while-home'), CG],
  ['state-binary_sensor-active-color', 'states', 'color', m('theme-editor.ha.binary-sensor-active-colour'), 'var(--amber-color)', m('theme-editor.ha.binary-sensors-that-are-on'), CG],
  ['state-alarm_control_panel-triggered-color', 'states', 'color', m('theme-editor.ha.alarm-triggered-colour'), 'var(--red-color)', m('theme-editor.ha.alarm-icons-while-triggered'), CG],
  ['ha-border-radius-sm', 'sizes', 'size', m('theme-editor.ha.small-radius'), '4px', m('theme-editor.ha.ha-small-corner-radius'), CO],
  ['ha-border-radius-md', 'sizes', 'size', m('theme-editor.ha.medium-radius'), '8px', m('theme-editor.ha.ha-medium-corner-radius'), CO],
  ['ha-border-radius-lg', 'sizes', 'size', m('theme-editor.ha.large-radius'), '12px', m('theme-editor.ha.ha-large-corner-radius-cards-use-it-by'), CO],
  ['ha-border-radius-xl', 'sizes', 'size', m('theme-editor.ha.extra-large-radius'), '16px', m('theme-editor.ha.ha-extra-large-corner-radius'), CO],
  ['ha-font-size-scale', 'sizes', 'number', m('theme-editor.ha.font-size-scale'), '1', m('theme-editor.ha.multiplies-every-ha-font-size-1-keeps'), TY],
  ['ha-font-size-s', 'sizes', 'size', m('theme-editor.ha.small-font-size'), 'calc(12px * var(--ha-font-size-scale))', m('theme-editor.ha.captions-and-secondary-lines'), TY],
  ['ha-font-size-m', 'sizes', 'size', m('theme-editor.ha.medium-font-size'), 'calc(14px * var(--ha-font-size-scale))', m('theme-editor.ha.body-text'), TY],
  ['ha-font-size-l', 'sizes', 'size', m('theme-editor.ha.large-font-size'), 'calc(16px * var(--ha-font-size-scale))', m('theme-editor.ha.larger-body-text'), TY],
  ['ha-font-size-xl', 'sizes', 'size', m('theme-editor.ha.extra-large-font-size'), 'calc(20px * var(--ha-font-size-scale))', m('theme-editor.ha.section-titles'), TY],
  ['ha-font-size-2xl', 'sizes', 'size', m('theme-editor.ha.heading-font-size'), 'calc(24px * var(--ha-font-size-scale))', m('theme-editor.ha.card-titles'), TY],
  ['header-height', 'sizes', 'size', m('theme-editor.ha.header-height'), '56px', m('theme-editor.ha.height-of-the-top-bar'), MA],
  ['app-header-background-color', 'chrome', 'color', m('theme-editor.ha.header-background'), 'var(--sidebar-background-color)', m('theme-editor.ha.the-top-bar-of-every-page'), CG],
  ['app-header-text-color', 'chrome', 'color', m('theme-editor.ha.header-text'), 'var(--sidebar-text-color)', m('theme-editor.ha.text-and-icons-in-the-top-bar'), CG],
  ['app-header-border-bottom', 'chrome', 'border', m('theme-editor.ha.header-bottom-border'), '', m('theme-editor.ha.a-line-under-the-top-bar-like-1px-solid'), 'src/components/ha-top-app-bar-fixed.ts'],
  ['app-header-edit-background-color', 'chrome', 'color', m('theme-editor.ha.header-background-while-editing'), '', m('theme-editor.ha.the-top-bar-in-dashboard-edit-mode'), 'src/panels/lovelace/hui-root.ts'],
  ['app-header-edit-text-color', 'chrome', 'color', m('theme-editor.ha.header-text-while-editing'), '', m('theme-editor.ha.text-in-the-top-bar-in-dashboard-edit'), 'src/panels/lovelace/hui-root.ts'],
  ['sidebar-background-color', 'chrome', 'color', m('theme-editor.ha.sidebar-background'), 'var(--card-background-color)', m('theme-editor.ha.the-sidebar'), CG],
  ['sidebar-text-color', 'chrome', 'color', m('theme-editor.ha.sidebar-text'), 'var(--primary-text-color)', m('theme-editor.ha.item-names-in-the-sidebar'), CG],
  ['sidebar-icon-color', 'chrome', 'color', m('theme-editor.ha.sidebar-icons'), 'rgba(var(--rgb-primary-text-color), 0.6)', m('theme-editor.ha.icons-in-the-sidebar'), CG],
  ['sidebar-selected-text-color', 'chrome', 'color', m('theme-editor.ha.sidebar-selected-text'), 'var(--primary-color)', m('theme-editor.ha.the-active-sidebar-item-name'), CG],
  ['sidebar-selected-icon-color', 'chrome', 'color', m('theme-editor.ha.sidebar-selected-icon'), 'var(--primary-color)', m('theme-editor.ha.the-active-sidebar-item-icon'), CG],
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
