# Layers

The Layers column of the [animation studio](README.md) lists the parts of an animation in the order they are drawn. Use it to find a part, select it, and check what is on top.

## Hide, solo and lock

Each row has three controls:

-   **Hide in preview** leaves the part out of the preview, so you can see the others.
-   **Solo in preview** hides every other part in the preview.
-   **Lock** stops the part from being changed. Unlock it to edit it again.

Hide, solo and lock only change the preview. They are not saved, and the animation plays with every part as it was before. Reopen the animation and everything is visible again.

## Keyframe animations

The rows are listed in the order they are drawn, top first:

1.  Shapes drawn over the icon.
2.  Icon parts.
3.  Shapes drawn under the icon.
4.  Card parts (the name, state, icon and background of the module).

Changing the order of the list does not change the animation. The saved file and the compiled CSS stay the same.

## Particle animations

A particles animation has a list of layers too:

-   **Particles** is the emitter. It sits above Card content when it is drawn in front of the card, and below it when it is drawn behind.
-   **Child particles** appears under Particles when child particles are on. It has its own shape rows.
-   **Card content** is a fixed row for the card's text, icons and background. You cannot move it.

To move particles in front of the card or behind it, select Particles and press Alt+Up or Alt+Down, or choose Move up or Move down. The preview updates at once, and one Ctrl+Z puts it back.

Selecting a row opens the matching section of the particle editor and scrolls to it. The selected row is marked as pressed for screen readers.

## Several emitters

A particles animation can have more than one emitter. Each emitter is a row, and its shapes are listed under it. Each emitter can be drawn in front of the card or behind it.

## Narrow screens

Below 1000 pixels wide, the Layers column shows one button per row. Each button has the layer's name as its accessible name. Pressing it does the same as a click on the row.

## Keyboard

-   Tab moves between rows and buttons, and Up and Down move between rows.
-   Home and End jump to the first and the last row.
-   Enter or Space selects a row.
-   The focused row has a visible outline.
