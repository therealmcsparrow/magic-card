# Hover

A hover design holds design values that apply while the pointer is over a module, row or column. The card has its own hover design for its content.

A module, row or column stores it under `design.hover`. The card stores it under `hover` at the top level. The keys are the same as in the design, custom CSS included.

```yaml
type: button
entity: light.desk
design:
  background_color: "#1e1e1e"
  transition: background-color 0.2s ease, transform 0.2s ease
  hover:
    background_color: "#2c2c2c"
    transform: translateY(-2px)
    css: "letter-spacing: 0.02em"
```

## In the editor

### Modules, rows and columns

In the [Design tab](README.md), pick Hover under "Editing design for". The help line reads "Applied while the pointer is over this module, on top of Default and matching rules." (or row, or column). The groups, sections and Custom CSS below then edit `design.hover`, and every reset button works on the hover design.

The Hover view leaves out the options the card draws itself, which a CSS hover rule can't change: Animations, Ring, Shape, Value background and the border length fields (Border length, Alignment, Sides). Sync indicators are hidden in this view.

The hover design is removed once its last value is cleared.

### The card

The card's Design tab has a Hover section near the end, with the help line "Applied while the pointer is over the card, on top of the fields above." It holds the same search, groups and sections as an element's Hover view, without copy and paste or rules. The section's reset button removes `hover`.

## How hover applies

- Hover values apply on top of the Default design and every matching [conditional rule](conditional-design.md). They are written with `!important`, so they also win over a running [preset animation](animations.md) of the same property.
- A declaration marked `!important` in the Default design's custom CSS still wins over hover.
- `hover.css` takes declarations only. Braces and `@` are removed from it, so it can't add other rules.
- The card's hover applies to the card's content, also on an open pop-up.
- An element without a hover design gets nothing extra.

Add a `transition` to the Default design for a smooth change. With reduced motion turned on, an element with a hover design changes at once, without transitions.

## Shapes and border length

- On a [shaped](shapes.md) element, hover keeps the shape. A hover `border_color` recolours the shape's outline and a hover `box_shadow` replaces its drop shadow. Both need the Default design to have a border or a shadow to start from.
- On a shaped card, a hover `border_color` recolours the card's outline.
- With a [border length](borders.md#border-length), a hover `border_color` recolours the short lines.

## Templates and copy

- On a template-linked card, the whole hover design is one field: editing it marks `hover` as overridden.
- Copy design copies the hover design with the rest. See [Copy and paste](README.md#copy-and-paste).
- A Google font in the hover design is loaded like any other. See [Font family](README.md#font-family).
