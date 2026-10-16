# Flow examples

Examples for [flow lines](README.md). Every key is described in [Options](options.md).

## Solar, house and grid

Solar feeds the house. The grid sensor is positive while importing and negative while exporting, so its dots change direction. Values show on the lines.

```yaml
type: custom:magic-card
rows:
  - layout: 1-1-1
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
      - modules:
          - id: grid
            type: info
            entity: sensor.grid_power
            show_icon: true
            icon: mdi:transmission-tower
flows:
  - id: solar-house
    from: solar
    to: house
    entity: sensor.solar_power
    min: 10
    max: 5000
    color: "#f9a825"
    label: value
  - id: grid-house
    from: grid
    to: house
    entity: sensor.grid_power   # negative = export: the dots run from house to grid
    max: 5000
    route: straight
    label: value
    label_position: side
```

## Battery above, house below

An elbow line from the bottom of one module to the top of another, hidden while the battery is idle.

```yaml
flows:
  - id: battery-house
    from: battery
    to: house
    from_side: bottom
    to_side: top
    route: elbow
    entity: sensor.battery_power
    min: 20
    max: 3000
    show_when: flowing
```

## A plain connector

Without an entity the line always flows at `speed`. Moving dashes instead of dots, no width scaling.

```yaml
flows:
  - id: router-nas
    from: router
    to: nas
    dots: 0
    speed: 3
    width: 2
    color: var(--secondary-text-color)
```

## Colour from the entity

`color: entity` uses the state colour of the flow's entity, or of the From module's entity when the flow has none. Here the line takes the colour of the light that the From module shows.

```yaml
flows:
  - id: lamp-desk
    from: lamp        # a module with entity: light.desk_lamp
    to: desk
    color: entity
    glow: 4
```

A flow without an entity never idles, so `idle_color` matters only with an entity. A light's state (`on`, `off`) isn't a number, so it always reads as idle. Use its brightness instead: it is a number while the light is on and missing while it is off.

```yaml
flows:
  - id: lamp-desk
    from: lamp
    to: desk
    entity: light.desk_lamp
    attribute: brightness
    max: 255
    color: entity
    idle_color: 25%
```

## A template label

```yaml
flows:
  - id: solar-house
    from: solar
    to: house
    entity: sensor.solar_power
    max: 5000
    label: template
    label_template: "{{ (states('sensor.solar_power') | float / 1000) | round(1) }} kW"
```

## Over module content

A front-layer line draws over module content, for example across a Slider module or a column with an animated background.

```yaml
flows:
  - id: car-charger
    from: car
    to: charger
    entity: sensor.charger_power
    max: 11000
    layer: front
```
