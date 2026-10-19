# Design

Every module, row and column has a Design tab. It controls how that element looks: spacing, borders, text, background, layout, an outline shape, a value background, preset animations, a ring along the outline and a hover state. The values are stored under `design:` on the element.

The card itself has a shorter Design tab: background colour and image, border radius, card height, padding, box shadow, animations, ring, shape, value background, seasonal scene, hover and custom CSS. Those keys sit at the top level of the card config. See [Card options](../card/README.md).

## Pages

- [Spacing and box model](spacing.md): margin, padding, width, height, min and max sizes, box sizing
- [Borders and outlines](borders.md): borders, border radius, border length lines, outline, box shadow
- [Positioning and layout](positioning.md): position, offsets, display, visibility, opacity, z-index, overflow, cursor
- [Typography](typography.md): font, text colour, alignment, decoration, spacing, wrapping
- [Backgrounds](backgrounds.md): background colour and image, backdrop filter, and the card backdrop (up to four pictures, gradients, patterns and colours behind the card)
- [Layers](layers.md): modules behind others or on top, position and offsets, blend and blur, darkening behind text, click-through and the Pause motion button
- [Flexbox](flexbox.md) and [CSS grid](grid.md)
- [Transitions and CSS animation properties](transitions.md): transition, transform, filter and the raw `animation_*` keys
- [Lists and tables](lists-tables.md)
- [Custom CSS](custom-css.md)
- [Entity colours](entity-colours.md): the `entity` colour value
- [Gradients](gradients.md): solid or gradient colours, where gradients work and their limits
- [Conditional design](conditional-design.md): rules that change the design while conditions match
- [Animations](animations.md): the preset animation list
- [Icon animations in cards](quick-icon-animator.md): animated icons from the icon picker and the studio, and what happens when the module's icon changes
- [Ring](ring.md): value ring and animated ring
- [Shapes](shapes.md): squircle, hexagon, wave, blob and other outlines instead of the rectangle
- [Value backgrounds](value-backgrounds.md): a tank fill or a history sparkline behind the content
- [Hover](hover.md): design values that apply while the pointer is over an element or the card
- [Seasonal scenes](seasonal.md): snow, blossom, fireworks and border decorations on the card, and the seasonal animation presets

## How design keys work

Keys are CSS property names with underscores instead of hyphens. `border_radius` is `border-radius`, `font_size` is `font-size`. Most keys are written as inline CSS on the element. A few are read by the card itself and have no CSS property of their own: `border_length`, `border_length_align`, `border_length_sides`, `animations`, `ring`, `shape`, `shape_options`, `value_background`, `hover`, `conditional` and `css`.

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: button
            entity: light.desk
            name: Desk
            design:
              padding: 12px 16px
              border_radius: 16px
              background_color: "#1e1e1e"
              color: entity
              font_weight: "600"
```

Some modules draw their own surface or text colour. The design still reaches them:

- `color` also reaches module text that sets its own colour (a button label, an info value) and the module's icon.
- `background_color` (or `background`) and the border radius also reach the surfaces that the button, dropdown, slider, bar track and image modules draw themselves.

An empty value means "not set". The editor removes the key instead of writing an empty string.

### Numbers in YAML

A design value can be written as a plain YAML number. The card turns it into CSS text before it applies it:

- Keys edited with a unit or box field (sizes, offsets, gaps, font size, letter spacing, the sides of margin and padding, the corners of border radius) get `px`: `padding: 8` is `8px`.
- Time keys (`transition_duration`, `transition_delay`, `animation_duration`, `animation_delay`) get `s`: `transition_duration: 0.3` is `0.3s`.
- `border_length` gets `%`: `border_length: 40` is `40%`.
- Every other key takes the number as it is: `opacity: 0.5`, `z_index: 2`, `flex_grow: 1`, `font_weight: 600`, `line_height: 1.4`.

```yaml
design:
  padding: 12
  border_radius: 16
  opacity: 0.8
  transition_duration: 0.2
