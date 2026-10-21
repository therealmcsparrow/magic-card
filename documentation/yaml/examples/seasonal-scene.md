# Seasonal scene

A living room card whose scene follows the calendar, from snow in winter to Christmas lights in December. Stars come out at night in any season, and one switch turns the scenes off on every card.

```yaml
type: custom:magic-card
name: Living room
padding: 16px
border_radius: 20px
seasonal:
  scene: auto
  intensity: 60%
  entity: input_boolean.festive
  hemisphere: north
  combine: [daynight]
  calendar:
    christmas: 12-06..12-26
    valentine: "off"
rows:
  - columns:
      - modules:
          - type: text
            text: Living room
            design:
              font_size: 20
              font_weight: 500
          - type: info
            entity: sensor.living_room_temperature
  - column_widths: [1fr, 1fr]
    columns:
      - modules:
          - type: button
            entity: light.living_room
            label: Lights
            actions:
              tap_action:
                action: toggle
      - modules:
          - type: button
            entity: light.christmas_tree
            label: Tree
            design:
              animations:
                - preset: christmas
                  intensity: 40
                  decorations: false
            actions:
              tap_action:
                action: toggle
```

Notes:

-   `scene: auto` picks a holiday while its date range holds the date, and the season otherwise. Here Christmas starts on 6 December instead of the default 1 December, and Valentine's Day is skipped.
-   `scene: auto` keeps room at the edges for Christmas and Halloween decorations in every month. Set `decorations: false` if you want none.
-   Quote `"off"` in the calendar, or write `false`. In YAML-mode dashboards a bare `off` is read as a boolean.
-   `combine: [daynight]` adds stars and fireflies after sunset and a glow at dusk and dawn, read from `sun.sun`.
-   While `input_boolean.festive` is `off` the scene is hidden. Use the same switch on every card to turn them all off at once.
-   The `christmas` preset draws a second, smaller scene inside the Tree button only. `decorations: false` leaves out its border lights there.
-   The scene sits behind the content (`layer: back`, the default) and the content moves in so the border decorations never cover it.
-   With reduced motion turned on, the scene is a still picture.

See also: [Seasonal scenes schema](../schema.md#seasonal-scenes), [Design](../../design/README.md).
