# Flexbox

The Flexbox section of the [Design tab](README.md), in the Layout group. Every key is the CSS property of the same name.

The container keys (direction, wrap, justify, align, gaps) only do something on an element that is a flex container: set `display: flex` in [Positioning and layout](positioning.md), or use them on an element that already is one. The item keys (flex, grow, shrink, basis, align self, order) apply to the element inside its parent's flex layout.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Direction | `flex_direction` | Select | `row`, `row-reverse`, `column`, `column-reverse` |
| Wrap | `flex_wrap` | Select | `nowrap`, `wrap`, `wrap-reverse` |
| Justify content | `justify_content` | Select | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| Align items | `align_items` | Select | `stretch`, `flex-start`, `flex-end`, `center`, `baseline` |
| Align content | `align_content` | Select | `stretch`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around` |
| Gap | `gap` | Unit | Length; two values (row, column) in Custom |
| Row gap | `row_gap` | Unit | Length |
| Column gap | `column_gap` | Unit | Length |
| Flex | `flex` | Text | CSS shorthand, for example `1` or `1 1 0` |
| Flex grow | `flex_grow` | Number | `0` or more |
| Flex shrink | `flex_shrink` | Number | `0` or more |
| Flex basis | `flex_basis` | Unit | Length, `%`, Custom (`auto`, `content`) |
| Align self | `align_self` | Select | `auto`, `stretch`, `flex-start`, `flex-end`, `center`, `baseline` |
| Order | `order` | Number | Whole number |

Nothing is set by default. The Flex basis placeholder reads `auto`.

```yaml
# a module that lays its own content out in a row
design:
  display: flex
  flex_direction: row
  align_items: center
  justify_content: space-between
  gap: 8px
```

A column is a flex container already: it stacks its modules with `flex-direction: column`. Its Gap and vertical alignment are in its General tab, and its design can override them, for example `flex_direction: row` to put its modules side by side. A row is a grid, see [CSS grid](grid.md). Gap works for grids too.