```

## The Design tab

From top to bottom:

1. Copy design and Paste design (see [Copy and paste](#copy-and-paste)).
2. Editing design for: Default, Hover, or one of the conditional rules. Add conditional rule creates a new one. See [Hover](hover.md) and [Conditional design](conditional-design.md). The card's Design tab uses the same picker, and a card rule can set its ring, shape, value background and seasonal scene. See [Card Design tab](../inspector/card-design.md).
3. A search field, "Search CSS properties, e.g. padding". It matches the field label, the CSS property name and the YAML key, including the per-side keys of margin, padding and border radius (searching `padding_top` finds Padding). Searching `css` or `custom css` finds Custom CSS.
4. The sections, sorted into four headed groups in one list.

| Group | Sections | At first |
| --- | --- | --- |
| Layout | Spacing & box model, Positioning & layout, Flexbox, CSS grid | Open |
| Style | Backgrounds, Borders & outlines, Typography, Shape, Value background | Open |
| Effects | Ring, Transitions & animations | Folded |
| Advanced | Lists & tables, Custom CSS | Folded |

A group heading folds or opens its group and shows how many values the group sets, for example "3 set". A folded group that holds a value opens by itself, and it stays open after you clear that value. A group you open or fold by hand stays that way while the panel is open.

Each section inside a group is collapsible too, and a section with values shows its own chip. While you search, every group and section with a match is open and the rest are hidden.

Short fields (unit, select and number fields) sit two per row.

## Field types

### Unit fields

Sizes, offsets, gaps, font size and times use a unit field: a number input and a unit select.

- The units on offer are `px`, `em`, `rem`, `%`, `vw` and `vh`. Time fields offer `s` and `ms`. Border length offers `%` and `px`.
- The unit is added when you commit the number (leave the field or press Enter), not while you type. `12` with `px` selected is stored as `12px`.
- Changing the unit of a stored number keeps the number: `12px` becomes `12em`.
- Clearing the number removes the key.
- The last option, Custom, turns the input into a text field for any CSS value: `auto`, `calc(100% - 8px)`, `var(--my-gap)`, `min(50%, 300px)`. A stored value that isn't a number with a unit opens in Custom by itself.
- Picking a unit again after Custom converts a plain number and clears anything else.
- A stored value with a unit outside the list (for example `50vmin` or `2ch`) adds that unit to the select.

The grey placeholder shows what applies when nothing is set: `auto` for widths and heights, `inherit` for font size, `0` for the rest. Nothing is stored for a placeholder.

### Box fields

Margin, Padding and Border radius edit four values in a 2 by 2 grid: Top, Right, Bottom, Left (or Top left, Top right, Bottom right, Bottom left for the radius). Each side is a small unit field with the same units and Custom option.

- Same on all sides links the four values. Turning it on copies the top value to every side, and while it is on, editing any side writes all four. The link is an editor setting and is not saved.
- Editing a side stores the four sides as separate keys (`padding_top`, `padding_right`, `padding_bottom`, `padding_left`, or `border_top_left_radius` and so on) and removes the shorthand. Sides that came from the shorthand are kept as their own keys, so nothing is lost.
- In YAML you can still write the shorthand with one to four values in CSS order, for example `padding: 8px 16px`. The field shows it split into sides.
- A side key wins over the shorthand when both are set.

### Colour fields

A colour field has a swatch, a text input and, on a module with an entity, an entity colour button.

- The text input takes any CSS colour as typed: `#ff9800`, `rgba(0, 0, 0, 0.4)`, `hsl(200 80% 50%)`, `tomato`, `var(--primary-color)`.
- The swatch opens the Color picker dialog: a saturation and brightness area, an H (hue) slider, an A (opacity) slider with a percentage, a Hex input and R, G, B readouts. Presets has 24 colours and 8 Home Assistant theme variables (`--primary-color`, `--accent-color`, `--primary-text-color`, `--secondary-text-color`, `--card-background-color`, `--divider-color`, `--success-color`, `--error-color`). Saved colors keeps up to 12 colours in this browser: the plus button saves the current colour, the cross on a swatch removes it. Save writes the colour, Cancel leaves it unchanged.
- The picker writes hex (`#rrggbb`, or `#rrggbbaa` below 100% opacity). A theme preset is written as `var(--name)`.
- The entity colour button (a palette icon) switches the field to the entity's state colour. See [Entity colours](entity-colours.md).
- Some colour fields also offer Solid or Gradient. Gradients are CSS gradient strings, and the limits per field are on the [Gradients](gradients.md) page.

