# Light

A light control: an icon that toggles the light, its name and state, and the controls the light supports.

| | |
| --- | --- |
| `type` | `light` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | `light` entities (the entity picker only lists these) |
| New module | `show_brightness: true`, `show_color_temp: false`, `show_color: false`, `compact: false` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | `light.*` | none | The light. |
| Show brightness | `show_brightness` | boolean | `true` | A brightness slider, 0 to 100 %. |
| Show color temp | `show_color_temp` | boolean | `false` | A colour temperature slider in kelvin. |
| Show color picker | `show_color` | boolean | `false` | A colour input. |
| Show effects | `show_effect` | boolean | `false` | A select with the light's effects. |
| Compact mode | `compact` | boolean | `false` | Only the icon and the name, without the state line. |
| Icon effects | `icon_fx`, `icon_on`, `icon_off`, `svg` | | none | See [Icon effects](../../icon-effects/README.md). |

## Behaviour

-   Tap the icon to turn the light on or off. The icon uses the light's own colour while it is on. A design text colour overrides it.
-   The line under the name shows the brightness while a dimmable light is on, otherwise the light's state.
-   Each control only appears when the light supports it (from its colour modes and effect list). The editor notes a control that is switched on but hidden for this light.
-   Brightness 0 turns the light off.
-   The colour temperature slider covers the light's own kelvin range in steps of 50.
-   The colour input sends an RGB colour.
-   An unavailable light disables all controls.

Without an entity the module shows an inert preview.

## Example

```yaml
- type: light
  entity: light.living_room
  show_brightness: true
  show_color_temp: true
  show_effect: true
```
