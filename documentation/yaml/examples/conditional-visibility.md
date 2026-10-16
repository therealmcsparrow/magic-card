# Conditional visibility and styling

A laundry card that only shows while the washer or dryer matters. Rows, modules and the card's look change with state and time.

```yaml
type: custom:magic-card
name: Laundry
padding: 16px
border_radius: 16px
display:
  mode: any
  conditions:
    - type: state
      entity: sensor.washer_status
      state_not: idle
    - type: state
      entity: sensor.dryer_status
      state_not: idle
conditional_appearance:
  - id: done
    name: Something finished
    mode: any
    conditions:
      - type: state
        entity: sensor.washer_status
        state: finished
      - type: state
        entity: sensor.dryer_status
        state: finished
    overrides:
      background: "#1b5e20"
      box_shadow: "0 0 0 2px #66bb6a"
rows:
  - id: washer
    display:
      conditions:
        - type: state
          entity: sensor.washer_status
          state_not: idle
    columns:
      - modules:
          - type: text
            use_entity: true
            entity: sensor.washer_status
            entity_display: name_state
            design:
              padding: 8px 12px
              border_radius: 10px
              background_color: "#2b2b2b"
              conditional:
                - id: washer-running
                  name: Running
                  conditions:
                    - type: state
                      state: running
                  design:
                    background_color: "#0d47a1"
                    color: white
          - type: bar
            entity: sensor.washer_remaining_minutes
            min: 0
            max: 180
            show_value: true
            display:
              conditions:
                - type: state
                  entity: sensor.washer_remaining_minutes
                  above: 0
  - id: dryer
    display:
      conditions:
        - type: state
          entity: sensor.dryer_status
          state_not: idle
    columns:
      - modules:
          - type: text
            use_entity: true
            entity: sensor.dryer_status
            entity_display: name_state
  - id: quiet-hours
    display:
      conditions:
        - type: time
          after: "22:00"
        - type: template
          template: "{{ is_state('input_boolean.night_mode', 'on') }}"
    columns:
      - modules:
          - type: text
            text: Quiet hours. Notifications are muted.
            design:
              font_size: 0.85rem
              color: var(--secondary-text-color)
```

Notes:

-   `display` on the card hides the whole card. `mode: any` means one matching condition is enough.
-   In the conditional design rule, the condition has no `entity`, so it reads the module's own entity (`sensor.washer_status`).
-   A `display` condition without an entity counts as met. Display conditions never fall back to the module's entity, so the bar's condition names its entity.
-   `above` and `below` are only checked when `state` and `state_not` are empty. A state that is not a number (`unavailable`, say) passes both.
-   The quiet-hours row needs both conditions (default `mode: every`): after 22:00 and night mode on. A time window across midnight needs two time conditions with `mode: any`.
-   `conditional_appearance` overrides card fields while its conditions match. Rules apply in order and later rules win.

See also: [Display conditions](../../card/display-conditions.md), [Conditional appearance](../../card/conditional-appearance.md), [Design](../../design/README.md).
