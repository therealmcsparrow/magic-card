/*
 * Home Assistant's dark-mode default values for themeable variables.
 *
 * Source: home-assistant/frontend, src/resources/theme/color/color.globals.ts, `darkColorStyles`
 * (the `html {}` block that becomes `darkColorVariables`), checked against release 20260930.4.
 * HA applies these inline on <html> in dark mode, but only the light defaults exist as a stylesheet
 * rule, so the trial cannot read the dark ones. Used when a profile theme sets a key the draft lacks:
 * in dark mode the key goes back to this value. Left out: the --ha-color-* semantic tokens (derived
 * from var() chains, not set by themes) and the --codemirror-* syntax colours. If HA changes a
 * value, the trial falls back to a slightly stale default for that key; nothing breaks.
 */
export const HA_DARK_DEFAULTS: Readonly<Record<string, string>> = {
  'primary-background-color': '#111111',
  'card-background-color': '#1c1c1c',
  'secondary-background-color': '#282828',
  'clear-background-color': '#111111',
  'primary-text-color': '#e1e1e1',
  'secondary-text-color': '#9b9b9b',
  'disabled-text-color': '#6f6f6f',
  'divider-color': 'rgba(225, 225, 225, 0.12)',
  'outline-color': 'rgba(225, 225, 225, 0.12)',
  'outline-hover-color': 'rgba(225, 225, 225, 0.24)',
  'shadow-color': 'rgba(0, 0, 0, 0.48)',
  'scrollbar-thumb-color': 'rgb(110, 110, 110)',
  'mdc-ripple-color': '#aaaaaa',
  'mdc-linear-progress-buffer-color': 'rgba(255, 255, 255, 0.1)',
  'input-idle-line-color': 'rgba(255, 255, 255, 0.42)',
  'input-hover-line-color': 'rgba(255, 255, 255, 0.87)',
  'input-disabled-line-color': 'rgba(255, 255, 255, 0.06)',
  'input-outlined-idle-border-color': 'rgba(255, 255, 255, 0.38)',
  'input-outlined-hover-border-color': 'rgba(255, 255, 255, 0.87)',
  'input-outlined-disabled-border-color': 'rgba(255, 255, 255, 0.06)',
  'input-fill-color': 'rgba(255, 255, 255, 0.05)',
  'input-disabled-fill-color': 'rgba(255, 255, 255, 0.02)',
  'input-ink-color': 'rgba(255, 255, 255, 0.87)',
  'input-label-ink-color': 'rgba(255, 255, 255, 0.6)',
  'input-disabled-ink-color': 'rgba(255, 255, 255, 0.37)',
  'input-dropdown-icon-color': 'rgba(255, 255, 255, 0.54)',
  'energy-grid-return-color': '#a280db',
  'map-filter': 'invert(0.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(0.3)',
  'disabled-color': '#464646',
  'ha-button-primary-light-color': '#4082a040',
  'ha-button-warning-light-color': '#917b54c1',
  'ha-button-neutral-color': '#d9dae0',
  'ha-button-neutral-light-color': '#6a7081',
  'bar-box-shadow': '0 2px 12px var(--shadow-color)',
};
