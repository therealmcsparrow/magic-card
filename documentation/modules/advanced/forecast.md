# Forecast

A list of forecast entries from a weather entity: daily, hourly or twice daily.

| | |
| --- | --- |
| `type` | `forecast` |
| Category | Advanced |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | `weather` entities that provide a forecast (the entity picker only lists weather entities) |
| New module | `forecast_type: daily`, `num_forecasts: 5`, `show_temperature: true`, `show_precipitation: true`, `show_wind: false`, `animated_icons: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Weather entity | `entity` | `weather.*` | none | The weather entity. |
| Forecast type | `forecast_type` | `daily`, `hourly`, `twice_daily` | `daily` | Which forecast. Types the entity does not provide are marked "(not provided by this entity)". |
| Number of forecasts | `num_forecasts` | 1 to 48 | `5` | Number of entries. |
| Animated icons | `animated_icons` | boolean | `true` | Animated weather icons instead of the static ones. |
| Icon effects | `icon_fx`, `svg` | | none | Only with Animated icons off. See [Icon effects](../../icon-effects/README.md). |
| Show temperature | `show_temperature` | boolean | `true` | The high temperature, and the low one when the forecast has it. |
| Show precipitation | `show_precipitation` | boolean | `true` | The precipitation amount, or the chance of precipitation in % when there is no amount. |
| Show wind | `show_wind` | boolean | `false` | Wind speed and direction. |

Animated icons are on unless `animated_icons` is `false`. That includes older cards that do not have the key.

## Behaviour

-   Each entry is labelled with the weekday (daily), the hour (hourly), or the weekday and Day or Night (twice daily), in your language and time format.
-   Night entries of a twice-daily forecast use night icons.
-   When the entity does not provide the chosen type, its first available type is shown, and the editor says so.
-   Units come from the entity, else from your Home Assistant unit system.
-   Until the forecast arrives, or without an entity, the module shows placeholders ("Day 1", "--°").
-   Other messages: the entity's state when it is unavailable, "This entity has no forecast", "No forecast data", or "Forecast not available: ..." with the error.

## Example

```yaml
- type: forecast
  entity: weather.home
  forecast_type: hourly
  num_forecasts: 8
  show_temperature: true
  show_precipitation: true
  show_wind: true
```
