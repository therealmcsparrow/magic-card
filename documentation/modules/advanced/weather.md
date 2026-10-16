# Weather

The current weather of a weather entity: a condition icon, the temperature and the condition, with an optional short daily forecast below.

| | |
| --- | --- |
| `type` | `weather` |
| Category | Advanced |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | `weather` entities (the entity picker only lists these) |
| New module | `show_temperature: true`, `show_condition: true`, `show_forecast: false`, `forecast_days: 5`, `animated_icons: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Weather entity | `entity` | `weather.*` | none | The weather entity. |
| Show temperature | `show_temperature` | boolean | `true` | The current temperature in the entity's unit. |
| Show condition | `show_condition` | boolean | `true` | The condition, translated as Home Assistant shows it. |
| Animated icons | `animated_icons` | boolean | `true` | Animated weather icons instead of the static ones. |
| Icon effects | `icon_fx`, `svg` | | none | Only with Animated icons off. See [Icon effects](../../icon-effects/README.md). |
| Show forecast | `show_forecast` | boolean | `false` | A daily forecast under the current weather. |
| Forecast days | `forecast_days` | 1 to 14 | `5` | Number of forecast days. Only in the editor while Show forecast is on. |

Animated icons are on unless `animated_icons` is `false`. That includes older cards that do not have the key.

## Behaviour

-   After sunset (`sun.sun` below the horizon) the icon is the night version.
-   The forecast shows temperatures only. When the entity has no daily forecast, its first forecast type is shown, and the editor says so. For hourly forecasts, precipitation or wind, use the [Forecast](forecast.md) module.
-   An unavailable entity shows a warning icon.

## Example

```yaml
- type: weather
  entity: weather.home
  show_temperature: true
  show_condition: true
  show_forecast: true
  forecast_days: 4
  animated_icons: true
```
