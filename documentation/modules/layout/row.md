# Row

A grid of columns inside a column. It works like a card row: the same layout presets and column widths, and columns with their own alignment, gap, padding, display conditions and design. Use it to split one column of the card into more columns.

| | |
| --- | --- |
| `type` | `row` |
| Category | Layout |
| Editor tabs | General, Actions, Conditions, Design |
| Children | `columns`, each with its own `modules` |
| New module | two empty columns, `layout: "1-1"`, `gap: 8px` |

-   [Options](#options)
-   [Column keys](#column-keys)
-   [Columns in the editor](#columns-in-the-editor)
-   [Layout and widths](#layout-and-widths)
-   [Older configs](#older-configs)
-   [Examples](#examples)

## Options

These are in the Row module's General tab, the same fields as a [card row's General tab](../../inspector/row-general.md):

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Column layout | `layout` | `1`, `1-1`, `2-1`, `1-2`, `1-1-1`, or another value from YAML | equal columns | The number of columns and their relative widths. See [Layout and widths](#layout-and-widths). |
| Column widths | `column_widths` | one width per column: a number with `fr`, `%` or `px`, or `auto` | the layout's widths | The exact width of each column. Wins over `layout`. Shown when the module has more than one column, with an Equal widths button. |
| Gap between columns | `gap` | CSS length | `8px` | Space between the columns. |
| Padding | `padding` | one to four CSS lengths | none | Space inside the module around its columns. |
| (tree) | `columns` | list of columns | two columns | The columns and their children. See [Column keys](#column-keys). |

## Column keys

Each entry of `columns` takes the keys of a card column, except `not_synced`:

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `modules` | list of modules | required | The column's children, top to bottom. |
| `id` | text | generated | Identifies the column. The editor adds one to every column; an old config without ids still works. |
| `vertical_align` | `start`, `center`, `end`, `stretch` | `start` | Where the modules sit when the column is taller than its content. |
| `gap` | CSS length | `10px` (the card's `--mc-gap`) | Space between the modules in the column. |
| `padding` | one to four CSS lengths | none | Space inside the column. |
| `display` | display conditions | always shown | When the column is shown. A hidden column takes no space. See [Display conditions](../../card/display-conditions.md). |
| `design` | design settings | none | How the column looks, with the full design panel: backgrounds, borders, shapes, rings, animations and so on. See [Design](../../design/README.md). |

A row-module column renders exactly like a card column, so a design, an animation, a shape or a ring on it behaves the same as on a card column.

## Columns in the editor

The columns are items in the [structure outline](../../editor/structure-outline.md#layout-modules-in-the-tree), under the Row module, each named "Column N" with a glyph of the widths. Each column holds its children and an Add module row. An Add column row after the last column adds a column.

-   Select a column (in the tree, or by clicking it on the studio canvas) to edit its General, Conditions and Design tabs. See [Tabs and row-module columns](../../inspector/tabs-and-nested-columns.md).
-   The column's three-dot menu has Add module, Copy design, Paste design, Merge pasted design, Move up, Move down and Delete column. Delete column asks first when the column holds modules, and the only column cannot be deleted.
-   Move up and Move down (or Alt+Up and Alt+Down in the tree) swap the column with its neighbour. Its modules, design and width move with it: its `column_widths` entry, or its part of the layout preset, so `2-1` becomes `1-2`.
-   The Row module's three-dot menu has Add column.
-   In the studio, a selected Row module or one of its columns gets resize handles between its columns. See [Column resize](../../studio/column-resize.md#row-modules).

Adding a column to a module with a layout preset resets it to equal widths. A module with its own column widths keeps them and gives the new column `1fr`. Deleting a column removes its width, and the widths go when one column is left.

## Layout and widths

The Column layout field offers the same five presets as a card row. A layout from YAML that is not one of them shows as an extra button. Picking a layout with more columns adds empty columns; one with fewer columns removes columns from the right and moves their modules into the last remaining column. Picking a layout also removes `column_widths`.

In YAML, `layout` accepts:

-   A preset, or any list of ratios joined by hyphens, for example `3-1` or `2-1-1`. Each number is a share of the width.
-   A CSS `grid-template-columns` value, for example `120px 1fr`.

A ratio list with a different number of parts than there are columns is ignored: the columns are then equal.

`column_widths` works as on a [card row](../../card/rows-and-columns.md#column-widths): `fr`, `%`, `px` or `auto` per column, a bare number counts as `fr`, and a missing or invalid entry counts as `1fr`. When it has entries, it wins over `layout`.

## Older configs

Row modules from earlier versions keep working unchanged. Their columns have no ids, gap, padding or design, and the module has no `column_widths` or `padding`; the card renders them as before. The editor adds column ids the first time you edit the module's columns.

## Examples

```yaml
- type: row
  layout: "2-1"
  gap: 12px
  columns:
    - modules:
        - type: graphs
          entity: sensor.power_usage
          show_labels: true
    - modules:
        - type: gauge
          entity: sensor.power_usage
          min: 0
          max: 5000
```

With column widths and per-column settings:

```yaml
- type: row
  column_widths: [56px, 1fr, auto]
  gap: 8px
  padding: 4px 0
  columns:
    - id: col-icon
      vertical_align: center
      modules:
        - type: icon
          entity: binary_sensor.front_door
          use_entity_icon: true
    - id: col-text
      vertical_align: center
      gap: 2px
      modules:
        - type: text
          text: Front door
        - type: info
          entity: binary_sensor.front_door
          show_name: false
    - id: col-lock
      vertical_align: center
      display:
        conditions:
          - type: state
            entity: lock.front_door
            state: unlocked
      design:
        background_color: "rgba(255, 152, 0, 0.15)"
        border_radius: 12px
        padding: 4px
      modules:
        - type: button
          entity: lock.front_door
          icon: mdi:lock-open-variant
          button_style: icon-only
```
