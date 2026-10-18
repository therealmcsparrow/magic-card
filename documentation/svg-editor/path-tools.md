# Path tools

The path tools change the outline of a path. They are in the path menu of the [SVG editor](README.md).

Each tool shows a preview before it changes anything. Choose Apply to keep the result, or Cancel to leave the icon as it was. Each applied tool is one undo step.

If a tool cannot run on the current selection, its menu entry shows the reason. For example, Join needs two open paths.

## Outline stroke

Turns a stroked line into a filled shape with the same look. The width, line cap and line join of the stroke are kept. The result is one filled path, so it can be coloured like any other shape.

## Offset path

Grows or shrinks a path by an amount you type. Use a positive number to grow and a negative number to shrink. Choose a round or a mitre join for the corners. Self-intersections that the offset creates are removed.

## Simplify

Reduces the number of points in a path. Move the tolerance slider to decide how far the new outline may be from the old one. Simplify also smooths a path that has many small points.

## Join

Joins two open paths at their nearest ends. You can also close one open path by joining its two ends.

## Split

Splits a path into two at the selected point. Use it like a pair of scissors. The two parts look the same as the original.

## Knife

Draw a cut line across one or more shapes. The shapes are cut where the line crosses them.

## Not available here

Path tools are in the SVG editor only. The [shape editor](../shape-editor/README.md) does not have them yet.
