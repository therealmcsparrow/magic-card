# Spacing and box model

The Spacing & box model section of the [Design tab](README.md), in the Layout group. The editor lists Padding, Margin, Width and Min height first, then the rest.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Margin | `margin`, `margin_top`, `margin_right`, `margin_bottom`, `margin_left` | Box | Any CSS length per side, or Custom (`auto`, `calc()`) |
| Padding | `padding`, `padding_top`, `padding_right`, `padding_bottom`, `padding_left` | Box | Any CSS length per side |
| Width | `width` | Unit | Length, `%`, or Custom (`auto`, `fit-content`, `calc()`) |
| Height | `height` | Unit | Same as width |
| Min width | `min_width` | Unit | Same as width |
| Min height | `min_height` | Unit | Same as width |
| Max width | `max_width` | Unit | Same as width |
| Max height | `max_height` | Unit | Same as width |
| Box sizing | `box_sizing` | Select | `content-box`, `border-box` |

Nothing is set by default. Width and height fields show `auto` as their placeholder.

Margin and padding are box fields: four sides, each with its own unit, and a Same on all sides link. See [Box fields](README.md#box-fields) for how the sides are stored.

```yaml
design:
  padding: 12px 16px          # shorthand, CSS order
  margin_bottom: 8px          # one side
  min_height: 72px
  max_width: 320px
  box_sizing: border-box
```

## Notes

- Rows and columns also have Gap and Padding in their General tab (`gap`, `padding` on the row or column). The design padding is written after it, so a design value wins.
- A percentage width or height is relative to the containing column or layout module.
- On a [shaped](shapes.md) element, or one with [seasonal border decorations](seasonal.md#border-decorations), each padding side is at least the space the shape or the decorations need. A larger padding of your own still applies.
