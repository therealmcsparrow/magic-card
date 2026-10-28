# Path motion

A path animation moves the element, the module's icon or a row of particles along a path you draw. You draw on the preview stage; the path settings sit at the top of the inspector when nothing is selected.

To move one part of an icon, or a drawn shape, along a path inside a keyframes animation, see [Motion path](parts.md#motion-path) on the Icon parts page.

-   [Drawing on the stage](#drawing-on-the-stage)
-   [Path settings](#path-settings)
-   [Motion](#motion)
-   [When the drawing tools do not load](#when-the-drawing-tools-do-not-load)
-   [Particles along the path](#particles-along-the-path)
-   [Keyboard](#keyboard)
-   [On the card](#on-the-card)

## Drawing on the stage

While a path animation is open, the stage shows the path over the preview card, with a grid and a Start label at the first point.

-   Click the stage to add a point at the end of the path.
-   Click the line to insert a point there.
-   Press an arrow key to move a crosshair, then Enter to place a point there. This works without a pointer.
-   Drag a point to move it. Drag a handle to curve the line. A smooth point keeps its two handles mirrored; hold Alt to move one handle alone.
-   Double-click (or double-tap) a point to switch it between smooth and corner.
-   Click the first point to close the path. A path closes once it has three points.
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

## When the drawing tools do not load

The path is drawn on a canvas that loads when the stage opens. If it cannot load, the stage says "Couldn't load the drawing tools." with a **Try again** button. If the page holds an older Magic Card version, it says "The drawing tools on this page are from another Magic Card version. Reload the page to draw here." with a **Reload page** button.

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
| Arrows | While the path is open: move the crosshair for the next point. With a point selected on a closed path: nudge the point by 1 (% or px), by one grid step with Shift, or by 0.1 with Alt |
| Enter | Open path: place a point at the crosshair |
| C | Switch the point between smooth and corner |
| Delete or Backspace | Remove the selected point |
| Escape | Deselect the point |

## On the card

-   Element and icon paths play as keyframes of `translate` (and `rotate` with Follow rotation), sampled along the path.
-   Particles on a pixel path use the browser's `offset-path`, with the sampled keyframes where the browser lacks it.
-   A sequence can play an element or icon path as one of its steps. A path with particles can't play in a sequence.
-   With reduced motion turned on, nothing moves and the particles are hidden.
