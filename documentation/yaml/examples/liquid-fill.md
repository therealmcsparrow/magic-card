# Liquid-fill icons

Icons that fill with a value: a phone battery coloured by level, a water tank, a humidifier with a duotone icon, and a washer whose drum turns while it runs (a binary sensor with device class `running`).

```yaml
type: custom:magic-card
name: Levels
rows:
  - layout: "1-1-1-1"
    columns:
      - modules:
          - type: icon
            entity: sensor.phone_battery
            icon: mdi:battery
            size: 56px
            icon_fx:
              fill:
                min: 0
                max: 100
              colors:
                style: value
                gradient: ["#f44336", "#ffc107", "#4caf50"]
          - type: text
            use_entity: true
            entity: sensor.phone_battery
      - modules:
          - type: icon
            entity: sensor.water_tank_level
            icon: mdi:water
            size: 56px
            icon_fx:
              fill:
                min: 0
                max: 2000
                color: "#29b6f6"
                empty_color: 15%
                wave: true
          - type: text
            use_entity: true
            entity: sensor.water_tank_level
      - modules:
          - type: icon
            entity: humidifier.bedroom
            icon: mdi:air-humidifier
            size: 56px
            icon_fx:
              fill:
                entity: sensor.bedroom_humidity
                direction: up
              colors:
                style: duotone
                primary: "#26a69a"
                secondary: 35%
      - modules:
          - type: icon
            entity: binary_sensor.washer_running
            icon: mdi:washing-machine
            size: 56px
            use_entity_color: true
            icon_fx:
              device: auto
              draw: change
```

Notes:

-   `fill` reads the module's entity unless it has its own `entity`. `min` and `max` default to 0 and 100.
-   `style: value` picks the colour along `gradient` by the fill level, so the battery turns from red through amber to green.
-   `empty_color` as a percentage is the opacity of the empty part of the icon. A colour there paints the empty part instead.
-   `device: auto` picks an animation from the entity. Check [Icon effects](../../icon-effects/README.md) for which domains and states animate.
-   `draw: change` traces the icon's outline when the entity turns on or off.
-   Icons from Material Design Icons work. Multi-colour logos and icons without a shape show as they are, without effects.

See also: [Icon effects schema](../schema.md#icon-effects).
