# Path motion

A path animation moves the element, the module's icon or a row of particles along a path you draw. You draw on the preview stage; the path settings sit at the top of the inspector when nothing is selected.

To move one part of an icon, or a drawn shape, along a path inside a keyframes animation, see [Motion path](parts.md#motion-path) on the Icon parts page.

-   [Drawing on the stage](#drawing-on-the-stage)
-   [Path settings](#path-settings)
-   [Motion](#motion)
-   [Particles along the path](#particles-along-the-path)
-   [Keyboard](#keyboard)
-   [On the card](#on-the-card)

## Drawing on the stage

While a path animation is open, the stage shows the path over the preview card, with a grid and a Start label at the first point.

-   Click the stage to add a point at the end of the path. While the first point is selected, a click adds the point before it.
-   Click the line to insert a point there.
-   Drag a point to move it. Drag a handle to curve the line. A smooth point keeps its two handles mirrored; hold Alt to move one handle alone.
-   Double-click (or double-tap) a point to switch it between smooth and corner.
-   Click the first point while the last one is selected, or the other way round, to close the path.
-   Points snap to a grid of 5% (or 10 px for a pixel path). Hold Shift while dragging to place them freely.

For the element and the icon, the point (0, 0) is where they rest, so the path is an offset from their normal place.

## Path settings

-   Start from a template: Circle, Figure 8, Wave, Bounce, Zigzag or Spiral. A template replaces the current path.
-   Chips with the number of points, Closed or Open, and Straight, Curved or Mixed.
-   Smooth all, Straighten all and Reverse direction.
-   Closed path: the motion runs back to the start along the path. It needs at least two points.
-   Clear path removes every point.

## Motion

| Field | Options |
| --- | --- |
| What moves | Element (the whole element from where it rests), Icon (only the module's icon) or Particles (particles travel the path one after another, over the whole element) |
| Units | % of size (points are a share of the moving element's size, so the path scales with it) or Pixels (the same at every size) |
| Follow rotation | Turns the subject to face the direction of travel |

## Particles along the path

With What moves set to Particles, a Particles group appears:

-   Count: 1 to 60 particles, spaced evenly along the path.
-   Size: Smallest and Largest in px.
-   Colours: Add colour adds one. Without colours the particles take the animation colour.

The particles are round dots unless the YAML gives them a shape (`path.particles.shape`, see [Animation YAML](yaml.md#path)).

## Keyboard

| Key | Action |
| --- | --- |
| Tab | Move to a point |
| Arrows | Nudge the selected point by 1 (% or px), or by one grid step with Shift |
| Enter or Space | Switch the point between smooth and corner |
| Delete or Backspace | Remove the point |
| Escape | Deselect the point |

## On the card

-   Element and icon paths play as keyframes of `translate` (and `rotate` with Follow rotation), sampled along the path.
-   Particles on a pixel path use the browser's `offset-path`, with the sampled keyframes where the browser lacks it.
-   A sequence can play an element or icon path as one of its steps. A path with particles can't play in a sequence.
-   With reduced motion turned on, nothing moves and the particles are hidden.
