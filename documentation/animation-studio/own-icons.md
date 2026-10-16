# Own icons

The studio can turn an icon you edited (its parts and your drawn shapes) into an SVG icon for any card. It can also read an `.svg` file, either as shapes to add or as the icon to split into parts. No new storage is involved: an exported icon goes into the card's YAML as a [custom SVG](../icon-effects/custom-svg.md).

-   [Save as icon](#save-as-icon)
-   [Using the icon in a card](#using-the-icon-in-a-card)
-   [Import SVG](#import-svg)
-   [Use as icon](#use-as-icon)
-   [Size limits](#size-limits)
-   [What the sanitiser removes](#what-the-sanitiser-removes)

## Save as icon

Save as icon is on the [Draw toolbar](drawing.md#the-draw-toolbar). A switch at the top of its window picks Icon (the still icon, described here) or Animated SVG (a looping file of the whole animation, see [Animated SVG export](animated-svg-export.md)). The Icon view has:

-   A preview of the icon at rest, without animation, and a count of its parts and shapes.
-   The size against the 32 KB limit, as text and a meter.
-   The SVG text.
-   Copy SVG, which copies the SVG text.
-   Download .svg, which saves the file. The file name comes from the animation's name, for example `doorbell-ring.svg`.
-   Use in card, which copies YAML for a module (see below).

What the SVG holds, in paint order:

1.  The shapes under the icon.
2.  The pieces of the icon that no part uses.
3.  The parts, each with its id as the `id` attribute. A part that mixes filled, stroked and accent shapes becomes a group with one path per paint.
4.  The shapes over the icon, each with its id.

Stroked shapes keep their stroke width, line ends and joins. Accent shapes keep `class="mc-accent"`. Entity colours and `var()` colours are written as `currentColor`, so they take the icon colour in the card.

The ids let you split the saved icon again later with the parts in the same places.

When the browser blocks the clipboard, the window shows the text in a box, selected, with "Copy failed: select the text below and copy it".

## Using the icon in a card

Use in card copies this YAML, with your SVG in place of the example:

```yaml
icon: svg
svg: |
  <svg viewBox="0 0 24 24">
    <path id="bell" class="part" d="..."/>
  </svg>
```

Paste it into an Icon, Button or Info module in the card's YAML. You can also paste the SVG text into the module's Custom SVG field in the Design tab. See [Custom SVG](../icon-effects/custom-svg.md) for the colours and the effects that work on it.

The saved icon is a still icon. To animate its parts in a card, use the animation from the studio on the module as well.

## Import SVG

Import SVG on the Draw toolbar opens a window with a drop zone and Choose file. Dropping an `.svg` file on the stage opens the same window with the file loaded. The window shows a preview, the number of shapes found ("scaled into the icon"), and two buttons: Add as shapes and Use as icon. Choose another goes back to the drop zone.

Add as shapes adds every drawn element of the file as a [shape](drawing.md) over the icon:

-   The file is cleaned first (see below).
-   Transforms are applied to the shapes.
-   The drawing is scaled to fit the icon's viewBox, centred and keeping its proportions.
-   Fill, stroke, stroke width and line ends are taken from the element or the elements around it, including the root `<svg>`. A stroked icon such as one from Lucide imports as stroked lines without fill.
-   Gradients become `currentColor`.
-   An element's own `id` is kept when it is a valid id that is not taken yet.
-   Elements without paint, or without area, get a thin stroke so you can see them.

Errors the window can show:

-   "The SVG has no shapes to draw."
-   "The SVG has N shapes; at most M fit." The rig holds 48 shapes in total.
-   "A shape in the SVG is too detailed (over 8192 characters of path data)."
-   "The SVG is larger than 32 KB."
-   An error from the sanitiser (below).

Adding the shapes is refused when the animation would grow past 64 KB.

## Use as icon

Use as icon makes the file the source of the icon parts, in place of an icon id. In YAML it sets `rig.svg` to the cleaned SVG and removes `rig.icon`.

-   Parts cut from the old icon no longer fit. They are removed, with the groups, tracks and value bindings that pointed at them.
-   Drawn shapes and parts with their own geometry stay. When the new SVG has another viewBox, they are rescaled into it, with their pivots, stroke widths and motion paths.
-   The parts list then offers Split icon, which makes one part per element of the SVG.

On a card, an animation with `rig.svg` draws the SVG's parts in place of the icon of an Icon, Button, Info or Light module, as described in [How a card shows the parts](parts.md#how-a-card-shows-the-parts).

## Size limits

| What | Limit |
| --- | --- |
| A saved icon (Save as icon) | 32 KB |
| An imported file | 32 KB |
| `rig.svg` | 32 KB |
| The own geometry of one part (`svg` on a part) | 32 KB |
| The whole animation as JSON | 64 KB |

Save as icon disables Copy SVG, Download .svg and Use in card when the icon is over 32 KB. Remove shapes or simplify freehand strokes to bring it down.

## What the sanitiser removes

Every SVG is cleaned before the studio uses it, with the same rules as a [custom SVG](../icon-effects/custom-svg.md#what-is-removed) in a card:

-   Kept: the drawing elements (`svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`, `defs`, gradients and their stops, `clipPath`, `mask`, `title`) and their geometry, paint, opacity, transform, `id` and `class` attributes.
-   Refused with an error: scripts, event handlers, `javascript:` links, `foreignObject`, external references, `<use>` and `<image>`, files over 32 KB and nesting deeper than 64 levels.
-   Removed: `<style>` blocks and `style="..."` attributes, so colours set through CSS classes are lost. Set `fill` and `stroke` attributes in the file before importing.

Hidden elements are imported like visible ones, and a nested `<svg>` is not treated as a separate viewport.
