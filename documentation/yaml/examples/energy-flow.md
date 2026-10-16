# Energy flow

Solar, grid, house and battery with animated flow lines. Speed and width follow the power, and the grid and battery lines run backwards on negative values (export, charging).

```yaml
type: custom:magic-card
name: Energy
rows:
  - columns:
      - modules:
          - id: solar
            type: info
            entity: sensor.solar_power
            show_icon: true
            icon: mdi:solar-power
            design:
              text_align: center
              width: 120px
              margin: 0 auto
  - layout: "1-1-1"
    gap: 24px
    design:
      margin_top: 40px
    columns:
      - modules:
          - id: grid
            type: info
            entity: sensor.grid_power
            show_icon: true
            icon: mdi:transmission-tower
      - modules:
          - id: house
            type: info
            entity: sensor.house_power
            show_icon: true
            icon: mdi:home
      - modules:
          - id: battery
            type: info
            entity: sensor.battery_power
            show_icon: true
            icon: mdi:home-battery
flows:
  - id: solar-house
    from: solar
    to: house
    entity: sensor.solar_power
    max: 6000
    color: "#f9a825"
    label: value
  - id: grid-house
    from: grid
    to: house
    entity: sensor.grid_power        # import positive, export negative
    max: 6000
    color: "#42a5f5"
    route: straight
  - id: battery-house
    from: battery
    to: house
    entity: sensor.battery_power     # discharge positive, charge negative
    max: 3000
    color: "#66bb6a"
    route: straight
    show_when: flowing
  - id: solar-battery
    from: solar
    to: battery
    route: elbow
    from_side: right
    to_side: top
    dots: 0                          # moving dashes, no entity: always flowing
    speed: 4
    color: "#f9a825"
    idle_color: 20%
```

Notes:

-   Flows find modules by `id`. Without an `id` a module has a derived id that changes when it moves, so give every connected module its own.
-   `max` is the value at full speed and double width. At or below `min` (default 0) the line idles in `idle_color`.
-   `show_when: flowing` hides the battery line while it is idle.
-   `label: value` prints the formatted entity value on the line, or beside it when the line is short.
-   The space above the second row (`margin_top`) gives the curve from solar room to bend.

See also: [Flow lines](../../flows/README.md), [Flows schema](../schema.md#flows).
