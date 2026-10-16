# Light control

A light card with a header (icon, name, state and a power button), a brightness slider and colour controls.

```yaml
type: custom:magic-card
name: Living room light
rows:
  - columns:
      - gap: 12px
        modules:
          - type: horizontal
            align: center
            justify: space-between
            modules:
              - type: info
                entity: light.living_room
                show_icon: true
                show_name: true
                show_state: true
              - type: button
                entity: light.living_room
                button_style: icon-only
                icon_on: mdi:lightbulb-on
                icon_off: mdi:lightbulb-outline
                use_entity_color: true
                icon_fx:
                  morph: true
                actions:
                  tap_action:
                    action: toggle
                  hold_action:
                    action: more-info
          - type: slider
            entity: light.living_room
            show_value: true
          - type: light
            entity: light.living_room
            show_brightness: false
            show_color_temp: true
            show_color: true
            show_effect: true
            compact: true
```

Notes:

-   The slider reads the light's brightness without further options. `min`, `max` and `step` narrow the range.
-   `show_brightness: false` on the `light` module avoids a second brightness slider. Its controls only show for features the light supports.
-   The button has no `icon`: it shows `icon_on` or `icon_off` for the current state, and `morph: true` animates between them.
-   `use_entity_color` colours the button icon with the light's own colour while it is on.

See also: [Modules](../../modules/README.md), [Icon effects](../../icon-effects/README.md).
