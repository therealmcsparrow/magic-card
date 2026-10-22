# Button

A button with an icon, a label and optionally the entity's state. What it does is set in its [actions](../../inspector/README.md).

| | |
| --- | --- |
| `type` | `button` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Any entity, or none |
| New module | `label: Button`, `icon: mdi:power`, `show_state: false`, `button_style: default` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity for state, icon, colour and actions. |
| Label | `label` | string | `Button` | The button text. |
| Use entity icon | `use_entity_icon` | boolean | `false` | Uses the entity's icon as Home Assistant picks it. Only shown with an entity. |
| Icon | `icon` | icon name | none | The icon. Hidden while Use entity icon is on. `svg` draws your own SVG. |
| Icon effects | `icon_fx`, `icon_on`, `icon_off`, `svg` | | none | See [Icon effects](../../icon-effects/README.md). |
| Use entity color | `use_entity_color` | boolean | `false` | Colours the icon like Home Assistant does for the entity's state. Only shown with an entity. |
| Button style | `button_style` | `default`, `outline`, `flat`, `icon-only` | `default` | The look. Icon only hides the label and shows it as a tooltip. |
| Show state | `show_state` | boolean | `false` | Shows the state next to the label. |
| Attribute | `attribute` | attribute name | none | With Show state: shows this attribute instead of the state. |

Without `icon` the button shows no icon, unless `icon_on` or `icon_off` gives one for the current state.

The state and attribute are formatted by Home Assistant, with the unit.

## Icon and text

The Design tab has an Icon & text section in the Style group, for buttons only. Its settings are `design` keys, so they also work in the hover design and in conditional design rules. A key you leave out keeps the button as it is today.

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Icon position | `icon_position` | `left`, `right`, `above`, `below` | `left` | Where the icon sits next to the label. |
| Content alignment | `content_align` | `start`, `center`, `end` | `center` | Horizontal position of the icon, label and state inside the button. |
| Vertical content alignment | `content_vertical_align` | `start`, `center`, `end` | `center` | Vertical position of the content (top, centre, bottom). |
| Icon size | `icon_size` | one length: `px`, `em`, `rem` | `20px` | Size of the icon. A bare number is px. |
| Icon gap | `icon_gap` | one length: `px`, `em`, `rem` | the theme gap | Space between the icon and the label. |
| Icon colour | `icon_color` | colour, `entity` or `entity 30%` | the text colour | Colour of the icon. |
| Icon background | `icon_background` | colour, `entity` or `entity 30%` | none | A filled shape behind the icon, with padding around it. |
| Icon background shape | `icon_background_shape` | `circle`, `rounded` | `circle` | Shape of the icon background. Only used with Icon background. |
| Label overflow | `label_overflow` | `wrap`, `truncate` | the button's own wrapping | `truncate` keeps the label on one line and ends it with an ellipsis. |
| Label colour | `label_color` | colour, `entity` or `entity 30%` | the text colour | Colour of the label. |
| Label font family | `label_font_family` | font names, quoted when they have spaces | the button's font | Font of the label. |
| Label font size | `label_font_size` | one length: `px`, `em`, `rem`, `%` | the button's size | Size of the label text. |
| Label font weight | `label_font_weight` | `100` to `900`, `normal`, `bold`, `lighter`, `bolder` | `500` | Weight of the label text. |
| Label text transform | `label_text_transform` | `none`, `uppercase`, `lowercase`, `capitalize` | `none` | Letter case of the label. |
| State position | `state_position` | `beside`, `below` | `beside` | Where the state text sits relative to the label. |
| State colour | `state_color` | colour, `entity` or `entity 30%` | the text colour | Colour of the state text. |
| State font size | `state_font_size` | one length: `px`, `em`, `rem`, `%` | `11px` | Size of the state text. |

Things to know:

-   Setting any position or alignment key lays the icon, label and state out on a grid. Each key then works on its own, so a hover design or a rule can change only `icon_position`.
-   `left` and `right` follow the writing direction, so in a right-to-left language they swap. `start` and `end` do the same.
-   A truncated label shows its full text as a tooltip, whether `truncate` is set in the base design, the hover design or a rule.
-   Part colours take one colour. Gradients are not accepted. `entity 30%` needs a browser that supports `color-mix` (Chromium 111 and newer). In older ones the part keeps the colour it would inherit.
-   With Use entity color on, the icon keeps the entity colour. Otherwise `icon_color` wins over the design colour.
-   Icon only buttons have no label and no state. The editor hides those settings and the card ignores them.
-   `label_font_family` loads a Google Font the same way the Font family setting does. The same notes apply, see [Typography](../../design/typography.md).
-   A value that is not a plain length (no negative numbers, no `calc()`), a colour or one of the listed words is ignored.
-   The animation `target: label` plays an animation on the label only. See [Animations](../../design/animations.md).

## Default actions

The first time you pick an entity for a new button (no entity and no `actions` yet), the editor writes actions for it:

| Entity domain | Tap | Hold |
| --- | --- | --- |
| `light`, `switch`, `fan`, `input_boolean`, `automation`, `humidifier` | `toggle` | `more-info` |
| `script`, `scene` | `perform-action` with `<domain>.turn_on` | `more-info` |
| Anything else (locks, covers, climate, media players and so on) | `more-info` | `more-info` |

After that the actions are yours to change. A button without actions does nothing on tap.

## Example

```yaml
- type: button
  entity: light.desk
  label: Desk lamp
  use_entity_icon: true
  use_entity_color: true
  show_state: true
  attribute: brightness
  button_style: outline
  actions:
    tap_action:
      action: toggle
    hold_action:
      action: more-info
```

A tall button with the icon above a truncated label, a round icon background, and a different layout while the light is on:

```yaml
- type: button
  entity: light.desk
  label: A rather long label for a small tile
  icon: mdi:desk-lamp
  show_state: true
  design:
    icon_position: above
    icon_size: 28px
    icon_background: entity 25%
    label_overflow: truncate
    label_font_weight: 600
    state_position: below
    hover:
      icon_color: entity
    conditional:
      - id: on
        conditions:
          - id: c1
            type: state
            entity: light.desk
            state: 'on'
        design:
          icon_position: left
```
