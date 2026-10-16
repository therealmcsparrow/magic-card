# Positioning and layout

The Positioning & layout section of the [Design tab](README.md), in the Layout group. Every key is the CSS property of the same name.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Position | `position` | Select | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| Top | `top` | Unit | Length, `%`, Custom |
| Right | `right` | Unit | Length, `%`, Custom |
| Bottom | `bottom` | Unit | Length, `%`, Custom |
| Left | `left` | Unit | Length, `%`, Custom |
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
