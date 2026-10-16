# Advanced modules

Modules with their own data source or a special role: a clock, weather and forecast, a background video, and any other Lovelace card.

| Module | `type` | Suits |
| --- | --- | --- |
| [Clock](clock.md) | `clock` | No entity needed |
| [Weather](weather.md) | `weather` | `weather` entities |
| [Forecast](forecast.md) | `forecast` | `weather` entities that provide a forecast |
| [Video background](video-bg.md) | `video-bg` | A video file or stream URL, no entity |
| [Custom card](custom-card.md) | `custom-card` | Any built-in or custom Lovelace card |

Clock, video background and custom card have no Actions tab in the editor. Actions written in YAML still work on them.

The shared keys (`type`, `id`, `entity`, `design`, `actions`, `display`) are described in [Modules](../README.md#shared-keys).
