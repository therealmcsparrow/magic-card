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
| Shift+F10 or the Menu key | Open the selection's menu under its frame (the card's at the card's top-left). See [Item menus](../editor/item-menus.md). | Not while adding a flow |
| F2 | Rename the selection in Layers; focus comes back to the canvas | Not while adding a flow |
| Alt+Up | Move the selected module up within its column or slot; a selected row, tab or row-module column moves up too | A module, row, tab or row-module column is selected |
| Alt+Down | Move it down | Same |
| Delete or Backspace | Delete the selected module or row. A column is deleted unless it is the row's only one. A tab or row-module column that holds modules opens its menu on the delete question first. | Not with Ctrl |
| Ctrl+D | Duplicate the selected module or row | A module or row is selected |
| Escape | Select the parent: module, then its tab or row-module column (inside Tabs and Row modules), its layout module or its column, then row, then card | Something other than the card is selected |
| Escape | Close the Studio | The card is selected |
| Escape | Cancel adding a flow | Connect mode is on (this takes priority) |

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
| An open menu (item menu, template, paste) | In a submenu, goes back one level to the list above. In the main list, closes the menu and returns focus to where it was opened: the three-dot button, the tree item or the canvas |
| The Copy this YAML window | Closes the window only |
| A column resize drag in progress | Cancels the drag and restores the widths |
| A picker window or dialog opened from the Studio | Closes that window only |
| The connect hint bar or the canvas in connect mode | Cancels adding a flow |
| The canvas, with a row, column or module selected | Selects the parent |
| The Layers overlay on a narrow screen (900 px or less) | Closes the overlay and focuses the Layers button |
| Anywhere else (the canvas with the card selected, Layers, the inspector, the top bar) | Closes the Studio |

Escape in the inspector closes the Studio, even when a module is selected. If the browser closes the Studio's dialog by itself (for example after repeated Escape presses), the Studio closes normally.

## Layers

The Layers panel uses the structure outline keys: arrow keys, Home and End to move focus, Enter or Space to select, Delete or Backspace to delete the focused item, Alt+Up and Alt+Down to move a module, tab, row-module column or row, Ctrl+D to duplicate a module or row, F2 to rename any item, and the Menu key or Shift+F10 for its menu. See [Structure outline](../editor/structure-outline.md#keyboard).

## Top bar

| Control | Keys |
| --- | --- |
| Form / YAML | Right / Left switch mode (wraps), Home / End go to the first / last |
| Canvas width | Right / Left change the width (wraps), Home / End go to Narrow / Panel |

## Focus

-   When the Studio opens, the canvas gets focus, so canvas shortcuts work straight away.
-   Clicking on the card or the dotted background focuses the canvas.
-   Edit in an item menu (Edit card settings for the card) moves focus to the inspector's active tab.
-   A menu opened on the canvas returns focus to the canvas when it closes. After an action, focus goes to the canvas, which now frames what the action selected.
-   After a floating bar Delete, or when a floating bar button becomes disabled (for example Move up on the first module), focus goes back to the canvas.
-   Closing the Studio returns focus to the Open studio button in the pane editor.
-   Keys pressed in the Studio never reach Home Assistant's own shortcuts behind it.
