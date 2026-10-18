# Shape editor

The shape editor draws the outline of a card, row, column or module. You can change the size of each corner, pick a shape to start from, or draw a free outline with the pen. A saved shape can be used on any card.

The editor is part of the Magic Card Utils integration and needs Magic Card 2026.10.11-beta.1 or newer.

This is a pre-release. HACS shows it only when you turn on Show beta versions.

## Open the editor

1.  Open Magic Card Utils in the sidebar and go to the Library tab, or the Shapes tab.
2.  Choose New shape, or choose Edit on a saved shape.

The editor opens full-screen in the panel. Your changes are saved only when you choose Save to library. The name is required.

## Two modes

-   **Corners** changes the four corners of a box. Each corner has its own type and size.
-   **Free shape** draws an outline with the pen, point by point. Each point can be a corner point or a smooth point.

Use Start from to begin with a shape that already exists (Start from a shape), and then change it. When you edit a built-in preset as a custom shape, the outline matches the preset within 1 pixel at the three preview sizes.

## Corners

Each corner has:

-   A type: round, squircle, bevel, scoop, notch or square.
-   A size, in pixels or as a percentage of the shorter side of the box.

Link the corners to change them together, or unlink them to set each one. Smoothing sets how round the squircle corners are.

When the corners are bigger than half of a side, all corners shrink together, in the same proportion, so the outline never crosses itself.

## Free shape

Click or tap to add points, and drag to make a curve. The points make one closed outline.

## Combine

Combine adds a second shape to the outline, or subtracts it, or keeps only the part that both shapes share.

## Grid and snap

Turn on Snap to move points to the grid. The number fields accept exact values, whether Snap is on or off.

## Previews

The editor shows the shape at the size of a tile, a row and a wide module, next to the real card. A change shows in all of them at once.

## Padding

A padding setting keeps the text of the card clear of the outline. Corners and edges that cut into the box move the content in, so text is not hidden by a corner. The inset does not shrink as the card gets taller, so a card that grows does not jump.

## Warnings

The editor shows warnings for curved shapes. For example, it warns that older browsers draw the curved corners as straight facets. The border, the ring and the shadow stay as they are.

## Every control has a label

Each value is a field with a label. You can reach every field with the keyboard, and the focus is always visible.

## Related

-   [Custom shapes in cards](custom-shapes-in-cards.md): the YAML for `shape: custom`, saved shapes by `ref`, and what an older browser shows.
-   [Shapes](../design/shapes.md): the built-in shapes, such as squircle, pill and hexagon.
-   [SVG editor](../svg-editor/README.md): the editor for icons.
