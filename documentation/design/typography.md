# Typography

The Typography section of the [Design tab](README.md), in the Style group. The editor lists Color, Font family, Font weight, Font size and Text transform first, then the rest.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Color | `color` | Colour | Any CSS colour, `entity`, `entity N%` |
| Font family | `font_family` | Font | A CSS font stack, for example `Roboto, sans-serif` |
| Font weight | `font_weight` | Select | `normal`, `bold`, `100` to `900` in steps of 100 |
| Font size | `font_size` | Unit | Length, `%`, Custom (`inherit`, `clamp()`) |
| Text transform | `text_transform` | Select | `none`, `uppercase`, `lowercase`, `capitalize` |
| Font style | `font_style` | Select | `normal`, `italic`, `oblique` |
| Font variant | `font_variant` | Text | CSS `font-variant`, for example `small-caps` or `tabular-nums` |
| Text align | `text_align` | Select | `left`, `center`, `right`, `justify` |
| Text decoration | `text_decoration` | Select | `none`, `underline`, `overline`, `line-through` |
| Text indent | `text_indent` | Unit | Length |
| Text overflow | `text_overflow` | Select | `clip`, `ellipsis` |
| Text shadow | `text_shadow` | Text | CSS text shadow, for example `0 1px 2px rgba(0, 0, 0, .3)` |
| Line height | `line_height` | Text | A number (`1.4`) or a length (`20px`) |
| Letter spacing | `letter_spacing` | Unit | Length, may be negative |
| Word spacing | `word_spacing` | Unit | Length |
| White space | `white_space` | Select | `normal`, `nowrap`, `pre`, `pre-wrap`, `pre-line`, `break-spaces` |
| Word break | `word_break` | Select | `normal`, `break-all`, `keep-all`, `break-word` |
| Overflow wrap | `overflow_wrap` | Select | `normal`, `break-word`, `anywhere` |

Nothing is set by default. Text inherits from the theme until you set a value. The Font size placeholder reads `inherit`.

```yaml
design:
  color: var(--primary-text-color)
  font_family: '"Open Sans", sans-serif'
  font_size: 1.2rem
  font_weight: "600"
  text_transform: uppercase
  letter_spacing: 0.5px
```

## Text colour

`color` sets the text colour of the element and everything inside it. It also reaches module parts that set their own colour (a button label, an info value) and the module's icon. An icon colour set on the module itself (such as `icon_color`) still wins for the icon.

`color` is also the fallback colour of [animations](animations.md) on the element.

On a module with an entity, `color: entity` uses the entity's state colour. See [Entity colours](entity-colours.md).

## Fonts

The font picker offers common local fonts and a list of Google Fonts. The card loads a listed Google font that a design or custom CSS uses, in the weights 300, 400, 500 and 700 where the family has them. The device needs internet access for it, and the request goes to Google. Roboto is never loaded, because Home Assistant ships it. See [Font family](README.md#font-family).

## Text overflow

`text_overflow: ellipsis` needs the text to stay on one line and be clipped, as in plain CSS:

```yaml
design:
  white_space: nowrap
  overflow: hidden
  text_overflow: ellipsis
```
