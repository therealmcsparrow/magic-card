# Colours

The Color style of the Icon effects group paints the icon in one colour, two tones, a gradient, or a colour picked by a value. Part of [Icon effects](README.md).

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Color style | `icon_fx.colors.style` | `solid`, `duotone`, `gradient`, `value` | `solid` |
| Color / Primary color | `colors.primary` | Any CSS colour, `entity`, `entity N%` | The module's icon colour |
| Secondary color | `colors.secondary` | A colour, or a share of the primary such as `40%` | The primary at 40% (duotone) |
| Accent color | `colors.secondary` | A colour (custom SVG only) | None |
| Gradient colors | `colors.gradient` | A list of two or more colours | `["#2196f3", "#f44336"]` |
| Angle (deg) | `colors.angle` | 0 to 360 | `90` |

The editor only shows the fields of the chosen style and drops the keys a style doesn't use when you switch: `gradient` outside Gradient and Value, `angle` outside Gradient, `secondary` outside Duotone (except on a custom SVG, where it is the accent colour). Choosing Solid removes `style`.

## Solid

The icon in one colour, `primary`. Without `primary` the icon keeps its normal colour, which is useful when only another effect is wanted.

## Duotone

The icon in two tones. `secondary` is a colour, or a percentage that means the primary at that opacity. Empty: the primary at 40% ("Empty: the primary color at 40%.").

For an icon with a single layer, such as a Material Design icon, the body is drawn in the secondary tone with an inner outline in the primary. An icon from a pack that provides a second layer uses the secondary tone for that layer.

## Gradient

A linear gradient across the icon through the Gradient colors, at Angle degrees. The editor lists the stops as Color 1, Color 2 and so on, with Add color and a delete button once there are more than two. A cleared stop is removed while more than two remain, else it goes back to its default colour. Back at the two default colours, the `gradient` key is removed.

A single colour in YAML is used for both ends.

## Value

One colour picked along the Gradient colors by a value. The value is the [liquid fill](liquid-fill.md)'s entity, attribute, `min` and `max` when a fill is set, else the module's entity on a 0 to 100 scale. Help line: "The color along these stops follows the value: Liquid fill's entity, min and max, else the module's entity from 0 to 100."

- Between hex or `rgb()` stops the colour is mixed smoothly. Theme variables can't be mixed, so the nearest stop is used as it is.
- Without a numeric value the first stop is used, dimmed.
- With a liquid fill and no `fill.color`, the fill takes this colour.

```yaml
type: icon
entity: sensor.living_room_co2
icon: mdi:molecule-co2
icon_fx:
  fill:
    min: 400
    max: 1600
  colors:
    style: value
    gradient: ["#4caf50", "#ffc107", "#f44336"]
```

## Entity colours

Colour fields in icon effects offer the entity colour button on a module with an entity. `entity` here uses the module entity's state colour. For an entity without a state colour (a sensor) it falls back to the icon's current colour. See [Entity colours](../design/entity-colours.md).

## Examples

```yaml
type: icon
entity: light.kitchen
icon: mdi:ceiling-light
icon_fx:
  colors:
    style: duotone
    primary: entity
    secondary: 30%
```

```yaml
type: icon
icon: mdi:weather-sunset
icon_fx:
  colors:
    style: gradient
    gradient: ["#ff9800", "#e91e63", "#673ab7"]
    angle: 135
```
