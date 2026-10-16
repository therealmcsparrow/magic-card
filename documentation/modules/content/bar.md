# Bar

A progress bar that fills between a minimum and a maximum, with optional colour ranges and the value as text.

| | |
| --- | --- |
| `type` | `bar` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Numeric states or attributes: `sensor` (battery, humidity, power), `input_number`, `number`, a numeric attribute of any entity |
| New module | `min: 0`, `max: 100`, `bar_height: 8px`, `bar_color: var(--primary-color, #03a9f4)`, `bar_background: var(--divider-color, #e0e0e0)`, `show_value: true`, `direction: horizontal` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The value source. |
| Attribute | `attribute` | attribute name | none | Reads this attribute instead of the state. |
| Min | `min` | number | `0` | Value of an empty bar. |
| Max | `max` | number | `100` | Value of a full bar. |
| Bar height | `bar_height` | CSS size | `8px` | Thickness of the track. For a vertical bar this is its width. |
| Bar color | `bar_color` | colour | theme primary colour | Fill colour, below the first colour range. |
| Bar background | `bar_background` | colour | theme divider colour | Track colour. |
| Color ranges | `severity` | list of `{ from, color }` | none | Fill colour by value, see below. |
| Show value | `show_value` | boolean | `true` | Shows the value as text. `false` hides it. |
| Decimals | `decimals` | 0 to 6 | the entity's display precision | Rounds the shown value. Only in the editor while Show value is on. |
| Direction | `direction` | `horizontal`, `vertical` | `horizontal` | A vertical bar fills from the bottom, with the value above it. |

## Behaviour

-   The value is clamped to min and max.
-   An entity without a number (unavailable, unknown, `on`, a missing attribute) shows an empty, muted bar with the entity's state as the text.
-   The text is formatted by Home Assistant, with the unit.
-   A vertical bar is at least 40 pixels high.
-   Min greater than or equal to max shows the error "Min must be less than max".

## Colour ranges

`severity` is a list of ranges. The range with the highest `from` at or below the value gives the fill colour. Ranges see the clamped value, so a value past max keeps the colour of the top range. Older configs may have a `to` on a range: the range then stops applying above that value. The editor keeps such a `to` and notes it.

In the editor, Color ranges is a list with From and Color per range, a delete button and Add range.

## Example

```yaml
- type: bar
  entity: sensor.phone_battery
  show_value: true
  bar_height: 10px
  severity:
    - from: 0
      color: "#f44336"
    - from: 20
      color: "#ff9800"
    - from: 50
      color: "#4caf50"
```
