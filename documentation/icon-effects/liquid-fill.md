# Liquid fill

Liquid fill fills the icon from one edge like a liquid, in proportion to a value. A battery icon can show its charge, a tank icon its level. The part above the level shows the icon dimmed. Part of [Icon effects](README.md).

In the editor, turn on Liquid fill ("Fills the icon like a liquid with a value, e.g. a battery level.") in the Icon effects group. Turning it on writes `fill: {}`; turning it off removes `fill`.

## Options

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Liquid fill | `icon_fx.fill` | An object; `{}` uses every default | Off |
| Entity | `fill.entity` | An entity id | The module's entity |
| Attribute | `fill.attribute` | An attribute of that entity (shown when it has any) | The state |
| Min | `fill.min` | Number | `0` |
| Max | `fill.max` | Number | `100` |
| Color | `fill.color` | Any CSS colour, `entity`, `entity N%` | See below |
| Empty opacity (%) | `fill.empty_color` | `N%` (opacity of the empty part), or a colour (YAML) | `25%` |
| Wave | `fill.wave` | `true`, `false` | `true` |
| Direction | `fill.direction` | `up`, `down`, `left`, `right` | `up` |

- The level is `(value - min) / (max - min)`, limited to 0 to 100%.
- Without a numeric value (no entity, an unavailable entity, a text state) or with `min` equal to `max`, the icon stays dimmed and empty. Without any entity the editor shows "Pick an entity: a fill without a value stays empty."
- Picking another entity clears the attribute.
- Fill colour: `fill.color`, else the colour from [Colours](colours.md) when its style is Value, else the primary icon colour.
- `empty_color` as a percentage (`25%`, or `0.25`) is the opacity of the icon above the level. As a colour (`#444`, set in YAML) the empty part is drawn in that colour instead. The editor shows a colour value with the note "The empty part uses the color … (set in YAML); a value here replaces it."
- Wave draws a moving wave on the surface. With reduced motion turned on the surface is flat; the level still shows.
- Direction is the way the liquid rises: `up` fills from the bottom, `right` from the left edge.

## Examples

```yaml
type: icon
entity: sensor.phone_battery
icon: mdi:battery
icon_fx:
  fill: {}
```

```yaml
# water tank from an attribute, filling left to right, no wave
type: icon
entity: sensor.rain_tank
icon: mdi:water
icon_fx:
  fill:
    attribute: level_percent
    color: "#2196f3"
    empty_color: 15%
    wave: false
    direction: right
```

```yaml
# fill by another entity than the module's
type: info
entity: sensor.ev_range
show_icon: true
icon: mdi:car-electric
icon_fx:
  fill:
    entity: sensor.ev_battery
    min: 10
    max: 90
```

With Colours set to Value, the fill colour follows the same value along a gradient. See [Colours](colours.md#value).

To fill a whole module, row or column by a value instead of its icon, use a [value background](../design/value-backgrounds.md) of type Fill. It reads the entity, attribute, `min` and `max` the same way.
