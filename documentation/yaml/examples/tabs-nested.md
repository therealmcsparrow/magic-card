# Tabs with nested layouts

One card with three tabs. Each tab holds its own layout: a row of buttons, a two-column grid with a gauge, and a stacked list.

```yaml
type: custom:magic-card
name: Living room
rows:
  - columns:
      - modules:
          - type: tabs
            tab_style: pills
            active_tab: 0
            tabs:
              - label: Lights
                icon: mdi:lightbulb-group
                modules:
                  - type: horizontal
                    gap: 8px
                    justify: space-between
                    modules:
                      - type: button
                        entity: light.ceiling
                        label: Ceiling
                        use_entity_icon: true
                        use_entity_color: true
                        actions:
                          tap_action: { action: toggle }
                      - type: button
                        entity: light.floor_lamp
                        label: Floor lamp
                        use_entity_icon: true
                        use_entity_color: true
                        actions:
                          tap_action: { action: toggle }
                      - type: button
                        entity: light.tv_strip
                        label: TV strip
                        use_entity_icon: true
                        use_entity_color: true
                        actions:
                          tap_action: { action: toggle }
              - label: Climate
                icon: mdi:thermometer
                modules:
                  - type: row
                    layout: "1-1"
                    gap: 12px
                    columns:
                      - modules:
                          - type: gauge
                            entity: sensor.living_room_temperature
                            min: 10
                            max: 30
                            gauge_style: half
                            needle: true
                            show_name: true
                            show_unit: true
                            severity:
                              - { from: 10, color: "#42a5f5" }
                              - { from: 19, color: "#66bb6a" }
                              - { from: 24, color: "#ef5350" }
                      - modules:
                          - type: info
                            entity: climate.living_room
                            attribute: current_humidity
                            show_name: true
                            show_state: true
                          - type: spinbox
                            entity: climate.living_room
              - label: Media
                icon: mdi:television
                modules:
                  - type: vertical
                    gap: 6px
                    modules:
                      - type: info
                        entity: media_player.tv
                        show_icon: true
                      - type: info
                        entity: media_player.tv
                        attribute: media_title
                        show_name: false
                        show_state: true
                      - type: slider
                        entity: media_player.tv
                        show_value: true
```

Notes:

-   Each tab is `{ label, icon, modules }`. `active_tab` is the index shown first. The open tab is remembered per card while the page is open.
-   `row` inside a tab takes `columns: [{ modules: [...] }]` and the same `layout` syntax as a card row.
-   Every nested module takes `design`, `actions` and `display` like a top-level one.
-   The spinbox and slider pick what they control from the entity's domain: a climate entity's target temperature, a media player's volume.

See also: [Layout modules](../schema.md#layout-modules-and-their-children), [Modules](../../modules/README.md).
