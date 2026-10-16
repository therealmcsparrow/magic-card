# Row: General tab

A row places its columns side by side in a grid. Select a row and open General. Back to the [inspector overview](README.md).

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Column layout | `layout` | `1`, `1-1`, `2-1`, `1-2`, `1-1-1`, or a custom value from YAML | Equal columns | The number of columns and their relative widths. |
| Column widths | `column_widths` | One width per column: a number with `fr`, `%` or `px`, or `auto` (Custom) | The layout's widths | The exact width of each column. Shown when the row has more than one column. |
| Gap between columns | `gap` | CSS length | `8px` | Space between the columns. |
| Vertical alignment | `vertical_align` on every column | Top (`start`), Center (`center`), Bottom (`end`), Stretch (`stretch`) | Top | Aligns the modules in each column of the row. |
| Padding | `padding` | One to four CSS lengths | none | Space inside the row around its columns. |

## Column layout

Each button draws a layout as bars, one per column at its share of the row, so `2-1` shows a wide bar and a narrow one. Each button has a name, shown as a tooltip and read by screen readers, for example "2 columns, 2 to 1". Picking a layout with more columns adds empty columns. Picking one with fewer columns removes columns from the right and moves their modules into the last remaining column. A layout set in YAML that is not one of the five buttons (for example `1-2-1` or `3-1-1`) shows as an extra button, so it is never replaced by accident.

While the row has its own column widths, an extra button is selected that draws the real widths ("custom widths"). Picking a layout button then replaces the column widths with that layout.

## Column widths

The field lists every column with a number and a unit:

-   `fr` shares the free space, so `2fr` and `1fr` give two-thirds and one-third.
-   `%` is a share of the row's width. Percentages plus the gap can overflow the row.
-   `px` is a fixed width.
-   Custom takes `auto`: the column is as wide as its content.

Changing one column writes the widths of all columns to `column_widths`, which then wins over `layout`. Text that is not a valid width is not saved, and the field shows the stored width again. An empty value means `1fr`.

-   Equal widths removes the column widths and sets an equal layout, for example `1-1-1`.
-   The reset button removes the column widths, so the layout applies again.

Adding a column to a row with column widths gives the new column `1fr`. Removing one removes its width, and when only one column is left the widths are removed.

In the studio you can also drag the gutters between the columns of the selected row. See [the studio](../studio/README.md).

## Vertical alignment

There is no row-level alignment key. This field writes `vertical_align` to every column of the row at once. It shows the alignment of the first column. To align one column differently, use that [column's General tab](column-general.md).

The row's other tabs:

-   Actions: see [Actions tab](actions-tab.md#rows).
-   Conditions: see [Conditions tab](conditions-tab.md).
-   Design: see [Design](../design/README.md).

The YAML reference is in [Rows and columns](../card/rows-and-columns.md).
