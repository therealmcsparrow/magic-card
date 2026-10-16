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
