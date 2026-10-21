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

## Space while the module loads

A slider, spinbox, dropdown, light or gauge loads a moment after the rest of the card. Until then the card shows an empty box with the height the module usually has, worked out from the module's settings, so nothing below it moves when the control appears. To fix the height yourself, set `design.height` or `design.min_height` on the module.

| Module | Height reserved |
| --- | --- |
| Slider | 40 px (a vertical slider keeps its own height) |
| Spinbox | 32 px, or the size of `--mc-spinbox-btn-size` when a theme or the module's `css` sets it |
| Dropdown | 41 px |
| Light | 33 px for the name row, plus 48 px for brightness (unless `show_brightness: false`), 48 px for `show_color_temp`, 40 px for `show_color` and 37 px for `show_effect`. 40 px with `compact: true`. |
| Gauge | 109 px for the half gauge (100 px with `needle: false`) or 120 px for the full and quarter gauges, plus 18 px for the name when the module has an entity and `show_name` is not `false` |
| [Tabs](../layout/tabs.md) | 39 px for the tab bar (36 px for `pills`, 41 px for `underline`). The tab content appears below it when the module loads, so the card grows by the height of that content. |

A tabs card can only reserve its tab bar, because the content is made of other modules. To stop it changing height, set `grid_options.rows` on the card (see [Card options](../../card/card-options.md)) or a `design.height` on the tabs module. The space is then fixed and the content fills it.

The heights are for the default theme. A gauge in a narrow column scales down, so it can end up shorter than the space kept for it.

The shared keys (`type`, `id`, `entity`, `design`, `actions`, `display`) are described in [Modules](../README.md#shared-keys).
