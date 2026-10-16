# Rows and columns

Rows stack from top to bottom inside the card. Each row places its columns side by side, and each column stacks its modules. Back to [Card configuration](README.md).

## Contents

-   [Row keys](#row-keys)
-   [Layout](#layout)
-   [Column widths](#column-widths)
-   [Row actions](#row-actions)
-   [Column keys](#column-keys)
-   [Example](#example)

## Row keys

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `columns` | List of columns | required | The columns of the row. |
| `layout` | Relative widths joined by dashes, or a CSS grid value | equal columns | Column widths. See [Layout](#layout). |
| `column_widths` | List of widths, one per column | none | Exact column widths. Wins over `layout`. See [Column widths](#column-widths). |
| `gap` | CSS length | `8px` | Space between the columns. |
| `padding` | One to four CSS lengths | none | Space inside the row. |
| `display` | Display conditions | always shown | When the row is shown. See [Display conditions](display-conditions.md). |
| `design` | Design settings | none | How the row looks. See [Design](../design/README.md). |
| `actions` | Tap, hold and double tap actions | none | What happens when you tap the row. See [Row actions](#row-actions). |
| `id` | Text | derived | Optional. |
| `not_synced` | List of key paths | none | Local overrides on a template-linked card. |

## Layout

`layout` is a list of relative widths, one number per column, joined by dashes:

| `layout` | Columns |
| --- | --- |
| `1` | One full-width column |
| `1-1` | Two equal columns |
| `2-1` | Two-thirds and one-third |
| `1-2` | One-third and two-thirds |
| `1-1-1` | Three equal columns |
| `1-2-1` | A wide middle column |
| `3-1-1` | Any other combination works the same way |

A layout whose count does not match the number of columns falls back to equal columns. A value that is not numbers and dashes is used as the CSS `grid-template-columns` of the row, for example `120px 1fr`.

## Column widths

`column_widths` sets the width of each column. When the list has entries it wins over `layout`.

```yaml
- layout: "1-1-1"
  column_widths: [120px, 2fr, 1fr]
  columns:
    - modules:
        - type: icon
          icon: mdi:sofa
    - modules:
        - type: text
          text: Living room
    - modules:
        - type: info
          entity: sensor.living_room_temperature
```

| Width | What it does |
| --- | --- |
| `<n>fr` | A share of the free space, like the numbers in `layout`. |
| `<n>%` | A share of the row's width. Percentages plus `gap` can overflow the row. |
| `<n>px` | A fixed width. |
| `auto` | As wide as the content. |

-   A bare number counts as `fr`, so `2` is `2fr`. Units are not case-sensitive.
-   An entry that is missing or not valid counts as `1fr`, and so does `0fr`. Entries beyond the number of columns are ignored.
-   The editor writes this key from the row's Column widths field, a column's Width field and the resize handles in the studio. Picking a layout preset removes it. See [Row: General tab](../inspector/row-general.md#column-widths).

## Row actions

A row takes `actions` with `tap_action`, `hold_action` and `double_tap_action`, like a module. The card runs them when you tap the row outside a module with its own actions and outside a control. A row has no entity, so `toggle` and `more-info` need an `entity` in the action. See [Actions](actions.md#row-actions).

```yaml
- actions:
    tap_action:
      action: navigate
      navigation_path: /lovelace/kitchen
  columns:
    - modules:
        - type: text
          text: Kitchen
```

## Column keys

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `modules` | List of modules | required | The modules, top to bottom. See [Modules](../modules/README.md). |
| `vertical_align` | `start`, `center`, `end`, `stretch` | `start` | Where the modules sit when the column is taller than its content. |
| `gap` | CSS length | `8px` | Space between the modules. |
| `padding` | One to four CSS lengths | none | Space inside the column. |
| `display` | Display conditions | always shown | When the column is shown. |
| `design` | Design settings | none | How the column looks. See [Design](../design/README.md). |
| `id` | Text | derived | Optional. |
| `not_synced` | List of key paths | none | Local overrides on a template-linked card. |

Rows have no alignment key of their own. The row's Vertical alignment field in the editor sets `vertical_align` on each of its columns.

## Example

```yaml
rows:
  - layout: "2-1"
    gap: 12px
    padding: 4px 0
    columns:
      - vertical_align: center
        gap: 4px
        modules:
          - type: text
            text: Kitchen
          - type: info
            entity: sensor.kitchen_temperature
      - vertical_align: end
        modules:
          - type: button
            entity: light.kitchen
            icon: mdi:ceiling-light
  - display:
      conditions:
        - type: state
          entity: binary_sensor.kitchen_motion
          state: "on"
    columns:
      - modules:
          - type: text
            text: Motion in the kitchen
```

Quote `"on"`, `"off"` and single-number layouts such as `"1"` so YAML keeps them as text.
