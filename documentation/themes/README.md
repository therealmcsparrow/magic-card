# Themes

The theme editor creates and edits Home Assistant themes without leaving Home Assistant. It runs in the Themes tab of the Magic Card Utils sidebar panel. Pick a blank theme, a preset or an installed theme, change its colours and sizes with a live preview beside the fields, and save it as a file in `/config/themes`. Home Assistant then lists the theme and you can select it, with no restart.

The editor writes ordinary Home Assistant theme files. A saved theme works without Magic Card. The editor only helps you write it.

## Requirements

-   Magic Card 2026.10.07 or newer, added as a dashboard resource of type JavaScript module. The Themes tab loads `magic-card-theme-editor.js` from the same folder as `magic-card.js`, and `magic-card-theme-presets.js` when you open the create dialog. HACS installs both there.
-   The [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration, version 2026.10.08 or newer.
-   An admin user. The panel is only in the sidebar of admin users, and saving or deleting a theme needs an admin.
-   The include lines in `configuration.yaml`, described in [Getting started](getting-started.md#add-the-include-lines).

## Pages

-   [Getting started](getting-started.md): the include lines, opening the Themes tab, creating a theme from blank, a preset or an installed theme, and saving.
-   [Theme examples](examples/README.md): all 57 presets, in three groups, each with a screenshot of its light and dark modes. The Inspired by presets credit the palette they draw on.
-   [Variables and groups](variables.md): the Home Assistant groups, the Magic Card group, the third-party card groups, the raw row, colour, size and gradient fields.
-   [Light, dark and Shared](modes.md): the `modes` blocks, the Shared, Light and Dark scope, previewing each mode, and the warnings about values that have no effect.
-   [Try, revert and use](trying-and-using.md): Try on dashboard, Revert, and Use this theme.
-   [Files and limits](files.md): where files go, names, read-only themes and Copy to edit, deleting, and what the editor does not do yet.

Related: [Magic Card Utils panel](https://github.com/therealmcsparrow/magic-card-utils/blob/main/documentation/panel/README.md) and the [Magic Card Utils WebSocket API](https://github.com/therealmcsparrow/magic-card-utils/blob/main/documentation/api/README.md) for the commands the editor uses.
