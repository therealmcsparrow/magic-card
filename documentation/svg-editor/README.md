# SVG editor

The SVG editor draws and edits icons on a 24 x 24 grid. Use it to change an icon from a set, or to draw your own. A saved icon can be recoloured and animated by Magic Card, and a card uses it as `icon: mcu:<id>`.

The editor is part of the Magic Card Utils integration and comes with Magic Card 2026.10.11-beta.1. It needs Magic Card 2026.10.11-beta.1 or newer. If your Magic Card is older, the panel says which version you need and nothing else loads.

This is a pre-release. HACS shows it only when you turn on Show beta versions.

## Open the editor

1.  Open Magic Card Utils in the sidebar and go to the Library tab.
2.  Choose New icon, then pick a starting point: Blank, an icon that Home Assistant knows (Material Design Icons and any installed icon pack), or an SVG that you paste or upload. For an icon, the same icon picker as in the card editor opens: search, choose an icon, then choose Use this icon.

The start window has one row of tiles: Blank, An icon, Paste SVG, Open file and (when the library answers) My icons. The image editor uses the same window and the same top bar, with Blank canvas in place of Blank and An icon. In both, the window has no footer: Close or Esc closes it, and Tab and Shift+Tab stay inside it.

The editor opens full-screen in the panel. To change a saved icon, choose Edit on it in the library. Your changes are saved only when you choose Save.

No card or entity is needed. You can make an icon before you add it to any dashboard.

## Notices

Warnings (for example an icon that reaches outside the safe area), import messages and the result of an action, such as Undo, float over the edge of the canvas. They never change the size of the canvas, so the drawing does not move when one appears. Use the Dismiss button where there is one.

## Pages

-   [Drawing and arranging](drawing-and-arranging.md): the tools, the grid and snapping, the numeric fields, alignment and boolean operations, handles, the right-click menu and the keyboard.
-   [Layers](layers.md): groups, drag and drop, the keyboard moves, and the dual-tone Accent setting.
-   [Path tools](path-tools.md): outline stroke, offset, simplify, join, split and knife.
-   [Import and export](import-and-export.md): importing SVG files, icon sets, copying as a Home Assistant path, saving to the library and using an icon in a card.

## Side panels

Above 900 px wide, the Layers and Library panel sits on the left of the canvas and the inspector on the right. Each has an edge button on its inner side. Press it to hide the panel, so the canvas takes its width; press it again to show the panel as it was, with the same selection. Ctrl+\ (Cmd+\ on a Mac) hides both panels when either is shown, and shows again the panels it hid last. On keyboard layouts that type \ with AltGr, such as German and Dutch, the shortcut types the character instead, so use the edge buttons. The editor remembers hidden panels on this device.

Between 641 and 900 px the inspector keeps its edge button, and the Layers and Library panel opens as a sheet from the toolbar with no edge button. At 640 px and below, the panels stack under the canvas and have no edge buttons. The tool rail and the top bar stay as they are at every width.

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
