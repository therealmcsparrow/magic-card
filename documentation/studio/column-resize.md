# Column resize

In the Studio you can change a row's column widths by dragging the gaps between its columns on the canvas. The widths are stored in the row's `column_widths`, the same list the Column widths field in the row's General tab edits. See [Inspector](../inspector/README.md).

A [Row module](../modules/layout/row.md) works the same way. Its handles write the module's own `column_widths`.

-   [The handles](#the-handles)
-   [Dragging](#dragging)
-   [Keyboard](#keyboard)
-   [Units](#units)
-   [Row modules](#row-modules)
-   [Undo and templates](#undo-and-templates)

## The handles

When a row or one of its columns is selected, each gap between two columns gets a resize handle. The handle is a thin line as tall as the row with a grip in the middle, in the row colour (orange).

Handles are shown only when:

-   The row has more than one column.
-   The selection is that row or one of its columns. For a Row module: the module itself or one of its columns. Other modules and the card show no handles.
-   No flow is being added.

The handle's tooltip reads "Drag to resize, double-click for equal widths". The hit area is 16 px wide, 24 px on touch screens.

## Dragging

Drag a handle left or right. Only the two columns next to it change: one gets wider by what the other loses, and the rest of the row stays as it is.

-   While you drag, only the canvas card changes. The config is written when you release the handle.
-   The width snaps to steps: 0.05 for `fr`, 1 for `%`, 4 for `px`. Hold Alt while dragging to turn snapping off.
-   A column never gets narrower than 40 px.
-   Escape during a drag cancels it and restores the widths. It does not change the selection or close the Studio.
-   A drag is also cancelled when the row changes underneath it, for example by undo or a YAML edit.

Double-click a handle to give its two columns the same width.

## Keyboard

Each handle is in the tab order. With focus on a handle:

| Key | Action |
| --- | --- |
| Left / Right | Move the gap one step (0.05 `fr`, 1 `%` or 4 px) |
| Shift+Left / Shift+Right | Move the gap five steps |
| Home / End | Move the gap as far left / right as it goes (the column on that side keeps 40 px) |

The handle keeps focus after each press. Other keys work as canvas shortcuts. See [Keyboard shortcuts](keyboard-shortcuts.md#column-resize-handles).

## Units

A row without its own widths uses its layout preset. The first resize writes the preset out as widths (a `2-1` layout becomes `2fr 1fr`) and then changes the dragged pair.

When the two columns next to a handle use the same unit (`fr`, `%` or `px`), they keep it. When they use different units, or one of them is `auto`, both become `fr` values that match their current sizes.

Picking a layout preset in the row's General tab, or Equal widths under the Column widths field, removes the custom widths again.

## Row modules

A Row module inside a column gets the same handles when you select the module, or one of its columns on the canvas or in Layers. Dragging, double-click, the keys, snapping, the 40 px minimum and the units all work as for a card row. The handles write the module's `column_widths`, the list its General tab edits under Column widths. Picking a layout preset or Equal widths there removes them again.

## Undo and templates

-   A drag is one undo step. So is a double-click.
-   Arrow key presses on the same handle are one undo step while the key is held, or while the presses follow each other within half a second.
-   On a card linked to a template, a resize overrides the row's `column_widths`. On a top-level Row module it overrides the module's `column_widths`; on a Row module nested in another layout module it overrides that layout's child list. See [Templates](../editor/templates.md#overrides).
