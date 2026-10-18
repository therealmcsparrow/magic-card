# Presets and the library

Magic Card Utils keeps your own designs in one library. You can use them on any card, and you can share them as files. This page covers what the library holds and how the card uses it. The file format is on the [export and import](export-and-import.md) page.

The library needs the Magic Card Utils integration. Without it, a card still shows the designs that are saved in its own configuration.

## What the library holds

-   **Animations.** Your own animations, built in the [animation studio](../animation-studio/README.md). They are listed with your icons and shapes, and you can search, rename, delete and export them. A card plays one as `preset: custom:<id>`, and nothing changes for the cards that already use them.
-   **Theme presets.** A theme you saved with Save as my preset in the [theme editor](../themes/README.md). The create dialog shows them under My presets, first. A theme preset is a starting point for a new theme. It is not an installed Home Assistant theme file.
-   **Icons.** Icons saved from the [SVG editor](../svg-editor/README.md). A card uses one as `icon: mcu:<id>`.
-   **Shapes.** Shapes saved from the [shape editor](../shape-editor/README.md). A card uses one with `ref`.

The library shows each kind of item in the Magic Card Utils tabs. The Library tab shows icons and shapes, the Animations tab shows animations, the Themes tab shows theme presets, and the Shapes tab lists shapes. See [Magic Card Utils](../magic-card-utils/README.md).

## Keep a copy in the card

A card can keep its own copy of a library item, so that it still works without Magic Card Utils.

-   **Animations.** When you pick a library animation for a card, the card copies it into its `custom_animations`. The copy is removed when no animation uses it.
-   **Icons and shapes.** Keep a copy in this card is a switch on the save screen and on the card. The copy is on by default for a small item. The size is shown next to the switch.
-   **Theme presets.** A card keeps no copy of a theme preset. The theme editor uses a preset only to start a new theme.

## Without Magic Card Utils

A card that uses an animation, icon or shape from the library still works when the integration is missing, if the card keeps a copy. Without a copy, the card shows the item as missing, and the editor says why.

To move a design from one Home Assistant to another, export it to a file and import the file. See [Export and import](export-and-import.md).
