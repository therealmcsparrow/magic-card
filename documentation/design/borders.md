# Borders and outlines

The Borders & outlines section of the [Design tab](README.md), in the Style group. The editor lists Border radius, Border width, Border style, Border color, the border length options and Box shadow first, then the rest.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Border radius | `border_radius`, `border_top_left_radius`, `border_top_right_radius`, `border_bottom_right_radius`, `border_bottom_left_radius` | Box | Length or `%` per corner |
| Border width | `border_width` | Four sides | One to four lengths, in the CSS shorthand order |
| Border style | `border_style` | Four sides | One to four of `none`, `solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset` |
| Border color | `border_color` | Four sides | One to four CSS colours; `entity` and `entity N%` in YAML |
| Border length | `border_length` | Unit (`%`, `px`) | See [Border length](#border-length) |
| Alignment | `border_length_align` | Segmented | `start`, `center` (default), `end` |
| Sides | `border_length_sides` | Select | All (not set), `top`, `right`, `bottom`, `left` |
| Box shadow | `box_shadow` | Text | CSS box shadow, for example `0 2px 8px rgba(0, 0, 0, .12)` |
| Border | `border` | Text | CSS shorthand, for example `1px solid #444` |
| Border top, right, bottom, left | `border_top`, `border_right`, `border_bottom`, `border_left` | Text | CSS shorthand per side |
| Outline | `outline` | Text | CSS shorthand |
| Outline width | `outline_width` | Unit | Length |
| Outline style | `outline_style` | Select | Same values as border style |
| Outline color | `outline_color` | Colour | Any CSS colour, `entity`, `entity N%` |
| Outline offset | `outline_offset` | Unit | Length, may be negative |

## Border style default

Border style starts on "Not set". A border with a width but no style is drawn solid. In plain CSS such a border would be invisible, so the card adds `border-style: solid` for the sides that have a width and no style. Pick `none` to hide it.

```yaml
design:
  border_width: 2px
  border_color: "#03a9f4"     # drawn solid without a style
  border_radius: 12px
```

## The card's own border

The card's Design tab has its own Border width, Border style and Border colour, plus Opacity, Backdrop filter and Margin. They use the same key names (`border_width`, `border_style`, `border_color`, `opacity`, `backdrop_filter`, `margin`) as the design keys on this page, but they are card keys, set at the top level of the card. Rows, columns and modules keep their design keys. Card keys you leave unset keep the Home Assistant theme's card border. See [Card options](../card/card-options.md#border-and-frame).

## Border radius and module surfaces

The border radius is also passed to modules that draw their own rounded surface (button, dropdown, slider, bar track, image), so the visible surface follows it. A [ring](ring.md) follows the rendered radius too.

## Borders on a shaped element

A [shape](shapes.md) replaces the border radius. On a shaped element the border, the border length lines and the box shadow follow the shape:

- The border is drawn as a stroke along the shape, in the width, style and colour of the first side that has a border. `dashed` and `dotted` are kept; every other style draws solid.
- A border on only some sides, or a border length, draws the parts of the outline nearest those sides.
- `box_shadow` becomes a drop shadow along the shape. Only the first shadow is used, without its spread, and an `inset` shadow is dropped.

## Border length

`border_length` shortens each drawn border side to a line of that length, for accent lines. Use `%` of the side or `px`. A bare number in YAML is a percentage: `border_length: 40` is `40%`. Unset or `100%` draws the normal border.

- `border_length_align` places the line along the side: `start`, `center` (default) or `end`. The start of the top and bottom sides is the left, of the left and right sides the top.
- `border_length_sides` draws the line on one side only. Not set means all sides.
- Alignment and Sides only show in the editor once Border length has a value.
- The line follows rounded corners, even a 50% radius.
- When no border is set at all, the line is drawn as a 2px solid line in the border colour (or the text colour). The Border width placeholder shows `2` in that case. With `border_length_sides` set and no border on that side, that side gets the same 2px line.
- When some sides have a border and Sides is All, only those sides are drawn.
- The element keeps its border width, so the layout doesn't shift.

```yaml
# a short accent line centred under a module
design:
  border_length: 40%
  border_length_sides: bottom
  border_width: 3px
  border_color: "#ff9800"
```

```yaml
# short lines starting at the top-left of each side
design:
  border: 2px solid var(--primary-color)
  border_length: 24px
  border_length_align: start
```

## Entity colours

Border color and Outline color accept `entity` and `entity N%`. See [Entity colours](entity-colours.md).
