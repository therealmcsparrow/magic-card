# Magic Card Utils

Magic Card Utils is a Home Assistant integration. It adds a sidebar panel with the animation studio, the theme editor, a library and the editors for icons and shapes. Magic Card works without it, but the library, the editors and the studio need it.

Install it from the [Magic Card Utils repository](https://github.com/therealmcsparrow/magic-card-utils). It is separate from this card.

## The panel's tabs

The panel has six tabs:

-   **Templates**: saved card templates. See [Templates](../editor/templates.md).
-   **Library**: your saved icons, shapes, animations and theme presets. New icon and New shape open the editors. Edit opens a saved item.
-   **Animations**: your own animations, in the [animation studio](../animation-studio/README.md).
-   **Themes**: the [theme editor](../themes/README.md) and your theme presets.
-   **Icons**: your saved icons, with New icon, Edit, Rename, Delete and Export. New icon opens the [SVG editor](../svg-editor/README.md) without a card.
-   **Shapes**: your saved shapes, for the `ref` key in a card. New shape opens the [shape editor](../shape-editor/README.md) without a card.

The panel also has a Forum shot tab. It turns one of your Magic Cards into a picture to post in a forum, in light, dark or both. Check the picture before you post it. A card can show names, places, camera images and the state of your devices, and everyone who sees your post can see them too. The picture is made in your browser, and Magic Card does not keep a copy. Your cards and settings stay in Home Assistant, but the fonts are fetched from the sites named here. To draw the fonts, your browser asks the font sites shown on the tab for them. Those sites can see your IP address, the time of the request, which fonts you ask for and the ordinary details every browser sends, such as its type and language. Your cards and settings are not sent. Cards are listed in a table you can sort by clicking a header. See [Forum shot](https://github.com/therealmcsparrow/magic-card-utils/blob/main/documentation/panel/forum-shot.md) in the Magic Card Utils repository.

The editors need Magic Card 2026.10.11-beta.1 or newer. When the card is older, the panel says which version you need, and it does not open the editor.

## Library

The Library tab holds the icons and shapes you saved. Choose an item to open it in its editor. Search, rename, delete and export work here too. For a file format and import rules, see [Presets and the library](../presets/README.md) and [Export and import](../presets/export-and-import.md).

Saving or deleting an animation needs an admin user. Any signed-in user can read the animations, so cards play them on every dashboard.

## Use a saved icon in a card

A card uses a saved icon as `icon: mcu:<id>`:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: icon
            icon: mcu:fan-2
            size: 48px
```

The icon effects work on it, such as colours, fill and draw-on. See [Icon effects](../icon-effects/README.md).

## Saved icons in Home Assistant cards

Home Assistant's own cards can show a saved icon too, but they draw one colour only:

-   A saved icon appears as a one-colour silhouette in Home Assistant's own cards, such as the entities card.
-   A dual-tone icon shows its Accent shapes at half opacity in those cards. See [Layers](../svg-editor/layers.md#dual-tone-accent).
-   A new icon appears in Home Assistant's icon picker after you reload the page.

Magic Card's own cards show the full colours.

## Install and update

Magic Card and Magic Card Utils are two separate downloads. Update both. HACS shows the Magic Card logo, from the top of this repository's README, on the card's page.

After an update, hard refresh the browser so the new files load. See [Updating](../../README.md#updating).

If a page still runs the old files, Magic Card shows "Magic Card was updated, reload the page" once, instead of failing. Reload the page. If that does not help, hard refresh the browser.

## Related

-   [Animation studio](../animation-studio/README.md)
-   [Themes](../themes/README.md)
-   [Presets and the library](../presets/README.md)
