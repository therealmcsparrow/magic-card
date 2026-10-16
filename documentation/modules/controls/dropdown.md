# Dropdown

A select list that sets an option on an entity: the option of a select entity, a thermostat's HVAC mode, a media player's source, a light's effect and so on.

| | |
| --- | --- |
| `type` | `dropdown` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | See [Domains](#domains) |
| New module | no options: the entity's own options are offered |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | attribute name, see below | domain default | Which setting to change. Only shown for climate, fan, light, media player, water heater and humidifier entities. |
| Custom options | `options` | list of `{ label, value }`, or plain strings | none | Your own labels, or a subset of the entity's options. |

## Domains

| Domain | Attribute | Options from | Service |
| --- | --- | --- | --- |
| `input_select`, `select` | none | `options` | `select_option` |
| `input_text`, `text` | none | The custom options only | `set_value` |
| `climate` | none (HVAC mode) | `hvac_modes` | `climate.set_hvac_mode` |
| `climate` | `preset_mode` | `preset_modes` | `climate.set_preset_mode` |
| `climate` | `fan_mode` | `fan_modes` | `climate.set_fan_mode` |
| `climate` | `swing_mode` | `swing_modes` | `climate.set_swing_mode` |
| `fan` | `preset_mode` (default) | `preset_modes` | `fan.set_preset_mode` |
| `light` | `effect` (default) | `effect_list` | `light.turn_on` with `effect` |
| `media_player` | `source` (default) | `source_list` | `media_player.select_source` |
| `media_player` | `sound_mode` | `sound_mode_list` | `media_player.select_sound_mode` |
| `water_heater` | `operation_mode` (default) | `operation_list` | `water_heater.set_operation_mode` |
| `humidifier` | `mode` (default) | `available_modes` | `humidifier.set_mode` |

Other entities have nothing a dropdown can set. The select is disabled and the editor lists the supported domains.

## Options list

-   With no custom options, the dropdown lists the entity's own options, translated the way Home Assistant shows them.
-   Custom options rename the entity's options or offer only some of them. An option whose value the entity does not offer is shown disabled, and the editor flags it.
-   For `input_text` and `text` the custom options are the choices.
-   Without an entity, custom options are a static list and the select is disabled.
-   YAML may list plain strings: `options: [eco, comfort]` uses each string as label and value.

In the editor each custom option has a Label and a Value field and a remove button. Add option adds the first entity option not in the list yet.

When the current value is not in the list, the select shows it as a placeholder. An unavailable entity shows its state and the select is disabled.

## Example

```yaml
- type: dropdown
  entity: climate.living_room
  attribute: preset_mode
  options:
    - label: Away
      value: away
    - label: At home
      value: home
```

```yaml
- type: dropdown
  entity: media_player.living_room
```
