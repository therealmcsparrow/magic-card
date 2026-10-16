# Drawing

The drawing tools add your own shapes to a keyframes animation: a spark next to a bell, a wave over a tap, a frame around an icon. Shapes are drawn in the icon's coordinates and render with the icon on the card. Each shape can be animated like an [icon part](parts.md), including draw-on and a motion path. In YAML they are `rig.shapes`.

-   [The Draw toolbar](#the-draw-toolbar)
-   [Tools](#tools)
-   [Freehand smoothing](#freehand-smoothing)
-   [Snapping](#snapping)
-   [The shape inspector](#the-shape-inspector)
-   [The Shapes list](#the-shapes-list)
-   [Animating a shape](#animating-a-shape)
-   [Motion paths](#motion-paths)
-   [Tablet](#tablet)
-   [Shapes in YAML](#shapes-in-yaml)

## The Draw toolbar

On a keyframes animation the stage has a Draw button at the top. It opens the toolbar with the tools, then Import SVG, Save as icon and Stop drawing. Import SVG and Save as icon are described in [Own icons](own-icons.md). An `.svg` file dropped on the stage opens the import too.

While a tool is active, the inspector shows that tool's options and a line under the toolbar says what to do next, for example "Click to add the next point". The stage zooms to the icon while you draw. Stop drawing returns to the animation.

Shapes live in the icon's viewBox: 0 to 24 for Material Design Icons, or the viewBox of an own SVG. The stage maps that box onto the preview icon. On a tile without an icon (Text), the stage draws the shapes itself so you can still see them.

## Tools

| Tool | How it works |
| --- | --- |
| Select | Click a shape to select it, drag to move it. A shape made of one path also shows its points and handles: drag them to reshape it. Arrow keys nudge the shape by 0.1 units, or 1 unit with Shift. Delete removes it. |
| Pen | Click to add points, drag to pull out curve handles. Hold Alt for a sharp corner. Click the first point to close the shape. Click the last point or press Enter to finish an open line. Backspace or Delete removes the last point. Escape finishes the line, or drops it when it has fewer than two points. |
| Line | Drag to draw a straight line |
| Rectangle | Drag to draw. Shift draws a square, Alt draws from the centre. Corner radius is in the tool options (2 units by default). |
| Ellipse | Drag to draw. Shift draws a circle, Alt draws from the centre. |
| Freehand | Draw freely. The stroke is smoothed into curves when you let go. |
| Erase | Click a shape, or drag across shapes, to delete them. One drag is one undo step. |
| Motion path | Draw the path the selected part, group or shape travels, starting where it rests. Only available with a part, group or shape selected. |

A drag is one undo step. Escape, or the browser cancelling the pointer, drops the gesture in progress and leaves the animation as it was.

New shapes take the options of the active tool:

-   Closed shapes are filled with the icon colour (`currentColor`) unless the options say otherwise.
-   Open lines are drawn by their stroke: 1.5 units wide with round ends.
-   New shapes go over the icon. Choose Under the icon in the options to draw behind it.

At most 48 shapes fit in one animation. The tools then say "At most 48 shapes fit in a rig."

## Freehand smoothing

Freehand keeps the points you drew and fits smooth curves through them when you let go. Sharp turns stay sharp. A stroke that ends where it started is closed.

The Smoothing slider runs from Detail to Smooth (0.05 to 2 icon units, 0.4 by default). More smoothing gives fewer points and a calmer line. The slider sets the smoothing for the next stroke. With the last freehand stroke selected, it also refits that stroke, and the dotted line shows what you drew. Moving the stroke keeps that link. Editing a point or handle by hand ends it.

A stroke keeps at most 4000 samples and 60 curve segments.

## Snapping

The tool options have two snapping switches, both on by default:

-   Grid: points land on whole icon units.
-   Anchor points: points jump to a point of the icon or of another shape within reach (10 px on screen). A ring shows the point it snaps to.

An anchor point within reach wins over the grid. Hold Shift to place a point freely.

## The shape inspector

Selecting a shape shows its settings:

| Group | Field | Notes |
| --- | --- | --- |
| Shape | Name | Up to 80 characters |
| Shape | Layer | Over the icon or Under the icon, with Bring forward and Send backward |
| Paint | Fill | A switch and a colour. The entity colour is stored as `entity`, or `entity 40%` with a strength. |
| Paint | Stroke | A switch and a colour. An open line is drawn by its stroke. |
| Paint | Stroke width (icon units) | 0 to 100 |
| Paint | Line ends | Round, Flat or Square |
| Freehand | Smoothing | Only for the last freehand stroke |
| Animation | Draw on | The outline draws in over the cycle, then the shape fills. A line just draws in. |
| Motion path | Draw motion path, Redraw, Remove motion path | Draw where the shape travels on the stage, starting where it rests |
| Motion path | Follow the path | The shape turns with the direction it travels |

Delete shape removes the shape, its track and its value bindings.

Colours accept the same values as keyframe colours (see [CSS values](yaml.md#css-values)), plus `currentColor` (the icon colour) and `entity` or `entity N%` (the entity colour).

## The Shapes list

The Shapes panel in the Layers column lists the shapes from the top of the paint order down, with a thumbnail in their colours and a note: under or over the icon, draws on, moves. Click a row to select the shape. The selected row has Bring forward, Send backward and Delete shape.

A shape selected in the list opens the shape inspector, and the stage keeps the parts overlay, so a tap on the stage still picks a part. To move or reshape the shape on the stage, pick Draw (the Select tool keeps the shape selected). With a drawing tool already picked, clicking a row selects the shape with the Select tool.

## Animating a shape

A selected shape is a target on the timeline like a part: `shape:<id>`. It has the same lanes as a part, including Draw on and Stroke color. See [Animating a part](parts.md#animating-a-part).

## Motion paths

The Motion path tool draws the path of the selected part, group or shape by hand. The path starts where the target rests. Follow rotation in the tool options turns the target along the path.

The path is stored on the target's track (`path: { d, follow_rotation }`) relative to its first point, in icon units. A new path needs a free track: with 24 tracks in use, the tool says "At most 24 animated targets."

## Tablet

The tools use pointer events, so a finger or a pen draws like a mouse. Points and handles have touch targets of at least 24 px at any stage scale. Every action has a button or a key, none depends on hovering. Hold Shift on a keyboard to place points freely. Without a keyboard, turn Grid and Anchor points off in the tool options.

## Shapes in YAML

```yaml
rig:
  shapes:
    - id: spark
      name: Spark
      d: "M19 3 L20 5 L22 6 L20 7 L19 9 L18 7 L16 6 L18 5 Z"
      fill: entity
      layer: over
    - id: ground
      name: Ground line
      d: "M3 22 H21"
      stroke: currentColor
      stroke_width: 1.5
      linecap: round
      layer: under
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | string | | Required. 1 to 32 lowercase letters, digits, `-` or `_`, unique among the parts, groups and shapes. |
| `name` | string | The id | Up to 80 characters |
| `d` | string | | Required. Path data in icon units, up to 8192 characters, starting with `M` or `m`. |
| `fill` | colour | | A CSS colour, `currentColor`, `entity` or `entity N%` |
| `stroke` | colour | | As `fill` |
| `stroke_width` | number | | 0 to 100, in icon units |
| `linecap` | string | | `round`, `butt` or `square` |
| `layer` | string | `over` | `over` (on top of the icon) or `under` (behind it) |
| `origin` | `[x, y]` | Centre of the shape | Pivot in icon units |

A shape with neither `fill` nor `stroke` is filled with the icon colour. A shape with only a `stroke` has no fill. On the card, shapes under the icon are drawn first, then the icon's pieces and parts, then the shapes over it.
