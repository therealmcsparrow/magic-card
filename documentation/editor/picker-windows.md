# Picker windows

Several editor fields open a picker in its own window: entity, attribute, icon, colour, font, media, service, card, and the Create template and Load template windows. The Add module picker is a simpler window of the same kind.

-   [Opening and closing](#opening-and-closing)
-   [Icon picker tabs](#icon-picker-tabs)
-   [Moving and resizing](#moving-and-resizing)
-   [In the Studio](#in-the-studio)

## Opening and closing

A picker window opens on top of the editor. Close it with:

-   The close button in its header.
-   Escape. Escape closes only the picker. It never closes the Studio or Home Assistant's card dialog behind it.
-   A click outside the window. A press that starts inside the window and ends outside (for example while selecting text or dragging a slider) does not close it.

## Icon picker tabs

The icon picker of the Icon, Info, Button and Light modules has two tabs, Icons and Animated icons. Animated icons shows moving tiles of your saved icon animations and the built-in ones. See [Animated icons in the icon picker](../animation-studio/using-in-cards.md#animated-icons-in-the-icon-picker).

## Moving and resizing

The pickers with a Maximize button in the header (all of them except Add module) can be moved and resized:

| Action | How |
| --- | --- |
| Move | Drag the header. Buttons in the header do not start a drag. Works with a mouse or one finger. |
| Resize | Drag the handle in the bottom-right corner. The window keeps at least 320 × 240 px. |
| Maximize | The Maximize button fills the screen, leaving a 16 px margin. Restore size returns to the previous size and position. |

A drag that ends outside the window does not close it. The position and size reset the next time the picker opens.

## In the Studio

Pickers opened from the Studio open above it. Escape inside a picker closes the picker and leaves the Studio open. See [Studio keyboard shortcuts](../studio/keyboard-shortcuts.md#escape).
