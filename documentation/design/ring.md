# Ring

A ring is a line drawn along the element's outline. It follows the rendered size and border radius, so it fits a rounded card, a pill or a circle, and it moves with the layout when the element resizes. On an element with a [shape](shapes.md) it runs along the shape instead. It takes no space and never blocks taps.

A module, row or column stores it under `design.ring`. The card stores it under `ring` at the top level. In the editor it is the Ring section of the [Design tab](README.md), and the Ring field in the card's Design tab.

## Contents

- [Modes](#modes)
- [Value mode](#value-mode)
- [Min and max from an entity](#min-and-max-from-an-entity)
- [Timers](#timers)
- [Animated mode](#animated-mode)
- [Look](#look)
- [Show condition](#show-condition)
- [Reduced motion](#reduced-motion)
- [Examples](#examples)

## Modes

| UI label | `mode` | What it draws |
| --- | --- | --- |
| Off | not set | Nothing. Choosing Off removes the whole `ring` key. |
| Value | `value` | The outline filled in proportion to an entity value |
| Animated | `animated` | A moving stroke |

Any other `mode` value also means off.

Each field has a reset button while it is set. Only the fields of the chosen mode show.

## Value mode

The ring fills from the start point to `(value - min) / (max - min)` of the outline, limited to 0 to 100%.

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Entity | `entity` | An entity id | The module's entity |
| Attribute | `attribute` | An attribute of the entity (shown when it has any) | The state |
| Min | `min` | A number, or `{ entity, attribute }` | `0` |
| Max | `max` | A number, or `{ entity, attribute }` | `100` |
| Timer fill | `timer_fill` | `remaining`, `elapsed`. Shown for a timer entity. | `remaining` |
| Fill transition | `transition` | CSS time (`s`, `ms`) | `1s` |
| Thresholds | `thresholds` | A list of `{ from, color }` | None |

- Cards, rows and columns have no entity, so a value ring there needs `entity`. Without one the editor shows "Pick an entity: a value ring without one stays empty."
- A missing or non-numeric value, or `min` equal to `max`, draws an empty ring.
- Thresholds colour the ring by value. The editor lists each as "Range N · from X" with From and Color fields, and Add range. The range with the highest `from` at or below the value wins and replaces Color. A `to` in older configs limits a range from above.

## Min and max from an entity

Min and Max each have a Number / Entity switch. With Entity, pick an entity and, if you like, one of its attributes. The ring then uses that entity's numeric state or attribute as the bound, so a battery ring can run up to the battery's reported capacity. When the entity is missing, unavailable or not a number, the default applies (0 for Min, 100 for Max). The card redraws when that entity changes.

Reset puts the field back to Number with no value.

```yaml
ring:
  mode: value
  entity: sensor.battery_stored
  max:
    entity: sensor.battery_capacity
    attribute: usable
```

## Timers

A value ring on a `timer` entity, with no attribute set, follows the timer:

| Timer state | Ring |
| --- | --- |
| Active | The time left as a share of the duration. It counts down from `finishes_at` against the browser's clock. Without `finishes_at` it counts down from the `remaining` attribute, starting at the timer's last state change. |
| Paused | The `remaining` attribute against the duration |
| Idle | Empty. A track still shows when `track_color` or `track_opacity` is set. |

With `timer_fill: elapsed` (Timer fill: Elapsed) the ring fills up as time passes instead of emptying.

The editor shows Timer fill for a timer and hides Min, Max and Attribute, which do not apply to it. Thresholds still work, on the remaining percentage from 0 to 100: `from: 25` means 25% or more of the time is left.

An active timer ring moves every second, with a linear fill transition so the steps join up. A Fill transition longer than 1 s is shortened to 1 s for a running timer. All timer rings on the page share one 1 s timer, which only runs while at least one active timer ring is on screen. Other rings start no timer.

To show the time left as text, use the [Info](../modules/content/info.md) module, or the [Text](../modules/content/text.md) module with Display set to Remaining.

## Animated mode

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Animation | `animation` | `snake`, `pulse`, `full`, `dots`, `dashes` | `snake` |
| Length (%) | `length` | 1 to 99, Snake only | `25` |
| Speed | `speed` | CSS time (`s`, `ms`), not for Full | `3s` |

| UI label | `animation` | Draws |
| --- | --- | --- |
| Snake | `snake` | A segment of `length` % of the outline running around it. `speed` is one lap. |
| Pulse | `pulse` | The whole outline pulsing. `speed` is one pulse. |
| Full | `full` | The whole outline, still |
| Chase dots | `dots` | 12 dots running around the outline |
| Marching ants | `dashes` | Short dashes moving along the outline |

## Look

These fields show in both modes.

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Width (px) | `width` | 0.5 to 40 | `3` |
| Glow (px) | `glow` | 0 to 40, blur of a glow around the stroke | `0` (off) |
| Color | `color` | Any CSS colour, `entity`, `entity N%`, or a linear gradient | The theme's primary colour |
| Track color | `track_color` | Any CSS colour, `entity`, `entity N%` | No track |
| Track opacity (%) | `track_opacity` | 0 to 100 | 100 |
| Start | `start` | `top` (Top), `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, `top-left` | `top` |
| Direction | `direction` | `cw` (Clockwise), `ccw` (Counter-clockwise) | `cw` |
| Caps | `linecap` | `round`, `butt` (Flat) | `round` |
| Position | `position` | `inside`, `center`, `outside` | `inside` |

- The track is the full outline under the ring. It is drawn when `track_color` or `track_opacity` is set. With only `track_opacity`, the track is the ring colour at that opacity.
- Position places the stroke inside the border edge, centred on it, or outside it.
- The card clips its own edge, so the card's ring has no Outside option and `outside` is drawn inside. The editor says: "The card clips its edge: the ring sits inside it and its glow shows inward."
- A shaped element is clipped to its shape, so its ring is always drawn inside, whatever Position says. Inside a cut or rounded corner, the ring keeps an even distance from the outline. Start picks the point of the shape nearest to that position.
- An open pop-up has a rectangular surface, so the ring of a shaped pop-up card follows the border radius there.
- `entity` colours use the module entity's state colour. The editor offers them on modules with an entity. See [Entity colours](entity-colours.md).
- A gradient colour paints the stroke along the gradient. Rings read linear gradients only, so a radial one is drawn as a linear one. Thresholds, the track and the glow stay solid. See [Gradients](gradients.md).
- Start sets the point where the stroke begins. The corner starts (Top right, Bottom right, Bottom left and Top left) sit in the middle of a rounded corner, or on the corner itself when the corner is sharp. The stroke runs from there in the chosen direction and closes on the same point.

## Right to left

When the card is shown right to left, a ring swaps its start and direction.

- Start swaps Left and Right, including the corner starts (Top right becomes Top left). Top and Bottom stay.
- Clockwise and counter-clockwise swap, so a ring that runs clockwise in a left-to-right layout runs counter-clockwise on screen. The stroke still begins at the mirrored point and closes on it.
- The outline, corner radii, gradient and timer do not change. A gradient colour paints the stroke as before, and a timer ring still counts down once a second.
- The `start` and `direction` keys in your YAML stay as you wrote them.

The ring follows the direction of the page and of its own container, and updates when either changes. See [Accessibility](../accessibility/README.md#right-to-left).

## Show condition

| UI label | YAML key | Values |
| --- | --- | --- |
| Entity for show condition | `trigger_entity` | An entity id. Default: the module's entity. |
| Show | `trigger` | `always` (default), `entity_on` (While entity is on), `state` (While state equals…) |
| State value | `state` | The state for `trigger: state` |

While the condition doesn't hold, no ring is drawn. "On" uses Home Assistant's active state per domain, the same as for [animations](animations.md#play-conditions). Cards, rows and columns need `trigger_entity` for the entity options.

## Reduced motion

With reduced motion turned on, animated rings stand still and a value ring changes without a transition. A timer ring still moves every second, in steps.

## Examples

```yaml
# battery level around an icon, red below 20
type: icon
entity: sensor.phone_battery
icon: mdi:cellphone
design:
  border_radius: 50%
  padding: 12px
  ring:
    mode: value
    width: 4
    track_opacity: 20
    thresholds:
      - from: 0
        color: "#f44336"
      - from: 20
        color: "#4caf50"
```

```yaml
# a snake running around the card while the washing machine runs
type: custom:magic-card
border_radius: 24px
ring:
  mode: animated
  animation: snake
  length: 30
  speed: 4s
  glow: 6
  color: "#03a9f4"
  trigger: state
  trigger_entity: sensor.washing_machine
  state: running
rows: []
```

```yaml
# a tea timer that empties as it runs, orange then red near the end
type: info
entity: timer.tea
show_icon: true
design:
  border_radius: 16px
  ring:
    mode: value
    width: 4
    track_opacity: 30
    thresholds:
      - from: 0
        color: "#ef5350"
      - from: 25
        color: "#ffa726"
      - from: 50
        color: "#66bb6a"
```

The [animation presets](animations.md) Border snake, Power flow dots and Marching ants draw the same kind of stroke as an animated ring, as part of an element's animation list.
