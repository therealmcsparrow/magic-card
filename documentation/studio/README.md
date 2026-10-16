# Studio

The Studio is a full-screen editor for a Magic Card. It shows the card's layers on the left, the live card on a canvas in the middle and the inspector on the right. You select things by clicking them on the card itself.

The Studio edits the same config as the [pane editor](../editor/README.md), with the same selection and undo history. Nothing is saved to the dashboard until you press Save in Home Assistant's card dialog.

## Open and close

-   Open: press Open studio in the pane editor (Form mode).
-   Close: Back to dialog or Done in the top bar, or Escape. Both buttons only close the Studio; your changes are already in the editor either way.

When the Studio closes, focus returns to the Open studio button. The Studio keeps its device width between openings while the card dialog stays open.

## Pages

-   [Layout and top bar](layout-and-toolbar.md): the top bar, Layers, canvas, inspector, narrow screens and YAML mode.
-   [Device widths](device-widths.md): Phone, Tablet and Desktop.
-   [Canvas and selection](canvas-and-selection.md): clicking (also the columns of Row modules), hovering, selection colours and how the live card behaves on the canvas.
-   [Floating bar](floating-bar.md): the module toolbar next to the selection.
-   [Column resize](column-resize.md): dragging column widths of rows and Row modules on the canvas, with the mouse or the keyboard.
-   [Flows on the canvas](flows-on-canvas.md): adding and selecting flow lines.
-   [Keyboard shortcuts](keyboard-shortcuts.md): every shortcut, Escape and focus.

Related: [Inspector](../inspector/README.md), [Design](../design/README.md), [Modules](../modules/README.md), [Flows](../flows/README.md).
