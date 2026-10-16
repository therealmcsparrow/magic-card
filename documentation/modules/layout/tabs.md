# Tabs

A row of tab buttons with the content of the selected tab below. Each tab holds its own children.

| | |
| --- | --- |
| `type` | `tabs` |
| Category | Layout |
| Editor tabs | General, Actions, Conditions, Design |
| Children | `tabs`, each with `label`, optional `icon`, and `modules` |
| New module | two tabs (`Tab 1`, `Tab 2`), `active_tab: 0`, `tab_style: default` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Tab style | `tab_style` | `default`, `pills`, `underline` | `default` | The look of the tab buttons. |
| Default tab | `active_tab` | tab index, from 0 | `0` | The tab shown first. Only in the editor with two or more tabs. |
| Icon effects | `icon_fx`, `svg` | | none | Applies to every tab icon. Only in the editor when a tab has an icon. See [Icon effects](../../icon-effects/README.md). |
| (tree) | `tabs` | list | two tabs | The tabs, in order. Each is an item in the structure tree. |
| Label (tab) | `tabs[].label` | text | `Tab N` | The text on the tab button. Set it when the tab is selected, or rename the tab in the tree. |
| Icon (tab) | `tabs[].icon` | icon name | none | An icon before the label. Set it when the tab is selected. |
| (tree) | `tabs[].modules` | list of modules | empty | The tab's children. |

The General tab of the Tabs module holds Tab style, Default tab and the icon effects, and ends with "Add, rename and order tabs, and add their modules, in the structure tree."

## Tabs in the tree

Each tab is an item under the Tabs module in the [structure outline](../../editor/structure-outline.md#layout-modules-in-the-tree), with its icon, its label and its children. An Add module row under each tab adds a child to it, and an Add tab row after the last tab adds a tab.

-   Select a tab to edit its Label and Icon in the inspector. See [Tabs and row-module columns](../../inspector/tabs-and-nested-columns.md#tab-general).
-   The tab's three-dot menu has Add module, Rename, Move up, Move down and Delete tab. F2 or a double-click renames, Alt+Up and Alt+Down move the tab.
-   Delete tab asks first when the tab holds modules. The only tab cannot be deleted.
-   The Tabs module's three-dot menu has Add tab.

Moving a tab keeps Default tab on the same tab. After a delete, Default tab is clamped to the tabs that are left.

## Behaviour

-   Clicking a tab switches the content. This does not trigger the tabs module's own actions.
-   Tab icons cannot play icon animations, so the Design tab has no [Animate icon](../../design/quick-icon-animator.md) for a Tabs module.
-   With a tab button focused, the left and right arrow keys move between tabs (wrapping round), Home goes to the first and End to the last.
-   The card remembers the selected tab in memory only. It is not saved: a card that loads again starts at `active_tab`.
-   In the studio, selecting a child on the canvas or in the layers shows the tab that holds it. Selecting a tab in the layers shows that tab and frames the whole Tabs module.

## Example

```yaml
- type: tabs
  tab_style: pills
  tabs:
    - label: Lights
      icon: mdi:lightbulb-group
      modules:
        - type: light
          entity: light.living_room
          show_brightness: true
    - label: Climate
      icon: mdi:thermostat
      modules:
        - type: spinbox
          entity: climate.living_room
```
