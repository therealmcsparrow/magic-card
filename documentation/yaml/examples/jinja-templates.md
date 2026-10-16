# Jinja templates

Every place the card reads Jinja, in one card: a text line, a markdown block that uses its module entity, a template condition and a flow label.

```yaml
type: custom:magic-card
name: Home summary
rows:
  - columns:
      - modules:
          - type: text
            use_template: true
            text: >-
              {% set n = states.light | selectattr('state', 'eq', 'on') | list | count %}
              {{ n }} light{{ '' if n == 1 else 's' }} on
            design:
              font_size: 1.4rem
              font_weight: "500"
          - type: markdown
            entity: sensor.outdoor_temperature
            content: |
              **Outside:** {{ states(entity) }} {{ state_attr(entity, 'unit_of_measurement') }}
              {% if states(entity) | float(0) < 0 %}
              Frost tonight. Cover the plants.
              {% endif %}
  - id: away-row
    display:
      conditions:
        - type: template
          template: "{{ states('zone.home') | int(0) == 0 }}"
    columns:
      - modules:
          - type: text
            text: Nobody home. Alarm armed.
  - layout: "1-1"
    gap: 48px
    columns:
      - modules:
          - id: car
            type: info
            entity: sensor.car_battery
            show_icon: true
            icon: mdi:car-electric
      - modules:
          - id: charger
            type: info
            entity: sensor.charger_power
            show_icon: true
            icon: mdi:ev-station
flows:
  - from: charger
    to: car
    entity: sensor.charger_power
    max: 11000
    label: template
    label_template: "{{ (states('sensor.charger_power') | float(0) / 1000) | round(1) }} kW"
```

Notes:

-   Home Assistant renders each template on the server and sends a new result when an entity in it changes. The card re-renders when a new result arrives.
-   The text module only treats `text` as Jinja when `use_template: true` and the text contains `{{`, `{%` or `{#`. A template error shows in place of the text.
-   In markdown, `entity` is a template variable holding the module's entity id. With `attribute` set as well, `attribute_name` holds the attribute.
-   The template condition is not met while the first result is pending, so the row appears a moment after the card.
-   Quote a template that starts with `{`, or use a block scalar (`>-` or `|`). A bare `{` starts a YAML map.
-   The flow has no `id`. It gets `charger>car` as its id.

See also: [Jinja templates](../value-syntax.md#jinja-templates).
