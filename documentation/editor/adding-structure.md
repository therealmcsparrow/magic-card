# Adding rows, columns and modules

-   [Rows](#rows)
-   [Columns](#columns)
-   [Modules](#modules)
-   [Layout modules](#layout-modules)
-   [The Add module picker](#the-add-module-picker)

## Rows

Add row sits under the outline (or in the empty state "No rows yet"). It adds a row with one empty column and layout `1` at the bottom of the card.

On a card linked to a template, Add row first asks "Update linked cards?":

| Button | Result |
| --- | --- |
| Only this card | Adds the row to this card only. |
| Update all linked cards | Adds the row, then saves the whole card to the template (as Save to template does). |

Escape or a click outside the dialog cancels: no row is added. See [Templates](templates.md).

To change the number of columns through a layout preset, or to set the column widths, use the row's General tab in the inspector. See [Inspector](../inspector/README.md). In the Studio you can also drag the column widths on the canvas. See [Column resize](../studio/column-resize.md).

## Columns

Two places add a column to a row:

-   Add column in the row's three-dot menu.
-   The Add column button under the last column of an expanded row, in the pane outline and in the Studio's Layers. This button also selects the new column.

The new column is empty and goes at the end. What happens to the widths depends on the row:

| Row | After Add column |
| --- | --- |
| Uses a layout preset | The layout is reset to equal widths (`1-1`, `1-1-1`, ...). |
| Has its own column widths (`column_widths`) | The existing widths stay and the new column gets `1fr`. |

Deleting a column from a row with its own widths removes that column's width and keeps the others. When only one column is left, the widths are removed.

## Modules

Three places open the Add module picker for a column:

-   The Add module button in an empty column.
-   Add module in the column's three-dot menu.
-   In the Studio's Layers: the Add module row under the last module of each column.

The new module goes at the end of the column, with its default settings, and is selected so the inspector shows it.

## Layout modules

Children of layout modules are added in the outline, the same way in the pane and in Layers. The layout module's General tab has no child list.

| To add | Use |
| --- | --- |
| A child of a Horizontal, Vertical or Slider layout module | The Add module row under its last child (also shown when it is empty), or Add module in the module's three-dot menu |
| A module in a tab | The Add module row under the tab's last child, or Add module in the tab's three-dot menu |
| A module in a row-module column | The Add module row under the column's last child, or Add module in the column's three-dot menu |
| A tab | The Add tab row under the last tab, or Add tab in the Tabs module's three-dot menu |
| A column of a Row module | The Add column row under the last column, or Add column in the Row module's three-dot menu |

Each Add module opens the [Add module picker](#the-add-module-picker) for that place. The new module goes at the end and is selected.

A new tab is called "Tab N" (its position) and is empty. A new row-module column is empty and goes at the end. Its widths change as for a card row: a module with a layout preset gets equal widths, and a module with its own `column_widths` keeps them and gives the new column `1fr`. The new tab or column is selected.

The last tab of a Tabs module and the last column of a Row module cannot be deleted. See [Structure outline](structure-outline.md#three-dot-menus) for renaming, moving and deleting tabs and columns.

The layout modules are described in [Layout modules](../modules/layout/README.md).

## The Add module picker

The picker is a window titled "Add module". The search field has focus when it opens.

-   Search modules: matches the module's name, description and type.
-   Category: All, Content, Controls, Layout, Advanced. With All, the list is grouped under category headings.
-   Each entry shows the module's icon, name and a short description. Click it to add the module.
-   When nothing matches: "No modules match "…"." or "No modules in this category."

Close it with the close button, Escape, or a click outside the window. Each of these closes only the picker, also inside the Studio.

The module types are described in [Modules](../modules/README.md).
