# Control modules

Control modules change an entity directly: a slider sets a value, a dropdown picks an option, the light module toggles and dims a light. The gauge is listed here in the editor but only shows a value.

| Module | `type` | Suits |
| --- | --- | --- |
| [Button](button.md) | `button` | Any entity, or none. Runs its actions. |
| [Slider](slider.md) | `slider` | `input_number`, `number`, `light`, `fan`, `cover`, `valve`, `media_player`, `climate`, `water_heater`, `humidifier` |
| [Spinbox](spinbox.md) | `spinbox` | The same domains as the slider |
| [Dropdown](dropdown.md) | `dropdown` | `input_select`, `select`, `input_text`, `text`, `climate`, `fan`, `light`, `media_player`, `water_heater`, `humidifier` |
| [Light](light.md) | `light` | `light` entities |
| [Gauge](gauge.md) | `gauge` | Numeric states or attributes |

Notes for all controls:

-   An unavailable entity disables the control.
-   Dragging a slider or pressing a spinbox, dropdown or light control does not trigger the module's own actions.
-   After a change the control shows the new value straight away. It keeps showing it until Home Assistant reports a new state, for at most 5 seconds after the service call.

The shared keys (`type`, `id`, `entity`, `design`, `actions`, `display`) are described in [Modules](../README.md#shared-keys).
