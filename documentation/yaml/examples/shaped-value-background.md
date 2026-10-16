# Shaped card with a value background

A water tank card. The card is a squircle that fills up with the tank level, and a hexagon tile beside it draws today's usage as a sparkline.

```yaml
type: custom:magic-card
name: Water tank
padding: 20px
shape: squircle
shape_options:
  corner: 32px
  smoothing: 0.8
value_background:
  type: fill
  entity: sensor.water_tank_level
  color: "#29b6f6"
  opacity: 30%
rows:
  - column_widths: [1fr, 120px]
    columns:
      - vertical_align: center
        modules:
          - type: info
            entity: sensor.water_tank_level
            show_icon: true
            icon: mdi:water
            design:
              font_size: 18
      - vertical_align: center
        modules:
          - type: info
            entity: sensor.water_usage_today
            show_name: false
            show_state: true
            design:
              shape: hexagon
              padding: 12
              border_width: 2
              border_color: "#29b6f6"
              text_align: center
              value_background:
                type: sparkline
                hours: 12
                color: "#29b6f6"
                line_width: 2
            actions:
              tap_action:
                action: more-info
```

Notes:

-   The card's `value_background` names its own `entity`: the card has none, so without it nothing is drawn. On a module, the module's entity is the default, which is why the sparkline has no `entity`.
-   `fill` runs from `min` 0 to `max` 100 unless you set them. A tank sensor in litres needs `max` set to its capacity.
-   `shape` wins over `border_radius`. The fill follows the squircle, and the border of the hexagon tile is drawn along its outline.
-   `column_widths` gives the tile a fixed 120 px and the first column the rest. It replaces `layout` for this row.
-   `font_size: 18`, `padding: 12` and `border_width: 2` are plain numbers, read as px.
-   The sparkline uses the range of its own data. Set `min` and `max` to compare days on the same scale.
-   The fill's wave and the sparkline's history fetch pause while the card is off-screen.

See also: [Shape schema](../schema.md#shape), [Value background schema](../schema.md#value-background), [Design](../../design/README.md).
