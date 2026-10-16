# Tabs and row-module columns

A tab of a Tabs module and a column of a Row module are items of their own in the [structure outline](../editor/structure-outline.md#layout-modules-in-the-tree). Select one there, or click a row-module column on the Studio canvas, and the inspector shows its settings. Back to the [inspector overview](README.md).

-   [Header](#header)
-   [Tab: General](#tab-general)
-   [Row-module column: General](#row-module-column-general)
-   [Row-module column: Conditions and Design](#row-module-column-conditions-and-design)
-   [Template-linked cards](#template-linked-cards)

## Header

| Selection | Title | Line under the title |
| --- | --- | --- |
| Tab | The tab's label, or `Tab N` without one, with the tab's icon | `Row N · Column N`, then the layout modules down to the Tabs module that holds the tab |
| Row-module column | `Column N` | `Row N · Column N`, then the layout modules down to the Row module that holds the column |

Every part of the path is a button that selects that item. When a module inside a tab or row-module column is selected, its header path also has the tab or column as a button.

## Tab: General

A tab has only a General tab. Tabs have no actions, display conditions or design of their own.

| UI label | YAML key | What it does |
| --- | --- | --- |
| Label | `tabs[].label` | The text on the tab button. |
| Icon | `tabs[].icon` | An icon before the label. Clear the field to remove it. |

You can also rename a tab in the tree: Rename in its three-dot menu, F2, or a double-click. The order of the tabs, and adding and deleting tabs, are in the tree too. The Tabs module's own settings (Tab style, Default tab, icon effects) stay in the module's General tab. See [Tabs](../modules/layout/tabs.md).

## Row-module column: General

The same fields as a [card column](column-general.md):

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Width | `column_widths` on the Row module | A number with `fr`, `%` or `px`, or `auto` (Custom) | The module's layout | This column's entry in the module's column widths. Shown when the module has more than one column. |
| Vertical alignment | `vertical_align` | Top (`start`), Center (`center`), Bottom (`end`), Stretch (`stretch`) | Top | Where the modules sit in the column when the column is taller than its content. |
| Gap | `gap` | CSS length | `8px` | Space between the modules in the column. |
| Padding | `padding` | One to four CSS lengths | none | Space inside the column around its modules. |

Width edits the same list as the Column widths field in the Row module's General tab: changing it writes the widths of all its columns. The reset button sets this column back to `1fr`.

## Row-module column: Conditions and Design

-   Conditions: display conditions for the column, stored as `display` on the column. A hidden column takes no space on the dashboard. In the Studio it is drawn faded, like any hidden item. See [Conditions tab](conditions-tab.md).
-   Design: the full design panel of a column, stored as `design` on the column. See [Design](../design/README.md).

A row-module column has no Actions tab. Its three-dot menu in the tree has Copy design, Paste design and Merge pasted design.

## Template-linked cards

A tab and a row-module column belong to their layout module's child list. On a card linked to a template, any change to them overrides that child list (`tabs` or `columns`) as a whole. On a top-level Row module, a column's Width field has a sync indicator for the module's `column_widths`. See [Templates](../editor/templates.md#overrides).
