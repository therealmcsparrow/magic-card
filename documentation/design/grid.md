# CSS grid

The CSS grid section of the [Design tab](README.md), in the Layout group. Every key is the CSS property of the same name, entered as plain CSS text. The template keys apply to an element with `display: grid` (see [Positioning and layout](positioning.md)); the placement keys (Column, Row, Area) apply to an element inside a grid.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Template columns | `grid_template_columns` | Text | For example `1fr 2fr` or `repeat(3, 1fr)` |
| Template rows | `grid_template_rows` | Text | For example `auto 1fr` |
| Template areas | `grid_template_areas` | Text | For example `"icon name" "icon state"` |
| Auto columns | `grid_auto_columns` | Text | Track size, for example `minmax(80px, 1fr)` |
| Auto rows | `grid_auto_rows` | Text | Track size |
| Auto flow | `grid_auto_flow` | Select | `row`, `column`, `dense`, `row dense`, `column dense` |
| Column | `grid_column` | Text | Placement, for example `1 / 3` or `span 2` |
| Row | `grid_row` | Text | Placement |
| Area | `grid_area` | Text | Area name or placement |

Nothing is set by default. Gap, row gap and column gap are in [Flexbox](flexbox.md) and work for grids too.

## Rows are grids

A row lays out its columns as a grid. Its `column_widths`, or without them its `layout` (for example `1-2-1`), becomes `grid-template-columns`, and its `gap` the grid gap. Setting `grid_template_columns` in the row's design overrides the layout, because the design is written after it:

```yaml
rows:
  - layout: 1-1
    design:
      grid_template_columns: 2fr 1fr
    columns:
      - modules: []
      - modules: []
```

A column inside a row can span with `grid_column: span 2` in its design.
