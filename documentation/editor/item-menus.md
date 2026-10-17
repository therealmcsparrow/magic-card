# Item menus

Every item of the card has a menu of actions: the card, rows, columns, modules, layout children, tabs and the columns of a Row module. The same menu opens in the structure tree (the pane editor's Structure and the Studio's Layers) and on the Studio canvas. The menu always acts on one item.

-   [Opening a menu](#opening-a-menu)
-   [Card](#card)
-   [Row](#row)
-   [Column](#column)
-   [Module](#module)
-   [Layout child](#layout-child)
-   [Tab](#tab)
-   [Row-module column](#row-module-column)
-   [Copy YAML](#copy-yaml)
-   [Copy and paste a module](#copy-and-paste-a-module)
-   [Wrap in layout](#wrap-in-layout)
-   [Hide on dashboard](#hide-on-dashboard)
-   [Rename](#rename)
-   [Reset to template](#reset-to-template)
-   [Menu keyboard and focus](#menu-keyboard-and-focus)

## Opening a menu

| How | In the tree | On the canvas |
| --- | --- | --- |
| Right-click (Ctrl+click on a Mac) | On an item. It is selected first, then the menu opens at the pointer. | On a module, column, row or the card, the same item a click would select. On the dotted background: the card's menu. |
| Long-press (touch) | Hold a finger on an item for half a second without moving it. | The same, on the card. |
| Shift+F10 or the Menu key | On the focused item. | For the selection, under its frame. The card's menu opens at the top-left of the card. |
| Three-dot button | Next to rows, columns, modules, tabs and row-module columns. | No three-dot button. |

Shift+right-click keeps the browser's own menu (for Inspect and similar). Text fields keep the browser's menu too, and so does the card's Preview pop-up. While you add a flow on the canvas, right-click opens nothing.

A right-click on another item while a menu is open closes it, selects the new item and opens its menu.

Shortcuts that work in both the tree and on the canvas are shown on the right of their menu item.

## Card

| Item | Action |
| --- | --- |
| Edit card settings | Selects the card and moves focus to the inspector. |
| Add row | Adds an empty row at the end, the same as the Add row button. |
| Rename | Renames the card (its `name`). |
| Copy YAML | Copies the whole card as the YAML editor shows it. |
| Reset card to template… | Template-linked card only. Asks first, then drops every local override of the card, the same as Re-sync in the template bar (see [Templates](templates.md#re-sync)). Disabled when nothing differs from the template. |

## Row

| Item | Action |
| --- | --- |
| Add column | Adds an empty column at the end and selects it. |
| Duplicate row | Inserts a copy below with new ids. The copy is selected. Ctrl+D does the same. |
| Rename | Gives the row a layer name. See [Rename](#rename). |
| Copy YAML | Copies the row. |
| Copy design, Paste design, Merge pasted design | See [Copy and paste design](copy-paste-design.md). Paste and Merge are disabled until a design is copied. |
| Hide on dashboard / Show on dashboard | See [Hide on dashboard](#hide-on-dashboard). |
| Reset row to template… | Template-linked card only. See [Reset to template](#reset-to-template). |
| Move up, Move down | Moves the row. Disabled on the first or last row. Alt+Up and Alt+Down do the same. |
| Delete row | Removes the row and everything in it. There is no confirmation; use undo. Delete does the same. |

## Column

| Item | Action |
| --- | --- |
| Add module | Opens the Add module picker for this column. |
| Paste module | Pastes the copied module at the end of the column. Disabled until a module is copied. |
| Rename | Gives the column a layer name. |
| Copy YAML | Copies the column. |
| Copy design, Paste design, Merge pasted design | As for rows. |
| Hide on dashboard / Show on dashboard | |
| Reset column to template… | Template-linked card only. |
| Delete column | Removes the column and its modules. Disabled on the row's only column, with the reason "A row needs one column". |

Columns have no move items. Change their order through the row's layout or column widths.

## Module

| Item | Action |
| --- | --- |
| Edit | Selects the module and moves focus to the inspector. |
| Add module, Add tab, Add column | Layout modules only: Add module for Horizontal, Vertical and Slider layout, Add tab for Tabs, Add column for Row. |
| Add flow from here | Canvas only. Starts a flow line from this module. Disabled for a module of a template-linked card that has no id. |
| Rename | Gives the module a layer name. |
| Copy module | Copies the module, with its children. See [Copy and paste a module](#copy-and-paste-a-module). |
| Paste module after | Pastes the copied module right after this one. |
| Duplicate | Inserts a copy below with new ids. Ctrl+D does the same. |
| Wrap in layout | Opens a list of layouts. See [Wrap in layout](#wrap-in-layout). |
| Copy YAML | Copies the module, children included. |
| Copy design, Paste design, Merge pasted design | As for rows. |
| Hide on dashboard / Show on dashboard | |
| Reset to template… | Template-linked card only. |
| Move up, Move down | Moves the module within its column. Alt+Up and Alt+Down do the same. |
| Move to… | Opens a list of the card's other columns. The module goes to the end of the one you pick. Disabled when there is no other column. |
| Delete | Removes the module. Delete does the same; use undo to bring it back. |

## Layout child

A module inside a Horizontal, Vertical, Slider layout, Tabs or Row module has the module menu with three differences:

-   Move to… lists the other tabs or columns of its layout.
-   Wrap in layout wraps the child where it is, inside its layout.
-   Reset to template… reads Reset layout to template…. A child has no overrides of its own: it resets the whole child list of the top-level layout module. The question names that layout.

## Tab

| Item | Action |
| --- | --- |
| Add module | Opens the Add module picker for this tab. |
| Paste module | Pastes the copied module at the end of the tab. |
| Rename | Renames the tab's label, the text on the dashboard's tab bar. |
| Copy YAML | Copies the tab. |
| Hide tab on dashboard / Show tab on dashboard | Leaves the tab out of the dashboard's tab bar. |
| Move up, Move down | Moves the tab in the tab order. |
| Delete tab | Removes the tab and its modules. A tab that holds modules asks first. Disabled on the only tab. |

## Row-module column

As a tab, with Copy design, Paste design and Merge pasted design after Copy YAML. Rename gives the column a layer name, since these columns have no label on the dashboard. Hide leaves the column out on the dashboard.

## Copy YAML

Copy YAML puts the item's YAML on the clipboard. Editor bookkeeping (`not_synced` and keys starting with `_`) is left out, except for the card, which is copied as the YAML editor shows it. A short message confirms it: "Row 2 YAML copied". In the Studio it shows at the foot of the canvas; in the pane editor it is Home Assistant's own message bar.

Browsers only allow the clipboard on secure pages. Home Assistant opened over plain `http://` on your network has no clipboard access, so the editor tries an older copy method next. When that fails too, a window called Copy this YAML shows the text selected. Press Ctrl+C (Cmd+C on a Mac) and close the window.

## Copy and paste a module

Copy module keeps the module in the browser (like the design clipboard), so you can paste it in another card or another dialog. It also puts the module's YAML on the system clipboard, for a card's YAML editor or another browser.

Paste module after inserts it after the module whose menu you used. Paste module on a column, tab or row-module column adds it at the end. The pasted module gets new ids, children included, and is selected. Pasting into a layout of a template-linked card marks that layout's child list as a local change.

## Wrap in layout

Wrap in layout opens a second list in the same menu: Vertical, Horizontal, Row, Tabs and Slider layout. The module moves into a new layout module of that type, in its first slot (the first column of a Row, the first tab of Tabs), and the new layout module takes its place and is selected. Back returns to the main list. Undo removes the layout again.

## Hide on dashboard

Hide on dashboard sets `hidden: true` on the item. The dashboard then leaves it out, as if its display conditions were not met. It works on rows, columns, modules, layout children, tabs and row-module columns.

The editor keeps showing hidden items so you can still edit them:

-   In the tree the name is greyed out and an eye-off icon follows it. Screen readers hear "Hidden on dashboard".
-   On the canvas the item is drawn at reduced opacity, like an item whose display conditions are not met, and its name tag ends in "· hidden".
-   The inspector header adds "Hidden on dashboard".

Show on dashboard removes the flag. On a template-linked card, hiding a row, column or module is a local change of this card. YAML: [Config schema](../yaml/schema.md).

## Rename

Rename turns the item's name in the tree into a text field. Enter or moving focus away keeps the new name; Escape drops it. F2 and a double-click on a tree item do the same. Rename on the canvas opens that field in Layers (on a narrow screen the Layers overlay opens for it) and puts focus back on the canvas afterwards.

What the name is depends on the item:

| Item | Rename sets |
| --- | --- |
| Card | The card's `name`. |
| Tab | The tab's label, shown on the dashboard. An empty name keeps the old label. |
| Row, column, module, row-module column | A layer name (`editor_name`). It shows only in the editor: the tree, the canvas name tags and the inspector header. The dashboard never shows it, so a button's label or a text module's text stay as they are. |

An empty layer name, or the item's default name ("Row 2", "Button · Toggle"), removes the layer name.

## Reset to template

On a template-linked card, rows, columns and modules can differ from the template (see [Templates](templates.md)). Reset to template… asks first, in the same menu: "Reset Row 2 to the template? Your changes to it are lost.", with Cancel and Reset. Focus starts on Cancel, so pressing Enter twice never drops your work by accident. Reset clears the item's local overrides and loads the template's values again.

Reset is shown only on a template-linked card and is disabled when the item has nothing to reset.

## Menu keyboard and focus

| Key | Action |
| --- | --- |
| Down / Up | Next / previous item (wraps), skipping disabled items |
| Home / End | First / last item |
| A letter | The next item starting with that letter |
| Enter or Space | Run the focused item |
| Escape | Close the menu; focus goes back to where you opened it |
| Tab | Close the menu; focus goes back to where you opened it |

Clicking outside the menu closes it. A menu opened with the mouse also takes focus, so you can continue with the arrow keys.

After an action, focus follows what the action selected: the new or moved item in the tree, or the canvas. After Delete on the canvas, focus stays on the canvas.

Escape in a menu never closes the Studio or Home Assistant's card dialog.
