# Pane editor

The pane editor is the Magic Card editor inside Home Assistant's card dialog. It shows the card's structure, an inspector for the selected item, and the template bar. For a larger, visual workspace, open the [Studio](../studio/README.md). Both edit the same config.

A new card starts with one row, one column and a Text module ("Welcome to Magic Card").

## Parts of the pane

From top to bottom:

| Part | What it does |
| --- | --- |
| Head | The Form / YAML switch and the Undo and Redo buttons. It stays at the top while you scroll. |
| Template bar | Shows whether the card is linked to a template and holds the template actions. |
| Studio panel | The card name (or "Untitled card"), a small layout thumbnail, the row and module count, and the Open studio button. Form mode only. |
| Structure | The outline of the card: card, rows, columns, modules and the children of layout modules, with the tabs of Tabs modules and the columns of Row modules as items of their own. Layout modules are filled from here. A Card settings button beside the heading selects the card. Form mode only. |
| Inspector | The settings of the selected item, in tabs. Form mode only. See [Inspector](../inspector/README.md). |

In YAML mode only the head, the template bar and the YAML editor are shown.

The thumbnail in the studio panel draws each row with its column widths and one bar per module. The selected top-level module is drawn in the accent colour.

## The editor file

The editor is its own file, `magic-card-editor.js`, next to `magic-card.js`. Dashboards never load it. It loads the first time you open a card editor, and the animation studio asks for it too, so both find the editor parts they need.

If the file is missing or cannot be loaded, Home Assistant falls back to its YAML editor for the card, and the browser console says why. After an update, hard refresh the page. When the editor file and `magic-card.js` come from different versions, the console asks you to reload.

## Pages

-   [Form and YAML](form-and-yaml.md): the two editing modes and how YAML edits are applied.
-   [Structure outline](structure-outline.md): items, layout modules with their tabs and columns, selection, item menus, keyboard and drag and drop.
-   [Item menus](item-menus.md): the menu of every item (right-click, long-press, Shift+F10, three-dot button): copy YAML, copy and paste modules, wrap in a layout, hide on the dashboard, rename, reset to template.
-   [Adding rows, columns and modules](adding-structure.md): the add buttons, children, tabs and columns of layout modules, and the Add module picker.
-   [Undo and redo](undo-redo.md): what is recorded and how long the history lasts.
-   [Templates](templates.md): create, load, overrides, template animations, re-sync, save and unlink.
-   [Copy and paste design](copy-paste-design.md): moving a design between rows, columns and modules.
-   [Picker windows](picker-windows.md): moving, resizing and closing the editor's picker windows.

## Pane editor and Studio

The pane editor and the Studio share one editor state:

-   The same config, selection, editor mode (Form or YAML) and undo history.
-   Selecting an item in one selects it in the other.
-   Closing the Studio returns focus to the Open studio button in the pane.

Changes go to Home Assistant's card dialog shortly after each edit (after a 200 ms pause). They are saved to the dashboard only when you press Save in Home Assistant's dialog.

Related: [Inspector](../inspector/README.md), [Modules](../modules/README.md), [Design](../design/README.md), [Flows](../flows/README.md), [YAML](../yaml/README.md).
