# Lists and tables

The Lists & tables section of the [Design tab](README.md), in the Advanced group. These keys matter for content that renders lists or tables, such as a Markdown module. Every key is the CSS property of the same name and is inherited by the content inside the element where CSS inherits it.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| List style | `list_style` | Text | CSS shorthand, for example `square inside` |
| List style type | `list_style_type` | Select | `none`, `disc`, `circle`, `square`, `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman`, `upper-roman` |
| List style position | `list_style_position` | Select | `outside`, `inside` |
| List style image | `list_style_image` | Text | For example `url("/local/bullet.svg")` |
| Border collapse | `border_collapse` | Select | `separate`, `collapse` |
| Border spacing | `border_spacing` | Unit | Length; two values in Custom |
| Table layout | `table_layout` | Select | `auto`, `fixed` |
| Caption side | `caption_side` | Select | `top`, `bottom` |

Nothing is set by default.

```yaml
type: markdown
content: |
  - Lights off
  - Doors locked
design:
  list_style_type: square
  list_style_position: inside
```
