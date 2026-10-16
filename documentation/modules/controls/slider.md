# Slider

A slider for an entity's numeric value. What it sets depends on the entity's domain. The service call goes out when you let go.

| | |
| --- | --- |
| `type` | `slider` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | See [Domains](#domains). Other entities (sensors) are shown read-only. |
| New module | `show_value: true`, `direction: horizontal` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | attribute name | domain default | Which value to set, see [Domains](#domains). |
| Min | `min` | number | the entity's minimum | Narrows the range. |
| Max | `max` | number | the entity's maximum | Narrows the range. |
| Step | `step` | number above 0 | the entity's step | The step. |
| Show value | `show_value` | boolean | `true` | Shows the value next to the slider. `false` hides it. |
| Direction | `direction` | `horizontal`, `vertical` | `horizontal` | Orientation. |
| Slider color | `slider_color` | colour | design text colour, else theme primary | Colour of the slider. |
| Track color | `track_color` | colour | design `background`, else the default track | Colour of the track. |

Empty Min, Max and Step use the entity's own range and step. The editor shows them as placeholders.

-   Min and max only narrow the entity's range. Values outside what the entity accepts fall back to the entity's own limits, so the slider never sends a value the entity refuses.
-   A step is used when it is a multiple of the entity's step. Otherwise the entity's step applies.
-   Min greater than or equal to max shows "Min must be less than max". A step of 0 or less shows "Step must be greater than 0".

When the entity or attribute cannot be set, the slider is disabled and the editor says so.

## Domains

| Domain | Attribute | Value | Service |
| --- | --- | --- | --- |
| `input_number`, `number` | none | The state, with the entity's min, max and step | `set_value` |
| `light` | none, `brightness` or `brightness_pct` | Brightness 0 to 100 % | `light.turn_on` with `brightness_pct`. 0 turns the light off. |
| `light` | `color_temp_kelvin` (or `color_temp`) | Colour temperature in kelvin across the light's range, step 50 | `light.turn_on` with `color_temp_kelvin` |
| `fan` | none or `percentage` | Speed 0 to 100 % (0 while off) | `fan.set_percentage`, if the fan supports speeds |
| `cover` | none or `current_position` | Position 0 to 100 % | `cover.set_cover_position`, if supported |
| `cover` | `current_tilt_position` | Tilt 0 to 100 % | `cover.set_cover_tilt_position`, if supported |
| `valve` | none or `current_position` | Position 0 to 100 % | `valve.set_valve_position`, if supported |
| `media_player` | none or `volume_level` | Volume 0 to 100 % | `media_player.volume_set`. Not while the player is off. |
| `climate` | none or `temperature` | Target temperature, with the entity's min, max and step | `climate.set_temperature` |
| `climate` | `target_temp_low`, `target_temp_high` | One end of a target range | `climate.set_temperature` with both ends |
| `climate` | `humidity` | Target humidity | `climate.set_humidity` |
| `water_heater` | none or `temperature` | Target temperature | `water_heater.set_temperature` |
| `humidifier` | none or `humidity` | Target humidity | `humidifier.set_humidity` |

Any other domain or attribute is read-only: the slider shows the numeric value but cannot be moved.

## Example

```yaml
- type: slider
  entity: cover.living_room_blinds
  show_value: true
  slider_color: "#ff9800"
```

```yaml
- type: slider
  entity: light.desk
  attribute: color_temp_kelvin
  direction: vertical
```
