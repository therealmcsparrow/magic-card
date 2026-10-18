# Custom SVG

A module can draw your own SVG as its icon. Every icon effect works on its shapes. Part of [Icon effects](README.md).

## In the editor

Custom SVG is a switch above the Icon effects group ("Draw your own SVG icon instead of one from the icon list."). It is offered on Icon, Button and Info modules. On Icon and Button it is hidden while Use entity icon is on.

With the switch on:

- SVG markup is a text area. Paste the markup, or use Upload SVG to read an `.svg` file.
- The first valid SVG sets the module's `icon` to `svg` and stores the markup in `svg`. Until then the module keeps its old icon.
- The icon field is hidden while the module draws its SVG.
- Turning the switch off removes `svg` and puts back the icon the module had before.
- The help line reads: "Up to 32 KB. Parts with fill="currentColor" take the icon color, parts with class="mc-accent" the accent color."

```yaml
type: icon
icon: svg
svg: >-
  <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2 2 22h20L12 2Z"/>
    <circle class="mc-accent" cx="12" cy="16" r="2"/>
  </svg>
icon_fx:
  colors:
    secondary: "#ff9800"
```

## Colours

- Parts with `fill="currentColor"`, and parts without a fill, take the icon colour.
- Parts with `class="mc-accent"` (or inside an element with it) take `icon_fx.colors.secondary`, shown as Accent color in [Colours](colours.md) for a custom SVG or a saved icon from the library (`icon: mcu:<id>`).
- Parts with their own `fill` colour keep it while the colour style is Solid.
- Duotone, Gradient and Value paint every shape, filled and stroked. A stroked icon keeps its outline.

## What is removed

The card cleans the markup each time it draws it; `svg` keeps what you pasted. Only drawing elements and attributes are kept:

- Elements: `svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`, `defs`, `linearGradient`, `radialGradient`, `stop`, `clipPath`, `mask`, `title`.
- Attributes: geometry, `fill`, `stroke` and their width, cap, join and opacity attributes, `opacity`, `transform`, `viewBox`, `id`, `class`, gradient stop attributes, `clip-path`, `mask`, `fill-rule`, `clip-rule`.
- `url(#id)` references inside the SVG are kept; external ones are not.

The editor refuses an SVG that contains a script, event handlers, a `javascript:` link, `foreignObject` or external references, and says what it found, for example "This SVG contains a script. Remove it and try again." It also refuses `<use>` and `<image>`, because their shapes would go missing: "<use> and <image> aren't supported. Draw the shapes as paths and try again." An upload larger than 32 KB is refused with "The SVG is larger than 32 KB."

Styles (`<style>` blocks and `style="..."` attributes) are removed. The editor accepts such an SVG with a warning: "Styles are removed; use fill attributes (for example fill="#f44336") for colors." Classes styled in a `<style>` block, as Illustrator exports them, lose their colours. Set `fill` attributes instead.

Very deep nesting (more than 64 levels) is rejected.

## Effects on a custom SVG

- [Liquid fill](liquid-fill.md), [line draw](line-draw.md), [device animations](device-animations.md) and [colours](colours.md) work on filled and stroked shapes.
- Stroked shapes (Lucide, Feather or Tabler style icons) are painted along their stroke, and the liquid fill follows the stroke.
- [Morph](morphing-icons.md) tweens filled shapes. Stroked shapes cross-fade.

`icon: svg` without markup draws the module's default icon (or the entity's icon when it has an entity), never a blank.
