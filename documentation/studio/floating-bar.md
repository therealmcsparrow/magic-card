# Floating bar

When a module is selected on the canvas (a top-level module or a layout child), a small toolbar appears next to it. Rows, columns and the card have no floating bar; use their three-dot menus in Layers. When the row has more than one column, a selected row or column shows column resize handles on the canvas. See [Column resize](column-resize.md).

## Buttons

| Button | Shortcut | Action |
| --- | --- | --- |
| Move up | Alt+Up | Moves the module one place up in its column, or in its slot of a layout module. Disabled on the first module. |
| Move down | Alt+Down | Moves it one place down. Disabled on the last module. |
| Duplicate | Ctrl+D | Inserts a copy below it, with new ids (nested children included), and selects the copy. |
| Add flow from here | | Starts a flow line at this module. See [Flows on the canvas](flows-on-canvas.md). Pressed again, it cancels. |
| Delete | Delete | Removes the module, and the flow lines that pointed at it. No confirmation; use undo. |

The shortcuts work when the canvas has focus. See [Keyboard shortcuts](keyboard-shortcuts.md).

Move up and Move down never leave the module's column or slot. To move a module to another column, drag it in Layers or use Move to… in its three-dot menu. See [Structure outline](../editor/structure-outline.md).

After a delete, the selection moves to the next module in the same list (or the previous one when it was the last). When a layout child was the last in its slot, the layout module is selected. When a top-level module was the last in its column, the column is selected.

On a card linked to a template, Add flow from here is disabled for a template module that has no `id`. Its tooltip says "Give this module an id in the template".

## Placement

The bar never covers a neighbouring module. It tries these places in order:

1.  Below the selection frame, aligned to its right edge.
2.  Above the frame, clear of its name tag.
3.  To the right of the frame.
4.  Inside the frame's top-right corner, as a last resort.

It always stays inside the visible part of the canvas and moves with the selection when the canvas scrolls or resizes.
