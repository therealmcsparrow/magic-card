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

## Tab bar design

The Design tab of a tabs module has a Tab bar section. It holds 23 `tab_` keys that style the bar, the tabs, the active tab, the icons and the switch between tabs. Set them as you set other design keys. Copy design, Paste design and card templates carry them too (see [Copy and paste design](../../editor/copy-paste-design.md)).

The keys work with every `tab_style` (default, pills and underline). A key that is not set leaves that part of the bar as it was before these keys existed, so a tabs module that uses none of them looks exactly as before. A key with a value the editor does not accept is ignored.

The tab keys apply to the base design only. The hover design and the conditional design rules do not change the tab bar.

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `tab_bar_background` | colour | not set | Background of the bar. |
| `tab_bar_border_color` | colour | not set | Colour of the line round the bar. |
| `tab_bar_border_width` | length, 1 to 32 px | not set | Width of that line. |
| `tab_bar_padding` | 1 to 4 lengths, each up to 256 | not set | Space inside the bar, round the tabs. |
| `tab_bar_position` | `top`, `bottom` | `top` | Puts the bar above or below the content. Keyboard focus follows the visual order. |
| `tab_align` | `start`, `center`, `end`, `stretch` | `start` | Places the tabs in the bar. `stretch` makes the tabs fill the bar. |
| `tab_gap` | length | not set | Space between tabs. |
| `tab_color` | colour | not set | Text colour of the tabs that are not active. |
| `tab_background` | colour | not set | Background of each tab. |
| `tab_border_color` | colour | not set | Colour of each tab's border. |
| `tab_border_width` | length, 1 to 32 px | not set | Width of each tab's border. |
| `tab_radius` | 1 to 4 lengths, each up to 999 | not set | Corner radius of each tab. |
| `tab_padding` | 1 to 4 lengths, each up to 256 | not set | Space inside each tab. |
| `tab_active_color` | colour | not set | Text colour of the active tab. |
| `tab_active_background` | colour | not set | Background of the active tab. In Pills, it is the pill fill. |
| `tab_indicator_color` | colour | not set | The line under the active tab in Default and Underline. In Pills, the fill behind the active tab when `tab_active_background` is not set. |
| `tab_font_family` | font names separated by commas | not set | Font of the tab labels. Names may be in quotes. Up to 128 characters. |
| `tab_font_size` | length or %, up to 512 | not set | Size of the tab labels. |
| `tab_font_weight` | `normal`, `bold`, or `100` to `900` in steps of 100 | not set | Weight of the tab labels. |
| `tab_text_transform` | `none`, `uppercase`, `lowercase`, `capitalize` | not set | Letter case of the tab labels. |
| `tab_icon_position` | `left`, `right`, `above`, `below` | `left` | Where the icon sits in the tab. `left` and `right` follow the writing direction. |
| `tab_icon_size` | length, up to 256 px, no % | not set | Size of the tab icons. |
| `tab_animation` | `none`, `fade`, `slide` | `none` | Animation when the tab switches. It does not play when the viewer prefers reduced motion. |

A length is a plain number, which counts as px, or a number with px, em, rem, %, vw or vh. Negative values are not accepted. A colour is any CSS colour the editor accepts, such as `#1c7ed6`.

```yaml
- type: tabs
  tab_style: underline
  design:
    tab_bar_position: bottom
    tab_active_color: "#1c7ed6"
    tab_indicator_color: "#1c7ed6"
    tab_animation: fade
  tabs:
    - label: Lights
      modules: []
```

## Tabs in the tree

Each tab is an item under the Tabs module in the [structure outline](../../editor/structure-outline.md#layout-modules-in-the-tree), with its icon, its label and its children. An Add module row under each tab adds a child to it, and an Add tab row after the last tab adds a tab.

A module moves into a tab by dragging it onto the tab in the tree, or with Move to… in its item menu. A tab cannot be dragged, and a module cannot sit beside a tab.

-   Select a tab to edit its Label and Icon in the inspector. See [Tabs and row-module columns](../../inspector/tabs-and-nested-columns.md#tab-general).
-   The tab's three-dot menu has Add module, Rename, Move up, Move down and Delete tab. F2 or a double-click renames, Alt+Up and Alt+Down move the tab.
-   Delete tab asks first when the tab holds modules. The only tab cannot be deleted.
-   The Tabs module's three-dot menu has Add tab.

Moving a tab keeps Default tab on the same tab. After a delete, Default tab is clamped to the tabs that are left.

## Behaviour

-   Clicking a tab switches the content. This does not trigger the tabs module's own actions.
-   Tab icons cannot play [icon animations](../../design/quick-icon-animator.md).
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
