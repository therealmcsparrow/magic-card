# Undo and redo

The Undo and Redo buttons sit in the pane head and in the Studio top bar. A button is disabled when there is nothing to undo or redo.

-   [What is recorded](#what-is-recorded)
-   [How long the history lasts](#how-long-the-history-lasts)
-   [Keyboard](#keyboard)

## What is recorded

Every change to the config is one step: a field edit in the inspector, a menu action in the outline, a drag and drop, a paste, a template action that changes the config, and every valid YAML edit.

Some actions change several things in one step:

-   Deleting a module, column or row also removes the flow lines that pointed at the removed modules.
-   Adding a flow on the Studio canvas also gives the two modules ids when they had none.
-   Picking a layout preset for a row also removes the row's own column widths.

Repeated actions on a column width handle are folded into one step:

-   A drag of the handle in the Studio is one step, written when you release it. A drag that is cancelled is not recorded.
-   Arrow key presses on the same handle are one step while the key is held, or while the presses follow each other within half a second with no other change in between. See [Column resize](../studio/column-resize.md).

Not recorded:

-   Selection, the inspector tab, collapsed rows, the Form / YAML mode and the Studio device width.
-   Merging a linked template into the card when the editor opens or after a re-sync.

Making a new change clears the redo steps.

## How long the history lasts

-   The history keeps the last 50 steps. Older steps are dropped.
-   The pane and the Studio share one history. You can undo a Studio change from the pane after closing the Studio.
-   The history stays while you switch between the tabs of Home Assistant's card dialog (Config, Visibility, Layout).
-   It is lost when Home Assistant's card dialog closes.

After an undo or redo the selection stays where it was when that item still exists. Otherwise it moves to the nearest item that does (for example the column of a removed module).

## Keyboard

Keyboard undo and redo work in the Studio only:

| Shortcut | Action |
| --- | --- |
| Ctrl+Z (Cmd+Z on macOS) | Undo |
| Ctrl+Y, or Ctrl+Shift+Z (Cmd on macOS) | Redo |

They do nothing while focus is in a text field, a text area, a select or editable text. There the browser's own text undo applies. See [Studio keyboard shortcuts](../studio/keyboard-shortcuts.md).

In the pane editor, use the buttons.
