# Structure outline

The structure outline shows the card as a tree: the card, its rows, the columns in each row, the modules in each column, and the children of layout modules, including the tabs of a Tabs module and the columns of a Row module. It appears in the pane editor under Structure, and in the Studio as Layers. Both work the same way; the differences are listed at the end.

-   [Items](#items)
-   [Layout modules in the tree](#layout-modules-in-the-tree)
-   [Selecting](#selecting)
-   [Three-dot menus](#three-dot-menus)
-   [Keyboard](#keyboard)
-   [Drag and drop](#drag-and-drop)
-   [Pane and Layers differences](#pane-and-layers-differences)

## Items

| Item | Shows |
| --- | --- |
| Card | The card name, or "Card" when it has none. |
| Row | "Row 1 · 1-1" (number and layout) with a small glyph of the column widths. A row with its own column widths shows "Row 1 · custom", and the glyph follows those widths. A caret on the left collapses or expands the row. |
| Column | "Column 1" and the number of modules in it. An empty column shows "Empty column" with an Add module button. |
| Add column | A button under the last column of an expanded row. It adds an empty column at the end and selects it. See [Adding rows, columns and modules](adding-structure.md#columns). |
| Module | "Type · label", for example "Button · Toggle", with the entity id under it when the module has one. |
| Layout child | A module inside a layout module, nested under it. See [Layout modules in the tree](#layout-modules-in-the-tree). |
| Tab | One item per tab of a Tabs module: the tab's icon and label, and the number of modules in it. |
| Row-module column | One item per column of a Row module: "Column 1", a glyph of the module's column widths with this column's bar marked, and the number of modules in it. |

A module with local template overrides has a small dot with the tooltip "Has local overrides". See [Templates](templates.md).

When there are no rows, the outline shows "No rows yet" and an Add row button.

## Layout modules in the tree

Horizontal, Vertical, Slider layout, Tabs and Row modules hold other modules. The tree is the only place where you add, select and arrange those children. Their General tab in the inspector holds only the module's own settings.

| Layout module | In the tree |
| --- | --- |
| Horizontal, Vertical, Slider layout | The children are nested under the module, in order. An Add module row follows the last child, and it is there when the module is empty too. |
| Tabs | One tab item per tab, in tab order. Each tab holds its children and an Add module row. An Add tab row follows the last tab. |
| Row | One column item per column. Each column holds its children and an Add module row. An Add column row follows the last column. |

A tab without a label is shown as "Tab 2" (its position). A tab without an icon shows a plain tab icon.

Children nest to any depth: a tab can hold a row module whose columns hold a horizontal layout, and so on. Each level is indented under its parent.

Adding children, tabs and columns is described in [Adding rows, columns and modules](adding-structure.md#layout-modules).

## Selecting

Click an item to select it. The inspector then shows that item's settings. The selection is shared with the Studio canvas.

-   A tab shows its General tab (label and icon) in the inspector.
-   A row-module column shows General, Conditions and Design, like a card column.

See [Tabs and row-module columns](../inspector/tabs-and-nested-columns.md).

When something else selects an item (the Studio canvas, a breadcrumb in the inspector, undo), the outline expands a collapsed row that holds it and scrolls the item into view.

## Three-dot menus

Rows, columns, modules (including layout children), tabs and row-module columns have a three-dot button. Its menu:

### Row

| Item | Action |
| --- | --- |
| Add column | Adds an empty column at the end. A row with a layout preset gets equal widths; a row with its own column widths keeps them and the new column gets `1fr`. The new column is not selected. |
| Duplicate row | Inserts a copy below, with new ids for the row, its columns and modules. The copy is selected. |
| Copy design | Copies the row's design. |
| Paste design | Replaces the row's design with the copied one. Disabled until a design is copied. |
| Merge pasted design | Merges the copied design into the row's design. Disabled until a design is copied. |
| Move up | Moves the row up. Disabled on the first row. |
| Move down | Moves the row down. Disabled on the last row. |
| Delete row | Removes the row and everything in it. There is no confirmation; use undo. |

### Column

| Item | Action |
| --- | --- |
| Add module | Opens the Add module picker for this column. |
| Copy design, Paste design, Merge pasted design | As for rows. |
| Delete column | Removes the column and its modules. A row with a layout preset gets equal widths; a row with its own column widths loses that column's width (all widths go when one column is left). Disabled when it is the row's only column. |

### Module

| Item | Action |
| --- | --- |
| Edit | Selects the module and moves focus to the inspector. In the Studio on a narrow screen it also closes the Layers overlay. |
| Add module | Horizontal, Vertical and Slider layout modules. Opens the Add module picker; the new module goes at the end of the layout. |
| Add tab | Tabs modules. Adds a tab at the end and selects it. |
| Add column | Row modules. Adds an empty column at the end and selects it. |
| Move up | Moves the module up within its column (or within its tab or column of a layout module). Disabled on the first. |
| Move down | Moves it down. Disabled on the last. |
| Move to… | Opens a second list in the same menu. For a top-level module: every other column of the card ("Row 2 · Column 1"). For a layout child: the other tabs or columns of its layout module. The module goes to the end of the target. Back returns to the main list. Disabled when there is no other target. |
| Duplicate | Inserts a copy below, with new ids (nested children included). The copy is selected. |
| Copy design, Paste design, Merge pasted design | As for rows. |
| Delete | Removes the module. There is no confirmation; use undo. |

### Tab

| Item | Action |
| --- | --- |
| Add module | Opens the Add module picker for this tab. |
| Rename | Turns the tab's label into a text field in the tree. Enter, or moving focus away, keeps the new label. Escape drops it. |
| Move up | Moves the tab one place towards the start of the tab bar. Disabled on the first tab. |
| Move down | Moves the tab one place towards the end. Disabled on the last tab. |
| Delete tab | Removes the tab and its modules. A tab that holds modules asks first, in the same menu: "Delete tab "Lights" and its 2 modules?", with Cancel and Delete tab. An empty tab is deleted straight away. Disabled on the only tab, with the tooltip "A tabs module needs one tab". |

Moving a tab keeps the default tab (`active_tab`) on the same tab. After a delete, the neighbouring tab is selected.

### Row-module column

| Item | Action |
| --- | --- |
| Add module | Opens the Add module picker for this column. |
| Copy design, Paste design, Merge pasted design | As for rows, on the column's own design. |
| Move up | Moves the column one place to the left. Disabled on the first column. |
| Move down | Moves the column one place to the right. Disabled on the last column. |
| Delete column | Removes the column and its modules. A column that holds modules asks first, in the same menu, as a tab does. Disabled on the only column, with the tooltip "A row needs one column". |

A moved column takes its width, design and modules with it. Its entry in `column_widths` moves along, or, without column widths, its part of the layout (`2-1` becomes `1-2`). The moved column stays selected.

Deleting a row, column, module, tab or row-module column also removes the flow lines that pointed at the modules that were removed, in the same undo step. See [Flows](../flows/README.md).

Paste and merge are explained in [Copy and paste design](copy-paste-design.md).

### Menu keyboard

| Key | Action |
| --- | --- |
| Down / Up | Next / previous item (wraps) |
| Home / End | First / last item |
| Enter or Space | Run the focused item |
| Escape | Close the menu and return focus to the three-dot button |
| Tab | Close the menu |

Clicking outside the menu closes it.

## Keyboard

The outline is a tree with one item in the tab order. Keys act on the focused item (not on the three-dot or caret buttons), and do nothing while focus is in a text field.

Arrow keys only move focus. Press Enter or Space to select the focused item.

| Key | On | Action |
| --- | --- | --- |
| Down / Up | any item | Focus the next / previous visible item |
| Home / End | any item | Focus the first / last visible item |
| Right | row | Expand a collapsed row; on an expanded row, focus its first column |
| Left | row | Collapse the row |
| Left | column, module, tab or row-module column | Focus the parent item. For a child of a Tabs or Row module, the parent is its tab or column. |
| Enter or Space | any item | Select it |
| Delete or Backspace | module | Delete the focused module |
| Delete or Backspace | tab or row-module column | Delete it when it is empty. When it holds modules, its menu opens on the delete question. On the only tab or column, its menu opens with Delete disabled and the reason in its tooltip. |
| F2 | tab | Rename the tab in the tree (double-click does the same) |
| Alt+Up / Alt+Down | module | Move the module up / down within its column, tab or layout |
| Alt+Up / Alt+Down | tab | Move the tab up / down in the tab order |
| Alt+Up / Alt+Down | row-module column | Move the column left / right, with its width, design and modules |
| Alt+Up / Alt+Down | row | Move the row up / down |
| Menu key, or Shift+F10 | row, column, module, tab or row-module column | Open its three-dot menu |

After a move, delete or duplicate, focus follows the module (or goes to a neighbour, or to its column or tab when that is empty).

## Drag and drop

-   Drag a row by its item to reorder rows. A line shows where it will land.
-   Drag a top-level module onto another module, a column item or an empty column. It can move to any column of the card. The moved module is selected.
-   Layout children, tabs and row-module columns cannot be dragged. Use Alt+Up / Alt+Down or Move to… instead.

## Pane and Layers differences

| | Pane | Layers (Studio) |
| --- | --- | --- |
| Row label | "Row 1 · 1-1" (or "Row 1 · custom"), glyph first | "Row 1", glyph after |
| Add module in card columns | Only in empty columns and in the column menu | Also an Add module row under the last module of every column |
| Add column | Under the last column of each expanded row, with a taller button | Under the last column of each expanded row |
| Nested items | Normal indentation; long names wrap | Less indentation per level. Names and entity ids of layout children stay on one line and end in an ellipsis when they are too long; the tooltip shows the full name and entity id. Tab and column names also end in an ellipsis, and their module count is hidden. |
| Item height | Taller | Compact |
| Header | "Structure" with a Card settings button | "Layers" with the module count |

Adding rows, columns and modules is covered in [Adding rows, columns and modules](adding-structure.md).
