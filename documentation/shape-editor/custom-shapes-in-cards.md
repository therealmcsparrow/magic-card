# Custom shapes in cards

A custom shape is an outline that you set in YAML, or that you saved in the [shape editor](README.md). It works on the card, rows, columns and modules, in the same places as the [built-in shapes](../design/shapes.md).

## Corners in YAML

Set `shape: custom` and describe the corners under `shape_options`. Set `design.shape` and `design.shape_options` on a module, row or column. On the card, use `shape` and `shape_options` at the top level.

```yaml
type: custom:magic-card
shape: custom
shape_options:
  corner: 16
  corner_type: round
  corners:
    tl: { type: bevel, size: 24 }
    br: notch
    tr: 12
rows:
  - columns:
      - modules:
          - type: text
            text: Ticket
```

| Key | Meaning |
| --- | --- |
| `corner` | The size of every corner: a number in pixels, `16px`, or a percentage of the shorter side (`25%`). |
| `corner_type` | The type of every corner. The default is `round`. |
| `corners` | Changes for single corners. Use `tl`, `tr`, `br` or `bl`. Write the type and size as an object, or give only a type or only a size. |
| `smoothing` | How round squircle corners are, from 0 to 1. |
| `ref` | The name of a saved shape. See [Saved shapes](#saved-shapes). |
| `padding` | How far the content sits from the outline. One value, or `top`, `right`, `bottom` and `left`. |

Rules:

-   A corner that names a type but has no size gets 16 pixels.
-   With neither `corner` nor `corner_type`, the corners are square.
-   A key that the card does not know is ignored, and the rest of the shape still draws.
-   When the card gets a new size, the corners keep their pixel size and only the edges stretch.

## Free paths

Give `points` instead of corners to draw a free outline. Each point has an `x` and a `y`. A point can be a number of pixels from the edge, or a percentage with an offset, such as `100%-24` (24 pixels from the right edge).

```yaml
shape: custom
shape_options:
  points:
    - { x: 0, y: 0 }
    - { x: '100%-24', y: 0, kind: corner }
    - { x: '100%', y: 24 }
    - { x: '100%', y: '100%' }
    - { x: 0, y: '100%' }
```

A free outline needs at least three points and at most the maximum that the card allows. Points are drawn in order, and the outline is closed.

## Saved shapes

Save a shape in the [shape editor](README.md), and it gets a name. A card uses it with `ref`:

```yaml
shape: custom
shape_options:
  ref: ticket-left
```

When a card uses a saved shape, the card can keep a copy of it, so it still works without Magic Card Utils. Settings in the card override the saved shape. Only the values you change in the card are different from the saved shape.

## Dashboard templates

A card linked to a template keeps the template's shape. A local change to one corner changes only that corner.

## Older browsers and older tablets

Some browsers, such as older WebViews on tablets, cannot clip a card to a curved path. In those browsers, the card uses a polygon with straight edges that look like the curve. The text and the border still work.

The outline is drawn with straight facets in those browsers, so a curve can look slightly angular. Check the card on the device it will run on.

## First load

The code that draws a custom shape is a separate file, so it loads when a card first needs it. On the first load of a page, a card with a custom shape can appear without its shape for a moment, and then it draws the shape. After that, the shape shows from the first frame.

If the file cannot load, for example when you are offline, the card shows no shape and logs a warning. It tries again after you reload the page.

A card without a custom shape does not load this file.