### Font family

A text input with a Browse button. Browse opens Select font with two tabs, Local fonts and Google Fonts, a search field and a preview line. Save writes a CSS font stack, for example `"Open Sans", sans-serif`.

The Google Fonts tab lists 20 popular families. Opening that tab loads them, so each one previews in its own face.

The card loads each listed Google font it uses, wherever it is set: `font_family` in any design, hover design or conditional rule, and `font-family` in any custom CSS. Each family gets one stylesheet link from `fonts.googleapis.com` per page, in the weights 300, 400, 500 and 700 where the family has them, so bold text uses a real bold face. Roboto is never loaded, because Home Assistant already ships it.

- The device that shows the card needs internet access for the font. Without it, the generic family at the end of the stack is used.
- Loading a font sends a request to Google, a third party, from every device that shows the card.
- A family that isn't on the list (typed by hand) is not loaded. It only shows when the device has it or your theme or dashboard resources load it.

### Background image

A text input with a browse button for the Home Assistant media browser. A browsed item is stored as its `media-source://` id and resolved each time the card renders (resolved URLs expire, so they can't be stored). A typed path or URL that starts with `/`, `http://`, `https://` or `data:` is wrapped in `url("...")` for you, so `/local/images/bg.jpg` works as it is. A path on your Home Assistant server is resolved against its address. Any other typed value is used as CSS, for example `url("/local/images/bg.jpg")` or a gradient such as `linear-gradient(135deg, #1e3c72, #2a5298)`.

### Selects

Selects start with "Not set", which removes the key. Border style uses "Solid when width is set" instead, and Sides (border length) uses "All".

## Reset

- A field with a value shows a reset button (circular arrow, "Reset to default") in its header. It removes the key, so the default or inherited value applies again.
- An open section with values shows Reset section, which clears every value in that section in one step.
- Custom CSS has its own reset button.
- Animations, Ring and Value background have no field reset. Each animation has Reset to preset, the ring has a reset per field plus Mode Off, and the value background has a reset per field plus Type Off. The Shape field reset removes `shape` and `shape_options` together.

In the Hover view and in a rule view, the reset buttons work on that design. Every reset is one undo step.

## Copy and paste

Copy design copies the whole design of the element, the hover design, conditional rules and animations included. It is kept in this browser's local storage, so you can paste it on another card or after a reload, and it is also put on the system clipboard as YAML.

Paste design is available once something has been copied. It has two modes:

| Mode | Result |
| --- | --- |
| Replace design | The element's design becomes the copied design. |
| Merge into design | The copied keys are written over the current ones. Copied animations and conditional rules are added after the existing ones. |

Pasted animations, rules and conditions get new ids, so pasting twice never creates duplicates. After a paste the tab switches to the Default view. A short "Design copied" or "Design pasted" message confirms the action.

## Template-linked cards

On a card linked to a template, each design field of a module shows a sync indicator. Editing a field marks it as overridden (`design.<key>` in the module's `not_synced` list), and the indicator switches it back to the template value. A shape and its options count as one field (`design.shape`), and so does the whole hover design (`design.hover`).

On a template-linked card, picking None in Shape or Off in Value background writes `shape: none` or `value_background: { type: none }` instead of removing the key, so the template's shape or value background stays off on this card.

Rows and columns have no per-field indicators: editing their design overrides the whole design. See the [editor documentation](../editor/README.md) for templates.

## Related

- [Inspector](../inspector/README.md): the tabs of the selected element
- [Studio](../studio/README.md): editing on the canvas
- [Modules](../modules/README.md): what each module draws
- [YAML reference](../yaml/README.md)
