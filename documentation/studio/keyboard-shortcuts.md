# Keyboard shortcuts

On macOS, use Cmd where this page says Ctrl.

-   [Anywhere in the Studio](#anywhere-in-the-studio)
-   [Canvas](#canvas)
-   [Column resize handles](#column-resize-handles)
-   [Escape](#escape)
-   [Layers](#layers)
-   [Top bar](#top-bar)
-   [Focus](#focus)

## Anywhere in the Studio

| Shortcut | Action | Condition |
| --- | --- | --- |
| Ctrl+Z | Undo | Not while focus is in a text field, text area, select or editable text (the browser's text undo applies there). Not with Alt. |
| Ctrl+Y | Redo | Same |
| Ctrl+Shift+Z | Redo | Same |

These are the only shortcuts that work outside the canvas. Keyboard undo and redo do not exist in the pane editor.

## Canvas

These work when the canvas has focus (after clicking the card or the dotted background, or tabbing to it). They also work when focus is on something inside the canvas card, unless it is a text field.

| Shortcut | Action | Condition |
| --- | --- | --- |
| Alt+Up | Move the selected module up within its column or slot | A module is selected |
| Alt+Down | Move it down | A module is selected |
| Delete or Backspace | Delete the selected module | A module is selected; not with Ctrl |
| Ctrl+D | Duplicate the selected module | A module is selected |
| Escape | Select the parent: module, then its tab or row-module column (inside Tabs and Row modules), its layout module or its column, then row, then card | Something other than the card is selected |
| Escape | Close the Studio | The card is selected |
| Escape | Cancel adding a flow | Connect mode is on (this takes priority) |

Rows and columns cannot be moved, duplicated or deleted from the canvas keyboard. Use Layers.

## Column resize handles

When a row or one of its columns is selected, each gap between two columns has a resize handle in the tab order. So does a selected Row module, or one of its columns. With focus on a handle:

| Shortcut | Action |
| --- | --- |
| Left / Right | Move the gap one step |
| Shift+Left / Shift+Right | Move the gap five steps |
| Home / End | Move the gap as far left / right as it goes |

Other keys pressed on a handle work as canvas shortcuts. See [Column resize](column-resize.md).

## Escape

Escape is handled by the innermost thing that uses it:

| Where | Escape does |
| --- | --- |
| An open menu (three-dot, template, paste) | Closes the menu and returns focus to its button |
| A column resize drag in progress | Cancels the drag and restores the widths |
| A picker window or dialog opened from the Studio | Closes that window only |
| The connect hint bar or the canvas in connect mode | Cancels adding a flow |
| The canvas, with a row, column or module selected | Selects the parent |
| The Layers overlay on a narrow screen (900 px or less) | Closes the overlay and focuses the Layers button |
| Anywhere else (the canvas with the card selected, Layers, the inspector, the top bar) | Closes the Studio |

Escape in the inspector closes the Studio, even when a module is selected. If the browser closes the Studio's dialog by itself (for example after repeated Escape presses), the Studio closes normally.

## Layers

The Layers panel uses the structure outline keys: arrow keys, Home and End to move focus, Enter or Space to select, Delete or Backspace to delete the focused module, tab or row-module column, Alt+Up and Alt+Down to move a module, tab, row-module column or row, F2 to rename a tab, and the Menu key or Shift+F10 for the three-dot menu. Ctrl+D does not work here. See [Structure outline](../editor/structure-outline.md#keyboard).

## Top bar

| Control | Keys |
| --- | --- |
| Form / YAML | Right / Left switch mode (wraps), Home / End go to the first / last |
| Device width | Right / Left change the width (wraps), Home / End go to Phone / Desktop |

## Focus

-   When the Studio opens, the canvas gets focus, so canvas shortcuts work straight away.
-   Clicking on the card or the dotted background focuses the canvas.
-   Edit in a module's three-dot menu moves focus to the inspector's active tab.
-   After a floating bar Delete, or when a floating bar button becomes disabled (for example Move up on the first module), focus goes back to the canvas.
-   Closing the Studio returns focus to the Open studio button in the pane editor.
-   Keys pressed in the Studio never reach Home Assistant's own shortcuts behind it.
