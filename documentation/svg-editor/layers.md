# Layers

The layers list shows every shape in the icon. The top layer is the one drawn on top, so it is at the top of the list. The bottom layer is at the bottom.

## Actions on a layer

-   Rename a layer.
-   Hide a layer, so it is left out of the preview and of the saved icon.
-   Lock a layer, so it cannot be moved or changed until you unlock it.
-   Duplicate a layer.
-   Move a layer up or down.


The buttons under the list (Add group, Duplicate, Delete, Select all, Move to, Move up, Move down) are small icon buttons that stay on one line, also in a narrow panel. Each is at least 24 by 24 pixels.

## Groups

Select several shapes and choose Group to put them in a group. Groups can contain other groups, up to four levels deep. When a group is already four levels deep, Group inside it is unavailable, and the menu says why.

You can rename, hide, lock, collapse and ungroup a group at any level. Collapse a group to hide its rows in the list. Collapsing does not change the drawing.

## Reorder with drag and drop

-   Drag a row to a new place in the list to change the paint order.
-   Drop a row on a group to move it inside that group.
-   On an iPad or other touch screen, drag by the grip at the left of the row. The list scrolls when you drag near its edge, and the place where the layer will go is marked. A long press opens the row's menu. It does not start a drag.

One Ctrl+Z puts a dragged layer back where it was.

## Keyboard and screen readers

Every drag can also be done from the keyboard. Each row has a menu with these actions:

-   Move up and Move down.
-   Move into the group above.
-   Move out of its group.

The list works as a tree for screen readers, with each row's level and open or closed state. When a layer moves, the new position is announced, for example "X moved into C, position 1 of 3".

## Dual-tone (Accent) {#dual-tone-accent}

Turn on Dual-tone for an icon that uses two colours. The switch names the two colours in the editor as Main and Accent. Each shape is set to Main or Accent, and its row shows the tone as text.

When you save the icon, the editor writes two outlines:

-   `path` holds the Main shapes.
-   `secondary_path` holds the Accent shapes.

On a card, Magic Card paints the Accent shapes in the card's accent colour. In Home Assistant's own cards, a saved icon is a one-colour silhouette, and the Accent shapes show at half opacity. See [Magic Card Utils](../magic-card-utils/README.md#saved-icons-in-home-assistant-cards).

The preview under the editor shows both versions side by side, so you can check them before you save.
