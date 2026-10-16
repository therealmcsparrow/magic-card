# Separator

A divider line between modules, horizontal or vertical.

| | |
| --- | --- |
| `type` | `separator` |
| Category | Layout |
| Editor tabs | General, Conditions, Design (no Actions tab) |
| Children | none |
| New module | `separator_style: solid`, `separator_color: var(--divider-color, #e5e7eb)`, `separator_width: 1px`, `direction: horizontal` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Direction | `direction` | `horizontal`, `vertical` | `horizontal` | A line across the width, or a line along the height. |
| Style | `separator_style` | `solid`, `dashed`, `dotted`, `none` | `solid` | Line style. `none` keeps the space without a line. |
| Color | `separator_color` | colour | theme divider colour | Line colour. |
| Width | `separator_width` | CSS size | `1px` | Line thickness. |

A vertical separator is as tall as the space its container gives it, so it suits a [horizontal](horizontal.md) layout with `align: stretch`.

## Example

```yaml
- type: horizontal
  align: stretch
  modules:
    - type: info
      entity: sensor.indoor_temperature
    - type: separator
      direction: vertical
      separator_style: dashed
    - type: info
      entity: sensor.outdoor_temperature
```
