# Inspector

The inspector is the settings panel for whatever is selected: the card, a row, a column, a module, or a tab or column inside a layout module. It is the same panel in the pane editor and in the studio. In the pane editor it sits under the outline; in the studio it is the panel on the right. See [the editor](../editor/README.md) and [the studio](../studio/README.md) for how to select things.

## Pages

-   [Card: General tab](card-general.md): name, theme and pop-up settings
-   [Card: Design tab](card-design.md): background, corner radius, height, padding, shadow, animations, template animations of a linked card, ring, shape, value background, seasonal scene, hover and custom CSS
-   [Row: General tab](row-general.md): column layout, column widths, gap, alignment and padding
-   [Column: General tab](column-general.md): width, alignment, gap and padding
-   [Module: General tab](module-general.md): module options, and where the children of layout modules are edited
-   [Tabs and row-module columns](tabs-and-nested-columns.md): a tab's label and icon, and a Row module column's General, Conditions and Design tabs
-   [Actions tab](actions-tab.md): tap, hold and double tap on modules and rows
-   [Conditions tab](conditions-tab.md): display conditions, and conditional appearance on the card

The YAML keys behind these fields are described in [Card configuration](../card/README.md).

## Contents

-   [Header](#header)
-   [Tabs per selection](#tabs-per-selection)
-   [Design and Flows tabs](#design-and-flows-tabs)
-   [Template-linked cards](#template-linked-cards)

## Header

The top of the inspector shows what is selected:

| Selection | Title | Line under the title |
| --- | --- | --- |
| Card | `Card · <name>` (`Card · Card` without a name) | Number of rows and modules |
| Row | `Row N` | Number of columns and the layout, for example `layout 1-1`, or `custom widths` when the row has column widths |
| Column | `Column N` | `Row N` and the number of modules |
| Module | Module name, plus its label when it has one | `Row N · Column N`, the layout modules it sits in, the tab or column of its parent, and its entity |
| Tab | The tab's label (`Tab N` without one) | `Row N · Column N` and the layout modules down to its Tabs module |
| Row-module column | `Column N` | `Row N · Column N` and the layout modules down to its Row module |

The `Row N`, `Column N`, parent layout and tab or column parts of the path are buttons. Click one to select that item.

An item with a layer name shows that name as its title. An item hidden on the dashboard adds "Hidden on dashboard" to the line under the title. See [Item menus](../editor/item-menus.md#rename).

In the Studio, the header and the tab bar stay at the top of the inspector and only the settings below them scroll. Switching tabs or selecting another item starts the settings at the top. On a screen 640 px wide or less, where the whole workspace scrolls, the header sticks to the top of the screen while you scroll through the inspector. On a screen 480 px high or less nothing is pinned. In the pane editor the inspector scrolls with the rest of the card dialog.

## Tabs per selection

| Selection | Tabs |
| --- | --- |
| Card | General, Design, Conditions, Flows |
| Row | General, Actions, Conditions, Design |
| Column | General, Conditions, Design |
| Module | General, Actions, Conditions, Design |
| Tab | General |
| Row-module column | General, Conditions, Design |

Clock, custom card, video background and separator modules have no Actions tab. A module type the card does not know shows only an "Unknown module type" message.

The inspector remembers the last tab per kind of selection. Select another module and the inspector stays on the tab you used for modules. With the keyboard, focus a tab and use the Left and Right arrows, Home and End.

## Design and Flows tabs

-   The Design tab of a row, column or module opens the design panel, with its sections grouped under Layout, Style, Effects and Advanced: spacing, layout, typography, backgrounds, borders, shape, value background, ring, transitions and animations, custom CSS, plus hover and conditional design. See [Design](../design/README.md). Icon effects are in [Icon effects](../icon-effects/README.md).
-   The card's Design tab is a shorter list of card-level fields. See [Card: Design tab](card-design.md).
-   The card's Flows tab lists the animated flow lines between modules. Selecting a flow on the studio canvas opens this tab with that flow expanded. See [Flows](../flows/README.md).

## Template-linked cards

When the card is linked to a template, fields show a sync indicator. Changing a field makes it a local override; the indicator lets you go back to the template value. Row and column design edits make the whole `design` of that row or column an override, and editing a row's actions makes its whole `actions` an override. A row's column widths have their own sync indicator, on the row's Column widths field and on each column's Width field. On the card, the shape and its options sync as one field. For layout modules, the list of child modules is synced as one list: the inspector shows whether it follows the template and offers Reset to template when it does not. Tabs and row-module columns are part of that list. The card's Design tab lists the template's animations, which you can hide or replace on this card (see [Template animations](card-design.md#template-animations)). See [Templates](../editor/templates.md) for the rest.
