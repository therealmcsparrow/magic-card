# Weather and clock header

A large clock with the date beside the current weather, and a five-day forecast below.

```yaml
type: custom:magic-card
name: Header
rows:
  - layout: "3-2"
    columns:
      - vertical_align: center
        modules:
          - type: clock
            date_format: long
            design:
              font_size: 2.4rem
              font_weight: 300
              line_height: 1.1
      - vertical_align: center
        modules:
          - type: weather
            entity: weather.home
            actions:
              tap_action:
                action: more-info
  - columns:
      - modules:
          - type: separator
            separator_style: solid
            separator_color: var(--divider-color)
          - type: forecast
            entity: weather.home
            forecast_type: daily
            num_forecasts: 5
            show_precipitation: false
```

Notes:

-   The clock follows the user's 12 or 24-hour setting. Set `format_12h: true` or `false` to force one.
-   `date_format` takes `short` (default), `medium`, `long`, `numeric`, `iso`, or a pattern such as `ddd D MMM`.
-   The clock shows the date, the weather module its temperature, condition and animated icon, and the forecast its temperatures and animated icons, without those keys written out. A toggle that a new module starts with switched on is also on when the key is missing. `show_precipitation: false` hides the forecast's precipitation. Seconds are off unless `show_seconds: true`.
-   `font_weight` and `line_height` are plain numbers. A design number is written as it is, except for lengths and times, which get `px` and `s`.

See also: [Modules](../../modules/README.md).
