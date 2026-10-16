# Clock

The current time, and optionally the date. It uses the language and time zone of your Home Assistant profile.

| | |
| --- | --- |
| `type` | `clock` |
| Category | Advanced |
| Editor tabs | General, Conditions, Design (no Actions tab) |
| Suits | No entity needed |
| New module | `show_seconds: false`, `show_date: true`, `date_format: short` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Time format | `format_12h` | not set, `true`, `false` | not set | Not set (Automatic) follows your profile. `true` is 12-hour, `false` 24-hour. |
| Show seconds | `show_seconds` | boolean | `false` | Adds seconds to the time. |
| Show date | `show_date` | boolean | `true` | Shows the date under the time. |
| Date format | `date_format` | `short`, `medium`, `long`, `numeric`, `iso`, or a pattern | `short` | The date format. The editor shows today's date in each format. |
| Date pattern | `date_format` | pattern | `ddd D MMM YYYY` when you pick Custom pattern | Shown when Date format is Custom pattern. |

## Date formats

| Value | Shows |
| --- | --- |
| `short` | Weekday, month and day, short names |
| `medium` | Month, day and year, short month name |
| `long` | Weekday, month, day and year, full names |
| `numeric` | Year, month and day as numbers, in your language's order |
| `iso` | `YYYY-MM-DD` |

Any other value is a pattern:

| Token | Meaning |
| --- | --- |
| `YYYY`, `YY` | Year, four or two digits |
| `MMMM`, `MMM` | Month name, full or short |
| `MM`, `M` | Month number, with or without a leading zero |
| `DD`, `D` | Day, with or without a leading zero |
| `dddd`, `ddd` | Weekday name, full or short |
| `[text]` | Kept as typed |

Names are in your language. Numbers in a pattern use the Gregorian calendar and Latin digits whatever your language.

The old value `full` means `long`. A value without any token or `[text]` (a typo, for example) is shown as `short`.

## Behaviour

The time updates on the minute, or every second with seconds shown. Only the text changes; the rest of the card does not redraw.

## Example

```yaml
- type: clock
  format_12h: false
  show_date: true
  date_format: "dddd D MMMM"
  design:
    font_size: 32px
```
