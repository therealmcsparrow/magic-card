# Info

Shows an entity's name and state, with an optional prefix, suffix, icon and one secondary attribute.

| | |
| --- | --- |
| `type` | `info` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Any entity |
| New module | `show_name: true`, `show_state: true`, `show_unit: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | string | none | Shows this attribute as the value instead of the state. |
| Show name | `show_name` | boolean | see below | Shows the entity's name. |
| Show state | `show_state` | boolean | see below | Shows the state (or the attribute). |
| Show unit | `show_unit` | boolean | `true` | Keeps the unit after the value. Only shown in the editor while Show state is on. |
| Show icon | `show_icon` | boolean | `false` | Shows an icon in front of the text. |
| Icon | `icon` | icon name | the entity's icon | The icon, with Show icon on. `svg` draws your own SVG. |
| Icon effects | `icon_fx`, `icon_on`, `icon_off`, `svg` | | none | With Show icon on. See [Icon effects](../../icon-effects/README.md). |
| Prefix | `prefix` | string | none | Text before the value. |
| Suffix | `suffix` | string | none | Text after the value. |
| Secondary info | `secondary_info` | attribute name | none | A third line with this attribute, formatted by Home Assistant. Choose Last changed in the editor, or write `last-changed`, to show how long ago the entity last changed instead. |

## Name and state defaults

-   With neither `show_name` nor `show_state` set, both are on.
-   Once one of them is set, a missing other one counts as off. Configs from before these defaults keep working this way. The editor always writes both keys.
-   With both off and no secondary info, the state is shown anyway.

## Display

-   Values are formatted by Home Assistant: translated, with the unit and display precision.
-   Without an entity the name reads "No entity" and the state "—".
-   A `timer` entity (with no attribute set) shows the time left instead of its state: `H:MM:SS`, or `M:SS` under an hour. While the timer runs it counts down every second, but only while the module is on screen. A paused timer shows the time left when it was paused. An idle timer shows its state ("Idle") as usual. There is no option for this.
-   The icon takes the entity's state colour. A design text colour overrides it.

## Last changed

With `secondary_info: last-changed` the third line shows when the entity last changed, for example "5 minutes ago". Home Assistant words the time in your language and keeps it up to date, so the line counts on by itself without a reload.

-   The line stays empty when the entity has no last-changed time.
-   It appears once Home Assistant has loaded its relative-time element, which normally happens before the card draws.
-   An attribute that is itself called `last_changed` still works as before: write its name with the underscore.

```yaml
- type: info
  entity: binary_sensor.front_door
  secondary_info: last-changed
```

## Example

```yaml
- type: info
  entity: climate.living_room
  attribute: current_temperature
  show_icon: true
  prefix: "Now "
  secondary_info: hvac_action
```
