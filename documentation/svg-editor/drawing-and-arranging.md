# Drawing and arranging

This page covers the tools, the grid, the numeric fields, alignment, boolean operations and the menus of the [SVG editor](README.md).

## Tools

-   Rectangle, with a corner radius.
-   Ellipse.
-   Line.
-   Polygon and star.
-   Pen, which adds points and curves.
-   Freehand.
-   Select, which moves, scales, rotates and flips a shape.

## Shapes tool

The Shapes tool draws one of 19 ready-made shapes:

-   Rounded rectangle, triangle, arrow, chevron, plus, heart, speech bubble, drop, leaf, shield, cloud, ticket, tab and tag.
-   Circle, ellipse, semicircle, star and hexagon.

A circle fills the shorter side of its box, so it stays round. The other shapes fill the whole box.

Node editing works on a path. You can add, delete, smooth or sharpen a point (Corner or Smooth), close a path, reverse it and add a point after the selected one.

## Numeric fields

A selected shape shows X, Y, Width, Height and Angle. Type a value to set it exactly. The result is the same as moving or scaling the shape with the mouse.

Arrow keys move the selection. With Snap to grid off, they move by 0.5. With Snap to grid on, they move by the grid size. Hold Shift for a larger step.

## Grid and snapping

The artboard is 24 x 24 units, with a 20 x 20 safe area in the middle. Icons in a card look best when they fit inside it.

-   Show a pixel grid, so edges line up with whole pixels.
-   Snap to grid turns snapping on or off. Snapping and the arrow keys use the grid size.
-   Grid size sets the step. If you type a size the grid cannot use, the editor picks the nearest allowed size and tells you which one.

## Alignment and arrangement

Select two or more shapes to align them, or to distribute them evenly. The Align menu also has:

-   Centre on canvas.
-   Fit to safe area, which scales a shape down to fit inside the 20 x 20 area, and centres it.
-   Match safe-area edges, which lines a shape's edges up with the safe area.

## Boolean operations

Combine joins two or more shapes with a boolean operation (for example, union or subtract). The same 19 shapes are offered in the shape editor's Combine with section. Each operation has a reason shown in the menu, so you know why it is not available for the current selection. A boolean operation is one undo step.

## Handles and touch

On a touch screen, every handle has a target of at least 24 x 24 CSS pixels. Every action that you can drag can also be done with the keyboard or the numeric fields.

## Right-click menu

Right-click a shape, or press Shift+F10 or the Menu key, to open its menu. On an empty canvas the menu offers Select all and Zoom to fit. On a point in the Node tool, it offers Corner or Smooth, Delete point and Add point after.

## Colour

Each fill and each stroke is set to None, Main or Accent. Main draws in the card's main icon colour, and Accent draws in the card's accent colour. See [Layers](layers.md#dual-tone-accent) for how this works with saved icons.

Stroke width, line cap, line join and fill rule are set per shape.

## Preview

The preview shows the icon at 24, 48 and 96 pixels. Zoom and pan the canvas with the mouse. On a touch screen, pinch to zoom.

## Undo

Ctrl+Z undoes the last step, and you can undo many steps in a row. A drag counts as one step, so one Ctrl+Z puts back the whole move.
