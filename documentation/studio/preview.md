# Preview

Preview shows the card in the Studio as it runs on the dashboard. Taps, holds, sliders, tabs and animations act on the real entities, so you can check them without closing the Studio.

## Turn it on and off

-   Press Preview in the top bar. The button shows as pressed, and the notice "Preview: actions are live" appears beside it. Screen readers announce the notice once when Preview starts.
-   Press Preview again, or press Escape, to return to editing. Your selection, the editor mode (Form or YAML), the canvas width and the Layers panel come back as they were.
-   Preview works in Form mode and in YAML mode.

Preview does not save anything and does not change the card.

## What works

-   Tap, hold and double tap. Each action runs on the real entity: a service call, a toggle, a more-info dialog, and so on.
-   Sliders, switches and tabs change the entity or the tab for real, and the canvas shows the new state.
-   Animations play. The Studio's animation pause does not apply in Preview.
-   The canvas width buttons (Narrow, Wide and Panel) stay visible and change the device frame.
-   A more-info dialog opens inside the Studio, above it.

Clicking a module in Preview does not select it.

## What is off

-   **Navigate and URL actions.** A tap on a navigate or URL action does not leave the editor. The card shows "Navigation is off in Preview" instead, so unsaved changes stay put.
-   **Editing.** The Layers panel and the inspector are hidden. The Form and YAML switch, the template bar, Undo and Redo are disabled. Dragging, the float bar and the canvas shortcuts do not work. The undo history stays as it was when you left Preview.
-   **Pop-up cards.** A card that shows as a pop-up is drawn only when its pop-up opens, so it can look empty in Preview.

## Escape in Preview

Escape is handled by the innermost thing first:

1.  An open dialog, such as the more-info dialog, closes. Preview stays on.
2.  If no dialog is open, Escape leaves Preview. The Studio stays open, and focus goes to the Preview button.
3.  Once Preview is off, Escape works as in [Keyboard shortcuts](keyboard-shortcuts.md#escape).

Escape never closes the Studio while Preview is on.

## Related

-   [Layout and top bar](layout-and-toolbar.md): the top bar, including the Preview button.
-   [Keyboard shortcuts](keyboard-shortcuts.md): every shortcut and Escape.
