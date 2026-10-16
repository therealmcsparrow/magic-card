# Animations and rings

An air purifier card. The fan icon spins while the purifier runs, the filter life fills a value ring that changes colour, and the card has an animated ring while the purifier is on.

```yaml
type: custom:magic-card
name: Air purifier
border_radius: 24px
padding: 16px
ring:
  mode: animated
  animation: snake
  length: 20
  speed: 4s
  width: 2
  color: var(--primary-color)
  glow: 6
  trigger: entity_on
  trigger_entity: fan.air_purifier
rows:
  - layout: "1-2"
    gap: 16px
    columns:
      - vertical_align: center
        modules:
          - type: icon
            entity: fan.air_purifier
            icon: mdi:fan
            size: 40px
            use_entity_color: true
            design:
              animations:
                - id: spin
                  preset: spin
                  target: icon
                  trigger: entity_on
                  duration: 1.5s
                  easing: linear
                - id: press
                  preset: press
            actions:
              tap_action:
                action: toggle
      - vertical_align: center
        modules:
          - type: info
            entity: sensor.air_purifier_filter_life
            show_name: true
            show_state: true
            design:
              padding: 12px 16px
              border_radius: 16px
              ring:
                mode: value
                min: 0
                max: 100
                width: 4
                start: top-left
                linecap: round
                track_color: var(--divider-color)
                thresholds:
                  - { from: 0, color: "#ef5350" }
                  - { from: 20, color: "#ffa726" }
                  - { from: 50, color: "#66bb6a" }
          - type: text
            text: Air quality
            design:
              font_size: 0.8rem
              color: var(--secondary-text-color)
              animations:
                - id: poor-air
                  preset: fade-pulse
                  trigger: state
                  trigger_entity: sensor.air_quality
                  state: poor
```

Notes:

-   The card has no entity, so its ring and every card, row or column animation with a play condition needs `trigger_entity`.
-   `target: icon` spins only the icon. Without it the whole module would rotate.
-   `press` is a tap preset: it plays once from the pointer on every tap.
-   The value ring reads the module's entity. `thresholds` pick the colour: the highest `from` at or below the value wins.
-   The ring follows the element's rendered `border_radius`, so it fits the rounded info box.
-   With reduced motion turned on in the system, animations stop and the ring shows without movement.

See also: [Animations schema](../schema.md#animations), [Ring schema](../schema.md#ring), [Design](../../design/README.md).
