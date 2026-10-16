# Gauge

An arc gauge for a numeric value: a half circle, a full circle or a quarter. It only displays the value.

| | |
| --- | --- |
| `type` | `gauge` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Numeric states or attributes: `sensor`, `input_number`, `number`, a numeric attribute of any entity |
| New module | `min: 0`, `max: 100`, `needle: true`, `gauge_style: half`, `show_name: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The value source. |
| Attribute | `attribute` | attribute name | none | Reads this attribute instead of the state. |
| Min | `min` | number | `0` | Start of the arc. |
| Max | `max` | number | `100` | End of the arc. |
| Gauge style | `gauge_style` | `half`, `full`, `quarter` | `half` | Half (semicircle), Full (circle) or Quarter. |
| Show needle | `needle` | boolean | `true` | Draws a needle at the value. `false` leaves it out. |
| Show name | `show_name` | boolean | `true` | Shows the entity's name under the gauge. |
| Show unit | `show_unit` | boolean | `true` | Shows the unit after the value. |
| Decimals | `decimals` | 0 to 6 | the entity's display precision | Rounds the value. |
| Color ranges | `severity` | list of `{ from, color }` | none | Arc colour by value. |

## Behaviour

-   The arc colour comes from the colour ranges, as for the [bar](../content/bar.md#colour-ranges). Without a matching range it is the theme's primary colour.
-   The value is clamped to min and max.
-   The half style shows min and max at the ends of the arc.
-   An entity without a number shows an empty arc with the state as text.
-   Without an entity yet, the gauge shows a preview at the middle of the range.
-   Min greater than or equal to max shows "Min must be less than max".

## Example

```yaml
- type: gauge
  entity: sensor.cpu_load
  gauge_style: full
  needle: false
  show_name: true
  severity:
    - from: 0
      color: "#4caf50"
    - from: 60
      color: "#ff9800"
    - from: 85
      color: "#f44336"
```
