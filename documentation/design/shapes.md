# Shapes

A shape replaces the rectangle of a module, row, column or the card with another outline: a squircle, a hexagon, a ticket, a wavy edge, a blob and more. The element's background, content and tap area are clipped to the shape, and its border, shadow, ring and decorations follow it.

A module, row or column stores it under `design.shape`, with its options under `design.shape_options`. The card stores `shape` and `shape_options` at the top level. In the editor it is the Shape section of the [Design tab](README.md), in the Style group, and the Shape field in the card's Design tab.

## Contents

- [Example](#example)
- [In the editor](#in-the-editor)
- [The shapes](#the-shapes)
- [Options](#options)
- [How a shape draws](#how-a-shape-draws)
- [Content and size](#content-and-size)
- [Things to know](#things-to-know)

## Example

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
            design:
              background_color: "#1e88e533"
              border_width: 2px
              border_color: "#1e88e5"
              shape: notch
              shape_options:
                corner: 14px
```

## In the editor

The section shows a grid of tiles, one per shape, each with a small preview. None comes first. The selected tile previews the current options. Arrow keys move between the tiles, and Home and End jump to the first and last.

- Picking a tile writes `shape` and keeps the options that shape reads. Options the new shape doesn't read are removed.
- None removes `shape` and `shape_options`. On a template-linked card it writes `shape: none` instead, so the template's shape stays off. In a [conditional rule](conditional-design.md) over a shaped Default design it does the same.
- The options of the picked shape show under the tiles. Each set option has a reset button, and the field reset of the section removes the shape and its options together.
- Length options (Corner size, Cut size, Cutout size, Side cut, Wave height) are unit fields with `px` and `%`. Help line: "In px, or % of the shorter side."

Hints under the tiles say what changes:

- "The shape replaces Border radius here." (when a border radius is set)
- "Box shadow follows the shape as a drop shadow (first shadow only)." (when a box shadow is set)
- "The shape clips anything that pops out of the module, like dropdowns and tooltips." (on a module)
- "An open pop-up keeps a rectangular surface." (on a pop-up card)

Shape isn't available in the [Hover](hover.md) view.

## The shapes

| UI label | `shape` | Outline | Options |
| --- | --- | --- | --- |
| None | `none` or not set | The normal rectangle with its border radius | None |
| Squircle | `squircle` | A rectangle with smooth, continuous corners | `corner`, `smoothing` |
| Pill | `pill` | Fully rounded ends on the shorter side | None |
| Circle | `circle` | A circle, or an ellipse in a box that isn't square | None |
| Hexagon | `hexagon` | Six sides, pointed at the ends of the longer side | `corner` |
| Octagon | `octagon` | Eight sides, corners cut like a regular octagon | `corner` |
| Notch | `notch` | Small cut corners | `corner` |
| Ticket | `ticket` | A half-circle bitten out of the middle of the left and right sides | `corner` |
| Wave | `wave` | One edge, or every edge, as a wave | `edge`, `amplitude`, `waves`, `animate` |
| Blob | `blob` | An irregular round shape | `seed`, `wobble`, `animate` |

An unknown `shape` value draws the normal rectangle.

The corners of hexagons and octagons are slightly rounded so the outline doesn't look jagged. A wide hexagon points left and right; a tall one points up and down.

## Options

All options sit under `shape_options`. Lengths are a number of px (`16`), a px value (`"16px"`) or a share of the element's shorter side (`"25%"`). Values outside the allowed range are limited to it, so a shape always fits its box.

| UI label | YAML key | Shapes | Values | Default |
| --- | --- | --- | --- | --- |
| Corner size | `corner` | Squircle | Length, up to half the shorter side | Half the shorter side |
| Smoothing | `smoothing` | Squircle | 0 to 1. Help line: "1 is rounder, 0 is squarer." | `0.6` |
| Side cut | `corner` | Hexagon | Length: how far the slanted sides reach in, up to half the shorter side | The cut that makes 60° points |
| Side cut | `corner` | Octagon | Length of the cut corners, up to half the shorter side | A regular octagon's cut |
| Cut size | `corner` | Notch | Length of the cut corners, up to half the shorter side | `16` |
| Cutout size | `corner` | Ticket | Radius of the half-circles, up to half the height and a quarter of the width | `16` |
| Edge | `edge` | Wave | `top`, `right`, `bottom`, `left`, `all` | `bottom` |
| Wave height | `amplitude` | Wave | Length | `8` |
| Waves | `waves` | Wave | 1 to 50 | `3` |
| Seed | `seed` | Blob | Any number or text | `7` |
| Wobble | `wobble` | Blob | 0 to 1. Help line: "0 is round, 1 is most irregular." | `0.25` |
| Animate | `animate` | Wave, Blob | `true`, `false` | `false` |

### Wave

- The wave dips in from the edge by twice the Wave height. Each wave starts and ends on a crest, so it meets the straight sides without a step.
- With `edge: all`, every edge waves and the corners are rounded with the wave height as their radius.
- Wave height is at most a quarter of the box across the waving edge, and with `all` at most an eighth of the shorter side.
- Each wave is at least 2.5 wave heights long, so a short edge gets fewer waves than Waves asks for.
- Animate makes the waves flow along the edge, one wave every 3 seconds. Help line: "The waves flow along the edge. Paused off-screen and with reduced motion."

### Blob

- The blob is a smooth curve through 12 points around the centre. Wobble pulls the points in by up to half the radius, and Seed decides which points move how far. The same seed always draws the same blob.
- Shuffle, next to the Seed field, picks a random seed from 1 to 9999.
- Animate makes the blob morph slowly, one cycle every 12 seconds. Help line: "The blob morphs slowly. Paused off-screen and with reduced motion."

## How a shape draws

- Clip: the element is clipped to the shape, so its background, content, [particle layers](animations.md) and tap area follow it. Browsers without `clip-path: path()` get a polygon close to the shape.
- Border: the border is drawn as a stroke along the shape. It uses the width, style and colour of the first side with a border. `dashed` and `dotted` are kept; other styles draw solid. A border on some sides only, or a [border length](borders.md#border-length), draws the parts of the outline nearest those sides. The element keeps its real border width for layout, with a transparent colour.
- Shadow: `box_shadow` becomes a drop shadow along the shape, drawn by a wrapper around the element. Only the first shadow is used, without its spread. An `inset` shadow is dropped.
- Card: a shaped card draws the theme's card border along the shape. Without its own `box_shadow` it takes the theme's card shadow as a drop shadow.
- Focus: a module or row with actions that takes keyboard focus draws its focus ring along the shape.
- [Ring](ring.md): the ring follows the shape and is always drawn inside.
- [Value background](value-backgrounds.md) and [seasonal border decorations](seasonal.md#border-decorations): they follow the shape.
- [Flow lines](../flows/README.md): a line attaches where it meets the shape's outline, not the box.

## Content and size

A shape doesn't change the element's size. Width, height and min height are those of the whole shape, and the element is sized as a border box.

The content gets extra padding so text stays clear of cut corners, curves and waves. Each side's padding is at least the shape's inset there, or the element's own padding when that is more. A larger padding of its own lets the content sit lower, where most shapes are wider, so the inset across can be smaller.

- A notch or octagon keeps the content a little below the flat top and bottom, and in from the cut corners.
- A hexagon needs no extra padding along its flat sides.
- A ticket keeps the content clear of the half-circles left and right.
- A wave keeps the content twice the wave height away from each waving edge.
- A circle, pill, squircle or blob keeps the content's corners inside the curve.

## Things to know

- A shape wins over `border_radius`.
- The shape clips anything that pops out of a module, such as a dropdown list or a tooltip.
- A shaped module with a `box_shadow` sits in a wrapper that draws the shadow, so a `%` width or a grid placement applies inside that wrapper.
- An open pop-up keeps a rectangular surface with the card's border radius.
- Animate stops while the element is off-screen and with reduced motion turned on.
- On a template-linked card, `shape` and `shape_options` sync as one field.
