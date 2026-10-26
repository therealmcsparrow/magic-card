# Positioning and layout

The Positioning & layout section of the [Design tab](README.md), in the Layout group. Every key is the CSS property of the same name.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Position | `position` | Select | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| Offsets | `top`, `right`, `bottom`, `left` | Box (four sides) | One value per side. Same on all sides sets all four to one value. |
| Inset | `inset` | Unit | One value, or one to four in Custom |
| Display | `display` | Select | `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`, `inline-grid`, `none`, `contents` |
| Visibility | `visibility` | Select | `visible`, `hidden`, `collapse` |
| Opacity | `opacity` | Text | `0` to `1`, or a percentage such as `60%` |
| Z-index | `z_index` | Number | Whole number |
| Overflow | `overflow` | Select | `visible`, `hidden`, `scroll`, `auto` |
| Overflow X | `overflow_x` | Select | Same values |
| Overflow Y | `overflow_y` | Select | Same values |
| Float | `float` | Select | `none`, `left`, `right` |
| Clear | `clear` | Select | `none`, `left`, `right`, `both` |
| Cursor | `cursor` | Select | `auto`, `default`, `pointer`, `move`, `text`, `wait`, `crosshair`, `not-allowed`, `grab`, `none` |
| Pointer events | `pointer_events` | Select | `auto`, `none` |

Nothing is set by default.

The four offsets are one box, Offsets, with a field for each side. Each side is saved under its own key (`top`, `right`, `bottom` or `left`), and the editor does not write the `inset` shorthand for them. To give all four sides the same value, use the Same on all sides link under the box. The Inset field below is separate and still works as before.

```yaml
design:
  position: relative
  top: -4px
  opacity: "0.8"
  overflow: hidden
```

## Notes

- `display: none` hides the element on the dashboard and in the editor preview. To hide an element based on state, use display conditions in the Conditions tab instead (see [Inspector](../inspector/README.md)).
- `pointer_events: none` makes taps go through the element, so its actions no longer fire.
- Opacity, filters and transforms on a row or column change how [flow lines](../flows/README.md) are layered over it.
