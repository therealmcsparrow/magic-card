# Flow lines

A flow is an animated line between two modules of the same card, like an energy flow from solar panels to the house and the grid. Dots run along the line. With an entity, the speed and width follow its value, the line idles at or below a minimum, and a negative value runs the dots the other way (grid import and export).

Flows are stored in a list under `flows` at the top level of the card. A card without `flows` is not changed in any way.

## Pages

- [Creating flows](creating-flows.md): the Flows tab, the studio canvas, module ids
- [Options](options.md): every key, its editor label and default
- [Examples](examples.md): energy flows, plain connectors, labels

## Minimal example

Flows connect modules by their `id`. The editor gives a module an id when you pick it; in YAML, add one yourself.

```yaml
type: custom:magic-card
rows:
  - layout: 1-1
    columns:
      - modules:
          - id: solar
            type: info
            entity: sensor.solar_power
            show_icon: true
            icon: mdi:solar-power
      - modules:
          - id: house
            type: info
            entity: sensor.house_power
            show_icon: true
            icon: mdi:home
flows:
  - id: solar-house
    from: solar
    to: house
    entity: sensor.solar_power
    max: 5000
```

`from`, `to` and usually `entity` are enough. Everything else has a default.

## How the value drives the line

- Without an entity the line always flows at `speed`.
- With an entity, the value (its state, or `attribute`) is compared as a magnitude. At or below `min` (default 0), or without a numeric value, the line idles: no dots, drawn in `idle_color`.
- Above `min`, the speed goes from `min_speed` (8 s per trip, just above `min`) to `speed` (2 s, at `max`). The scale is logarithmic, so small loads still move visibly on a line sized for large ones. With `scale_width` on, the width grows from `width` to twice `width` on the same scale.
- A negative value runs the dots from `to` to `from` while `reverse_negative` is on (the default).
- With `show_when: flowing` the whole line hides while it idles.

## Where lines are drawn

- A line runs from a side of the From module to a side of the To module. `auto` picks the facing sides. Several lines on the same side of a module spread out along it.
- On a module with a [shape](../design/shapes.md), a line attaches where it meets the shape's outline instead of the edge of the box, so it touches a hexagon's point or a circle's curve.
- Lines follow the layout: they are measured again when the card or a module resizes, scrolls or animates in.
- A flow is not drawn when one of its modules is unknown, hidden by its display conditions on the dashboard, has no size, or lies outside the visible content (a slide that isn't shown).
- A flow from a module to itself is not drawn.
- With more than 40 dots on one card, each flow gets fewer dots (at least one).
- Lines pause while the card is off-screen.

See [Layer](options.md#layer) for how lines sit over or under module content.

## Reduced motion

With reduced motion turned on in the system, a flow is a still line with an arrowhead pointing in the flow direction.

## Related

- [Card options](../card/README.md): the other top-level card keys
- [Studio](../studio/README.md): the canvas, where you can draw flows between modules
- [Inspector](../inspector/README.md): Card settings and its tabs
- [Modules](../modules/README.md): module ids and layout modules
- [YAML reference](../yaml/README.md)
