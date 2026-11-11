# The studio look

All seven studios share one layout: the Studio, the animation studio, the image animator, the image editor, the look editor, the shape editor and the theme editor. Nothing was removed. Every field, button, menu item, shortcut and drag action is still there; the studios only look and sit differently.

-   [What you see](#what-you-see)
-   [The drawer](#the-drawer)
-   [Pin](#pin)
-   [Modified only](#modified-only)
-   [Narrow screens](#narrow-screens)
-   [Keyboard](#keyboard)
-   [Light, dark and fonts](#light-dark-and-fonts)

## What you see

On a screen 1024 px wide or more:

-   A thin top bar with the studio's name and its controls.
-   Hairline rulers along the top and left edges, and a measured grid behind your work. The rulers and grid are decoration. Screen readers skip them.
-   A rounded zoom pill under the stage, where the studio has a zoom. The Studio has no zoom, so its pill is empty and its canvas width switch stays in the top bar.
-   A drawer on the right with the settings of the selection.

## The drawer

The drawer pushes the stage aside, so it never covers your work. Its header names what is selected. Its settings are the ones the studio had before, in the same groups.

## Pin

The pin button in the drawer header keeps the drawer open.

1.  Press the pin button. It stays pressed.
2.  Click or drag on the stage. The drawer stays open.
3.  Press the pin button again. The next click on the stage closes the drawer.

Without the pin, the drawer closes when you work on the stage. The pin is not remembered after you close the studio.

The Studio (the card editor) is the exception. Its inspector has no pin: from 1024 px wide it opens with the Studio, pushes the stage aside and stays open while you work on the stage. Escape and the close button still close it below 1024 px, where it is a sheet.

## Modified only

Switch on Modified only at the top of the drawer to show just the fields that differ from their default. Switch it off to see every field again.

Modified only can show more than you changed, but never less. Fields that have no fixed default, such as entity source, actions, conditions and flows, always show. A value you wrote that equals its default counts as modified, because it is in your YAML. In the theme editor, a variable set in the saved theme counts as modified.

## Narrow screens

Below 1024 px wide, the drawer becomes a full-height sheet with a close button and the name of the selection. It covers the stage while it is open. At 1024 px and wider it never covers the stage.

The Studio's Layers panel and the older breakpoints are unchanged: see [Layout and top bar](layout-and-toolbar.md).

## Keyboard

-   Tab reaches every control, with a focus ring that the drawer or sheet does not hide.
-   Escape closes an unpinned drawer or a sheet. Focus returns to the control that opened it.
-   In the Studio, Ctrl+\ (Cmd+\ on a Mac) shows or hides the side panels as before. See [Hiding the side panels](layout-and-toolbar.md#hiding-the-side-panels).
-   Drawer movement stops when your device asks for reduced motion.

## Light, dark and fonts

The studios follow Home Assistant's light or dark mode. The dark theme is a lifted dark, not an inverted light one. One accent colour marks the selection, focus, the main button and the active tab or switch.

The studios use Space Grotesk and Space Mono. Both ship with Magic Card and load only when a studio opens, from your own Home Assistant. Nothing is requested from Google or another outside site, and if a font fails to load a system font takes over. The font licences are in [THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md).
