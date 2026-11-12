# The studio look

All seven studios share one layout: the Studio, the animation studio, the image animator, the image editor, the look editor, the shape editor and the theme editor. Nothing was removed. Every field, button, menu item, shortcut and drag action is still there; the studios only look and sit differently.

-   [What you see](#what-you-see)
-   [The drawer](#the-drawer)
-   [No pin, no edge buttons](#no-pin-no-edge-buttons)
-   [Modified only](#modified-only)
-   [Narrow screens](#narrow-screens)
-   [Keyboard](#keyboard)
-   [Light, dark and fonts](#light-dark-and-fonts)

## What you see

On a screen 1024 px wide or more:

-   A thin top bar in the same order in every studio: Close, the studio's name, the name field, the actions, Save, the panel buttons and Help. The theme editor's back button goes to the theme list, and the animation studio's editor goes back to its library.
-   Hairline rulers along the top and left edges, and a measured grid behind your work. The rulers and grid are decoration. Screen readers skip them.
-   A rounded zoom pill under the stage, where the studio has a zoom. The Studio has no zoom, so its pill is empty and its canvas width switch stays in the top bar.
-   A drawer on the right with the settings of the selection.

## The drawer

The drawer is the settings panel on the right. It pushes the stage aside, so it never covers your work. Its header names what is selected. Its settings are the ones the studio had before, in the same groups.

## No pin, no edge buttons

No studio has a pin button or an edge button on its panels. At 1024 px wide and more, every studio opens with its side panels showing: Layers, the list or the outline on the left where the studio has one, and the settings on the right. The panels stay open while you work on the stage. Nothing closes them for you.

Two buttons in the top bar show and hide the panels, as in the Studio: one for Layers (or the list) and one for the settings. Each button carries an icon and a name, and tells screen readers whether its panel is open. A studio with only a settings panel, such as the image animator and the look editors, has just the settings button. Hidden panels are not remembered: the next time you open a studio, both are showing again.

## Modified only

Switch on Modified only at the top of the drawer to show just the fields that differ from their default. Switch it off to see every field again.

Modified only can show more than you changed, but never less. Fields that have no fixed default, such as entity source, actions, conditions and flows, always show. A value you wrote that equals its default counts as modified, because it is in your YAML. In the theme editor, a variable set in the saved theme counts as modified.

## Narrow screens

Below 1024 px wide, the drawer becomes a full-height sheet with a close button and the name of the selection. It covers the stage while it is open. At 1024 px and wider it never covers the stage.

The Studio's Layers panel and the older breakpoints are unchanged: see [Layout and top bar](layout-and-toolbar.md).

## Keyboard

-   Tab reaches every control, with a focus ring that the drawer or sheet does not hide.
-   Escape closes the drawer when it is a sheet, below 1024 px. Beside the stage it stays open. Focus returns to the control that opened it.
-   In every studio, Ctrl+\ (Cmd+\ on a Mac) shows or hides both side panels together. See [Hiding the side panels](layout-and-toolbar.md#hiding-the-side-panels).
-   Drawer movement stops when your device asks for reduced motion.

## Light, dark and fonts

The studios follow Home Assistant's light or dark mode. The dark theme is a lifted dark, not an inverted light one. One accent colour marks the selection, focus, the main button and the active tab or switch.

The studios use Space Grotesk and Space Mono. Both ship with Magic Card and load only when a studio opens, from your own Home Assistant. Nothing is requested from Google or another outside site, and if a font fails to load a system font takes over. The font licences are in [THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md).
