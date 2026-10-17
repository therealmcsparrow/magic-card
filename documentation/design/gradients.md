# Gradients

A colour field can hold a single colour or a gradient. Where a field offers gradients, the editor shows a Solid and Gradient switch above it. Choose Gradient, pick the type, then set the colours. The editor writes the result as CSS text, and you can edit that text in YAML.

## Forms

```yaml
design:
  background: linear-gradient(135deg, #1e3c72, #2a5298)
  color: linear-gradient(90deg, #ff9800, #e91e63, #673ab7)
ring:
  mode: animated
  color: radial-gradient(circle, #03a9f4, #1a237e)
```

- `linear-gradient(<angle>deg, colour, colour)` runs across the element at the angle. `180deg` runs from top to bottom.
- `radial-gradient(circle, colour, colour)` runs out from the centre.

The editor offers two to five colours and spaces them evenly, so it writes no stop positions. Hand-written YAML can also use `to right`, `circle at` or stop positions such as `#fff 40%`. CSS draws these on backgrounds and text.

Rings and icons read only the angle, in degrees. Everything else is drawn from top to bottom, so a radial gradient there is drawn as a linear one.

An invalid gradient is ignored, the same way an invalid colour is.

## Where gradients work

| Field | Gradient | Notes |
| --- | --- | --- |
| Card background (Background color, Default and rule view) | Yes | Stored in `background`. See [Background limits](#background-limits). |
| Module, row and column background (Background color) | Yes | Stored in `background`, and `background_color` is removed. |
| Value background fill | Yes | The hatch, floor and wave use the first colour, and so does a sparkline. |
| Ring colour | Linear only | Thresholds, the track and the glow stay solid. |
| Icon colour (`icon_color`) | Linear only | |
| Text colour (`color`) | Text, info and markdown modules | Other modules, rows, columns and the hover view use the first colour. |

## Background limits

The Background color field offers Gradient only when all of these hold:

- The card or element has no background image.
- The Background field is empty or holds a gradient.
- In a rule or hover view, Default has no solid background colour.

A gradient that is already set stays editable as Gradient, so you can switch back to Solid. Switching to Solid stores the first colour in `background_color` and removes the gradient from `background`. Other values in `background`, such as a `url(...)`, stay.

## Older browsers

Gradient text uses `background-clip: text`. Browsers and WebViews that cannot draw a gradient on text, such as some older Android WebViews, show the first colour instead. The rest of the card looks the same.

## Solid colours

Existing colours and CSS colour strings load and render as before. The editor shows them as Solid.
