# Column: General tab

A column stacks its modules from top to bottom. Select a column and open General. Back to the [inspector overview](README.md).

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Width | `column_widths` on the row | A number with `fr`, `%` or `px`, or `auto` (Custom) | The row's layout | This column's entry in the row's column widths. Shown when the row has more than one column. |
| Vertical alignment | `vertical_align` | Top (`start`), Center (`center`), Bottom (`end`), Stretch (`stretch`) | Top | Where the modules sit in the column when the column is taller than its content, for example next to a taller column in the same row. |
| Gap | `gap` | CSS length | `8px` | Space between the modules in the column. |
| Padding | `padding` | One to four CSS lengths | none | Space inside the column around its modules. |

Width edits the same list as the row's Column widths field: changing it writes the widths of all columns of the row. The reset button sets this column back to `1fr`. See [Row: General tab](row-general.md#column-widths).

Columns have no Actions tab. The other tabs:

-   Conditions: see [Conditions tab](conditions-tab.md).
-   Design: see [Design](../design/README.md).

The YAML reference is in [Rows and columns](../card/rows-and-columns.md).
