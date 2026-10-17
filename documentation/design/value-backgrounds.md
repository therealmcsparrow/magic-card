# Value backgrounds

A value background draws an entity's value behind an element's content: a tank that fills up to the value, or a faint sparkline of its recent history. It sits over the element's own background and under its content, and follows the element's border radius or [shape](shapes.md).

A module, row or column stores it under `design.value_background`. The card stores it under `value_background` at the top level. In the editor it is the Value background section of the [Design tab](README.md), in the Style group, and the Value background field in the card's Design tab.

## Contents

- [Example](#example)
- [In the editor](#in-the-editor)
- [Options](#options)
- [Fill](#fill)
- [Sparkline](#sparkline)
- [Things to know](#things-to-know)

## Example

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.water_tank
            design:
              shape: squircle
              value_background:
                type: fill
                color: "#29b6f6"
                opacity: 35%
          - type: info
            entity: sensor.living_room_temperature
            design:
              value_background:
                type: sparkline
                hours: 12
                min: 15
                max: 25
```

## In the editor

Type is a segmented control: Off, Fill or Sparkline. Once a type is picked, the section shows the entity, the range, the colour and the fields of that type. Each set field has a reset button.

- Off removes `value_background`. On a template-linked card it writes `value_background: { type: none }` instead, so the template's value background stays off. In a [conditional rule](conditional-design.md) over a Default design with a value background it does the same.
- Switching between Fill and Sparkline keeps the shared fields (entity, attribute, range, colour, opacity) and removes the fields only the other type reads.
- On a module, Entity is labelled "Module entity (entity id)" and the help line reads "Empty uses the module entity (entity id)." Rows, columns and the card have no entity. Without one the section shows "Pick an entity: a value background without one draws nothing."
- Attribute shows once the entity has attributes.
- Color offers the entity colour button when there is an entity.
- The fill colour can be a gradient. The hatch, the floor, the wave and the sparkline use its first colour. See [Gradients](gradients.md).

Value background isn't available in the [Hover](hover.md) view.

## Options

| UI label | YAML key | Types | Values | Default |
| --- | --- | --- | --- | --- |
| Type | `type` | | `fill`, `sparkline`, `none` | Not set: nothing is drawn |
| Entity | `entity` | Both | An entity id | The module's entity |
| Attribute | `attribute` | Both | An attribute of the entity | The state |
| Min | `min` | Both | Number | Fill `0`, sparkline the data's own range |
| Max | `max` | Both | Number | Fill `100`, sparkline the data's own range |
| Fill color / Line color | `color` | Both | Any CSS colour, `entity`, `entity N%` | The theme's primary colour |
| Fill opacity / Area opacity | `opacity` | Both | `25%`, `0.25` or `25` | Fill `25%`, area `18%` |
| Direction | `direction` | Fill | `up`, `down`, `left`, `right` | `up` |
| Wave | `wave` | Fill | `true`, `false` | `true` |
| Hours | `hours` | Sparkline | A number above 0, at most 168 (a week). Help line: "Up to 168 (a week)." | `24` |
| Line width (px) | `line_width` | Sparkline | A number above 0 (the editor offers 0.5 to 20) | `1.5` |
| Area | `area` | Sparkline | `true`, `false` | `true` |
| Smoothing | `smoothing` | Sparkline | `true`, `false` | `true` |

- `none` draws nothing. It turns off a value background that a template or the Default design sets.
- `entity` and `entity N%` use the state colour of the value background's own entity, see [Entity colours](entity-colours.md).
- The opacity field in the editor is a `%` field. In YAML a number up to 1 is a fraction and a larger one a percentage.
- Wave, Area and Smoothing are switches. Turning one off writes `false`; turning it on again removes the key.

## Fill

A tank fills the element from one side up to `(value - min) / (max - min)`, limited to 0 to 100%. Direction is the way the level rises: `up` fills from the bottom, `right` from the left edge.

- The level moves to a new value over 600 ms.
- Wave draws a moving wave on the surface. Help line: "An animated wave on the surface. Still with reduced motion." There is no wave on an empty or a full tank.
- A value at the minimum shows an empty tank with a thin line along its floor.
- An unavailable or non-numeric value, or `min` equal to `max`, shows an empty tank with a faint hatch.

```yaml
# a battery level filling a row from the left
rows:
  - design:
      value_background:
        type: fill
        entity: sensor.home_battery_level
        direction: right
        color: entity
        wave: false
    columns:
      - modules: []
```

## Sparkline

A sparkline draws the entity's recorded history over the last `hours`, up to now, as a line with a filled area under it.

- It sits in the lower part of the element, about 65% of its height, so text at the top stays clear.
- The area fades out towards the top. Its opacity at the bottom edge is Area opacity.
- The line stays faint (45%) so text over it stays readable. Help line: "The area fades out upwards. The line stays faint (45%) so text over it stays readable." The CSS variable `--mc-value-bg-line-opacity` changes it.
- The live value is added at the right end. While the live value is unavailable, the last recorded value is held to the end as a dashed line.
- Min and Max fix the vertical range. Without them the line uses the range of its data. With only one of them set, the other end follows the data. Values outside the range are drawn at the edge. A value that never changed is a flat line through the middle.
- Smoothing draws a curve that never overshoots between two points. Turned off, the points are joined by straight segments.
- A long history is averaged into at most 60 points.
- A sparkline without history, or with history that fails to load, draws nothing. Help line: "History that can't be loaded draws nothing."

History is shared: sparklines and [graphs modules](../modules/README.md) that show the same entity, window and attribute make one request between them. It is fetched again after 5 minutes, and only while the element is on screen.

```yaml
type: info
entity: sensor.outdoor_temperature
design:
  value_background:
    type: sparkline
    hours: 48
    line_width: 2
    smoothing: false
```

## Things to know

- Rows, columns and the card need their own `entity`. Without one nothing is drawn.
- The element becomes its own stacking context. A dropdown list or tooltip of that module can then render under its neighbours.
- The wave pauses while the element is off-screen and stands still with reduced motion turned on.
- An open pop-up doesn't show the card's own value background.
- On a card with [flow lines](../flows/README.md), a row or column with a value background is lifted above lines on the back layer, so its background covers them.
- A value background works with a [liquid fill](../icon-effects/liquid-fill.md) on the icon; both read their value the same way.
