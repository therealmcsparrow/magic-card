# Vertical

Stacks its children top to bottom.

| | |
| --- | --- |
| `type` | `vertical` |
| Category | Layout |
| Editor tabs | General, Actions, Conditions, Design |
| Children | `modules` |
| New module | `modules: []`, `gap: 8px`, `align: stretch` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Gap | `gap` | CSS size | `8px` | Space between children. |
| Align | `align` | `start`, `center`, `end`, `stretch` | `stretch` | Horizontal alignment of the children. Stretch gives each child the full width. |
| (tree) | `modules` | list of modules | empty | The children, top to bottom. They are added and arranged in the structure tree, not in the General tab. See [Editing children](README.md#editing-children). |

A column of a row already stacks its modules. A vertical layout is useful inside a horizontal layout, a row module or a tab, or to give a group of modules one design or one set of actions.

## Example

```yaml
- type: vertical
  gap: 4px
  align: center
  modules:
    - type: icon
      entity: binary_sensor.front_door
      use_entity_icon: true
      use_entity_color: true
    - type: text
      use_entity: true
      entity: binary_sensor.front_door
```
