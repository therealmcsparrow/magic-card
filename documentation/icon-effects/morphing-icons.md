# State icons and morphing

State icons pick the icon by the entity's on or off state. Morph turns one icon into the other when the state changes. Part of [Icon effects](README.md).

## State icons

| UI label | YAML key | Values |
| --- | --- | --- |
| Icon when on | `icon_on` | An icon, for example `mdi:lock` |
| Icon when off | `icon_off` | An icon |

- Both keys sit on the module, next to `icon`, not inside `icon_fx`.
- They show in the editor on Icon, Button, Info and Light modules with an entity, above the Icon effects group. Help line: "State icons: the icon while the entity is on or off. Empty: the module's icon."
- A state icon wins over the module's icon and over the entity's own icon (Use entity icon).
- They work without any effect. Without `icon_fx` the module draws a normal icon for the current state.
- An unset side, or a missing entity, uses the module's icon.

What counts as on:

| Domain | On while |
| --- | --- |
| `lock` | `locked` |
| `cover`, `valve` | not `closed` |
| `person`, `device_tracker` | `home` |
| `media_player` | not `off`, `standby` or `idle` |
| `climate` | `hvac_action` is `heating` or `cooling`; without `hvac_action`, the state is `heat`, `cool` or `heat_cool` |
| `alarm_control_panel` | an `armed_...` state |
| `vacuum` | `cleaning` |
| Any other domain | the state is `on` |

`unavailable` and `unknown` are always off. The same on and off sides decide when [Line draw](line-draw.md) On change plays.

## Morph

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Morph | `icon_fx.morph` | `true`, `false` | `false` |

With Morph on, the icon's shape tweens into the new one whenever the drawn icon changes: between the state icons, or when the entity's own icon changes with its state. Help line: "Morphs between the state icons when the entity turns on or off."

- Icons whose shapes can't be matched (a different number of parts, a different viewBox, stroked outlines from a custom SVG) cross-fade instead.
- A change halfway through a morph continues from where the shape is.
- With reduced motion turned on the icon switches at once.
- With Morph on but no state icons, the editor says: "Pick the state icons (Icon when on / off) to morph between; unset sides use the module's icon."

```yaml
type: button
entity: lock.front_door
icon_on: mdi:lock
icon_off: mdi:lock-open-variant
icon_fx:
  morph: true
```

```yaml
# the cover's own icon changes with its state; morph between them
type: icon
entity: cover.garage
use_entity_icon: true
icon_fx:
  morph: true
```
