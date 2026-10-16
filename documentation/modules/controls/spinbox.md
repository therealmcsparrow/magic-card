# Spinbox

A minus button, the value and a plus button. It sets the same values as the [slider](slider.md#domains).

| | |
| --- | --- |
| `type` | `spinbox` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | `input_number`, `number`, `climate`, `water_heater`, `humidifier`, `light`, `fan`, `cover`, `valve`, `media_player`. See the slider's [domain table](slider.md#domains). |
| New module | no options set: the entity's own range and step apply |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | attribute name | domain default | Which value to set. |
| Min | `min` | number | the entity's minimum | Narrows the range. |
| Max | `max` | number | the entity's maximum | Narrows the range. |
| Step | `step` | number above 0 | the entity's step | Change per press. A step that is not a multiple of the entity's step is replaced by the entity's. |

Min and max follow the same rules as the slider: they only narrow the entity's range. Min greater than or equal to max, or a step of 0 or less, shows an error in place of the module.

## Behaviour

-   Presses are collected and sent as one service call half a second after the last press.
-   The buttons are disabled at the ends of the range, when the entity cannot be set, and when it has no current value to step from.
-   A thermostat in a range mode (heat and cool) has no single target temperature. The spinbox then shows the range, for example `19 – 23 °C`, and cannot change it. Pick `target_temp_low` or `target_temp_high` as the attribute to set one end. The editor points this out.

## Example

```yaml
- type: spinbox
  entity: climate.bedroom
  step: 0.5
```
