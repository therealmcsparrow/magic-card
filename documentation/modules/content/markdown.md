# Markdown

Renders Markdown, with Home Assistant templates.

| | |
| --- | --- |
| `type` | `markdown` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Formatted text. Any entity as a template variable. |
| New module | `content: "**Hello** _World_"` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Content | `content` | string (Markdown) | empty | The Markdown source. |
| Entity (for templates) | `entity` | entity id | none | Passed to templates as the variable `entity`. |
| Attribute | `attribute` | attribute name | none | Passed to templates as the variable `attribute_name`. |

## Markdown

-   GitHub-flavoured Markdown: tables, strikethrough, task lists, autolinks.
-   A single line break becomes a line break.
-   HTML in the content is sanitised against an allow list. Common text, list, table, image and link tags stay, as do `ha-icon` and `ha-alert`. Scripts, styles, iframes, forms, SVG, audio and video are removed with their content. Other unknown tags are removed but their text stays.

### Styles in HTML

A `style` attribute keeps only the declarations that are on an allow list. The others are dropped one by one, and the rest of the attribute stays.

-   Properties: colour, background, opacity, display, text and font settings, line height, spacing, margin, padding, width and height (also min and max), borders and border radius, gap, vertical-align, white-space, word-break and list-style-type.
-   Values: keywords, numbers, percentages, colours (`#rgb`, `rgb()`, `hsl()`, `oklch()` and the other colour functions), `var()`, `calc()`, `min()`, `max()`, `clamp()` and gradients. Lengths use absolute or font-relative units. Units that follow the screen (`vw`, `vh` and the like) and container units are not allowed.
-   Strings (`"..."`) are allowed in `font`, `font-family` and `list-style-type` only.
-   `url()`, `image()`, `image-set()` and the other functions that load or show other content are dropped, and so is any function not named above.
-   A backslash escape or a comment drops its declaration, so a value such as `col/**/or` does nothing.
-   `display` takes `none`, `inline`, `block` or `inline-block`. `opacity` must be 0.3 or higher. Negative margins are dropped.
-   A style longer than 4,096 characters is dropped as a whole.

## Templates

The content is a Home Assistant template. Home Assistant renders it and the module updates when the result changes.

-   With an entity set, `entity` holds its id, so `{{ states(entity) }}` shows its state.
-   With an attribute set as well, `attribute_name` holds the attribute name: `{{ state_attr(entity, attribute_name) }}`.
-   While the first result loads the module is empty. A template error shows "Template error: ..." in place of the module.

The short placeholders `{{ state }}`, `{{ attribute }}` and `{{ entity }}` still work:

-   Content that uses only these placeholders is filled in by the card itself, without Home Assistant. The values are inserted as text (HTML is escaped).
-   In content with other template code, `{{ state }}` becomes `{{ states(entity) }}` and `{{ attribute }}` becomes `{{ state_attr(entity, attribute_name) }}` (empty without an attribute).

While editing, an empty content shows the hint "Markdown content is required".

## Examples

```yaml
- type: markdown
  content: |
    ## Energy
    Today: **{{ states('sensor.energy_today') }} kWh**
    {% if is_state('binary_sensor.solar_producing', 'on') %}Solar is producing.{% endif %}
```

```yaml
- type: markdown
  entity: sensor.outdoor_temperature
  content: "Outside: {{ state }}"
```
