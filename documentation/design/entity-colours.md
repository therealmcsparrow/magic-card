# Entity colours

A colour value of `entity` uses the colour Home Assistant gives the module's entity in its current state. `entity 20%` is the same colour at 20% opacity.

```yaml
type: button
entity: light.living_room
design:
  color: entity
  background_color: entity 15%
  border_width: 1px
  border_color: entity 40%
```

## Where it works

| Place | Keys |
| --- | --- |
| Design colour fields | `color`, `background_color`, `border_color`, `outline_color` |
| [Animations](animations.md) | `color` of each animation entry |
| [Ring](ring.md) | `color`, `track_color` |
| [Conditional rules](conditional-design.md) | The same keys inside a rule's `design` |
| [Value backgrounds](value-backgrounds.md) | `color`. Here `entity` is the state colour of the value background's own entity. |

The same value also works in [icon effects](../icon-effects/colours.md) and on [flow lines](../flows/options.md), which resolve it in their own way (see those pages).

`background` is a free text property and doesn't accept `entity`. Use `background_color`.

## Which colour

The colour follows Home Assistant's own state colours:

- A light that is on uses its own colour (`rgb_color`, else `hs_color`). Without a colour attribute, and for other active entities, the theme's state colour applies: `--state-<domain>-<state>-color`, then `--state-<domain>-active-color`, `--state-active-color`, then `--primary-color`.
- An inactive entity uses `--state-<domain>-inactive-color`, then `--state-inactive-color`, then `--disabled-text-color`.
- Only domains that Home Assistant colours by state have a colour: alarm_control_panel, alert, automation, binary_sensor, calendar, camera, climate, cover, device_tracker, fan, group, humidifier, input_boolean, lawn_mower, light, lock, media_player, person, plant, remote, schedule, script, siren, sun, switch, timer, update, vacuum, valve and water_heater.
- Sensors and other domains have no state colour. There, and on an element without an entity, `entity` falls back to the current text colour.

"Active" uses Home Assistant's rules per domain. For example a cover that is not closed, a lock that is not locked and a person who is not `not_home` count as active. `off`, `unavailable`, `unknown`, `idle` and `standby` never do.

## In the editor

On a module with an entity, colour fields have a palette button, "Use the entity's state color". Pressing it sets the value to `entity`. The field then shows a live swatch of the colour, the text "Entity color" and an Opacity field in `%` (empty is 100%). An opacity below 100 is stored as `entity N%`; 100 or empty is stored as `entity`. Pressing the button again clears the value.

Rows, columns and the card have no entity, so their colour fields don't show the button. Typed in YAML, `entity` there falls back to the text colour.
