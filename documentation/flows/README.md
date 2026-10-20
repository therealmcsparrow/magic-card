# Flow lines

A flow is an animated line between two modules of the same card, like an energy flow from solar panels to the house and the grid. Dots run along the line. With an entity, the speed and width follow its value, the line idles at or below a minimum, and a negative value runs the dots the other way (grid import and export).

Flows are stored in a list under `flows` at the top level of the card. A card without `flows` is not changed in any way.

## Pages

- [Creating flows](creating-flows.md): the Flows tab, the studio canvas, module ids
- [Options](options.md): every key, its editor label and default, including the look keys
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
- A thin line ends at the module's icon, picture or dial, where the module has one. Two icons side by side in one row get a line between their edges.
- A wide look (tube, cable, neon, zigzag or swarm, meaning random spacing, size variation or an alternate shape) ends at the module's outer box by default. Set [Attach to](options.md#attach-to) to pick the box or the icon for any look. An explicit value always wins over the default.
- On a module with a [shape](../design/shapes.md), a line attaches where it meets the shape's outline instead of the edge of the box, so it touches a hexagon's point or a circle's curve. When the line ends at the icon, it uses the icon's box instead.
- Lines follow the layout: they are measured again when the card or a module resizes, scrolls or animates in.
- A flow is not drawn when one of its modules is unknown, hidden by its display conditions on the dashboard, has no size, or lies outside the visible content (a slide that isn't shown).
- A flow from a module to itself is not drawn.
- A card draws at most 40 moving things at once. See [Limits](#limits).
- Lines pause while the card is off-screen or the page is hidden.

See [Layer](options.md#layer) for how lines sit over or under module content.

## Looks

A look changes how a line is drawn and what travels on it: dashed, dotted, double rail, wave, zigzag, tube, neon or cable lines, gradients, end markers, travelling shapes (including MDI icons), bubbles and an arrival effect. Every look key is in [Look](options.md#look).

Pick a look in the Look group of the Flows tab, or start from one of five presets: Energy, Water, Data, Heat and Neon. Each preset sets its keys in one step, and [Presets](options.md#presets) lists what each one sets.

A flow without look keys is drawn as before, and the look code is not loaded.

## Limits

Tubes, neon lines and electric zigzags take more work to draw. The card counts them and picks a quality level. The count includes flows that are off-screen.

| Level | When | What changes |
| --- | --- | --- |
| Full | Up to 3 heavy lines | Nothing |
| Lite | Over 3, up to 6 | At most 2 bubbles per flow; flicker is off; electric zigzags do not flicker |
| Minimal | Over 6 | No bubbles, no moving highlight, no arrival effect; at most 2 travelling shapes per flow |

A tube or neon line counts 1. A zigzag with Electric counts half. The line style never changes at any level: a tube stays a tube.

The card draws at most 40 moving things at once: dots, travelling shapes, bubbles, ripples and splash droplets. When a card goes over that, each moving flow gets fewer, and at least one. A spinning shape counts double. The editor shows a note when a card reaches Lite or Minimal.

## Reduced motion

With reduced motion turned on in the system, nothing moves: no travel, wave movement, bubbles, flicker, pulse, arrival effect or spin.

- A flow with a look keeps its line style and shows a direction mark. That is the end marker arrow when one is set, or else a small chevron every 160 px.
- A flow without a look is a still line with an arrowhead pointing in the flow direction.
- At idle, a flow is a still line in its idle colour.

## Related

- [Card options](../card/README.md): the other top-level card keys
- [Studio](../studio/README.md): the canvas, where you can draw flows between modules
- [Inspector](../inspector/README.md): Card settings and its tabs
- [Modules](../modules/README.md): module ids and layout modules
- [YAML reference](../yaml/README.md)
