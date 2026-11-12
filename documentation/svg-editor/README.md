# SVG editor

The SVG editor draws and edits icons on a 24 x 24 grid. Use it to change an icon from a set, or to draw your own. A saved icon can be recoloured and animated by Magic Card, and a card uses it as `icon: mcu:<id>`.

The editor is part of the Magic Card Utils integration and comes with Magic Card 2026.10.11-beta.1. It needs Magic Card 2026.10.11-beta.1 or newer. If your Magic Card is older, the panel says which version you need and nothing else loads.

## Open the editor

1.  Open Magic Card Utils in the sidebar and go to the Library tab.
2.  Choose New icon, then pick a starting point: Blank, an icon that Home Assistant knows (Material Design Icons and any installed icon pack), or an SVG that you paste or upload. For an icon, the same icon picker as in the card editor opens: search, choose an icon, then choose Use this icon.

The start window has one row of tiles: Blank, An icon, Paste SVG, Open file and (when the library answers) My icons. The image editor uses the same window and the same top bar, with Blank canvas in place of Blank and An icon. In both, the window has no footer: Close or Esc closes it, and Tab and Shift+Tab stay inside it.

The editor opens full-screen in the panel. It has the same look as the other studios: a thin top bar, rulers along the canvas, a tool rail on the left and a panel on the right. To change a saved icon, choose Edit on it in the library. Your changes are saved only when you choose Save.

No card or entity is needed. You can make an icon before you add it to any dashboard.

## Notices

Warnings (for example an icon that reaches outside the safe area), import messages and the result of an action, such as Undo, float over the edge of the canvas. They never change the size of the canvas, so the drawing does not move when one appears. Use the Dismiss button where there is one.

## Pages

-   [Drawing and arranging](drawing-and-arranging.md): the tools, the grid and snapping, the numeric fields, alignment and boolean operations, handles, the right-click menu and the keyboard.
-   [Layers](layers.md): groups, drag and drop, the keyboard moves, and the dual-tone Accent setting.
-   [Path tools](path-tools.md): outline stroke, offset, simplify, join, split and knife.
-   [Import and export](import-and-export.md): importing SVG files, icon sets, copying as a Home Assistant path, saving to the library and using an icon in a card.

## Side panels

The icon editor has one panel on the right with three tabs: Inspector, Layers and Library. The image editor has the same panel with Inspector and Layers. The panel is open when the editor opens and stays open while you work. There are no edge buttons and no pin. The panel button in the top bar hides and shows it, so the canvas takes its width; press it again to show the panel as it was, with the same tab and selection. Ctrl+\ (Cmd+\ on a Mac) does the same. On keyboard layouts that type \ with AltGr, such as German and Dutch, the shortcut types the character instead, so use the button. A hidden panel is not remembered; the next time you open the editor it is showing.

On narrow screens the panel opens over the canvas. The tool rail and the top bar stay as they are at every width.

## Top bar

Every studio in Magic Card Utils puts its top bar in the same order: Close, the studio's name, the name field, the actions, Save, the panel button and Help. In the icon editor the actions are Start from…, Undo, Redo, the size meter and Export / Import. When the bar is too narrow, the studio's name is read by screen readers only, and secondary buttons keep their icon and lose their word.

## Limits

-   The markup of an icon is at most 32 KB. Save is blocked above that, with a message that shows the size.
-   The editor draws shapes, paths and groups. It does not draw text, `<use>`, `<image>`, filters, `<style>` blocks, CSS or animation. Those are removed from imported files.
-   There is one artboard. The editor exports single icons, not PNG or PDF files.
-   Every import and every save goes through the same clean-up as card icons. See [Import and export](import-and-export.md).

## Related

-   [Shape editor](../shape-editor/README.md): the outline of a card, module or row.
-   [Presets and sharing](../presets/README.md): saving icons and shapes, and sharing them as files.
-   [Icon effects](../icon-effects/README.md): colours, fill and motion for an icon in a card.
-   [Magic Card Utils](../magic-card-utils/README.md): the library and the tabs that hold the editors.
