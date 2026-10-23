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
| Icon when active (tab) | `tabs[].active_icon` | icon name | none | The icon the tab shows while it is the active tab. Without it, the tab keeps `icon`. Set it when the tab is selected, under Icon when active. |
| (tree) | `tabs[].modules` | list of modules | empty | The tab's children. |

The General tab of the Tabs module holds Tab style, Default tab and the icon effects, and ends with "Add, rename and order tabs, and add their modules, in the structure tree."

## Tab bar design

The Design tab of a tabs module has a Tab bar section. Its keys style the bar, the tabs, the icons and the switch between tabs. The active, hover and disabled looks of a tab are in [Tab states](#tab-states). Set them as you set other design keys. Copy design, Paste design and card templates carry them too (see [Copy and paste design](../../editor/copy-paste-design.md)).

The keys work with every `tab_style` (default, pills and underline). A key that is not set leaves that part of the bar as it was before these keys existed, so a tabs module that uses none of them looks exactly as before. A key with a value the editor does not accept is ignored.

A conditional design rule can set any of these keys, and the rule's value replaces the base value while the rule matches. The hover design changes only the tab states described in [Tab states](#tab-states).

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `tab_bar_background` | colour | not set | Background of the bar. |
| `tab_bar_border_color` | 1 to 4 colours, one per side | not set | Colour of the line round the bar. One colour, or one for each side in the order top, right, bottom, left. |
| `tab_bar_border_width` | 1 to 4 lengths from 0 to 32, no % | not set | Width of that line. One length, or one for each side in the same order. |
| `tab_bar_padding` | 1 to 4 lengths, each up to 256 | not set | Space inside the bar, round the tabs. |
| `tab_bar_position` | `top`, `bottom` | `top` | Puts the bar above or below the content. Keyboard focus follows the visual order. |
| `tab_align` | `start`, `center`, `end`, `stretch` | `start` | Places the tabs in the bar. `stretch` makes the tabs fill the bar. |
| `tab_gap` | length or %, up to 256 | not set | Space between tabs. |
| `tab_color` | colour | not set | Text colour of the tabs that are not active. |
| `tab_background` | colour | not set | Background of each tab that is not active. |
| `tab_border_color` | 1 to 4 colours, one per side | not set | Colour of each tab's border. One colour, or one for each side in the order top, right, bottom, left. |
| `tab_border_width` | 1 to 4 lengths from 0 to 32, no % | not set | Width of each tab's border, one value or one per side in the same order. Set it, or `tab_border_color`, and every tab has a border on all four sides. See [The active line](#the-active-line). |
| `tab_border_style` | 1 to 4 words: `none`, `hidden`, `solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset` | `solid` | Style of each tab's border, one word or one per side in the same order. |
| `tab_radius` | 1 to 4 lengths, each up to 999 | not set | Corner radius of each tab. One value for all corners, or one per corner from top left, clockwise: top left, top right, bottom right, bottom left. |
| `tab_padding` | 1 to 4 lengths, each up to 256 | not set | Space inside each tab. |
| `tab_font_family` | font names separated by commas | not set | Font of the tab labels. Names may be in quotes. Up to 128 characters. A Google Font chosen in the editor's font picker loads from Google. |
| `tab_font_size` | length or %, up to 512 | not set | Size of the tab labels. |
| `tab_font_weight` | `normal`, `bold`, or `100` to `900` in steps of 100 | not set | Weight of the tab labels. |
| `tab_text_transform` | `none`, `uppercase`, `lowercase`, `capitalize` | not set | Letter case of the tab labels. |
| `tab_letter_spacing` | `normal`, or one length: px up to 32, em or rem up to 2. Negative values are accepted. | not set | Space between the letters of the tab labels. |
| `tab_icon_position` | `left`, `right`, `above`, `below` | `left` | Where the icon sits in the tab. `left` and `right` follow the writing direction. |
| `tab_icon_size` | length, up to 256 px, no % | not set | Size of the tab icons. |
| `tab_icon_color` | colour | not set | Colour of the tab icons. |
| `tab_icon_fx` | `device`, `draw` and `draw_duration`, as in [Icon effects](../../icon-effects/README.md) | not set | Animation of the tab icons. Not in the hover state. See [Tab icons](#tab-icons). |
| `tab_shadow` | `none`, or one or two shadows, each `[inset] x y [blur [spread]] [colour]`. Up to 128 characters. | not set | Shadow of each tab. |
| `tab_animation` | `none`, `fade`, `slide` | `none` | Animation of the content when the tab switches. It does not play when the viewer prefers reduced motion. |
| `tab_animations` | a list of up to 12 animation entries | not set | Animations on the tab buttons, their icons or their labels. See [Tab animations](#tab-animations). |
| `tab_opacity` | number from 0 to 1 | not set | Opacity of every tab. The active, hover and disabled states can set their own, see [Tab states](#tab-states). |

A length is a plain number, which counts as px, or a number with px, em, rem, %, vw or vh. Negative values are not accepted. A colour is any CSS colour the editor accepts, such as `#1c7ed6`.

```yaml
- type: tabs
  tab_style: underline
  design:
    tab_bar_position: bottom
    tab_animation: fade
    tab_active:
      tab_color: "#1c7ed6"
      tab_border_color: "#1c7ed6"
  tabs:
    - label: Lights
      modules: []
```

## Tab states

A tab can have four looks: the base look from the keys above, and three states that change it. `tab_disabled_tabs`, `tab_active` and `tab_disabled` are set in this section too.

Each state takes every per-tab key from the [Tab bar design](#tab-bar-design) table: the keys that style a tab, its border, its text, its icon and its effects. The keys for the bar as a whole (`tab_bar_*`, `tab_gap`, `tab_align`, `tab_bar_position`, `tab_icon_position`, `tab_animation`) and `tab_disabled_tabs` are not state keys.

| Group | Keys |
| --- | --- |
| Colour and fill | `tab_color`, `tab_background`, `tab_border_color`, `tab_icon_color` |
| Border and corners | `tab_border_width`, `tab_border_style`, `tab_radius` |
| Space and text | `tab_padding`, `tab_font_family`, `tab_font_size`, `tab_font_weight`, `tab_text_transform`, `tab_letter_spacing` |
| Icon | `tab_icon_size`, `tab_icon_fx` (not in the hover state) |
| Effects | `tab_shadow`, `tab_opacity`, `tab_animations` |

A state with a value the editor does not accept ignores that value and keeps the value of the base look.

The states are:

| State | Where it is set | Applies to |
| --- | --- | --- |
| Hover | `hover:` in the design, with the state keys | A tab under the pointer. Only with a pointer that can hover (a mouse or pen), not on a touch screen. Never the active or a disabled tab. |
| Active | `tab_active:` in the design, with the state keys | The tab that is open. |
| Disabled | `tab_disabled:` in the design, with the state keys, and `tab_disabled_tabs` | The tabs listed in `tab_disabled_tabs`. |

When a tab is in more than one state, the later one in this list wins: base, then hover, then active, then disabled.

```yaml
design:
  tab_color: "#8a8f98"
  hover:
    tab_color: "#ffffff"
  tab_active:
    tab_color: "#1c7ed6"
    tab_border_color: "#1c7ed6"
  tab_disabled_tabs: [2]
  tab_disabled:
    tab_opacity: 0.4
```

### The active line

The active tab has no separate indicator. The line under it is the tab's border. Its colour is `tab_border_color` in `tab_active`. Unless `tab_border_width` or `tab_border_color` is set, the active tab's line is its bottom edge only, so it sits under the tab. Once either is set, every tab has a border on all four sides, and the active tab differs only in its `tab_active` settings. With `tab_bar_position: bottom`, the line stays on the tab's bottom edge.

In Pills, the tabs have no bottom line of their own, so the active tab's border colour shows only in a border on all four sides. That needs `tab_border_width` or `tab_border_color` to be set.

### Disabled tabs

A disabled tab stays in the bar but cannot be opened.

-   In the editor, tick Disabled tabs in the Tab bar group of the Design tab. In YAML, list the positions in `tab_disabled_tabs`. Positions count from 0, like `active_tab`. The list holds up to 64 positions.
-   A disabled tab is dimmed. The default opacity is 0.5, and `tab_disabled.tab_opacity` changes it.
-   Clicks do nothing. Arrow keys, Home and End skip the tab, and screen readers hear it as disabled.
-   If the tab that `active_tab` names is disabled, the first tab that is not disabled opens instead. If every tab is disabled, the tab named by `active_tab` stays shown and none of them can be clicked.
-   In the Studio, outside Preview, the canvas opens the tab that `active_tab` names, even when it is disabled. Clicking a tab on the canvas does not switch tabs. A disabled tab also opens when you select it in Layers, or a module inside it, so you can edit its content. In Preview the dashboard rules apply.

### Tab states in rules

A conditional design rule can change the tab states. Its flat `tab_` keys replace the base values while the rule matches. Its `tab_active` and `tab_disabled` settings merge key by key with the base values. Each rule can add to `tab_disabled_tabs`: two rules can each disable a different tab. A rule cannot enable a tab that the base design disables.

In the editor, the Editing design for list has an Active tab entry and a Disabled tab entry for the base design, and one for each state of a rule.

```yaml
design:
  tab_disabled_tabs: [1]
  conditional:
    - id: guest
      name: Guest mode
      conditions:
        - type: state
          entity: input_boolean.guest_mode
          state: "on"
      design:
        tab_disabled_tabs: [2]
        tab_active:
          tab_border_color: "#e8590c"
```

### Older active and indicator keys

The keys `tab_active_color`, `tab_active_background` and `tab_indicator_color` still work:

-   `tab_active_color` is the active tab's text colour, and `tab_active_background` its background.
-   `tab_indicator_color` is the line under the active tab, which is now its border colour. In Pills, when `tab_active_background` is not set, it is the active tab's background instead.
-   The new keys win when both are set.

The editor moves the three old keys into `tab_active` the first time you change the Active tab design, and removes them. That is one undo step.

Two things change on an existing card:

-   A card that sets `tab_indicator_color` and a tab border gives the active tab a coloured border on all four sides, not only a line underneath it.
-   A card that has a tab border loses the separate underline under the active tab. The active tab's border now carries the active line.

### Tab icons

A tab shows its `active_icon` while it is the active tab. Set it under Icon when active in the tab's settings, or with `active_icon` in YAML. Without it, the tab keeps its `icon`.

```yaml
- type: tabs
  tabs:
    - label: Lights
      icon: mdi:lightbulb-outline
      active_icon: mdi:lightbulb-group
      modules: []
```

The icon colour is set with `tab_icon_color`, in the base design or in a state. The icon animation is set with `tab_icon_fx`: the device animation and the line draw of [Icon effects](../../icon-effects/README.md), with `draw_duration` for the line draw. It takes only those three keys. It works in the base design and in the Active and Disabled states, not in Hover.

A tab's icon effects are the module's `icon_fx`, merged with the base `tab_icon_fx`, then the Active tab's, then the Disabled tab's. A key set later wins. The viewer's reduced motion setting stops the icon animation.

```yaml
design:
  tab_icon_color: "#8a8f98"
  tab_icon_fx:
    device: pulse
  tab_active:
    tab_icon_color: "#1c7ed6"
    tab_icon_fx:
      device: spin
```

### Tab animations

`tab_animations` plays animations on the tab buttons. Each list takes the same entries as the animation list of a module, with the same presets and settings, and each entry can target the tab button, the tab's icon or its label. See [Animations](../../design/animations.md). The editor offers motion presets only. A list can have up to 12 entries.

Each state has its own list:

-   `tab_animations` in the base design plays on every tab.
-   `tab_active.tab_animations` plays on the active tab, on top of the base list. It starts when the tab becomes active, and it stops on the tab that was active before.
-   `tab_disabled.tab_animations` plays on the disabled tabs, on top of the base list.
-   `hover.tab_animations` plays under the pointer, only with a pointer that can hover. It does not play on the active or a disabled tab.

Custom animations (`custom:` presets) and entries with the On tap trigger do not play on tabs. Reduced motion and the card's pause button stop tab animations, as they stop module animations. The animation code loads when a tab uses an animation. Until it has loaded, the tabs draw without it and update when it is ready.

```yaml
design:
  tab_animations:
    - preset: glow-pulse
  tab_active:
    tab_animations:
      - preset: spin
        target: icon
```

The same preset used in the Hover list and in the base or Active list shares its settings for that tab, and the tab button's own settings win. Use a different preset for the hover if its timing must differ. The hover icon animation does nothing on a tab without an icon.

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
-   A disabled tab cannot be clicked or reached with the arrow keys. See [Disabled tabs](#disabled-tabs).
-   Tab icons can play icon effects (`tab_icon_fx`) and icon animations (`tab_animations` with `target: icon`). See [Tab icons](#tab-icons) and [Tab animations](#tab-animations).
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
