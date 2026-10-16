# Layout modules

Layout modules hold other modules. They nest: a horizontal layout can hold a vertical one, a tab can hold a row, and so on. The separator is listed here too, though it holds nothing.

| Module | `type` | Children are in |
| --- | --- | --- |
| [Horizontal](horizontal.md) | `horizontal` | `modules` |
| [Vertical](vertical.md) | `vertical` | `modules` |
| [Row](row.md) | `row` | `columns[].modules` |
| [Tabs](tabs.md) | `tabs` | `tabs[].modules` |
| [Separator](separator.md) | `separator` | none |
| [Slider layout](slider-layout.md) | `slider-layout` | `modules` (one per slide) |

## Children

A child is a full module with all the [shared keys](../README.md#shared-keys): its own design, actions and display conditions. A child hidden by its display conditions takes no space (and, in a slider layout, gets no slide).

When a child and its layout both have actions, a tap goes to the child.

## Editing children

Children are managed in the [structure outline](../../editor/structure-outline.md#layout-modules-in-the-tree), in the pane editor and in the studio's Layers. The General tab of a layout module holds only its own settings.

| Module | In the tree |
| --- | --- |
| Horizontal, Vertical, Slider layout | The children nested under the module, then an Add module row |
| Tabs | One item per tab with its children and an Add module row, then an Add tab row |
| Row | One item per column with its children and an Add module row, then an Add column row |

-   Click a child to select it. The inspector then shows its tabs, the same as for any module.
-   Move a child with Alt+Up and Alt+Down, or with Move to… in its three-dot menu (to another tab or column of the same layout module). Delete it from its three-dot menu or with Delete.
-   Tabs can be renamed, reordered and deleted in the tree. A row module's columns can be added and deleted there, and each one has its own General, Conditions and Design tabs. See [Tabs and row-module columns](../../inspector/tabs-and-nested-columns.md).

Details are in [Adding rows, columns and modules](../../editor/adding-structure.md#layout-modules).

The [studio](../../studio/README.md) shows children on its canvas, where you can select them directly. A row module's columns can be selected and resized there too. An empty layout, tab or column shows a placeholder ("Empty row", "Empty column", "Empty tab", "Empty slider", "Empty") while you edit. On the dashboard it shows nothing.

## Video background in a layout

A [video background](../advanced/video-bg.md) next to other children of a column, row column, tab, horizontal or vertical layout, or slide plays behind them and fills that container.

The shared keys (`type`, `id`, `entity`, `design`, `actions`, `display`) are described in [Modules](../README.md#shared-keys).
