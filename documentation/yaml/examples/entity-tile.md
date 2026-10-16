# Entity tile

A compact tile for one switch: a round icon in the entity's colour, its name and state, a toggle on tap and the more-info dialog on hold.

```yaml
type: custom:magic-card
padding: 12px
border_radius: 16px
rows:
  - columns:
      - modules:
          - type: horizontal
            entity: switch.coffee_machine
            gap: 12px
            align: center
            actions:
              tap_action:
                action: toggle
              hold_action:
                action: more-info
            modules:
              - type: icon
                entity: switch.coffee_machine
                use_entity_icon: true
                use_entity_color: true
                size: 28px
                design:
                  background_color: entity 15%
                  border_radius: 50%
                  padding: 10px
              - type: info
                entity: switch.coffee_machine
                show_name: true
                show_state: true
```

Notes:

-   The actions sit on the `horizontal` layout, so a tap anywhere on the tile toggles. Children without actions of their own leave the tap to it.
-   A layout module draws nothing from its `entity`. It is there for the actions: `toggle` and `more-info` without their own `entity` use the module's.
-   `background_color: entity 15%` paints the circle in the switch's state colour at 15% opacity. A sensor has no state colour; use a fixed colour for those.
-   `info` shows both name and state when neither `show_name` nor `show_state` is set. They are written out here to make it explicit.

See also: [Icon](../../modules/content/icon.md), [Info](../../modules/content/info.md), [Actions](../../card/actions.md).
