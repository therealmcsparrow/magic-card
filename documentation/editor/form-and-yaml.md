# Form and YAML

The switch at the top of the pane (and in the Studio top bar) has two modes: Form and YAML. Both edit the same config. The mode is shared: switching in the pane also switches the Studio, and the other way round.

-   [Form](#form)
-   [YAML](#yaml)
-   [Keyboard](#keyboard)

## Form

Form mode shows the Studio panel, the structure outline and the inspector. You edit the card through fields. See [Structure outline](structure-outline.md) and [Inspector](../inspector/README.md).

## YAML

YAML mode replaces the outline and inspector with Home Assistant's YAML editor. The template bar stays visible.

-   The YAML lists `type`, `name` and `template` first, then the rest of the config.
-   Every edit that parses as valid YAML is applied straight away and becomes one undo step. While you type, that can be many steps.
-   Invalid YAML is not applied. Home Assistant's YAML editor shows the error.
-   `type` cannot be changed here. Whatever you type, the card keeps `type: custom:magic-card`.

In the Studio, YAML mode replaces the canvas with the YAML editor and hides the device width switch. Layers and the inspector stay. See [Studio layout](../studio/layout-and-toolbar.md#yaml-mode).

For the config keys themselves, see [YAML](../yaml/README.md).

## Keyboard

The Form / YAML switch is a tab list. With focus on it:

| Key | Action |
| --- | --- |
| Right / Left | Switch to the next / previous mode (wraps) |
| Home / End | Switch to the first / last mode |
