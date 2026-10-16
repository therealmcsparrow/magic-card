# Horizontal

Places its children side by side, in one line (CSS flexbox).

| | |
| --- | --- |
| `type` | `horizontal` |
| Category | Layout |
| Editor tabs | General, Actions, Conditions, Design |
| Children | `modules` |
| New module | `modules: []`, `gap: 8px`, `align: center`, `justify: start` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Gap | `gap` | CSS size | `8px` | Space between children. |
| Align | `align` | `start`, `center`, `end`, `stretch` | `center` | Vertical alignment of the children. |
| Justify | `justify` | `start`, `center`, `end`, `space-between`, `space-around` | `start` | How the children share the width. |
| (tree) | `modules` | list of modules | empty | The children, left to right. They are added and arranged in the structure tree, not in the General tab. See [Editing children](README.md#editing-children). |

## Example

```yaml
- type: horizontal
  gap: 12px
  justify: space-between
  modules:
    - type: icon
      icon: mdi:thermometer
    - type: info
      entity: sensor.living_room_temperature
      show_name: false
    - type: button
      label: Boost
      icon: mdi:fire
      actions:
        tap_action:
          action: perform-action
          service: script.turn_on
          data:
            entity_id: script.heating_boost
```
