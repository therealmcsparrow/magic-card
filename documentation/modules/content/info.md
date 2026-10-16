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
| Secondary info | `secondary_info` | attribute name | none | A third line with this attribute, formatted by Home Assistant. |

## Name and state defaults

-   With neither `show_name` nor `show_state` set, both are on.
-   Once one of them is set, a missing other one counts as off. Configs from before these defaults keep working this way. The editor always writes both keys.
-   With both off and no secondary info, the state is shown anyway.

## Display

-   Values are formatted by Home Assistant: translated, with the unit and display precision.
-   Without an entity the name reads "No entity" and the state "—".
-   A `timer` entity (with no attribute set) shows the time left instead of its state: `H:MM:SS`, or `M:SS` under an hour. While the timer runs it counts down every second, but only while the module is on screen. A paused timer shows the time left when it was paused. An idle timer shows its state ("Idle") as usual. There is no option for this.
-   The icon takes the entity's state colour. A design text colour overrides it.

## Example

```yaml
- type: info
  entity: climate.living_room
  attribute: current_temperature
  show_icon: true
  prefix: "Now "
  secondary_info: hvac_action
```
